<?php

//--------------------------------------------------------------------------------------------------------------------------
// immunization.ejs.php 
// v0.0.1
// Under GPLv3 License
//
// Integration Sencha ExtJS Framework
// OpenEMR is a free medical practice management, electronic medical records, prescription writing, 
// and medical billing application. These programs are also referred to as electronic health records. 
// OpenEMR is licensed under the General Gnu Public License (General GPL). It is a free open source replacement 
// for medical applications such as Medical Manager, Health Pro, and Misys. It features support for EDI billing 
// to clearing houses such as Availity, MD-Online, MedAvant and ZirMED using ANSI X12.
//--------------------------------------------------------------------------------------------------------------------------

session_name ( "MitosEHR" );
session_start();

include_once($_SESSION['site']['root']."/library/adoHelper/adoHelper.inc.php");
include_once($_SESSION['site']['root']."/library/I18n/I18n.inc.php");
require_once($_SESSION['site']['root']."/repository/dataExchange/dataExchange.inc.php");

include_once("$srcdir/sql.inc.php");
include_once("$srcdir/options.inc.php");

if (isset($_POST['action'])) {
	
	// *************************************************************************************
	// Add new record
	// *************************************************************************************
    if ($_POST['action'] == "add" ) {
        $sql = "REPLACE INTO 
					immunizations
				SET 
					id = ?,
					administered_date = if(?,?,NULL),  
					immunization_id = ?,
					manufacturer = ?,
					lot_number = ?,
					administered_by_id = if(?,?,NULL),
					administered_by = if(?,?,NULL),
					education_date = if(?,?,NULL), 
					vis_date = if(?,?,NULL), 
					note   = ?,
					patient_id   = ?,
					created_by = ?,
					updated_by = ?,
					create_date = now() ";
	$sqlBindArray = array(
							trim($_POST['id']),
							trim($_POST['administered_date']),
							trim($_POST['administered_date']),
							trim($_POST['immunization_id']),
							trim($_POST['manufacturer']),
							trim($_POST['lotnumber']),
							trim($_POST['administered_by_id']),
							trim($_POST['administered_by_id']),
							trim($_POST['administered_by']),
							trim($_POST['administered_by']),
							trim($_POST['education_date']),
							trim($_POST['education_date']),
							trim($_POST['vis_date']),
							trim($_POST['vis_date']),
							trim($_POST['note']),
							$pid,
							$_SESSION['authId'],
							$_SESSION['authId']
					);
        sqlStatement($sql,$sqlBindArray);
        $administered_date = $education_date = date('Y-m-d');
        $immunization_id = $manufacturer = $lot_number = $administered_by_id=$note=$id="";
        $administered_by = $vis_date="";
    }
	// *************************************************************************************
	// Delete a record
	// *************************************************************************************
    elseif ($_POST['action'] == "delete" ) { // Need to be fixed, the GRID it's not calling the form for deletion.
        // log the event
        newEvent("delete", $_SESSION['authUser'], $_SESSION['authProvider'], "Immunization id ".$_POST['id']." deleted from pid ".$_POST['pid']);
        // delete the immunization
        $sql="DELETE FROM immunizations WHERE id =". mysql_real_escape_string($_POST['id'])." LIMIT 1";
        sqlStatement($sql);
    }
	// *************************************************************************************
	// Save the record
	// *************************************************************************************
    elseif ($_POST['action'] == "save" ) { 
        $sql = "UPDATE 
					immunizations
				SET 
					administered_date = if(?,?,NULL),  
					immunization_id = ?,
					manufacturer = ?,
					lot_number = ?,
					administered_by_id = if(?,?,NULL),
					administered_by = if(?,?,NULL),
					education_date = if(?,?,NULL), 
					vis_date = if(?,?,NULL), 
					note   = ?,
					patient_id   = ?,
					created_by = ?,
					updated_by = ?
				WHERE 
					id = ?";
	$sqlBindArray = array(
						     trim($_POST['administered_date']),
							 trim($_POST['administered_date']),
						     trim($_POST['immunization_id']),
						     trim($_POST['manufacturer']),
						     trim($_POST['lotnumber']),
						     trim($_POST['administered_by_id']),
							 trim($_POST['administered_by_id']),
						     trim($_POST['administered_by']),
							 trim($_POST['administered_by']),
						     trim($_POST['education_date']),
							 trim($_POST['education_date']),
						     trim($_POST['vis_date']),
							 trim($_POST['vis_date']),
						     trim($_POST['note']),
						     $pid,
						     $_SESSION['authId'],
						     $_SESSION['authId'],
				             trim($_POST['id'])
				     );
        sqlStatement($sql,$sqlBindArray);
        $administered_date = $education_date = date('Y-m-d');
        $immunization_id = $manufacturer=$lot_number = $administered_by_id=$note=$id="";
        $administered_by = $vis_date="";
    }
}

// *************************************************************************************
// Sensha Ext JS Start
// New Gui Framework
// *************************************************************************************
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" />

<head>
<script type="text/javascript" src="../../../library/ext-3.3.0/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="../../../library/ext-3.3.0/ext-all.js"></script>

<script type="text/javascript" src="../../../library/ext-3.3.0/plugins/gridsearch/js/Ext.ux.grid.Search.js"></script>
<script type="text/javascript" src="../../../library/ext-3.3.0/plugins/gridsearch/js/Ext.ux.grid.RowActions.js"></script>

<link rel="stylesheet" type="text/css" href="../../../library/ext-3.3.0/resources/css/xtheme-gray.css" />
<link rel="stylesheet" type="text/css" href="../../../interface/themes/style_newui.css" />
<script type="text/javascript">

// *************************************************************************************
// Define Global Variables
// *************************************************************************************
var rowContent;

Ext.onReady(function(){

Ext.QuickTips.init();

// *************************************************************************************
// Structure of the Immunization List record
// creates a subclass of Ext.data.Record
//
// This should be the structure of the database table
// You can have the name of the field on the database table and then
// do a mapping to another name.
//
// This is useful if the structure of the database is changed, the only thing you
// need to do is change the "name:" of the Record, and the mapping keep it the
// same, this way the software does not break.
//
// *************************************************************************************
var ImmunizationTable = Ext.data.Record.create([
	// on the database table
	{name: 'id', type: 'int',	mapping: 'id'},
	{name: 'patient_id', type: 'int', mapping: 'patient_id'},
	{name: 'administered_date', type: 'string', mapping: 'administered_date'},
	{name: 'immunization_id', type: 'int', mapping: 'immunization_id'},
	{name: 'manufacturer', type: 'string', mapping: 'manufacturer'},
	{name: 'lot_number', type: 'string', mapping: 'lot_number'},
	{name: 'administered_by_id', type: 'int', mapping: 'administered_by_id'},
	{name: 'administered_by', type: 'string', mapping: 'administered_by'},
	{name: 'education_date', type: 'string',	mapping: 'education_date'},
	{name: 'vis_date', type: 'string',	mapping: 'vis_date'},
	{name: 'note', type: 'string',	mapping: 'note'},
	{name: 'create_date', type: 'string',	mapping: 'create_date'},
	{name: 'update_date', type: 'string',	mapping: 'update_date'},
	{name: 'created_by', type: 'string',	mapping: 'created_by'},
	{name: 'updated_by', type: 'string',	mapping: 'updated_by'},

	// not on the database table - PHP Calculated field
	{name: 'vaccine', type: 'string', mapping:'vaccine'}
]);

// *************************************************************************************
// Structure and load the data for Immunization List
// AJAX -> immunization_data_logic.ejs.php
// *************************************************************************************
var storeImmList = new Ext.data.Store({
	autoSave	: false,

	// HttpProxy will only allow requests on the same domain.
	proxy : new Ext.data.HttpProxy({
		method		: 'POST',
		api: {
			read	: 'immunizations_data_logic.ejs.php?task=load',
			create	: 'immunizations_data_logic.ejs.php?task=create',
			update	: 'immunizations_data_logic.ejs.php?task=update',
			destroy : 'immunizations_data_logic.ejs.php?task=delete'
		}
	}),

	// JSON Writer options
	writer: new Ext.data.JsonWriter({
		returnJson		: true,
		writeAllFields	: true,
		listful			: true,
		writeAllFields	: true
	}, ImmunizationTable ),

	// JSON Reader options
	reader: new Ext.data.JsonReader({
		idProperty: 'noteid',
		totalProperty: 'results',
		root: 'row'
	}, ImmunizationTable )

});
storeImmList.load();

// *************************************************************************************
// Structure and load the data for cmb_immunization_id
// *************************************************************************************
var immData = new Ext.data.Store({
	proxy: new Ext.data.ScriptTagProxy({
		url: 'immunizations_data_logic.ejs.php?task=immunizations'
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
immData.load();

// *************************************************************************************
// Structure and load the data for cmb_administered_by_id
// *************************************************************************************
var admData = new Ext.data.Store({
	proxy: new Ext.data.ScriptTagProxy({
		url: 'immunizations_data_logic.ejs.php?task=admData'
	}),
	reader: new Ext.data.JsonReader({
		idProperty: 'id',
		totalProperty: 'results',
		root: 'row'
	},[
		{name: 'id', type: 'string', mapping: 'option_id'},
		{name: 'full_name', type: 'string', mapping: 'full_name'}
	])
});
admData.load();

// *************************************************************************************
// Immunization Window Dialog
// *************************************************************************************
var winImmunization = new  Ext.Window({
	width:540,
	autoHeight: true,
	modal: true,
	resizable: false,
	autoScroll: true,
	title:	'<?php echo htmlspecialchars( xl('Immunization'), ENT_NOQUOTES); ?>',
	closeAction: 'hide',
	renderTo: document.body,
	items: [{
		xtype: 'form',
		labelWidth: 300,
		id: 'frmImmunizations',
		frame: true,
		url: 'immunizations.ejs.php',
		bodyStyle: 'padding: 5px',
		defaults: {width: 150},
		formBind: true,
		buttonAlign: 'left',
		standardSubmit: true,
		items: [
			{ xtype: 'combo', id: 'form_immunization_id', name: 'form_immunization_id', fieldLabel: '<?php echo htmlspecialchars( xl('Immunization'), ENT_NOQUOTES); ?>', editable: false, triggerAction: 'all', mode: 'local', valueField: 'option_id', hiddenName: 'immunization_id', displayField: 'title', store: immData },
			{ xtype: 'datefield', id: 'administered_date', name: 'administered_date', format: 'Y-m-d', fieldLabel: '<?php echo htmlspecialchars( xl('Date Administered'), ENT_NOQUOTES); ?>' },
			{ xtype: 'textfield', id: 'manufacturer', name: 'manufacturer', fieldLabel: '<?php echo htmlspecialchars( xl('Immunization Manufacturer'), ENT_NOQUOTES); ?>' },
			{ xtype: 'textfield', id: 'lotnumber', name: 'lotnumber', fieldLabel: '<?php echo htmlspecialchars( xl('Immunization Lot Number'), ENT_NOQUOTES); ?>' },
			{ xtype: 'textfield', id: 'administered_by', name: 'administered_by', fieldLabel: '<?php echo htmlspecialchars( xl('Name and Title of Immunization Administrator'), ENT_NOQUOTES); ?>' },
			{ xtype: 'combo', id: 'cmb_administered_by_id', name: 'administered_by_id', fieldLabel: 'or choose', editable: false, triggerAction: 'all', mode: 'local', store: admData, valueField: 'id', hiddenName: 'administered_by_id', displayField: 'full_name' },
			{ xtype: 'datefield', id: 'education_date', format: 'Y-m-d', name: 'education_date', fieldLabel: '<?php echo htmlspecialchars( xl('Date Immunization Information Statements Given'), ENT_NOQUOTES); ?>' }, 
			{ xtype: 'datefield', id: 'vis_date', format: 'Y-m-d', name: 'vis_date', fieldLabel: '<?php echo htmlspecialchars( xl('Date of VIS Statement'), ENT_NOQUOTES); ?>' },
			{ xtype: 'textarea', id: 'note', name: 'note', fieldLabel: '<?php echo htmlspecialchars( xl('Notes'), ENT_NOQUOTES); ?>' },
			{ xtype: 'textfield', id: 'action', hidden: true, name: 'action' }, // <-- This field will be dynamically updated from the events on the grid.
			{ xtype: 'textfield', id: 'id', hidden: true, name: 'id' },
			{ xtype: 'textfield', id: 'pid', hidden: true, name: 'pid', value: '<?php echo htmlspecialchars( $pid, ENT_QUOTES); ?>' }
		]
	}],
	// Window Bottom Bar
	bbar:[{
		text:'<?php echo htmlspecialchars( xl('Save'), ENT_NOQUOTES); ?>',
		iconCls: 'save',
		formBind: true,
		handler: function() { Ext.getCmp('frmImmunizations').getForm().submit(); }
	},{
		text:'<?php echo htmlspecialchars( xl('Close'), ENT_NOQUOTES); ?>',
		iconCls: 'delete',
		formBind: true,
		handler: function(){ winImmunization.hide(); }
	}]
}); // END WINDOW

// *************************************************************************************
// Create the Viewport
// *************************************************************************************
var viewport = new Ext.Viewport({
    layout:'fit',
	renderTo: document.body,
	items:[
		// *************************************************************************************
		// Render the GridPanel
		// *************************************************************************************
		{ 
			title: '<?php xl("Patient Immunizations List", 'e'); ?>', 
			xtype: 'grid', 
			store: storeImmList,
			stripeRows: true,
			frame: false,
			viewConfig: {forceFit: true}, // this is the option which will force the grid to the width of the containing panel
			sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
			// Event handler for the data grid
			listeners: {
				rowclick: function(grid, rowIndex, e) {// Single click to select the record, and copy the variables
					rowContent = grid.getStore().getAt(rowIndex);
					grid.editImmu.enable();
					grid.deleteImmu.enable();
					// --------------------------------------------------------------------------
					// Copy the values of the GRID and push it into the immunization form
					// --------------------------------------------------------------------------
					Ext.getCmp('action').setValue( 'save' );
					Ext.getCmp('id').setValue( rowContent.get('id') );
					Ext.getCmp('form_immunization_id').setValue( rowContent.get('immunization_id') );
					Ext.getCmp('cmb_administered_by_id').setValue( rowContent.get('administered_by_id') );
					Ext.getCmp('administered_date').setValue( rowContent.get('date') );
					Ext.getCmp('manufacturer').setValue( rowContent.get('manufacturer') );
					Ext.getCmp('lotnumber').setValue( rowContent.get('lotnumber') );
					Ext.getCmp('administered_by').setValue( rowContent.get('administered_by') );
					Ext.getCmp('education_date').setValue( rowContent.get('education_date') );
					Ext.getCmp('vis_date').setValue( rowContent.get('vis_date') );
					Ext.getCmp('note').setValue( rowContent.get('note') );
				},
				rowdblclick:  function(grid, rowIndex, e) { // Double click to select the record, copy vars, and edit record
					rowContent = grid.getStore().getAt(rowIndex);
					grid.editImmu.enable();
					grid.deleteImmu.enable();
					// --------------------------------------------------------------------------
					// Copy the values of the GRID and push it into the immunization form
					// --------------------------------------------------------------------------
					Ext.getCmp('action').setValue( 'save' );
					Ext.getCmp('id').setValue( rowContent.get('id') );
					Ext.getCmp('form_immunization_id').setValue( rowContent.get('immunization_id') );
					Ext.getCmp('cmb_administered_by_id').setValue( rowContent.get('administered_by_id') );
					Ext.getCmp('administered_date').setValue( rowContent.get('date') );
					Ext.getCmp('manufacturer').setValue( rowContent.get('manufacturer') );
					Ext.getCmp('lotnumber').setValue( rowContent.get('lotnumber') );
					Ext.getCmp('administered_by').setValue( rowContent.get('administered_by') );
					Ext.getCmp('education_date').setValue( rowContent.get('education_date') );
					Ext.getCmp('vis_date').setValue( rowContent.get('vis_date') );
					Ext.getCmp('note').setValue( rowContent.get('note') );
					mode='edit';
					winImmunization.show();
				}
			},
			columns: [
				{ header: 'id', sortable: false, dataIndex: 'id', hidden: true},
				{ header: 'immunization_id', sortable: false, dataIndex: 'immunization_id', hidden: true},
				{ header: 'administered_date', sortable: false, dataIndex: 'administered_date', hidden: true},
				{ header: 'administered_by_id', sortable: false, dataIndex: 'administered_by_id', hidden: true},
				{ header: 'vis_date', sortable: false, dataIndex: 'vis_date', hidden: true},
				{ width: 200, header: '<?php echo htmlspecialchars( xl('Vaccine'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'vaccine' },
				{ header: '<?php echo htmlspecialchars( xl('Date'), ENT_NOQUOTES); ?>', xtype: 'datecolumn', format: 'Y-m-d', sortable: true, dataIndex: 'create_date' },
				{ header: '<?php echo htmlspecialchars( xl('Manufacturer'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'manufacturer' },
				{ header: '<?php echo htmlspecialchars( xl('Lot Number'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'lot_number' },
				{ header: '<?php echo htmlspecialchars( xl('Administered By'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'administered_by' },
				{ header: '<?php echo htmlspecialchars( xl('Education Date'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'education_date' },
				{ header: '<?php echo htmlspecialchars( xl('Note'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'note' }
			],
			// *************************************************************************************
			// Grid Menu
			// *************************************************************************************
			tbar: [{
				xtype:'button',
				id: 'addnew',
				text: '<?php xl("Add new immunization", 'e'); ?>',
				iconCls: 'icoInjection',
				handler: function(){ 
					// --------------------------------------------------------------------------
					// Clear the form, for a new record
					// --------------------------------------------------------------------------
					Ext.getCmp('action').setValue('add');
					Ext.getCmp('id').setValue(null);
					Ext.getCmp('form_immunization_id').setValue(null);
					Ext.getCmp('cmb_administered_by_id').setValue(null);					
					Ext.getCmp('administered_date').setValue(null);
					Ext.getCmp('manufacturer').setValue(null);
					Ext.getCmp('lotnumber').setValue(null);
					Ext.getCmp('administered_by').setValue(null);
					Ext.getCmp('education_date').setValue(null);
					Ext.getCmp('vis_date').setValue(null);
					Ext.getCmp('note').setValue(null);
					winImmunization.show(); 
				}
			},'-',{
				xtype:'button',
				ref: '../editImmu',
				text: '<?php xl("Edit Immunization", 'e'); ?>',
				iconCls: 'edit',
				disabled: true,
				handler: function(){ mode='edit'; winImmunization.show(); }
			},'-',{ 
				// *************************************************************************************
				// Confirmation NOTICE! 
				// Delete Record
				// *************************************************************************************
				xtype:'button', 
				ref: '../deleteImmu',
				text: '<?php xl("Delete Immunization", 'e'); ?>',
				iconCls: 'delete',
				disabled: true,
				handler: function(){
					Ext.Msg.show({
						title: '<?php xl("Please confirm...", 'e'); ?>', 
						icon: Ext.MessageBox.QUESTION,
						msg:'<?php xl("Are you sure to delete this record?<br>With the vaccine: ", 'e'); ?>' + rowContent.get('vaccine'),
						buttons: Ext.Msg.YESNO,
						fn:function(btn){
					        if(btn=='yes'){
								// --------------------------------------------------------------------------
								// This creates a dynamic form on the fly
								// via JavaScript
								// --------------------------------------------------------------------------
								var myForm = document.createElement("form");
								myForm.method="post" ;
								var myInput = document.createElement("input");
								myInput.setAttribute("name", 'id');
								myInput.setAttribute("value", rowContent.get('id'));
								myForm.appendChild(myInput) ;
								var myInput = document.createElement("input");
								myInput.setAttribute("name", 'action');
								myInput.setAttribute("value",'delete');
								myForm.appendChild(myInput) ;
								document.body.appendChild(myForm) ;
								myForm.submit() ;
								document.body.removeChild(myForm) ;
			    	    	}
						}
					});
				}
			}], // END TOPBAR
			plugins: [new Ext.ux.grid.Search({
				mode: 'local',
				iconCls: false,
				deferredRender:false,
				dateFormat:'m/d/Y',
				minLength:4,
				align:'left',
				width: 250,
				disableIndexes: ['id', 'immunization_id', 'administered_date', 'administered_by_id', 'vis_date'],
				position: 'top'
			})]	
		}
	]
}); // END VIEWPORT

}); // END EXTJS
</script>
</head>
<body class="ext-gecko ext-gecko2 x-border-layout-ct">
</body>
