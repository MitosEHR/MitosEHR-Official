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
                    height: 410,
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
                                    text:'Save',
                                    scope:me,
                                    handler: me.onSave
                                },
                                '-',
		                        {
			                        text:'Reset',
                                    scope:me,
			                        handler:me.resetReceiptForm
		                        },
                                '->',
                                {
                                    text:'Add Payment',
                                    scope: me,
                                    handler:me.onAddPaymentClick
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
                    defaults: { height:185 },
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
                                    fieldLabel: 'Note',
                                    action: 'notes'
                                },
                                {
                                    xtype     : 'textareafield',
                                    grow      : true,
                                    fieldLabel: 'Alert',
                                    action: 'notes'
                                }
                            ],
	                        buttons:[
                                {
                                    text:'Save',
                                    scope:me,
                                    handler: me.onSave
                                },
                                '-',
                                {
                                    text:'Reset',
                                    scope:me,
                                    handler:me.resetNotes
                                },
                                '->'
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
                                    text:'Schedule Appointment'
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

	resetReceiptForm:function () {
        var fields = this.query('[action="receipt"]');
        Ext.each(fields, function(field){
            field.reset();
        });
    },

    resetNotes:function () {
        var fields = this.query('[action="notes"]');
   	    Ext.each(fields, function(field){
   			field.reset();
   	    });
    },

    onAddPaymentClick:function() {
        app.onPaymentEntryWindow();
    },

    /**
     * This function is called from MitosAPP.js when
     * this panel is selected in the navigation panel.
     * place inside this function all the functions you want
     * to call every this panel becomes active
     */

    onActive:function (callback) {

        callback(true);
    },

    //////
    onSave: function() {
        var me = this, panel, form, values, date;

        panel = me.down('form');
        form = panel.getForm();

        say(form);
        values = form.getFieldValues();

        values.date_created = Ext.Date.format(new Date(), 'Y-m-d H:i:s');

        if(form.isValid()) {

            Fees.addPayment(values, function(provider, response){
                if(response.result.success){
                    form.reset();
                    me.hide();
                }else{
                    app.msg('Oops!','Payment entry error')
                }

            });
        }
    }

}); //end Checkout class
