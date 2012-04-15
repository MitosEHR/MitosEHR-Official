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
	pageTitle    : 'Visit Checkout',
	uses         : ['App.classes.GridPanel'],

    initComponent:function () {
        var me = this;
        var paymentDescription = Ext.create('Ext.data.Store', {
            fields: ['name'],
            data : [
                { "name":"General Visit" },
                { "name":"Special Visit" },
                { "name":"Other" }
            ]
        });

        me.pageBody = Ext.create('Ext.panel.Panel', {
            itemId:'visitpayment',
            defaults:{
                bodyStyle : 'padding:15px',
                bodyBorder: true,
                labelWidth: 110
            },
            items:[
                {
                    xtype :'container',
                    layout:{
                        type : 'hbox',
                        align: 'stretch'
                    },
                    height: 400,
                    items:[
                        {
                            xtype : 'form',
	                        title:'Co-Pay / Payment',
	                        border:true,
	                        frame:true,
	                        bodyPadding:10,
	                        bodyBorder: true,
	                        bodyStyle:'background-color:#fff',
                            margin: 5,
                            flex  : 2,
                            items: [
	                            {
	                                xtype:'container',
                                    items:[
                                        {
                                            fieldLabel: 'Date',
                                            xtype     : 'datefield',
                                            style     : 'float:left',
	                                        action: 'receipt',
                                            labelWidth: 108,
                                            width     : 288
                                        },
	                                    {
	                                        fieldLabel: 'No',
	                                        xtype     : 'textfield',
                                            style     : 'float:right',
		                                    action: 'receipt',
	                                        labelWidth: 60,
	                                        width     : 240
	                                    }

                                    ]
	                            },
                                {
                                    fieldLabel: 'Facility',
                                    xtype     : 'mitos.facilitiescombo',
                                    labelWidth: 108,
                                    width     : 288,
	                                action: 'receipt',
                                    margin    : '7 0 40 0'
                                },
                                {
                                    xtype :'fieldcontainer',
                                    layout:'hbox',
                                    items:[
                                        {
                                            fieldLabel: 'Received From',
                                            xtype     : 'textfield',
                                            labelWidth: 108,
                                            margin      : '0 25 0 0',
                                            anchor    : '100%',
	                                        action: 'receipt',
                                            flex      : 1
                                        },
                                        {
                                            fieldLabel: 'Amount',
                                            xtype     : 'mitos.currency',
	                                        action: 'receipt',
                                            labelWidth: 60
                                        }

                                    ]
                                },
                                {
                                    xtype:'container',
                                    layout:'hbox',
                                    items:[
                                        {
                                            fieldLabel  : 'For Payment of',
                                            xtype       : 'combobox',
                                            labelWidth  : 108,
                                            margin      : '0 25 10 0',
                                            anchor      : '100%',
                                            flex        : 1,
	                                        action: 'receipt',
                                            store       : paymentDescription,
                                            queryMode   : 'local',
                                            displayField: 'name'
                                        },

                                        {
                                            fieldLabel: 'Paid by',
	                                        action: 'receipt',
                                            xtype     : 'mitos.paymentmethodcombo',
                                            labelWidth: 60
                                        }
                                    ]
                                },
                                {
                                    fieldLabel: 'Description',
                                    xtype     : 'textfield',
                                    labelWidth: 108,
	                                action: 'receipt',
                                    anchor    : '100%'
                                },
                                {
                                    xtype:'container',
                                    style      : 'float:right',
                                    items:[
                                        {
                                            fieldLabel: 'Accounted Amount',
                                            xtype     : 'textfield',
                                            labelWidth: 108,
                                            width     : 288,
	                                        action: 'receipt',
                                            margin    : '40 0 5 0'
                                        },
                                        {
                                            fieldLabel: 'Payment Amount',
                                            xtype     : 'textfield',
                                            labelWidth: 108,
                                            width     : 288,
	                                        action: 'receipt',
                                            margin    : '10 0 10 0'
                                        },
                                        {
                                            fieldLabel: 'Balance Due',
                                            xtype     : 'textfield',
	                                        action: 'receipt',
                                            labelWidth: 108,
                                            width     : 288
                                        }
                                    ]
                                }
                            ],
	                        buttons:[
		                        {
			                        text:'Reset',
			                        handler:me.resetReceipForm
		                        }
	                        ]
                        },
                        {
                            xtype  : 'grid',
                            title  : 'Orders',
	                        frame:true,
                            margin : '5 5 5 0',
                            flex   : 1,
                            columns:[
                                {
                                    header:'Code'
                                },
                                {
                                    header: 'Description',
                                    flex  : 1
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype:'container',
                    layout:'hbox',
                    items:[
                        {
                            xtype: 'form',
                            title: 'Notes and Alerts',
	                        frame:true,
	                        flex:2,
	                        bodyPadding:10,
	                        margin:'0 5 5 5',
                            bodyBorder: true,
                            bodyStyle:'background-color:#fff',
                            defaults: { anchor:'100%'},
                            items:[
                                {
                                    xtype     : 'textfield',
                                    name      : 'note',
                                    fieldLabel: 'Note'
                                },
                                {
                                    xtype     : 'textareafield',
                                    grow      : true,
                                    name      : 'reminder',
                                    fieldLabel: 'Alert'
                                }
                            ],
	                        buttons:[
                                {
                                    text:'Reset',
                                    handler:me.resetReceipForm
                                }
                            ]
                        },
                        {
                            xtype:'form',
                            title:'Follow-Up Information',
	                        frame:true,
	                        flex:1,
	                        margin:'0 5 5 0',
	                        bodyPadding:10,
                            bodyBorder: true,
                            bodyStyle:'background-color:#fff',
                            defaults:{
                                labelWidth:110,
                                anchor:'100%'
                            },
                            items:[
                                {
                                    fieldLabel: 'Time',
                                    xtype     : 'textfield'
                                },
                                {
                                    fieldLabel: 'Facility',
                                    xtype     : 'mitos.facilitiescombo'
                                }
                            ],
	                        buttons:[
                                {
                                    text:'Reset',
                                    handler:me.resetReceipForm
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        me.printWindow = Ext.create('Ext.window.Window', {

            title      : 'Printing Options',
            closeAction: 'hide',
            closable   : false,
            modal      : true,
            items:[
                {
                    xtype   :'form',
                    height  : 200,
                    width   : 300,
                    defaults: { margin:5 },
                    columnWidth:.5,
                    border  : false,
                    items:[
 	                    {
                            xtype   :'checkboxgroup',
                            width   : 200,
                            height  : 40,
                            defaults:{
                                xtype:'checkboxfield'
                            },
                            items:[
                                {
                                    boxLabel: 'Receipt'
                                },
                                {
                                    boxLabel: 'Orders'
                                }
                            ]
 	                    }
 	                ],
 	                buttons:[
                        '->',
 	                    {
 	                        text:'Print'
                        },
 	                    '-',
 	                    {
 	                        text:'Cancel',
                            scope:me,
                            handler:me.cancelPrint
 	                    }
 	                ]
 	            }
            ]
        });

        me.callParent(arguments);
    },

    onPrintClick:function () {
        this.printWindow.show();
    },

    cancelPrint:function (btn) {
        var win = btn.up('window');
        win.close();
    },

	resetReceipForm:function () {
        var fields = this.query('[action="receipt"]');
	    Ext.each(fields, function(field){
			field.reset();
	    });
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
