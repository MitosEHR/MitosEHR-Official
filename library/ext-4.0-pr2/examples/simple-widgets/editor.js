Ext.require([
    'Ext.Editor',
    'Ext.form.FormPanel',
    'Ext.form.ComboBox',
    'Ext.form.Date',
    'Ext.data.Store',
    'Ext.data.AjaxProxy',
    'Ext.data.JsonReader',
    'Ext.data.JsonWriter',
    
]);

Ext.onReady(function(){
    Ext.create('Ext.form.FormPanel', {
        renderTo: 'container',
        width: 700,
        height: 400,
        title: 'User Details',
        defaultType: 'textfield',
        bodyStyle: 'padding: 10px;',
        labelWidth: 90,
        items: [{
            fieldLabel: 'First Name',
            name: 'firstname'
        }, {
            fieldLabel: 'Middle Name',
            name: 'middlename'
        }, {
            fieldLabel: 'Last Name',
            name: 'lastname'
        }, {
            xtype: 'datefield',
            name: 'dob',
            fieldLabel: 'D.O.B'
        }],
        listeners: {
            afterrender: function(form){
                var cfg = {
                    shadow: false,
                    completeOnEnter: true,
                    cancelOnEsc: true,
                    updateEl: true,
                    ignoreNoChange: true
                }, height = form.child('textfield').getHeight();

                var labelEditor = Ext.create('Ext.Editor', Ext.apply({
                    width: 100,
                    height: height,
                    offsets: [0, 2],
                    alignment: 'l-l',
                    listeners: {
                        beforecomplete: function(ed, value){
                            if (value.charAt(value.length - 1) != ':') {
                                ed.setValue(ed.getValue() + ':');
                            }
                            return true;
                        }
                    },
                    field: {
                        name: 'labelfield',
                        allowBlank: false,
                        xtype: 'textfield',
                        width: 90,
                        selectOnFocus: true
                    }
                }, cfg));
                form.body.on('dblclick', function(e, t){
                    labelEditor.startEdit(t);
                }, null, {
                    delegate: 'label.x-form-item-label'
                });

                var titleEditor = Ext.create('Ext.Editor', Ext.apply({
                    alignment: 'bl-bl?',
                    offsets: [0, 10],
                    field: {
                        width: 130,
                        xtype: 'combo',
                        editable: false,
                        forceSelection: true,
                        queryMode: 'local',
                        store: Ext.create('Ext.data.Store', {
                            fields: ['value', 'key'],
                            displayField: 'key',
                            valueField: 'value',
                            data: [{
                                value: 'user',
                                text: 'User Details'
                            },{
                                value: 'dev',
                                text: 'Developer Detail'
                            },{
                                value: 'manager',
                                text: 'Manager Details'
                            }]
                        })
                    }
                }, cfg));

                form.header.titleCmp.textEl.on('dblclick', function(e, t){
                    titleEditor.startEdit(t);
                });
            }
        }
    });
});
