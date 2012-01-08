(function() {

/**
 * @class Ext.mixin.Observable
 * @alternateClassName Ext.util.Observable
 * @extend Ext.mixin.Mixin
 * @mixins Ext.mixin.Identifiable
 *
 * Mixin that provides a common interface for publishing events.
 */
var Observable = Ext.define('Ext.mixin.Observable', {

    requires: ['Ext.event.Dispatcher'],

    extend: 'Ext.mixin.Mixin',

    mixins: ['Ext.mixin.Identifiable'],

    mixinConfig: {
        id: 'observable',
        beforeHooks: {
            constructor: 'constructor'
        },
        hooks: {
            destroy: 'destroy'
        }
    },

    alternateClassName: 'Ext.util.Observable',

    statics: {
        releaseCapture: function(o) {
            console.log('TODO: static releaseCapture');
        },

        capture: function(o, fn, scope) {
            console.log('TODO: static capture');
        },

        observe: function(cls, listeners) {
            console.log('TODO: static observe');
        }
    },

    // @private
    isObservable: true,

    observableType: 'observable',

    validIdRegex: /^([\w\-]+)$/,

    observableIdPrefix: '#',

    ADD_LISTENER_ACTION: 'doAddListener',

    REMOVE_LISTENER_ACTION: 'doRemoveListener',

    listenerOptionsRegex: /^(?:delegate|single|delay|buffer|args|prepend)$/,

    config: {
        /**
         * @cfg {Object} listeners
         *
         * A config object containing one or more event handlers to be added to this object during initialization. This
         * should be a valid listeners config object as specified in the {@link #addListener} example for attaching multiple
         * handlers at once.
         */
        listeners: null,

        /**
         * @cfg {String/String[]} bubbleEvents The event name to bubble, or an Array of event names.
         */
        bubbleEvents: null
    },

    constructor: function(config) {
        if (Ext.isObject(config)) {
            if ('listeners' in config) {
                this.setListeners(config.listeners);
                delete config.listeners;
            }

            if ('bubbleEvents' in config) {
                this.setBubbleEvents(config.bubbleEvents);
                delete config.bubbleEvents;
            }
        }

        return this;
    },

    applyListeners: function(listeners) {
        if (listeners) {
            this.addListener(listeners);
        }
    },

    applyBubbleEvents: function(bubbleEvents) {
        if (bubbleEvents) {
            this.enableBubble(bubbleEvents);
        }
    },

    getOptimizedObservableId: function() {
        return this.observableId;
    },

    getObservableId: function() {
        if (!this.observableId) {
            var id = this.getUniqueId();

            //<debug error>
            if (!id.match(this.validIdRegex)) {
                Ext.Logger.error("Invalid unique id of '" + id + "' for this object", this);
            }
            //</debug>

            this.observableId = this.observableIdPrefix + id;

            this.getObservableId = this.getOptimizedObservableId;
        }

        return this.observableId;
    },

    getOptimizedEventDispatcher: function() {
        return this.eventDispatcher;
    },

    getEventDispatcher: function() {
        if (!this.eventDispatcher) {
            this.eventDispatcher = Ext.event.Dispatcher.getInstance();

            this.getEventDispatcher = this.getOptimizedEventDispatcher;
        }

        return this.eventDispatcher;
    },

    getManagedListeners: function(object, eventName) {
        var id = object.getUniqueId(),
            managedListeners = this.managedListeners;

        if (!managedListeners) {
            this.managedListeners = managedListeners = {};
        }

        if (!managedListeners[id]) {
            managedListeners[id] = {};
            object.doAddListener('destroy', 'clearManagedListeners', this, {
                single: true,
                args: [object]
            });
        }

        if (!managedListeners[id][eventName]) {
            managedListeners[id][eventName] = [];
        }

        return managedListeners[id][eventName];
    },

    getUsedSelectors: function() {
        var selectors = this.usedSelectors;

        if (!selectors) {
            selectors = this.usedSelectors = [];
            selectors.$map = {};
        }

        return selectors;
    },

    /**
     * Fires the specified event with the passed parameters (minus the event name, plus the `options` object passed
     * to {@link #addListener}).
     *
     * An event may be set to bubble up an Observable parent hierarchy by calling {@link #enableBubble}.
     *
     * @param {String} eventName The name of the event to fire.
     * @param {Object...} args Variable number of parameters are passed to handlers.
     * @return {Boolean} returns false if any of the handlers return false otherwise it returns true.
     */
    fireEvent: function(eventName) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.doFireEvent(eventName, args);
    },

    /**
     * Fires the specified event with the passed parameters and execute a function (action)
     * at the end if there are no listeners that return false.
     *
     * @param {String} eventName The name of the event to fire.
     * @param {Array} args Arguments to pass to handers
     * @param {Function} fn Action
     * @param {Object} scope scope of fn
     */
    fireAction: function(eventName, args, fn, scope, options, order) {
        var actions = [];

        if (args === undefined) {
            args = [];
        }

        if (fn !== undefined) {
            actions.push({
                fn: fn,
                scope: scope || this,
                options: options,
                order: order
            });
        }

        return this.doFireEvent(eventName, args, actions);
    },

    doFireEvent: function(eventName, args, actions, connectedController) {
        if (this.eventFiringSuspended) {
            return;
        }

        var id = this.getObservableId(),
            dispatcher = this.getEventDispatcher();

        return dispatcher.dispatchEvent(this.observableType, id, eventName, args, actions, connectedController);
    },

    /**
     * @private
     * @param name
     * @param fn
     * @param scope
     * @param options
     */
    doAddListener: function(name, fn, scope, options, order) {
        if (typeof fn !== 'string' && typeof fn !== 'function') {
             scope = fn.scope || scope;

             if (fn.before) {
                 this.doAddListener(name, fn.before, scope, options, 'before');
             }

             if (fn.after) {
                 this.doAddListener(name, fn.after, scope, options, 'current');
             }

             return;
        }

        var isManaged = (scope && scope !== this && scope.isIdentifiable),
            dispatcher = this.getEventDispatcher(),
            usedSelectors = this.getUsedSelectors(),
            usedSelectorsMap = usedSelectors.$map,
            selector = this.getObservableId(),
            isAdded, managedListeners, delegate;

        if (!options) {
            options = {};
        }

        if (!scope) {
            scope = this;
        }

        if (options.delegate) {
            delegate = options.delegate;
            // TODO: Compress the selector here
            selector += ' ' + delegate;
        }

        if (!(selector in usedSelectorsMap)) {
            usedSelectorsMap[selector] = true;
            usedSelectors.push(selector);
        }

        isAdded = dispatcher.addListener(this.observableType, selector, name, fn, scope, options, order);

        if (isAdded && isManaged) {
            managedListeners = this.getManagedListeners(scope, name);
            managedListeners.push({
                delegate: delegate,
                scope: scope,
                fn: fn,
                order: order
            });
        }

        return isAdded;
    },

    doRemoveListener: function(name, fn, scope, options, order) {
        if (typeof fn !== 'string' && typeof fn !== 'function') {
             scope = fn.scope || scope;

             if (fn.before) {
                 this.doRemoveListener(name, fn.before, scope, options, 'before');
             }

             if (fn.after) {
                 this.doRemoveListener(name, fn.after, scope, options, 'current');
             }

             return;
        }

        var isManaged = (scope && scope !== this && scope.isIdentifiable),
            selector = this.getObservableId(),
            isRemoved,
            managedListeners, i, ln, listener, delegate;

        if (options && options.delegate) {
            delegate = options.delegate;
            // TODO: Compress the selector here
            selector += ' ' + delegate;
        }

        if (!scope) {
            scope = this;
        }

        isRemoved = this.getEventDispatcher().removeListener(this.observableType, selector, name, fn, scope, order);

        if (isRemoved && isManaged) {
            managedListeners = this.getManagedListeners(scope, name);

            for (i = 0,ln = managedListeners.length; i < ln; i++) {
                listener = managedListeners[i];

                if (listener.fn === fn && listener.scope === scope && listener.delegate === delegate && listener.order === order) {
                    managedListeners.splice(i, 1);
                    break;
                }
            }
        }

        return isRemoved;
    },

    clearManagedListeners: function(object) {
        var managedListeners = this.managedListeners,
            id, namedListeners, listeners, eventName, i, ln, listener, options;

        if (!managedListeners) {
            return this;
        }

        if (object) {
            if (typeof object != 'string') {
                id = object.getUniqueId();
            }
            else {
                id = object;
            }

            namedListeners = managedListeners[id];

            for (eventName in namedListeners) {
                if (namedListeners.hasOwnProperty(eventName)) {
                    listeners = namedListeners[eventName];

                    for (i = 0,ln = listeners.length; i < ln; i++) {
                        listener = listeners[i];

                        options = {};

                        if (listener.delegate) {
                            options.delegate = listener.delegate;
                        }

                        if (this.doRemoveListener(eventName, listener.fn, listener.scope, options, listener.order)) {
                            i--;
                            ln--;
                        }
                    }
                }
            }

            delete managedListeners[id];
            return this;
        }

        for (id in managedListeners) {
            if (managedListeners.hasOwnProperty(id)) {
                this.clearManagedListeners(id);
            }
        }
    },

    /**
     * @private
     * @param operation
     * @param eventName
     * @param fn
     * @param scope
     * @param options
     * @param order
     */
    changeListener: function(action, eventName, fn, scope, options, order) {
        var eventNames,
            listeners,
            listenerOptionsRegex,
            actualOptions,
            name, value, i, ln, listener;

        if (typeof fn != 'undefined') {
            // Support for array format to add multiple listeners
            if (typeof eventName != 'string') {
                for (i = 0,ln = eventName.length; i < ln; i++) {
                    name = eventName[i];

                    this[action](name, fn, scope, options, order);
                }

                return this;
            }

            this[action](eventName, fn, scope, options, order);
        }
        else if (Ext.isArray(eventName)) {
            listeners = eventName;

            for (i = 0,ln = listeners.length; i < ln; i++) {
                listener = listeners[i];

                this[action](listener.event, listener.fn, listener.scope, listener, listener.order);
            }
        }
        else {
            listenerOptionsRegex = this.listenerOptionsRegex;
            options = eventName;
            eventNames = [];
            listeners = [];
            actualOptions = {};

            for (name in options) {
                if (options.hasOwnProperty(name)) {
                    value = options[name];

                    if (name === 'scope') {
                        scope = value;
                        continue;
                    }
                    else if (name === 'order') {
                        order = value;
                        continue;
                    }

                    if (!listenerOptionsRegex.test(name)) {
                        eventNames.push(name);
                        listeners.push(value);
                    }
                    else {
                        actualOptions[name] = value;
                    }
                }
            }

            for (i = 0,ln = eventNames.length; i < ln; i++) {
                this[action](eventNames[i], listeners[i], scope, actualOptions, order);
            }
        }

    },

    /**
     * Appends an event handler to this object.
     *
     * @param {String} eventName The name of the event to listen for. May also be an object who's property names are
     * event names.
     * @param {Function} fn The method the event invokes.  Will be called with arguments given to
     * {@link #fireEvent} plus the `options` parameter described below.
     * @param {Object} [scope] The scope (`this` reference) in which the handler function is executed. **If
     * omitted, defaults to the object which fired the event.**
     * @param {Object} [options] An object containing handler configuration.
     *
     * This object may contain any of the following properties:
     *
     * - **scope** : Object
     *
     *   The scope (`this` reference) in which the handler function is executed. **If omitted, defaults to the object
     *   which fired the event.**
     *
     * - **delay** : Number
     *
     *   The number of milliseconds to delay the invocation of the handler after the event fires.
     *
     * - **single** : Boolean
     *
     *   True to add a handler to handle just the next firing of the event, and then remove itself.
     *
     * - **buffer** : Number
     *
     *   Causes the handler to be scheduled to run in an {@link Ext.util.DelayedTask} delayed by the specified number of
     *   milliseconds. If the event fires again within that time, the original handler is _not_ invoked, but the new
     *   handler is scheduled in its place.
     *
     * - **delegate** : String
     *
     *   Uses {@link Ext.ComponentQuery} to delegate events to a specified query selector within this item.
     *
     *       // Create a container with a two children; a button and a toolbar
     *       var container = Ext.create('Ext.Container', {
     *           items: [
     *               {
     *                  xtype: 'toolbar',
     *                  dock: 'top',
     *                  title: 'My Toolbar'
     *               },
     *               {
     *                  xtype: 'button',
     *                  text: 'My Button'
     *               }
     *           ]
     *       });
     *
     *       container.on({
     *           // Ext.Buttons have an xtype of 'button', so we use that are a selector for our delegate
     *           delegate: 'button',
     *
     *           tap: function() {
     *               alert('Button tapped!');
     *           }
     *       });
     *
     * **Combining Options**
     *
     * Using the options argument, it is possible to combine different types of listeners:
     *
     * A delayed, one-time listener.
     *
     *     container.on('tap', this.handleTap, this, {
     *         single: true,
     *         delay: 100
     *     });
     *
     * **Attaching multiple handlers in 1 call**
     *
     * The method also allows for a single argument to be passed which is a config object containing properties which
     * specify multiple events. For example:
     *
     *     container.on({
     *         tap  : this.onTap,
     *         swipe: this.onSwipe,
     *
     *         scope: this // Important. Ensure "this" is correct during handler execution
     *     });
     *
     * One can also specify options for each event handler separately:
     *
     *     container.on({
     *         tap  : { fn: this.onTap, scope: this, single: true },
     *         swipe: { fn: button.onSwipe, scope: button }
     *     });
     *
     */
    addListener: function(eventName, fn, scope, options, order) {
        return this.changeListener(this.ADD_LISTENER_ACTION, eventName, fn, scope, options, order);
    },

    addBeforeListener: function(eventName, fn, scope, options) {
        return this.addListener(eventName, fn, scope, options, 'before');
    },

    addAfterListener: function(eventName, fn, scope, options) {
        return this.addListener(eventName, fn, scope, options, 'after');
    },

    /**
     * Removes an event handler.
     *
     * @param {String} eventName The type of event the handler was associated with.
     * @param {Function} fn The handler to remove. **This must be a reference to the function passed into the
     * {@link #addListener} call.**
     * @param {Object} scope (optional) The scope originally specified for the handler. It must be the same as the
     * scope argument specified in the original call to {@link #addListener} or the listener will not be removed.
     */
    removeListener: function(eventName, fn, scope, options, order) {
        return this.changeListener(this.REMOVE_LISTENER_ACTION, eventName, fn, scope, options, order);
    },

    removeBeforeListener: function(eventName, fn, scope, options) {
        return this.removeListener(eventName, fn, scope, options, 'before');
    },

    removeAfterListener: function(eventName, fn, scope, options) {
        return this.removeListener(eventName, fn, scope, options, 'after');
    },

    /**
     * Removes all listeners for this object.
     */
    clearListeners: function() {
        var usedSelectors = this.getUsedSelectors(),
            dispatcher = this.getEventDispatcher(),
            i, ln, selector;

        for (i = 0,ln = usedSelectors.length; i < ln; i++) {
            selector = usedSelectors[i];

            dispatcher.clearListeners(this.observableType, selector);
        }
    },

    /**
     * Checks to see if this object has any listeners for a specified event
     *
     * @param {String} eventName The name of the event to check for
     * @return {Boolean} True if the event is being listened for, else false
     */
    hasListener: function(eventName) {
        return this.getEventDispatcher().hasListener(this.observableType, this.getObservableId(), eventName);
    },

    /**
     * Suspends the firing of all events. (see {@link #resumeEvents})
     *
     * @param {Boolean} queueSuspended Pass as true to queue up suspended events to be fired
     * after the {@link #resumeEvents} call instead of discarding all suspended events.
     */
    suspendEvents: function(queueSuspended) {
        this.eventFiringSuspended = true;
    },

    /**
     * Resumes firing events (see {@link #suspendEvents}).
     *
     * If events were suspended using the `queueSuspended` parameter, then all events fired
     * during event suspension will be sent to any listeners now.
     */
    resumeEvents: function() {
        this.eventFiringSuspended = false;
    },

    /**
     * Relays selected events from the specified Observable as if the events were fired by <code><b>this</b></code>.
     * @param {Object} object The Observable whose events this object is to relay.
     * @param {String/Array/Object} events Array of event names to relay.
     */
    relayEvents: function(object, events, prefix) {
        var i, ln, oldName, newName;

        if (typeof prefix == 'undefined') {
            prefix = '';
        }

        if (typeof events == 'string') {
            events = [events];
        }

        if (Ext.isArray(events)) {
            for (i = 0,ln = events.length; i < ln; i++) {
                oldName = events[i];
                newName = prefix + oldName;

                object.addListener(oldName, this.createEventRelayer(newName), this);
            }
        }
        else {
            for (oldName in events) {
                if (events.hasOwnProperty(oldName)) {
                    newName = prefix + events[oldName];

                    object.addListener(oldName, this.createEventRelayer(newName), this);
                }
            }
        }

        return this;
    },

    /**
     * @private
     * Creates an event handling function which refires the event from this object as the passed event name.
     * @param newName
     * @returns {Function}
     */
    createEventRelayer: function(newName){
        return function() {
            return this.doFireEvent(newName, Array.prototype.slice.call(arguments, 0, -2));
        }
    },

    /**
     * Enables events fired by this Observable to bubble up an owner hierarchy by calling `this.getBubbleTarget()` if
     * present. There is no implementation in the Observable base class.
     *
     * @param {String/String[]} events The event name to bubble, or an Array of event names.
     */
    enableBubble: function(events) {
        var isBubblingEnabled = this.isBubblingEnabled,
            i, ln, name;

        if (!isBubblingEnabled) {
            isBubblingEnabled = this.isBubblingEnabled = {};
        }

        if (typeof events == 'string') {
            events = Ext.Array.clone(arguments);
        }

        for (i = 0,ln = events.length; i < ln; i++) {
            name = events[i];

            if (!isBubblingEnabled[name]) {
                isBubblingEnabled[name] = true;
                this.addListener(name, this.createEventBubbler(name), this);
            }
        }
    },

    createEventBubbler: function(name) {
        return function doBubbleEvent() {
            var bubbleTarget = ('getBubbleTarget' in this) ? this.getBubbleTarget() : null;

            if (bubbleTarget && bubbleTarget !== this && bubbleTarget.isObservable) {
                bubbleTarget.fireAction(name, Array.prototype.slice.call(arguments, 0, -2), doBubbleEvent, bubbleTarget, null, 'after');
            }
        }
    },

    getBubbleTarget: function() {
        return false;
    },

    destroy: function() {
        if (this.observableId) {
            this.fireEvent('destroy');
            this.clearListeners();
            this.clearManagedListeners();
        }
    },

    addEvents: Ext.emptyFn

}, function() {
    this.createAlias({
        on: 'addListener',
        un: 'removeListener',
        onBefore: 'addBeforeListener',
        onAfter: 'addAfterListener',
        unBefore: 'addBeforeListener',
        unAfter: 'addAfterListener'
    });

    //<deprecated product=touch since=2.0>
    Ext.deprecateClassMethod(this, 'addEvents', function(){}, "addEvents() is deprecated. It's no longer needed to add events before firing");

    Ext.deprecateClassMethod(this, 'addManagedListener', function(object, eventName, fn, scope, options) {
        return object.addListener(eventName, fn, scope, options);
    }, "addManagedListener() / mon() is deprecated, simply use addListener() / on(). All listeners are now automatically managed where necessary.");

    Ext.deprecateClassMethod(this, 'removeManagedListener', function(object, eventName, fn, scope) {
        return object.removeListener(eventName, fn, scope);
    }, "removeManagedListener() / mun() is deprecated, simply use removeListener() / un(). All listeners are now automatically managed where necessary.");

    this.createAlias({
        mon: 'addManagedListener',
        mun: 'removeManagedListener'
    });
    //</deprecated>
});

})();
