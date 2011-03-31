Ext.require([
    'Ext.tree.*',
    'Ext.data.*'
]);

Ext.onReady(function() {    
    var store = new Ext.data.TreeStore({
        proxy: {
            type: 'ajax',
            url: 'get-nodes.php'
        },
        root: {
            text: 'Ext JS',
            id: 'src',
            expanded: true
        },
        folderSort: true,
        sorters: [{
            property: 'text',
            direction: 'ASC'
        }]
    });
    
    var tree = new Ext.tree.TreePanel({
        store: store,
        viewConfig: {
            plugins: {
                ptype: 'treeviewdd'
            }
        },
        renderTo: 'tree-div',
        height: 300,
        width: 250
    });
});