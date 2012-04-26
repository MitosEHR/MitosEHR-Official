/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File:
 * Date: 2/18/12
 * Time: 11:09 PM
 */


Ext.define('App.model.administration.LabObservations', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'id' },
        {name: 'label' },
		{name: 'parent_id' },
		{name: 'parent_loinc' },
		{name: 'parent_name' },
		{name: 'sequence' },
		{name: 'loinc_number' },
		{name: 'loinc_name' },
		{name: 'default_unit' },
		{name: 'required_in_panel' },
		{name: 'threshold' }
	]

});