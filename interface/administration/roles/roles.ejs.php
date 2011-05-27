<?php 
//******************************************************************************
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

include_once("../../../library/I18n/I18n.inc.php");

//**********************************************************************************
// Reset session count 10 secs = 1 Flop
//**********************************************************************************
$_SESSION['site']['flops'] = 0;

?>
<script type="text/javascript">
// *************************************************************************************
// Sencha trying to be like a language
// using requiered to load diferent components
// *************************************************************************************
Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath('Ext.ux', '<?php echo $_SESSION['dir']['ux']; ?>');
Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.state.*',
    'Ext.toolbar.Paging',
    'Ext.ux.SlidingPager'
]);

Ext.onReady(function(){
	//******************************************************************************
	// ExtJS Global variables 
	//******************************************************************************
	var rowPos; // Stores the current Grid Row Position (int)
	var currList; // Stores the current List Option (string)
	var currRec; // Store the current record (Object)
	var currPerm; //store the current permission (object)
	//******************************************************************************
	// Sanitizing Objects!
	// Destroy them, if already exists in the browser memory.
	// This destructions must be called for all the objects that
	// are rendered on the document.body 
	//******************************************************************************
	if ( Ext.getCmp('winRoles') ){ Ext.getCmp('winRoles').destroy(); }
	if ( Ext.getCmp('winPerms') ){ Ext.getCmp('winPerms').destroy(); }
	//******************************************************************************
	// Roles model
	//******************************************************************************
	var permModel = Ext.define("PermissionList", {extend: "Ext.data.Model", fields: [
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
		idProperty: 'permID'
	});

	//******************************************************************************
	// Roles Store
	//******************************************************************************
	var permStore = new Ext.data.Store({
	    model		: 'PermissionList',
	    proxy		: {
	    	type	: 'ajax',
			api		: {
				read	: 'interface/administration/roles/data_read.ejs.php',
				create	: 'interface/administration/roles/data_create.ejs.php?task=create_permission',
				update	: 'interface/administration/roles/data_update.ejs.php?task=update_role_perms',
				destroy : 'interface/administration/roles/data_destroy.ejs.php?task=delete_permission'
			},
	        reader: {
	            type			: 'json',
	            idProperty		: 'permID',
	            totalProperty	: 'totals',
	            root			: 'row'
	    	},
	    	writer: {
				type	 		: 'json',
				writeAllFields	: true,
				allowSingle	 	: true,
				encode	 		: true,
				root	 		: 'row'
			}
	    },
	    autoLoad: true
	});

	// ****************************************************************************
	// Structure, data for Roles
	// AJAX -> component_data.ejs.php
	// ****************************************************************************
	var roleModel = Ext.define("Roles", {extend: "Ext.data.Model", fields: [
		{name: 'id', type: 'int'},
	    {name: 'role_name', type: 'string'}
	],
		idProperty: 'id'
	});
	var roleStore = new Ext.data.Store({
		model		: 'Roles',
		proxy		: {
			type	: 'ajax',
			api		: {
				read	: 'interface/administration/roles/component_data.ejs.php?task=roles',
				create	: 'interface/administration/roles/data_create.ejs.php?task=create_role',
				update	: 'interface/administration/roles/data_update.ejs.php?task=update_role',
				destroy : 'interface/administration/roles/data_destroy.ejs.php?task=delete_role'
			},
	        reader: {
	            type			: 'json',
	            idProperty		: 'id',
	            totalProperty	: 'totals',
	            root			: 'row'
	    	},
	    	writer: {
				type	 		: 'json',
				writeAllFields	: true,
				allowSingle	 	: true,
				encode	 		: true,
				root	 		: 'row'
			}
		},
		autoLoad: true
	}); // End storeTitles
	//------------------------------------------------------------------------------
	// When the data is loaded
	// Select the first record
	//------------------------------------------------------------------------------
	roleStore.on('load',function(ds,records,o){
		Ext.getCmp('cmbList').setValue(records[0].data.id);
		currList = records[0].data.id; // Get first result for first grid data
		permStore.load({params:{role_id: currList}}); // Filter the data store from the currList value
	});

	// *************************************************************************************
	// Federal EIN - TaxID Data Store
	// *************************************************************************************
	Ext.define("permRecord", {extend: "Ext.data.Model", fields: [
			{name: 'value',	type: 'string'},
			{name: 'perm',	type: 'string'}
		]
	});
	var storePerms = new Ext.data.Store({
    	model		: 'permRecord',
    	proxy		: {
	   		type	: 'ajax',
			api		: {
				read	: 'interface/administration/roles/component_data.ejs.php?task=perms'
			},
    	   	reader: {
        	    type			: 'json',
   	        	idProperty		: 'value',
	       	    totalProperty	: 'totals',
    	       	root			: 'row'
   			}
   		},
    	autoLoad: true
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
    var rolesForm = Ext.create('Ext.form.Panel', {
    	frame		: false,
    	border		: false,
    	id			: 'rolesForm',
        bodyStyle	:'padding:2px',
        fieldDefaults: {
            msgTarget	: 'side',
            labelWidth	: 100
        },
        defaultType	: 'textfield',
        defaults	: { anchor: '100%' },
        items: [{
			xtype: 'textfield', 
			hidden: true, 
			id: 'id', name: 'id'
		},{
			xtype		: 'textfield',
			fieldLabel	: '<?php i18n("Role Name"); ?>',
			id			: 'role_name', 
			name		: 'role_name'
		}],

        buttons: [{
            text: 'Save',
            handler: function(){
				if (rolesForm.getForm().findField('id').getValue()){ // Update
					var record = roleStore.getById(currList);
					var fieldValues = rolesForm.getForm().getValues();
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
					var obj = eval( '(' + Ext.JSON.encode(rolesForm.getForm().getValues()) + ')' );
					var rec = new roleModel(obj);
					roleStore.add( rec );
				}
				winRoles.hide();	// Finally hide the dialog window
				roleStore.sync();	// Save the record to the dataStore
				roleStore.load();	// Reload the dataSore from the database
			}
        },{
            text: 'Cancel',
            handler: function(){
            	winRoles.hide();
            }
        }]
    });
	// ****************************************************************************
	// Create the Permisions Form
	// ****************************************************************************
    var permsForm = Ext.create('Ext.form.Panel', {
    	frame		: false,
    	border		: false,
    	id			: 'permsForm',
        bodyStyle	: 'padding:2px',
        fieldDefaults: {
            msgTarget	: 'side',
            labelWidth	: 100
        },
        defaultType	: 'textfield',
        defaults	: { anchor: '100%' },
        items: [{
			xtype		: 'textfield',
			fieldLabel	: '<?php i18n("Permission Name"); ?>',
			id			: 'perm_name', 
			name		: 'perm_name'
		},{
			xtype		: 'textfield',
			fieldLabel	: '<?php i18n("Permission Unique Name"); ?>',
			id			: 'perm_key', 
			name		: 'perm_key'
		}],
        buttons: [{
            text: 'Save',
            handler: function(){
				//----------------------------------------------------------------
				// 1. Convert the form data into a JSON data Object
				// 2. Re-format the Object to be a valid record (UserRecord)
				// 3. Add the new record to the datastore
				//----------------------------------------------------------------
				var obj = eval( '(' + Ext.JSON.encode(permsForm.getForm().getValues()) + ')' );
				var rec = new permModel(obj);
				permStore.add( rec );
				winPerms.hide();	// Finally hide the dialog window
				permStore.sync();	// Save the record to the dataStore
				permStore.load();	// Reload the dataSore from the database
			}
        },{
            text: 'Cancel',
            handler: function(){
            	winPerms.hide();
            }
        }]
    });

	// ****************************************************************************
	// Create the Window
	// ****************************************************************************	
	var winRoles = Ext.create('widget.window', {
		id			: 'winRoles',
		closable	: true,
		closeAction	: 'hide',
		width		: 450,
		resizable	: false,
		modal		: true,
		bodyStyle	: 'background-color: #ffffff; padding: 5px;',
		items		: [ rolesForm ]
	});
	// ****************************************************************************
	// Create the Window
	// ****************************************************************************	
	var winPerms = Ext.create('widget.window', {
		id			: 'winPerms',
		closable	: true,
		closeAction	: 'hide',
		width		: 450,
		resizable	: false,
		modal		: true,
		bodyStyle	: 'background-color: #ffffff; padding: 5px;',
		items		: [ permsForm ]
	});

	// *************************************************************************************
	// RowEditor Class
	// *************************************************************************************
	var rowEditing = Ext.create('Ext.grid.plugin.CellEditing', {
		//clicksToEdit: 1,
		saveText: 'Update',
		errorSummary: false,
		listeners: {
			afteredit: function () {
				permStore.sync();
				permStore.load({params:{role_id: currList}});
			}
		}
	});
	// ****************************************************************************
	// Create the GridPanel
	// ****************************************************************************
	var rolesGrid = Ext.create('Ext.grid.Panel', {
		store		: permStore,
        columnLines	: true,
        frame		: false,
        frameHeader	: false,
        border		: false,
        layout		: 'fit',
		plugins: [rowEditing],
        columns: [{
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
				store			: storePerms,
			},
            lazyRender: true,
            listClass: 'x-combo-list-small'
        }],
		viewConfig: { stripeRows: true },
		listeners: {
			itemclick: {
	        	fn: function(DataView, record, item, rowIndex, e){ 
	           		Ext.getCmp('cmdDeletePerm').enable();
	           		currPerm = record.data.permID;
					currRec = permStore.getAt(rowIndex);
	            }
			}
		},
		dockedItems: [{
			xtype	: 'toolbar',
			dock	: 'top',
			items: [{
				text	: '<?php i18n("Add a Role"); ?>',
				iconCls	:'icoAddRecord',
				handler	: function(){
					Ext.getCmp('rolesForm').getForm().reset(); // Clear the form
					winRoles.show();
					winRoles.setTitle('<?php i18n("Add a Role"); ?>'); 
				}
			},'-',{
				text	: '<?php i18n("Add a Permission"); ?>',
				iconCls	:'icoAddRecord',
				handler	: function(){
					Ext.getCmp('permsForm').getForm().reset(); // Clear the form
					winPerms.show();
					winPerms.setTitle('<?php i18n("Add a Permission"); ?>'); 
				}

		  	},'-','<?php i18n('Select Role'); ?>: ',{
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
				store			: roleStore,
				listeners: {
					select: function(combo, record){
						// Reload the data store to reflect the new selected list filter
						currList = record[0].data.id;
						permStore.load({params:{role_id: currList}});
					}
				}
			},'-',{
				text		: '<?php i18n("Edit a Role"); ?>',
				iconCls		: 'edit',
				handler		: function(DataView, record, item, rowIndex, e){
					Ext.getCmp('rolesForm').getForm().reset(); // Clear the form
					var rec = roleStore.getById(currList); // get the record from the store
					Ext.getCmp('rolesForm').getForm().loadRecord(rec);
					winRoles.setTitle('<?php i18n("Edit a Role"); ?>');
					winRoles.show(); 
				}
			},'-',{
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
								var rec = roleStore.getById( currList ); // get the record from the store
								roleStore.remove(rec);
								roleStore.sync();
								roleStore.load();
			    		    }
						}
					});
				}
			},'-',{
				text		: '<?php i18n("Delete Permission"); ?>',
				iconCls		: 'delete',
				disabled  	: true,
				id			: 'cmdDeletePerm',
				handler: function(){
					Ext.Msg.show({
						title	: '<?php i18n('Please confirm...'); ?>', 
						icon	: Ext.MessageBox.QUESTION,
						msg		:'<?php i18n('Are you sure to delete this Permission? You will delete this permission in all Roles'); ?>',
						buttons	: Ext.Msg.YESNO,
						fn		:function(btn,msgGrid){
								if(btn=='yes'){
								var rec = permStore.getById( currPerm ); // get the record from the store
								permStore.remove(rec);
								permStore.sync();
								permStore.load({params:{role_id: currList}});
			    		    }
						}
					});
				}
			}]
		}]
    }); // END Facility Grid

	//******************************************************************************
	// Render panel
	//******************************************************************************
	var topRenderPanel = Ext.create('Ext.panel.Panel', {
		title		: '<?php i18n('Roles and Permissions'); ?>',
		renderTo	: Ext.getCmp('MainApp').body,
		layout		: 'fit',
		height		: Ext.getCmp('MainApp').getHeight(),
	  	frame 		: false,
		border 		: false,
		id			: 'topRenderPanel',
		items		: [	rolesGrid ]
	});
}); // End ExtJS
</script>