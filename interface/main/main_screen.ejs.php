<?php
if(!defined('_MitosEXEC')) die('No direct access allowed.');

/* Main Screen Application
 *
 * Description: This is the main application, with all the panels
 * also this is the viewport of the application, this will call 
 * all the interface->screen panels
 *
 * version 0.0.3
 * revision: N/A
 * author: Gino Rivera Falú
 * 
 */

// Reset session count
$_SESSION['site']['flops'] = 0;

/* 
 * 
 * Include the necesary libraries, so the web application 
 * can work.
 * 
 */
include_once($_SESSION['site']['root'].'/library/compressor/compressor.inc.php');
include_once($_SESSION['site']['root'].'/library/dbHelper/dbHelper.inc.php');
include_once($_SESSION['site']['root'].'/repository/global_settings/global_settings.php');
include_once($_SESSION['site']['root'].'/repository/global_functions/global_functions.php');
?>

<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<title><?php echo $_SESSION['global_settings']['mitosehr_name'] ?></title>
<script type="text/javascript" src="<?php $_SESSION['site']['root'] ?>library/<?php echo $_SESSION['dir']['ext']; ?>/bootstrap.js"></script>
<script type="text/javascript" src="<?php $_SESSION['site']['root'] ?>repository/formValidation/formValidation.js"></script>
<script type="text/javascript" src="<?php $_SESSION['site']['root'] ?>repository/global_functions/global_functions.js"></script>
<script type="text/javascript" src="<?php $_SESSION['site']['root'] ?>library/extensible-1.0/Extensible.js"></script>

<!--test stuff-->
<link rel="stylesheet" type="text/css" href="<?php $_SESSION['site']['root'] ?>ui_app/dashboard.css" >
<!--end test stuff-->

<link rel="stylesheet" type="text/css" href="<?php $_SESSION['site']['root'] ?>themes/resources/css/<?php echo $_SESSION['global_settings']['css_header'] ?>">

<!--calendar css-->
<link rel="stylesheet" type="text/css" href="<?php $_SESSION['site']['root'] ?>library/extensible-1.0/resources/css/calendar.css" />
<link rel="stylesheet" type="text/css" href="<?php $_SESSION['site']['root'] ?>library/extensible-1.0/resources/css/calendar-colors.css" />
<!--ens calendar css-->

<link rel="stylesheet" type="text/css" href="<?php $_SESSION['site']['root'] ?>ui_app/style_newui.css" >
<link rel="stylesheet" type="text/css" href="<?php $_SESSION['site']['root'] ?>ui_app/mitosehr_app.css" >
<link rel="shortcut icon" href="<?php $_SESSION['site']['root'] ?>favicon.ico" >
<!--dashboard css-->
<link rel="stylesheet" type="text/css" href="<?php $_SESSION['site']['root'] ?>ui_app/dashboard.css" >
<!--main ExtJs css-->
<link rel="stylesheet" type="text/css" href="<?php $_SESSION['site']['root'] ?>themes/resources/css/<?php echo $_SESSION['global_settings']['css_header'] ?>">
<!--calendar css-->
<link rel="stylesheet" type="text/css" href="<?php $_SESSION['site']['root'] ?>library/extensible-1.0/resources/css/calendar.css" />
<!--calendar css-->
<link rel="stylesheet" type="text/css" href="<?php $_SESSION['site']['root'] ?>library/extensible-1.0/resources/css/calendar-colors.css" />

<!--app css-->
<link rel="stylesheet" type="text/css" href="<?php $_SESSION['site']['root'] ?>ui_app/style_newui.css" >
<link rel="stylesheet" type="text/css" href="<?php $_SESSION['site']['root'] ?>ui_app/mitosehr_app.css" >

<link rel="shortcut icon" href="<?php $_SESSION['site']['root'] ?>favicon.ico" >

<script type="text/javascript">

// *************************************************************************************
// Set the path for the components, so the application can find them.
// *************************************************************************************
Ext.Loader.setConfig({
    enabled			: true,
    disableCaching	: false,
    paths			: {
        'Ext.ux'            : '<?php echo $_SESSION["dir"]["ext_classes"]; ?>/ux',
        'Ext.mitos'         : '<?php echo $_SESSION["dir"]["ext_classes"]; ?>/mitos',
        'Extensible'        : 'library/extensible-1.0/src',
        'Extensible.example': 'library/extensible-1.0/examples'
    }
});

Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.state.*',
    'Ext.toolbar.Paging',
    'Ext.TaskManager.*',
    'Ext.ux.SlidingPager',
    'Ext.mitos.CRUDStore',
    'Ext.mitos.Window',
    'Ext.mitos.GridPanel',
    'Ext.mitos.FormPanel',
    'Ext.mitos.TopRenderPanel',
    'Ext.mitos.SaveCancelWindow',
    'Ext.mitos.AuthorizationsComboBox'
]);

Ext.onReady(function() {

	Ext.define('Ext.mitos.MitosApp',{
		extend:'Ext.panel.Panel',
		uses:[
			'Ext.grid.*',
			'Ext.data.*',
			'Ext.util.*',
			'Ext.state.*',
			'Ext.toolbar.Paging',
			'Ext.TaskManager.*',
			'Ext.ux.SlidingPager',
		    'Ext.mitos.CRUDStore',
		    'Ext.mitos.Window',
    		'Ext.mitos.GridPanel',
    		'Ext.mitos.FormPanel',
    		'Ext.mitos.TopRenderPanel',
    		'Ext.mitos.SaveCancelWindow',
	    	'Ext.mitos.AuthorizationsComboBox'
		],
		initComponent: function(){
		
            /** @namespace Ext.QuickTips */
            Ext.QuickTips.init();

			//****************************************************************
			// Global Variables
			//****************************************************************
			var trp;
			var app = this;
			
			//****************************************************************
			// Task Scheduler 
			// This will run certain task at determined time.
			//****************************************************************
			app.checkSession = function(){
				Ext.Ajax.request({
					url: 'library/authProcedures/chkAuth.inc.php',
					success: function(response, opts){
						if(response.responseText == 'exit'){ window.location="library/authProcedures/unauth.inc.php"; }
					}
				});
			};
			
			//****************************************************************
			// TaskScheduler
			// This will run all the procedures inside the checkSession
			//****************************************************************
			Ext.TaskManager.start({
				run		: app.checkSession,
				interval: 100000
			});
	
			//****************************************************************
			// Navigation Panel Tree Data
			//****************************************************************
			app.storeTree = new Ext.data.TreeStore({
				proxy: {
					type	: 'ajax',
					url		: 'interface/navigation/default_leftnav.ejs.php'
				}
			});
	
			//****************************************************************
			// Navigation Panel
			//****************************************************************    
			app.Navigation = new Ext.create('Ext.tree.TreePanel',{
				region		: 'center',
				bodyPadding : '5 0',
				hideHeaders	: true,
				useArrows	: true,
				rootVisible	: false,
				border      : false,
				store		: app.storeTree,
				split		: true,
				width		: <?php echo $_SESSION["global_settings"]["gbl_nav_area_width"]; ?>,
				root		: {
					nodeType	: 'async',
					draggable	: false,
					id			: 'source'
				}
			});
			
			//****************************************************************
			// The MitosEHR Support Button Link
			//****************************************************************
			app.navColumnlinks = Ext.create('Ext.panel.Panel', {
				region		: 'south',
				border      : false,
				items       : [{
					xtype	: 'button',
					text	: '<?php i18n("MithosEHR Support"); ?>',
					scale	: 'large',
					margin	: '5px 10px',
					minWidth: 170,
					handler : function(){
						window.location = '<?php echo $_SESSION["global_settings"]["online_support_link"]; ?>';
					}
				}]
			});

			// ************************************************************************************* 
			// The panel definition for the the TreeMenu & the support button
			// *************************************************************************************
			app.navColumn = Ext.create('Ext.panel.Panel', {
				title		: '<?php i18n("Navigation"); ?>',
				layout      : 'border',
				width		: <?php echo $_SESSION["global_settings"]["gbl_nav_area_width"]; ?>,
				region		: '<?php echo $_SESSION["global_settings"]["concurrent_layout"]; ?>',
				split		: true,
				collapsible	: true,
				items       : [app.Navigation, app.navColumnlinks]
			});
			
			// *************************************************************************************
			// Load the selected menu item into the main application panel
			// *************************************************************************************
			app.Navigation.on('itemclick', function(dv, record, item, index, n){
				app.MainApp.body.load({loadMask: '<?php i18n("Loading", "e"); ?>',url: 'interface/' + record.data.hrefTarget, scripts: true});
			});
	
			// *************************************************************************************
			// Search for patient...
			// *************************************************************************************
			if (!Ext.ModelManager.isRegistered('Post')){
				Ext.define("Post", {
					extend: 'Ext.data.Model',
					proxy: {
						type	: 'ajax',
						url 	: 'library/patient/patient_search.inc.php?task=search',
						reader: {
							type			: 'json',
							root			: 'row',
							totalProperty	: 'totals'
						}
					},
					fields: [
						{name: 'id', 			type: 'int'},
						{name: 'pid', 			type: 'int'},
						{name: 'pubpid', 		type: 'int'},
						{name: 'patient_name', 	type: 'string'},
						{name: 'patient_dob', 	type: 'string'},
						{name: 'patient_ss', 	type: 'string'}
					]
				});
			}
			
			// *************************************************************************************
			// Live Search data store
			// *************************************************************************************
    		app.searchStore = Ext.create('Ext.data.Store', {
				pageSize	: 10,
				model		: 'Post'
			});
			
			// *************************************************************************************
			// Panel for the live search
			// *************************************************************************************
			app.searchPanel = Ext.create('Ext.panel.Panel', {
				width		: 400,
				bodyPadding	: '8 11 5 11',
				margin		: '0 5',
				style 		: 'float:left',
				layout		: 'anchor',
				items: [
					app.liveSearch = new Ext.create('Ext.form.ComboBox',{
						store		: app.searchStore,
						displayField: 'title',
						emptyText	: '<?php i18n("Live patient search..."); ?>',
						typeAhead	: false,
						hideLabel	: true,
						hideTrigger	: true,
						minChars	: 1,
						anchor		: '100%',
						listConfig: {
							loadingText	: '<?php i18n("Searching..."); ?>',
							emptyText	: '<?php i18n("No matching posts found."); ?>',
							//---------------------------------------------------------------------
							// Custom rendering template for each item
							//---------------------------------------------------------------------
							getInnerTpl: function() {
								return '<div class="search-item"><h3><span>{patient_name}</span>&nbsp;&nbsp;({pid})</h3>DOB:&nbsp;{patient_dob}&nbsp;SS:&nbsp;{patient_ss}</div>';
							}
						},
						pageSize: 10,
            			//--------------------------------------------------------------------------
            			// override default onSelect to do redirect
            			//--------------------------------------------------------------------------
						listeners: {
							select: function(combo, selection) {
								var post = selection[0];
								if (post) {
									Ext.Ajax.request({
										url: Ext.String.format('library/patient/patient_search.inc.php?task=set&pid={0}&pname={1}',post.get('pid'),post.get('patient_name') ),
										success: function(response, opts){
											var newPatientBtn = Ext.String.format('<img src="ui_icons/32PatientFile.png" height="32" width="32" style="float:left"><strong>{0}</strong><br>Record ({1})', post.get('patient_name'), post.get('pid'));
											app.patientButton.setText( newPatientBtn );
											app.patientButton.enable();
										}
									});
									Ext.data.Request()
								}
                			},
							blur: function(){
								app.liveSearch.reset();
							} 
						}
					})
				]
			}); // END Search for patient.
    
			//****************************************************************
			// header Panel
			//****************************************************************
			app.Header = Ext.create('Ext.Panel', {
				region		: 'north',
				height		: 44,
				split		: false,
				collapsible : false,
				frame		: false,
				border		: false,
				bodyStyle	: 'background: transparent',
				margins		: '0 0 0 0',
				items		: [{
					xtype	: 'container',
					html	: '<a href="http://www.mitosehr.org/" style="float:left"><img src="ui_app/app_logo.png" height="40" width="200" style="float:left"></a>',
					style	: 'float:left',
					border	:	false
				},
					app.patientButton = new Ext.create('Ext.Button', {
						text	: '<img src="ui_icons/32PatientFile.png" height="32" width="32" style="float:left">No Patient<br>Selected',
						scale	: 'large',
						style 	: 'float:left',
						margin	: '0 0 0 5px',
						disabled: true,
						minWidth: 190,
						menu 	: Ext.create('Ext.menu.Menu', {
							items: [{
								text:'<?php i18n("New Encounter"); ?>'
							},{
								text:'<?php i18n("Past Encounter List"); ?>'
							},{
								text:'<?php i18n("Patient Notes"); ?>'
							}]
						})
					})
				, app.searchPanel,
				{
					xtype		: 'button',
					text		: '<?php echo $_SESSION["user"]["name"]; ?>',
					iconCls		: 'add',
					iconAlign	: 'left',
					style 		: 'float:right',
					margin		: '7 0 0 5',
					menu: [{
						text:'<?php i18n("My account"); ?>',
						handler: function(){
							app.MainApp.body.load({loadMask: '<?php i18n("Loading", "e"); ?>',url: 'interface/miscellaneous/my_account/my_account.ejs.php', scripts: true});
						}
					},{
						text:'<?php i18n("My settings"); ?>',
						handler: function(){
							app.MainApp.body.load({loadMask: '<?php i18n("Loading", "e"); ?>',url: 'interface/miscellaneous/my_settings/my_settings.ejs.php', scripts: true});
						}
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
			//****************************************************************
			app.MainApp = Ext.create('Ext.Panel', {
				id 				: 'MainApp',
				region			: 'center',
				border			: true,
				margins			: '0 0 0 0',
				bodyPadding		: 0,
				waitMsg			: '<?php i18n("Loading"); ?>',
				waitMsgTarget	: true,
				autoLoad		: {url: '<?php echo $_SESSION["global_settings"]["default_top_pane"]; ?>', scripts: true},
				listeners		: {
					resize 		: {
						fn		: function(){
							if( trp = Ext.getCmp('topRenderPanel')){
								var height = app.MainApp.getHeight();
								var width = app.MainApp.getWidth();
								trp.setSize( width , height );
							}
						}
					}	
				}
			}); // End MainApp
	
			//****************************************************************
			// The main ViewPort
			// Description: It will display all the previously declared
			// panels above.
			//****************************************************************
			Ext.create('Ext.Viewport', {
				layout: {
					type	: 'border',
					padding	: 2
				},
				defaults	: { split: true },
				items		: [ app.Header, app.navColumn, app.MainApp ]
			}); // End ViewPort
			app.callParent(arguments);
				
		} // end of initComponent
		
	}); //end MitosApp class
    Ext.create('Ext.mitos.MitosApp');

}); // End App

</script>

</head>
<body><span id="app-msg" style="display:none;"></span></body>
</html>