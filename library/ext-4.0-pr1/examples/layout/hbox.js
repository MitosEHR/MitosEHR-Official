Ext.onReady(function() {
    Ext.create('Ext.Viewport', {
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'panel',
            width: 300,
            minWidth: 300,
            maxWidth: 350,
            title: 'Multiple Accordion',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [{
                title: 'option a',
                flex: 1,
                html: 'foo'
            },{
                xtype: 'splitter',
                collapsible: false
            },{
                title: 'option a',
                flex: 1,
                html: 'foo'
            },{
                xtype: 'splitter',
                collapsible: true
            },{
                title: 'option a',
                flex: 1,
                html: 'foo'
            }]

        },{xtype: 'splitter', collapsible: true, collapseTarget: 'prev'},{
            xtype: 'panel',
            flex: 2,
            maintainFlex: true,
            title: 'center',
            html: 'testing'
        },{xtype: 'splitter', collapsible: true},
        {
            xtype: 'panel',
            width: 300,
            //flex: 1,
            title: 'right',
            html: 'testing'
        },{xtype: 'splitter', collapsible: true},
        {
            xtype: 'panel',
            width: 100,
            //flex: 1,
            title: 'right',
            html: 'testing'
        }]
    });
});
