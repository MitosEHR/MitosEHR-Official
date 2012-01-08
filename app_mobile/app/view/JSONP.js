Ext.define('Kitchensink.view.JSONP', {
    extend: 'Ext.Container',
    config: {
        scrollable: true,
        items: [{
                xtype: 'panel',
                id: 'JSONP'
            }, {
            docked: 'top',
            xtype: 'toolbar',
            items: [{
                text: 'Load using JSON-P',
                handler: function() {
                    var panel = Ext.getCmp('JSONP'),
                        tpl = new Ext.XTemplate([
                        '<div class="demo-weather">',
                        '<tpl for=".">',
                        '<div class="day">',
                        '<div class="date">{date}</div>',
                        '<tpl for="weatherIconUrl"><img src="{value}"/></tpl>',
                        '<span class="temp">{tempMaxF}&deg;<span class="temp_low">{tempMinF}&deg;</span></span>',
                        '</div>',
                        '</tpl>',
                        '</div>'
                    ]);

                    panel.getParent().setMask({
                        message: 'Loading...'
                    });

                    Ext.util.JSONP.request({
                        url: 'http://free.worldweatheronline.com/feed/weather.ashx',
                        callbackKey: 'callback',
                        params: {
                            key: '23f6a0ab24185952101705',
                            q: '94301', // Palo Alto
                            format: 'json',
                            num_of_days: 5
                        },

                        callback: function(result) {
                            var weather = result.data.weather;

                            if (weather) {
                                panel.updateHtml(tpl.applyTemplate(weather));
                            }
                            else {
                                alert('There was an error retrieving the weather.');
                            }

                            panel.getParent().unmask();
                        }
                    });
                }
            }]
        }]
    }
});