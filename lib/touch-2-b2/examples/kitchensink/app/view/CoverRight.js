Ext.define('Kitchensink.view.CoverRight', {
    extend: 'Ext.Panel',
    requires: ['Kitchensink.view.LoremIpsum'],
    config: {
        cls: 'card card2',
        scrollable: true,
        items: [{
            docked: 'top',
            html: 'Cover Right Animation'
        }, {
            xtype: 'loremipsum'
        }]
    }
});