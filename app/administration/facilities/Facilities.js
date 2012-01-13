//******************************************************************************
// facilities.ejs.php
// Description: Facilities Screen
// v0.0.3
//
// Author: GI Technologies, 2011
// Modified: n/a
//
// MitosEHR (Eletronic Health Records) 2011
//******************************************************************************

Ext.define('Ext.mitos.panel.administration.facilities.Facilities',{
    extend      : 'Ext.mitos.RenderPanel',
    id          : 'panelFacilities',
    pageTitle   : 'Facilities',
    uses        : [
        'Ext.mitos.CRUDStore',
        'Ext.mitos.restStoreModel',
        'Ext.mitos.GridPanel',
        'Ext.mitos.window.Window'
    ],
    initComponent: function(){

        var me = this;

        // *************************************************************************************
        // Facility Record Structure
        // *************************************************************************************
        me.FacilityStore = Ext.create('Ext.mitos.restStoreModel',{
            fields: [
                {name: 'id',					type: 'int'},
                {name: 'name',					type: 'string'},
                {name: 'phone',					type: 'string'},
                {name: 'fax',					type: 'string'},
                {name: 'street',				type: 'string'},
                {name: 'city',					type: 'string'},
                {name: 'state',					type: 'string'},
                {name: 'postal_code',			type: 'string'},
                {name: 'country_code',			type: 'string'},
                {name: 'federal_ein',			type: 'string'},
                {name: 'service_location',		type: 'string'},
                {name: 'billing_location',		type: 'string'},
                {name: 'accepts_assignment',	type: 'string'},
                {name: 'pos_code',				type: 'string'},
                {name: 'x12_sender_id',			type: 'string'},
                {name: 'attn',					type: 'string'},
                {name: 'domain_identifier',		type: 'string'},
                {name: 'facility_npi',			type: 'string'},
                {name: 'tax_id_type',			type: 'string'}
            ],
            model 		:'facilityModel',
            idProperty 	:'id',
            url		    :'app/administration/facilities/data.php'
        });


        // *************************************************************************************
        // Facility Grid Panel
        // *************************************************************************************
        me.FacilityGrid = Ext.create('Ext.mitos.GridPanel', {
            store		: me.FacilityStore,
            columns: [{
                text     : 'Name',
                flex     : 1,
                sortable : true,
                dataIndex: 'name'
            },{
                text     : 'Phone',
                width    : 100,
                sortable : true,
                dataIndex: 'phone'
            },{
                text     : 'Fax',
                width    : 100,
                sortable : true,
                dataIndex: 'fax'
            },{
                text     : 'City',
                width    : 100,
                sortable : true,
                dataIndex: 'city'
            }],
            // Slider bar or Pagin
            bbar: Ext.create('Ext.PagingToolbar', {
                pageSize    : 30,
                store       : me.FacilityStore,
                displayInfo : true,
                plugins     : Ext.create('Ext.ux.SlidingPager', {})
            }),
            listeners: {
                itemdblclick: function(view, record){
                    me.onItemdblclick( me.FacilityStore, record, 'Edit Facility' );
                }
            },
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: [{
                        xtype       : 'button',
                        text        : 'Add New Facility',
                        iconCls     : 'save',
                        handler: function(){
                            var form    = me.win.down('form');
                            me.onNew(form, 'facilityModel', 'Add New Facility');
                        }
                    }]
            }]
        }); // END Facility Grid

        // *************************************************************************************
        // Window User Form
        // *************************************************************************************
        me.win = Ext.create('Ext.mitos.window.Window', {
            width : 600,
            items:[{
                xtype           : 'mitos.form',
                fieldDefaults   : { msgTarget: 'side', labelWidth: 100 },
                defaultType     : 'textfield',
                defaults        : { anchor: '100%' },
                items: [{
                    fieldLabel  : 'Name',
                    name        : 'name',
                    allowBlank  : false
                },{
                    fieldLabel  : 'Phone',
                    name        : 'phone',
                    vtype       : 'phoneNumber'
                },{
                    fieldLabel  : 'Fax',
                    name        : 'fax',
                    vtype       : 'phoneNumber'
                },{
                    fieldLabel  : 'Street',
                    name        : 'street'
                },{
                    fieldLabel  : 'City',
                    name        : 'city'
                },{
                    fieldLabel  : 'State',
                    name        : 'state'
                },{
                    fieldLabel  : 'Postal Code',
                    name        : 'postal_code',
                    vtype       : 'postalCode'
                },{
                    fieldLabel  : 'Country Code',
                    name        : 'country_code'
                },{
                    xtype       : 'fieldcontainer',
                    fieldLabel  : 'Tax ID',
                    layout      : 'hbox',
                    items: [{
                        xtype   : 'mitos.taxidcombo',
                        name    :'tax_id_type',
                        width   : 50
                    },{
                        xtype   : 'textfield',
                        name    : 'federal_ein'
                    }]
                },{
                    xtype       : 'mitos.checkbox',
                    fieldLabel  : 'Service Location',
                    name        : 'service_location'
                },{
                    xtype       : 'mitos.checkbox',
                    fieldLabel  : 'Billing Location',
                    name        : 'billing_location'
                },{
                    xtype       : 'mitos.checkbox',
                    fieldLabel  : 'Accepts assignment',
                    name        : 'accepts_assignment'
                },{
                    xtype       : 'mitos.poscodescombo',
                    fieldLabel  : 'POS Code',
                    name        : 'pos_code'
                },{
                    fieldLabel  : 'Billing Attn',
                    name        : 'attn'
                },{
                    fieldLabel  : 'CLIA Number',
                    name        : 'domain_identifier'
                },{
                    fieldLabel  : 'Facility NPI',
                    name        : 'facility_npi'
                },{
                    name        : 'id',
                    hidden      : true
                }]
            }],
            buttons : [{
                text: 'save',
                cls : 'winSave',
                handler: function(){
                    var form = me.win.down('form').getForm();
                    if (form.isValid()) {
                        me.onSave(form, me.FacilityStore);
                        me.action('close');
                    }
                }
            },'-',{
                text    : 'Delete',
                cls     : 'winDelete',
                itemId  : 'delete',
                scope   : me,
                handler : function(){
                    var form = me.win.down('form').getForm();
                    me.onDelete(form, me.FacilityStore);
                }
            }],
            listeners:{
                scope: me,
                close:function(){
                    me.action('close');
                }
            }
        }); // END WINDOW

        me.pageBody = [ me.FacilityGrid ];
        me.callParent(arguments);
    }, // end of initComponent

    onNew:function(form, model, title){
        this.setForm(form, title);
        form.getForm().reset();
        var newModel  = Ext.ModelManager.create({}, model );
        form.getForm().loadRecord(newModel);
        this.action('new');
        this.win.show();
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
        this.win.close();
    },

    onDelete:function(form, store){
        Ext.Msg.show({
            title   : 'Please confirm...',
            icon    : Ext.MessageBox.QUESTION,
            msg     : 'Are you sure to delete this record?',
            buttons : Ext.Msg.YESNO,
            scope   : this,
            fn:function(btn){
                if(btn=='yes'){
                    var currentRec = form.getRecord();
                    store.remove(currentRec);
                    store.destroy();
                    this.win.close();
                }
            }
        });
    },

    onItemdblclick:function(store, record, title){
        var form = this.win.down('form');
        this.setForm(form, title);
        form.getForm().loadRecord(record);
        this.action('old');
        this.win.show();
    },

    setForm:function(form, title){
        form.up('window').setTitle(title);
    },

    openWin:function(){
        this.win.show();
    },

    action:function(action) {
        var win = this.win,
            form = win.down('form'),
            winTbar = win.down('toolbar'),
            deletebtn = winTbar.getComponent('delete');

        if (action == 'new') {
            deletebtn.disable();
        } else if (action == 'old') {
            deletebtn.enable();
        } else if (action == 'close') {
            form.getForm().reset();
        }
    },
    /**
    * This function is called from MitosAPP.js when
    * this panel is selected in the navigation panel.
    * place inside this function all the functions you want
    * to call every this panel becomes active
    */
    onActive:function(callback){
        this.FacilityStore.load();
        callback(true);
    }
}); //ens FacilitiesPanel class