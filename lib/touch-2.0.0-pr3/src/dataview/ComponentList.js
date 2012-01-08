/**
 * @private - To be made a sample
 */
Ext.define('Ext.dataview.ComponentList', {
    alternateClassName: 'Ext.ComponentList',
    extend: 'Ext.dataview.ComponentView',
    xtype : 'componentlist',

    requires: [
        'Ext.dataview.ListItem',
        'Ext.dataview.IndexBar'
    ],

    /**
     * @event disclose
     * @preventable doDisclose
     * Fires whenever a disclosure is handled
     * @param {Ext.data.Model} record The record assosciated with the DataItem
     * @param {Ext.dataview.ListItem} listItem The list item this belongs to
     * @param {Number} index The index of the listItem in the list
     * @param {Ext.EventObject} e The event object
     */

    config: {
        /**
         * @cfg {Boolean/Object} indexBar
         * True to render an alphabet IndexBar docked on the right.
         * This can also be a config object that will be passed to {@link Ext.IndexBar}
         * (defaults to false)
         * @accessor
         */
        indexBar: false,

        disclosure: null,
        icon: null,

        /**
         * @cfg {Boolean} clearSelectionOnDeactivate
         * True to clear any selections on the list when the list is deactivated (defaults to true).
         * @accessor
         */
        clearSelectionOnDeactivate: true,

        /**
         * @cfg {Boolean} preventSelectionOnDisclose True to prevent the item selection when the user
         * taps a disclose icon. Defaults to <tt>true</tt>
         * @accessor
         */
        preventSelectionOnDisclose: true,

        // @inherit
        baseCls: Ext.baseCSSPrefix + 'list',

        /**
         * @cfg {Boolean} pinHeaders
         * Whether or not to pin headers on top of item groups while scrolling for an iPhone native list experience.
         * Defaults to <tt>false</tt> on Android and Blackberry (for performance reasons)
         * Defaults to <tt>true</tt> on other devices.
         * @accessor
         */
        pinHeaders: true,

        // @inherit
        defaultType: 'listitem',

        grouped: false,

        innerWidth: 'block',

        itemTpl: null,

        /**
         * @cfg {Boolean/Function/Object} onItemDisclosure
         * True to display a disclosure icon on each list item.
         * This won't bind a listener to the tap event. The list
         * will still fire the disclose event though.
         * By setting this config to a function, it will automatically
         * add a tap event listeners to the disclosure buttons which
         * will fire your function.
         * Finally you can specify an object with a 'scope' and 'handler'
         * property defined. This will also be bound to the tap event listener
         * and is useful when you want to change the scope of the handler.
         * @accessor
         */
        onItemDisclosure: null
    },

    constructor: function() {
        this.previousHeaderIndices = [];
        this.callParent(arguments);
    },

    initialize: function() {
        var me = this;
        me.callParent(arguments);
        me.on({
            delegate: '> ' + me.getDefaultType() + ' > listdisclosure',
            tap: 'handleItemDisclosure',
            scope: me
        });
    },

    applyIndexBar: function(indexBar) {
        if (this.getGrouped()) {
            return Ext.factory(indexBar, Ext.dataview.IndexBar, this.getIndexBar());
        }
    },

    updateIndexBar: function(indexBar) {
        if (indexBar && this.getScrollable()) {
            this.getScrollableBehavior().getScrollView().getElement().insertFirst(indexBar.renderElement);

            indexBar.on({
                index: 'onIndex',
                scope: this
            });
        }
    },

    updatePinHeaders: function(pinnedHeaders) {
        var scrollable = this.getScrollable(),
            store = this.getStore(),
            scrollView = this.getScrollableBehavior().getScrollView(),
            scrollViewElement = scrollView.getElement(),
            header, scroller;

        if (scrollable && this.getGrouped()) {
            scroller = scrollable.getScroller();
            if (pinnedHeaders) {
                scroller.on({
                    refresh: 'doRefreshHeaders',
                    scroll: 'onScroll',
                    scope: this
                });

                store.on({
                    datachanged: 'doRefreshHeaders',
                    scope: this
                });

                this.header = header = Ext.create('Ext.dataview.ListItemHeader', {html: ' ', cls: 'x-list-header-swap'});
                scrollViewElement.dom.insertBefore(header.element.dom, scroller.getContainer().dom.nextSibling);
            } else {
                scroller.un({
                    refresh: 'onScrollerRefresh',
                    scroll: 'onScroll',
                    scope: this
                });

                store.un({
                    datachanged: 'doRefreshHeaders',
                    scope: this
                });

                if (this.header) {
                    this.header.destroy();
                }
            }
        }
    },

    // @private
    getClosestGroups : function() {
        var groups = this.pinHeaderInfo.offsets,
            pos = this.getScrollable().getScroller().position,
            ln = groups.length,
            group, i,
            current, next;

        for (i = 0; i < ln; i++) {
            group = groups[i];
            if (group.offset > pos.y) {
                next = group;
                break;
            }
            current = group;
        }

        return {
            current: current,
            next: next
        };
    },

    doRefreshHeaders: function() {
        var headerIndicis = this.previousHeaderIndices,
            ln = headerIndicis.length,
            items = this.getViewItems(),
            headerInfo = this.pinHeaderInfo = {offsets: []},
            headerOffsets = headerInfo.offsets,
            i, headerItem, header;

        if (ln) {
            for (i = 0; i < ln; i++) {
                headerItem = items[headerIndicis[i].index];
                header = this.getItemHeader(headerItem);

                headerOffsets.push({
                    header: header,
                    offset: headerItem.element.dom.offsetTop
                });

                header.element.setVisibilityMode(Ext.Element.VISIBILITY);
            }

            headerInfo.headerHeight = header.element.getHeight();
            headerInfo.closest = this.getClosestGroups();
            this.setActiveGroup(headerInfo.closest.current);
        }
    },

    getItemHeader: function(item) {
        return item.getHeader();
    },

    onScroll: function(scroller, x, y) {
        var me = this,
            headerInfo = me.pinHeaderInfo,
            closest = headerInfo.closest,
            activeGroup = me.activeGroup,
            headerHeight = headerInfo.headerHeight,
            next = closest.next,
            current = closest.current,
            header = this.header;

        if (y <= 0) {
            if (activeGroup) {
                me.setActiveGroup(false);
                closest.next = current;
            }
            return;
        }
        else if (
            (next && y > next.offset) ||
            (y < current.offset)
        ) {
            closest = headerInfo.closest = this.getClosestGroups();
            next = closest.next;
            current = closest.current;
            this.setActiveGroup(current);
        }

        if (next && y > 0 && next.offset - y <= headerHeight) {
            var transform = headerHeight - (next.offset - y)
            // @TODO: use top/left on Android
            header.element.dom.style.webkitTransform = 'translate3d(0px, -' + transform + 'px, 0px)';
            this.transformed = true;
        }
        else if (this.transformed) {
            header.element.dom.style.webkitTransform = null;
            this.transformed = false;
        }
    },

    /**
     * Set the current active group
     * @param {Object} group The group to set active
     * @private
     */
    setActiveGroup : function(group) {
        var me = this;
        if (group) {
            if (!me.activeGroup || me.activeGroup.header != group.header) {
                me.header.setHtml(group.header.getHtml());
                me.header.show();
            }
        } else {
            me.header.hide();
        }

        this.activeGroup = group;
    },

    onIndex: function(index) {
        var key = index.toLowerCase(),
            store = this.getStore(),
            groups = store.getGroups(),
            ln = groups.length,
            group, i, closest, id, item;

        for (i = 0; i < ln; i++) {
            group = groups[i];
            id = group.name.toLowerCase();
            if (id == key || id > key) {
                closest = group;
                break;
            }
            else {
                closest = group;
            }
        }

        item = this.getViewItems()[store.indexOf(closest.children[0])];
        this.getScrollable().getScroller().scrollTo(0, item.element.dom.offsetTop);
    },

    applyOnItemDisclosure: function(config) {
        if (Ext.isFunction(config)) {
            return {
                scope: this,
                handler: config
            };
        }
        if (Ext.isObject(config)) {
            return config;
        }
        return null;
    },

    getDisclosure: function() {
        var value = this._disclosure,
            onItemDisclosure = this.getOnItemDisclosure();

        if (onItemDisclosure && onItemDisclosure != value) {
            value = true;
            this.setDisclosure(value);
        }

        return value;
    },

    updateOnItemDisclosure: function(newOnItemDisclosure) {
        // If we have an onItemDisclosure configuration, force disclose config to true
        if (newOnItemDisclosure) {
            this.setDisclosure(true);
        }
    },

    handleItemDisclosure: function(disclosure, e) {
        var me = this,
            listItem = disclosure.ownerCt,
            index = me.getViewItems().indexOf(listItem),
            record = me.getStore().getAt(index);

        if (me.getPreventSelectionOnDisclose()) {
            e.stopEvent();
        }
        me.fireAction('disclose', [record, listItem, index, e], 'doDisclose');
    },

    doDisclose: function(record, listItem, index, e) {
        var me = this,
            onItemDisclosure = me.getOnItemDisclosure();

        if (onItemDisclosure && onItemDisclosure.handler) {
            onItemDisclosure.handler.call(me, record, listItem, index);
        }
    },

    updateItemTpl: function(newTpl) {
        this.getItemConfig().tpl = newTpl;
    },

    getItemConfig: function() {
        var me = this,
            config, tpl;
        if (!me._isItemConfigInitialized) {
            this_isItemConfigInitialized = true;
            me.setItemConfig(me.config.itemConfig);
        }
        config = me._itemConfig;
        tpl = me.getItemTpl();
        if (tpl) {
            config.tpl = tpl;
        }
        return config;
    },

    getDataItemConfig: function(xtype, record, itemConfig) {
        return {
            xtype: xtype,
            record: record,
            defaults: itemConfig,
            disclosure: this.getDisclosure(),
            icon: this.getIcon()
        };
    },

    findGroupHeaderIndices: function() {
        if (!this.getGrouped()) {
            return;
        }
        var me = this,
            store = me.getStore(),
            groups = store.getGroups(),
            groupLn = groups.length,
            items = me.getViewItems(),
            i = 0,
            previousHeaderIndices = me.previousHeaderIndices,
            previousIndexLn = previousHeaderIndices.length,
            newHeaderIndices = [],
            firstGroupedRecord, index, oldItemWithHeader;

        // Add header to an item if needed
        for (; i < groupLn; i++) {
            firstGroupedRecord = groups[i].children[0];
            index = store.indexOf(firstGroupedRecord);
            if (previousHeaderIndices.indexOf(firstGroupedRecord) == -1) {
                me.doAddHeader(items[index], store.getGroupString(firstGroupedRecord));
            }
            newHeaderIndices.push(firstGroupedRecord);
        }

        // Remove header from an item if needed
        for (i = 0; i < previousIndexLn; i++) {
            oldItemWithHeader = previousHeaderIndices[i];
            if (newHeaderIndices.indexOf(oldItemWithHeader) == -1) {
                oldItemWithHeader = items[store.indexOf(oldItemWithHeader)];
                if (oldItemWithHeader) {
                    me.doRemoveHeader(oldItemWithHeader);
                }
            }
        }

        me.previousHeaderIndices = newHeaderIndices;
    },

    doAddHeader: function(item, html) {
        item.setHeader({
            html: html
        });
    },

    doRemoveHeader: function(item) {
        item.setHeader(null);
    },

    doRefresh: function() {
        this.callParent(arguments);
        this.findGroupHeaderIndices();
    },

    onStoreAdd: function() {
        this.callParent(arguments);
        this.findGroupHeaderIndices();
    },
    onStoreRemove: function() {
        this.callParent(arguments);
        this.findGroupHeaderIndices();
    },
    onStoreUpdate: function() {
        this.callParent(arguments);
        this.findGroupHeaderIndices();
    }
});
