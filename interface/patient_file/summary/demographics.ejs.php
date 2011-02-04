<?php include_once("../../registry.php"); ?>
<script type="text/javascript">
Ext.onReady(function(){
	//**************************************************************************************
	//  Center Accordion Panel Items
	//**************************************************************************************
	var billingSumm = {
		title: 'Billing',
		html:'<p>Placeholder</p>'
	};
	var demographicsSumm = {
		title: 'Demographics',
		html:'<p>Placeholder</p>'
	};
	var notesSumm = {
		title: 'Notes',
		html:'<p>Placeholder</p>'
	};
	var disclosuresSumm = {
		title: 'Disclosures',
		html:'<p>Placeholder</p>'
	};
	var vitalsSumm = {
		title: 'Vitals',
		html:'<p>Placeholder</p>'
	};
	//**************************************************************************************
	//  Right Accordion Panel Items
	//**************************************************************************************
	var appointmentsSumm = {
		title: 'Appointments',
		html:'<p>Placeholder</p>'
	};
	var medicalProblemsSumm = {
		title: 'Mediacal Problems',
		html:'<p>Placeholder</p>'
	};
	var allergiesSumm = {
		title: 'Allergies',
		html:'<p>Placeholder</p>'
	};
	var mediactionsSumm = {
		title: 'Medications',
		html:'<p>Placeholder</p>'
	};
	var immunizationsSumm = {
		title: 'Immunizations',
		html:'<p>Placeholder</p>'
	};
	var prescriptionsSumm = {
		title: 'Prescriptions',
		html:'<p>Placeholder</p>'
	};
	var centerAccordionPanel = {
		layout:'accordion',
		border: false,
		layoutConfig: { animate: true},
		defaults:{border: false, autoScroll: true},
		items: [ billingSumm, demographicsSumm, notesSumm, disclosuresSumm, vitalsSumm ]
	};
	var rightAccordionPanel = {
		layout:'accordion',
		layoutConfig: { animate: true},
		defaults:{border: false, autoScroll: true},
		items: [ appointmentsSumm, medicalProblemsSumm, allergiesSumm, mediactionsSumm, immunizationsSumm, prescriptionsSumm ]
	};
	var centerPanel = {
		title: '[ Patient Name ] Record Summary',
		region:'center',
		split:true,
		defaults: {style: 'padding:5px'},
		items: [ centerAccordionPanel ]
	};
	var rightPanel = {
		title: 'Sats Summary',
		width: 200,
		region:'east',
		split:true,
		defaults: {style: 'padding:5px'},
		items: [ rightAccordionPanel ]
	};
	//*******************************************************************************************************
	// Render demographic panel
	//*******************************************************************************************************
	var RenderPanel = new Ext.Panel({
		layout				: 'border',
		border  			: false,
		stateful			: true,
		monitorResize		: true,                    		// <-- Mandatory
		autoWidth			: true,                        	// <-- Mandatory
		id					: 'RenderPanel',                // <-- Mandatory
		renderTo			: Ext.getCmp('TopPanel').body,  // <-- Mandatory
		viewConfig			: {forceFit:true},             	// <-- Mandatory
		bodyStyle			: 'padding: 10px',
		items				: [ centerPanel, rightPanel ],
	});
	//*********************************************************************************************************
	// Make sure that the RenderPanel height has the same height of the TopPanel
	// at first run.
	// This is mandatory.
	//*********************************************************************************************************
	Ext.getCmp('RenderPanel').setHeight( Ext.getCmp('TopPanel').getHeight() );

}); // END EXTJS
</script>