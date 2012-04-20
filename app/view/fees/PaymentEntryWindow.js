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
Ext.define('App.view.patientfile.PaymentEntryWindow', {
    extend:'Ext.window.Window',
    title:'Add New Payment',
    closeAction:'hide',
    modal:true,

    initComponent:function () {

        var me = this;

        me.items = [
            {
                xtype:'form',
                defaults:{ margin:5 },
                border:false,
                height:129,
                width:533,
                items:[
                    {
                        xtype:'fieldcontainer',
                        layout:'hbox',
                        items:[
                            {
                                fieldLabel:'Paying Entity',
                                xtype:'mitos.payingentitycombo',
                                name:'paying_entity',
                                labelWidth:95,
                                width:215
                            },
                            {
                                xtype:'patienlivetsearch',
                                fieldLabel:'From',
                                name:'payer_id',
                                hideLabel:false,
                                anchor:null,
                                labelWidth:82,
                                width:282,
                                margin:'0 0 0 25'
                            }

                        ]
                    },
                    {
                        xtype:'fieldcontainer',
                        layout:'hbox',
                        items:[
                            {
                                fieldLabel:'Payment Method',
                                xtype:'mitos.paymentmethodcombo',
                                labelWidth:95,
                                name:'payment_method',
                                width:215
                            },
                            {
                                xtype:'mitos.billingfacilitiescombo',
                                fieldLabel:'Pay To',
                                labelWidth:82,
                                name:'pay_to',
                                width:282,
                                margin:'0 0 0 25'
                            }
                        ]
                    },
                    {
                        xtype:'fieldcontainer',
                        layout:'hbox',
                        items:[
                            {
                                xtype:'mitos.currency',
                                fieldLabel:'Amount',
                                name:'amount',
                                labelWidth:95,
                                width:215,
                                enableKeyEvents:true
                            },
                            {
                                fieldLabel:'Check Number',
                                xtype:'textfield',
                                name:'check_number',
                                width: 282,
                                labelWidth:82,
                                margin:'0 0 0 25'
                            }
                        ]
                    },
                    {
                        xtype:'fieldcontainer',
                        layout:'hbox',
                        items:[
                            {
                                fieldLabel:'Post To Date',
                                xtype:'datefield',
                                name:'post_to_date',
                                action:'new_payment',
                                format:'Y-m-d',
                                labelWidth:95,
                                width:215
                            },
                            {
                                fieldLabel:'Note',
                                xtype:'textfield',
                                name:'note',
                                width: 282,
                                labelWidth:82,
                                margin:'0 0 0 25'
                            }
                        ]
                    }
                ]
            }
        ];

        me.buttons = [
            {
                text:'Save',
                scope:me,
                handler: me.onSave
            },
            '-',
            {
                text:'Reset',
                scope:me,
                handler:me.resetNewPayment
            }
        ];
        me.callParent(arguments);
    },
    onSave: function() {
        var me = this, panel, form, values, date;
        panel = me.down('form');
        form = panel.getForm();
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
    },

    resetNewPayment:function () {
        var fields = this.query('[action="new_payment"]');
        Ext.each(fields, function(field){
            field.reset();
        });
    }


}); //end Checkout class