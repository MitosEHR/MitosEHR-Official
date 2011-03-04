/**
 * @class Ext.layout.container.boxOverflow.Scroller
 * @extends Ext.layout.container.boxOverflow.None
 * @private
 */
Ext.define('Ext.layout.container.boxOverflow.Scroller', {

    /* Begin Definitions */

    extend: 'Ext.layout.container.boxOverflow.None',

    requires: ['Ext.util.ClickRepeater', 'Ext.core.Element'],

    /* End Definitions */

    /**
     * @cfg {Boolean} animateScroll
     * True to animate the scrolling of items within the layout (defaults to true, ignored if enableScroll is false)
     */
    animateScroll: true,
    
    /**
     * @cfg {Number} scrollIncrement
     * The number of pixels to scroll by on scroller click (defaults to 100)
     */
    scrollIncrement: 100,
    
    /**
     * @cfg {Number} wheelIncrement
     * The number of pixels to increment on mouse wheel scrolling (defaults to <tt>3</tt>).
     */
    wheelIncrement: 3,
    
    /**
     * @cfg {Number} scrollRepeatInterval
     * Number of milliseconds between each scroll while a scroller button is held down (defaults to 400)
     */
    scrollRepeatInterval: 400,
    
    /**
     * @cfg {Number} scrollDuration
     * Number of seconds that each scroll animation lasts (defaults to 0.4)
     */
    scrollDuration: 0.4,
    
    /**
     * @cfg {String} beforeCls
     * CSS class added to the beforeCt element. This is the element that holds any special items such as scrollers,
     * which must always be present at the leftmost edge of the Container
     */
    beforeCls: Ext.baseCSSPrefix + 'strip-left',
    
    /**
     * @cfg {String} afterCls
     * CSS class added to the afterCt element. This is the element that holds any special items such as scrollers,
     * which must always be present at the rightmost edge of the Container
     */
    afterCls: Ext.baseCSSPrefix + 'strip-right',
    
    /**
     * @cfg {String} scrollerCls
     * CSS class added to both scroller elements if enableScroll is used
     */
    scrollerCls: Ext.baseCSSPrefix + 'strip-scroller',
    
    /**
     * @cfg {String} beforeScrollerCls
     * CSS class added to the left scroller element if enableScroll is used
     */
    beforeScrollerCls: Ext.baseCSSPrefix + 'strip-scroller-left',
    
    /**
     * @cfg {String} afterScrollerCls
     * CSS class added to the right scroller element if enableScroll is used
     */
    afterScrollerCls: Ext.baseCSSPrefix + 'strip-scroller-right',
    
    /**
     * @private
     * Sets up an listener to scroll on the layout's innerCt mousewheel event
     */
    createWheelListener: function() {
        this.layout.innerCt.on({
            scope     : this,
            mousewheel: function(e) {
                e.stopEvent();

                this.scrollBy(e.getWheelDelta() * this.wheelIncrement * -1, false);
            }
        });
    },
    
    /**
     * @private
     * Most of the heavy lifting is done in the subclasses
     */
    handleOverflow: function(calculations, targetSize) {
        this.createInnerElements();
        this.showScrollers();
    },
    
    /**
     * @private
     */
    clearOverflow: function() {
        this.hideScrollers();
    },
    
    /**
     * @private
     * Shows the scroller elements in the beforeCt and afterCt. Creates the scrollers first if they are not already
     * present. 
     */
    showScrollers: function() {
        this.createScrollers();
        
        this.beforeScroller.show();
        this.afterScroller.show();
        
        this.updateScrollButtons();
    },
    
    /**
     * @private
     * Hides the scroller elements in the beforeCt and afterCt
     */
    hideScrollers: function() {
        if (this.beforeScroller != undefined) {
            this.beforeScroller.hide();
            this.afterScroller.hide();          
        }
    },
    
    /**
     * @private
     * Creates the clickable scroller elements and places them into the beforeCt and afterCt
     */
    createScrollers: function() {
        if (!this.beforeScroller && !this.afterScroller) {
            var before = this.beforeCt.createChild({
                cls: Ext.String.format("{0} {1} ", this.scrollerCls, this.beforeScrollerCls)
            });
            
            var after = this.afterCt.createChild({
                cls: Ext.String.format("{0} {1}", this.scrollerCls, this.afterScrollerCls)
            });
            
            before.addClsOnOver(this.beforeScrollerCls + '-hover');
            after.addClsOnOver(this.afterScrollerCls + '-hover');
            
            before.setVisibilityMode(Ext.core.Element.DISPLAY);
            after.setVisibilityMode(Ext.core.Element.DISPLAY);
            
            this.beforeRepeater = new Ext.util.ClickRepeater(before, {
                interval: this.scrollRepeatInterval,
                handler : this.scrollLeft,
                scope   : this
            });
            
            this.afterRepeater = new Ext.util.ClickRepeater(after, {
                interval: this.scrollRepeatInterval,
                handler : this.scrollRight,
                scope   : this
            });
            
            /**
             * @property beforeScroller
             * @type Ext.core.Element
             * The left scroller element. Only created when needed.
             */
            this.beforeScroller = before;
            
            /**
             * @property afterScroller
             * @type Ext.core.Element
             * The left scroller element. Only created when needed.
             */
            this.afterScroller = after;
        }
    },
    
    /**
     * @private
     */
    destroy: function() {
        Ext.destroy(this.beforeScroller, this.afterScroller, this.beforeRepeater, this.afterRepeater, this.beforeCt, this.afterCt);
    },
    
    /**
     * @private
     * Scrolls left or right by the number of pixels specified
     * @param {Number} delta Number of pixels to scroll to the right by. Use a negative number to scroll left
     */
    scrollBy: function(delta, animate) {
        this.scrollTo(this.getScrollPosition() + delta, animate);
    },
    
    /**
     * @private
     * Normalizes an item reference, string id or numerical index into a reference to the item
     * @param {Ext.Component|String|Number} item The item reference, id or index
     * @return {Ext.Component} The item
     */
    getItem: function(item) {
        if (Ext.isString(item)) {
            item = Ext.getCmp(item);
        } else if (Ext.isNumber(item)) {
            item = this.items[item];
        }
        
        return item;
    },
    
    /**
     * @private
     * @return {Object} Object passed to scrollTo when scrolling
     */
    getScrollAnim: function() {
        return {
            duration: this.scrollDuration, 
            callback: this.updateScrollButtons, 
            scope   : this
        };
    },
    
    /**
     * @private
     * Enables or disables each scroller button based on the current scroll position
     */
    updateScrollButtons: function() {
        if (this.beforeScroller == undefined || this.afterScroller == undefined) {
            return;
        }
        
        var beforeMeth = this.atExtremeBefore()  ? 'addCls' : 'removeCls',
            afterMeth  = this.atExtremeAfter() ? 'addCls' : 'removeCls',
            beforeCls  = this.beforeScrollerCls + '-disabled',
            afterCls   = this.afterScrollerCls  + '-disabled';
        
        this.beforeScroller[beforeMeth](beforeCls);
        this.afterScroller[afterMeth](afterCls);
        this.scrolling = false;
    },
    
    /**
     * @private
     * Returns true if the innerCt scroll is already at its left-most point
     * @return {Boolean} True if already at furthest left point
     */
    atExtremeBefore: function() {
        return this.getScrollPosition() === 0;
    },
    
    /**
     * @private
     * Scrolls to the left by the configured amount
     */
    scrollLeft: function(animate) {
        this.scrollBy(-this.scrollIncrement, animate);
    },
    
    /**
     * @private
     * Scrolls to the right by the configured amount
     */
    scrollRight: function(animate) {
        this.scrollBy(this.scrollIncrement, animate);
    },
    
    /**
     * Scrolls to the given component.
     * @param {String|Number|Ext.Component} item The item to scroll to. Can be a numerical index, component id 
     * or a reference to the component itself.
     * @param {Boolean} animate True to animate the scrolling
     */
    scrollToItem: function(item, animate) {
        item = this.getItem(item);
        
        if (item != undefined) {
            var visibility = this.getItemVisibility(item);
            
            if (!visibility.fullyVisible) {
                var box  = item.getBox(true, true),
                    newX = box.x;
                    
                if (visibility.hiddenRight) {
                    newX -= (this.layout.innerCt.getWidth() - box.width);
                }
                
                this.scrollTo(newX, animate);
            }
        }
    },
    
    /**
     * @private
     * For a given item in the container, return an object with information on whether the item is visible
     * with the current innerCt scroll value.
     * @param {Ext.Component} item The item
     * @return {Object} Values for fullyVisible, hiddenLeft and hiddenRight
     */
    getItemVisibility: function(item) {
        var box         = this.getItem(item).getBox(true, true),
            itemLeft    = box.x,
            itemRight   = box.x + box.width,
            scrollLeft  = this.getScrollPosition(),
            scrollRight = this.layout.innerCt.getWidth() + scrollLeft;
        
        return {
            hiddenLeft  : itemLeft < scrollLeft,
            hiddenRight : itemRight > scrollRight,
            fullyVisible: itemLeft > scrollLeft && itemRight < scrollRight
        };
    }
});