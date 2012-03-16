/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File:
 * Date: 2/18/12
 * Time: 11:09 PM
 */
Ext.define('App.model.patientfile.CptCodesGrid', {
	extend : 'Ext.data.Model',
	fields : [
		{name: 'code', type: 'float'},
		{name: 'code_text', type: 'string'}
	],
	proxy  : {
		type       : 'direct',
		api        : {
			read: Services.getCptCodesBySelection
		},
		reader     : {
			type: 'json',
			root: 'codes'
		}
	}
});