Ext.define('Kitchensink.view.SlideRight', {
    extend: 'Ext.Panel',
    requires: ['Kitchensink.view.LoremIpsum'],
    config: {
        cls: 'card card2',
        scrollable: true,
        items: [{
            docked: 'top',
            html: 'Slide Right Animation'
        }, {
            xtype: 'loremipsum'
        }]
    }
});
