Ext.define('Ext.app.ContactForm', {
    extend: 'Ext.form.FormPanel',
    requires: [
     'Ext.data.ArrayStore',
     'Ext.data.ArrayReader',
     'Ext.form.ComboBox',
     'Ext.form.Date'
    ],
    formTitle: 'Contact Information (English)',
    firstName: 'First Name',
    lastName: 'Surname',
    surnamePrefix: 'Surname Prefix',
    company: 'Company',
    state: 'State',
    stateEmptyText: 'Choose a state...',
    email: 'E-mail',
    birth: 'Date of Birth',
    save: 'Save',
    cancel: 'Cancel',
    initComponent : function(config) {
        Ext.apply(this, {
            url: 'save-form.php',
            frame: true,
            title: this.formTitle,
            bodyStyle: 'padding:5px 5px 0',
            width: 370,
            defaultType: 'textfield',
            defaults: {
                width: 330
            },
            items: [{
                    fieldLabel: this.firstName,
                    name: 'firstname',
                    allowBlank:false
                },{
                    fieldLabel: this.lastName,
                    name: 'lastName'
                },{
                    fieldLabel: this.surnamePrefix,
                    width: 150,
                    name: 'surnamePrefix'
                },{
                    fieldLabel: this.company,
                    name: 'company'
                },  new Ext.form.ComboBox({
                    fieldLabel: this.province,
                    hiddenName: 'state',
                    store: new Ext.data.ArrayStore({
                        fields: ['provincie'],
                        data : Ext.exampledata.dutch_provinces // from dutch-provinces.js
                    }),
                    displayField: 'provincie',
                    typeAhead: true,
                    queryMode: 'local',
                    triggerAction: 'all',
                    emptyText: this.stateEmptyText,
                    selectOnFocus:true
                }), {
                    fieldLabel: this.email,
                    name: 'email',
                    vtype:'email'
                }, new Ext.form.Date({
                    fieldLabel: this.birth,
                    name: 'birth'
                })
            ],
    
            buttons: [{
                text: this.save
            },{
                text: this.cancel
            }]
        });
        
        this.callParent(arguments);
    }
});

Ext.require([
   'Ext.tip.QuickTips'
]);

Ext.onReady(function(){
    Ext.tip.QuickTips.init();
    
    // turn on validation errors beside the field globally
    Ext.form.Field.prototype.msgTarget = 'side';
    
    var bd = Ext.getBody();
    
    bd.createChild({tag: 'h2', html: 'Localized Contact Form'});
        
    // simple form
    var simple = Ext.create('Ext.app.ContactForm', {});
    simple.render(document.body);
});