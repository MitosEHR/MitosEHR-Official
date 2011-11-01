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
        'Ext.mitos.restStore',
        'Ext.mitos.GridPanel',
        'Ext.mitos.SaveCancelWindow'
    ],
    initComponent: function(){

        var me = this;

        // *************************************************************************************
        // Facility Record Structure
        // *************************************************************************************
        me.FacilityStore = Ext.create('Ext.mitos.restStore',{
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
        // POS Code Data Store
        // *************************************************************************************
        me.storePOSCode = Ext.create('Ext.mitos.CRUDStore',{
            fields: [
                {name: 'option_id',		type: 'string'},
                {name: 'title',			type: 'string'}
            ],
                model 		:'posModel',
                idProperty 	:'id',
                read		:'app/administration/facilities/component_data.ejs.php',
                extraParams	: {"task": "poscodes"}
        });

        // *************************************************************************************
        // Federal EIN - TaxID Data Store
        // *************************************************************************************
        me.storeTAXid = Ext.create('Ext.mitos.CRUDStore',{
            fields: [
                {name: 'option_id',		type: 'string'},
                {name: 'title',			type: 'string'}
            ],
                model 		:'taxidRecord',
                idProperty 	:'id',
                read		:'app/administration/facilities/component_data.ejs.php',
                extraParams	: {"task": "taxid"}
        });





        // *************************************************************************************
        // Facility Grid Panel
        // *************************************************************************************
        me.FacilityGrid = Ext.create('Ext.mitos.GridPanel', {
            store		: me.FacilityStore,
            columns: [
                {
                    text     : 'Name',
                    flex     : 1,
                    sortable : true,
                    dataIndex: 'name'
                },
                {
                    text     : 'Phone',
                    width    : 100,
                    sortable : true,
                    dataIndex: 'phone'
                },
                {
                    text     : 'Fax',
                    width    : 100,
                    sortable : true,
                    dataIndex: 'fax'
                },
                {
                    text     : 'City',
                    width    : 100,
                    sortable : true,
                    dataIndex: 'city'
                }
            ],
            // Slider bar or Pagin
            bbar: Ext.create('Ext.PagingToolbar', {
                pageSize: 30,
                store: me.FacilityStore,
                displayInfo: true,
                plugins: Ext.create('Ext.ux.SlidingPager', {})
            }),
            listeners: {
                itemdblclick: function(view, record){
                    me.onItemdblclick( me.FacilityStore, record, 'Edit User' );
                }
            },
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: [{
                        xtype       : 'button',
                        text        : 'Add User',
                        iconCls     : 'save',
                        handler: function(){
                            var form    = me.win.down('form');
                            me.onNew(form, 'facilityModel', 'Add New User');
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
                xtype:'mitos.form',
                fieldDefaults: { msgTarget: 'side', labelWidth: 100 },
                defaultType: 'textfield',
                defaults: { anchor: '100%' },
                items: [{
                    fieldLabel: 'Name',
                    name: 'name',
                    allowBlank: false
                },{
                    fieldLabel: 'Phone',
                    name: 'phone',
                    vtype: 'phoneNumber'
                },{
                    fieldLabel: 'Fax',
                    name: 'fax',
                    vtype: 'phoneNumber'
                },{
                    fieldLabel: 'Street',
                    name: 'street'
                },{
                    fieldLabel: 'City',
                    name: 'city'
                },{
                    fieldLabel: 'State',
                    name: 'state'
                },{
                    fieldLabel: 'Postal Code',
                    name: 'postal_code',
                    vtype: 'postalCode'
                },{
                    fieldLabel: 'Country Code',
                    name: 'country_code'
                },{
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Tax ID',
                    layout: 'hbox',
                    items: [
                        me.cmbTaxIdType = Ext.create('Ext.form.ComboBox',{
                            displayField: 'title',
                            valueField: 'option_id',
                            editable: false,
                            store: me.storeTAXid,
                            queryMode: 'local',
                            name:'tax_id_type',
                            width: 50
                        })
                    ,{
                        xtype: 'textfield',
                        name: 'federal_ein'
                    }]
                },{
                    xtype: 'mitos.checkboxfield',
                    fieldLabel: 'Service Location',
                    name: 'service_location'
                },{
                    xtype: 'mitos.checkboxfield',
                    fieldLabel: 'Billing Location',
                    name: 'billing_location'
                },{
                    xtype: 'mitos.checkboxfield',
                    fieldLabel: 'Accepts assignment',
                    name: 'accepts_assignment'
                },
                    me.cmbposCode = Ext.create('Ext.form.ComboBox',{
                        fieldLabel: 'POS Code',
                        displayField: 'title',
                        valueField: 'option_id',
                        editable: false,
                        store: me.storePOSCode,
                        name: 'pos_code',
                        queryMode: 'local'
                    })
                ,{
                    fieldLabel: 'Billing Attn',
                    name: 'attn'
                },{
                    fieldLabel: 'CLIA Number',
                    name: 'domain_identifier'
                },{
                    fieldLabel: 'Facility NPI',
                    name: 'facility_npi'
                },{
                    name: 'id',
                    hidden: true
                }]
            }],
            buttons: [{
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
                text: 'Delete',
                cls : 'winDelete',
                itemId: 'delete',
                scope: me,
                handler: function(){
                    var form = me.win.down('form').getForm();
                    me.onDelete(form, me.FacilityStore);
                }
            }],
            listeners:{
                scope:me,
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

    action:function(action){
        var win     = this.win,
        form        = win.down('form'),
        winTbar     = win.down('toolbar'),
        deletebtn   = winTbar.getComponent('delete');

        switch(action){
            case 'new':
                deletebtn.disable();
                break;
            case 'old':
                deletebtn.enable();
                break;
            case 'close':
                form.getForm().reset();
                break;
        }
    },

    loadStores:function(){
        this.FacilityStore.load();
    }
}); //ens FacilitiesPanel class