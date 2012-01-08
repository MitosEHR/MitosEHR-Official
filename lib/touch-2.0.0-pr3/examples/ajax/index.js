Ext.require([
    'Ext.Panel',
    'Ext.Button',
    'Ext.Toolbar',
    'Ext.util.JSONP',
    'Ext.Ajax'
]);

Ext.setup({
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    icon: 'icon.png',
    glossOnIcon: false,

    onReady: function() {
        var tpl = new Ext.XTemplate(
            '<tpl for=".">' +
                '<div class="day">' +
                '<div class="date">{date}</div>' +
                '<tpl for="weatherIconUrl"><img src="{value}"/></tpl>' +
                '<span class="temp">{tempMaxF}&deg;<span class="temp_low">{tempMinF}&deg;</span></span>' +
                '</div>' +
                '</tpl>'
        );

        var makeAjaxRequest = function() {
            Ext.getCmp('content').setMask({
                message: 'Loading...'
            });

            Ext.Ajax.request({
                url: 'test.json',
                success: function(response, opts) {
                    Ext.getCmp('content').update(response.responseText);
                    Ext.getCmp('status').setTitle('Static test.json file loaded');
                    Ext.getCmp('content').unmask();
                }
            });
        };

        var makeJSONPRequest = function() {
            Ext.getCmp('content').setMask({
                message: 'Loading...'
            });

            Ext.util.JSONP.request({
                url: 'http://free.worldweatheronline.com/feed/weather.ashx',
                callbackKey: 'callback',
                params: {
                    key: '23f6a0ab24185952101705',
                    // palo alto
                    q: '94301',
                    format: 'json',
                    num_of_days: 5
                },
                callback: function(result) {
                    var weather = result.data.weather;
                    if (weather) {
                        var html = tpl.apply(weather);
                        Ext.getCmp('content').update(html);
                    }
                    else {
                        alert('There was an error retrieving the weather.');
                    }
                    Ext.getCmp('status').setTitle('Palo Alto, CA Weather');
                    Ext.getCmp('content').unmask();
                }
            });
        };

        Ext.create('Ext.Panel', {
            fullscreen: true,
            id: 'content',
            scroll: 'vertical',
            html: 'This example can use either JSONP or AJAX to retrieve data.',
            items: [{
                xtype: 'toolbar',
                docked: 'top',
                items: [{
                    text: 'JSONP',
                    handler: makeJSONPRequest
                }, {
                    xtype: 'spacer'
                }, {
                    text: 'XMLHTTP',
                    handler: makeAjaxRequest
                }]
            }, {
                id: 'status',
                xtype: 'toolbar',
                docked: 'bottom',
                title: 'Tap a button above.'
            }]
        });
    }
});