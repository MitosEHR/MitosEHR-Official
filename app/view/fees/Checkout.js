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

        me.pageBody = Ext.create('Ext.form.Panel', {
            title:'Patient Checkout',
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
                    height:300,
                    defaults:{ flex:1 },
                    items:[
                        {
                            xtype:'fieldset',
                            title:'Transaction Information',
                            layout:'anchor',
                            margin:'5 5 5 5',
                            defaults: { labelWidth:110 },
                            items:[
                                {
                                    fieldLabel: 'Patient Name',
                                    xtype     : 'textfield'
                                },
                                {
                                    fieldLabel: 'Encounter #',
                                    xtype     : 'textfield'
                                },
                                {
                                    fieldLabel: 'Facility',
                                    xtype     : 'mitos.facilitiescombo'
                                },
                                {
                                    fieldLabel: 'Transaction #',
                                    xtype     : 'textfield'
                                },
                                {
                                    fieldLabel: 'Transaction Date',
                                    xtype     : 'datefield'
                                }
                            ]

                        },
                        {
                            xtype:'fieldset',
                            title:'Payment Information',
                            layout:'anchor',
                            margin:'5 5 5 0',
                            items:[
                                {
                                    xtype:'mitos.currency',
                                    fieldLabel:'Payment Amount'
                                },
                                {
                                    fieldLabel: 'Paying Entity',
                                    xtype     : 'mitos.payingentitycombo',
                                    name      : 'paymentmethod'
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
                }

            ],
            bbar: [
                {
                    itemId  : 'move-prev',
                    text    : 'Back',
                    handler : function(btn) {
                        me.navigate(btn.up("panel"), "prev");
                    },
                    disabled: true
                },
                '->',
                //spacer so buttons align to each side
                {
                    itemId  : 'move-next',
                    text    : 'Next',
                    handler : function(btn) {
                        me.navigate(btn.up("panel"), "next");
                    }
                }
            ]
		});


		me.callParent(arguments);
	},
	/*navigate     : function(panel, direction) {

		var layout = panel.getLayout();
		layout[direction]();
		Ext.getCmp('move-prev').setDisabled(!layout.getPrev());
		Ext.getCmp('move-next').setDisabled(!layout.getNext());
	},*/

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
