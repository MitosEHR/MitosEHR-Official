Ext.onReady(function() {
    var pnl = Ext.create('Ext.Panel', {
        renderTo: Ext.getBody(),
        title: 'Resize Component',
        width: 100,
        height: 300,
        resizable: true,
        draggable: true
    });

    var win = Ext.create('Ext.Window', {
        title: 'Resize Component',
        width: 100,
        height: 300,
        resizable: true,
        constrain: true
    });
    win.show();
});