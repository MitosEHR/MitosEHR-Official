<?php 
//******************************************************************************
// Users.ejs.php
// Description: Users Screen
// v0.0.4
// 
// Author: Ernesto J Rodriguez
// Modified: n/a
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
$_SESSION['site']['flops'] = 0; ?>
<script type="text/javascript">
Ext.onReady(function(){
	Ext.define('Ext.mitos.UserPage',{
		extend : 'Ext.panel.Panel',
		uses: ['Ext.mitos.TopRenderPanel', 'Ext.mitos.StdGridPanel'],
		initComponent: function(){
			var page = this;
			Ext.QuickTips.init();
			var rowPos; // Stores the current Grid Row Position (int)
			var currRec; // Store the current record (Object)
			// *************************************************************************************
			// If a object called winUser exists destroy it, to create a new one.
			// *************************************************************************************
			if ( Ext.getCmp('winUsers') ){ Ext.getCmp('winUsers').destroy(); }

			function authCk(val) {
			    if (val == 'Yes') {
			        return '<img src="ui_icons/yes.gif" />';
			    } else if(val == 'No') {
			        return '<img src="ui_icons/no.gif" />';
			    } 
			    return val;
			}
			// *************************************************************************************
			// Create the GridPanel
			// *************************************************************************************
			page.userGrid = new Ext.create('Ext.mitos.StdGridPanel', {
				scope : this,
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
			    idProperty 	: 'id',
			    read	: 'interface/administration/users/data_read.ejs.php',
				create	: 'interface/administration/users/data_create.ejs.php',
				update	: 'interface/administration/users/data_update.ejs.php',
				destroy : 'interface/administration/users/data_destroy.ejs.php',
				listeners: {
			   		// -----------------------------------------
			   	  	// Single click to select the record
			   	  	// -----------------------------------------
			   	  	itemclick: {
			   			fn: function(DataView, record, item, rowIndex, e){ 
							page.frmUsers.getForm().reset();
							page.cmdEdit.enable();
							page.cmdDelete.enable();
			   		  		var rec = this.store.getAt(rowIndex);
			   		  		page.frmUsers.getForm().loadRecord(rec);
							currRec = rec;
		            		rowPos = rowIndex;
			   		  	}
			   	  	},
			   	  	// -----------------------------------------
			   	  	// Double click to select the record, and edit the record
			   	  	// -----------------------------------------
			   	  	itemdblclick: { 
			   			fn: function(DataView, record, item, rowIndex, e){ 
							page.frmUsers.getForm().reset();
							page.cmdEdit.enable();
							page.cmdDelete.enable();
							var rec = this.store.getAt(rowIndex); // get the record from the store
							page.frmUsers.getForm().loadRecord(rec); // load the record selected into the form
							currRec = rec;
		            		rowPos = rowIndex;
							page.winUsers.setTitle('Edit User');
			   		  		page.winUsers.show();
			   		  	}
			  	  	}
			  	},
				columns: [
					{ text: 'id', sortable: false, dataIndex: 'id', hidden: true},
			    	{ width: 100,  text: '<?php i18n("Username"); ?>', sortable: true, dataIndex: 'username' },
			    	{ width: 200,  text: '<?php i18n("Name"); ?>', sortable: true, dataIndex: 'fullname' },
			    	{ flex: 1,  text: '<?php i18n("Aditional info"); ?>', sortable: true, dataIndex: 'info' },
			    	{ text: '<?php i18n("Active?"); ?>', sortable: true, dataIndex: 'actived',renderer 	: authCk },
			    	{ text: '<?php i18n("Authorized?"); ?>', sortable: true, dataIndex: 'authorizedd', renderer: authCk }
			  	],
			  	//-----------------------------------------------
			    //  Start grid menu bar
				//-----------------------------------------------
			  	dockedItems: [{
			  	  	xtype: 'toolbar',
				  	dock: 'top',
				  	items: [ 
			  		page.cmdAdd = new Ext.create('Ext.Button', {
					    text      : '<?php i18n("Add User"); ?>',
					    iconCls   : 'icoAddressBook',
					    handler   : function(){
					    	page.frmUsers.getForm().reset(); // Clear the form
					      	page.winUsers.show();
						  	page.winUsers.setTitle('<?php i18n("Add User"); ?>'); 
					    }
					}),'-',
					page.cmdEdit = new Ext.create('Ext.Button', {
					    text      : '<?php i18n("Edit User"); ?>',
					    iconCls   : 'edit',
					    disabled  : true,
					    handler: function(){ 
							page.winUsers.setTitle('<?php i18n("Add User"); ?>'); 
					    	page.winUsers.show();
					    }
					}),'-',
					page.cmdDelete = new Ext.create('Ext.Button', {
						text: '<?php i18n("Delete User"); ?>',
						iconCls: 'delete',
						disabled: true,
						handler: function(){
							Ext.Msg.show({
								title: '<?php i18n('Please confirm...'); ?>', 
								icon: Ext.MessageBox.QUESTION,
								msg:'<?php i18n('Are you sure to delete this User?'); ?>',
								buttons: Ext.Msg.YESNO,
								fn:function(btn,msgGrid){
									if(btn=='yes'){
										page.userGrid.store.remove( currRec );
										page.userGrid.store.sync();
										page.userGrid.store.load();
					    		    }
								}
							});
						}
				  	})]					    
			  	}]
			}); // END GRID
			// *************************************************************************************
			// User Add Eddit Form
			// *************************************************************************************
			page.frmUsers = new Ext.form.FormPanel({
				bodyStyle   : 'padding: 5px;',
				autoWidth   : true,
				border      : false,
				hideLabels  : true,
				defaults: {
					labelWidth: 89,
				    anchor: '100%',
				    layout: {
				    	type: 'hbox',
				        defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
				    }
				},
				items: [
					{ xtype: 'textfield', hidden: true, id: 'id', name: 'id'},
				    { xtype: 'fieldcontainer',
				      defaults: { hideLabel: true },
				      msgTarget : 'under', 
				      items: [
				        { width: 100, xtype: 'displayfield', value: '<?php i18n('Username'); ?>: '},
				        { width: 100, xtype: 'textfield', id: 'username', name: 'username' },
				        { width: 100, xtype: 'displayfield', value: '<?php i18n('Password'); ?>: '},
				        { width: 105, xtype: 'textfield', id: 'password', name: 'password',  inputType: 'password' }
				      ] 
				    },{
				      xtype: 'fieldcontainer',
				      defaults: { hideLabel: true },
				      msgTarget : 'under', 
				      items: [
				        { width: 100, xtype: 'displayfield', value: '<?php i18n('First, Middle, Last'); ?>: '},
				          Ext.create('Ext.mitos.TitlesComboBox'),
				        { width: 80,  xtype: 'textfield', id: 'fname', name: 'fname' },
				        { width: 65,  xtype: 'textfield', id: 'mname', name: 'mname' },
				        { width: 105, xtype: 'textfield', id: 'lname', name: 'lname' },
				      ]
				    },{ 
				      xtype: 'fieldcontainer',
				      defaults: { hideLabel: true },
				      msgTarget : 'under', 
				      items: [
				        { width: 100, xtype: 'displayfield', value: '<?php i18n('Active?'); ?>: '},
				        { width: 100, xtype: 'checkbox', id: 'active', name: 'active' },
				        { width: 100, xtype: 'displayfield', value: '<?php i18n('Authorized?'); ?>: '},
				        { width: 105, xtype: 'checkbox', value: 'off', id: 'authorized', name: 'authorized' }
				      ]  
				    },{ 
				      xtype: 'fieldcontainer',
				      defaults: { hideLabel: true },
				      msgTarget : 'under', 
				      items: [
				        { width: 100, xtype: 'displayfield', value: '<?php i18n('Default Facility'); ?>: '},
				        Ext.create('Ext.mitos.FacilitiesComboBox', { width: 100 }),
				        { width: 100, xtype: 'displayfield', value: '<?php i18n('Authorizations'); ?>: '},
						  Ext.create('Ext.mitos.AuthorizationsComboBox', { width: 105 })
				      ] 
				    },{ 
				      xtype: 'fieldcontainer',
				      defaults: { hideLabel: true },
				      items: [
				        { width: 100, xtype: 'displayfield', value: '<?php i18n('Access Control'); ?>: '},
				          Ext.create('Ext.mitos.RolesComboBox', {width: 100 }),
				        { width: 100, xtype: 'displayfield', value: '<?php i18n('Taxonomy'); ?>: '},
				        { width: 105, xtype: 'textfield', id: 'taxonomy',  name: 'taxonomy' }
				      ]
				    },{ 
				      xtype: 'fieldcontainer',
				      defaults: { hideLabel: true },
				      items: [
				        { width: 100, xtype: 'displayfield', value: '<?php i18n('Federal Tax ID'); ?>: '},
				        { width: 100, xtype: 'textfield', id: 'federaltaxid', name: 'federaltaxid' },
				        { width: 100, xtype: 'displayfield', value: '<?php i18n('Fed Drug ID'); ?>: '},
				        { width: 105, xtype: 'textfield', id: 'federaldrugid', name: 'federaldrugid' }
				      ]
				    },{
				      xtype: 'fieldcontainer',
				      defaults: { hideLabel: true },
				      items: [
				       	{ width: 100, xtype: 'displayfield', value: '<?php i18n('UPIN'); ?>: '},
				        { width: 100, xtype: 'textfield', id: 'upin', name: 'upin' },
				        { width: 100, xtype: 'displayfield', value: '<?php i18n('NPI'); ?>: '},
				        { width: 105, xtype: 'textfield', id: 'npi', name: 'npi' }
				      ]
				    },{ 
				      xtype: 'fieldcontainer',
				      defaults: { hideLabel: true },
				      items: [
				       	{ width: 100, xtype: 'displayfield', value: '<?php i18n('Job Description'); ?>: '},
				        { width: 315, xtype: 'textfield', id: 'specialty', name: 'specialty' },
				      ]  
				    },{html: '<hr style="margin:5px 0"><p><?php i18n('Additional Info'); ?>:</p>', border:false},
				    { width: 410, xtype: 'htmleditor', id: 'info', name: 'info', emptyText: 'info', },
				]
			});
			// *************************************************************************************
			// User Add/Edit Window
			// *************************************************************************************
			page.winUsers = new Ext.create('Ext.mitos.SaveCancelWindow', {
				title       : '<?php i18n('Add or Edit User'); ?>',
	    		items		: [page.frmUsers],
	    		buttons: [{
		            text: '<?php i18n('Save'); ?>',
		            handler: function(){
						//----------------------------------------------------------------
						// Check if it has to add or update
						// Update: 
						// 1. Get the record from store, 
						// 2. get the values from the form, 
						// 3. copy all the 
						// values from the form and push it into the store record.
						// Add: The re-formated record to the dataStore
						//----------------------------------------------------------------
						if (page.frmUsers.getForm().findField('id').getValue()){ // Update
							var id = page.frmUsers.getForm().findField('id').getValue();
							var record = page.userGrid.store.getAt(rowPos);
							var fieldValues = page.frmUsers.getForm().getValues();
							for ( k=0; k <= record.fields.getCount()-1; k++) {
								i = record.fields.get(k).name;
								record.set( i, fieldValues[i] );
							}
							
						} else { // Add
							//----------------------------------------------------------------
							// 1. Convert the form data into a JSON data Object
							// 2. Re-format the Object to be a valid record (UserRecord)
							// 3. Add the new record to the datastore
							//----------------------------------------------------------------
							var obj = eval( '(' + Ext.JSON.encode(page.frmUsers.getForm().getValues()) + ')' );
							page.userGrid.store.add( obj );
						}
						page.winUsers.hide();	// Finally hide the dialog window
						page.userGrid.store.sync();	// Save the record to the dataStore
						page.userGrid.store.load();	// Reload the dataSore from the database
					}
		        },{
		            text: '<?php i18n('Cancel'); ?>',
		            handler: function(){
		            	page.winUsers.hide();
		            }
		        }]
			});
			//***********************************************************************************
			// Top Render Panel 
			// This Panel needs only 3 arguments...
			// PageTigle 	- Title of the current page
			// PageLayout 	- default 'fit', define this argument if using other than the default value
			// PageBody 	- List of items to display [foem1, grid1, grid2]
			//***********************************************************************************
			new Ext.create('Ext.mitos.TopRenderPanel', {
		        pageTitle: '<?php i18n('Users'); ?>',
		        pageBody: [page.userGrid]
		    });
			page.callParent(arguments);
		}
	}); //ens UserPage class
    Ext.create('Ext.mitos.UserPage');
}); // End ExtJS
</script>