//******************************************************************************
// new.ejs.php
// New Patient Entry Form
// v0.0.1
// 
// Author: Ernest Rodriguez
// Modified: GI Technologies, 2011
// 
// MitosEHR (Electronic Health Records) 2011
//******************************************************************************
Ext.define('App.view.patientfile.VisitPayment', {
	extend       : 'App.classes.RenderPanel',
	id           : 'panelVisitPayment',
	pageTitle    : 'Visit Payment / Co-Pay',
	uses         : ['App.classes.GridPanel'],

    initComponent:function () {
        var me = this;
        var paymentDescription = Ext.create('Ext.data.Store', {
            fields: ['name'],
            data : [
                { "name":"General Visit" },
                { "name":"Special Visit" },
                { "name":"Other" }
                //...
            ]
        });

        me.pageBody = Ext.create('Ext.form.Panel', {
            title:'Visit Payment',
            defaults:{
                bodyStyle:'padding:15px',
                bodyBorder:true,
                labelWidth:110
            },
            items:[
                {
                    xtype:'container',
                    layout:{
                        type:'hbox',
                        align:'stretch'
                    },
                    height:360,
                    items:[
                        {
                            xtype:'fieldset',
                            style: 'background-color:#DFE8F6',
                            margin:5,
                            flex:2,
                            defaults: { labelWidth:110 },
                            items: [
                                {
                                    xtype:'container',
                                    layout:'hbox',
                                    margin:'0 0 20 0',
                                    items:[
                                        /*{
                                            fieldLabel: 'Facility',
                                            xtype     : 'mitos.facilitiescombo',
                                            labelWidth: 108
                                        },*/
                                        {
                                            fieldLabel: 'Date',
                                            xtype     : 'datefield',
                                            margin:'0 257 0 0',
                                            width:263,
                                            labelWidth: 108
                                        },
                                        {
                                            fieldLabel: 'No',
                                            xtype     : 'textfield',
                                            labelWidth: 60
                                        }
                                    ],
                                    bbar:[
                                        {
                                            text:'Save & Print'
                                        },
                                        '-',
                                        {
                                            text:'Cancel'
                                        }
                                    ]
                                },
                                {
                                    xtype:'container',
                                    layout:'hbox',
                                    items:[
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: 'Received From',
                                            margin:'0 25 0 0',
                                            labelWidth: 108,
                                            width:491
                                        },
                                        {
                                            xtype: 'mitos.currency',
                                            fieldLabel: 'Amount',
                                            labelWidth: 60
                                        }

                                    ]
                                },
                                {
                                    xtype:'container',
                                    layout:'hbox',
                                    items:[
                                        {
                                            xtype:'combobox',
                                            fieldLabel:'For Payment of',
                                            labelWidth:108,
                                            margin:'0 25 0 0',
                                            store:paymentDescription,
                                            queryMode: 'local',
                                            displayField: 'name',
                                            width:491
                                        },

                                        {
                                            fieldLabel: 'Paid by',
                                            xtype: 'mitos.paymentmethodcombo',
                                            labelWidth:60
                                        }
                                    ]
                                },
                                {
                                    xtype:'textfield',
                                    fieldLabel:'Description',
                                    labelWidth:108,
                                    anchor:'100%'
                                },
                                {
                                    xtype:'textfield',
                                    fieldLabel:'Next Appointment',
                                    labelWidth:108,
                                    margin:'50 0 0 0'
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Accounted Amount',
                                    labelWidth:108,
                                    margin:'20 0 5 0'
                                },
                                {
                                    xtype:'textfield',
                                    fieldLabel:'Payment Amount',
                                    labelWidth:108
                                },
                                {
                                    xtype:'textfield',
                                    fieldLabel:'Balance Due',
                                    labelWidth:108
                                }
                            ]
                        },
                        {
                            xtype:'grid',
                            title:'Orders',
                            margin:'8 4 5 5',
                            flex:1,
                            columns:[
                                {
                                    header:'Code'
                                },
                                {
                                    header:'Description',
                                    flex:1
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype:'container',
                    layout:'hbox',
                    defaults:{
                        height:125,
                        flex:1,
                        margin:'5 5 5 5'
                    },
                    items:[
                        {
                            xtype:'fieldset',
                            title:'Follow-Up Information',
                            defaults:{
                                labelWidth:110,
                                anchor:'100%'
                            },
                            items:[
                                {
                                    fieldLabel:'Time',
                                    xtype:'textfield'
                                },
                                {
                                    fieldLabel:'Facility',
                                    xtype:'mitos.facilitiescombo'
                                }
                            ]
                        },
                        {
                            xtype:'fieldset',
                            title:'Notes and Alerts',
                            defaults:{ anchor:'100%'},
                            items:[
                                {
                                    xtype:'textfield',
                                    name:'note',
                                    fieldLabel:'Note'
                                },
                                {
                                    xtype:'textareafield',
                                    grow:true,
                                    name:'reminder',
                                    fieldLabel:'Alert'
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    },

    /**
     * This function is called from MitosAPP.js when
     * this panel is selected in the navigation panel.
     * place inside this function all the functions you want
     * to call every this panel becomes active
     */

    onActive:function (callback) {

        callback(true);
    }

}); //end Checkout class
