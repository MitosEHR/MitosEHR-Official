<?php
if(!defined('_MitosEXEC')) die('No direct access allowed.');

/* Main Screen Application
 *
 * Description: This is the main application, with all the panels
 * also this is the viewport of the application, this will call 
 * all the app->screen panels
 *
 * version 0.0.3
 * revision: N/A
 * author: GI Technologies, 2011
 * 
 */
// Reset session count
$_SESSION['site']['flops'] = 0;
/*
 * Include the necessary libraries, so the web application
 * can work.
 */
include_once($_SESSION['site']['root'].'/lib/compressor/compressor.inc.php');
include_once($_SESSION['site']['root'].'/classes/dbHelper.class.php');
include_once($_SESSION['site']['root'].'/repo/global_settings/global_settings.php');
include_once($_SESSION['site']['root'].'/repo/global_functions/global_functions.php');
?>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<title><?php echo $_SESSION['global_settings']['mitosehr_name'] ?></title>
<script type="text/javascript" src="lib/<?php echo $_SESSION['dir']['ext']; ?>/bootstrap.js"></script>
<script type="text/javascript" src="repo/formValidation/formValidation.js"></script>
<script type="text/javascript" src="repo/global_functions/global_functions.js"></script>
<script type="text/javascript" src="lib/<?php echo $_SESSION['dir']['ext_cal'] ?>/Extensible.js"></script>
<!--test stuff-->
<link rel="stylesheet" type="text/css" href="ui_app/dashboard.css" >
<!--end test stuff-->
<link rel="stylesheet" type="text/css" href="themes/resources/css/<?php echo $_SESSION['global_settings']['css_header'] ?>">
<!--calendar css-->
<link rel="stylesheet" type="text/css" href="lib/<?php echo $_SESSION['dir']['ext_cal'] ?>/resources/css/calendar.css" />
<link rel="stylesheet" type="text/css" href="lib/<?php echo $_SESSION['dir']['ext_cal'] ?>/resources/css/calendar-colors.css" />
<!--ens calendar css-->
<link rel="stylesheet" type="text/css" href="ui_app/style_newui.css" >
<link rel="stylesheet" type="text/css" href="ui_app/mitosehr_app.css" >
<link rel="shortcut icon" href="favicon.ico" >
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
        'Extensible'        : 'lib/extensible-1.5.0-beta1/src',
        'Extensible.example': 'lib/extensible-1.5.0-beta1/examples'
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
    'Ext.mitos.RenderPanel',

    'Ext.mitos.SaveCancelWindow',
    'Ext.mitos.LivePatientSearch',
    'Ext.mitos.AuthorizationsComboBox',
    'Extensible.calendar.CalendarPanel',
    'Extensible.calendar.gadget.CalendarListPanel',
    'Extensible.calendar.data.MemoryCalendarStore',
    'Extensible.calendar.data.MemoryEventStore'

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
    		'Ext.mitos.RenderPanel',
    		'Ext.mitos.SaveCancelWindow',
	    	'Ext.mitos.AuthorizationsComboBox'
		],
		initComponent: function(){
	        /** @namespace Ext.QuickTips */
            Ext.QuickTips.init();
			// *************************************************************************************
			// Global Variables
			// *************************************************************************************
			var trp;
			app = this;
			// *************************************************************************************
			// Task Scheduler 
			// This will run certain task at determined time.
			// *************************************************************************************
			app.checkSession = function(){
				Ext.Ajax.request({
					url     : 'lib/authProcedures/chkAuth.inc.php',
					success : function(response, opts){
						if(response.responseText == 'exit'){ window.location="lib/authProcedures/unauth.inc.php"; }
					}
				});
			};
			// *************************************************************************************
			// TaskScheduler
			// This will run all the procedures inside the checkSession
			// *************************************************************************************
			Ext.TaskManager.start({
				run		    : app.checkSession,
				interval    : 100000
			});
			// *************************************************************************************
			// Navigation Panel Tree Data
			// *************************************************************************************
			app.storeTree = new Ext.data.TreeStore({
				proxy: {
					type	: 'ajax',
					url		: 'app/navigation/default_leftnav.ejs.php'
				}
			});
			// *************************************************************************************
			// Navigation Panel
			// *************************************************************************************
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
			// *************************************************************************************
			// The MitosEHR Support Button Link
			// *************************************************************************************
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
				app.MainApp.body.load({loadMask: '<?php i18n("Loading", "e"); ?>',url: 'app/' + record.data.hrefTarget, scripts: true});
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
					app.liveSearch = new Ext.create('Ext.mitos.LivePatientSearch',{
                        emptyText: '<?php i18n("Live Patient Search..."); ?>',
                        listeners: {
                            select: function(combo, selection) {
                                var post = selection[0];
                                if (post) {
                                    Ext.Ajax.request({
                                        url: Ext.String.format('classes/patient_search.class.php?task=set&pid={0}&pname={1}',post.get('pid'),post.get('patient_name') ),
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

			// *************************************************************************************
			// header Panel
			// *************************************************************************************
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
								text:'<?php i18n("New Encounter"); ?>',
                                handler:function(){
                                    app.searchWin.show();
                                }
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
							app.MainApp.body.load({loadMask: '<?php i18n("Loading", "e"); ?>',url: 'app/miscellaneous/my_account/my_account.ejs.php', scripts: true});
						}
					},{
						text:'<?php i18n("My settings"); ?>',
						handler: function(){
							app.MainApp.body.load({loadMask: '<?php i18n("Loading", "e"); ?>',url: 'app/miscellaneous/my_settings/my_settings.ejs.php', scripts: true});
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
									if(btn=='yes'){ window.location = "lib/authProcedures/unauth.inc.php"; }
								}
							});
						}
					}]
				}]
			}); // End Header
			// *************************************************************************************
			// Main Panel
			// *************************************************************************************
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
							if( trp = Ext.getCmp('RenderPanel')){
								var height = app.MainApp.getHeight();
								var width = app.MainApp.getWidth();
								trp.setSize( width , height );
							}
						}
					}	
				}
			}); // End MainApp
            // *************************************************************************************
			// Footer Panel
			// *************************************************************************************
	        app.Footer = Ext.create('Ext.container.Container', {
                height      : 18,
                split       : false,
                padding     : 3,
                region      : 'south',
                html        : '<div><p style="font-size: 10px"><a target="_blank" href="http://www.mitosehr.org/projects/mitosehr001">MitosEHR</a> (Electronic Health Records) is a Open source Web-Based Software | <a target="_blank" href="http://www.mitosehr.org/projects/mitosehr001/news">news</a> | <a target="_blank" href="http://www.mitosehr.org/projects/mitosehr001/wiki">wiki</a> | <a target="_blank" href="http://www.mitosehr.org/projects/mitosehr001/boards">forums</a> | <a target="_blank" href="http://www.mitosehr.org/projects/mitosehr001/issues">issues</a></p></div>'
            });
			// *************************************************************************************
			// The main ViewPort
			// Description: It will display all the previously declared
			// panels above.
			// *************************************************************************************
			Ext.create('Ext.Viewport', {
				layout: {
					type	: 'border',
					padding	: 2
				},
				defaults	: { split: true },
				items		: [ app.Header, app.navColumn, app.MainApp, app.Footer ]
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