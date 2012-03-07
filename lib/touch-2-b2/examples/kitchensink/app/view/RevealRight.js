Ext.define('Kitchensink.view.RevealRight', {
    extend: 'Ext.Panel',
    requires: ['Kitchensink.view.LoremIpsum'],
    config: {
        cls: 'card card2',
        scrollable: true,
        items: [{
            docked: 'top',
            html: 'Reveal Right Animation'
        }, {
            xtype: 'loremipsum'
        }]
    }
});