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
    uses        : [ 'Ext.mitos.CRUDStore', 'Ext.mitos.GridPanel' ],
    initComponent: function(){
        var page = this;
        //******************************************************************
        // Stores...
        //******************************************************************
        page.billingStore = Ext.create('Ext.mitos.CRUDStore',{
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
        // Grid...
        //******************************************************************
        page.billingGrid = Ext.create('Ext.mitos.GridPanel',{
            title           : 'Billing History',
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
        page.pageBody = [  page.billingGrid ];
        page.callParent(arguments);
    }, // end of initComponent
    /**
    * This function is called from MitosAPP.js when
    * this panel is selected in the navigation panel.
    * place inside this function all the functions you want
    * to call every this panel becomes active
    */
    onActive:function(){

    }
}); //ens oNotesPage class