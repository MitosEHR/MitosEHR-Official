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
                    {name: 'username',              type: 'string'},
                    {name: 'password',              type: 'auto'},
                    {name: 'authorizedd',           type: 'string'},
                    {name: 'authorized',            type: 'string'},
                    {name: 'actived',            	type: 'string'},
                    {name: 'active',            	type: 'string'},
                    {name: 'info',                  type: 'string'},
                    {name: 'source',                type: 'int'},
                    {name: 'fname',                 type: 'string'},
                    {name: 'mname',                 type: 'string'},
                    {name: 'lname',                 type: 'string'},
                    {name: 'fullname',              type: 'string'},
                    {name: 'federaltaxid',          type: 'string'},
                    {name: 'federaldrugid',         type: 'string'},
                    {name: 'upin',                  type: 'string'},
                    {name: 'facility',              type: 'string'},
                    {name: 'facility_id',           type: 'auto'},
                    {name: 'see_auth',              type: 'auto'},
                    {name: 'active',                type: 'auto'},
                    {name: 'npi',                   type: 'string'},
                    {name: 'title',                 type: 'string'},
                    {name: 'specialty',             type: 'string'},
                    {name: 'billname',              type: 'string'},
                    {name: 'email',                 type: 'string'},
                    {name: 'url',                   type: 'string'},
                    {name: 'assistant',             type: 'string'},
                    {name: 'organization',          type: 'string'},
                    {name: 'valedictory',           type: 'string'},
                    {name: 'fulladdress',           type: 'string'},
                    {name: 'cal_ui',                type: 'string'},
                    {name: 'taxonomy',              type: 'string'},
                    {name: 'ssi_relayhealth',       type: 'string'},
                    {name: 'calendar',              type: 'int'},
                    {name: 'abook_type',            type: 'string'},
                    {name: 'pwd_expiration_date',   type: 'string'},
                    {name: 'pwd_history1',          type: 'string'},
                    {name: 'pwd_history2',          type: 'string'},
                    {name: 'default_warehouse',     type: 'string'},
                    {name: 'ab_name',               type: 'string'},
                    {name: 'ab_title',              type: 'string'}
                ],
                model		: 'Users',
                idProperty	: 'id',
                read		: 'interface/miscellaneous/my_account/data_read.ejs.php',
              //create		:  the user can not create accounts
                update		: 'interface/miscellaneous/my_account/data_update.ejs.php'
              //destroy 	:  user will not be able to destroy his account
            });

            //------------------------------------------------------------------------------
            // When the data is loaded semd values to de form
            //------------------------------------------------------------------------------
            page.storeUsers.on('load',function(DataView, records, o){
                var rec = page.storeUsers.getById(1); // get the record from the store
                page.myAccountForm.getForm().loadRecord(rec);
            });

            // *************************************************************************************
            // User Settinga Form
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
                              Ext.create('Ext.mitos.TitlesComboBox', {width: 60 }),
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
                    },{
                        width: 110, xtype: 'displayfield', value: '<?php i18n('Notes'); ?>: '
                    }]
                }],
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [
                        page.cmdSave = new Ext.create('Ext.Button', {
                            text      	: '<?php i18n("Save"); ?>',
                            iconCls   	: 'save',
                            id        	: 'cmdSave',
                            handler   : function(){

                            }
                        }),'-',
                        page.cmdSavePass = new Ext.create('Ext.Button', {
                            text      	: '<?php i18n("Change Password"); ?>',
                            iconCls   	: 'save',
                            id        	: 'cmdSavePass',
                            handler   : function(){

                            }
                        })
                    ]
                }]
            });

            //***********************************************************************************
            // Top Render Panel
            // This Panel needs only 3 arguments...
            // PageTigle 	- Title of the current page
            // PageLayout 	- default 'fit', define this argument if using other than the default value
            // PageBody 	- List of items to display [foem1, grid1, grid2]
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




