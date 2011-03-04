/**
 * @class Ext.grid.HeaderResizer
 * @extends Ext.util.Observable
 * 
 * Plugin to add header resizing functionality to a HeaderContainer.
 * Always resizing header to the left of the splitter you are resizing.
 * 
 * Todo: Consider RTL support, columns would always calculate to the right of
 *    the splitter instead of to the left.
 */
Ext.define('Ext.grid.HeaderResizer', {
    extend: 'Ext.util.Observable',
    requires: ['Ext.dd.DragTracker', 'Ext.util.Region'],
    alias: 'plugin.gridheaderresizer',
    
    /**
     * @cfg {Boolean} dynamic
     * Set to true to resize on the fly rather than using a proxy marker. Defaults to false.
     */
    configs: {
        dynamic: true
    },    
    
    colHeaderCls: Ext.baseCSSPrefix + 'column-header',

    minColWidth: 40,
    maxColWidth: 1000,
    wResizeCursor: 'col-resize',
    eResizeCursor: 'col-resize',
    // not using w and e resize bc we are only ever resizing one
    // column
    //wResizeCursor: Ext.isWebKit ? 'w-resize' : 'col-resize',
    //eResizeCursor: Ext.isWebKit ? 'e-resize' : 'col-resize',
    
    init: function(headerCt) {
        this.headerCt = headerCt;
        headerCt.on('render', this.afterHeaderRender, this);
    },
    
    afterHeaderRender: function() {
        var headerCt = this.headerCt,
            el = headerCt.el;
            
        headerCt.mon(el, 'mousemove', this.onHeaderCtMouseMove, this);
        
        this.tracker = new Ext.dd.DragTracker({
            onBeforeStart: Ext.Function.bind(this.onBeforeStart, this),
            onStart: Ext.Function.bind(this.onStart, this),
            onDrag: Ext.Function.bind(this.onDrag, this),
            onEnd: Ext.Function.bind(this.onEnd, this),
            tolerance: 3,
            autoStart: 300,
            el: el
        });
    },
    
    
    // As we mouse over individual headers, change the cursor to indicate
    // that resizing is available.
    onHeaderCtMouseMove: function(e, t) {
        if (!this.headerCt.dragging) {
        
            var headerEl    = e.getTarget('.'+this.colHeaderCls, 3, true),
                x           = e.getPageX(),
                header, style;
                
                
            if (headerEl){
                header      = Ext.getCmp(headerEl.id);
                style = headerEl.dom.style;
    
                // left hand edge of the header
                // want to resize the previous column that is NOT hidden
                if (header.isOnLeftEdge(e)) {
                    // TODO: need to also check that the header is NOT hidden.
                    this.activeHd = header.previousSibling('gridheader:not(gridheader[hidden])');
                    if (this.activeHd && !this.activeHd.fixed) {
                        style.cursor = this.eResizeCursor;
                    }
                // right hand edge of the header
                // want to resize this column
                } else if (header.isOnRightEdge(e)) {
                    this.activeHd = Ext.getCmp(headerEl.id);
                    if (!this.activeHd.fixed) {
                        style.cursor = this.wResizeCursor;
                    }
                // reset
                } else {
                    delete this.activeHd;
                    style.cursor = '';
                }
                if (this.activeHd && this.activeHd.fixed) {
                    delete this.activeHd;
                }
            }
        } else {
            delete this.activeHd;
        }
    },

    // only start when there is an activeHd
    onBeforeStart : function(e){
        var t = e.getTarget();
        // cache the activeHd because it will be cleared.
        this.dragHd = this.activeHd;

        if (!!this.dragHd && !Ext.fly(t).hasCls('x-column-header-trigger') && !this.headerCt.dragging) {
            //this.headerCt.dragging = true;
            this.tracker.constrainTo = this.getConstrainRegion();
            return true;
        } else {
            this.headerCt.dragging = false;
            return false;
        }
    },


    // get the region to constrain to, takes into account max and min col widths
    getConstrainRegion: function() {
        var dragHdEl = this.dragHd.el,
            region   = Ext.util.Region.getRegion(dragHdEl);

        return region.adjust(
            0,
            this.maxColWidth - dragHdEl.getWidth(),
            0,
            this.minColWidth
        );
    },


    // initialize the left and right hand side markers around
    // the header that we are resizing
    onStart: function(e){
        var dragHd      = this.dragHd,
            dragHdEl    = dragHd.el,
            width       = dragHdEl.getWidth(),
            t           = e.getTarget();

        if (this.dragHd && !Ext.fly(t).hasCls('x-column-header-trigger')) {
            this.headerCt.dragging = true;
        }

        this.origWidth = width;
        
        // setup marker proxies
        if (!this.dynamic) {
            var xy           = dragHdEl.getXY(),
                gridSection  = this.headerCt.up('gridsection'),
                lhsMarker    = gridSection.getLhsMarker(),
                rhsMarker    = gridSection.getRhsMarker(),
                el           = rhsMarker.parent(),
                topLeft      = el.translatePoints(xy),
                markerHeight = gridSection.getHeight();
                
            if (gridSection.horizontalScroller.ownerCt === gridSection) {
                markerHeight -= (Ext.getScrollBarWidth() - 2);
            }
            
            lhsMarker.setHeight(markerHeight);
            rhsMarker.setHeight(markerHeight);
            lhsMarker.setLeft(topLeft.left);
            rhsMarker.setLeft(topLeft.left + width);
        }
    },

    // synchronize the rhsMarker with the mouse movement
    onDrag: function(e){
        if (!this.dynamic) {
            var xy          = this.tracker.getXY('point'),
                gridSection = this.headerCt.up('gridsection'),
                rhsMarker   = gridSection.getRhsMarker(),
                el          = rhsMarker.parent(),
                topLeft     = el.translatePoints(xy);
                
            rhsMarker.setLeft(topLeft.left);
        // Resize as user interacts
        } else {
            this.doResize();
        }
        
    },

    onEnd: function(e){
        this.headerCt.dragging = false;
        if (this.dragHd) {
            if (!this.dynamic) {
                var dragHd      = this.dragHd,
                    gridSection = this.headerCt.up('gridsection'),
                    lhsMarker   = gridSection.getLhsMarker(),
                    rhsMarker   = gridSection.getRhsMarker(),
                    currWidth   = dragHd.getWidth(),
                    offset      = this.tracker.getOffset('point'),
                    offscreen   = -9999;
                    
                // hide markers
                lhsMarker.setLeft(offscreen);
                rhsMarker.setLeft(offscreen);
            }
            
            this.doResize();
        }
    },
    
    
    doResize: function() {
        if (this.dragHd) {
            var dragHd = this.dragHd,
                offset = this.tracker.getOffset('point');
                
            // resize the dragHd
            if (dragHd.flex) {
                delete dragHd.flex;
            }
            dragHd.setWidth(this.origWidth + offset[0]);
        }
        
    }
});
