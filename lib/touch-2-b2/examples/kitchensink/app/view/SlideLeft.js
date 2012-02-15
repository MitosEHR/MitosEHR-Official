Ext.define('Kitchensink.view.SlideLeft', {
    extend: 'Ext.Panel',
    requires: ['Kitchensink.view.LoremIpsum'],
    config: {
        cls: 'card card1',
        scrollable: true,
        items: [{
            docked: 'top',
            html: 'Slide Left Animation'
        }, {
            xtype: 'loremipsum'
        }]
    }
});
