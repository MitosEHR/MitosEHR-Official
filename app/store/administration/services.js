/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File:
 * Date: 2/18/12
 * Time: 11:11 PM
 */

Ext.define('App.store.patientfile.Allergies', {
	extend: 'Ext.data.Store',
	model     : 'App.model.patientfile.Allergies',
	remoteSort: true,
	autoLoad  : false
});

Ext.define('App.store.administration.', {
	model: 'ServiceModel',
	proxy: {
		type       : 'direct',
		api        : {
			read  : Services.getServices,
			create: Services.addService,
			update: Services.updateService
		},
		reader     : {
			totalProperty: 'totals',
			root         : 'rows'
		},
		extraParams: {
			code_type: me.code_type,
			query    : me.query,
			active   : me.active
		}
	},

	remoteSort: true,
	autoLoad  : false
});