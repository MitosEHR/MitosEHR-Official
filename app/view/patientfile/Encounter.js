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
 * @namespace Encounter.updateEncounter
 * @namespace Encounter.ckOpenEncounters
 * @namespace Encounter.closeEncounter
 * @namespace Encounter.getVitals
 * @namespace Encounter.addVitals
 * @namespace Encounter.saveReviewOfSystem
 * @namespace Encounter.saveReviewOfSystemsChecks
 * @namespace Encounter.saveSOAP
 * @namespace Encounter.saveSpeechDictation
 * @namespace User.verifyUserPass
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
					action : 'encounter',
					scope  : me,
					handler: me.onSave
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
			fieldDefaults: { msgTarget: 'side' },
            dockedItems: {
                xtype: 'toolbar',
                dock : 'top',
                items: [
                    {
                        text   : 'Save',
                        iconCls: 'save',
                        action : 'reviewOfSystems',
                        scope  : me,
                        handler: me.onSave
                    }
                ]
            }
		});

		me.reviewSysCkPanel = Ext.create('Ext.form.Panel', {
            autoScroll   : true,
            border       : false,
            action       : 'encounter',
			title : 'Review of Systems Checks',
            fieldDefaults: { msgTarget: 'side' },
            dockedItems: {
                xtype: 'toolbar',
                dock : 'top',
                items: [
                    {
                        text   : 'Save',
                        iconCls: 'save',
                        action : 'reviewOfSystemsChecks',
                        scope  : me,
                        handler: me.onSave
                    }
                ]
            }
		});

		me.soapPanel = Ext.create('Ext.form.Panel', {
			autoScroll   : true,
			border       : false,
			title        : 'SOAP',
			action       : 'encounter',
			fieldDefaults: { msgTarget: 'side' }   ,
            dockedItems: {
                xtype: 'toolbar',
                dock : 'top',
                items: [
                    {
                        text   : 'Save',
                        iconCls: 'save',
                        action : 'soap',
                        scope  : me,
                        handler: me.onSave
                    }
                ]
            }
		});

		me.speechDicPanel = Ext.create('Ext.form.Panel', {
			autoScroll   : true,
			border       : false,
			title        : 'Speech Dictation',
			action       : 'encounter',
			fieldDefaults: { msgTarget: 'side' },
            dockedItems: {
                xtype: 'toolbar',
                dock : 'top',
                items: [
                    {
                        text   : 'Save',
                        iconCls: 'save',
                        action : 'speechDictation',
                        scope  : me,
                        handler: me.onSave
                    }
                ]
            }
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
					xtype: 'vitalsdataview'
					//store: me.encounterStore
				}
			],
			dockedItems: {
				xtype: 'toolbar',
				dock : 'top',
				items: [
					{
						text   : 'Save',
						iconCls: 'save',
						action : 'vitals',
						scope  : me,
						handler: me.onSave
					},
					'->',
					{
						text   : 'Vector Charts',
						iconCls: 'icoChart',
						scope  : me,
						handler: me.onChartWindowShow
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

	/**
	 * opens the Medical window
	 * @param btn
	 */
	onMedicalWin: function(btn) {
		app.onMedicalWin(btn);
	},
	/**
	 * opens the Chart window
	 */
	onChartWindowShow: function() {
		app.onChartsWin();
	},
	/**
	 * Checks foe opend encounters, if open encounters are
	 * found alert the user, if not then open the
	 * new encounter window
	 */
	newEncounter: function() {
		var me = this;
		Encounter.ckOpenEncounters(function(provider, response) {
            /** @namespace response.result.encounter */
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

	/**
	 * Opens the new encounter window and loads the current date to the form
	 */
	showNewEncounterWindow: function() {
		var me = this,
			form = me.newEncounterWindow.down('form');
		me.getFormItems(form, 'New Encounter', function() {
			form.getForm().findField('start_date').setValue(new Date());
			form.doLayout();
			me.newEncounterWindow.show();
		});
	},
	/**
	 * Sends the data to the server to be saved.
	 * This function needs the button action to determing
	 * which form  to save.
	 * @param SaveBtn
	 */
	onSave: function(SaveBtn) {
		var me = this, panel = me.centerPanel.getActiveTab(),
			form = (SaveBtn.action == "encounter") ? me.newEncounterWindow.down('form').getForm() : panel.down('form').getForm();

		if(form.isValid()) {
			var data = form.getValues();

			/**
			 * Save New Encounter Submit
			 */
			if(SaveBtn.action == 'encounter') {
                ACL.hasPermission('add_encounters', function(provider, response){
                    if(response.result) {
                        var store = me.encounterStore;
                        store.add(data);
                        var rec = store.getAt(0);
                        rec.save({
                            callback:function(store,b,c){
                                me.openEncounter(store.data.eid);
                                SaveBtn.up('window').close();
                            }
                        });

//                        me.currEncounterStartDate = data.start_date;
//                        me.currEncounterEid = response.result.encounter.eid;
//                        Encounter.createEncounter(data, function(provider, response) {
//                            if(response.result.success) {
//                                me.currEncounterStartDate = response.result.encounter.start_date;
//                                me.currEncounterEid = response.result.encounter.eid;
//                                me.startTimer();
//                                SaveBtn.up('window').close();
//                            } else {
//                                SaveBtn.up('window').close();
//                            }
//                        });
                    }else{
                        me.accessWarning();
                    }
                });
			} else if(SaveBtn.action == 'vitals') {
                ACL.hasPermission('add_vitals', function(provider, response){
                    if(response.result) {
                        Ext.Msg.prompt('Digital Signature', 'Please sign this entry with your password:', function(btn, signature) {
                            if(btn == 'ok') {

                                User.verifyUserPass(signature, function(provider, response){
                                    if(response.result) {
                                    var store = me.encounterStore,
                                        vitals = store.getAt(0).vitals();
                                        data = me.addDefaultData(data);
                                        form.reset();
                                        vitals.add(data);
                                        vitals.sync();
                                        vitals.sort('date', 'DESC');
                                        me.vitalsPanel.down('vitalsdataview').refresh();
                                        me.msg('Sweet!', 'Vitals Saved');
                                    } else {
                                        Ext.Msg.show({
                                            title  : 'Oops!',
                                            msg    : 'Incorrect password',
                                            buttons: Ext.Msg.OKCANCEL,
                                            icon   : Ext.Msg.ERROR,
                                            fn     : function(btn) {
                                                if(btn == 'ok') {
                                                    me.onSave(SaveBtn);
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                        }, this);
                    } else {
                        me.accessWarning();
                    }
                });

                /**
                 * Save Review of System submit
                 */
            } else if(SaveBtn.action == 'reviewOfSystems') {
                data = me.addDefaultData(data);
                Encounter.saveReviewOfSystem(data, function(provider, response) {
                    if(response.result.success) {
                        me.msg('Sweet!', 'Review Of System Saved');
                    } else {
                        Ext.Msg.show({
                            title  : 'Oops!',
                            msg    : response.result.error,
                            buttons: Ext.Msg.OK,
                            icon   : Ext.Msg.ERROR
                        });
                    }
                });
            } else if(SaveBtn.action == 'reviewOfSystemsChecks') {
                data = me.addDefaultData(data);
                Encounter.saveReviewOfSystemsChecks(data, function(provider, response) {
                    if(response.result.success) {
                        me.msg('Sweet!', 'Review Of Systems Checks Saved');
                    } else {
                        Ext.Msg.show({
                            title  : 'Oops!',
                            msg    : response.result.error,
                            buttons: Ext.Msg.OK,
                            icon   : Ext.Msg.ERROR
                        });
                    }
                });
            } else if(SaveBtn.action == 'soap') {
                data = me.addDefaultData(data);
                Encounter.saveSOAP(data, function(provider, response) {
                    if(response.result.success) {
                        me.msg('Sweet!', 'SOAP Saved');
                    } else {
                        Ext.Msg.show({
                            title  : 'Oops!',
                            msg    : response.result.error,
                            buttons: Ext.Msg.OK,
                            icon   : Ext.Msg.ERROR
                        });
                    }
                });
            } else if(SaveBtn.action == 'speechDictation') {
                data = me.addDefaultData(data);
                Encounter.saveSpeechDictation(data, function(provider, response) {
                    if(response.result.success) {
                        me.msg('Sweet!', 'Speech Dictation Saved');
                    } else {
                        Ext.Msg.show({
                            title  : 'Oops!',
                            msg    : response.result.error,
                            buttons: Ext.Msg.OK,
                            icon   : Ext.Msg.ERROR
                        });
                    }
                });
			} else {
				console.log('Save action not yet implemented');
			}
		}
	},
	/**
	 * Takes the form data to be send and adds the default
	 * data used by every encounter form. For example
	 * pid (Patient ID), eid (Encounter ID), uid (User ID),
	 * and date (Current datetime as 00-00-00 00:00:00)
	 * @param data
	 */
	addDefaultData:function(data){
		data.pid = app.currPatient.pid;
		data.eid = this.currEncounterEid;
		data.uid = user.id;
		data.date = Ext.Date.format(new Date(), 'Y-m-d H:i:s');
		return data;
	},

	/**
	 * Cancels the New Encounter process, closing the window
	 * and sendong the user to the Patient Summary panel
	 * @param btn
	 */
	cancelNewEnc: function(btn) {
		btn.up('window').close();
		app.openPatientSummary();
	},



	/**
	 *
	 * @param eid
	 */
	openEncounter: function(eid) {
		var me = this,
            vitals = me.vitalsPanel.down('vitalsdataview');

		me.currEncounterEid = eid;
		me.encounterStore.getProxy().extraParams.eid = eid;
		me.encounterStore.load({
			scope   : me,
			callback: function(record, operation) {
				var data = record[0].data;
                say(record);
				me.currEncounterStartDate = data.start_date;

				if(data.close_date === null) {
					me.startTimer();
				} else {
					me.stopTimer();
					me.stopTimer();
					var timer = me.timer(data.start_date, data.close_date),
						patient = me.getCurrPatient();
					me.stopTimer();
					me.updateTitle(patient.name + ' - ' + Ext.Date.format(me.currEncounterStartDate, 'F j, Y, g:i a') + ' (Closed Encounter) <span class="timer">' + timer + '</span>');
				}

                vitals.store = record[0].vitalsStore;
                vitals.refresh();
			}
		});
	},

	/**
	 * Function to close the encounter..
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
						me.stopTimer();
						// TODO: after close encounter logic
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
	/**
	 * listen for the progress note panel and runs the
	 * doLayout function to re-adjust the dimentions.
	 */
	progressNoteCollapseExpand: function() {
		this.centerPanel.doLayout();
	},


    //***************************************************************************************************//
    //***************************************************************************************************//
    //*********    *****  ******    ****** **************************************************************//
    //*********  *  ****  ****  ***  ***** **************************************************************//
    //*********  **  ***  ***  *****  **** **************************************************************//
    //*********  ***  **  ***  *****  **** **************************************************************//
    //*********  ****  *  ****  ***  ********************************************************************//
    //*********  *****    *****    ******* **************************************************************//
    //***************************************************************************************************//
    //***************************************************************************************************//


    /**
     * Start the timerTask
     */
    startTimer: function() {
        Ext.TaskManager.start(this.timerTask);
    },
    /**
     * stops the timerTask
     */
    stopTimer: function() {
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

    /**
     * This function use the "start time" and "stop time"
     * and gets the time elapsed between the two then
     * returns it as a timer (00:00:00)  or (1 day(s) 00:00:00)
     * if more than 24 hrs
     *
     * @param start
     * @param stop
     */
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

        t = (day == 0 ) ? '<span class="time">' + t + '</span>' : '<span class="day">' + day + ' day(s)</span><span class="time">' + t + '</span>';
        return t;
    },

	/**
	 * Sets the tab panel hiding them by type (encounter or administrative)
	 * @param type
	 */
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
	/**
	 * Convert Celsius to Fahrenheit
	 * @param field
	 * @param e
	 */
	cf:function(field, e){
		var v = field.getValue(),
			temp = 9*v/5 + 32,
			res = Ext.util.Format.round(temp, 1);
		if(e.getKey() != e.TAB ){
			field.up('form').getForm().findField('temp_f').setValue(res);
		}

	},
	/**
	 * Convert Fahrenheit to Celsius
	 * @param field
	 * @param e
	 */
	fc:function(field, e){
		var v = field.getValue(),
			temp = (v-32)* 5/9,
			res = Ext.util.Format.round(temp, 1);
		if(e.getKey() != e.TAB ){
			field.up('form').getForm().findField('temp_c').setValue(res);
		}
	},

	/**
	 * Convert Lbs to Kg
	 * @param field
	 * @param e
	 */
	lbskg:function(field, e){
		var v = field.getValue(),
			weight = v/2.2,
			res = Ext.util.Format.round(weight, 1);
		if(e.getKey() != e.TAB ){
			field.up('form').getForm().findField('weight_kg').setValue(res);
		}
	},
	/**
	 * Convert Kg to Lbs
	 * @param field
	 * @param e
	 */
	kglbs:function(field, e){
		var v = field.getValue(),
			weight = v*2.2,
			res = Ext.util.Format.round(weight, 1);
		if(e.getKey() != e.TAB ){
			field.up('form').getForm().findField('weight_lbs').setValue(res);
		}
	},
	/**
	 * Convert Inches to Cetimeter
	 * @param field
	 * @param e
	 */
	incm:function(field, e){
		var v = field.getValue(),
			weight = v*2.54,
			res = Ext.util.Format.round(weight, 1);
		if(e.getKey() != e.TAB ){
			if(field.name == 'head_circumference_in'){
				field.up('form').getForm().findField('head_circumference_cm').setValue(res);
			}else if(field.name == 'waist_circumference_in'){
				field.up('form').getForm().findField('waist_circumference_cm').setValue(res);
			}else if(field.name == 'height_in'){
				field.up('form').getForm().findField('height_cm').setValue(res);
			}
		}
	},
	/**
	 * Convert Centimeter to Inches
	 * @param field
	 * @param e
	 */
	cmin:function(field, e){
		var v = field.getValue(),
			weight = v*0.39,
			res = Ext.util.Format.round(weight, 1);
		if(e.getKey() != e.TAB ){
			if(field.name == 'head_circumference_cm'){
				field.up('form').getForm().findField('head_circumference_in').setValue(res);
			}else if(field.name == 'waist_circumference_cm'){
				field.up('form').getForm().findField('waist_circumference_in').setValue(res);
			}else if(field.name == 'height_cm'){
				field.up('form').getForm().findField('height_in').setValue(res);
			}
		}
	},

	/**
	 * After this paneel is render add the forms and listeners for convertions
	 */
    afterPanelRender:function(){
        var me = this, form;
        this.getFormItems(me.vitalsPanel.down('form'), 'Vitals', function() {
	        form = me.vitalsPanel.down('form').getForm();
	        form.findField('temp_c').addListener('keyup', me.cf, me );
	        form.findField('temp_f').addListener('keyup', me.fc, me );
	        form.findField('weight_lbs').addListener('keyup', me.lbskg, me );
            form.findField('weight_kg').addListener('keyup', me.kglbs, me );
	        form.findField('height_cm').addListener('keyup', me.cmin, me );
            form.findField('height_in').addListener('keyup', me.incm, me );
            form.findField('head_circumference_cm').addListener('keyup', me.cmin, me );
            form.findField('head_circumference_in').addListener('keyup', me.incm, me );
            form.findField('waist_circumference_cm').addListener('keyup', me.cmin, me );
            form.findField('waist_circumference_in').addListener('keyup', me.incm, me );
            me.vitalsPanel.doLayout();
        });

        this.getFormItems(me.reviewSysPanel, 'Review of Systems', function() {
            var formFields = me.reviewSysPanel.getForm().getFields(),
                modelFields = [
                    {name: 'id', type: 'int'},
                    {name: 'pid', type: 'int'},
                    {name: 'eid', type: 'int'},
                    {name: 'uid', type: 'int'}
                ];

            Ext.each(formFields.items, function(field) {
                modelFields.push({name: field.name, type: 'auto'});
            });

            Ext.define('App.model.patientfile.ReviewOfSystems', {
                extend: 'Ext.data.Model',
                fields: modelFields,
                proxy : {
                    type: 'direct',
                    api : {
                        read: Roles.getRolesData
                    }
                },
                belongsTo: { model: 'App.model.patientfile.Encounter', foreignKey: 'eid' }
            });
            me.reviewSysPanel.doLayout();
        });

        this.getFormItems(me.soapPanel, 'SOAP', function() {
            var formFields = me.soapPanel.getForm().getFields(),
                modelFields = [
                    {name: 'id', type: 'int'},
                    {name: 'pid', type: 'int'},
                    {name: 'eid', type: 'int'},
                    {name: 'uid', type: 'int'}
                ];

            Ext.each(formFields.items, function(field) {
                modelFields.push({name: field.name, type: 'auto'});
            });

            Ext.define('App.model.patientfile.SOAP', {
                extend: 'Ext.data.Model',
                fields: modelFields,
                proxy : {
                    type: 'direct',
                    api : {
                        read: Roles.getRolesData
                    }
                },
                belongsTo: { model: 'App.model.patientfile.Encounter', foreignKey: 'eid' }
            });
            me.soapPanel.doLayout();
        });

        this.getFormItems(me.speechDicPanel, 'Speech Dictation', function() {
            var formFields = me.speechDicPanel.getForm().getFields(),
                modelFields = [
                    {name: 'id', type: 'int'},
                    {name: 'pid', type: 'int'},
                    {name: 'eid', type: 'int'},
                    {name: 'uid', type: 'int'}
                ];

            Ext.each(formFields.items, function(field) {
                modelFields.push({name: field.name, type: 'auto'});
            });

            Ext.define('App.model.patientfile.SpeechDictation', {
                extend: 'Ext.data.Model',
                fields: modelFields,
                proxy : {
                    type: 'direct',
                    api : {
                        read: Roles.getRolesData
                    }
                },
                belongsTo: { model: 'App.model.patientfile.Encounter', foreignKey: 'eid' }
            });
            me.speechDicPanel.doLayout();
        });

        this.getFormItems(me.reviewSysCkPanel, 'Review of Systems Check', function() {
            var formFields = me.reviewSysCkPanel.getForm().getFields(),
                modelFields = [
                    {name: 'id', type: 'int'},
                    {name: 'pid', type: 'int'},
                    {name: 'eid', type: 'int'},
                    {name: 'uid', type: 'int'}
                ];

            Ext.each(formFields.items, function(field) {
                modelFields.push({name: field.name, type: 'auto'});
            });

            Ext.define('App.model.patientfile.ReviewOfSystemsCheck', {
                extend: 'Ext.data.Model',
                fields: modelFields,
                proxy : {
                    type: 'direct',
                    api : {
                        read: Roles.getRolesData
                    }
                },
                belongsTo: { model: 'App.model.patientfile.Encounter', foreignKey: 'eid' }
            });
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
		if(me.checkIfCurrPatient()) {
			var patient = me.getCurrPatient();
			me.updateTitle(patient.name + ' (Visits)');
			callback(true);
		} else {
			callback(false);
            me.currPatientError();
		}
	}
});
