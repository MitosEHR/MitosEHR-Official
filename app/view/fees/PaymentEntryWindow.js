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
                height:163,
                width:747,
                items:[
                    {
                        xtype:'fieldcontainer',
                        layout:'hbox',
                        items:[
                            {
                                fieldLabel:'Paying Entity',
                                xtype:'mitos.payingentitycombo',
                                name:'paying_entity',
                                action: 'new_payment',
                                labelWidth:98,
                                width:220
                            },
                            {
                                xtype:'patienlivetsearch',
                                fieldLabel:'From',
                                hideLabel:false,
                                name:'payer_id',
                                action: 'new_payment',
                                anchor:null,
                                labelWidth:42,
                                width:300,
                                margin:'0 0 0 25'
                            },
                            {
                                xtype:'textfield',
                                fieldLabel:'No',
                                action: 'new_payment',
                                name:'check_number',
                                labelWidth:47,
                                width:167,
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
                                action: 'new_payment',
                                labelWidth:98,
                                name:'payment_method',
                                width:220
                            },
                            {
                                xtype:'mitos.billingfacilitiescombo',
                                fieldLabel:'Pay To',
                                action: 'new_payment',
                                labelWidth:42,
                                name:'pay_to',
                                width:300,
                                margin:'0 0 0 25'
                            },
                            {
                                xtype:'mitos.currency',
                                fieldLabel:'Amount',
                                action: 'new_payment',
                                name:'amount',
                                labelWidth:47,
                                width:167,
                                margin:'0 0 0 25',
                                enableKeyEvents:true
                            }
                        ]
                    },
                    {
                        fieldLabel:'Post To Date',
                        xtype:'datefield',
                        name:'post_to_date',
                        action:'new_payment',
                        format:'Y-m-d',
                        labelWidth:98,
                        width:220
                    },
                    {
                        fieldLabel:'Note',
                        xtype     : 'textareafield',
                        grow      : true,
                        action: 'new_payment',
                        name:'note',
                        labelWidth:98,
                        anchor:'100%'
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
        var me = this, panel, form, values;
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