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

        me.pageBody = Ext.create('Ext.form.Panel', {
            title:'Physician Assessment',
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
                    height:340,
                    margin:'0 0 5 0',
                    defaults:{ flex:1 },
                    items:[
                        {
                            xtype:'container',
                            items:[
                                {
                                    xtype:'fieldset',
                                    title:'Follow-Up Information',
                                    margin:'5 10 10 5',
                                    height:162,
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
                                    title:'Notes and Reminders',
                                    margin:'0 10 5 5',
                                    height:162,
                                    items:[
                                        {
                                            xtype:'textfield',
                                            name:'note',
                                            fieldLabel:'Note',
                                            anchor:'100%'
                                        },
                                        {
                                            xtype:'textareafield',
                                            grow:true,
                                            name:'reminder',
                                            fieldLabel:'Reminder',
                                            anchor:'100%'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype:'grid',
                            title:'Orders',
                            margin:'4 4 0 0',
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
                    layout: {
                        type   : 'hbox',
                        align  : 'stretch'
                    },
                    height:200,
                    defaults:{ flex:1 },
                    items:[
                        {
                            xtype:'fieldset',
                            title:'Transaction Information',
                            margin:'5 20 0 5',
                            defaults: { labelWidth:110 },
                            items:[
                                {
                                    fieldLabel: 'Patient Name',
                                    xtype     : 'textfield'
                                },
                                {
                                    fieldLabel: 'Encounter #',
                                    xtype     : 'textfield'
                                },
                                {
                                    fieldLabel: 'Facility',
                                    xtype     : 'mitos.facilitiescombo'
                                },
                                {
                                    fieldLabel: 'Transaction #',
                                    xtype     : 'textfield'
                                },
                                {
                                    fieldLabel: 'Transaction Date',
                                    xtype     : 'datefield'
                                }
                            ]

                        },
                        {
                            xtype:'fieldset',
                            title:'Payment Information',
                            margin:'5 5 0 0',
                            items:[
                                {
                                    xtype:'mitos.currency',
                                    fieldLabel:'Payment Amount'
                                },
                                {
                                    fieldLabel: 'Paying Entity',
                                    xtype     : 'mitos.payingentitycombo',
                                    name      : 'paymentmethod'
                                },
                                {
                                    xtype:'datefield',
                                    fieldLabel:'Post To Date'
                                },
                                {
                                    xtype:'textfield',
                                    fieldLabel:'Check Number'
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

        Ext.Msg.show({
            title:'Error',
            msg:'You Currently dont have an <strong>Encounter</strong>',
            icon:Ext.MessageBox.ERROR,
            buttons:Ext.Msg.OK,
            scope:this,
            fn:function () {
                callback(true);
            }
        })
    }

}); //end Checkout class
