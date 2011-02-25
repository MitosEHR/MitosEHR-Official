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
//  animate: true,
//  enableDD: true,
//  containerScroll: true,
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
});

//****************************************************************
// Main Panel 
//****************************************************************
var MainApp = Ext.create('Ext.Panel', {
	region: 'center',
	html: 'center center',
	items: [cw = Ext.create('Ext.Window', {
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
});
//****************************************************************
// Bottom Panel
//****************************************************************
var BottomPanel = Ext.create('Ext.Panel', {
	region: 'south',
	height: 100,
	split: true,
	collapsible: true,
	title: '...',
	margins: '0 0 0 0',
	html: 'center south'
});
//****************************************************************
// header Panel
//****************************************************************
var Header = Ext.create('Ext.Panel', {
	region		: 'north',
	height		: 44,
	split		: false,
	collapsible	: false,
	frame		: false,
	border		: false,
	bodyStyle	: 'background: transparent',
	margins		: '0 0 0 0',
	items: [{ 
		html: '<a href="http://www.mitosehr.org/" style="float:left"><img src="ui_app/app_logo.png"style="float:left"></a>', 
		style:'float:left', 
		bodyStyle:'background: transparent', 
		border: false 
	},{ 
		xtype: 'button',
		text: '<img src="ui_app/missing_photo.png" height="35" width="35" style="float:left" >[ Patient Name ]<br>[ Patient Info ]',
		scale: 'large',
        style	: 'float:left',
        margin: '0 0 0 75px',
        minWidth: 150,
        menu: [{
        	text:'New Encounter'
        },{
             text:'Appointments'
        },{
             text:'Patient Notes'
        }]
	},{ 
		xtype: 'button',
		text: '<?php echo $_SESSION['user']['name'] ?>',
		iconCls: 'add',
        iconAlign: 'left',
        style	: 'float:right',
        margin: '7 0 0 5',
        menu: [{
        	text:'My account'
        },{
             text:'My settings'
        },{
             text:'Logout',
             handler: function(){window.location = "logout.php"}
        }]
	}]
});
//****************************************************************
// The main ViewPort
//****************************************************************
Ext.create('Ext.Viewport', {
	layout: {
		type: 'border',
		padding: 5
	},
	defaults: { split: true },
	items: [ Header, Navigation,{
		region: 'center',
		title: 'Center',
		layout: 'border',
		border: false,
		items: [ MainApp, BottomPanel ]
	}]
});


}); // End App 

</script>