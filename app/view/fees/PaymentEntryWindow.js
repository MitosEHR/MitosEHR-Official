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
                closable:false,
                border:false,
                items:[
                    {
                        xtype:'form',
                        defaults:{ margin:5 },
                        border:false,
                        items:[
                            {
                                xtype:'fieldcontainer',
                                layout:'hbox',
                                items:[
                                    {
                                        fieldLabel:'Paying Entity',
                                        xtype:'mitos.payingentitycombo',
                                        labelWidth:95,
                                        name:'paying_entity',
                                        width:230
                                    },
                                    {
                                        xtype:'patienlivetsearch',
                                        fieldLabel:'From',
                                        itemId:'patientFrom',
                                        name:'payer_id',
                                        anchor:null,
                                        labelWidth:42,
                                        width:470,
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
                                        width:230,
                                        margin:'10 0 0 0'
                                    },
                                    {
                                        xtype:'mitos.billingfacilitiescombo',
                                        fieldLabel:'Pay To',
                                        labelWidth:42,
                                        name:'pay_to',
                                        width:470,
                                        margin:'10 0 0 25'
                                    },
                                    {
                                        xtype:'mitos.currency',
                                        fieldLabel:'Amount',
                                        name:'amount',
                                        labelWidth:45,
                                        width:230,
                                        labelAlign:'right',
                                        margin:'10 0 0 25',
                                        enableKeyEvents:true
                                    }
                                ]
                            },
                            {
                                xtype:'fieldcontainer',
                                layout:'hbox',
                                items:[
                                    {
                                        fieldLabel:'Date',
                                        xtype:'datefield',
                                        name:'date',
                                        dateFormat:'Y-m-d',
                                        labelWidth:95,
                                        width:230
                                    },
                                    {
                                        fieldLabel:'Note',
                                        xtype:'textfield',
                                        name:'note',
                                        margin:'0 0 0 25',
                                        width: 725,
                                        labelWidth:42
                                    }
                                ]
                            }
                        ]
                    }
                ],
                bbar:[
                    {
                        text:'Save',
                        scope:me,
                        handler: me.onSave
                    },
                    '-',
                    {
                        text:'Reset'
                    }
                ]
            }
        ];
        me.callParent(arguments);
    },
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