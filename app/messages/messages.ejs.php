<?php

//----------------------------------------------------------------------------------------------------------------------
// messages.ejs.php 
// v0.0.5
// Under GPLv3 License
// 
// Integrated by: GI Technologies & MitosEHR.org in 2011
// 
//----------------------------------------------------------------------------------------------------------------------

session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

include_once("../../classes/I18n.class.php");

//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;
?>

<script type="text/javascript">
delete Ext.mitos.Panel;
Ext.onReady(function() {
	Ext.define('Ext.mitos.Panel',{
		extend:'Ext.panel.Panel',
		uses:[
			'Ext.mitos.CRUDStore',
			'Ext.mitos.GridPanel',
			'Ext.mitos.RenderPanel',
			'Ext.mitos.SaveCancelWindow'
		],
		initComponent: function(){
		
            /** @namespace Ext.QuickTips */
            Ext.QuickTips.init();
	
			// *************************************************************************************
			// Global variables
			// *************************************************************************************
			var panel = this;
			var rowContent;
			var rowPos;
			var body_content;
			body_content = '<?php i18n("Nothing posted yet..."); ?>';
	
			// *************************************************************************************
			// Structure of the message record
			// creates a subclass of Ext.data.Record
			//
			// This should be the structure of the database table
			// 
			// *************************************************************************************
			panel.storeMsgs = new Ext.create('Ext.mitos.CRUDStore',{
				fields: [
					{name: 'id',				type: 'int'},
					{name: 'date',				type: 'string'},
					{name: 'body',				type: 'string'},
					{name: 'curr_msg',			type: 'string'},
					{name: 'pid',				type: 'string'},
					{name: 'patient',			type: 'string'},
					{name: 'user_id',			type: 'string'},
					{name: 'user',				type: 'string'},
					{name: 'subject',			type: 'string'},
					{name: 'facility_id',		type: 'string'},
					{name: 'activity',			type: 'string'},
					{name: 'authorized',	  	type: 'string'},
					{name: 'assigned_to',   	type: 'string'},
					{name: 'message_status',	type: 'string'},
					{name: 'reply_id',  		type: 'string'},
					{name: 'note_type',			type: 'string'}
				],
				model		: 'Messages',
				idProperty	: 'id',
				read		: 'app/messages/data_read.ejs.php',
				create		: 'app/messages/data_create.ejs.php',
				update		: 'app/messages/data_update.ejs.php',
				destroy 	: 'app/messages/data_destroy.ejs.php'
			});

			// *************************************************************************************
			// Structure and load the data for cmb_toUsers
			// AJAX -> component_data.ejs.php
			// *************************************************************************************
			panel.storePat = new Ext.create('Ext.mitos.CRUDStore',{
				fields: [
					{name: 'id',    type: 'int'},
					{name: 'name',  type: 'string'},
					{name: 'phone', type: 'string'},
					{name: 'ss',    type: 'string'},
					{name: 'dob',   type: 'string'},
					{name: 'pid',   type: 'string'}
				],
				model		: 'Patients',
				idProperty	: 'id',
				read		: 'app/messages/component_data.ejs.php',
				extraParams	: {"task": "patients"}
			});// End storePat
	

			// *************************************************************************************
			// Structure and load the data for cmb_toUsers
			// AJAX -> component_data.ejs.php
			// *************************************************************************************
			panel.toData = new Ext.create('Ext.mitos.CRUDStore',{
				fields: [
					{name: 'user',      type: 'string' },
					{name: 'full_name', type: 'string' }
				],
				model		: 'User',
				idProperty	: 'id',
				read		: 'app/messages/component_data.ejs.php',
				extraParams	: {"task": "users"}
			});// End toData
	
			// *************************************************************************************
			// Structure, data for cmb_Type
			// AJAX -> component_data.ejs.php
			// *************************************************************************************
			panel.typeData = new Ext.create('Ext.mitos.CRUDStore',{
				fields: [
					{name: 'option_id', type: 'string' },
					{name: 'title',     type: 'string' }
				],
				model		: 'Types',
				idProperty	: 'option_id',
				read		: 'lib/layoutEngine/listOptions.json.php',
				extraParams	: {"filter": "note_type"}
			});// End typeData
	
			// *************************************************************************************
			// Structure, data for cmb_Status
			// AJAX -> component_data.ejs.php
			// *************************************************************************************
			panel.statusData = new Ext.create('Ext.mitos.CRUDStore',{
				fields: [
					{name: 'option_id', type: 'string' },
					{name: 'title',     type: 'string' }
				],
				model		: 'Status',
				idProperty	: 'option_id',
				read		: 'lib/layoutEngine/listOptions.json.php',
				extraParams	: {"filter": "message_status"}
			});// End statusData
	
			// *************************************************************************************
			// Patient Select Dialog
			// *************************************************************************************
			panel.winPatients = new Ext.create('Ext.window.Window', {
				width			: 900,
				height			: 400,
				border			: false,
				modal			: true,
				resizable		: true,
				autoScroll		: true,
				title		    : '<?php i18n("Patients"); ?>',
				closeAction		: 'hide',
				renderTo		: document.body,
				items: [{
						xtype		: 'grid',
						autoHeight	: true,
						store		: panel.storePat,
						frame		: false,
						viewConfig	: {forceFit: true, stripeRows: true}, // force the grid to the width of the containing panel
						listeners: {
							// Single click to select the record, and copy the variables
							itemclick: function(view, record, item, num, egrid, rowIndex, element) {
								rowContent = record;
								panel.patSelect.enable();
							}
						},
						columns: [
							{header: 'id', sortable: false, dataIndex: 'id', hidden: true},
							{ header: '<?php i18n("PID"); ?>', sortable: true, dataIndex: 'pid' },
							{ header: '<?php i18n("Name"); ?>', flex: 1, sortable: true, dataIndex: 'name' },
							{ header: '<?php i18n("Phone"); ?>', sortable: true, dataIndex: 'phone'},
							{ header: '<?php i18n("SS"); ?>', sortable: true, dataIndex: 'ss' },
							{ header: '<?php i18n("DOB"); ?>', sortable: true, dataIndex: 'dob' }
						]
				}],
				// Window Bottom Bar
				dockedItems: [{
					xtype: 'toolbar',
					dock: 'bottom',
					items: [
						panel.patSelect = new Ext.create('Ext.Button', {
							text		:'<?php i18n("Select"); ?>',
							iconCls		: 'select',
							disabled	: true,
							handler: function() {
								panel.Patient.setText( rowContent.get('name') );
								panel.pid.setValue( rowContent.get('pid') );
								panel.cmdSend.enable();
								panel.winPatients.hide();
							}
						})
					,'-',
						panel.cmdClose = new Ext.create('Ext.Button', {
							text		: '<?php i18n("Close"); ?>',
							iconCls		: 'delete',
							handler		: function(){ panel.winPatients.hide(); }
						})
					]
				}]
			}); // END WINDOW
	
			// *************************************************************************************
			// Message Form
			// *************************************************************************************
			panel.formMessage = new Ext.create('Ext.form.Panel', {
				frame		: false,
				bodyStyle	: 'padding: 5px',
				defaults	: {labelWidth: 75, anchor: '100%'},
				items: [ 
					panel.Patient = new Ext.create('Ext.Button', {
						text: '<?php i18n("Click to select patient..."); ?>',
						fieldLabel: '<?php i18n("Patient"); ?>',
						name: 'patient',
						height: 30,
						margin: '5px',
						handler: function(){ panel.winPatients.show(); }
					})
				,
					panel.assigned_to = new Ext.create('Ext.form.ComboBox', {
						name: 'assigned_to',
						fieldLabel: '<?php i18n("To"); ?>',
						editable: false,
						triggerAction: 'all',
						mode: 'local',
						valueField: 'user',
						hiddenName: 'assigned_to',
						displayField: 'full_name',
						store: panel.toData
					})
				,{ 
					xtype: 'combo', 
					value: 'Unassigned',
					name: 'note_type',
					fieldLabel: '<?php i18n("Type"); ?>',
					editable: false,
					triggerAction: 'all',
					mode: 'local',
					valueField: 'option_id',
					hiddenName: 'option_id',
					displayField: 'title',
					store: panel.typeData
				},{ 
					xtype: 'combo', 
					value: 'New',
					name: 'message_status',
					fieldLabel: '<?php i18n("Status"); ?>',
					editable: false,
					triggerAction: 'all',
					mode: 'local',
					valueField: 'option_id',
					hiddenName: 'title',
					displayField: 'title',
					store: panel.statusData
				},{ 
					xtype: 'textfield', 
					fieldLabel: '<?php i18n("Subject"); ?>',
	    		    name: 'subject'
				}, 
					panel.body = new Ext.create('Ext.form.HtmlEditor', {
						readOnly: true,
						name: 'body',
						height: 150
					})
				,{ 
					xtype: 'htmleditor', 
					name: 'curr_msg',
					height: 200
				}, 
					panel.id = new Ext.create('Ext.form.Text', {
						hidden: true,
						name: 'id'
					})
				,
					panel.pid = new Ext.create('Ext.form.Text', {
						hidden: true,
						name: 'pid'
					})
				,{ 
					xtype: 'textfield',
			        id: 'reply_id',
	    		    hidden: true,
			        name: 'reply_id'
				}]
			});

			// *************************************************************************************
			// Message Window Dialog
			// *************************************************************************************
			panel.winMessage = new Ext.create('Ext.window.Window', {
				width		: 550,
				autoHeight	: true,
				modal		: true,
				border		: false,
				resizable	: false,
				autoScroll	: true,
				title		: '<?php i18n("Compose Message"); ?>',
				closeAction	: 'hide',
				renderTo	: document.body,
				items		: [panel.formMessage],
				// Window Bottom Bar
				bbar:[
					panel.cmdSend = new Ext.create('Ext.Button', {
						text		:'<?php i18n("Send"); ?>',
						iconCls		: 'save',
						disabled	: true,
						handler: function() { 
							// The datastore object will save the data
							// as soon changes is detected on the datastore
							// It's a AJAX thing
							if(panel.id.getValue()){ // Update message
								var record = panel.storeMsgs.getAt(rowPos);
								var fieldValues = panel.formMessage.getForm().getValues();
								for ( k=0; k <= record.fields.getCount()-1; k++) {
									i = record.fields.get(k).name;
									record.set( i, fieldValues[i] );
								}
							} else {						// New message
								//----------------------------------------------------------------
								// 1. Convert the form data into a JSON data Object
								// 2. Re-format the Object to be a valid record (UserRecord)
								// 3. Add the new record to the datastore
								//----------------------------------------------------------------
								var obj = eval( '(' + Ext.JSON.encode(panel.formMessage.getForm().getValues()) + ')' );
								panel.storeMsgs.add( obj );
							}
							panel.winMessage.hide();	// Finally hide the dialog window
							panel.storeMsgs.sync();	// Save the record to the dataStore
							panel.storeMsgs.load();	// Reload the dataSore from the database
						}
					})
				,'-',{
					text:'<?php i18n("Close"); ?>',
					iconCls: 'delete',
					handler: function(){ panel.winMessage.hide(); }
				}]
			}); // END WINDOW
	
			// *************************************************************************************
			// Create the GridPanel
			// *************************************************************************************
			panel.msgGrid = new Ext.create('Ext.grid.Panel', {
				store		: panel.storeMsgs,
				autoHeight 	: true,
				border     	: true,
				frame		: true,
				loadMask    : true,
				viewConfig 	: {forceFit: true, stripeRows : true},
				listeners: {
					// Single click to select the record, and copy the variables
					itemclick: function(DataView, record, item, rowIndex, e) {
	       				panel.formMessage.getForm().reset(); // Clear the form
			       		panel.editMsg.enable();
	    		   		panel.delMsg.enable();
						rowContent = panel.storeMsgs.getAt(rowIndex);
						panel.formMessage.getForm().loadRecord(rowContent);
	    		   		rowPos = rowIndex;
					},
					// Double click to select the record, and edit the record
					itemdblclick:  function(DataView, record, item, rowIndex, e) {
	    	   			panel.formMessage.getForm().reset(); // Clear the form
		       			panel.editMsg.enable();
			       		panel.delMsg.enable();
						rowContent = panel.storeMsgs.getAt(rowIndex);
						panel.formMessage.getForm().loadRecord(rowContent);
	    		   		rowPos = rowIndex;
	       				panel.Patient.setText( rowContent.get('patient') );
						panel.Patient.disable();
						panel.assigned_to.disable();
						panel.cmdSend.enable();
						panel.body.setVisible(true);
						panel.winMessage.show();
					}
				},
				columns: [
					{ header: 'noteid', sortable: false, dataIndex: 'noteid', hidden: true},
					{ header: 'reply_id', sortable: false, dataIndex: 'reply_id', hidden: true},
					{ header: 'user', sortable: false, dataIndex: 'user', hidden: true},
					{ flex: 1, header: '<?php i18n("Subject"); ?>', sortable: true, dataIndex: 'subject' },
					{ width: 200, header: '<?php i18n("From"); ?>', sortable: true, dataIndex: 'user' },
					{ header: '<?php i18n("Patient"); ?>', sortable: true, dataIndex: 'patient' },
					{ header: '<?php i18n("Type"); ?>', sortable: true, dataIndex: 'note_type' },
					{ width: 150, header: '<?php i18n("Date"); ?>', sortable: true, dataIndex: 'date' },
					{ header: '<?php i18n("Status"); ?>', sortable: true, dataIndex: 'message_status' }
				],
				// *************************************************************************************
				// Grid Menu
				// *************************************************************************************
				tbar: [{
					xtype	:'button',
					id		: 'sendMsg',
					text	: '<?php i18n("Send message", "e"); ?>',
					iconCls	: 'newMessage',
					handler: function(){
						// Clear the rowContent variable
						panel.formMessage.getForm().reset(); // Clear the form
						panel.Patient.setText('<?php i18n("Click to select patient..."); ?>');
						panel.Patient.enable();
						panel.assigned_to.enable();
						panel.cmdSend.disable();
						panel.body.setVisible(false);
						panel.winMessage.show();
					}
				},'-',
					panel.editMsg = new Ext.create('Ext.Button', {
						text	   : '<?php i18n("Reply message"); ?>',
						iconCls	 : 'edit',
						disabled : true,
						handler  : function(){
							// Set the buttons state
							panel.Patient.setText( rowContent.get('patient') );
							panel.Patient.disable();
							panel.assigned_to.disable();
							panel.cmdSend.enable();
							panel.body.setVisible(true);
							panel.winMessage.show();
						}
					})
				,'-',
					panel.delMsg = new Ext.create('Ext.Button', {
						text		 : '<?php i18n("Delete message"); ?>',
						iconCls		: 'delete',
						disabled	: true,
						handler: function(){
							Ext.Msg.show({
								title: '<?php i18n("Please confirm...", "e"); ?>',
								icon: Ext.MessageBox.QUESTION,
								msg:'<?php i18n("Are you sure to delete this message?<br>From: "); ?>' + rowContent.get('from'),
								buttons: Ext.Msg.YESNO,
								fn:function(btn){
							        if(btn=='yes'){
										// The datastore object will save the data
										// as soon changes is detected on the datastore
										// It's a Sencha AJAX thing
										panel.storeMsgs.remove( rowContent );
										panel.storeMsgs.save();
										panel.storeMsgs.load();
			    			    	}
								}
							});
						}
					})
				] // END GRID TOP MENU
			}); // END GRID

			//***********************************************************************************
			// Top Render Panel
			// This Panel needs only 3 arguments...
			// PageTigle 	- Title of the current page
			// PageLayout 	- default 'fit', define this argument if using other than the default value
			// PageBody 	- List of items to display [foem1, grid1, grid2]
			//***********************************************************************************
    		Ext.create('Ext.mitos.RenderPanel', {
        		pageTitle: '<?php i18n("Messages"); ?>',
        		pageBody: [panel.msgGrid]
    		});
			panel.callParent(arguments);
			
		} // end of initComponent
		
	}); //ens MessagesPanel class
    MitosPanel = Ext.create('Ext.mitos.Panel');
    
}); // END EXTJS

</script>
