<?php 
//******************************************************************************
// list.ejs.php
// List Options Panel
// v0.0.1
// 
// Author: Ernest Rodriguez
// Modified: Gino Rivera
// 
// MitosEHR (Eletronic Health Records) 2011
//******************************************************************************

session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

?>
<script type="text/javascript">
Ext.onReady(function(){

//******************************************************************************
// ExtJS Global variables 
//******************************************************************************
var rowPos; // Stores the current Grid Row Position (int)
var currList; // Stores the current List Option (string)
var currRec; // Store the current record (Object)

//******************************************************************************
// Sanitizing Objects!
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
	{name: 'id',			type: 'int',		mapping: 'id'},
	{name: 'list_id', 		type: 'string',		mapping: 'list_id'},
	{name: 'option_id', 	type: 'string',		mapping: 'option_id'},
	{name: 'title', 		type: 'string',		mapping: 'title'},
	{name: 'seq', 			type: 'int', 		mapping: 'seq'},
	{name: 'is_default', 	type: 'boolean',	mapping: 'is_default'},
	{name: 'option_value', 	type: 'string',		mapping: 'option_value'},
	{name: 'mapping', 		type: 'string',		mapping: 'mapping'},
	{name: 'notes', 		type: 'string',		mapping: 'notes'}
]);

// *************************************************************************************
// Structure, data for storeEditList
// AJAX -> component_data.ejs.php
// *************************************************************************************
var storeEditList = new Ext.data.Store({
	proxy: new Ext.data.HttpProxy({
		url: 'interface/administration/lists/component_data.ejs.php?task=editlist'
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

//--------------------------
// When the data is loaded
// Select the first record
//--------------------------
storeEditList.on('load',function(ds,records,o){
	Ext.getCmp('cmbList').setValue(records[0].data.option_id);
	currList = records[0].data.option_id; // Get first result for first grid data
	storeListsOption.load({params:{list_id: currList}}); // Filter the data store from the currList value
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
			read	: 'interface/administration/lists/data_read.ejs.php',
			create	: 'interface/administration/lists/data_create.ejs.php',
			update	: 'interface/administration/lists/data_update.ejs.php',
			destroy : 'interface/administration/lists/data_destroy.ejs.php'
		}
	}),

	// JSON Writer options
	writer: new Ext.data.JsonWriter({
		encodeDelete	: true,
		returnJson		: true,
		writeAllFields	: true,
		listful			: true
	}, ListRecord ),

	// JSON Reader options
	reader: new Ext.data.JsonReader({
		idProperty: 'id',
		totalProperty: 'results',
		root: 'row'
	}, ListRecord )
	
});

// *************************************************************************************
// List Create Form
// Create or Closse purpose
// *************************************************************************************
var frmLists = new Ext.FormPanel({
	id			: 'frmLists',
	autoWidth	: true,
	border		: false,
	bodyStyle	: 'padding: 5px',
	defaults	: { labelWidth: 50 },
	items: 
	[
		{ xtype: 'textfield', width: 200, id: 'list_name', name: 'list_name', fieldLabel: '<?php i18n('List Name'); ?>' }
    ],
	
	// Window Bottom Bar
	bbar:[{
		text		:'<?php i18n('Save'); ?>',
		ref			: '../save',
		iconCls		: 'save',
		handler: function() { winLists.hide(); }
	},{
		text:'<?php i18n('Close'); ?>',
		iconCls: 'delete',
		handler: function(){ winLists.hide(); }
	}]
});

// *************************************************************************************
// Create list Window Dialog
// *************************************************************************************
var winLists = new Ext.Window({
	id			: 'winList',
	width		: 400,
	autoHeight	: true,
	modal		: true,
	resizable	: false,
	autoScroll	: false,
	title		: '<?php i18n('Create List'); ?>',
	closeAction	: 'hide',
	renderTo	: document.body,
	items: [ frmLists ]
}); // END WINDOW

// *************************************************************************************
// RowEditor Class
// *************************************************************************************
var editor = new Ext.ux.grid.RowEditor({
	saveText: 'Update',
	errorSummary: false,
	listeners:{
		afteredit: function(roweditor, changes, record, rowIndex){
			storeListsOption.save();
			storeListsOption.commitChanges();
			storeListsOption.reload();
		}
	}
});

// *************************************************************************************
// Create the GridPanel
// *************************************************************************************
var listGrid = new Ext.grid.GridPanel({
	id			: 'listGrid',
	store		: storeListsOption,
	stripeRows	: true,
	border		: false,    
	frame	  	: false,
	viewConfig	: {forceFit: true},
	sm			: new Ext.grid.RowSelectionModel({singleSelect:true}),
	columns: [
		// Viewable cells
		{ 	
			width: 50, 
			header: 'ID', 
			sortable: true, 
			dataIndex: 'option_id',
            editor: {
                xtype: 'textfield',
                allowBlank: false
            }
		},
		{ 
			width: 150, 
			header: '<?php i18n('Title'); ?>', 
			sortable: true, 
			dataIndex: 'title',
            editor: {
                xtype: 'textfield',
                allowBlank: false
            }
		},
		{ 
			header: '<?php i18n('Order'); ?>', 
			sortable: true, 
			dataIndex: 'seq',
			editor: {
                xtype: 'textfield',
                allowBlank: false
            }
		},
		{ 
			header: '<?php i18n('Default'); ?>', 
			sortable: true, 
			dataIndex: 'is_default',
            editor: {
                xtype: 'checkbox',
                allowBlank: false
            } 
		},
		{ 
			header: '<?php i18n('Notes'); ?>', 
			sortable: true, 
			dataIndex: 'notes',
            editor: {
                xtype: 'textfield',
                allowBlank: true
            } 
		}
	],
	listeners:{
		cellclick: function(grid, rowIndex, columnIndex, e){
			currRec = storeListsOption.getAt(rowIndex); // Copy the record to the global variable
		}
	},
	// -----------------------------------------
	// Grid Top Menu
	// -----------------------------------------
	tbar: [{
		xtype	:'button',
		id		: 'addList',
		text	: '<?php i18n('Create a list'); ?>',
		iconCls	: 'icoListOptions',
		handler: function(){
			Ext.getCmp('frmLists').getForm().reset(); // Clear the form
			winLists.show();
		}
	},'-',{
		xtype		  :'button',
		id			  : 'delList',
		ref			  : '../delList',
		text		  : '<?php i18n('Delete list'); ?>',
		iconCls		: 'delete',
	},'-','<?php i18n('Select list'); ?>: ',{
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
		store			: storeEditList,
		ctCls			: 'fieldMark',
		listeners: {
			select: function( cmb, rec, indx){
				// Reload the data store to reflect the new selected list filter
				storeListsOption.reload({params:{list_id: rec.data.option_id }});
			}
		}
	}], // END GRID TOP MENU
	
	// -----------------------------------------
	// Grid Bottom Menu
	// -----------------------------------------
	bbar:[{
		// Add a new record.
		text		:'<?php i18n('Add record'); ?>',
		ref			: '../add',
		iconCls		: 'icoAddRecord',
		handler: function() {
			editor.stopEditing();
			var rec = new ListRecord();
			rec.set('list_id', Ext.getCmp('cmbList').value);
			storeListsOption.add( rec );
			editor.startEditing( storeListsOption.getTotalCount() );
		}
	},'-',{
		// Delete the selected record.
		text:'<?php i18n('Delete record'); ?>',
		iconCls: 'delete',
		handler: function(){ 
			Ext.Msg.show({
				title: '<?php i18n('Please confirm...'); ?>', 
				icon: Ext.MessageBox.QUESTION,
				msg:'<?php i18n('Are you sure to delete this record?<br>From: '); ?>',
				buttons: Ext.Msg.YESNO,
				fn:function(btn,msgGrid){
					if(btn=='yes'){
						editor.stopEditing();
						storeListsOption.remove( currRec );
						storeListsOption.save();
						storeListsOption.reload();
		    	    }
				}
			});
		}
	}], // END GRID BOTTOM BAR
	plugins: [editor, new Ext.ux.grid.Search({
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
  title: '<?php i18n('List Options'); ?>',
  border  : false,
  stateful: true,
  monitorResize: true,
  autoWidth: true,
  id: 'RenderPanel',
  renderTo: Ext.getCmp('TopPanel').body,
  viewConfig:{forceFit:true},
  items: [ 
    listGrid
  ],
  listeners:{
	resize: function(){
		Ext.getCmp('listGrid').setHeight( Ext.getCmp('TopPanel').getHeight()-27 ); // -27 to show the bottom bar
	}
  }
});

}); // End ExtJS

</script>