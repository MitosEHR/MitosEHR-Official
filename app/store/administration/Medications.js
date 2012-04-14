/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File:
 * Date: 2/18/12
 * Time: 11:09 PM
 */


Ext.define('App.store.administration.Medications', {
	model: 'App.model.administration.Medications',
	extend: 'Ext.data.Store',
	proxy: {
		type       : 'direct',
		api        : {
			read  : Services.getMedications,
			create: Services.addMedications,
			destroy: Services.removeMedications
		},
		reader     : {
			totalProperty: 'totals',
			root         : 'rows'
		}
	},
	autoLoad  : false
});