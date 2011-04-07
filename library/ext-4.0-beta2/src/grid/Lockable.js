/**
 * @class Ext.grid.Lockable
 */
Ext.define('Ext.grid.Lockable', {
    // all lockable stuff to go in separate subclass.
    
    /**
     * @cfg {Boolean} syncRowHeight Synchronize rowHeight between the normal and locked grid view. This is turned on by default. If your grid is guaranteed to have rows of all the same height, you should set this to false to optimize performance.
     */
    syncRowHeight: true,
    spacerHidden: true,
    
    unlockText: 'Unlock',
    lockText: 'Lock',
    
    injectLockable: function() {
        this.lockable = true;
        this.hasView = true;
        this.hideHeaders = true;
        var me = this,
            selModel = me.getSelectionModel(),
            lockedGrid = {
                xtype: 'gridpanel',
                scroll: false,
                scrollerOwner: false,
                invalidateScrollerOnRefresh: me.invalidateScrollerOnRefresh,
                selModel: selModel
            },
            normalGrid = {
                xtype: 'gridpanel',
                scrollerOwner: false,
                verticalScrollerDock: me.verticalScrollerDock,
                verticalScrollerType: me.verticalScrollerType,
                invalidateScrollerOnRefresh: me.invalidateScrollerOnRefresh,
                selModel: selModel
            },
            lockedWidth = 0,
            lockedHeaders = [],
            normalHeaders = [],
            headers = me.columns,
            ln = headers.length,
            i = 0,
            lockedHeaderCt,
            normalHeaderCt;
            
        me.lockedHeights = [];
        me.normalHeights = [];
        
        delete me.verticalScrollDock;
        delete me.verticalScrollerType;
        
        // split apart normal and lockedWidths
        for (; i < ln; i++) {
            headers[i].processed = true;
            if (headers[i].locked) {
                lockedWidth += headers[i].width;
                lockedHeaders.push(headers[i]);
            } else {
                normalHeaders.push(headers[i]);
            }
        }

        lockedGrid.width = lockedWidth;
        lockedGrid.columns = lockedHeaders;
        normalGrid.columns = normalHeaders;
        
        me.store = Ext.StoreMgr.lookup(me.store);
        lockedGrid.store = me.store;
        normalGrid.store = me.store;
        normalGrid.flex = 1;
        
        if (me.syncRowHeight) {
            lockedGrid.viewConfig = {
                listeners: {
                    refresh: me.onLockedGridAfterRefresh,
                    itemupdate: me.onLockedGridAfterUpdate,
                    scope: me
                }
            };
            
            normalGrid.viewConfig = {
                listeners: {
                    refresh: me.onNormalGridAfterRefresh,
                    itemupdate: me.onNormalGridAfterUpdate,
                    scope: me
                }
            };
        }
        
        
        
        me.normalGrid = Ext.ComponentMgr.create(normalGrid);
        me.lockedGrid = Ext.ComponentMgr.create(lockedGrid);
        lockedHeaderCt = me.lockedGrid.headerCt;
        normalHeaderCt = me.normalGrid.headerCt;
        lockedHeaderCt.on({
            headershow: me.onLockedHeaderShow,
            headerhide: me.onLockedHeaderHide,
            headermove: me.onLockedHeaderMove,
            sortchange: me.onLockedHeaderSortChange,
            headerresize: me.onLockedHeaderResize,
            scope: me
        });
        
        normalHeaderCt.on({
            headermove: me.onNormalHeaderMove,
            sortchange: me.onNormalHeaderSortChange,
            scope: me
        });
        
        me.normalGrid.on({
            scrollershow: me.onScrollerShow,
            scrollerhide: me.onScrollerHide,
            scope: me
        });
        
        me.lockedGrid.on('afterlayout', me.onLockedGridAfterLayout, me, {single: true});
        
        me.modifyHeaderCt();
        me.items = [me.lockedGrid, me.normalGrid];

        me.layout = {
            type: 'hbox',
            align: 'stretch'
        };
    },
    
    // create a new spacer after the table is refreshed
    onLockedGridAfterLayout: function() {
        var me = this;
        me.lockedGrid.getView().on('refresh', me.createSpacer, me);
    },
    
    // trigger a pseudo refresh on the normal side
    onLockedHeaderMove: function() {
        if (this.syncRowHeight) {
            this.onNormalGridAfterRefresh();
        }
    },
    
    // trigger a pseudo refresh on the locked side
    onNormalHeaderMove: function() {
        if (this.syncRowHeight) {
            this.onLockedGridAfterRefresh();
        }
    },
    
    // create a spacer in lockedsection and store a reference
    // TODO: Should destroy before refreshing content
    createSpacer: function() {
        var me   = this,
            w    = Ext.getScrollBarWidth() - 2,
            view = me.lockedGrid.getView(),
            el   = view.el;

        me.spacerEl = Ext.core.DomHelper.append(el, {
            cls: me.spacerHidden ? (Ext.baseCSSPrefix + 'hidden') : '',
            style: 'height: ' + w + 'px;'
        }, true);
    },
    
    // cache the heights of all locked rows and sync rowheights
    onLockedGridAfterRefresh: function() {
        var me     = this,
            view   = me.lockedGrid.getView(),
            el     = view.el,
            rowEls = el.query(view.getItemSelector()),
            ln     = rowEls.length,
            i = 0;
            
        // reset heights each time.
        me.lockedHeights = [];
        
        for (; i < ln; i++) {
            me.lockedHeights[i] = rowEls[i].clientHeight;
        }
        me.syncRowHeights();
    },
    
    // cache the heights of all normal rows and sync rowheights
    onNormalGridAfterRefresh: function() {
        var me     = this,
            view   = me.normalGrid.getView(),
            el     = view.el,
            rowEls = el.query(view.getItemSelector()),
            ln     = rowEls.length,
            i = 0;
            
        // reset heights each time.
        me.normalHeights = [];
        
        for (; i < ln; i++) {
            me.normalHeights[i] = rowEls[i].clientHeight;
        }
        me.syncRowHeights();
    },
    
    // rows can get bigger/smaller
    onLockedGridAfterUpdate: function(record, index, node) {
        this.lockedHeights[index] = node.clientHeight;
        this.syncRowHeights();
    },
    
    // rows can get bigger/smaller
    onNormalGridAfterUpdate: function(record, index, node) {
        this.normalHeights[index] = node.clientHeight;
        this.syncRowHeights();
    },
    
    syncRowHeights: function() {
        var me = this,
            lockedHeights = me.lockedHeights,
            normalHeights = me.normalHeights,
            calcHeights   = [],
            ln = lockedHeights.length,
            i  = 0,
            lockedView, normalView,
            lockedRowEls, normalRowEls;

        // ensure there are an equal num of locked and normal
        // rows before synchronization
        if (lockedHeights.length && normalHeights.length) {
            lockedView = me.lockedGrid.getView();
            normalView = me.normalGrid.getView();
            lockedRowEls = lockedView.el.query(lockedView.getItemSelector());
            normalRowEls = normalView.el.query(normalView.getItemSelector());

            // loop thru all of the heights and sync to the other side
            for (; i < ln; i++) {
                // ensure both are numbers
                if (!isNaN(lockedHeights[i]) && !isNaN(normalHeights[i])) {
                    if (lockedHeights[i] > normalHeights[i]) {
                        Ext.fly(normalRowEls[i]).setHeight(lockedHeights[i]);
                    } else if (lockedHeights[i] < normalHeights[i]) {
                        Ext.fly(lockedRowEls[i]).setHeight(normalHeights[i]);
                    }
                }
            }

            // invalidate the scroller and sync the scrollers
            me.normalGrid.invalidateScroller();
            me.normalGrid.setScrollTop(normalView.el.dom.scrollTop);
            
            // reset the heights
            me.lockedHeights = [];
            me.normalHeights = [];
        }
    },
    
    // track when scroller is shown
    onScrollerShow: function(scroller, direction) {
        if (direction === 'horizontal') {
            this.spacerHidden = false;
            this.spacerEl.removeCls(Ext.baseCSSPrefix + 'hidden');
        }
    },
    
    // track when scroller is hidden
    onScrollerHide: function(scroller, direction) {
        if (direction === 'horizontal') {
            this.spacerHidden = true;
            this.spacerEl.addCls(Ext.baseCSSPrefix + 'hidden');
        }
    },

    
    // inject Lock and Unlock text
    modifyHeaderCt: function() {
        var me = this;
        me.lockedGrid.headerCt.getMenuItems = me.getMenuItems(true);
        me.normalGrid.headerCt.getMenuItems = me.getMenuItems(false);
    },
    
    
    getMenuItems: function(locked) {
        var me = this,
            unlockText = me.unlockText,
            lockText = me.lockText,
            unlockHandler = Ext.Function.bind(me.unlock, me),
            lockHandler = Ext.Function.bind(me.lock, me);
        
        // runs in the scope of headerCt
        // TODO: Missing iconCls
        return function() {
            var o = Ext.grid.HeaderContainer.prototype.getMenuItems.call(this);
            o.push('-',{
                disabled: !locked,
                text: unlockText,
                handler: unlockHandler
            });
            o.push({
                disabled: locked,
                text: lockText,
                handler: lockHandler
            });
            return o;
        };
    },
    
    // going from unlocked section to locked
    lock: function() {
        var me = this,
            normalGrid = me.normalGrid,
            lockedGrid = me.lockedGrid,
            normalHCt  = normalGrid.headerCt,
            lockedHCt  = lockedGrid.headerCt,
            activeHd   = normalHCt.getMenu().activeHeader;
            
        if (activeHd.flex) {
            activeHd.width = activeHd.getWidth();
            delete activeHd.flex;
        }
        
        normalHCt.remove(activeHd, false);
        lockedHCt.add(activeHd);
        me.syncLockedSection();
    },
    
    syncLockedSection: function() {
        var me = this;
        me.syncLockedWidth();
        me.lockedGrid.getView().refresh();
        me.normalGrid.getView().refresh();
    },
    
    // adjust the locked section to the width of its respective
    // headerCt
    syncLockedWidth: function() {
        var me = this,
            width = me.lockedGrid.headerCt.getFullWidth(true);
        me.lockedGrid.setWidth(width);
    },
    
    onLockedHeaderResize: function() {
        this.syncLockedWidth();
    },
    
    onLockedHeaderHide: function() {
        this.syncLockedWidth();
    },
    
    onLockedHeaderShow: function() {
        this.syncLockedWidth();
    },
    
    onLockedHeaderSortChange: function(headerCt, header, sortState) {
        if (sortState) {
            // no real header, and silence the event so we dont get into an
            // infinite loop
            this.normalGrid.headerCt.clearOtherSortStates(null, true);
        }
    },
    
    onNormalHeaderSortChange: function(headerCt, header, sortState) {
        if (sortState) {
            // no real header, and silence the event so we dont get into an
            // infinite loop
            this.lockedGrid.headerCt.clearOtherSortStates(null, true);
        }
    },
    
    // going from locked section to unlocked
    unlock: function() {
        var me = this,
            normalGrid = me.normalGrid,
            lockedGrid = me.lockedGrid,
            normalHCt  = normalGrid.headerCt,
            lockedHCt  = lockedGrid.headerCt,
            activeHd   = lockedHCt.getMenu().activeHeader;
            
        lockedHCt.remove(activeHd, false);
        normalHCt.insert(0, activeHd);
        me.syncLockedSection();
    }
});
