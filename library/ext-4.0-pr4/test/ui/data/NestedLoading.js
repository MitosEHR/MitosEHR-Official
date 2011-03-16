Ext.onReady(function() {
    Ext.regModel('User', {
        fields: ['id', 'name'],
        hasMany: 'Order',

        proxy: {
            type: 'ajax',
            url :' OrderData.json',
            reader: {
                type: 'json',
                root: 'users'
            }
        }
    });

    Ext.regModel('Order', {
        fields: ['id', 'user_id', 'status'],
        belongsTo: 'User',
        hasMany: 'OrderItem'
    });

    Ext.regModel('OrderItem', {
        fields: ['id', 'order_id', 'product_id', 'price', 'quantity'],
        belongsTo: ["Order", "Product"]
    });

    Ext.regModel('Product', {
        fields: ['id', 'name', 'description', 'price', 'image'],
        hasMany: "OrderItem"
    });
    
    Ext.createByAlias('widget.dataview', {
        renderTo: Ext.getBody(),
        store: new Ext.data.Store({
            model: 'User',
            autoLoad: true
        }),
        itemSelector: 'div.order',
        tpl: [
            '<tpl for=".">',
                '{name}',
            '</tpl>'
        ]
    });
});