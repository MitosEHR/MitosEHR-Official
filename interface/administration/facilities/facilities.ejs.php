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

include_once("library/I18n/I18n.inc.php");

//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;

?>
<script type="text/javascript">
Ext.onReady(function(){

//******************************************************************************
// ExtJS Global variables 
//******************************************************************************
var rowPos;
var cmbTaxId;
var cmbPOSCode;

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
// tag: ExtJS v4 Ready
// *************************************************************************************
var FacilityRecord = Ext.regModel('FacilityRecord', {
	fields: [
	{name: 'id',					type: 'int'},
	{name: 'name',					type: 'string'},
	{name: 'phone',					type: 'string'},
	{name: 'fax', 					type: 'string'},
	{name: 'street',				type: 'string'},
	{name: 'city',					type: 'string'},
	{name: 'state',					type: 'string'},
	{name: 'postal_code',			type: 'string'},
	{name: 'country_code',			type: 'string'},
	{name: 'federal_ein',			type: 'string'},
	{name: 'service_location',		type: 'string'},
	{name: 'billing_location',		type: 'string'},
	{name: 'accepts_assignment',	type: 'string'},
	{name: 'pos_code',				type: 'string'},
	{name: 'x12_sender_id',			type: 'string'},
	{name: 'attn',					type: 'string'},
	{name: 'domain_identifier',		type: 'string'},
	{name: 'facility_npi',			type: 'string'},
	{name: 'tax_id_type',			type: 'string'}
	],
});

// *************************************************************************************
// Structure and load the data for Messages
// AJAX -> data_*.ejs.php
// *************************************************************************************
var storeFacilities = new Ext.data.Store({
	model: 'FacilityRecord',
	proxy: new Ext.data.AjaxProxy({
		url: 'interface/administration/facilities/component_data.ejs.php?task=sites',
		actionMethods: {
			create : 'POST',
			read   : 'POST',
			update : 'POST',
			destroy: 'POST'
		}
		reader: {
			type: 'json',
			idProperty: 'site_id',
			totalProperty: 'results',
			root: 'row'
		}
	}),
	autoLoad: true
});

// *************************************************************************************
// Structure, data for storeTaxID
// AJAX -> component_data.ejs.php
// tag: ExtJS v4 Ready
// *************************************************************************************
var taxidRecord = Ext.regModel('FacilityRecord', {
	fields: [
	{name: 'option_id',	type: 'string'},
	{name: 'title',		type: 'title'}
	],
});
var storeTaxID = new Ext.data.Store({
	model: 'taxidRecord',
	proxy: new Ext.data.AjaxProxy({
		url: 'interface/administration/facilities/component_data.ejs.php?task=taxid',
		reader: {
			type: 'json',
			idProperty: 'option_id',
			totalProperty: 'results',
			root: 'row'
		}
	}),
	autoLoad: true
});
storeTaxID.on('load',function(ds,records,o){ // Select the first item on the combobox
	cmbTaxId = records[0].data.title;
});

// *************************************************************************************
// Structure, data for storePOSCode
// AJAX -> component_data.ejs.php
// tag: ExtJS v4 Ready
// *************************************************************************************
var poscodeRecord = Ext.regModel('FacilityRecord', {
	fields: [
	{name: 'option_id',	type: 'string'},
	{name: 'title',		type: 'title'}
	],
});
var storePOSCode = new Ext.data.Store({
	model: 'poscodeRecord',
	proxy: new Ext.data.AjaxProxy({
		url: 'interface/administration/facilities/component_data.ejs.php?task=poscodes',
		reader: {
			type: 'json',
			idProperty: 'option_id',
			totalProperty: 'results',
			root: 'row'
		}
	}),
	autoLoad: true
});
storePOSCode.on('load',function(ds,records,o){ // Select the first item on the combobox
	cmbPOSCode = records[0].data.title;
});

// *************************************************************************************
// Facility Form
// Add or Edit purpose
// *************************************************************************************
var frmFacility = new Ext.FormPanel({
	id			: 'frmFacility',
	bodyStyle	: 'padding: 3px;',
	layout: 'column',
	items: [{
		layout: 'form',
		autoWidth: true,
		border: false,
		bodyStyle : 'padding: 0 5px',
		defaults: { labelWidth: 50 },
        items: 
		[
			{ xtype: 'textfield', minLengthText: '<?php i18n('Must contain at least 3 characters.'); ?>, minLength: 3, id: 'name', name: 'name', fieldLabel: '<?php i18n('Name'); ?>' },
			{ xtype: 'textfield', minLengthText: '<?php i18n('Must contain at least 3 characters.'); ?>, minLength: 3, id: 'street', name: 'street', fieldLabel: '<?php i18n('Address'); ?>' },
			{ xtype: 'textfield', minLengthText: '<?php i18n('Must contain at least 3 characters.'); ?>, minLength: 3, id: 'city', name: 'city', fieldLabel: '<?php i18n('City'); ?>' },
			{ xtype: 'textfield', maxLength:50, minLengthText: 'Must contain at least 2 characters.'); ?>, minLength: 2, id: 'state', name: 'state', fieldLabel: '<?php i18n('State'); ?>' },
			{ xtype: 'textfield', maxLength: 10, id: 'country_code', name: 'country_code', fieldLabel: '<?php i18n('Country'); ?>' },
			{ xtype: 'textfield', maxLength: 30, minLengthText: '<?php i18n('Must contain at least 7 characters.'); ?>, minLength: 7, id: 'phone', name: 'phone', fieldLabel: '<?php i18n('Phone'); ?>' },
			{ xtype: 'textfield', maxLength: 30, minLengthText: '<?php i18n('Must contain at least 7 characters.'); ?>, minLength: 7, id: 'fax', name: 'fax', fieldLabel: '<?php i18n('Fax'); ?>' },
			{ xtype: 'textfield', maxLength: 11, minLengthText: '<?php i18n('Must contain at least 3 characters.'); ?>, minLength: 3, id: 'postal_code', name: 'postal_code', fieldLabel: '<?php i18n('Zip Code'); ?>' },
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
			{ xtype: 'combo', width: 60, displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', hiddenName: 'tax_id_type', store: storeTaxID, id: 'tax_id_type', name: 'tax_id_type', fieldLabel: '<?php i18n('Tax ID'); ?>', editable: false },
			{ xtype: 'textfield', maxLength: 15, minLengthText: 'Must contain at least 5 characters.', minLength: 5, id: 'facility_npi', name: 'facility_npi', fieldLabel: '<?php i18n('Facility NPI'); ?>' },
			{ xtype: 'checkbox', id: 'billing_location', name: 'billing_location', fieldLabel: '<?php i18n('Billing Location'); ?>' },
			{ xtype: 'checkbox', id: 'accepts_assignment', name: 'accepts_assignment', fieldLabel: '<?php i18n('Accepts Assignment'); ?>' },
			{ xtype: 'checkbox', checked: true, id: 'service_location', name: 'service_location', fieldLabel: '<?php i18n('Service Location'); ?>' },
			{ xtype: 'combo', width: 300, autoSelect: true, displayField: 'title', hiddenName: 'pos_code', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storePOSCode, id: 'pos_code', name: 'pos_code', fieldLabel: '<?php i18n('POS Code'); ?> ?>', editable: false },
			{ xtype: 'textfield', maxLength: 65, minLengthText: '<?php i18n('Must contain at least 10 characters.'); ?>', minLength: 10, id: 'attn', name: 'attn', fieldLabel: '<?php i18n('Billing Attn'); ?>' },
			{ xtype: 'textfield', maxLength: 60, minLengthText: '<?php i18n('Must contain at least 5 characters.'); ?>', minLength: 5, id: 'domain_identifier', name: 'domain_identifier', fieldLabel: '<?php i18n('CLIA Number'); ?>' }
		]}
	],
	
	// Window Bottom Bar
	bbar:[{
		text		:'<?php echo i18n('Save'); ?>',
		ref			: '../save',
		iconCls		: 'save',
		handler: function() {
			
			//----------------------------------------------------------------
			// 1. Convert the form data into a JSON data Object
			// 2. Re-format the Object to be a valid record (FacilityRecord)
			//----------------------------------------------------------------
			var obj = eval('(' + Ext.util.JSON.encode(frmFacility.getForm().getValues()) + ')');
			var rec = new FacilityRecord(obj);
			
			//----------------------------------------------------------------
			// Check if it has to add or update
			// Update: 1. Get the record from store, 2. get the values from the form, 3. copy all the 
			// values from the form and push it into the store record.
			// Add: Push the re-formated record to the dataStore
			//----------------------------------------------------------------
			if (frmFacility.getForm().findField('id').getValue()){ // Update
				var record = storeFacilities.getAt(rowPos);
				var fieldValues = frmFacility.getForm().getValues();
				for ( k=0; k <= storeFacilities.fields.getCount()-1; k++) {
					i = storeFacilities.fields.get(k).name;
					record.set( i, fieldValues[i] );
				}
			} else { // Add
				storeFacilities.add( rec );
			}

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
	title		: '...',
	closeAction	: 'hide',
	renderTo	: document.body,
	items: [ frmFacility ],
	listeners: {
		show: function(){
			if ( Ext.getCmp('id').getValue() ){
				winFacility.setTitle('<?php i18n('Edit Facility'); ?>');
			} else {
				winFacility.setTitle('<?php i18n('Add Facility'); ?>');
			}
		}
	}
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
	
		// -----------------------------------------
		// Single click to select the record
		// -----------------------------------------
		rowclick: function(facilitiesGrid, rowIndex, e) {
			rowPos = rowIndex;
			var rec = storeFacilities.getAt(rowPos);
			Ext.getCmp('frmFacility').getForm().loadRecord(rec);
			facilitiesGrid.editFacility.enable();
		},

		// -----------------------------------------
		// Double click to select the record, and edit the record
		// -----------------------------------------
		rowdblclick:  function(facilitiesGrid, rowIndex, e) {
			rowPos = rowIndex;
			var rec = storeFacilities.getAt(rowPos); // get the record from the store
			Ext.getCmp('frmFacility').getForm().loadRecord(rec); // load the record selected into the form
			facilitiesGrid.editFacility.enable();
			winFacility.show();
		}
	},
	columns: [
		// Hidden cells
		{header: 'id', sortable: false, dataIndex: 'id', hidden: true},
		// Viewable cells
		{ width: 200, header: '<?php i18n('Name'); ?>', sortable: true, dataIndex: 'name' },
		{ header: '<?php i18n('Address'); ?>', sortable: true, dataIndex: 'street' },
		{ header: '<?php i18n('Phone'); ?>', sortable: true, dataIndex: 'phone' }
	],
	// -----------------------------------------
	// Grid Menu
	// -----------------------------------------
	tbar: [{
		xtype	:'button',
		id		: 'addFacility',
		text	: '<?php xl("Add facility", 'e'); ?>',
		iconCls	: 'facilities',
		handler: function(){
			Ext.getCmp('frmFacility').getForm().reset(); // Clear the form
			Ext.getCmp('tax_id_type').setValue(cmbTaxId);
			Ext.getCmp('pos_code').setValue(cmbPOSCode);
			winFacility.show();
		}
	},'-',{
		xtype	:'button',
		id		: 'editFacility',
		ref		: '../editFacility',
		text	: '<?php i18n('Edit facility'); ?>',
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
var topRenderPanel = new Ext.Panel({
	title: '<?php i18n('Facilities'); ?>',
  	frame : false,
	border : false,
	id: 'topRenderPanel',
	items: [ facilitiesGrid ]
});

}); // End ExtJS

</script>