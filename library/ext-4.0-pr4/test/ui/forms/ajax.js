Ext.require([
    'Ext.layout.container.Anchor', 
    'Ext.form.*', 
    'Ext.Ajax'
]);

Ext.onReady(function(){

    var formPanel = Ext.create('Ext.form.FormPanel', {
        renderTo: 'form-ct',
        frame: true,
        title: 'Ajax Form',
        width: 340,
        bodyPadding: 5,
        defaults: {
            anchor: '100%'
        },
        defaultType: 'textfield',
        
        fieldDefaults: {
            labelAlign: 'left',
            labelWidth: 90
        },
        
        items: [{
            fieldLabel: 'First Name',
            emptyText: 'First Name',
            name: 'first'
        }, {
            fieldLabel: 'Last Name',
            emptyText: 'Last Name',
            name: 'last',
            allowBlank: false
        }, {
            fieldLabel: 'Company',
            name: 'company'
        }, {
            fieldLabel: 'Email',
            name: 'email',
            vtype: 'email'
        }, {
            xtype: 'textareafield',
            fieldLabel: 'Comments',
            name: 'comments',
            labelAlign: 'top'
        }],
        
        buttons: [{
            text: 'Load',
            handler: function(){
                this.up('form').getForm().load({
                    url: 'ajax-data.json'
                });
            }
        }, {
            text: 'Submit',
            disabled: true,
            formBind: true,
            handler: function(){
                this.up('form').getForm().submit({
                    url: 'ajax-errors.json',
                    submitEmptyText: false
                });
            }
        }]
    });
});
