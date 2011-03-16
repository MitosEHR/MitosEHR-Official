Ext.onReady(function() {
    Ext.create('Ext.Viewport', {
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'panel',
            width: 100,
            minWidth: 100,
            maxWidth: 100,
            title: 'Panel',
            html: 'minWidth: 100, maxWidth: 100'
        },
        {
            xtype: 'splitter',
            collapsible: true
        },
        {
            xtype: 'panel',
            flex: 1,
            minWidth: 100,
            maxWidth: 200,
            html: 'minWidth: 100, maxWidth: 200',
            title: 'Panel',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'panel',
                flex: 1
            },
            {
                xtype: 'splitter'
            },
            {
                xtype: 'panel',
                flex: 1,
                html: 'sample - maintaining flex'
            },
            {
                xtype: 'splitter'
            },
            {
                xtype: 'panel',
                flex: 1,
                minHeight: 50,
                html: 'minHeight: 50'
            },
            {
                xtype: 'splitter'
            },
            {
                xtype: 'panel',
                height: 200,
                maxHeight: 300,
                html: 'maxHeight: 300'
            }]
        },
        {
            xtype: 'splitter',
            collapsible: true
        },
        {
            xtype: 'panel',
            flex: 1,
            maintainFlex: true,
            title: 'Panel'
        },
        {
            xtype: 'splitter',
            collapsible: true
        },
        {
            xtype: 'panel',
            flex: 1,
            maxWidth: 400,
            title: 'Panel',
            html: 'maxWidth: 400'
        }]
    });
});
