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

        page.panel = Ext.create('Ext.tab.Panel', {

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
                                    height:190,
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
                                                    xtype:'mitos.currency',
                                                    fieldLabel:'Payment Amount'
                                                }, {
                                                    fieldLabel: 'Paying Entity',
                                                    xtype     : 'mitos.payingentitycombo',
                                                    name      : 'paymentmethod'
                                                }, {
                                                    fieldLabel: 'Payment Category',
                                                    xtype     : 'mitos.paymentcategorycombo',
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
                                                    fieldLabel:'Post To Date'
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
                                                    xtype:'textfield',
                                                    fieldLabel:'Patient Id'
                                                },
                                                {
                                                    xtype:'datefield',
                                                    fieldLabel:'Deposit Date'
                                                },
                                                {
                                                    xtype:'mitos.currency',
                                                    fieldLabel:'Remaining Amount'
                                                },
                                                {
                                                    xtype:'textfield',
                                                    fieldLabel:'Notes',
                                                    height:50,
                                                    width: 550

                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]/*,
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
                    ]*/
                },

                {
                    xtype:'form',
                    title:'ERA Posting',
                    defaults:{ labelWidth:110 },

                    items:[
                            {
                                xtype:'datefield',
                                fieldLabel:'Date'
                            },
                            {
                                xtype:'datefield',
                                fieldLabel:'Post To Date'
                            },
                            {
                                xtype:'datefield',
                                fieldLabel:'Deposit Date'
                            },
                            {
                                xtype:'textfield',
                                fieldLabel:'Insurance Company'
                            },
                            {
                                xtype:'textfield',
                                fieldLabel:'Patient Id'
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

        page.pageBody = [page.panel];
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