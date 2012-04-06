/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File:
 * Date: 2/18/12
 * Time: 11:09 PM
 */
Ext.define('App.model.patientfile.QRCptCodes', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'eid', type: 'int'},
        {name: 'code', type: 'strig'},
        {name: 'code_text', type: 'string'},
        {name: 'code_text_medium', type: 'string'},
        {name: 'place_of_service', type: 'string'},
        {name: 'emergency', type: 'string'},
        {name: 'charge', type: 'string'},
        {name: 'days_of_units', type: 'string'},
        {name: 'essdt_plan', type: 'string'},
        {name: 'modifiers', type: 'string'}
    ],
    proxy : {
        type  : 'direct',
        api   : {
            read: Services.getCptCodes
        },
        reader: {
            root         : 'rows',
            totalProperty: 'totals'
        }
    }
});