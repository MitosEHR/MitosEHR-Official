Ext.onReady(function() {

    var formPanel = Ext.create('Ext.form.FormPanel', {
        frame: true,
        title: 'Form Fields',
        width: 600,
        bodyPadding: 5,

        fieldDefaults: {
            labelAlign: 'left',
            labelWidth: 90,
            anchor: '100%'
        },

        items: [{
            xtype: 'textfield',
            name: 'textfield1',
            fieldLabel: 'Text field',
            value: 'Text field value',
            grow: true,
            growMax: 400,
            emptyText: 'empty text'
        }, {
            xtype: 'textareafield',
            name: 'textarea1',
            fieldLabel: 'TextArea',
            value: 'Textarea value',
            grow: true
        }]
    });

    formPanel.render('form-ct');

});
