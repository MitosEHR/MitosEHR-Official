<?php
if(!defined('_MitosEXEC')) die('No direct access allowed.');
/* Main Screen Application
* Description: Installation screen procedure
* version 0.0.1
* revision: N/A
* author: Ernesto J Rodriguez - MitosEHR
*/
?>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<title>MitosEHR :: Installation</title>
<script type="text/javascript" src="library/ext-4.0-pr4/bootstrap.js"></script>
<link rel="stylesheet" type="text/css" href="library/ext-4.0-pr4/resources/css/ext-all.css">
<link rel="stylesheet" type="text/css" href="ui_app/style_newui.css" >
<link rel="stylesheet" type="text/css" href="ui_app/mitosehr_app.css" >
<script type="text/javascript">
Ext.require([
	'Ext.form.*',
	'Ext.button.*',
	'Ext.window.*',
	'Ext.data.*',
	'Ext.Loader',
	'Ext.grid.*',
    'Ext.util.*',
    'Ext.state.*',
	'Ext.tip.QuickTips'
]);
Ext.onReady(function() {
/////////////////////////////// TEST AREA //////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////

// *************************************************************************************
// Structure, data for storeReq
// AJAX -> requirements.ejs.php
// *************************************************************************************
Ext.regModel('Requirements', { 
	fields: [
		{name: 'msg',     type: 'string'},
        {name: 'status',  type: 'string'}
	]
});
function status(val) {
    if (val == 'Ok') {
        return '<span style="color:green;">' + val + '</span>';
    } else {
        return '<span style="color:red;">' + val + '</span>';
    }
    return val;
}
var storeSites = new Ext.data.Store({
	model: 'Requirements',
	proxy: new Ext.data.AjaxProxy({
		url: 'install/requirements.ejs.php',
		reader: {
			type: 'json'
		}
	}),
	autoLoad: true
});


// *************************************************************************************
// grid to show all the requirements status
// *************************************************************************************
var reqGrid = new Ext.grid.GridPanel({
	id : 'reqGrid',
    store: storeSites,
    frame: false,
    border: false,
    viewConfig: {stripeRows: true},
    headers: [{
        text     : 'Requirements',
        flex     : 1,
        sortable : false, 
        dataIndex: 'msg'
    },{
        text     : 'Status', 
        width    : 150, 
        sortable : true, 
        dataIndex: 'status'
    }]
});
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
	            winSiteSetup.show();
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
var winSiteSetup = new Ext.create('widget.window', {
    title		: 'MitosEHR Installation',
    id			: 'winSiteSetup',
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
    items		: [ reqGrid ],
    dockedItems: [{
		xtype: 'form',
		dock: 'bottom',
		frame: false,
		border: false,
		buttons: [{
	        text: 'Next',
	        id: 'btn_agree',
	        padding: '0 10',
			name: 'btn_reset',
			handler: function() {
	        }
		}]
	}]
});

}); // End of Ext.onReady function
</script>
</head>
<body></body>
