//******************************************************************************
// new.ejs.php
// New Patient Entry Form
// v0.0.1
// 
// Author: Ernest Rodriguez
// Modified: GI Technologies, 2011
// 
// MitosEHR (Electronic Health Records) 2011
//******************************************************************************
Ext.define('Ext.mitos.view.miscellaneous.myaccount.MyAccount',{
    extend      : 'Ext.mitos.classes.RenderPanel',
    id          : 'panelMyAccount',
    pageTitle   : 'My Account',
    uses:[
        'Ext.mitos.classes.CRUDStore',
        'Ext.mitos.classes.GridPanel',
        'Ext.mitos.classes.combo.Titles',
        'Ext.mitos.classes.window.Window',
        'Ext.mitos.classes.combo.Facilities',
        'Ext.mitos.classes.combo.Authorizations'
    ],
    initComponent: function(){
        var page = this;
        /** @namespace Ext.QuickTips */
        Ext.QuickTips.init();
        // *************************************************************************************
        // Users Model and Data store
        // *************************************************************************************
        page.storeUsers = Ext.create('Ext.mitos.classes.CRUDStore',{
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
            model		: 'Users',
            idProperty	: 'id',
            read		: 'app/miscellaneous/myaccount/data_read.ejs.php',
          //create		:  the user can not create accounts
            update		: 'app/miscellaneous/myaccount/data_update.ejs.php',
          //destroy 	:  user will not be able to destroy his account
            autoLoad    : false
        });

        //------------------------------------------------------------------------------
        // When the data is loaded send values to de form
        //------------------------------------------------------------------------------
        var task = new Ext.util.DelayedTask(function(){
            var rec = page.storeUsers.getAt(0); // get the record from the store
            page.myAccountForm.getForm().loadRecord(rec);
        });
        page.storeUsers.on('load',function(){
            task.delay(200);
        });
        // *************************************************************************************
        // User Settings Form
        // Add or Edit purpose
        // *************************************************************************************
        page.myAccountForm = Ext.create('Ext.mitos.classes.form.FormPanel', {
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
                          Ext.create('Ext.mitos.classes.combo.Titles'),
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
                items: [
                    page.cmdSave = Ext.create('Ext.Button', {
                        text      	: 'Save',
                        iconCls   	: 'save',
                        handler   : function(){
                            var record =  page.storeUsers.getAt('0');
                            var fieldValues = page.myAccountForm.getForm().getValues();
                            for ( var k=0; k <= record.fields.getCount()-1; k++) {
                                var i = record.fields.get(k).name;
                                record.set( i, fieldValues[i] );
                            }
                             page.storeUsers.sync();	// Save the record to the dataStore
                             page.storeUsers.load();	// Reload the dataSore from the database

                            Ext.topAlert.msg('Sweet!', 'Your Account have been updated.');
                        }
                    }),'-',
                    page.cmdSavePass = Ext.create('Ext.Button', {
                        text      	: 'Change Password',
                        iconCls   	: 'save',
                        id        	: 'cmdSavePass',
                        handler     : function(){
                            page.formPass.getForm().reset();
                            var rec = page.storeUsers.getAt(0);
                            page.formPass.getForm().loadRecord(rec);
                            page.winPass.show();

                        }
                    })
                ]
            }],
            listeners:{
                afterrender: {
                    fn: function(){
                        //page.storeUsers.load();
                    }
                }
            }
        });
        page.formPass = Ext.form.FormPanel({
            bodyPadding : 15,
            defaultType : 'textfield',
            defaults    : {labelWidth:130,width:380,inputType:'password'},
            items :[{
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
        });
        page.winPass = Ext.create('Ext.mitos.classes.window.Window', {
            width   : 420,
            title   :'Change you password',
            form    : page.formPass,
            store   : page.storeUsers,
            scope   : page,
            idField : 'id'
        });
        page.pageBody = [ page.myAccountForm ];
        page.callParent(arguments);
    },
    /**
    * This function is called from MitosAPP.js when
    * this panel is selected in the navigation panel.
    * place inside this function all the functions you want
    * to call every this panel becomes active
    */
    onActive:function(callback){
        callback(true);
    }
}); //ens oNotesPage class