<?php
/*----------------------------------------------------------------------------------------------------
Ambulance Spanish Version
v0.0.1
Copyright by NetMedic in 2010
Developed by IdeasGroup Inc. in 2010
Requierements:
	* Sencha ExtJS v3.2+ 
	* OpenEMR v4.0
	* MySQL Server
----------------------------------------------------------------------------------------------------*/

include_once("../../globals.php");
include_once("$srcdir/api.inc");
formHeader("Form: Ambulance");
$returnurl = $GLOBALS['concurrent_layout'] ? 'encounter_top.php' : 'patient_encounter.php';

// ****************************************************************************************************
// name of this form
// ****************************************************************************************************
$form_name = "Ambulance"; 

// *************************************************************************************
// Get the data from Ambulance
// *************************************************************************************
$sql = "SELECT
			*
		FROM
			form_Ambulance
		WHERE pid = '" . $pid . "'";
$result = sqlStatement($sql);
while ($row = sqlFetchArray($result)) {
	$buff .= "['" . htmlspecialchars( $row["id"], ENT_NOQUOTES) . "'," .
				"'" . $row['date'] . "',".
				"'" . $row['medico'] . "'],". chr(13);
}
$abmList = substr($buff, 0, -2); // Delete the last comma.

?>
<html>
<head>

<script type="text/javascript" src="../../../library/ext-3.3.0/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="../../../library/ext-3.3.0/ext-all.js"></script>

<script type="text/javascript" src="../../../library/ext-3.3.0/plugins/gridsearch/js/Ext.ux.grid.Search.js"></script>
<script type="text/javascript" src="../../../library/ext-3.3.0/plugins/gridsearch/js/Ext.ux.grid.RowActions.js"></script>

<link rel="stylesheet" type="text/css" href="../../../library/ext-3.3.0/resources/css/ext-all.css">

<link rel="stylesheet" type="text/css" href="../../../interface/themes/style_newui.css" >
<link rel="stylesheet" type="text/css" href="../../../interface/forms/Ambulance/css/ambulance.css" >
<script type="text/javascript">

Ext.onReady(function(){

// *************************************************************************************
// Global variables
// *************************************************************************************
var form_id;

Ext.QuickTips.init();

// *************************************************************************************
// The Grid's Data
// The data, can be declared before the actual field is rendered.
// *************************************************************************************
var list_Data = [ <?php echo $abmList; ?> ];

// *************************************************************************************
// Immunizations Grid data structure
// *************************************************************************************
var ambList = new Ext.data.ArrayStore({
		fields: [
			{name: 'id'},
			{name: 'date'},
			{name: 'medico'}
		]
});
ambList.loadData(list_Data);

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
			title: '<?php xl("Ambulance Request List", 'e'); ?>', 
			xtype: 'grid', 
			store: ambList,
			stripeRows: true,
			frame: false,
			viewConfig: {forceFit: true}, // this is the option which will force the grid to the width of the containing panel
			sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
			// Event handler for the data grid
			listeners: {
				rowclick: function(grid, rowIndex, e) {// Single click to select the record, and copy the variables
					rowContent = grid.getStore().getAt(rowIndex);
					grid.viewAmb.enable();
					form_id = rowContent.get('id');
				},
				rowdblclick:  function(grid, rowIndex, e) { // Double click to select the record, copy vars, and edit record
					rowContent = grid.getStore().getAt(rowIndex);
					grid.viewAmb.enable();
					form_id = rowContent.get('id');
					location.href='<?php echo $GLOBALS['webroot']?>/interface/forms/Ambulance/view.php?id='+form_id;
				}
			},
			columns: [
				{ header: 'ID', sortable: false, dataIndex: 'id'},
				{ header: 'Date created', sortable: false, dataIndex: 'date'},
				{ header: 'Medico', sortable: false, dataIndex: 'medico'}
			],
			// *************************************************************************************
			// Grid Menu
			// *************************************************************************************
			tbar: [{
				xtype:'button',
				id: 'addnew',
				text: '<?php xl("Create new request", 'e'); ?>',
				iconCls: 'ambulanceICO',
				handler: function(button, event){ location.href='<?php echo $GLOBALS['webroot']?>/interface/forms/Ambulance/new.php'; }
			},'-',{
				xtype:'button',
				ref: '../viewAmb',
				text: '<?php xl("View request", 'e'); ?>',
				iconCls: 'edit',
				disabled: true,
				handler: function(button, event){ location.href='<?php echo $GLOBALS['webroot']?>/interface/forms/Ambulance/view.php?id='+form_id; }
			}], // END TOPBAR
			plugins: [new Ext.ux.grid.Search({
				mode: 'local',
				iconCls: false,
				deferredRender:false,
				dateFormat:'m/d/Y',
				minLength:4,
				align:'left',
				width: 250,
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