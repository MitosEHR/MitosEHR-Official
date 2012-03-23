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
Ext.define('App.view.fees.Checkout', {
	extend       : 'App.classes.RenderPanel',
	id           : 'panelCheckout',
	pageTitle    : 'Checkout',
	uses         : ['App.classes.GridPanel'],
	initComponent: function() {
		var me = this;

		me.panel = Ext.create('Ext.form.Panel', {
			title: 'Checkout',
			layout   : 'card',
            align : 'stretch',

			bbar     : [
				{
					id      : 'move-prev',
					text    : 'Back',
					handler : function(btn) {
						me.navigate(btn.up("panel"), "prev");
					},
					disabled: true
				},
				'->',
				//spacer so buttons align to each side
				{
					id      : 'move-next',
					text    : 'Next',
					handler : function(btn) {
						me.navigate(btn.up("panel"), "next");
					}
				}
			],
			// the panels (or "cards") within the layout
			items    : [
				{
					xtype : "container",
					layout: 'anchor',
					items : [
						{
							xtype     : 'textfield',
							fieldLabel: '111111'
						},
						{
							xtype     : 'textfield',
							fieldLabel: '222222'
						}
					]
				},
                {
                    xtype:'form',
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
                            height:146,
                            defaults:{ flex:1 },
                            items:[
                                {
                                    xtype:'fieldset',
                                    title:'Payment Information',
                                    layout:'anchor',
                                    margin:'5 5 5 5',
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
                            margin:'0 10 10 10',
                            height: 73,
                            items:[
                                {
                                    xtype:'fieldcontainer',
                                    layout: {
                                        type   : 'hbox',
                                        align  : 'stretch'
                                    },
                                    defaults:{ flex:1 },
                                   // defaults:{ labelWidth:110 },
                                    items:[
                                        {
                                            xtype:'fieldcontainer',
                                            items:[
                                                {
                                                    xtype:'textfield',
                                                    fieldLabel:'Payment From'
                                                },
                                                {
                                                    xtype:'textfield',
                                                    fieldLabel:'Patient Id'
                                                }
                                            ]
                                        },
                                        {
                                            xtype:'fieldcontainer',
                                            items:[
                                                {
                                                    xtype:'datefield',
                                                    fieldLabel:'Deposit Date'
                                                },
                                                {
                                                    xtype:'textfield',
                                                    fieldLabel:'Notes',
                                                    width: 550
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
                            margin:'0 10 15 10',
                            items:[
                                {
                                    xtype:'fieldcontainer',
                                    layout: {
                                        type   : 'hbox'
                                    },

                                    defaults:{  flex:1, height:35 },

                                    items:[
                                        {
                                            xtype: 'fieldcontainer',
                                            margin:'0 0 0 45',
                                            items:[
                                                {
                                                    xtype:'textfield',
                                                    fieldLabel:'Patient Name',
                                                    labelWidth:110
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'fieldcontainer',
                                            items:[
                                                {
                                                    xtype:'textfield',
                                                    fieldLabel:'Patient Id',
                                                    labelWidth:110
                                                }
                                            ]
                                        },

                                        {
                                            xtype: 'fieldcontainer',
                                            items:[
                                                {
                                                    xtype:'mitos.currency',
                                                    fieldLabel:'Remaining Amount',
                                                    labelWidth:110
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    xtype  : 'grid',
                                    title  : 'CPTs',
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
                    ]
				},
				{
                    xtype   : "container",
					layout: 'anchor',
					items : [
						{
							xtype     : 'textfield',
							fieldLabel: '333333'
						},
						{
							xtype     : 'textfield',
							fieldLabel: '444444'
						}
					]
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
	}
}); //end oNotesPage class
