Ext.onReady(function() {
    Ext.create('Ext.Viewport', {
        layout: 'absolute',
        items: [{
            x: 50,
            y: 200,
            xtype: 'panel',
            title: 'Foo',
            width: 300,
            height: 200,
            html: 'Sample'
        }]
    });
});