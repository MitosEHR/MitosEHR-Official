<?php
if(!defined('_MitosEXEC')) die('No direct access allowed.');

/* Main Screen Application
*
* Description: This is the main application, with all the panels
*
* version 0.0.3
* revision: N/A
* author: Gino Rivera Falú
*/

// Reset session count
$_SESSION['site']['flops'] = 0;

?>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<title>MitosEHR</title>
<script type="text/javascript" src="library/<?php echo $_SESSION['dir']['ext']; ?>/bootstrap.js"></script>

<link rel="stylesheet" type="text/css" href="library/<?php echo $_SESSION['dir']['ext']; ?>/resources/css/ext-all.css">
<link rel="stylesheet" type="text/css" href="ui_app/style_newui.css" >
<link rel="stylesheet" type="text/css" href="ui_app/mitosehr_app.css" >

<script type="text/javascript">
Ext.require([
	'Ext.form.*',
	'Ext.button.*',
	'Ext.window.*',
	'Ext.data.*',
	'Ext.Loader',
	'Ext.tip.QuickTips'
]);

Ext.onReady(function() {

//****************************************************************
// Task Scheduler 
// This will run certain task at determined time.
//****************************************************************
var checkSession = function(){
	Ext.Ajax.request({
    	url: 'library/authProcedures/chkAuth.inc.php',
	    success: function(response, opts){
	    	if(response.responseText == 'exit'){ window.location="library/authProcedures/unauth.inc.php"; }
    	}
	});
} 
Ext.TaskMgr.start({
    run: checkSession,
    interval: 10000
});

//****************************************************************
// Navigation Panel
//****************************************************************
//var Navigation = Ext.create('Ext.tree.TreePanel', {
//	region: 'west',
//	collapsible: true,
//	floatable: true,
//	useArrows: true,
//	autoScroll: true,
//	rootVisible: false,
//	lines: false,
//	animate: true,
//	enableDD: true,
//	containerScroll: true,
//	dataUrl: 'interface/navigation/default_leftnav.ejs.php',
//	title: '<?php i18n('Navigation'); ?>',
//	split: true,
//	width: 200,
//	root: {
//		nodeType: 'async',
//		draggable: false,
//		id: 'source'
//	}
//});

//****************************************************************
// DUMMY Navigation Panel
//****************************************************************
var Navigation = Ext.create('Ext.Panel', {
	region: 'west',
	collapsible: true,
	floatable: true,
	useArrows: true,
	autoScroll: true,
	rootVisible: false,
	lines: false,
	animate: true,
	enableDD: true,
	containerScroll: true,
	title: '<?php i18n('Navigation'); ?>',
	split: true,
	width: 200,
	bodyPadding: 5,
	loader:{
		autoLoad: true,
		contentType: 'html',
		url: 'interface/main/menu_links.inc.php',
	}
}); // End Navigation

//****************************************************************
// Main Panel
//
// ExtJS v4 Ready
//****************************************************************
var MainApp = Ext.create('Ext.Panel', {
	region	: 'center',
	id		: 'TopPanel', 
	loader:{
		autoLoad: true,
		contentType: 'html',
		target: 'topPanel',
		url: 'interface/administration/facilities/facilities.ejs.php'
	},
	items	: [cw = Ext.create('Ext.Window', {
		xtype: 'window',
		closable: false,
		minimizable: true,
		title: 'Constrained Window',
		height: 200,
		width: 400,
		constrain: true,
		html: 'I am in a Container',
		itemId: 'center-window',
		minimize: function() {
			this.floatParent.down('button#toggleCw').toggle();
		}
	})],
	dockedItems: [{
		xtype: 'toolbar',
		dock: 'bottom',
		items: [{
			itemId: 'toggleCw',
			text: 'Constrained Window',
			enableToggle: true,
			toggleHandler: function() {
				cw.setVisible(!cw.isVisible());
			}
		}]
	}]
}); // End MainApp

//****************************************************************
// Bottom Panel
//
// ExtJS v4 Ready
//****************************************************************
var BottomPanel = Ext.create('Ext.Panel', {
	region: 'south',
	id		: 'BottomPannel',
	height: 100,
	split: true,
	collapsible: true,
	title: '...',
	margins: '0 0 0 0'
}); // End Bottom Panel

//****************************************************************
// header Panel
//
// ExtJS v4 Ready
//****************************************************************
var Header = Ext.create('Ext.Panel', {
	region : 'north',
	height : 40,
	height : 44,
	split : false,
	collapsible : false,
	frame : false,
	border : false,
	bodyStyle : 'background: transparent',
	margins : '0 0 0 0',
	items: [{
		html: '<a href="http://www.mitosehr.org/" style="float:left"><img src="ui_app/app_logo.png" height="34" width="130"  style="float:left"></a>',
		style:'float:left',
		bodyStyle:'background: transparent',
		border: false
	},{
		xtype: 'button',
		text: '<img src="ui_icons/32PatientFile.png" height="32" width="32" style="float:left">[ Patient Name ]<br>[ Patient Info ]',
		scale: 'large',
		style : 'float:left',
		margin: '0 0 0 75px',
		minWidth: 150,
		menu: [{
			text:'<?php i18n("New Encounter"); ?>'
		},{
			text:'<?php i18n("Appointments"); ?>'
		},{
			text:'<?php i18n("Patient Notes"); ?>'
		}]
	},{
		xtype: 'button',
		text: '<?php echo $_SESSION['user']['name'] ?>',
		iconCls: 'add',
		iconAlign: 'left',
		style : 'float:right',
		margin: '7 0 0 5',
		menu: [{
			text:'<?php i18n("My account"); ?>'
		},{
			text:'<?php i18n("My settings"); ?>'
		},{
			text:'<?php i18n("Logout"); ?>',
			handler: function(){
				Ext.Msg.show({
					title: '<?php i18n("Please confirm..."); ?>', 
					icon: Ext.MessageBox.QUESTION,
					msg:'<?php i18n("Are you sure to quit MitosEHR?"); ?>',
					buttons: Ext.Msg.YESNO,
					fn:function(btn,msgGrid){
						if(btn=='yes'){ window.location = "library/authProcedures/unauth.inc.php"; }
					}
				});
			}
		}]
	}]
}); // End Header

//****************************************************************
// TopPanel
// Description: It will show up the main layouts
//
// ExtJS v4 Ready
//****************************************************************
var TopPanel = Ext.create('Ext.Panel', {
	region: 'center',
	title: 'Center',
	id: 'topPanel',
	layout: 'border',
	border: false,
	items: [ MainApp, BottomPanel ]
}); // End TopPanel

//****************************************************************
// The main ViewPort
// Description: It will display all the previuosly declared
// panels above.
//
// ExtJS v4 Ready 
//****************************************************************
Ext.create('Ext.Viewport', {
	layout: {
		type: 'border',
		padding: 5
	},
	defaults: { split: true },
	items: [ Header, Navigation, TopPanel]
}); // End ViewPort

}); // End App

</script>