<?php
//******************************************************************************
// summary.ejs.php
// Description: Patient Summary
// v0.0.1
//
// Author: Ernesto J Rodriguez
// Modified: n/a
//
// MitosEHR (Electronic Health Records) 2011
//**********************************************************************************
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');
include_once($_SESSION['site']['root']."/classes/I18n.class.php");

//**********************************************************************************
// Reset session count 10 secs = 1 Flop
//**********************************************************************************
$_SESSION['site']['flops'] = 0;
?>
<script type="text/javascript">
delete Ext.mitos.Page;
Ext.onReady(function(){
	Ext.define('Ext.mitos.Page',{
		extend:'Ext.panel.Panel',
		uses:[
			'Ext.*',
			'Ext.mitos.RenderPanel'
		],
		initComponent: function(){
            var page = this;
            
            page.SummaryLeft = new Ext.panel.Panel({
                region:'east',
                width: 300,
                bodyPadding:0,
                border: false,
                defaults:{margin:'0 0 5 5', bodyPadding:5, collapsible:true, titleCollapse:true},
                items: [{
                    
                    title: 'Clinical Reminders',
                    html: 'Panel content!'
                },{
                    title: 'Appointments',
                    html: 'Panel content!'
                },{
                    title: 'Medical Problems',
                    html: 'Panel content!'
                },{
                    title: 'Allergies',
                    html: 'Panel content!'
                },{
                    title: 'Medications',
                    html: 'Panel content!'
                },{
                    title: 'Immunizations',
                    html: 'Panel content!'
                },{
                    title: 'Prescriptions',
                    html: 'Panel content!'
                }]

            });

            page.SummaryBody = new Ext.panel.Panel({
                region: 'center',
                bodyPadding:0,
                border: false,
                defaults:{margin:'0 5 5 0', bodyPadding:5, collapsible:true, titleCollapse:true, collapsed:true},
                items: [{
                    title: 'Billing',
                    html: 'Balance Due: [token]'
                },{
                    title: 'Demographics',
                    html: 'Panel content!'
                },{
                    title: 'Notes',
                    html: 'Panel content!'
                },{
                    title: 'Patient Reminders',
                    html: 'Panel content!'
                },{
                    title: 'Disclosure',
                    html: 'Panel content!'
                },{
                    title: 'Vitals',
                    html: 'Panel content!'
                }]
            });
            
            //***********************************************************************************
            // Top Render Panel
            // This Panel needs only 3 arguments...
            // PageTitle 	- Title of the current page
            // PageLayout 	- default 'fit', define this argument if using other than the default value
            // PageBody 	- List of items to display [form1, grid1, grid2]
            //***********************************************************************************
            new Ext.create('Ext.mitos.RenderPanel', {
                pageTitle   : '<?php echo $_SESSION['patient']['name'].' '; i18n('(Summary)'); ?>',
                pageLayout: 'border',
                pageBody: [page.SummaryLeft, page.SummaryBody]
            });
            page.callParent(arguments);
        } /// end initComponent
    }); // end PatientSummaryPage class
    Ext.create('Ext.mitos.Page');
}); // end ExtJS
</script>