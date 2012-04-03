//******************************************************************************
// Billing.ejs.php
// Billing Forms
// v0.0.1
// Author: Emmanuel J. Carrasquillo
// Modified:
// MitosEHR (Electronic Health Records) 2011
//******************************************************************************
Ext.define('App.view.fees.Billing', {
    extend:'App.classes.RenderPanel',
    id:'panelBilling',
    pageTitle:'Billing',
    uses:[ 'App.classes.GridPanel' ],
    pageLayout:'card',
    initComponent:function () {
        var me = this;

        me.patient = null;
        me.pastDue = null;
        me.dateRange = { start:null, limit:null };

        me.patientListStore = Ext.create('App.store.fees.Billing');

        me.encountersGrid = Ext.create('Ext.grid.Panel', {
            store:me.patientListStore,
            viewConfig: {
                stripeRows: true
            },
            columns:[
                {
                    header:'Service Date',
                    dataIndex:'start_date',
                    width:200
                },
                {
                    header:'Patient',
                    dataIndex:'patientName',
                    width:200
                },
                {
                    header:'Primary Provideer',
                    dataIndex:'primaryProvider',
                    width:200
                },
                {
                    header:'Encounter Provider',
                    dataIndex:'encounterProvider',
                    flex:1
                }
            ],
            tbar:[
                {
                    xtype:'patienlivetsearch',
                    emptyText:'Patient Live Search...',
                    width:300,
                    margin:'0 5 0 0'

                },
                {
                    xtype:'datefield',
                    fieldLabel:'From',
                    labelWidth:40,
                    action:'datefrom'
                },
                {
                    xtype:'datefield',
                    fieldLabel:'To',
                    labelWidth:30,
                    action:'dateto'

                },
                '->',
                {
                    xtype:'tbtext',
                    text:'Past due:'
                },
                {
                    text:'30+',
                    enableToggle:true,
                    action:30,
                    toggleGroup:'pastduedates',
                    enableKeyEvents:true,
                    listeners:{
                        scope:me,
                        click:me.onBtnClicked
                    }

                },
                {
                    text:'60+',
                    enableToggle:true,
                    action:60,
                    toggleGroup:'pastduedates',
                    listeners:{
                        scope:me,
                        click:me.onBtnClicked
                    }
                },
                {
                    text:'120+',
                    enableToggle:true,
                    action:120,
                    toggleGroup:'pastduedates',
                    listeners:{
                        scope:me,
                        click:me.onBtnClicked
                    }
                },
                {
                    text:'180+',
                    enableToggle:true,
                    action:180,
                    toggleGroup:'pastduedates',
                    listeners:{
                        scope:me,
                        click:me.onBtnClicked
                    }

                }
            ],
            listeners:{
                scope:me,
                itemclick:me.rowClicked,
                selectionchange:me.onSelectionChanged
            }

        });

        me.encounterBillingDetails = Ext.create('Ext.panel.Panel',{
            defaultTitle:'Encounter Billing Details',
            title: 'Encounter Billing Details',
            layout:'border',
            items:[
                me.cptPanel = Ext.create('App.view.patientfile.encounter.CurrentProceduralTerminology',{
                    region:'center'
                }),
                me.progressNote = Ext.create('App.view.patientfile.ProgressNote',{
                    title:'Encounter Progress Note',
                    region:'east',
                    margin:5,
                    bodyStyle:'padding:15px',
                    width:500,
                    autoScroll:true,
                    collapsible:true,
                    animCollapse:true,
                    collapsed:false
                })
            ],
            buttons:[
                {
                    text:'Encounters',
                    scope:me,
                    action:'encounters',
                    tooltip:'Back to Encounter List',
                    handler:me.onBtnCancel
                },
                '->',
                {
                    xtype: 'tbtext',
                    action:'page',
                    text: '( 1 of 1 )'
                },
                {
                    text:'<<<  Back',
                    scope:me,
                    action:'back',
                    tooltip:'Previous Encounter Details',
                    handler:me.onBtnBack
                },
                {
                    text:'Save',
                    scope:me,
                    action:'save',
                    tooltip:'Save Billing Details'
                },

                {
                    text:'Cancel',
                    scope:me,
                    action:'cancel',
                    tooltip:'Cancel and Go Back to Encounter List',
                    handler:me.onBtnCancel
                },
                {
                    text:'Next  >>>',
                    scope:me,
                    action:'next',
                    tooltip:'Next Encounter Details',
                    handler:me.onBtnNext
                }
            ]
        });

        me.pageBody = [ me.encountersGrid, me.encounterBillingDetails ];
        me.callParent(arguments);
    }, // end of initComponent

    onBtnClicked:function (btn) {
        var datefrom = this.query('datefield[action="datefrom"]'),
            dateto = this.query('datefield[action="dateto"]');
        if(btn.pressed){
            datefrom[0].reset();
            dateto[0].reset();
            this.pastDue = btn.action;
        }else{
            this.pastDue = 0;
        }
        this.reloadGrid();

    },

    rowClicked:function(){
        this.goToEncounterBillingDetail();
    },

    goToEncounterBillingDetail:function(){
        this.getPageBody().getLayout().setActiveItem(1);
    },

    goToEncounterList:function(){
        this.getPageBody().getLayout().setActiveItem(0);
    },

    onSelectionChanged:function(sm, model){
        var title = this.encounterBillingDetails.defaultTitle,
            backbtn = this.encounterBillingDetails.query('button[action="back"]'),
            nextBtn = this.encounterBillingDetails.query('button[action="next"]'),
            pageInfo = this.encounterBillingDetails.query('tbtext[action="page"]'),
            rowIndex = model[0].index;
        this.updateProgressNote(model[0].data.eid);
        this.encounterBillingDetails.setTitle(title + ' ( ' + model[0].data.patientName + ' )');
        this.cptPanel.encounterCptStoreLoad(model[0].data.eid);

        pageInfo[0].setText('( Page ' + (rowIndex + 1) + ' of ' + sm.store.data.length + ' ) ');
        nextBtn[0].setDisabled(rowIndex == sm.store.data.length -1);
        backbtn[0].setDisabled(rowIndex == 0);
    },

    onBtnCancel:function(){
        this.getPageBody().getLayout().setActiveItem(0);
    },

    onBtnBack:function(){
        var sm = this.encountersGrid.getSelectionModel(),
            currRowIndex = sm.getLastSelected().index,
            prevRowindex = currRowIndex - 1;
        sm.select(prevRowindex);
    },

    onBtnNext:function(){
        var sm = this.encountersGrid.getSelectionModel(),
            currRowIndex = sm.getLastSelected().index,
            nextRowindex = currRowIndex + 1;
        sm.select(nextRowindex);
    },

    onBtnSave:function(){
        this.goToEncounterList();
    },

    reloadGrid:function(){
        this.patientListStore.load({
            params:{
                query:{
                    patient:this.patient,
                    pastDue:this.pastDue,
                    dateRange:this.dateRange
                }
            }
        });
    },

    updateProgressNote:function (eid) {
        var me = this;
        Encounter.getProgressNoteByEid(eid, function(provider, response) {
            var data = response.result;
            me.progressNote.tpl.overwrite(me.progressNote.body, data);
        });
    },

    /**
     * This function is called from MitosAPP.js when
     * this panel is selected in the navigation panel.
     * place inside this function all the functions you want
     * to call every this panel becomes active
     */
    onActive:function (callback) {
        this.reloadGrid();
        callback(true);
    }
}); //ens oNotesPage class