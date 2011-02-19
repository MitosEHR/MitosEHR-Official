<?php
//--------------------------------------------------------------------------------------------------------------------------
// login.ejs.php
// v0.0.3
// Under GPLv3 License
// Integration Sencha ExtJS Framework
//
// NOTE:
// Need to finish the provider dropdown combobox
// Already have the hidden field, but need the combobox when
// it has more than one provider. And do some tests.
//--------------------------------------------------------------------------------------------------------------------------

$ignoreAuth = true;
include_once ("../registry.php");
include_once("$srcdir/sql.inc.php");

?>
<head>
<TITLE><?php xl ('Login','e'); ?></TITLE>

<script type="text/javascript" src="../../library/ext-4.0-pr1/bootstrap.js"></script>

<link rel="stylesheet" type="text/css" href="../../library/ext-4.0-pr1/resources/css/ext.css">
<link rel="stylesheet" type="text/css" href="../../ui_app/style_newui.css" >
<link rel="stylesheet" type="text/css" href="../../ui_app/mitosehr_app.css" >

<script type="text/javascript">

/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 * 
 */
Ext.require([
    'Ext.window.*'
]);
Ext.onReady(function(){
Ext.QuickTips.init();

var winCopyright = new Ext.create('widget.window', {
	id				: 'winCopyright',
	title			: '<?php xl('MitosEHR Copyright Notice','e'); ?>',
	closeAction		: 'hide',
	autoLoad		: 'copyright_notice.html',
	animateTarget	: 'copyright',
	bodyStyle		: 'padding: 5px;',
	width			: 600,
	height			: 500,
	modal			: false,
	resizable		: true,
	draggable		: true,
	closable		: true,
	autoScroll		: true
});


    /*
     * ================  Simple form  =======================
     */
var formLogin = new Ext.create('Ext.form.FormPanel', {
	id				: 'frmLogin',
    url				: '../main/main_screen.ejs.php?auth=login&site=<?php echo htmlspecialchars($_SESSION['site_id']); ?>',
    bodyStyle		:'padding:5px 5px 0',
	frame			: false,
	border			: false,
	doAction		: {method: 'POST'},
    fieldDefaults	: { msgTarget: 'side', labelWidth: 300 },
    defaultType		: 'textfield',
    defaults		: { anchor: '100%' },
    items: [{ 
    	xtype: 'textfield', 
    	ref: '../authPass', 
    	id: 'authPass', 
    	hidden: true, 
    	name: 'authPass', 
    	value: '' 
    },{
        minLength: 3,
		maxLength: 32, 
		allowBlank: false, 
		blankText:'Enter your username', 
		ref: '../authUser', 
		id: 'authUser', 
		name: 'authUser', 
		validationEvent: false, 
		fieldLabel: '<?php echo htmlspecialchars( xl('Username'), ENT_NOQUOTES); ?>',
		minLengthText: 'Username must be at least 3 characters long.' 
	},{
        minLength: 4,
		maxLength: 10, 
		allowBlank: false,
		blankText:'Enter your password', 
		ref: '../clearPass', 
		inputType: 'password', 
		id: 'clearPass', 
		name: 'clearPass', 
		validationEvent: false,
		fieldLabel: '<?php echo htmlspecialchars( xl('Password'), ENT_NOQUOTES); ?>',
		minLengthText: 'Password must be at least 4 characters long.'
    //},{ 
    //	xtype: 'combo', 
    //	id: 'languageChoice', 
    //	name: 'languageChoice', 
    //	value: '<?php echo $defaultLangName; ?>', 
    //	forceSelection: true, 
    //	fieldLabel: '<?php echo htmlspecialchars( xl('Language'), ENT_NOQUOTES); ?>', 
    //	editable: false, 
    //	triggerAction: 'all', 
    //	mode: 'local', 
    //	valueField: 'lang_id', 
    //	hiddenName: 'lang_id', 
    //	displayField: 'lang_description' 
    }],
    buttons: [{
        text: '<?php echo htmlspecialchars( "Login", ENT_QUOTES); ?>'
    }]
});

    


var winLogin = new Ext.create('widget.window', {
    title: '<?php xl('MitosEHR Logon','e'); ?>',
    closable: true,
    width:499,
	height:320,
	bodyPadding :2,  		//new 4.0 
	id:'logon-window',
	closeAction:'hide',
    plain: true,
	modal: false,
	resizable: false,
	draggable: false,
	closable: false,
    bodyStyle: 'padding: 5px;',
    items: [{ xtype: 'box', width: 483, height: 135, autoEl: {tag: 'img', src: '../../ui_app/logon_header.png'}}, formLogin ]
});
winLogin.show();
   
});

</script>
</head>
<body id="login">
<div id="copyright">MitosEHR v1.0 Development | <a href="javascript:void()" onClick="Ext.getCmp('winCopyright').show();" >Copyright Notice</a></div>
</body>
</html>
