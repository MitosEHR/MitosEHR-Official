/**
 * Encounter.ejs.php
 * Encounter Panel
 * v0.0.1
 *
 * Author: Ernesto J. Rodriguez
 * Modified:
 *
 * MitosEHR (Electronic Health Records) 2011
 *
 * @namespace Encounter.getEncounter
 * @namespace Encounter.createEncounter
 * @namespace Encounter.ckOpenEncounters
 * @namespace Encounter.closeEncounter
 * @namespace Encounter.getVitals
 * @namespace Encounter.addVitals
 */
Ext.define('App.view.patientfile.ProgressNote', {
	extend           : 'Ext.panel.Panel',
    alias            : 'widget.progressnote',
    loadMask         : false,
	initComponent: function() {
		var me = this;

        me.tpl = new Ext.XTemplate(
            '<div class="progressNote">' +
            '   <div class="title">{patient_name} - #{pid} - {start_date}</div>' +
            '   <div class="secession">' +
            '       <div class="title"> Review of System Checks </div>' +
            '       <tpl for="reviewofsystems">' +
            '           <tpl if="this.isNotNull(value)">' +
            '               <div class="pblock"> {name}: {value} </div>' +
            '           </tpl>' +
            '       </tpl>' +
            '   </div>' +
            '   <div class="secession">' +
            '       <div class="title"> Review of System Checks </div>' +
            '       <tpl for="reviewofsystemschecks">' +
            '           <tpl if="this.isNotNull(value)">' +
            '               <div class="pblock"> {name}: {value} </div>' +
            '           </tpl>' +
            '       </tpl>' +
            '   </div>' +
            '   <tpl for="soap">' +
            '       <div class="secession">' +
            '           <div class="title"> SOAP </div>' +
            '           <p><span>Subjective:</span> {subjective} </p>' +
            '           <p><span>Objective:</span> {objective}</p>' +
            '           <p><span>Assessment:</span> {assessment}</p>' +
            '           <p><span>Plan:</span> {plan}</p>' +
            '       </div>' +
            '   </tpl>' +
            '   <tpl for="speechdictation">' +
            '       <div class="secession">' +
            '           <div class="title"> Speech Dictation </div>' +
            '           <p><span>Dictation:</span> {dictation}</p>' +
            '           <p><span>Additional Notes:</span> {additional_notes}</p>' +
            '       </div>' +
            '   </tpl>' +
            '</div>',
            {
            isNotNull: function(value){
                return value != 'null' && value != null;
            }
        });

		me.callParent(arguments);
	}

});
