/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File:
 * Date: 2/18/12
 * Time: 11:09 PM
 */
Ext.define('App.model.patientfile.Immunization', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'code', type: 'int'},
		{name: 'code_text', type: 'string'}

	],
	proxy : {
		type: 'direct',
		api : {
			read: Immunization.getImmunizationsList
		}
	}
});