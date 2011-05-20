<?php
if(!defined('_MitosEXEC')) die('No direct access allowed.');

/* Main Screen Application
*
* Description: This is the main application, with all the panels
*
* version 0.0.3
* revision: N/A
* author: Gino Rivera Falú
*/

session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

// Reset session count
$_SESSION['site']['flops'] = 0;

include_once('library/compressor/compressor.inc.php');

?>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<title>MitosEHR</title>
<script type="text/javascript" src="library/<?php echo $_SESSION['dir']['ext']; ?>/bootstrap.js"></script>
<script type="text/javascript" src="repository/formValidation/formValidation.js"></script>
<script type="text/javascript" src="repository/global_functions/global_functions.js"></script>
<link rel="stylesheet" type="text/css" href="library/<?php echo $_SESSION['dir']['ext']; ?>/resources/css/ext-all.css">
<link rel="stylesheet" type="text/css" href="ui_app/style_newui.css" >
<link rel="stylesheet" type="text/css" href="ui_app/mitosehr_app.css" >

<script type="text/javascript">

// *************************************************************************************
// Sencha trying to be like a language
// using requiered to load diferent components
// *************************************************************************************
Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath('Ext.ux', '<?php echo $_SESSION['dir']['ux']; ?>');
Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.state.*',
    'Ext.toolbar.Paging',
    'Ext.TaskManager.*',
    'Ext.ux.SlidingPager'
]);

Ext.onReady(function() {

	//****************************************************************
	// Task Scheduler 
	// This will run certain task at determined time.
	//****************************************************************
	var checkSession = function(){
		Ext.Ajax.request({
	    	url: 'library/authProcedures/chkAuth.inc.php',
		    success: function(response, opts){
		    	if(response.responseText == 'exit'){ window.location="library/authProcedures/unauth.inc.php"; }
	    	}
		});
	} 
	Ext.TaskManager.start({
	    run: checkSession,
	    interval: 10000
	});
	
	//****************************************************************
	// Navigation Panel
	// Data 
	//****************************************************************
	var storeTree = new Ext.data.TreeStore({
		proxy: {
			type: 'ajax',
			url: 'interface/navigation/default_leftnav.ejs.php'
		},
	});
	
	//****************************************************************
	// Navigation Panel
	// Panel
	//****************************************************************    
	var Navigation = new Ext.tree.TreePanel({
		region: 'west',
		hideHeaders: true,
		useArrows: true,
		rootVisible: false,
		collapsible: true,
		store: storeTree,
		title: '<?php i18n("Navigation"); ?>',
		split: true,
		width: 200,
		root: {
			nodeType: 'async',
			draggable: false,
			id: 'source'
		}
	});
	
	// *************************************************************************************
	// Assign the changeLayout function to be called on tree node click.
	// *************************************************************************************
	Navigation.on('itemclick', function(dv, record, item, index, n){
		if ( record.data.id == '') { 
			//...
		} else {
			//----------------------------------------------------------------------
			// Loads the screen on the top panel
			//----------------------------------------------------------------------
			MainApp.body.load({loadMask: '<?php i18n("Loading", "e"); ?>',url: 'interface/' + record.data.id, scripts: true});
		}
	});
	// *************************************************************************************
	// Search for patient window
	// *************************************************************************************
	var winSearchPatient = new Ext.create('widget.window', {
		id				: 'winSearchPatient',
	    title			: 'Search for Patient',
	    width			: 700,
		height			: 400,
		closeAction		: 'hide',
	    plain			: true,
		modal			: false,
		resizable		: false,
	    bodyStyle		: 'background: #ffffff;',
	    items			: [],
	    dockedItems: [{
	  	  	xtype: 'toolbar',
		  	dock: 'bottom',
		  	items: [{
				id        : 'selectPatient',
			    text      : '<?php i18n("Select Patient"); ?>',
			    iconCls   : 'icoPatient',
			    handler   : function(){
			    	Ext.getCmp('patientButton').setText('<img src="ui_icons/32PatientFile.png" height="32" width="32" style="float:left">[Patient Name]<br>[Record Number]');
			    	Ext.getCmp('patientButton').enable();
					winSearchPatient.hide();
			    }
			},'-',{
			    id        : 'closePatient',
			    text      : '<?php i18n("Close"); ?>',
			    iconCls   : 'close',
			    handler: function(){ 
					winSearchPatient.hide();
			    }
		  	}]					    
	  	}]
	}); // End winLogon
	//****************************************************************
	// header Panel
	//
	// tag: ExtJS v4 Ready
	//****************************************************************
	var Header = Ext.create('Ext.Panel', {
		region		: 'north',
		height		: 44,
		split		: false,
		collapsible : false,
		frame		: false,
		border		: false,
		bodyStyle	: 'background: transparent',
		margins		: '0 0 0 0',
		items		: [{
			xtype: 'container',
			html: '<a href="http://www.mitosehr.org/" style="float:left"><img src="ui_app/app_logo.png" height="40" width="200" style="float:left"></a>',
			style:'float:left',
			border: false
		},{
			xtype	: 'button',
			id		: 'patientButton',
			text	: '<img src="ui_icons/32PatientFile.png" height="32" width="32" style="float:left">No<br>Patient',
			scale	: 'large',
			style 	: 'float:left',
			margin	: '0 0 0 5px',
			disabled : true,
			minWidth: 180,
			menu 	: Ext.create('Ext.menu.Menu', {
				items: [{
					text:'<?php i18n("New Encounter"); ?>'
				},{
					text:'<?php i18n("Appointments"); ?>'
				},{
					text:'<?php i18n("Patient Notes"); ?>'
				}]
			})
		},{
			xtype	: 'button',
			text	: 'Patient<br>Search',
			scale	: 'large',
			style 	: 'float:left',
			margin	: '0 0 0 5px',
			minWidth: 75,
			handler	: function(){
				winSearchPatient.show();
			}
		},{
			xtype: 'button',
			text: '<?php echo $_SESSION['user']['name'] ?>',
			iconCls: 'add',
			iconAlign: 'left',
			style : 'float:right',
			margin: '7 0 0 5',
			menu: [{
				text:'<?php i18n("My account"); ?>'
			},{
				text:'<?php i18n("My settings"); ?>'
			},{
				text:'<?php i18n("Logout"); ?>',
				handler: function(){
					Ext.Msg.show({
						title: '<?php i18n("Please confirm..."); ?>', 
						icon: Ext.MessageBox.QUESTION,
						msg:'<?php i18n("Are you sure to quit MitosEHR?"); ?>',
						buttons: Ext.Msg.YESNO,
						fn:function(btn,msgGrid){
							if(btn=='yes'){ window.location = "library/authProcedures/unauth.inc.php"; }
						}
					});
				}
			}]
		}]
	}); // End Header
	
	//****************************************************************
	// Main Panel
	//
	// tag: ExtJS v4 Ready
	//****************************************************************
	var MainApp = Ext.create('Ext.Panel', {
		region			: 'center',
		id				: 'MainApp', 
		border			: true,
		margins			: '0 0 0 0',
		bodyPadding		: 0,
		waitMsg			: '<?php i18n("Loading"); ?>',
		waitMsgTarget	: true,
		autoLoad		: {url: 'interface/dashboard/dashboard.ejs.php', scripts: true},
	}); // End MainApp
	
	//****************************************************************
	// TopPanel
	// Description: It will show up the main layouts
	//
	// tag: ExtJS v4 Ready
	//****************************************************************
	var TopPanel = Ext.create('Ext.Panel', {
		region			: 'center',
		id				: 'TopPanel',
		layout			: 'border',
		waitMsgTarget	: true,
		border			: false,
		margins			: '0 0 0 0',
		padding			: 0,
		bodyPadding		: 0,
		items			: [ MainApp ]
	}); // End TopPanel
	
	//****************************************************************
	// The main ViewPort
	// Description: It will display all the previuosly declared
	// panels above.
	//
	// tag: ExtJS v4 Ready 
	//****************************************************************
	Ext.create('Ext.Viewport', {
		layout: {
			type: 'border',
			padding: 2
		},
		defaults: { split: true },
		items: [ Header, Navigation, TopPanel ]
	}); // End ViewPort

}); // End App

</script>