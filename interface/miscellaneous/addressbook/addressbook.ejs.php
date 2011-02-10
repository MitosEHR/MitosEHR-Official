<?php
 // Copyright (C) 2006-2010 Rod Roark <rod@sunsetsystems.com>
 //
 // This program is free software; you can redistribute it and/or
 // modify it under the terms of the GNU General Public License
 // as published by the Free Software Foundation; either version 2
 // of the License, or (at your option) any later version.
require_once("../registry.php");
require_once("$srcdir/acl.inc.php");
require_once("$srcdir/formdata.inc.php");
require_once("$srcdir/options.inc.php");
?>
<script type="text/javascript">
Ext.onReady(function(){
Ext.BLANK_IMAGE_URL = '../../library/<?php echo $GLOBALS['ext_path']; ?>/resources/images/default/s.gif';

//******************************************************************************
// Sanitizing Objects
// Destroy them, if already exists in the browser memory.
// This procedures must be called for all the objects declared here
// Partial Fix.
//******************************************************************************
if ( Ext.getCmp('winAddressBook') ){ Ext.getCmp('winAddressBook').destroy(); } 

// *************************************************************************************
// Structure of the message record
// creates a subclass of Ext.data.Record
//
// This should be the structure of the database table
// 
// *************************************************************************************
var addressBookRecord = Ext.data.Record.create([
  {name: 'id',                    type: 'int',              mapping: 'id'},
  {name: 'username',              type: 'string',           mapping: 'username'},
  {name: 'password',              type: 'string',           mapping: 'password'},
  {name: 'authorized',            type: 'string',           mapping: 'authorized'},
  {name: 'info',                  type: 'string',           mapping: 'info'},
  {name: 'source',                type: 'int',              mapping: 'source'},
  {name: 'fname',                 type: 'string',           mapping: 'fname'},
  {name: 'mname',                 type: 'string',           mapping: 'mname'},
  {name: 'lname',                 type: 'string',           mapping: 'lname'},
  {name: 'federaltaxid',          type: 'string',           mapping: 'federaltaxid'},
  {name: 'federaldrugid',         type: 'string',           mapping: 'federaldrugid'},
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
  {name: 'street',                type: 'string',           mapping: 'street'},
  {name: 'streetb',               type: 'string',           mapping: 'streetb'},
  {name: 'city',                  type: 'string',           mapping: 'city'},
  {name: 'state',                 type: 'string',           mapping: 'state'},
  {name: 'zip',                   type: 'string',           mapping: 'zip'},
  {name: 'street2',               type: 'string',           mapping: 'street2'},
  {name: 'streetb2',              type: 'string',           mapping: 'streetb2'},
  {name: 'city2',                 type: 'string',           mapping: 'city2'},
  {name: 'state2',                type: 'string',           mapping: 'state2'},
  {name: 'zip2',                  type: 'string',           mapping: 'zip2'},
  {name: 'phone',                 type: 'string',           mapping: 'phone'},
  {name: 'fax',                   type: 'string',           mapping: 'fax'},
  {name: 'phonew1',               type: 'string',           mapping: 'phonew1'},
  {name: 'phonew2',               type: 'string',           mapping: 'phonew2'},
  {name: 'phonecell',             type: 'string',           mapping: 'phonecell'},
  {name: 'notes',                 type: 'string',           mapping: 'notes'},
  {name: 'cal_ui',                type: 'string',           mapping: 'cal_ui'},
  {name: 'taxonomy',              type: 'string',           mapping: 'taxonomy'},
  {name: 'ssi_relayhealth',       type: 'string',           mapping: 'ssi_relayhealth'},
  {name: 'calendar',              type: 'int',              mapping: 'calendar'},
  {name: 'abook_type',            type: 'string',           mapping: 'abook_type'},
  {name: 'pwd_expiration_date',   type: 'string',           mapping: 'pwd_expiration_date'},
  {name: 'pwd_history1',          type: 'string',           mapping: 'pwd_history1'},
  {name: 'pwd_history2',          type: 'string',           mapping: 'pwd_history2'},
  {name: 'default_warehouse',     type: 'string',           mapping: 'default_warehouse'},
  {name: 'irnpool',               type: 'string',           mapping: 'irnpool'},
  {name: 'ab_name',               type: 'string',           mapping: 'ab_name'}

]);

// *************************************************************************************
// Structure and load the data for Messages
// AJAX -> data_*.ejs.php
// *************************************************************************************
var storeAddressBook = new Ext.data.Store({
  autoSave  : false,

  // HttpProxy will only allow requests on the same domain.
  proxy : new Ext.data.HttpProxy({
    method    : 'POST',
    api: {
      read  : '../miscellaneus/addressbook/data_read.ejs.php',
      create  : '../miscellaneus/addressbook/data_create.ejs.php',
      update  : '../miscellaneus/addressbook/data_update.ejs.php',
      destroy : '../miscellaneus/addressbook/data_destroy.ejs.php'
    }
  }),

  // JSON Writer options
  writer: new Ext.data.JsonWriter({
    returnJson    : true,
    writeAllFields  : true,
    listful     : true,
    writeAllFields  : true
  }, addressBookRecord ),

  // JSON Reader options
  reader: new Ext.data.JsonReader({
    idProperty: 'noteid',
    totalProperty: 'results',
    root: 'row'
  }, addressBookRecord )
  
});
storeAddressBook.load();

// *************************************************************************************
// Structure, data for cmb_TaxID
// AJAX -> component_data.ejs.php
// *************************************************************************************
var storeTaxID = new Ext.data.Store({
  proxy: new Ext.data.ScriptTagProxy({
    url: '../administration/facilities/component_data.ejs.php?task=taxid'
  }),
  reader: new Ext.data.JsonReader({
    idProperty: 'option_id',
    totalProperty: 'results',
    root: 'row'
  },[
    {name: 'option_id', type: 'string', mapping: 'option_id'},
    {name: 'title', type: 'string', mapping: 'title'}
  ])
});
storeTaxID.load();

// *************************************************************************************
// Structure, data for cmb_TaxID
// AJAX -> component_data.ejs.php
// *************************************************************************************
var storePOSCode = new Ext.data.Store({
  proxy: new Ext.data.ScriptTagProxy({
    url: '../administration/facilities/component_data.ejs.php?task=poscodes'
  }),
  reader: new Ext.data.JsonReader({
    idProperty: 'option_id',
    totalProperty: 'results',
    root: 'row'
  },[
    {name: 'option_id', type: 'string', mapping: 'option_id'},
    {name: 'title', type: 'string', mapping: 'title'}
  ])
});
storePOSCode.load();


// *************************************************************************************
// Facility Form
// Add or Edit purpose
// *************************************************************************************
var frmAddressBokk = new Ext.FormPanel({
  id      : 'frmAddressBokk',
  autoHeight  : true,
  autoWidth : true,
  labelWidth  : 150,
  defaults  : {width: 200},
  bodyStyle : 'padding: 5px;',
  updateRecord: addressBookRecord,
  loadRecord: addressBookRecord,
  items: [
    { xtype: 'textfield', id: 'name', name: 'name', fieldLabel: '<?php echo htmlspecialchars( xl('Name'), ENT_NOQUOTES); ?>' },
    { xtype: 'textfield', id: 'street', name: 'street', fieldLabel: '<?php echo htmlspecialchars( xl('Address'), ENT_NOQUOTES); ?>' },
    { xtype: 'textfield', id: 'city', name: 'city', fieldLabel: '<?php echo htmlspecialchars( xl('City'), ENT_NOQUOTES); ?>' },
    { xtype: 'textfield', id: 'state', name: 'state', fieldLabel: '<?php echo htmlspecialchars( xl('State'), ENT_NOQUOTES); ?>' },
    { xtype: 'textfield', id: 'country_code', name: 'country_code', fieldLabel: '<?php echo htmlspecialchars( xl('Country'), ENT_NOQUOTES); ?>' },
    { xtype: 'textfield', id: 'phone', name: 'phone', fieldLabel: '<?php echo htmlspecialchars( xl('Phone'), ENT_NOQUOTES); ?>' },
    { xtype: 'textfield', id: 'fax', name: 'fax', fieldLabel: '<?php echo htmlspecialchars( xl('Fax'), ENT_NOQUOTES); ?>' },
    { xtype: 'textfield', id: 'postal_code', name: 'postal_code', fieldLabel: '<?php echo htmlspecialchars( xl('Zip Code'), ENT_NOQUOTES); ?>' },
    { xtype: 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeTaxID, id: 'tax_id_type', name: 'tax_id_type', fieldLabel: '<?php echo htmlspecialchars( xl('Tax ID'), ENT_NOQUOTES); ?>', editable: false },
    { xtype: 'textfield', id: 'facility_npi', name: 'facility_npi', fieldLabel: '<?php echo htmlspecialchars( xl('Facility NPI'), ENT_NOQUOTES); ?>' },
    { xtype: 'checkbox', id: 'billing_location', name: 'billing_location', fieldLabel: '<?php echo htmlspecialchars( xl('Billing Location'), ENT_NOQUOTES); ?>' },
    { xtype: 'checkbox', id: 'accepts_assignment', name: 'accepts_assignment', fieldLabel: '<?php echo htmlspecialchars( xl('Accepts Assignment'), ENT_NOQUOTES); ?>' },
    { xtype: 'checkbox', id: 'service_location', name: 'service_location', fieldLabel: '<?php echo htmlspecialchars( xl('Service Location'), ENT_NOQUOTES); ?>' },
    { xtype: 'combo', displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storePOSCode, id: 'pos_code', name: 'pos_code', fieldLabel: '<?php echo htmlspecialchars( xl('POS Code'), ENT_NOQUOTES); ?>', editable: false },
    { xtype: 'textfield', id: 'attn', name: 'attn', fieldLabel: '<?php echo htmlspecialchars( xl('Billing Attn'), ENT_NOQUOTES); ?>' },
    { xtype: 'textfield', id: 'domain_identifier', name: 'domain_identifier', fieldLabel: '<?php echo htmlspecialchars( xl('CLIA Number'), ENT_NOQUOTES); ?>' },
  ],
  // Window Bottom Bar
  bbar:[{
    text    :'<?php echo htmlspecialchars( xl('Save'), ENT_NOQUOTES); ?>',
    ref     : '../save',
    iconCls   : 'save',
    disabled  : true,
    handler: function() {
      frmAddressBokk.getForm().submit();
      winAddressBook.hide();
    }
  },{
    text:'<?php echo htmlspecialchars( xl('Close'), ENT_NOQUOTES); ?>',
    iconCls: 'delete',
    handler: function(){ winAddressBook.hide(); }
  }]
});

// *************************************************************************************
// Message Window Dialog
// *************************************************************************************
var winAddressBook = new Ext.Window({
  id      : 'winFacility',
  width   : 600,
  autoHeight  : true,
  modal   : true,
  resizable : false,
  autoScroll  : true,
  title   : '<?php echo htmlspecialchars( xl('Add/Edit Facility'), ENT_NOQUOTES); ?>',
  closeAction : 'hide',
  renderTo  : document.body,
  items: [ frmAddressBokk ],
}); // END WINDOW


// *************************************************************************************
// Create the GridPanel
// *************************************************************************************
var addressBookGrid = new Ext.grid.GridPanel({
  id       : 'facilitiesGrid',
  store    : storeAddressBook,
  stripeRows : true,
  autoHeight : true,
  border     : false,    
  frame    : false,
  viewConfig  : {forceFit: true},
  sm      : new Ext.grid.RowSelectionModel({singleSelect:true}),
  listeners: {
  
    // Single click to select the record, and copy the variables
    rowclick: function(addressBookGrid, rowIndex, e) {
    
      //Copy the selected message ID into the variable
      rowContent = Ext.getCmp('addressBookGrid').getStore().getAt(rowIndex);
      
      // Enable buttons
      addressBookGrid.editFacility.enable();
      addressBookGrid.deleteFacility.enable();
    },

    // Double click to select the record, and edit the record
    rowdblclick:  function(addressBookGrid, rowIndex, e) {
        
      //Copy the selected message ID into the variable
      rowContent = Ext.getCmp('facilitiesGrid').getStore().getAt(rowIndex);
        
      winFacility.show();
      
      // Enable buttons
      addressBookGrid.editAddressBook.enable();
      addressBookGrid.deleteFacility.enable();
    }
  },
  columns: [
    {header: 'id', sortable: false, dataIndex: 'id', hidden: true},
    { width: 200, header: '<?php echo htmlspecialchars( xl('Name'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'name' },
    { header: '<?php echo htmlspecialchars( xl('Address'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'street' },
    { header: '<?php echo htmlspecialchars( xl('Phone'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'phone' }
  ],
  // *************************************************************************************
  // Grid Menu
  // *************************************************************************************
  tbar: [{
    xtype :'button',
    id    : 'addAddressBook',
    text  : '<?php xl("Add facility", 'e'); ?>',
    iconCls : 'facilities',
    handler: function(){
      winFacility.show();
    }
  },'-',{
    xtype :'button',
    id    : 'editAddressBook',
    ref   : '../editFacility',
    text  : '<?php xl("Edit facility", 'e'); ?>',
    iconCls : 'edit',
    disabled: true,
    handler: function(){ 
      winFacility.show();
    }
  }], // END GRID TOP MENU
  plugins: [new Ext.ux.grid.Search({
    mode      : 'local',
    iconCls     : false,
    deferredRender  : false,
    dateFormat    : 'm/d/Y',
    minLength   : 4,
    align     : 'left',
    width     : 250,
    disableIndexes  : ['id'],
    position    : 'top'
  })]     
}); // END GRID


//******************************************************************************
// Render Panel
// This panel is mandatory for all layouts.
//******************************************************************************
var RenderPanel = new Ext.Panel({
  title: '<?php xl('Facilities', 'e'); ?>',
  border  : false,
  stateful: true,
  monitorResize: true,
  autoWidth: true,
  id: 'RenderPanel',
  renderTo: Ext.getCmp('TopPanel').body,
  viewConfig:{forceFit:true},
  items: [ 
    addressBookGrid
  ]
});

}); // End ExtJS

</script> 