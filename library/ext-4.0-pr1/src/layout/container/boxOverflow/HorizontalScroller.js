/**
 * @class Ext.layout.container.boxOverflow.HorizontalScroller
 * @extends Ext.layout.container.boxOverflow.Scroller
 * @private
 */
Ext.define('Ext.layout.container.boxOverflow.HorizontalScroller', {

    /* Begin Definitions */

    extend: 'Ext.layout.container.boxOverflow.Scroller',

    /* End Definitions */

    handleOverflow: function(calculations, targetSize) {
        Ext.layout.container.boxOverflow.HorizontalScroller.superclass.superclass.handleOverflow.apply(this, arguments);
        
        return {
            targetSize: {
                height: targetSize.height,
                width : targetSize.width - (this.beforeCt.getWidth() + this.afterCt.getWidth())
            }
        };
    },
    
    /**
     * @private
     * Creates the beforeCt and afterCt elements if they have not already been created
     */
    createInnerElements: function() {
        var target = this.layout.innerCt;
        
        //normal items will be rendered to the innerCt. beforeCt and afterCt allow for fixed positioning of
        //special items such as scrollers or dropdown menu triggers
        if (!this.beforeCt) {
            this.afterCt  = target.insertSibling({cls: this.afterCls},  'before');
            this.beforeCt = target.insertSibling({cls: this.beforeCls}, 'before');
            
            this.createWheelListener();
        }
    },
    
    /**
     * @private
     * Scrolls to the given position. Performs bounds checking.
     * @param {Number} position The position to scroll to. This is constrained.
     * @param {Boolean} animate True to animate. If undefined, falls back to value of this.animateScroll
     */
    scrollTo: function(position, animate) {
        var oldPosition = this.getScrollPosition(),
            newPosition = Ext.Number.constrain(position, 0, this.getMaxScrollRight());
        
        if (newPosition != oldPosition && !this.scrolling) {
            if (animate == undefined) {
                animate = this.animateScroll;
            }
            
            this.layout.innerCt.scrollTo('left', newPosition, animate ? this.getScrollAnim() : false);
            
            if (animate) {
                this.scrolling = true;
            } else {
                this.scrolling = false;
                this.updateScrollButtons();
            }
        }
    },
    
    /**
     * Returns the current scroll position of the innerCt element
     * @return {Number} The current scroll position
     */
    getScrollPosition: function(){
        return parseInt(this.layout.innerCt.dom.scrollLeft, 10) || 0;
    },
    
    /**
     * @private
     * Returns the maximum value we can scrollTo
     * @return {Number} The max scroll value
     */
    getMaxScrollRight: function() {
        return this.layout.innerCt.dom.scrollWidth - this.layout.innerCt.getWidth();
    },
    
    /**
     * @private
     * Returns true if the innerCt scroll is already at its right-most point
     * @return {Boolean} True if already at furthest right point
     */
    atExtremeAfter: function() {
        return this.getScrollPosition() >= this.getMaxScrollRight();
    }
});