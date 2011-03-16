Ext.require([
    'Ext.panel.Panel',
    'Ext.toolbar.TextItem'
]);

Ext.onReady(function() {

    // Ext.createWidget('panel', {
    //     renderTo: Ext.getBody(),
    //     height: 200,
    //     width: 200,
    //     title: 'toolbar: right',
    //     html: "Test Test Test",
    //     dockedItems: [{
    //         xtype: 'toolbar',
    //         dock: 'top',
    //         items: [{
    //             xtype: 'button',
    //             text: 'Button',
    //             color: 'toolbar'
    //         }, {
    //             xtype: 'tbtext',
    //             text: 'Testing'
    //         }]
    //     }]
    // });

    Ext.createWidget('panel', {
        renderTo: Ext.getBody(),
        height: 200,
        width: 200,
        title: 'toolbar: right',
        html: "Test Test Test",
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'right',
            vertical: true,
            weight: 3,
            items: [{
                xtype: 'button',
                text: 'Button',
                color: 'toolbar'
            }, {
                xtype: 'tbtext',
                text: 'Testing'
            }]
        }, {
            dock: 'right',
            xtype: 'toolbar',
            vertical: true,
            weight: 2,
            items: {
                xtype: 'tbtext',
                text: 'Weighted'
            }
        }, {
            dock: 'right',
            xtype: 'toolbar',
            vertical: true,
            weight: 1,
            items: {
                xtype: 'tbtext',
                text: 'Weighted 2'
            }
        }]
    });
});
