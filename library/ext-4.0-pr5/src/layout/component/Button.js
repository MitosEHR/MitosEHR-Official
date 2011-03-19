/**
 * Component layout for buttons
 * @class Ext.layout.component.Button
 * @extends Ext.layout.Component
 * @private
 */
Ext.define('Ext.layout.component.Button', {

    /* Begin Definitions */

    alias: ['layout.button'],

    extend: 'Ext.layout.Component',

    /* End Definitions */

    type: 'button',

    cellClsRE: /-btn-(tl|br)\b/,

    /**
     * Set the dimensions of the inner &lt;button&gt; element to match the
     * component dimensions.
     */
    onLayout: function(width, height) {
        var me = this,
            isNum = Ext.isNumber,
            owner = me.owner,
            ownerEl = owner.el,
            btnEl = owner.btnEl,
            minWidth = owner.minWidth,
            maxWidth = owner.maxWidth,
            btnWidth, btnHeight, ownerWidth, adjWidth, btnFrameWidth, metrics;

        me.getTargetInfo();
        me.callParent(arguments);

        adjWidth = me.adjWidth;
        btnWidth = (isNum(width) ? width - adjWidth : width);
        btnHeight = (isNum(height) ? height - me.adjHeight : height);

        btnEl.unclip();
        me.setTargetSize(width, height);
        me.setElementSize(btnEl, btnWidth, btnHeight);

        if (!isNum(width)) {
            // In IE7 strict mode button elements with width:auto get strange extra side margins within
            // the wrapping table cell, but they go away if the width is explicitly set. So we measure
            // the size of the text and set the width to match.
            if (owner.text && Ext.isIE7 && Ext.isStrict && btnEl && btnEl.getWidth() > 20) {
                btnFrameWidth = me.btnFrameWidth;
                metrics = Ext.util.TextMetrics.measure(btnEl, owner.text);
                ownerEl.setWidth(metrics.width + btnFrameWidth + adjWidth);
                btnEl.setWidth(metrics.width + btnFrameWidth);
            } else {
                // Remove any previous fixed widths
                ownerEl.setWidth(null);
                btnEl.setWidth(null);
            }

            // Handle maxWidth/minWidth config
            if (minWidth || maxWidth) {
                ownerWidth = ownerEl.getWidth();
                if (minWidth && (ownerWidth < minWidth)) {
                    ownerWidth = minWidth;
                    me.setTargetSize(ownerWidth, height);
                    me.setElementSize(btnEl, ownerWidth - adjWidth, btnHeight);
                }
                else if (maxWidth && (ownerWidth > maxWidth)) {
                    btnEl.clip();
                    ownerWidth = maxWidth;
                    me.setTargetSize(ownerWidth, height);
                    me.setElementSize(btnEl, ownerWidth - adjWidth, btnHeight);
                }
            }
        }
    },

    getTargetInfo: function() {
        var me = this,
            owner = me.owner,
            ownerEl = owner.el,
            frameSize = me.frameSize;

        if (!('adjWidth' in me)) {
            Ext.apply(me, {
                // Width adjustment must take into account the arrow area. The btnWrap is the <em> which has padding to accommodate the arrow.
                adjWidth: frameSize.left + frameSize.right + ownerEl.getBorderWidth('lr') + ownerEl.getPadding('lr') + owner.btnWrap.getPadding('lr'),
                adjHeight: frameSize.top + frameSize.bottom + ownerEl.getBorderWidth('tb') + ownerEl.getPadding('tb'),
                btnFrameWidth: owner.btnEl.getFrameWidth('lr')
            });
        }

        return me.callParent();
    }
});