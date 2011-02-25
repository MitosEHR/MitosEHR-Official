Ext.require(['Ext.data.*', 'Ext.util.Date']);

Ext.onReady(function() {

    window.generateData = function(n){
        var data = [],
            p = (Math.random() *  11) + 1,
            i;
        for (i = 0; i < (n || 12); i++) {
            data.push({
                name: Ext.Date.monthNames[i],
                data1: Math.floor(Math.max((Math.random() * 100), 20)),
                data2: Math.floor(Math.max((Math.random() * 100), 20)),
                data3: Math.floor(Math.max((Math.random() * 100), 20)),
                data4: Math.floor(Math.max((Math.random() * 100), 20)),
                data5: Math.floor(Math.max((Math.random() * 100), 20)),
                data6: Math.floor(Math.max((Math.random() * 100), 20)),
                data7: Math.floor(Math.max((Math.random() * 100), 20)),
                data8: Math.floor(Math.max((Math.random() * 100), 20)),
                data9: Math.floor(Math.max((Math.random() * 100), 20))
            });
        }
        return data;
    };
    
    window.generateDataNegative = function(n){
        var data = [],
            p = (Math.random() *  11) + 1,
            i;
        for (i = 0; i < (n || 12); i++) {
            data.push({
                name: Ext.Date.monthNames[i],
                data1: Math.floor(((Math.random() - 0.5) * 100)),
                data2: Math.floor(((Math.random() - 0.5) * 100)),
                data3: Math.floor(((Math.random() - 0.5) * 100)),
                data4: Math.floor(((Math.random() - 0.5) * 100)),
                data5: Math.floor(((Math.random() - 0.5) * 100)),
                data6: Math.floor(((Math.random() - 0.5) * 100)),
                data7: Math.floor(((Math.random() - 0.5) * 100)),
                data8: Math.floor(((Math.random() - 0.5) * 100)),
                data9: Math.floor(((Math.random() - 0.5) * 100))
            });
        }
        return data;
    };

    window.store1 = Ext.create('Ext.data.JsonStore', {
        fields: ['name', 'data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7', 'data9', 'data9'],
        data: generateData()
    });
    window.storeNegatives = Ext.create('Ext.data.JsonStore', {
        fields: ['name', 'data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7', 'data9', 'data9'],
        data: generateDataNegative()
    });
    window.store3 = Ext.create('Ext.data.JsonStore', {
        fields: ['name', 'data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7', 'data9', 'data9'],
        data: generateData()
    });
    window.store4 = Ext.create('Ext.data.JsonStore', {
        fields: ['name', 'data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7', 'data9', 'data9'],
        data: generateData()
    });
    window.store5 = Ext.create('Ext.data.JsonStore', {
        fields: ['name', 'data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7', 'data9', 'data9'],
        data: generateData()
    });    
    
    
});
