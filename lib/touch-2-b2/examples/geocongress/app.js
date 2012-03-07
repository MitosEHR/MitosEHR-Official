Ext.Loader.setConfig({ enabled: true });

Ext.application({
    name: 'GeoCon',

    models: [
        'Bill',
        'Committee',
        'Legislator',
        'Vote'
    ],

    views : [
        'Main'
    ],

    controllers: [
        'SplashScreen',
        'Legislator',
        'Committee'
    ],

    stores: [
        'Bills',
        'Legislators',
        'Committees',
        'Votes',
        'States',
        'Districts'
    ],

    launch: function() {
        Ext.create('GeoCon.view.Main');
    }
});
