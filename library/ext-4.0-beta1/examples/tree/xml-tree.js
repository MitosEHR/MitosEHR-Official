Ext.require([
    'Ext.tree.*',
    'Ext.data.*'
]);

Ext.onReady(function() {    

    var store = new Ext.data.TreeStore({
        proxy: {
            type: 'ajax',
            url: 'get-nodes.php',
            extraParams: {
                isXml: true    
            },
            reader: {
                type: 'xml',
                root: 'nodes',
                record: 'node'
            }
        },
        sorters: [{
            property: 'leaf',
            direction: 'ASC'
        },{
            property: 'text',
            direction: 'ASC'
        }],
        root: {
            text: 'Ext JS',
            id: 'src',
            expanded: true
        }
    });
    
    // create the Tree
    var tree = new Ext.tree.TreePanel({
        store: store,
        hideHeaders: true,
        rootVisible: true,
        viewConfig: {
            plugins: [{
                ptype: 'treeviewdd'
            }]
        },
        height: 350,
        width: 400,
        title: 'Directory Listing',
        renderTo: 'tree-example',
        collapsible: true
    });
});