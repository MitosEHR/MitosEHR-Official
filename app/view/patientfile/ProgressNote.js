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

        me.tpl = '' +
            '<div class="progressNote">' +
            '   <div class="title"> [patient name] - [date - time]</div>' +
            '   <div class="section">' +
            '       <div class="title"> Review of System </div>' +
            '       <div class="body"> [Content Placeholder] </div>' +
            '   </div>' +
            '   <div class="section">' +
            '       <div class="title"> Review of System Checks </div>' +
            '       <div class="body"> [Content Placeholder] </div>' +
            '   </div>' +
            '   <div class="section">' +
            '       <div class="title"> Subjective </div>' +
            '       <div class="body"> [Content Placeholder] </div>' +
            '   </div>' +
            '   <div class="section">' +
            '       <div class="title"> Objective </div>' +
            '       <div class="body"> [Content Placeholder] </div>' +
            '   </div>' +
            '   <div class="section">' +
            '       <div class="title"> Assessment </div>' +
            '       <div class="body"> [Content Placeholder] </div>' +
            '   </div>' +
            '   <div class="section">' +
            '       <div class="title"> Plan </div>' +
            '       <div class="body"> [Content Placeholder] </div>' +
            '   </div>' +
            '   <div class="section">' +
            '       <div class="title"> Speech Dictation </div>' +
            '       <div class="body"> [Content Placeholder] </div>' +
            '   </div>' +
            '</div>';

		me.callParent(arguments);
	}

});
