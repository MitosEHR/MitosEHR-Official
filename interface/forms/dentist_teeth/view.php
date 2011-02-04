<?php
// 
// Dentist Dental Chart Form (Primary Tooth, Adult Tooth)
// v0.0.2
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
$returnurl = $GLOBALS['concurrent_layout'] ? 'view.php' : 'patient_encounter.php';

// ****************************************************************************************************
// Get the users name
// ****************************************************************************************************
$provider_results = sqlQuery("SELECT fname, lname FROM users WHERE username='" . $_SESSION{"authUser"} . "'");

// ****************************************************************************************************
// Name of this form
// ****************************************************************************************************
$form_name = "dentist_teeth"; 

// ****************************************************************************************************
// Get the record from the database
// ****************************************************************************************************
if ($_GET['id'] != "") $obj = formFetch($form_name, $_GET["id"]);

// ****************************************************************************************************
// remove the time-of-day from the date fields
// ****************************************************************************************************
if ($obj['date_of_signature'] != "") {
    $dateparts = split(" ", $obj['date_of_signature']);
    $obj['date_of_signature'] = $dateparts[0];
}

// ****************************************************************************************************
// Type of Diagram for ComboBox
// ****************************************************************************************************
$cmb_dType = " [ 0, '" . htmlspecialchars( 'Permanent', ENT_NOQUOTES) . "'],". chr(13);
$cmb_dType .= " [ 1, '" . htmlspecialchars( 'Primary', ENT_NOQUOTES) . "']". chr(13);

?>
<html>
<head>
<style type="text/css">
.frmReset{
	background-image: url(image/ico_form-reset.png) !important;
}
</style>

<script type="text/javascript" src="../../../library/ext-3.3.0/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="../../../library/ext-3.3.0/ext-all.js"></script>

<link rel="stylesheet" type="text/css" href="../../../library/ext-3.3.0/resources/css/ext-all.css">
<link rel="stylesheet" type="text/css" href="../../../interface/themes/style_newui.css" >

<script type="text/javascript">

Ext.onReady(function(){

Ext.QuickTips.init();

// *************************************************************************************
// Structure and load the data for cmb_dType
// *************************************************************************************
var dType_Data = [ <?php echo $cmb_dType; ?> ];
var dTypeData = new Ext.data.ArrayStore({
	id: 'id',
	fields: [ 'id', 'type' ],
	data: dType_Data
});

// *************************************************************************************
// Panel for showing the dental diagram
// *************************************************************************************
var dentalDiagram = new Ext.Panel({
	title: '<?php echo htmlspecialchars( xl('Diagram'), ENT_NOQUOTES); ?>',
	region: 'west',
	width: 385,
	maxSize: 385,
	minSize: 385,
	margins:'3 0 3 3',
	cmargins:'3 3 3 3',
	id: 'diagram',
	split:true,
	html: '<div id="dChart"><?php echo str_replace(chr(10), " ", file_get_contents('permanentMap.html.php', true) ); ?></div>',
	tbar:['<?php xl("Select a diagram", 'e'); ?>:',{
		xtype: 'combo',
		name: 'cmb_dType',
		id: 'cmbdType',
		editable: false,
		triggerAction: 'all',
		mode: 'local',
		store: dTypeData,
		valueField: 'id',
		hiddenName: 'cmb_dType',
		displayField: 'type',
		forceSelection: true,
		value: 0,
		listeners:{select:{fn:function(combo, value) {
					var val = combo.getValue();
					if ( val == 0){ // Adult Teeth Chart Load
						Ext.getCmp('fsI').hide();
						Ext.getCmp('fsA').show();
						Ext.getCmp('te1').setValue(null); Ext.getCmp('te2').setValue(null);
						Ext.getCmp('te3').setValue(null); Ext.getCmp('te4').setValue(null);
						Ext.getCmp('te5').setValue(null); Ext.getCmp('te6').setValue(null);
						Ext.getCmp('te7').setValue(null); Ext.getCmp('te8').setValue(null);
						Ext.getCmp('te9').setValue(null); Ext.getCmp('te10').setValue(null);
						Ext.getCmp('te11').setValue(null); Ext.getCmp('te12').setValue(null);
						Ext.getCmp('te13').setValue(null); Ext.getCmp('te14').setValue(null);
						Ext.getCmp('te15').setValue(null); Ext.getCmp('te16').setValue(null);
						Ext.getCmp('te17').setValue(null); Ext.getCmp('te18').setValue(null);
						Ext.getCmp('te19').setValue(null); Ext.getCmp('te20').setValue(null);
						Ext.getCmp('te21').setValue(null); Ext.getCmp('te22').setValue(null);
						Ext.getCmp('te23').setValue(null); Ext.getCmp('te24').setValue(null);
						Ext.getCmp('te25').setValue(null); Ext.getCmp('te26').setValue(null);
						Ext.getCmp('te27').setValue(null); Ext.getCmp('te28').setValue(null);
						Ext.getCmp('te29').setValue(null); Ext.getCmp('te30').setValue(null);
						Ext.getCmp('te31').setValue(null); Ext.getCmp('te32').setValue(null);
						Ext.getCmp('child_adult').setValue(0);
						document.getElementById("dChart").innerHTML = '<?php echo str_replace(chr(10), " ", file_get_contents('permanentMap.html.php', true) ); ?>';
					}
					if ( val == 1){ // Infant Teeth Chart Load
						Ext.getCmp('fsA').hide();
						Ext.getCmp('fsI').show();
						Ext.getCmp('teA').setValue(null); Ext.getCmp('teB').setValue(null);
						Ext.getCmp('teC').setValue(null); Ext.getCmp('teD').setValue(null);
						Ext.getCmp('teE').setValue(null); Ext.getCmp('teF').setValue(null);
						Ext.getCmp('teG').setValue(null); Ext.getCmp('teH').setValue(null);
						Ext.getCmp('teI').setValue(null); Ext.getCmp('teJ').setValue(null);
						Ext.getCmp('teK').setValue(null); Ext.getCmp('teL').setValue(null);
						Ext.getCmp('teM').setValue(null); Ext.getCmp('teN').setValue(null);
						Ext.getCmp('teO').setValue(null); Ext.getCmp('teP').setValue(null);
						Ext.getCmp('teQ').setValue(null); Ext.getCmp('teR').setValue(null);
						Ext.getCmp('teS').setValue(null); Ext.getCmp('teT').setValue(null);
						Ext.getCmp('child_adult').setValue(1);
						document.getElementById("dChart").innerHTML = '<?php echo str_replace(chr(10), " ", file_get_contents('infantMap.html.php', true) ); ?>'; 
					}
			}}}
	}]
}); // End dentalDiagram

// *************************************************************************************
// Panel for  showing the fields of the teeths
// *************************************************************************************
var fieldsPanel = new Ext.FormPanel({
	title: '<?php xl("Dental Form", 'e'); ?>', 
	region: 'center',
	border: true,
	margins:'3 0 3 3',
	autoScroll: true, 
	url: 'save.php',
	id: 'frmDental',
	bodyStyle: 'padding: 5px',
	formBind: true,
	method: 'POST',
	defaults: {anchor: '95%'},
	buttonAlign: 'left',
	labelAlign: 'top',
	standardSubmit: true,
	items: [
		{ xtype:'fieldset', // Adult
			title: 'Adult Teeth',
			autoHeight:true,
			defaults: {anchor: '95%'},
			id: 'fsA',
			items :[
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'te1', name: 'te1', fieldLabel: '<?php echo htmlspecialchars( xl('Adult Teeth 1'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'te2', name: 'te2', fieldLabel: '<?php echo htmlspecialchars( xl('Adult Teeth 2'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'te3', name: 'te3', fieldLabel: '<?php echo htmlspecialchars( xl('Adult Teeth 3'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'te4', name: 'te4', fieldLabel: '<?php echo htmlspecialchars( xl('Adult Teeth 4'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'te5', name: 'te5', fieldLabel: '<?php echo htmlspecialchars( xl('Adult Teeth 5'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'te6', name: 'te6', fieldLabel: '<?php echo htmlspecialchars( xl('Adult Teeth 6'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'te7', name: 'te7', fieldLabel: '<?php echo htmlspecialchars( xl('Adult Teeth 7'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'te8', name: 'te8', fieldLabel: '<?php echo htmlspecialchars( xl('Adult Teeth 8'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'te9', name: 'te9', fieldLabel: '<?php echo htmlspecialchars( xl('Adult Teeth 9'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'te10', name: 'te10', fieldLabel: '<?php echo htmlspecialchars( xl('Adult Teeth 10'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'te11', name: 'te11', fieldLabel: '<?php echo htmlspecialchars( xl('Adult Teeth 11'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'te12', name: 'te12', fieldLabel: '<?php echo htmlspecialchars( xl('Adult Teeth 12'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'te13', name: 'te13', fieldLabel: '<?php echo htmlspecialchars( xl('Adult Teeth 13'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'te14', name: 'te14', fieldLabel: '<?php echo htmlspecialchars( xl('Adult Teeth 14'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'te15', name: 'te15', fieldLabel: '<?php echo htmlspecialchars( xl('Adult Teeth 15'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'te16', name: 'te16', fieldLabel: '<?php echo htmlspecialchars( xl('Adult Teeth 16'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'te17', name: 'te17', fieldLabel: '<?php echo htmlspecialchars( xl('Adult Teeth 17'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'te18', name: 'te18', fieldLabel: '<?php echo htmlspecialchars( xl('Adult Teeth 18'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'te19', name: 'te19', fieldLabel: '<?php echo htmlspecialchars( xl('Adult Teeth 19'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'te20', name: 'te20', fieldLabel: '<?php echo htmlspecialchars( xl('Adult Teeth 20'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'te21', name: 'te21', fieldLabel: '<?php echo htmlspecialchars( xl('Adult Teeth 21'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'te22', name: 'te22', fieldLabel: '<?php echo htmlspecialchars( xl('Adult Teeth 22'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'te23', name: 'te23', fieldLabel: '<?php echo htmlspecialchars( xl('Adult Teeth 23'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'te24', name: 'te24', fieldLabel: '<?php echo htmlspecialchars( xl('Adult Teeth 24'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'te25', name: 'te25', fieldLabel: '<?php echo htmlspecialchars( xl('Adult Teeth 25'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'te26', name: 'te26', fieldLabel: '<?php echo htmlspecialchars( xl('Adult Teeth 26'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'te27', name: 'te27', fieldLabel: '<?php echo htmlspecialchars( xl('Adult Teeth 27'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'te28', name: 'te28', fieldLabel: '<?php echo htmlspecialchars( xl('Adult Teeth 28'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'te29', name: 'te29', fieldLabel: '<?php echo htmlspecialchars( xl('Adult Teeth 29'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'te30', name: 'te30', fieldLabel: '<?php echo htmlspecialchars( xl('Adult Teeth 30'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'te31', name: 'te31', fieldLabel: '<?php echo htmlspecialchars( xl('Adult Teeth 31'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'te32', name: 'te32', fieldLabel: '<?php echo htmlspecialchars( xl('Adult Teeth 32'), ENT_NOQUOTES); ?>' }
			]},
		{ xtype:'fieldset', // Infant
			title: 'Infant Teeth',
			autoHeight:true,
			defaults: {anchor: '95%'},
			id: 'fsI',
			items :[
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'teA', name: 'teA', fieldLabel: '<?php echo htmlspecialchars( xl('Infant Teeth A'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'teB', name: 'teB', fieldLabel: '<?php echo htmlspecialchars( xl('Infant Teeth B'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'teC', name: 'teC', fieldLabel: '<?php echo htmlspecialchars( xl('Infant Teeth C'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'teD', name: 'teD', fieldLabel: '<?php echo htmlspecialchars( xl('Infant Teeth D'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'teE', name: 'teE', fieldLabel: '<?php echo htmlspecialchars( xl('Infant Teeth E'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'teF', name: 'teF', fieldLabel: '<?php echo htmlspecialchars( xl('Infant Teeth F'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'teG', name: 'teG', fieldLabel: '<?php echo htmlspecialchars( xl('Infant Teeth G'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'teH', name: 'teH', fieldLabel: '<?php echo htmlspecialchars( xl('Infant Teeth H'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'teI', name: 'teI', fieldLabel: '<?php echo htmlspecialchars( xl('Infant Teeth I'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'teJ', name: 'teJ', fieldLabel: '<?php echo htmlspecialchars( xl('Infant Teeth J'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'teK', name: 'teK', fieldLabel: '<?php echo htmlspecialchars( xl('Infant Teeth K'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'teL', name: 'teL', fieldLabel: '<?php echo htmlspecialchars( xl('Infant Teeth L'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'teM', name: 'teM', fieldLabel: '<?php echo htmlspecialchars( xl('Infant Teeth M'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'teN', name: 'teN', fieldLabel: '<?php echo htmlspecialchars( xl('Infant Teeth N'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'teO', name: 'teO', fieldLabel: '<?php echo htmlspecialchars( xl('Infant Teeth O'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'teP', name: 'teP', fieldLabel: '<?php echo htmlspecialchars( xl('Infant Teeth P'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'teQ', name: 'teQ', fieldLabel: '<?php echo htmlspecialchars( xl('Infant Teeth Q'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'teR', name: 'teR', fieldLabel: '<?php echo htmlspecialchars( xl('Infant Teeth R'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'teS', name: 'teS', fieldLabel: '<?php echo htmlspecialchars( xl('Infant Teeth S'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', hideParent: true, hidden: true, id: 'teT', name: 'teT', fieldLabel: '<?php echo htmlspecialchars( xl('Infant Teeth T'), ENT_NOQUOTES); ?>' }
			]},
		{ xtype: 'textfield', id: 'task', hidden: true, name: 'task', value: 'save' },
		{ xtype: 'textfield', id: 'child_adult', hidden: true, name: 'child_adult', value: '0' }
	],
	tbar:[{
		text:'<?php echo htmlspecialchars( xl('Save'), ENT_NOQUOTES); ?>',
		iconCls: 'save',
		formBind: true,
		handler: function() { Ext.getCmp('frmDental').getForm().submit(); }
	},'-',{
		text:'<?php echo htmlspecialchars( xl('Reset'), ENT_NOQUOTES); ?>',
		iconCls: 'frmReset',
		formBind: true,
		handler: function() { 
			// Clear values from adult form
			Ext.getCmp('te1').setValue(null); Ext.getCmp('te2').setValue(null);
			Ext.getCmp('te3').setValue(null); Ext.getCmp('te4').setValue(null);
			Ext.getCmp('te5').setValue(null); Ext.getCmp('te6').setValue(null);
			Ext.getCmp('te7').setValue(null); Ext.getCmp('te8').setValue(null);
			Ext.getCmp('te9').setValue(null); Ext.getCmp('te10').setValue(null);
			Ext.getCmp('te11').setValue(null); Ext.getCmp('te12').setValue(null);
			Ext.getCmp('te13').setValue(null); Ext.getCmp('te14').setValue(null);
			Ext.getCmp('te15').setValue(null); Ext.getCmp('te16').setValue(null);
			Ext.getCmp('te17').setValue(null); Ext.getCmp('te18').setValue(null);
			Ext.getCmp('te19').setValue(null); Ext.getCmp('te20').setValue(null);
			Ext.getCmp('te21').setValue(null); Ext.getCmp('te22').setValue(null);
			Ext.getCmp('te23').setValue(null); Ext.getCmp('te24').setValue(null);
			Ext.getCmp('te25').setValue(null); Ext.getCmp('te26').setValue(null);
			Ext.getCmp('te27').setValue(null); Ext.getCmp('te28').setValue(null);
			Ext.getCmp('te29').setValue(null); Ext.getCmp('te30').setValue(null);
			Ext.getCmp('te31').setValue(null); Ext.getCmp('te32').setValue(null);
			// Clear values from infant form
			Ext.getCmp('teA').setValue(null); Ext.getCmp('teB').setValue(null);
			Ext.getCmp('teC').setValue(null); Ext.getCmp('teD').setValue(null);
			Ext.getCmp('teE').setValue(null); Ext.getCmp('teF').setValue(null);
			Ext.getCmp('teG').setValue(null); Ext.getCmp('teH').setValue(null);
			Ext.getCmp('teI').setValue(null); Ext.getCmp('teJ').setValue(null);
			Ext.getCmp('teK').setValue(null); Ext.getCmp('teL').setValue(null);
			Ext.getCmp('teM').setValue(null); Ext.getCmp('teN').setValue(null);
			Ext.getCmp('teO').setValue(null); Ext.getCmp('teP').setValue(null);
			Ext.getCmp('teQ').setValue(null); Ext.getCmp('teR').setValue(null);
			Ext.getCmp('teS').setValue(null); Ext.getCmp('teT').setValue(null);
			// Hide fields for adult
			Ext.getCmp('te1').hide(); Ext.getCmp('te2').hide();
			Ext.getCmp('te3').hide(); Ext.getCmp('te4').hide();
			Ext.getCmp('te5').hide(); Ext.getCmp('te6').hide();
			Ext.getCmp('te7').hide(); Ext.getCmp('te8').hide();
			Ext.getCmp('te9').hide(); Ext.getCmp('te10').hide();
			Ext.getCmp('te11').hide(); Ext.getCmp('te12').hide();
			Ext.getCmp('te13').hide(); Ext.getCmp('te14').hide();
			Ext.getCmp('te15').hide(); Ext.getCmp('te16').hide();
			Ext.getCmp('te17').hide(); Ext.getCmp('te18').hide();
			Ext.getCmp('te19').hide(); Ext.getCmp('te20').hide();
			Ext.getCmp('te21').hide(); Ext.getCmp('te22').hide();
			Ext.getCmp('te23').hide(); Ext.getCmp('te24').hide();
			Ext.getCmp('te25').hide(); Ext.getCmp('te26').hide();
			Ext.getCmp('te27').hide(); Ext.getCmp('te28').hide();
			Ext.getCmp('te29').hide(); Ext.getCmp('te30').hide();
			Ext.getCmp('te31').hide(); Ext.getCmp('te32').hide();
			// Hide fields for  infant
			Ext.getCmp('teA').hide(); Ext.getCmp('teB').hide();
			Ext.getCmp('teC').hide(); Ext.getCmp('teD').hide();
			Ext.getCmp('teE').hide(); Ext.getCmp('teF').hide();
			Ext.getCmp('teG').hide(); Ext.getCmp('teH').hide();
			Ext.getCmp('teI').hide(); Ext.getCmp('teJ').hide();
			Ext.getCmp('teK').hide(); Ext.getCmp('teL').hide();
			Ext.getCmp('teM').hide(); Ext.getCmp('teN').hide();
			Ext.getCmp('teO').hide(); Ext.getCmp('teP').hide();
			Ext.getCmp('teQ').hide(); Ext.getCmp('teR').hide();
			Ext.getCmp('teS').hide(); Ext.getCmp('teT').hide();
		}
	},'-',{
		text:'<?php echo htmlspecialchars( xl('Close'), ENT_NOQUOTES); ?>',
		iconCls: 'delete',
		formBind: true,
		handler: function(button, event){ location.href='<?php echo $rootdir."/forms/".$form_name; ?>/new.php'; }
	}],
	listeners:{ afterrender:{fn:function() {
			Ext.getCmp('fsI').hide();
			Ext.getCmp('fsA').show();
	}}}
}); // End fieldsPanel

// *************************************************************************************
// Create the Viewport
// *************************************************************************************
var viewport = new Ext.Viewport({
	layout:'border',
	renderTo: document.body,
	id: 'vpChart',
	items:[dentalDiagram, fieldsPanel]
}); // END ViewPort

}); // END ExtJS
</script>
</head>
<body class="ext-gecko ext-gecko2 x-border-layout-ct">
</body>

