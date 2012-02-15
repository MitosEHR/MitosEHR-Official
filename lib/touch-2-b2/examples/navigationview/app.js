Ext.Loader.setConfig({ enabled: true });

Ext.application({
    name: 'AddressBook',

    icon: 'resources/images/icon.png',
    tabletStartupScreen: 'resources/images/tablet_startup.png',
    phoneStartupScreen: 'resources/images/phone_startup.png',
    glossOnIcon: false,

    models: ['Contact'],
    stores: ['Contacts'],
    views: ['Main'],
    controllers: ['Application'],

    launch: function() {
        Ext.Viewport.add({
            xclass: 'AddressBook.view.Main'
        });
    }
});
