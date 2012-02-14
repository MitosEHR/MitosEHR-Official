/**
 * summary.ejs.php
 * Description: Patient Summary
 * v0.0.1
 *
 * Author: Ernesto J Rodriguez
 * Modified: n/a
 *
 * MitosEHR (Electronic Health Records) 2011
 *
 * @namespace Encounter.getVitals
 */
Ext.define('Ext.mitos.view.patientfile.summary.Summary',{
    extend          : 'Ext.mitos.classes.RenderPanel',
    id              : 'panelSummary',
    pageTitle       : 'Patient Summary',
    pageLayout      : 'border',
    initComponent   : function(){
        var me = this;

        Ext.define('SummaryVitalsModel', {
            extend: 'Ext.data.Model',
            fields: [
               'id', 'pid', 'eid', 'uid', 'date', 'weight_lbs', 'weight_kg',
                {name:'height_in', type:'int'},
                {name:'height_cm', type:'int'},
               'bp_systolic', 'bp_diastolic', 'pulse', 'respiration', 'temp_f',
               'temp_c', 'temp_location', 'oxygen_saturation', 'head_circumference_in',
               'head_circumference_cm', 'waist_circumference_in', 'waist_circumference_cm',
               'bmi', 'bmi_status', 'other_notes'
            ],
            proxy: {
                type	    : 'direct',
                api:{
                    read: Encounter.getVitals
                },
                reader: {
                    type			: 'json',
                    root			: 'encounter'
                }
            }
        });

        me.vitalsStore = Ext.create('Ext.data.Store', {
            pageSize	: 10,
            model		: 'SummaryVitalsModel'
        });

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
            itemId      : 'centerPanel',
            defaults    : { margin:'0 5 5 0', bodyPadding:5, collapsible:true, titleCollapse:true },
            items: [{
                title   : 'Billing',
                html    : 'Balance Due: [token]'
            },{
                xtype   : 'form',
                title   : 'Demographics',
                itemId  : 'demoFormPanel',
                listeners:{
                    scope   : me,
                    add   : me.fieldsAdded

                }
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
                title       : 'Vitals',
                autoScroll  : true,
                items:{
                    xtype   : 'dataview',
                    cls     : 'vitals-data',
                    loadMask: false,
                    tpl: '<table>' +
                        '<tr>' +
                            '<tpl for=".">' +
                                '<td>' +
                                    '<div class="column">' +
                                        '<div class="row" style="white-space: nowrap">{date}</div>' +
                                        '<div class="row">{weight_lbs}</div>' +
                                        '<div class="row">{weight_kg}</div>' +
                                        '<div class="row">{height_in}</div>' +
                                        '<div class="row">{height_cm}</div>' +
                                        '<div class="row">{bp_systolic}</div>' +
                                        '<div class="row">{bp_diastolic}</div>' +
                                        '<div class="row">{pulse}</div>' +
                                        '<div class="row">{respiration}</div>' +
                                        '<div class="row">{temp_f}</div>' +
                                        '<div class="row">{temp_c}</div>' +
                                        '<div class="row">{temp_location}</div>' +
                                        '<div class="row">{oxygen_saturation}</div>' +
                                        '<div class="row">{head_circumference_in}</div>' +
                                        '<div class="row">{head_circumference_cm}</div>' +
                                        '<div class="row">{waist_circumference_in}</div>' +
                                        '<div class="row">{waist_circumference_cm}</div>' +
                                        '<div class="row">{bmi}</div>' +
                                        '<div class="row">{bmi_status}</div>' +
                                        '<div class="row">{other_notes}</div>' +
                                    '</div>' +
                                '</td>' +
                            '</tpl>' +
                        '</tr>' +
                     '</table>',
                    itemSelector: 'div.patient-pool-btn',
                    overItemCls: 'patient-over',
                    selectedItemClass: 'patient-selected',
                    singleSelect: true,
                    store: me.vitalsStore
                }
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

    fieldsAdded:function(formPanel){
        this.disableFields(formPanel);

    },

    disableFields:function(formPanel){

        var fields = formPanel.getForm().getFields();

        Ext.each(fields.items, function(field){
            field.setReadOnly(true);

        },this);

    },

    getFormData:function(fornpanel){

        var me = this,
            center = me.down('panel').getComponent('centerPanel'),
            fn;

        if(fornpanel.itemId == 'demoFormPanel'){
            fn = Patient.getPatientDemographicData;
        }


        var formFields = fornpanel.getForm().getFields(),
            modelFields = [];

        Ext.each(formFields.items, function(field){
            modelFields.push({name:field.name, type:'auto'});
        });

        var model = Ext.define( fornpanel.itemId+'Model', {
            extend: 'Ext.data.Model',
            fields: modelFields,
            proxy: {
                type: 'direct',
                api:{
                    read: fn
                }
            }
        });


        var store = Ext.create('Ext.data.Store', {
            model: model
        });


        store.load({
            scope   : me,
            callback: function(records, operation, success){
                fornpanel.getForm().loadRecord(records[0]);
            }
        });


        /**
         * load the vitals store to render the vitals data view
         */
        me.vitalsStore.load();

    },


    /**
     * This function is called from MitosAPP.js when
     * this panel is selected in the navigation panel.
     * place inside this function all the functions you want
     * to call every this panel becomes active
     */
    onActive:function(callback){
        var me = this;
        if(this.checkIfCurrPatient()){
            var patient = me.getCurrPatient();
            this.updateTitle( patient.name + ' - #' + patient.pid + ' (Patient Summary)');

            var center = me.down('panel').getComponent('centerPanel'),
                demoFormPanel = center.getComponent('demoFormPanel');

            this.getFormItems(demoFormPanel, 'Demographics', function(success){
                if(success){
                    me.getFormData(demoFormPanel);

                }
            });

        }else{

            callback(false);
            me.currPatientError();
        }
    }

});