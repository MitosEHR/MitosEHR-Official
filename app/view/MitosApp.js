/**
 * @namespace Navigation.getNavigation
 * @namespace Patient.currPatientSet
 * @namespace Patient.currPatientUnset
 * @namespace authProcedures.unAuth
 */
Ext.define('App.view.MitosApp', {
	extend       : 'Ext.Viewport',
	requires         : [

		'App.classes.RenderPanel',

		'Ext.chart.*',
		'Ext.fx.target.Sprite',

		'Ext.dd.DropZone',
		'Ext.dd.DragZone',

		'Extensible.calendar.CalendarPanel',
		'Extensible.calendar.gadget.CalendarListPanel',
		'Extensible.calendar.data.MemoryCalendarStore',
		'Extensible.calendar.data.MemoryEventStore',

		'App.classes.combo.*',
		'App.classes.combo.Users',
		'App.classes.combo.Roles',
		'App.classes.combo.TaxId',
		'App.classes.combo.Lists',
		'App.classes.combo.posCodes',
		'App.classes.combo.Titles',
		'App.classes.combo.CodesTypes',
		'App.classes.combo.Languages',
		'App.classes.combo.Authorizations',
		'App.classes.combo.Facilities',
		'App.classes.combo.TransmitMedthod',
		'App.classes.combo.InsurancePayerType',


		'App.classes.form.FormPanel',
		'App.classes.form.fields.Checkbox',
		'App.classes.window.Window',
		'App.classes.NodeDisabled',

		'App.view.dashboard.Dashboard',
		'App.view.calendar.Calendar',
		'App.view.messages.Messages',

		'App.view.patientfile.Vitals',
		'App.view.patientfile.NewPatient',
		'App.view.patientfile.Summary',
		'App.view.patientfile.Visits',
		'App.view.patientfile.Encounter',
		'App.view.patientfile.MedicalWindow',
		'App.view.patientfile.PatientCheckout',


		'App.view.fees.Billing',
		'App.view.fees.Payments',

		'App.view.administration.Facilities',
		'App.view.administration.Globals',
		'App.view.administration.Layout',
		'App.view.administration.Lists',
		'App.view.administration.Log',
		'App.view.administration.Practice',
		'App.view.administration.Roles',
		'App.view.administration.Services',
		'App.view.administration.PreventiveCare',
		'App.view.administration.Medications',
		'App.view.administration.Users',

		'App.view.miscellaneous.Addressbook',
		'App.view.miscellaneous.MyAccount',
		'App.view.miscellaneous.MySettings',
		'App.view.miscellaneous.OfficeNotes',
		'App.view.miscellaneous.Websearch'

	],

    minWidthToFullMode: 1680,
	currency: '$',

	initComponent: function() {

		Ext.tip.QuickTipManager.init();

		var me = this;

		me.lastCardNode = null;
		me.currCardCmp = null;
		me.currPatient = null;
		me.currEncounterId = null;
		me.user = user;
		/**
		 * TaskScheduler
		 * This will run all the procedures inside the checkSession
		 */
		Ext.TaskManager.start({
			run     : function() {
				me.checkSession();
				me.getPatientesInPoolArea();
			},
			interval: 50000
		});

		me.storeTree = Ext.create('App.store.navigation.Navigation', {
            autoLoad:true,
			listeners: {
				scope: me,
				load : me.afterNavigationLoad
			}
		});

		/**
		 * This store will handle the patient pool area
		 */
		me.patientPoolStore = Ext.create('App.store.poolarea.PoolArea');


		if(me.currency == '$'){
			me.icoMoney = 'icoDollar';
		}else if(me.currency == '€'){
			me.icoMoney = 'icoEuro';
		}else if(me.currency == '£'){
			me.icoMoney = 'icoLibra';
		}else if(me.currency == '¥'){
			me.icoMoney = 'icoYen';
		}

		/**
		 * MitosEHR Support Page
		 */
		me.winSupport = Ext.create('Ext.window.Window', {
			title        : 'Support',
			closeAction  : 'hide',
			bodyStyle    : 'background-color: #ffffff; padding: 5px;',
			animateTarget: me.Footer,
			resizable    : false,
			draggable    : false,
			maximizable  : false,
			autoScroll   : true,
			maximized    : true,
			dockedItems  : {
				xtype: 'toolbar',
				dock : 'top',
				items: ['-', {
					text   : lang.issuesBugs,
					iconCls: 'list',
					action : 'http://mitosehr.org/projects/mitosehr001/issues',
					scope  : me,
					handler: me.showMiframe
				}, '-', {
					text   : lang.newIssueBug,
					iconCls: 'icoAddRecord',
					action : 'http://mitosehr.org/projects/mitosehr001/issues/new',
					scope  : me,
					handler: me.showMiframe
				}]
			}
		});


		/**
		 * header Panel
		 */
		me.Header = Ext.create('Ext.container.Container', {
			region     : 'north',
			height     : 44,
			split      : false,
			collapsible: false,
			collapsed  : true,
			frame      : false,
			border     : false,
			bodyStyle  : 'background: transparent',
			margins    : '0 0 0 0',
			items      : [
				{
					xtype : 'container',
                    itemId: 'appLogo',
                    width : window.innerWidth < this.minWidthToFullMode ? 35 : 200,
					html  : '<img src="ui_app/app_logo.png" height="40" width="200" style="float:left">',
					style : 'float:left',
					border: false
				},
				{
					xtype    : 'button',
					scale    : 'large',
					style    : 'float:left',
					margin   : '0 0 0 5',
					itemId   : 'patientButton',
					scope    : me,
					handler  : me.openPatientSummary,
					listeners: {
						scope      : me,
						afterrender: me.patientBtnRender
					},
					tpl      : me.patientBtn()
				},
				{
					xtype  : 'button',
					scale  : 'large',
					style  : 'float:left',
					margin : '0 0 0 3',
					cls    : 'headerLargeBtn',
					padding: 0,
					itemId : 'patientOpenVisits',
					iconCls: 'icoBackClock',
					scope  : me,
					handler: me.openPatientVisits,
					tooltip: 'Open Patient Visits History'
				},
				{
					xtype  : 'button',
					scale  : 'large',
					style  : 'float:left',
					margin : '0 0 0 3',
					cls    : 'headerLargeBtn',
					padding: 0,
					itemId : 'patientCreateEncounter',
					iconCls: 'icoClock',
					scope  : me,
					handler: me.createNewEncounter,
					tooltip: 'Crate New Encounter'
				},
				{
					xtype  : 'button',
					scale  : 'large',
					style  : 'float:left',
					margin : '0 0 0 3',
					cls    : 'headerLargeBtn',
					padding: 0,
					itemId : 'patientCloseCurrEncounter',
					iconCls: 'icoArrowDown',
					scope  : me,
					handler: me.stowPatientRecord,
					tooltip: 'Stow Patient Record'
				},
				{
					xtype  : 'button',
					scale  : 'large',
					style  : 'float:left',
					margin : '0 0 0 3',
					cls    : 'headerLargeBtn',
					padding: 0,
					itemId : 'patientCheckOut',
					iconCls: 'icoCheck',
					scope  : me,
					handler: me.chargePatient,
					tooltip: 'Check Out Patient'
				},
                {
					xtype  : 'button',
					scale  : 'large',
					style  : 'float:left',
					margin : '0 0 0 3',
					cls    : 'headerLargeBtn',
					padding: 0,
					itemId : 'patientCharge',
					iconCls: me.icoMoney,
					scope  : me,
					handler: me.onPaymentEntryWindow,
					tooltip: 'Payment Entry'
				},
				{
					xtype      : 'panel',
					width      : 260,
					bodyPadding: '8 11 5 11',
					margin     : '0 0 0 3',
					style      : 'float:left',
					items      : [
						{
							xtype    : 'patienlivetsearch',
							emptyText: 'Patient Live Search...',
                            fieldStyle:'width:230',
							listeners: {
								scope : me,
								select: me.liveSearchSelect,
								blur  : function(combo) {
									combo.reset();
								}
							}
						}
					]
				},
				{
					xtype  : 'button',
					scale  : 'large',
					style  : 'float:left',
					margin : '0 0 0 3',
					padding: 4,
					itemId : 'patientNewReset',
					iconCls: 'icoAddPatient',
					scope  : me,
					handler: me.newPatient,
					tooltip: 'Create a new patient'
				},
				{
					xtype  : 'button',
					scale  : 'large',
					style  : 'float:left',
					margin : '0 0 0 3',
					cls    : 'headerLargeBtn emerBtn',
					overCls: 'emerBtnOver',
					padding: 0,
					itemId : 'createEmergency',
					iconCls: 'icoEmer',
					scope  : me,
					handler: me.createEmergency,
					tooltip: 'Create New Emergency'
				},
				{
					xtype    : 'button',
					text     : user.name,
					scale    : 'large',
					iconCls  : 'icoDoctor',
					iconAlign: 'left',
					cls      : 'drButton',
					style    : 'float:right',
					margin   : '0 0 0 3',
					menu     : [
						{
							text   : 'My account',
							iconCls: 'icoArrowRight',
							handler: function() {
								me.navigateTo('panelMyAccount');
							}
						},
						{
							text   : 'My settings',
							iconCls: 'icoArrowRight',
							handler: function() {
								me.navigateTo('panelMySettings');
							}
						},
						{
							text   : 'Logout',
							iconCls: 'icoArrowRight',
							scope  : me,
							handler: me.appLogout
						}
					]
				}
			]
		});


		/**
		 * The panel definition for the the TreeMenu & the support button
		 */
		me.navColumn = Ext.create('Ext.panel.Panel', {
			title      : lang.navigation,
			stateId    : 'navColumn',
			layout     : 'border',
			region     : 'west',
			width      : 200,
			split      : true,
 			collapsible: true,
 			collapsed  : false,
			items      : [
				{
					xtype      : 'treepanel',
					region     : 'center',
					cls        : 'nav_tree',
					hideHeaders: true,
					rootVisible: false,
					border     : false,
					store      : me.storeTree,
					width      : 200,
					plugins    : [
						{ptype: 'nodedisabled'}
					],
//					root       : {
//						nodeType : 'async',
//						draggable: false
//					},
					listeners  : {
						scope          : me,
						selectionchange: me.onNavigationNodeSelected
					}
				},
				{
					xtype      : 'panel',
					title      : lang.patientPoolArea,
					layout     : 'fit',
					region     : 'south',
					itemId     : 'patientPoolArea',
					bodyPadding: 5,
					height     : 25,
					cls         :'patient-pool',
					split:true,
					collapsible: true,
					border     : false,
					items      : [
						{
							xtype            : 'dataview',
							loadMask         : false,
							cls              : 'patient-pool-view',
							tpl              : '<tpl for=".">' +

								'<div class="patient-pool-btn x-btn x-btn-default-large">' +
								'<div class="patient_btn_img"><img src="ui_icons/user_32.png"></div>' +
								'<div class="patient_btn_info">' +
								'<div class="patient-name">{shortName}</div>' +
								'<div class="patient-name">({pid})</div>' +
								'</div>' +
								'</div>' +
								'</tpl>',
							itemSelector     : 'div.patient-pool-btn',
							overItemCls      : 'patient-over',
							selectedItemClass: 'patient-selected',
							singleSelect     : true,
							store            : me.patientPoolStore,
							listeners        : {
								scope : me,
								render: me.initializeOpenEncounterDragZone
							}
						}
					]
				}
			],
			dockedItems: [
				{
					xtype  : 'toolbar',
					dock   : 'bottom',
					border : true,
					margin : '3 0 0 0',
					padding: 5,
					layout : {
						type: 'hbox',
						pack: 'center'
					},
					items  : ['-', {
						xtype  : 'button',
						frame  : true,
						text   : 'MithosEHR ' + lang.support,
						iconCls: 'icoHelp',
						action : 'http://mitosehr.org/projects/mitosehr001/wiki',
						scope  : me,
						handler: me.showMiframe
					}, '-']
				}
			],
			listeners  : {
				scope         : me,
				beforecollapse: me.navCollapsed,
				beforeexpand  : me.navExpanded

			}
		});


		/**
		 * MainPanel is where all the pages are display
		 */
		me.MainPanel = Ext.create('Ext.container.Container', {
			region   : 'center',
			layout   : 'card',
			border   : true,
			itemId   : 'MainPanel',
			defaults : { layout: 'fit', xtype: 'container' },
			items    : [

			/**
			 * General Area
			 */
				Ext.create('App.view.dashboard.Dashboard'), // done  TODO: panels
				Ext.create('App.view.calendar.Calendar'), // done
				Ext.create('App.view.messages.Messages'), // done
				Ext.create('App.view.search.PatientSearch'), //

			/**
			 * Patient Area
			 */
				Ext.create('App.view.patientfile.NewPatient'),
				Ext.create('App.view.patientfile.Summary'),
				Ext.create('App.view.patientfile.Visits'),
				Ext.create('App.view.patientfile.Encounter'),
				Ext.create('App.view.patientfile.PatientCheckout'),


			/**
			 * Fees Area
			 */
				Ext.create('App.view.fees.Billing'),
				Ext.create('App.view.fees.Payments'),


			/**
			 * Miscellaneous
			 */
				Ext.create('App.view.miscellaneous.Addressbook'),
				Ext.create('App.view.miscellaneous.MyAccount'),
				Ext.create('App.view.miscellaneous.MySettings'),
				Ext.create('App.view.miscellaneous.OfficeNotes'),
				Ext.create('App.view.miscellaneous.Websearch'),


				me.ppdz = Ext.create('App.view.PatientPoolDropZone')

            ],
            listeners:{
                scope:me,
                afterrender:me.initializeOpenEncounterDropZone
            }
		});


		/**
		 * Add Administration Area Panels
		 */
		if(perm.access_gloabal_settings) {
			me.MainPanel.add(Ext.create('App.view.administration.Globals'));
		}
		if(perm.access_facilities) {
			me.MainPanel.add(Ext.create('App.view.administration.Facilities'));
		}
		if(perm.access_users) {
			me.MainPanel.add(Ext.create('App.view.administration.Users'));
		}
		if(perm.access_practice) {
			me.MainPanel.add(Ext.create('App.view.administration.Practice'));
		}
		if(perm.access_services) {
			me.MainPanel.add(Ext.create('App.view.administration.Services'));
		}
		if(perm.access_preventive_care) {
			me.MainPanel.add(Ext.create('App.view.administration.PreventiveCare'));
		}
		if(perm.access_medications) {
			me.MainPanel.add(Ext.create('App.view.administration.Medications'));
		}
		if(perm.access_roles) {
			me.MainPanel.add(Ext.create('App.view.administration.Roles'));
		}
		if(perm.access_layouts) {
			me.MainPanel.add(Ext.create('App.view.administration.Layout'));
		}
		if(perm.access_lists) {
			me.MainPanel.add(Ext.create('App.view.administration.Lists'));
		}
		if(perm.access_event_log) {
			me.MainPanel.add(Ext.create('App.view.administration.Log'));
		}


		/**
		 * Footer Panel
		 */
		me.Footer = Ext.create('Ext.container.Container', {
			height : window.innerWidth < me.minWidthToFullMode ? 60 : 30,
			split  : false,
			padding: '3 0',
			region : 'south',
			items  : [
				{
					xtype            : 'dataview',
					margin           : '0 0 3 0',
					hidden           : window.innerWidth >= me.minWidthToFullMode,
					cls              : 'patient-pool-view-footer x-toolbar x-toolbar-default x-box-layout-ct',
					tpl              : '<div class="x-toolbar-separator x-toolbar-item x-toolbar-separator-horizontal" style="float:left; margin-top:5px;" role="presentation" tabindex="-1"></div>' +
						'<tpl for=".">' +
						'<div class="patient-pool-btn-small x-btn x-btn-default-small" style="float:left">' +
						'<div class="patient_btn_info">' +
						'<div class="patient-name">{name} ({pid})</div>' +
						'</div>' +
						'</div>' +
						'<div class="x-toolbar-separator x-toolbar-item x-toolbar-separator-horizontal" style="float:left; margin-top:5px; margin-left:3px;" role="presentation" tabindex="-1"></div>' +
						'</tpl>',
					itemSelector     : 'div.patient-pool-btn-small',
					overItemCls      : 'patient-over',
					selectedItemClass: 'patient-selected',
					singleSelect     : true,
					loadMask         : false,
					store            : me.patientPoolStore,
					listeners        : {
						scope : me,
						render: me.initializeOpenEncounterDragZone
					}
				},
				{
					xtype: 'toolbar',
					dock : 'bottom',
					items: [
						{
							text    : 'Copyright (C) 2011 MitosEHR (Electronic Health Records) |:|  Open Source Software operating under GPLv3 ',
							iconCls : 'icoGreen',
							disabled: true,
							action  : 'http://mitosehr.org/projects/mitosehr001',
							scope   : me,
							handler : me.showMiframe
						},
						'->',
						{
							text   : 'news',
							action : 'http://mitosehr.org/projects/mitosehr001/news',
							scope  : me,
							handler: me.showMiframe
						},
						'-',
						{
							text   : 'wiki',
							action : 'http://mitosehr.org/projects/mitosehr001/wiki',
							scope  : me,
							handler: me.showMiframe
						},
						'-',
						{
							text   : 'issues',
							action : 'http://mitosehr.org/projects/mitosehr001/issues',
							scope  : me,
							handler: me.showMiframe
						},
						'-',
						{
							text   : 'forums',
							action : 'http://mitosehr.org/projects/mitosehr001/boards',
							scope  : me,
							handler: me.showMiframe
						}
					]
				}
			]
		});

		me.MedicalWindow = Ext.create('App.view.patientfile.MedicalWindow');
		me.ChartsWindow = Ext.create('App.view.patientfile.ChartsWindow');
        me.PaymentEntryWindow = Ext.create('App.view.patientfile.PaymentEntryWindow');


		me.layout = { type: 'border', padding: 3 };
		me.defaults = { split: true };
		me.items = [ me.Header, me.navColumn, me.MainPanel, me.Footer ];

		me.listeners = {
			afterrender: me.afterAppRender
		};

		me.callParent(arguments);

	},

	onMedicalWin: function(btn) {
		this.MedicalWindow.show();
		this.MedicalWindow.down('toolbar').getComponent(btn.action).toggle(true);
		this.MedicalWindow.cardSwitch(btn);
	},

	onChartsWin: function() {
		this.ChartsWindow.show();
	},

    onPaymentEntryWindow: function() {
		this.PaymentEntryWindow.show();
	},

	newPatient: function() {
		var me = this;
		me.navigateTo('panelNewPatient');
	},

	createEmergency: function() {
		alert('Emergency Button Clicked');
	},

	createNewEncounter: function() {
		var me = this;

		me.navigateTo('panelEncounter', function(success) {
			if(success) {
				me.currCardCmp.newEncounter();
			}
		});
	},

	sendPatientTo: function(btn) {
		var area = btn.action;
		alert('TODO: Patient will be sent to ' + area);
	},


	openPatientSummary: function() {
		var me = this;

		if(me.currCardCmp == Ext.getCmp('panelSummary')) {
			var same = true;
		}

		me.navigateTo('panelSummary', function() {
			if(same) {
				me.currCardCmp.onActive();
			}
		});
	},

	stowPatientRecord: function() {
		this.patientUnset();
		this.navigateTo('panelDashboard');
	},

	openCurrEncounter: function() {
		var me = this;

		this.navigateTo('panelEncounter', function(success){
			if(success) {
				//me.currCardCmp.openEncounter(eid);
			}
		});
	},

	openEncounter: function(eid) {
		var me = this;

		me.navigateTo('panelEncounter', function(success) {
			if(success) {
				me.currCardCmp.openEncounter(eid);
			}
		});
	},

	checkOutPatient: function() {

	},

    chargePatient: function() {
        this.navigateTo('panelVisitPayment');
	},

	openPatientVisits: function() {
		this.navigateTo('panelVisits');
	},

	navigateTo: function(id, callback) {
		var tree = this.navColumn.down('treepanel'),
			treeStore = tree.getStore(),
			sm = tree.getSelectionModel(),
			node = treeStore.getNodeById(id);

		sm.select(node);
		if(typeof callback == 'function') {
			callback(true);
		}
	},

	navigateToDefault: function() {
		//this.navigateTo('panelDashboard');
	},

    afterNavigationLoad:function(){
        window.innerWidth < this.minWidthToFullMode ? this.navColumn.collapse() : this.navColumn.expand();
    },

	onNavigationNodeSelected: function(model, selected) {
		var me = this;
        if(0 < selected.length){
            if(selected[0].data.leaf) {
                var tree = me.navColumn.down('treepanel'),
                    sm = tree.getSelectionModel(),
                    card = selected[0].data.id,
                    layout = me.MainPanel.getLayout(),
                    cardCmp = Ext.getCmp(card);

                me.currCardCmp = cardCmp;
                layout.setActiveItem(card);
                cardCmp.onActive(function(success) {
                    (success) ? me.lastCardNode = sm.getLastSelected() : me.goBack();
                });
            }
        }
	},

	goBack: function() {
		var tree = this.navColumn.down('treepanel'),
			sm = tree.getSelectionModel();
		sm.select(this.lastCardNode);
	},

	navCollapsed: function() {
		var navView = this.navColumn.getComponent('patientPoolArea'),
            appLogo = this.Header.getComponent('appLogo'),
			foot = this.Footer,
			footView = foot.down('dataview');

        appLogo.hide();
		navView.hide();
		foot.setHeight(60);
		footView.show();
	},

	navExpanded: function() {
		var navView = this.navColumn.getComponent('patientPoolArea'),
            appLogo = this.Header.getComponent('appLogo'),
			foot = this.Footer,
			footView = foot.down('dataview');

        appLogo.show();
		navView.show();
		foot.setHeight(30);
		footView.hide();
	},

	liveSearchSelect: function(combo, selection) {
		var me = this,
			post = selection[0],
			btn = me.Header.getComponent('patientButton');

		if(post) {
			/**
			 * Ext.direct function
			 * @param pid int
			 */
			Patient.currPatientSet({pid: post.get('pid')}, function() {
                me.setCurrPatient(post.get('pid'),post.get('fullname'),function(){
                    me.openPatientSummary();
                });
			});
		}
	},

	setCurrPatient: function(pid, fullname, callback) {

		var me = this,
            patientBtn = me.Header.getComponent('patientButton'),
			patientOpenVisitsBtn = me.Header.getComponent('patientOpenVisits'),
			patientCreateEncounterBtn = me.Header.getComponent('patientCreateEncounter'),
			patientCloseCurrEncounterBtn = me.Header.getComponent('patientCloseCurrEncounter'),
			patientChargeBtn = me.Header.getComponent('patientCharge'),
			patientCheckOutBtn = me.Header.getComponent('patientCheckOut');

        Patient.currPatientSet({ pid:pid }, function(){
            me.currPatient = {
                pid : pid,
                name: fullname
            };
            patientBtn.update({ pid:pid, name:fullname });
            patientBtn.enable();
            patientOpenVisitsBtn.enable();
            patientCreateEncounterBtn.enable();
            patientCloseCurrEncounterBtn.enable();
	        patientChargeBtn.enable();
            patientCheckOutBtn.enable();
            if(typeof callback == 'function') {
                callback(true);
            }
        });
	},

	patientUnset: function() {
		var me = this,
            patientBtn = me.Header.getComponent('patientButton'),
			patientOpenVisitsBtn = me.Header.getComponent('patientOpenVisits'),
			patientCreateEncounterBtn = me.Header.getComponent('patientCreateEncounter'),
			patientCloseCurrEncounterBtn = me.Header.getComponent('patientCloseCurrEncounter'),
			patientChargeBtn = me.Header.getComponent('patientCharge'),
			patientCheckOutBtn = me.Header.getComponent('patientCheckOut');
		/**
		 * Ext.direct function
		 */
		Patient.currPatientUnset(function() {
            me.currEncounterId = null;
            me.currPatient = null;
			patientCreateEncounterBtn.disable();
			patientOpenVisitsBtn.disable();
			patientCloseCurrEncounterBtn.disable();
			patientChargeBtn.disable();
			patientCheckOutBtn.disable();
            patientBtn.disable();
			patientBtn.update({ pid:'record number', name:'No Patient Selected'});
		});
	},


	showMiframe: function(btn) {
		var src = btn.action;
		this.winSupport.remove(this.miframe);
		this.winSupport.add(this.miframe = Ext.create('App.classes.ManagedIframe', {src: src}));
		this.winSupport.show();
	},

	msg: function(title, format) {
		if(!this.msgCt) {
			this.msgCt = Ext.core.DomHelper.insertFirst(document.body, {id: 'msg-div'}, true);
		}
		this.msgCt.alignTo(document, 't-t');
		var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1)),
		    m = Ext.core.DomHelper.append(this.msgCt, {html: '<div class="msg"><h3>' + title + '</h3><p>' + s + '</p></div>'}, true);
		m.slideIn('t').pause(3000).ghost('t', {remove: true});
	},

	checkSession: function() {
		/**
		 * Ext.direct functions
		 */
		authProcedures.ckAuth(function(provider, response) {
			if(!response.result.authorized) {
				authProcedures.unAuth(function() {
					window.location = "./"
				});
			}
		});
	},

	patientBtn: function() {
		return Ext.create('Ext.XTemplate',
			'<div class="patient_btn">',
			'<div class="patient_btn_img"><img src="ui_icons/user_32.png"></div>',
			'<div class="patient_btn_info">',
			'<div class="patient_btn_name">{name}</div>',
			'<div class="patient_btn_record">( {pid} )</div>',
			'</div>',
			'</div>');
	},

    patientBtnRender:function(btn){
        this.patientUnset();
        this.initializePatientPoolDragZone(btn)
    },

	getPatientesInPoolArea:function(){
		var poolArea = this.navColumn.getComponent('patientPoolArea'),
			height = 35;
		this.patientPoolStore.load({
			callback:function(records){
				if(records.length >= 1){
					Ext.each(records, function(record){
						height = height + 45;
					});
				}else{
					height = 25;
				}
				height = (height >= 303)? 303 : height;
				poolArea.down('dataview').refresh();
				poolArea.setHeight(height);
				poolArea.doLayout();
			}
		});
	},

	appLogout: function() {
		Ext.Msg.show({
			title  : 'Please confirm...',
			msg    : 'Are you sure to quit MitosEHR?',
			icon   : Ext.MessageBox.QUESTION,
			buttons: Ext.Msg.YESNO,
			fn     : function(btn) {
				if(btn == 'yes') {
					authProcedures.unAuth(function() {
						window.location = "./"
					});
				}
			}
		});
	},

    initializePatientPoolDragZone: function(panel) {
        panel.dragZone = Ext.create('Ext.dd.DragZone', panel.getEl(), {
            ddGroup    : 'patientPoolAreas',
            // On receipt of a mousedown event, see if it is within a draggable element.
            // Return a drag data object if so. The data object can contain arbitrary application
            // data, but it should also contain a DOM element in the ddel property to provide
            // a proxy to drag.
            getDragData: function() {

                var sourceEl = app.Header.getComponent('patientButton').el.dom, d;
                app.MainPanel.getLayout().setActiveItem(app.ppdz);
                app.navColumn.down('treepanel').getSelectionModel().deselectAll();


                if(sourceEl) {
                    d = sourceEl.cloneNode(true);
                    d.id = Ext.id();
                    return panel.dragData = {
                        copy       : true,
                        sourceEl   : sourceEl,
                        repairXY   : Ext.fly(sourceEl).getXY(),
                        ddel       : d,
                        patient    : [ panel.data ]
                    };
                }
            },
            // Provide coordinates for the proxy to slide back to on failed drag.
            // This is the original XY coordinates of the draggable element.
            getRepairXY: function() {
                app.goBack();
                return this.dragData.repairXY;
            }
        });
    },

	/**
	 *
	 * @param panel
	 */
	initializeOpenEncounterDragZone: function(panel) {
		panel.dragZone = Ext.create('Ext.dd.DragZone', panel.getEl(), {
			ddGroup    : 'patient',
			// On receipt of a mousedown event, see if it is within a draggable element.
			// Return a drag data object if so. The data object can contain arbitrary application
			// data, but it should also contain a DOM element in the ddel property to provide
			// a proxy to drag.
			getDragData: function(e) {
				var sourceEl = e.getTarget(panel.itemSelector, 10), d;
				app.MainPanel.el.mask('Drop Here To Open <strong>"' + panel.getRecord(sourceEl).data.name + '"</strong> Current Encounter');
				if(sourceEl) {
					d = sourceEl.cloneNode(true);
					d.id = Ext.id();
					return panel.dragData = {
						sourceEl   : sourceEl,
						repairXY   : Ext.fly(sourceEl).getXY(),
						ddel       : d,
						patientData: panel.getRecord(sourceEl).data
					};
				}
			},
			// Provide coordinates for the proxy to slide back to on failed drag.
			// This is the original XY coordinates of the draggable element.
			getRepairXY: function() {
				app.MainPanel.el.unmask();
				return this.dragData.repairXY;
			}
		});
	},

	/**
	 *
	 * @param panel
	 */
	initializeOpenEncounterDropZone: function(panel) {
		var me = this;
		panel.dropZone = Ext.create('Ext.dd.DropZone', panel.getEl(), {
			ddGroup   : 'patient',
			notifyOver: function() {
				return Ext.dd.DropZone.prototype.dropAllowed;
			},
			notifyDrop: function(dd, e, data) {
				app.MainPanel.el.unmask();

				me.setCurrPatient(data.patientData.pid, data.patientData.name, function(){
                    me.openEncounter(data.patientData.eid);
                });

			}
		});
	},

	afterAppRender: function() {
		Ext.get('mainapp-loading').remove();
		Ext.get('mainapp-loading-mask').fadeOut({remove: true});
	},

	getCurrPatient: function() {
		return this.currPatient;
	},

	getMitosApp: function() {
		return this;
	},

    accessDenied: function(){
        Ext.Msg.show({
            title  : 'Oops!',
            msg    : 'Access Denied',
            buttons: Ext.Msg.OK,
            icon   : Ext.Msg.ERROR
        });
    }

});