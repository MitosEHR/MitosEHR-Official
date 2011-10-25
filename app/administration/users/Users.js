//******************************************************************************
// Users.ejs.php
// Description: Users Screen
// v0.0.4
// 
// Author: Ernesto J Rodriguez
// Modified: n/a
// 
// MitosEHR (Electronic Health Records) 2011
//******************************************************************************
	Ext.define('Ext.mitos.panel.administration.users.Users',{
        extend      :'Ext.mitos.RenderPanel',
        id          : 'panelUsers',
        pageTitle   : 'Users',
		uses:[
			'Ext.mitos.CRUDStore',
			'Ext.mitos.GridPanel',
			'Ext.mitos.TitlesComboBox',
			'Ext.mitos.SaveCancelWindow',
			'Ext.mitos.FacilitiesComboBox',
			'Ext.mitos.AuthorizationsComboBox'
		],
		initComponent: function(){
            /** @namespace Ext.QuickTips */
            Ext.QuickTips.init();
			var page = this;
			var rowPos; // Stores the current Grid Row Position (int)
			var currRec; // Store the current record (Object)
			page.userStore = Ext.create('Ext.mitos.CRUDStore',{
				fields: [
					{name: 'id',                    type: 'int'},
					{name: 'username',              type: 'string'},
					{name: 'password',              type: 'auto'},
					{name: 'authorized',            type: 'string'},
					{name: 'active',            	type: 'string'},
					{name: 'info',                  type: 'string'},
					{name: 'source',                type: 'int'},
					{name: 'fname',                 type: 'string'},
					{name: 'mname',                 type: 'string'},
					{name: 'lname',                 type: 'string'},
					{name: 'fullname',              type: 'string'},
					{name: 'federaltaxid',          type: 'string'},
					{name: 'federaldrugid',         type: 'string'},
					{name: 'upin',                  type: 'string'},
					{name: 'facility_id',           type: 'int'},
					{name: 'see_auth',              type: 'auto'},
					{name: 'active',                type: 'auto'},
					{name: 'npi',                   type: 'string'},
					{name: 'title',                 type: 'string'},
					{name: 'specialty',             type: 'string'},
					{name: 'cal_ui',                type: 'string'},
					{name: 'taxonomy',              type: 'string'},
					{name: 'calendar',              type: 'int'},
					{name: 'abook_type',            type: 'string'},
					{name: 'pwd_expiration_date',   type: 'string'},
					{name: 'pwd_history1',          type: 'string'},
					{name: 'pwd_history2',          type: 'string'},
					{name: 'default_warehouse',     type: 'string'}
				],
				model 		:'gModel',
				idProperty 	:'id',
				read		:'app/administration/users/data_read.ejs.php',
				create		:'app/administration/users/data_create.ejs.php',
				update		:'app/administration/users/data_update.ejs.php',
				destroy		:'app/administration/users/data_destroy.ejs.php'
			});
			
			function authCk(val) {
			    if (val == '1') {
			        return '<img src="ui_icons/yes.gif" />';
			    } else if(val == '0') {
			        return '<img src="ui_icons/no.gif" />';
			    } 
			    return val;
			}
			// *************************************************************************************
			// Create the GridPanel
			// *************************************************************************************
			page.userGrid = new Ext.create('Ext.mitos.GridPanel', {
				store : page.userStore,
				columns: [
					{ text: 'id', sortable: false, dataIndex: 'id', hidden: true},
			    	{ width: 100,  text: 'Username', sortable: true, dataIndex: 'username' },
			    	{ width: 200,  text: 'Name', sortable: true, dataIndex: 'fullname' },
			    	{ flex: 1,  text: 'Aditional info', sortable: true, dataIndex: 'info' },
			    	{ text: 'Active?', sortable: true, dataIndex: 'active',renderer 	: authCk },
			    	{ text: 'Authorized?', sortable: true, dataIndex: 'authorized', renderer: authCk }
			  	],
			  	listeners: {
			   		// -----------------------------------------
			   	  	// Single click to select the record
			   	  	// -----------------------------------------
			   	  	itemclick: {
			   			fn: function(DataView, record, item, rowIndex, e){ 
							page.frmUsers.getForm().reset();
							page.cmdEdit.enable();
							page.cmdDelete.enable();
			   		  		var rec = page.userStore.getAt(rowIndex);
			   		  		page.frmUsers.getForm().loadRecord(rec);
							currRec = rec;
		            		page.rowPos = rowIndex;
			   		  	}
			   	  	},
			   	  	// -----------------------------------------
			   	  	// Double click to select the record, and edit the record
			   	  	// -----------------------------------------
			   	  	itemdblclick: { 
			   			fn: function(DataView, record, item, rowIndex, e){ 
							page.frmUsers.getForm().reset();
							page.cmdEdit.enable();
							page.cmdDelete.enable();
							var rec = page.userStore.getAt(rowIndex); // get the record from the store
							page.frmUsers.getForm().loadRecord(rec); // load the record selected into the form
							currRec = rec;
		            		page.rowPos = rowIndex;
							page.winUsers.setTitle('Edit User');
			   		  		page.winUsers.show();
			   		  	}
			  	  	}
			  	},
			  	dockedItems: [{
			  	  	xtype: 'toolbar',
				  	dock: 'top',
				  	items: [ 
				  		new Ext.create('Ext.Button', {
						    text      : 'Add User',
						    iconCls   : 'icoAddressBook',
						    handler   : function(){
						    	page.frmUsers.getForm().reset(); // Clear the form
						      	page.winUsers.show();
							  	page.winUsers.setTitle('Add User'); 
						    }
						}),'-',
						page.cmdEdit = new Ext.create('Ext.Button', {
						    text      : 'Edit User',
						    iconCls   : 'edit',
						    disabled  : true,
						    handler: function(){ 
								page.winUsers.setTitle('Add User'); 
						    	page.winUsers.show();
						    }
						}),'-',
						page.cmdDelete = new Ext.create('Ext.Button', {
							text: 'Delete User',
							iconCls: 'delete',
							disabled: true,
							handler: function(){
								Ext.Msg.show({
									title: 'Please confirm...', 
									icon: Ext.MessageBox.QUESTION,
									msg:'Are you sure to delete this User?',
									buttons: Ext.Msg.YESNO,
									fn:function(btn,msgGrid){
										if(btn=='yes'){
											page.userStore.remove( currRec );
											page.userStore.sync();
											page.userStore.load();
						    		    }
									}
								});
							}
					  	})
					]					    
			  	}]
			});
			// *************************************************************************************
			// User Add/Eddit Form
			// *************************************************************************************
			page.frmUsers = new Ext.form.FormPanel({
				bodyStyle   : 'padding: 5px;',
				autoWidth   : true,
				border      : false,
				hideLabels  : true,
				defaults: { labelWidth: 89, anchor: '100%',
				    layout: { type: 'hbox', defaultMargins: {top: 0, right: 5, bottom: 0, left: 0} }
				},
				items: [
					{ xtype: 'textfield', hidden: true, name: 'id'},
				    { xtype: 'fieldcontainer',
				      defaults: { hideLabel: true },
				      msgTarget : 'under', 
				      items: [
				        { width: 100, xtype: 'displayfield', value: 'Username: '},
				        { width: 100, xtype: 'textfield',  name: 'username' },
				        { width: 100, xtype: 'displayfield', value: 'Password: '},
				        { width: 105, xtype: 'textfield', name: 'password',  inputType: 'password' }
				      ] 
				    },{
				      xtype: 'fieldcontainer',
				      defaults: { hideLabel: true },
				      msgTarget : 'under', 
				      items: [
				        { width: 100, xtype: 'displayfield', value: 'First, Middle, Last: '},
				          Ext.create('Ext.mitos.TitlesComboBox'),
				        { width: 80,  xtype: 'textfield', name: 'fname' },
				        { width: 65,  xtype: 'textfield', name: 'mname' },
				        { width: 105, xtype: 'textfield', name: 'lname' }
				      ]
				    },{ 
				      xtype: 'fieldcontainer',
				      defaults: { hideLabel: true },
				      msgTarget : 'under', 
				      items: [
				        { width: 100, xtype: 'displayfield', value: 'Active?: '},
				        { width: 100, xtype: 'checkbox', name: 'active' },
				        { width: 100, xtype: 'displayfield', value: 'Authorized?: '},
				        { width: 105, xtype: 'checkbox', value: 'off', name: 'authorized' }
				      ]  
				    },{ 
				      xtype: 'fieldcontainer',
				      defaults: { hideLabel: true },
				      msgTarget : 'under', 
				      items: [
				        { width: 100, xtype: 'displayfield', value: 'Default Facility: '},
				          Ext.create('Ext.mitos.FacilitiesComboBox', { width: 100 }),
				        { width: 100, xtype: 'displayfield', value: 'Authorizations: '},
						  Ext.create('Ext.mitos.AuthorizationsComboBox', { width: 105 })
				      ] 
				    },{ 
				      xtype: 'fieldcontainer',
				      defaults: { hideLabel: true },
				      items: [
				        { width: 100, xtype: 'displayfield', value: 'Access Control: '},
				          Ext.create('Ext.mitos.RolesComboBox', {width: 100 }),
				        { width: 100, xtype: 'displayfield', value: 'Taxonomy: '},
				        { width: 105, xtype: 'textfield', name: 'taxonomy' }
				      ]
				    },{ 
				      xtype: 'fieldcontainer',
				      defaults: { hideLabel: true },
				      items: [
				        { width: 100, xtype: 'displayfield', value: 'Federal Tax ID: '},
				        { width: 100, xtype: 'textfield',  name: 'federaltaxid' },
				        { width: 100, xtype: 'displayfield', value: 'Fed Drug ID: '},
				        { width: 105, xtype: 'textfield', name: 'federaldrugid' }
				      ]
				    },{
				      xtype: 'fieldcontainer',
				      defaults: { hideLabel: true },
				      items: [
				       	{ width: 100, xtype: 'displayfield', value: 'UPIN: '},
				        { width: 100, xtype: 'textfield',  name: 'upin' },
				        { width: 100, xtype: 'displayfield', value: 'NPI: '},
				        { width: 105, xtype: 'textfield', name: 'npi' }
				      ]
				    },{ 
				      xtype: 'fieldcontainer',
				      defaults: { hideLabel: true },
				      items: [
				       	{ width: 100, xtype: 'displayfield', value: 'Job Description: '},
				        { width: 315, xtype: 'textfield', name: 'specialty' }
				      ]  
				    },
				    { width: 410, height: 50, xtype: 'textfield', name: 'info', emptyText: 'Additional Info' }
				]
			});
			// *************************************************************************************
			// User Add/Edit Window
			// *************************************************************************************
			page.winUsers = new Ext.create('Ext.mitos.SaveCancelWindow', {
				title       : 'Add or Edit User',
	    		form		: page.frmUsers,
	    		store		: page.userStore,
	    		scope		: page,
	    		idField		: 'id'
			});
		    page.pageBody = [ page.userGrid ];
			page.callParent(arguments);
		} // end of initComponent
	}); //ens UserPage class