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
    uses        : ['Ext.mitos.CRUDStore', 'Ext.mitos.GridPanel', 'Ext.mitos.SaveCancelWindow','Ext.mitos.LivePatientSearch' ],
    initComponent: function(){
        var me = this,
        rowContent;
        // *************************************************************************************
        // Structure of the message record
        // creates a subclass of Ext.data.Record
        // This should be the structure of the database table
        // *************************************************************************************
        me.storeMsgs = Ext.create('Ext.mitos.CRUDStore',{
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
            read		: 'app/messages/data_read.ejs.php',
            create		: 'app/messages/data_create.ejs.php',
            update		: 'app/messages/data_update.ejs.php',
            destroy 	: 'app/messages/data_destroy.ejs.php'
        });
        // *************************************************************************************
        // Structure and load the data for cmb_toUsers
        // AJAX -> component_data.ejs.php
        // *************************************************************************************
        me.storePat = Ext.create('Ext.mitos.CRUDStore',{
            fields: [
                {name: 'id',    type: 'int'},
                {name: 'name',  type: 'string'},
                {name: 'phone', type: 'string'},
                {name: 'ss',    type: 'string'},
                {name: 'dob',   type: 'string'},
                {name: 'pid',   type: 'string'}
            ],
            model		: 'mPatients',
            idProperty	: 'id',
            read		: 'app/messages/component_data.ejs.php',
            extraParams	: {"task": "patients"}
        });
        // *************************************************************************************
        // Structure and load the data for cmb_toUsers
        // AJAX -> component_data.ejs.php
        // *************************************************************************************
        me.toData = Ext.create('Ext.mitos.CRUDStore',{
            fields: [
                {name: 'user',      type: 'string' },
                {name: 'full_name', type: 'string' }
            ],
            model		: 'mUser',
            idProperty	: 'id',
            read		: 'app/messages/component_data.ejs.php',
            extraParams	: {"task": "users"}
        });
        // *************************************************************************************
        // Structure, data for cmb_Type
        // AJAX -> component_data.ejs.php
        // *************************************************************************************
        me.typeData = Ext.create('Ext.mitos.CRUDStore',{
            fields: [
                {name: 'option_id', type: 'string' },
                {name: 'title',     type: 'string' }
            ],
            model		: 'mTypes',
            idProperty	: 'option_id',
            read		: 'lib/layoutEngine/listOptions.json.php',
            extraParams	: {"filter": "note_type"}
        });
        // *************************************************************************************
        // Structure, data for cmb_Status
        // AJAX -> component_data.ejs.php
        // *************************************************************************************
        me.statusData = Ext.create('Ext.mitos.CRUDStore',{
            fields: [
                {name: 'option_id', type: 'string' },
                {name: 'title',     type: 'string' }
            ],
            model		: 'mStatus',
            idProperty	: 'option_id',
            read		: 'lib/layoutEngine/listOptions.json.php',
            extraParams	: {"filter": "message_status"}
        });
        // *************************************************************************************
        // Message Window Dialog
        // *************************************************************************************
        me.winMessage = Ext.create('Ext.window.Window', {
            width		: 550,
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
                    hiddenName  : 'assigned_to',
                    displayField: 'full_name',
                    store       : me.toData
                },{
                    xtype       : 'combo',
                    value       : 'Unassigned',
                    name        : 'note_type',
                    fieldLabel  : 'Type',
                    editable    : false,
                    mode        : 'local',
                    valueField  : 'option_id',
                    hiddenName  : 'option_id',
                    displayField: 'title',
                    store       : me.typeData
                },{
                    xtype       : 'combo',
                    value       : 'New',
                    name        : 'message_status',
                    fieldLabel  : 'Status',
                    editable    : false,
                    mode        : 'local',
                    valueField  : 'option_id',
                    hiddenName  : 'title',
                    displayField: 'title',
                    store       : me.statusData
                },{
                    xtype       : 'textfield',
                    fieldLabel  : 'Subject',
                    name        : 'subject'
                },{
                    xtype       : 'htmleditor',
                    readOnly    : true,
                    name        : 'body',
                    itemId      : 'body',
                    height      : 150
                },{
                    xtype       : 'htmleditor',
                    name        : 'curr_msg',
                    height      : 200
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
                    id          : 'reply_id',
                    hidden      : true,
                    name        : 'reply_id'
                }]
            }],
            bbar:[{
                text		: 'Send',
                iconCls		: 'save',
                itemId      : 'send',
                //disabled	: true,
                handler: function() {
                    var form = me.winMessage.down('form').getForm();
                    me.save(form);
                    me.action('close');
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
                itemclick: function(DataView, record, item, rowIndex, e) {
                    var form    = me.winMessage.down('form');
                    rowContent  = me.storeMsgs.getAt(rowIndex);
                    form.getForm().loadRecord(rowContent);
                    me.action('itemclick');
                },
                itemdblclick:  function(DataView, record, item, rowIndex, e) {
                    var form    = me.winMessage.down('form');
                    rowContent  = me.storeMsgs.getAt(rowIndex);
                    form.getForm().loadRecord(rowContent);
                    form.getComponent('body').show();
                    me.action('itemdblclick');
                }
            },
            columns: [
                { header: 'noteid',     sortable: false, dataIndex: 'noteid',   hidden: true},
                { header: 'reply_id',   sortable: false, dataIndex: 'reply_id', hidden: true},
                { header: 'user',       sortable: false, dataIndex: 'user',     hidden: true},
                { header: 'Subject',    sortable: true,  dataIndex: 'subject',  flex  : 1 },
                { header: 'From',       sortable: true,  dataIndex: 'user',     width : 200 },
                { header: 'Patient',    sortable: true,  dataIndex: 'patient_name' },
                { header: 'Type',       sortable: true,  dataIndex: 'note_type' },
                { header: 'Date',       sortable: true,  dataIndex: 'date',     width : 150 },
                { header: 'Status',     sortable: true,  dataIndex: 'message_status' }
            ],
            tbar: [{
                id		: 'sendMsg',
                text	: 'New message',
                iconCls	: 'newMessage',
                itemId  : 'new',
                handler: function(){
                    var form = me.winMessage.down('form');
                    form.getForm().reset();
                    form.getComponent('body').hide();
                    me.action('new');
               }
            },'-',{
                text	 : 'Reply message',
                iconCls	 : 'edit',
                disabled : true,
                itemId   : 'reply',
                handler  : function(){
                    me.action('reply');
                }
            },'-',{
                text        : 'Delete message',
                iconCls		: 'delete',
                itemId      : 'delete',
                disabled	: true,
                handler: function(){
                    Ext.Msg.show({
                        title: 'Please confirm...',
                        icon: Ext.MessageBox.QUESTION,
                        msg:'Are you sure to delete this message?<br>From: ' + rowContent.get('user'),
                        buttons: Ext.Msg.YESNO,
                        fn:function(btn){
                            if(btn=='yes'){
                                var sm = me.msgGrid.getSelectionModel();
                                me.delete(sm);
                            }
                        }
                    });
                }
            }] // end grid toolbar
        }); // end me.msgGrid
        me.pageBody = [ me.msgGrid ];
        me.callParent(arguments);
    }, // end of initComponent
    save:function(form){
        var record = form.getRecord(),
        values = form.getValues(),
        store = this.storeMsgs;
        if (values.id != ''){
            record.set(values);
        }else{
            store.add(values);
        }
        this.storeMsgs.sync();
        this.storeMsgs.load();
    },
    delete:function(sm){
        this.storeMsgs.remove(sm.getSelection());
        this.storeMsgs.sync();
        this.storeMsgs.load();
    },
    loadStores:function(){
        this.storeMsgs.load();
        this.storePat.load();
        this.toData.load();
        this.typeData.load()
        this.statusData.load();
    },
    action:function(action){
        var win         = this.winMessage,
        grid            = this.msgGrid.down('toolbar'),
        form            = win.down('form'),
        patientCombo    = form.getComponent('patientCombo'),
        patientField    = form.getComponent('patientField'),
        newbtn          = grid.getComponent('new'),
        replybtn        = grid.getComponent('reply'),
        deletebtn       = grid.getComponent('delete');
        switch(action){
            case 'new':
                patientCombo.show();
                patientField.hide();
                newbtn.disable();
                replybtn.disable();
                deletebtn.disable();
                win.show();
            break
            case 'reply':
                patientCombo.hide();
                patientField.show();
                newbtn.disable();
                replybtn.disable();
                deletebtn.disable();
                win.show();
            break;
            case 'close':
                newbtn.enable();
                replybtn.disable();
                deletebtn.disable();
                win.close();
            break;
            case 'itemclick':
                replybtn.enable();
                deletebtn.enable();
            break;
            case 'itemdblclick':
                patientCombo.hide();
                patientField.show();
                replybtn.enable();
                deletebtn.enable();
                win.show();
            break
        }
    }
}); //end Ext.mitos.panel.messages.Messages