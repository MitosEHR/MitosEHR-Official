Ext.require(['Ext.Panel', 'Ext.Video']);

Ext.setup({
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    icon: 'icon.png',
    glossOnIcon: false,
    onReady: function() {
        Ext.Viewport.add({
            xtype: 'video',
            url: ['BigBuck.m4v', 'BigBuck.webm'],
            loop: true,
            posterUrl: 'cover.jpg'
        });
    }
});