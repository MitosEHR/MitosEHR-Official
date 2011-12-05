Ext.define('Ext.mitos.panel.messages.Messages',{
    extend      : 'Ext.mitos.RenderPanel',
    id          : 'panelMessages',
    pageTitle   : 'Messages',
    pageLayout  : 'border',
    defaults    : {split: true},
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
            listeners:{
                scope       : this,
                itemclick   : this.onItemClick
            },
            columns:[
                { header: 'noteid',     sortable: false, dataIndex: 'noteid',           hidden: true },
                { header: 'reply_id',   sortable: false, dataIndex: 'reply_id',         hidden: true },
                { header: 'user',       sortable: false, dataIndex: 'user',             hidden: true },
                { header: 'Status',     sortable: true,  dataIndex: 'message_status',   width : 70   },
                { header: 'From',       sortable: true,  dataIndex: 'user',             width : 200  },
                { header: 'Patient',    sortable: true,  dataIndex: 'patient_name',     width : 200  },
                { header: 'Subject',    sortable: true,  dataIndex: 'subject',          flex  : 1    },
                { header: 'Type',       sortable: true,  dataIndex: 'note_type',        width : 100  }
            ],
            tbar:[{
                text	: 'New message',
                iconCls	: 'newMessage',
                itemId  : 'newMsg',
                handler : function(){
                    me.onNew();
                }
            },'-','->','-',{
                text        : 'Delete',
                cls         : 'winDelete',
                iconCls     : 'delete',
                itemId      : 'deleteMsg',
                disabled	: true,
                scope       : me,
                handler     : me.onDelete
            }]
        });
        /**
        * Form to send and replay messages
        */
        me.msgForm = Ext.create('Ext.form.Panel', {
            region       : 'south',
            height       : 340,
            //disabled:true,
            fieldDefaults: { labelWidth: 60, margin:5, anchor: '100%' },
            items:[{
                xtype   : 'container',
                cls     : 'message-form-header',
                padding : '5 0',
                layout  : 'anchor',
                items:[{
                    xtype   : 'container',
                    layout  : 'column',
                    items:[{
                        xtype       : 'container',
                        layout      : 'anchor',
                        columnWidth : .50,
                        items:[{
                            xtype       : 'livepatientsearch',
                            fieldLabel  : 'Patient',
                            emptyText   : 'No patient selected',
                            itemId      : 'patientCombo',
                            name        : 'pid',
                            hideLabel   : false
                        },{
                            xtype       : 'textfield',
                            fieldLabel  : 'Patient',
                            itemId      : 'patientField',
                            name        : 'patient_name',
                            readOnly    : true,
                            hidden      : true
                        },{
                            xtype       : 'userscombo',
                            name        : 'assigned_to',
                            fieldLabel  : 'To',
                            allowBlank  : false
                        }]
                    },{
                        xtype       : 'container',
                        layout      : 'anchor',
                        columnWidth : .50,
                        items:[{
                            xtype       : 'msgnotetypecombo',
                            name        : 'note_type',
                            fieldLabel  : 'Type'
                        },{
                            xtype       : 'msgstatuscombo',
                            name        : 'message_status',
                            fieldLabel  : 'Status'
                        }]
                    }]
                },{
                    xtype       : 'textfield',
                    fieldLabel  : 'Subject',
                    name        : 'subject',
                    margin      : '0 5 5 5'
                }]
            },{
                xtype       : 'htmleditor',
                name        : 'body',
                itemId      : 'bodyMsg',
                height      : 204,
                readOnly    : true

            },{
                xtype       : 'htmleditor',
                name        : 'curr_msg',
                itemId      : 'currMsg',
                height      : 204,
                allowBlank  : false,
                hidden      : true
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
            }],
            bbar:[{
                text		: 'Reply',
                iconCls		: 'edit',
                itemId      : 'replyMsg',
                disabled	: true,
                handler     : function(){
                    me.action('reply');
                }
            },'-','->','-',{
                text		: 'Send',
                iconCls		: 'save',
                cls		    : 'winSave',
                itemId      : 'sendMsg',
                handler: function(btn){
                    var form = btn.up('form').getForm();
                    if(form.isValid()){
                        me.onSend(form, me.storeMsgs);
                    }else{
                        me.msg('Oops!','Please, complete all required fields.');
                    }
                }
            },'-',{
                text        : 'Delete',
                cls         : 'winDelete',
                iconCls     : 'delete',
                itemId      : 'deleteMsg',
                margin      : '0 3 0 0',
                scope       : me,
                disabled	: true,
                handler: me.onDelete
            }],
            listeners:{
                scope: me,
                afterrender:me.fieldsRender
                
            }
        });
        me.pageBody = [ me.msgGrid, me.msgForm ];
        me.callParent(arguments);


    }, // End initComponent

    fieldsRender:function(){
        this.msgForm.getComponent('bodyMsg').getToolbar().hide();
        this.onNew();
    },
    /**
     * onNew will reset the form and load a new model
     * with message_status value set to New, and
     * note_type value set to Unassigned
     */
    onNew:function(){
        var form = this.msgForm;
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
    onSend:function(form, store){
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
        this.onNew();
        this.msg('Sweet!','Message send')
    },
    /**
     *
     * onDelete will show an alert msg to comfirm,
     * delete the message and prepare the form for a new mesagge
     */
    onDelete:function(){
        var form  = this.msgForm.getForm(),
            store = this.storeMsgs;
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
                    this.onNew();
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
        this.msgForm.getForm().loadRecord(record);
        this.action('old');
    },

    /**
     * This function is use to disable/enabled and hide/show buttons and fields
     * according to the action
     *
     * @param action
     */
    action:function(action){
        var sm           = this.msgGrid.getSelectionModel(),
            form         = this.msgForm,
            patientCombo = form.query('combo[itemId="patientCombo"]')[0],
            patientField = form.query('textfield[itemId="patientField"]')[0],
            bodyMsg      = form.getComponent('bodyMsg'),
            currMsg      = form.getComponent('currMsg'),
            deletebtn1   = this.query('button[itemId="deleteMsg"]')[0],
            deletebtn2   = this.query('button[itemId="deleteMsg"]')[1],
            replybtn     = this.query('button[itemId="replyMsg"]')[0];
        if (action == 'new') {
            bodyMsg.hide();
            currMsg.show();
            patientCombo.show();
            patientField.hide();
            deletebtn1.disable();
            deletebtn2.disable();
            replybtn.disable();
            sm.deselectAll();
        } else if (action == 'old') {
            bodyMsg.show();
            currMsg.hide();
            patientCombo.hide();
            patientField.show();
            deletebtn1.enable();
            deletebtn2.enable();
            replybtn.enable();
            bodyMsg.getToolbar().hide();
        } else if (action == 'reply') {
            var msg = bodyMsg.getValue();
            currMsg.setValue('<br><br><br><qoute style="margin-left: 10px; padding-left: 10px; border-left: solid 3px #cccccc; display: block;">'+msg+'</quote>');
            bodyMsg.hide();
            currMsg.show();
            patientCombo.hide();
            patientField.show();
        }
    },
    /**
    * This function is called from MitosAPP.js when
    * this panel is selected in the navigation panel.
    * place inside this function all the functions you want
    * to call every this panel becomes active
    */
    onActive:function(){
        this.storeMsgs.load();

    }
});