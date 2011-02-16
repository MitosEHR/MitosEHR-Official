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
var rowPos, currList;

//******************************************************************************
// Sanitizing Objects
// Destroy them, if already exists in the browser memory.
// This destructions must be called for all the objects that
// are rendered on the document.body 
//******************************************************************************
if ( Ext.getCmp('winList') ){ Ext.getCmp('winList').destroy(); }

// *************************************************************************************
// Structure of the message record
// creates a subclass of Ext.data.Record
//
// This should be the structure of the database table
// 
// *************************************************************************************
var ListRecord = Ext.data.Record.create([
	{name: 'list_id', 		type: 'string',	mapping: 'list_id'},
	{name: 'option_id', 	type: 'string', mapping: 'option_id'},
	{name: 'title', 		type: 'string', mapping: 'title'},
	{name: 'seq', 			type: 'string', mapping: 'seq'},
	{name: 'is_default', 	type: 'string', mapping: 'is_default'},
	{name: 'option_value', 	type: 'string', mapping: 'option_value'},
	{name: 'mapping', 		type: 'string', mapping: 'mapping'},
	{name: 'notes', 		type: 'string', mapping: 'notes'}
]);

// *************************************************************************************
// Structure, data for storeEditList
// AJAX -> component_data.ejs.php
// *************************************************************************************
var storeEditList = new Ext.data.Store({
	proxy: new Ext.data.HttpProxy({
		url: '../administration/lists/component_data.ejs.php?task=editlist'
	}),
	reader: new Ext.data.JsonReader({
		idIndex: 0,
		idProperty: 'option_id',
		totalProperty: 'results',
		root: 'row'
	},[
		{name: 'option_id', type: 'string', mapping: 'option_id'},
		{name: 'title', type: 'string', mapping: 'title'}
	])
});
storeEditList.load();
storeEditList.on('load',function(ds,records,o){ // Select the first item on the combobox
	Ext.getCmp('cmbList').setValue(records[0].data.title);
	currList = records[0].data.option_id;
});

// *************************************************************************************
// Structure and load the data for ListsOptions
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
	}, ListRecord ),

	// JSON Reader options
	reader: new Ext.data.JsonReader({
		idProperty: 'id',
		totalProperty: 'results',
		root: 'row'
	}, ListRecord )
	
});
storeListsOption.load();

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
			{ xtype: 'textfield', hidden: true, id: 'list_id', name: 'list_id'},
			{ xtype: 'textfield', id: 'title', name: 'title', fieldLabel: '<?php echo htmlspecialchars( xl('Name'), ENT_NOQUOTES); ?>' }
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
			var obj = eval('(' + Ext.util.JSON.encode(frmLists.getForm().getValues()) + ')');
			var rec  = new ListRecord(obj);
			
			//----------------------------------------------------------------
			// Check if it has to add or update
			// Update: 1. Get the record from store, 2. get the values from the form, 3. copy all the 
			// values from the form and push it into the store record.
			// Add: The re-formated record to the dataStore
			//----------------------------------------------------------------
			if (frmLists.getForm().findField('id').getValue()){ // Update
				var record = ListRecord.getAt(rowPos);
				var fieldValues = frmLists.getForm().getValues();
				for (key in fieldValues){ record.set( key, fieldValues[key] ); }
			} else { // Add
				storeListsOption.add( rec );
			}

			storeListsOption.save();
			storeListsOption.commitChanges();
			storeListsOption.reload();
			winLists.hide();
		}
	},{
		text:'<?php echo htmlspecialchars( xl('Close'), ENT_NOQUOTES); ?>',
		iconCls: 'delete',
		handler: function(){ winLists.hide(); }
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
		// Viewable cells
		{ width: 50, header: 'ID', sortable: true, dataIndex: 'list_id'},
		{ width: 150, header: '<?php echo htmlspecialchars( xl('Title'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'title' },
		{ header: '<?php echo htmlspecialchars( xl('Order'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'order' },
		{ header: '<?php echo htmlspecialchars( xl('Default'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'is_default' },
		{ header: '<?php echo htmlspecialchars( xl('Notes'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'notes' },
	],
	// -----------------------------------------
	// Grid Menu
	// -----------------------------------------
	tbar: [{
		xtype	:'button',
		id		: 'addList',
		text	: '<?php xl("Create a list", 'e'); ?>',
		iconCls	: 'icoListOptions',
		handler: function(){
			Ext.getCmp('frmLists').getForm().reset(); // Clear the form
			winLists.show();
		}
	},'-',{
		xtype	:'button',
		id		: 'editList',
		ref		: '../editList',
		text	: '<?php xl("Edit list", 'e'); ?>',
		iconCls	: 'edit',
		disabled: true,
		handler: function(){ 
			winLists.show();
		}
	},'-',{
		xtype		  :'button',
		id			  : 'delList',
		ref			  : '../delList',
		text		  : '<?php xl("Delete list", 'e'); ?>',
		iconCls		: 'delete',
		disabled	: true,
	},'-','<?php xl("Select list", 'e'); ?>: ',{
		name			: 'cmbList', 
		width			: 250,
		xtype			: 'combo',
		displayField	: 'title',
		id				: 'cmbList',
		mode			: 'local',
		triggerAction	: 'all', 
		hiddenName		: 'option_id',
		valueField		: 'option_id',
		ref				: '../cmbList',
		iconCls			: 'icoListOptions',
		editable		: false,
		store			: storeEditList
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
    listGrid
  ]
});

//******************************************************************************
// Get the actual height of the TopPanel and apply it to this panel
// This is mandatory statement.
//******************************************************************************
Ext.getCmp('RenderPanel').setHeight( Ext.getCmp('TopPanel').getHeight() );

}); // End ExtJS

</script>