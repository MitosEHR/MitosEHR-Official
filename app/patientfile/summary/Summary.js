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
    pageTitle       : 'Patient Summary',
    pageLayout      : 'border',
    initComponent   : function(){
        var me = this;

        me.pageBody = [{
            xtype       : 'container',
            region      : 'east',
            width       : 300,
            bodyPadding : 0,
            frame       : false,
            border      : false,
            defaults    : { margin:'0 0 5 0', bodyPadding:5, collapsible:true, titleCollapse:true },
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
            xtype       : 'container',
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

        me.callParent(arguments);

        me.down('panel').addDocked([{
            xtype   : 'toolbar',
            dock    : 'top',
            items:[{
                text      	: 'History',
                iconCls   	: 'icoListOptions',
                handler: function() {

                }
            },'-',{
                text      	: 'Reports',
                iconCls   	: 'icoListOptions',
                handler: function() {

                }
            },'-',{
                text      	: 'Documents',
                iconCls   	: 'icoListOptions',
                handler: function() {

                }
            },'-',{
                text      	: 'Transactionstory',
                iconCls   	: 'icoListOptions',
                handler: function() {

                }
            },'-',{
                text      	: 'Issues',
                iconCls   	: 'icoListOptions',
                handler: function() {

                }
            },'->',{
                text      	: 'Edit Demographics',
                iconCls   	: 'icoListOptions',
                handler: function() {

                }
            }]
        }]);

    },


    /**
     * This function is called from MitosAPP.js when
     * this panel is selected in the navigation panel.
     * place inside this function all the functions you want
     * to call every this panel becomes active
     */
    onActive:function(){
        if(this.checkIfCurrPatient()){
            var patient = this.getCurrPatient();
            this.updateTitle( patient.name + ' (Patient Summary)');
        }else{
            this.currPatientError();
            this.goBack();
        }
    }

});