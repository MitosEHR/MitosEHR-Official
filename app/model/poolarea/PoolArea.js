/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File:
 * Date: 2/18/12
 * Time: 11:09 PM
 * @namespace Patient.getPatientsByPoolArea
 */
Ext.define('App.model.poolarea.PoolArea', {
	extend   : 'Ext.data.Model',
	fields   : [
		{name: 'name', type: 'string'},
		{name: 'shortName', type: 'string'},
		{name: 'pid', type: 'int'},
		{name: 'eid', type: 'int'},
		{name: 'pic', type: 'string'}

	],
	proxy    : {
		type       : 'direct',
		api        : {
			read: Patient.getPatientsByPoolArea
		}
	}
});