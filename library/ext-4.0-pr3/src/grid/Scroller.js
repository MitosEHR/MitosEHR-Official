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
    
    cls: Ext.baseCSSPrefix + 'scroller',
    
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
            scrollbarWidth = Ext.getScrollBarWidth() - (Ext.isIE ? 1 : 2);
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
    
    invalidate: function(firstPass) {
        if (!this.el || !this.ownerCt) {
            return;
        }
        
        var owner  = this.ownerCt,
            dock   = this.dock,
            elDom  = this.el.dom,
            width  = 1,
            height = 1;
            
        if (dock === 'top' || dock === 'bottom') {
            // TODO: Must gravitate to a single region..
            // Horizontal scrolling only scrolls virtualized region
            var items  = owner.query('gridview'),
                center = items[1] || items[0];
            
            if (!center) {
                return;
            }
            
            var centerEl          = center.el.dom,
                centerScrollWidth = centerEl.scrollWidth,
                // clientWidth often returns 0 in IE resulting in an
                // infinity result, here we use offsetWidth bc there are
                // no possible scrollbars and we dont care about margins
                centerClientWidth = centerEl.offsetWidth,
                scrollerWidth     = this.getWidth(),
                threshold = Ext.getScrollBarWidth() - 2;

                
            width = Math.round(centerScrollWidth * scrollerWidth / centerClientWidth);
            // because the scroller is completely virtualized, it is easy to get into a couple
            // pixel rounding error. This makes no overflow occur if the user is +/- the threshold
            if (scrollerWidth > (width - threshold) /*&& scrollerWidth < (width + threshold)*/) {
                width = scrollerWidth;
            }
        } else {
            var tbl = owner.el.down('.' + Ext.baseCSSPrefix + 'grid-view');
            if (!tbl) {
                return;
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
        this.stretchEl.setSize(width, height);
        
        // BrowserBug: IE7
        // This makes the scroller enabled, when initially rendering.
        elDom.scrollTop = elDom.scrollTop;
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
        if (this.el) {
            var elDom = this.el.dom;
            elDom.scrollTop = Ext.Number.constrain(scrollTop, 0, elDom.scrollHeight - elDom.clientHeight);
        }
        
    },
    
    /**
     * Sets the scrollLeft and constrains the value between 0 and max.
     * @param {Number} scrollTop
     */
    setScrollLeft: function(scrollLeft) {
        var elDom = this.el.dom;
        elDom.scrollLeft = Ext.Number.constrain(scrollLeft, 0, elDom.scrollWidth - elDom.clientWidth);
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
        var dock = this.dock,
            owner = this.ownerCt,
            items = owner.query('gridview'),
            i = 0,
            len = items.length,
            center,
            centerEl,
            centerScrollWidth,
            centerClientWidth,
            width;
            
        if (dock === 'top' || dock === 'bottom') {
            center = items[1] || items[0];
            centerEl = center.el.dom;
            centerScrollWidth = centerEl.scrollWidth;
            centerClientWidth = centerEl.offsetWidth;    
            width = this.getWidth();

            centerEl.scrollLeft = Math.ceil(target.scrollLeft/width * centerClientWidth);
        } else {
            for (; i < len; i++) {
                items[i].el.dom.scrollTop = target.scrollTop;
            }
        }
    }
});

