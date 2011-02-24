<?php
/* Logon Screen Window
 * 
 * version 0.0.2
 * revision: N/A
 * author: Gino Rivera Falu
 */

?>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<TITLE>MitosEHR Logon Screen</TITLE>

<script type="text/javascript" src="library/<?php echo $_SESSION['dir']['ext']; ?>/bootstrap.js"></script>

<link rel="stylesheet" type="text/css" href="library/<?php echo $_SESSION['dir']['ext']; ?>/resources/css/ext.css">
<link rel="stylesheet" type="text/css" href="library/<?php echo $_SESSION['dir']['ext']; ?>/resources/css/ext4.css">
<link rel="stylesheet" type="text/css" href="ui_app/style_newui.css" >
<link rel="stylesheet" type="text/css" href="ui_app/mitosehr_app.css" >

<script type="text/javascript">
Ext.require([
	'Ext.form.*',
    'Ext.window.*',
    'Ext.data.*',
    'Ext.tip.QuickTips'
]);
Ext.onReady(function(){

Ext.tip.QuickTips.init();

// *************************************************************************************
// Structure, data for storeLang
// AJAX -> component_data.ejs.php
// *************************************************************************************
Ext.regModel('Sites', { fields: 
	[
	{ type: 'int', name: 'site_id'},
	{ type: 'string', name: 'site'}
	] 
});
var storeSites = new Ext.data.Store({
	model: 'Sites',
	proxy: new Ext.data.AjaxProxy({
		url: 'interface/login/component_data.ejs.php?task=sites',
		reader: {
			type: 'json',
			idProperty: 'site_id',
			totalProperty: 'results',
			root: 'row'
		}
	}),
	autoLoad: true
});

// *************************************************************************************
// The Copyright Notice Window
// *************************************************************************************
var winCopyright = Ext.create('widget.window', {
	id				: 'winCopyright',
	width			: 600,
	height			: 500,
	closeAction		: 'hide',
	bodyStyle		: 'padding: 5px;',
	modal			: false,
	resizable		: true,
	title			: 'MitosEHR Copyright Notice',
	draggable		: true,
	closable		: true,
	autoLoad		: 'interface/login/copyright_notice.html',
	autoScroll		: true
});

// *************************************************************************************
// Form Layout [Login]
// *************************************************************************************
var formLogin = Ext.create('Ext.form.FormPanel', {
	id				: 'formLogin',
    url				: 'index.php',
    baseParams		: {auth: 'true'},
    bodyStyle		:'padding:5px 5px 0',
	frame			: false,
	border			: false,
	standardSubmit	: true,   // new ext 4
	method			: 'POST', 	//new ext 4
    fieldDefaults	: { msgTarget: 'side', labelWidth: 300 },
    defaultType		: 'textfield',
    defaults		: { anchor: '100%' },
    items: [{ 
    	xtype: 'textfield',
        minLength: 3,
		maxLength: 32, 
		allowBlank: false, 
		blankText:'Enter your username', 
		ref: '../authUser', 
		id: 'authUser', 
		name: 'authUser', 
		validationEvent: false,
		fieldLabel: 'Username',
		minLengthText: 'Username must be at least 3 characters long.' 
	},{
		xtype: 'textfield',
        minLength: 4,
		maxLength: 10, 
		allowBlank: false,
		blankText:'Enter your password', 
		ref: '../authPass', 
		inputType: 'password', 
		id: 'authPass', 
		name: 'authPass', 
		validationEvent: false,
		fieldLabel: 'Password',
		minLengthText: 'Password must be at least 4 characters long.'
    },{ 
    	xtype: 'combobox', 
    	id: 'choiseSite', 
    	name: 'choiseSite', 
    	store: storeSites,
    	emptyText: 'default',
    	fieldLabel: 'Site', 
    	editable: false, 
    	triggerAction: 'all', 
    	valueField: 'site_id', 
    	displayField: 'site',
    	queryMode: 'local'
    }],
    buttons: [{
        text: 'Reset',
        id: 'btn_reset',
		name: 'btn_reset',
		handler: function() {
            formLogin.getForm().reset();
		}
	},{
		text: 'Login',
        id: 'btn_login',
		name: 'btn_login',
		handler: function() {
			var olddate = new Date();
			olddate.setFullYear(olddate.getFullYear() - 1);
			document.cookie = '<?php echo session_name() . '=' . session_id() ?>; path=/; expires=' + olddate.toGMTString();
			// Submit the form
            formLogin.getForm().submit();
		}
    }],
    keys: [{
		key: [Ext.EventObject.ENTER], handler: function() {
			var olddate = new Date();
			olddate.setFullYear(olddate.getFullYear() - 1);
			document.cookie = '<?php echo session_name() . '=' . session_id() ?>; path=/; expires=' + olddate.toGMTString();
			// Submit the form
			formLogin.getForm().submit();
		}
	}],
	listeners:{
		render: function(){
			Ext.getCmp('authUser').focus(true, 10);
		}
	}
});

// *************************************************************************************
// The Logon Window
// *************************************************************************************
var winLogon = new Ext.create('widget.window', {
    title		: 'MitosEHR Logon',
    closable	: true,
    width		: 499,
	height		: 315,
	bodyPadding	: 2,  		//new 4.0 
	closeAction	: 'hide',
    plain		: true,
	modal		: false,
	resizable	: false,
	draggable	: false,
	closable	: false,
    bodyStyle	: 'padding: 5px;',
    items		: [{ xtype: 'box', width: 483, height: 135, autoEl: {tag: 'img', src: 'ui_app/logon_header.png'}}, formLogin ]
});

winLogon.show();

}); // End App

</script>
</head>
<body id="login">
<div id="copyright">MitosEHR<?php echo $_SESSION['ver']['major'] . "." . $_SESSION['ver']['rev'] . "." . $_SESSION['ver']['minor'] . " " . $_SESSION['ver']['codeName']; ?> | <a href="javascript:void()" onClick="Ext.getCmp('winCopyright').show();" >Copyright Notice</a></div>
</body>
</html>