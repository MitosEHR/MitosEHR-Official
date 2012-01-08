/**
 * @private - To be made a sample
 */
Ext.define('Ext.dataview.ListDisclosure', {
    extend: 'Ext.Component',
    xtype : 'listdisclosure',

    /**
     * @event tap
     * Fires whenever the tap event is triggered on the DataItem
     * @param {Ext.dataview.DataItem} this
     * @param {Ext.EventObject} e The event object
     */

    config: {
        // @inherit
        baseCls: Ext.baseCSSPrefix + 'list-disclosure'
    },

    initialize: function() {
        var me = this;

        me.callParent();

        me.element.on({
            tap: 'onTap',
            scope: me
        });
    },

    onTap: function(e) {
        this.fireEvent('tap', this, e);
    }
});
