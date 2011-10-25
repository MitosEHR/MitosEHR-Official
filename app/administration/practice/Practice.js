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
    uses        : [ 'Ext.mitos.CRUDStore', 'Ext.mitos.GridPanel', 'Ext.mitos.TitlesComboBox', 'Ext.mitos.SaveCancelWindow', 'Ext.mitos.TransmitMedthodComboBox', 'Ext.mitos.InsurancePayerType' ],
    initComponent: function(){
        var page = this;
        var rowPos; // Stores the current Grid Row Position (int)
        var currRec; // Store the current record (Object)

        // *************************************************************************************
        // Pharmacy Record Structure
        // *************************************************************************************
        page.pharmacyStore = Ext.create('Ext.mitos.CRUDStore', {
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
        read		: 'app/administration/practice/data_read.ejs.php?task=pharmacy',
        create		: 'app/administration/practice/data_create.ejs.php?task=pharmacy',
        update		: 'app/administration/practice/data_update.ejs.php?task=pharmacy',
        destroy 	: 'app/administration/practice/data_destroy.ejs.php?task=pharmacy'
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
        page.insuranceStore = Ext.create('Ext.mitos.CRUDStore', {
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
        read		: 'app/administration/practice/data_read.ejs.php?task=insurance',
        create		: 'app/administration/practice/data_create.ejs.php?task=insurance',
        update		: 'app/administration/practice/data_update.ejs.php?task=insurance',
        destroy 	: 'app/administration/practice/data_destroy.ejs.php?task=insurance'
        });

        // *************************************************************************************
        // Insurance Numbers Record Structure
        // *************************************************************************************
        var insuranceNumbersStore = new Ext.create('Ext.mitos.CRUDStore',{
            fields: [
                {name: 'id',	type: 'int'},
                {name: 'name',	type: 'string'}
            ],
        model		: 'insuranceNumbersModel',
        idProperty	: 'id',
        read		: 'app/administration/practice/data_read.ejs.php',
        create		: 'app/administration/practice/data_create.ejs.php',
        update		: 'app/administration/practice/data_update.ejs.php',
        destroy 	: 'app/administration/practice/data_destroy.ejs.php'
        });

        // *************************************************************************************
        // X12 Partners Record Structure
        // *************************************************************************************
        var x12PartnersStore = new Ext.create('Ext.mitos.CRUDStore',{
            fields: [
                {name: 'id',	type: 'int'},
                {name: 'name',	type: 'string'}
            ],
        model		: 'x12PartnersModel',
        idProperty	: 'id',
        read		: 'app/administration/practice/data_read.ejs.php',
        create		: 'app/administration/practice/data_create.ejs.php',
        update		: 'app/administration/practice/data_update.ejs.php',
        destroy 	: 'app/administration/practice/data_destroy.ejs.php'
        });

        // *************************************************************************************
        // Pharmacy Form, Window, and Form
        // *************************************************************************************
        page.pharmacyForm = new Ext.create('Ext.mitos.FormPanel', {
            defaults: {
                labelWidth: 89,
                anchor: '100%',
                layout: {
                    type: 'hbox',
                    defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                }
            },
            items: [{ // TODO: create fields for a few of this...
                xtype: 'textfield', hidden: true, name: 'id'
            },{ xtype: 'textfield', hidden: true, name: 'phone_id'
            },{ xtype: 'textfield', hidden: true, name: 'fax_id'
            },{ xtype: 'textfield', hidden: true, name: 'address_id'
            },{ xtype: 'textfield', hidden: true, name: 'phone_country_code'
            },{ xtype: 'textfield', hidden: true, name: 'fax_country_code'
            },{
                xtype       : 'textfield',
                fieldLabel  : 'Name',
                width       : 100,
                name        : 'name'
            },{
                xtype       : 'textfield',
                fieldLabel  : 'Address',
                width       : 100,
                name        : 'line1'
            },{
                xtype       : 'textfield',
                fieldLabel  : 'Address (Cont)',
                width       : 100,
                name        : 'line2'
            },{
                xtype: 'fieldcontainer',
                defaults: { hideLabel: true },
                items: [{
                    xtype   : 'displayfield',
                    value   : 'City, State Zip',
                    width   : 89
                },{
                    xtype   : 'textfield',
                    width   : 150,
                    name    : 'city'
                },{
                    xtype   : 'displayfield',
                    value   : ',',
                    width   : 5
                },{
                    xtype   : 'textfield',
                    width   : 50,
                    name    : 'state'
                },{
                    xtype   : 'textfield',
                    width   : 113,
                    name    : 'zip'
                }]
            },{
                xtype       : 'textfield',
                fieldLabel  : 'Email',
                width       : 100,
                name        : 'email'
            },{
                xtype: 'fieldcontainer',
                defaults: { hideLabel: true },
                items: [{
                    xtype   : 'displayfield',
                    value   : 'Phone',
                    width   : 89
                },{
                    xtype   : 'displayfield',
                    value   : '(',
                    width   : 5
                },{
                    xtype   : 'textfield',
                    width   : 40,
                    name    : 'phone_area_code'
                },{
                    xtype   : 'displayfield',
                    value   : ')',
                    width   : 5
                },{
                    xtype   : 'textfield',
                    width   : 50,
                    name    : 'phone_prefix'
                },{
                    xtype   : 'displayfield',
                    value   : '-',
                    width   : 5
                },{
                    xtype   : 'textfield',
                    width   : 70,
                    name    : 'phone_number'
                }]
            },{
                xtype: 'fieldcontainer',
                defaults: { hideLabel: true },
                items: [{
                    xtype   : 'displayfield',
                    value   : 'Fax',
                    width   : 89
                },{
                    xtype   : 'displayfield',
                    value   : '(',
                    width   : 5
                },{
                    xtype   : 'textfield',
                    width   : 40,
                    name    : 'fax_area_code'
                },{
                    xtype   : 'displayfield',
                    value   : ')',
                    width   : 5
                },{
                    xtype   : 'textfield',
                    width   : 50,
                    name    : 'fax_prefix'
                },{
                    xtype   : 'displayfield',
                    value   : '-',
                    width   : 5
                },{
                    xtype   : 'textfield',
                    width   : 70,
                    name    : 'fax_number'
                }]
            },
                new Ext.create('Ext.mitos.TransmitMedthodComboBox',{
                    fieldLabel  : 'default Method',
                    labelWidth  : 89
                })
            ]
        }); // END FORM
        page.winPharmacy = new Ext.create('Ext.mitos.SaveCancelWindow', {
            width       : 450,
            title       : 'Add or Edit Pharmacy',
            form        : page.pharmacyForm,
            store       : page.pharmacyStore,
            scope       : page,
            idField     : 'id'
        }); // END WINDOW
        page.pharmacyGrid = new Ext.create('Ext.mitos.GridPanel', {
            store		: page.pharmacyStore,
            border		: false,
            frame		: false,
            columns: [{
                text: 'id', sortable: false, dataIndex: 'id', hidden: true
            },{
                text     : 'Pharmacy Name',
                width    : 150,
                sortable : true,
                dataIndex: 'name'
            },{
                text     : 'Address',
                flex     : 1,
                sortable : true,
                dataIndex: 'address_full'
            },{
                text     : 'Phone',
                width    : 120,
                sortable : true,
                dataIndex: 'phone_full'
            },{
                text     : 'Fax',
                width    : 120,
                sortable : true,
                dataIndex: 'fax_full'
            },{
                text     : 'Default Method',
                flex     : 1,
                sortable : true,
                dataIndex: 'transmit_method',
                renderer : transmit_method
            }],
            listeners: {
                itemclick: {
                    fn: function(DataView, record, item, rowIndex, e){
                        page.pharmacyForm.getForm().reset(); // Clear the form
                        page.editPharmacy.enable();
                        page.deletePharmacy.enable();
                        var rec = page.pharmacyStore.getAt(rowIndex);
                        page.pharmacyForm.getForm().loadRecord(rec);
                        currRec = rec;
                        page.rowPos = rowIndex;
                    }
                },
                itemdblclick: {
                    fn: function(DataView, record, item, rowIndex, e){
                        page.pharmacyForm.getForm().reset(); // Clear the form
                        page.editPharmacy.enable();
                        page.deletePharmacy.enable();
                        var rec = page.pharmacyStore.getAt(rowIndex);
                        page.pharmacyForm.getForm().loadRecord(rec);
                        currRec = rec;
                        page.rowPos = rowIndex;
                        page.winPharmacy.setTitle('Edit Pharmacy');
                        page.winPharmacy.show();
                    }
                }
            }
        }); // END GRIDs

        // *************************************************************************************
        // Insurance Form, Window, and GRID
        // *************************************************************************************
        page.insuranceForm = new Ext.create('Ext.mitos.FormPanel', {
            defaults: {
                labelWidth: 89,
                anchor: '100%',
                layout: {
                    type: 'hbox',
                    defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                }
            },
            items: [{
                xtype: 'textfield', hidden: true, name: 'id'
            },{ xtype: 'textfield', hidden: true, name: 'phone_id'
            },{ xtype: 'textfield', hidden: true, name: 'fax_id'
            },{ xtype: 'textfield', hidden: true, name: 'address_id'
            },{ xtype: 'textfield', hidden: true, name: 'phone_country_code'
            },{ xtype: 'textfield', hidden: true, name: 'fax_country_code'
            },{
                xtype       : 'textfield',
                fieldLabel  : 'Name',
                width       : 100,
                name        : 'name'
            },{
                xtype       : 'textfield',
                fieldLabel  : 'Address',
                width       : 100,
                name        : 'line1'
            },{
                xtype       : 'textfield',
                fieldLabel  : 'Address (Cont)',
                width       : 100,
                name        : 'line2'
            },{
                xtype: 'fieldcontainer',
                defaults: { hideLabel: true },
                items: [{
                    xtype   : 'displayfield',
                    value   : 'City, State Zip',
                    width   : 89
                },{
                    xtype   : 'textfield',
                    width   : 150,
                    name    : 'city'
                },{
                    xtype   : 'displayfield',
                    value   : ',',
                    width   : 5
                },{
                    xtype   : 'textfield',
                    width   : 50,
                    name    : 'state'
                },{
                    xtype   : 'textfield',
                    width   : 113,
                    name    : 'zip'
                }]
            },{
               xtype: 'fieldcontainer',
                defaults: { hideLabel: true },
                items: [{
                    xtype   : 'displayfield',
                    value   : 'Phone',
                    width   : 89
                },{
                    xtype   : 'displayfield',
                    value   : '(',
                    width   : 5
                },{
                    xtype   : 'textfield',
                    width   : 40,
                    name    : 'phone_area_code'
                },{
                    xtype   : 'displayfield',
                    value   : ')',
                    width   : 5
                },{
                    xtype   : 'textfield',
                    width   : 50,
                    name    : 'phone_prefix'
                },{
                    xtype   : 'displayfield',
                    value   : '-',
                    width   : 5
                },{
                    xtype   : 'textfield',
                    width   : 70,
                    name    : 'phone_number'
                }]
            },{
                xtype: 'fieldcontainer',
                defaults: { hideLabel: true },
                items: [{
                    xtype   : 'displayfield',
                    value   : 'Fax',
                    width   : 89
                },{
                    xtype   : 'displayfield',
                    value   : '(',
                    width   : 5
                },{
                    xtype   : 'textfield',
                    width   : 40,
                    name    : 'fax_area_code'
                },{
                    xtype   : 'displayfield',
                    value   : ')',
                    width   : 5
                },{
                    xtype   : 'textfield',
                    width   : 50,
                    name    : 'fax_prefix'
                },{
                    xtype   : 'displayfield',
                    value   : '-',
                    width   : 5
                },{
                    xtype   : 'textfield',
                    width   : 70,
                    name    : 'fax_number'
                }]
            },{
                xtype       : 'textfield',
                fieldLabel  : 'CMS ID',
                width       : 100,
                name        : 'cms_id'
            },
                new Ext.create('Ext.mitos.InsurancePayerType',{
                    fieldLabel  : 'Payer Type',
                    labelWidth  : 89
             }),{
                xtype       : 'textfield',
                fieldLabel  : 'X12 Partner',
                width       : 100,
                name        : 'x12_default_partner_id'
            }]
        }); // END FORM
        page.winInsurance = new Ext.create('Ext.mitos.SaveCancelWindow',{
            width       : 450,
            title       : 'Add or Edit Insurance',
            form        : page.insuranceForm,
            store       : page.insuranceStore,
            scope       : page,
            idField     : 'id'
        }); // END WINDOW
        page.insuranceGrid = new Ext.create('Ext.mitos.GridPanel', {
            store		: page.insuranceStore,
            border		: false,
            frame		: false,
            columns: [{
                text: 'id', sortable: false, dataIndex: 'id', hidden: true
            },{
                text     : 'Insurance Name',
                width    : 150,
                sortable : true,
                dataIndex: 'name'
            },{
                text     : 'Address',
                flex     : 1,
                sortable : true,
                dataIndex: 'address_full'
            },{
                text     : 'Phone',
                width    : 120,
                sortable : true,
                dataIndex: 'phone_full'
            },{
                text     : 'Fax',
                width    : 120,
                sortable : true,
                dataIndex: 'fax_full'
            },{
                text     : 'Default X12 Partner',
                flex     : 1,
                width    : 100,
                sortable : true,
                dataIndex: 'x12_default_partner_id'
            }],
            listeners: {
                itemclick: {
                    fn: function(DataView, record, item, rowIndex, e){
                        page.insuranceForm.getForm().reset(); // Clear the form
                        page.editCompany.enable();
                        page.deleteCompany.enable();
                        var rec = page.insuranceStore.getAt(rowIndex);
                        page.insuranceForm.getForm().loadRecord(rec);
                        currRec = rec;
                        page.rowPos = rowIndex;
                    }
                },
                itemdblclick: {
                    fn: function(DataView, record, item, rowIndex, e){
                        page.insuranceForm.getForm().reset(); // Clear the form
                        page.editCompany.enable();
                        page.deleteCompany.enable();
                        var rec = page.insuranceStore.getAt(rowIndex);
                        page.insuranceForm.getForm().loadRecord(rec);
                        currRec = rec;
                        page.rowPos = rowIndex;
                        page.winInsurance.setTitle('Edit Insurance');
                        page.winInsurance.show();
                    }
                }
            }
        }); // END Insurance Grid


        // *************************************************************************************
        // Insurance Numbers Grid (Tab 2)
        // *************************************************************************************
        var InsuranceNumbersGrid = new Ext.create('Ext.grid.Panel', {
            store		: insuranceNumbersStore,
            border		: false,
            frame		: false,
            columns: [{
                text     : 'Name',
                flex     : 1,
                sortable : true,
                dataIndex: 'name'
            },{
                width    : 100,
                sortable : true,
                dataIndex: 'address'
            },{
                text     : 'Provider #',
                flex     : 1,
                width    : 100,
                sortable : true,
                dataIndex: 'phone'
            },{
                text     : 'Rendering #',
                flex     : 1,
                width    : 100,
                sortable : true,
                dataIndex: 'phone'
            },{
                text     : 'Group #',
                flex     : 1,
                width    : 100,
                sortable : true,
                dataIndex: 'phone'
            }],
            viewConfig: { stripeRows: true },
            listeners: {
                itemclick: {
                    fn: function(DataView, record, item, rowIndex, e){
                        Ext.getCmp('pharmacyForm').getForm().reset(); // Clear the form
                        Ext.getCmp('cmdEdit').enable();
                        Ext.getCmp('cmdDelete').enable();
                        var rec = insuranceNumbersStore.getAt(rowIndex);
                        Ext.getCmp('pharmacyForm').getForm().loadRecord(rec);
                        currRec = rec;
                        rowPos = rowIndex;
                    }
                },
                itemdblclick: {
                    fn: function(DataView, record, item, rowIndex, e){
                        Ext.getCmp('pharmacyForm').getForm().reset(); // Clear the form
                        Ext.getCmp('cmdEdit').enable();
                        Ext.getCmp('cmdDelete').enable();
                        var rec = insuranceNumbersStore.getAt(rowIndex);
                        Ext.getCmp('pharmacyForm').getForm().loadRecord(rec);
                        currRec = rec;
                        rowPos = rowIndex;
                        winPharmacy.setTitle('Edit Pharmacy');
                        winPharmacy.show();
                    }
                }
            }
        }); // END Insurance Numbers Grid

        // *************************************************************************************
        //  X12 Partners Grid (Tab 3)
        // *************************************************************************************
        var x12ParnersGrid = new Ext.create('Ext.mitos.GridPanel', {
            store		: x12PartnersStore,
            border		: false,
            frame		: false,
            columns: [{
                text     : 'Name',
                flex     : 1,
                sortable : true,
                dataIndex: 'name'
            },{
                text     : 'Sender ID',
                flex     : 1,
                width    : 100,
                sortable : true,
                dataIndex: 'phone'
            },{
                text     : 'Receiver ID',
                flex     : 1,
                width    : 100,
                sortable : true,
                dataIndex: 'phone'
            },{
                text     : 'Version',
                flex     : 1,
                width    : 100,
                sortable : true,
                dataIndex: 'phone'
            }],
            viewConfig: { stripeRows: true },
            listeners: {
                itemclick: {
                    fn: function(DataView, record, item, rowIndex, e){
                        Ext.getCmp('x12PartnersForm').getForm().reset(); // Clear the form
                        Ext.getCmp('cmdEdit').enable();
                        Ext.getCmp('cmdDelete').enable();
                        var rec = x12PartnersStore.getAt(rowIndex);
                        Ext.getCmp('x12PartnersForm').getForm().loadRecord(rec);
                        currRec = rec;
                        rowPos = rowIndex;
                    }
                },
                itemdblclick: {
                    fn: function(DataView, record, item, rowIndex, e){
                        Ext.getCmp('x12PartnersForm').getForm().reset(); // Clear the form
                        Ext.getCmp('cmdEdit').enable();
                        Ext.getCmp('cmdDelete').enable();
                        var rec = x12PartnersStore.getAt(rowIndex);
                        Ext.getCmp('x12PartnersForm').getForm().loadRecord(rec);
                        currRec = rec;
                        rowPos = rowIndex;
                        winX12Partners.setTitle('Edit X12 Partner');
                        winX12Partners.show();
                    }
                }
            }
        }); // END Insurance Numbers Grid



        // *************************************************************************************
        // Tab Panel
        // *************************************************************************************
        page.tabPanel = new Ext.create('Ext.tab.Panel', {
            activeTab	: 0,
            frame		: true,
            border		: false,
            defaults	:{ autoScroll:true },
            items:[{
                title	:'Pharmacies',
                frame	: false,
                border	: true,
                items	: [ page.pharmacyGrid ],
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [
                        page.addPharmacy = new Ext.create('Ext.Button', {
                            text      : 'Add a Pharmacy',
                            iconCls   : 'save',
                            handler   : function(){
                                page.pharmacyForm.getForm().reset();
                                page.winPharmacy.show();
                            }
                        }),'-',
                        page.editPharmacy = new Ext.create('Ext.Button', {
                            text      : 'View / Edit a Pharmacy',
                            iconCls   : 'edit',
                            disabled  : true,
                            handler   : function(){
                                page.winPharmacy.show();
                            }
                        }),'-',
                        page.deletePharmacy = new Ext.create('Ext.Button', {
                            text      : 'Delete a Pharmacy',
                            iconCls   : 'delete',
                            disabled  : true,
                            handler   : function(){
                                Ext.Msg.show({
                                    title: 'Please confirm...',
                                    icon: Ext.MessageBox.QUESTION,
                                    msg:'Are you sure to delete this Pharmacy?',
                                    buttons: Ext.Msg.YESNO,
                                    fn:function(btn,msgGrid){
                                        if(btn=='yes'){
                                            page.pharmacyStore.remove( currRec );
                                            page.pharmacyStore.sync();
                                            page.pharmacyStore.load();
                                        }
                                    }
                                });
                            }
                        })
                    ]
                }]
            },{
                title	:'Insurance Companies',
                frame	: false,
                border	: true,
                items	: [ page.insuranceGrid ],
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [
                        page.addCompany = new Ext.create('Ext.Button', {
                            text      : 'Add a Comapny',
                            iconCls   : 'save',
                            handler   : function(){
                                page.insuranceForm.getForm().reset();
                                page.winInsurance.show();
                            }
                        }),'-',
                        page.editCompany = new Ext.create('Ext.Button', {
                            text      : 'View / Edit a Company',
                            iconCls   : 'edit',
                            disabled  : true,
                            handler   : function(){
                                page.winInsurance.show();
                            }
                        }),'-',
                        page.deleteCompany = new Ext.create('Ext.Button', {
                            text      : 'Delete a Company',
                            iconCls   : 'delete',
                            disabled  : true,
                            handler   : function(){
                                Ext.Msg.show({
                                    title: 'Please confirm...',
                                    icon: Ext.MessageBox.QUESTION,
                                    msg:'Are you sure to delete this Insurance Company?',
                                    buttons: Ext.Msg.YESNO,
                                    fn:function(btn,msgGrid){
                                        if(btn=='yes'){
                                            page.insuranceStore.remove( currRec );
                                            page.insuranceStore.sync();
                                            page.insuranceStore.load();
                                        }
                                    }
                                });
                            }
                        })
                    ]
                }]
            },{
                title	:'Insurance Numbers',
                frame	: false,
                border	: false,
                items	: [InsuranceNumbersGrid ]
            },{
                title	:'X12 Partners',
                frame	: false,
                border	: false,
                items	: [ x12ParnersGrid ],
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [
                        page.addPartner = new Ext.create('Ext.Button', {
                            text      : 'Add New Partner',
                            iconCls   : 'save',
                            handler   : function(){
                                // TODO //
                            }
                        })
                    ]
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
                    items: [
                        page.editCategory = new Ext.create('Ext.Button', {
                            text      : 'Edit Category',
                            iconCls   : 'save',
                            handler   : function(){
                                // TODO //
                            }
                        }),'-',
                        page.updateFiles = new Ext.create('Ext.Button', {
                            text      : 'Update Files',
                            iconCls   : 'save',
                            handler   : function(){
                                // TODO //
                            }
                        })
                    ]
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
                    items: [
                        page.clearHl7Data = new Ext.create('Ext.Button', {
                            text      : 'Clear HL7 Data',
                            iconCls   : 'save',
                            handler   : function(){
                                // TODO //
                            }
                        }),'-',
                        page.parseHl7Data = new Ext.create('Ext.Button', {
                            text      : 'Parse HL7',
                            iconCls   : 'save',
                            handler   : function(){
                                // TODO //
                            }
                        })
                    ]
                }]
            }]
        });
        page.pageBody = [ page.tabPanel ];
        page.callParent(arguments);
    } // end of initComponent
}); // end of PracticePage