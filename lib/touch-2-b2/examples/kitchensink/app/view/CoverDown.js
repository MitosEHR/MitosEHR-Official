Ext.define('Kitchensink.view.CoverDown', {
    extend: 'Ext.Panel',
    requires: ['Kitchensink.view.LoremIpsum'],
    config: {
        cls: 'card card4',
        scrollable: true,
        items: [{
            docked: 'top',
            html: 'Cover Down Animation'
        }, {
            xtype: 'loremipsum'
        }]
    }
});