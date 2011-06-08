<?php 
//******************************************************************************
// roles.ejs.php
// Description: Facilities Screen
// v0.0.3
// 
// Author: Ernesto J Rodriguez
// Modified: n/a
// 
// MitosEHR (Electronic Health Records) 2011
//**********************************************************************************
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

include_once($_SESSION['site']['root']."/library/I18n/I18n.inc.php");

//**********************************************************************************
// Reset session count 10 secs = 1 Flop
//**********************************************************************************
$_SESSION['site']['flops'] = 0;

?>
<script type="text/javascript">
Ext.onReady(function(){
    Ext.define('Ext.mitos.PracticePage',{
        extend:'Ext.panel.Panel',
		uses:[
			'Ext.mitos.CRUDStore',
			'Ext.mitos.GridPanel',
			'Ext.mitos.DeleteButton',
			'Ext.mitos.TopRenderPanel',
			'Ext.mitos.TitlesComboBox',
			'Ext.mitos.SaveCancelWindow',
			'Ext.mitos.FacilitiesComboBox',
			'Ext.mitos.AuthorizationsComboBox'
		],
        initComponent: function(){
            var page = this;
            var rowPos; // Stores the current Grid Row Position (int)
            var currRec; // Store the current record (Object)

            // *************************************************************************************
            // Pharmacy Record Structure
            // *************************************************************************************
            var pharmacyStore = Ext.create('Ext.mitos.CRUDStore', {
                fields: [
                    {name: 'id',					type: 'int'},
                    {name: 'name',					type: 'string'},
                    {name: 'transmit_method',		type: 'string'},
                    {name: 'email',					type: 'string'},
                    {name: 'address_id',			type: 'string'},
                    {name: 'line1',					type: 'string'},
                    {name: 'line2',					type: 'string'},
                    {name: 'city',					type: 'string'},
                    {name: 'state',					type: 'string'},
                    {name: 'zip',					type: 'int'},
                    {name: 'plus_four',				type: 'int'},
                    {name: 'country',				type: 'string'},
                    {name: 'address_foreign_id',	type: 'string'},
                    {name: 'address_full',			type: 'string'},
                    {name: 'phone_country_code',	type: 'string'},
                    {name: 'phone_area_code',		type: 'string'},
                    {name: 'phone_prefix',			type: 'string'},
                    {name: 'phone_number',			type: 'string'},
                    {name: 'phone_foreign_id',		type: 'string'},
                    {name: 'phone_full',			type: 'string'},
                    {name: 'fax_country_code',		type: 'string'},
                    {name: 'fax_area_code',			type: 'string'},
                    {name: 'fax_prefix',			type: 'string'},
                    {name: 'fax_number',			type: 'string'},
                    {name: 'fax_foreign_id',		type: 'string'},
                    {name: 'fax_full',				type: 'string'}
                ],
            model		: 'pharmacyModel',
            idProperty	: 'id',
            read		: 'interface/administration/practice/data_read.ejs.php?task=pharmacy',
            create		: 'interface/administration/practice/data_read.ejs.php?task=',
            update		: 'interface/administration/practice/data_read.ejs.php?task=',
            destroy 	: 'interface/administration/practice/data_read.ejs.php?task='
            });
            // *************************************************************************************
            // Insurance Record Structure
            // *************************************************************************************
            var insuranceStore = Ext.create('Ext.mitos.CRUDStore', {
                fields: [
                    {name: 'id',						type: 'int'},
                    {name: 'name',						type: 'string'},
                    {name: 'attn',						type: 'string'},
                    {name: 'cms_id',					type: 'string'},
                    {name: 'freeb_type',				type: 'string'},
                    {name: 'x12_receiver_id',			type: 'string'},
                    {name: 'x12_default_partner_id',	type: 'string'},
                    {name: 'alt_cms_id',				type: 'string'},
                    {name: 'address_id',				type: 'string'},
                    {name: 'line1',						type: 'string'},
                    {name: 'line2',						type: 'string'},
                    {name: 'city',						type: 'string'},
                    {name: 'state',						type: 'string'},
                    {name: 'zip',						type: 'int'},
                    {name: 'plus_four',					type: 'int'},
                    {name: 'country',					type: 'string'},
                    {name: 'address_foreign_id',		type: 'string'},
                    {name: 'address_full',				type: 'string'},
                    {name: 'phone_country_code',		type: 'string'},
                    {name: 'phone_area_code',			type: 'string'},
                    {name: 'phone_prefix',				type: 'string'},
                    {name: 'phone_number',				type: 'string'},
                    {name: 'phone_foreign_id',			type: 'string'},
                    {name: 'phone_full',				type: 'string'},
                    {name: 'fax_country_code',			type: 'string'},
                    {name: 'fax_area_code',				type: 'string'},
                    {name: 'fax_prefix',				type: 'string'},
                    {name: 'fax_number',				type: 'string'},
                    {name: 'fax_foreign_id',			type: 'string'},
                    {name: 'fax_full',					type: 'string'}
                ],
            model		: 'insuranceModel',
            idProperty	: 'id',
            read		: 'interface/administration/practice/data_read.ejs.php?task=insurance',
            create		: 'interface/administration/practice/data_read.ejs.php?task=',
            update		: 'interface/administration/practice/data_read.ejs.php?task=',
            destroy 	: 'interface/administration/practice/data_read.ejs.php?task='
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
            idProperty	: 'idusers',
            read		: 'interface/administration/practice/data_read.ejs.php',
            create		: 'interface/administration/practice/data_create.ejs.php',
            update		: 'interface/administration/practice/data_update.ejs.php',
            destroy 	: 'interface/administration/practice/data_destroy.ejs.php'
            });


            // *************************************************************************************
            // Pharmacy Form, Window, and Form
            // *************************************************************************************
            var pharmacyForm = new Ext.create('Ext.mitos.FormPanel', {
                id          : 'pharmacyForm',
                width	  	: 495,
                hideLabels  : true,
                defaults: {
                    labelWidth: 89,
                    anchor: '100%',
                    layout: {
                        type: 'hbox',
                        defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                    }
                },
                items: [{}]
            }); // END FORM
            var winPharmacy = new Ext.create('Ext.mitos.SaveCancelWindow', {
                height      : 520,
                width       : 520,
                title       : '<?php i18n('Add or Edit Pharmacy'); ?>',
                form        : pharmacyForm,
                store       : pharmacyStore,
                idField     : 'id',
                scope       : page
            }); // END WINDOW
            var pharmacyGrid = new Ext.create('Ext.mitos.GridPanel', {
                store		: pharmacyStore,
                border		: false,
                frame		: false,
                columns: [{
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
                    dataIndex: 'transmit_method'
                }],
                listeners: {
                    itemclick: {
                        fn: function(DataView, record, item, rowIndex, e){
                            Ext.getCmp('pharmacyForm').getForm().reset(); // Clear the form
                            Ext.getCmp('editPharmacy').enable();
                            Ext.getCmp('deletePharmacy').enable();
                            var rec = pharmacyStore.getAt(rowIndex);
                            Ext.getCmp('pharmacyForm').getForm().loadRecord(rec);
                            currRec = rec;
                            rowPos = rowIndex;
                        }
                    },
                    itemdblclick: {
                        fn: function(DataView, record, item, rowIndex, e){
                            Ext.getCmp('pharmacyForm').getForm().reset(); // Clear the form
                            Ext.getCmp('editPharmacy').enable();
                            Ext.getCmp('deletePharmacy').enable();
                            var rec = pharmacyStore.getAt(rowIndex);
                            Ext.getCmp('pharmacyForm').getForm().loadRecord(rec);
                            currRec = rec;
                            rowPos = rowIndex;
                            winPharmacy.setTitle('<?php i18n("View / Edit Insurance"); ?>');
                            winPharmacy.show();
                        }
                    }
                }
            }); // END GRIDs

            // *************************************************************************************
            // Insurance Form, Window, and GRID
            // *************************************************************************************
            var insuranceForm = new Ext.create('Ext.mitos.FormPanel', {
                id          : 'insuranceForm',
                width	  	  : 495,
                defaults: {
                    labelWidth: 89,
                    anchor: '100%',
                    layout: {
                        type: 'hbox',
                        defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                    }
                },
                items: [{}]
            }); // END FORM
            var winInsurance = new Ext.create('Ext.mitos.SaveCancelWindow',{
                height      : 520,
                width       : 520,
                title       : '<?php i18n('Add or Edit Insurance'); ?>',
                form        : insuranceForm,
                store       : insuranceStore,
                idField     : 'id',
                scope       : page
            }); // END WINDOW
            var insuranceGrid = new Ext.create('Ext.mitos.GridPanel', {
                store		: insuranceStore,
                border		: false,
                frame		: false,
                columns: [{
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
                            Ext.getCmp('insuranceForm').getForm().reset(); // Clear the form
                            Ext.getCmp('editCompany').enable();
                            Ext.getCmp('deleteCompany').enable();
                            var rec = insuranceStore.getAt(rowIndex);
                            Ext.getCmp('insuranceForm').getForm().loadRecord(rec);
                            currRec = rec;
                            rowPos = rowIndex;
                        }
                    },
                    itemdblclick: {
                        fn: function(DataView, record, item, rowIndex, e){
                            Ext.getCmp('insuranceForm').getForm().reset(); // Clear the form
                            Ext.getCmp('editCompany').enable();
                            Ext.getCmp('deleteCompany').enable();
                            var rec = insuranceStore.getAt(rowIndex);
                            Ext.getCmp('insuranceForm').getForm().loadRecord(rec);
                            currRec = rec;
                            rowPos = rowIndex;
                            winInsurance.setTitle('<?php i18n("View / Edit Insurance"); ?>');
                            winInsurance.show();
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


            //**************************************************************************
            // Tab Panel
            //**************************************************************************
            var tabPanel = new Ext.create('Ext.tab.Panel', {
                activeTab	: 0,
                frame		: true,
                border		: false,
                layout		: 'fit',
                height		: Ext.getCmp('MainApp').getHeight(),
                defaults	:{ autoScroll:true },
                items:[{
                    title	:'<?php i18n("Pharmacies"); ?>',
                    frame	: false,
                    border	: true,
                    layout	: 'fit',
                    items	: [ pharmacyGrid ],
                    dockedItems: [{
                        xtype: 'toolbar',
                        dock: 'top',
                        items: [{
                            id        : 'addPharmacy',
                            text      : '<?php i18n("Add a Pharmacy"); ?>',
                            iconCls   : 'save',
                            handler   : function(){
                               winPharmacy.show();
                            }
                        },{
                            id        : 'editPharmacy',
                            text      : '<?php i18n("View / Edit a Pharmacy"); ?>',
                            iconCls   : 'edit',
                            disabled  : true,
                            handler   : function(){
                                // TODO //
                            }
                        },{
                            id        : 'deletePharmacy',
                            text      : '<?php i18n("Delete a Pharmacy"); ?>',
                            iconCls   : 'delete',
                            disabled  : true,
                            handler   : function(){
                                // TODO //
                            }
                        }]
                    }]
                },{
                    title	:'<?php i18n("Insurance Companies"); ?>',
                    frame	: false,
                    border	: true,
                    items	: [ insuranceGrid ],
                    dockedItems: [{
                        xtype: 'toolbar',
                        dock: 'top',
                        items: [{
                            id        : 'addCompany',
                            text      : '<?php i18n("Add a Comapny"); ?>',
                            iconCls   : 'save',
                            handler   : function(){
                                winInsurance.show();
                            }
                                        },{
                            id        : 'editCompany',
                            text      : '<?php i18n("View / Edit a Company"); ?>',
                            iconCls   : 'edit',
                            disabled  : true,
                            handler   : function(){
                                // TODO //
                            }
                        },{
                            id        : 'deleteCompany',
                            text      : '<?php i18n("Delete a Company"); ?>',
                            iconCls   : 'delete',
                            disabled  : true,
                            handler   : function(){
                                // TODO //
                            }
                        }]
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
                        items: [{
                            id        : 'addPartner',
                            text      : '<?php i18n("Add New Partner"); ?>',
                            iconCls   : 'save',
                            handler   : function(){
                                // TODO //
                            }
                        }]
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
                        items: [{
                            id        : 'editCategory',
                            text      : '<?php i18n("Edit Category"); ?>',
                            iconCls   : 'save',
                            handler   : function(){
                                // TODO //
                            }
                        },{
                            id        : 'updateFiles',
                            text      : '<?php i18n("Update Files"); ?>',
                            iconCls   : 'save',
                            handler   : function(){
                                // TODO //
                            }
                        }]
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
                        items: [{
                            id        : 'clearHl7Data',
                            text      : '<?php i18n("Clear HL7 Data"); ?>',
                            iconCls   : 'save',
                            handler   : function(){
                                // TODO //
                            }
                        },{
                            id        : 'parseHl7Data',
                            text      : '<?php i18n("Parse HL7"); ?>',
                            iconCls   : 'save',
                            handler   : function(){
                                // TODO //
                            }
                        }]
                    }]
                }]

            });

            //***********************************************************************************
            // Top Render Panel
            // This Panel needs only 3 arguments...
            // PageTitle 	- Title of the current page
            // PageLayout 	- default 'fit', define this argument if using other than the default value
            // PageBody 	- List of items to display [form1, grid1, grid2]
            //***********************************************************************************
            Ext.create('Ext.mitos.TopRenderPanel', {
                pageTitle: '<?php i18n('Practice Settings'); ?>',
                pageBody: [tabPanel]
            });
            page.callParent(arguments);
		} // end of initComponent
    }); // end of PracticePage
    Ext.create('Ext.mitos.PracticePage');
}); // End ExtJS
</script>