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
    uses        : [
        'Ext.mitos.restStore',
        'Ext.mitos.GridPanel',
        'Ext.mitos.window.Window',
        'Ext.mitos.SaveCancelWindow',
        'Ext.mitos.LivePatientSearch',
        'Ext.mitos.combo.MsgStatus',
        'Ext.mitos.combo.MsgNoteType',
        'Ext.mitos.combo.Users'
    ],
    initComponent: function(){
        var me = this;
        // *************************************************************************************
        // Message Store
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
        // Message GridPanel
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
                itemdblclick: this.onItemdblclick
            },
            columns: [
                { header: 'noteid',     sortable: false, dataIndex: 'noteid',           hidden: true},
                { header: 'reply_id',   sortable: false, dataIndex: 'reply_id',         hidden: true},
                { header: 'user',       sortable: false, dataIndex: 'user',             hidden: true},
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
                    me.onNew();
                }
            }]
        }); // End Message GridPanel
        // *************************************************************************************
        // Message Window
        // *************************************************************************************
        me.winMessage = Ext.create('Ext.mitos.window.Window', {
            width		: 700,
            title		: 'Compose Message',
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
                    xtype       : 'userscombo',
                    name        : 'assigned_to',
                    fieldLabel  : 'To',
                    allowBlank  : false
                },{
                    xtype       : 'msgnotetypecombo',
                    name        : 'note_type',
                    fieldLabel  : 'Type'
                },{
                    xtype       : 'msgstatuscombo',
                    name        : 'message_status',
                    fieldLabel  : 'Status'
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
            buttons:[{
                text		: 'Send',
                iconCls		: 'save',
                cls		    : 'winSave',
                itemId      : 'sendMsg',
                handler: function() {
                    var form    = me.winMessage.down('form').getForm();
                    if(form.isValid()){
                        me.onSave(form, me.storeMsgs);
                        me.winMessage.close();
                    }else{
                        me.action('reply');
                    }
                }
            },'-',{
                text		: 'Reply',
                iconCls		: 'edit',
                itemId      : 'replyMsg',
                disabled	: true,
                handler: function() {
                    me.action('reply');
                }
            },'-',{
                text        : 'Delete',
                cls         : 'winDelete',
                iconCls     : 'delete',
                itemId      : 'deleteMsg',
                disabled	: true,
                scope       : me,
                handler: function(){
                    var form    = me.winMessage.down('form').getForm();
                    me.onDelete(form, me.storeMsgs);
                }
            }],
            listeners:{
                scope:me,
                close: function(){
                    me.action('close')
                }
            }
        });
        me.pageBody = [ me.msgGrid ];
        me.callParent(arguments);
    }, // End initComponent
    onNew:function(){
        var form = this.winMessage.down('form');
        form.getForm().reset();
        var model = Ext.ModelManager.getModel('Messages'),
        newModel  = Ext.ModelManager.create({
            message_status  : 'New',
            note_type       : 'Unassigned'
        }, model );
        form.getForm().loadRecord(newModel);
        this.action('new');
    },
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
        this.winMessage.close();
    },
    onDelete:function(form, store){
        Ext.Msg.show({
            title   : 'Please confirm...',
            icon    : Ext.MessageBox.QUESTION,
            msg     :'Are you sure to delete this message?',
            buttons : Ext.Msg.YESNO,
            scope   : this,
            fn :function(btn){
                if(btn=='yes'){
                    var currentRec = form.getRecord();
                    store.remove(currentRec);
                    store.destroy();
                    this.winMessage.close();
                }
            }
        });
    },
    onItemdblclick: function(view, record) {
        var form = this.winMessage.down('form');
        form.getForm().loadRecord(record);
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
        deletebtn       = winTbar.getComponent('deleteMsg'),
        replybtn        = winTbar.getComponent('replyMsg');
        switch(action){
            case 'new':
                bodyMsg.hide();
                currMsg.show();
                replybtn.disable();
                patientCombo.show();
                patientField.hide();
                win.show();
            break;
            case 'reply':
                currMsg.show();
                patientCombo.hide();
                patientField.show();
                replybtn.disable();
            break;
            case 'close':
                form.getForm().reset();
                newbtn.enable();
                deletebtn.disable();
                sm.deselectAll();
            break;
            case 'itemdblclick':
                replybtn.enable();
                bodyMsg.show();
                currMsg.hide();
                patientCombo.hide();
                patientField.show();
                deletebtn.enable();
                win.show();
            break;
        }
    }
}); //end Ext.mitos.panel.messages.Messages