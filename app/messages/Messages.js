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
    uses        : ['Ext.mitos.restStore', 'Ext.mitos.GridPanel', 'Ext.mitos.SaveCancelWindow','Ext.mitos.LivePatientSearch' ],
    initComponent: function(){
        var me = this,
        rowContent;
        // *************************************************************************************
        // Structure of the message record
        // creates a subclass of Ext.data.Record
        // This should be the structure of the database table
        // *************************************************************************************
        me.storeMsgs = Ext.create('Ext.mitos.restStore',{
            fields: [
                {name: 'id',				type: 'int'},
                {name: 'date',				type: 'string'},
                {name: 'body',				type: 'string'},
                {name: 'curr_msg',			type: 'string'},
                {name: 'pid',				type: 'string'},
                {name: 'patient_name',	    type: 'string'},
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
            url		    : 'app/messages/data.php'
        });
        // *************************************************************************************
        // Structure and load the data for cmb_toUsers
        // AJAX -> component_data.ejs.php
        // *************************************************************************************
        me.toData = Ext.create('Ext.mitos.restStore',{
            fields: [
                {name: 'user',      type: 'string' },
                {name: 'full_name', type: 'string' }
            ],
            model		: 'mUser',
            idProperty	: 'id',
            url		    : 'app/messages/component_data.ejs.php',
            extraParams	: {"task": "users"},
            autoLoad    : true
        });
        // *************************************************************************************
        // Structure, data for cmb_Type
        // AJAX -> component_data.ejs.php
        // *************************************************************************************
        me.typeData = Ext.create('Ext.mitos.restStore',{
            fields: [
                {name: 'option_id', type: 'string' },
                {name: 'title',     type: 'string' }
            ],
            model		: 'mTypes',
            idProperty	: 'option_id',
            url		    : 'lib/layoutEngine/listOptions.json.php',
            extraParams	: {"filter": "note_type"},
            autoLoad    : true
        });
        // *************************************************************************************
        // Structure, data for cmb_Status
        // AJAX -> component_data.ejs.php
        // *************************************************************************************
        me.statusData = Ext.create('Ext.mitos.restStore',{
            fields: [
                {name: 'option_id', type: 'string' },
                {name: 'title',     type: 'string' }
            ],
            model		: 'mStatus',
            idProperty	: 'option_id',
            url	    	: 'lib/layoutEngine/listOptions.json.php',
            extraParams	: {"filter": "message_status"},
            autoLoad    : true
        });
        // *************************************************************************************
        // Message Window Dialog
        // *************************************************************************************
        me.winMessage = Ext.create('Ext.window.Window', {
            width		: 700,
            autoHeight	: true,
            modal		: true,
            border		: false,
            resizable	: false,
            autoScroll	: true,
            title		: 'Compose Message',
            closeAction	: 'hide',
            items		: [{
                xtype       : 'form',
                frame		: false,
                bodyStyle	: 'padding: 5px',
                defaults	: { labelWidth: 75, anchor: '100%' },
                items: [{
                    xtype       : 'livepatientsearch',
                    fieldLabel  : 'Patient',
                    hideLabel   : false,
                    emptyText   : 'No patient selected',
                    name        : 'pid',
                    itemId      : 'patientCombo'
                },{
                    xtype       : 'textfield',
                    fieldLabel  : 'Patient',
                    name        : 'patient_name',
                    itemId      : 'patientField',
                    disabled    : true
                },{
                    xtype       : 'combo',
                    name        : 'assigned_to',
                    fieldLabel  : 'To',
                    editable    : false,
                    triggerAction: 'all',
                    mode        : 'local',
                    valueField  : 'user',
                    displayField: 'full_name',
                    allowBlank  : false,
                    store       : me.toData
                },{
                    xtype       : 'combo',
                    name        : 'note_type',
                    fieldLabel  : 'Type',
                    editable    : false,
                    mode        : 'local',
                    valueField  : 'option_id',
                    displayField: 'option_id',
                    store       : me.typeData
                },{
                    xtype       : 'combo',
                    name        : 'message_status',
                    fieldLabel  : 'Status',
                    editable    : false,
                    mode        : 'local',
                    valueField  : 'option_id',
                    displayField: 'title',
                    store       : me.statusData
                },{
                    xtype       : 'textfield',
                    fieldLabel  : 'Subject',
                    name        : 'subject'
                },{
                    xtype       : 'textarea',
                    readOnly    : true,
                    name        : 'body',
                    itemId      : 'bodyMsg',
                    height      : 100
                },{
                    xtype       : 'textarea',
                    name        : 'curr_msg',
                    itemId      : 'currMsg',
                    allowBlank  : false,
                    height      : 100
                },{
                    xtype       : 'textfield',
                    hidden      : true,
                    name        : 'id'
                },{
                    xtype       : 'textfield',
                    hidden      : true,
                    name        : 'pid'
                },{
                    xtype       : 'textfield',
                    hidden      : true,
                    name        : 'reply_id'
                }]
            }],
            bbar:[{
                text		: 'Send',
                iconCls		: 'save',
                itemId      : 'sendMsg',
                handler: function() {
                    var form    = me.winMessage.down('form').getForm();
                    if(form.isValid()){
                        me.onSave(form, me.storeMsgs);
                        me.action('close');
                    }
                }
            },'-',{
                text		: 'Reply',
                iconCls		: 'edit',
                itemId      : 'replyMsg',
                disabled	: true,
                handler: function() {
                    this.disable();
                    me.action('reply');
                }
            },'-',{
                text        : 'Close',
                iconCls     : 'delete',
                itemId      : 'close',
                handler: function(){
                    me.action('close');
                }
            }],
            listeners:{
                hide: function(){
                    me.action('close')
                }
            }
        }); // end me.winMessage
        // *************************************************************************************
        // Create the GridPanel
        // *************************************************************************************
        me.msgGrid = Ext.create('Ext.grid.Panel', {
            store		: me.storeMsgs,
            autoHeight 	: true,
            border     	: true,
            frame		: true,
            loadMask    : true,
            viewConfig 	: {forceFit: true, stripeRows : true},
            listeners: {
                scope       : this,
                itemclick   : this.onItemclick,
                itemdblclick: this.onItemdblclick
            },
            columns: [
                { header: 'noteid',     sortable: false, dataIndex: 'noteid',   hidden: true},
                { header: 'reply_id',   sortable: false, dataIndex: 'reply_id', hidden: true},
                { header: 'user',       sortable: false, dataIndex: 'user',     hidden: true},
                { header: 'Status',     sortable: true,  dataIndex: 'message_status',   width : 70 },
                { header: 'From',       sortable: true,  dataIndex: 'user',             width : 200 },
                { header: 'Patient',    sortable: true,  dataIndex: 'patient_name',     width : 200 },
                { header: 'Subject',    sortable: true,  dataIndex: 'subject',          flex  : 1 },
                { header: 'Type',       sortable: true,  dataIndex: 'note_type',        width : 100  }

            ],
            tbar: [{
                text	: 'New message',
                iconCls	: 'newMessage',
                itemId  : 'newMsg',
                handler: function(){

                    me.action('new');
               }
            },'-',{
                text        : 'Delete message',
                iconCls		: 'delete',
                itemId      : 'deleteMsg',
                disabled	: true,
                scope       : this,
                handler     : this.onDelete
            }] // end grid toolbar
        }); // end me.msgGrid
        me.pageBody = [ me.msgGrid ];
        me.callParent(arguments);
    }, // end of initComponent
    onSave:function(form, store){
        var record      = form.getRecord(),
            values      = form.getValues(),
            storeIndex  = store.indexOf(record);

        if (storeIndex == -1){
            store.add(values);

        }else{
            record.set(values);
        }
        store.sync();
        store.load();
        this.action('close');
    },
    onDelete:function(){
        Ext.Msg.show({
            title   : 'Please confirm...',
            icon    : Ext.MessageBox.QUESTION,
            msg     :'Are you sure to delete this message?',
            buttons : Ext.Msg.YESNO,
            scope   : this,
            fn :function(btn){
                if(btn=='yes'){
                    var sm = this.msgGrid.getSelectionModel();
                    this.storeMsgs.remove(sm.getSelection());
                    this.storeMsgs.sync();
                    this.storeMsgs.load();
                    this.action('delete');
                }
            }
        });
    },
    onItemclick: function(view, record) {
        var form = this.winMessage.down('form');
        form.getForm().loadRecord(record);
        this.action('itemclick');
    },
    onItemdblclick: function(view, record) {
        var form    = this.winMessage.down('form');
        form.getForm().loadRecord(record);
        form.getComponent('body').show();
        this.action('itemdblclick');
    },
    loadStores:function(){
        this.storeMsgs.load();
    },
    action:function(action){
        var win         = this.winMessage,
        sm              = this.msgGrid.getSelectionModel(),
        gridTbar        = this.msgGrid.down('toolbar'),
        winTbar         = win.down('toolbar'),
        form            = win.down('form'),
        patientCombo    = form.getComponent('patientCombo'),
        patientField    = form.getComponent('patientField'),
        bodyMsg         = form.getComponent('bodyMsg'),
        currMsg         = form.getComponent('currMsg'),
        newbtn          = gridTbar.getComponent('newMsg'),
        deletebtn       = gridTbar.getComponent('deleteMsg'),
        replybtn        = winTbar.getComponent('replyMsg');
        switch(action){
            case 'new':
                form.getForm().reset();
                var model = Ext.ModelManager.getModel('Messages'),
                newModel  = Ext.ModelManager.create({
                    message_status  : 'New',
                    note_type       : 'Unassigned'
                }, model );
                form.getForm().loadRecord(newModel);
                
                bodyMsg.hide();
                currMsg.show();
                replybtn.disable();
                patientCombo.show();
                patientField.hide();
                win.show();
            break
            case 'reply':
                currMsg.show();
                patientCombo.hide();
                patientField.show();
                win.show();
                sm.deselectAll();
            break;
            case 'delete':
                newbtn.enable();
                deletebtn.disable();
                sm.deselectAll();
            break;
            case 'close':
                newbtn.enable();
                deletebtn.disable();
                win.close();
                sm.deselectAll();
            break;
            case 'itemclick':
                deletebtn.enable();
            break;
            case 'itemdblclick':
                replybtn.enable();
                currMsg.hide();
                patientCombo.hide();
                patientField.show();
                deletebtn.enable();
                win.show();
                sm.deselectAll();
            break
        }
    }
}); //end Ext.mitos.panel.messages.Messages