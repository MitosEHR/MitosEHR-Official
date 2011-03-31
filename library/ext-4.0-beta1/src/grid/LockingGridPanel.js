/**
 * @class Ext.grid.LockingGridPanel
 * @extends Ext.grid.GridPanel
 */
Ext.define('Ext.grid.LockingGridPanel', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.lockinggridpanel'],
    defaultType: 'gridpanel',
    
    
    selType: 'rowmodel',
    scrollerOwner: true,
    spacerHidden: true,
    
    /**
     * @cfg {Boolean} columnLines Adds column line styling
     */
    
    initComponent: function() {
        var me = this,
            lockedWidth = 0,
            lockedHeaders = [],
            normalHeaders = [],
            lockedGrid = {},
            normalGrid = {},
            headers = me.headers,
            ln = headers.length,
            i = 0,
            lockedHeaderCt,
            normalHeaderCt;
        
        
        for (; i < ln; i++) {
            if (headers[i].locked) {
                lockedWidth += headers[i].width;
                lockedHeaders.push(headers[i]);
            } else {
                normalHeaders.push(headers[i]);
            }
        }
        var sm = this.getSelectionModel();
        lockedGrid.xtype = 'gridpanel';
        normalGrid.xtype = 'gridpanel';
        lockedGrid.selModel = sm;
        normalGrid.selModel = sm;
        lockedGrid.scroll = false;
        lockedGrid.width = lockedWidth;
        lockedGrid.scrollerOwner = false;
        normalGrid.scrollerOwner = false;
        lockedGrid.headers = lockedHeaders;
        normalGrid.headers = normalHeaders;
        lockedGrid.store = me.store;
        normalGrid.store = me.store;
        normalGrid.flex = 1;
        
        lockedGrid.viewConfig = {
            listeners: {
                refresh: me.onLockedGridAfterRefresh,
                scope: me
            }
        };
        
        
        //Ext.apply(lockedGrid, me.initialConfig);
        //Ext.apply(normalGrid, me.initialConfig);
        
        me.normalGrid = Ext.ComponentMgr.create(normalGrid);
        me.lockedGrid = Ext.ComponentMgr.create(lockedGrid);
        lockedHeaderCt = me.lockedGrid.headerCt;
        normalHeaderCt = me.normalGrid.headerCt;
        lockedHeaderCt.on('headershow', me.onLockedHeaderShow, me);
        lockedHeaderCt.on('headerhide', me.onLockedHeaderHide, me);
        lockedHeaderCt.on('headerresize', me.onLockedHeaderResize, me);
        
        lockedHeaderCt.on('sortchange', me.onLockedHeaderSortChange, me);
        normalHeaderCt.on('sortchange', me.onNormalHeaderSortChange, me);
        
        me.normalGrid.on('scrollershow', me.onScrollerShow, me);
        me.normalGrid.on('scrollerhide', me.onScrollerHide, me);
        me.modifyHeaderCt();
        me.items = [me.lockedGrid, me.normalGrid];
        
        
        me.layout = {
            type: 'hbox',
            align: 'stretch'
        };
        me.callParent(arguments);
    },
    onLockedGridAfterRefresh: function() {
        var me = this,
            w  = Ext.getScrollBarWidth() - 2,
            el = me.lockedGrid.getView().el;
            
        me.spacerEl = Ext.core.DomHelper.append(el, {
            cls: me.spacerHidden ? (Ext.baseCSSPrefix + 'hidden') : '',
            style: 'height: ' + w + 'px;'
        }, true);
    },
    onScrollerShow: function(scroller, direction) {
        if (direction === 'horizontal') {
            this.spacerHidden = false;
            this.spacerEl.removeCls(Ext.baseCSSPrefix + 'hidden');
        }
    },
    
    onScrollerHide: function(scroller, direction) {
        if (direction === 'horizontal') {
            this.spacerHidden = true;
            this.spacerEl.addCls(Ext.baseCSSPrefix + 'hidden');
        }
    },
    /**
     * Returns the selection model being used and creates it via the configuration
     * if it has not been created already.
     * @return {Ext.selection.Model} selModel
     */
    getSelectionModel: function(){
        if (!this.selModel) {
            this.selModel = {};
        }

        var mode = 'SINGLE';
        if (this.simpleSelect) {
            mode = 'SIMPLE';
        } else if (this.multiSelect) {
            mode = 'MULTI';
        }
        
        Ext.applyIf(this.selModel, {
            allowDeselect: this.allowDeselect,
            mode: mode
        });        
        
        if (!this.selModel.events) {
            this.selModel = Ext.create('selection.' + this.selType, this.selModel);
        }
        
        if (!this.selModel.hasRelaySetup) {
            this.relayEvents(this.selModel, ['selectionchange', 'select', 'deselect']);
            this.selModel.hasRelaySetup = true;
        }

        // lock the selection model if user
        // has disabled selection
        if (this.disableSelection) {
            this.selModel.locked = true;
        }
        
        return this.selModel;
    },
    modifyHeaderCt: function() {
        var me = this;
        me.lockedGrid.headerCt.getMenuItems = me.getMenuItems(true);
        me.normalGrid.headerCt.getMenuItems = me.getMenuItems(false);
    },
    
    // runs in the scope of headerCt
    getMenuItems: function(locked) {
        var unlockText = 'Unlock',
            lockText = 'Lock',
            unlockHandler = Ext.Function.bind(this.unlock, this),
            lockHandler = Ext.Function.bind(this.lock, this);
        
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
    
    purgeCache: function(grid) {
        // Delete column cache - column order has changed.
        delete grid.gridDataColumns;

        // Menu changes when columns are moved. It will be recreated.
        if (grid.headerCt.menu) {
            grid.headerCt.menu.destroy();
            delete grid.headerCt.menu;
        }
    },
    
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
