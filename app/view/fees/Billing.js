//******************************************************************************
// Billing.ejs.php
// Billing Forms
// v0.0.1
// Author: Emmanuel J. Carrasquillo
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

//		page.billingGrid = Ext.create('Ext.form.Panel', {
//			title    : 'Billing History',
//            defaults:{
//                bodyStyle:'padding:15px',
//                bodyBorder:true,
//                labelWidth:110
//            },
//            items:[
//                {
//                    xtype:'container',
//                    margin:'5 5 0 5',
//                    layout:'hbox',
//                    defaults:{
//                        flex:1,
//                        height:300,
//                        stripeRows:true
//                    },
//                    items:[
//                        {
//                            xtype:'grid',
//                            title:'Search Criteria',
//                            itemId:'leftCol',
//                            margin:'0 5 0 0',
//                            multiSelect:true,
//
//                            store:page.cptCodesGridStore,
//                            viewConfig:{
//                                copy:true,
//                                plugins:[
//                                    {
//                                        ptype:'gridviewdragdrop',
//                                        dragGroup:'firstSearchCriteriaGridDDGroup',
//                                        dropGroup:'secondSearchCriteriaGridDDGroup'
//                                    }
//                                ],
//                                listeners:{
//                                    scope:page,
//                                    drop:page.onSearchCriteriaDrop
//                                }
//                            },
//                            columns:[
//                                {
//                                    text:"Criteria Id",
//                                    width:100,
//                                    sortable:true,
//                                    dataIndex:'criteria_id'
//                                },
//                                {
//                                    text:"Criteria Description",
//                                    flex:1,
//                                    sortable:true,
//                                    dataIndex:'criteria_description_medium'
//                                }
//                            ]
//                        },
//                        {
//                            xtype:'grid',
//                            title:'Current Selected Criteria',
//                            itemId:'rightCol',
//
//                            store:page.secondGridStore,
//                            columns:[
//                                {
//                                    text:"Criteria Id",
//                                    width:100,
//                                    sortable:true,
//                                    dataIndex:'criteria_id'
//                                },
//                                {
//                                    text:"Description",
//                                    flex:1,
//                                    sortable:true,
//                                    dataIndex:'criteria_description'
//                                }
//                            ],
//                            viewConfig:{
//                                itemId:'view',
//                                plugins:[
//                                    {
//                                        ptype:'gridviewdragdrop',
//                                        dragGroup:'secondSearchCriteriaGridDDGroup',
//                                        dropGroup:'firstSearchCriteriaGridDDGroup'
//                                    }
//
//                                ],
//                                listeners:{
//                                    scope:page,
//                                    drop:page.onCurrentSelectedCriteriaDrop
//                                }
//                            }
//                        }
//                    ]
//                },
//                {
//                    xtype  : 'grid',
//                    title  : 'Payments Found',
//                    height : 180,
//                    margin : '5 5 5 5',
//                    columns: [
//                        {
//                            header : 'Payment Number'
//                        },
//                        {
//                            header : 'Date'
//                        }
//                    ]
//                }
//            ]
//		});


        page.store = Ext.create('Ext.data.Store', {
            storeId:'simpsonsStore',
            fields:['name', 'email', 'phone'],
            data:{'items':[
                { 'name': 'Lisa',  "email":"lisa@simpsons.com",  "phone":"555-111-1224"  },
                { 'name': 'Bart',  "email":"bart@simpsons.com",  "phone":"555-222-1234" },
                { 'name': 'Homer', "email":"home@simpsons.com",  "phone":"555-222-1244"  },
                { 'name': 'Marge', "email":"marge@simpsons.com", "phone":"555-222-1254"  }
            ]},
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    root: 'items'
                }
            }
        });



		page.encountersGrid = Ext.create('Ext.grid.Panel', {
            title: 'Encputers test',
            store: page.store,
            columns: [
                { header: 'Name',  dataIndex: 'name' },
                { header: 'Email', dataIndex: 'email', flex: 1 },
                { header: 'Phone', dataIndex: 'phone' }
            ],
            plugins: Ext.create('App.classes.grid.RowFormEditing', {
                autoCancel  : false,
                errorSummary: false,
                clicksToEdit: 1,
                formItems   : [
                    Ext.create('App.view.patientfile.encounter.CurrentProceduralTerminology',{
                        height:500
                    })

                ]
            })

        });

        //Ext.create('App.view.patientfile.encounter.CurrentProceduralTerminology')

		page.pageBody = [ page.encountersGrid ];
		page.callParent(arguments);
	}, // end of initComponent

    onSearchCriteriaDrop:function () {
        app.msg('Criteria removed from Current Selected Criteria');
    },

    onCurrentSelectedCriteriaDrop:function (node, data) {
        var me = this,
            index;

        app.msg('Search Criteria added to Current Selected Criteria');
        me.cptFormEdit.cancelEdit();
        index = me.secondGridStore.indexOf(data.records[0]);
        me.cptFormEdit.startEdit(index, 0);
    },

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