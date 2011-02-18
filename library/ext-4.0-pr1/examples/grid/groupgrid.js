Ext.require('Ext.grid.*');
Ext.onReady(function() {
    var grid = new Ext.grid.GridPanel({
        renderTo: Ext.getBody(),
        store: Restaurants,
        width: 600,
        height: 400,
        title: 'Restaurants',
        items: [{
            features: [{
                ftype: 'grouping'
            }],
            headers: [{
                text: 'Name',
                flex: 1,
                dataIndex: 'name'
            },{
                text: 'Cuisine',
                flex: 1,
                dataIndex: 'cuisine'
            }]
        }]
    });
});