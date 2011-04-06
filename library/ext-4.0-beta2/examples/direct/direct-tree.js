Ext.require([
    'Ext.direct.*',
    'Ext.data.*',
    'Ext.tree.*',
    'Ext.grid.Scroller'
]);

Ext.onReady(function() {    
    Ext.direct.Manager.addProvider(Ext.app.REMOTING_API);

    var store = new Ext.data.TreeStore({
        root: {
            expanded: true
        },
        proxy: {
            type: 'direct',
            directFn: TestAction.getTree,
            paramOrder: ['node']
        }
    });
    
    
    // create the Tree
    var tree = new Ext.tree.TreePanel({
        store: store,
        height: 350,
        width: 600,
        title: 'Tree Sample',
        rootVisible: false,
        renderTo: Ext.getBody()
    });
});