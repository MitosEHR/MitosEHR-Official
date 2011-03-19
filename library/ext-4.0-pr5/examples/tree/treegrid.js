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
            url: 'treegrid.json'
        },
        root: {
            expanded: true
        }
    });
    
    //Ext.ux.tree.TreeGrid is no longer a Ux. You can simply use a tree.TreePanel
    var tree = new Ext.tree.TreePanel({
        title: 'Core Team Projects',
        
        width: 500,
        height: 300,
        renderTo: Ext.getBody(),

        useArrows: true,
        rootVisible: false,
        
        store: store,
        
        //the 'columns' property is now 'headers'
        headers: [{
            xtype: 'treeheader', //this is so we know which column will show the tree
            text: 'Task',
            flex: 2,
            dataIndex: 'task'
        },{
            //we must use the templateheader component so we can use a custom tpl
            xtype: 'templateheader',
            text: 'Duration',
            flex: 1,
            dataIndex: 'duration',
            align: 'center',
            //add in the custom tpl for the rows
            tpl: new Ext.XTemplate('{duration:this.formatHours}', {
                formatHours: function(v) {
                    if (v < 1) {
                        return Math.round(v * 60) + ' mins';
                    } else if (Math.floor(v) !== v) {
                        var min = v - Math.floor(v);
                        return Math.floor(v) + 'h ' + Math.round(min * 60) + 'm';
                    } else {
                        return v + ' hour' + (v === 1 ? '' : 's');
                    }
                }
            })
        },{
            text: 'Assigned To',
            flex: 1,
            dataIndex: 'user'
        }]
    });
});