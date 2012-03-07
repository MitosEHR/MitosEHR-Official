Ext.define('Kitchensink.view.CoverLeft', {
    extend: 'Ext.Panel',
    requires: ['Kitchensink.view.LoremIpsum'],
    config: {
        cls: 'card card1',
        scrollable: true,
        items: [{
            docked: 'top',
            html: 'Cover Left Animation'
        }, {
            xtype: 'loremipsum'
        }]
    }
});