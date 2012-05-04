/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File:
 * Date: 2/18/12
 * Time: 11:09 PM
 */
Ext.define('App.model.patientfile.ImmunizationCheck', {
	extend: 'Ext.data.Model',
	fields: [
        {name: 'id', type: 'int'},
        {name: 'pid', type: 'int'},
        {name: 'code', type: 'int'},
		{name: 'code_text', type: 'string'},
		{name: 'alert', type: 'bool'}

	],
	proxy : {
		type: 'direct',
		api : {
			read: PreventiveCare.getImmunizationsCheck
		}
	}
});