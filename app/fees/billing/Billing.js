//******************************************************************************
// Billing.ejs.php
// Billing Forms
// v0.0.1
// Author: Ernest Rodriguez
// Modified: 
// MitosEHR (Electronic Health Records) 2011
//******************************************************************************
Ext.define('Ext.mitos.panel.fees.billing.Billing',{
    extend      : 'Ext.mitos.RenderPanel',
    id          : 'panelBilling',
    pageTitle   : 'Billing',
    pageLayout  : 'border',

    uses        : [ 'Ext.mitos.CRUDStore', 'Ext.mitos.GridPanel' ],
    initComponent: function(){
        var page = this;
        //******************************************************************
        // Stores...
        //******************************************************************
        page.billingStore = new Ext.create('Ext.mitos.CRUDStore',{
            fields: [
                {name: 'id',      		type: 'int'},
                {name: 'date',          type: 'date', dateFormat: 'c'},
                {name: 'body',          type: 'string'},
                {name: 'user',          type: 'string'},
                {name: 'facility_id',   type: 'string'},
                {name: 'activity',   	type: 'string'}
            ],
            model		: 'modelBilling',
            idProperty	: 'id',
            read      	: 'app/miscellaneous//data_read.ejs.php',
            create    	: 'app/miscellaneous//data_create.ejs.php',
            update    	: 'app/miscellaneous//data_update.ejs.php',
          //destroy		: <-- delete not allow -->
            autoLoad	: false
        });
        //******************************************************************
        // Search Form...
        //******************************************************************
        page.billingFormPanel = Ext.create('Ext.form.FormPanel', {
            title       : '<?php i18n("Search Criteria"); ?>',
            region		: 'north',
            frame 		: true,
            height      : 100,
            margin		: '0 0 3 0',
            items		:[{
                xtype: 'textfield', hidden: true, name: 'id'
            },{

            }],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                items: [
                    new Ext.create('Ext.Button', {
                        text      	: '<?php i18n("Search"); ?>',
                        iconCls   	: 'save',
                        handler   : function(){
                            var form = this.up('form').getForm();
                        }
                    }),'-',
                    new Ext.create('Ext.Button', {
                        text		: '<?php i18n("Reset"); ?>',
                        iconCls   	: 'save',
                        tooltip		: '<?php i18n("Start a New Search"); ?>',
                        handler		: function(){
                            var form = this.up('form').getForm();
                            form.reset();
                        }
                    })
                ]
            }]
        });
        //******************************************************************
        // Grid...
        //******************************************************************
        page.billingGrid = new Ext.create('Ext.mitos.GridPanel',{
            title           : 'Billing History',
            margin          : '3 0 0 0',
            region	        : 'center',
            store           : page.billingStore,
            columns : [
                { header: 'id', sortable: false, dataIndex: 'id', hidden: true},
                { width: 150,   sortable: true, dataIndex: 'date', renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s') },
                { width: 150,   sortable: true, dataIndex: 'user' },
                { flex: 1,      sortable: true, dataIndex: 'body' },
                { flex: 1,      sortable: true, dataIndex: 'body' },
                { flex: 1,      sortable: true, dataIndex: 'body' },
                { flex: 1,      sortable: true, dataIndex: 'body' }
            ],
            listeners	: {
                itemclick: function(){

                }
            }
        });
        page.pageBody = [ page.billingFormPanel, page.billingGrid ];
        page.callParent(arguments);
    } // end of initComponent
}); //ens oNotesPage class