/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File:
 * Date: 2/18/12
 * Time: 11:09 PM
 */
Ext.define('App.model.patientfile.Vitals', {
	extend   : 'Ext.data.Model',
	fields   : [
		'id', 'pid', 'eid', 'uid', 'date', 'weight_lbs', 'weight_kg',
		{name: 'height_in', type: 'int'},
		{name: 'height_cm', type: 'int'},
		'bp_systolic', 'bp_diastolic', 'pulse', 'respiration', 'temp_f',
		'temp_c', 'temp_location', 'oxygen_saturation', 'head_circumference_in',
		'head_circumference_cm', 'waist_circumference_in', 'waist_circumference_cm',
		'bmi', 'bmi_status', 'other_notes'
	],
	proxy    : {
		type       : 'direct',
		api        : {
			read: Encounter.getVitals
		},
		reader     : {
			type: 'json',
			root: 'encounter'
		}
	}
});