Ext.define('Kitchensink.view.CoverUp', {
    extend: 'Ext.Panel',
    requires: ['Kitchensink.view.LoremIpsum'],
    config: {
        cls: 'card card3',
        scrollable: true,
        items: [{
            docked: 'top',
            html: 'Cover Up Animation'
        }, {
            xtype: 'loremipsum'
        }]
    }
});