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
Ext.define('App.view.fees.Checkout', {
	extend       : 'App.classes.RenderPanel',
	id           : 'panelCheckout',
	pageTitle    : 'Checkout',
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
            title:'Charge Patient',
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
                            title:'Payment Receipt',
                            margin:'5 5 5 5',
                            flex:2,
                            defaults: { labelWidth:110 },
                            items:[
                                {
                                    xtype:'container',
                                    layout:'absolute',
                                    items: [
                                        {
                                            fieldLabel: 'Facility',
                                            xtype     : 'mitos.facilitiescombo',
                                            labelWidth:60
                                        },
                                        {
                                            fieldLabel: 'Date',
                                            xtype     : 'datefield',
                                            labelWidth:60,
                                            x: 280
                                        },
                                        {
                                            fieldLabel: 'No', //Encounter Number
                                            xtype     : 'displayfield',
                                            labelWidth:60,
                                            x:555
                                        },
                                        {
                                            xtype:'textfield',
                                            fieldLabel:'Received From',
                                            labelWidth:110,
                                            anchor:'65%',
                                            y:40
                                        },
                                        {
                                            xtype:'mitos.currency',
                                            fieldLabel:'Amount',
                                            labelWidth:60,
                                            x:516,
                                            y:40

                                        },
                                        {
                                            xtype:'combobox',
                                            fieldLabel:'For Payment of',
                                            labelWidth:110,
                                            anchor:'65%',
                                            store:paymentDescription,
                                            queryMode: 'local',
                                            displayField: 'name',
                                            y:80
                                        },
                                        {
                                            fieldLabel: 'Paid by',
                                            xtype     : 'mitos.paymentmethodcombo',
                                            labelWidth:60,
                                            x:516,
                                            y:80
                                        },
                                        {
                                            xtype:'textfield',
                                            fieldLabel:'Description',
                                            labelWidth:110,
                                            anchor:'100%',
                                            y:120
                                        },
                                        {
                                            xtype:'displayfield',
                                            fieldLabel:'Next Appointment',
                                            labelWidth:110,
                                            y:160
                                        },
                                        {
                                            xtype:'container',
                                            y:220,
                                            layout: {
                                                   type: 'table',
                                                   columns: 1,
                                                   rows: 6
                                            },
                                            items: [
                                                {
                                                    xtype: 'label',
                                                    text: 'Accounted Amount',
                                                    rowspan:2,
                                                    colspan:1
                                                },
                                                {
                                                    xtype: 'label',
                                                    text: '$',
                                                    rowspan:2,
                                                    colspan:1
                                                },
                                                {
                                                    xtype:'label',
                                                    text:'Payment Amount',
                                                    rowspan:2,
                                                    colspan:1
                                                },
                                                {
                                                    xtype:'label',
                                                    text:'$'
                                                },
                                                {
                                                    xtype:'label',
                                                    text:'Balance Due'
                                                },
                                                {
                                                    xtype:'label',
                                                    text:'$'
                                                }
                                            ]
                                        }
                                    ]
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
            ],
            bbar:[
                '->',
                {
                    itemId:'move-next',
                    text:'Next',
                    handler:function () {
                        app.navigateTo('panelPayments');
                    }
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
