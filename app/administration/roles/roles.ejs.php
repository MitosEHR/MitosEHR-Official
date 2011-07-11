<?php 
//**********************************************************************************
// roles.ejs.php
// Description: Facilities Screen
// v0.0.3
// 
// Author: Ernesto J Rodriguez
// Modified: n/a
// 
// MitosEHR (Eletronic Health Records) 2011
//**********************************************************************************
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');
include_once($_SESSION['site']['root']."/classes/I18n.class.php");
//**********************************************************************************
// Reset session count 10 secs = 1 Flop
//**********************************************************************************
$_SESSION['site']['flops'] = 0;

?>
<script type="text/javascript">
delete Ext.mitos.Page;
Ext.onReady(function(){
    Ext.define('Ext.mitos.Page',{
		extend:'Ext.panel.Panel',
		uses:[
			'Ext.mitos.CRUDStore',
			'Ext.mitos.GridPanel',
			'Ext.mitos.RenderPanel',
			'Ext.mitos.TitlesComboBox',
			'Ext.mitos.SaveCancelWindow',
			'Ext.mitos.FacilitiesComboBox',
			'Ext.mitos.AuthorizationsComboBox'
		],
		initComponent: function(){
			var page = this;
			var rowPos; // Stores the current Grid Row Position (int)
			var currList; // Stores the current List Option (string)
			var currRec; // Store the current record (Object)
			var currPerm; //store the current permission (object)
			//******************************************************************************
			// Roles Store
			//******************************************************************************
			page.permStore = new Ext.create('Ext.mitos.CRUDStore',{
				fields: [
					{name: 'roleID', 		type: 'int'},
					{name: 'role_name', 	type: 'string'},
				    {name: 'permID', 		type: 'int'},
				    {name: 'perm_key', 		type: 'string'},
				    {name: 'perm_name', 	type: 'string'},
					{name: 'rolePermID', 	type: 'int'},
				    {name: 'role_id', 		type: 'int'},
				    {name: 'perm_id', 		type: 'int'},
				    {name: 'value', 		type: 'string'},
					{name: 'ac_perm', 		type: 'string'}
				],
			    model		: 'PermissionList',
			    idProperty	: 'permID',
				read		: 'app/administration/roles/data_read.ejs.php',
				create		: 'app/administration/roles/data_create.ejs.php?task=create_permission',
				update		: 'app/administration/roles/data_update.ejs.php?task=update_role_perms',
				destroy 	: 'app/administration/roles/data_destroy.ejs.php?task=delete_permission'
			});
			// ****************************************************************************
			// Structure, data for Roles
			// AJAX -> component_data.ejs.php
			// ****************************************************************************
			page.roleStore = new Ext.create('Ext.mitos.CRUDStore',{
				fields: [
					{name: 'id', type: 'int'},
			    	{name: 'role_name', type: 'string'}
				],
				model		: 'Roles',
				idProperty	: 'id',
				read		: 'app/administration/roles/component_data.ejs.php?task=roles',
				create		: 'app/administration/roles/data_create.ejs.php?task=create_role',
				update		: 'app/administration/roles/data_update.ejs.php?task=update_role',
				destroy 	: 'app/administration/roles/data_destroy.ejs.php?task=delete_role'
			});
			//------------------------------------------------------------------------------
			// When the data is loaded
			// Select the first record
			//------------------------------------------------------------------------------
			page.roleStore.on('load',function(ds,records,o){
				Ext.getCmp('cmbList').setValue(records[0].data.id);
				currList = records[0].data.id; // Get first result for first grid data
				page.permStore.load({params:{role_id: currList}}); // Filter the data store from the currList value
			});
			// *************************************************************************************
			// Federal EIN - TaxID Data Store
			// *************************************************************************************
			page.storePerms = new Ext.create('Ext.mitos.CRUDStore',{
				fields: [
					{name: 'value',	type: 'string'},
					{name: 'perm',	type: 'string'}
				],
		    	model		: 'permRecord',
		    	idProperty	: 'value',
		    	read		: 'app/administration/roles/component_data.ejs.php?task=perms'
			});
			function permck(val) {
			    if (val == 'No Access') {
			        return 'View <img src="ui_icons/no.gif" /> / Update <img src="ui_icons/no.gif" /> / Create <img src="ui_icons/no.gif" />';
			    } else if(val == 'View') {
			        return 'View <img src="ui_icons/yes.gif" /> / Update <img src="ui_icons/no.gif" /> / Create <img src="ui_icons/no.gif" />';
			    } else if (val == 'View/Update'){
			        return 'View <img src="ui_icons/yes.gif" /> / Update <img src="ui_icons/yes.gif" /> / Create <img src="ui_icons/no.gif" />';
			    } else if (val == 'View/Update/Create'){
			    	return 'View <img src="ui_icons/yes.gif" /> / Update <img src="ui_icons/yes.gif" /> / Create <img src="ui_icons/yes.gif" />';
			    }
			    return val;
			}
			// ****************************************************************************
			// Create the Role Form
			// ****************************************************************************
		    page.rolesForm = Ext.create('Ext.mitos.FormPanel', {
		        fieldDefaults: {
		            msgTarget	: 'side',
		            labelWidth	: 100
		        },
		        defaultType	: 'textfield',
		        defaults	: { anchor: '100%' },
		        items: [{
					hidden: true, name: 'id'
				},{
					xtype		: 'textfield',
					fieldLabel	: '<?php i18n("Role Name"); ?>',
					name		: 'role_name'
				}]
		    });
			// ****************************************************************************
			// Create the Permisions Form
			// ****************************************************************************
		    page.permsForm = Ext.create('Ext.mitos.FormPanel', {
		        fieldDefaults: {
		            msgTarget	: 'side',
		            labelWidth	: 100
		        },
		        defaultType	: 'textfield',
		        defaults	: { anchor: '100%' },
		        items: [{ 
					hidden: true, name: 'permID'
				},{
					xtype		: 'textfield',
					fieldLabel	: '<?php i18n("Permission Name"); ?>',
					name		: 'perm_name'
				},{
					xtype		: 'textfield',
					fieldLabel	: '<?php i18n("Permission Unique Name"); ?>',
					name		: 'perm_key'
				}]
		    });
			// ****************************************************************************
			// Create the Window
			// ****************************************************************************	
			page.winRoles = Ext.create('Ext.mitos.SaveCancelWindow', {
				width		: 450,
				form		: page.rolesForm,
				store		: page.roleStore,
	    		scope		: page,
	    		idField		: 'id'
				
			});
			// ****************************************************************************
			// Create the Window
			// ****************************************************************************	
			page.winPerms = Ext.create('Ext.mitos.SaveCancelWindow', {
				form		: page.permsForm,
	    		store		: page.permStore,
	    		scope		: page,
	    		idField		: 'permID'
			});
			// *************************************************************************************
			// RowEditor Class
			// *************************************************************************************
            //noinspection JSUnusedGlobalSymbols
            page.rowEditing = Ext.create('Ext.grid.plugin.CellEditing', {
				//clicksToEdit: 1,
				saveText: 'Update',
				errorSummary: false,
				listeners: {
					afteredit: function () {
						page.permStore.sync();
						page.permStore.load({params:{role_id: currList}});
					}
				}
			});
			// ****************************************************************************
			// Create the GridPanel
			// ****************************************************************************
			page.rolesGrid = Ext.create('Ext.mitos.GridPanel', {
				store	: page.permStore,
				plugins	: [page.rowEditing],
		        columns	: [{
		        	dataIndex: 'permID', 
		        	hidden: true
		        },{
					text     	: '<?php i18n("Secction Area"); ?>',
					flex     	: 1,
					sortable 	: true,
					dataIndex	: 'perm_name',
					field: {
		                xtype: 'textfield',
		                allowBlank: false
		            }
		        },{
					header		: '<?php i18n("Access Control / Permision"); ?>',
		            dataIndex	: 'ac_perm',
		            renderer 	: permck,
					flex     	: 1,
		            field: {
		                xtype			: 'combo',
		                triggerAction	: 'all',
						valueField		: 'value',
						displayField	: 'perm',
						editable		: false,
						queryMode		: 'local', 
						store			: page.storePerms
					},
		            lazyRender: true,
		            listClass: 'x-combo-list-small'
		        }],
				viewConfig: { stripeRows: true },
				listeners: {
					itemclick: {
			        	fn: function(DataView, record, item, rowIndex, e){ 
			           		page.cmdDeletePerm.enable();
			           		currPerm = record.data.permID;
							currRec = page.permStore.getAt(rowIndex);
			            }
					}
				},
				dockedItems: [{
					xtype	: 'toolbar',
					dock	: 'top',
					items: [
                        new Ext.create('Ext.Button', {
                            text	: '<?php i18n("Add a Role"); ?>',
                            iconCls	:'icoAddRecord',
                            handler	: function(){
                                page.rolesForm.getForm().reset(); // Clear the form
                                page.winRoles.show();
                                page.winRoles.setTitle('<?php i18n("Add a Role"); ?>');
                            }
                        }),'-',
                        new Ext.create('Ext.Button', {
                            text	: '<?php i18n("Add a Permission"); ?>',
                            iconCls	:'icoAddRecord',
                            handler	: function(){
                                page.permsForm.getForm().reset(); // Clear the form
                                page.winPerms.show();
                                page.winPerms.setTitle('<?php i18n("Add a Permission"); ?>');
                            }
		
                        }),'-','<?php i18n('Select Role'); ?>: ',{
                            name			: 'cmbList',
                            width			: 250,
                            xtype			: 'combo',
                            displayField	: 'role_name',
                            id				: 'cmbList',
                            mode			: 'local',
                            triggerAction	: 'all',
                            hiddenName		: 'id',
                            valueField		: 'id',
                            ref				: '../cmbList',
                            iconCls			: 'icoListOptions',
                            editable		: false,
                            store			: page.roleStore,
                            listeners: {
                                select: function(combo, record){
                                    // Reload the data store to reflect the new selected list filter
                                    currList = record[0].data.id;
                                    page.permStore.load({params:{role_id: currList}});
                                }
                            }
                        },'-',
                        new Ext.create('Ext.Button', {
                            text		: '<?php i18n("Edit a Role"); ?>',
                            iconCls		: 'edit',
                            handler		: function(DataView, record, item, rowIndex, e){
                                page.rolesForm.getForm().reset(); // Clear the form
                                var rec = page.roleStore.getById(currList); // get the record from the store
                                page.rolesForm.getForm().loadRecord(rec);
                                page.winRoles.setTitle('<?php i18n("Edit a Role"); ?>');
                                page.permStore.load({params:{role_id: currList}});
                            }
                        }),'-',
                        new Ext.create('Ext.Button', {
                            text		: '<?php i18n("Delete Role"); ?>',
                            iconCls		: 'delete',
                            handler: function(){
                                Ext.Msg.show({
                                    title	: '<?php i18n('Please confirm...'); ?>',
                                    icon	: Ext.MessageBox.QUESTION,
                                    msg		:'<?php i18n('Are you sure to delete this Role?'); ?>',
                                    buttons	: Ext.Msg.YESNO,
                                    fn		:function(btn,msgGrid){
                                            if(btn=='yes'){
                                            var rec = page.roleStore.getById( currList ); // get the record from the store
                                            page.roleStore.remove(rec);
                                            page.roleStore.sync();
                                            page.roleStore.load();
                                        }
                                    }
                                });
                            }
                        }),'-',
                        page.cmdDeletePerm = new Ext.create('Ext.Button', {
                            text		: '<?php i18n("Delete Permission"); ?>',
                            iconCls		: 'delete',
                            disabled  	: true,
                            handler: function(){
                                Ext.Msg.show({
                                    title	: '<?php i18n('Please confirm...'); ?>',
                                    icon	: Ext.MessageBox.QUESTION,
                                    msg		:'<?php i18n('Are you sure to delete this Permission? You will delete this permission in all Roles'); ?>',
                                    buttons	: Ext.Msg.YESNO,
                                    fn		:function(btn,msgGrid){
                                            if(btn=='yes'){
                                            var rec = permStore.getById( currPerm ); // get the record from the store
                                            page.permStore.remove(rec);
                                            page.permStore.sync();
                                            page.permStore.load({params:{role_id: currList}});
                                        }
                                    }
                                });
                            }
                        })
                    ]
				}]
		    }); // END Facility Grid
		    new Ext.create('Ext.mitos.RenderPanel', {
		        pageTitle: '<?php i18n('Roles and Permissions'); ?>',
		        pageBody: [page.rolesGrid]
		    });
		}
	}); // end roles class
	Ext.create('Ext.mitos.Page');
}); // End ExtJS
</script>