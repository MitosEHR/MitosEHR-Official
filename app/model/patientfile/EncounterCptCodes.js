/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File:
 * Date: 2/18/12
 * Time: 11:09 PM
 */
Ext.define('App.model.patientfile.EncounterCptCodes', {
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
            read: Encounter.getEnconterCptCodes,
            create: Encounter.addEnconterCptCodes,
            update: Encounter.updateEnconterCptCodes,
            destroy: Encounter.deleteEnconterCptCodes
        },
        reader: {
            type         : 'json',
            root         : 'rows',
            totalProperty: 'totals'
        }
    },
    belongsTo: { model: 'App.model.patientfile.Encounter', foreignKey: 'eid' }
});