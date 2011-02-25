/**
 * @class Ext.grid.Section
 * @extends Ext.panel.Panel
 *
 * Section of a Grid. Headers are docked in this area and this class
 * synchronizes the viewable area and headers.
 *
 * Locked Sections
 * - cannot flex headers.
 * - must have a fixed width
 *
 * Virtualized (non locked) or Scrollable Sections must be synchronized vertically.
 *
 * Sections can resize based off of header size/visibility changes.
 *
 * Templates can become dirty based off of visibility changes.
 * @xtype gridsection
 */

Ext.define('Ext.grid.Section', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Ext.grid.View',
        'Ext.grid.HeaderContainer'
    ],
    alias: 'widget.gridsection',

    layout: 'fit',
    cls: Ext.baseCSSPrefix + 'grid-section',
    isGridSection: true,
    scroll: true,
    border: false,
    
    verticalScrollDock: 'right',
    extraBodyCls: Ext.baseCSSPrefix + 'grid-body',
    
    /**
     * @cfg {Number} scrollDelta
     * Number of pixels to scroll when scrolling with mousewheel.
     * Defaults to 40.
     */
    scrollDelta: 40,
    
    
    /**
     * Boolean to indicate that GridView has been injected into this Grid Section.
     * @property hasGridView
     */
    hasGridView: false,
    
    // TODO: Rename headers -> columns
    
    initComponent: function() {
        var me         = this,
            scroll     = me.scroll,
            vertical   = false,
            horizontal = false;
            
        // TODO: Remove in the future.
        if (!me.locked) {
            me.flex = 1;
        }
        
        me.bodyCls = me.bodyCls || '';
        me.bodyCls += (' ' + me.extraBodyCls);

        me.dockedItems = me.dockedItems || [];
        
            
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
        
        /**
         * @property headerCt -> colModel?
         */
        me.headerCt = new Ext.grid.HeaderContainer({
            items: me.headers
        });
        me.headerCt.on('headerresize', me.onHeaderResize, me);
        
        me.features = me.features || [];
        me.dockedItems = me.dockedItems || [];
        me.dockedItems.unshift(me.headerCt);
        
        me.callParent();
    },
    
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
            this.up('gridpanel').invalidateScroller();
        }
    },
    
    afterLayout: function() {
        var me = this;
        me.callParent();
        if (!me.hasGridView) {
            me.hasGridView = true;
            me.viewConfig = me.viewConfig || {};
            Ext.applyIf(me.viewConfig, {
                xtype: 'gridview',
                store: me.store,
                headerCt: me.headerCt,
                selModel: me.selModel,
                features: me.features,
                listeners: {
                    bodyscroll: me.onGridViewScroll,
                    scope: me
                }                
            });
            me.view = me.add(me.viewConfig);
            me.headerCt.view = me.view;
            Ext.Function.defer(me.determineScrollbars, 50, me);
            Ext.getBody().on('mousewheel', me.onMouseWheel, me);
        }
    },
        
    hideHorizontalScroller: function() {
        var me = this;
        
        if (me.horizontalScroller.ownerCt === me) {
            me.verticalScroller.offsets.bottom = 0;
            me.removeDocked(me.horizontalScroller, false);    
        }
        
    },
    
    showHorizontalScroller: function() {
        var me = this;
        
        me.verticalScroller.offsets.bottom = Ext.getScrollBarWidth() - 2;
        if (me.horizontalScroller.ownerCt !== me) {
            me.addDocked(me.horizontalScroller);
        }
        
    },
    
    hideVerticalScroller: function() {
        var me = this;
        
        if (me.verticalScroller.ownerCt === me) {
            me.removeDocked(me.verticalScroller, false);
        }
    },
    
    showVerticalScroller: function() {
        var me = this;
        
        if (me.verticalScroller.ownerCt !== me) {
            me.addDocked(me.verticalScroller);
        }
    },
    
    invalidateScroller: function() {
        this.up('gridpanel').invalidateScroller();
    },
    
    onGridViewScroll: function(e, t) {
        this.headerCt.el.dom.scrollLeft = t.scrollLeft;
    },

    onHeaderMove: function(headerCt, header, fromIdx, toIdx) {
        this.view.refresh();
        //this.up('gridpanel').invalidateScroller();
    },
    
    // Section onHeaderHide is invoked after view.
    onHeaderHide: function(headerCt, header, idx) {
        this.invalidateScroller();
    },
    
    onHeaderShow: function(headerCt, header, idx) {
        this.invalidateScroller();
    },
    
    getLhsMarker: function() {
        var me = this;
        
        if (!me.lhsMarker) {
            me.lhsMarker = Ext.core.DomHelper.append(me.el, {
                cls: Ext.baseCSSPrefix + 'grid-resize-marker'
            }, true);
        }
        return me.lhsMarker;
    },
    
    getRhsMarker: function() {
        var me = this;
        
        if (!me.rhsMarker) {
            me.rhsMarker = Ext.core.DomHelper.append(me.el, {
                cls: Ext.baseCSSPrefix + 'grid-resize-marker'
            }, true);
        }
        return me.rhsMarker;
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
                    deltaX = -(scrollDelta * e.getWheelDelta()) / 3
                    horizScroller.scrollByDeltaX(deltaX);
                } else {
                    deltaY = -(scrollDelta * e.getWheelDelta() / 3);
                    vertScroller.scrollByDeltaY(deltaY);
                }
            }
            
        }
    }
});
