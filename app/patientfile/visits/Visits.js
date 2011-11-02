
//******************************************************************************
// visits.ejs.php
// Visits Forms
// v0.0.1
// 
// Author: Ernesto J. Rodriguez
// Modified:
//
// MitosEHR (Electronic Health Records) 2011
//******************************************************************************
Ext.define('Ext.mitos.panel.patientfile.visits.Visits',{
    extend      : 'Ext.mitos.RenderPanel',
    id          : 'panelVisits',
    pageTitle   : 'Visits',
    pageLayout  : 'border',
    uses        : ['Ext.mitos.CRUDStore','Ext.mitos.GridPanel'],
    initComponent: function(){
        var page = this;
        //******************************************************************
        // Stores...
        //******************************************************************
        page.historyStore = Ext.create('Ext.mitos.CRUDStore',{
            fields: [
                {name: 'id',      		type: 'int'},
                {name: 'date',          type: 'date', dateFormat: 'c'},
                {name: 'body',          type: 'string'},
                {name: 'user',          type: 'string'},
                {name: 'facility_id',   type: 'string'},
                {name: 'activity',   	type: 'string'}
            ],
            model		: 'modelOnotes',
            idProperty	: 'id',
            read      	: 'app/miscellaneous/officenotes/data_read.ejs.php',
            create    	: 'app/miscellaneous/officenotes/data_create.ejs.php',
            update    	: 'app/miscellaneous/officenotes/data_update.ejs.php',
          //destroy		: <-- delete not allow -->
            autoLoad	: false
        });
        //******************************************************************
        // Panels/Forms...
        //******************************************************************
        page.createPanel = Ext.panel.Panel({
            title:'Create Visit',
            html: '<h1>Create Visit form placeholder!</h1>'
        });
        page.MiscBillingOptionsPanel = Ext.panel.Panel({
            title:'Misc. Billing Options HCFA',
            html: '<h1>Misc. Billing Options HCFA form placeholder!</h1>'
        });
        page.procedurePanel = Ext.panel.Panel({
            title:'Procedure Order',
            html: '<h1>Procedure Order form placeholder!</h1>'
        });
        page.reviewSysPanel = Ext.panel.Panel({
            title:'Review of Systems',
            html: '<h1>Review of Systems form placeholder!</h1>'
        });
        page.reviewSysCkPanel = Ext.panel.Panel({
            title:'Review of Systems Checks',
            html: '<h1>Review of Systems Checks form placeholder!</h1>'
        });
        page.soapPanel = Ext.panel.Panel({
            title:'SOAP',
            html: '<h1>SOAP form placeholder!</h1>'
        });
        page.speechDicPanel = Ext.panel.Panel({
            title:'Speech Dictation',
            html: '<h1>Speech Dictation form placeholder!</h1>'
        });
        page.vitalsPanel = Ext.panel.Panel({
            title:'Vitals',
            html: '<h1>Vitals form placeholder!</h1>'
        });
        //******************************************************************
        // Visit Form
        //******************************************************************
        page.currentVisitPanel = Ext.panel.Panel({
            region:'center',
            layout: 'card',
            activeItem: 0,
            defaults: {
                bodyStyle   : 'padding:15px',
                border      : false,
                bodyBorder  : false
            },
            items: [
                page.MiscBillingOptionsPanel,
                page.procedurePanel,
                page.reviewSysPanel,
                page.reviewSysCkPanel,
                page.soapPanel,
                page.speechDicPanel,
                page.vitalsPanel
            ],
            dockedItems:[{
                xtype: 'toolbar',
                dock: 'top',
                items:[
                    Ext.create('Ext.Button', {
                        text      	: 'Misc. Billing Options HCFA',
                        enableToggle: true,
                        toggleGroup : '1',
                        iconCls   	: '',
                        listeners	: {
                            afterrender: function(){
                                this.toggle(true);
                            }
                        },
                        handler: function(btn) {
                            btn.up("panel").getLayout().setActiveItem(0);
                        }
                    }),'-',
                    Ext.create('Ext.Button', {
                        text      	: 'Procedure Order',
                        enableToggle: true,
                        toggleGroup : '1',
                        iconCls   	: '',
                        handler: function(btn) {
                            btn.up("panel").getLayout().setActiveItem(1);
                        }
                    }),'-',
                    Ext.create('Ext.Button', {
                        text      	: 'Review of Sys',
                        enableToggle: true,
                        toggleGroup : '1',
                        iconCls   	: '',
                        handler: function(btn) {
                            btn.up("panel").getLayout().setActiveItem(2);
                        }
                    }),'-',
                    Ext.create('Ext.Button', {
                        text      	: 'Review of Sys Cks',
                        enableToggle: true,
                        toggleGroup : '1',
                        iconCls   	: '',
                        handler: function(btn) {
                            btn.up("panel").getLayout().setActiveItem(3);
                        }
                    }),'-',
                    Ext.create('Ext.Button', {
                        text      	: 'SOAP',
                        enableToggle: true,
                        toggleGroup : '1',
                        iconCls   	: '',
                        handler: function(btn) {
                            btn.up("panel").getLayout().setActiveItem(4);
                        }
                    }),'-',
                    Ext.create('Ext.Button', {
                        text      	: 'Speech Dictation',
                        enableToggle: true,
                        toggleGroup : '1',
                        iconCls   	: '',
                        handler: function(btn) {
                            btn.up("panel").getLayout().setActiveItem(5);
                        }
                    }),'-',
                    Ext.create('Ext.Button', {
                        text      	: 'Vitals',
                        enableToggle: true,
                        toggleGroup : '1',
                        iconCls   	: '',
                        handler: function(btn) {
                            btn.up("panel").getLayout().setActiveItem(6);
                        }
                    }),'->',
                    Ext.create('Ext.Button', {
                        text      	: 'New Visit',
                        enableToggle: true,
                        toggleGroup : '1',
                        iconCls   	: 'icoAddRecord',
                        handler   	: function(btn){
                            page.currentVisitPanel.add(page.createPanel);
                            btn.up("panel").getLayout().setActiveItem(7);
                            page.historyGrid.hide();
                            page.showHist.show();
                            page.hideHist.hide();
                            this.disable();

                        }
                    }),'-',
                    page.showHist = Ext.create('Ext.Button', {
                        text      	: 'Show Visits History',
                        iconCls   	: 'icoListOptions',
                        handler  : function(){
                            page.historyGrid.show();
                            page.hideHist.show();
                            this.hide();
                        }
                    }),
                    page.hideHist = Ext.create('Ext.Button', {
                        text      	: 'Hide Visits History',
                        iconCls   	: 'icoListOptions',
                        hidden      : true,
                        handler  : function(){
                            page.historyGrid.hide();
                            page.showHist.show();
                            this.hide();
                        }
                    })
                ]
            },{
                xtype: 'toolbar',
                dock: 'bottom',
                items:[
                    Ext.create('Ext.Button', {
                        text      	: 'Save',
                        iconCls   	: 'save',
                        disabled	: true,
                        handler   : function(){

                        }
                    }),'-',
                    Ext.create('Ext.Button', {
                        text      	: 'Reset Form',
                        iconCls   	: 'save',
                        disabled	: true,
                        handler   	: function(){

                        }
                    })
                ]
            }]
        });
        //******************************************************************
        // Visit History Grid
        //******************************************************************
        page.historyGrid = Ext.create('Ext.mitos.GridPanel',{
            title           : 'Visit History',
            hidden          : true,
            margin          : '3 0 0 0',
            region	        : 'south',
            height          : 200,
            store           : page.historyStore,
            columns : [
                { header: 'id', sortable: false, dataIndex: 'id', hidden: true},
                { width: 150, header: 'Date',     sortable: true, dataIndex: 'date', renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s') },
                { width: 150, header: 'Issue',    sortable: true, dataIndex: 'user' },
                { flex: 1,    header: 'Reason',   sortable: true, dataIndex: 'body' },
                { flex: 1,    header: 'Provider', sortable: true, dataIndex: 'body' },
                { flex: 1,    header: 'Billing',  sortable: true, dataIndex: 'body' },
                { flex: 1,    header: 'Insurance',sortable: true, dataIndex: 'body' }
            ],
            listeners	: {
                itemclick: function(){

                }
            }
        });

        page.pageBody = [ page.currentVisitPanel, page.historyGrid ];
        page.callParent(arguments);
    }, // end of initComponent
    loadStores:function(){

    }
}); //ens oNotesPage class
