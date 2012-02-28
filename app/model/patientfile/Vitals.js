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
		{name: 'id', type: 'int'},
		{name: 'pid', type: 'int'},
		{name: 'eid', type: 'int'},
		{name: 'uid', type: 'int'},
		{name: 'date', type: 'date', dateFormat:'Y-m-d H:i:s' },
		{name: 'weight_lbs', type: 'int', useNull:true},
		{name: 'weight_kg', type: 'int', useNull:true},
		{name: 'height_in', type: 'int', useNull:true},
		{name: 'height_cm', type: 'int', useNull:true},
		{name: 'bp_systolic', type: 'int', useNull:true},
		{name: 'bp_diastolic', type: 'int', useNull:true},
		{name: 'pulse', type: 'int', useNull:true},
		{name: 'respiration', type: 'int', useNull:true},
		{name: 'temp_f', type: 'int', useNull:true},
		{name: 'temp_c', type: 'int', useNull:true},
		{name: 'temp_location', type: 'string'},
		{name: 'oxygen_saturation', type: 'int', useNull:true},
		{name: 'head_circumference_in', type: 'int', useNull:true},
		{name: 'head_circumference_cm', type: 'int', useNull:true},
		{name: 'waist_circumference_in', type: 'int', useNull:true},
		{name: 'waist_circumference_cm', type: 'int', useNull:true},
		{name: 'bmi', type: 'int', useNull:true},
		{name: 'bmi_status', type: 'int, useNull:true'},
		{name: 'other_notes', type: 'string'},
		{name: 'administer', type: 'string'}

	],
	proxy    : {
		type       : 'direct',
		api        : {
			read: Encounter.getVitals
		},
		reader     : {
			type: 'json'
		}
	},
    belongsTo: { model: 'App.model.patientfile.Encounter', foreignKey: 'eid' }

});