Ext.define('Ext.event.publisher.ComponentPaint', {

    extend: 'Ext.event.publisher.Publisher',

    targetType: 'component',

    handledEvents: ['painted', 'erased'],

    idSelectorRegex: /^#([\w\-]+)$/i,

    eventNames: {
        painted: 'painted',
        erased: 'erased'
    },

    constructor: function() {
        this.callParent(arguments);

        this.subscribers = {};
    },

    getSubscribers: function(eventName, createIfNotExist) {
        var subscribers = this.subscribers;

        if (!subscribers.hasOwnProperty(eventName)) {
            if (!createIfNotExist) {
                return null;
            }

            subscribers[eventName] = {
                $length: 0
            };
        }

        return subscribers[eventName];
    },

    setDispatcher: function(dispatcher) {
        var targetType = this.targetType;

        dispatcher.doAddListener(targetType, '*', 'renderedchange', 'onComponentRenderedChange', this);
        dispatcher.doAddListener(targetType, '*', 'hiddenchange', 'onComponentHiddenChange', this);

        return this.callParent(arguments);
    },

    subscribe: function(target, eventName) {
        var match = target.match(this.idSelectorRegex),
            subscribers;

        if (!match) {
            return false;
        }

        subscribers = this.getSubscribers(eventName, true);
        subscribers[match[1]] = true;
        subscribers.$length++;

        return true;
    },

    unsubscribe: function(target, eventName) {
        var match = target.match(this.idSelectorRegex),
            subscribers;

        if (!match || !(subscribers = this.getSubscribers(eventName))) {
            return false;
        }

        delete subscribers[match[1]];
        subscribers.$length--;

        return true;
    },

    onComponentRenderedChange: function(component, rendered) {
        var eventNames = this.eventNames,
            eventName = rendered ? eventNames.painted : eventNames.erased,
            subscribers = this.getSubscribers(eventName);

        if (subscribers && subscribers.$length > 0) {
            this.publish(subscribers, component, eventName);
        }
    },

    onComponentHiddenChange: function(component, hidden) {
        var eventNames = this.eventNames,
            eventName = hidden ? eventNames.erased : eventNames.painted,
            subscribers = this.getSubscribers(eventName);

        if (subscribers && subscribers.$length > 0) {
            this.publish(subscribers, component, eventName);
        }
    },

    publish: function(subscribers, component, eventName) {
        var id = component.getId(),
            needsDispatching = false,
            eventNames, items, i, ln, isPainted;

        if (subscribers[id]) {
            eventNames = this.eventNames;

            isPainted = component.isPainted();

            if ((eventName === eventNames.painted && isPainted) || eventName === eventNames.erased && !isPainted) {
                needsDispatching = true;
            }
            else {
                return this;
            }
        }

        if (component.isContainer) {
            items = component.getItems().items;

            for (i = 0,ln = items.length; i < ln; i++) {
                this.publish(subscribers, items[i], eventName);
            }
        }
        else if (component.isDecorator) {
            this.publish(subscribers, component.getComponent(), eventName);
        }

        if (needsDispatching) {
            this.dispatcher.doDispatchEvent(this.targetType, '#' + id, eventName, [component]);
        }
    }
});
