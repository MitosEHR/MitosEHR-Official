<?php
// *************************************************************************************
// MitosEHR Globals
// v0.0.1
// *************************************************************************************
include_once("../registry.php");
require_once("$srcdir/formdata.inc.php");
$_SESSION["encounter"] = "";

// *************************************************************************************
// Fetching the password expiration date
// *************************************************************************************
if($GLOBALS['password_expiration_days'] != 0){
	$is_expired = false;
	$q=formData('authUser','P');
	$result = sqlStatement("SELECT
						   		pwd_expiration_date
							FROM 
								users
							WHERE
								username = '".$q."'");
	$current_date = date("Y-m-d");
	$pwd_expires_date = $current_date;
	if($row = sqlFetchArray($result)) {
		$pwd_expires_date = $row['pwd_expiration_date'];
	}
	// *************************************************************************************
	// Displaying the password expiration message
	// (starting from 7 days before the password gets expired)
	// *************************************************************************************
	$pwd_alert_date = date("Y-m-d", strtotime($pwd_expires_date . "-7 days"));
	if (strtotime($pwd_alert_date) != "" && strtotime($current_date) >= strtotime($pwd_alert_date) && 
		(!isset($_SESSION['expiration_msg']) or $_SESSION['expiration_msg'] == 0)) {
			$is_expired = true;
		$_SESSION['expiration_msg'] = 1; // only show the expired message once
	}
}


if (!empty($GLOBALS['gbl_nav_area_width'])) $nav_area_width = $GLOBALS['gbl_nav_area_width'];
?>
<html>
<head>
<script type="text/javascript" src="../../library/<?php echo $GLOBALS['ext_path']; ?>/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="../../library/<?php echo $GLOBALS['ext_path']; ?>/ext-all.js"></script>

<!-- ******************************************************************* -->
<!-- Call for mandatory repository objects, that we need on the MitosEHR -->
<!-- ******************************************************************* -->
<script type="text/javascript" src="../../repository/gridsearch/js/Ext.ux.grid.Search.js"></script>
<script type="text/javascript" src="../../repository/gridsearch/js/Ext.ux.grid.RowActions.js"></script>
<script type="text/javascript" src="../../repository/fittoparent/Ext.ux.FitToParent.js"></script>
<script type="text/javascript" src="../../repository/calendar/extensible-all.js"></script>
<script type="text/javascript" src="../../repository/formValidation/formValidation.js"></script>
<script type="text/javascript" src="../../library/<?php echo $GLOBALS['ext_path']; ?>/examples/ux/RowEditor.js"></script>

<!-- ******************************************************************* -->
<!-- Call for mandatory library objects, that we need on the MitosEHR    -->
<!-- ******************************************************************* -->
<link rel="stylesheet" type="text/css" href="../../repository/calendar/resources/css/extensible-all.css" />
<link rel="stylesheet" type="text/css" href="../../library/<?php echo $GLOBALS['ext_path']; ?>/examples/ux/css/RowEditor.css" />
<link rel="stylesheet" type="text/css" href="../../library/<?php echo $GLOBALS['ext_path']; ?>/resources/css/ext-all.css" />
<link rel="stylesheet" type="text/css" href="../../library/<?php echo $GLOBALS['ext_path']; ?>/examples/form/forms.css" />
<link rel="stylesheet" type="text/css" href="../../library/<?php echo $GLOBALS['ext_path']; ?>/resources/css/xtheme-gray.css" />
  
<link rel="stylesheet" type="text/css" href="../../ui_app/style_newui.css" >
<title><?php echo $GLOBALS['app_name']; ?></title>

<script type="text/javascript">
<?php require($GLOBALS['srcdir'] . "/restoreSession.php"); ?>

Ext.onReady(function() {

Ext.QuickTips.init();
Ext.BLANK_IMAGE_URL = '../../library/<?php echo $GLOBALS['ext_path']; ?>/resources/images/default/s.gif';

// *************************************************************************************
// Immunization Window Dialog
// *************************************************************************************
var winPopup = new  Ext.Window({
	id	: 'winPopup',
	width:800,
	height: 600,
	modal: false,
	resizable: true,
	autoScroll: true,
	title:	'<?php echo htmlspecialchars( xl('Immunizations'), ENT_NOQUOTES); ?>',
	closeAction: 'hide',
	id: 'winPopup',
	bodyStyle:'padding: 5px',
	defaults: {scripts: true},
	maximizable: true,
	
	//----------------------------------------------------------------------
	// Window Bottom Bar
	//----------------------------------------------------------------------
	bbar:[{
		text:'Close',
		iconCls: 'delete',
		handler: function(){ winPopup.hide(); }
	}]
});


// *************************************************************************************
// Left Panel [Navigation, Helper]
// *************************************************************************************
var navigation = new Ext.tree.TreePanel({
	useArrows: true,
	autoScroll: true,
	animate: true,
	containerScroll: true,
	border: true,
	rootVisible: false,
	dataUrl: '../navigation/default_leftnav.ejs.php',
	region:'north',
	height: 450,
	minSize: 250,
	split: true,
	lines: false,
	root: {
		text: '<?php xl('Navigation', 'e'); ?>',
		draggable: false,
		id: ''
	}
});

// *************************************************************************************
// Assign the changeLayout function to be called on tree node click.
// *************************************************************************************
navigation.on('click', function(n){
	var sn = this.selModel.selNode || {}; // selNode is null on initial selection
	
	//----------------------------------------------------------------------
	// Loads the screen on the top panel
	//----------------------------------------------------------------------
	if( n.attributes.pos == "top"){
		Ext.getCmp('TopPanel').load({url:'../' + n.attributes.id, scripts:true});
	}

	//----------------------------------------------------------------------
	// Loads the screen on the bottom panel
	//----------------------------------------------------------------------
	if( n.attributes.pos == "bot"){
	
		//----------------------------------------------------------------------
		// If the bottom panel is collapsed, then render it on the top panel.
		// FIXME: is not working correctly.
		//----------------------------------------------------------------------
		if ( Ext.getCmp('BottomPanel').collapsed ){
			Ext.getCmp('TopPanel').load({url:'../' + n.attributes.id, scripts:true});
		} else {
			Ext.getCmp('BottomPanel').load({url:'../' + n.attributes.id, scripts:true});
		}
	}

	//----------------------------------------------------------------------
	// Loads the screen on the dialog window
	//----------------------------------------------------------------------
	if( n.attributes.pos == "pop"){
		Ext.getCmp('winPopup').load({url:'../' + n.attributes.id, scripts:true});
		winPopup.show();
	}
});

// *************************************************************************************
// The Helper Panel
// *************************************************************************************
var helper = new Ext.Panel({
	title: '<?php xl('Quick Patient Lookup', 'e'); ?>',
	xtype: 'form',
	labelWidth: 100,
	minSize: 300,
	defaults: {width: <?php echo $nav_area_width - 13; ?>},
	formBind: true,
	buttonAlign: 'left',
	standardSubmit: true,
	region: 'center',
	bodyStyle:'padding: 5px; background:#f4f8ff; background-image: url(../../ui_icons/helper_bg.png); background-repeat: repeat-x;',
	autoScroll: true,
	items:[	{ xtype: 'textfield', emptyText: 'Your search criteria...', id: 'search', name: 'txtSearch', fieldLabel: 'Find' } ],
	html: '<div class="searchCriteria">Please type your patient search criteria above. You may search by Name, SSN, ID, DOB, Selecting a Filter, or Any text.</h1>',
	bbar:[{
		text:'Search',
		iconCls: 'searchUsers',
		formBind: true,
		handler: function() { Ext.getCmp('frmImmunizations').getForm().submit(); },
		menu: {
			items: [
				{ text: 'By Name', group: 'filter' },
				{ text: 'By ID', group: 'filter' },
				{ text: 'By DOB', group: 'filter' },
				{ text: 'By SSN', group: 'filter' },
				{ text: 'By Any', group: 'filter' }
			]
		}
	},'-',{
		text:'Filter',
		iconCls: 'icoFilter',
		formBind: true,
		handler: function() { }
	}]
});

// *************************************************************************************
// Navigation Panel
// *************************************************************************************
var NavPanel = new Ext.Panel({
  title: '<?php xl('Navigation', 'e'); ?>',
	region:'west',
	layout: 'border',
	margins:'5 0 5 5',
	collapsible: true,
	titleCollapse: true,
	split:true,
	border: false,
	width: <?php echo $nav_area_width; ?>,
	items: [navigation, helper]
});


// *************************************************************************************
// Application Content [TopPanel, BottomPanel]
// *************************************************************************************
// Top
var TopPanel = new Ext.Panel({
	region: 'center',
	id	: 'TopPanel',
	autoScroll: false,
	waitMsg: 'Loading...',
	autoLoad: {url:'../calendar/calendar.ejs.php', scripts:true},
	cls:'empty',
	id: 'TopPanel',
	ref: '../TopPanel',
	monitorResize: true,

	//----------------------------------------------------------------------
	// Monitor and send the new height value to the panel
	//----------------------------------------------------------------------
	listeners : {
		bodyresize : function(panel, width, height) {
			if ( Ext.getCmp('RenderPanel') ){ Ext.getCmp('RenderPanel').setHeight(height); }
		}
	}
	
});

// Bottom
var BottomPanel = new Ext.Panel({
	region: 'south',
	id	: 'BottomPanel',
	autoScroll: true,
	header: true,
	height: 300,
	collapsible: true,
	titleCollapse: true,
	split:true,
	monitorResize: true,
	waitMsg:'Loading...',
	autoLoad: {url:'../messages/messages.ejs.php', scripts:true},
	cls:'empty',
	id: 'BottomPanel',
	ref: '../BottomPanel',
});

var AppPanel = new Ext.Panel({
	region:'center',
	layout: 'border',
	margins:'5 5 5 0',
	split:true,
	border: false,
	items: [TopPanel, BottomPanel]
});


// *************************************************************************************
// Create the ViewPort (Browser)
// *************************************************************************************
var viewport = new Ext.Viewport({
	layout:'border',
	id: 'MainBody',
	renderTo: document.body,
	items:[
	new Ext.BoxComponent({
		region: 'north',
		height: 30, // give north region a height
		autoEl: {
			tag: 'div',
			html:'<img src="../../ui_app/app_logo.png" style="float:left; margin: 1px 1px 1px 1px;" alt="MitosEHR" title="MitosEHR"><p class="app_bg" style="padding: 10px 0 0 <?php echo $nav_area_width + 10; ?>px;" id="current_patient"><strong><?php xl('Patient', 'e'); ?>:&nbsp;</strong><?php xl('None','e'); ?></p>'
		}
	}),
	NavPanel, AppPanel ]
});

});
</script>