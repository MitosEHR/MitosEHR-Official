/**
 * Created by JetBrains PhpStorm.
 * User: mitosehr
 * Date: 3/23/12
 * Time: 2:06 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('App.view.patientfile.encounter.CurrentProceduralTerminology',{
    extend:'Ext.panel.Panel',
    allias:'widget.currentproceduralterminology',
    bodyStyle:0,
    autoScroll:true,
    title:'Current Procedural Terminology',
    defaults:{
        flex:1
    },
    layout:{
        type:'hbox',
        align:'stretch'
    },
    initComponent:function(){
        var me = this;

        me.cptCodesGridStore = Ext.create('App.store.patientfile.CptCodesGrid');


        me.secondGridStore = Ext.create('Ext.data.Store', {
            model:'App.model.patientfile.CptCodesGrid'
        });

        me.items = [
            {
                xtype:'container',
                itemId:'leftCol',
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
                                change:me.onCptQuickRefereneOption
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
                        store:me.cptCodesGridStore,
                        viewConfig:{
                            plugins:[
                                {
                                    ptype:'gridviewdragdrop',
                                    dragGroup:'firstCPTGridDDGroup',
                                    dropGroup:'secondCPTGridDDGroup'
                                },
                                {
                                    pluginId:'preview',
                                    ptype:'preview',
                                    bodyField:'preview',
                                    previewExpanded:false
                                }
                            ],
                            listeners:{
                                drop:function (node, data, dropRec, dropPosition) {
                                    //var dropOn = dropRec ? ' ' + dropPosition + ' ' + dropRec.get('name') : ' on empty view';
                                    app.msg('Sweet!', 'CPT removed this this Encounter');
                                }
                            }
                        },
                        columns:[
                            {text:"Code", width:70, sortable:true, dataIndex:'code'},
                            {text:"Description", flex:1, width:70, sortable:true, dataIndex:'code_text_medium'}
                        ],
                        tbar:Ext.create('Ext.PagingToolbar', {
                            store:me.cptCodesGridStore,
                            displayInfo:true,
                            emptyMsg:"No Office Notes to display",
                            plugins:Ext.create('Ext.ux.SlidingPager', {})
                        }),
                        listeners:{
                            scope:me,
                            itemclick:me.onCptQuickRefereneItemClick
                        }

                    }
                ]
            },
            {
                xtype:'container',
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
                        store:me.secondGridStore,
                        columns:[
                            {text:"Code", width:70, sortable:true, dataIndex:'code'},
                            {text:"Description", flex:1, width:70, sortable:true, dataIndex:'code_text'},
                            {
                                text:'Modifiers',
                                width:200,
                                sortable:false,
                                dataIndex:'modifiers',
                                editor:{
    //                                        xtype: 'textfield',
    //                                        emptyText:'Click to add'
                                    xtype:'combobox',
                                    triggerAction:'all',
                                    selectOnTab:true,
                                    emptyText:'Click to add',
                                    store:[
                                        ['Option 1', 'Option 1'],
                                        ['Option 2', 'Option 2'],
                                        ['Option 3', 'Option 3'],
                                        ['Option 4', 'Option 4']
                                    ],
                                    lazyRender:true,
                                    listClass:'x-combo-list-small'
                                }
                            }
                        ],
                        dockedItems:[
                            {
                                xtype:'toolbar',
                                items:['->', {
                                    text:'Remove',
                                    iconCls:'icoClose',
                                    itemId:'removeCptBtn',
                                    disabled:true

                                }
                                ]
                            }
                        ],
                        viewConfig:{
                            itemId:'view',
                            plugins:[
                                {
                                    ptype:'gridviewdragdrop',
                                    dragGroup:'secondCPTGridDDGroup',
                                    dropGroup:'firstCPTGridDDGroup'
                                },
                                {
                                    pluginId:'preview',
                                    ptype:'preview',
                                    bodyField:'preview',
                                    previewExpanded:false
                                }
                            ],
                            listeners:{
                                drop:function (node, data, dropRec, dropPosition) {
                                    //var dropOn = dropRec ? ' ' + dropPosition + ' ' + dropRec.get('name') : ' on empty view';
                                    app.msg('Sweet!', 'CPT added to this Encounter');
                                }
                            }
                        },
                        plugins:Ext.create('Ext.grid.plugin.CellEditing', {
                            clicksToEdit:1
                        })
                    }
                ]

            }
        ];

        me.callParent(arguments);

    },

    onCptQuickRefereneOption:function (combo, value) {
        this.loadCptQuickReferenceGrid(value);
    },

    onCptQuickRefereneItemClick:function (view) {
        view.getPlugin('preview').toggleRowExpanded();
    },

    onLiveCptSelect:function (btn, record) {
        btn.reset();
        this.secondGridStore.add(record[0]);
    },

    loadCptQuickReferenceGrid:function (filter) {
        var patient = app.getCurrPatient(), pid = patient.pid;
        this.cptCodesGridStore.proxy.extraParams = {pid:pid, eid:app.currEncounterId, filter:filter};
        this.cptCodesGridStore.load();
    }

});