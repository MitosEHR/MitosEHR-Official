Ext.require(['*']);

Ext.onReady(function(){
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
        id: 'tree',
        store: store,
        width: 250,
        height: 300,
        viewConfig: {
            plugins: {
                ptype: 'treeviewdd',
                appendOnly: true
            }
        },
        renderTo: document.body
    });
    
    var store2 = new Ext.data.TreeStore({
        proxy: {
            type: 'ajax',
            url: 'get-nodes.php'
        },
        root: {
            text: 'Custom Ext JS',
            id: 'src',
            expanded: true,
            children: []
        },
        folderSort: true,
        sorters: [{
            property: 'text',
            direction: 'ASC'
        }]
    });
    
    var tree2 = new Ext.tree.TreePanel({
        id: 'tree2',
        width: 250,
        height: 300,
        store: store2,
        viewConfig: {
            plugins: {
                ptype: 'treeviewdd',
                appendOnly: true
            }
        },
        renderTo: document.body
    });
});