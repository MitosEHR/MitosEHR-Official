//*************************************************************************************************
// roles.ejs.php
// Description: Facilities Screen
// v0.0.3
// 
// Author: Ernesto J Rodriguez
// Modified: n/a
// 
// MitosEHR (Electronic Health Records) 2011
//*************************************************************************************************
Ext.define('Ext.mitos.panel.administration.practice.Practice',{
    extend      : 'Ext.mitos.RenderPanel',
    id          : 'panelPractice',
    pageTitle   : 'Practice Settings',
    uses        : [
        'Ext.mitos.restStoreModel',
        'Ext.mitos.CRUDStore',
        'Ext.mitos.GridPanel',
        'Ext.mitos.combo.Titles',
        'Ext.mitos.combo.TransmitMedthod',
        'Ext.mitos.combo.InsurancePayerType',
        'Ext.mitos.form.FormPanel',
        'Ext.mitos.window.Window'
    ],
    initComponent: function(){
        var me = this;
        var currStore;
        var currModel;
        // *************************************************************************************
        // Pharmacy Record Structure
        // *************************************************************************************
        me.pharmacyStore = Ext.create('Ext.mitos.restStoreModel', {
            fields: [
                {name: 'id',					type: 'int'},
                {name: 'name',					type: 'string'},
                {name: 'transmit_method',		type: 'string'},
                {name: 'email',					type: 'string'},
                {name: 'address_id',			type: 'int'},
                {name: 'line1',					type: 'string'},
                {name: 'line2',					type: 'string'},
                {name: 'city',					type: 'string'},
                {name: 'state',					type: 'string'},
                {name: 'zip',					type: 'string'},
                {name: 'plus_four',				type: 'string'},
                {name: 'country',				type: 'string'},
                {name: 'address_full',			type: 'string'},
                {name: 'phone_id',		        type: 'int'},
                {name: 'phone_country_code',	type: 'string'},
                {name: 'phone_area_code',		type: 'string'},
                {name: 'phone_prefix',			type: 'string'},
                {name: 'phone_number',			type: 'string'},
                {name: 'phone_full',			type: 'string'},
                {name: 'fax_id',		        type: 'int'},
                {name: 'fax_country_code',		type: 'string'},
                {name: 'fax_area_code',			type: 'string'},
                {name: 'fax_prefix',			type: 'string'},
                {name: 'fax_number',			type: 'string'},
                {name: 'fax_full',				type: 'string'}
            ],
        model		: 'pharmacyModel',
        idProperty	: 'id',
        url		    : 'app/administration/practice/data.php',
        extraParams : { task:"pharmacy"}
        });
        // -------------------------------------------------------------------------------------
        // render function for Default Method column in the Pharmacy grid
        // -------------------------------------------------------------------------------------
        function transmit_method(val) {
            if (val == '1') {
                return 'Print';
            } else if(val == '2') {
                return 'Email';
            } else if(val == '3') {
                return 'Email';
            }
            return val;
        }
        // *************************************************************************************
        // Insurance Record Structure
        // *************************************************************************************
        me.insuranceStore = Ext.create('Ext.mitos.restStoreModel', {
            fields: [
                {name: 'id',						type: 'int'},
                {name: 'name',						type: 'string'},
                {name: 'attn',						type: 'string'},
                {name: 'cms_id',					type: 'string'},
                {name: 'freeb_type',				type: 'string'},
                {name: 'x12_receiver_id',			type: 'string'},
                {name: 'x12_default_partner_id',	type: 'string'},
                {name: 'alt_cms_id',				type: 'string'},
                {name: 'address_id',				type: 'int'},
                {name: 'line1',						type: 'string'},
                {name: 'line2',						type: 'string'},
                {name: 'city',						type: 'string'},
                {name: 'state',						type: 'string'},
                {name: 'zip',						type: 'string'},
                {name: 'plus_four',					type: 'string'},
                {name: 'country',					type: 'string'},
                {name: 'address_full',				type: 'string'},
                {name: 'phone_id',		            type: 'int'},
                {name: 'phone_country_code',		type: 'string'},
                {name: 'phone_area_code',			type: 'string'},
                {name: 'phone_prefix',				type: 'string'},
                {name: 'phone_number',				type: 'string'},
                {name: 'phone_full',				type: 'string'},
                {name: 'fax_id',		            type: 'int'},
                {name: 'fax_country_code',			type: 'string'},
                {name: 'fax_area_code',				type: 'string'},
                {name: 'fax_prefix',				type: 'string'},
                {name: 'fax_number',				type: 'string'},
                {name: 'fax_full',					type: 'string'}
            ],
            model		: 'insuranceModel',
            idProperty	: 'id',
            url		    : 'app/administration/practice/data.php',
            extraParams : { task:"insurance"}
        });
        // *************************************************************************************
        // Insurance Numbers Record Structure
        // *************************************************************************************
        me.insuranceNumbersStore = Ext.create('Ext.mitos.restStoreModel',{
            fields: [
                {name: 'id',	type: 'int'},
                {name: 'name',	type: 'string'}
            ],
            model		: 'insuranceNumbersModel',
            idProperty	: 'id',
            url		    : 'app/administration/practice/data.php',
            extraParams : { task:"insuranceNumbers"}
        });
        // *************************************************************************************
        // X12 Partners Record Structure
        // *************************************************************************************
        me.x12PartnersStore = Ext.create('Ext.mitos.restStoreModel',{
            fields: [
                {name: 'id',	type: 'int'},
                {name: 'name',	type: 'string'}
            ],
            model		: 'x12PartnersModel',
            idProperty	: 'id',
            url		    : 'app/administration/practice/data.php',
            extraParams : { task:"x12Partners"}
        });
        // *************************************************************************************
        // From Items
        // *************************************************************************************
        me.pharmacyItems = [
            { xtype: 'textfield', hidden: true, name: 'id' },
            { xtype: 'textfield', hidden: true, name: 'phone_id' },
            { xtype: 'textfield', hidden: true, name: 'fax_id' },
            { xtype: 'textfield', hidden: true, name: 'address_id' },
            { xtype: 'textfield', hidden: true, name: 'phone_country_code' },
            { xtype: 'textfield', hidden: true, name: 'fax_country_code' },
            { xtype: 'textfield', fieldLabel: 'Name', width: 100, name: 'name', allowBlank:false },
            { xtype: 'textfield', fieldLabel: 'Address', width: 100, name: 'line1' },
            { xtype: 'textfield', fieldLabel: 'Address (Cont)', width: 100, name: 'line2' },
            { xtype: 'fieldcontainer',
                defaults: { hideLabel: true },
                items: [
                    { xtype: 'displayfield',  width: 89,  value: 'City, State Zip' },
                    { xtype: 'textfield',     width: 150, name: 'city' },
                    { xtype: 'displayfield',  width: 5,   value: ',' },
                    { xtype: 'textfield',     width: 50,  name: 'state' },
                    { xtype: 'textfield',     width: 103, name: 'zip' }
                ]
            },
            { xtype: 'textfield', fieldLabel: 'Email', width: 100, name: 'email' },
            { xtype: 'fieldcontainer',
                defaults: { hideLabel: true },
                items: [
                    { xtype: 'displayfield',  width: 89,  value: 'Phone' },
                    { xtype: 'displayfield',  width: 5,   value: '(' },
                    { xtype: 'textfield',     width: 40,  name: 'phone_area_code' },
                    { xtype: 'displayfield',  width: 5,   value: ')' },
                    { xtype: 'textfield',     width: 50,  name: 'phone_prefix' },
                    { xtype: 'displayfield',  width: 5,   value: '-' },
                    { xtype: 'textfield',     width: 70,  name: 'phone_number' }
                ]
            },
            { xtype: 'fieldcontainer',
                defaults: { hideLabel: true },
                items: [
                    { xtype: 'displayfield',  width: 89,  value: 'Fax' },
                    { xtype: 'displayfield',  width: 5,   value: '(' },
                    { xtype: 'textfield',     width: 40,  name: 'fax_area_code' },
                    { xtype: 'displayfield',  width: 5,   value: ')' },
                    { xtype: 'textfield',     width: 50,  name: 'fax_prefix' },
                    { xtype: 'displayfield',  width: 5,   value: '-' },
                    { xtype: 'textfield',     width: 70,  name: 'fax_number'
                }]
            },
            { xtype: 'transmitmethodcombo', fieldLabel  : 'default Method', labelWidth  : 89 }
        ];

        me.insuranceItems = [
            { xtype: 'textfield', hidden: true, name: 'id' },
            { xtype: 'textfield', hidden: true, name: 'phone_id' },
            { xtype: 'textfield', hidden: true, name: 'fax_id' },
            { xtype: 'textfield', hidden: true, name: 'address_id' },
            { xtype: 'textfield', hidden: true, name: 'phone_country_code' },
            { xtype: 'textfield', hidden: true, name: 'fax_country_code' },
            { xtype: 'textfield', fieldLabel: 'Name',width: 100, name: 'name', allowBlank:false },
            { xtype: 'textfield', fieldLabel: 'Address', width: 100, name: 'line1' },
            { xtype: 'textfield', fieldLabel: 'Address (Cont)', width: 100, name: 'line2' },
            { xtype: 'fieldcontainer',
                defaults: { hideLabel: true },
                items: [
                    { xtype: 'displayfield',  width: 89,  value: 'City, State Zip' },
                    { xtype: 'textfield',     width: 150, name: 'city' },
                    { xtype: 'displayfield',  width: 5,   value: ',' },
                    { xtype: 'textfield',     width: 50,  name: 'state' },
                    { xtype: 'textfield',     width: 103, name: 'zip' }
                ]
            },
            { xtype: 'fieldcontainer',
                defaults: { hideLabel: true },
                items: [
                    { xtype: 'displayfield',  width: 89,  value: 'Phone' },
                    { xtype: 'displayfield',  width: 5,   value: '(' },
                    { xtype: 'textfield',     width: 40,  name: 'phone_area_code' },
                    { xtype: 'displayfield',  width: 5,   value: ')' },
                    { xtype: 'textfield',     width: 50,  name: 'phone_prefix' },
                    { xtype: 'displayfield',  width: 5,   value: '-' },
                    { xtype: 'textfield',     width: 70,  name: 'phone_number'
                }]
            },
            { xtype: 'fieldcontainer',
                defaults: { hideLabel: true },
                items: [
                    { xtype: 'displayfield',  width: 89,  value: 'Fax' },
                    { xtype: 'displayfield',  width: 5,   value: '(' },
                    { xtype: 'textfield',     width: 40,  name: 'fax_area_code' },
                    { xtype: 'displayfield',  width: 5,   value: ')' },
                    { xtype: 'textfield',     width: 50,  name: 'fax_prefix' },
                    { xtype: 'displayfield',  width: 5,   value: '-' },
                    { xtype: 'textfield',     width: 70,  name: 'fax_number' }
                ]
            },
            { xtype: 'textfield', fieldLabel: 'CMS ID', width: 100, name: 'cms_id' },
            { xtype:'insurancepayertypecombo', fieldLabel: 'Payer Type', labelWidth  : 89 },
            { xtype: 'textfield', fieldLabel: 'X12 Partner', width: 100, name: 'x12_default_partner_id' }
        ];
        // *************************************************************************************
        // Grids
        // *************************************************************************************
        me.pharmacyGrid = Ext.create('Ext.mitos.GridPanel', {
            store		: me.pharmacyStore,
            border		: false,
            frame		: false,
            columns: [
                { text: 'id', sortable: false, dataIndex: 'id', hidden: true },
                { text: 'Pharmacy Name', width: 150, sortable: true, dataIndex: 'name' },
                { text: 'Address', flex: 1, sortable: true, dataIndex: 'address_full' },
                { text: 'Phone', width: 120, sortable: true, dataIndex: 'phone_full' },
                { text: 'Fax', width: 120, sortable: true, dataIndex: 'fax_full' },
                { text: 'Default Method', flex: 1, sortable: true, dataIndex: 'transmit_method', renderer: transmit_method }
            ],
            listeners: {
                itemdblclick: function(view, record){
                    currStore = me.pharmacyStore;
                    currModel = 'pharmacyModel';
                    me.onItemdblclick( me.pharmacyItems, me.pharmacyStore, record, 'Edit Pharmacy' );
                }
            }
        });
        me.insuranceGrid = Ext.create('Ext.mitos.GridPanel', {
            store: me.insuranceStore,
            border: false,
            frame: false,
            columns: [
                { text: 'id', sortable: false, dataIndex: 'id', hidden: true },
                { text: 'Insurance Name', width: 150, sortable: true, dataIndex: 'name' },
                { text: 'Address', flex: 1, sortable: true, dataIndex: 'address_full' },
                { text: 'Phone', width: 120, sortable: true, dataIndex: 'phone_full' },
                { text: 'Fax', width: 120, sortable: true, dataIndex: 'fax_full' },
                { text: 'Default X12 Partner', flex: 1, width: 100, sortable: true, dataIndex: 'x12_default_partner_id' }
            ],
            listeners: {
                itemdblclick: function(view, record){
                    currStore = me.insuranceStore;
                    currModel = 'insuranceModel';
                    me.onItemdblclick( me.insuranceItems, me.insuranceStore, record, 'Edit Insurance' );
                }
            }
        }); // END Insurance Grid
        me.InsuranceNumbersGrid = Ext.create('Ext.grid.Panel', {
            store		: me.insuranceNumbersStore,
            border		: false,
            frame		: false,
            columns: [
                { text: 'Name', flex: 1, sortable: true, dataIndex: 'name' },
                { width: 100, sortable: true, dataIndex: 'address' },
                { text: 'Provider #', flex: 1, width: 100, sortable: true, dataIndex: 'phone' },
                { text: 'Rendering #', flex: 1, width: 100, sortable: true, dataIndex: 'phone' },
                { text: 'Group #', flex: 1, width: 100, sortable: true, dataIndex: 'phone' }
            ],
            viewConfig: { stripeRows: true },
            listeners: {
                itemdblclick: function(view, record){
                    currStore = me.insuranceStore;
                    currModel = 'insuranceNumbersModel';
                    me.onItemdblclick( me.insuranceItems, me.insuranceStore, record, 'Add or Edit Insurance' );
                }
            }
        }); // END Insurance Numbers Grid
        me.x12ParnersGrid = Ext.create('Ext.mitos.GridPanel', {
            store		: me.x12PartnersStore,
            border		: false,
            frame		: false,
            columns: [
                { text: 'Name', flex: 1, sortable: true, dataIndex: 'name' },
                { text: 'Sender ID', flex: 1, width: 100, sortable: true, dataIndex: 'phone' },
                { text: 'Receiver ID', flex: 1, width: 100, sortable: true, dataIndex: 'phone' },
                { text: 'Version', flex: 1, width: 100, sortable: true, dataIndex: 'phone' }
            ],
            viewConfig: { stripeRows: true },
            listeners: {
                itemdblclick: function(view, record){
                    var title = 'Add or Edit Insurance';
                    me.onItemdblclick( me.insuranceItems, me.insuranceStore, record, title );
                }
            }
        }); // END Insurance Numbers Grid

        // *************************************************************************************
        // Tab Panel
        // *************************************************************************************
        me.praticePanel = Ext.create('Ext.tab.Panel', {
            activeTab	: 0,
            defaults	:{ autoScroll:true, layout:'fit' },
            items:[{
                title	:'Pharmacies',
                frame	: false,
                border	: true,
                items	: [ me.pharmacyGrid ],
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [{
                        xtype       : 'button',
                        text        : 'Add a Pharmacy',
                        iconCls     : 'save',
                        handler: function(){
                            var form    = me.win.down('form');
                            currStore = me.pharmacyStore;
                            currModel = 'pharmacyModel';
                            me.onNew(form, me.pharmacyItems, currModel, 'Add New Pharmacy');
                        }
                    }]
                }]
            },{
                title	:'Insurance Companies',
                frame	: false,
                border	: true,
                items	: [ me.insuranceGrid ],
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [{
                        xtype       : 'button',
                        text        : 'Add a Comapny',
                        iconCls     : 'save',
                        handler: function(){
                            var form    = me.win.down('form');
                            currStore = me.insuranceStore;
                            currModel = 'insuranceModel';
                            me.onNew(form, me.insuranceItems, currModel, 'Add New Insurance Company');
                        }
                    }]
                }]
            },{
                title	:'Insurance Numbers',
                frame	: false,
                border	: false,
                items	: [ me.InsuranceNumbersGrid ]
            },{
                title	:'X12 Partners',
                frame	: false,
                border	: false,
                items	: [ me.x12ParnersGrid ],
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [{
                        xtype: 'button',
                        text      : 'Add New Partner',
                        iconCls   : 'save',
                        handler: function(){
                            var form = me.win.down('form');
                            me.onNew(form, currModel);
                        }
                    }]
                }]
            },{
                title	:'Documents',
                frame	: false,
                border	: false,
                items: [{

                }],
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'bottom',
                    items: [{
                        xtype: 'button',
                        text      : 'Edit Category',
                        iconCls   : 'save',
                        handler   : function(){
                            me.openWin();
                        }
                    },'-',{
                        xtype: 'button',
                        text      : 'Update Files',
                        iconCls   : 'save',
                        handler   : function(){
                            me.openWin();
                        }
                    }]
                }]
            },{
                title	:'HL7 Viewer',
                frame	: false,
                border	: false,
                items	: [{

                }],
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'bottom',
                    items: [{
                        xtype: 'button',
                            text      : 'Clear HL7 Data',
                            iconCls   : 'save',
                            handler   : function(){
                                me.openWin();
                            }
                    },'-',{
                        xtype: 'button',
                            text      : 'Parse HL7',
                            iconCls   : 'save',
                            handler   : function(){
                                me.openWin();
                            }
                    }]
                }]
            }]
        });
        
        me.win = Ext.create('Ext.mitos.window.Window', {
            width       : 450,

            items:[{
                xtype:'mitos.form',
                defaults: { labelWidth: 89, anchor: '100%', layout: {
                        type: 'hbox',
                        defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                    }
                }
            }],
            buttons: [{
                text: 'save',
                cls : 'winSave',
                handler: function(){
                    var form = me.win.down('form').getForm();
                    if (form.isValid()) {
                        me.onSave(form, currStore);
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
                    me.onDelete(form, currStore);
                }
            }],
            listeners:{
                scope:me,
                close:function(){
                    me.action('close');
                }
            }
        }); // END WINDOW

        me.pageBody = [ me.praticePanel ];
        me.callParent(arguments);
    }, // end of initComponent

    onNew:function(form, formItmes, model, title){
        this.setForm(form, formItmes, title);
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
            msg     : 'Are you sure to delete this?',
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

    onItemdblclick:function(formItmes, store, record, title){
        var form = this.win.down('form');
        this.setForm(form, formItmes, title);
        form.getForm().loadRecord(record);
        this.action('old');
        this.win.show();
    },
    setForm:function(form, formItmes, title){
        form.removeAll();
        form.add(formItmes);
        form.doLayout();
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
    onActive:function(){
        this.pharmacyStore.load();
        this.insuranceStore.load();
        this.insuranceNumbersStore.load();
        this.x12PartnersStore.load();
    }
}); // end of PracticePage