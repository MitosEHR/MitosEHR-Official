/**
 * Author: Ernesto J Rodriguez <erodriuez@certun.com>
 * Modified: GI Technologies, 2011
 *
 * MitosEHR (Electronic Health Records) 2011
 *
 */
Ext.define('Ext.mitos.view.miscellaneous.myaccount.MyAccount',{
    extend      : 'Ext.mitos.classes.RenderPanel',
    id          : 'panelMyAccount',
    pageTitle   : 'My Account',
    uses:[
        'Ext.mitos.classes.combo.Titles',
        'Ext.mitos.classes.window.Window',
        'Ext.mitos.classes.combo.Facilities',
        'Ext.mitos.classes.combo.Authorizations'
    ],
    initComponent: function(){
        var me = this;

        Ext.define('UsersModel', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'id',                    type: 'int'},
                {name: 'title',                 type: 'string'},
                {name: 'fname',                 type: 'string'},
                {name: 'mname',                 type: 'string'},
                {name: 'lname',                 type: 'string'},
                {name: 'username',              type: 'string'},
                {name: 'password',              type: 'string'},
                {name: 'oPassword',             type: 'string'},
                {name: 'nPassword',             type: 'string'},
                {name: 'facility_id',           type: 'int'},
                {name: 'see_auth',              type: 'string'},
                {name: 'taxonomy',              type: 'string'},
                {name: 'federaltaxid',          type: 'string'},
                {name: 'federaldrugid',         type: 'string'},
                {name: 'upin',                  type: 'string'},
                {name: 'npi',                   type: 'string'},
                {name: 'specialty',            	type: 'string'}

            ],
            proxy: {
                type: 'direct',
                api:{
                    read    : User.getCurrentUserData,
                    update  : User.getCurrentUserData
                }
            }
        });
        me.store = Ext.create('Ext.data.Store', {
            model		: 'UsersModel',
            remoteSort	: false
        });

        // *************************************************************************************
        // User Settings Form
        // Add or Edit purpose
        // *************************************************************************************
        me.myAccountForm = Ext.create('Ext.mitos.classes.form.FormPanel', {
            cls			: 'form-white-bg',
            frame       : true,
            hideLabels  : true,
            defaults: {
                labelWidth: 89,
                layout: {
                    type: 'hbox',
                    defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                }
            },
            items: [{
                xtype: 'textfield', hidden: true, name: 'id'
            },{
                xtype:'fieldset',
                title: 'Personal Info',
                defaultType: 'textfield',
                layout: 'anchor',
                defaults: {
                    labelWidth: 89,
                    anchor: '100%',
                    layout: {
                        type: 'hbox',
                        defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                    }
                },
                items :[{
                    xtype: 'fieldcontainer',
                    defaults: { hideLabel: true },
                    msgTarget : 'under',
                    items: [
                        { width: 110, xtype: 'displayfield', value: 'First, Middle, Last: '},
                        { width: 55, xtype: 'mitos.titlescombo', name: 'title'},
                        { width: 105,  xtype: 'textfield', name: 'fname' },
                        { width: 100,  xtype: 'textfield', name: 'mname' },
                        { width: 175, xtype: 'textfield', name: 'lname' }
                    ]
                }]
            },{
                xtype:'fieldset',
                title: 'Login Info',
                defaultType: 'textfield',
                layout: 'anchor',
                defaults: {
                    labelWidth: 89,
                    anchor: '100%',
                    layout: {
                        type: 'hbox',
                        defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                    }
                },
                items :[{
                    xtype: 'fieldcontainer',
                    defaults: { hideLabel: true },
                    msgTarget : 'under',
                    items: [
                        { width: 110, xtype: 'displayfield', value: 'Username: '},
                        { width: 150, xtype: 'textfield', name: 'username' },
                        { width: 120, xtype: 'displayfield', value: 'Password: '},
                        { width: 175, xtype: 'textfield', name: 'password',  inputType: 'password', disabled: true }
                    ]
                }]
            },{
                xtype:'fieldset',
                title: 'Other Info',
                defaultType: 'textfield',
                layout: 'anchor',
                defaults: {
                    labelWidth: 89,
                    anchor: '100%',
                    layout: {
                        type: 'hbox',
                        defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                    }
                },
                items :[{
                    xtype: 'fieldcontainer',
                    defaults: { hideLabel: true },
                    msgTarget : 'under',
                    items: [
                        { width: 110, xtype: 'displayfield', value: 'Default Facility: '},
                          Ext.create('Ext.mitos.classes.combo.Facilities', {width: 170 }),
                        { width: 100, xtype: 'displayfield', value: 'Authorizations: '},
                          Ext.create('Ext.mitos.classes.combo.Authorizations', {width: 175 })
                    ]
                },{
                    xtype: 'fieldcontainer',
                    defaults: { hideLabel: true },
                    items: [
                        { width: 110, xtype: 'displayfield', value: 'Access Control: '},
                          Ext.create('Ext.mitos.classes.combo.Roles', {width: 170 }),
                        { width: 100, xtype: 'displayfield', value: 'Taxonomy: '},
                        { width: 175, xtype: 'textfield', name: 'taxonomy' }
                    ]
                },{
                    xtype: 'fieldcontainer',
                    defaults: { hideLabel: true },
                    items: [
                        { width: 110, xtype: 'displayfield', value: 'Federal Tax ID: '},
                        { width: 170, xtype: 'textfield', name: 'federaltaxid' },
                        { width: 100, xtype: 'displayfield', value: 'Fed Drug ID: '},
                        { width: 175, xtype: 'textfield', name: 'federaldrugid' }
                    ]
                },{
                    xtype: 'fieldcontainer',
                    defaults: { hideLabel: true },
                    items: [
                        { width: 110, xtype: 'displayfield', value: 'UPIN: '},
                        { width: 170, xtype: 'textfield', name: 'upin' },
                        { width: 100, xtype: 'displayfield', value: 'NPI: '},
                        { width: 175, xtype: 'textfield', name: 'npi' }
                    ]
                },{
                    xtype: 'fieldcontainer',
                    defaults: { hideLabel: true },
                    items: [
                        { width: 110, xtype: 'displayfield', value: 'Job Description: '},
                        { width: 455, xtype: 'textfield', name: 'specialty' }
                    ]
                }]
            }],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: [{
                    text      	: 'Save',
                    iconCls   	: 'save',
                    handler   : function(){
//                        var record =  me.store.getAt('0');
//                        var fieldValues = me.myAccountForm.getForm().getValues();
//                        for ( var k=0; k <= record.fields.getCount()-1; k++) {
//                            var i = record.fields.get(k).name;
//                            record.set( i, fieldValues[i] );
//                        }
//                        me.store.sync();	// Save the record to the dataStore
//                        me.store.load();	// Reload the dataSore from the database
//
//                        me.msg('Sweet!', 'Your Account have been updated.');
                    }
                },{
                    text      	: 'Change Password',
                    iconCls   	: 'save',
                    scope       : me,
                    handler     : me.onPasswordChange
                }]
            }],
            listeners:{
                afterrender: {
                    fn: function(){
                        //me.store.load();
                    }
                }
            }
        });

        me.win = Ext.create('Ext.mitos.classes.window.Window', {
            width   : 420,
            title   :'Change you password',
            items   : [{
                xtype:'form',
                bodyPadding : 15,
                defaultType : 'textfield',
                defaults    : {labelWidth:130,width:380,inputType:'password'},
                items:[{
                    name: 'id',
                    hidden: true
                },{
                    fieldLabel          : 'Old Password',
                    name                : 'oPassword',
                    allowBlank          : false
                },{
                    fieldLabel          : 'New Password',
                    name                : 'nPassword',
                    allowBlank          : false,
                    id                  : 'myAccountPage_nPassword'
                },{
                    fieldLabel          : 'Re Type Password',
                    name                : 'vPassword',
                    allowBlank          : false,
                    vtype               : 'password',
                    initialPassField    : 'myAccountPage_nPassword',
                    validateOnChange    : true
                }]
            }],
            buttons:[{
                text    : 'Save',
                scope   : me,
                handler : me.onPasswordSave
            },{
                text    : 'Cancel',
                scope   : me,
                handler : me.onCancel
            }],
            listeners:{
                scope: me,
                close: me. onClose
            }

        });
        me.pageBody = [ me.myAccountForm ];
        me.callParent(arguments);
    },


    onPasswordSave:function(){

    },

    onPasswordChange:function(){
        this.win.show();
    },

    onCancel:function(){
        this.win.close();
    },

    onClose:function(){
        this.win.down('form').getForm().reset();
    },

    /**
    * This function is called from MitosAPP.js when
    * this panel is selected in the navigation panel.
    * place inside this function all the functions you want
    * to call every this panel becomes active
    */
    onActive:function(callback){
        var me = this,
            form = me.myAccountForm.getForm();

        this.store.load({
            scope: me,
            callback:function(record){
                form.loadRecord(record[0]);
            }
        });
        callback(true);
    }
});