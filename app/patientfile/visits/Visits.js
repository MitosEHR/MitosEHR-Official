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
    uses        : ['Ext.mitos.restStoreModel','Ext.mitos.GridPanel'],

    initComponent: function(){
        var me = this;

        me.store = Ext.create('Ext.data.Store', {
            fields: ['date', 'reason', 'provider', 'close', 'billing','inssurance'],
            data : [
                {"date":"10/25/1978", "reason":"Cataarro", "provider":"Dr.Roddriguez", "close":"Yes", "billing":"Yes", "inssurance":"SSS"},
                {"date":"10/25/1978", "reason":"Cataarro", "provider":"Dr.Roddriguez", "close":"Yes", "billing":"Yes", "inssurance":"SSS"},
                {"date":"10/25/1978", "reason":"Cataarro", "provider":"Dr.Roddriguez", "close":"Yes", "billing":"Yes", "inssurance":"SSS"},
                {"date":"10/25/1978", "reason":"Cataarro", "provider":"Dr.Roddriguez", "close":"Yes", "billing":"Yes", "inssurance":"SSS"},
                {"date":"10/25/1978", "reason":"Cataarro", "provider":"Dr.Roddriguez", "close":"Yes", "billing":"Yes", "inssurance":"SSS"}
                //...
            ]
        });





        // Panels/Forms...
        //****
        //******************************************************************
        // Visit History Grid
        //******************************************************************
        me.historyGrid = Ext.create('Ext.mitos.GridPanel',{
            title   : 'Encounter History',
            store   : me.store,
            columns: [
                //{ header: 'id', sortable: false, dataIndex: 'id', hidden: true},
                { width: 150, header: 'Date',           sortable: true, dataIndex: 'date', renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s') },
                { width: 150, header: 'Reason',         sortable: true, dataIndex: 'reason' },
                { width: 150, header: 'Provider',       sortable: true, dataIndex: 'provider' },
                { width: 150, header: 'Close Encounter',sortable: true, dataIndex: 'close' },
                { flex: 1,    header: 'Billing',        sortable: true, dataIndex: 'billing' },
                { flex: 1,    header: 'Issurance',      sortable: true, dataIndex: 'inssurance' }
            ],
            listeners	: {
                scope       : me,
                itemclick   : me.gridItemClick,
                itemdblclick: me.gridItemDblClick

            },
            tbar:['->',{
                text    : 'New Encounter',
                scope   : me,
                handler : me.newEncounter
            }]
        });
        me.pageBody = [me.historyGrid];

        me.callParent(arguments);
    },

    gridItemClick:function(){


    },

    gridItemDblClick:function(){


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
//        if(this.checkIfCurrPatient()){
//
//            var patient = this.getCurrPatient();
//            this.updateTitle( patient.name + ' (Encounters)');

            callback(true);
//        }else{
//            callback(false);
//            this.currPatientError();
//        }
    }
}); //ens oNotesPage class
