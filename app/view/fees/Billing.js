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

    initComponent:function () {
        var me = this;

        me.patient = null;
        me.pastDue = null;
        me.dateRange = { start:null, limit:null };

        me.patientListStore = Ext.create('App.store.fees.Billing');

        me.billingWindow = Ext.create('Ext.window.Window',{
            defaultTitle:'Encounter Billing Details',
            closeAction:'hide',
            height:window.innerHeight - 50,
            width:window.innerWidth - 50,
            maximizable:true,
            //maximized:true,
            layout:'border',
            autoScroll:true,
            items:[
                me.cptPanel = Ext.create('App.view.patientfile.encounter.CurrentProceduralTerminology',{
                    region:'center'
                }),
                me.progressNote = Ext.create('App.view.patientfile.ProgressNote',{
                    title:'Encounter Progress Note',
                    region:'east',
                    margin:'0 0 0 2',
                    bodyStyle:'padding:15px',
                    width:500,
                    autoScroll:true,
                    collapsible:true,
                    animCollapse:true,
                    collapsed:true
                })
            ],
            buttons:[
                {
                    text:'Save'
                },
                {
                    text:'Next'
                },
                {
                    text:'Close'
                }
            ]

        });

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
//            plugins:Ext.create('App.classes.grid.RowFormEditing', {
//                autoCancel:false,
//                errorSummary:false,
//                clicksToEdit:1,
//                formItems:[
//                    me.cptPanel = Ext.create('App.view.patientfile.encounter.CurrentProceduralTerminology', {
//                        height:400
//                    })
//
//                ]
//
//            }),
            listeners:{
                scope:me,
                itemclick:me.rowClicked
            }

        });

        me.pageBody = [ me.encountersGrid ];
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

    rowClicked:function(grid, record){
        var title = this.billingWindow.defaultTitle;
        this.billingWindow.setTitle(title + ' ( ' + record.data.patientName + ' )');
        this.updateProgressNote(record.data.eid);
        this.billingWindow.show();
        this.cptPanel.encounterCptStoreLoad(record.data.eid);

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