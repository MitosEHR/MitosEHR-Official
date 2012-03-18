/**
 * Created by JetBrains PhpStorm.
 * User: ernesto
 * Date: 3/16/12
 * Time: 9:09 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('App.view.PatientPoolDropZone',{
    extend:'App.classes.RenderPanel',
    pageTitle:'Patient Pool Areas',
    pageLayout:'fit',
    initComponent:function(){
        var me = this;

        me.foStore = Ext.create('Ext.data.Store',{
            model: 'App.model.poolarea.PoolDropAreas'
        });

        me.triageStore = Ext.create('Ext.data.Store',{
            model: 'App.model.poolarea.PoolDropAreas'
        });

        me.physicianStore = Ext.create('Ext.data.Store',{
            model: 'App.model.poolarea.PoolDropAreas'
        });

        me.ckoutStore = Ext.create('Ext.data.Store',{
            model: 'App.model.poolarea.PoolDropAreas'
        });

        me.container = Ext.create('Ext.panel.Panel',{
            defaults : { flex:1, margin:5, frame:false  },
            layout   : { type:'hbox', align:'stretch' },
            items:[
                {
                    xtype:'grid',
                    title:'Front Office',
                    action:'front',
                    store:me.foStore,
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
                    viewConfig : {
                        plugins  : {
                            ptype    : 'gridviewdragdrop',
                            dragGroup: 'patientPoolAreas',
                            dropGroup: 'patientPoolAreas'
                        },
                        listeners: {
                            drop: function(node, data, dropRec, dropPosition) {
                                var pname = (data.records[0].data) ? data.records[0].data.name : data.records[0].name;
                                me.msg('Sweet!', pname + ' sent to ' + this.panel.title);
                            }
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
                    viewConfig : {
                        plugins  : {
                            ptype    : 'gridviewdragdrop',
                            dragGroup: 'patientPoolAreas',
                            dropGroup: 'patientPoolAreas'
                        },
                        listeners: {
                            drop: function(node, data, dropRec, dropPosition) {
                                var pname = (data.records[0].data) ? data.records[0].data.name : data.records[0].name;
                                me.msg('Sweet!', pname + ' sent to ' + this.panel.title);
                            }
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
                    viewConfig : {
                        plugins  : {
                            ptype    : 'gridviewdragdrop',
                            dragGroup: 'patientPoolAreas',
                            dropGroup: 'patientPoolAreas'
                        },
                        listeners: {
                            drop: function(node, data, dropRec, dropPosition) {
                                var pname = (data.records[0].data) ? data.records[0].data.name : data.records[0].name;
                                me.msg('Sweet!', pname + ' sent to ' + this.panel.title);
                            }
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
                    viewConfig : {
                        plugins  : {
                            ptype    : 'gridviewdragdrop',
                            dragGroup: 'patientPoolAreas',
                            dropGroup: 'patientPoolAreas'
                        },
                        listeners: {
                            drop: function(node, data, dropRec, dropPosition) {
                                var pname = (data.records[0].data) ? data.records[0].data.name : data.records[0].name;
                                me.msg('Sweet!', pname + ' sent to ' + this.panel.title);
                            }
                        }
                    }
                }
            ]
        });

        me.pageBody = [ me.container ];

        me.callParent(arguments);

    },

    initializePatientDropZone: function(panel) {

        panel.dropZone = Ext.create('Ext.dd.DropZone', panel.getEl(), {
            ddGroup   : 'patientPoolAreas',
            notifyOver: function() {
                return Ext.dd.DropZone.prototype.dropAllowed;
            },
            notifyDrop: function(dd, e, data) {
                if(panel.action == 'front'){
                    app.msg('Sweet!', data.patientData.name + ' Sent to Front Office');
                }else if(panel.action == 'triage'){
                    app.msg('Sweet!', data.patientData.name + ' Sent to Triage');
                }else if(panel.action == 'physician'){
                    app.msg('Sweet!', data.patientData.name + ' Sent to Physician');
                }else if(panel.action == 'checkout'){
                    app.msg('Sweet!', data.patientData.name + ' Sent to Checkout');
                }

                app.patientUnset();
                app.navigateToDefault();
//                say(panel.action);
//                say(dd);
//                say(e);
//                say(data);

            }
        });
    }




});