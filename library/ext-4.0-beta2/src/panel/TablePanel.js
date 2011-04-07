/**
 * @class Ext.panel.TablePanel
 * @extends Ext.panel.Panel
 * @xtype tablepanel
 * @markdown
 * @private
 * @author Nicolas Ferrero
TablePanel is a private class and the basis of both TreePanel and GridPanel.

TablePanel aggregates:
- a Selection Model
- a View
- a Store
- Scrollers
- Ext.grid.HeaderContainer

 */
Ext.define('Ext.panel.TablePanel', {
    extend: 'Ext.panel.Panel',
    uses: ['Ext.selection.RowModel'],
    alias: 'widget.tablepanel',

    requires: [
        'Ext.grid.Scroller',
        'Ext.grid.HeaderContainer'
    ],

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
    selType: 'rowmodel',

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
     * @cfg {Array} columns
     * An array of {@link Ext.grid.column.Column column} definition objects which define all columns that appear in this grid. Each
     * column definition provides the header text for the column, and a definition of where the data for that column comes from.
     */

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
    verticalScrollerType: 'gridscroller',

    horizontalScrollerPresentCls: Ext.baseCSSPrefix + 'horizontal-scroller-present',
    verticalScrollerPresentCls: Ext.baseCSSPrefix + 'vertical-scroller-present',

    // private property used to determine where to go down to find views
    // this is here to support locking.
    scrollerOwner: true,

    invalidateScrollerOnRefresh: true,

    initComponent: function() {
        if (!this.viewType) {
            throw "No Viewtype defined.";
        }
        if (!this.store) {
            throw "No Store defined";
        }

        var me         = this,
            scroll     = me.scroll,
            vertical   = false,
            horizontal = false;

        me.store = Ext.data.StoreMgr.lookup(me.store);
        me.addEvents(
            /**
             * @event scrollerhide
             * Fires when a scroller is hidden
             * @param {Ext.grid.Scroller} scroller
             * @param {String} orientation Orientation, can be 'vertical' or 'horizontal'
             */
            'scrollerhide',
            /**
             * @event scrollershow
             * Fires when a scroller is shown
             * @param {Ext.grid.Scroller} scroller
             * @param {String} orientation Orientation, can be 'vertical' or 'horizontal'
             */
            'scrollershow'
        );
        me.bodyCls = me.bodyCls || '';
        me.bodyCls += (' ' + me.extraBodyCls);

        // autoScroll is not a valid configuration
        delete me.autoScroll;

        // TODO: Remove when 4.0GA released. Only for user convenience during beta test.
        if (me.headers) {
            me.columns = me.headers;
            throw "headers config is not supported. Please use columns";
        }

        if (!me.hasView) {
            /**
             * @property headerCt -> colModel?
             */
            var headerCtCfg = {
                items: me.columns,
                sortable: me.sortableHeaders
            };
    
            if (me.hideHeaders) {
                headerCtCfg.height = 0;
                headerCtCfg.border = false;
                // IE Quirks Mode fix
                // If hidden configuration option was used, several layout calculations will be bypassed.
                if (Ext.isIEQuirks) {
                    headerCtCfg.style = {
                        display: 'none'
                    };
                }
            }
    
            // turn both on.
            if (scroll === true || scroll === 'both') {
                vertical = horizontal = true;
            } else if (scroll === 'horizontal') {
                horizontal = true;
            } else if (scroll === 'vertical') {
                vertical = true;
            // All other values become 'none' or false.
            } else {
                headerCtCfg.availableSpaceOffset = 0;
            }
    
            if (vertical) {
                me.verticalScroller = me.verticalScroller || {};
                Ext.applyIf(me.verticalScroller, {
                    dock: me.verticalScrollDock,
                    xtype: me.verticalScrollerType,
                    store: me.store
                });
                me.verticalScroller = Ext.ComponentMgr.create(me.verticalScroller);
                me.mon(me.verticalScroller, {
                    bodyscroll: me.onVerticalScroll,
                    scope: me
                });
            }
    
            if (horizontal) {
                me.horizontalScroller = Ext.ComponentMgr.create({
                    xtype: 'gridscroller',
                    section: me,
                    dock: 'bottom',
                    store: me.store
                });
                me.mon(me.horizontalScroller, {
                    bodyscroll: me.onHorizontalScroll,
                    scope: me
                });
            }
    
            me.headerCt = new Ext.grid.HeaderContainer(headerCtCfg);
            me.headerCt.on('headerresize', me.onHeaderResize, me);
            me.relayEvents(me.headerCt, ['headerresize', 'headermove', 'headerhide', 'headershow', 'sortchange']);
            me.features = me.features || [];
            me.dockedItems = me.dockedItems || [];
            me.dockedItems.unshift(me.headerCt);
            me.viewConfig = me.viewConfig || {};
            me.viewConfig.invalidateScrollerOnRefresh = me.invalidateScrollerOnRefresh;
    
            // AbstractDataView will look up a Store configured as an object
            // getView converts viewConfig into a View instance
            me.mon(me.getView().store, {
                load: me.onStoreLoad,
                scope: me
            });
    
            me.mon(me.getView(), {
                refresh: {
                    fn: this.onViewRefresh,
                    scope: me,
                    buffer: 50
                }
            });
        }

        me.callParent();
    },

    // state management
    initStateEvents: function(){
        var events = this.stateEvents;
        // push on stateEvents if they don't exist
        Ext.each(['headerresize', 'headermove', 'headerhide', 'headershow', 'sortchange'], function(event){
            if (Ext.Array.indexOf(events, event)) {
                events.push(event);
            }
        });
        this.callParent();
    },

    getState: function(){
        var state = {
            columns: []
        },
        sorter = this.store.sorters.first();

        this.headerCt.items.each(function(header){
            state.columns.push({
                id: header.headerId,
                width: header.flex ? undefined : header.width,
                hidden: header.hidden,
                sortable: header.sortable
            });
        });

        if (sorter) {
            state.sort = {
                property: sorter.property,
                direction: sorter.direction
            };
        }
        return state;
    },

    applyState: function(state) {
        var headers = state.columns,
            length = headers ? headers.length : 0,
            headerCt = this.headerCt,
            items = headerCt.items,
            sorter = state.sort,
            store = this.store,
            i = 0,
            index,
            headerState,
            header;

        for (; i < length; ++i) {
            headerState = headers[i];
            header = headerCt.down('gridcolumn[headerId=' + headerState.id + ']');
            index = items.indexOf(header);
            if (i !== index) {
                headerCt.moveHeader(index, i);
            }
            header.sortable = headerState.sortable;
            if (Ext.isDefined(headerState.width)) {
                delete header.flex;
                header.setWidth(headerState.width);
            }
            header.hidden = headerState.hidden;
        }

        if (sorter) {
            if (store.remoteSort) {
                store.sorters.add(new Ext.util.Sorter({
                    property: sorter.property,
                    direction: sorter.direction
                }));
            }
            else {
                store.sort(sorter.property, sorter.direction);
            }
        }
    },

    /**
     * Gets the view for this panel.
     * @return {Ext.view.TableView}
     */
    getView: function() {
        var me = this,
            sm;

        if (!me.view) {
            sm = me.getSelectionModel();
            me.view = me.createComponent(Ext.apply({}, me.viewConfig, {
                xtype: me.viewType,
                store: me.store,
                headerCt: me.headerCt,
                selModel: sm,
                features: me.features,
                panel: me
            }));
            me.mon(me.view, {
                //bodyscroll: me.onViewScroll,
                uievent: me.processEvent,
                scope: me
            });
            sm.view = me.view;
            me.headerCt.view = me.view;
            me.relayEvents(me.view, ['cellclick', 'celldblclick']);
        }
        return me.view;
    },

    /**
     * @private
     * Add the View only after first layout has been completed.
     */
    afterLayout: function() {
        var me = this;
        me.callParent();
        if (!me.hasView) {
            me.hasView = true;
            me.add(me.view);
            me.mon(Ext.getBody(), {
                mousewheel: me.onMouseWheel,
                scope: me
            });
        }
    },

    /**
     * @private
     * Process UI events from the view. Propagate them to whatever internal Components need to process them
     * @param {String} type Event type, eg 'click'
     * @param {TableView} view TableView Component
     * @param {HtmlElement} cell Cell HtmlElement the event took place within
     * @param {Number} recordIndex Index of the associated Store Model (-1 if none)
     * @param {Number} cellIndex Cell index within the row
     * @param {EventObject} e Original event
     */
    processEvent: function(type, view, cell, recordIndex, cellIndex, e) {
        var me = this,
            header;

        if (cellIndex !== -1) {
            header = me.headerCt.getGridColumns()[cellIndex];
            return header.processEvent.apply(header, arguments);
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
            //centerScrollWidth = viewElDom.scrollWidth;
            centerScrollWidth = me.headerCt.getFullWidth();
            /**
             * clientWidth often returns 0 in IE resulting in an
             * infinity result, here we use offsetWidth bc there are
             * no possible scrollbars and we don't care about margins
             */
            centerClientWidth = viewElDom.offsetWidth;
            if (me.verticalScroller && me.verticalScroller.el) {
                scrollHeight = me.verticalScroller.getSizeCalculation().height;
            } else {
                scrollHeight = viewElDom.scrollHeight;
            }
            
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
        if (this.view && this.view.rendered) {
            this.determineScrollbars();
            this.invalidateScroller();
        }
    },

    /**
     * Hide the verticalScroller and remove the horizontalScrollerPresentCls.
     */
    hideHorizontalScroller: function() {
        var me = this;

        if (me.horizontalScroller && me.horizontalScroller.ownerCt === me) {
            me.verticalScroller.offsets.bottom = 0;
            me.removeDocked(me.horizontalScroller, false);
            me.removeCls(me.horizontalScrollerPresentCls);
            me.fireEvent('scrollerhide', me.horizontalScroller, 'horizontal');
        }
        
    },

    /**
     * Show the horizontalScroller and add the horizontalScrollerPresentCls.
     */
    showHorizontalScroller: function() {
        var me = this;

        if (me.verticalScroller) {
            me.verticalScroller.offsets.bottom = Ext.getScrollBarWidth() - 2;
        }
        if (me.horizontalScroller && me.horizontalScroller.ownerCt !== me) {
            me.addDocked(me.horizontalScroller);
            me.addCls(me.horizontalScrollerPresentCls);
            me.fireEvent('scrollershow', me.horizontalScroller, 'horizontal');
        }
    },

    /**
     * Hide the verticalScroller and remove the verticalScrollerPresentCls.
     */
    hideVerticalScroller: function() {
        var me = this;

        if (me.verticalScroller && me.verticalScroller.ownerCt === me) {
            me.removeDocked(me.verticalScroller, false);
            me.removeCls(me.verticalScrollerPresentCls);
            me.fireEvent('scrollerhide', me.verticalScroller, 'vertical');
        }
    },

    /**
     * Show the verticalScroller and add the verticalScrollerPresentCls.
     */
    showVerticalScroller: function() {
        var me = this;

        if (me.verticalScroller && me.verticalScroller.ownerCt !== me) {
            me.addDocked(me.verticalScroller);
            me.addCls(me.verticalScrollerPresentCls);
            me.fireEvent('scrollershow', me.verticalScroller, 'vertical');
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
        if (this.invalidateScrollerOnRefresh) {
            // On programmatic or otherwise scroll of the view, synch any virtual scrollers
            if (this.verticalScroller) {
                this.verticalScroller.setScrollTop(this.view.el.dom.scrollTop);
            }
            if (this.horizontalScroller) {
                this.horizontalScroller.setScrollLeft(this.view.el.dom.scrollLeft);
            }
        }
    },

    // refresh the view when a header moves
    onHeaderMove: function(headerCt, header, fromIdx, toIdx) {
        this.view.refresh();
    },

    // Section onHeaderHide is invoked after view.
    onHeaderHide: function(headerCt, header) {
        this.invalidateScroller();
    },

    onHeaderShow: function(headerCt, header) {
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
                
                if (horizScroller) {
                    horizScroller.scrollByDeltaX(deltaX);
                }
                if (vertScroller) {
                    vertScroller.scrollByDeltaY(deltaY);
                }
            } else {
                // Gecko Horizontal Axis
                if (browserEvent.axis && browserEvent.axis === 1) {
                    if (horizScroller) {
                        deltaX = -(scrollDelta * e.getWheelDelta()) / 3;
                        horizScroller.scrollByDeltaX(deltaX);    
                    }
                } else {
                    if (vertScroller) {
                        deltaY = -(scrollDelta * e.getWheelDelta() / 3);
                        vertScroller.scrollByDeltaY(deltaY);    
                    }
                }
            }
        }
    },

    /**
     * @private
     * Determine and invalidate scrollers on view refresh
     */
    onViewRefresh: function() {
        this.determineScrollbars();
        if (this.invalidateScrollerOnRefresh) {
            this.invalidateScroller();
        }
    },
    
    /**
     * Sets the scrollTop of the TablePanel.
     * @param {Number} deltaY
     */
    setScrollTop: function(top) {
        var rootCmp = this.getScrollerOwner(),
            scrollerRight;
        scrollerRight = rootCmp.down('gridscroller[dock=' + this.verticalScrollDock  + ']');
        if (scrollerRight) {
            scrollerRight.setScrollTop(top);
        }
        
    },
    
    getScrollerOwner: function() {
        var rootCmp = this;
        if (!this.scrollerOwner) {
            rootCmp = this.up('[scrollerOwner]');
        }
        return rootCmp;
    },

    /**
     * Scrolls the TablePanel by deltaY
     * @param {Number} deltaY
     */
    scrollByDeltaY: function(deltaY) {
        var rootCmp = this.getScrollerOwner(),
            scrollerRight;
        scrollerRight = rootCmp.down('gridscroller[dock=' + this.verticalScrollDock + ']');
        scrollerRight.scrollByDeltaY(deltaY);
    },


    /**
     * Scrolls the TablePanel by deltaX
     * @param {Number} deltaY
     */
    scrollByDeltaX: function(deltaX) {
        this.horizontalScroller.scrollByDeltaX(deltaX);
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

        var mode = 'SINGLE',
            type;
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
            type = this.selModel.selType || this.selType;
            this.selModel = Ext.create('selection.' + type, this.selModel);
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
    
    onVerticalScroll: function(event, target) {
        var owner = this.scrollerOwner ? this : this.up('[scrollerOwner]'),
            items = owner.query('tableview'),
            i = 0,
            len = items.length,
            center,
            centerEl,
            centerScrollWidth,
            centerClientWidth,
            width;
            
        for (; i < len; i++) {
            items[i].el.dom.scrollTop = target.scrollTop;
        }
    },
    
    onHorizontalScroll: function(event, target) {
        var owner = this.scrollerOwner ? this : this.up('[scrollerOwner]'),
            items = owner.query('tableview'),
            i = 0,
            len = items.length,
            center,
            centerEl,
            centerScrollWidth,
            centerClientWidth,
            width;
            
        center = items[1] || items[0];
        centerEl = center.el.dom;
        centerScrollWidth = centerEl.scrollWidth;
        centerClientWidth = centerEl.offsetWidth;    
        width = this.horizontalScroller.getWidth();
        
        centerEl.scrollLeft = Math.ceil(target.scrollLeft/width * centerClientWidth);
        this.headerCt.el.dom.scrollLeft = target.scrollLeft;
    },

    // template method meant to be overriden
    onStoreLoad: Ext.emptyFn,

    getEditorParent: function() {
        return this.body;
    },
    
    bindStore: function(store) {
        var me = this;
        me.store = store;
        me.getView().bindStore(store);
    },
    
    reconfigure: function(store, columns) {
        var me = this;
        if (columns) {
            me.headerCt.removeAll();
            me.headerCt.add(columns);
        }
        if (store) {
            me.bindStore(store);
        } else {
            me.getView().refresh();
        }
    }
});