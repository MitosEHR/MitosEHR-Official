/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File:
 * Date: 2/18/12
 * Time: 11:09 PM
 */
Ext.define('App.model.patientfile.Encounter', {
	extend : 'Ext.data.Model',
	fields : [
		{name: 'eid', type: 'int'},
		{name: 'pid', type: 'int'},
		{name: 'open_uid', type: 'string'},
		{name: 'close_uid', type: 'string'},
		{name: 'brief_description', type: 'string'},
		{name: 'visit_category', type: 'string'},
		{name: 'facility', type: 'string'},
		{name: 'billing_facility', type: 'string'},
		{name: 'sensitivity', type: 'string'},
		{name: 'start_date', type: 'string'},
		{name: 'close_date', type: 'string'},
		{name: 'onset_date', type: 'string'}
	],
	proxy  : {
		type       : 'direct',
		api        : {
			read: Encounter.getEncounter
		},
		reader     : {
			type: 'json'
			//root: 'encounter'
		}
	},
    hasMany: [
        {model: 'App.model.patientfile.Vitals', name: 'vitals', primaryKey: 'eid'}
    ]
});