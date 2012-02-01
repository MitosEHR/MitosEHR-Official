/**
 * DataView makes it easy to create lots of components dynamically, usually based off a {@link Ext.data.Store Store}.
 * It's great for rendering lots of data from your server backend or any other data source and is what powers
 * components like {@link Ext.List}.
 *
 * Use DataView whenever you want to show sets of the same component many times, for examples in apps like these:
 *
 * - List of messages in an email app
 * - Showing latest news/tweets
 * - Tiled set of albums in an HTML5 music player
 *
 * # Creating a Simple DataView
 *
 * At its simplest, a DataView is just a Store full of data and a simple template that we use to render each item:
 *
 *     @example miniphone preview
 *     var touchTeam = Ext.create('Ext.DataView', {
 *         fullscreen: true,
 *         store: {
 *             fields: ['name', 'age'],
 *             data: [
 *                 {name: 'Jamie',  age: 100},
 *                 {name: 'Rob',   age: 21},
 *                 {name: 'Tommy', age: 24},
 *                 {name: 'Jacky', age: 24},
 *                 {name: 'Ed',   age: 26}
 *             ]
 *         },
 *
 *         itemTpl: '<div>{name} is {age} years old</div>'
 *     });
 *
 * Here we just defined everything inline so it's all local with nothing being loaded from a server. For each of the 5
 * data items defined in our Store, DataView will render a {@link Ext.Component Component} and pass in the name and age
 * data. The component will use the tpl we provided above, rendering the data in the curly bracket placeholders we
 * provided.
 *
 * Because DataView is integrated with Store, any changes to the Store are immediately reflected on the screen. For
 * example, if we add a new record to the Store it will be rendered into our DataView:
 *
 *     touchTeam.getStore().add({
 *         name: 'Abe Elias',
 *         age: 33
 *     });
 *
 * We didn't have to manually update the DataView, it's just automatically updated. The same happens if we modify one
 * of the existing records in the Store:
 *
 *     touchTeam.getStore().getAt(0).set('age', 42);
 *
 * This will get the first record in the Store (Jamie), change the age to 42 and automatically update what's on the
 * screen.
 *
 *     @example miniphone
 *     var touchTeam = Ext.create('Ext.DataView', {
 *         fullscreen: true,
 *         store: {
 *             fields: ['name', 'age'],
 *             data: [
 *                 {name: 'Jamie',  age: 100},
 *                 {name: 'Rob',   age: 21},
 *                 {name: 'Tommy', age: 24},
 *                 {name: 'Jacky', age: 24},
 *                 {name: 'Ed',   age: 26}
 *             ]
 *         },
 *
 *         itemTpl: '<div>{name} is {age} years old</div>'
 *     });
 *
 *     touchTeam.getStore().add({
 *         name: 'Abe Elias',
 *         age: 33
 *     });
 *
 *     touchTeam.getStore.getAt(0).set('age', 42);
 *
 * # Loading data from a server
 *
 * We often want to load data from our server or some other web service so that we don't have to hard code it all
 * locally. Let's say we want to load all of the latest tweets about Sencha Touch into a DataView, and for each one
 * render the user's profile picture, user name and tweet message. To do this all we have to do is modify the
 * {@link #store} and {@link #itemTpl} a little:
 *
 *     @example portrait
 *     Ext.create('Ext.DataView', {
 *         fullscreen: true,
 *         cls: 'twitterView',
 *         store: {
 *             autoLoad: true,
 *             fields: ['from_user', 'text', 'profile_image_url'],
 *
 *             proxy: {
 *                 type: 'jsonp',
 *                 url: 'http://search.twitter.com/search.json?q=Sencha Touch',
 *
 *                 reader: {
 *                     type: 'json',
 *                     root: 'results'
 *                 }
 *             }
 *         },
 *
 *         itemTpl: '<img src="{profile_image_url}" /><h2>{from_user}</h2><p>{text}</p><div style="clear: both"></div>'
 *     });
 *
 * The Store no longer has hard coded data, instead we've provided a {@link Ext.data.proxy.Proxy Proxy}, which fetches
 * the data for us. In this case we used a JSON-P proxy so that we can load from Twitter's JSON-P search API. We also
 * specified the fields present for each tweet, and used Store's {@link Ext.data.Store#autoLoad autoLoad} configuration
 * to load automatically. Finally, we configured a Reader to decode the response from Twitter, telling it to expect
 * JSON and that the tweets can be found in the 'results' part of the JSON response.
 *
 * The last thing we did is update our template to render the image, twitter username and message. All we need to do
 * now is add a little CSS to style the list the way we want it and we end up with a very basic twitter viewer. Click
 * the preview button on the example above to see it in action.
 */
Ext.define('Ext.dataview.DataView', {
    extend: 'Ext.Container',

    alternateClassName: 'Ext.DataView',

    mixins: ['Ext.mixin.Selectable'],

    xtype: 'dataview',

    requires: [
        'Ext.data.StoreManager'
    ],

    /**
     * @event itemtouchstart
     * Fires whenever an item is touched
     * @param {Ext.dataview.DataView} this
     * @param {Number} index The index of the item touched
     * @param {HTMLElement} target The element touched
     * @param {Ext.EventObject} e The event object
     */

    /**
     * @event itemtouchend
     * Fires whenever an item is touched
     * @param {Ext.dataview.DataView} this
     * @param {Number} index The index of the item touched
     * @param {HTMLElement} target The element touched
     * @param {Ext.EventObject} e The event object
     */

    /**
     * @event itemtap
     * Fires whenever an item is tapped
     * @param {Ext.dataview.DataView} this
     * @param {Number} index The index of the item tapped
     * @param {HTMLElement} target The element tapped
     * @param {Ext.EventObject} e The event object
     */

    /**
     * @event itemdoubletap
     * Fires whenever an item is doubletapped
     * @param {Ext.dataview.DataView} this
     * @param {Number} index The index of the item doubletapped
     * @param {HTMLElement} target The element doubletapped
     * @param {Ext.EventObject} e The event object
     */

    /**
     * @event itemswipe
     * Fires whenever an item is swiped
     * @param {Ext.dataview.DataView} this
     * @param {Number} index The index of the item doubletapped
     * @param {HTMLElement} target The element doubletapped
     * @param {Ext.EventObject} e The event object
     */

    /**
     * @event select
     * @preventable doItemSelect
     * Fires whenever an item is selected
     * @param {Ext.dataview.DataView} this
     * @param {Ext.data.Model} record The record assisciated to the item
     */

    /**
     * @event deselect
     * @preventable doItemDeSelect
     * Fires whenever an item is deselected
     * @param {Ext.dataview.DataView} this
     * @param {Ext.data.Model} record The record assisciated to the item
     * @param {Boolean} supressed Flag to supress the event
     */

    /**
     * @event refresh
     * @preventable doRefresh
     * Fires whenever the DataView is refreshed
     * @param {Ext.dataview.DataView} this
     */

    config: {
        /**
         * @cfg {Ext.data.Store/Object} store
         * Can be either a Store instance or a configuration object that will be turned into a Store. The Store is used
         * to populate the set of items that will be rendered in the DataView. See the DataView intro documentation for
         * more information about the relationship between Store and DataView.
         * @accessor
         */
        store: null,

        // @inherit
        baseCls: Ext.baseCSSPrefix + 'dataview',

        /**
         * @cfg {String} emptyText
         * The text to display in the view when there is no data to display
         */
        emptyText: null,

        /**
         * @cfg {Boolean} deferEmptyText True to defer emptyText being applied until the store's first load
         */
        deferEmptyText: true,

        /**
         * @cfg {String/String[]/Ext.XTemplate} itemTpl
         * The tpl to use for each of the items displayed in this DataView.
         */
        itemTpl: '<div>{text}</div>',

        /**
         * @cfg {String} pressedCls
         * The CSS class to apply to an item on the view while it is being pressed.
         * @accessor
         */
        pressedCls : 'x-item-pressed',

        /**
         * @cfg {String} selectedCls
         * The CSS class to apply to an item on the view while it is selected.
         * @accessor
         */
        selectedCls: 'x-item-selected',

        /**
         * @cfg {String} triggerEvent
         * Determines what type of touch event causes an item to be selected.
         * Valid options are 'tap' and 'singletap'.
         * @accessor
         */
        triggerEvent: 'tap',

        /**
         * @cfg {String} triggerCtEvent
         * Determines what type of touch event is recognized as a touch on the container.
         * Valid options are 'tap' and 'singletap'.
         * @accessor
         */
        triggerCtEvent: 'tap',

        /**
         * @cfg {Boolean} deselectOnContainerClick
         * When set to true, tapping on the DataView's background (i.e. not on
         * an item in the DataView) will deselect any currently selected items.
         * @accessor
         */
        deselectOnContainerClick: true,

        // @inherit
        scrollable: true,

        /**
         * @cfg {Number} pressedDelay
         * The amount of delay between the tapstart and the moment we add the pressedCls.
         * Settings this to true defaults to 100ms.
         * @accessor
         */
        pressedDelay: 100,

        /**
         * @cfg {String} loadingText
         * A string to display during data load operations (defaults to 'Loading...').  If specified, this text will be
         * displayed in a loading div and the view's contents will be cleared while loading, otherwise the view's
         * contents will continue to display normally until the new data is loaded and the contents are replaced.
         */
        loadingText: 'Loading...'
    },

    inheritableStatics: {
        /**
         * @private
         * This complex-looking method takes a given Model instance and returns an object containing all data from
         * all of that Model's *loaded* associations. It does this recursively - for example if we have a User which
         * hasMany Orders, and each Order hasMany OrderItems, it will return an object like this:
         *
         *     {
         *         orders: [
         *             {
         *                 id: 123,
         *                 status: 'shipped',
         *                 orderItems: [
         *                     ...
         *                 ]
         *             }
         *         ]
         *     }
         *
         * This makes it easy to iterate over loaded associations in a DataView.
         *
         * @param {Ext.data.Model} record The Model instance
         * @param {Array} ids PRIVATE. The set of Model instance internalIds that have already been loaded
         * @return {Object} The nested data set for the Model's loaded associations
         * @static
         * @inheritable
         */
        prepareAssociatedData: function(record, ids) {
            //we keep track of all of the internalIds of the models that we have loaded so far in here
            ids = ids || [];

            var associations     = record.associations.items,
                associationCount = associations.length,
                associationData  = {},
                i = 0,
                j = 0,
                associatedStore, associatedRecords, associatedRecord,
                associatedRecordCount, association, internalId;

            for (; i < associationCount; i++) {
                association = associations[i];

                //this is the hasMany store filled with the associated data
                associatedStore = record[association.storeName];

                //we will use this to contain each associated record's data
                associationData[association.name] = [];

                //if it's loaded, put it into the association data
                if (associatedStore && associatedStore.data.length > 0) {
                    associatedRecords = associatedStore.data.items;
                    associatedRecordCount = associatedRecords.length;

                    //now we're finally iterating over the records in the association. We do this recursively
                    for (; j < associatedRecordCount; j++) {
                        associatedRecord = associatedRecords[j];
                        internalId = associatedRecord.internalId;

                        //when we load the associations for a specific model instance we add it to the set of loaded ids so that
                        //we don't load it twice. If we don't do this, we can fall into endless recursive loading failures.
                        if (ids.indexOf(internalId) == -1) {
                            ids.push(internalId);

                            associationData[association.name][j] = associatedRecord.data;
                            Ext.apply(associationData[association.name][j], this.prepareAssociatedData(associatedRecord, ids));
                        }
                    }
                }
            }

            return associationData;
        }
    },

    constructor: function() {
        this.mixins.selectable.constructor.apply(this, arguments);
        this.callParent(arguments);
    },

    storeEventHooks: {
        beforeload: 'onBeforeLoad',
        load      : 'refresh',
        sort      : 'refresh',
        filter    : 'refresh',
        add       : 'onStoreAdd',
        remove    : 'onStoreRemove',
        update    : 'onStoreUpdate',
        clear     : 'onStoreClear'
    },

    doInitialize: function() {
        var me = this,
            triggerObj = {
                delegate: '> div',
                scope: me
            },
            clearObj = {
                scope: me
            },
            elementContainerElement;


        me.getViewItems();
        elementContainerElement = me.elementContainer.element;

        clearObj[me.getTriggerCtEvent()] = 'onContainerTrigger';
        me.element.on(clearObj);

        triggerObj[me.getTriggerEvent()] = 'onItemTrigger';
        elementContainerElement.on(triggerObj);

        elementContainerElement.on({
            delegate: '> div',
            scope   : me,

            touchstart: 'onItemTouchStart',
            touchend  : 'onItemTouchEnd',
            tap       : 'onItemTap',
            touchmove : 'onItemTouchMove',
            doubletap : 'onItemDoubleTap',
            swipe     : 'onItemSwipe'
        });
    },

    //@private
    initialize: function() {
        this.callParent();
        this.doInitialize();
    },

    // apply to the selection model to maintain visual UI cues
    onItemTrigger: function(e) {
        var me = this,
            target = e.getTarget(),
            index = me.getViewItems().indexOf(target);
        this.selectWithEvent(this.getStore().getAt(index));
    },

    // apply to the selection model to maintain visual UI cues
    onContainerTrigger: function(e) {
        var me = this;
        if (e.target != me.element.dom) {
            return;
        }
        if (me.getDeselectOnContainerClick() && me.getStore()) {
            me.deselectAll();
        }
    },

    doAddPressedCls: function(record) {
        var me = this,
        item = me.getViewItems()[me.getStore().indexOf(record)];
        Ext.get(item).addCls(me.getPressedCls());
    },

    onItemTouchStart: function(e) {
        var me = this,
            target = e.getTarget(),
            index = me.getViewItems().indexOf(target),
            store = me.getStore(),
            record = store && store.getAt(index),
            pressedDelay = me.getPressedDelay(),
            item = Ext.get(target);

        if (record) {
            if (pressedDelay > 0) {
                me.pressedTimeout = Ext.defer(me.doAddPressedCls, pressedDelay, me, [record]);
            }
            else {
                me.doAddPressedCls(record);
            }
        }

        item.on({
            touchmove: 'onItemTouchMove',
            scope   : me,
            single: true
        });

        me.fireEvent('itemtouchstart', me, index, target, e);
    },

    onItemTouchEnd: function(e) {
        var me = this,
            target = e.getTarget(),
            index = me.getViewItems().indexOf(target),
            store = me.getStore(),
            record = store && store.getAt(index),
            item = Ext.get(target);

        if (this.hasOwnProperty('pressedTimeout')) {
            clearTimeout(this.pressedTimeout);
            delete this.pressedTimeout;
        }

        if (record) {
            Ext.get(target).removeCls(me.getPressedCls());
        }

        item.un({
            touchmove: 'onItemTouchMove',
            scope   : me
        });

        me.fireEvent('itemtouchend', me, index, target, e);
    },

    onItemTouchMove: function(e) {
        var me = this,
            target = e.getTarget(),
            index = me.getViewItems().indexOf(target),
            store = me.getStore(),
            record = store && store.getAt(index),
            item = Ext.get(target);

        if (me.hasOwnProperty('pressedTimeout')) {
            clearTimeout(me.pressedTimeout);
            delete me.pressedTimeout;
        }

        if (record) {
            item.removeCls(me.getPressedCls());
        }
    },

    onItemTap: function(e) {
        var me = this,
            target = e.getTarget(),
            index = me.getViewItems().indexOf(target),
            item = Ext.get(target);

        me.fireEvent('itemtap', me, index, item, e);
    },

    onItemDoubleTap: function(e) {
        var me = this,
            target = e.getTarget(),
            index = me.getViewItems().indexOf(target),
            item = Ext.get(target);

        me.fireEvent('itemdoubletap', me, index, item, e);
    },

    onItemSwipe: function(e) {
        var me = this,
            target = e.getTarget(),
            index = me.getViewItems().indexOf(target),
            item = Ext.get(target);

        me.fireEvent('itemswipe', me, index, item, e);
    },

    // invoked by the selection model to maintain visual UI cues
    onItemSelect: function(record, suppressEvent) {
        var me = this;
        if (suppressEvent) {
            me.doItemSelect(me, record);
        } else {
            me.fireAction('select', [me, record], 'doItemSelect');
        }
    },

    // invoked by the selection model to maintain visual UI cues
    doItemSelect: function(me, record) {
        var item = Ext.get(me.getViewItems()[me.getStore().indexOf(record)]);
        item.removeCls(me.getPressedCls());
        item.addCls(me.getSelectedCls());
    },

    // invoked by the selection model to maintain visual UI cues
    onItemDeselect: function(record, suppressEvent) {
        var me = this;
        if (suppressEvent) {
            me.doItemDeSelect(me, record);
        }
        else {
            me.fireAction('deselect', [me, record, suppressEvent], 'doItemDeselect');
        }
    },

    doItemDeselect: function(me, record) {
        var item = Ext.get(me.getViewItems()[me.getStore().indexOf(record)]);
        if (item) {
            item.removeCls([me.getPressedCls(), me.getSelectedCls()]);
        }
    },

    updateData: function(data) {
        var store = this.getStore();
        if (!store) {
            this.setStore(Ext.create('Ext.data.ArrayStore', {
                fields: data
            }));
        } else {
            store.add(data);
        }
    },

    applyStore: function(store) {
        var me = this,
            bindEvents = Ext.apply({}, me.storeEventHooks, { scope: me });

        if (store) {
            store = Ext.data.StoreManager.lookup(store);
            if (store && Ext.isObject(store) && store.isStore) {
                store.on(bindEvents);
            }
        }

        return store;
    },

    updateStore: function(newStore, oldStore) {
        var me = this,
            bindEvents = Ext.apply({}, me.storeEventHooks, { scope: me });

        if (oldStore && Ext.isObject(oldStore) && oldStore.isStore) {
            if (oldStore.autoDestroy) {
                oldStore.destroy();
            }
            else {
                oldStore.un(bindEvents);
            }
        }

        if (newStore) {
            me.refresh();
        }
    },

    onBeforeLoad: function() {
        var loadingText = this.getLoadingText();
        if (loadingText) {
            this.setMask({
                xtype: 'loadmask',
                message: loadingText
            });
        }
    },

    updateEmptyText: function() {
        this.refresh();
    },

    /**
     * Refreshes the view by reloading the data from the store and re-rendering the template.
     */
    refresh: function() {
        var me = this;

        //remove any masks on the store
        this.setMask(false);

        if (!me.getStore()) {
            if (!this.getDeferEmptyText()) {
                this.doEmptyText();
            }
            return;
        }

        me.fireAction('refresh', [me], 'doRefresh');
    },

    applyItemTpl: function(config) {
        return (Ext.isObject(config) && config.isTemplate) ? config : new Ext.XTemplate(config);
    },

    onAfterRender: function() {
        var me = this;
        me.callParent(arguments);
        me.updateStore(me.getStore());
    },

    updateListItem: function(record, item) {
        var data = record.getData();

        if (record) {
            // TODO: Move this into nestedStore...
            Ext.apply(data, this.self.prepareAssociatedData(record));
        }

        item.innerHTML = this.getItemTpl().apply(data);
    },

    addListItem: function(index, record) {
        var data = record.getData();

        if (record) {
            // TODO: Move this into nestedStore...
            Ext.apply(data, this.self.prepareAssociatedData(record));
        }
        var element = this.elementContainer.element,
            childNodes = element.dom.childNodes,
            ln = childNodes.length,
            wrapElement;

        wrapElement = Ext.Element.create(this.getItemElementConfig(index, data));

        if (!ln || index == ln) {
            wrapElement.appendTo(element);
        } else {
            wrapElement.insertBefore(childNodes[index]);
        }
    },

    getItemElementConfig: function(index, data) {
        return {
            cls: this.getBaseCls() + '-item',
            html: this.getItemTpl().apply(data)
        };
    },

    // Remove
    moveItemsToCache: function(from, to) {
        var me = this,
            items = me.getViewItems(),
            i = to - from,
            item;

        for (; i >= 0; i--) {
            item = items[from + i];
            item.parentNode.removeChild(item);
        }
        if (me.getViewItems().length == 0) {
            this.doEmptyText();
        }
    },

    doEmptyText: function() {
        var emptyText = this.getEmptyText();
        if (emptyText) {
            this.elementContainer.setHtml('');
            this.elementContainer.setHtml(emptyText);
        }
    },

    // Add
    moveItemsFromCache: function(records, index) {
        var me = this,
            ln = records.length,
            i = 0,
            record;

        if (me.getEmptyText() && me.getViewItems().length == 0) {
            this.elementContainer.setHtml('');
        }

        for (; i < ln; i++) {
            record = records[i];
            me.addListItem(index + i, record);
        }
    },

    getViewItems: function() {
        if (!this.elementContainer) {
            this.elementContainer = this.add(new Ext.Component());
        }

        // Transform ChildNodes into a proper Array so we can do indexOf...
        return Array.prototype.slice.call(this.elementContainer.element.dom.childNodes);
    },

    doRefresh: function(me) {
        var store = me.getStore(),
            records = store.getRange(),
            items = me.getViewItems(),
            recordsLn = records.length,
            itemsLn = items.length,
            deltaLn = recordsLn - itemsLn,
            scrollable = me.getScrollable(),
            i, item;

        if (scrollable) {
            scrollable.getScroller().scrollTo(0, 0);
        }

        // No items, hide all the items from the collection.
        if (recordsLn < 1) {
            me.onStoreClear();
            return;
        }

        // Too many items, hide the unused ones
        if (deltaLn < 0) {
            this.moveItemsToCache(itemsLn + deltaLn, itemsLn - 1);
            // Items can changed, we need to refresh our references
            items = me.getViewItems();
            itemsLn = items.length;
        }
        // Not enough items, create new ones
        else if (deltaLn > 0) {
            this.doCreateItems(store.getRange(itemsLn), itemsLn);
        }

        // Update Data and insert the new html for existing items
        for (i = 0; i < itemsLn; i++) {
            item = items[i];
            me.updateListItem(records[i], item);
        }
    },

    doCreateItems: function(records, ln) {
        this.moveItemsFromCache(records, ln);
    },

    onStoreClear: function() {
        var me = this,
            items = me.getViewItems();

        this.moveItemsToCache(0, items.length - 1);
        this.doEmptyText();
    },

    // private
    onStoreAdd: function(store, records, index) {
        if (records) {
            this.doCreateItems(records, index);
        }
    },

    // private
    onStoreRemove: function(store, record, index) {
        this.moveItemsToCache(index, index);
    },

    // private
    onStoreUpdate: function(store, record) {
        // Bypassing setter because sometimes we pass the same record (different data)
        this.updateListItem(record, this.getViewItems()[store.indexOf(record)]);
    }
}, function() {
    //<deprecated product=touch since=2.0>

    /**
     * Binds a new {@link Ext.data.Store Store} to this DataView.
     * @deprecated 2.0 please use {@link #setStore} instead
     * @method bindStore
     */
    Ext.deprecateClassMethod(this, 'bindStore', this.prototype.setStore, "'bindStore()' is deprecated, please use 'setStore' instead");
    //</deprecated>
});
