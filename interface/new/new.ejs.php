<?php 
include_once("../globals.php");
?>
<script type="text/javascript">

Ext.onReady(function(){

	//*********************************************************************************************************
	// Patient Basic Information Form
	//*********************************************************************************************************
	var formPBI = new Ext.FormPanel({
		labelWidth		: 75, // label settings here cascade unless overridden
        url				:'data_create.ejs.php',
        frame			:true,
        bodyStyle		:'padding:5px 5px 0',
        defaults		: {width: 230},
        defaultType		: 'textfield',
		items: [{
                fieldLabel: 'First Name',
                name: 'first',
                allowBlank:false
            },{
                fieldLabel: 'Last Name',
                name: 'last'
            },{
                fieldLabel: 'External ID',
                name: 'external_id'
            }, {
                fieldLabel: 'Email',
                name: 'email',
                vtype:'email'
            }]
	});

	//*********************************************************************************************************
	// Patient Demographics Tab Segregated
	//*********************************************************************************************************
    var RenderPanel = new Ext.TabPanel({
		title: 'Patient Search or Add Patient',
		id	: 'RenderPanel',
        renderTo: Ext.getCmp('TopPanel').body,
        autoWidth: true,
		border	: false,
		stateful: true,
		monitorResize: true,
		viewConfig:{forceFit:true},
        activeTab: 0,
		items: [{
			title: '<?php xl('Patient Basic Information','e');?>',
			items	: [formPBI]
		},{
			title: '<?php xl('Contact Information','e');?>',
			html: 'Another one'
		},{
			title: '<?php xl('Choices','e');?>',
			html: 'Another one'
		},{
			title: '<?php xl('Employer','e');?>',
			html: 'Another one'
		},{
			title: '<?php xl('Statistics','e');?>',
			html: 'Another one'
		},{
			title: '<?php xl('Insurance Information','e');?>',
			html: 'Another one'
		}],
		bbar:[{
			text		:'<?php echo htmlspecialchars( xl('Save'), ENT_NOQUOTES); ?>',
			iconCls		: 'save',
			ref			: '../paSave',
			formBind	: true,
			disabled	: true
		},'-',{
			text		:'<?php echo htmlspecialchars( xl('Search Patient'), ENT_NOQUOTES); ?>',
			iconCls		: 'searchUsers',
			ref			: '../paSave',
			formBind	: true,
			disabled	: false
		}]
    });

	//*********************************************************************************************************
	// Make sure that the RenderPanel height has the same height of the TopPanel
	// at first run.
	//*********************************************************************************************************
	Ext.getCmp('RenderPanel').setHeight( Ext.getCmp('TopPanel').getHeight() );

}); // END EXTJS

</script>