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
    pageTitle   : 'Visits History',
    uses        : ['Ext.mitos.restStoreModel','Ext.mitos.GridPanel','Ext.ux.PreviewPlugin'],

    initComponent: function(){
        var me = this;

        me.store = Ext.create('Ext.mitos.restStoreModel',{
            fields: [
                {name: 'eid',				type: 'int'},
                {name: 'start_date',		type: 'date', dateFormat: 'c'},
                {name: 'close_date',		type: 'date', dateFormat: 'c'},
                {name: 'sensitivity',		type: 'string'},
                {name: 'brief_description',	type: 'string'},
                {name: 'visit_category',	type: 'string'},
                {name: 'facility',			type: 'string'},
                {name: 'billing_facility',	type: 'string'},
                {name: 'sensitivity',		type: 'string'},
                {name: 'provider',			type: 'string'},
                {name: 'status',	            type: 'string'}
            ],
            model		: 'patientVisitsModel',
            idProperty	: 'eid',
            url		    : 'app/patientfile/visits/data.php'
        });

        function open(val) {
            if(val != null){
                return '<img src="ui_icons/yes.gif" />';
            }else{
                return '<img src="ui_icons/no.gif" />';
            }
            return val;
        }

        //******************************************************************
        // Visit History Grid
        //******************************************************************
        me.historyGrid = Ext.create('Ext.mitos.GridPanel',{
            title   : 'Encounter History',
            store   : me.store,
            columns: [
                { header: 'eid', sortable: false, dataIndex: 'eid', hidden: true},
                { width: 150, header: 'Date',               sortable: true, dataIndex: 'start_date', renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s') },
                { flex: 1,    header: 'Reason',             sortable: true, dataIndex: 'brief_description' },
                { width: 180, header: 'Provider',           sortable: true, dataIndex: 'provider' },
                { width: 120, header: 'facility',           sortable: true, dataIndex: 'facility' },
                { width: 120, header: 'Billing Facility',   sortable: true, dataIndex: 'billing_facility' },
                { width: 45, header: 'Close?',              sortable: true, dataIndex: 'close_date', renderer:open }
            ],
            viewConfig: {
                itemId: 'view',
                plugins: [{
                    pluginId        : 'preview',
                    ptype           : 'preview',
                    bodyField       : 'brief_description',
                    previewExpanded : false
                }],
                listeners: {
                    scope       : me,
                    itemclick   : me.gridItemClick,
                    itemdblclick: me.gridItemDblClick
                }
            },
            tbar: Ext.create('Ext.PagingToolbar', {
                store       : me.store,
                displayInfo : true,
                emptyMsg    : 'No Encounters Found',
                plugins     : Ext.create('Ext.ux.SlidingPager', {}),
                items: [{
                    iconCls         : '',
                    text            : 'Show Details',
                    enableToggle    : true,
                    scope           : me,
                    toggleHandler   : me.onDetailToggle
                },'-',{
                    text    : 'New Encounter',
                    scope   : me,
                    handler : me.createNewEncounter
                }]
            })
        });
        me.pageBody = [me.historyGrid];

        me.callParent(arguments);
    },

    onDetailToggle:function(btn, pressed) {
        this.historyGrid.getComponent('view').getPlugin('preview').toggleExpanded(pressed);
    },

    gridItemClick:function(view){
        view.getPlugin('preview').toggleRowExpanded();
    },

    gridItemDblClick:function(view, record){
        App.openEncounter(record.data.eid);
    },

    createNewEncounter:function(){
      App.createNewEncounter();
    },

    setFormPanel:function(type){
        var encounterPanel      = this.centerPanel.getComponent('encounter'),
            administrativePanel = this.centerPanel.getComponent('administrative');
        if(type == 'encounter'){
            administrativePanel.setVisible(false);
            encounterPanel.setVisible(true);
        }else if(type == 'administrative'){
            encounterPanel.setVisible(false);
            administrativePanel.setVisible(true);

        }
    },

    /**
     * This function is called from MitosAPP.js when
     * this panel is selected in the navigation panel.
     * place inside this function all the functions you want
     * to call every this panel becomes active
     */
    onActive:function(callback){
        if(this.checkIfCurrPatient()){

            var patient = this.getCurrPatient();
            this.updateTitle( patient.name + ' (Encounters)');
            this.store.load();
            callback(true);
        }else{
            callback(false);
            this.currPatientError();
        }
    }
}); //ens oNotesPage class
