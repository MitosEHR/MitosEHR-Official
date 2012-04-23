 /**
 * Created by JetBrains PhpStorm.
 * User: Omar U. Rodriguez (Certun)
 * File:
 * Date: 2/18/12
 * Time: 11:09 PM
 */

Ext.define('App.model.patientfile.Reminders', {
	extend: 'Ext.data.Model',
	fields: [

		{name: 'id', type: 'int'},
		{name: 'eid', type: 'int'},
		{name: 'pid', type: 'int'},
		{name: 'uid', type: 'int'},
		{name: 'date', type: 'date'},
		{name: 'body', type: 'string'},
		{name: 'type', type: 'string'},
        {name: 'user_name', type: 'string'}
	],
	proxy : {
		type: 'direct',
		api : {
			read  : Patient.getPatientReminders
		}
	}
});

