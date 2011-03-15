Ext.require([
    'Ext.tab.*', 
    'Ext.window.*',
    'Ext.layout.container.Border'
]);
Ext.onReady(function(){
    var button = Ext.get('show-btn');
    
    button.on('click', function(){
    
        var win = Ext.create('widget.window', {
            title: 'Layout Window',
            closable: true,
            width: 600,
            height: 350,
            plain: true,
            layout: 'border',
            bodyStyle: 'padding: 5px;',
            items: [{
                region: 'west',
                title: 'Navigation',
                width: 200,
                split: true,
                collapsible: true,
                floatable: false
            }, {
                region: 'center',
                xtype: 'tabpanel',
                items: [{
                    title: 'Bogus Tab',
                    html: 'Hello world 1'
                }, {
                    title: 'Another Tab',
                    html: 'Hello world 2'
                }, {
                    title: 'Closable Tab',
                    html: 'Hello world 3',
                    closable: true
                }]
            }]
        });
        
        win.show(this);
    });
});
