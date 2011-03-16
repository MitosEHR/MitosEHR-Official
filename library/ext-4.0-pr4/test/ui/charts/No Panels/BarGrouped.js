Ext.onReady(function () {
    var chart;

    Ext.get('reloadData').on('click', function() {
        store1.loadData(generateData());
    });
    chart = new Ext.chart.Chart({
        renderTo: Ext.getBody(),
        width: 800,
        height: 600,
        animate: true,
        store: store1,
        legend: {
          position: 'right'  
        },
        axes: [{
            type: 'Numeric',
            position: 'bottom',
            fields: ['data1', 'data2', 'data3'],
            minimum: 0,
            label: {
                renderer: Ext.util.Format.numberRenderer('0,0')
            },
            grid: true,
            title: 'Number of Hits'
        }, {
            type: 'Category',
            position: 'left',
            fields: ['name'],
            title: 'Month of the Year'
        }],
        series: [{
            type: 'bar',
            axis: 'bottom',
            xField: 'name',
            yField: ['data1', 'data2', 'data3']
        }]
    });
});