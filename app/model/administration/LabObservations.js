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
		{name: 'lab_id' },
		{name: 'label' },
		{name: 'name' },
		{name: 'unit' },
		{name: 'range_start' },
		{name: 'range_end' },
		{name: 'threshold' },
		{name: 'notes' }
	]

});