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
    pageTitle   : 'Visit',
    pageLayout  : 'border',
    uses        : ['Ext.mitos.restStoreModel','Ext.mitos.GridPanel'],
    initComponent: function(){
        var me = this;
        //******************************************************************
        // Stores...
        //******************************************************************
        me.historyStore = Ext.create('Ext.mitos.restStoreModel',{
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
            url      	: 'app/miscellaneous/officenotes/data_read.ejs.php',
            autoLoad	: false
        });

        /**
         * New Encounter Panel this panel is located hidden at
         * the top of the Visit panel and will slide down if
         * the "New Encounter" button is pressed.
         */
        me.newEncounterPanel = Ext.create('Ext.panel.Panel',{
            title       : 'Create Visit',
            region      : 'north',
            height      : 300,
            margin      : '0 0 3 0',
            bodyStyle   : 'padding:15px',
            hidden      : true,
            collapsible : true,
            collapsed   : true,
            animCollapse: true,
            hideCollapseTool: true,
            collapseMode: 'header',
            html        : '<h1>Create Encounter form placeholder!</h1>'
        });




        //******************************************************************
        // Panels/Forms...
        //******************************************************************
        me.MiscBillingOptionsPanel = Ext.create('Ext.panel.Panel',{
            border      : false,
            title:'Misc. Billing Options HCFA',
            html: '<h1>Misc. Billing Options HCFA form placeholder!</h1>'
        });
        me.procedurePanel = Ext.create('Ext.panel.Panel',{
            border      : false,
            title:'Procedure Order',
            html: '<h1>Procedure Order form placeholder!</h1>'
        });
        me.reviewSysPanel = Ext.create('Ext.panel.Panel',{
            border      : false,
            title:'Review of Systems',
            html: '<h1>Review of Systems form placeholder!</h1>'
        });
        me.reviewSysCkPanel = Ext.create('Ext.panel.Panel',{
            border      : false,
            title:'Review of Systems Checks',
            html: '<h1>Review of Systems Checks form placeholder!</h1>'
        });
        me.soapPanel = Ext.create('Ext.panel.Panel',{
            border      : false,
            title:'SOAP',
            html: '<h1>SOAP form placeholder!</h1>'
        });
        me.speechDicPanel = Ext.create('Ext.panel.Panel',{
            border      : false,
            title:'Speech Dictation',
            html: '<h1>Speech Dictation form placeholder!</h1>'
        });
        me.vitalsPanel = Ext.create('Ext.panel.Panel',{
            border      : false,
            title:'Vitals',
            html: '<h1>Vitals form placeholder!</h1>'
        });

        /**
         * Encounter panel
         */
        me.encounterPanel = Ext.create('Ext.panel.Panel',{
            layout      : 'card',
            region      : 'center',
            activeItem  : 0,
            defaults:{
                bodyStyle   : 'padding:15px',
                border      : false,
                bodyBorder  : false,
                layout      : 'fit'
            },
            items: [
                me.MiscBillingOptionsPanel,
                me.procedurePanel,
                me.reviewSysPanel,
                me.reviewSysCkPanel,
                me.soapPanel,
                me.speechDicPanel,
                me.vitalsPanel
            ],
            tbar:[{
                text      	: 'Misc. Billing Options HCFA',
                enableToggle: true,
                toggleGroup : '2',
                iconCls   	: '',
                listeners	: {
                    afterrender: function(){
                        this.toggle(true);
                    }
                },
                handler: function(btn) {
                    me.encounterPanel.getLayout().setActiveItem(0);
                }
            },'-',{
                text      	: 'Procedure Order',
                enableToggle: true,
                toggleGroup : '2',
                iconCls   	: '',
                handler: function(btn) {
                    me.encounterPanel.getLayout().setActiveItem(1);
                }
            },'-',{
                text      	: 'Review of Sys',
                enableToggle: true,
                toggleGroup : '2',
                iconCls   	: '',
                handler: function(btn) {
                    me.encounterPanel.getLayout().setActiveItem(2);
                }
            },'-',{
                text      	: 'Review of Sys Cks',
                enableToggle: true,
                toggleGroup : '2',
                iconCls   	: '',
                handler: function(btn) {
                    me.encounterPanel.getLayout().setActiveItem(3);
                }
            },'-',{
                text      	: 'SOAP',
                enableToggle: true,
                toggleGroup : '2',
                iconCls   	: '',
                handler: function(btn) {
                    me.encounterPanel.getLayout().setActiveItem(4);
                }
            },'-',{
                text      	: 'Speech Dictation',
                enableToggle: true,
                toggleGroup : '2',
                iconCls   	: '',
                handler: function(btn) {
                    me.encounterPanel.getLayout().setActiveItem(5);
                }
            },'-',{
                text      	: 'Vitals',
                enableToggle: true,
                toggleGroup : '2',
                iconCls   	: '',
                handler: function(btn) {
                    me.encounterPanel.getLayout().setActiveItem(6);
                }
            }],
            bbar:[{
                text      	: 'Save',
                iconCls   	: 'save',
                disabled	: true,
                handler   : function(){

                }
            },'-',{
                text      	: 'Reset Form',
                iconCls   	: 'save',
                disabled	: true,
                handler   	: function(){

                }
            }]
        });

        //******************************************************************
        // Visit History Grid
        //******************************************************************
        me.historyGrid = Ext.create('Ext.mitos.GridPanel',{
            title           : 'Encounter History',
            hidden          : true,
            collapsible     : true,
            collapsed       : true,
            animCollapse    : true,
            hideCollapseTool: true,
            collapseMode    : 'header',
            margin          : '3 0 0 0',
            region	        : 'south',
            height          : 300,
            store           : me.historyStore,
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

        me.pageBody = [ me.newEncounterPanel, me.encounterPanel, me.historyGrid ];
        me.callParent(arguments);

        me.down('panel').addDocked([{
            xtype   : 'toolbar',
            dock    : 'top',
            items:[{
                text      	: 'Encounter',
                enableToggle: true,
                toggleGroup : '1',
                iconCls   	: '',
                listeners	: {
                    afterrender: function(){
                        this.toggle(true);
                    }
                },
                handler: function(btn) {
                    me.setToolbar('encounter');
                }
            },'-',{
                text      	: 'Administrative',
                enableToggle: true,
                toggleGroup : '1',
                iconCls   	: '',
                handler: function(btn) {
                    me.setToolbar('administrative');
                }
            },'->',{
                text      	: 'New Encounter',
                iconCls   	: 'icoAddRecord',
                enableToggle: true,
                listeners:{
                    scope   : me,
                    toggle  : me.newEncounter
                }
            },'-',{
                text      	: 'Show Encounter History',
                itemId      : 'encounterHistory',
                iconCls   	: 'icoListOptions',
                enableToggle: true,
                listeners:{
                    scope   : me,
                    toggle  : me.historyToggle
                }
            }]
        }]);
    },


    /**
     *
     * @param btn
     */
    newEncounter:function(btn, pressed){
        if(pressed){
            btn.up("toolbar").getComponent('encounterHistory').toggle(false);
            btn.setText('Cancel New Encounter');
            this.newEncounterPanel.setVisible(true);
            this.newEncounterPanel.expand(true);
            this.encounterPanel.doLayout();
            this.encounterPanel.disable();
        }else{
            btn.setText('New Encounter');
            this.newEncounterPanel.expand(false);
            this.newEncounterPanel.setVisible(false);
            this.encounterPanel.enable();
        }
    },

    /**
     *
     * @param btn
     * @param pressed
     */
    historyToggle:function(btn, pressed){
        if(pressed){
            btn.setText('Hide Encounter History');
            this.historyGrid.setVisible(true);
            this.historyGrid.toggleCollapse();
            this.encounterPanel.doLayout();

        }else{
            btn.setText('Show Encounter History');
            this.historyGrid.toggleCollapse();
            this.historyGrid.setVisible(false);
        }
    },

    setToolbar:function(type){
        var toolbar = this.encounterPanel.down('toolbar')
        toolbar.removeAll();
        if(type == 'encounter'){
            toolbar.add([{
                text      	: 'Review of Sys',
                enableToggle: true,
                toggleGroup : '2',
                iconCls   	: '',
                scope       : this,
                handler: function(btn) {
                    this.encounterPanel.getLayout().setActiveItem(2);
                }
            },'-',{
                text      	: 'Review of Sys Cks',
                enableToggle: true,
                toggleGroup : '2',
                iconCls   	: '',
                scope       : this,
                handler: function(btn) {
                    this.encounterPanel.getLayout().setActiveItem(3);
                }
            },'-',{
                text      	: 'SOAP',
                enableToggle: true,
                toggleGroup : '2',
                iconCls   	: '',
                scope       : this,
                handler: function(btn) {
                    this.encounterPanel.getLayout().setActiveItem(4);
                }
            },'-',{
                text      	: 'Speech Dictation',
                enableToggle: true,
                toggleGroup : '2',
                iconCls   	: '',
                scope       : this,
                handler: function(btn) {
                    this.encounterPanel.getLayout().setActiveItem(5);
                }
            },'-',{
                text      	: 'Vitals',
                enableToggle: true,
                toggleGroup : '2',
                iconCls   	: '',
                scope       : this,
                handler: function(btn) {
                    this.encounterPanel.getLayout().setActiveItem(6);
                }
            }]);
        }else if(type == 'administrative'){
            toolbar.add([{
                text      	: 'Misc. Billing Options HCFA',
                enableToggle: true,
                toggleGroup : '2',
                iconCls   	: '',
                scope       : this,
                handler: function(btn) {
                    this.encounterPanel.getLayout().setActiveItem(0);
                }
            },'-',{
                text      	: 'Procedure Order',
                enableToggle: true,
                toggleGroup : '2',
                iconCls   	: '',
                scope       : this,
                handler: function(btn) {
                    this.encounterPanel.getLayout().setActiveItem(1);
                }
            }]);
        }

    },

    /**
     * This function is called from MitosAPP.js when
     * this panel is selected in the navigation panel.
     * place inside this function all the functions you want
     * to call every this panel becomes active
     */
    onActive:function(){

    }
}); //ens oNotesPage class
