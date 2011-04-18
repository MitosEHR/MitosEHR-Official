<?php 
//******************************************************************************
// facilities.ejs.php
// Description: Facilities Screen
// v0.0.3
// 
// Author: Gino Rivera Falú
// Modified: n/a
// 
// MitosEHR (Eletronic Health Records) 2011
//******************************************************************************
session_name ( "MitosEHR" );
session_start();

include_once("../../../library/I18n/I18n.inc.php");
//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;
?>
<script type="text/javascript">
Ext.require([ '*' ]);
Ext.onReady(function(){
Ext.QuickTips.init();
// *************************************************************************************
// Users Model
// *************************************************************************************
var UserModel = Ext.regModel('Users', { fields: [
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
	{name: 'facility_id',           type: 'int'},
	{name: 'see_auth',              type: 'int'},
	{name: 'active',                type: 'int'},
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
	idProperty: 'id'
});
var storeUsers = new Ext.data.Store({
    model		: 'Users',
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
    	}
    },
    autoLoad: true
});

// *************************************************************************************
// Structure, data for Titles
// AJAX -> component_data.ejs.php
// *************************************************************************************
Ext.regModel('Titles', { fields: [
	{name: 'option_id', type: 'string'},
    {name: 'title', type: 'string'}
],
	idProperty: 'option_id'
});
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
Ext.regModel('Types', { fields: [
	{name: 'option_id', type: 'string'},
    {name: 'title', type: 'string'}
],
	idProperty: 'option_id'
});
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
Ext.regModel('Facilities', { fields: [
	{name: 'id', type: 'string'},
    {name: 'names', type: 'string'}
],
	idProperty: 'id'
});
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
Ext.regModel('AccessControls', { fields: [
	{name: 'id', type: 'string'},
    {name: 'role_name', type: 'string'}
],
	idProperty: 'id'
});
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
	width	  	  : 495,
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
	        { width: 50,  xtype: 'combo',     id: 'title', name: 'title', autoSelect: true, displayField: '<?php i18n('title'); ?>', valueField: 'option_id', hiddenName: 'title', mode: 'local', triggerAction: 'all', store: storeTitles },
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
	        { width: 100, xtype: 'combo', id: 'facility_id', name: 'facility_id', autoSelect: true, displayField: 'name', valueField: 'id', hiddenName: 'facility_id', mode: 'local', triggerAction: 'all', store: storeFacilities, emptyText:'Select ' },
	        { width: 100, xtype: 'displayfield', value: '<?php i18n('Authorizations'); ?>: '},
	        { width: 105, xtype: 'combo', id: 'see_auth', name: 'see_auth', autoSelect: true, displayField: 'name', valueField: 'id', hiddenName: 'see_auth', mode: 'local', triggerAction: 'all', store: storeSeeAuthorizations, emptyText:'Select ' }
	      ] 
	    },{ 
	      xtype: 'fieldcontainer',
	      defaults: { hideLabel: true },
	      items: [
	        { width: 100, xtype: 'displayfield', value: '<?php i18n('Access Control'); ?>: '},
	        { width: 100, xtype: 'combo', id: 'none', name: 'none', autoSelect: true, displayField: 'name', valueField: 'value', hiddenName: 'none', mode: 'local', triggerAction: 'all', store: storeAccessControls, emptyText:'Select ' },
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
	],
});

// *************************************************************************************
// Message Window Dialog
// *************************************************************************************
var winUsers = new Ext.Window({
  id          : 'winUsers',
  width       : 525,
  autoHeight  : true,
  //modal       : true,
  border	  : false,
  resizable   : false,
  //autoScroll  : true,
  title       : '<?php i18n('Add or Edit User'); ?>',
  closeAction : 'hide',
  renderTo    : document.body,
  items: [frmUsers],
  dockedItems:[{ //  START WINDOW BOTTOM BAR
  	xtype: 'toolbar',
	dock: 'bottom',
	items: [{
	    text      :'<?php i18n('Save'); ?>',
	    border	  : false,
	    ref       : '../save',
	    iconCls   : 'save',
	    handler: function() {
	
	      //----------------------------------------------------------------
	      // 1. Convert the form data into a JSON data Object
	      // 2. Re-format the Object to be a valid record (FacilityRecord)
	      //----------------------------------------------------------------
	      var obj = eval( '(' + Ext.JSON.encode(frmUsers.getForm().getValues()) + ')' );
	      var rec = new UserModel(obj);
	      
	      //----------------------------------------------------------------
	      // Check if it has to add or update
	      // Update: 1. Get the record from store, 2. get the values from the form, 3. copy all the 
	      // values from the form and push it into the store record.
	      // Add: The re-formated record to the dataStore
	      //----------------------------------------------------------------
	      if (frmUsers.getForm().findField('id').getValue()){ // Update
	      	  var record = storeUsers.getAt(rowPos);
	          var fieldValues = frmUsers.getForm().getValues();
	          for ( k=0; k <= storeUsers.fields.getCount()-1; k++) {
				  i = storeUsers.fields.get(k).name;
				  record.set( i, fieldValues[i] );
			  }
	      } else { // Add
	        storeUsers.add( rec );
	      }
	
	      storeUsers.save();          // Save the record to the dataStore
	      //storeUsers.commit(); // Commit the changes
	      winUsers.hide();            // Finally hide the dialog window
	      storeUsers.load();        // Reload the dataSore from the database
	      
	    }
	  },{
	    text:'<?php i18n('Close'); ?>',
	    iconCls: 'delete',
	    handler: function(){ winUsers.hide(); }
    }]
  }] // END WINDOW BOTTOM BAR
}); // END WINDOW

// *************************************************************************************
// Create the GridPanel
// *************************************************************************************
var addressbookGrid = new Ext.grid.GridPanel({

  id          : 'addressbookGrid',
  store       : storeUsers,
  height  : 400,
  border      : false,    
  frame       : false,
  loadMask    : true,
  viewConfig  : {forceFit: true, stripeRows: true},
  //sm          : new Ext.grid.RowSelectionModel({singleSelect:true}),
    listeners: {
  
    // -----------------------------------------
    // Single click to select the record
    // -----------------------------------------
    rowclick: function(addressbookGrid, rowIndex, e) {
      rowPos = rowIndex;
      var rec = storeUsers.getAt(rowPos);
      Ext.getCmp('frmUsers').getForm().loadRecord(rec);
      addressbookGrid.editAddressbook.enable();
    },
    // -----------------------------------------
    // Double click to select the record, and edit the record
    // -----------------------------------------
    rowdblclick:  function(addressbookGrid, rowIndex, e) {
      rowPos = rowIndex;
      var rec = storeUsers.getAt(rowPos); // get the record from the store
      Ext.getCmp('frmUsers').getForm().loadRecord(rec); // load the record selected into the form
      addressbookGrid.editAddressbook.enable();
      winUsers.show();
    }
  },
  columns: [
    { text: 'id', sortable: false, dataIndex: 'id', hidden: true},
    { width: 100,  text: '<?php i18n("Username"); ?>', sortable: true, dataIndex: 'username' },
    { width: 200,  text: '<?php i18n("Name"); ?>', sortable: true, dataIndex: 'fullname' },
    { flex: 1,  text: '<?php i18n("Aditional info"); ?>', sortable: true, dataIndex: 'info' },
    { text: '<?php i18n("Active?"); ?>', sortable: true, dataIndex: 'actived' },
    { text: '<?php i18n("Authorized?"); ?>', sortable: true, dataIndex: 'authorizedd' }
  ],
  // *************************************************************************************
  // Grid Menu
  // *************************************************************************************
  tbar: [{
    xtype     :'button',
    id        : 'addAddressbook',
    text      : '<?php i18n("Add User"); ?>',
    iconCls   : 'icoAddressBook',
    handler   : function(){
      Ext.getCmp('frmUsers').getForm().reset(); // Clear the form
      winUsers.show();
    }
  },'-',{
    xtype     :'button',
    id        : 'editAddressbook',
    ref       : '../editAddressbook',
    text      : '<?php i18n("Edit User"); ?>',
    iconCls   : 'edit',
    disabled  : true,
    handler: function(){ 
      winUsers.show();
    }
  },'-',{
    xtype     :'button',
    id        : 'loadAddressbook',
    ref       : '../loadAddressbook',
    text      : '<?php i18n('Reload Grid - Debug'); ?>',
    iconCls   : 'edit',
    handler: function(){ 
      storeUsers.load();
    }
  }],
  //plugins: [new Ext.ux.grid.Search({
  //  mode            : 'local',
  //  iconCls         : false,
  //  deferredRender  : false,
  //  dateFormat      : 'm/d/Y',
  //  minLength       : 4,
  //  align           : 'left',
  //  width           : 250,
  //  disableIndexes  : ['id'],
  //  position        : 'top'
  //})]     
}); // END GRID

//******************************************************************************
// Render panel
//******************************************************************************
var topRenderPanel = Ext.create('Ext.panel.Panel', {
	title		: '<?php i18n('Users'); ?>',
	renderTo	: Ext.getCmp('MainApp').body,
  	frame 		: false,
	border 		: false,
	id			: 'topRenderPanel',
	//loadMask    : true,
	items		: [addressbookGrid]
});

}); // End ExtJS
</script>