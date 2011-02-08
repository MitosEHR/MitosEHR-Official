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
	{name: 'federal_ein', type: 'string',	mapping: 'postal_code'},
	{name: 'service_location', type: 'string',	mapping: 'postal_code'},
	{name: 'billing_location', type: 'string',	mapping: 'postal_code'},
	{name: 'accepts_assignment', type: 'string',	mapping: 'postal_code'},
	{name: 'pos_code', type: 'string',	mapping: 'postal_code'},
	{name: 'x12_sender_id', type: 'string',	mapping: 'postal_code'},
	{name: 'attn', type: 'string',	mapping: 'postal_code'},
	{name: 'domain_identifier', type: 'string',	mapping: 'postal_code'},
	{name: 'facility_npi', type: 'string',	mapping: 'postal_code'},
	{name: 'tax_id_type', type: 'string',	mapping: 'postal_code'}
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
			destroy : '../administration/facilities/data_destroy.ejs.php'
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
		idProperty: 'noteid',
		totalProperty: 'results',
		root: 'row'
	}, FacilityRecord )
	
});
storeFacilities.load();

// *************************************************************************************
// Message Window Dialog
// *************************************************************************************
var winFacility = new  Ext.Window({
	width		: 600,
	autoHeight	: true,
	modal		: true,
	resizable	: false,
	autoScroll	: true,
	title		: '<?php echo htmlspecialchars( xl('Add/Edit Facility'), ENT_NOQUOTES); ?>',
	closeAction	: 'hide',
	renderTo	: document.body,
	items: [
		{
		xtype		: 'form',
		region		:'center',
		labelWidth	: 100,
		id			: 'frmFacility',
		frame		: true,
		bodyStyle	: 'padding: 5px',
		defaults	: {width: 180},
		formBind	: true,
		buttonAlign	: 'left',
		split		: true,
		items: [
			{ xtype: 'textfield', 
				ref: '../txtName',
				id: 'txtName',
				name: 'txtName',
				fieldLabel: '<?php echo htmlspecialchars( xl('Name'), ENT_NOQUOTES); ?>',
			},
		]
	}],
	// Window Bottom Bar
	bbar:[{
		text		:'<?php echo htmlspecialchars( xl('Save'), ENT_NOQUOTES); ?>',
		ref			: '../save',
		iconCls		: 'save',
		disabled	: true,
		handler: function() { 
			winFacility.hide();
		}
	},{
		text:'<?php echo htmlspecialchars( xl('Close'), ENT_NOQUOTES); ?>',
		iconCls: 'delete',
		handler: function(){ winFacility.hide(); }
	}]
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
	
		// Single click to select the record, and copy the variables
		rowclick: function(facilitiesGrid, rowIndex, e) {
		
			//Copy the selected message ID into the variable
			rowContent = Ext.getCmp('facilitiesGrid').getStore().getAt(rowIndex);
			
			// Enable buttons
			facilitiesGrid.editFacility.enable();
			facilitiesGrid.deleteFacility.enable();
		},

		// Double click to select the record, and edit the record
		rowdblclick:  function(facilitiesGrid, rowIndex, e) {
				
			//Copy the selected message ID into the variable
			rowContent = Ext.getCmp('facilitiesGrid').getStore().getAt(rowIndex);
				
			winFacility.show();
			
			// Enable buttons
			facilitiesGrid.editFacility.enable();
			facilitiesGrid.deleteFacility.enable();
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
	},'-',{
		xtype		:'button',
		id			: 'deleteFacility',
		ref			: '../delMsg',
		text		: '<?php xl("Delete facility", 'e'); ?>',
		iconCls		: 'delete',
		disabled	: true,
		handler: function(facilitiesGrid){
			Ext.Msg.show({
				title: '<?php xl("Please confirm...", 'e'); ?>', 
				icon: Ext.MessageBox.QUESTION,
				msg:'<?php xl("Are you sure to delete this facility?"); ?>',
				buttons: Ext.Msg.YESNO,
				fn:function(btn,facilitiesGrid){
			        if(btn=='yes'){
						// The datastore object will save the data
						// as soon changes is detected on the datastore
						// It's a AJAX thing
						var rows = Ext.getCmp('facilitiesGrid').selModel.getSelections();
						storeFacilities.remove(rows);
						storeFacilities.save();
						storeFacilities.commitChanges();
						storeFacilities.reload();
	    	    	}
				}
			});
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