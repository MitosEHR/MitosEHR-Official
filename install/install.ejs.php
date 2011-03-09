<?php
if(!defined('_MitosEXEC')) die('No direct access allowed.');
/* Main Screen Application
* Description: Installation screen
* version 0.0.1
* revision: N/A
* author: Ernesto J Rodriguez - MitosEHR
*/
?>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<title>MitosEHR :: Installation</title>
<script type="text/javascript" src="library/ext-4.0-pr3/bootstrap.js"></script>
<link rel="stylesheet" type="text/css" href="library/ext-4.0-pr3/resources/css/ext-all.css">
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

// *************************************************************************************
// The Copyright Notice Window
// *************************************************************************************
var winCopyright = Ext.create('widget.window', {
	id				: 'winCopyright',
	width			: 800,
	height			: 500,
	closeAction		: 'hide',
	bodyStyle		: 'padding: 5px;',
	modal			: false,
	resizable		: true,
	title			: 'MitosEHR Copyright Notice',
	draggable		: true,
	closable		: true,
	autoLoad		: 'gpl-licence-en.html',
	autoScroll		: true,
	dockedItems: [{
		xtype: 'form',
		dock: 'bottom',
		frame: false,
		border: false,
		buttons: [{
	        text: 'I Agree',
	        id: 'btn_agree',
	        margin: '0 5',
			name: 'btn_reset',
			handler: function() {
	            winCopyright.hide();
	            winLogon.show();
	            
	        }
		}, '-',{
			text: 'Do Not Agree',
	        id: 'btn_notAgree',
	        margin: '0 10 0 5',
			name: 'btn_reset',
			handler: function() {
	            formLogin.getForm().reset();
	        }
		}]
	}]
});
winCopyright.show();

// *************************************************************************************
// The Logon Window
// *************************************************************************************
var winLogon = new Ext.create('widget.window', {
    title		: 'MitosEHR Installation',
    closable	: true,
    width		: 600,
	height		: 400,
	bodyPadding	: 2,  		//new 4.0 
	closeAction	: 'hide',
    plain		: true,
	modal		: false,
	resizable	: false,
	draggable	: false,
	closable	: false,
    bodyStyle	: 'padding: 5px;',
    items		: [ ]
});

}); // End of Ext.onReady function
</script>
</head>
<body></body>
