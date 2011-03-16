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
            btnWidth, btnHeight, ownerWidth, metrics;

        me.getTargetInfo();
        me.callParent(arguments);

        btnWidth = (isNum(width) ? width - me.adjWidth : width);
        btnHeight = (isNum(height) ? height - me.adjHeight : height);
        me.setElementSize(btnEl, btnWidth, btnHeight);

        if (!Ext.supports.CSS3BorderRadius) {
            owner.getTargetEl().repaint();
        }

        if (!isNum(width) && owner.text) {
            owner.getTargetEl().setWidth('auto');
            // In IE7 strict mode button elements get wrong paddings on the left and right.
            // We measure the text width and size the button elements according to that.
            if (Ext.isIE7 && Ext.isStrict) {
                if (btnEl && btnEl.getWidth() > 20) {
                    btnEl.clip();
                    metrics = Ext.util.TextMetrics.measure(btnEl, owner.text);
                    owner.getEl().setWidth(metrics.width + me.btnFrameWidth + me.adjWidth);
                    btnEl.setWidth(metrics.width + me.btnFrameWidth);
                }
            }
        }
        
        // Handle maxWidth/minWidth config
        if (!isNum(width) && (minWidth || maxWidth)) {
            btnEl.setStyle('width', null);
            btnEl.setStyle('overflow', null);
            ownerWidth = ownerEl.getWidth();

            if (minWidth && (ownerWidth < minWidth)) {
                me.setElementSize(btnEl, minWidth - me.adjWidth, btnWidth);
            }
            else if (maxWidth && (ownerWidth > maxWidth)) {
                btnEl.setStyle('overflow', 'hidden');
                me.setElementSize(btnEl, maxWidth - me.adjWidth, btnHeight);
            }
        }
    },

    getTargetInfo: function() {
        var me = this,
            owner = me.owner,
            ownerEl = owner.el,
            frameSize = me.frameSize;

        if (!me.adjWidth) {
            Ext.apply(me, {
                // Width adjustment must take into account the arrow area. The btnWrap is the <em> which has padding to accommodate the arrow.
                adjWidth: frameSize.left + frameSize.right + ownerEl.getBorderWidth('lr') + ownerEl.getPadding('lr') + owner.btnWrap.getPadding('lr'),
                adjHeight: frameSize.top + frameSize.bottom + ownerEl.getBorderWidth('tb') + ownerEl.getPadding('tb'),
                btnFrameWidth: owner.btnEl.getFrameWidth('lr')
            });
        }
    }
});