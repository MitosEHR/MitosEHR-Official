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
Ext.define('App.view.patientfile.Summary', {
    extend       : 'App.classes.RenderPanel',
    id           : 'panelSummary',
    pageTitle    : 'Patient Summary',
    pageLayout   : {
        type : 'hbox',
        align: 'stretch'
    },
    initComponent: function() {
        var me = this;

        me.vitalsStore = Ext.create('App.store.patientfile.Vitals');
        me.qrCodeWindow = Ext.create('App.view.patientfile.QrCodeWindow');

        me.immuCheckListStore = Ext.create('App.store.patientfile.ImmunizationCheck');


        me.patientAllergiesListStore = Ext.create('App.store.patientfile.Allergies');
        me.patientMedicalIssuesStore = Ext.create('App.store.patientfile.MedicalIssues');
        me.patientSurgeryStore = Ext.create('App.store.patientfile.Surgery');
        me.patientDentalStore = Ext.create('App.store.patientfile.Dental');
        me.patientMedicationsStore = Ext.create('App.store.patientfile.Medications');


        me.patientNotesStore = Ext.create('App.store.patientfile.Notes');
        me.patientRemindersStore = Ext.create('App.store.patientfile.Reminders');

        me.pageBody = [
            {
                xtype      : 'container',
                flex       : 1,
                bodyPadding: 0,
                frame      : false,
                border     : false,
                itemId     : 'centerPanel',
                defaults   : { margin: '0 0 5 0', bodyPadding: 5, collapsible: true, titleCollapse: true },
                items      : [
                    {
                        xtype:'panel',
                        action:'balance',
                        title: 'Billing',
                        html:'Account Balance: '

                    },
                    {
                        xtype : 'form',
                        title : 'Demographics',
                        itemId: 'demoFormPanel'
                    },
                    {
                        title      : 'Notes',
                        itemId     : 'notesPanel',
                        xtype      : 'grid',
                        bodyPadding: 0,
                        store      : me.patientNotesStore,
                        columns    : [
                            {
                                text     : 'Date',
                                dataIndex: 'date'
                            },
                            {
                                header   : 'Type',
                                dataIndex: 'type'
                            },
                            {
                                text     : 'Note',
                                dataIndex: 'body',
                                flex     : 1
                            },
                            {
                                text     : 'User',
                                dataIndex: 'user_name'
                            }
                        ]

                    },
                    {
                        title      : 'Reminders',
                        itemId     : 'remindersPanel',
                        xtype      : 'grid',
                        bodyPadding: 0,
                        store      : me.patientRemindersStore,
                        columns    : [
                            {
                                text     : 'Date',
                                dataIndex: 'date'
                            },
                            {

                                header   : 'Type',
                                dataIndex: 'type'
                            },
                            {
                                text     : 'Note',
                                dataIndex: 'body',
                                flex     : 1
                            },
                            {
                                text     : 'User',
                                dataIndex: 'user_name'
                            }
                        ]

                    },
                    {
                        title: 'Disclosure',
                        html : 'Panel content!'
                    },
                    {
                        title     : 'Vitals',
                        autoScroll: true,
                        bodyPadding: 0,
                        items     : {
                            xtype: 'vitalsdataview',
                            store: me.vitalsStore
                        }
                    }
                ]
            },
            {
                xtype      : 'container',
                width      : 250,
                bodyPadding: 0,
                frame      : false,
                border     : false,
                defaults   : {
                    layout: 'fit',
                    margin: '0 0 5 5'
                },
                listeners  : {
                    scope      : me,
                    afterrender: me.afterRightCol
                },
                items      : [
                    {
                        action  : 'patientImgs',
                        layout  : 'hbox',
                        defaults: {flex: 1},
                        tbar    : [
                            {
                                text: 'Print'
                            },
                            '->',
                            {
                                text: 'Update'

                            }

                        ]
                    },
                    {
                        title      : 'Active Medications',
                        itemId     : 'MedicationsPanel',
                        hideHeaders: true,
                        xtype      : 'grid',
                        store      : me.patientMedicationsStore,
                        columns    : [
                            {

                                header   : 'Name',
                                dataIndex: 'title',
                                flex     : 1
                            },
                            {
                                text     : 'Alert',
                                width    : 55,
                                dataIndex: 'alert',
                                renderer : me.boolRenderer
                            }

                        ]

                    },
                    {
                        title      : 'Immunizations',
                        itemId     : 'ImmuPanel',
                        hideHeaders: true,
                        xtype      : 'grid',
                        store      : me.immuCheckListStore,
                        region     : 'center',
                        columns    : [
                            {

                                header   : 'Name',
                                dataIndex: 'code_text',
                                flex     : 1
                            },
                            {
                                text     : 'Alert',
                                width    : 55,
                                dataIndex: 'alert',
                                renderer : me.alertRenderer
                            }

                        ]
                    },
                    {
                        title      : 'Allergies',
                        itemId     : 'AllergiesPanel',
                        hideHeaders: true,
                        xtype      : 'grid',
                        store      : me.patientAllergiesListStore,
                        region     : 'center',
                        columns    : [
                            {
                                header   : 'Name',
                                dataIndex: 'title',
                                flex     : 1
                            },
                            {
                                text     : 'Alert',
                                width    : 55,
                                dataIndex: 'alert',
                                renderer : me.boolRenderer
                            }
                        ]
                    },
                    {
                        title      : 'Medical Issues',
                        itemId     : 'IssuesPanel',
                        hideHeaders: true,
                        xtype      : 'grid',
                        store      : me.patientMedicalIssuesStore,
                        columns    : [
                            {

                                header   : 'Name',
                                dataIndex: 'title',
                                flex     : 1
                            },
                            {
                                text     : 'Alert',
                                width    : 55,
                                dataIndex: 'alert',
                                renderer : me.boolRenderer
                            }

                        ]

                    },
                    {
                        title      : 'Dental',
                        itemId     : 'DentalPanel',
                        hideHeaders: true,
                        xtype      : 'grid',
                        store      : me.patientDentalStore,

                        columns: [
                            {

                                header   : 'Name',
                                dataIndex: 'title',
                                flex     : 1

                            },
                            {
                                text     : 'Alert',
                                width    : 55,
                                dataIndex: 'alert',
                                renderer : me.boolRenderer
                            }

                        ]

                    },
                    {
                        title      : 'Surgery',
                        itemId     : 'SurgeryPanel',
                        hideHeaders: true,
                        xtype      : 'grid',
                        store      : me.patientSurgeryStore,

                        columns: [
                            {
                                dataIndex: 'title',
                                flex     : 1
                            },
                            {
                                text     : 'Alert',
                                width    : 55,
                                dataIndex: 'alert',
                                renderer : me.boolRenderer
                            }
                        ]
                    },
                    {
                        title: 'Clinical Reminders',
                        html : 'Panel content!'

                    },
                    {
                        title: 'Appointments',
                        html : 'Panel content!'

                    },
                    {
                        title: 'Prescriptions',
                        html : 'Panel content!'
                    }
                ]
            }
        ];

        me.listeners = {
            scope       : me,
            beforerender: me.beforePanelRender

        };

        me.callParent(arguments);

        me.down('panel').addDocked([
            {
                xtype: 'toolbar',
                dock : 'top',
                items: [
                    {
                        text   : 'History',
                        iconCls: 'icoListOptions',
                        handler: function() {

                        }
                    },
                    '-',
                    {
                        text   : 'Reports',
                        iconCls: 'icoListOptions',
                        handler: function() {

                        }
                    },
                    '-',
                    {
                        text   : 'Documents',
                        iconCls: 'icoListOptions',
                        handler: function() {

                        }
                    },
                    '-',
                    {
                        text   : 'Transactionstory',
                        iconCls: 'icoListOptions',
                        handler: function() {

                        }
                    },
                    '-',
                    {
                        text   : 'Issues',
                        iconCls: 'icoListOptions',
                        handler: function() {

                        }
                    },
                    '->',
                    {
                        text   : 'Edit Demographics',
                        iconCls: 'icoListOptions',
                        handler: function() {

                        }
                    },
                    {
                        text   : 'Print QRcode',
                        iconCls: 'icoListOptions',
                        scope  : me,
                        handler: me.onQrCodeCreate
                    }
                ]
            }
        ]);

        me.query('panel[action="patientImgs"]')[0].add({
            xtype : 'container',
            margin: '5 20',
            html  : '<img src="ui_icons/user_100.png" height="100" width="100" >'
        }, {
            xtype : 'container',
            margin: '5 20',
            html  : '<img src="ui_icons/patientDataQrCode.png" height="100" width="100" >'
        });

    },

    disableFields: function(fields) {
        Ext.each(fields, function(field) {
            field.setReadOnly(true);
        }, this);
    },

    getFormData: function(fornpanel) {

        var me = this, center = me.down('panel').getComponent('centerPanel'), fn;

        if(fornpanel.itemId == 'demoFormPanel') {
            fn = Patient.getPatientDemographicData;
        }

        var formFields = fornpanel.getForm().getFields(), modelFields = [];

        Ext.each(formFields.items, function(field) {
            modelFields.push({name: field.name, type: 'auto'});
        });

        var model = Ext.define(fornpanel.itemId + 'Model', {
            extend: 'Ext.data.Model',
            fields: modelFields,
            proxy : {
                type: 'direct',
                api : {
                    read: fn
                }
            }
        });

        var store = Ext.create('Ext.data.Store', {
            model: model
        });

        store.load({
            scope   : me,
            callback: function(records, operation, success) {
                fornpanel.getForm().loadRecord(records[0]);
            }
        });

        /**
         * load the vitals store to render the vitals data view
         */
        me.vitalsStore.load();

    },

    beforePanelRender: function() {
        var me = this, center = me.down('panel').getComponent('centerPanel'), demoFormPanel = center.getComponent('demoFormPanel');

        this.getFormItems(demoFormPanel, 'Demographics', function(success) {
            if(success) {
                me.disableFields(demoFormPanel.getForm().getFields().items);
            }
        });
    },

    onQrCodeCreate: function() {
        this.qrCodeWindow.show();

    },
    afterRightCol : function(panel) {
        var me = this;
        panel.getComponent('ImmuPanel').header.add({
            xtype  : 'button',
            text   : 'update',
            action : 'immunization',
            scope  : me,
            handler: me.medicalWin


        });
        panel.getComponent('MedicationsPanel').header.add({
            xtype  : 'button',
            text   : 'update',
            action : 'medications',
            scope  : me,
            handler: me.medicalWin


        });

        panel.getComponent('AllergiesPanel').header.add({
            xtype  : 'button',
            text   : 'update',
            action : 'allergies',
            scope  : me,
            handler: me.medicalWin


        });
        panel.getComponent('IssuesPanel').header.add({
            xtype  : 'button',
            text   : 'update',
            action : 'issues',
            scope  : me,
            handler: me.medicalWin


        });
        panel.getComponent('DentalPanel').header.add({
            xtype  : 'button',
            text   : 'update',
            action : 'dental',
            scope  : me,
            handler: me.medicalWin
        });
        panel.getComponent('SurgeryPanel').header.add({
            xtype  : 'button',
            text   : 'update',
            action : 'surgery',
            scope  : me,
            handler: me.medicalWin
        });
        this.doLayout();
    },
    medicalWin    : function(btn) {
        app.onMedicalWin(btn);
    },

    getPatientImgs: function() {
        var panel = this.query('panel[action="patientImgs"]')[0], idImg, qrImg;
        panel.removeAll();

        panel.add({
            xtype : 'container',
            margin: '5 20',
            html  : '<img src="ui_icons/user_100.png" height="100" width="100" >'
        }, {
            xtype : 'container',
            margin: '5 20',
            html  : '<img src="' + settings.site_url + '/patients/' + app.currPatient.pid + '/patientDataQrCode.png" height="100" width="100" >'
        });
    },

    /**
     * This function is called from MitosAPP.js when
     * this panel is selected in the navigation panel.
     * place inside this function all the functions you want
     * to call every this panel becomes active
     */
    onActive: function(callback) {
        var billingPanel = this.query('[action="balance"]')[0];

        Fees.getPatientBalance({pid:app.currPatient.pid},function(balance){
            billingPanel.body.update('Account Balance: $' + balance);
        });
        this.patientNotesStore.load({params: {pid: app.currPatient.pid}});
        this.patientRemindersStore.load({params: {pid: app.currPatient.pid}});
        this.immuCheckListStore.load({params: {pid: app.currPatient.pid}});
        this.patientAllergiesListStore.load({params: {pid: app.currPatient.pid}});
        this.patientMedicalIssuesStore.load({params: {pid: app.currPatient.pid}});
        this.patientSurgeryStore.load({params: {pid: app.currPatient.pid}});
        this.patientDentalStore.load({params: {pid: app.currPatient.pid}});
        this.patientMedicationsStore.load({params: {pid: app.currPatient.pid}});
        var me = this;
        if(this.checkIfCurrPatient()) {
            var patient = me.getCurrPatient();
            this.updateTitle(patient.name + ' - #' + patient.pid + ' (Patient Summary)');

            var center = me.down('panel').getComponent('centerPanel'), demoFormPanel = center.getComponent('demoFormPanel');

            me.getFormData(demoFormPanel);
            me.getPatientImgs();

        } else {

            callback(false);
            me.currPatientError();
        }
    }

});