Ext.define('Ext.mitos.panel.messages.Messages',{
    extend      : 'Ext.mitos.RenderPanel',
    id          : 'panelMessages',
    pageTitle   : 'Messages',
    pageLayout  : 'border',
    defaults:{split: true},
    uses        : [
        'Ext.mitos.restStoreModel',
        'Ext.mitos.GridPanel',
        'Ext.mitos.window.Window',
        'Ext.mitos.LivePatientSearch',
        'Ext.mitos.combo.MsgStatus',
        'Ext.mitos.combo.MsgNoteType',
        'Ext.mitos.combo.Users'
    ],
    initComponent: function(){
        var me = this;
        /**
         * Message Store
         */
        me.storeMsgs = Ext.create('Ext.mitos.restStoreModel',{
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

        /**
         * Message GridPanel
         */
        me.msgGrid = Ext.create('Ext.mitos.GridPanel', {
            store		: me.storeMsgs,
            region      : 'center',
            border:true,
            viewConfig 	: {forceFit: true, stripeRows : true},
            listeners: {
                scope       : this,
                itemclick   : this.onItemClick,
                itemdblclick: this.onItemdblclick
            },
            columns: [
                { header: 'noteid',     sortable: false, dataIndex: 'noteid',           hidden: true },
                { header: 'reply_id',   sortable: false, dataIndex: 'reply_id',         hidden: true },
                { header: 'user',       sortable: false, dataIndex: 'user',             hidden: true },
                { header: 'Status',     sortable: true,  dataIndex: 'message_status',   width : 70   },
                { header: 'From',       sortable: true,  dataIndex: 'user',             width : 200  },
                { header: 'Patient',    sortable: true,  dataIndex: 'patient_name',     width : 200  },
                { header: 'Subject',    sortable: true,  dataIndex: 'subject',          flex  : 1    },
                { header: 'Type',       sortable: true,  dataIndex: 'note_type',        width : 100  }

            ],
            tbar: [{
                text	: 'New message',
                iconCls	: 'newMessage',
                itemId  : 'newMsg',
                handler : function(){
                    me.onNew();
                }
            }]
        });
        /**
         *  Message Preview and Form panels
         */
        me.msgContainer = Ext.create('Ext.panel.Panel',{
            region  : 'south',
            //layout  : 'fit',
            split   : true,
            border  : true,
            height  : 300,
            tbar:[{
                text:'Reply'
            },{
                text:'Foward'
            },{
                text:'Delete',
                cls:'toolDelete'
            }]
        });
        /**
         * default item form msgContainer (this is the "no message selected" text)
         * we are using css background style to display a pretty background image
         * insted of using plain text
         */
        me.msgContainer.add({border:false,html:'<div class="noMsg"></div>'});
        /**
         * message preview panel using a custom template
         */
        me.msgPreView = Ext.create('Ext.panel.Panel',{
            border: false,
            tpl : Ext.create('Ext.XTemplate',
                '<div class="message-view-container">'+
                    '<div class="message-view-header">'+
                        '<div class="message-view-header-left">'+
                            '<p><span>From:</span> {user}</p>'+
                            '<p><span>Patient:</span> {patient_name}</p>'+
                            '<p><span>Subject:</span> {subject}</p>'+
                        '</div>'+
                        '<div class="message-view-header-right">'+
                            '<p><span>Type:</span> {note_type}</p>'+
                            '<p><span>Status:</span> {message_status}</p>'+
                        '</div>'+
                    '</div>'+
                    '<div class="message-view-body">{body}</div>'+
                '</dic>'
            )

        });
        /**
         * to be replace....
         * trying to remove all the windows and use panels to handle this
         */
        me.winMessage = Ext.create('Ext.mitos.window.Window', {
            width		: 700,
            title		: 'Compose Message',
            items		: [{
                xtype       : 'mitos.form',
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
                    xtype       : 'htmleditor',
                    readOnly    : true,
                    name        : 'body',
                    itemId      : 'bodyMsg',
                    height      : 100
                },{
                    xtype       : 'htmleditor',
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
                    me.action('close');
                }
            }
        });
        me.pageBody = [ me.msgGrid, me.msgContainer ];
        me.callParent(arguments);
    }, // End initComponent
    /**
     * onNew will reset the form and load a new model
     * with message_status value set to New, and
     * note_type value set to Unassigned
     */
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
    /**
     *
     * @param form
     * @param store
     */
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
    /**
     *
     * @param form
     * @param store
     */
    onDelete:function(form, store){
        Ext.Msg.show({
            title   : 'Please confirm...',
            icon    : Ext.MessageBox.QUESTION,
            msg     : 'Are you sure to delete this message?',
            buttons : Ext.Msg.YESNO,
            scope   : this,
            fn :function(btn){
                if(btn=='yes'){
                    var currentRec = form.getRecord();
                    store.remove(currentRec);
                    store.destroy();
                    this.msgPreView.body.update('<div class="noMsg"></div>');
                    this.winMessage.close();
                }
            }
        });
    },
    /**
     * On item click check if msgPreView is already inside the container.
     * if not, remove the item inside the container, add msgPreView and update it with record data.
     * if yes, just update the msgPreView with the new record data
     *
     * @param view
     * @param record
     */
    onItemClick: function(view, record){

        if(this.msgContainer.items.items[0] != this.msgPreView ){
            this.msgContainer.remove(0);
            this.msgContainer.add(this.msgPreView);
        }
        this.msgPreView.update(record.data);
    },
    /**
     * On item double clik load the new record to the form
     * and call action(old)
     *
     * @param view
     * @param record
     */
    onItemdblclick: function(view, record) {
        var form = this.winMessage.down('form');
        form.getForm().loadRecord(record);
        this.action('old');
    },
    /**
     * This function its called from the the MitosApp.js 
     */
    loadStores:function(){
        this.storeMsgs.load();
    },
    /**
     * This function is use to disable/enabled and hide/show buttons and fields
     * according to the action
     *
     * @param action
     */
    action:function(action) {
        var win          = this.winMessage,
            sm           = this.msgGrid.getSelectionModel(),
            gridTbar     = this.msgGrid.down('toolbar'),
            //msgPreView   = this.msgPreView,
            //msgContainer = this.msgContainer,
            winTbar      = win.down('toolbar'),
            form         = win.down('form'),
            patientCombo = form.getComponent('patientCombo'),
            patientField = form.getComponent('patientField'),
            bodyMsg      = form.getComponent('bodyMsg'),
            currMsg      = form.getComponent('currMsg'),
            newbtn       = gridTbar.getComponent('newMsg'),
            deletebtn    = winTbar.getComponent('deleteMsg'),
            replybtn     = winTbar.getComponent('replyMsg');
        if (action == 'new') {
            bodyMsg.hide();
            currMsg.show();
            replybtn.disable();
            patientCombo.show();
            patientField.hide();
            win.show();
        } else if (action == 'old') {
            replybtn.enable();
            bodyMsg.show();
            currMsg.hide();
            patientCombo.hide();
            patientField.show();
            deletebtn.enable();
            win.show();
            bodyMsg.getToolbar().hide();
        } else if (action == 'reply') {
            currMsg.show();
            patientCombo.hide();
            patientField.show();
            replybtn.disable();
        } else if (action == 'close') {
            form.getForm().reset();
            newbtn.enable();
            deletebtn.disable();
            sm.deselectAll();
        } else if (action == 'itemclick') {



        }
    }
});