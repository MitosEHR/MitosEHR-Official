Ext.define('Kitchensink.view.RevealLeft', {
    extend: 'Ext.Panel',
    requires: ['Kitchensink.view.LoremIpsum'],
    config: {
        cls: 'card card1',
        scrollable: true,
        items: [{
            docked: 'top',
            html: 'Reveal Left Animation'
        }, {
            xtype: 'loremipsum'
        }]
    }
});