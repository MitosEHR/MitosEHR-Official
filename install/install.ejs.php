<?php
if(!defined('_MitosEXEC')) die('No direct access allowed.');
/* Main Screen Application
* Description: Installation screen procedure
* version 0.0.1
* revision: N/A
* author: Ernesto J Rodriguez - MitosEHR
*/
?>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<title>MitosEHR :: Installation</title>
<script type="text/javascript" src="library/<?php echo $_SESSION['dir']['ext']; ?>/bootstrap.js"></script>
<script type="text/javascript" src="repository/global_functions/global_functions.js"></script>
<link rel="stylesheet" type="text/css" href="library/<?php echo $_SESSION['dir']['ext']; ?>/resources/css/ext-all.css">
<link rel="stylesheet" type="text/css" href="ui_app/style_newui.css" >
<link rel="stylesheet" type="text/css" href="ui_app/mitosehr_app.css" >
<script type="text/javascript">
Ext.require(['*']);
Ext.onReady(function() {
/////////////////////////////// TEST AREA //////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////

	// *************************************************************************************
	// Structure, data for storeReq
	// AJAX -> requirements.ejs.php
	// *************************************************************************************
	Ext.define("Requirements", {extend: "Ext.data.Model",
		fields: [
			{name: 'msg',     type: 'string'},
	        {name: 'status',  type: 'string'}
		]
	});
	function status(val) {
	    if (val == 'Ok') {
	        return '<span style="color:green;">' + val + '</span>';
	    } else {
	        return '<span style="color:red;">' + val + '</span>';
	    }
	    return val;
	}
	var storeSites = new Ext.data.Store({
		model: 'Requirements',
		proxy: {
			type: 'ajax',
			url: 'install/requirements.ejs.php',
			reader: {
				type: 'json'
			}
		},
		autoLoad: true
	});

	// *************************************************************************************
	// grid to show all the requirements status
	// *************************************************************************************
	var reqGrid = new Ext.grid.GridPanel({
		id : 'reqGrid',
	    store: storeSites,
	    frame: false,
	    border: false,
	    viewConfig: {stripeRows: true},
	    columns: [{
	        text     	: 'Requirements',
	        flex     	: 1,
	        sortable 	: false, 
	        dataIndex	: 'msg'
	    },{
	        text     	: 'Status', 
	        width    	: 150, 
	        sortable 	: true,
	        renderer 	: status,
	        dataIndex	: 'status'
	    }]
	});
	
	// *************************************************************************************
	// The Copyright Notice Window
	// *************************************************************************************
	var winCopyright = Ext.create('widget.window', {
		id				: 'winCopyright',
		width			: 800,
		height			: 500,
		closeAction		: 'hide',
		bodyStyle		: 'background-color: #ffffff; padding: 5px;',
		modal			: false,
		resizable		: true,
		title			: 'MitosEHR Copyright Notice',
		draggable		: true,
		closable		: true,
		autoLoad		: 'gpl-licence-en.html',
		autoScroll		: true,
		dockedItems: [{
			dock: 'bottom',
			frame: false,
			border: false,
			buttons: [{
		        text: 'I Agree',
		        id: 'btn_agree',
		        margin: '0 5',
				name: 'btn_reset',
				handler: function() {
		            winCopyright.hide();
		            winSiteSetup.show();
		        }
			}, '-',{
				text: 'Do Not Agree',
		        id: 'btn_notAgree',
		        margin: '0 10 0 5',
				name: 'btn_reset',
				handler: function() {
		            formLogin.getForm().reset();
		        }
			}]
		}]
	});
	winCopyright.show();
	
	// *************************************************************************************
	// Install proccess form
	// *************************************************************************************
	var formInstall = Ext.create('Ext.form.Panel', {
		id				: 'formInstall',
        bodyStyle		:'padding:5px',
        border			: false,
        layout			: 'fit',
        fieldDefaults	: {
            labelAlign	: 'top',
            msgTarget	: 'side'
        },
        defaults		: {
            anchor		: '100%'
        },
        items: [{
            xtype:'tabpanel',
            id: 'tabsInstall',
            plain:true,
            border	: false,
            activeTab: 0,
            height:350,
            defaults:{bodyStyle:'padding:10px'},
            items:[{
                title:'Instructions',
                defaults: {width: 230},
                defaultType: 'textfield',
                items: [{
                  
                }],
		        buttons: [{
		            text: 'Next',
		            handler: function() {
		            	Ext.getCmp('clinicInfo').enable();
						Ext.getCmp('tabsInstall').setActiveTab(1);
						
		        	}

		        }]
            },{
                title:'Clinic Info',
                defaults: {width: 230},
                id: 'clinicInfo',
                defaultType: 'textfield',
                disabled: true,
                items: [{

                }],
		        buttons: [{
		            text: 'Back',
		            handler: function() {
						Ext.getCmp('tabsInstall').setActiveTab(0);
		        	}
		        },{
		            text: 'Next',
		            handler: function() {
		            	Ext.getCmp('databaseInfo').enable();
						Ext.getCmp('tabsInstall').setActiveTab(2);
		        	}
		        }]
            },{
                title: 'Database Info',
                defaults: {width: 230},
                id: 'databaseInfo',
                defaultType: 'textfield',
                disabled: true,
                items: [{

                }],
		        buttons: [{
		            text: 'Back',
		            handler: function() {
						Ext.getCmp('tabsInstall').setActiveTab(1);
		        	}
		        },{
		            text: 'Next',
		            handler: function() {
		            	Ext.getCmp('adminInfo').enable(3);
						Ext.getCmp('tabsInstall').setActiveTab(3);
		        	}
		        }]
            },{
                title: 'Admin Info',
                defaults: {width: 230},
                id: 'adminInfo',
                defaultType: 'textfield',
                disabled: true,
                items: [{

                }],
		        buttons: [{
		        	text: 'Back',
		            handler: function() {
						Ext.getCmp('tabsInstall').setActiveTab(2);
		        	}
		        },{
		            text: 'Finish',
		            handler: function() {
						// TODO //
		        	}
		        }]
            }]
        }]

        
    });


	// *************************************************************************************
	// The New Instalation Window 
	// *************************************************************************************
	var winSiteSetup = new Ext.create('widget.window', {
	    title		: 'MitosEHR Requirements',
	    id			: 'winSiteSetup',
	    closable	: true,
	    width		: 600,
		height		: 400,
		bodyPadding	: 2,
		closeAction	: 'hide',
	    plain		: true,
		modal		: false,
		resizable	: false,
		draggable	: false,
		closable	: false,
	    bodyStyle	: 'background-color: #ffffff; padding: 5px;',
	    items		: [ reqGrid ],
	    dockedItems: [{
			dock: 'bottom',
			frame: false,
			border: false,
			buttons: [{
		        text: 'Next',
		        id: 'btn_agree',
		        padding: '0 10',
				name: 'btn_reset',
				handler: function() {
			        winSiteSetup.hide();
			        winInstall.show();
		        }
			}]
		}]
	});
	
	// *************************************************************************************
	// The New Instalation Window 
	// *************************************************************************************
	var winInstall = new Ext.create('widget.window', {
	    title		: 'MitosEHR Installation',
	    id			: 'winInstall',
	    closable	: true,
	    width		: 600,
		height		: 400,
		bodyPadding	: 2,
		closeAction	: 'hide',
	    plain		: true,
		modal		: false,
		resizable	: false,
		draggable	: false,
		closable	: false,
	    bodyStyle	: 'background-color: #ffffff; padding: 5px;',
	    items		: [ formInstall ]
	});
}); // End of Ext.onReady function
</script>
</head>
<body id="login">
<div id="copyright">MitosEHR | <a href="javascript:void()" onClick="Ext.getCmp('winCopyright').show();" >Copyright Notice</a></div>
</body>
</html>
