//<debug>
Ext.Loader.setPath({
    'Ext': '../../src'
});
//</debug>

Ext.application({
    name: 'Device',

    stores: ['Images'],

    views: [
        'Main',
        'Information',
        'Camera',
        'Connection',
        'Notification',
        'Orientation',
        'Geolocation'
    ],

    controllers: [
        'Application',
        'Camera',
        'Notification',
        'Connection'
    ],

    launch: function() {
        Ext.create('Device.view.Main');
    }
});
