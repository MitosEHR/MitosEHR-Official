Ext.define('Kitchensink.view.SlideUp', {
    extend: 'Ext.Panel',
    requires: ['Kitchensink.view.LoremIpsum'],
    config: {
        cls: 'card card3',
        scrollable: true,
        items: [{
            docked: 'top',
            html: 'Slide Up Animation'
        }, {
            xtype: 'loremipsum'
        }]
    }
});
