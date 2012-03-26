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
Ext.define('App.view.fees.FeesSheet', {
    extend:'App.classes.RenderPanel',
    id:'panelFeesSheet',
    pageTitle:'Fees Sheet',
    uses:['App.classes.GridPanel'],

    initComponent: function() {
        var me = this;

        me.pageBody =  Ext.create('Ext.form.Panel', {
            title:'Physician Assessment',
            defaults:{
                bodyStyle:'padding:15px',
                bodyBorder:true,
                layout:'fit',
                labelWidth:110
            },
            items : [
                {
                    xtype:'container',
                    layout: {
                        type   : 'hbox',
                        align  : 'stretch'
                    },
                    height:340,
                    margin:'0 0 5 0',
                    defaults:{ flex:1 },
                    items:[
                        {
                            xtype:'container',
                            items:[
                                {
                                    xtype:'fieldset',
                                    title:'Follow-Up Information',
                                    margin:'5 10 10 5',
                                    height:162.5,
                                    defaults: {
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
                                    xtype:'fieldset',
                                    title:'Meaningful Use Measures',
                                    columnWidth:.5,
                                    margin:'0 10 0 5',
                                    height: 162.5,
                                    items:[
                                        {
                                            xtype:'checkboxgroup',
                                            defaults:{
                                                xtype:'checkboxfield',
                                                margin: '5 0 0 0',
                                                height:25
                                            },
                                            items:[
                                                {
                                                    boxLabel:'Clinical Summary Provided'
                                                },
                                                {
                                                    boxLabel:'Elegibility Confirmed'
                                                }
                                            ]
                                        },
                                        {
                                            xtype:'checkboxgroup',
                                            defaults:{
                                                xtype:'checkboxfield'
                                            },
                                            items:[
                                                {
                                                    boxLabel:'Medical Reconciliation'
                                                },
                                                {
                                                    boxLabel:'Push to Exchange'
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
                            margin:'4 3 0 0',
                            columns: [
                                {
                                    header : 'Code'
                                },
                                {
                                    header : 'Description',
                                    flex:1
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype:'fieldcontainer',
                    items:[
                        {
                            xtype:'fieldset',
                            title:'Notes and Reminders',
                            margin:'0 3 5 3',
                            height: 150,
                            items:[
                                {
                                    xtype:'textfield',
                                    name:'note',
                                    fieldLabel:'Note',
                                    anchor:'100%'
                                },
                                {
                                    xtype:'textareafield',
                                    grow:true,
                                    name:'reminder',
                                    fieldLabel:'Reminder',
                                    anchor:'100%'
                                }
                            ]
                        }
                    ]
                }
            ],
            bbar     : [
                {
                    itemId      : 'move-prev',
                    text    : 'Back',
                    handler : function(btn) {
                        me.navigate(btn.up("panel"), "prev");
                    },
                    disabled: true
                },
                '->',
                //spacer so buttons align to each side
                {
                    itemId      : 'move-next',
                    text    : 'Next',
                    handler : function(btn) {
                        me.navigate(btn.up("panel"), "next");
                    }
                }
            ]
        });

    		me.callParent(arguments);
    	},
    /*	navigate     : function(panel, direction) {

    		var layout = panel.getLayout();
    		layout[direction]();
    		Ext.getCmp('move-prev').setDisabled(!layout.getPrev());
    		Ext.getCmp('move-next').setDisabled(!layout.getNext());
    	}, // end of initComponent*/

    /**
     * This function is called from MitosAPP.js when
     * this panel is selected in the navigation panel.
     * place inside this function all the functions you want
     * to call every this panel becomes active
     */
    onActive:function (callback) {
        callback(true);
    },

	onOptionType: function(combo) {
		var me = this;
        var patient =  me.getCurrPatient();
        var titlefield = combo.up('form').down('description').down('fieldcontainer').getComponent('paymentfrom');
		titlefield.setValue(patient.name);


	}

	/*onOptionType: function(combo) {
var me = this;
		var value = combo.getValue(),
			patient =  me.getCurrPatient(),
		titlefield = combo.up('fieldset').getComponent('payment');
		titlefield.setValue(patient.name);


	}*/
}); //end oNotesPage class