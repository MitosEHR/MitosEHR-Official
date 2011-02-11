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
if ( Ext.getCmp('winFacility') ){ Ext.getCmp('winFacility').destroy(); }

// *************************************************************************************
// Structure of the message record
// creates a subclass of Ext.data.Record
//
// This should be the structure of the database table
// 
// *************************************************************************************
var FacilityRecord = Ext.data.Record.create([
	{name: 'id', type: 'int',	mapping: 'id'},
	{name: 'name', type: 'string', mapping: 'name'},
	{name: 'phone', type: 'string', mapping: 'phone'},
	{name: 'fax', type: 'string', mapping: 'fax'},
	{name: 'street', type: 'string', mapping: 'street'},
	{name: 'city', type: 'string', mapping: 'city'},
	{name: 'state', type: 'string', mapping: 'state'},
	{name: 'postal_code', type: 'string', mapping: 'postal_code'},
	{name: 'country_code', type: 'string',	mapping: 'country_code'},
	{name: 'federal_ein', type: 'string',	mapping: 'federal_ein'},
	{name: 'service_location', type: 'string',	mapping: 'service_location'},
	{name: 'billing_location', type: 'string',	mapping: 'billing_location'},
	{name: 'accepts_assignment', type: 'string',	mapping: 'accepts_assignment'},
	{name: 'pos_code', type: 'string',	mapping: 'pos_code'},
	{name: 'x12_sender_id', type: 'string',	mapping: 'x12_sender_id'},
	{name: 'attn', type: 'string',	mapping: 'attn'},
	{name: 'domain_identifier', type: 'string',	mapping: 'domain_identifier'},
	{name: 'facility_npi', type: 'string',	mapping: 'facility_npi'},
	{name: 'tax_id_type', type: 'string',	mapping: 'tax_id_type'}
]);

// *************************************************************************************
// Structure and load the data for Messages
// AJAX -> data_*.ejs.php
// *************************************************************************************
var storeFacilities = new Ext.data.Store({
	autoSave	: false,

	// HttpProxy will only allow requests on the same domain.
	proxy : new Ext.data.HttpProxy({
		method		: 'POST',
		api: {
			read	: '../administration/facilities/data_read.ejs.php',
			create	: '../administration/facilities/data_create.ejs.php',
			update	: '../administration/facilities/data_update.ejs.php',
			//destroy : '../administration/facilities/data_destroy.ejs.php' <- You can not destroy facilities, HIPPA Compliant
		}
	}),

	// JSON Writer options
	writer: new Ext.data.JsonWriter({
		returnJson		: true,
		writeAllFields	: true,
		listful			: true,
		writeAllFields	: true
	}, FacilityRecord ),

	// JSON Reader options
	reader: new Ext.data.JsonReader({
		idProperty: 'id',
		totalProperty: 'results',
		root: 'row'
	}, FacilityRecord )
	
});
storeFacilities.load();

// *************************************************************************************
// Structure, data for storeTaxID
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
// Structure, data for storePOSCode
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
var frmFacility = new Ext.FormPanel({
	id			: 'frmFacility',
	bodyStyle	: 'padding: 5px;',
	layout: 'column',
	items: [{
		layout: 'form',
		autoWidth: true,
		border: false,
		bodyStyle : 'padding: 0 5px',
		defaults: { labelWidth: 50 },
        items: 
		[
			{ xtype: 'textfield', id: 'name', name: 'name', fieldLabel: '<?php echo htmlspecialchars( xl('Name'), ENT_NOQUOTES); ?>' },
			{ xtype: 'textfield', id: 'street', name: 'street', fieldLabel: '<?php echo htmlspecialchars( xl('Address'), ENT_NOQUOTES); ?>' },
			{ xtype: 'textfield', id: 'city', name: 'city', fieldLabel: '<?php echo htmlspecialchars( xl('City'), ENT_NOQUOTES); ?>' },
			{ xtype: 'textfield', id: 'state', name: 'state', fieldLabel: '<?php echo htmlspecialchars( xl('State'), ENT_NOQUOTES); ?>' },
			{ xtype: 'textfield', id: 'country_code', name: 'country_code', fieldLabel: '<?php echo htmlspecialchars( xl('Country'), ENT_NOQUOTES); ?>' },
			{ xtype: 'textfield', id: 'phone', name: 'phone', fieldLabel: '<?php echo htmlspecialchars( xl('Phone'), ENT_NOQUOTES); ?>' },
			{ xtype: 'textfield', id: 'fax', name: 'fax', fieldLabel: '<?php echo htmlspecialchars( xl('Fax'), ENT_NOQUOTES); ?>' },
			{ xtype: 'textfield', id: 'postal_code', name: 'postal_code', fieldLabel: '<?php echo htmlspecialchars( xl('Zip Code'), ENT_NOQUOTES); ?>' },
			// Hidden fields
			{ xtype: 'textfield', hidden: true, id: 'id', name: 'id'}
        ]},{
		layout : 'form',
		border : false,
		autoWidth: true,
		bodyStyle : 'padding: 0 5px',
		defaults: { labelWidth: 150 },
        items: 
		[
			{ xtype: 'combo', width: 60, autoSelect: true, displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', hiddenName: 'tax_id_type', store: storeTaxID, id: 'tax_id_type', name: 'tax_id_type', fieldLabel: '<?php echo htmlspecialchars( xl('Tax ID'), ENT_NOQUOTES); ?>', editable: false },
			{ xtype: 'textfield', id: 'facility_npi', name: 'facility_npi', fieldLabel: '<?php echo htmlspecialchars( xl('Facility NPI'), ENT_NOQUOTES); ?>' },
			{ xtype: 'checkbox', id: 'billing_location', name: 'billing_location', fieldLabel: '<?php echo htmlspecialchars( xl('Billing Location'), ENT_NOQUOTES); ?>' },
			{ xtype: 'checkbox', id: 'accepts_assignment', name: 'accepts_assignment', fieldLabel: '<?php echo htmlspecialchars( xl('Accepts Assignment'), ENT_NOQUOTES); ?>' },
			{ xtype: 'checkbox', id: 'service_location', name: 'service_location', fieldLabel: '<?php echo htmlspecialchars( xl('Service Location'), ENT_NOQUOTES); ?>' },
			{ xtype: 'combo', width: 300, autoSelect: true, displayField: 'title', hiddenName: 'pos_code', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storePOSCode, id: 'pos_code', name: 'pos_code', fieldLabel: '<?php echo htmlspecialchars( xl('POS Code'), ENT_NOQUOTES); ?>', editable: false },
			{ xtype: 'textfield', id: 'attn', name: 'attn', fieldLabel: '<?php echo htmlspecialchars( xl('Billing Attn'), ENT_NOQUOTES); ?>' },
			{ xtype: 'textfield', id: 'domain_identifier', name: 'domain_identifier', fieldLabel: '<?php echo htmlspecialchars( xl('CLIA Number'), ENT_NOQUOTES); ?>' }
		]}
	],
	
	// Window Bottom Bar
	bbar:[{
		text		:'<?php echo htmlspecialchars( xl('Save'), ENT_NOQUOTES); ?>',
		ref			: '../save',
		iconCls		: 'save',
		handler: function() {
			var obj = eval('(' + Ext.util.JSON.encode(frmFacility.getForm().getValues()) + ')'); // Convert the form data into a JSON data Object
			var rec  = new FacilityRecord(obj); // Re-format the Object to be a valid record (FacilityRecord)
			storeFacilities.add( rec ); // Add the re-formated record to the dataStore
			storeFacilities.save(); // Save the record to the dataStore
			storeFacilities.commitChanges(); // Commit the changes
			storeFacilities.reload(); // Reload the dataSore from the database
			winFacility.hide(); // Finally hide the dialog window
		}
	},{
		text:'<?php echo htmlspecialchars( xl('Close'), ENT_NOQUOTES); ?>',
		iconCls: 'delete',
		handler: function(){ winFacility.hide(); }
	}]
});

// *************************************************************************************
// Message Window Dialog
// *************************************************************************************
var winFacility = new Ext.Window({
	id			: 'winFacility',
	width		: 700,
	autoHeight	: true,
	modal		: true,
	resizable	: false,
	autoScroll	: true,
	title		: '<?php echo htmlspecialchars( xl('Add or Edit Facility'), ENT_NOQUOTES); ?>',
	closeAction	: 'hide',
	renderTo	: document.body,
	items: [ frmFacility ],
}); // END WINDOW


// *************************************************************************************
// Create the GridPanel
// *************************************************************************************
var facilitiesGrid = new Ext.grid.GridPanel({
	id		   : 'facilitiesGrid',
	store	   : storeFacilities,
	stripeRows : true,
	autoHeight : true,
	border     : false,    
	frame	   : false,
	viewConfig	: {forceFit: true},
	sm			: new Ext.grid.RowSelectionModel({singleSelect:true}),
	listeners: {
	
		// Single click to select the record
		rowclick: function(facilitiesGrid, rowIndex, e) {
			var rec = storeFacilities.getAt(rowIndex);
			Ext.getCmp('frmFacility').getForm().loadRecord(rec);
			facilitiesGrid.editFacility.enable();
		},

		// Double click to select the record, and edit the record
		rowdblclick:  function(facilitiesGrid, rowIndex, e) {
			var rec = storeFacilities.getAt(rowIndex);
			Ext.getCmp('frmFacility').getForm().loadRecord(rec);
			facilitiesGrid.editFacility.enable();
			winFacility.show();
		}
	},
	columns: [
		// Hidden cells
		{header: 'id', sortable: false, dataIndex: 'id', hidden: true},
		// Viewable cells
		{ width: 200, header: '<?php echo htmlspecialchars( xl('Name'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'name' },
		{ header: '<?php echo htmlspecialchars( xl('Address'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'street' },
		{ header: '<?php echo htmlspecialchars( xl('Phone'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'phone' }
	],
	// *************************************************************************************
	// Grid Menu
	// *************************************************************************************
	tbar: [{
		xtype	:'button',
		id		: 'addFacility',
		text	: '<?php xl("Add facility", 'e'); ?>',
		iconCls	: 'facilities',
		handler: function(){
			winFacility.show();
		}
	},'-',{
		xtype	:'button',
		id		: 'editFacility',
		ref		: '../editFacility',
		text	: '<?php xl("Edit facility", 'e'); ?>',
		iconCls	: 'edit',
		disabled: true,
		handler: function(){ 
			winFacility.show();
		}
	}], // END GRID TOP MENU
	plugins: [new Ext.ux.grid.Search({
		mode			: 'local',
		iconCls			: false,
		deferredRender	: false,
		dateFormat		: 'm/d/Y',
		minLength		: 4,
		align			: 'left',
		width			: 250,
		disableIndexes	: ['id'],
		position		: 'top'
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
    facilitiesGrid
  ]
});

}); // End ExtJS

</script>