<?php

// *************************************************************************************
// OpenEMR Globals
// *************************************************************************************
include_once("../globals.php");
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


// *************************************************************************************
// Navigation Layout if OpenEMR will work for a Athletic Clinic
// *************************************************************************************
if ($GLOBALS['athletic_team']) {
	$frame1url = "../reports/players_report.php?embed=1";
} else {
	if ($is_expired) {
		$frame1url = "pwd_expires_alert.php"; //php file which display's password expiration message.
	} elseif (isset($_GET['mode']) && $_GET['mode'] == "loadcalendar") {
		$frame1url = "../calendar/calendar.ejs.php?pid=" . $_GET['pid'];
		if (isset($_GET['date'])) $frame1url .= "&date=" . $_GET['date'];
	} else {
		if ($GLOBALS['concurrent_layout']) {
		// new layout
		if ($GLOBALS['default_top_pane']) {
			$frame1url=$GLOBALS['default_top_pane'];
		} else {
			$frame1url = "main_info.php";
		}
	} else
		// old layout
		$frame1url = "main.php?mode=" . $_GET['mode'];
	}
}

$nav_area_width = $GLOBALS['athletic_team'] ? '230' : '130';
if (!empty($GLOBALS['gbl_nav_area_width'])) $nav_area_width = $GLOBALS['gbl_nav_area_width'];
?>
<html>
<head>
<script type="text/javascript" src="../../library/ext-3.3.0/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="../../library/ext-3.3.0/ext-all.js"></script>

<!-- ******************************************************************* -->
<!-- Call for necessary Repository Objects, that we need on the MitosEHR -->
<!-- ******************************************************************* -->
<script type="text/javascript" src="../../repository/gridsearch/js/Ext.ux.grid.Search.js"></script>
<script type="text/javascript" src="../../repository/gridsearch/js/Ext.ux.grid.RowActions.js"></script>
<script type="text/javascript" src="../../repository/calendar-rc1/extensible-all-debug.js"></script>
<script type="text/javascript" src="../../repository/calendar-rc1/extensible-all.js"></script>

<link rel="stylesheet" type="text/css" href="../../repository/calendar-rc1/resources/css/extensible-all.css" />
<link rel="stylesheet" type="text/css" href="../../library/ext-3.3.0/resources/css/ext-all.css" />
<link rel="stylesheet" type="text/css" href="../../library/ext-3.3.0/examples/form/forms.css" />
<link rel="stylesheet" type="text/css" href="../../library/ext-3.3.0/examples/examples.css" />
<link rel="stylesheet" type="text/css" href="../../library/ext-3.3.0/resources/css/xtheme-gray.css" />
  
<link rel="stylesheet" type="text/css" href="../../ui_app/style_newui.css" >
<title><?php echo $openemr_name ?></title>

<script type="text/javascript">
<?php require($GLOBALS['srcdir'] . "/restoreSession.php"); ?>
Ext.onReady(function() {
					 
// *************************************************************************************
// Immunization Window Dialog
// *************************************************************************************
var winPopup = new  Ext.Window({
	width:800,
	height: 600,
	modal: false,
	resizable: true,
	autoScroll: false,
	title:	'<?php echo htmlspecialchars( xl('Immunizations'), ENT_NOQUOTES); ?>',
	closeAction: 'hide',
	id: 'winPopup',
	bodyStyle:'padding: 5px',
	html: '<iframe src="" scrolling="auto" name="popWin" id="popWin" height="100%" width="100%" frameborder="0" marginheight="0" marginwidth="0"></iframe>',
	defaults: {scripts: true},
	maximizable: true,
	// Window Bottom Bar
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
	title: '<?php xl('Navigation', 'e'); ?>',
	dataUrl: '../navigation/default_leftnav.ejs.php',
	region:'north',
	height: 450,
	minSize: 250,
	split: true,
	lines: false,
	tools:[{
		id:'plus',
		qtip: 'Expand all nodes'
	},{
		id:'minus',
		qtip: 'Collapse all nodes'
	}],
	root: {
		text: '<?php xl('Navigation', 'e'); ?>',
		draggable: false,
		id: ''
	}
});

// Assign the changeLayout function to be called on tree node click.
navigation.on('click', function(n){
	var sn = this.selModel.selNode || {}; // selNode is null on initial selection
	if( n.attributes.pos == "top"){	document.getElementById('RTop').src = '../' + n.attributes.id; }
	if( n.attributes.pos == "bot"){	document.getElementById('RBot').src = '../' + n.attributes.id; }
	if( n.attributes.pos == "pop"){ winPopup.show(); document.getElementById('popWin').src = n.attributes.id; }
	//Ext.Msg.alert('Navigation Tree Click', n.attributes.id);
});

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
		handler: function() { Ext.getCmp('frmImmunizations').getForm().submit(); }
	}]
});

var NavPanel = new Ext.Panel({
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
	autoScroll: false,
	autoLoad: {url:'../calendar/calendar.ejs.php', scripts:true},
	cls:'empty',
	id: 'TopPanel',
	ref: '../TopPanel'
});

// Bottom
var BottomPanel = new Ext.Panel({
	region: 'south',
	autoScroll: true,
	header: true,
	height: 200,
	collapsible: true,
	titleCollapse: true,
	split:true,
	autoLoad: {url:'../messages/messages.ejs.php', scripts:true},
	cls:'empty',
	id: 'BottomPanel',
	ref: '../BottomPanel'
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
	renderTo: document.body,
	items:[
	new Ext.BoxComponent({
		region: 'north',
		height: 30, // give north and south regions a height
		autoEl: {
			tag: 'div',
			html:'<p class="app_bg" id="current_patient"><strong><?php xl('Patient', 'e'); ?>:&nbsp;</strong><?php xl('None','e'); ?></p>'
		}
	}),
	NavPanel, AppPanel ]
});

});
</script>

