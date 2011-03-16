Ext.require('Ext.chart.*');
Ext.require(['Ext.Window', 'Ext.fx.target.Sprite', 'Ext.layout.container.Fit']);

Ext.onReady(function () {
    var gradients = false;
    var refresh = (function() {
        var memo = {};
        return function() {
            win.items.each(function(n) {
                n.theme = theme;
                n.initTheme(theme);
                //Create gradients if not previously defined.
                if (n.themeAttrs.gradients) {
                    if (!(theme in memo)) {
                        n.surface.gradients = n.themeAttrs.gradients;
                        n.surface.initGradients();
                    }
                }
                n.redraw();
            });
            memo[theme] = true;
        };
    })();

    var theme = 'Base';
    var win = Ext.create('Ext.Window', {
        width: 900,
        height: 700,
        hidden: false,
        shadow: false,
        maximizable: false,
        resizable: false,
        title: 'Chart Theming',
        renderTo: Ext.getBody(),
        type: 'vbox',
        tbar: [{
            text: 'Reload Data',
            handler: function() {
                store1.loadData(generateData());
            }
        }, {
            text: 'Blue',
            handler: function() {
                theme = 'Blue' + (gradients? ':gradients' : '');
                refresh();
            }
        }, {
            text: 'Green',
            handler: function() {
                theme = 'Green' + (gradients? ':gradients' : '');
                refresh();
            }
        }, {
            text: 'Red',
            handler: function() {
                theme = 'Red' + (gradients? ':gradients' : '');
                refresh();
            }
        }, {
            text: 'Sky',
            handler: function() {
                theme = 'Sky' + (gradients? ':gradients' : '');
                refresh();
            }
        }, {
            text: 'Purple',
            handler: function() {
                theme = 'Purple' + (gradients? ':gradients' : '');
                refresh();
            }
        }, {
            text: 'Yellow',
            handler: function() {
                theme = 'Yellow' + (gradients? ':gradients' : '');
                refresh();
            }
        }, {
            text: 'Cat1',
            handler: function() {
                theme = 'Category1' + (gradients? ':gradients' : '');
                refresh();
            }
        }, {
            text: 'Cat2',
            handler: function() {
                theme = 'Category2' + (gradients? ':gradients' : '');
                refresh();
            }
        }, {
            text: 'Cat3',
            handler: function() {
                theme = 'Category3' + (gradients? ':gradients' : '');
                refresh();
            }
        }, {
            text: 'Cat4',
            handler: function() {
                theme = 'Category4' + (gradients? ':gradients' : '');
                refresh();
            }
        }, {
            text: 'Cat5',
            handler: function() {
                theme = 'Category5' + (gradients? ':gradients' : '');
                refresh();
            }
        }, {
            text: 'Cat6',
            handler: function() {
                theme = 'Category6' + (gradients? ':gradients' : '');
                refresh();
            }
        }, {
            text: 'Toggle Gradients',
            handler: function() {
                if (!gradients) {
                    theme += ':gradients';
                } else {
                    theme = theme.match(/([0-9A-Za-z]+).gradients/)[1];
                }
                gradients = !gradients;
                refresh();
            }
        }],
        items: [{
            xtype: 'chart',
            width: 800,
            height: 200,
            theme: theme,
            animate: true,
            store: store1,
            series: [{
                type: 'column',
                xField: 'name',
                yField: ['data1', 'data2', 'data3', 'data4', 'data5'],
                stacked: true,
                style: {
                    'stroke-width': 0.5,
                    'stroke': '#555'
                }
            }]
        //}, {
        //    xtype: 'chart',
        //    width: 800,
        //    height: 200,
        //    animate: true,
        //    theme: theme,
        //    store: store1,
        //    series: [{
        //        type: 'line',
        //        showMarkers: true,
        //        xField: 'name',
        //        yField: 'visits',
        //        style: {
        //                'stroke-width': 0.5
        //            }
        //    },{
        //        type: 'line',
        //        showMarkers: true,
        //        xField: 'name',
        //        yField: 'views',
        //        style: {
        //                'stroke-width': 0.5
        //            }
        //    }, {
        //        type: 'line',
        //        showMarkers: true,
        //        xField: 'name',
        //        yField: 'veins',
        //        style: {
        //                'stroke-width': 0.5
        //            }
        //    }]
        //}, {
        //    xtype: 'chart',
        //    width: 800,
        //    height: 100,
        //    animate: true,
        //    theme: theme,
        //    store: store1,
        //    series: [{
        //        type: 'area',
        //        showMarkers: false,
        //        smooth: true,
        //        fill: true,
        //        xField: 'name',
        //        yField: ['data1', 'data2', 'data3'],
        //        style: {
        //            'stroke-width': 0.5,
        //            'stroke': '#555'
        //        }
        //    }]
        }, {
            xtype: 'chart',
            width: 800,
            height: 100,
            animate: true,
            theme: theme,
            store: store1,
            series: [{
                type: 'pie',
                field: 'visits',
                animate: true,
                highlight: true,
                label: {
                  field: 'name',
                  display: 'rotate'
                },
                style: {
                    'stroke-width': 0.5,
                    'stroke': '#555'
                }
            }]
        }]
    });
});
