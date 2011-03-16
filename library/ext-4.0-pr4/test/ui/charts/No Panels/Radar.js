Ext.onReady(function () {
    var chart;

    Ext.get('reloadData').on('click', function() {
        store1.loadData(generateData());
    });
    chart = new Ext.chart.Chart({
        width: 800,
        height: 600,
        animate: true,
        store: store1,
        renderTo: Ext.getBody(),
        insetPadding: 20,
        theme: 'Category2',
        axes: [{
            type: 'Radial',
            position: 'radial',
            label: {
                display: true
            }
        }],
        series: [{
            type: 'radar',
            xField: 'name',
            yField: 'data1',
            showMarkers: true,
            markerCfg: {
                radius: 5,
                size: 5
            },
            style: {
                'stroke-width': 2,
                fill: 'none'
            }
        },{
            type: 'radar',
            xField: 'name',
            yField: 'data2',
            showMarkers: true,
            markerCfg: {
                radius: 5,
                size: 5
            },
            style: {
                'stroke-width': 2,
                fill: 'none'
            }
        },{
            type: 'radar',
            xField: 'name',
            yField: 'data3',
            showMarkers: true,
            markerCfg: {
                radius: 5,
                size: 5
            },
            style: {
                'stroke-width': 2,
                fill: 'none'
            }
        }]
    }); 
});