/**
 * @class Ext.grid.Scroller
 * @extends Ext.Component
 *
 * Docked in Ext.grid.Section's, controls virtualized scrolling and synchronization
 * across different sections.
 *
 * @private
 */
Ext.define('Ext.grid.Scroller', {
    extend: 'Ext.Component',
    alias: 'widget.gridscroller',
    weight: 110,
    cls: Ext.baseCSSPrefix + 'scroller',
    focusable: false,
    
    renderTpl: ['<div class="' + Ext.baseCSSPrefix + 'stretcher"></div>'],
    
    initComponent: function() {
        var me       = this,
            dock     = me.dock,
            cls      = Ext.baseCSSPrefix + 'scroller-vertical',
            sizeProp = 'width',
            // TODO: Determine why +2 in getScrollBarWidth
            // BrowserBug: IE8 dictates that there must be at least 1px of viewable
            // area before it will allow you to scroll when clicking on the open
            // area. This adds a 1px visual artificat in IE8.
            scrollbarWidth = Ext.getScrollBarWidth() - (Ext.isIE ? 0 : 1);

        me.offsets = {bottom: 0};

        if (dock === 'top' || dock === 'bottom') {
            cls = Ext.baseCSSPrefix + 'scroller-horizontal';
            sizeProp = 'height';
        }
        me[sizeProp] = scrollbarWidth;
        
        me.cls += (' ' + cls);
        
        Ext.applyIf(me.renderSelectors, {
            stretchEl: '.' + Ext.baseCSSPrefix + 'stretcher'
        });
        me.callParent();
    },
    
    
    afterRender: function() {
        var me = this;
        me.callParent();
        me.ownerCt.on('afterlayout', me.onOwnerAfterLayout, me);
        me.el.on('scroll', me.onElScroll, me);
    },
    
    getSizeCalculation: function() {
        var owner  = this.getPanel(),
            dock   = this.dock,
            elDom  = this.el.dom,
            width  = 1,
            height = 1;
            
        if (dock === 'top' || dock === 'bottom') {
            // TODO: Must gravitate to a single region..
            // Horizontal scrolling only scrolls virtualized region
            var items  = owner.query('tableview'),
                center = items[1] || items[0];
            
            if (!center) {
                return false;
            }
            // center is not guaranteed to have content, such as when there
            // are zero rows in the grid/tree. We read the width from the
            // headerCt instead.
            width = center.headerCt.getFullWidth();
        } else {
            var tbl = owner.el.down('.' + Ext.baseCSSPrefix + 'grid-view');
            if (!tbl) {
                return false;
            }
            
            // needs to also account for header and scroller (if still in picture)
            // should calculate from headerCt.
            height = tbl.dom.scrollHeight;
        }
        if (isNaN(width)) {
            width = 1;
        }
        if (isNaN(height)) {
            height = 1;
        }
        return {
            width: width,
            height: height
        };
    },
    
    invalidate: function(firstPass) {
        if (!this.stretchEl || !this.ownerCt) {
            return;
        }
        var size  = this.getSizeCalculation(),
            elDom = this.el.dom;
        if (size) {
            this.stretchEl.setSize(size);
        
            // BrowserBug: IE7
            // This makes the scroller enabled, when initially rendering.
            elDom.scrollTop = elDom.scrollTop;
        }
    },

    onOwnerAfterLayout: function(owner, layout) {
        if (Ext.isIE) {
            Ext.Function.defer(this.invalidate, 1, this);
        } else {
            this.invalidate();
        }
    },

    /**
     * Sets the scrollTop and constrains the value between 0 and max.
     * @param {Number} scrollTop
     */
    setScrollTop: function(scrollTop) {
        if (!this.scrollInProgress && this.el) {
            var elDom = this.el.dom;
            elDom.scrollTop = Ext.Number.constrain(scrollTop, 0, elDom.scrollHeight - elDom.clientHeight);
        }
        
    },

    /**
     * Sets the scrollLeft and constrains the value between 0 and max.
     * @param {Number} scrollTop
     */
    setScrollLeft: function(scrollLeft) {
        if (!this.scrollInProgress && this.el) {
            var elDom = this.el.dom;
            elDom.scrollLeft = Ext.Number.constrain(scrollLeft, 0, elDom.scrollWidth - elDom.clientWidth);
        }
    },

    /**
     * Scroll by deltaY
     * @param {Number} delta
     */
    scrollByDeltaY: function(delta) {
        if (this.el) {
            var elDom = this.el.dom;
            this.setScrollTop(elDom.scrollTop + delta);    
        }
    },

    /**
     * Scroll by deltaX
     * @param {Number} delta
     */
    scrollByDeltaX: function(delta) {
        if (this.el) {
            var elDom = this.el.dom;
            this.setScrollLeft(elDom.scrollLeft + delta);
        }
    },
    
    
    /**
     * Scroll to the top.
     */
    scrollToTop : function(){
        this.setScrollTop(0);
    },
    
    // synchronize the scroller with the bound gridviews
    onElScroll: function(event, target) {
        // Set a flag so we refuse to respond to outside control while we are scrolling the client.
        this.scrollInProgress = true;

        this.fireEvent('bodyscroll', event, target);

        // Clear barrier flag in 100 miliseconds (Unless this is called again, ie: they are dragging the bar)
        this.clearScrollInProgress();
    },

    clearScrollInProgress: Ext.Function.createBuffered(function() {
        this.scrollInProgress = false;
    }, 10),

    getPanel: function() {
        var me = this;
        if (!me.panel) {
            me.panel = this.up('[scrollerOwner]');
        }
        return me.panel;
    }
});

