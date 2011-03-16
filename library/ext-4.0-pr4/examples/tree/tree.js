Ext.require([
    'Ext.tree.*',
    'Ext.data.*'
]);

Ext.onReady(function() {    
    Ext.regModel('File', {
        idProperty: 'id',
        fields: [
            {name: 'id',       type: 'string'},
            {name: 'fileName', type: 'string'}
        ]
    });

    var store = new Ext.data.TreeStore({
        model: 'File',
        proxy: {
            type: 'ajax',
            url: 'getSourceFiles.php',
            reader: {
                type: 'tree',
                root: 'children'
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
            dataIndex: 'fileName'
        }],
        height: 350,
        width: 400,
        title: 'Directory Listing',
        renderTo: 'tree-example',
        collapsible: true
    });
});