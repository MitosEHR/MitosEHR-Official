/**
 * @class Ext.panel.TablePanel
 * @extends Ext.panel.Panel
 * @xtype tablepanel
 * @markdown
 * @private

TablePanel is a private class and the basis of both TreePanel and GridPanel.

TablePanel aggregates:
- a Seleciton Model
- a View
- a Store
- Scrollers
- Ext.grid.HeaderContainer

 */
Ext.define('Ext.panel.TablePanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.tablepanel',
    
    requires: ['Ext.grid.HeaderContainer'],
    
    cls: Ext.baseCSSPrefix + 'grid-section',
    extraBodyCls: Ext.baseCSSPrefix + 'grid-body',
    layout: 'fit',
    /**
     * Boolean to indicate that a view has been injected into the panel.
     * @property hasView
     */
    hasView: false,
    
    // each panel should dictate what viewType and selType to use
    viewType: null,
    selType: 'rowselectionmodel',
    
    /**
     * @cfg {Number} scrollDelta
     * Number of pixels to scroll when scrolling with mousewheel.
     * Defaults to 40.
     */
    scrollDelta: 40,
    
    /**
     * @cfg {String/Boolean} scroll
     * Valid values are 'both', 'horizontal' or 'vertical'. true implies 'both'. false implies 'none'.
     * Defaults to true.
     */
    scroll: true,
    
    /**
     * @cfg {Boolean} hideHeaders
     * Configure to true to hide the headers.
     */
    
    /**
     * @cfg {Boolean} sortableHeaders
     * Defaults to true. Set to false to disable header sorting via clicking the
     * header and via the Sorting menu items.
     */
    sortableHeaders: true,
    
    verticalScrollDock: 'right',
    
    
    horizontalScrollerPresentCls: Ext.baseCSSPrefix + 'horizontal-scroller-present',
    verticalScrollerPresentCls: Ext.baseCSSPrefix + 'vertical-scroller-present',
    
    initComponent: function() {
        if (!this.viewType) {
            throw "No Viewtype defined.";
        }
        if (!this.store) {
            throw "No Store defined";
        }
        if (this.preventHeaders) {
            console.warn("Ext.panel.TablePanel: preventHeaders configuration has been renamed to hideHeaders.");
            this.hideHeaders = this.preventHeaders;
        }
        
        var me         = this,
            scroll     = me.scroll,
            vertical   = false,
            horizontal = false;
        me.bodyCls = me.bodyCls || '';
        me.bodyCls += (' ' + me.extraBodyCls);
        
        // autoScroll is not a valid configuration
        delete me.autoScroll;
        /**
         * @property headerCt -> colModel?
         */
        var headerCtCfg = {
            items: me.headers,
            sortable: me.sortableHeaders
        };
        if (me.hideHeaders) {
            headerCtCfg.height = 0;
        }
        me.headerCt = new Ext.grid.HeaderContainer(headerCtCfg);
        me.headerCt.on('headerresize', me.onHeaderResize, me);
        
        me.features = me.features || [];
        me.dockedItems = me.dockedItems || [];
        me.dockedItems.unshift(me.headerCt);
        
        me.viewConfig = me.viewConfig || {};
        
        // turn both on.
        if (scroll === true || scroll === 'both') {
            vertical = horizontal = true;
        } else if (scroll === 'horizontal') {
            horizontal = true;
        } else if (scroll === 'vertical') {
            vertical = true;
        }
        // All other values become 'none' or false.
        
        
        if (vertical) {
            me.verticalScroller = Ext.ComponentMgr.create({
                dock: me.verticalScrollDock,
                xtype: 'gridscroller'
            });
        }
        
        if (horizontal) {
            me.horizontalScroller = Ext.ComponentMgr.create({
                xtype: 'gridscroller',
                section: me,
                dock: 'bottom'
            });
        }
        
        me.getViewStore().on('load', this.onStoreLoad, this);
        
        me.callParent();
    },
    
    /**
     * Get the store to be used for the view. For many implementations
     * this will always be the store, for some implementations that have
     * multiple views it could return something different.
     */
    getViewStore: function() {
        return this.store;
    },
    
    afterLayout: function() {
        var me = this,
            sm, store;
        me.callParent();
        if (!me.hasView) {
            me.hasView = true;
            sm = me.getSelectionModel();
            store = me.getViewStore();
            store.on('datachanged', this.onStoreDataChanged, this, {buffer: 50});
            Ext.applyIf(me.viewConfig, {
                xtype: me.viewType,
                store: store,
                headerCt: me.headerCt,
                selModel: me.getSelectionModel(),
                features: me.features,
                // direct reference injected here instead of
                // using ownerCt because tree recursively renders
                // TODO: Remove after refactor
                panel: me,
                listeners: {
                    bodyscroll: me.onViewScroll,
                    scope: me
                }
            });
            me.view = me.add(me.viewConfig);
            sm.view = me.view;
            me.headerCt.view = me.view;
            Ext.Function.defer(me.determineScrollbars, 50, me);
            Ext.getBody().on('mousewheel', me.onMouseWheel, me);
        }
    },

    
    /**
     * Request a recalculation of scrollbars and put them in if they are needed.
     */
    determineScrollbars: function() {
        var me = this;
        
        if (!me.dtScrollTask) {
            me.dtScrollTask = new Ext.util.DelayedTask(me.doDetermineScrollbars, me);
        }
        me.dtScrollTask.delay(30);
    },
    
    doDetermineScrollbars: function() {
        var me = this,
            viewElDom,
            centerScrollWidth,
            centerClientWidth,
            scrollHeight,
            clientHeight;
            
        if (me.view) {
            viewElDom = me.view.el.dom;
            centerScrollWidth = viewElDom.scrollWidth;
            /**
             * clientWidth often returns 0 in IE resulting in an
             * infinity result, here we use offsetWidth bc there are
             * no possible scrollbars and we dont care about margins
             */
            centerClientWidth = viewElDom.offsetWidth;
            scrollHeight = viewElDom.scrollHeight;
            clientHeight = viewElDom.clientHeight;

            if (scrollHeight > clientHeight) {
                me.showVerticalScroller();
            } else {
                me.hideVerticalScroller();
            }
            
    
            if (centerScrollWidth > (centerClientWidth + Ext.getScrollBarWidth() - 2)) {
                me.showHorizontalScroller();
            } else {
                me.hideHorizontalScroller();
            }
        }
    },
    
    
    onHeaderResize: function() {
        if (this.view) {
            this.determineScrollbars();
            this.invalidateScroller();
        }
    },
    
    /**
     * Hide the verticalScroller and remove the horizontalScrollerPresentCls.
     */
    hideHorizontalScroller: function() {
        var me = this;
        
        if (me.horizontalScroller.ownerCt === me) {
            me.verticalScroller.offsets.bottom = 0;
            me.removeDocked(me.horizontalScroller, false);
            me.removeCls(me.horizontalScrollerPresentCls);
        }
        
    },
    
    /**
     * Show the horizontalScroller and add the horizontalScrollerPresentCls.
     */
    showHorizontalScroller: function() {
        var me = this;
        
        me.verticalScroller.offsets.bottom = Ext.getScrollBarWidth() - 2;
        if (me.horizontalScroller.ownerCt !== me) {
            me.addDocked(me.horizontalScroller);
            me.addCls(me.horizontalScrollerPresentCls);
        }
        
    },
    
    /**
     * Hide the verticalScroller and remove the verticalScrollerPresentCls.
     */
    hideVerticalScroller: function() {
        var me = this;
        
        if (me.verticalScroller.ownerCt === me) {
            me.removeDocked(me.verticalScroller, false);
            me.removeCls(me.verticalScrollerPresentCls);
        }
    },
    
    /**
     * Show the verticalScroller and add the verticalScrollerPresentCls.
     */
    showVerticalScroller: function() {
        var me = this;
        
        if (me.verticalScroller.ownerCt !== me) {
            me.addDocked(me.verticalScroller);
            me.addCls(me.verticalScrollerPresentCls);
        }
    },
    
    /**
     * Invalides scrollers that are present and forces a recalculation.
     * (Not related to showing/hiding the scrollers)
     */
    invalidateScroller: function() {
        var me = this,
            vScroll = me.verticalScroller,
            hScroll = me.horizontalScroller;
            
        if (vScroll) {
            vScroll.invalidate();
        }
        if (hScroll) {
            hScroll.invalidate();
        }
    },
    
    // sync the headerCt with the view.
    onViewScroll: function(e, t) {
        this.headerCt.el.dom.scrollLeft = t.scrollLeft;
    },

    // refresh the view when a header moves
    onHeaderMove: function(headerCt, header, fromIdx, toIdx) {
        this.view.refresh();
    },
    
    // Section onHeaderHide is invoked after view.
    onHeaderHide: function(headerCt, header, idx) {
        this.invalidateScroller();
    },
    
    onHeaderShow: function(headerCt, header, idx) {
        this.invalidateScroller();
    },
    
    onMouseWheel: function(e) {
        var me = this,
            browserEvent = e.browserEvent,
            vertScroller = me.verticalScroller,
            horizScroller = me.horizontalScroller,
            scrollDelta = me.scrollDelta,
            deltaY, deltaX;

        if (e.within(me.el)) {
            e.stopEvent();
            
            // Webkit Horizontal Axis
            if (browserEvent.wheelDeltaX || browserEvent.wheelDeltaY) {
                deltaX = -browserEvent.wheelDeltaX / 120 * scrollDelta / 3;
                deltaY = -browserEvent.wheelDeltaY / 120 * scrollDelta / 3;
                
                horizScroller.scrollByDeltaX(deltaX);
                vertScroller.scrollByDeltaY(deltaY);
            } else {
                // Gecko Horizontal Axis
                if (browserEvent.axis && browserEvent.axis === 1) {
                    deltaX = -(scrollDelta * e.getWheelDelta()) / 3;
                    horizScroller.scrollByDeltaX(deltaX);
                } else {
                    deltaY = -(scrollDelta * e.getWheelDelta() / 3);
                    vertScroller.scrollByDeltaY(deltaY);
                }
            }
            
        }
    },
    
    // determine scrollbars and invalidate them
    onStoreDataChanged: function() {
        this.determineScrollbars();
        this.invalidateScroller();
    },
    
    /**
     * Sets the scrollTop of the TablePanel.
     * @param {Number} deltaY
     */
    setScrollTop: function(top) {
        var scrollerRight = this.down('gridscroller[dock=' + this.verticalScrollDock  + ']');
        scrollerRight.setScrollTop(top);
    },
    
    /**
     * Scrolls the TablePanel by deltaY
     * @param {Number} deltaY
     */
    scrollByDeltaY: function(deltaY) {
        var scrollerRight = this.down('gridscroller[dock=' + this.verticalScrollDock + ']');
        scrollerRight.scrollByDeltaY(deltaY);
    },

    
    /**
     * Get left hand side marker for header resizing.
     * @private
     */
    getLhsMarker: function() {
        var me = this;
        
        if (!me.lhsMarker) {
            me.lhsMarker = Ext.core.DomHelper.append(me.el, {
                cls: Ext.baseCSSPrefix + 'grid-resize-marker'
            }, true);
        }
        return me.lhsMarker;
    },
    
    /**
     * Get right hand side marker for header resizing.
     * @private
     */
    getRhsMarker: function() {
        var me = this;
        
        if (!me.rhsMarker) {
            me.rhsMarker = Ext.core.DomHelper.append(me.el, {
                cls: Ext.baseCSSPrefix + 'grid-resize-marker'
            }, true);
        }
        return me.rhsMarker;
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
    
    // template method meant to be overriden
    onStoreLoad: Ext.emptyFn
});
