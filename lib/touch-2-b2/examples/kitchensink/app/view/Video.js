Ext.define('Kitchensink.view.Video', {
    extend: 'Ext.Container',
    requires: [
        'Ext.Video'
    ],
    config: {
        layout: 'fit',
        items: [{
            xtype: 'video',
            url: ['../video/BigBuck.m4v', '../video/BigBuck.webm'],
            loop: true,
            posterUrl: '../video/cover.jpg'
        }]
    }
});
