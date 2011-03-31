/**
 * @class Ext.grid.ColumnLayout
 * @extends Ext.layout.container.HBox
 */
Ext.define('Ext.grid.ColumnLayout', {
    extend: 'Ext.layout.container.HBox',
    alias: 'layout.gridcolumn',

    // Height-stretched innerCt must be able to revert back to unstretched height
    clearInnerCtOnLayout: true,

    constructor: function() {
        var me = this;
        me.callParent(arguments);
        if (!Ext.isDefined(me.availableSpaceOffset)) {
            me.availableSpaceOffset = (Ext.getScrollBarWidth() - 2);
        }
    },

    beforeLayout: function() {
        var me = this,
            i = 0,
            items = me.getLayoutItems(),
            len = items.length,
            item;
        me.callParent(arguments);

        me.innerCt.setHeight(23);

        // Unstretch child items before the layout which stretches them.
        if (me.align == 'stretchmax') {
            for (; i < len; i++) {
                item = items[i];
                item.el.setStyle({
                    height: 'auto'
                });
                item.titleContainer.setStyle({
                    height: 'auto',
                    paddingTop: '0'
                });
                if (item.componentLayout && item.componentLayout.lastComponentSize) {
                    item.componentLayout.lastComponentSize.height = item.el.dom.offsetHeight;
                }
            }
        }
    },

    afterLayout: function() {
        var me = this,
            i = 0,
            items = me.getLayoutItems(),
            len = items.length;
        me.callParent(arguments);

        // Set up padding in items
        if (me.align == 'stretchmax') {
            for (; i < len; i++) {
                items[i].setPadding();
            }
        }
    },

    // FIX: when flexing we actually don't have enough space as we would
    // typically because of the scrollOffset on the GridView, must reserve this
    updateInnerCtSize: function(tSize, calcs) {
        // Columns must not account for scroll offset
        if (!this.isColumn && calcs.meta.tooNarrow) {
            tSize.width = calcs.meta.desiredSize + this.availableSpaceOffset;
        }
        return this.callParent(arguments);
    }
});