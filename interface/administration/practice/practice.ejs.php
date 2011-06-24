<?php 
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
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

include_once($_SESSION['site']['root']."/library/I18n/I18n.inc.php");

//*************************************************************************************************
// Reset session count 10 secs = 1 Flop
//*************************************************************************************************
$_SESSION['site']['flops'] = 0;

?>
<script type="text/javascript">
Ext.onReady(function(){
    Ext.define('Ext.mitos.PracticePage',{
        extend:'Ext.panel.Panel',
		uses:[
			'Ext.mitos.CRUDStore',
			'Ext.mitos.GridPanel',
			'Ext.mitos.RenderPanel',
			'Ext.mitos.TitlesComboBox',
			'Ext.mitos.SaveCancelWindow',
            'Ext.mitos.TransmitMedthodComboBox',
            'Ext.mitos.InsurancePayerType'
		],
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
            read		: 'interface/administration/practice/data_read.ejs.php?task=pharmacy',
            create		: 'interface/administration/practice/data_create.ejs.php?task=pharmacy',
            update		: 'interface/administration/practice/data_update.ejs.php?task=pharmacy',
            destroy 	: 'interface/administration/practice/data_destroy.ejs.php?task=pharmacy'
            });
            // -------------------------------------------------------------------------------------
            // render function for Default Method column in the Pharmacy grid
            // -------------------------------------------------------------------------------------
            function transmit_method(val) {
			    if (val == '1') {
			        return '<?php echo "Print" ?>';
			    } else if(val == '2') {
			        return '<?php echo "Email" ?>';
			    } else if(val == '3') {
			        return '<?php echo "Email" ?>';
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
            read		: 'interface/administration/practice/data_read.ejs.php?task=insurance',
            create		: 'interface/administration/practice/data_create.ejs.php?task=insurance',
            update		: 'interface/administration/practice/data_update.ejs.php?task=insurance',
            destroy 	: 'interface/administration/practice/data_destroy.ejs.php?task=insurance'
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
            read		: 'interface/administration/practice/data_read.ejs.php',
            create		: 'interface/administration/practice/data_create.ejs.php',
            update		: 'interface/administration/practice/data_update.ejs.php',
            destroy 	: 'interface/administration/practice/data_destroy.ejs.php'
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
            read		: 'interface/administration/practice/data_read.ejs.php',
            create		: 'interface/administration/practice/data_create.ejs.php',
            update		: 'interface/administration/practice/data_update.ejs.php',
            destroy 	: 'interface/administration/practice/data_destroy.ejs.php'
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
                    fieldLabel  : '<?php i18n("Name"); ?>',
                    width       : 100,
                    name        : 'name'
                },{
                    xtype       : 'textfield',
                    fieldLabel  : '<?php i18n("Address"); ?>',
                    width       : 100,
                    name        : 'line1'
                },{
                    xtype       : 'textfield',
                    fieldLabel  : '<?php i18n("Address (Cont)"); ?>',
                    width       : 100,
                    name        : 'line2'
                },{
                    xtype: 'fieldcontainer',
                    defaults: { hideLabel: true },
                    items: [{
                        xtype   : 'displayfield',
                        value   : '<?php i18n("City, State Zip"); ?>',
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
                    fieldLabel  : '<?php i18n("Email"); ?>',
                    width       : 100,
                    name        : 'email'
                },{
                    xtype: 'fieldcontainer',
                    defaults: { hideLabel: true },
                    items: [{
                        xtype   : 'displayfield',
                        value   : '<?php i18n("Phone"); ?>',
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
                        value   : '<?php i18n("Fax"); ?>',
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
                        fieldLabel  : '<?php i18n("default Method"); ?>',
                        labelWidth  : 89
                    })
                ]
            }); // END FORM
            page.winPharmacy = new Ext.create('Ext.mitos.SaveCancelWindow', {
                width       : 450,
                title       : '<?php i18n('Add or Edit Pharmacy'); ?>',
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
                    text     : '<?php i18n("Pharmacy Name"); ?>',
                    width    : 150,
                    sortable : true,
                    dataIndex: 'name'
                },{
                    text     : '<?php i18n("Address"); ?>',
                    flex     : 1,
                    sortable : true,
                    dataIndex: 'address_full'
                },{
                    text     : '<?php i18n("Phone"); ?>',
                    width    : 120,
                    sortable : true,
                    dataIndex: 'phone_full'
                },{
                    text     : '<?php i18n("Fax"); ?>',
                    width    : 120,
                    sortable : true,
                    dataIndex: 'fax_full'
                },{
                    text     : '<?php i18n("Default Method"); ?>',
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
                            page.winPharmacy.setTitle('<?php i18n("Edit Pharmacy"); ?>');
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
                    fieldLabel  : '<?php i18n("Name"); ?>',
                    width       : 100,
                    name        : 'name'
                },{
                    xtype       : 'textfield',
                    fieldLabel  : '<?php i18n("Address"); ?>',
                    width       : 100,
                    name        : 'line1'
                },{
                    xtype       : 'textfield',
                    fieldLabel  : '<?php i18n("Address (Cont)"); ?>',
                    width       : 100,
                    name        : 'line2'
                },{
                    xtype: 'fieldcontainer',
                    defaults: { hideLabel: true },
                    items: [{
                        xtype   : 'displayfield',
                        value   : '<?php i18n("City, State Zip"); ?>',
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
                        value   : '<?php i18n("Phone"); ?>',
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
                        value   : '<?php i18n("Fax"); ?>',
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
                    fieldLabel  : '<?php i18n("CMS ID"); ?>',
                    width       : 100,
                    name        : 'cms_id'
                },
                    new Ext.create('Ext.mitos.InsurancePayerType',{
                        fieldLabel  : '<?php i18n("Payer Type"); ?>',
                        labelWidth  : 89
                 }),{
                    xtype       : 'textfield',
                    fieldLabel  : '<?php i18n("X12 Partner"); ?>',
                    width       : 100,
                    name        : 'x12_default_partner_id'
                }]
            }); // END FORM
            page.winInsurance = new Ext.create('Ext.mitos.SaveCancelWindow',{
                width       : 450,
                title       : '<?php i18n('Add or Edit Insurance'); ?>',
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
                    text     : '<?php i18n("Insurance Name"); ?>',
                    width    : 150,
                    sortable : true,
                    dataIndex: 'name'
                },{
                    text     : '<?php i18n("Address"); ?>',
                    flex     : 1,
                    sortable : true,
                    dataIndex: 'address_full'
                },{
                    text     : '<?php i18n("Phone"); ?>',
                    width    : 120,
                    sortable : true,
                    dataIndex: 'phone_full'
                },{
                    text     : '<?php i18n("Fax"); ?>',
                    width    : 120,
                    sortable : true,
                    dataIndex: 'fax_full'
                },{
                    text     : '<?php i18n("Default X12 Partner"); ?>',
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
                            page.winInsurance.setTitle('<?php i18n("Edit Insurance"); ?>');
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
                    text     : '<?php i18n("Name"); ?>',
                    flex     : 1,
                    sortable : true,
                    dataIndex: 'name'
                },{
                    width    : 100,
                    sortable : true,
                    dataIndex: 'address'
                },{
                    text     : '<?php i18n("Provider #"); ?>',
                    flex     : 1,
                    width    : 100,
                    sortable : true,
                    dataIndex: 'phone'
                },{
                    text     : '<?php i18n("Rendering #"); ?>',
                    flex     : 1,
                    width    : 100,
                    sortable : true,
                    dataIndex: 'phone'
                },{
                    text     : '<?php i18n("Group #"); ?>',
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
                            winPharmacy.setTitle('<?php i18n("Edit Pharmacy"); ?>');
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
                    text     : '<?php i18n("Name"); ?>',
                    flex     : 1,
                    sortable : true,
                    dataIndex: 'name'
                },{
                    text     : '<?php i18n("Sender ID"); ?>',
                    flex     : 1,
                    width    : 100,
                    sortable : true,
                    dataIndex: 'phone'
                },{
                    text     : '<?php i18n("Receiver ID"); ?>',
                    flex     : 1,
                    width    : 100,
                    sortable : true,
                    dataIndex: 'phone'
                },{
                    text     : '<?php i18n("Version"); ?>',
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
                            winX12Partners.setTitle('<?php i18n("Edit X12 Partner"); ?>');
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
                    title	:'<?php i18n("Pharmacies"); ?>',
                    frame	: false,
                    border	: true,
                    items	: [ page.pharmacyGrid ],
                    dockedItems: [{
                        xtype: 'toolbar',
                        dock: 'top',
                        items: [
                            page.addPharmacy = new Ext.create('Ext.Button', {
                                text      : '<?php i18n("Add a Pharmacy"); ?>',
                                iconCls   : 'save',
                                handler   : function(){
                                    page.pharmacyForm.getForm().reset();
                                    page.winPharmacy.show();
                                }
                            }),'-',
                            page.editPharmacy = new Ext.create('Ext.Button', {
                                text      : '<?php i18n("View / Edit a Pharmacy"); ?>',
                                iconCls   : 'edit',
                                disabled  : true,
                                handler   : function(){
                                    page.winPharmacy.show();
                                }
                            }),'-',
                            page.deletePharmacy = new Ext.create('Ext.Button', {
                                text      : '<?php i18n("Delete a Pharmacy"); ?>',
                                iconCls   : 'delete',
                                disabled  : true,
                                handler   : function(){
                                    Ext.Msg.show({
                                        title: '<?php i18n('Please confirm...'); ?>',
                                        icon: Ext.MessageBox.QUESTION,
                                        msg:'<?php i18n('Are you sure to delete this Pharmacy?'); ?>',
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
                    title	:'<?php i18n("Insurance Companies"); ?>',
                    frame	: false,
                    border	: true,
                    items	: [ page.insuranceGrid ],
                    dockedItems: [{
                        xtype: 'toolbar',
                        dock: 'top',
                        items: [
                            page.addCompany = new Ext.create('Ext.Button', {
                                text      : '<?php i18n("Add a Comapny"); ?>',
                                iconCls   : 'save',
                                handler   : function(){
                                    page.insuranceForm.getForm().reset();
                                    page.winInsurance.show();
                                }
                            }),'-',
                            page.editCompany = new Ext.create('Ext.Button', {
                                text      : '<?php i18n("View / Edit a Company"); ?>',
                                iconCls   : 'edit',
                                disabled  : true,
                                handler   : function(){
                                    page.winInsurance.show();
                                }
                            }),'-',
                            page.deleteCompany = new Ext.create('Ext.Button', {
                                text      : '<?php i18n("Delete a Company"); ?>',
                                iconCls   : 'delete',
                                disabled  : true,
                                handler   : function(){
                                    Ext.Msg.show({
                                        title: '<?php i18n('Please confirm...'); ?>',
                                        icon: Ext.MessageBox.QUESTION,
                                        msg:'<?php i18n('Are you sure to delete this Insurance Company?'); ?>',
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
                    title	:'<?php i18n("Insurance Numbers"); ?>',
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
                                text      : '<?php i18n("Add New Partner"); ?>',
                                iconCls   : 'save',
                                handler   : function(){
                                    // TODO //
                                }
                            })
                        ]
                    }]
                },{
                    title	:'<?php i18n("Documents"); ?>',
                    frame	: false,
                    border	: false,
                    items: [{

                    }],
                    dockedItems: [{
                        xtype: 'toolbar',
                        dock: 'bottom',
                        items: [
                            page.editCategory = new Ext.create('Ext.Button', {
                                text      : '<?php i18n("Edit Category"); ?>',
                                iconCls   : 'save',
                                handler   : function(){
                                    // TODO //
                                }
                            }),'-',
                            page.updateFiles = new Ext.create('Ext.Button', {
                                text      : '<?php i18n("Update Files"); ?>',
                                iconCls   : 'save',
                                handler   : function(){
                                    // TODO //
                                }
                            })
                        ]
                    }]
                },{
                    title	:'<?php i18n("HL7 Viewer"); ?>',
                    frame	: false,
                    border	: false,
                    items	: [{

                    }],
                    dockedItems: [{
                        xtype: 'toolbar',
                        dock: 'bottom',
                        items: [
                            page.clearHl7Data = new Ext.create('Ext.Button', {
                                text      : '<?php i18n("Clear HL7 Data"); ?>',
                                iconCls   : 'save',
                                handler   : function(){
                                    // TODO //
                                }
                            }),'-',
                            page.parseHl7Data = new Ext.create('Ext.Button', {
                                text      : '<?php i18n("Parse HL7"); ?>',
                                iconCls   : 'save',
                                handler   : function(){
                                    // TODO //
                                }
                            })
                        ]
                    }]
                }]
            });

            // *************************************************************************************
            // Top Render Panel
            // This Panel needs only 3 arguments...
            // PageTitle 	- Title of the current page
            // PageLayout 	- default 'fit', define this argument if using other than the default value
            // PageBody 	- List of items to display [form1, grid1, grid2]
            // *************************************************************************************
            new Ext.create('Ext.mitos.RenderPanel', {
                pageTitle: '<?php i18n('Practice Settings'); ?>',
                pageBody: [page.tabPanel]
            });
            page.callParent(arguments);
		} // end of initComponent
    }); // end of PracticePage
    Ext.create('Ext.mitos.PracticePage');
}); // End ExtJS
</script>