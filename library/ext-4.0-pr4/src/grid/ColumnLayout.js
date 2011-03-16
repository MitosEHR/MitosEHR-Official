/**
 * @class Ext.grid.ColumnLayout
 * @extends Ext.layout.container.HBox
 */
Ext.define('Ext.grid.ColumnLayout', {
    extend: 'Ext.layout.container.HBox',
    alias: 'layout.gridcolumn',
    clearInnerCtOnLayout: false,
    constructor: function() {
        Ext.grid.ColumnLayout.superclass.constructor.apply(this, arguments);
        this.availableSpaceOffset = Ext.getScrollBarWidth() - 2;
    },
    // FIX: when flexing we actually don't have enough space as we would
    // typically because of the scrollOffset on the GridView, must reserve this
    updateInnerCtSize: function(tSize, calcs) {
        if (calcs.meta.tooNarrow) {
            var width   = calcs.meta.desiredSize,
                height  = tSize.height,
                offset  = this.availableSpaceOffset;

            // if ColumnModel has been placed in a container.
            //if (this.owner.ownerCt) {
            //    offset = this.owner.ownerCt.view.getScrollOffset();
            //}
            //offset = Ext.getScrollBarWidth() - 2;

            this.innerCt.setSize(width + offset, height);
        } else {
            return Ext.grid.ColumnLayout.superclass.updateInnerCtSize.apply(this, arguments);
        }
    }
});
