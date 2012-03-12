Ext.define('Device.view.Main', {
    extend: 'Ext.Container',
    xtype: 'main',

    config: {
        fullscreen: true,

        layout: {
            type: 'card'
        },

        items: [
            {
                xtype: 'toolbar',
                docked: 'top',
                title: 'Device API'
            },

            {
                xtype: 'tabbar',
                docked: 'bottom',
                items: [
                    {
                        title: 'Notifications',
                        iconCls: 'mail',
                        className: 'Device.view.Information'
                    },
                    {
                        title: 'Camera',
                        iconCls: 'photo1',
                        className: 'Device.view.Camera'
                    },
                    {
                        title: 'Orientation',
                        iconCls: 'compass1',
                        className: 'Device.view.Orientation'
                    },
                    {
                        title: 'Connection',
                        iconCls: 'wifi3',
                        className: 'Device.view.Connection'
                    },
                    {
                        title: 'Geolocation',
                        iconCls: 'maps',
                        className: 'Device.view.Geolocation'
                    }
                ]
            },

            { xclass: 'Device.view.Information' },
            { xclass: 'Device.view.Notification' },
            { xclass: 'Device.view.Camera' },
            { xclass: 'Device.view.Orientation' },
            { xclass: 'Device.view.Connection' },
            { xclass: 'Device.view.Geolocation' }
        ]
    }
});
