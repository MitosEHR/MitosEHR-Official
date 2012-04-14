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


		me.callParent(arguments);
	}, // end of initComponent




	/**
	 * This function is called from MitosAPP.js when
	 * this panel is selected in the navigation panel.
	 * place inside this function all the functions you want
	 * to call every this panel becomes active
	 */
	onActive: function(callback) {

		callback(true);
	}
}); //ens servicesPage class