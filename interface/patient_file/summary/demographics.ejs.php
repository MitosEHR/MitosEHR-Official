<?php 
//--------------------------------------------------------------------------------------------------------------------------
// messages.ejs.php 
// v0.0.3 -> Integrated AJAX
// Under GPLv3 License
// 
// Integration Sencha ExtJS Framework
//
// Integrated by: GI Technologies & MitosEHR.org in 2011
// 
//******************************************************
//MitosEHR (Electronic Health Records)
//******************************************************
//MitosEHR is a Open source Web-Based Software for:
//* Practice management
//* Electronic Medical Records
//* Prescription writing and medical billing application
//
//And it can be installed on the following systems:
//* Unix-like systems (Linux, UNIX, and BSD systems)
//* Microsoft systems
//* Mac OS X
//* And other platforms that can run Apache Web server, MySQL
//
//Setup documentation can be found in the INSTALL file,
//and extensive documentation can be found on the
//MitosEHR web site at:
//http://www.mitosehr.org/
//
// Sencha ExtJS
// Ext JS is a cross-browser JavaScript library for building rich internet applications. Build rich,
// sustainable web applications faster than ever. It includes:
// * High performance, customizable UI widgets
// * Well designed and extensible Component model
// * An intuitive, easy to use API
// * Commercial and Open Source licenses available
//--------------------------------------------------------------------------------------------------------------------------
include_once("../../registry.php"); 
?>
<script type="text/javascript">
var immunizationTable = Ext.data.Record.create([
  // on the database table
  {name: 'id', type: 'int', mapping: 'id'},
  {name: 'patient_id', type: 'int', mapping: 'patient_id'},
  {name: 'administered_date', type: 'string', mapping: 'administered_date'},
  {name: 'immunization_id', type: 'int', mapping: 'immunization_id'},
  {name: 'manufacturer', type: 'string', mapping: 'manufacturer'},
  {name: 'lot_number', type: 'string', mapping: 'lot_number'},
  {name: 'administered_by_id', type: 'int', mapping: 'administered_by_id'},
  {name: 'administered_by', type: 'string', mapping: 'administered_by'},
  {name: 'education_date', type: 'string',  mapping: 'education_date'},
  {name: 'vis_date', type: 'string',  mapping: 'vis_date'},
  {name: 'note', type: 'string',  mapping: 'note'},
  {name: 'create_date', type: 'string', mapping: 'create_date'},
  {name: 'update_date', type: 'string', mapping: 'update_date'},
  {name: 'created_by', type: 'string',  mapping: 'created_by'},
  {name: 'updated_by', type: 'string',  mapping: 'updated_by'},

  // not on the database table - PHP Calculated field
  {name: 'vaccine', type: 'string', mapping:'vaccine'}
]);

var pnotesTable = Ext.data.Record.create([
  // on the database table
  {name: 'id', type: 'int', mapping: 'id'},
  {name: 'user', type: 'string', mapping: 'user'},
  {name: 'pid', type: 'int', mapping: 'pid'},
  {name: 'title', type: 'string', mapping: 'title'},
  {name: 'subject', type: 'string', mapping: 'subject'},
  {name: 'date', type: 'string', mapping: 'date'},
  {name: 'body', type: 'auto', mapping: 'body'},
  {name: 'message_status', type: 'string', mapping: 'message_status'},
  {name: 'reply_id', type: 'int', mapping: 'reply_id'}
]);

// *************************************************************************************
// Structure and load the data for Immunization List
// AJAX -> interface/patient_file/immnunization/immunization_data_logic.ejs.php
// *************************************************************************************
var storeImmList = new Ext.data.Store({
  autoSave  : false,

  // HttpProxy will only allow requests on the same domain.
  proxy : new Ext.data.HttpProxy({
    method    : 'POST',
    api: {
      read    : '../patient_file/immnunization/immunizations_data_logic.ejs.php?task=load'
    }
  }),
  // JSON Reader options
  reader: new Ext.data.JsonReader({
    idProperty: 'noteid',
    totalProperty: 'results',
    root: 'row'
  }, immunizationTable )

});
storeImmList.load();
// *************************************************************************************
// Structure and load the data for pnotes List
// AJAX -> interface/patient_file/summary/pnotes_fragment.ejs.php
// *************************************************************************************
var storePnoteList = new Ext.data.GroupingStore({
  autoSave  : false,

  // HttpProxy will only allow requests on the same domain.
  proxy : new Ext.data.HttpProxy({
    method    : 'POST',
    api: {
      read    : '../patient_file/summary/pnotes_fragment.ejs.php'
    }
  }),
  // JSON Reader options
  reader: new Ext.data.JsonReader({
    idProperty: 'id',
    totalProperty: 'results',
    root: 'row'
  }, pnotesTable ),
  sortInfo:{field: 'date', direction: "ASC"},
  groupField:'subject'

});
storePnoteList.load();

Ext.onReady(function(){
  //**************************************************************************************
  //  Demographics tab panel Items
  //**************************************************************************************
  var demographicsTabPanels = {
    xtype: 'tabpanel',
    defaults: {style: 'padding:5px'},
    activeTab: 0,
    border:false,
    items: [{
      title: 'Basic Info',
      html:'<p>Placeholder</p>'
    },{
      title: 'Contact info',
      html:'<p>Placeholder</p>'
    },{
      title: 'Choices',
      html:'<p>Placeholder</p>'
    },{
      title: 'Employer',
      html:'<p>Placeholder</p>'
    },{
      title: 'Stats',
      html:'<p>Placeholder</p>'
    },{
      title: 'Primary Insurance',
      html:'<p>Placeholder</p>'
    },{
      title: 'Secondary Insurance',
      html:'<p>Placeholder</p>'
    },{
      title: 'Teritary Insurance',
      html:'<p>Placeholder</p>'
    },{
      title: 'Notes',
      html:'<p>Placeholder</p>'
    }]
  };

  //**************************************************************************************
  //  Center (center region) Panel Items
  //**************************************************************************************
  // billing summary (Balance due)
  var billingSumm = {
      title: 'Billing Summary',
      bodyStyle: 'padding:15px; background-color:#ffe4e1',
      html:'<div><p><?php echo htmlspecialchars(xl('Balance Due'),ENT_NOQUOTES) . " : [ balance token ] ";?></p></div>'
  };
  // demograpchis panel 
  var demographicsSumm = {
      title: 'Demographics',
      collapsed: false,
      items: [demographicsTabPanels],
      bbar: [{
        text: '<?php echo htmlspecialchars( xl('Edit'), ENT_NOQUOTES); ?>',
        iconCls : 'save'
      }]
  };
  // notes grid
  var notesSumm = {
      title: '<?php xl("Notes", 'e'); ?>', 
      xtype: 'grid', 
      store: storePnoteList,
      autoHeight: true,
      cls : 'noHeader',
      collapsed: true,
      stripeRows: false,
      frame: false,
      //bodyStyle: 'padding:0',
      columns: [
        { sortable: false, dataIndex: 'id', hidden: true},
        { width: 30, id:'subject', header: 'Subject', sortable: false, dataIndex: 'subject' },
        { width: 20, header: 'Title', sortable: false, dataIndex: 'title' },
        { header: 'Message', sortable: false, dataIndex: 'body' }              
      ],
      view: new Ext.grid.GroupingView({
            forceFit:true,
            groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})',
            DeferEmptyText: false, 
            emptyText: 'No notes found for this patient'
        }),

      bbar: [{
        text: '<?php echo htmlspecialchars( xl('View all patient notes'), ENT_NOQUOTES); ?>',
        iconCls : 'save'
      }]
  };
  // disclosure grid
  var disclosuresSumm = {
      title: 'Disclosures',
      html:'<iframe src="../patient_file/summary/disc_fragment.php" frameborder="0" height ="100px" width="100%"></iframe>',
      bbar: [{
        text: '<?php echo htmlspecialchars( xl('Edit'), ENT_NOQUOTES); ?>',
        iconCls : 'save'
      }]
  };
  // vitals grid
  var vitalsSumm = {
      title: 'Vitals',
      html:'<iframe src="../patient_file/summary/vitals_fragment.php" frameborder="0" height ="100px" width="100%"></iframe>',
      bbar: [{
        text: '<?php echo htmlspecialchars( xl('Trend'), ENT_NOQUOTES); ?>',
        iconCls : 'save'
      }]
  };
  //**************************************************************************************
  //  Right (east region) Panel Items
  //**************************************************************************************
  // appointments grid
  var appointmentsSumm = {
      title: '<?php xl("Appointments", 'e'); ?>', 
      xtype: 'grid', 
      store: storeImmList,
      autoHeight: true,
      cls : 'noHeader',
      collapsed: true,
      stripeRows: false,
      frame: false,
      viewConfig: {forceFit: true}, // this is the option which will force the grid to the width of the containing panel
      columns: [
        { sortable: false, dataIndex: 'id', hidden: true},
        { sortable: false, dataIndex: 'immunization_id', hidden: true},
        { sortable: false, dataIndex: 'administered_date', hidden: true},
        { sortable: false, dataIndex: 'administered_by_id', hidden: true},
        { width: 200, sortable: false, dataIndex: 'vis_date'},
        { sortable: false, dataIndex: 'vaccine'},
        { xtype: 'datecolumn', format: 'Y-m-d', sortable: true, dataIndex: 'create_date' }
      ],
    bbar: [{
      text: '<?php echo htmlspecialchars( xl('Edit'), ENT_NOQUOTES); ?>',
      iconCls : 'save'
    }]
  };
  // medical problems grid
  var medicalProblemsSumm = {
      title: '<?php xl("Medical Problems", 'e'); ?>', 
      xtype: 'grid', 
      store: storeImmList,
      autoHeight: true,
      cls : 'noHeader',
      stripeRows: false,
      frame: false,
      viewConfig: {forceFit: true}, // this is the option which will force the grid to the width of the containing panel
      columns: [
        { sortable: false, dataIndex: 'id', hidden: true},
        { sortable: false, dataIndex: 'immunization_id', hidden: true},
        { sortable: false, dataIndex: 'administered_date', hidden: true},
        { sortable: false, dataIndex: 'administered_by_id', hidden: true},
        { width: 200, sortable: false, dataIndex: 'vis_date'},
        { sortable: false, dataIndex: 'vaccine'},
        { xtype: 'datecolumn', format: 'Y-m-d', sortable: true, dataIndex: 'create_date' }
      ],
    bbar: [{
      text: '<?php echo htmlspecialchars( xl('Edit'), ENT_NOQUOTES); ?>',
      iconCls : 'save'
    }]
  };
  // allergies grid
  var allergiesSumm = {
      title: '<?php xl("Allergies", 'e'); ?>', 
      xtype: 'grid', 
      store: storeImmList,
      autoHeight: true,
      cls : 'noHeader',
      stripeRows: false,
      frame: false,
      viewConfig: {forceFit: true}, // this is the option which will force the grid to the width of the containing panel
      columns: [
        { sortable: false, dataIndex: 'id', hidden: true},
        { sortable: false, dataIndex: 'immunization_id', hidden: true},
        { sortable: false, dataIndex: 'administered_date', hidden: true},
        { sortable: false, dataIndex: 'administered_by_id', hidden: true},
        { width: 200, sortable: false, dataIndex: 'vis_date'},
        { sortable: false, dataIndex: 'vaccine'},
        { xtype: 'datecolumn', format: 'Y-m-d', sortable: true, dataIndex: 'create_date' }
      ],
    bbar: [{
      text: '<?php echo htmlspecialchars( xl('Edit'), ENT_NOQUOTES); ?>',
      iconCls : 'save'
    }]
  };
  // medications grid
  var mediactionsSumm = {
      title: '<?php xl("Medications", 'e'); ?>', 
      xtype: 'grid', 
      store: storeImmList,
      autoHeight: true,
      cls : 'noHeader',
      stripeRows: false,
      frame: false,
      viewConfig: {forceFit: true}, // this is the option which will force the grid to the width of the containing panel
      columns: [
        { sortable: false, dataIndex: 'id', hidden: true},
        { sortable: false, dataIndex: 'immunization_id', hidden: true},
        { sortable: false, dataIndex: 'administered_date', hidden: true},
        { sortable: false, dataIndex: 'administered_by_id', hidden: true},
        { width: 200, sortable: false, dataIndex: 'vis_date'},
        { sortable: false, dataIndex: 'vaccine'},
        { xtype: 'datecolumn', format: 'Y-m-d', sortable: true, dataIndex: 'create_date' }
      ],
    bbar: [{
      text: '<?php echo htmlspecialchars( xl('Edit'), ENT_NOQUOTES); ?>',
      iconCls : 'save'
    }]
  };
  // immunizations grid
  var immunizationsSumm = {
      title: '<?php xl("Immunizations", 'e'); ?>', 
      xtype: 'grid', 
      store: storeImmList,
      autoHeight: true,
      cls : 'noHeader',
      stripeRows: false,
      frame: false,
      viewConfig: {forceFit: true}, // this is the option which will force the grid to the width of the containing panel
      columns: [
        { sortable: false, dataIndex: 'id', hidden: true},
        { sortable: false, dataIndex: 'immunization_id', hidden: true},
        { sortable: false, dataIndex: 'administered_date', hidden: true},
        { sortable: false, dataIndex: 'administered_by_id', hidden: true},
        { width: 200, sortable: false, dataIndex: 'vis_date'},
        { sortable: false, dataIndex: 'vaccine'},
        { xtype: 'datecolumn', format: 'Y-m-d', sortable: true, dataIndex: 'create_date' }
      ],
    bbar: [{
      text: '<?php echo htmlspecialchars( xl('Edit'), ENT_NOQUOTES); ?>',
      iconCls : 'save'
    }]
  };
  // prescriptions grid
  var prescriptionsSumm = {
      title: '<?php xl("Prescriptions", 'e'); ?>', 
      xtype: 'grid', 
      store: storeImmList,
      autoHeight: true,
      cls : 'noHeader',
      stripeRows: false,
      frame: false,
      viewConfig: {forceFit: true}, // this is the option which will force the grid to the width of the containing panel
      columns: [
        { sortable: false, dataIndex: 'id', hidden: true},
        { sortable: false, dataIndex: 'immunization_id', hidden: true},
        { sortable: false, dataIndex: 'administered_date', hidden: true},
        { sortable: false, dataIndex: 'administered_by_id', hidden: true},
        { width: 200, sortable: false, dataIndex: 'vis_date'},
        { sortable: false, dataIndex: 'vaccine'},
        { xtype: 'datecolumn', format: 'Y-m-d', sortable: true, dataIndex: 'create_date' }
      ],
    bbar: [{
      text: '<?php echo htmlspecialchars( xl('Edit'), ENT_NOQUOTES); ?>',
      iconCls : 'save'
    }]
  };
  //**************************************************************************************
  //  Center Panel Layout
  //**************************************************************************************
  var centerAccordionPanel = {
    border: false,
    defaults:{ layout: 'form', style: 'margin:5px 0', bodyStyle: 'padding:5px', autoScroll: true, collapsible: true, collapsed: true, titleCollapse: true},
    items: [ billingSumm, demographicsSumm, notesSumm, disclosuresSumm, vitalsSumm ]
  };
  //**************************************************************************************
  //  Right Panel Layout
  //**************************************************************************************
  var rightAccordionPanel = {
    border: false,
    defaults:{ layout: 'form', style: 'margin:5px  0; font-size:12px', bodyStyle: 'background-color:#e7e7e7; padding:5px', autoScroll: true, collapsible: true, collapsed: false, titleCollapse: true},
    items: [ appointmentsSumm, medicalProblemsSumm, allergiesSumm, mediactionsSumm, immunizationsSumm, prescriptionsSumm ]
  };
  //**************************************************************************************
  //  Center Main Panel 
  //**************************************************************************************
  var centerPanel = {
    title: '[ Patient Name ] Record Summary',
    region:'center',
    autoScroll:true,
    split:true,
    defaults: {style: 'padding:5px' },
    items: [ centerAccordionPanel ]
  };
  //**************************************************************************************
  //  Right Main Panel 
  //**************************************************************************************
  var rightPanel = {
    title: 'Sats Summary',
    width: 200,
    region:'east',
    autoScroll:true,
    split:true,
    defaults: {style: 'padding:5px'},
    items: [ rightAccordionPanel ]
  };
  //*******************************************************************************************************
  // Render demographic panel
  //*******************************************************************************************************
  var RenderPanel = new Ext.Panel({
    layout        : 'border',
    border        : false,
    monitorResize : true,                             // <-- Mandatory
    autoWidth     : true,                             // <-- Mandatory
    id            : 'RenderPanel',                    // <-- Mandatory
    renderTo      : Ext.getCmp('TopPanel').body,      // <-- Mandatory
    viewConfig    : {forceFit:true},                  // <-- Mandatory
    bodyStyle     : 'padding: 10px',
    items         : [ centerPanel, rightPanel ],
  });
  //*********************************************************************************************************
  // Make sure that the RenderPanel height has the same height of the TopPanel
  // at first run.
  // This is mandatory.
  //*********************************************************************************************************
  Ext.getCmp('RenderPanel').setHeight( Ext.getCmp('TopPanel').getHeight() );

}); // END EXTJS
</script>