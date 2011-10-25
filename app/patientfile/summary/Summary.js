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
Ext.define('Ext.mitos.panel.patientfile.summary.Summary',{
    extend          : 'Ext.mitos.RenderPanel',
    id              : 'panelSummary',
    pageTitle       : 'Summary',
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