/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File:
 * Date: 2/18/12
 * Time: 11:09 PM
 */
Ext.define('App.model.patientfile.PreventiveCare', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'id', type: 'int'},
		{name: 'description'},
		{name: 'alert', type: 'bool'}
	],
	proxy : {
		type: 'direct',
		api : {
			read  : PreventiveCare.getPreventiveCareCheck
		}
	}
});