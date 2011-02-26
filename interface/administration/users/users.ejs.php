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

?>
<script type="text/javascript">
Ext.onReady(function(){

//******************************************************************************
// Sanitizing Objects
// Destroy them, if already exists in the browser memory.
// This destructions must be called for all the objects that
// are rendered on the document.body 
//******************************************************************************
if ( Ext.getCmp('winUsers') ){ Ext.getCmp('winUsers').destroy(); }

// *************************************************************************************
// Structure of the message record
// creates a subclass of Ext.data.Record
//
// This should be the structure of the database table
// 
// *************************************************************************************
var usersRecord = Ext.data.Record.create([
  {name: 'id',                    type: 'int',              mapping: 'id'},
  {name: 'username',              type: 'string',           mapping: 'username'},
  {name: 'password',              type: 'auto',             mapping: 'password'},
  {name: 'authorizedd',           type: 'string',           mapping: 'authorizedd'},
  {name: 'authorized',            type: 'string',           mapping: 'authorized'},
  {name: 'actived',            	  type: 'string',           mapping: 'actived'},
  {name: 'active',            	  type: 'string',           mapping: 'active'},
  {name: 'info',                  type: 'string',           mapping: 'info'},
  {name: 'source',                type: 'int',              mapping: 'source'},
  {name: 'fname',                 type: 'string',           mapping: 'fname'},
  {name: 'mname',                 type: 'string',           mapping: 'mname'},
  {name: 'lname',                 type: 'string',           mapping: 'lname'},
  {name: 'fullname',              type: 'string',           mapping: 'fullname'},
  {name: 'federaltaxid',          type: 'string',           mapping: 'federaltaxid'},
  {name: 'federaldrugid',         type: 'string',           mapping: 'federaldrugid'},
  {name: 'upin',                  type: 'string',           mapping: 'upin'},
  {name: 'facility',              type: 'string',           mapping: 'facility'},
  {name: 'facility_id',           type: 'int',              mapping: 'facility_id'},
  {name: 'see_auth',              type: 'int',              mapping: 'see_auth'},
  {name: 'active',                type: 'int',              mapping: 'active'},
  {name: 'npi',                   type: 'string',           mapping: 'npi'},
  {name: 'title',                 type: 'string',           mapping: 'title'},
  {name: 'specialty',             type: 'string',           mapping: 'specialty'},
  {name: 'billname',              type: 'string',           mapping: 'billname'},
  {name: 'email',                 type: 'string',           mapping: 'email'},
  {name: 'url',                   type: 'string',           mapping: 'url'},
  {name: 'assistant',             type: 'string',           mapping: 'assistant'},
  {name: 'organization',          type: 'string',           mapping: 'organization'},
  {name: 'valedictory',           type: 'string',           mapping: 'valedictory'},
  {name: 'fulladdress',           type: 'string',           mapping: 'fulladdress'},
  {name: 'cal_ui',                type: 'string',           mapping: 'cal_ui'},
  {name: 'taxonomy',              type: 'string',           mapping: 'taxonomy'},
  {name: 'ssi_relayhealth',       type: 'string',           mapping: 'ssi_relayhealth'},
  {name: 'calendar',              type: 'int',              mapping: 'calendar'},
  {name: 'abook_type',            type: 'string',           mapping: 'abook_type'},
  {name: 'pwd_expiration_date',   type: 'string',           mapping: 'pwd_expiration_date'},
  {name: 'pwd_history1',          type: 'string',           mapping: 'pwd_history1'},
  {name: 'pwd_history2',          type: 'string',           mapping: 'pwd_history2'},
  {name: 'default_warehouse',     type: 'string',           mapping: 'default_warehouse'},
  {name: 'ab_name',               type: 'string',           mapping: 'ab_name'},
  {name: 'ab_title',              type: 'string',           mapping: 'ab_title'}
]);
// *************************************************************************************
// Structure and load the data for Messages
// AJAX -> data_*.ejs.php
// *************************************************************************************
var storeUsers = new Ext.data.Store({
  autoSave  : false,
  // HttpProxy will only allow requests on the same domain.
  proxy     : new Ext.data.HttpProxy({
    method      : 'POST',
    api: {
      read      : '../administration/users/data_read.ejs.php',
      create    : '../administration/users/data_create.ejs.php',
      update    : '../administration/users/data_update.ejs.php'
      //destroy :  <- You can not destroy conatacts, HIPPA Compliant
    }
  }),
  // JSON Writer options
  writer: new Ext.data.JsonWriter({
	encodeDelete	: true,
	returnJson		: true,
	writeAllFields	: true,
	listful			: true
  }, usersRecord ),

  // JSON Reader options
  reader: new Ext.data.JsonReader({
    idProperty      : 'id',
    totalProperty   : 'totals',
    root            : 'row'
  }, usersRecord )
});
storeUsers.load({params:{start:0, limit:10}});

// *************************************************************************************
// Structure, data for storeTaxID
// AJAX -> component_data.ejs.php
// *************************************************************************************
var storeTitles = new Ext.data.Store({
  proxy: new Ext.data.ScriptTagProxy({
    url: '../administration/users/component_data.ejs.php?task=titles'
  }),
  reader: new Ext.data.JsonReader({
    idProperty: 'option_id',
    totalProperty: 'totals',
    root: 'row'
 },[
    {name: 'option_id', type: 'string', mapping: 'option_id'},
    {name: 'title', type: 'string', mapping: 'title'}
  ])
});
storeTitles.load();

// *************************************************************************************
// Structure, data for storeTypes
// AJAX -> component_data.ejs.php
// *************************************************************************************
var storeTypes = new Ext.data.Store({
  proxy: new Ext.data.ScriptTagProxy({
    url: '../administration/users/component_data.ejs.php?task=types'
  }),
  reader: new Ext.data.JsonReader({
    idProperty: 'option_id',
    totalProperty: 'totals',
    root: 'row'
  },[
    {name: 'option_id', type: 'string', mapping: 'option_id'},
    {name: 'title', type: 'string', mapping: 'title'}
  ])
});
storeTypes.load();
// *************************************************************************************
// Structure, data for storeFacilities
// AJAX -> component_data.ejs.php
// *************************************************************************************
var storeFacilities = new Ext.data.Store({
  proxy: new Ext.data.ScriptTagProxy({
    url: '../administration/users/component_data.ejs.php?task=facilities'
  }),
  reader: new Ext.data.JsonReader({
    idProperty: 'id',
    totalProperty: 'totals',
    root: 'row'
  },[
    {name: 'id', type: 'string', mapping: 'id'},
    {name: 'name', type: 'string', mapping: 'name'}
  ])
});
storeFacilities.load();
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
    data : Ext.data.authorizations // from states.js
});
// *************************************************************************************
// Structure, data for storeAccessControls
// AJAX -> component_data.ejs.php
// *************************************************************************************
var storeAccessControls = new Ext.data.Store({
  proxy: new Ext.data.ScriptTagProxy({
    url: '../administration/users/component_data.ejs.php?task=accessControls'
  }),
  reader: new Ext.data.JsonReader({
    idProperty: 'id',
    totalProperty: 'totals',
    root: 'row'
  },[
    {name: 'id', type: 'string', mapping: 'id'},
    {name: 'value', type: 'value', mapping: 'value'},
    {name: 'name', type: 'string', mapping: 'name'}
  ])
});
storeAccessControls.load();
// *************************************************************************************
// Facility Form
// Add or Edit purpose
// *************************************************************************************
var frmUsers = new Ext.FormPanel({
  id          : 'frmUsers',
  bodyStyle   : 'padding: 5px;',
  items: [{
      layout          : 'form',
      autoWidth       : true,
      border          : false,
      hideLabels      : true,
      id              : 'formfileds',
      bodyStyle       : 'padding: 20px',
      items: 
      [ 
        { xtype: 'textfield', hidden: true, id: 'id', name: 'id'},
        { xtype: 'compositefield',
          msgTarget : 'side', 
          items: [
            { width: 100, xtype: 'displayfield', value: '<?php i18n('Username'); ?>: '},
            { width: 100, xtype: 'textfield', id: 'username', name: 'username' },
            { width: 100, xtype: 'displayfield', value: '<?php i18n('Password'); ?>: '},
            { width: 105, xtype: 'textfield', id: 'password', name: 'password',  inputType: 'password' }
          ] 
        },{ xtype: 'compositefield',
          msgTarget : 'side', 
          items: [
            { width: 100, xtype: 'displayfield', value: '<?php i18n('First, Middle, Last'); ?>: '},
            { width: 50,  xtype: 'combo',     id: 'title', name: 'title', autoSelect: true, displayField: '<?php i18n('title'); ?>', valueField: 'option_id', hiddenName: 'title', mode: 'local', triggerAction: 'all', store: storeTitles },
            { width: 80,  xtype: 'textfield', id: 'fname', name: 'fname' },
            { width: 65,  xtype: 'textfield', id: 'mname', name: 'mname' },
            { width: 105, xtype: 'textfield', id: 'lname', name: 'lname' },
          ]
        },{ 
          xtype: 'compositefield',
          msgTarget : 'side', 
          items: [
            { width: 100, xtype: 'displayfield', value: '<?php i18n('Active?'); ?>: '},
            { width: 100, xtype: 'checkbox', id: 'active', name: 'active' },
            { width: 100, xtype: 'displayfield', value: '<?php i18n('Authorized?'); ?>: '},
            { width: 105, xtype: 'checkbox', value: 'off', id: 'authorized', name: 'authorized' }
          ]  
        },{ 
          xtype: 'compositefield',
          msgTarget : 'side', 
          items: [
            { width: 100, xtype: 'displayfield', value: '<?php i18n('Default Facility'); ?>: '},
            { width: 100, xtype: 'combo', id: 'facility_id', name: 'facility_id', autoSelect: true, displayField: 'name', valueField: 'id', hiddenName: 'facility_id', mode: 'local', triggerAction: 'all', store: storeFacilities, emptyText:'Select ' },
            { width: 100, xtype: 'displayfield', value: '<?php i18n('Authorizations'); ?>: '},
            { width: 105, xtype: 'combo', id: 'see_auth', name: 'see_auth', autoSelect: true, displayField: 'name', valueField: 'id', hiddenName: 'see_auth', mode: 'local', triggerAction: 'all', store: storeSeeAuthorizations, emptyText:'Select ' }
          ] 
        },{ 
          xtype: 'compositefield',
          items: [
            { width: 100, xtype: 'displayfield', value: '<?php i18n('Access Control'); ?>: '},
            { width: 100, xtype: 'combo', id: 'none', name: 'none', autoSelect: true, displayField: 'name', valueField: 'value', hiddenName: 'none', mode: 'local', triggerAction: 'all', store: storeAccessControls, emptyText:'Select ' },
            { width: 100, xtype: 'displayfield', value: '<?php i18n('Taxonomy'); ?>: '},
            { width: 105, xtype: 'textfield', id: 'taxonomy',  name: 'taxonomy' }
          ] 
        },{ 
          xtype: 'compositefield',
          items: [
            { width: 100, xtype: 'displayfield', value: '<?php i18n('Federal Tax ID'); ?>: '},
            { width: 100, xtype: 'textfield', id: 'federaltaxid', name: 'federaltaxid' },
            { width: 100, xtype: 'displayfield', value: '<?php i18n('Fed Drug ID'); ?>: '},
            { width: 105, xtype: 'textfield', id: 'federaldrugid', name: 'federaldrugid' }
 
          ] 
        },{ 
          xtype: 'compositefield',
          items: [
           	{ width: 100, xtype: 'displayfield', value: '<?php i18n('UPIN'); ?>: '},
            { width: 100, xtype: 'textfield', id: 'upin', name: 'upin' },
            { width: 100, xtype: 'displayfield', value: '<?php i18n('NPI'); ?>: '},
            { width: 105, xtype: 'textfield', id: 'npi', name: 'npi' }
          ]
                },{ 
          xtype: 'compositefield',
          items: [
           	{ width: 100, xtype: 'displayfield', value: '<?php i18n('Job Description'); ?>: '},
            { width: 315, xtype: 'textfield', id: 'specialty', name: 'specialty' },
          ]  
        },{html: '<hr style="margin:5px 0"><p><?php i18n('Additional Info'); ?>:</p>', border:false},
        { width: 420, xtype: 'htmleditor', id: 'info', name: 'info', emptyText: 'info', },
      ]
  }], 
  // Window Bottom Bar
  bbar:[{
    text      :'<?php i18n('Save'); ?>',
    ref       : '../save',
    iconCls   : 'save',
    handler: function() {

      //----------------------------------------------------------------
      // 1. Convert the form data into a JSON data Object
      // 2. Re-format the Object to be a valid record (FacilityRecord)
      //----------------------------------------------------------------
      var obj = eval('(' + Ext.util.JSON.encode(frmUsers.getForm().getValues()) + ')');
      var rec = new usersRecord(obj);
      
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
      storeUsers.commitChanges(); // Commit the changes
      winUsers.hide();            // Finally hide the dialog window
      storeUsers.reload();        // Reload the dataSore from the database
      
    }
  },{
    text:'<?php i18n('Close'); ?>',
    iconCls: 'delete',
    handler: function(){ winUsers.hide(); }
  }]
});

// *************************************************************************************
// Message Window Dialog
// *************************************************************************************
var winUsers = new Ext.Window({
  id          : 'winUsers',
  width       : 490,
  autoHeight  : true,
  modal       : true,
  resizable   : false,
  autoScroll  : true,
  title       : '<?php i18n('Add or Edit User'); ?>',
  closeAction : 'hide',
  renderTo    : document.body,
  items: [ frmUsers ],
}); // END WINDOW

// *************************************************************************************
// Create the GridPanel
// *************************************************************************************
var addressbookGrid = new Ext.grid.GridPanel({
  id          : 'addressbookGrid',
  store       : storeUsers,
  stripeRows  : true,
  autoHeight  : true,
  border      : false,    
  frame       : false,
  loadMask    : true,
  autoScroll  : true,
  viewConfig  : {forceFit: true},
  sm          : new Ext.grid.RowSelectionModel({singleSelect:true}),
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
    // Hidden cells
    {header: 'id', sortable: false, dataIndex: 'id', hidden: true},
    // Viewable cells
    { width: 100,  header: '<?php i18n('Username'); ?>', sortable: true, dataIndex: 'username' },
    { width: 150, header: '<?php i18n('Name'); ?>', sortable: true, dataIndex: 'fullname' },
    { width: 200,  header: '<?php i18n('Aditional info'); ?>', sortable: true, dataIndex: 'info' },
    { header: '<?php i18n('Active?'); ?>', sortable: true, dataIndex: 'actived' },
    { header: '<?php i18n('Authorized?'); ?>', sortable: true, dataIndex: 'authorizedd' }
  ],
  // *************************************************************************************
  // Grid Menu
  // *************************************************************************************
  tbar: [{
    xtype     :'button',
    id        : 'addAddressbook',
    text      : '<?php i18n('Add User'); ?>',
    iconCls   : 'icoAddressBook',
    handler   : function(){
      Ext.getCmp('frmUsers').getForm().reset(); // Clear the form
      winUsers.show();
    }
  },'-',{
    xtype     :'button',
    id        : 'editAddressbook',
    ref       : '../editAddressbook',
    text      : '<?php i18n('Edit User'); ?>',
    iconCls   : 'edit',
    disabled  : true,
    handler: function(){ 
      winUsers.show();
    }
  }],
  plugins: [new Ext.ux.grid.Search({
    mode            : 'local',
    iconCls         : false,
    deferredRender  : false,
    dateFormat      : 'm/d/Y',
    minLength       : 4,
    align           : 'left',
    width           : 250,
    disableIndexes  : ['id'],
    position        : 'top'
  })]     
}); // END GRID
//******************************************************************************
// Render Panel
// This panel is mandatory for all layouts.
//******************************************************************************
var topRenderPanel = new Ext.Panel({
  title: '<?php i18n('List of Users'); ?>',
  border        : false,
  stateful      : true,
  monitorResize : true,
  autoWidth     : true,
  id            : 'RenderPanel',
  renderTo: Ext.getCmp('TopPanel').body,
  viewConfig:{forceFit:true},
  items: [ 
    addressbookGrid
  ], // END GRID TOP MENU
   bbar: [new Ext.PagingToolbar({
    pageSize: 10,
    hideBorders: true,
    store: storeUsers,
    displayInfo: true,
    displayMsg: 'Displaying contacts {0} - {1} of {2}',
    emptyMsg: "No contacts to display"
  })]
});

}); // End ExtJS
</script>




