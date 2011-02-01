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

include_once("../../registry.php");
include_once("$srcdir/api.inc");
formHeader("Form: Ambulance");
$returnurl = $GLOBALS['concurrent_layout'] ? 'encounter_top.php' : 'patient_encounter.php';

// ****************************************************************************************************
// name of this form
// ****************************************************************************************************
$form_name = "Ambulance"; 
?>

<html>
<head>

<script type="text/javascript" src="../../../library/ext-3.3.0/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="../../../library/ext-3.3.0/ext-all.js"></script>

<script type="text/javascript" src="../../../library/ext-3.3.0/plugins/spinner/Spinner.js"></script>
<script type="text/javascript" src="../../../library/ext-3.3.0/plugins/spinner/SpinnerField.js"></script>

<link rel="stylesheet" type="text/css" href="../../../library/ext-3.3.0/resources/css/ext-all.css">
<link rel="stylesheet" type="text/css" href="../../../library/ext-3.3.0/plugins/spinner/css/spinner.css" />

<link rel="stylesheet" type="text/css" href="../../../interface/themes/style_newui.css" >
<link rel="stylesheet" type="text/css" href="../../../interface/forms/Ambulance/css/ambulance.css" >
<script type="text/javascript">

Ext.onReady(function(){

Ext.QuickTips.init();

// *************************************************************************************
// Structure and data for Hours
// *************************************************************************************
var day_Data = [ ['am','AM'], ['pm','PM'] ];
var dayData = new Ext.data.ArrayStore({
	id: 'id',
	fields: [ 'id', 'value' ],
	data: day_Data
});

// *************************************************************************************
// Create the Viewport
// *************************************************************************************
var viewport = new Ext.Viewport({
    layout:'fit',
	renderTo: document.body,

	items:[{
		xtype: 'form',
		title: '<?php xl("Ambulancia",'e') ?>',
		id: 'frmAmbulance',
		frame: false,
		url: '<?php echo $rootdir;?>/forms/<?php echo $form_name;?>/save.php?mode=new',
		bodyStyle: 'padding: 5px',
		formBind: true,
		buttonAlign: 'left',
		standardSubmit: true,
		layout:'column',
		autoScroll: true,
		defaults:{
			border: false,
			columnWidth: 0.3,
			layout:'form',
			xtype:'panel',
			bodyStyle:'padding: 5px'
		},
		tbar: [{
			xtype:'button',
			id: 'addnew',
			text: '<?php xl("Save", 'e'); ?>',
			iconCls: 'save',
			handler: function() { Ext.getCmp('frmAmbulance').getForm().submit(); }
		},'-',{
			xtype:'button',
			id: 'list',
			text: '<?php xl("View List", 'e'); ?>',
			iconCls: 'list',
			handler: function(button, event){ location.href='<?php echo $GLOBALS['webroot']?>/interface/forms/Ambulance/list.php'; }
		},'-',{
			xtype:'button',
			id: 'cancel',
			text: '<?php xl("Cancel", 'e'); ?>',
			iconCls: 'delete',
			handler: function(button, event){ location.href='<?php echo $GLOBALS['webroot']?>/interface/patient_file/encounter/<?php echo $returnurl?>'; }
		}],
		items:[{
			xtype: 'fieldset',
			title: '<?php xl("Llamadas 10-69 (Horas/Minutos/AMPM/Millaje)",'e') ?>',
			autoHeight: true,
			layout: 'hbox',
			items:[ // 10-69
				{ xtype: 'spinnerfield', width: 50, minValue: 1, maxValue: 12, decimalPrecision: 1, accelerate: true, name: 'hr1069', fieldLabel: '<?php echo htmlspecialchars( xl('Hora'), ENT_NOQUOTES); ?>' },
				{ xtype: 'spinnerfield', width: 50, minValue: 0, maxValue: 59, decimalPrecision: 1, accelerate: true, name: 'mn1069', fieldLabel: '<?php echo htmlspecialchars( xl('Minutos'), ENT_NOQUOTES); ?>' },
				{ xtype: 'combo', width: 50, name: 'ampm1069', fieldLabel: '<?php echo htmlspecialchars( xl('AM / PM'), ENT_NOQUOTES); ?>', editable: false, triggerAction: 'all', mode: 'local', valueField: 'id', displayField: 'value', store: dayData },
				{ xtype: 'textfield', name: 'mill1069', fieldLabel: '<?php echo htmlspecialchars( xl('Millas'), ENT_NOQUOTES); ?>' }
			]
		},{
			xtype: 'fieldset',
			title: '<?php xl("Respuesta 10-70 (Horas/Minutos/AMPM/Millaje)",'e') ?>',
			autoHeight: true,
			layout: 'hbox',
			items:[ // 10-70
				{ xtype: 'spinnerfield', width: 50, minValue: 1, maxValue: 12, decimalPrecision: 1, accelerate: true, name: 'hr1070', fieldLabel: '<?php echo htmlspecialchars( xl('Hora'), ENT_NOQUOTES); ?>' },
				{ xtype: 'spinnerfield', width: 50, minValue: 0, maxValue: 59, decimalPrecision: 1, accelerate: true, name: 'mn1070', fieldLabel: '<?php echo htmlspecialchars( xl('Minuto'), ENT_NOQUOTES); ?>' },
				{ xtype: 'combo', width: 50, name: 'ampm1070', fieldLabel: '<?php echo htmlspecialchars( xl('AM / PM'), ENT_NOQUOTES); ?>', editable: false, triggerAction: 'all', mode: 'local', hiddenName: 'value', displayField: 'value', store: dayData },
				{ xtype: 'textfield', name: 'mill1070', fieldLabel: '<?php echo htmlspecialchars( xl('Millas'), ENT_NOQUOTES); ?>' }
			]
		},{
			xtype: 'fieldset',
			title: '<?php xl("Respuesta 10-71 (Horas/Minutos/AMPM/Millaje)",'e') ?>',
			autoHeight: true,
			layout: 'hbox',
			items:[ // 10-71
				{ xtype: 'spinnerfield', width: 50, minValue: 1, maxValue: 12, decimalPrecision: 1, accelerate: true, name: 'hr1071', fieldLabel: '<?php echo htmlspecialchars( xl('Hora'), ENT_NOQUOTES); ?>' },
				{ xtype: 'spinnerfield', width: 50, minValue: 0, maxValue: 59, decimalPrecision: 1, accelerate: true, name: 'mn1071', fieldLabel: '<?php echo htmlspecialchars( xl('Minuto'), ENT_NOQUOTES); ?>' },
				{ xtype: 'combo', width: 50, name: 'ampm1071', fieldLabel: '<?php echo htmlspecialchars( xl('AM / PM'), ENT_NOQUOTES); ?>', editable: false, triggerAction: 'all', mode: 'local', hiddenName: 'value', displayField: 'value', store: dayData },
				{ xtype: 'textfield', name: 'mill1071', fieldLabel: '<?php echo htmlspecialchars( xl('Millas'), ENT_NOQUOTES); ?>' }
			]
		},{
			xtype: 'fieldset',
			title: '<?php xl("Respuesta 10-72 (Horas/Minutos/AMPM/Millaje)",'e') ?>',
			autoHeight: true,
			layout: 'hbox',
			items:[ // 10-72
				{ xtype: 'spinnerfield', width: 50, minValue: 1, maxValue: 12, decimalPrecision: 1, accelerate: true, name: 'hr1072', fieldLabel: '<?php echo htmlspecialchars( xl('Hora'), ENT_NOQUOTES); ?>' },
				{ xtype: 'spinnerfield', width: 50, minValue: 0, maxValue: 59, decimalPrecision: 1, accelerate: true, name: 'mn1072', fieldLabel: '<?php echo htmlspecialchars( xl('Minuto'), ENT_NOQUOTES); ?>' },
				{ xtype: 'combo', width: 50, name: 'ampm1072', fieldLabel: '<?php echo htmlspecialchars( xl('AM / PM'), ENT_NOQUOTES); ?>', editable: false, triggerAction: 'all', mode: 'local', hiddenName: 'value', displayField: 'value', store: dayData },
				{ xtype: 'textfield', name: 'mill1072', fieldLabel: '<?php echo htmlspecialchars( xl('Millas'), ENT_NOQUOTES); ?>' }
			]
		},{
			xtype: 'fieldset',
			title: '<?php xl("Respuesta 10-73 (Horas/Minutos/AMPM/Millaje)",'e') ?>',
			autoHeight: true,
			layout: 'hbox',
			items:[ // 10-73
				{ xtype: 'spinnerfield', width: 50, minValue: 1, maxValue: 12, decimalPrecision: 1, accelerate: true, id: 'hr1073', name: 'hr1073', fieldLabel: '<?php echo htmlspecialchars( xl('Hora'), ENT_NOQUOTES); ?>' },
				{ xtype: 'spinnerfield', width: 50, minValue: 0, maxValue: 59, decimalPrecision: 1, accelerate: true, id: 'mn1073', name: 'mn1073', fieldLabel: '<?php echo htmlspecialchars( xl('Minuto'), ENT_NOQUOTES); ?>' },
				{ xtype: 'combo', width: 50, name: 'ampm1073', fieldLabel: '<?php echo htmlspecialchars( xl('AM / PM'), ENT_NOQUOTES); ?>', editable: false, triggerAction: 'all', mode: 'local', hiddenName: 'value', displayField: 'value', store: dayData },
				{ xtype: 'textfield', name: 'mill1073', fieldLabel: '<?php echo htmlspecialchars( xl('Millas'), ENT_NOQUOTES); ?>' }
			]
		},{
			xtype: 'fieldset',
			title: '<?php xl("Respuesta 10-74 (Horas/Minutos/AMPM/Millaje)",'e') ?>',
			autoHeight: true,
			layout: 'hbox',
			items:[ // 10-74
				{ xtype: 'spinnerfield', width: 50, minValue: 1, maxValue: 12, decimalPrecision: 1, accelerate: true, id: 'hr1074', name: 'hr1074', fieldLabel: '<?php echo htmlspecialchars( xl('Hora'), ENT_NOQUOTES); ?>' },
				{ xtype: 'spinnerfield', width: 50, minValue: 0, maxValue: 59, decimalPrecision: 1, accelerate: true, id: 'mn1074', name: 'mn1074', fieldLabel: '<?php echo htmlspecialchars( xl('Minuto'), ENT_NOQUOTES); ?>' },
				{ xtype: 'combo', width: 50, name: 'ampm1074', fieldLabel: '<?php echo htmlspecialchars( xl('AM / PM'), ENT_NOQUOTES); ?>', editable: false, triggerAction: 'all', mode: 'local', hiddenName: 'value', displayField: 'value', store: dayData },
				{ xtype: 'textfield', name: 'mill1074', fieldLabel: '<?php echo htmlspecialchars( xl('Millas'), ENT_NOQUOTES); ?>' }
			]
		},{
			xtype: 'fieldset',
			title: '<?php xl("Historial Medico/Diagnosticos",'e') ?>',
			autoHeight: true,
			columnWidth: 1,
			border: true,
			bodyStyle: 'padding: 5px',
			labelWidth: 180,
			items:[ 
				{ xtype: 'textfield', hideLabel: false, name: 'hampleh', fieldLabel: '<?php echo htmlspecialchars( xl('H'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textfield', name: 'hamplea', fieldLabel: '<?php echo htmlspecialchars( xl('A'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textfield', name: 'hamplem', fieldLabel: '<?php echo htmlspecialchars( xl('M'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textfield', name: 'hamplep', fieldLabel: '<?php echo htmlspecialchars( xl('P'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textfield', name: 'hamplel', fieldLabel: '<?php echo htmlspecialchars( xl('L'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textfield', name: 'hamplee', fieldLabel: '<?php echo htmlspecialchars( xl('E'), ENT_NOQUOTES); ?>' },
				{ xtype: 'textarea', anchor: '95%', name: 'diagnos', fieldLabel: '<?php echo xl('Posible Impresi&oacute;n Diagn&oacute;stico'); ?>' }
			]
		},{
			xtype: 'fieldset',
			title: '<?php xl("Condiciones",'e') ?>',
			autoHeight: true,
			columnWidth: 1,
			layout:'column',
			border: true,
			items:[ {
				xtype: 'fieldset',
				height: 350,
				columnWidth: 0.12,
				border: true,
				cls: 'x-fieldset-group-alt-1',
				bodyStyle: 'padding: 5px',
				title: '<?php xl("Signos y Sintomas",'e') ?>',
				labelWidth: 30,
				items:[
					{ xtype: 'checkbox', hideLabel: true, name: 'signos_y_sintomas[]', inputValue: 'Hemiparesis', boxLabel: '<?php echo htmlspecialchars( xl('Hemiparesis'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'signos_y_sintomas[]', inputValue: 'HBP', boxLabel: '<?php echo htmlspecialchars( xl('HBP'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'signos_y_sintomas[]', inputValue: 'Dolor de Pecho', boxLabel: '<?php echo htmlspecialchars( xl('Dolor de Pecho'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'signos_y_sintomas[]', inputValue: 'Dificultad Resp', boxLabel: '<?php echo htmlspecialchars( xl('Dificultad Resp'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'signos_y_sintomas[]', inputValue: 'Dolor Abdominal', boxLabel: '<?php echo htmlspecialchars( xl('Dolor Abdominal'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'signos_y_sintomas[]', inputValue: 'Reaccion Alergica', boxLabel: '<?php echo htmlspecialchars( xl('Reaccion Alergica'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'signos_y_sintomas[]', inputValue: 'Hipglicemia', boxLabel: '<?php echo htmlspecialchars( xl('Hipglicemia'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'signos_y_sintomas[]', inputValue: 'Fiebre', boxLabel: '<?php echo htmlspecialchars( xl('Fiebre'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'signos_y_sintomas[]', inputValue: 'Mareo', boxLabel: '<?php echo htmlspecialchars( xl('Mareo'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'signos_y_sintomas[]', inputValue: 'Vomitos', boxLabel: '<?php echo htmlspecialchars( xl('Vomitos'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'signos_y_sintomas[]', inputValue: 'Sintomas de Parto', boxLabel: '<?php echo htmlspecialchars( xl('Sintomas de Parto'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'signos_y_sintomas[]', inputValue: 'Combativo', boxLabel: '<?php echo htmlspecialchars( xl('Combativo'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'signos_y_sintomas[]', inputValue: 'Convulsionando', boxLabel: '<?php echo htmlspecialchars( xl('Convulsionando'), ENT_NOQUOTES); ?>' },
					{ xtype: 'textfield', width: 100, name: 'otros', fieldLabel: '<?php echo htmlspecialchars( xl('Otros'), ENT_NOQUOTES); ?>' }
				]
		   },{
				xtype: 'fieldset',
				height: 350,
				columnWidth: 0.12,
				border: true,
				cls: 'x-fieldset-group-alt-2',
				bodyStyle: 'padding: 5px',
				title: '<?php xl("Estado de Conciencia",'e') ?>',
				items:[
					{ xtype: 'checkbox', hideLabel: true, name: 'conciencia[]', inputValue: 'Alerta', boxLabel: '<?php echo htmlspecialchars( xl('Alerta'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'conciencia[]', inputValue: 'Conciente', boxLabel: '<?php echo htmlspecialchars( xl('Conciente'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'conciencia[]', inputValue: 'Orientado', boxLabel: '<?php echo htmlspecialchars( xl('Orientado'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'conciencia[]', inputValue: 'Let�rgico', boxLabel: '<?php echo xl('Let&aacute;rgico'); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'conciencia[]', inputValue: 'Incoherente', boxLabel: '<?php echo htmlspecialchars( xl('Incoherente'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'conciencia[]', inputValue: 'Inconciente', boxLabel: '<?php echo htmlspecialchars( xl('Inconciente'), ENT_NOQUOTES); ?>' }
				]   
		   },{
				xtype: 'fieldset',
				height: 350,
				columnWidth: 0.12,
				border: true,
				cls: 'x-fieldset-group-alt-1',
				bodyStyle: 'padding: 5px',
				title: '<?php xl("Piel",'e') ?>',
				items:[
					{ xtype: 'checkbox', hideLabel: true, name: 'piel[]', inputValue: 'Alerta', boxLabel: '<?php echo htmlspecialchars( xl('Normal'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'piel[]', inputValue: 'Fria', boxLabel: '<?php echo htmlspecialchars( xl('Fria'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'piel[]', inputValue: 'Caliente', boxLabel: '<?php echo htmlspecialchars( xl('Caliente'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'piel[]', inputValue: 'Sudorosa', boxLabel: '<?php echo htmlspecialchars( xl('Sudorosa'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'piel[]', inputValue: 'Seca', boxLabel: '<?php echo htmlspecialchars( xl('Seca'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'piel[]', inputValue: 'Clanotica', boxLabel: '<?php echo htmlspecialchars( xl('Clanotica'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'piel[]', inputValue: 'Humeda', boxLabel: '<?php echo htmlspecialchars( xl('Humeda'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'piel[]', inputValue: 'Palido', boxLabel: '<?php echo htmlspecialchars( xl('Palido'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'piel[]', inputValue: 'Equimosis', boxLabel: '<?php echo htmlspecialchars( xl('Equimosis'), ENT_NOQUOTES); ?>' }
				]
		   },{
				xtype: 'fieldset',
				height: 350,
				columnWidth: 0.12,
				border: true,
				cls: 'x-fieldset-group-alt-2',
				bodyStyle: 'padding: 5px',
				title: '<?php xl("Pulmones",'e') ?>',
				items:[
					{ xtype: 'checkbox', hideLabel: true, name: 'pulmones[]', inputValue: 'Claro', boxLabel: '<?php echo htmlspecialchars( xl('Claro'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'pulmones[]', inputValue: 'Sibilancia', boxLabel: '<?php echo htmlspecialchars( xl('Sibilancia'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'pulmones[]', inputValue: 'Estertores', boxLabel: '<?php echo htmlspecialchars( xl('Estertores'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'pulmones[]', inputValue: 'Rales', boxLabel: '<?php echo htmlspecialchars( xl('Rales'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'pulmones[]', inputValue: 'Matidos', boxLabel: '<?php echo htmlspecialchars( xl('Matidos'), ENT_NOQUOTES); ?>' }
				]
		   },{
				xtype: 'fieldset',
				height: 350,
				columnWidth: 0.12,
				border: true,
				cls: 'x-fieldset-group-alt-1',
				bodyStyle: 'padding: 5px',
				title: '<?php xl("Abdomen",'e') ?>',
				items:[
					{ xtype: 'checkbox', hideLabel: true, name: 'abdomen[]', inputValue: 'Blandito', boxLabel: '<?php echo htmlspecialchars( xl('Blandito'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'abdomen[]', inputValue: 'No doloroso', boxLabel: '<?php echo htmlspecialchars( xl('No doloroso'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'abdomen[]', inputValue: 'Duro', boxLabel: '<?php echo htmlspecialchars( xl('Duro'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'abdomen[]', inputValue: 'Doloroso', boxLabel: '<?php echo htmlspecialchars( xl('Doloroso'), ENT_NOQUOTES); ?>' }
				]
		   },{
				xtype: 'fieldset',
				height: 350,
				columnWidth: 0.12,
				border: true,
				cls: 'x-fieldset-group-alt-2',
				bodyStyle: 'padding: 5px',
				title: '<?php xl("Pupilas",'e') ?>',
				items:[
					{ xtype: 'checkbox', hideLabel: true, name: 'pupilas[]', inputValue: 'Iguales', boxLabel: '<?php echo htmlspecialchars( xl('Iguales'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'pupilas[]', inputValue: 'Reactivas', boxLabel: '<?php echo htmlspecialchars( xl('Reactivas'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'pupilas[]', inputValue: 'Anisocorta', boxLabel: '<?php echo htmlspecialchars( xl('Anisocorta'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'pupilas[]', inputValue: 'No Reactivas', boxLabel: '<?php echo htmlspecialchars( xl('No Reactivas'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'pupilas[]', inputValue: 'Dilatadas', boxLabel: '<?php echo htmlspecialchars( xl('Dilatadas'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'pupilas[]', inputValue: 'Contaidas', boxLabel: '<?php echo htmlspecialchars( xl('Contaidas'), ENT_NOQUOTES); ?>' }
				]
		   },{
				xtype: 'fieldset',
				height: 350,
				columnWidth: 0.12,
				border: true,
				cls: 'x-fieldset-group-alt-1',
				bodyStyle: 'padding: 5px',
				title: '<?php xl("Pupilasid",'e') ?>',
				items:[
					{ xtype: 'radio', hideLabel: true, checked: true, name: 'pupilasid', inputValue: 'Izq', boxLabel: '<?php echo htmlspecialchars( xl('Izquierda'), ENT_NOQUOTES); ?>' },
					{ xtype: 'radio', hideLabel: true, name: 'pupilasid', inputValue: 'Der', boxLabel: '<?php echo htmlspecialchars( xl('Derecha'), ENT_NOQUOTES); ?>' }
				]
		   },{
				xtype: 'fieldset',
				height: 350,
				columnWidth: 0.12,
				border: true,
				cls: 'x-fieldset-group-alt-2',
				bodyStyle: 'padding: 5px',
				title: '<?php xl("Ritomo cardiaco",'e') ?>',
				items:[
					{ xtype: 'checkbox', hideLabel: true, name: 'ritmo_cardiaco[]', inputValue: 'Regular', boxLabel: '<?php echo htmlspecialchars( xl('Regular'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'ritmo_cardiaco[]', inputValue: 'Irregular', boxLabel: '<?php echo htmlspecialchars( xl('Irregular'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'ritmo_cardiaco[]', inputValue: 'Furete', boxLabel: '<?php echo htmlspecialchars( xl('Furete'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'ritmo_cardiaco[]', inputValue: 'Debil', boxLabel: '<?php echo htmlspecialchars( xl('Debil'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'ritmo_cardiaco[]', inputValue: 'Ausente', boxLabel: '<?php echo htmlspecialchars( xl('Ausente'), ENT_NOQUOTES); ?>' }
				]
		   },{
				xtype: 'fieldset',
				height: 930,
				columnWidth: 0.16,
				border: true,
				cls: 'x-fieldset-group-alt-1',
				bodyStyle: 'padding: 5px',
				labelAlign: 'top',
				title: '<?php xl("Oxigeno LPM",'e') ?>',
				items:[
					{ xtype: 'textfield', name: 'oxigenolpm' }
				]
		   },{
				xtype: 'fieldset',
				height: 930,
				columnWidth: 0.16,
				border: true,
				cls: 'x-fieldset-group-alt-2',
				bodyStyle: 'padding: 5px',
				title: '<?php xl("Oxigeno via",'e') ?>',
				items:[
					{ xtype: 'checkbox', hideLabel: true, name: 'oxigenovia[]', inputValue: 'Canuria', boxLabel: '<?php echo htmlspecialchars( xl('Canuria'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'oxigenovia[]', inputValue: 'Mascarilla', boxLabel: '<?php echo htmlspecialchars( xl('Mascarilla'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'oxigenovia[]', inputValue: 'Terapia', boxLabel: '<?php echo htmlspecialchars( xl('Terapia'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'oxigenovia[]', inputValue: 'Resucitador', boxLabel: '<?php echo htmlspecialchars( xl('Resucitador'), ENT_NOQUOTES); ?>' }
				] 
		   },{
				xtype: 'fieldset',
				height: 930,
				columnWidth: 0.16,
				border: true,
				cls: 'x-fieldset-group-alt-1',
				bodyStyle: 'padding: 5px',
				labelAlign: 'top',
				title: '<?php xl("Suero / Angio / Lugar",'e') ?>',
				items:[
					{ xtype: 'textfield', name: 'suero1', fieldLabel: '<?php echo htmlspecialchars( xl('Suero'), ENT_NOQUOTES); ?>' },
					{ xtype: 'textfield', name: 'angio1', fieldLabel: '<?php echo htmlspecialchars( xl('Angio'), ENT_NOQUOTES); ?>' },
					{ xtype: 'textfield', name: 'lugar1', fieldLabel: '<?php echo htmlspecialchars( xl('Lugar'), ENT_NOQUOTES); ?>' },
					{ xtype: 'textfield', name: 'suero2', fieldLabel: '<?php echo htmlspecialchars( xl('Suero'), ENT_NOQUOTES); ?>' },
					{ xtype: 'textfield', name: 'angio2', fieldLabel: '<?php echo htmlspecialchars( xl('Angio'), ENT_NOQUOTES); ?>' },
					{ xtype: 'textfield', name: 'lugar2', fieldLabel: '<?php echo htmlspecialchars( xl('Lugar'), ENT_NOQUOTES); ?>' }
				]
		   },{
				xtype: 'fieldset',
				height: 930,
				columnWidth: 0.16,
				border: true,
				cls: 'x-fieldset-group-alt-2',
				bodyStyle: 'padding: 5px',
				title: '<?php xl("Entrega del Paciente",'e') ?>',
				labelAlign: 'top',
				items:[
					{ xtype: 'box', cls: 'ux-ambulance-title', autoWidth: true, autoEl: {tag: 'blockquote', html: '<?php echo htmlspecialchars( xl('Seleccion de Hospital'), ENT_NOQUOTES); ?>'} },
					{ xtype: 'checkbox', hideLabel: true, name: 'entrega[]', inputValue: 'Medico', boxLabel: '<?php echo htmlspecialchars( xl('Medico'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'entrega[]', inputValue: 'Familares', boxLabel: '<?php echo htmlspecialchars( xl('Familares'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'entrega[]', inputValue: 'Cercano', boxLabel: '<?php echo htmlspecialchars( xl('Cercano'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'entrega[]', inputValue: 'Des Tecnico', boxLabel: '<?php echo htmlspecialchars( xl('Des Tecnico'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'entrega[]', inputValue: 'Des Sup', boxLabel: '<?php echo htmlspecialchars( xl('Des Sup'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'entrega[]', inputValue: 'Des Despacho', boxLabel: '<?php echo htmlspecialchars( xl('Des Despacho'), ENT_NOQUOTES); ?>' },
					{ xtype: 'box', cls: 'ux-ambulance-title', autoWidth: true, autoEl: {tag: 'blockquote', html: '<?php echo htmlspecialchars( xl('Medico'), ENT_NOQUOTES); ?>'} },
					{ xtype: 'textfield', id: 'medico', name: 'medico', fieldLabel: '<?php echo htmlspecialchars( xl('Medico'), ENT_NOQUOTES); ?>' },
					{ xtype: 'textfield', id: 'mediconpi', name: 'mediconpi', fieldLabel: '<?php echo htmlspecialchars( xl('Mediconpi'), ENT_NOQUOTES); ?>' },
					{ xtype: 'textfield', id: 'medicoesc', name: 'medicoesc', fieldLabel: '<?php echo htmlspecialchars( xl('Medicoesc'), ENT_NOQUOTES); ?>' },
					{ xtype: 'textfield', id: 'medicoescnpi', name: 'medicoescnpi', fieldLabel: '<?php echo htmlspecialchars( xl('Medicoescnpi'), ENT_NOQUOTES); ?>' },
					{ xtype: 'box', cls: 'ux-ambulance-title', autoWidth: true, autoEl: {tag: 'blockquote', html: '<?php echo htmlspecialchars( xl('Tratamiento en'), ENT_NOQUOTES); ?>'} },
					{ xtype: 'checkbox', hideLabel: true, name: 'tratamiento[]', inputValue: 'Ambulancia', boxLabel: '<?php echo htmlspecialchars( xl('Ambulancia'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'tratamiento[]', inputValue: 'Escena', boxLabel: '<?php echo htmlspecialchars( xl('Escena'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'tratamiento[]', inputValue: 'Hogar', boxLabel: '<?php echo htmlspecialchars( xl('Hogar'), ENT_NOQUOTES); ?>' }
				] 
		   },{
				xtype: 'fieldset',
				height: 930,
				columnWidth: 0.16,
				border: true,
				cls: 'x-fieldset-group-alt-2',
				bodyStyle: 'padding: 5px',
				title: '<?php xl("Servicios Prestados",'e') ?>',
				labelAlign: 'top',
				items:[
					{ xtype: 'checkbox', hideLabel: true, name: 'servicios_prestados[]', inputValue: 'Evaluacion', boxLabel: '<?php echo htmlspecialchars( xl('Evaluaci�n'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'servicios_prestados[]', inputValue: 'Transp. y Observacion', boxLabel: '<?php echo htmlspecialchars( xl('Transp. y Observaci�n'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'servicios_prestados[]', inputValue: 'Adm. Oxigeno', boxLabel: '<?php echo htmlspecialchars( xl('Adm. Oxigeno'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'servicios_prestados[]', inputValue: 'Suero I.V.', boxLabel: '<?php echo htmlspecialchars( xl('Suero I.V.'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'servicios_prestados[]', inputValue: 'Dext', boxLabel: '<?php echo htmlspecialchars( xl('Dext'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'servicios_prestados[]', inputValue: 'Long Spine Board', boxLabel: '<?php echo htmlspecialchars( xl('Long Spine Board'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'servicios_prestados[]', inputValue: 'Head Inmovilizer', boxLabel: '<?php echo htmlspecialchars( xl('Head Inmovilizer'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'servicios_prestados[]', inputValue: 'Collar Cervical', boxLabel: '<?php echo htmlspecialchars( xl('Collar Cervical'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'servicios_prestados[]', inputValue: 'Traccion', boxLabel: '<?php echo htmlspecialchars( xl('Tracci�n'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'servicios_prestados[]', inputValue: 'Fernula', boxLabel: '<?php echo htmlspecialchars( xl('Fernula'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'servicios_prestados[]', inputValue: 'CPR', boxLabel: '<?php echo htmlspecialchars( xl('CPR'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'servicios_prestados[]', inputValue: 'Limpieza Vias Resp.', boxLabel: '<?php echo htmlspecialchars( xl('Limpieza Vias Resp.'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'servicios_prestados[]', inputValue: 'KED', boxLabel: '<?php echo htmlspecialchars( xl('KED'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'servicios_prestados[]', inputValue: 'Resp. Artificial', boxLabel: '<?php echo htmlspecialchars( xl('Resp. Artificial'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'servicios_prestados[]', inputValue: 'Dialacion', boxLabel: '<?php echo htmlspecialchars( xl('Dialacion'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'servicios_prestados[]', inputValue: 'Control Hemorragia', boxLabel: '<?php echo htmlspecialchars( xl('Control Hemorragia'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'servicios_prestados[]', inputValue: 'Aplicacion de Frio', boxLabel: '<?php echo htmlspecialchars( xl('Aplicaci�n de Fr�o'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'servicios_prestados[]', inputValue: 'Coniotomia', boxLabel: '<?php echo htmlspecialchars( xl('Coniotomia'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'servicios_prestados[]', inputValue: 'Ayuda Obstertrica', boxLabel: '<?php echo htmlspecialchars( xl('Ayuda Obst�rtrica'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'servicios_prestados[]', inputValue: 'Term???', boxLabel: '<?php echo htmlspecialchars( xl('Term???'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'servicios_prestados[]', inputValue: 'Oximetria de Pulso', boxLabel: '<?php echo htmlspecialchars( xl('Oximetria de Pulso'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'servicios_prestados[]', inputValue: 'Intubacion', boxLabel: '<?php echo htmlspecialchars( xl('Intubaci�n'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'servicios_prestados[]', inputValue: 'Inmovilizacion', boxLabel: '<?php echo htmlspecialchars( xl('Inmovilizaci�n'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'servicios_prestados[]', inputValue: 'Signos Vitales', boxLabel: '<?php echo htmlspecialchars( xl('Signos Vitales'), ENT_NOQUOTES); ?>' },
					{ xtype: 'checkbox', hideLabel: true, name: 'servicios_prestados[]', inputValue: 'Otros', boxLabel: '<?php echo htmlspecialchars( xl('Otros'), ENT_NOQUOTES); ?>' },
					{ xtype: 'textfield', name: 'escala_de_trauma', fieldLabel: '<?php echo htmlspecialchars( xl('Escala de trauma'), ENT_NOQUOTES); ?>' },
					{ xtype: 'textfield', name: 'escala_de_glasqow', fieldLabel: '<?php echo htmlspecialchars( xl('Escala de glasqow'), ENT_NOQUOTES); ?>' },
					{ xtype: 'textfield', name: 'escala_de_apqar', fieldLabel: '<?php echo htmlspecialchars( xl('Escala de apqar'), ENT_NOQUOTES); ?>' }
				]
		   },{
				xtype: 'fieldset',
				height: 930,
				columnWidth: 0.16,
				border: true,
				cls: 'x-fieldset-group-alt-1',
				bodyStyle: 'padding: 5px',
				title: '<?php xl("Policia",'e') ?>',
				labelAlign: 'top',
				items:[
					{ xtype: 'textfield', name: 'policia', fieldLabel: '<?php echo htmlspecialchars( xl('Policia'), ENT_NOQUOTES); ?>' },
					{ xtype: 'textfield', name: 'policaid', fieldLabel: '<?php echo htmlspecialchars( xl('Placa'), ENT_NOQUOTES); ?>' },
					{ xtype: 'textfield', name: 'querella', fieldLabel: '<?php echo htmlspecialchars( xl('Querella'), ENT_NOQUOTES); ?>' },
					
					{ xtype: 'textfield', hidden: true, name: 'id' }
				] 
		   }]
		}]
		
   }] // End form

}); // END VIEWPORT

}); // END EXTJS
</script>
</head>
<body class="ext-gecko ext-gecko2 x-border-layout-ct">
</body>