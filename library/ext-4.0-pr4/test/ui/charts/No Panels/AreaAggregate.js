Ext.onReady(function () {
    var chart;
    function generateData(){
        var data = [], p, n = 2,
            i, j, days = [], dclone, 
            rd, m = 28;

        while (m--) {
            days.unshift(m + 1);
        }

        for (i = 1; i <= 12; i++) {
            rd = [];
            dclone = days.slice();
            for (j = 0; j < n; j++) {
                p = Math.random() * dclone.length >> 0;
                rd.push(dclone.splice(p, 1)[0]);
            }
            rd.sort(function(a, b) { return a - b; });
            for (j = 0; j < n; j++) {
                data.push({
                    date: i + '/' + rd[j] + '/2011',
                    visits: Math.random() * 10000,
                    views: Math.random() * 10000,
                    veins: Math.random() * 10000
                });
            }
        }

        return data;
    }

    var group = false,
        groupOp = [{
            dateFormat: 'M d',
            groupBy: 'year,month,day' 
        }, {
            dateFormat: 'M',
            groupBy: 'year,month'
        }];
    
    function regroup() {
        group = !group;
        var axis = chart.axes.get(1),
            selectedGroup = groupOp[+group];
        axis.dateFormat = selectedGroup.dateFormat;
        axis.groupBy = selectedGroup.groupBy;
        
       chart.redraw();
    }
    
    var store = new Ext.data.JsonStore({
        fields: ['date', 'visits', 'views', 'veins'],
        data: generateData()
    });    
    store.loadData(generateData());

    Ext.get('reloadData').on('click', function() {
        store.loadData(generateData());
    });
    Ext.get('toggleGroup').on('click', function() {
        regroup();
    });

    chart = new Ext.chart.Chart({
        width: 800,
        height: 600,
        store: store,
        animate: true,
        renderTo: Ext.getBody(),
        legend: {
            position: 'bottom'
        },
        axes: [{
            type: 'Numeric',
            grid: true,
            position: 'left',
            fields: ['views', 'visits', 'veins'],
            title: 'Number of Hits'
        }, {
            type: 'Time',
            position: 'bottom',
            fields: 'date',
            title: 'Days',
            dateFormat: 'M d',
            groupBy: 'year,month,day',
            aggregateOp: 'sum'
        }],
        series: [{
            type: 'area',
            highlight: true,
            axis: 'left',
            xField: 'date',
            yField: ['visits', 'views', 'veins'],
            style: {
                'stroke-width': 0.5,
                stroke: '#777',
                opacity: 0.9
            },
            label: {
                display: 'none',
                field: ['visits', 'views', 'veins'],
                renderer: function(v) { return v >> 0; },
                'text-anchor': 'middle'
            }
        }]
    }); 
});