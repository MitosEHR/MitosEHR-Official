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
// Reset session count
$_SESSION['site']['flops'] = 0;
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
<link rel="stylesheet" type="text/css" href="<?php $_SESSION['site']['root'] ?>ui_app/dashboard.css" ><!--dashboard css-->
<link rel="stylesheet" type="text/css" href="<?php $_SESSION['site']['root'] ?>themes/resources/css/<?php echo $_SESSION['global_settings']['css_header'] ?>"><!--main ExtJs css-->
<link rel="stylesheet" type="text/css" href="<?php $_SESSION['site']['root'] ?>library/extensible-1.0/resources/css/calendar.css" /><!--calendar css-->
<link rel="stylesheet" type="text/css" href="<?php $_SESSION['site']['root'] ?>library/extensible-1.0/resources/css/calendar-colors.css" /><!--calendar css-->
<link rel="stylesheet" type="text/css" href="<?php $_SESSION['site']['root'] ?>ui_app/style_newui.css" ><!--app css-->
<link rel="stylesheet" type="text/css" href="<?php $_SESSION['site']['root'] ?>ui_app/mitosehr_app.css" ><!--app css-->
<link rel="shortcut icon" href="<?php $_SESSION['site']['root'] ?>favicon.ico" >
<script type="text/javascript">
// *************************************************************************************
// Sencha trying to be like a language
// using required to load different components
// *************************************************************************************
Ext.Loader.setConfig({
    enabled: true,
    disableCaching: false,
    paths: {
        'Ext.ux'            : '<?php echo $_SESSION['dir']['ext_classes']; ?>/ux',
        'Ext.mitos'         : '<?php echo $_SESSION['dir']['ext_classes']; ?>/mitos',
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
    // mitos custom classes
    'Ext.mitos.CRUDStore',
    'Ext.mitos.Window',
    'Ext.mitos.GridPanel',
    'Ext.mitos.FormPanel',
    'Ext.mitos.TopRenderPanel',
    'Ext.mitos.SaveCancelWindow',
    'Ext.mitos.RolesComboBox',
    'Ext.mitos.TypesComboBox',
    'Ext.mitos.TitlesComboBox',
    'Ext.mitos.CodeTypesComboBox',
    'Ext.mitos.FacilitiesComboBox',
    'Ext.mitos.AuthorizationsComboBox'
]);
Ext.onReady(function() {
    var trp;
    var app = this;
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
	};
	Ext.TaskManager.start({
	    run: checkSession,
	    interval: 100000
	});
	
	//****************************************************************
	// Navigation Panel
	// Data 
	//****************************************************************
	var storeTree = new Ext.data.TreeStore({
		proxy: {
			type	: 'ajax',
			url		: 'interface/navigation/default_leftnav.ejs.php'
		}
	});
	
	//****************************************************************
	// Navigation Panel
	// Panel
	//****************************************************************    
    var Navigation = new Ext.create('Ext.tree.TreePanel',{
		region		: 'center',
        bodyPadding  : '5 0',
		hideHeaders	: true,
		useArrows	: true,
		rootVisible	: false,
		border      : false,
		store		: storeTree,
		split		: true,
		width		: <?php echo $_SESSION['global_settings']['gbl_nav_area_width'] ?>,
		root: {
			nodeType	: 'async',
			draggable	: false,
			id			: 'source'
		}
	});
    
    var navColumnlinks = Ext.create('Ext.panel.Panel', {
        region		: 'south',
        border      : false,
        items       : [{
            xtype	: 'button',
			text	: 'MithosEHR Support',
			scale	: 'large',
			margin	: '5px 10px',
			minWidth: 170,
            handler : function(){
			    window.location = '<?php echo $_SESSION['global_settings']['online_support_link']?>';
            }
        }]
    });

	var navColumn = Ext.create('Ext.panel.Panel', {
        title		: '<?php i18n("Navigation"); ?>',
        layout      : 'border',
        width		: <?php echo $_SESSION['global_settings']['gbl_nav_area_width'] ?>,
        region		: '<?php echo $_SESSION['global_settings']['concurrent_layout'] ?>',
        split		: true,
        collapsible	: true,
        items       : [Navigation, navColumnlinks]
    });
	// *************************************************************************************
	// Assign the changeLayout function to be called on tree node click.
	// *************************************************************************************
	Navigation.on('itemclick', function(dv, record, item, index, n){
		if ( record.data.hrefTarget == '') { 
			//...
		} else {
			//----------------------------------------------------------------------
			// Loads the screen on the top panel
			//----------------------------------------------------------------------
			MainApp.body.load({loadMask: '<?php i18n("Loading", "e"); ?>',url: 'interface/' + record.data.hrefTarget, scripts: true});
		}
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
    var ds = Ext.create('Ext.data.Store', {
        pageSize	: 10,
        model		: 'Post'
    });
	var searchPanel = Ext.create('Ext.panel.Panel', {
        width		: 400,
        bodyPadding	: '8 11 5 11',
        margin		: '0 5',
        style 		: 'float:left',
      	layout		: 'anchor',
        items: [{
            xtype		: 'combo',
            id			: 'liveSearch',
            store		: ds,
            displayField: 'title',
            emptyText	: 'Live patient search...',
            typeAhead	: false,
            hideLabel	: true,
            hideTrigger	:true,
            minChars	: 1,
            anchor		: '100%',
            listConfig: {
                loadingText	: 'Searching...',
                emptyText	: 'No matching posts found.',
                //---------------------------------------------------------------------
                // Custom rendering template for each item
                //---------------------------------------------------------------------
                getInnerTpl: function() {
                    return '<div class="search-item">' +
                        '<h3><span>{patient_name}</span>  ({pid})</h3>' +
                        'DOB: {patient_dob} SS: {patient_ss}' +
                    '</div>';
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
		                        Ext.getCmp('patientButton').setText( newPatientBtn );
				    			Ext.getCmp('patientButton').enable();
					    	}
						});
		    			Ext.data.Request()
                    }
                },
                blur: function(){
                 Ext.getCmp('liveSearch').reset();
                } 
            }
        }]
    });
    
	//****************************************************************
	// header Panel
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
		}, searchPanel, {
			xtype		: 'button',
			text		: '<?php echo $_SESSION['user']['name'] ?>',
			iconCls		: 'add',
			iconAlign	: 'left',
			style 		: 'float:right',
			margin		: '7 0 0 5',
			menu: [{
				text:'<?php i18n("My account"); ?>',
				handler: function(){
				MainApp.body.load({loadMask: '<?php i18n("Loading", "e"); ?>',url: 'interface/miscellaneous/my_account/my_account.ejs.php', scripts: true});
				}
			},{
				text:'<?php i18n("My settings"); ?>',
				handler: function(){
				MainApp.body.load({loadMask: '<?php i18n("Loading", "e"); ?>',url: 'interface/miscellaneous/my_settings/my_settings.ejs.php', scripts: true});
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
	//
	// tag: ExtJS v4 Ready
	//****************************************************************
	MainApp = Ext.create('Ext.Panel', {
		region			: 'center',
		id				: 'MainApp', 
		border			: true,
		margins			: '0 0 0 0',
		bodyPadding		: 0,
		waitMsg			: '<?php i18n("Loading"); ?>',
		waitMsgTarget	: true,
		autoLoad		: {url: '<?php echo $_SESSION['global_settings']['default_top_pane'] ?>', scripts: true},
		listeners		: {
			resize 		: {
				fn		: function(){
					if( trp = Ext.getCmp('topRenderPanel')){
						var height = this.getHeight();
						var width = this.getWidth();
						trp.setSize( width , height );
					}
				}
			}	
		}
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
			type	: 'border',
			padding	: 2
		},
		defaults	: { split: true },
		items		: [ Header, navColumn, TopPanel ]
	}); // End ViewPort

}); // End App

</script>
</head>
<body><span id="app-msg" style="display:none;"></span></body>
</html>