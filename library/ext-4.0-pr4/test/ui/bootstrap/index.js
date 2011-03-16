Ext.require('Ext.window.Window');
Ext.require('Ext.layout.container.Border');
Ext.require('Ext.toolbar.Spacer');

Ext.onReady(function() {
    var win = Ext.createWidget('window', {
        width: 500,
        height: 300,
        minHeight: 200,
        minWidth: 300,
        maxHeight: 500,
        maxWidth: 700,
        maximizable: true,
        closeAction: 'hide',
        layout: {
            type: 'border',
            padding: 5
        },
        title: 'Hello Dialog',
        items: [{
            title: 'Navigation',
            collapsible: true,
            region: 'west',
            width: 200,
            html: 'Hello',
            split: true
        }, {
            title: 'TabPanel',
            region: 'center'
        }],
        resizable: {
            dynamic: true,
            listeners: {
                resizedrag: function(resizer, width, height, e) {
                    resizer.target.setTitle(resizer.target.initialConfig.title + ' width: ' + width + ', height: ' + height);
                }
            }
        },
        dockedItems: [
            {
                dock: 'bottom',
                xtype: 'toolbar',
                items: [
                    { xtype: 'tbspacer' },
                    {
                        xtype   : 'button',
                        text    : 'Submit',
                        disabled: true
                    },
                    {
                        xtype: 'button',
                        text : 'Close'
                    }
                ]
            }
        ]
    });

    win.show();
});
