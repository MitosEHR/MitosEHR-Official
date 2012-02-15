Ext.define('Kitchensink.view.RevealUp', {
    extend: 'Ext.Panel',
    requires: ['Kitchensink.view.LoremIpsum'],
    config: {
        cls: 'card card3',
        scrollable: true,
        items: [{
            docked: 'top',
            html: 'Reveal Up Animation'
        }, {
            xtype: 'loremipsum'
        }]
    }
});