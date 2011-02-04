<?php

//--------------------------------------------------------------------------------------------------------------------------
// messages.ejs.php 
// v0.0.3 -> Integrated AJAX
// Under GPLv3 License
// 
// Integration Sencha ExtJS Framework
//
// Integrated by: GI Technologies & MitosEHR.org in 2011
// 
//******************************************************
//MitosEHR (Electronic Health Records)
//******************************************************
//MitosEHR is a Open source Web-Based Software for:
//* Practice management
//* Electronic Medical Records
//* Prescription writing and medical billing application
//
//And it can be installed on the following systems:
//* Unix-like systems (Linux, UNIX, and BSD systems)
//* Microsoft systems
//* Mac OS X
//* And other platforms that can run Apache Web server, MySQL
//
//Setup documentation can be found in the INSTALL file,
//and extensive documentation can be found on the
//MitosEHR web site at:
//http://www.mitosehr.org/
//
// Sencha ExtJS
// Ext JS is a cross-browser JavaScript library for building rich internet applications. Build rich,
// sustainable web applications faster than ever. It includes:
// * High performance, customizable UI widgets
// * Well designed and extensible Component model
// * An intuitive, easy to use API
// * Commercial and Open Source licenses available
//--------------------------------------------------------------------------------------------------------------------------

// *************************************************************************************
//SANITIZE ALL ESCAPES
// *************************************************************************************
$sanitize_all_escapes=true;

// *************************************************************************************
//STOP FAKE REGISTER GLOBALS
// *************************************************************************************
$fake_register_globals=false;

// *************************************************************************************
// Load the OpenEMR Libraries
// *************************************************************************************
require_once("../registry.php");
?>

<script type="text/javascript">

// *************************************************************************************
// Start Sencha Framework
// *************************************************************************************
Ext.onReady(function() {
Ext.BLANK_IMAGE_URL = '../../library/<?php echo $GLOBALS['ext_path']; ?>/resources/images/default/s.gif';

// *************************************************************************************
// Global variables
// *************************************************************************************
var rowContent;
var body_content;

// *************************************************************************************
// Update the title on the panel
// *************************************************************************************
Ext.getCmp('BottomPanel').setTitle("Messages");

body_content = '<?php echo htmlspecialchars( xl('Nothing posted yet...'), ENT_NOQUOTES); ?>';

// *************************************************************************************
// Structure of the message record
// creates a subclass of Ext.data.Record
//
// This should be the structure of the database table
// 
// *************************************************************************************
var MessageRecord = Ext.data.Record.create([
	{name: 'noteid',	type: 'int',	mapping: 'noteid'},
	{name: 'user',		type: 'string', mapping: 'user'},
	{name: 'body',		type: 'string', mapping: 'body'},
	{name: 'from',		type: 'string', mapping: 'from'},
	{name: 'patient',	type: 'string', mapping: 'patient'},
	{name: 'type',		type: 'string', mapping: 'type'},
	{name: 'date',		type: 'string', mapping: 'date'},
	{name: 'status',	type: 'string', mapping: 'status'},
	{name: 'reply_to',	type: 'int',	mapping: 'reply_to'}
]);

// *************************************************************************************
// Structure and load the data for Messages
// AJAX -> data_*.ejs.php
// *************************************************************************************
var storeMsgs = new Ext.data.Store({
	autoSave	: false,

	// HttpProxy will only allow requests on the same domain.
	proxy : new Ext.data.HttpProxy({
		method		: 'POST',
		api: {
			read	: '../messages/data_read.ejs.php?show=<?php echo $show_all=='yes' ? $usrvar='_%' : $usrvar=$_SESSION['authUser']; ?>',
			create	: '../messages/data_create.ejs.php',
			update	: '../messages/data_update.ejs.php',
			destroy : '../messages/data_destroy.ejs.php'
		}
	}),

	// JSON Writer options
	writer: new Ext.data.JsonWriter({
		returnJson		: true,
		writeAllFields	: true,
		listful			: true,
		writeAllFields	: true
	}, MessageRecord),

	// JSON Reader options
	reader: new Ext.data.JsonReader({
		idProperty: 'noteid',
		totalProperty: 'results',
		root: 'row'
	}, MessageRecord )
	
});
storeMsgs.load();

// *************************************************************************************
// Structure and load the data for cmb_toUsers
// AJAX -> component_data.ejs.php
// *************************************************************************************
var storePat = new Ext.data.Store({
	proxy: new Ext.data.ScriptTagProxy({
		url: '../messages/component_data.ejs.php?task=patients'
	}),
	reader: new Ext.data.JsonReader({
		idProperty: 'id',
		totalProperty: 'results',
		root: 'row'
	},[
		{name: 'id', type: 'int', mapping: 'id'},
		{name: 'name', type: 'string', mapping: 'name'},
		{name: 'phone', type: 'string', mapping: 'phone'},
		{name: 'ss', type: 'string', mapping: 'ss'},
		{name: 'dob', type: 'string', mapping: 'dob'},
		{name: 'pid', type: 'string', mapping: 'pid'}
	])
});
storePat.load();

// *************************************************************************************
// Structure and load the data for cmb_toUsers
// AJAX -> component_data.ejs.php
// *************************************************************************************
var toData = new Ext.data.Store({
	proxy: new Ext.data.ScriptTagProxy({
		url: '../messages/component_data.ejs.php?task=users'
	}),
	reader: new Ext.data.JsonReader({
		idProperty: 'user',
		totalProperty: 'results',
		root: 'row'
	},[
		{name: 'user', type: 'string', mapping: 'user'},
		{name: 'full_name', type: 'string', mapping: 'full_name'}
	])
});
toData.load();

// *************************************************************************************
// Structure, data for cmb_Type
// AJAX -> component_data.ejs.php
// *************************************************************************************
var typeData = new Ext.data.Store({
	proxy: new Ext.data.ScriptTagProxy({
		url: '../messages/component_data.ejs.php?task=types'
	}),
	reader: new Ext.data.JsonReader({
		idProperty: 'option_id',
		totalProperty: 'results',
		root: 'row'
	},[
		{name: 'option_id', type: 'string', mapping: 'option_id'},
		{name: 'title', type: 'string', mapping: 'title'}
	])
});
typeData.load();

// *************************************************************************************
// Structure, data for cmb_Status
// AJAX -> component_data.ejs.php
// *************************************************************************************
var statusData = new Ext.data.Store({
	proxy: new Ext.data.ScriptTagProxy({
		url: '../messages/component_data.ejs.php?task=status'
	}),
	reader: new Ext.data.JsonReader({
		idProperty: 'option_id',
		totalProperty: 'results',
		root: 'row'
	},[
		{name: 'option_id', type: 'string', mapping: 'option_id'},
		{name: 'title', type: 'string', mapping: 'title'}
	])
});
statusData.load();

// *************************************************************************************
// Patient Select Dialog
// *************************************************************************************
var winPatients = new  Ext.Window({
	width		: 900,
	height		: 400,
	modal		: true,
	resizable	: true,
	autoScroll	: true,
	title		:	'<?php echo htmlspecialchars( xl('Patients'), ENT_NOQUOTES); ?>',
	closeAction	: 'hide',
	renderTo	: document.body,
	items: [{
			xtype		: 'grid',
			name		: 'gridPatients',
			autoHeight	: true,
			store		: storePat,
			stripeRows	: true,
			frame		: false,
			viewConfig	: {forceFit: true}, // force the grid to the width of the containing panel
			sm			: new Ext.grid.RowSelectionModel({singleSelect:true}),
			listeners: {
				
				// Single click to select the record, and copy the variables
				rowclick: function(grid, rowIndex, e) {
					
					// Get the content from the data grid
					rowContent = grid.getStore().getAt(rowIndex);
					
					// Enable the select button
					winPatients.patSelect.enable();
				}

			},
			columns: [
				{header: 'id', sortable: false, dataIndex: 'id', hidden: true},
				{ header: '<?php echo htmlspecialchars( xl('Name'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'name' },
				{ header: '<?php echo htmlspecialchars( xl('Phone'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'phone'},
				{ header: '<?php echo htmlspecialchars( xl('SS'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'ss' },
				{ header: '<?php echo htmlspecialchars( xl('DOB'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'dob' },
				{ header: '<?php echo htmlspecialchars( xl('PID'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'pid' }
			],
			tbar:[],
			plugins: [new Ext.ux.grid.Search({
				mode			: 'local',
				iconCls			: false,
				deferredRender	: false,
				dateFormat		: 'm/d/Y',
				minLength		: 4,
				align			: 'left',
				width			: 250,
				disableIndexes	: ['id'],
				position		: 'top'
			})]
	}],

	// Window Bottom Bar
	bbar:[{
		text		:'<?php echo htmlspecialchars( xl('Select'), ENT_NOQUOTES); ?>',
		iconCls		: 'select',
		ref			: '../patSelect',
		formBind	: true,
		disabled	: true,
		handler: function() {
			winMessage.reply_to.setValue( rowContent.get('id') );
			winMessage.patient_name.setText( rowContent.get('name') );
			winMessage.send.enable();
			winPatients.hide();
		}
	},{
		text		: '<?php echo htmlspecialchars( xl('Close'), ENT_NOQUOTES); ?>',
		iconCls		: 'delete',
		ref			: '../patClose',
		formBind	: true,
		handler		: function(){ winPatients.hide(); }
	}]

}); // END WINDOW

// *************************************************************************************
// Previuos Messages Panel
// *************************************************************************************
var prvMsg = new Ext.Panel({
	title			: '<?php xl('Past Messages', 'e'); ?>',
	labelWidth		: 100,
	minSize			: 300,
	height			: 100,
	region			: 'north',
	bodyStyle		: 'padding: 5px;',
	autoScroll		: true,
	border			: false,
	animCollapse	: false,
	collapsible		: true,
	titleCollapse	: true,
	split			: true,
	html			: '<div id=\'previousMsg\' class="prvMsg">' + body_content + '</div>',
	listeners: {
		collapse: function() { winMessage.syncShadow(); },
		expand: function(){ winMessage.syncShadow(); }
	}
});

// *************************************************************************************
// Message Window Dialog
// *************************************************************************************
var winMessage = new  Ext.Window({
	width		: 540,
	autoHeight	: true,
	modal		: true,
	resizable	: false,
	autoScroll	: true,
	title		: '<?php echo htmlspecialchars( xl('Compose Message'), ENT_NOQUOTES); ?>',
	closeAction	: 'hide',
	renderTo	: document.body,
	items: [
		// Top panel, for appended messages.
		prvMsg,
		{
		xtype		: 'form',
		region		:'center',
		labelWidth	: 100,
		id			: 'frmMessage',
		frame		: true,
		bodyStyle	: 'padding: 5px',
		defaults	: {width: 180},
		formBind	: true,
		buttonAlign	: 'left',
		split		: true,
		items: [
			{ xtype: 'button', 
				ref: '../patient_name',
				id: 'patient_name',
				text: '<?php echo htmlspecialchars( xl('Click to select patient...'), ENT_NOQUOTES); ?>',
				fieldLabel: '<?php echo htmlspecialchars( xl('Patient'), ENT_NOQUOTES); ?>',
				name: 'patient_name',
				editable: false,
				handler: function(){ winPatients.show(); }
			},
			{ xtype: 'combo', 
				ref: '../cmb_assigned_to',
				id: 'cmb_assigned_to',
				name: 'cmb_assigned_to',
				fieldLabel: '<?php echo htmlspecialchars( xl('To'), ENT_NOQUOTES); ?>',
				editable: false,
				triggerAction: 'all',
				mode: 'local',
				valueField: 'user',
				hiddenName: 'assigned_to',
				displayField: 'full_name',
				store: toData
			},
			{ xtype: 'combo', 
				ref: '../cmb_form_note_type',
				value: 'Unassigned',
				id: 'cmb_form_note_type',
				name: 'form_note_type',
				fieldLabel: '<?php echo htmlspecialchars( xl('Type'), ENT_NOQUOTES); ?>',
				editable: false,
				triggerAction: 'all',
				mode: 'local',
				valueField: 'option_id',
				hiddenName: 'form_note_type',
				displayField: 'title',
				store: typeData
			},
			{ xtype: 'combo', 
				ref: '../cmb_form_message_status',
				value: 'New',
				id: 'cmb_form_message_status',
				name: 'form_message_status',
				fieldLabel: '<?php echo htmlspecialchars( xl('Status'), ENT_NOQUOTES); ?>',
				editable: false,
				triggerAction: 'all',
				mode: 'local',
				valueField: 'option_id',
				hiddenName: 'form_message_status',
				displayField: 'title',
				store: statusData
			},
			{ xtype: 'textarea', 
				ref: '../note',
				fieldLabel: '<?php echo htmlspecialchars( xl('Message'), ENT_NOQUOTES); ?>',
				id: 'note',
				name: 'note',
				width: 350,
				height: 100
			},
			{ xtype: 'textfield', 
				ref: '../noteid',
				id: 'noteid',
				hidden: true,
				name: 'noteid',
				value: ''
			},
			{ xtype: 'textfield',
				ref: '../reply_to',
				id: 'reply_to',
				hidden: true,
				name: 'reply_to'
			}
		]
	}],
	// Window Bottom Bar
	bbar:[{
		text		:'<?php echo htmlspecialchars( xl('Send'), ENT_NOQUOTES); ?>',
		ref			: '../send',
		iconCls		: 'save',
		disabled	: true,
		handler: function() { 
			var currentTime = new Date();
			var month = currentTime.getMonth() + 1;
			var day = currentTime.getDate();
			var year = currentTime.getFullYear();
			var hours = currentTime.getHours();
			var minutes = currentTime.getMinutes();

			// The datastore object will save the data
			// as soon changes is detected on the datastore
			// It's a AJAX thing
			if(Ext.getCmp("noteid").getValue()){ // Update message

				// Get the current selected NoteID from the form
				var msgRec = storeMsgs.getById( Ext.getCmp("noteid").getValue() );

				// Update the record in the Memory Store
				msgRec.set('noteid', Ext.getCmp("noteid").getValue());
				msgRec.set('user', Ext.getCmp("cmb_assigned_to").getValue());
				msgRec.set('body', Ext.getCmp("note").getValue());
				msgRec.set('from', Ext.getCmp("cmb_assigned_to").getValue());
				msgRec.set('patient', Ext.getCmp("patient_name").getText());
				msgRec.set('reply_to', Ext.getCmp("reply_to").getValue());
				msgRec.set('type', Ext.getCmp("cmb_form_note_type").getValue());
				msgRec.set('status', Ext.getCmp("cmb_form_message_status").getValue());

				// Save the changes and`fires the data_update.ejs.php
				storeMsgs.save();
				storeMsgs.commitChanges();
				storeMsgs.reload();

			} else {							// New message

				// Copy the form fields into a new record
				var Message = new MessageRecord({
					noteid	: Ext.getCmp("noteid").getValue(),
					user	: Ext.getCmp('cmb_assigned_to').getValue(),
					body	: Ext.getCmp('note').getValue(),
					from	: Ext.getCmp('cmb_assigned_to').getValue(),
					patient	: Ext.getCmp('patient_name').getText(),
					reply_to: Ext.getCmp('reply_to').getValue(),
					type	: Ext.getCmp('cmb_form_note_type').getValue(),
					status	: Ext.getCmp('cmb_form_message_status').getValue(),
					date	: year + "-" + month + "-" + day + " " + hours + ":" + minutes
				});

				// Save the changes and fires the data_update.ejs.php
				storeMsgs.add(Message);
				storeMsgs.save();
				storeMsgs.commitChanges();
				storeMsgs.reload();
				
			}
			
			winMessage.hide();
		}
	},{
		text:'<?php echo htmlspecialchars( xl('Close'), ENT_NOQUOTES); ?>',
		iconCls: 'delete',
		handler: function(){ winMessage.hide(); }
	}]
}); // END WINDOW

// *************************************************************************************
// Create the GridPanel
// *************************************************************************************
var msgGrid = new Ext.grid.GridPanel({
		renderTo	 : Ext.getCmp('BottomPanel').body,
		id			   : 'msgGrid',
		store		   : storeMsgs,
		stripeRows : true,
		autoHeight : true,    // .<--- new    was only showing the 1st message
 		border     : false,   //  <--- new    
 		frame		   : false,
		viewConfig	: {forceFit: true}, //  <--- comments removed, I think looks better this way.  // force the grid to the width of the containing panel
		sm			: new Ext.grid.RowSelectionModel({singleSelect:true}),
		listeners: {
		
			// Single click to select the record, and copy the variables
			rowclick: function(msgGrid, rowIndex, e) {
			
				//Copy the selected message ID into the variable
				rowContent = Ext.getCmp('msgGrid').getStore().getAt(rowIndex);
				
				// Copy the BODY Message into the form
				document.getElementById('previousMsg').innerHTML = rowContent.get('body');
					
				// Enable buttons
				msgGrid.editMsg.enable();
				msgGrid.delMsg.enable();
			},

			// Double click to select the record, and edit the record
			rowdblclick:  function(msgGrid, rowIndex, e) {
					
				//Copy the selected message ID into the variable
				rowContent = Ext.getCmp('msgGrid').getStore().getAt(rowIndex);
					
				// Copy the BODY Message into the form
				document.getElementById('previousMsg').innerHTML = '<div id=\'previousMsg\' class="prvMsg">' + rowContent.get('body') + '</div>';
					
				// Copy all the fields into the form
				winMessage.patient_name.setText(rowContent.get('patient'));
				winMessage.cmb_assigned_to.setValue(rowContent.get('user'));
				winMessage.reply_to.setValue(rowContent.get('user'));
				winMessage.cmb_form_note_type.setValue(rowContent.get('type'));
				winMessage.cmb_form_message_status.setValue(rowContent.get('status'));
				winMessage.noteid.setValue(rowContent.get('noteid'));
				winMessage.note.setValue("");
					
				// Set the buttons state
				winMessage.cmb_assigned_to.readOnly = true;
				winMessage.patient_name.disable();
				winMessage.send.enable();
					
				winMessage.show();
			}
		},
		columns: [
			{header: 'noteid', sortable: false, dataIndex: 'noteid', hidden: true},
			{header: 'user', sortable: false, dataIndex: 'user', hidden: true},
			{ header: 'body', sortable: true, dataIndex: 'body', hidden: true },
			{ width: 200, header: '<?php echo htmlspecialchars( xl('From'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'from' },
			{ header: '<?php echo htmlspecialchars( xl('Patient'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'patient' },
			{ header: '<?php echo htmlspecialchars( xl('Type'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'type' },
			{ header: '<?php echo htmlspecialchars( xl('Date'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'date' }, 
			{ header: '<?php echo htmlspecialchars( xl('Status'), ENT_NOQUOTES); ?>', sortable: true, dataIndex: 'status' },
		],
		// *************************************************************************************
		// Grid Menu
		// *************************************************************************************
		tbar: [{
			xtype	:'button',
			id		: 'sendMsg',
			text	: '<?php xl("Send message", 'e'); ?>',
			iconCls	: 'newMessage',
			handler: function(){
				
				// Clear the rowContent variable
				rowContent = null;
			
				// Copy the BODY Message into the form
				document.getElementById('previousMsg').innerHTML = '<div id=\'previousMsg\' class="prvMsg">' + body_content + '</div>';
				winMessage.patient_name.setText('<?php echo htmlspecialchars( xl('Click to select patient...'), ENT_NOQUOTES); ?>');
				winMessage.noteid.setValue(null);
				winMessage.cmb_assigned_to.readOnly = false;
				winMessage.cmb_assigned_to.setValue(null);
				winMessage.cmb_form_note_type.setValue('Unassigned');
				winMessage.cmb_form_message_status.setValue('New');
				
				// Set the buttons state
				winMessage.patient_name.enable();
				winMessage.send.disable();
				
				winMessage.show();
			}
		},'-',{
			xtype	:'button',
			id		: 'editMsg',
			ref		: '../editMsg',
			text	: '<?php xl("Reply message", 'e'); ?>',
			iconCls	: 'edit',
			disabled: true,
			handler: function(){ 
			
				// Copy the BODY Message into the form
				document.getElementById('previousMsg').innerHTML = '<div id=\'previousMsg\' class="prvMsg">' + rowContent.get('body') + '</div>';
				
				// Copy all the fields into the form
				winMessage.patient_name.setText(rowContent.get('patient'));
				winMessage.cmb_assigned_to.setValue(rowContent.get('user'));
				winMessage.reply_to.setValue(rowContent.get('user'));
				winMessage.cmb_form_note_type.setValue(rowContent.get('type'));
				winMessage.cmb_form_message_status.setValue(rowContent.get('status'));
				winMessage.noteid.setValue(rowContent.get('noteid'));
				
				// Set the buttons state
				winMessage.cmb_assigned_to.readOnly = true;
				winMessage.patient_name.disable();
				winMessage.send.enable();
				
				winMessage.show();
			}
		},'-',{
			xtype		:'button',
			id			: 'delMsg',
			ref			: '../delMsg',
			text		: '<?php xl("Delete message", 'e'); ?>',
			iconCls		: 'delete',
			disabled	: true,
			handler: function(msgGrid){
				Ext.Msg.show({
					title: '<?php xl("Please confirm...", 'e'); ?>', 
					icon: Ext.MessageBox.QUESTION,
					msg:'<?php xl("Are you sure to delete this message?<br>From: ", 'e'); ?>' + rowContent.get('from'),
					buttons: Ext.Msg.YESNO,
					fn:function(btn,msgGrid){
				        if(btn=='yes'){
							// The datastore object will save the data
							// as soon changes is detected on the datastore
							// It's a AJAX thing
							var rows = Ext.getCmp('msgGrid').selModel.getSelections();
							storeMsgs.remove(rows);
							storeMsgs.save();
							storeMsgs.commitChanges();
							storeMsgs.reload();
		    	    	}
					}
				});
			}
		}], // END GRID TOP MENU
		plugins: [new Ext.ux.grid.Search({
			mode			: 'local',
			iconCls			: false,
			deferredRender	: false,
			dateFormat		: 'm/d/Y',
			minLength		: 4,
			align			: 'left',
			width			: 250,
			disableIndexes	: ['noteid', 'user', 'body'],
			position		: 'top'
		})]			
	}); // END GRID

}); // END EXTJS

</script>
