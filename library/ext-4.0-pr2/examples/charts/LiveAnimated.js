Ext.onReady(function () {
    var chart;
    var generateData = (function() {
        var data = [], i = 0, 
            last = false,
            date = new Date('1/1/2011'),
            seconds = +date,
            min = Math.min,
            max = Math.max,
            random = Math.random;
        return function() {
            data = data.slice();
            data.push({
                date:  Ext.Date.format(Ext.Date.add(date, Ext.Date.DAY, i++), 'm/d/y'),
                visits: min(100, max(last? last.visits + (random() - 0.5) * 20 : random() * 100, 0)),
                views: min(100, max(last? last.views + (random() - 0.5) * 10 : random() * 100, 0)),
                users: min(100, max(last? last.users + (random() - 0.5) * 20 : random() * 100, 0))
            });
            last = data[data.length -1];
            return data;
        };
    })();

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
        fields: ['date', 'visits', 'views', 'users'],
        data: generateData()
    });
    
    var intr = setInterval(function() {
        var gs = generateData();
        var toDate = new Date(timeAxis.toDate),
            lastDate = new Date(gs[gs.length - 1].date),
            markerIndex = chart.markerIndex || 0;
        if (+toDate < +lastDate) {
            markerIndex = 1;
            timeAxis.toDate = Ext.Date.format(lastDate, 'm/d/y');
            timeAxis.fromDate = Ext.Date.format(Ext.Date.add(new Date(timeAxis.fromDate), Ext.Date.DAY, 1), 'm/d/y');
            chart.markerIndex = markerIndex;
        }
        store.loadData(gs);
    }, 1000);

    Ext.create('Ext.Window', {
        width: 800,
        height: 600,
        hidden: false,
        maximizable: true,
        title: 'Live Animated Chart',
        renderTo: Ext.getBody(),
        layout: 'fit',
        items: [{
            xtype: 'chart',
            id: 'chartCmp',
            store: store,
            animate: true,
            axes: [{
                type: 'Numeric',
                grid: true,
                minimum: 0,
                maximum: 100,
                position: 'left',
                fields: ['views', 'visits', 'users'],
                title: 'Number of Hits',
                grid: {
                    odd: {
                        fill: '#dedede',
                        stroke: '#ddd',
                        'stroke-width': 0.5
                    }
                }
            }, {
                type: 'Time',
                position: 'bottom',
                fields: 'date',
                title: 'Day',
                dateFormat: 'M d',
                groupBy: 'year,month,day',
                aggregateOp: 'sum',

                constrain: true,
                fromDate: '1/1/11',
                toDate: '1/7/11',
                grid: true
            }],
            series: [{
                type: 'line',
                axis: 'left',
                xField: 'date',
                yField: 'visits',
                label: {
                    display: 'none',
                    field: 'visits',
                    renderer: function(v) { return v >> 0; },
                    'text-anchor': 'middle'
                },
                markerCfg: {
                    radius: 5,
                    size: 5
                }
            },{
                type: 'line',
                axis: 'left',
                xField: 'date',
                yField: 'views',
                label: {
                    display: 'none',
                    field: 'visits',
                    renderer: function(v) { return v >> 0; },
                    'text-anchor': 'middle'
                },
                markerCfg: {
                    radius: 5,
                    size: 5
                }
            },{
                type: 'line',
                axis: 'left',
                xField: 'date',
                yField: 'users',
                label: {
                    display: 'none',
                    field: 'visits',
                    renderer: function(v) { return v >> 0; },
                    'text-anchor': 'middle'
                },
                markerCfg: {
                    radius: 5,
                    size: 5
                }
            }]
        }]
    });
    chart = Ext.getCmp('chartCmp');
    var timeAxis = chart.axes.get(1);
});