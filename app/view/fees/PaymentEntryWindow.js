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
                height:123,
                defaults:{ margin:5 },
                closable:false,
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
                                width:230
                            },
                            {
                                xtype:'patienlivetsearch',
                                fieldLabel:'From',
                                hideLabel:false,
                                itemId:'patientFrom',
                                name:'from',
                                anchor:null,
                                labelWidth:42,
                                width:470,
                                margin:'0 0 0 25'
                            },
                            {
                                xtype:'textfield',
                                fieldLabel:'No',
                                name:'transaction_number',
                                labelWidth:45,
                                width:230,
                                labelAlign:'right',
                                margin:'0 0 0 25',
                                fieldStyle:'text-align: right;'
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
                                width:230
                            },
                            {
                                xtype:'mitos.billingfacilitiescombo',
                                fieldLabel:'Pay To',
                                labelWidth:42,
                                width:470,
                                margin:'0 0 0 25'
                            },
                            {
                                xtype:'mitos.currency',
                                fieldLabel:'Amount',
                                name:'amount',
                                labelWidth:45,
                                width:230,
                                labelAlign:'right',
                                margin:'0 0 0 25',
                                enableKeyEvents:true
                            }
                        ]
                    },
                    {
                        xtype:'fieldcontainer',
                        layout:'hbox',
                        items:[
                            {
                                fieldLabel:'From',
                                xtype:'datefield',
                                labelWidth:95,
                                width:230
                            },
                            {
                                fieldLabel:'To',
                                xtype:'datefield',
                                margin:'0 0 0 25',
                                labelWidth:42,
                                width:230
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
            }
        ];
        me.callParent(arguments);
    }
})
; //end Checkout class