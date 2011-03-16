Ext.onReady(function() {
    Ext.create('Ext.resizer.Resizer', {
        el: 'resizeMe'
    });

    Ext.create('Ext.resizer.Resizer',{
        el: 'resizeMe2',
        dynamic: false,
        minWidth: 120
    });

    Ext.create('Ext.resizer.Resizer',{
        el: 'resizeMe3',
        preserveRatio: true
    });

    Ext.create('Ext.resizer.Resizer',{
        el: 'resizeTxt'
    });

    Ext.create('Ext.resizer.Resizer',{
        el: 'resizeImg',
        preserveRatio: true
    });

});