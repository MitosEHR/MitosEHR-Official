/**
 * services.ejs.php
 * Services
 * v0.0.1
 *
 * Author: Ernest Rodriguez
 *
 * MitosEHR (Electronic Health Records) 2011
 *
 *
 * @namespace Services.getServices
 * @namespace Services.addService
 * @namespace Services.updateService
 */
Ext.define('App.view.administration.Medications', {
	extend       : 'App.classes.RenderPanel',
	id           : 'panelMedications',
	pageTitle    : 'Medications',

	initComponent: function() {
		var me = this;

        me.storeMedications = Ext.create('App.store.administration.Medications');

        me.medicationsGrid = Ext.create('App.classes.GridPanel', {
                        region : 'center',
            			store  : me.storeMedications,
            			columns: [
                            {
                                width: 80,
                                header: 'Number',
                                dataIndex:'PRODUCTNDC',
                                sortable: true
                            },
            				{
                                width: 80,
                                header: 'Name',
                                dataIndex:'PROPRIETARYNAME',
                                sortable: true
                            },
                            {
                                width: 80,
                                header: 'Active Comp',
                                dataIndex:'NONPROPRIETARYNAME',
                                sortable: true
                            },
            				{
                                width: 60,
                                header: 'Dosage',
                                dataIndex:'DOSAGEFORMNAME',
                                sortable: true
                            },
            				{
                                width: 70,
                                header: 'Number',
                                dataIndex:'ACTIVE_NUMERATOR_STRENGTH',
                                sortable: true
                            },
            				{
                                flex: 1,
                                header: 'Unit',
                                dataIndex:'ACTIVE_INGRED_UNIT',
                                sortable: true
                            }
            			],
            plugins: Ext.create('App.classes.grid.RowFormEditing', {
	            autoCancel  : false,
	            errorSummary: false,
	            clicksToEdit: 1,
	            formItems   : [
		            {

			            title : 'general',
			            xtype : 'container',
			            padding:10,
			            layout:'vbox',
			            items : [
				            {
					            /**
					             * line One
					             */
					            xtype   : 'fieldcontainer',
					            layout:'hbox',
					            defaults:{ margin:'0 10 5 0' },
					            items   : [
						            {

							            xtype     : 'textfield',
							            fieldLabel: 'Immunization Name',
							            name      : 'code_text',
							            labelWidth:130,
							            width:747
						            },
						            {
							            xtype     : 'mitos.sexcombo',
							            fieldLabel: 'Sex',
							            name      : 'sex',
							            width     : 100,
							            labelWidth: 30

						            }



					            ]
				            },
				            {
					            /**
					             * Line two
					             */
					            xtype   : 'fieldcontainer',
					            layout:'hbox',
					            defaults:{ margin:'0 10 5 0' },
					            items   : [
						            {
							            xtype     : 'mitos.codestypescombo',
							            fieldLabel: 'Coding System',
							            labelWidth:130,
							            value     : 'CVX',
							            name      : 'code_type',
							            readOnly:true

						            },
						            {
							            xtype     : 'numberfield',
							            fieldLabel: 'Frequency',
							            margin:'0 0 5 0',
							            value     : 0,
							            minValue  : 0,
							            width:150,
							            name      : 'frequency'

						            },
						            {
							            xtype: 'mitos.timecombo',
							            name : 'frequency',
							            width:100

						            },
						            {
							            xtype     : 'numberfield',
							            fieldLabel: 'Age Start',
							            labelWidth: 75,
							            width:140,
							            value     : 0,
							            minValue  : 0

						            },
						            {
							            fieldLabel: 'Must be pregnant',
							            xtype   : 'checkboxfield',
							            labelWidth:105,
							            name    : 'pregnant'


						            }
					            ]

				            },
				            {
					            /**
					             * Line three
					             */
					            xtype   : 'fieldcontainer',
					            layout:'hbox',
					            defaults:{ margin:'0 10 5 0' },
					            items   : [
						            {
							            xtype     : 'textfield',
							            fieldLabel: 'Code',
							            name      : 'code',
							            labelWidth:130

						            },
						            {
							            xtype     : 'numberfield',
							            fieldLabel: 'Times to Perform',
							            width     : 250,
							            value     : 0,
							            minValue  : 0,
							            name      : 'times',
							            tooltip   : 'Please enter a number greater than 1 or just check "Perform once"'

						            },
						            {

							            xtype     : 'numberfield',
							            fieldLabel: 'Age End',
							            labelWidth: 75,
							            width:140,
							            value     : 0,
							            minValue  : 0


						            },

						            {
							            fieldLabel: 'perform only once',
							            xtype   : 'checkboxfield',
							            labelWidth:105,
							            //margin  : '5 0 0 10',
							            name    : 'perform'
						            }



					            ]

				            }

			            ]


		            }
		            ]





            }),
            tbar: Ext.create('Ext.PagingToolbar', {
            				store      : me.storeMedications,
            				displayInfo: true,
            				emptyMsg   : "No Office Notes to display",
            				plugins    : Ext.create('Ext.ux.SlidingPager', {


				            })

            			})
        })
        me.pageBody = [ me.medicationsGrid ];
		me.callParent(arguments);
	}, // end of initComponent




	/**
	 * This function is called from MitosAPP.js when
	 * this panel is selected in the navigation panel.
	 * place inside this function all the functions you want
	 * to call every this panel becomes active
	 */
	onActive: function(){
        this.storeMedications.load();

	}
}); //ens servicesPage class