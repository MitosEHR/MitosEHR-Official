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





            })
            tbar: Ext.create('Ext.PagingToolbar', {
            				store      : me.storeMedications,
            				displayInfo: true,
            				emptyMsg   : "No Office Notes to display",
            				plugins    : Ext.create('Ext.ux.SlidingPager', {}),

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
	onActive: function
        this.storeMedications.load();(callback) {

		callback(true);
	}
}); //ens servicesPage class