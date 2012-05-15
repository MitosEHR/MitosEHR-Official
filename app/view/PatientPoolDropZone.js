/**
 * Created by JetBrains PhpStorm.
 * User: ernesto
 * Date: 3/16/12
 * Time: 9:09 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('App.view.PatientPoolDropZone', {
    id : 'panelPoolArea',
    extend:'App.classes.RenderPanel',
    pageTitle:'Patient Pool Areas',

    initComponent:function () {
        var me = this;

        me.checkInStore = Ext.create('Ext.data.Store', {
            model:'App.model.poolarea.PoolDropAreas',
            proxy    : {
                type       : 'direct',
                api        : {
                    read: PoolArea.getPoolAreaPatients
                },
                extraParams:{
                    area_id:1
                }
            }
        });

        me.triageStore = Ext.create('Ext.data.Store', {
            model:'App.model.poolarea.PoolDropAreas',
            proxy    : {
                type       : 'direct',
                api        : {
                    read: PoolArea.getPoolAreaPatients
                },
                extraParams:{
                    area_id:2
                }
            }
        });

        me.physicianStore = Ext.create('Ext.data.Store', {
            model:'App.model.poolarea.PoolDropAreas',
            proxy    : {
                type       : 'direct',
                api        : {
                    read: PoolArea.getPoolAreaPatients
                },
                extraParams:{
                    area_id:3
                }
            }
        });

        me.ckoutStore = Ext.create('Ext.data.Store', {
            model:'App.model.poolarea.PoolDropAreas',
            proxy    : {
                type       : 'direct',
                api        : {
                    read: PoolArea.getPoolAreaPatients
                },
                extraParams:{
                    area_id:4
                }
            }
        });

        me.pageBody = Ext.create('Ext.panel.Panel', {
            defaults:{
                flex:1,
                margin:5,
                frame:false
            },
            layout:{
                type:'hbox',
                align:'stretch'
            },
            items:[
                {
                    xtype:'grid',
                    title:'Check In',
                    action:'checkIn',
                    store:me.checkInStore,
                    columns:[
                        {
                            header:'Record #',
                            width:100,
                            dataIndex:'pid'
                        },
                        {
                            header:'Patien Name',
                            flex:1,
                            dataIndex:'name'
                        }
                    ],
                    viewConfig:{
                        loadMask:false,
                        plugins:{
                            ptype:'gridviewdragdrop',
                            dragGroup:'patientPoolAreas',
                            dropGroup:'patientPoolAreas'
                        },
                        listeners:{
                            drop:me.onPatientDrop
                        }
                    }
                },
                {
                    xtype:'grid',
                    title:'Triage',
                    action:'triage',
                    store:me.triageStore,
                    columns:[
                        {
                            header:'Record #',
                            width:100,
                            dataIndex:'pid'
                        },
                        {
                            header:'Patien Name',
                            flex:1,
                            dataIndex:'name'
                        }
                    ],
                    viewConfig:{
                        loadMask:false,
                        plugins:{
                            ptype:'gridviewdragdrop',
                            dragGroup:'patientPoolAreas',
                            dropGroup:'patientPoolAreas'
                        },
                        listeners:{
                            drop:me.onPatientDrop
                        }
                    }
                },
                {
                    xtype:'grid',
                    title:'Physician',
                    action:'physician',
                    store:me.physicianStore,
                    columns:[
                        {
                            header:'Record #',
                            width:100,
                            dataIndex:'pid'
                        },
                        {
                            header:'Patien Name',
                            flex:1,
                            dataIndex:'name'
                        }
                    ],
                    viewConfig:{
                        loadMask:false,
                        plugins:{
                            ptype:'gridviewdragdrop',
                            dragGroup:'patientPoolAreas',
                            dropGroup:'patientPoolAreas'
                        },
                        listeners:{
                            drop:me.onPatientDrop
                        }
                    }
                },
                {
                    xtype:'grid',
                    title:'Checkout',
                    action:'checkout',
                    store:me.ckoutStore,
                    columns:[
                        {
                            header:'Record #',
                            width:100,
                            dataIndex:'pid'
                        },
                        {
                            header:'Patien Name',
                            flex:1,
                            dataIndex:'name'
                        }
                    ],
                    viewConfig:{
                        loadMask:false,
                        plugins:{
                            ptype:'gridviewdragdrop',
                            dragGroup:'patientPoolAreas',
                            dropGroup:'patientPoolAreas'
                        },
                        listeners:{
                            drop:me.onPatientDrop
                        }
                    }
                }
            ]
        });

        me.callParent(arguments);
    },

    onPatientDrop:function (node, data, dropRec, dropPosition) {
        var pname = (data.records[0].data) ? data.records[0].data.name : data.records[0].name;
        app.msg('Sweet!', pname + ' sent to ' + this.panel.title);

        say(data.records[0].data);
    },

    onActive:function(callback){
        this.checkInStore.load();
        this.triageStore.load();
        this.physicianStore.load();
        this.ckoutStore.load();
        callback(true);
    }

});