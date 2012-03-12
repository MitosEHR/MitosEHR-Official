/**
 * Encounter.ejs.php
 * Encounter Panel
 * v0.0.1
 *
 * Author: Ernesto J. Rodriguez
 * Modified:
 *
 * MitosEHR (Electronic Health Records) 2011
 *
 * @namespace Encounter.getEncounter
 * @namespace Encounter.createEncounter
 * @namespace Encounter.checkOpenEncounters
 * @namespace Encounter.closeEncounter
 * @namespace Encounter.getVitals
 * @namespace Encounter.addVitals
 */
Ext.define('App.view.patientfile.Vitals', {
	extend           : 'Ext.view.View',
    alias            : 'widget.vitalsdataview',
    cls              : 'vitals-data',
    itemSelector     : 'div.patient-pool-btn',
    overItemCls      : 'patient-over',
    selectedItemClass: 'patient-selected',
    loadMask         : false,
    singleSelect     : true,
	requires         : [
		'App.store.patientfile.Vitals'
	],
	initComponent: function() {
		var me = this;

        me.tpl = '<table>' +
            '<tr>' +
            '<tpl for=".">' +
            '<td>' +
            '<div class="column">' +
            '<div class="row" style="white-space: nowrap">{[Ext.Date.format(values.date, "Y-m-d H:i:s")]}</div>' +
            '<div class="row">{weight_lbs}</div>' +
            '<div class="row">{weight_kg}</div>' +
            '<div class="row">{height_in}</div>' +
            '<div class="row">{height_cm}</div>' +
            '<div class="row">{bp_systolic}</div>' +
            '<div class="row">{bp_diastolic}</div>' +
            '<div class="row">{pulse}</div>' +
            '<div class="row">{respiration}</div>' +
            '<div class="row">{temp_f}</div>' +
            '<div class="row">{temp_c}</div>' +
            '<div class="row">{temp_location}</div>' +
            '<div class="row">{oxygen_saturation}</div>' +
            '<div class="row">{head_circumference_in}</div>' +
            '<div class="row">{head_circumference_cm}</div>' +
            '<div class="row">{waist_circumference_in}</div>' +
            '<div class="row">{waist_circumference_cm}</div>' +
            '<div class="row">{bmi}</div>' +
            '<div class="row">{bmi_status}</div>' +
            '<div class="row">{other_notes}</div>' +
            '<div class="row">{administer}</div>' +
            '</div>' +
            '</td>' +
            '</tpl>' +
            '</tr>' +
        '</table>';

		me.callParent(arguments);
	}

});
