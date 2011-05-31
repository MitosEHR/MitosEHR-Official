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
$_SESSION['site']['flops'] = 0;
?>
<script type="text/javascript">
Ext.onReady(function(){
	Ext.QuickTips.init();
	var rowPos; // Stores the current Grid Row Position (int)
	var currRec; // Store the current record (Object)
	// *************************************************************************************
	// If a object called winUser exists destroy it, to create a new one.
	// *************************************************************************************
	if ( Ext.getCmp('winUsers') ){ Ext.getCmp('winUsers').destroy(); }

	// *************************************************************************************
	// Users Model and Data store
	// *************************************************************************************
	if (!Ext.ModelManager.isRegistered('Users')){
	Ext.define("Users", {extend: "Ext.data.Model", fields: [
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
	});
	}
	var storeUsers = new Ext.data.Store({
	    model		: 'Users',
		noCache		: true,
    	autoSync	: false,
	    proxy		: {
	    	type	: 'ajax',
			api		: {
				read	: 'interface/administration/users/data_read.ejs.php',
				create	: 'interface/administration/users/data_create.ejs.php',
				update	: 'interface/administration/users/data_update.ejs.php',
				destroy : 'interface/administration/users/data_destroy.ejs.php'
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
	});
	function authCk(val) {
	    if (val == 'Yes') {
	        return '<img src="ui_icons/yes.gif" />';
	    } else if(val == 'No') {
	        return '<img src="ui_icons/no.gif" />';
	    } 
	    return val;
	}
	// *************************************************************************************
	// Structure, data for Titles
	// AJAX -> component_data.ejs.php
	// *************************************************************************************
	if (!Ext.ModelManager.isRegistered('Titles')){
	Ext.define("Titles", {extend: "Ext.data.Model", fields: [
		{name: 'option_id', type: 'string'},
	    {name: 'title', type: 'string'}
	],
		idProperty: 'option_id'
	});
	}
	var storeTitles = new Ext.data.Store({
		model		: 'Titles',
		proxy		: {
			type	: 'ajax',
			url		: 'interface/administration/users/component_data.ejs.php?task=titles',
			reader	: {
				type			: 'json',
				idProperty		: 'option_id',
				totalProperty	: 'totals',
				root			: 'row'
			}
		},
		autoLoad: true
	}); // End storeTitles

	// *************************************************************************************
	// Structure, data for Types
	// AJAX -> component_data.ejs.php
	// *************************************************************************************
	if (!Ext.ModelManager.isRegistered('Types')){
	Ext.define("Types", {extend: "Ext.data.Model", fields: [
		{name: 'option_id', type: 'string'},
	    {name: 'title', type: 'string'}
	],
		idProperty: 'option_id'
	});
	}
	var storeTypes = new Ext.data.Store({
		model		: 'Types',
		proxy		: {
			type	: 'ajax',
			url		: 'interface/administration/users/component_data.ejs.php?task=types',
			reader	: {
				type			: 'json',
				idProperty		: 'option_id',
				totalProperty	: 'totals',
				root			: 'row'
			}
		},
		autoLoad: true
	}); // End storeTypes
	
	// *************************************************************************************
	// Structure, data for Facilities
	// AJAX -> component_data.ejs.php
	// *************************************************************************************
	if (!Ext.ModelManager.isRegistered('Facilities')){
	Ext.define("Facilities", {extend: "Ext.data.Model", fields: [
		{name: 'id', type: 'string'},
	    {name: 'name', type: 'string'}
	],
		idProperty: 'id'
	});
	}
	var storeFacilities = new Ext.data.Store({
		model		: 'Facilities',
		proxy		: {
			type	: 'ajax',
			url		: 'interface/administration/users/component_data.ejs.php?task=facilities',
			reader	: {
				type			: 'json',
				idProperty		: 'id',
				totalProperty	: 'totals',
				root			: 'row'
			}
		},
		autoLoad: true
	}); // End storeFacilities
	
	// *************************************************************************************
	// Structure, data for AccessControls
	// AJAX -> component_data.ejs.php
	// *************************************************************************************
	if (!Ext.ModelManager.isRegistered('AccessControls')){
	Ext.define("AccessControls", {extend: "Ext.data.Model", fields: [
		{name: 'id', type: 'string'},
	    {name: 'role_name', type: 'string'}
	],
		idProperty: 'id'
	});
	}
	var storeAccessControls = new Ext.data.Store({
		model		: 'AccessControls',
		proxy		: {
			type	: 'ajax',
			url		: 'interface/administration/users/component_data.ejs.php?task=accessControls',
			reader	: {
				type			: 'json',
				idProperty		: 'id',
				totalProperty	: 'totals',
				root			: 'row'
			}
		},
		autoLoad: true
	}); // End storeFacilities
	
	
	// *************************************************************************************
	// Structure, data for storeSeeAuthorizations
	// AJAX -> component_data.ejs.php
	// *************************************************************************************
	Ext.namespace('Ext.data');
	Ext.data.authorizations = [
	    ['1', 'None'],
	    ['2', 'Only Mine'],
	    ['3', 'All']
	];
	var storeSeeAuthorizations = new Ext.data.ArrayStore({
	    fields: ['id', 'name'],
	    data : Ext.data.authorizations
	});
	
	// *************************************************************************************
	// Facility Form
	// Add or Edit purpose
	// *************************************************************************************
	var frmUsers = new Ext.form.FormPanel({
		id          : 'frmUsers',
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
		        { width: 50,  xtype: 'combo',     id: 'cb_title', name: 'title', editable: false, displayField: 'title', queryMode: 'local', store: storeTitles },
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
		        { width: 100, xtype: 'combo', id: 'cb_facility_id', name: 'facility_id', editable: false, displayField: 'name', valueField: 'id', queryMode: 'local', store: storeFacilities, emptyText:'Select ' },
		        { width: 100, xtype: 'displayfield', value: '<?php i18n('Authorizations'); ?>: '},
		        { width: 105, xtype: 'combo', id: 'cb_see_auth', name: 'see_auth', editable: false, displayField: 'name', valueField: 'id', queryMode: 'local', store: storeSeeAuthorizations, emptyText:'Select ' }
		      ] 
		    },{ 
		      xtype: 'fieldcontainer',
		      defaults: { hideLabel: true },
		      items: [
		        { width: 100, xtype: 'displayfield', value: '<?php i18n('Access Control'); ?>: '},
		        { width: 100, xtype: 'combo', id: 'cb_none', name: 'none', autoSelect: true, displayField: 'name', valueField: 'value', queryMode: 'local', store: storeAccessControls, emptyText:'Select ' },
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
	// Message Window Dialog
	// *************************************************************************************
	var winUsers = new Ext.Window({
		id          : 'winUsers',
		width       : 520,
	    autoHeight  : true,
	    modal       : true,
	    border	  	: true,
	    resizable   : false,
	    title       : '<?php i18n('Add or Edit User'); ?>',
	    closeAction : 'hide',
	    renderTo    : document.body,
	    items: [frmUsers],
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
				if (frmUsers.getForm().findField('id').getValue()){ // Update
					var record = storeUsers.getAt(rowPos);
					var fieldValues = frmUsers.getForm().getValues();
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
					var obj = eval( '(' + Ext.JSON.encode(frmUsers.getForm().getValues()) + ')' );
					storeUsers.add( obj );
				}
				winUsers.hide();	// Finally hide the dialog window
				storeUsers.sync();	// Save the record to the dataStore
				storeUsers.load();	// Reload the dataSore from the database
			}
        },{
            text: '<?php i18n('Cancel'); ?>',
            handler: function(){
            	winUsers.hide();
            }
        }]
	}); // END WINDOW
	
	// *************************************************************************************
	// Create the GridPanel
	// *************************************************************************************
	var userGrid = new Ext.grid.GridPanel({
		id          : 'userGrid',
	  	store       : storeUsers,
	  	layout	    : 'fit',
	  	border      : true,    
	  	frame       : true,
	  	loadMask    : true,
	  	viewConfig  : { stripeRows: true },
	  	listeners: {
	   		// -----------------------------------------
	   	  	// Single click to select the record
	   	  	// -----------------------------------------
	   	  	itemclick: {
	   			fn: function(DataView, record, item, rowIndex, e){ 
					Ext.getCmp('frmUsers').getForm().reset();
					Ext.getCmp('editAddressbook').enable();
					Ext.getCmp('cmdDelete').enable();
	   		  		var rec = storeUsers.getAt(rowIndex);
	   		  		Ext.getCmp('frmUsers').getForm().loadRecord(rec);
					currRec = rec;
            		rowPos = rowIndex;
	   		  	}
	   	  	},
	   	  	// -----------------------------------------
	   	  	// Double click to select the record, and edit the record
	   	  	// -----------------------------------------
	   	  	itemdblclick: { 
	   			fn: function(DataView, record, item, rowIndex, e){ 
					Ext.getCmp('frmUsers').getForm().reset();
					Ext.getCmp('editAddressbook').enable();
					Ext.getCmp('cmdDelete').enable();
					var rec = storeUsers.getAt(rowIndex); // get the record from the store
					Ext.getCmp('frmUsers').getForm().loadRecord(rec); // load the record selected into the form
					currRec = rec;
            		rowPos = rowIndex;
					winUsers.setTitle('<?php i18n("Edit User"); ?>');
	   		  		winUsers.show();
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
		  	items: [{
				id        : 'addAddressbook',
			    text      : '<?php i18n("Add User"); ?>',
			    iconCls   : 'icoAddressBook',
			    handler   : function(){
			    	Ext.getCmp('frmUsers').getForm().reset(); // Clear the form
			      	winUsers.show();
				  	winUsers.setTitle('<?php i18n("Add User"); ?>'); 
			    }
			},'-',{
			    id        : 'editAddressbook',
			    text      : '<?php i18n("Edit User"); ?>',
			    iconCls   : 'edit',
			    disabled  : true,
			    handler: function(){ 
					winUsers.setTitle('<?php i18n("Add User"); ?>'); 
			    	winUsers.show();
			    }
			},'-',{
				text: '<?php i18n("Delete User"); ?>',
				iconCls: 'delete',
				disabled: true,
				id: 'cmdDelete',
				handler: function(){
					Ext.Msg.show({
						title: '<?php i18n('Please confirm...'); ?>', 
						icon: Ext.MessageBox.QUESTION,
						msg:'<?php i18n('Are you sure to delete this User?'); ?>',
						buttons: Ext.Msg.YESNO,
						fn:function(btn,msgGrid){
							if(btn=='yes'){
								storeUsers.remove( currRec );
								storeUsers.sync();
								storeUsers.load();
			    		    }
						}
					});
				}
		  	}]					    
	  	}]
	}); // END GRID
	
	//***********************************************************************************
	// Top Render Panel 
	// This Panel needs only 3 arguments...
	// PageTigle 	- Title of the current page
	// PageLayout 	- default 'fit', define this argument if using other than the default value
	// PageBody 	- List of items to display [foem1, grid1, grid2]
	//***********************************************************************************
    Ext.create('Ext.mitos.TopRenderPanel', {
        pageTitle: '<?php i18n('Users'); ?>',
        pageBody: [userGrid]
    });
}); // End ExtJS
</script>