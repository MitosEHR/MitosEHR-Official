Ext.require([
    'Ext.tree.*',
    'Ext.data.*'
]);

Ext.onReady(function() {    
    var store = new Ext.data.TreeStore({
        proxy: {
            type: 'ajax',
            url: 'check-nodes.json'
        },
        root: {
            expanded: true
        },
        sorters: [{
            property: 'leaf',
            direction: 'ASC'
        }, {
            property: 'text',
            direction: 'ASC'
        }]
    });
    
    var tree = new Ext.tree.TreePanel({
        store: store,
        rootVisible: false,
        useArrows: true,
        frame: true,
        title: 'Check Tree',
        renderTo: 'tree-div',
        width: 200,
        height: 200
    });
});