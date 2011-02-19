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

    /*
     * ================  Simple form  =======================
     */
var formLogin = new Ext.create('Ext.form.FormPanel', {
	id: 'frmLogin',
    url: '../main/main_screen.ejs.php?auth=login&site=<?php echo htmlspecialchars($_SESSION['site_id']); ?>',
    bodyStyle:'padding:5px 5px 0',
	frame: false,
	border: false,
	doAction: {method: 'POST'},
    fieldDefaults: { msgTarget: 'side', labelWidth: 300 },
    defaultType: 'textfield',
    defaults: {
        anchor: '100%'
    },

    items: [{
        fieldLabel: 'First Name',
        name: 'first',
        allowBlank:false
    },{
        fieldLabel: 'Last Name',
        name: 'last'
    },{
        fieldLabel: 'Company',
        name: 'company'
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
