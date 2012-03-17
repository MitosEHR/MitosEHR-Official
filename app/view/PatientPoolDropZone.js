/**
 * Created by JetBrains PhpStorm.
 * User: ernesto
 * Date: 3/16/12
 * Time: 9:09 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('App.view.PatientPoolDropZone',{
    extend:'App.classes.RenderPanel',
    pageTitle:'Patient Drop Zone',
    pageLayout:'fit',
    initComponent:function(){
        var me = this;

        me.container = Ext.create('Ext.panel.Panel',{
            defaults : { flex:1, margin:5, frame:true  },
            layout   : { type:'hbox', align:'stretch' },
            items:[
                {
                    xtype:'panel',
                    title:'Front Office',
                    action:'front',
                    listeners: {
                        scope:me,
                        afterrender:me.initializePatientDropZone
                    }
                },
                {
                    xtype:'panel',
                    title:'Triage',
                    action:'triage',
                    listeners: {
                        scope:me,
                        afterrender:me.initializePatientDropZone
                    }
                },
                {
                    xtype:'panel',
                    title:'Physician',
                    action:'physician',
                    listeners: {
                        scope:me,
                        afterrender:me.initializePatientDropZone
                    }
                },
                {
                    xtype:'panel',
                    title:'Checkout',
                    action:'checkout',
                    listeners: {
                        scope:me,
                        afterrender:me.initializePatientDropZone
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