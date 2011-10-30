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
<script type="text/javascript" src="lib/webcam_control/swfobject.js"></script>
<script type="text/javascript" src="repo/formValidation/formValidation.js"></script>
<script type="text/javascript" src="repo/global_functions/global_functions.js"></script>
<script type="text/javascript" src="lib/<?php echo $_SESSION['dir']['ext_cal'] ?>/src/Extensible.js"></script>
<script type="text/javascript" src="lib/<?php echo $_SESSION['dir']['ext_cal'] ?>/examples/examples.js"></script>
<!--test stuff-->
<link rel="stylesheet" type="text/css" href="ui_app/dashboard.css" >
<!--end test stuff-->
<link rel="stylesheet" type="text/css" href="themes/resources/css/<?php echo $_SESSION['global_settings']['css_header'] ?>">
<!--calendar css-->
<link rel="stylesheet" type="text/css" href="lib/<?php echo $_SESSION['dir']['ext_cal'] ?>/resources/css/calendar.css" />
<link rel="stylesheet" type="text/css" href="lib/<?php echo $_SESSION['dir']['ext_cal'] ?>/resources/css/calendar-colors.css" />
<link rel="stylesheet" type="text/css" href="lib/<?php echo $_SESSION['dir']['ext_cal'] ?>/examples/examples.css" />

<!--ens calendar css-->
<link rel="stylesheet" type="text/css" href="ui_app/style_newui.css" >
<link rel="stylesheet" type="text/css" href="ui_app/mitosehr_app.css" >
<link rel="shortcut icon" href="favicon.ico" >
<style type="text/css">
.mitos-mask {
    z-index:  300000;
}
.mitos-mask-msg {
    z-index:300001;
    left:   45%;
    top:    50%;
}
</style>
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
        'Ext.mitos.panel'   : 'app',
        'Extensible'        : 'lib/extensible-1.5.0/src',
        'Extensible.example': 'lib/extensible-1.5.0/examples'
    }
});

Ext.onReady(function() {

    Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));

	Ext.define('Ext.mitos.MitosApp',{
		extend:'Ext.container.Container',
		uses:[
			'Ext.grid.*',
			'Ext.data.*',
			'Ext.util.*',
			'Ext.state.*',
			'Ext.TaskManager.*',
		    'Ext.mitos.Window',
            'Ext.mitos.RenderPanel',
            'Extensible.calendar.CalendarPanel',
            'Extensible.calendar.gadget.CalendarListPanel',
            'Extensible.calendar.data.MemoryCalendarStore',
            'Extensible.calendar.data.MemoryEventStore',
            'Extensible.example.calendar.data.Events',
            'Extensible.example.calendar.data.Calendars',
            'Ext.mitos.combo.*',
            'Ext.mitos.combo.Languages',
            'Ext.mitos.combo.TransmitMedthod',
            'Ext.mitos.combo.InsurancePayerType'
                
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
			app.storeTree = Ext.data.TreeStore({
				proxy: {
					type	: 'ajax',
					url		: 'app/navigation/default_leftnav.ejs.php'
				}
			});
			
			// *************************************************************************************
			// Navigation Panel
			// *************************************************************************************
			app.Navigation = Ext.create('Ext.tree.TreePanel',{
				region		: 'center',
                stateId     : 'Navigation',
				bodyPadding : '5 0 0 0',
                cls         : 'nav_tree',
				hideHeaders	: true,
				rootVisible	: false,
				border      : false,
				store		: app.storeTree,
				width		: <?php echo $_SESSION["global_settings"]["gbl_nav_area_width"]; ?>,
				root		: {
					nodeType	: 'async',
					draggable	: false,
					id			: 'source'
				},
                listeners:{
                    itemclick:function(dv, record, item, index, node, event, n){
                        if(record.data.hrefTarget){

                            var card    = record.data.hrefTarget;
                            var layout  = app.MainPanel.getLayout();
                            layout.setActiveItem(card);

                            var currCard= Ext.getCmp(card);
                            currCard.loadStores();

                            // ************** //
                            // AMIMATION TEST //
                            // ************** //

                            //var first   = layout.getActiveItem();
                            //var second  = Ext.getCmp(card);

                            // ************* //
                            // Slide Out/In  //
                            // ************* //

                            //first.getEl().slideOut('r', {
                            //    duration: 150,
                            //    callback: function() {
                            //        layout.setActiveItem(second);
                            //       second.hide();
                            //        second.getEl().slideIn('r',{
                            //            duration: 200
                            //        });
                            //    }
                            //});

                            // *********** //
                            // Fade Out/In //
                            // *********** //
                            
                            //first.getEl().fadeOut({
                            //    duration: 500,
                            //    callback: function() {
                            //        layout.setActiveItem(second);
                            //        second.hide();
                            //       second.getEl().fadeIn({
                            //            duration: 500
                            //        });
                            //    }
                            //});
                        }
                    }
                }
			});
			
			// *************************************************************************************
			// MitosEHR Support Page
			// *************************************************************************************
			app.winSupport = Ext.create('Ext.window.Window', {
				width			: 1000,
				height			: 650,
				closeAction		: 'hide',
				bodyStyle		: 'background-color: #ffffff; padding: 5px;',
				modal			: false,
				resizable		: true,
				title			: 'Support',
				draggable		: true,
				closable		: true,
				maximizable		: true,
				headerPosition	: 'right',
				animateTarget	: 'support',
				autoScroll		: true,
                maximized       : true,
                dockedItems:{
                    xtype: 'toolbar',
        			dock: 'top',
                    items:['-',{
                        text:'Issues/Bugs',
                        iconCls:'list',
                        handler:function(){
                            showMiframe('http://mitosehr.org/projects/mitosehr001/issues');
                        }
                    },'-',{
                        text:'New Issue/Bug',
                        iconCls:'icoAddRecord',
                        handler:function(){
                            showMiframe('http://mitosehr.org/projects/mitosehr001/issues/new');
                        }
                    },'->',{
                        text:'Close',
                        iconCls:'close',
                        handler:function(){
                            app.winSupport.hide();
                        }
                    }]
                }
			}); // End winSupport

            function showMiframe(src){
                app.winSupport.remove(app.miframe);
                app.winSupport.add(
                        app.miframe = Ext.create('Ext.mitos.ManagedIframe',{
                            src:src  
                        })
            );
                app.winSupport.show();
            }
			// *************************************************************************************
			// The panel definition for the the TreeMenu & the support button
			// *************************************************************************************
			app.navColumn = Ext.create('Ext.panel.Panel', {
				title		: '<?php i18n("Navigation"); ?>',
                stateId     : 'navColumn',
				layout      : 'border',
				width		: <?php echo $_SESSION["global_settings"]["gbl_nav_area_width"]; ?>,
				region		: '<?php echo $_SESSION["global_settings"]["concurrent_layout"]; ?>',
				split		: true,
				collapsible	: true,
				items		: [app.Navigation],
				dockedItems: [{
        			xtype: 'toolbar',
        			dock: 'bottom',
        			padding: 5,
                    layout : {
                        type : 'hbox',
                        pack : 'center'
                    },
        			items: ['-',{
        				id: 'support',
        				xtype: 'button',
        				frame: true,
            			text: '<?php i18n("MithosEHR Support"); ?>',
            			iconCls: 'icoHelp',
						handler : function(){
                            showMiframe('http://mitosehr.org/projects/mitosehr001/wiki');
						}
        			},'-']
    			}]
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
					app.liveSearch = Ext.create('Ext.mitos.LivePatientSearch',{
                        emptyText: '<?php i18n("Live Patient Search..."); ?>',
                        listeners: {
                            select: function(combo, selection) {
                                var post = selection[0];
                                if (post) {
                                    Ext.Ajax.request({
                                        url: Ext.String.format('classes/patient_search.class.php?task=set&pid={0}&pname={1}',post.get('pid'),post.get('patient_name') ),
                                        success: function(response, opts){
                                            var newPatientBtn = Ext.String.format('<img src="ui_icons/32PatientFile.png" height="32" width="32" style="float:left"><strong>{0}</strong><br>Record ({1})', post.get('patient_name'), post.get('pid'));
                                            //app.patientButton.setText( newPatientBtn );
                                            app.patientButton.update( {name:post.get('patient_name'), info:'('+post.get('pid')+')'} );
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
			app.Header = Ext.create('Ext.container.Container', {
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
						//text	: '<img src="ui_icons/32PatientFile.png" height="32" width="32" style="float:left">No Patient<br>Selected',
						scale	: 'large',
						style 	: 'float:left',
						margin	: '0 0 0 5px',
						disabled: true,
						minWidth: 190,
                        listeners:{
                            afterrender:function(){
                                this.update({name:'No Patient Selected', info:'(record number)'})
                            }
                        },
                        tpl: Ext.create('Ext.XTemplate',
                            '<div class="patient_btn">',
                                '<div class="patient_btn_img"><img src="ui_icons/user_32.png"></div>',
                                '<div class="patient_btn_info">',
                                    '<div class="patient_btn_name">{name}</div>',
                                    '<div class="patient_btn_record">{info}</div>',
                                '</div>',
                            '</div>',
                            {
                            defaultValue: function(v){
                                return v ? v : 'No Patient Selected';
                            }
                        }
                        ),
						menu 	: Ext.create('Ext.menu.Menu', {
							items: [{
								text:'<?php i18n("New Encounter"); ?>',
                                handler:function(){

                                }
							},{
								text:'<?php i18n("Past Encounter List"); ?>',
                                handler:function(){

                                }
							},{
								text:'<?php i18n("Patient Notes"); ?>',
                                handler:function(){

                                }
							}]
						})
					})
				, app.searchPanel,
				{
					xtype		: 'button',
					text		: '<?php echo $_SESSION["user"]["name"]; ?>',
					iconCls		: 'icoInjection',
					iconAlign	: 'left',
					style 		: 'float:right',
					margin		: '7 0 0 5',
					menu: [{
						text:'<?php i18n("My account"); ?>',
                        iconCls		: 'icoArrow',
						handler: function(){
							app.MainPanel.getLayout().setActiveItem('panelMyAccount');
						}
					},{
						text:'<?php i18n("My settings"); ?>',
                        iconCls		: 'icoArrow',
						handler: function(){
                            app.MainPanel.getLayout().setActiveItem('panelMySettings');
                        }
					},{
						text:'<?php i18n("Logout"); ?>',
                        iconCls		: 'icoArrow',
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
			app.MainPanel = Ext.create('Ext.container.Container', {
				id 				: 'MainApp',
				region			: 'center',
                layout          : 'card',
				border			: true,
				margins			: 0,
				padding			: 0,
                deferredRender  : true,
                defaults        : { layout: 'fit', xtype:'container' },
                items: [
                    Ext.create('Ext.mitos.panel.dashboard.Dashboard'),                      // done panels TODO
                    Ext.create('Ext.mitos.panel.calendar.Calendar'),                        // done
                    Ext.create('Ext.mitos.panel.messages.Messages'),                        // done

                    Ext.create('Ext.mitos.panel.patientfile.new.NewPatient'),
                    Ext.create('Ext.mitos.panel.patientfile.summary.Summary'),
                    Ext.create('Ext.mitos.panel.patientfile.visits.Visits'),
                    Ext.create('Ext.mitos.panel.fees.billing.Billing'),
                    Ext.create('Ext.mitos.panel.fees.checkout.Checkout'),
                    Ext.create('Ext.mitos.panel.fees.fees_sheet.FeesSheet'),
                    Ext.create('Ext.mitos.panel.fees.payments.Payments'),
                    Ext.create('Ext.mitos.panel.administration.facilities.Facilities'),
                    Ext.create('Ext.mitos.panel.administration.globals.Globals'),           // done
                    Ext.create('Ext.mitos.panel.administration.layout.Layout'),
                    //Ext.create('Ext.mitos.panel.administration.lists.Lists'),
                    Ext.create('Ext.mitos.panel.administration.log.Log'),                   // done
                    Ext.create('Ext.mitos.panel.administration.practice.Practice'),         // Working
                    Ext.create('Ext.mitos.panel.administration.roles.Roles'),
                    Ext.create('Ext.mitos.panel.administration.services.Services'),
                    Ext.create('Ext.mitos.panel.administration.users.Users'),
                    Ext.create('Ext.mitos.panel.miscellaneous.addressbook.Addressbook'),
                    Ext.create('Ext.mitos.panel.miscellaneous.myaccount.MyAccount'),
                    Ext.create('Ext.mitos.panel.miscellaneous.mysettings.MySettings'),
                    Ext.create('Ext.mitos.panel.miscellaneous.officenotes.OfficeNotes'),
                    Ext.create('Ext.mitos.panel.miscellaneous.websearch.Websearch')

                ]
			}); // End MainApp
            // *************************************************************************************
			// Footer Panel
			// *************************************************************************************
	        app.Footer = Ext.create('Ext.container.Container', {
                height      : 30,
                split       : false,
                padding     : '3 0',
                region      : 'south',
                items       : [{
                    xtype: 'toolbar',
        			dock: 'bottom',
        			items: [{
            			text: '<?php i18n("Copyright (C) 2011 MitosEHR (Electronic Health Records) |:|  Open Source Software operating under GPLv3 "); ?>',
                        iconCls: 'icoGreen',
                        disabled:true,
						handler : function(){
                            showMiframe('http://mitosehr.org/projects/mitosehr001');
						}
                    },'->',{
                        text: '<?php i18n("news"); ?>',
                        handler: function(){
                            showMiframe('http://mitosehr.org/projects/mitosehr001/news');
                        }
                    },'-',{
                        text: '<?php i18n("wiki"); ?>',
                        handler: function(){
                            showMiframe('http://mitosehr.org/projects/mitosehr001/wiki');
                        }
                    },'-',{
                        text: '<?php i18n("issues"); ?>',
                        handler: function(){
                            showMiframe('http://mitosehr.org/projects/mitosehr001/issues');
                        }
                    },'-',{
                        text: '<?php i18n("forums"); ?>',
                        handler: function(){
                            showMiframe('http://mitosehr.org/projects/mitosehr001/boards');
                        }
        			}]
                }]
            });
			// *************************************************************************************
			// The main ViewPort
			// Description: It will display all the previously declared
			// panels above.
			// *************************************************************************************
			Ext.create('Ext.Viewport', {
				layout      : { type: 'border', padding	: 2 },
				defaults	: { split: true },
				items		: [ app.Header, app.navColumn, app.MainPanel, app.Footer ],
                listeners:{
                    afterrender:function(){
                        Ext.get('mainapp-loading').remove();
                        Ext.get('mainapp-loading-mask').fadeOut({remove:true});
                    }
                }
			}); // End ViewPort
			app.callParent(arguments);
		} // end of initComponent
	}); //end MitosApp class
    Ext.create('Ext.mitos.MitosApp');
}); // End App
</script>
</head>
    <body>
        <div id="mainapp-loading-mask" class="x-mask mitos-mask"></div>
        <div id="mainapp-x-mask-msg">
            <div id="mainapp-loading" class="x-mask-msg mitos-mask-msg">
                <div>Loading MitosEHR...</div>
            </div>
        </div>
        <span id="app-msg" style="display:none;"></span>
    </body>
</html>