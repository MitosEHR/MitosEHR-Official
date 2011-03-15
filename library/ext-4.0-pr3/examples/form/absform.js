Ext.require([
    'Ext.form.*',
    'Ext.layout.container.Absolute',
    'Ext.window.Window'
]);

Ext.onReady(function() {
    var form = Ext.create('Ext.form.FormPanel', {
        layout: 'absolute',
        url: 'save-form.php',
        defaultType: 'textfield',
        bodyBorder: 0,

        items: [{
            fieldLabel: 'Send To',
            fieldWidth: 60,
            msgTarget: 'side',
            allowBlank: false,
            x: 0,
            y: 0,
            name: 'to',
            anchor: '100%'  // anchor width by percentage
        }, {
            fieldLabel: 'Subject',
            fieldWidth: 60,
            x: 0,
            y: 30,
            name: 'subject',
            anchor: '100%'  // anchor width by percentage
        }, {
            x:0,
            y: 60,
            xtype: 'textarea',
            style: 'margin:0',
            hideLabel: true,
            name: 'msg',
            anchor: '100% 100%'  // anchor width and height
        }]
    });

    var win = Ext.create('Ext.window.Window', {
        title: 'Resize Me',
        width: 500,
        height: 300,
        minWidth: 300,
        minHeight: 200,
        layout: 'fit',
        plain:true,
        bodyPadding: 5,
        items: form,

        buttons: [{
            text: 'Send'
        },{
            text: 'Cancel'
        }]
    });

    win.show();
});