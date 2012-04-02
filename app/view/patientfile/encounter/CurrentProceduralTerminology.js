/**
 * Created by JetBrains PhpStorm.
 * User: mitosehr
 * Date: 3/23/12
 * Time: 2:06 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('App.view.patientfile.encounter.CurrentProceduralTerminology', {
    extend:'Ext.panel.Panel',
    allias:'widget.currentproceduralterminology',
    bodyStyle:0,
    autoScroll:true,
    title:'Current Procedural Terminology',
    border:false,
    bodyBorder:false,
    bodyPadding:'5 0 0 0',
    layout:'border',
    eid:null,
    initComponent:function () {
        var me = this;


        me.referenceCptStore = Ext.create('App.store.patientfile.CptCodesGrid');

        me.encounterCptStore = Ext.create('Ext.data.Store', {
            model:'App.model.patientfile.CptCodesGrid'
        });


        me.cptFormEdit = Ext.create('App.classes.grid.RowFormEditing', {
            autoCancel:false,
            errorSummary:false,
            clicksToEdit:1,
            enableRemove:true,
            formItems:[
                {
                    fieldLabel:'Full Description',
                    xtype:'displayfield',
                    name:'code_text',
                    anchor:'100%'
                },
                {
                    xtype:'container',
                    layout:'column',
                    items:[
                        {
                            xtype:'fieldcontainer',
                            layout:'anchor',
                            columnWidth:.5,
                            margin:'0 3 0 0',
                            defaults:{ xtype:'textfield', anchor:'100%' },
                            items:[
                                {
                                    fieldLabel:'Place Of Service',
                                    name:'place_of_service'
                                },
                                {
                                    fieldLabel:'Emergency?',
                                    name:'emergency'
                                },
                                {
                                    fieldLabel:'Charges',
                                    name:'charges'
                                }
                            ]
                        },
                        {
                            xtype:'fieldcontainer',
                            layout:'anchor',
                            columnWidth:.5,
                            margin:'0 0 0 3',
                            defaults:{ xtype:'textfield', anchor:'100%', labelWidth:110 },
                            items:[
                                {
                                    fieldLabel:'Days of Units',
                                    name:'days_of_units'
                                },
                                {
                                    fieldLabel:'ESSDT Fam. Plan',
                                    name:'essdt_plan'
                                },
                                {
                                    fieldLabel:'Modifiers',
                                    xtype:'livecptsearch',
                                    hideLabel:false,
                                    name:'modifiers'
                                }

                            ]
                        }

                    ]
                },
                {
                    xtype:'liveicdxsearch',
                    fieldLabel:'Diagnosis',
                    hideLabel:false,
                    name:'diagnosis'

                }
            ],
            listeners:{
                scope:me,
                afterremove:me.onCompleteRemove
            }
        });

        me.items = [
            {
                xtype:'panel',
                title:'CPT Search',
                itemId:'leftCol',
                region:'west',
                width:450,
                collapsible:true,
                collapseMode:'mini',
                collapsed:true,
                titleCollapse:true,
                split:true,
                layout:{
                    type:'vbox',
                    align:'stretch',
                    padding:5
                },
                items:[
                    {
                        xtype:'fieldset',
                        title:'CPT Quick Reference Options',
                        padding:'10 15',
                        margin:'0 0 3 0',
                        layout:'anchor',
                        items:{
                            xtype:'combobox',
                            anchor:'100%',
                            editable:false,
                            queryMode:'local',
                            valueField:'value',
                            displayField:'name',
                            store:Ext.create('Ext.data.Store', {
                                fields:['name', 'value'],
                                data:[
                                    { name:'Show related CPTs for current diagnostics', value:0 },
                                    { name:'Show CPTs history for this patient', value:1 },
                                    { name:'Show CPTs commonly used by Clinic', value:2 },
                                    { name:'Show All CPTs', value:3 }
                                ]
                            }),
                            listeners:{
                                scope:me,
                                change:me.onQuickRefereneOption
                            }
                        }
                    },
                    {
                        xtype:'grid',
                        title:'CPT Quick Reference List',
                        margins:0,
                        flex:1,
                        multiSelect:true,
                        stripeRows:true,
                        store:me.referenceCptStore,
                        viewConfig:{
                            copy:true,
                            plugins:[
                                {
                                    ptype:'gridviewdragdrop',
                                    dragGroup:'firstCPTGridDDGroup',
                                    dropGroup:'secondCPTGridDDGroup'
                                }
                            ],
                            listeners:{
                                scope:me,
                                drop:me.onQuickRefereneDrop
                            }
                        },
                        columns:[
                            {
                                text:"Code",
                                width:70,
                                sortable:true,
                                dataIndex:'code'
                            },
                            {
                                text:"Description",
                                flex:1,
                                sortable:true,
                                dataIndex:'code_text_medium'
                            }
                        ],
                        tbar:Ext.create('Ext.PagingToolbar', {
                            store:me.referenceCptStore,
                            displayInfo:true,
                            emptyMsg:"No Office Notes to display",
                            plugins:Ext.create('Ext.ux.SlidingPager', {})
                        })
                    }
                ],
                listeners:{
                    scope:me,
                    collapse:me.onQuickReferenceCollapsed
                }
            },
            {
                xtype:'panel',
                title:'Encounter CPTs',
                region:'center',
                itemId:'rightCol',
                layout:{
                    type:'vbox',
                    align:'stretch',
                    padding:'5 5 5 0'
                },
                items:[
                    {
                        xtype:'fieldset',
                        title:'CPT Live Sarch',
                        padding:'10 15',
                        margin:'0 0 3 0',
                        layout:'anchor',
                        items:{
                            xtype:'livecptsearch',
                            listeners:{
                                scope:me,
                                select:me.onLiveCptSelect
                            }
                        }

                    },
                    {
                        xtype:'grid',
                        flex:1,
                        stripeRows:true,
                        title:'Encounter CPT\'s',
                        margins:0,
                        store:me.encounterCptStore,
                        columns:[
                            {
                                text:"Code",
                                width:70,
                                sortable:true,
                                dataIndex:'code'
                            },
                            {
                                text:"Description",
                                flex:1,
                                sortable:true,
                                dataIndex:'code_text'
                            },
                            {
                                text:'Modifiers',
                                width:200,
                                sortable:false,
                                dataIndex:'modifiers'
                            }
                        ],
                        dockedItems:[
                            {
                                xtype:'toolbar',
                                items:[
                                    {
                                        text:'Quick Reference',
                                        action:'referenceCptBtn',
                                        enableToggle:true,
                                        scope:me,
                                        toggleHandler:me.onQuickReferenceToggle
                                    }
                                ]
                            }
                        ],
                        viewConfig:{
                            itemId:'view',
                            //copy:true,
                            plugins:[
                                {
                                    ptype:'gridviewdragdrop',
                                    dragGroup:'secondCPTGridDDGroup',
                                    dropGroup:'firstCPTGridDDGroup'
                                }

                            ],
                            listeners:{
                                scope:me,
                                drop:me.onEncounterCptDrop
                            }
                        },
                        plugins:me.cptFormEdit,
                        listeners:{
                            selectionchange:me.onEncounterCptSelectionChange
                        },
                        tools: [{
                            type: 'refresh',
                            handler: function(){
                                me.encounterCptStoreLoad(null);
                            }
                        }]
                    }
                ]

            }
        ];


        me.callParent(arguments);

    },

    onQuickReferenceCollapsed:function () {
        var btn = this.query('button[action="referenceCptBtn"]');
        if (btn[0].pressed) {
            btn[0].toggle(false);
        }
    },

    onQuickReferenceToggle:function (btn, pressed) {
        if (pressed) {
            this.getComponent('leftCol').expand();
        } else {
            this.getComponent('leftCol').collapse();
        }

    },

    onQuickRefereneOption:function (combo, value) {
        this.loadCptQuickReferenceGrid(value);
    },

    onQuickRefereneDrop:function (node, data, dropRec, dropPosition) {
        app.msg('Sweet!', 'CPT removed from this Encounter');
    },

    onCompleteRemove:function () {
        app.msg('Sweet!', 'CPT removed from this Encounter');
    },

    onLiveCptSelect:function (btn, record) {
        var me = this;
        btn.reset();
        me.cptFormEdit.cancelEdit();
        me.encounterCptStore.insert(0, record[0]);
        me.cptFormEdit.startEdit(0, 0);

    },

    loadCptQuickReferenceGrid:function (filter) {
        var patient = app.getCurrPatient(), pid = patient.pid;
        this.referenceCptStore.proxy.extraParams = {pid:pid, eid:app.currEncounterId, filter:filter};
        this.referenceCptStore.load();
    },

    onEncounterCptSelectionChange:function (sm, selections) {
        //sm.view.panel.down('toolbar').getComponent('removeCptBtn').setDisabled(selections.length == 0);
    },
    onEncounterCptDrop:function (node, data, dropRec, dropPosition) {
        var me = this,
            index;

        app.msg('Sweet!', 'CPT added to this Encounter');
        me.cptFormEdit.cancelEdit();
        index = me.encounterCptStore.indexOf(data.records[0]);
        me.cptFormEdit.startEdit(index, 0);
    },

    gridItemClick:function (view) {
        view.getPlugin('preview').toggleRowExpanded();
    },

    encounterCptStoreLoad:function(eid){
        this.encounterCptStore.load({params:{eid:eid ? eid : app.currEncounterId}})
    }


});