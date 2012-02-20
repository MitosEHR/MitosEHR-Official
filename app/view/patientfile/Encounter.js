/**
 * Encounter.ejs.php
 * Encounter Panel
 * v0.0.1
 *
 * Author: Ernesto J. Rodriguez
 * Modified:
 *
 * MitosEHR (Electronic Health Records) 2011
 *
 * @namespace Encounter.getEncounter
 * @namespace Encounter.createEncounter
 * @namespace Encounter.ckOpenEncounters
 * @namespace Encounter.closeEncounter
 * @namespace Encounter.getVitals
 */
Ext.define('App.view.patientfile.Encounter', {
	extend       : 'App.classes.RenderPanel',
	id           : 'panelEncounter',
	pageTitle    : 'Encounter',
	pageLayout   : 'border',
	requires     : [
		'App.store.patientfile.Encounter',
		'App.store.patientfile.Vitals'
	],
	initComponent: function() {
		var me = this;

		me.currEncounterStartDate = null;
		me.currEncounterEid = null;

		me.timerTask = {
			scope   : me,
			run     : function() {
				me.encounterTimer();
			},
			interval: 1000 //1 second
		};

		me.encounterStore   = Ext.create('App.store.patientfile.Encounter');
		me.vitalsStore      = Ext.create('App.store.patientfile.Vitals');

		/**
		 * New Encounter Panel this panel is located hidden at
		 * the top of the Visit panel and will slide down if
		 * the "New Encounter" button is pressed.
		 */
		me.newEncounterWindow = Ext.create('Ext.window.Window', {
			title      : 'New Encounter Form',
			closeAction: 'hide',
			modal      : true,
			closable   : false,
			items      : [
				{
					xtype      : 'form',
					border     : false,
					bodyPadding: '10 10 0 10'
				}
			],
			buttons    : [
				{
					text   : 'Create Encounter',
					scope  : me,
					handler: me.saveNewEnc
				},
				{
					text   : 'Cancel',
					handler: me.cancelNewEnc

				}
			]
		});


		/**
		 * Tap Panel panels and forms
		 */
		me.MiscBillingOptionsPanel = Ext.create('Ext.form.Panel', {
			hidden: true,
			border: false,
			action: 'administrative',
			title : 'Misc. Billing Options HCFA',
			html  : '<h1>Misc. Billing Options HCFA form placeholder!</h1>'
		});
		me.procedurePanel = Ext.create('Ext.form.Panel', {
			hidden: true,
			border: false,
			action: 'administrative',
			title : 'Procedure Order',
			html  : '<h1>Procedure Order form placeholder!</h1>'
		});
		me.reviewSysPanel = Ext.create('Ext.form.Panel', {
			autoScroll   : true,
			border       : false,
			action       : 'encounter',
			title        : 'Review of Systems',
			fieldDefaults: { msgTarget: 'side' }
		});
		me.reviewSysCkPanel = Ext.create('Ext.form.Panel', {
            autoScroll   : true,
            border       : false,
            action       : 'encounter',
			title : 'Review of Systems Checks',
            fieldDefaults: { msgTarget: 'side' }
		});

		me.soapPanel = Ext.create('Ext.form.Panel', {
			autoScroll   : true,
			border       : false,
			title        : 'SOAP',
			action       : 'encounter',
			fieldDefaults: { msgTarget: 'side' }
		});
		me.speechDicPanel = Ext.create('Ext.form.Panel', {
			autoScroll   : true,
			border       : false,
			title        : 'Speech Dictation',
			action       : 'encounter',
			fieldDefaults: { msgTarget: 'side' }
		});

		me.vitalsPanel = Ext.create('Ext.panel.Panel', {
			title      : 'Vitals',
			action     : 'encounter',
			cls        : 'vitals-panel',
			bodyPadding: '5 10',
			autoScroll : true,
			border     : false,
			layout     : {
				type   : 'table',
				columns: 2
			},
			items      : [
				{
					xtype        : 'form',
					columnWidth  : 325,
					width        : 325,
					border       : false,
					url          : '',
					layout       : 'anchor',
					fieldDefaults: { msgTarget: 'side' }
				},
				{
					xtype            : 'dataview',
					cls              : 'vitals-data',
					loadMask         : false,
					tpl              : '<table>' +
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
					itemSelector     : 'div.patient-pool-btn',
					overItemCls      : 'patient-over',
					selectedItemClass: 'patient-selected',
					singleSelect     : true,
					store            : me.vitalsStore
				}
			],
			dockedItems: {
				xtype: 'toolbar',
				dock : 'top',
				items: [
					{
						text   : 'Save Vitals',
						iconCls: 'save',
						scope  : me,
						handler: me.onSave
					},
					'->',
					{
						text   : 'Vector Charts',
						iconCls: 'icoChart',
						scope  : me,
						handler: me.onChartWindowtShow
					}
				]
			}

		});


		/**
		 * Encounter panel
		 */
		me.centerPanel = Ext.create('Ext.tab.Panel', {
			xtype     : 'tabpanel',
			region    : 'center',
			activeItem: 0,
			defaults  : {
				bodyStyle : 'padding:15px',
				border    : false,
				bodyBorder: false,
				layout    : 'fit'
			},
			items     : [
				me.vitalsPanel,
				me.reviewSysPanel,
				me.reviewSysCkPanel,
				me.soapPanel,
				me.speechDicPanel,
				me.MiscBillingOptionsPanel,
				me.procedurePanel
			]
		});


		/**
		 * Progress Note
		 */
		me.progressNote = Ext.create('Ext.panel.Panel', {
			title       : 'Encounter Progress Note',
			region      : 'east',
			margin      : '0 0 0 2',
			bodyStyle   : 'padding:15px',
			width       : 500,
			collapsible : true,
			animCollapse: true,
			collapsed   : true,
			html        : '<h2>Progress Note Placeholder</h2>',
			listeners   : {
				scope   : this,
				collapse: me.progressNoteCollapseExpand,
				expand  : me.progressNoteCollapseExpand
			},
			tbar        : [
				{
					text   : 'View (CCD)',
					tooltip: 'View (Continuity of Care Document)',
					handler: function() {
						// refresh logic
					}
				},
				'-',
				{
					text   : 'Print (CCD)',
					tooltip: 'Print (Continuity of Care Document)',
					handler: function() {
						// refresh log

					}
				},
				'->',
				{
					text   : 'Export (CCD)',
					tooltip: 'Export (Continuity of Care Document)',
					handler: function() {
						// refresh log

					}
				}
			]
		});

		me.pageBody = [ me.centerPanel, me.progressNote ];

        me.listeners = {
            afterrender:me.afterPanelRender
        };
		me.callParent(arguments);

		me.down('panel').addDocked([
			{
				xtype: 'toolbar',
				dock : 'top',
				items: [
					{
						text        : 'Encounter',
						enableToggle: true,
						pressed     : true,
						toggleGroup : '1',
						iconCls     : '',
						scope       : me,
						handler     : function() {
							me.setTapPanel('encounter');
						}
					},
					'-',
					{
						text        : 'Administrative',
						enableToggle: true,
						toggleGroup : '1',
						iconCls     : '',
						scope       : me,
						handler     : function() {
							me.setTapPanel('administrative');
						}
					},
					'->',
					{
						text   : 'Immunization',
						iconCls: 'icoAddRecord',
						action : 'immunization',
						scope  : me,
						handler: me.onMedicalWin
					},
					'-',
					{
						text   : 'Allergies',
						iconCls: 'icoAddRecord',
						action : 'allergies',
						scope  : me,
						handler: me.onMedicalWin
					},
					'-',
					{
						text   : 'Medical Issue',
						iconCls: 'icoAddRecord',
						action : 'issues',
						scope  : me,
						handler: me.onMedicalWin
					},
					'-',
					{
						text   : 'Surgery',
						iconCls: 'icoAddRecord',
						action : 'surgery',
						scope  : me,
						handler: me.onMedicalWin
					},
					'-',
					{
						text   : 'Dental',
						iconCls: 'icoAddRecord',
						action : 'dental',
						scope  : me,
						handler: me.onMedicalWin
					},
					'-',
					{
						text   : 'Close Encounter',
						iconCls: 'icoAddRecord',
						scope  : me,
						handler: me.closeEncounter
					}
				]
			}
		]);

	},

	onMedicalWin: function(btn) {
		app.onMedicalWin(btn);
	},


	onChartWindowtShow: function() {
		app.onChartsWin();
	},

	/**
	 * This is the logic to create a new encounter
	 */
	newEncounter: function() {
		var me = this;
		Encounter.ckOpenEncounters(function(provider, response) {
			if(response.result.encounter) {
				Ext.Msg.show({
					title  : 'Oops! Open Encounters Found...',
					msg    : 'Do you want to <strong>continue creating the New Encounters?</strong><br>"Click No to review Encounter History"',
					buttons: Ext.Msg.YESNO,
					icon   : Ext.Msg.QUESTION,
					fn     : function(btn) {
						if(btn == 'yes') {
							me.showNewEncounterWindow();
						} else {
							app.openPatientVisits();
						}
					}
				});
			} else {
				me.showNewEncounterWindow();
			}

		});
	},

	showNewEncounterWindow: function() {
		var me = this,
			form = me.newEncounterWindow.down('form');
		me.getFormItems(form, 'New Encounter', function() {
			form.getForm().findField('start_date').setValue(new Date());
			form.doLayout();
			me.newEncounterWindow.show();
		});
	},


	saveNewEnc: function(btn) {
		var me = this,
			form = me.newEncounterWindow.down('form').getForm();
		if(form.isValid()) {
			var data = form.getValues();

			Encounter.createEncounter(data, function(provider, response) {
				if(response.result.success) {
					me.currEncounterStartDate = me.parseDate(response.result.encounter.start_date);
					me.currEncounterEid = response.result.encounter.eid;
					me.startTimer();
					btn.up('window').close();
				} else {
					btn.up('window').close();
				}

			});
		}
	},

	cancelNewEnc: function(btn) {
		btn.up('window').close();
		app.openPatientSummary();
	},


	/**
	 * This will start the timer task
	 *
	 * @param date
	 */
	parseDate: function(date) {
		var t = date.split(/[- :]/);
		return new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
	},

	/**
	 * Start timer task...  runs every sec
	 */
	startTimer: function() {
        //say(this);
		Ext.TaskManager.start(this.timerTask);
	},

    stopTimer: function() {
        //say(this);
        Ext.TaskManager.stop(this.timerTask);
    },

	/**
	 * This will update the timer every sec
	 */
	encounterTimer: function() {
		var me = this;
		var timer = me.timer(me.currEncounterStartDate, new Date()),
			patient = me.getCurrPatient();
		me.updateTitle(patient.name + ' - ' + Ext.Date.format(me.currEncounterStartDate, 'F j, Y, g:i a') + ' (Opened Encounter) <span class="timer">' + timer + '</span>');
	},

	timer: function(start, stop) {
		var ms = Ext.Date.getElapsed(start, stop), t,
			sec = Math.floor(ms / 1000);

		function twoDigit(d) {
			return (d >= 10) ? d : '0' + d;
		}

		var min = Math.floor(sec / 60);
		sec = sec % 60;
		t = twoDigit(sec);

		var hr = Math.floor(min / 60);
		min = min % 60;
		t = twoDigit(min) + ":" + t;

		var day = Math.floor(hr / 24);
		hr = hr % 24;
		t = twoDigit(hr) + ":" + t;

		//t = day + ":" + t

		t = (day == 0 ) ? '<span class="time">' + t + '</span>' : '<span class="day">' + day + ' day(s)</span><span class="time">' + t + '</span>';
		return t;
	},

	openEncounter: function(eid) {
		var me = this;
		me.currEncounterEid = eid;
		me.encounterStore.getProxy().extraParams.eid = eid;
		me.encounterStore.load({
			scope   : me,
			callback: function(provider, operation) {
				var data = operation.response.result,
					start_date = me.parseDate(data.start_date);
				me.currEncounterStartDate = start_date;

				if(data.close_date === null) {
					me.startTimer();
				} else {
					me.stopTimer();
					var stop_date = me.parseDate(data.close_date),
						timer = me.timer(start_date, stop_date),
						patient = me.getCurrPatient();
					me.updateTitle(patient.name + ' - ' + Ext.Date.format(me.currEncounterStartDate, 'F j, Y, g:i a') + ' (Closed Encounter) <span class="timer">' + timer + '</span>');
				}
				this.vitalsStore.load({
					scope   : me,
					params:{pid:app.currPatient.pid},
					callback: function() {
						me.vitalsPanel.down('dataview').refresh();
					}
				});
			}
		});

	},

	/**
	 * Function to close the encounter..
	 * 1.
	 */
	closeEncounter: function() {
		var me = this;
		var msg = Ext.Msg.prompt('Digital Signature', 'Please sign the encounter with your password:', function(btn, signature) {
			if(btn == 'ok') {
				var params = {
					eid       : me.currEncounterEid,
					close_date: Ext.Date.format(new Date(), 'Y-m-d H:i:s'),
					signature : signature
				};
				Encounter.closeEncounter(params, function(provider, response) {
					if(response.result.success) {
						// TODO: after close encounter logic
						me.stopTimer();
					} else {
						Ext.Msg.show({
							title  : 'Oops!',
							msg    : 'Incorrect password',
							buttons: Ext.Msg.OKCANCEL,
							icon   : Ext.Msg.ERROR,
							fn     : function(btn) {
								if(btn == 'ok') {
									me.closeEncounter();
								}
							}
						});
					}
				});

			}
		}, this);
		var f = msg.textField.getInputId();
		document.getElementById(f).type = 'password';
	},


	progressNoteCollapseExpand: function() {
		this.centerPanel.doLayout();
	},

	setTapPanel: function(type) {
		var me = this;
		me.centerPanel.getTabBar().items.each(function(t) {
			if(t.card.action == type) {
				t.show();
			} else {
				t.hide();
			}
		});
	},

    afterPanelRender:function(){
        var me = this;

        this.getFormItems(me.vitalsPanel.down('form'), 'Vitals', function() {
            me.vitalsPanel.doLayout();
        });

        this.getFormItems(me.reviewSysPanel, 'Review of Systems', function() {
            me.reviewSysPanel.doLayout();
        });

        this.getFormItems(me.soapPanel, 'SOAP', function() {
            me.soapPanel.doLayout();
        });

        this.getFormItems(me.speechDicPanel, 'Speech Dictation', function() {
            me.speechDicPanel.doLayout();
        });

        this.getFormItems(me.reviewSysCkPanel, 'Review of Systems Check', function() {
            me.reviewSysCkPanel.doLayout();
        });

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
			var patient = this.getCurrPatient();
			this.updateTitle(patient.name + ' (Visits)');
			callback(true);
		} else {
			callback(false);
			this.currPatientError();
		}
	}
});
