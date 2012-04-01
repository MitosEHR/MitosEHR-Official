/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File:
 * Date: 2/18/12
 * Time: 11:09 PM
 */

Ext.define('App.model.fees.Billing', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id', type: 'int '},
        {name: 'fname', type: 'strig'},
        {name: 'lname', type: 'strig'},
        {name: 'mname', type: 'strig'},
        {name: 'ss', type: 'string'}
    ],
    proxy : {
    		type: 'direct',
    		api : {
    			read  : Fees.getPatientList
    		}
    }
});