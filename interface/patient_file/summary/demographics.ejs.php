<?php include_once("../../registry.php"); ?>
<script type="text/javascript">
Ext.onReady(function(){
  var demographicsTabPanels = {
    xtype: 'tabpanel',
    defaults: {style: 'padding:5px'},
    activeTab: 0,
    border:false,
    items: [{
      title: 'Basic Info',
      html:'<p>Placeholder</p>'
    },{
      title: 'Contact info',
      html:'<p>Placeholder</p>'
    },{
      title: 'Choices',
      html:'<p>Placeholder</p>'
    },{
      title: 'Employer',
      html:'<p>Placeholder</p>'
    },{
      title: 'Stats',
      html:'<p>Placeholder</p>'
    },{
      title: 'Primary Insurance',
      html:'<p>Placeholder</p>'
    },{
      title: 'Secondary Insurance',
      html:'<p>Placeholder</p>'
    },{
      title: 'Teritary Insurance',
      html:'<p>Placeholder</p>'
    },{
      title: 'Notes',
      html:'<p>Placeholder</p>'
    }]
  };


	//**************************************************************************************
	//  Center Accordion Panel Items
	//**************************************************************************************
	var billingSumm = {
		title: 'Billing Summary',
		bodyStyle: 'padding:15px; background-color:#ffe4e1',
		html:'<div><p>Balance due: [Balance token]</p></div>'
	};
	var demographicsSumm = {
		title: 'Demographics',
		collapsed: false,
		items: [demographicsTabPanels],
		bbar: [{
		  text: '<?php echo htmlspecialchars( xl('Edit'), ENT_NOQUOTES); ?>',
		  iconCls : 'save'
		}]
	};
	var notesSumm = {
		title: 'Notes',
		html:'<p>Placeholder</p>',
		bbar: [{
      text: '<?php echo htmlspecialchars( xl('Edit'), ENT_NOQUOTES); ?>',
      iconCls : 'save'
    }]
	};
	var disclosuresSumm = {
		title: 'Disclosures',
		html:'<p>Placeholder</p>',
		bbar: [{
      text: '<?php echo htmlspecialchars( xl('Edit'), ENT_NOQUOTES); ?>',
      iconCls : 'save'
    }]
	};
	var vitalsSumm = {
		title: 'Vitals',
		html:'<p>Placeholder</p>',
		bbar: [{
      text: '<?php echo htmlspecialchars( xl('Trend'), ENT_NOQUOTES); ?>',
      iconCls : 'save'
    }]
	};
	//**************************************************************************************
	//  Right Accordion Panel Items
	//**************************************************************************************
	var appointmentsSumm = {
		title: 'Appointments',
		html:'<p>Placeholder</p>',
		bbar: [{
      text: '<?php echo htmlspecialchars( xl('Add'), ENT_NOQUOTES); ?>',
      iconCls : 'save'
    }]
	};
	var medicalProblemsSumm = {
		title: 'Mediacal Problems',
		html:'<p>Placeholder</p>',
		bbar: [{
      text: '<?php echo htmlspecialchars( xl('Edit'), ENT_NOQUOTES); ?>',
      iconCls : 'save'
    }]
	};
	var allergiesSumm = {
		title: 'Allergies',
		html:'<p>Placeholder</p>',
		bbar: [{
      text: '<?php echo htmlspecialchars( xl('Edit'), ENT_NOQUOTES); ?>',
      iconCls : 'save'
    }]
	};
	var mediactionsSumm = {
		title: 'Medications',
		html:'<p>Placeholder</p>',
		bbar: [{
      text: '<?php echo htmlspecialchars( xl('Edit'), ENT_NOQUOTES); ?>',
      iconCls : 'save'
    }]
	};
	var immunizationsSumm = {
		title: 'Immunizations',
		html:'<p>Placeholder</p>',
		bbar: [{
      text: '<?php echo htmlspecialchars( xl('Edit'), ENT_NOQUOTES); ?>',
      iconCls : 'save'
    }]
	};
	var prescriptionsSumm = {
		title: 'Prescriptions',
		html:'<p>Placeholder</p>',
		bbar: [{
      text: '<?php echo htmlspecialchars( xl('Edit'), ENT_NOQUOTES); ?>',
      iconCls : 'save'
    }]
	};
	var centerAccordionPanel = {
		//layout:'accordion',
		border: false,
		layoutConfig: { animate: true},
		defaults:{ layout: 'form', style: 'margin:5px 0', bodyStyle: 'padding:5px', autoScroll: true, collapsible: true, collapsed: true, titleCollapse: true},
		items: [ billingSumm, demographicsSumm, notesSumm, disclosuresSumm, vitalsSumm ]
	};
	var rightAccordionPanel = {
		//layout:'accordion',
		border: false,
		layoutConfig: { animate: true},
		defaults:{ layout: 'form', style: 'margin:5px  0', bodyStyle: 'background-color:#e7e7e7; padding:5px', autoScroll: true, collapsible: true, collapsed: false, titleCollapse: true},
		items: [ appointmentsSumm, medicalProblemsSumm, allergiesSumm, mediactionsSumm, immunizationsSumm, prescriptionsSumm ]
	};
	var centerPanel = {
		title: '[ Patient Name ] Record Summary',
		region:'center',
		autoScroll:true,
		split:true,
		defaults: {style: 'padding:5px' },
		items: [ centerAccordionPanel ]
	};
	var rightPanel = {
		title: 'Sats Summary',
		width: 200,
		region:'east',
		autoScroll:true,
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
		monitorResize	: true,                    		   // <-- Mandatory
		autoWidth			: true,                        	   // <-- Mandatory
		id					  : 'RenderPanel',                     // <-- Mandatory
		renderTo			: Ext.getCmp('TopPanel').body,     // <-- Mandatory
		viewConfig		: {forceFit:true},             	 // <-- Mandatory
		bodyStyle			: 'padding: 10px',
		items				  : [ centerPanel, rightPanel ],
	});
	//*********************************************************************************************************
	// Make sure that the RenderPanel height has the same height of the TopPanel
	// at first run.
	// This is mandatory.
	//*********************************************************************************************************
	Ext.getCmp('RenderPanel').setHeight( Ext.getCmp('TopPanel').getHeight() );

}); // END EXTJS
</script>