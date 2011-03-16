Ext.require([
    'Ext.data.*',
    'Ext.grid.*',
    'Ext.tree.*'
]);

Ext.onReady(function() {
    //we want to setup a model and store instead of using dataUrl
    Ext.regModel('Task', {
        fields: [
            {name: 'task',     type: 'string'},
            {name: 'user',     type: 'string'},
            {name: 'duration', type: 'string'}
        ]
    });
    
    var store = new Ext.data.TreeStore({
        model: 'Task',
        proxy: {
            type: 'ajax',
            //the store will get the content from the .json file
            url: 'column-data.json',
            reader: {
                type: 'tree',
                root: 'children'
            }
        }
    });
    
    var tree = new Ext.tree.TreePanel({
        width: 550,
        height: 300,
        rootVisible: false,
        autoScroll: true,
        title: 'Example Tasks',
        renderTo: Ext.getBody(),
        
        store: store,

        headers: [{
            xtype: 'treeheader',
            header: 'Task',
            width: 330,
            dataIndex: 'task'
        },{
            header: 'Duration',
            width: 100,
            dataIndex: 'duration'
        },{
            header: 'Assigned To',
            width: 100,
            dataIndex: 'user'
        }]
        
        //loader + root is no longer needed in 4.x as this information is defined in the store above
    });
});