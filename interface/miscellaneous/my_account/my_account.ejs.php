<?php 
//******************************************************************************
// new.ejs.php
// New Patient Entry Form
// v0.0.1
// 
// Author: Ernest Rodriguez
// Modified: Gino Rivera
// 
// MitosEHR (Eletronic Health Records) 2011
//******************************************************************************
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

include_once("../../../library/I18n/I18n.inc.php");

//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;

?>
<script type="text/javascript">
Ext.onReady(function(){
    Ext.define('Ext.mitos.myAccountPage',{
		extend:'Ext.panel.Panel',
		uses:[
			'Ext.mitos.CRUDStore',
			'Ext.mitos.GridPanel',
			'Ext.mitos.TopRenderPanel',
			'Ext.mitos.TitlesComboBox',
			'Ext.mitos.SaveCancelWindow',
			'Ext.mitos.FacilitiesComboBox',
			'Ext.mitos.AuthorizationsComboBox'
		],
		initComponent: function(){
			var page = this;
            /** @namespace Ext.QuickTips */
            Ext.QuickTips.init();
            var rowPos; // Stores the current Grid Row Position (int)
            var currRec; // Store the current record (Object)

            // *************************************************************************************
            // Users Model and Data store
            // *************************************************************************************
            page.storeUsers = new Ext.create('Ext.mitos.CRUDStore',{
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
                read		: 'interface/miscellaneous/my_account/data_read.ejs.php',
              //create		:  the user can not create accounts
                update		: 'interface/miscellaneous/my_account/data_update.ejs.php',
              //destroy 	:  user will not be able to destroy his account
                autoLoad    : false
            });

            //------------------------------------------------------------------------------
            // When the data is loaded semd values to de form
            //------------------------------------------------------------------------------
            var task = new Ext.util.DelayedTask(function(){
                var rec = page.storeUsers.getAt(0); // get the record from the store
                page.myAccountForm.getForm().loadRecord(rec);
            });
            page.storeUsers.on('load',function(DataView, records, o){
                task.delay(200);
            });
            // *************************************************************************************
            // User Settings Form
            // Add or Edit purpose
            // *************************************************************************************
            page.myAccountForm = new Ext.create('Ext.mitos.FormPanel', {
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
                    title: '<?php i18n('Personal Info'); ?>',
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
                            { width: 110, xtype: 'displayfield', value: '<?php i18n('First, Middle, Last'); ?>: '},
                              new Ext.create('Ext.mitos.TitlesComboBox'),
                            { width: 105,  xtype: 'textfield', name: 'fname' },
                            { width: 100,  xtype: 'textfield', name: 'mname' },
                            { width: 175, xtype: 'textfield', name: 'lname' }
                        ]
                    }]
                },{
                    xtype:'fieldset',
                    title: '<?php i18n('Login Info'); ?>',
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
                            { width: 110, xtype: 'displayfield', value: '<?php i18n('Username'); ?>: '},
                            { width: 150, xtype: 'textfield', name: 'username' },
                            { width: 120, xtype: 'displayfield', value: '<?php i18n('Password'); ?>: '},
                            { width: 175, xtype: 'textfield', name: 'password',  inputType: 'password', disabled: true }
                        ]
                    }]
                },{
                    xtype:'fieldset',
                    title: '<?php i18n('Other Info'); ?>',
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
                            { width: 110, xtype: 'displayfield', value: '<?php i18n('Default Facility'); ?>: '},
                              Ext.create('Ext.mitos.FacilitiesComboBox', {width: 170 }),
                            { width: 100, xtype: 'displayfield', value: '<?php i18n('Authorizations'); ?>: '},
                              Ext.create('Ext.mitos.AuthorizationsComboBox', {width: 175 })
                        ]
                    },{
                        xtype: 'fieldcontainer',
                        defaults: { hideLabel: true },
                        items: [
                            { width: 110, xtype: 'displayfield', value: '<?php i18n('Access Control'); ?>: '},
                              Ext.create('Ext.mitos.RolesComboBox', {width: 170 }),
                            { width: 100, xtype: 'displayfield', value: '<?php i18n('Taxonomy'); ?>: '},
                            { width: 175, xtype: 'textfield', name: 'taxonomy' }
                        ]
                    },{
                        xtype: 'fieldcontainer',
                        defaults: { hideLabel: true },
                        items: [
                            { width: 110, xtype: 'displayfield', value: '<?php i18n('Federal Tax ID'); ?>: '},
                            { width: 170, xtype: 'textfield', name: 'federaltaxid' },
                            { width: 100, xtype: 'displayfield', value: '<?php i18n('Fed Drug ID'); ?>: '},
                            { width: 175, xtype: 'textfield', name: 'federaldrugid' }
                        ]
                    },{
                        xtype: 'fieldcontainer',
                        defaults: { hideLabel: true },
                        items: [
                            { width: 110, xtype: 'displayfield', value: '<?php i18n('UPIN'); ?>: '},
                            { width: 170, xtype: 'textfield', name: 'upin' },
                            { width: 100, xtype: 'displayfield', value: '<?php i18n('NPI'); ?>: '},
                            { width: 175, xtype: 'textfield', name: 'npi' }
                        ]
                    },{
                        xtype: 'fieldcontainer',
                        defaults: { hideLabel: true },
                        items: [
                            { width: 110, xtype: 'displayfield', value: '<?php i18n('Job Description'); ?>: '},
                            { width: 455, xtype: 'textfield', name: 'specialty' }
                        ]
                    }]
                }],
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [
                        page.cmdSave = new Ext.create('Ext.Button', {
                            text      	: '<?php i18n("Save"); ?>',
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
                        page.cmdSavePass = new Ext.create('Ext.Button', {
                            text      	: '<?php i18n("Change Password"); ?>',
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
                            page.storeUsers.load();
                        }
                    }
                }
            });
            page.formPass = new Ext.form.FormPanel({
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
            page.winPass = new Ext.create('Ext.mitos.SaveCancelWindow', {
                width   : 420,
                title   :'Change you password',
                form    : page.formPass,
                store   : page.storeUsers,
                scope   : page,
                idField : 'id'
            });
            //***********************************************************************************
            // Top Render Panel
            // This Panel needs only 3 arguments...
            // PageTitle 	- Title of the current page
            // PageLayout 	- default 'fit', define this argument if using other than the default value
            // PageBody 	- List of items to display [form 1, grid 1, grid 2]
            //***********************************************************************************
            Ext.create('Ext.mitos.TopRenderPanel', {
                pageTitle: 'My Account',
                pageBody: [page.myAccountForm]
            });
			page.callParent(arguments);
		} // end of initComponent
	}); //ens oNotesPage class
    Ext.create('Ext.mitos.myAccountPage');
}); // End ExtJS
</script>




