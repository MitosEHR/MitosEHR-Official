Ext.require(['*']);

Ext.onReady(function(){

    var myData = [
        { name : "Rec 0", column1 : "0", column2 : "0" },
        { name : "Rec 1", column1 : "1", column2 : "1" },
        { name : "Rec 2", column1 : "2", column2 : "2" },
        { name : "Rec 3", column1 : "3", column2 : "3" },
        { name : "Rec 4", column1 : "4", column2 : "4" },
        { name : "Rec 5", column1 : "5", column2 : "5" },
        { name : "Rec 6", column1 : "6", column2 : "6" },
        { name : "Rec 7", column1 : "7", column2 : "7" },
        { name : "Rec 8", column1 : "8", column2 : "8" },
        { name : "Rec 9", column1 : "9", column2 : "9" }
    ];

    // Generic fields array to use in both store defs.
    Ext.regModel('DataObject', {
        fields: [
            {name: 'name', mapping : 'name'},
            {name: 'column1', mapping : 'column1'},
            {name: 'column2', mapping : 'column2'}
        ]
    });

    // create the data store
    var firstGridStore = new Ext.data.Store({
        model  : 'DataObject',
        data   : myData
    });


    // Column Model shortcut array
    var headers = [
        { id : 'name', header: "Record Name", width: 160, sortable: true, dataIndex: 'name'},
        {header: "column1", width: 50, sortable: true, dataIndex: 'column1'},
        {header: "column2", width: 50, sortable: true, dataIndex: 'column2'}
    ];

    // declare the source Grid
    var firstGrid = new Ext.grid.GridPanel({
        viewConfig: {
            plugins: {
                ptype: 'gridviewdd',
                dragGroup: 'firstGridDDGroup',
                dropGroup: 'secondGridDDGroup'
            },
            listeners: {
                drop: function(node, data, dropRec, dropPosition) {
                    var dropOn = dropRec ? ' ' + dropPosition + ' ' + dropRec.get('name') : ' on empty view';
                    Ext.example.msg("Drag from right to left", 'Dropped ' + data.records[0].get('name') + dropOn);
                }
            }
        },
        store            : firstGridStore,
        headers          : headers,
        enableDragDrop   : true,
        stripeRows       : true,
        autoExpandColumn : 'name',
        title            : 'First Grid',
        margins          : '0 2 0 0'
    });

    var secondGridStore = new Ext.data.Store({
        model  : 'DataObject'
    });

    // create the destination Grid
    var secondGrid = new Ext.grid.GridPanel({
        viewConfig: {
            plugins: {
                ptype: 'gridviewdd',
                dragGroup: 'secondGridDDGroup',
                dropGroup: 'firstGridDDGroup'
            },
            listeners: {
                drop: function(node, data, dropRec, dropPosition) {
                    var dropOn = dropRec ? ' ' + dropPosition + ' ' + dropRec.get('name') : ' on empty view';
                    Ext.example.msg("Drag from left to right", 'Dropped ' + data.records[0].get('name') + dropOn);
                }
            }
        },
        store            : secondGridStore,
        headers          : headers,
        enableDragDrop   : true,
        stripeRows       : true,
        autoExpandColumn : 'name',
        title            : 'Second Grid',
        margins          : '0 0 0 3'
    });

    //Simple 'border layout' panel to house both grids
    var displayPanel = new Ext.Panel({
        width        : 650,
        height       : 300,
        layout       : {
            type: 'hbox',
            align: 'stretch',
            padding: 5
        },
        renderTo     : 'panel',
        defaults     : { flex : 1 }, //auto stretch
        items        : [
            firstGrid,
            secondGrid
        ],
        bbar    : [
            '->', // Fill
            {
                text    : 'Reset both grids',
                handler : function() {
                    //refresh source grid
                    firstGridStore.loadData(myData);

                    //purge destination grid
                    secondGridStore.removeAll();
                }
            }
        ]
    });
});