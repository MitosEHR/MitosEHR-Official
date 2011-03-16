Ext.onReady(function () {
    var chart;

    store1.loadData(generateData(5));

    Ext.get('reloadData').on('click', function() {
        store1.loadData(generateData(5));
    });
    chart = new Ext.chart.Chart({
        width: 800,
        height: 600,
        animate: true,
        store: store1,
        renderTo: Ext.getBody(),
        shadow: true,
        series: [{
            type: 'pie',
            animate: true,
            angleField: 'data1', //bind angle span to visits
            lengthField: 'data2', //bind pie slice length to views
            highlight: {
              segment: {
                margin: 20
              }
            },
            label: {
                field: 'name',   //bind label text to name
                display: 'rotate', //rotate labels (also middle, out).
                font: '14px Arial',
                contrast: true
            },                                
            style: {
                'stroke-width': 1,
                'stroke': '#fff'
            },
            //add renderer
            renderer: function(sprite, record, attr, index, store) {
                var value = (record.get('data1') >> 0) % 9;
                var color = [ "#94ae0a", "#115fa6","#a61120", "#ff8809", "#ffd13e", "#a61187", "#24ad9a", "#7c7474", "#a66111"][value];
                return Ext.apply(attr, {
                    fill: color
                });
            }
        }]
    });
});