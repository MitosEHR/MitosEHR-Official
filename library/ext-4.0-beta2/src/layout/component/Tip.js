/**
 * Component layout for Tip/ToolTip/etc. components
 * @class Ext.layout.component.Tip
 * @extends Ext.layout.component.Dock
 * @private
 */

Ext.define('Ext.layout.component.Tip', {

    /* Begin Definitions */

    alias: ['layout.tip'],

    extend: 'Ext.layout.component.Dock',

    /* End Definitions */

    type: 'tip',
    
    onLayout: function(width, height) {
        var me = this,
            owner = me.owner,
            el = owner.el,
            minWidth,
            maxWidth,
            naturalWidth,
            constrainedWidth,
            xy = el.getXY();

        // Position offscreen so the natural width is not affected by the viewport's right edge
        el.setXY([-9999,-9999]);

        // Calculate initial layout
        this.callParent(arguments);

        // Handle min/maxWidth for auto-width tips
        if (!Ext.isNumber(width)) {
            minWidth = owner.minWidth;
            maxWidth = owner.maxWidth;
            naturalWidth = el.getWidth();
            if (naturalWidth < minWidth) {
                constrainedWidth = minWidth;
            }
            else if (naturalWidth > maxWidth) {
                constrainedWidth = maxWidth;
            }
            if (constrainedWidth) {
                this.callParent([constrainedWidth, height]);
            }
        }

        // Restore position
        el.setXY(xy);
    }
});
