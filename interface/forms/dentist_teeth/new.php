<?php
// 
// Dentist Dental Chart Form (Primary Tooth, Adult Tooth)
// v0.0.1
// Copyright by IdeasGroup, Inc in 2010
// All rights reserved.
// 

// ****************************************************************************************************
// Load libraries
// ****************************************************************************************************
include_once("../../registry.php");
include_once("$srcdir/acl.inc.php");
formHeader("Form: dentist_teeth");

// ****************************************************************************************************
// Return page
// ****************************************************************************************************
$returnurl = $GLOBALS['concurrent_layout'] ? 'encounter_top.php' : 'patient_encounter.php';

// ****************************************************************************************************
// Get the users name
// ****************************************************************************************************
$provider_results = sqlQuery("SELECT fname, lname FROM users WHERE username='" . $_SESSION{"authUser"} . "'");

// ****************************************************************************************************
// name of this form
// ****************************************************************************************************
$form_name = "dentist_teeth"; 

// *************************************************************************************
// Dental Chart Data for grid
// *************************************************************************************
$sql = "SELECT
			*
		FROM
			dentist_teeth
		WHERE pid = '" . $pid . "'";
$result = sqlStatement($sql);
while ($row = sqlFetchArray($result)) {
	$count = 0;
	if ($row['child_adult'] == 0){ $ca = "Adult"; } elseif ( $row['child_adult'] == 1){ $ca = "Infant"; }
	if ($row['teA'] <> ''){ $count++; }
	if ($row['teB'] <> ''){ $count++; }
	if ($row['teC'] <> ''){ $count++; }
	if ($row['teD'] <> ''){ $count++; }
	if ($row['teE'] <> ''){ $count++; }
	if ($row['teF'] <> ''){ $count++; }
	if ($row['teG'] <> ''){ $count++; }
	if ($row['teH'] <> ''){ $count++; }
	if ($row['teI'] <> ''){ $count++; }
	if ($row['teJ'] <> ''){ $count++; }
	if ($row['teK'] <> ''){ $count++; }
	if ($row['teL'] <> ''){ $count++; }
	if ($row['teM'] <> ''){ $count++; }
	if ($row['teN'] <> ''){ $count++; }
	if ($row['teO'] <> ''){ $count++; }
	if ($row['teP'] <> ''){ $count++; }
	if ($row['teQ'] <> ''){ $count++; }
	if ($row['teR'] <> ''){ $count++; }
	if ($row['teS'] <> ''){ $count++; }
	if ($row['teD'] <> ''){ $count++; }
	if ($row['teS'] <> ''){ $count++; }
	if ($row['teT'] <> ''){ $count++; }
	if ($row['te1'] <> ''){ $count++; }
	if ($row['te2'] <> ''){ $count++; }
	if ($row['te3'] <> ''){ $count++; }
	if ($row['te4'] <> ''){ $count++; }
	if ($row['te5'] <> ''){ $count++; }
	if ($row['te6'] <> ''){ $count++; }
	if ($row['te7'] <> ''){ $count++; }
	if ($row['te8'] <> ''){ $count++; }
	if ($row['te9'] <> ''){ $count++; }
	if ($row['te10'] <> ''){ $count++; }
	if ($row['te11'] <> ''){ $count++; }
	if ($row['te12'] <> ''){ $count++; }
	if ($row['te13'] <> ''){ $count++; }
	if ($row['te14'] <> ''){ $count++; }
	if ($row['te15'] <> ''){ $count++; }
	if ($row['te16'] <> ''){ $count++; }
	if ($row['te17'] <> ''){ $count++; }
	if ($row['te18'] <> ''){ $count++; }
	if ($row['te19'] <> ''){ $count++; }
	if ($row['te20'] <> ''){ $count++; }
	if ($row['te21'] <> ''){ $count++; }
	if ($row['te22'] <> ''){ $count++; }
	if ($row['te23'] <> ''){ $count++; }
	if ($row['te24'] <> ''){ $count++; }
	if ($row['te25'] <> ''){ $count++; }
	if ($row['te26'] <> ''){ $count++; }
	if ($row['te27'] <> ''){ $count++; }
	if ($row['te28'] <> ''){ $count++; }
	if ($row['te29'] <> ''){ $count++; }
	if ($row['te30'] <> ''){ $count++; }
	if ($row['te31'] <> ''){ $count++; }
	if ($row['te32'] <> ''){ $count++; }
	$buff .= "['" . htmlspecialchars( $row["id"], ENT_NOQUOTES) . "'," .
				"'" . $row['pid'] . "',".
				"'" . $ca . "',".
				"'" . $row['date'] . "',".
				"'" . $count . "'],".chr(13);
}
$dcfList = substr($buff, 0, -2); // Delete the last comma.

?>
<html><head>
<script type="text/javascript" src="../../../library/ext-3.3.0/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="../../../library/ext-3.3.0/ext-all.js"></script>

<link rel="stylesheet" type="text/css" href="../../../library/ext-3.3.0/resources/css/ext-all.css">
<link rel="stylesheet" type="text/css" href="../../../library/ext-3.3.0/examples/form/forms.css">
<link rel="stylesheet" type="text/css" href="../../../library/ext-3.3.0/examples/samples.css">

<link rel="stylesheet" type="text/css" href="../../../interface/themes/style_newui.css" >

<script type="text/javascript">
Ext.onReady(function(){

Ext.QuickTips.init();

// *************************************************************************************
// Define Global Variables
// *************************************************************************************
var rowContent;

// *************************************************************************************
// The Grid's Data
// The data, can be declared before the actual field is rendered.
// *************************************************************************************
var list_DCF = [ <?php echo $dcfList; ?> ];

// *************************************************************************************
// Dental Chart Grid data structure
// *************************************************************************************
var storeDCF = new Ext.data.ArrayStore({
		fields: [
			{name: 'id'},
			{name: 'pid'},
			{name: 'child_adult'},
			{name: 'date_created', type: 'date'},
			{name: 'no_notes'},
		]
});
storeDCF.loadData(list_DCF);

// *************************************************************************************
// Create the Viewport
// *************************************************************************************
var viewport = new Ext.Viewport({
    layout:'fit',
	forceLayout: true,
	renderTo: document.body,
	items:[
		// *************************************************************************************
		// Render the GridPanel
		// *************************************************************************************
		{ 
			title: '<?php xl("Dental Patient Chart List", 'e'); ?>', 
			xtype: 'grid', 
			store: storeDCF,
			stripeRows: true,
			frame: false,
			viewConfig: {forceFit: true}, // this is the option which will force the grid to the width of the containing panel
			sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
			// Event handler for the data grid
			listeners: {
				rowclick: function(grid, rowIndex, e) {// Single click to select the record
					grid.editDental.enable();
					grid.delDental.enable();
					rowContent = grid.getStore().getAt(rowIndex);
				}
			},
			columns: [
				{ header: 'id', sortable: false, dataIndex: 'id', hidden: true},
				{ header: 'pid', sortable: false, dataIndex: 'immunization_id', hidden: true},
				{ header: '<?php echo htmlspecialchars( xl('Child/Adult'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'child_adult' },
				{ header: '<?php echo htmlspecialchars( xl('Date Created'), ENT_NOQUOTES); ?>', xtype: 'datecolumn', format: 'Y-m-d', sortable: true, dataIndex: 'date_created' },
				{ header: '<?php echo htmlspecialchars( xl('Number of Notes on teeth'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'no_notes' }
			],
			// *************************************************************************************
			// Grid Menu
			// *************************************************************************************
			tbar: [{
				xtype:'button',
				id: 'addnew',
				text: '<?php xl("Add Dental Form", 'e'); ?>',
				iconCls: 'document',
				handler: function(button, event){ location.href='<?php echo $rootdir."/forms/".$form_name; ?>/view.php'; }
			},'-',{
				xtype:'button',
				id: 'edit',
				ref: '../editDental',
				text: '<?php xl("Edit", 'e'); ?>',
				iconCls: 'edit',
				disabled: true,
				handler: function(button, event){  }
			},'-',{
				xtype:'button',
				id: 'delete',
				ref: '../delDental',
				text: '<?php xl("Delete", 'e'); ?>',
				iconCls: 'delete',
				disabled: true,
				handler: function(){
					Ext.Msg.show({
						title: '<?php xl("Please confirm...", 'e'); ?>', 
						icon: Ext.MessageBox.QUESTION,
						msg:'<?php xl("Are you sure to delete this dental chart record?<br>", 'e'); ?>',
						buttons: Ext.Msg.YESNO,
						fn:function(btn){
					        if(btn=='yes'){
								// --------------------------------------------------------------------------
								// This creates a dynamic form on the fly
								// via JavaScript
								// --------------------------------------------------------------------------
								var myForm = document.createElement("form");
								myForm.method="POST" ;
								var myInput = document.createElement("input");
								myInput.setAttribute("name", 'id');
								myInput.setAttribute("value", rowContent.get('id'));
								myForm.appendChild(myInput) ;
								var myInput = document.createElement("input");
								myInput.setAttribute("name", 'task');
								myInput.setAttribute("value",'delete');
								myForm.appendChild(myInput) ;
								document.body.appendChild(myForm) ;
								myForm.submit() ;
								document.body.removeChild(myForm) ;
			    	    	}
						}
					});
				}
			}]
		}
	]// End Grid
}); // End ViewPort

}); // End ExtJS
</script>
</head>
<body class="ext-gecko ext-gecko2 x-border-layout-ct">
</body>
