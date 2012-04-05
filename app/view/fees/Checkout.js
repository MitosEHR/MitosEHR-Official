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

    initComponent:function () {
        var me = this;

        me.pageBody = Ext.create('Ext.form.Panel', {
            title:'Charge Patient',
            defaults:{
                bodyStyle:'padding:15px',
                bodyBorder:true,
                labelWidth:110
            },
            items:[
                {
                    xtype:'container',
                    layout:{
                        type:'hbox',
                        align:'stretch'
                    },
                    height:360,
                    items:[
                        {
                            xtype:'fieldset',
                            title:'Payment Receipt',
                            margin:'5 5 5 5',
                            flex:2,
                            defaults: { labelWidth:110 },
                            items:[
                                /*{
                                    xtype:'container',
                                    height:350,
                                    width:600,
                                    layout:{
                                        type:'table',
                                        columns:5
                                    },
                                    items:[
                                        {
                                            fieldLabel: 'Transaction Date',
                                            xtype     : 'datefield'//,
                                            //colspan: 1
                                        },{
                                            fieldLabel: ' ',
                                           // xtype     : 'textfield',
                                            colspan: 2
                                        },{
                                            xtype:'textfield',
                                            fieldLabel:'Payment From',
                                            cellCls: 'highlight'
                                        }//,{
                                       //     xtype:'mitos.currency',
                                       //     fieldLabel:'Payment Amount'
                                       // }
                                    ]
                                },*/
                                {
                                    fieldLabel: 'Transaction Date',
                                    xtype     : 'datefield'
                                },
                                {
                                    xtype:'mitos.currency',
                                    fieldLabel:'Payment Amount'
                                },
                                {
                                    xtype:'textfield',
                                    fieldLabel:'Payment From',
                                    itemId:'payment_from',
                                    action:'payment_from'
                                },
                                {
                                    fieldLabel: 'Payment From',
                                    xtype     : 'textfield'
                                },
                                {
                                    fieldLabel: 'Encounter Number',
                                    xtype     : 'textfield'
                                },
                                {
                                    fieldLabel: 'Facility',
                                    xtype     : 'mitos.facilitiescombo'
                                }
                            ]
                        },
                        {
                            xtype:'grid',
                            title:'Orders',
                            margin:'8 4 5 5',
                            flex:1,
                            columns:[
                                {
                                    header:'Code'
                                },
                                {
                                    header:'Description',
                                    flex:1
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
                                    fieldLabel:'Time',
                                    xtype:'textfield'
                                },
                                {
                                    fieldLabel:'Facility',
                                    xtype:'mitos.facilitiescombo'
                                }
                            ]
                        },
                        {
                            xtype:'fieldset',
                            title:'Notes and Alerts',
                            defaults:{ anchor:'100%'},
                            items:[
                                {
                                    xtype:'textfield',
                                    name:'note',
                                    fieldLabel:'Note'
                                },
                                {
                                    xtype:'textareafield',
                                    grow:true,
                                    name:'reminder',
                                    fieldLabel:'Alert'
                                }
                            ]
                        }
                    ]
                }
            ],
            bbar:[
                '->',
                {
                    itemId:'move-next',
                    text:'Next',
                    handler:function () {
                        app.navigateTo('panelPayments');
                    }
                }
            ]
        });

        me.callParent(arguments);
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
