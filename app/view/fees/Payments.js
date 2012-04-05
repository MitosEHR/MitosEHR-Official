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
	extend       : 'App.classes.RenderPanel',
	id           : 'panelPayments',
	pageTitle    : 'Payments',
	uses         : ['App.classes.GridPanel'],

    initComponent: function() {
		var me = this;

		me.panel = Ext.create('Ext.form.Panel', {
            title:'Payment Entry',
            defaults:{
                bodyStyle:'padding:15px',
                bodyBorder:true,
                layout:'fit',
                labelWidth:110
            },
            items:[
                {
                    xtype:'container',
                    layout: {
                        type   : 'hbox',
                        align  : 'stretch'
                    },
                    height:160,
                    defaults:{ flex:1 },
                    items:[
                        {
                            xtype:'fieldset',
                            title:'Payment Information',
                            layout:'anchor',
                            margin:'5 0 5 5',
                            defaults: { labelWidth:110 },
                            items:[
                                {
                                    fieldLabel: 'Payment Method',
                                    xtype     : 'mitos.paymentmethodcombo',
                                    name      : 'paymentmethod',
                                    enableKeyEvents:true,
                                    listeners :{
                                        scope : me,
                                        select:me.onCheckPayment

                                    }
                                },
                                {
                                    xtype:'mitos.currency',
                                    fieldLabel:'Payment Amount',
                                    minValue:0
                                },
                                {
                                    fieldLabel: 'Paying Entity',
                                    xtype     : 'mitos.payingentitycombo',
                                    name      : 'paymentmethod',
	                                enableKeyEvents:true,
	                                listeners:{
		                                scope:me,
		                                select:me.onOptionType
	                                }
                                },
                                {
                                    fieldLabel: 'Payment Category',
                                    xtype     : 'mitos.paymentcategorycombo',
                                    name      : 'paymentmethod'
                                }
                            ]

                        },
                        {
                            xtype:'fieldset',
                            action:'checkinfo',
                            title:'Check Information',
                            layout:'anchor',
                            collapsed: true,
                            width:0,
                            margin:'5 5 5 0',
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
	                itemId:'description',
                    margin:'0 5 15 5',
                    height: 120,

                    items:[
                        {
                            xtype:'fieldcontainer',
	                        layout: {
                                type   : 'hbox',
                                align  : 'stretch'
                            },
                            items:[
                                {
                                    xtype:'fieldcontainer',
                                    width:300,
                                    items:[
                                        {
                                            xtype:'textfield',
                                            fieldLabel:'Payment From',
	                                        itemId:'payment_from',
	                                        action:'payment_from'
                                        },
                                        {
                                            xtype:'textfield',
                                            fieldLabel:'ID',
                                            action:'pid'
                                        },
                                        {
                                            xtype:'datefield',
                                            fieldLabel:'Deposit Date'
                                        }
                                    ]
                                },
                                {
                                    xtype:'fieldcontainer',
                                    items:[
                                        {

                                            xtype:'textareafield',
                                            grow:true,
                                            name:'note',
                                            fieldLabel:'Note',
                                            width: 835,
                                            anchor:'100%'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype:'form',
                    title:'Patient CPTs',
                    margin:'0 5 15 5',
	                height:280,
                    items:[
                        {
                            xtype:'fieldcontainer',
	                        height:40,
                            layout: {
                                type   : 'hbox'
                            },

                            defaults:{
                                flex:1,
                                height:30,
                                labelWidth:110
                            },

                            items:[
                                {
                                    xtype: 'fieldcontainer',
                                    margin:'0 0 0 45',
                                    items:[
                                        {
                                            xtype:'textfield',
                                            fieldLabel:'Patient Name'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldcontainer',
                                    items:[
                                        {
                                            xtype:'textfield',
                                            fieldLabel:'Patient Id'
                                        }
                                    ]
                                },

                                {
                                    xtype: 'fieldcontainer',
                                    items:[
                                        {
                                            xtype:'mitos.currency',
                                            fieldLabel:'Remaining Amount'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype  : 'grid',
                            title  : 'CPTs',
	                        height : 180,
                            columns: [
                                {
                                    header : 'CPT Code',
                                    flex:1
                                },
                                {
                                    header : 'Charge'
                                },
                                {
                                    header : 'Copay'
                                },
                                {
                                    header : 'Remainder'
                                },
                                {
                                    header : 'Allowed'
                                },
                                {
                                    header : 'Payment'
                                },
                                {
                                    header : 'Adj. Amount'
                                },
                                {
                                    header : 'Deductible'
                                },
                                {
                                    header : 'Takeback'
                                }
                            ]
                        }
                    ]
                }
            ],

            bbar     : [
                {
                    itemId  : 'move-prev',
                    text    : 'Back',
                    handler : function() {
	                    app.navigateTo('panelFeesSheet');
                    }
                },
                '->',
                {
                    itemId  : 'move-next',
                    text    : 'Next',
                    handler : function() {
                        app.navigateTo('panelCheckout');
                    }
                }
            ]
		});


		me.pageBody = [ me.panel ];
		me.callParent(arguments);
	},
	navigate     : function(panel, direction) {

		var layout = panel.getLayout();
		layout[direction]();
		Ext.getCmp('move-prev').setDisabled(!layout.getPrev());
		Ext.getCmp('move-next').setDisabled(!layout.getNext());
	},

	/**
	 * This function is called from MitosAPP.js when
	 * this panel is selected in the navigation panel.
	 * place inside this function all the functions you want
	 * to call every this panel becomes active
	 */
	onActive: function(callback) {
		callback(true);
	},
	onOptionType:function (combo) {

        var patient =  this.getCurrPatient(),
            Fromfield = this.query('textfield[action="payment_from"]'),
            pidfield = this.query('textfield[action="pid"]');

        if(combo.getValue() == 'patient'){
            Fromfield[0].setValue(patient.name);
            pidfield[0].setValue(patient.pid);
        }else{
            Fromfield[0].reset();
            pidfield[0].reset();
        }

	},

    onCheckPayment:function(combo){
        var checkinfo = this.query('fieldset[action="checkinfo"]');

        if(combo.getValue() == 'check_payment'){

        checkinfo[0].expand();
        checkinfo[0].setWidth(600);
        //checkinfo.setPadding(0,15,0,15);

        }else{

        checkinfo[0].collapse();
        checkinfo[0].setWidth(0);
        //checkinfo.setPadding(0,0,0,0);
        }

    }


}); //end Payments class