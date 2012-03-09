/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File:
 * Date: 2/18/12
 * Time: 11:09 PM
 */

Ext.define('App.model.patientfile.Allergies', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'type', type: 'string'},
		{name: 'title', type: 'string'},
		{name: 'administered_date', type: 'string'},
		{name: 'diagnosis_code', type: 'string'},
		{name: 'begin_date', type: 'date', dateFormat: 'c'},
		{name: 'end_date', type: 'date', dateFormat: 'c'},
		{name: 'ocurrence', type: 'string'},
		{name: 'reaction', type: 'string'},
		{name: 'referred_by', type: 'string'},
		{name: 'outcome', type: 'string'},
		{name: 'destination', type: 'string'}
	],
	proxy : {
		type: 'direct',
		api : {
			read  : Medical.getPatientAllergies,
			create: Medical.addPatientAllergy
		}
	}
});