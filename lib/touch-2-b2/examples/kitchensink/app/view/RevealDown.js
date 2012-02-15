Ext.define('Kitchensink.view.RevealDown', {
    extend: 'Ext.Panel',
    requires: ['Kitchensink.view.LoremIpsum'],
    config: {
        cls: 'card card4',
        scrollable: true,
        items: [{
            docked: 'top',
            html: 'Reveal Down Animation'
        }, {
            xtype: 'loremipsum'
        }]
    }
});