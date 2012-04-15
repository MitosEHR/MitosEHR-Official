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
            ]
        });

        me.pageBody = Ext.create('Ext.form.Panel', {

            title:'Visit Payment',
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
                            xtype : 'fieldset',
                            itemId: 'receipt',
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
                                            labelWidth: 108,
                                            width     : 288
                                        },
	                                    {
	                                        fieldLabel: 'No',
	                                        xtype     : 'textfield',
                                            style     : 'float:right',
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
                                            flex      : 1
                                        },
                                        {
                                            fieldLabel: 'Amount',
                                            xtype     : 'mitos.currency',
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
                                            store       : paymentDescription,
                                            queryMode   : 'local',
                                            displayField: 'name'
                                        },

                                        {
                                            fieldLabel: 'Paid by',
                                            xtype     : 'mitos.paymentmethodcombo',
                                            labelWidth: 60
                                        }
                                    ]
                                },
                                {
                                    fieldLabel: 'Description',
                                    xtype     : 'textfield',
                                    labelWidth: 108,
                                    anchor    : '100%'
                                },
                                {
                                    xtype:'container',
                                    items:[
                                        {
                                            fieldLabel: 'Next Appointment',
                                            xtype     : 'textfield',
                                            style     : 'float:left',
                                            labelWidth: 108,
                                            width     : 288,
                                            margin    : '104 0 0 0'
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
                                                    margin    : '40 0 5 0'
                                                },
                                                {
                                                    fieldLabel: 'Payment Amount',
                                                    xtype     : 'textfield',
                                                    labelWidth: 108,
                                                    width     : 288,
                                                    margin    : '10 0 10 0'
                                                },
                                                {

                                                    fieldLabel: 'Balance Due',
                                                    xtype     : 'textfield',
                                                    labelWidth: 108,
                                                    width     : 288
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype  : 'grid',
                            title  : 'Orders',
                            margin : '8 4 5 5',
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
                                    fieldLabel: 'Time',
                                    xtype     : 'textfield'
                                },
                                {
                                    fieldLabel: 'Facility',
                                    xtype     : 'mitos.facilitiescombo'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            title: 'Notes and Alerts',
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
                            ]
                        }
                    ]
                }
            ],
            buttons:[
                {
                    text:'Save'
                },
                '-',
                {
                    text:'Cancel',
                    scope:me,
                    handler:me.cancelReceipt
                },
                '-',
                {
                    text:'Print',
                    scope:me,
                    handler:me.onPrintClick
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

    cancelReceipt:function (btn) {
        var win = btn.up('panel');
        win.pageBody.down('receipt').getForm().reset();
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
