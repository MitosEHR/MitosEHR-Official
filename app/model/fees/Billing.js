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
        {name: 'criteria_id', type: 'strig'},
        {name: 'criteria_description', type: 'string'},
        {name: 'criteria_description_medium', type: 'string'}
    ],
    proxy : {
        type  : 'direct',
        api   : {
            read: Services.getCptCodesBySelection
        },
        reader: {
            type         : 'json',
            root         : 'rows',
            totalProperty: 'totals'
        }
    }
});