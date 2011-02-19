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
//************************************************************************************************************
// Collect groups
//************************************************************************************************************
$res = sqlStatement("SELECT DISTINCT name FROM groups");
for ($iter = 0; $row = sqlFetchArray($res); $iter++){
$group_buff .= "['" . $iter . "', '" . $row['name'] . "'],". chr(13);
$result[$iter] = $row;
}
$group_buff = substr($group_buff, 0, -2); // Delete the last comma and clear the buff.
if (count($result) == 1) { $resvalue = $result[0]{"name"}; }

//************************************************************************************************************
// Collect default language id
//************************************************************************************************************
$res2 = sqlStatement("SELECT * FROM lang_languages WHERE lang_description = '".$GLOBALS['language_default']."'");
for ( $iter = 0; $row = sqlFetchArray($res2); $iter++) $result2[$iter] = $row;

if (count($result2) == 1) {
	$defaultLangID = $result2[0]{"lang_id"};
	$defaultLangName = $result2[0]{"lang_description"};
} else {
	//default to english if any problems
	$defaultLangID = 1;
	$defaultLangName = "English";
}
//************************************************************************************************************
// Set session variable to default so login information appears in default language
//************************************************************************************************************
$_SESSION['language_choice'] = $defaultLangID;
//************************************************************************************************************
// Collect languages if showing language menu
//************************************************************************************************************
if ($GLOBALS['language_menu_login']) {
// sorting order of language titles depends on language translation options.
$mainLangID = empty($_SESSION['language_choice']) ? '1' : $_SESSION['language_choice'];
if ($mainLangID == '1' && !empty($GLOBALS['skip_english_translation'])) {
$sql = "SELECT * FROM lang_languages ORDER BY lang_description, lang_id";
$res3=SqlStatement($sql);
} else {
	// Use and sort by the translated language name.
	$sql = "SELECT
				ll.lang_id,
			IF(LENGTH(ld.definition),
				ld.definition,
				ll.lang_description) AS trans_lang_description,
				ll.lang_description
			FROM
				lang_languages AS ll
				LEFT JOIN lang_constants AS lc
				ON lc.constant_name = ll.lang_description
				LEFT JOIN lang_definitions AS ld
				ON ld.cons_id = lc.cons_id AND ld.lang_id = '$mainLangID'
			ORDER BY
				IF(LENGTH(ld.definition),
				ld.definition,
				ll.lang_description),
				ll.lang_id";
	$res3=SqlStatement($sql);
}

for ($iter = 0;$row = sqlFetchArray($res3);$iter++) {
	$lang_buff .= "['" . $row['lang_id'] . "', '" . $row['lang_description'] . "'],". chr(13);
	$result3[$iter] = $row;
}
$lang_buff = substr($lang_buff, 0, -2); // Delete the last comma and clear the buff.

//default to english if only return one language
if (count($result3) == 1) { $defaultLanguage = 1; }
}
?>
<head>
<title><?php xl ('Login','e'); ?></title>
<script type="text/javascript" src="../../library/ext-4.0-pr1/bootstrap.js"></script>
<link rel="stylesheet" type="text/css" href="../../library/ext-4.0-pr1/resources/css/ext.css">
<link rel="stylesheet" type="text/css" href="../../ui_app/style_newui.css" >
<link rel="stylesheet" type="text/css" href="../../ui_app/mitosehr_app.css" >
<script type="text/javascript">
/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 * 
 */
Ext.require([
    'Ext.window.*',
    'Ext.tip.QuickTips'
]);
Ext.onReady(function(){
Ext.QuickTips.init();
// *************************************************************************************
// Structure, data for language Data
// *************************************************************************************
var lang_Data = [ <?php echo $lang_buff; ?> ];
var langData = new Ext.data.ArrayStore({
	id: 'lang_id',
	fields: [ 'lang_id', 'lang_description' ],
	data: lang_Data
});

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

var formLogin = new Ext.create('Ext.form.FormPanel', {
	id				: 'formLogin',
    url				: '../main/main_screen.ejs.php?auth=login&site=<?php echo htmlspecialchars($_SESSION['site_id']); ?>',
    bodyStyle		:'padding:5px 5px 0',
	frame			: false,
	border			: false,
	doAction		: {method: 'POST'},
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
		fieldLabel: '<?php echo htmlspecialchars( xl('Username'), ENT_NOQUOTES); ?>',
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
		fieldLabel: '<?php echo htmlspecialchars( xl('Password'), ENT_NOQUOTES); ?>',
		minLengthText: 'Password must be at least 4 characters long.'
    },{ 
    	xtype: 'combo', 
    	id: 'languageChoice', 
    	name: 'languageChoice', 
    	store: langData,
    	emptyText: '<?php echo $defaultLangName; ?>', 
    	forceSelection: true, 
    	fieldLabel: '<?php echo htmlspecialchars( xl('Language'), ENT_NOQUOTES); ?>', 
    	editable: false, 
    	triggerAction: 'all', 
    	valueField: 'lang_id', 
    	displayField: 'lang_description' 
    }],
    buttons: [{
    	        text: '<?php echo htmlspecialchars( "Reset", ENT_QUOTES); ?>',
        id: 'btn_reset',
		name: 'btn_reset',
		handler: function() {
            formLogin.getForm().reset();
		}
	},{
		text: '<?php echo htmlspecialchars( "Login", ENT_QUOTES); ?>',
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
