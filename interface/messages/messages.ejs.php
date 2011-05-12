<?php

//--------------------------------------------------------------------------------------------------------------------------
// messages.ejs.php 
// v0.0.4
// Under GPLv3 License
// 
// Integrated by: GI Technologies & MitosEHR.org in 2011
// 
//--------------------------------------------------------------------------------------------------------------------------

session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

include_once("../../library/I18n/I18n.inc.php");

//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;
?>

<script type="text/javascript">
Ext.require([ '*' ]);

// *************************************************************************************
// Start Sencha Framework
// *************************************************************************************
Ext.onReady(function() {

//******************************************************************************
// Sanitizing Objects
// Destroy them, if already exists in the browser memory.
// This destructions must be called for all the objects that
// are rendered on the document.body 
//******************************************************************************
if ( Ext.getCmp('winPatients') ){ Ext.getCmp('winPatients').destroy(); }
if ( Ext.getCmp('winMessage') ){ Ext.getCmp('winMessage').destroy(); }

// *************************************************************************************
// Global variables
// *************************************************************************************
var rowContent;
var body_content;

// *************************************************************************************
// Update the title on the panel
// *************************************************************************************
Ext.getCmp('BottomPanel').setTitle("Messages");

body_content = '<?php i18n('Nothing posted yet...'); ?>';

// *************************************************************************************
// Structure of the message record
// creates a subclass of Ext.data.Record
//
// This should be the structure of the database table
// 
// *************************************************************************************
Ext.define("Messages", {
	extend: "Ext.data.Model", 
	fields: [
	{name: 'noteid',	type: 'int'},
	{name: 'user',		type: 'string'},
	{name: 'subject',   type: 'string'},
	{name: 'body',		type: 'string'},
	{name: 'from',	  	type: 'string'},
	{name: 'patient',  	type: 'string'},
	{name: 'type',	  	type: 'string'},
	{name: 'date',	  	type: 'string'},
	{name: 'status',   	type: 'string'},
	{name: 'reply_id',  type: 'int'},
	{name: 'reply_to',	type: 'int'}
]});

// *************************************************************************************
// Structure and load the data for Messages
// AJAX -> data_*.ejs.php
// *************************************************************************************
var storeMsgs = new Ext.data.Store({
    model		: 'Messages',
    proxy		: {
        type	: 'ajax',
		api		: {
        	read 	: 'interface/messages/data_read.ejs.php?show=<?php echo $show_all=='yes' ? $usrvar='_%' : $usrvar=$_SESSION['authUser']; ?>',
			//create	: 'interface/messages/data_read.ejs.php',
			//update	: 'interface/messages/data_read.ejs.php',
			//destroy 	: 'interface/messages/data_read.ejs.php'
		},
        reader: {
	    	type			: 'json',
	        idProperty		: 'noteid',
	        totalProperty	: 'totals',
	        root			: 'row'
	    },
	    writer: {
			type	 		: 'json',
			writeAllFields	: true,
			allowSingle	 	: true,
			encode	 		: true,
			root	 		: 'row'
		}
	},
    autoLoad: true
});

// *************************************************************************************
// Structure and load the data for cmb_toUsers
// AJAX -> component_data.ejs.php
// *************************************************************************************
Ext.define("Patients", {
	extend: "Ext.data.Model", 
	fields: [
	{name: 'id',    type: 'int'},
	{name: 'name',  type: 'string'},
	{name: 'phone', type: 'string'},
	{name: 'ss',    type: 'string'},
	{name: 'dob',   type: 'string'},
	{name: 'pid',   type: 'string'}
]});
var storePat = new Ext.data.Store({
   	model		: 'Patients',
   	proxy		: {
   		type	: 'ajax',
		api		: {
			read	: 'interface/messages/component_data.ejs.php?task=patients'
		},
  	   	reader: {
      	    type			: 'json',
        	idProperty		: 'id',
       	    totalProperty	: 'totals',
  	       	root			: 'row'
		}
	},
  	autoLoad: true
});// End storePat

// *************************************************************************************
// Structure and load the data for cmb_toUsers
// AJAX -> component_data.ejs.php
// *************************************************************************************
Ext.define("User", {
	extend: "Ext.data.Model", 
	fields: [
	{name: 'user',      type: 'string' },
	{name: 'full_name', type: 'string' }
]});
var toData = new Ext.data.Store({
   	model		: 'User',
   	proxy		: {
   		type	: 'ajax',
		api		: {
			read	: 'interface/messages/component_data.ejs.php?task=users'
		},
  	   	reader: {
      	    type			: 'json',
        	idProperty		: 'id',
       	    totalProperty	: 'totals',
  	       	root			: 'row'
		}
	},
  	autoLoad: true
}); // End toData

// *************************************************************************************
// Structure, data for cmb_Type
// AJAX -> component_data.ejs.php
// *************************************************************************************
Ext.define("Types", {
	extend: "Ext.data.Model", 
	fields: [
	{name: 'option_id', type: 'string' },
	{name: 'title',     type: 'string' }
]});
var typeData = new Ext.data.Store({
   	model		: 'Types',
   	proxy		: {
   		type	: 'ajax',
		api		: {
			read	: 'interface/messages/component_data.ejs.php?task=types'
		},
  	   	reader: {
      	    type			: 'json',
        	idProperty		: 'id',
       	    totalProperty	: 'totals',
  	       	root			: 'row'
		}
	},
  	autoLoad: true
}); // End typeData

// *************************************************************************************
// Structure, data for cmb_Status
// AJAX -> component_data.ejs.php
// *************************************************************************************
Ext.define("Status", {extend: "Ext.data.Model", fields: [
	{name: 'option_id', type: 'string' },
	{name: 'title',     type: 'string' }
]});
var statusData = new Ext.data.Store({
   	model		: 'Status',
   	proxy		: {
   		type	: 'ajax',
		api		: {
			read	: 'interface/messages/component_data.ejs.php?task=status'
		},
  	   	reader: {
      	    type			: 'json',
        	idProperty		: 'id',
       	    totalProperty	: 'totals',
  	       	root			: 'row'
		}
	},
  	autoLoad: true
}); // End statusData

// *************************************************************************************
// Patient Select Dialog
// *************************************************************************************
var winPatients = new  Ext.Window({
	width			: 900,
	height			: 400,
	modal			: true,
	resizable		: true,
	autoScroll		: true,
	title		    :	'<?php i18n('Patients'); ?>',
	closeAction		: 'hide',
	renderTo		: document.body,
	items: [{
			xtype		    : 'grid',
			name		    : 'gridPatients',
			autoHeight	: true,
			store		    : storePat,
			//stripeRows	: true,
			frame		    : false,
			viewConfig	: {forceFit: true, stripeRows: true,}, // force the grid to the width of the containing panel
			//sm			    : new Ext.grid.RowSelectionModel({singleSelect:true}),
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
				{ header: '<?php i18n('Name'); ?>', sortable: true, dataIndex: 'name' },
				{ header: '<?php i18n('Phone'); ?>', sortable: true, dataIndex: 'phone'},
				{ header: '<?php i18n('SS'); ?>', sortable: true, dataIndex: 'ss' },
				{ header: '<?php i18n('DOB'); ?>', sortable: true, dataIndex: 'dob' },
				{ header: '<?php i18n('PID'); ?>', sortable: true, dataIndex: 'pid' }
			],
			tbar:[],
	}],

	// Window Bottom Bar
	bbar:[{
		text		:'<?php i18n('Select'); ?>',
		iconCls		: 'select',
		ref			  : '../patSelect',
		formBind	: true,
		disabled	: true,
		handler: function() {
			winMessage.reply_to.setValue( rowContent.get('id') );
			winMessage.patient_name.setText( rowContent.get('name') );
			winMessage.send.enable();
			winPatients.hide();
		}
	},{
		text		  : '<?php i18n('Close'); ?>',
		iconCls		: 'delete',
		ref			  : '../patClose',
		formBind	: true,
		handler		: function(){ winPatients.hide(); }
	}]

}); // END WINDOW

// *************************************************************************************
// Previuos Messages Panel
// *************************************************************************************
var prvMsg = new Ext.Panel({
	title			: '<?php i18n('Reply History'); ?>',
	labelWidth		: 100,
	minSize			  : 300,
	height			  : 200,
	region			  : 'north',
	bodyStyle		  : 'padding: 5px;',
	autoScroll		: true,
	border			  : false,
	animCollapse	: false,
	collapsible		: true,
	titleCollapse	: true,
	split			    : true,
	html			    : '<div id=\'previousMsg\' class="prvMsg">' + body_content + '</div>',
	listeners: {
		collapse: function() { winMessage.syncShadow(); },
		expand: function(){ winMessage.syncShadow(); }
	}
});

// *************************************************************************************
// Message Window Dialog
// *************************************************************************************
var winMessage = new  Ext.Window({
	width		: 640,
	autoHeight	: true,
	modal		: true,
	resizable	: false,
	autoScroll	: true,
	id			: 'winMessage',
	title		: '<?php i18n('Compose Message'); ?>',
	closeAction	: 'hide',
	renderTo	: document.body,
	items: [{
		xtype		: 'form',
		region		:'center',
		labelWidth	: 75,
		id			: 'frmMessage',
		frame		: true,
		bodyStyle	: 'padding: 5px 5px 0 5px',
		defaults	: {width: 180},
		formBind	: true,
		buttonAlign	: 'left',
		split		    : true,
		items: [
			{ xtype: 'button', 
				ref: '../patient_name',
				id: 'patient_name',
				text: '<?php i18n('Click to select patient...'); ?>',
				fieldLabel: '<?php i18n('Patient'); ?>',
				name: 'patient_name',
				editable: false,
				handler: function(){ winPatients.show(); }
			},
			{ xtype: 'combo', 
				ref: '../cmb_assigned_to',
				id: 'cmb_assigned_to',
				name: 'cmb_assigned_to',
				fieldLabel: '<?php i18n('To'); ?>',
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
				fieldLabel: '<?php i18n('Type'); ?>',
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
				fieldLabel: '<?php i18n('Status'); ?>',
				editable: false,
				triggerAction: 'all',
				mode: 'local',
				valueField: 'option_id',
				hiddenName: 'form_message_status',
				displayField: 'title',
				store: statusData
			},
			{ xtype: 'textfield', 
			  ref: '../subject',
			  fieldLabel: '<?php i18n('Subject'); ?>',
        id: 'subject',
        name: 'subject',
        width: 520
      },
			{ xtype: 'htmleditor', 
				ref: '../note',
				fieldLabel: '<?php i18n('Message'); ?>',
				id: 'note',
				name: 'note',
				labelWidth  : 0,
				width: 520,
				height: 130
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
			},
			{ xtype: 'textfield',
        ref: '../reply_id',
        id: 'reply_id',
        hidden: true,
        name: 'reply_id'
      }
		]
		// Top panel, for appended messages.
	}, prvMsg ],
	// Window Bottom Bar
	bbar:[{
		text		:'<?php i18n('Send'); ?>',
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
				msgRec.set('noteid',    Ext.getCmp("noteid").getValue());
				msgRec.set('user',      Ext.getCmp("cmb_assigned_to").getValue());
				msgRec.set('subject',   Ext.getCmp("subject").getValue());
				msgRec.set('body',      Ext.getCmp("note").getValue());
				msgRec.set('from',      Ext.getCmp("cmb_assigned_to").getValue());
				msgRec.set('patient',   Ext.getCmp("patient_name").getText());
				msgRec.set('reply_to',  Ext.getCmp("reply_to").getValue());
				msgRec.set('type',      Ext.getCmp("cmb_form_note_type").getValue());
				msgRec.set('status',    Ext.getCmp("cmb_form_message_status").getValue());
				msgRec.set('reply_id',  Ext.getCmp("reply_id").getValue()); 

				// Save the changes and`fires the data_update.ejs.php
				storeMsgs.save();
				storeMsgs.commitChanges();
				storeMsgs.reload();

			} else {							// New message

				// Copy the form fields into a new record
				var Message = new MessageRecord({
					noteid		: Ext.getCmp("noteid").getValue(),
					user		: Ext.getCmp('cmb_assigned_to').getValue(),
					subject		: Ext.getCmp('subject').getValue(),
					body	    : Ext.getCmp('note').getValue(),
					from	    : Ext.getCmp('cmb_assigned_to').getValue(),
					patient		: Ext.getCmp('patient_name').getText(),
					reply_to	: Ext.getCmp('reply_to').getValue(),
					type	    : Ext.getCmp('cmb_form_note_type').getValue(),
					status		: Ext.getCmp('cmb_form_message_status').getValue(),
					date	    : year + "-" + month + "-" + day + " " + hours + ":" + minutes
				});

				// Save the changes and fires the data_update.ejs.php
				storeMsgs.add(Message);
				storeMsgs.sync();
				storeMsgs.load();
				
			}
			
			winMessage.hide();
		}
	},{
		text:'<?php echo htmlspecialchars( i18n('Close'), ENT_NOQUOTES); ?>',
		iconCls: 'delete',
		handler: function(){ winMessage.hide(); }
	}]
}); // END WINDOW

// *************************************************************************************
// Create the GridPanel
// *************************************************************************************
var msgGrid = new Ext.grid.GridPanel({
	id			: 'msgGrid',
	store		: storeMsgs,
	autoHeight 	: true,
	border     	: false,
	frame		: false,
	loadMask    : true,
	viewConfig 	: {forceFit: true, stripeRows : true},
	//sm			   : new Ext.grid.RowSelectionModel({singleSelect:true}),
		listeners: {
	
			// Single click to select the record, and copy the variables
			rowclick: function(msgGrid, rowIndex, e) {
		
				//Copy the selected message ID into the variable
				rowContent = Ext.getCmp('msgGrid').getStore().getAt(rowIndex);
			
				// Copy the BODY Message into the form
				// document.getElementById('msgGrid').innerHTML = rowContent.get('body');     << ------ REMOVED ASK GINO!!!!!!!
				
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
				winMessage.subject.setValue(rowContent.get('subject'));
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
		{ header: 'noteid', sortable: false, dataIndex: 'noteid', hidden: true},
		{ header: 'reply_id', sortable: false, dataIndex: 'reply_id', hidden: true},
		{ header: 'user', sortable: false, dataIndex: 'user', hidden: true},
		{ header: 'body', sortable: true, dataIndex: 'body', hidden: true },
		{ header: '<?php i18n('Subject'); ?>', sortable: true, dataIndex: 'subject', id: 'subject' },
		{ width: 200, header: '<?php i18n('From'); ?>', sortable: true, dataIndex: 'from' },
		{ header: '<?php i18n('Patient'); ?>', sortable: true, dataIndex: 'patient' },
		{ header: '<?php i18n('Type'); ?>', sortable: true, dataIndex: 'type' },
		{ header: '<?php i18n('Date'); ?>', sortable: true, dataIndex: 'date' }, 
		{ header: '<?php i18n('Status'); ?>', sortable: true, dataIndex: 'status' },
	],

	// *************************************************************************************
	// Grid Menu
	// *************************************************************************************
	tbar: [{
		xtype	:'button',
		id		: 'sendMsg',
		text	: '<?php i18n("Send message", 'e'); ?>',
		iconCls	: 'newMessage',
		handler: function(){
			
			// Clear the rowContent variable
			rowContent = null;
		
			// Copy the BODY Message into the form
			document.getElementById('previousMsg').innerHTML = '<div id=\'previousMsg\' class="prvMsg">' + body_content + '</div>';
			//winMessage.patient_name.setText('<?php i18n('Click to select patient'); ?>');
			//winMessage.noteid.setValue(null);
			//winMessage.cmb_assigned_to.readOnly = false;
			//winMessage.cmb_assigned_to.setValue(null);
			//winMessage.cmb_form_note_type.setValue('Unassigned');
			//winMessage.cmb_form_message_status.setValue('New');
			//winMessage.reply_id.setValue(null);

			// Set the buttons state
			//winMessage.patient_name.enable();
			//winMessage.send.disable();
			
			winMessage.show();
		}
	},'-',{
		xtype	   :'button',
		id		   : 'editMsg',
		ref		   : '../editMsg',
		text	   : '<?php i18n('Reply message'); ?>',
		iconCls	 : 'edit',
		disabled : true,
		handler  : function(){ 
		
			// Copy the BODY Message into the form
			document.getElementById('previousMsg').innerHTML = '<div id=\'previousMsg\' class="prvMsg">' + rowContent.get('body') + '</div>';
			
			// Copy all the fields into the form
			winMessage.patient_name.setText(rowContent.get('patient'));
			winMessage.cmb_assigned_to.setValue(rowContent.get('user'));
			winMessage.reply_to.setValue(rowContent.get('user'));
			winMessage.cmb_form_note_type.setValue(rowContent.get('type'));
			winMessage.cmb_form_message_status.setValue(rowContent.get('status'));
			winMessage.noteid.setValue(rowContent.get('noteid'));
			winMessage.subject.setValue(rowContent.get('subject'));
			winMessage.reply_id.setValue(rowContent.get('reply_id'));
			
			// Set the buttons state
			winMessage.cmb_assigned_to.readOnly = true;
			winMessage.patient_name.disable();
			winMessage.send.enable();
			
			winMessage.show();
		}
	},'-',{
		xtype		  :'button',
		id			  : 'delMsg',
		ref			  : '../delMsg',
		text		  : '<?php i18n('Delete message'); ?>',
		iconCls		: 'delete',
		disabled	: true,
		handler: function(msgGrid){
			Ext.Msg.show({
				title: '<?php i18n("Please confirm...", 'e'); ?>', 
				icon: Ext.MessageBox.QUESTION,
			msg:'<?php i18n('Are you sure to delete this message?<br>From: '); ?>' + rowContent.get('from'),
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

}); // END GRID

//******************************************************************************
// Render panel
//******************************************************************************
var topRenderPanel = Ext.create('Ext.Panel', {
	renderTo	: Ext.getCmp('BottomPanel').body,
  	frame 		: false,
	border 		: false,
	id			: 'botRenderPanel',
	loadMask    : true,
	items		: [msgGrid]
});

}); // END EXTJS

</script>
