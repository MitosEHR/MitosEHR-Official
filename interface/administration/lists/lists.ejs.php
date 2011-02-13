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
// ExtJS Global variables 
//******************************************************************************
var rowPos;

//******************************************************************************
// Sanitizing Objects
// Destroy them, if already exists in the browser memory.
// This destructions must be called for all the objects that
// are rendered on the document.body 
//******************************************************************************
if ( Ext.getCmp('winList) ){ Ext.getCmp('winList').destroy(); }

// *************************************************************************************
// Structure of the message record
// creates a subclass of Ext.data.Record
//
// This should be the structure of the database table
// 
// *************************************************************************************
var ListRecord = Ext.data.Record.create([
	{name: 'list_id', 		type: 'int',	mapping: 'list_id'},
	{name: 'option_id', 	type: 'string', mapping: 'option_id'},
	{name: 'title', 		type: 'string', mapping: 'title'},
	{name: 'seq', 			type: 'string', mapping: 'seq'},
	{name: 'is_default', 	type: 'string', mapping: 'is_default'},
	{name: 'option_value', 	type: 'string', mapping: 'option_value'},
	{name: 'mapping', 		type: 'string', mapping: 'mapping'},
	{name: 'notes', 		type: 'string', mapping: 'notes'}
]);

// *************************************************************************************
// Structure and load the data for Messages
// AJAX -> data_*.ejs.php
// *************************************************************************************
var storeListsOption = new Ext.data.Store({
	autoSave	: false,

	// HttpProxy will only allow requests on the same domain.
	proxy : new Ext.data.HttpProxy({
		method		: 'POST',
		api: {
			read	: '../administration/lists/data_read.ejs.php',
			create	: '../administration/lists/data_create.ejs.php',
			update	: '../administration/lists/data_update.ejs.php',
			destroy : '../administration/lists/data_destroy.ejs.php'
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
// Structure, data for storeEditList
// AJAX -> component_data.ejs.php
// *************************************************************************************
var storeEditList = new Ext.data.Store({
	proxy: new Ext.data.HttpProxy({
		url: '../administration/lists/component_data.ejs.php?task=editlist'
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
storeEditList.load();

// *************************************************************************************
// Facility Form
// Add or Edit purpose
// *************************************************************************************
var frmLists = new Ext.FormPanel({
	id			: 'frmLists',
	bodyStyle	: 'padding: 3px;',
	layout: 'column',
	items: [{
		layout: 'form',
		autoWidth: true,
		border: false,
		bodyStyle : 'padding: 0 3px',
		defaults: { labelWidth: 50 },
        items: 
		[
			{ xtype: 'textfield', minLengthText: 'Must contain at least 3 characters.', minLength: 3, id: 'name', name: 'name', fieldLabel: '<?php echo htmlspecialchars( xl('Name'), ENT_NOQUOTES); ?>' },
			{ xtype: 'textfield', minLengthText: 'Must contain at least 3 characters.', minLength: 3, id: 'street', name: 'street', fieldLabel: '<?php echo htmlspecialchars( xl('Address'), ENT_NOQUOTES); ?>' },
			{ xtype: 'textfield', minLengthText: 'Must contain at least 3 characters.', minLength: 3, id: 'city', name: 'city', fieldLabel: '<?php echo htmlspecialchars( xl('City'), ENT_NOQUOTES); ?>' },
			{ xtype: 'textfield', maxLength:50, minLengthText: 'Must contain at least 2 characters.', minLength: 2, id: 'state', name: 'state', fieldLabel: '<?php echo htmlspecialchars( xl('State'), ENT_NOQUOTES); ?>' },
			{ xtype: 'textfield', maxLength: 10, id: 'country_code', name: 'country_code', fieldLabel: '<?php echo htmlspecialchars( xl('Country'), ENT_NOQUOTES); ?>' },
			{ xtype: 'textfield', maxLength: 30, minLengthText: 'Must contain at least 7 characters.', minLength: 7, id: 'phone', name: 'phone', fieldLabel: '<?php echo htmlspecialchars( xl('Phone'), ENT_NOQUOTES); ?>' },
			{ xtype: 'textfield', maxLength: 30, minLengthText: 'Must contain at least 7 characters.', minLength: 7, id: 'fax', name: 'fax', fieldLabel: '<?php echo htmlspecialchars( xl('Fax'), ENT_NOQUOTES); ?>' },
			{ xtype: 'textfield', maxLength: 11, minLengthText: 'Must contain at least 3 characters.', minLength: 3, id: 'postal_code', name: 'postal_code', fieldLabel: '<?php echo htmlspecialchars( xl('Zip Code'), ENT_NOQUOTES); ?>' },
			// Hidden fields
			{ xtype: 'textfield', hidden: true, id: 'id', name: 'id'}
        ]},{
		layout : 'form',
		border : false,
		autoWidth: true,
		bodyStyle : 'padding: 0 3px',
		defaults: { labelWidth: 150 },
        items: 
		[
			{ xtype: 'combo', width: 60, autoSelect: true, displayField: 'title', valueField: 'option_id', mode: 'local', triggerAction: 'all', hiddenName: 'tax_id_type', store: storeTaxID, id: 'tax_id_type', name: 'tax_id_type', fieldLabel: '<?php echo htmlspecialchars( xl('Tax ID'), ENT_NOQUOTES); ?>', editable: false },
			{ xtype: 'textfield', maxLength: 15, minLengthText: 'Must contain at least 5 characters.', minLength: 5, id: 'facility_npi', name: 'facility_npi', fieldLabel: '<?php echo htmlspecialchars( xl('Facility NPI'), ENT_NOQUOTES); ?>' },
			{ xtype: 'checkbox', id: 'billing_location', name: 'billing_location', fieldLabel: '<?php echo htmlspecialchars( xl('Billing Location'), ENT_NOQUOTES); ?>' },
			{ xtype: 'checkbox', id: 'accepts_assignment', name: 'accepts_assignment', fieldLabel: '<?php echo htmlspecialchars( xl('Accepts Assignment'), ENT_NOQUOTES); ?>' },
			{ xtype: 'checkbox', checked: true, id: 'service_location', name: 'service_location', fieldLabel: '<?php echo htmlspecialchars( xl('Service Location'), ENT_NOQUOTES); ?>' },
			{ xtype: 'combo', width: 300, autoSelect: true, displayField: 'title', hiddenName: 'pos_code', valueField: 'option_id', mode: 'local', triggerAction: 'all', store: storePOSCode, id: 'pos_code', name: 'pos_code', fieldLabel: '<?php echo htmlspecialchars( xl('POS Code'), ENT_NOQUOTES); ?>', editable: false },
			{ xtype: 'textfield', maxLength: 65, minLengthText: 'Must contain at least 10 characters.', minLength: 10, id: 'attn', name: 'attn', fieldLabel: '<?php echo htmlspecialchars( xl('Billing Attn'), ENT_NOQUOTES); ?>' },
			{ xtype: 'textfield', maxLength: 60, minLengthText: 'Must contain at least 5 characters.', minLength: 5, id: 'domain_identifier', name: 'domain_identifier', fieldLabel: '<?php echo htmlspecialchars( xl('CLIA Number'), ENT_NOQUOTES); ?>' }
		]}
	],
	
	// Window Bottom Bar
	bbar:[{
		text		:'<?php echo htmlspecialchars( xl('Save'), ENT_NOQUOTES); ?>',
		ref			: '../save',
		iconCls		: 'save',
		handler: function() {
			
			//----------------------------------------------------------------
			// 1. Convert the form data into a JSON data Object
			// 2. Re-format the Object to be a valid record (FacilityRecord)
			//----------------------------------------------------------------
			var obj = eval('(' + Ext.util.JSON.encode(frmFacility.getForm().getValues()) + ')');
			var rec  = new FacilityRecord(obj);
			
			//----------------------------------------------------------------
			// Check if it has to add or update
			// Update: 1. Get the record from store, 2. get the values from the form, 3. copy all the 
			// values from the form and push it into the store record.
			// Add: The re-formated record to the dataStore
			//----------------------------------------------------------------
			if (frmFacility.getForm().findField('id').getValue()){ // Update
				var record = storeFacilities.getAt(rowPos);
				var fieldValues = frmFacility.getForm().getValues();
				for (key in fieldValues){ record.set( key, fieldValues[key] ); }
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
var winLists = new Ext.Window({
	id			: 'winLists',
	width		: 700,
	autoHeight	: true,
	modal		: true,
	resizable	: false,
	autoScroll	: true,
	title		: '...',
	closeAction	: 'hide',
	renderTo	: document.body,
	items: [ frmLists ],
	listeners: {
		show: function(){
			if ( Ext.getCmp('id').getValue() ){
				winLists.setTitle('<?php echo htmlspecialchars( xl('Edit List'), ENT_NOQUOTES); ?>');
			} else {
				winLists.setTitle('<?php echo htmlspecialchars( xl('Create List'), ENT_NOQUOTES); ?>');
			}
		}
	}
}); // END WINDOW


// *************************************************************************************
// Create the GridPanel
// *************************************************************************************
var listGrid = new Ext.grid.GridPanel({
	id		   : 'listGrid',
	store	   : storeListsOption,
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
		rowclick: function(storeListsOption, rowIndex, e) {
			rowPos = rowIndex;
			var rec = storeListsOption.getAt(rowPos);
			Ext.getCmp('frmLists').getForm().loadRecord(rec);
			listGrid.editList.enable();
		},

		// -----------------------------------------
		// Double click to select the record, and edit the record
		// -----------------------------------------
		rowdblclick:  function(storeListsOption, rowIndex, e) {
			rowPos = rowIndex;
			var rec = storeListsOption.getAt(rowPos); // get the record from the store
			Ext.getCmp('frmLists').getForm().loadRecord(rec); // load the record selected into the form
			listGrid.editList.enable();
			winLists.show();
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
			winLists.show();
		}
	},'-',{
		xtype	:'button',
		id		: 'editFacility',
		ref		: '../editFacility',
		text	: '<?php xl("Edit facility", 'e'); ?>',
		iconCls	: 'edit',
		disabled: true,
		handler: function(){ 
			winLists.show();
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
  title: '<?php xl('List Options', 'e'); ?>',
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