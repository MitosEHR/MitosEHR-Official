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
include_once("../../registry.php");
?>
<script type="text/javascript">
Ext.onReady(function(){
Ext.BLANK_IMAGE_URL = '../../library/<?php echo $GLOBALS['ext_path']; ?>/resources/images/default/s.gif';

//******************************************************************************
// Sanitizing Objects
// Destroy them, if already exists in the browser memory.
// This destructions must be called for all the objects that
// are rendered on the document.body 
//******************************************************************************
if ( Ext.getCmp('winAddressbook') ){ Ext.getCmp('winAddressbook').destroy(); }

// *************************************************************************************
// Structure of the message record
// creates a subclass of Ext.data.Record
//
// This should be the structure of the database table
// 
// *************************************************************************************
var addressbookRecord = Ext.data.Record.create([
  {name: 'id',                    type: 'int',              mapping: 'id'},
  {name: 'username',              type: 'string',           mapping: 'username'},
  {name: 'password',              type: 'string',           mapping: 'password'},
  {name: 'authorized',            type: 'string',           mapping: 'authorized'},
  {name: 'info',                  type: 'string',           mapping: 'info'},
  {name: 'source',                type: 'int',              mapping: 'source'},
  {name: 'fname',                 type: 'string',           mapping: 'fname'},
  {name: 'mname',                 type: 'string',           mapping: 'mname'},
  {name: 'lname',                 type: 'string',           mapping: 'lname'},
  {name: 'fullname',              type: 'string',           mapping: 'fullname'},
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
var storeAddressbook = new Ext.data.Store({
  autoSave  : false,
  // HttpProxy will only allow requests on the same domain.
  proxy : new Ext.data.HttpProxy({
    method    : 'POST',
    api: {
      read    : '../miscellaneous/addressbook/data_read.ejs.php',
      //create  : '../administration/facilities/data_create.ejs.php',
      //update  : '../administration/facilities/data_update.ejs.php',
      //destroy : '../administration/facilities/data_destroy.ejs.php' <- You can not destroy facilities, HIPPA Compliant
    }
  }),
  // JSON Writer options
  writer: new Ext.data.JsonWriter({
    returnJson    : true,
    writeAllFields  : true,
    listful     : true,
    writeAllFields  : true
  }, addressbookRecord ),

  // JSON Reader options
  reader: new Ext.data.JsonReader({
    idProperty: 'id',
    totalProperty: 'results',
    root: 'row'
  }, addressbookRecord )
});
storeAddressbook.load();

// *************************************************************************************
// Structure, data for storeTaxID
// AJAX -> component_data.ejs.php
// *************************************************************************************
//var storeTaxID = new Ext.data.Store({
//  proxy: new Ext.data.ScriptTagProxy({
//    url: '../administration/facilities/component_data.ejs.php?task=taxid'
//  }),
//  reader: new Ext.data.JsonReader({
//    idProperty: 'option_id',
//    totalProperty: 'results',
//    root: 'row'
// },[
//    {name: 'option_id', type: 'string', mapping: 'option_id'},
//    {name: 'title', type: 'string', mapping: 'title'}
//  ])
//});
//storeTaxID.load();

// *************************************************************************************
// Structure, data for storePOSCode
// AJAX -> component_data.ejs.php
// *************************************************************************************
//var storePOSCode = new Ext.data.Store({
//  proxy: new Ext.data.ScriptTagProxy({
//    url: '../administration/facilities/component_data.ejs.php?task=poscodes'
//  }),
//  reader: new Ext.data.JsonReader({
//    idProperty: 'option_id',
//    totalProperty: 'results',
//    root: 'row'
//  },[
//    {name: 'option_id', type: 'string', mapping: 'option_id'},
//    {name: 'title', type: 'string', mapping: 'title'}
//  ])
//});
//storePOSCode.load();


// *************************************************************************************
// Facility Form
// Add or Edit purpose
// *************************************************************************************
var frmAddressbook = new Ext.FormPanel({
  id      : 'frmAddressbook',
  bodyStyle : 'padding: 5px;',
  layout: 'column',
  items: [{
    layout: 'form',
    autoWidth: true,
    border: false,
    bodyStyle : 'padding: 0 5px',
    defaults: { labelWidth: 50 },
        items: 
    [
      //{ xtype: 'textfield', id: 'name', name: 'name', fieldLabel: '<?php echo htmlspecialchars( xl('Name'), ENT_NOQUOTES); ?>' },
      //{ xtype: 'textfield', id: 'street', name: 'street', fieldLabel: '<?php echo htmlspecialchars( xl('Address'), ENT_NOQUOTES); ?>' },
      //{ xtype: 'textfield', id: 'city', name: 'city', fieldLabel: '<?php echo htmlspecialchars( xl('City'), ENT_NOQUOTES); ?>' },
      //{ xtype: 'textfield', id: 'state', name: 'state', fieldLabel: '<?php echo htmlspecialchars( xl('State'), ENT_NOQUOTES); ?>' },
      //{ xtype: 'textfield', id: 'country_code', name: 'country_code', fieldLabel: '<?php echo htmlspecialchars( xl('Country'), ENT_NOQUOTES); ?>' },
      //{ xtype: 'textfield', id: 'phone', name: 'phone', fieldLabel: '<?php echo htmlspecialchars( xl('Phone'), ENT_NOQUOTES); ?>' },
      //{ xtype: 'textfield', id: 'fax', name: 'fax', fieldLabel: '<?php echo htmlspecialchars( xl('Fax'), ENT_NOQUOTES); ?>' },
      //{ xtype: 'textfield', id: 'postal_code', name: 'postal_code', fieldLabel: '<?php echo htmlspecialchars( xl('Zip Code'), ENT_NOQUOTES); ?>' },
      // Hidden fields
      //{ xtype: 'textfield', hidden: true, id: 'id', name: 'id'}
        ]},{
    layout : 'form',
    border : false,
    autoWidth: true,
    bodyStyle : 'padding: 0 5px',
    defaults: { labelWidth: 150 },
        items: 
    [
      //{ xtype: 'combo', width: 60, autoSelect: true, displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storeTaxID, id: 'tax_id_type', name: 'tax_id_type', fieldLabel: '<?php echo htmlspecialchars( xl('Tax ID'), ENT_NOQUOTES); ?>', editable: false },
      //{ xtype: 'textfield', id: 'facility_npi', name: 'facility_npi', fieldLabel: '<?php echo htmlspecialchars( xl('Facility NPI'), ENT_NOQUOTES); ?>' },
      //{ xtype: 'checkbox', id: 'billing_location', name: 'billing_location', fieldLabel: '<?php echo htmlspecialchars( xl('Billing Location'), ENT_NOQUOTES); ?>' },
      //{ xtype: 'checkbox', id: 'accepts_assignment', name: 'accepts_assignment', fieldLabel: '<?php echo htmlspecialchars( xl('Accepts Assignment'), ENT_NOQUOTES); ?>' },
      //{ xtype: 'checkbox', id: 'service_location', name: 'service_location', fieldLabel: '<?php echo htmlspecialchars( xl('Service Location'), ENT_NOQUOTES); ?>' },
      //{ xtype: 'combo', width: 300, autoSelect: true, displayField: 'title', hiddenName: 'pos_code', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storePOSCode, id: 'pos_code', name: 'pos_code', fieldLabel: '<?php echo htmlspecialchars( xl('POS Code'), ENT_NOQUOTES); ?>', editable: false },
      //{ xtype: 'textfield', id: 'attn', name: 'attn', fieldLabel: '<?php echo htmlspecialchars( xl('Billing Attn'), ENT_NOQUOTES); ?>' },
      //{ xtype: 'textfield', id: 'domain_identifier', name: 'domain_identifier', fieldLabel: '<?php echo htmlspecialchars( xl('CLIA Number'), ENT_NOQUOTES); ?>' }
    ]}
  ], 
  // Window Bottom Bar
  bbar:[{
    text    :'<?php echo htmlspecialchars( xl('Save'), ENT_NOQUOTES); ?>',
    ref     : '../save',
    iconCls   : 'save',
    handler: function() {
      var obj = eval('(' + Ext.util.JSON.encode(frmAddressbook.getForm().getValues()) + ')'); // Convert the form data into a JSON data Object
      var rec  = new addressbookRecord(obj); // Re-format the Object to be a valid record (addressbookRecord)
      storeAddressbook.add( rec ); // Add the re-formated record to the dataStore
      storeAddressbook.save(); // Save the record to the dataStore
      storeAddressbook.commitChanges(); // Commit the changes
      storeAddressbook.reload(); // Reload the dataSore from the database
      winAddressbook.hide(); // Finally hide the dialog window
    }
  },{
    text:'<?php echo htmlspecialchars( xl('Close'), ENT_NOQUOTES); ?>',
    iconCls: 'delete',
    handler: function(){ winAddressbook.hide(); }
  }]
});
// *************************************************************************************
// Message Window Dialog
// *************************************************************************************
var winAddressbook = new Ext.Window({
  id      : 'winAddressbook',
  width   : 700,
  autoHeight  : true,
  modal   : true,
  resizable : false,
  autoScroll  : true,
  title   : '<?php echo htmlspecialchars( xl('Add or Edit Contact'), ENT_NOQUOTES); ?>',
  closeAction : 'hide',
  renderTo  : document.body,
  items: [ frmAddressbook ],
}); // END WINDOW
// *************************************************************************************
// Create the GridPanel
// *************************************************************************************
var addressbookGrid = new Ext.grid.GridPanel({
  id       : 'addressbookGrid',
  store    : storeAddressbook,
  stripeRows : true,
  autoHeight : true,
  border     : false,    
  frame    : false,
  viewConfig  : {forceFit: true},
  sm      : new Ext.grid.RowSelectionModel({singleSelect:true}),
  listeners: {
    // Single click to select the record, and copy the variables
    rowclick: function(addressbookGrid, rowIndex, e) {
      //Copy the selected message ID into the variable
      rowContent = Ext.getCmp('addressbookGrid').getStore().getAt(rowIndex);
      // Enable buttons
      addressbookGrid.editAddressbook.enable();
      addressbookGrid.deleteAddressbook.enable();
    },
    // Double click to select the record, and edit the record
    rowdblclick:  function(addressbookGrid, rowIndex, e) {
      //Copy the selected message ID into the variable
      rowContent = Ext.getCmp('addressbookGrid').getStore().getAt(rowIndex);  
      winAddressbook.show();
      // Enable buttons
      addressbookGrid.editAddressbook.enable();
      addressbookGrid.deleteAddressbook.enable();
    }
  },
  columns: [
    // Hidden cells
    {header: 'id', sortable: false, dataIndex: 'id', hidden: true},
    // Viewable cells
    { width: 150, header: '<?php echo htmlspecialchars( xl('Name'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'fullname' },
    { header: '<?php echo htmlspecialchars( xl('Username'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'username' },
    { header: '<?php echo htmlspecialchars( xl('Type'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'ab_name' },
    { header: '<?php echo htmlspecialchars( xl('Specialty'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'specialty' },
    { header: '<?php echo htmlspecialchars( xl('Phone'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'phonew1' },
    { header: '<?php echo htmlspecialchars( xl('Mobile'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'phonecell' },
    { header: '<?php echo htmlspecialchars( xl('Fax'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'fax' },
    { header: '<?php echo htmlspecialchars( xl('Email'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'email' },
    { header: '<?php echo htmlspecialchars( xl('Stree'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'stree' },
    { header: '<?php echo htmlspecialchars( xl('City'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'city' },
    { header: '<?php echo htmlspecialchars( xl('State'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'state' },
    { header: '<?php echo htmlspecialchars( xl('Postal'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'zip' }
  ],
  // *************************************************************************************
  // Grid Menu
  // *************************************************************************************
  tbar: [{
    xtype :'button',
    id    : 'addAddressbook',
    text  : '<?php xl("Add Contact", 'e'); ?>',
    iconCls : 'facilities',
    handler: function(){
      winAddressbook.show();
    }
  },'-',{
    xtype :'button',
    id    : 'editAddressbook',
    ref   : '../editAddressbook',
    text  : '<?php xl("Edit Contact", 'e'); ?>',
    iconCls : 'edit',
    disabled: true,
    handler: function(){ 
      winAddressbook.show();
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
  title: '<?php xl('Address Book', 'e'); ?>',
  border  : false,
  stateful: true,
  monitorResize: true,
  autoWidth: true,
  id: 'RenderPanel',
  renderTo: Ext.getCmp('TopPanel').body,
  viewConfig:{forceFit:true},
  items: [ 
    addressbookGrid
  ]
});

}); // End ExtJS
</script>




