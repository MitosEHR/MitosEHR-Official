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
delete Ext.mitos.Panel;
Ext.onReady(function(){
	Ext.define('Ext.mitos.Panel',{
        extend          : 'Ext.mitos.RenderPanel',
        pageTitle       : '<?php echo $_SESSION['patient']['name'].' '; i18n('(Summary)'); ?>',
        pageLayout      : 'border',
        initComponent   : function(){
            this.pageBody = [{
                region      : 'east',
                width       : 300,
                bodyPadding : 0,
                frame       : false,
                border      : false,
                defaults    : { margin:'0 0 5 5', bodyPadding:5, collapsible:true, titleCollapse:true },
                items: [{
                    title   : 'Clinical Reminders',
                    html    : 'Panel content!'
                },{
                    title   : 'Appointments',
                    html    : 'Panel content!'
                },{
                    title   : 'Medical Problems',
                    html    : 'Panel content!'
                },{
                    title   : 'Allergies',
                    html    : 'Panel content!'
                },{
                    title   : 'Medications',
                    html    : 'Panel content!'
                },{
                    title   : 'Immunizations',
                    html    : 'Panel content!'
                },{
                    title   : 'Prescriptions',
                    html    : 'Panel content!'
                }]
            },{
                region      : 'center',
                bodyPadding : 0,
                frame       : false,
                border      : false,
                defaults    : { margin:'0 5 5 0', bodyPadding:5, collapsible:true, titleCollapse:true },
                items: [{
                    title   : 'Billing',
                    html    : 'Balance Due: [token]'
                },{
                    title   : 'Demographics',
                    html    : 'Panel content!'
                },{
                    title   : 'Notes',
                    html    : 'Panel content!'
                },{
                    title   : 'Patient Reminders',
                    html    : 'Panel content!'
                },{
                    title   : 'Disclosure',
                    html    : 'Panel content!'
                },{
                    title   : 'Vitals',
                    html    : 'Panel content!'
                }]
            }];
            this.callParent(arguments);
        } // end initComponent
    }); // end Ext.mitos.Page class
    MitosPanel = Ext.create('Ext.mitos.Panel');
}); // end ExtJS
</script>