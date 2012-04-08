/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File:
 * Date: 2/18/12
 * Time: 11:09 PM
 */

Ext.define('App.model.fees.EncountersPayments', {
	extend: 'Ext.data.Model',
	fields: [
        {name: 'id', type: 'int'},
        {name: 'payment_method', type: 'string'},
        {name: 'payment_amount', type: 'string'},
        {name: 'paying_entity', type: 'string'},
        {name: 'payment_category', type: 'string'},
        {name: 'check_date', type: 'date', dateFormat:'Y-m-d H:i:s'},
        {name: 'post_to_date', type: 'date', dateFormat:'Y-m-d H:i:s'},
        {name: 'check_number', type: 'int'},
        {name: 'payment_from', type: 'string'},
        {name: 'payment_id', type: 'int'},
        {name: 'deposit_date', type: 'date', dateFormat:'Y-m-d H:i:s'},
        {name: 'note', type: 'string'},
        {name: 'patient_name', type: 'string'},
        {name: 'pid', type: 'int'},
        {name: 'remaining_amount', type: 'string'},
        {name: 'cpt_code', type: 'string'},
        {name: 'charge', type: 'string'},
        {name: 'copay', type: 'string'},
        {name: 'remainder', type: 'string'},
        {name: 'allowed', type: 'string'},
        {name: 'adj_amount', type: 'string'},
        {name: 'deductible', type: 'string'},
        {name: 'takeback', type: 'string'}
	],
    proxy : {
        type: 'direct',
        api : {
            read  : Fees.getEncountersByPayment
        },
        reader     : {
            type: 'json',
            root: 'encounters',
            totalProperty:'totals'
        }
    }
});