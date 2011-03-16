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
            position: 'bottom'
        },
        axes: [{
            type: 'Numeric',
            grid: true,
            position: 'left',
            fields: ['data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7'],
            title: 'Number of Hits',
            grid: {
                odd: {
                    opacity: 1,
                    fill: '#ddd',
                    stroke: '#bbb',
                    'stroke-width': 1
                }
            },
            minimum: 0,
            adjustMinimumByMajorUnit: 0
        }, {
            type: 'Category',
            position: 'bottom',
            fields: ['name'],
            title: 'Month of the Year',
            grid: true,
            label: {
                rotate: {
                    degrees: 315
                }
            }
        }],
        series: [{
            type: 'area',
            highlight: true,
            axis: 'left',
            xField: 'name',
            yField: ['data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7'],
            style: {
                opacity: 0.93
            }
        }]
    }); 
});