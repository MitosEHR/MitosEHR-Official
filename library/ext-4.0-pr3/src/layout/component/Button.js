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
            outerEl = owner.el,
            btnEl = owner.btnEl,
            minWidth = owner.minWidth,
            maxWidth = owner.maxWidth,
            btnWidth, btnHeight,
            outerWidth;

        me.getTargetInfo();
        me.callParent(arguments);

        btnWidth = (isNum(width) ? width - me.adjWidth : width);
        btnHeight = (isNum(height) ? height - me.adjHeight : height);
        me.setElementSize(btnEl, btnWidth, btnHeight);

        if (owner.text && !Ext.isNumber(width)) {
            owner.getTargetEl().setWidth('auto');
            if (Ext.isIE7 && Ext.isStrict) {
                if (btnEl && btnEl.getWidth() > 20) {
                    btnEl.clip();
                    btnEl.setWidth(Ext.util.TextMetrics.measure(btnEl, owner.text).width + me.btnFrameWidth);
                }
            }
        }

        // Handle maxWidth/minWidth config
        if (!isNum(width) && (minWidth || maxWidth)) {
            btnEl.setStyle('width', null);
            outerWidth = outerEl.getWidth();

            if (minWidth && (outerWidth < minWidth)) {
                me.setElementSize(btnEl, minWidth - me.adjWidth, btnHeight);
            } else if (maxWidth && (outerWidth > maxWidth)) {
                me.setElementSize(btnEl, maxWidth - me.adjWidth, btnHeight);
            }
        }
    },

    getTargetInfo: function() {
        var me = this,
            owner = me.owner,
            outerEl = owner.el,
            frameSize = me.frameSize;

        if (!me.adjWidth) {
            Ext.apply(me, {
                adjWidth: frameSize.left + frameSize.right + outerEl.getBorderWidth('lr') + outerEl.getPadding('lr') + owner.btnWrap.getPadding('lr'),
                adjHeight: frameSize.top + frameSize.bottom + outerEl.getBorderWidth('tb') + outerEl.getPadding('tb'),
                btnFrameWidth: owner.btnEl.getFrameWidth('lr')
            });
        }
    }
});