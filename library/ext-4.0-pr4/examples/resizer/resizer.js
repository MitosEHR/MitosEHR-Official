Ext.require([
    'Ext.resizer.Resizer', 
    'widget.panel', 
    'widget.window'
]);
Ext.onReady(function() {
    Ext.create('Ext.resizer.Resizer', {
        el: 'resizeMe'
    });

    Ext.create('Ext.resizer.Resizer', {
        el: 'resizeMe2',
        dynamic: false,
        minWidth: 90
    });

    Ext.create('Ext.resizer.Resizer', {
        el: 'resizeMe3',
        preserveRatio: true
    });

    Ext.create('Ext.resizer.Resizer', {
        el: 'resizeTxt'
    });

    Ext.create('Ext.resizer.Resizer', {
        el: 'resizeImg',
        preserveRatio: true
    });
    
    Ext.createWidget('panel', {
        renderTo: 'panel1',
        title: 'Resize Component',
        width: 120,
        height: 120,
        resizable: true,
        draggable: true,
        html: 'Some content'
    });

    var win = Ext.createWidget('window', {
        title: 'Resize Component',
        width: 100,
        height: 300,
        resizable: true,
        constrain: true,
        html: 'Some content'
    });
    
    win.show();
});