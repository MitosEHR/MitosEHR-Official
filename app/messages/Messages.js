//----------------------------------------------------------------------------------------------------------------------
// messages.ejs.php 
// v0.0.5
// Under GPLv3 License
// Integrated by: GI Technologies & MitosEHR.org in 2011
//----------------------------------------------------------------------------------------------------------------------
Ext.define('Ext.mitos.panel.messages.Messages',{
    extend      : 'Ext.mitos.RenderPanel',
    id          : 'panelMessages',
    pageTitle   : 'Messages',
    uses        : ['Ext.mitos.CRUDStore', 'Ext.mitos.GridPanel', 'Ext.mitos.SaveCancelWindow' ],
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
        body_content = 'Nothing posted yet...';

        // *************************************************************************************
        // Structure of the message record
        // creates a subclass of Ext.data.Record
        //
        // This should be the structure of the database table
        //
        // *************************************************************************************
        panel.storeMsgs = Ext.create('Ext.mitos.CRUDStore',{
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
        panel.storePat = Ext.create('Ext.mitos.CRUDStore',{
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
        panel.toData = Ext.create('Ext.mitos.CRUDStore',{
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
        panel.typeData = Ext.create('Ext.mitos.CRUDStore',{
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
        panel.statusData = Ext.create('Ext.mitos.CRUDStore',{
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
        panel.winPatients = Ext.create('Ext.window.Window', {
            width			: 900,
            height			: 400,
            border			: false,
            modal			: true,
            resizable		: true,
            autoScroll		: true,
            title		    : 'Patients',
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
                        { header: 'PID', sortable: true, dataIndex: 'pid' },
                        { header: 'Name', flex: 1, sortable: true, dataIndex: 'name' },
                        { header: 'Phone', sortable: true, dataIndex: 'phone'},
                        { header: 'SS', sortable: true, dataIndex: 'ss' },
                        { header: 'DOB', sortable: true, dataIndex: 'dob' }
                    ]
            }],
            // Window Bottom Bar
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                items: [
                    panel.patSelect = Ext.create('Ext.Button', {
                        text		:'Select',
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
                    panel.cmdClose = Ext.create('Ext.Button', {
                        text		: 'Close',
                        iconCls		: 'delete',
                        handler		: function(){ panel.winPatients.hide(); }
                    })
                ]
            }]
        }); // END WINDOW

        // *************************************************************************************
        // Message Form
        // *************************************************************************************
        panel.formMessage = Ext.create('Ext.form.Panel', {
            frame		: false,
            bodyStyle	: 'padding: 5px',
            defaults	: {labelWidth: 75, anchor: '100%'},
            items: [
                panel.Patient = Ext.create('Ext.Button', {
                    text: 'Click to select patient...',
                    fieldLabel: 'Patient',
                    name: 'patient',
                    height: 30,
                    margin: '5px',
                    handler: function(){ panel.winPatients.show(); }
                })
            ,
                panel.assigned_to = Ext.create('Ext.form.ComboBox', {
                    name: 'assigned_to',
                    fieldLabel: 'To',
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
                fieldLabel: 'Type',
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
                fieldLabel: 'Status',
                editable: false,
                triggerAction: 'all',
                mode: 'local',
                valueField: 'option_id',
                hiddenName: 'title',
                displayField: 'title',
                store: panel.statusData
            },{
                xtype: 'textfield',
                fieldLabel: 'Subject',
                name: 'subject'
            },
                panel.body = Ext.create('Ext.form.HtmlEditor', {
                    readOnly: true,
                    name: 'body',
                    height: 150
                })
            ,{
                xtype: 'htmleditor',
                name: 'curr_msg',
                height: 200
            },
                panel.id = Ext.create('Ext.form.Text', {
                    hidden: true,
                    name: 'id'
                })
            ,
                panel.pid = Ext.create('Ext.form.Text', {
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
        panel.winMessage = Ext.create('Ext.window.Window', {
            width		: 550,
            autoHeight	: true,
            modal		: true,
            border		: false,
            resizable	: false,
            autoScroll	: true,
            title		: 'Compose Message',
            closeAction	: 'hide',
            renderTo	: document.body,
            items		: [panel.formMessage],
            // Window Bottom Bar
            bbar:[
                panel.cmdSend = Ext.create('Ext.Button', {
                    text		:'Send',
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
                        } else {						// message
                            //----------------------------------------------------------------
                            // 1. Convert the form data into a JSON data Object
                            // 2. Re-format the Object to be a valid record (UserRecord)
                            // 3. Add the record to the datastore
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
                text:'Close',
                iconCls: 'delete',
                handler: function(){ panel.winMessage.hide(); }
            }]
        }); // END WINDOW

        // *************************************************************************************
        // Create the GridPanel
        // *************************************************************************************
        panel.msgGrid = Ext.create('Ext.grid.Panel', {
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
                { flex: 1, header: 'Subject', sortable: true, dataIndex: 'subject' },
                { width: 200, header: 'From', sortable: true, dataIndex: 'user' },
                { header: 'Patient', sortable: true, dataIndex: 'patient' },
                { header: 'Type', sortable: true, dataIndex: 'note_type' },
                { width: 150, header: 'Date', sortable: true, dataIndex: 'date' },
                { header: 'Status', sortable: true, dataIndex: 'message_status' }
            ],
            // *************************************************************************************
            // Grid Menu
            // *************************************************************************************
            tbar: [{
                xtype	:'button',
                id		: 'sendMsg',
                text	: 'Send message", "e',
                iconCls	: 'newMessage',
                handler: function(){
                    // Clear the rowContent variable
                    panel.formMessage.getForm().reset(); // Clear the form
                    panel.Patient.setText('Click to select patient...');
                    panel.Patient.enable();
                    panel.assigned_to.enable();
                    panel.cmdSend.disable();
                    panel.body.setVisible(false);
                    panel.winMessage.show();
                }
            },'-',
                panel.editMsg = Ext.create('Ext.Button', {
                    text	   : 'Reply message',
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
                panel.delMsg = Ext.create('Ext.Button', {
                    text		 : 'Delete message',
                    iconCls		: 'delete',
                    disabled	: true,
                    handler: function(){
                        Ext.Msg.show({
                            title: 'Please confirm...", "e',
                            icon: Ext.MessageBox.QUESTION,
                            msg:'Are you sure to delete this message?<br>From: ' + rowContent.get('from'),
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
        panel.pageBody = [ panel.msgGrid ];
        panel.callParent(arguments);
    } // end of initComponent
}); //ens MessagesPanel class