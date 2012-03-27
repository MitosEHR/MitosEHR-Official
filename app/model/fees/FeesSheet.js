/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File:
 * Date: 2/18/12
 * Time: 11:09 PM
 */

Ext.define('App.model.fees.FeesSheet', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'id', type: 'int'},
		{name: 'time', type: 'string'},
		{name: 'facility', type: 'string'},
		{name: 'clinical_summary_provided', type: 'string'},
		{name: 'elegibility_confirmed', type: 'string'},
		{name: 'medical_reconciliation', type: 'string'},
		{name: 'push_to_exchange', type: 'string'},
		{name: 'note', type: 'string'},
		{name: 'reminder', type: 'string'}
	],
	proxy : {
		type: 'direct',
		api : {

		}
	}
});