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
Ext.define('App.view.fees.FeesSheet', {
    extend:'App.classes.RenderPanel',
    id:'panelFeesSheet',
    pageTitle:'Fees Sheet',
    uses:['App.classes.GridPanel'],

    initComponent:function () {
        var page = this;

        page.panel = Ext.create('Ext.form.Panel', {

            bodyStyle:'padding:15px',
            title:'Fees Sheet',
            items:[
                {
                    xtype:'datefield',
                    fieldLabel:'Date'
                },
                {
                    xtype:'datefield',
                    fieldLabel:'End date'
                }
            ]
        });

        page.entity = Ext.create('Ext.data.Store', {
            fields:['ident', 'type'],
            data:[
                {"abbr":"PATIENT", "name":"Patient"},
                {"abbr":"INSURANCE", "name":"Insurance"}
            ]
        });

        page.payment_category = Ext.create('Ext.data.Store', {
            fields:['ident', 'type'],
            data:[
                {"abbr":"PATIENT_PAY", "name":"Patient Payment"},
                {"abbr":"INSURANCE_PAY", "name":"Insurance Payment"},
                {"abbr":"GROUP_PAY", "name":"Group Payment"},
                {"abbr":"FAMILY_PAY", "name":"Family Payment"},
                {"abbr":"PRE_PAY", "name":"Pre Payment"}
            ]
        });

        page.centerPanel = Ext.create('Ext.tab.Panel', {

            items:[

                {
                    title:'Payment Entry',
                    plain:true,
                    activeItem:0,
                    defaults:{
                        bodyStyle:'padding:15px',
                        bodyBorder:true,
                        layout:'fit',
                        labelWidth:110
                    },

                    items:[
                        {
                            xtype:'form',
                            title:'Payment Entry',
                            defaults:{ labelWidth:110 },
                            items:[
                                {
                                    xtype:'fieldset',
                                    title:'Payment Live Search',
                                    height: 60,
                                    layout:'anchor',
                                    items:{ xtype:'liveicdxsearch' }

                                },
                                {
                                    xtype:'container',
                                    layout: {
                                        type   : 'hbox',
                                        align  : 'stretch'
                                    },
                                    height:220,
                                    defaults:{ flex:1 },
                                    items:[
                                        {

                                            xtype:'fieldset',
                                            title:'Payment Information',
                                            layout:'anchor',
                                            margin:'5 5 5 0',
                                            defaults: { labelWidth:110 },
                                            items:[
                                                {
                                                    fieldLabel: 'Payment Method',
                                                    xtype     : 'mitos.paymentmethodcombo',
                                                    name      : 'paymentmethod'
                                                }, {
                                                    xtype:'numberfield',
                                                    fieldLabel:'Payment Amount',
                                                    minvalue:0
                                                }, {
                                                    fieldLabel: 'Payment Entity',
                                                    xtype     : 'mitos.paymentmethodcombo',
                                                    name      : 'paymentmethod'
                                                }, {
                                                    fieldLabel: 'Payment Category',
                                                    xtype     : 'mitos.paymentmethodcombo',
                                                    name      : 'paymentmethod'
                                                }
                                            ]

                                        },
                                        {
                                            xtype:'fieldset',
                                            title:'Check Information',
                                            layout:'anchor',
                                            margin:'5 0 5 0',
                                            items:[
                                                {
                                                    xtype:'datefield',
                                                    fieldLabel:'Check Date'
                                                },
                                                {
                                                    xtype:'datefield',
                                                    fieldLabel:'Posting Date'
                                                },
                                                {
                                                    xtype:'textfield',
                                                    fieldLabel:'Check Number'
                                                }
                                            ]
                                        }
                                    ]

                                },

                                {
                                    xtype:'fieldset',
                                    title:'Description',
                                    margin:'0 0 15 0',
                                    height: 188,
                                    items:[
                                        {

                                            xtype:'fieldcontainer',
                                            defaults:{ labelWidth:110 },
                                            items:[
                                                {
                                                    xtype:'textfield',
                                                    fieldLabel:'Payment From'
                                                },
                                                {
                                                    xtype:'datefield',
                                                    fieldLabel:'Deposit Date'
                                                },
                                                {
                                                    xtype:'numberfield',
                                                    fieldLabel:'Remaining Amount',
                                                    minValue:0
                                                },
                                                {
                                                    xtype:'textfield',
                                                    fieldLabel:'Notes',
                                                    height:50,
                                                    width: 300

                                                }
                                            ]
                                        }
                                    ]
                                }

                            ]

                        }
                    ]
                },

                {
                    title:'ERA Posting',
                    plain:true,
                    activeItem:0,
                    defaults:{
                        bodyStyle:'padding:15px',
                        bodyBorder:true,
                        layout:'fit'
                    },
                    items:[
                        {


                        }
                    ]
                }
            ],

            buttons:[
                {
                    text:'Save',
                    // action:'encounter',
                    scope:page
                    // handler:page.coSignEncounter
                },
                {
                    text:'Allocate',
                    //  action:'encounter',
                    scope:page
                    // handler:me.signEncounter
                },
                {
                    text:'Cancel'
                    //  handler:me.cancelCheckout

                }
            ]
        });

        page.pageBody = [page.centerPanel];
        page.callParent(arguments);

    }, // end of initComponent

    /**
     * This function is called from MitosAPP.js when
     * this panel is selected in the navigation panel.
     * place inside this function all the functions you want
     * to call every this panel becomes active
     */
    onActive:function (callback) {
        callback(true);
    }
}); //end oNotesPage class