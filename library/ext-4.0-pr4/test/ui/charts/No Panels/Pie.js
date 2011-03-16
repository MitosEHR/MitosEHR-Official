Ext.onReady(function () {
    var donut = false,
        chart;
    function refresh() {
        var series = chart.series.items,
            len = series.length;

        for (var i = 0; i < len; i++) {
            var s = series[i];
            s.donut = donut;
        }
        chart.redraw();
    }

    store1.loadData(generateData(5));
    Ext.get('reloadData').on('click', function() {
        store1.loadData(generateData(5));
    });
    Ext.get('donutBtn').on('click', function() {
        donut = (donut) ? false : 35;
        refresh();
    });

    chart = new Ext.chart.Chart({
        width: 800,
        height: 600,
        animate: true,
        store: store1,
        renderTo: Ext.getBody(),
        shadow: true,
        legend: {
            position: 'right'
        },
        insetPadding: 25,
        theme: 'Base:gradients',
        series: [{
            type: 'pie',
            field: 'data1',
            showInLegend: true,
            highlight: {
              segment: {
                margin: 20
              }
            },
            label: {
                field: 'name',
                display: 'rotate',
                contrast: true,
                font: '18px Arial'
            },
            animate: true
        }]
    });
});