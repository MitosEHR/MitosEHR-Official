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
	var conn;
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
		closable		: false,
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
        url				: 'install/logic.ejs.php',
        layout			: 'fit',
        fieldDefaults	: {
            msgTarget	: 'side',
            labelWidth 	: 130
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
            height:450,
            defaults:{bodyStyle:'padding:10px'},
            items:[{
                title:'Instructions',
                layout:'fit',
                autoLoad		: 'install/instructions.html',
                autoScroll		: true,
		        buttons: [{
		            text: 'Next',
		            handler: function() {
		            	Ext.getCmp('clinicInfo').enable();
						Ext.getCmp('tabsInstall').setActiveTab(1);
		        	}
		        }]
            },{
                title:'Site Info',
                defaults: {width: 530},
                id: 'clinicInfo',
                defaultType: 'textfield',
                disabled: true,
                items: [{
					xtype: 'textfield',
			        name: 'siteName',
			        id:'siteNameField',
			        labelAlign	: 'top',
			        fieldLabel: 'Site Name ( Normaly set to default )',
			        allowBlank: false ,
			        listeners: {
				   	  	validitychange: function(){
				   	  	field = Ext.getCmp('siteNameField');
			   	  		if(field.isValid()){
				   	  			Ext.getCmp('clinicInfoNext').enable();
				   	  		}else{
				   	  			Ext.getCmp('clinicInfoNext').disable();
				   	  		}
				   		}
				  	}
			    },{
			    	xtype: 'displayfield',
		            value: 'Tips...'
                },{
			    	xtype: 'displayfield',
		            value: '<span style="color:red;">The Site will have their own database and will no be able to comunicate to each other</span>'
                },{
			    	xtype: 'displayfield',
		            value: '<span style="color:green;">A Site can have multiples clinics.</span>'
                }],
		        buttons: [{
		            text: 'Back',
		            handler: function() {
						Ext.getCmp('tabsInstall').setActiveTab(0);
		        	}
		        },{
		            text: 'Next',
		            id:'clinicInfoNext',
		            disabled: true,
		            handler: function() {
		            	Ext.getCmp('databaseInfo').enable();
						Ext.getCmp('tabsInstall').setActiveTab(2);
		        	}
		        }]
            },{
                title: 'Database Info',
                defaults: {width: 530},
                id: 'databaseInfo',
                defaultType: 'textfield',
                disabled: true,
                items: [{
			    	xtype: 'displayfield',
			    	padding: '10px',
		            value: 'Choose if you want to <a href="javascript:void(0);" onClick="Ext.getCmp(\'rootFieldset\').enable();">create a new database</a> or use an <a href="javascript:void(0);" onClick="Ext.getCmp(\'dbuserFieldset\').enable();">existing database</a><br>'
                },{
					xtype:'fieldset',
					id:'rootFieldset',
		            checkboxToggle:true,
		            title: 'Create a New Database (Roor Access Needed)',
		            defaultType: 'textfield',
		            collapsed: true,
		            disabled: true,
		            layout: 'anchor',
		            defaults: {
		                anchor: '100%'
		            },
		            items :[{
		                fieldLabel: 'Root User',
		                name: 'rootUser',
		                allowBlank:false
		            },{
		                fieldLabel: 'Root Password',
		                name: 'rootPass',
		                id: 'rootPass',
		                inputType: 'password', 
		                allowBlank:false,
		            },{
		                fieldLabel: 'SQL Server Host',
		                name: 'dbHost',
		                allowBlank:false
		            },{
		                fieldLabel: 'SQL Server Port',
		                name: 'dbPort',
		                allowBlank:false
		            },{
		                fieldLabel: 'Database Name',
		                name: 'dbName',
						allowBlank:false
		            },{
		            	fieldLabel: 'New Database User',
		                name: 'dbUser',
						allowBlank:false
					},{
		            	fieldLabel: 'New Database Pass',
		                name: 'dbPass',
		                inputType: 'password',
						allowBlank:false
		            }],
			        listeners: {
				   	  	enable: function(){
				   	  		conn = 'root';
							Ext.getCmp('dbuserFieldset').collapse();
				   			Ext.getCmp('dbuserFieldset').disable();
							Ext.getCmp('rootFieldset').expand();
							
				   		}
				  	}
		        },{
		            xtype:'fieldset',
		            id:'dbuserFieldset',
		            checkboxToggle:true,
		            title: 'Install on Existing Database',
		            defaultType: 'textfield',
		            collapsed: true,
		            disabled: true,
		            layout: 'anchor',
		            defaults: {
		                anchor: '100%'
		            },
		            items :[{
		                fieldLabel: 'Database Name',
		                name: 'dbName',
						allowBlank:false
		            },{
		                fieldLabel: 'Database User',
		                name: 'dbUser',
		                allowBlank:false
		            },{
		                fieldLabel: 'Database Pass',
		                name: 'dbPass',
		                id: 'dbPass',
		                inputType: 'password',
		                allowBlank:false
		            },{
		                fieldLabel: 'Database Host',
		                name: 'dbHost',
		                allowBlank:false
		            },{
		                fieldLabel: 'Database Port',
		                name: 'dbPort',
		                allowBlank:false
		            }],
		            listeners: {
				   	  	enable: function(){
				   	  		conn = 'user';
							Ext.getCmp('rootFieldset').collapse();
							Ext.getCmp('rootFieldset').disable();
							Ext.getCmp('dbuserFieldset').expand();
							
				   	  	}
				  	}
                }],
		        buttons: [{
		            text: 'Back',
		            handler: function() {
						Ext.getCmp('tabsInstall').setActiveTab(1);
		        	}
		        },{
		            text: 'Test Database Credentials',
		            id:'dataTester',
		            handler: function() {
			            var form = this.up('form').getForm();
			            if (form.isValid()) {
			                form.submit({
			                	method:'POST', 
			                	params: {
				                    task: 'connTest',
				                    conn: conn
				                },
			                    success: function(form, action) {
			                    obj = Ext.JSON.decode(action.response.responseText);
			                       Ext.Msg.alert('Sweet!', obj.jerror);
			                       Ext.getCmp('dataInfoNext').enable();
			                    },
			                    failure: function(form, action) {
			                    obj = Ext.JSON.decode(action.response.responseText);
			                        Ext.Msg.alert('Oops!', obj.jerror);
			                        Ext.getCmp('dataInfoNext').disable();
			                    }
			                });
			            }
			        }
		        },{
		            text: 'Next',
		            id:'dataInfoNext',
		            disabled: true,
		            handler: function() {
		            	Ext.getCmp('adminInfo').enable(3);
						Ext.getCmp('tabsInstall').setActiveTab(3);
		        	}
		        }]
            },{
                title: 'Admin Info',
                defaults: {width: 530},
                id: 'adminInfo',
                defaultType: 'textfield',
                disabled: true,
                items: [{
			    	xtype: 'displayfield',
		            value: 'Choose Admin Username and Password'
                },{
			    	xtype: 'displayfield',
			    	padding: '0 0 10px 0',
		            value: '(This will be the Super User/Global Admin with access to all areas)'
                },{
	                fieldLabel: 'Admin Username',
	                name: 'adminUser',
	                padding: '0 0 10px 0',
	            },{
	                fieldLabel: 'Admin Password',
	                type: 'password', 
	                name: 'adminPass',
	                inputType: 'password', 
	            }],
		        buttons: [{
		        	text: 'Back',
		            handler: function() {
						Ext.getCmp('tabsInstall').setActiveTab(2);
		        	}
		        },{
		            text: 'Finish',
		            handler: function() {
			            var form = this.up('form').getForm();
			            if (form.isValid()) {
			                form.submit({
			                	method:'POST', 
			                	params: {
				                    task: 'install',
				                },
			                    success: function(form, action) {
			                    obj = Ext.JSON.decode(action.response.responseText);
			                       Ext.Msg.alert('Sweet!.', obj.jerror);
			                       Ext.getCmp('dataInfoNext').enable();
			                    },
			                    failure: function(form, action) {
			                    obj = Ext.JSON.decode(action.response.responseText);
			                        Ext.Msg.alert('Oops!', obj.jerror);
			                        Ext.getCmp('dataInfoNext').disable();
			                    }
			                });
			            }
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
		height		: 500,
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
		height		: 500,
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
