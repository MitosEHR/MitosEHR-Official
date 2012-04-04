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
	pageLayout   : 'border',
	initComponent: function() {
		var me = this;

		me.vitalsStore = Ext.create('App.store.patientfile.Vitals');
		me.qrCodeWindow = Ext.create('App.view.patientfile.QrCodeWindow');

		me.pageBody = [
			{
				xtype      : 'container',
				region     : 'east',
				width      : 300,
				bodyPadding: 0,
				frame      : false,
				border     : false,
				defaults   : { margin: '0 0 5 0', bodyPadding: 5, collapsible: true, titleCollapse: true },
				items      : [
					{
						title: 'Clinical Reminders',
						html : 'Panel content!'
					},
					{
						title: 'Appointments',
						html : 'Panel content!'
					},
					{
						title: 'Medical Problems',
						html : 'Panel content!'
					},
					{
						title: 'Allergies',
						html : 'Panel content!'
					},
					{
						title: 'Medications',
						html : 'Panel content!'
					},
					{
						title: 'Immunizations',
						html : 'Panel content!'
					},
					{
						title: 'Prescriptions',
						html : 'Panel content!'
					}
				]
			},
			{
				xtype      : 'container',
				region     : 'center',
				bodyPadding: 0,
				frame      : false,
				border     : false,
				itemId     : 'centerPanel',
				defaults   : { margin: '0 5 5 0', bodyPadding: 5, collapsible: true, titleCollapse: true },
				items      : [
					{
						title: 'Billing',
						html : 'Balance Due: [token]'
					},
					{
						xtype    : 'form',
						title    : 'Demographics',
						itemId   : 'demoFormPanel'
					},
					{
						title: 'Notes',
						html : 'Panel content!'
					},
					{
						title: 'Patient Reminders',
						html : 'Panel content!'
					},
					{
						title: 'Disclosure',
						html : 'Panel content!'
					},
					{
						title     : 'Vitals',
						autoScroll: true,
						items     : {
                            xtype: 'vitalsdataview',
							store: me.vitalsStore
						}
					}
				]
			}
		];

        me.listeners = {
            scope:me,
            beforerender:me.beforePanelRender
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
						scope: me,
						handler: me.onQrCodeCreate
					}
				]
			}
		]);

	},

	disableFields: function(fields) {
		Ext.each(fields, function(field) {
			field.setReadOnly(true);
		}, this);
	},

	getFormData: function(fornpanel) {

		var me = this,
			center = me.down('panel').getComponent('centerPanel'),
			fn;

		if(fornpanel.itemId == 'demoFormPanel') {
			fn = Patient.getPatientDemographicData;
		}


		var formFields = fornpanel.getForm().getFields(),
			modelFields = [];

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

    beforePanelRender:function(){
        var me = this,
            center = me.down('panel').getComponent('centerPanel'),
            demoFormPanel = center.getComponent('demoFormPanel');

        this.getFormItems(demoFormPanel, 'Demographics', function(success) {
            if(success) {
                me.disableFields(demoFormPanel.getForm().getFields().items);
            }
        });
    },

	onQrCodeCreate:function () {
		this.qrCodeWindow.show();

	},

	/**
	 * This function is called from MitosAPP.js when
	 * this panel is selected in the navigation panel.
	 * place inside this function all the functions you want
	 * to call every this panel becomes active
	 */
	onActive: function(callback) {
		var me = this;
		if(this.checkIfCurrPatient()) {
			var patient = me.getCurrPatient();
			this.updateTitle(patient.name + ' - #' + patient.pid + ' (Patient Summary)');

			var center = me.down('panel').getComponent('centerPanel'),
				demoFormPanel = center.getComponent('demoFormPanel');

		    me.getFormData(demoFormPanel);


		} else {

			callback(false);
			me.currPatientError();
		}
	}

});