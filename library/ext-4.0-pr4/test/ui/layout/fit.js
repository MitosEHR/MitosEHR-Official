Ext.onReady(function() {
    Ext.create('Ext.Viewport', {
        layout: 'fit',
        items: [{
            xtype: 'panel',
            title: 'Foo',
            html: 'Sample'
        }]
    });
});