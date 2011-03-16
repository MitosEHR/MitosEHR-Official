Ext.require([
    'Ext.direct.*',
    'Ext.data.*',
    'Ext.tree.*',
    'Ext.grid.Scroller'
]);

Ext.onReady(function() {    
    Ext.direct.Manager.addProvider(Ext.app.REMOTING_API);

    Ext.regModel('TreeItem', {
        idProperty: 'id',
        fields: [
            {name: 'id',       type: 'string'},
            {name: 'text', type: 'string'}
        ]
    });

    var store = new Ext.data.TreeStore({
        model: 'TreeItem',
        proxy: {
            type: 'direct',
            directFn: TestAction.getTree,
            paramOrder: ['node'],
            reader: {
                type: 'tree'
            }
        }
    });
    
    
    // create the Tree
    var tree = new Ext.tree.TreePanel({
        store: store,
        hideHeaders: true,
        headers: [{
            xtype    : 'treeheader',
            text     : 'Name',
            flex     : 1,
            dataIndex: 'text'
        }],
        height: 350,
        width: 600,
        title: 'Tree Sample',
        renderTo: Ext.getBody()
    });
});