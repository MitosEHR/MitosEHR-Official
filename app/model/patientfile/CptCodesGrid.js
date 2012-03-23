/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File:
 * Date: 2/18/12
 * Time: 11:09 PM
 */
Ext.define('App.model.patientfile.CptCodesGrid', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id', type: 'int '},
        {name: 'code', type: 'strig'},
        {name: 'code_text', type: 'string'},
        {name: 'code_text_medium', type: 'string'},
        {name: 'summary', type: 'string'},
        {name: 'modifiers', type: 'string', defaultValue: ''}
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