//******************************************************************************
// Billing.ejs.php
// Billing Forms
// v0.0.1
// Author: Ernest Rodriguez
// Modified: 
// MitosEHR (Electronic Health Records) 2011
//******************************************************************************
Ext.define('App.view.fees.Billing', {
	extend       : 'App.classes.RenderPanel',
	id           : 'panelBilling',
	pageTitle    : 'Billing',
	uses         : [ 'App.classes.GridPanel' ],

	initComponent: function() {
		var page = this;

		//******************************************************************
		// Grid...
		//******************************************************************
		page.billingGrid = Ext.create('Ext.form.Panel', {
			title    : 'Billing History',
            defaults:{
                bodyStyle:'padding:15px',
                bodyBorder:true,
                labelWidth:110
            },
            items:[
                {
                    xtype:'container',
                    margin:'5 5 0 5',
                    layout:'hbox',
                    items:[
                        {
                            xtype:'grid',
                            title:'Search Criteria',
                            itemId:'leftCol',
                            region:'west',
                            flex:1,
                            width:585,
                            height:300,
                            margin:'0 5 0 0',
                            multiSelect:true,
                            stripeRows:true,

                            store:page.cptCodesGridStore,
                            viewConfig:{
                                copy:true,
                                plugins:[
                                    {
                                        ptype:'gridviewdragdrop',
                                        dragGroup:'firstSearchCriteriaGridDDGroup',
                                        dropGroup:'secondSearchCriteriaGridDDGroup'
                                    }
                                ]
                                /*listeners:{
                                    scope:page,
                                    drop:page.onQuickRefereneDrop
                                }*/
                            },
                            columns:[
                                {
                                    text:"Criteria Id",
                                    width:100,
                                    sortable:true,
                                    dataIndex:'criteria_id'
                                },
                                {
                                    text:"Criteria Description",
                                    flex:1,
                                    sortable:true,
                                    dataIndex:'criteria_description_medium'
                                }
                            ]
                            /*,
                            listeners:{
                                scope:page,
                                collapse:page.onQuickReferenceCollapsed
                            }*/
                        },
                        {
                            xtype:'grid',
                            title:'Current Selected Criteria',
                            region:'center',
                            flex:1,
                            width:585,
                            height:300,
                            itemId:'rightCol',
                            stripeRows:true,

                            store:page.secondGridStore,
                            columns:[
                                {
                                    text:"Criteria Id",
                                    width:100,
                                    sortable:true,
                                    dataIndex:'criteria_id'
                                },
                                {
                                    text:"Description",
                                    flex:1,
                                    sortable:true,
                                    dataIndex:'criteria_description'
                                }
                            ],
                            viewConfig:{
                                itemId:'view',
                                //copy:true,
                                plugins:[
                                    {
                                        ptype:'gridviewdragdrop',
                                        dragGroup:'secondCPTGridDDGroup',
                                        dropGroup:'firstCPTGridDDGroup'
                                    }

                                ]/*,
                                listeners:{
                                    scope:page,
                                    drop:page.onEncounterCptDrop
                                }*/
                            }
                            /*plugins:page.cptFormEdit,
                            listeners:{
                                selectionchange:page.onEncounterCptSelectionChange
                            }*/
                        }

                      /*  {
                            xtype:'textfield',
                            fieldLabel: 'Timeframe'
                        },
                        {
                            xtype:'textfield',
                            fieldLabel: 'Timeframe'
                        }*/
                    ]
                },
                {
                    xtype  : 'grid',
                    title  : 'Payments Found',
                    height : 180,
                    margin : '5 5 5 5',
                    columns: [
                        {
                            header : 'Payment Number'
                        },
                        {
                            header : 'Date'
                        }
                    ]
                }
            ]
		});
		page.pageBody = [  page.billingGrid ];
		page.callParent(arguments);
	}, // end of initComponent
	/**
	 * This function is called from MitosAPP.js when
	 * this panel is selected in the navigation panel.
	 * place inside this function all the functions you want
	 * to call every this panel becomes active
	 */
	onActive     : function(callback) {
		callback(true);
	}
}); //ens oNotesPage class