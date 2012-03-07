Ext.define('Kitchensink.view.SlideDown', {
    extend: 'Ext.Panel',
    requires: ['Kitchensink.view.LoremIpsum'],
    config: {
        cls: 'card card4',
        scrollable: true,
        items: [{
            docked: 'top',
            html: 'Slide Down Animation'
        }, {
            xtype: 'loremipsum'
        }]
    }
});
