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
$res = sqlStatement("SELECT
						distinct name
					FROM
						groups");
for ($iter = 0; $row = sqlFetchArray($res); $iter++){
	$group_buff .= "['" . $iter . "', '" . $row['name'] . "'],". chr(13);
	$result[$iter] = $row;
}
$group_buff = substr($group_buff, 0, -2); // Delete the last comma and clear the buff.
if (count($result) == 1) { $resvalue = $result[0]{"name"}; }

//************************************************************************************************************
// Collect default language id
//************************************************************************************************************
$res2 = sqlStatement("SELECT
						*
					FROM
						lang_languages
					WHERE lang_description = '".$GLOBALS['language_default']."'");
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
$sql = "SELECT
			*
		FROM
			lang_languages
		ORDER BY
			lang_description,
			lang_id";
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
<TITLE><?php xl ('Login','e'); ?></TITLE>

<script type="text/javascript" src="../../library/ext-3.3.0/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="../../library/ext-3.3.0/ext-all.js"></script>
<script type="text/javascript" src="../../library/ext-3.3.0/plugins/md5/ext.util.md5.js"></script>

<link rel="stylesheet" type="text/css" href="../../library/ext-3.3.0/resources/css/ext-all.css">
<link rel="stylesheet" type="text/css" href="../../ui_app/style_newui.css" >
<link rel="stylesheet" type="text/css" href="../../ui_app/mitosehr_app.css" >
<link rel="stylesheet" type="text/css" href="../../library/ext-3.3.0/resources/css/xtheme-gray.css" />

<script type="text/javascript">

Ext.onReady(function(){

Ext.QuickTips.init();

// *************************************************************************************
// Structure and load data for Group Combo Box
// *************************************************************************************
var group_Data = [ <?php echo $group_buff; ?> ];
var groupData = new Ext.data.ArrayStore({
	id: 'id',
	fields: [ 'id', 'name' ],
	data: group_Data
});

// *************************************************************************************
// Structure and load data for Language Combo Box
// *************************************************************************************
var lang_Data = [ <?php echo $lang_buff; ?> ];
var langData = new Ext.data.ArrayStore({
	id: 'lang_id',
	fields: [ 'lang_id', 'lang_description' ],
	data: lang_Data
});

// *************************************************************************************
// The Copyright Notice Window
// *************************************************************************************
var winCopyright = new Ext.Window({
	width:600,
	height:500,
	id: 'winCopyright',
	closeAction:'hide',
	bodyStyle: 'padding: 5px;',
	modal: false,
	resizable: true,
	title: '<?php xl('MitosEHR Copyright Notice','e'); ?>',
	draggable: true,
	closable: true,
	autoLoad: 'copyright_notice.html',
	animateTarget: 'copyright',
	autoScroll: true
});

// *************************************************************************************
// The Logon Window
// *************************************************************************************
var winLogon = new Ext.Window({
	width:500,
	height:320,
	id:'logon-window',
	closeAction:'hide',
	plain: true,
	modal: false,
	resizable: false,
	title: 'MitosEHR Logon',
	draggable: false,
	closable: false,

	items: [{ xtype: 'box', width: 483, height: 135, autoEl: {tag: 'img', src: '../../ui_app/logon_header.png'} },{
	xtype: 'form',
	labelWidth: 300,
	height:300,
	id: 'frmLogin',
	frame: false,
	doAction: {method: 'POST'},
	border: false,
	bodyStyle: 'padding: 5px',
	url: '../main/main_screen.ejs.php?auth=login&site=<?php echo htmlspecialchars($_SESSION['site_id']); ?>',
	defaults: {width: 150},
	formBind: true,
	standardSubmit: true,
	items: [
		{ xtype: 'textfield', ref: '../authPass', id: 'authPass', hidden: true, name: 'authPass', value: '' },
		{ xtype: 'combo', id: 'authProvider', name: 'authProvider', value: '<?php echo htmlspecialchars( $resvalue, ENT_QUOTES); ?>', forceSelection: true, fieldLabel: '<?php echo htmlspecialchars( xl('Group'), ENT_NOQUOTES); ?>', editable: false, triggerAction: 'all', store: groupData, mode: 'local', valueField: 'id', displayField: 'name' },
		{ xtype: 'textfield', 
			minLength: 3,
			maxLength: 32, 
			allowBlank: false, 
			blankText:'Enter your username', 
			ref: '../authUser', 
			id: 'authUser', 
			name: 'authUser', 
			validationEvent: false, 
			fieldLabel: '<?php echo htmlspecialchars( xl('Username'), ENT_NOQUOTES); ?>',
			minLengthText: 'Username must be at least 3 characters long.' },
		{ xtype: 'textfield', 
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
			minLengthText: 'Password must be at least 4 characters long.' },
		{ xtype: 'combo', id: 'languageChoice', name: 'languageChoice', value: '<?php echo $defaultLangName; ?>', forceSelection: true, fieldLabel: '<?php echo htmlspecialchars( xl('Language'), ENT_NOQUOTES); ?>', editable: false, triggerAction: 'all', store: langData, mode: 'local', valueField: 'lang_id', hiddenName: 'lang_id', displayField: 'lang_description' },
		// Special button, this little guy does a lot of work.
		// So, we need to dismantle it a little bit, for easy reading.
		{ xtype: 'button',
			id: 'btn_login',
			name: 'btn_login',
			text: '<?php echo htmlspecialchars( "Login", ENT_QUOTES); ?>',
			handler: function() {
				// Do the MD5 heavy work, and copy it to the correct field.
				winLogon.authPass.setRawValue(Ext.util.MD5(winLogon.clearPass.getRawValue()));
				// Set the cookie
				var olddate = new Date();
				olddate.setFullYear(olddate.getFullYear() - 1);
				document.cookie = '<?php echo session_name() . '=' . session_id() ?>; path=/; expires=' + olddate.toGMTString();
				// Submit the form
				Ext.getCmp('frmLogin').getForm().submit();
			}
		} // end of button
	],
	keys: [{
		key: [Ext.EventObject.ENTER], handler: function() {
			// Do the MD5 heavy work, and copy it to the correct field.
			winLogon.authPass.setRawValue(Ext.util.MD5(winLogon.clearPass.getRawValue()));
			// Set the cookie
			var olddate = new Date();
			olddate.setFullYear(olddate.getFullYear() - 1);
			document.cookie = '<?php echo session_name() . '=' . session_id() ?>; path=/; expires=' + olddate.toGMTString();
			// Submit the form
			Ext.getCmp('frmLogin').getForm().submit();
		}
	}]
}]
}); // End Logon Window

winLogon.show();
winLogon.authUser.focus();

}); // End App

</script>
</head>
<body id="login">
<div id="copyright">MitosEHR v1.0 Development | <a href="javascript:void()" onClick="Ext.getCmp('winCopyright').show();" >Copyright Notice</a></div>

</body>
</html>