<?php
/* Logon Screen Window
 * 
 * version 0.0.2
 * revision: N/A
 * author: Gino Rivera Falu
 */

$ignoreAuth = true;
include_once ("../registry.php");
include_once("../../library/adoHelper/adoHelper.inc.php");

?>
<head>
<TITLE><?php xl ('Login','e'); ?></TITLE>

<script type="text/javascript" src="../../library/<?php echo $GLOBALS['ext_path']; ?>/bootstrap.js"></script>

<link rel="stylesheet" type="text/css" href="../../library/<?php echo $GLOBALS['ext_path']; ?>/resources/css/ext.css">
<link rel="stylesheet" type="text/css" href="../../ui_app/style_newui.css" >
<link rel="stylesheet" type="text/css" href="../../ui_app/mitosehr_app.css" >

<script type="text/javascript">
Ext.require([
	'Ext.form.*',
    'Ext.window.*',
    'Ext.tip.QuickTips'
]);
Ext.onReady(function(){

// *************************************************************************************
// Structure, data for storeGroup
// AJAX -> component_data.ejs.php
// *************************************************************************************
Ext.regModel('Group', { fields: ['id', 'name'] } );
var storeGroup = Ext.data.Store({
	model: 'Group',
	proxy: new Ext.data.AjaxProxy({
		url: '../login/component_data.ejs.php?task=groups'
	}),
	reader: { // The default reader is JSON
		idIndex: 0,
		idProperty: 'id',
		totalProperty: 'results',
		root: 'row'
	},
	autoLoad: true
});

// *************************************************************************************
// Structure, data for storeLang
// AJAX -> component_data.ejs.php
// *************************************************************************************
Ext.regModel('Lang', { fields: ['lang_id', 'lang_description'] } );
var storeLang = new Ext.data.Store({
	model: 'Lang',
	proxy: new Ext.data.AjaxProxy({
		url: '../login/component_data.ejs.php?task=lang'
	}),
	reader: { // The default reader is JSON
		idIndex: 0,
		idProperty: 'land_id',
		totalProperty: 'results',
		root: 'row'
	},
	autoLoad: true
});

// *************************************************************************************
// The Copyright Notice Window
// *************************************************************************************
var winCopyright = Ext.create('widget.window', {
	id: 'winCopyright',
	width:600,
	height:500,
	closeAction:'hide',
	bodyStyle: 'padding: 5px;',
	modal: false,
	resizable: true,
	title: 'MitosEHR Copyright Notice',
	draggable: true,
	closable: true,
	autoLoad: 'copyright_notice.html',
	autoScroll: true
});

// *************************************************************************************
// Form Layout [Login]
// *************************************************************************************
var formLogin = Ext.create('Ext.form.FormPanel', {
	id				: 'formLogin',
    url				: '../main/main_screen.ejs.php?auth=login&site=<?php echo htmlspecialchars($_SESSION['site_id']); ?>',
    bodyStyle		:'padding:5px 5px 0',
	frame			: false,
	border			: false,
	standardSubmit	: true,   // new ext 4
	method			: 'POST', 	//new ext 4
    fieldDefaults	: { msgTarget: 'side', labelWidth: 300 },
    defaultType		: 'textfield',
    defaults		: { anchor: '100%' },
    items: [{ 
        minLength: 3,
		maxLength: 32, 
		allowBlank: false, 
		blankText:'Enter your username', 
		ref: '../authUser', 
		id: 'authUser', 
		name: 'authUser', 
		validationEvent: false, 
		fieldLabel: '<?php echo xl('Username'); ?>',
		minLengthText: 'Username must be at least 3 characters long.' 
	},{
        minLength: 4,
		maxLength: 10, 
		allowBlank: false,
		blankText:'Enter your password', 
		ref: '../authPass', 
		inputType: 'password', 
		id: 'authPass', 
		name: 'authPass', 
		validationEvent: false,
		fieldLabel: '<?php echo xl('Password'); ?>',
		minLengthText: 'Password must be at least 4 characters long.'
    },{ 
    	xtype: 'combo', 
    	id: 'languageChoice', 
    	name: 'languageChoice', 
    	store: storeLang,
    	emptyText: '<?php echo $defaultLangName; ?>', 
    	forceSelection: true, 
    	fieldLabel: '<?php echo xl('Language'); ?>', 
    	editable: false, 
    	triggerAction: 'all', 
    	valueField: 'lang_id', 
    	displayField: 'lang_description' 
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
    title: '<?php xl('MitosEHR Logon','e'); ?>',
    closable: true,
    width:499,
	height:300,
	bodyPadding :2,  		//new 4.0 
	closeAction:'hide',
    plain: true,
	modal: false,
	resizable: false,
	draggable: false,
	closable: false,
    bodyStyle: 'padding: 5px;',
    items: [{ xtype: 'box', width: 483, height: 135, autoEl: {tag: 'img', src: '../../ui_app/logon_header.png'}}, formLogin ]
});

winLogon.show();

}); // End App

</script>
</head>
<body id="login">
<div id="copyright">MitosEHR v1.0 Development | <a href="javascript:void()" onClick="Ext.getCmp('winCopyright').show();" >Copyright Notice</a></div>
</body>
</html>