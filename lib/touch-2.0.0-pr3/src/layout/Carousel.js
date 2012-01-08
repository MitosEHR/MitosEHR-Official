Ext.define('Ext.layout.Carousel', {
    extend: 'Ext.layout.Default',

    alias: 'layout.carousel',

    onItemAdd: function(item) {
        if (item.isInnerItem()) {
            return;
        }

        this.callParent(arguments);
    },

    onItemRemove: function(item) {
        if (item.isInnerItem()) {
            return;
        }

        this.callParent(arguments);
    }
});
