//******************************************************************************
// new.ejs.php
// New payments Forms
// v0.0.1
// 
// Author: Ernest Rodriguez
// Modified: 
// 
// MitosEHR (Electronic Health Records) 2011
//******************************************************************************
Ext.define('App.view.fees.Payments', {
    extend:'App.classes.RenderPanel',
    id:'panelPayments',
    pageTitle:'Payments',
    pageLayout:'border',
    uses:['App.classes.GridPanel'],

    initComponent:function () {
        var me = this;

        me.encountersStore = Ext.create('App.store.fees.EncountersPayments');

        me.forms = Ext.create('Ext.container.Container',{
            layout: 'card',
            region: 'north',
            defaults:{ buttonAlign:'left'},
            items:[
                {
                    xtype: 'form',
                    height: 180,
                    defaults:{ height: 140, margin: 5 },
                    items:[
                        {
                            xtype: 'fieldset',
                            anchor: '100%',
                            style: 'background-color:#DFE8F6',
                            width: 1003,
                            items:[
                                {
                                    xtype: 'fieldcontainer',
                                    layout: 'hbox',
                                    items:[
                                        {
                                            fieldLabel: 'Paying Entity',
                                            xtype: 'mitos.payingentitycombo',
                                            width: 230
                                        },
                                        {
                                            xtype: 'patienlivetsearch',
                                            fieldLabel: 'From',
                                            hideLabel: false,
                                            itemId: 'patientFrom',
                                            name: 'from',
                                            anchor: null,
                                            labelWidth: 47,
                                            width: 470,
                                            margin: '0 0 0 25'
                                        },
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: 'No',
                                            name: 'transaction_number',
                                            labelWidth: 50,
                                            width: 230,
                                            labelAlign: 'right',
                                            margin: '0 0 0 25',
                                            fieldStyle: 'text-align: right;'
                                        }

                                    ]
                                },
                                {
                                    xtype: 'fieldcontainer',
                                    layout: 'hbox',
                                    items:[
                                        {
                                            fieldLabel: 'Payment Method',
                                            xtype: 'mitos.paymentmethodcombo',
                                            width:230
                                        },
                                        {
                                            xtype: 'mitos.billingfacilitiescombo',
                                            fieldLabel: 'Pay To',
                                            labelWidth: 47,
                                            width: 470,
                                            margin: '0 0 0 25'
                                        },
                                        {
                                            xtype: 'mitos.currency',
                                            fieldLabel: 'Amount',
                                            name: 'amount',
                                            labelWidth: 50,
                                            width: 230,
                                            labelAlign: 'right',
                                            margin: '0 0 0 25',
                                            enableKeyEvents: true
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldcontainer',
                                    layout: 'hbox',
                                    items:[
                                        {
                                            fieldLabel: 'From',
                                            xtype: 'datefield',
                                            width: 230
                                        },
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: 'Notes',
                                            labelWidth: 47,
                                            width: 725,
                                            margin: '0 0 0 25'
                                        }


                                    ]
                                },
                                {
                                    fieldLabel: 'To',
                                    xtype: 'datefield',
                                    width: 230
                                }
                            ]
                        }
                    ],
                    bbar:[
                        {
                            text:'Search'
                        },
                        '-',
                        {
                            text:'Reset'
                        }
                    ]
                },
                {
                    xtype:'form',
                    height:175,
                    buttonAlign:'left',
                    defaults:{ height:130, margin: 5 },
                    layout:'hbox',
                    items:[
                        {
                            xtype:'fieldset',
                            style:'background-color:#DFE8F6',
                            width:270,
                            items:[
                                {
                                    fieldLabel: 'Paying Entity',
                                    xtype     : 'mitos.payingentitycombo',
                                    width:230
                                },
                                {
                                    fieldLabel: 'Payment Method',
                                    xtype     : 'mitos.paymentmethodcombo',
                                    width:230
                                },
                                {
                                    fieldLabel: 'From',
                                    xtype     : 'datefield',
                                    width:230
                                },
                                {
                                    fieldLabel: 'To',
                                    xtype     : 'datefield',
                                    width:230
                                }

                            ]
                        },
                        {
                            xtype:'fieldset',
                            style:'background-color:#DFE8F6',
                            width:700,
                            margin: '5 5 5 0',
                            items:[
                                {
                                    xtype:'fieldcontainer',
                                    layout:'hbox',
                                    items:[
                                        {
                                            xtype:'patienlivetsearch',
                                            fieldLabel: 'From',
                                            hideLabel:false,
                                            itemId:'patientFrom',
                                            name:'from',
                                            anchor:null,
                                            labelWidth:80,
                                            width:470
                                        },
                                        {
                                            xtype:'textfield',
                                            fieldLabel: 'No.',
                                            name:'transaction_number',
                                            labelWidth:60,
                                            width:180,
                                            labelAlign:'right',
                                            fieldStyle:'text-align: right;'
                                        }
                                    ]
                                },
                                {
                                    xtype:'fieldcontainer',
                                    layout:'hbox',
                                    items:[
                                        {
                                            xtype:'mitos.billingfacilitiescombo',
                                            fieldLabel: 'Pay To',
                                            labelWidth:80,
                                            width:470
                                        },
                                        {
                                            xtype:'mitos.currency',
                                            fieldLabel: 'Amount',
                                            name:'amount',
                                            labelWidth:60,
                                            width:180,
                                            labelAlign:'right',
                                            enableKeyEvents:true
                                        }
                                    ]
                                },
                                {
                                    xtype:'textfield',
                                    fieldLabel: 'Notes',
                                    labelWidth:80,
                                    width:660
                                }
                            ]
                        }
                    ],
                    bbar:[
                        {
                            text:'Save'
                        },
                        '-',
                        {
                            text:'Cancel'
                        }
                    ]
                }
            ]

        });

        me.grid = Ext.create('Ext.grid.Panel', {
            region:'center',
            store:me.encountersStore,
            columns:[
                {
                    header:'Service Date'
                },
                {
                    header:'Patient Name'
                },
                {
                    header:'Insurance'
                },
                {
                    header:'Billing Notes',
                    flex:1
                },
                {
                    header:'Balance Due'
                }
            ]
        });

        me.window =  Ext.create('Ext.window.Window',{
            closeAction:'hide',
            height:300,
            width:700,
            modal:true,
            items:[
                {
                    xtype:'form',
                    height:175,
                    defaults:{ height:130, margin: 5 },
                    layout:'hbox',
                    items:[
                        {
                            xtype:'fieldset',
                            style:'background-color:#DFE8F6',
                            width:270,
                            items:[
                                {
                                    fieldLabel: 'Paying Entity',
                                    xtype     : 'mitos.payingentitycombo',
                                    width:230
                                },
                                {
                                    fieldLabel: 'Payment Method',
                                    xtype     : 'mitos.paymentmethodcombo',
                                    width:230
                                },
                                {
                                    fieldLabel: 'From',
                                    xtype     : 'datefield',
                                    width:230
                                },
                                {
                                    fieldLabel: 'To',
                                    xtype     : 'datefield',
                                    width:230
                                }

                            ]
                        },
                        {
                            xtype:'fieldset',
                            style:'background-color:#DFE8F6',
                            width:700,
                            margin: '5 5 5 0',
                            items:[
                                {
                                    xtype:'fieldcontainer',
                                    layout:'hbox',
                                    items:[
                                        {
                                            xtype:'patienlivetsearch',
                                            fieldLabel: 'From',
                                            hideLabel:false,
                                            itemId:'patientFrom',
                                            name:'from',
                                            anchor:null,
                                            labelWidth:80,
                                            width:470
                                        },
                                        {
                                            xtype:'textfield',
                                            fieldLabel: 'No.',
                                            name:'transaction_number',
                                            labelWidth:60,
                                            width:180,
                                            labelAlign:'right',
                                            fieldStyle:'text-align: right;'
                                        }
                                    ]
                                },
                                {
                                    xtype:'fieldcontainer',
                                    layout:'hbox',
                                    items:[
                                        {
                                            xtype:'mitos.billingfacilitiescombo',
                                            fieldLabel: 'Pay To',
                                            labelWidth:80,
                                            width:470
                                        },
                                        {
                                            xtype:'mitos.currency',
                                            fieldLabel: 'Amount',
                                            name:'amount',
                                            labelWidth:60,
                                            width:180,
                                            labelAlign:'right',
                                            enableKeyEvents:true
                                        }
                                    ]
                                },
                                {
                                    xtype:'textfield',
                                    fieldLabel: 'Notes',
                                    labelWidth:80,
                                    width:660
                                }
                            ]
                        }
                    ]
                }
            ],
            bbar:[
                {
                    text:'Search'
                },
                '-',
                {
                    text:'Reset'
                }
            ]
        });

        me.listeners = {
            scope:me,
            beforerender:function(){
                me.getPageBody().addDocked({
                    xtype:'toolbar',
                    items:[
                        {
                            text:'Payment Search',
                            action:'search',
                            enableToggle:true,
                            toggleGroup:'payment',
                            scope:me,
                            handler:me.onBtnClick
                        },
                        '-',
                        {
                            text:'Payment Details',
                            action:'details',
                            enableToggle:true,
                            toggleGroup:'payment',
                            scope:me,
                            handler:me.onBtnClick
                        },
                        '->',
                        {
                            text:'Add Payment',
                            action:'new',
                            scope:me,
                            handler:me.onBtnClick
                        }
                    ]
                });

            }
        };

        me.pageBody = [ me.forms, me.grid ];
        me.callParent(arguments);
    },


    onBtnClick:function(btn){
        var me = this;

        if(btn.action == 'search'){
            me.forms.getLayout().setActiveItem(0);
        }else if(btn.action == 'details'){
            me.forms.getLayout().setActiveItem(1);
        }else if(btn.action == 'new'){
            me.window.show();
        }

    },

    /**
     * This function is called from MitosAPP.js when
     * this panel is selected in the navigation panel.
     * place inside this function all the functions you want
     * to call every this panel becomes active
     */
    onActive:function (callback) {
        this.encountersStore.load();
        callback(true);
    }

}); //end Payments class

