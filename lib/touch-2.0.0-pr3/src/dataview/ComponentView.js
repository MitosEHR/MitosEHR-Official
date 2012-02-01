/**
 * DataView makes it easy to create lots of components dynamically, usually based off a {@link Ext.data.Store Store}.
 * It's great for rendering lots of data from your server backend or any other data source and is what powers
 * components like {@link Ext.List}.
 *
 * Use DataView whenever you want to show sets of the same component many times, for examples in apps like these:
 *
 * * List of messages in an email app
 * * Showing latest news/tweets
 * * Tiled set of albums in an HTML5 music player
 *
 * <h2>Creating a Simple DataView</h2>
 *
 * At its simplest, a DataView is just a Store full of data and a simple template that we use to render each item:
 *
 *     var touchTeam = Ext.create('Ext.DataView', {
 *         store: {
 *             fields: ['name', 'age'],
 *             data: [
 *                 {name: 'Jamie Avins',  age: 100},
 *                 {name: 'Rob Dougan',   age: 21},
 *                 {name: 'Tommy Maintz', age: 24},
 *                 {name: 'Jacky Nguyen', age: 24},
 *                 {name: 'Ed Spencer',   age: 26}
 *             ]
 *         },
 *
 *         itemConfig: {
 *             tpl: '{name} is {age} years old'
 *         }
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
 * <h2>Loading data from a server</h2>
 *
 * We often want to load data from our server or some other web service so that we don't have to hard code it all
 * locally. Let's say we want to load all of the latest tweets about Sencha Touch into a DataView, and for each one
 * render the user's profile picture, user name and tweet message. To do this all we have to do is modify the
 * {@link #store} and {@link #itemConfig} a little:
 *
 *     Ext.create('Ext.DataView', {
 *         fullscreen: true,
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
 *         itemConfig: {
 *             tpl: '<img src="{profile_image_url}" /><h2>{from_user}</h2><p>{text}</p>'
 *         }
 *     });
 *
 * The Store no longer has hard coded data, instead we've provided a {@link Ext.data.proxy.Proxy Proxy}, which fetches
 * the data for us. In this case we used a JSON-P proxy so that we can load from Twitter's JSON-P search API. We also
 * specified the fields present for each tweet, and used Store's {@link Ext.data.Store#autoLoad autoLoad} configuration
 * to load automatically. Finally, we configured a Reader to decode the response from Twitter, telling it to expect
 * JSON and that the tweets can be found in the 'results' part of the JSON response.
 *
 * The last thing we did is update our template to render the image, twitter username and message. All we need to do
 * now is add a little CSS to style the list the way we want it and we end up with this
 *
 * <<<<<<<<<<<<<< SCREENSHOT HERE >>>>>>>>>>>>>
 *
 */
Ext.define('Ext.dataview.ComponentView', {
    extend: 'Ext.dataview.DataView',

    alternateClassName: 'Ext.ComponentView',

    xtype: 'componentview',

    requires: [
        'Ext.dataview.DataItem'
    ],

    /**
     * @event itemtouchstart
     * Fires whenever an item is touched
     * @param {Ext.dataview.ComponentView} this
     * @param {Number} index The index of the item touched
     * @param {Ext.dataview.DataItem} item The item touched
     * @param {Ext.EventObject} e The event object
     */

    /**
     * @event itemtouchend
     * Fires whenever an item is touched
     * @param {Ext.dataview.ComponentView} this
     * @param {Number} index The index of the item touched
     * @param {Ext.dataview.DataItem} item The item touched
     * @param {Ext.EventObject} e The event object
     */

    /**
     * @event itemtap
     * Fires whenever an item is tapped
     * @param {Ext.dataview.ComponentView} this
     * @param {Number} index The index of the item tapped
     * @param {Ext.dataview.DataItem} item The item tapped
     * @param {Ext.EventObject} e The event object
     */

    /**
     * @event itemdoubletap
     * Fires whenever an item is doubletapped
     * @param {Ext.dataview.ComponentView} this
     * @param {Number} index The index of the item doubletapped
     * @param {Ext.dataview.DataItem} item The item doubletapped
     * @param {Ext.EventObject} e The event object
     */

    /**
     * @event itemswipe
     * Fires whenever an item is swiped
     * @param {Ext.dataview.ComponentView} this
     * @param {Number} index The index of the item swiped
     * @param {Ext.dataview.DataItem} item The item swiped
     * @param {Ext.EventObject} e The event object
     */

    config: {
        // @inherit
        defaultType: 'dataitem',

        /**
         * @cfg {Object} itemConfig
         * A configuration object that is passed to every item created by the DataView. Because each item that a
         * DataView renders is a Component, we can pass configuration options to each component to easily customize how
         * each child component behaves.
         * @accessor
         */
        itemConfig: {},

        maxItemCache: 20
    },

    constructor: function() {
        this.itemCache = [];
        this.callParent(arguments);
    },

    //@private
    doInitialize: function() {
        var me = this,
            triggerObj = {
                delegate: '> ' + me.getDefaultType(),
                scope: me
            },
            clearObj = {
                scope: me
            };

        clearObj[me.getTriggerCtEvent()] = 'onContainerTrigger';
        me.element.on(clearObj);

        triggerObj[me.getTriggerEvent()] = 'onItemTrigger';
        me.on(triggerObj);

        me.on({
            delegate: '> ' + me.getDefaultType(),
            scope   : me,

            touchstart: 'onItemTouchStart',
            touchend: 'onItemTouchEnd',
            tap: 'onItemTap',
            touchmove: 'onItemTouchMove',
            doubletap: 'onItemDoubleTap',
            swipe: 'onItemSwipe'
        });
    },

    // apply to the selection model to maintain visual UI cues
    onItemTrigger: function(item, record, e) {
        this.selectWithEvent(record, e);
    },

    // apply to the selection model to maintain visual UI cues
    onContainerTrigger: function() {
        var me = this;
        if (me.getDeselectOnContainerClick() && me.getStore()) {
            me.deselectAll();
        }
    },

    // invoked by the selection model to maintain visual UI cues
    doItemSelect: function(me, record) {
        var item = me.getViewItems()[me.getStore().indexOf(record)];
        item.removeCls(me.getPressedCls());
        item.addCls(me.getSelectedCls());
    },

    doItemDeSelect: function(me, record) {
        var item = me.getViewItems()[me.getStore().indexOf(record)];
        if (item) {
            item.removeCls([me.getPressedCls(), me.getSelectedCls()]);
        }
    },

    doAddPressedCls: function(record) {
        var me = this,
        item = me.getViewItems()[me.getStore().indexOf(record)];
        item.addCls(me.getPressedCls());
    },

    onItemTouchStart: function(item, record, e) {
        var me = this,
            pressedDelay = me.getPressedDelay();
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
        me.fireEvent('itemtouchstart', me, me.getViewItems().indexOf(item), item, e);
    },

    onItemTouchEnd: function(item, record, e) {
        var me = this;
        if (this.hasOwnProperty('pressedTimeout')) {
            clearTimeout(this.pressedTimeout);
            delete this.pressedTimeout;
        }
        if (record) {
            cmp = me.getViewItems()[me.getStore().indexOf(record)];
            cmp.removeCls(me.getPressedCls());
        }
        item.un({
            touchmove: 'onItemTouchMove',
            scope   : me
        });
        me.fireEvent('itemtouchend', me, me.getViewItems().indexOf(item), item, e);
    },

    onItemTouchMove: function(item, record, e) {
        var me = this;
        if (me.hasOwnProperty('pressedTimeout')) {
            clearTimeout(me.pressedTimeout);
            delete me.pressedTimeout;
        }
        if (record) {
            me.getViewItems()[me.getStore().indexOf(record)].removeCls(me.getPressedCls());
        }
    },

    onItemTap: function(item, record, e) {
        var me = this;
        me.fireEvent('itemtap', me, me.getViewItems().indexOf(item), item, e);
    },

    onItemDoubleTap: function(item, record, e) {
        var me = this;
        me.fireEvent('itemdoubletap', me, me.getViewItems().indexOf(item), item, e);
    },

    onItemSwipe: function(item, record, e) {
        var me = this;
        me.fireEvent('itemswipe', me, me.getViewItems().indexOf(item), item, e);
    },

    moveItemsToCache: function(from, to) {
        var me = this,
            maxItemCache = me.getMaxItemCache(),
            items = me.getViewItems(),
            itemCache = me.itemCache,
            cacheLn = itemCache.length,
            i = to - from,
            item;

        for (; i >= 0; i--) {
            item = items[from + i];
            if (cacheLn !== maxItemCache) {
                me.remove(item, false);
                item.removeCls([me.getPressedCls(), me.getSelectedCls()]);
                itemCache.push(item);
                cacheLn++;
            }
            else {
                item.destroy();
            }
        }
    },

    moveItemsFromCache: function(records) {
        var me = this,
            ln = records.length,
            xtype = me.getDefaultType(),
            itemConfig = me.getItemConfig(),
            itemCache = me.itemCache,
            cacheLn = itemCache.length,
            items = [],
            i = 0,
            item, record;

        for (; i < ln; i++) {
            record = records[i];
            if (cacheLn) {
                cacheLn--;
                item = itemCache.pop();
                item.setRecord(record);
                items.push(item);
            }
            else {
                items.push(me.getDataItemConfig(xtype, record, itemConfig));
            }
        }
        return items;
    },

    getViewItems: function() {
        return this.getInnerItems();
    },

    updateListItem: function(record, item) {
        if (item.setRecord) {
            item.setRecord(record);
        }
    },

    doCreateItems: function(records, ln) {
        this.add(this.moveItemsFromCache(records, ln));
    },

    getDataItemConfig: function(xtype, record, itemConfig) {
        return {
            xtype: xtype,
            record: record,
            defaults: itemConfig
        };
    }
});
