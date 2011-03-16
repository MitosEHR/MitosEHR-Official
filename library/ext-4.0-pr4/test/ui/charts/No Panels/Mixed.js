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
        theme: 'Category1',
        store: store1,
        renderTo: Ext.getBody(),
        legend: {
          position: 'right'  
        },
        axes: [{
            type: 'Numeric',
            position: 'left',
            fields: ['data1', 'data2', 'data3'],
            title: 'Number of Hits',
            grid: true
        }, {
            type: 'Category',
            position: 'bottom',
            fields: ['name'],
            title: 'Month of the Year'
        }],
        series: [{
            type: 'column',
            axis: 'left',
            xField: 'name',
            yField: 'data1'
        }, {
            type: 'scatter',
            axis: 'left',
            xField: 'name',
            yField: 'data2',
            markerCfg: {
                type: 'circle'
            }
        }, {
            type: 'line',
            axis: 'left',
            fill: true,
            fillOpacity: 0.5,
            xField: 'name',
            yField: 'data3',
            style: {
                'stroke-width': 0
            }
        }]
    });
});