/**
 * @namespace Navigation.getNavigation
 * @namespace Patient.currPatientSet
 * @namespace Patient.currPatientUnset
 * @namespace authProcedures.unAuth
 */
Ext.define('App.view.MitosApp', {
	extend       : 'Ext.Viewport',
	uses         : [

		'App.classes.RenderPanel',
		'App.classes.CRUDStore',
		'App.classes.restStoreModel',

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

		'App.view.patientfile.NewPatient',
		'App.view.patientfile.Summary',
		'App.view.patientfile.Visits',
		'App.view.patientfile.Encounter',
		'App.view.patientfile.MedicalWindow',


		'App.view.fees.Billing',
		'App.view.fees.Checkout',
		'App.view.fees.FeesSheet',
		'App.view.fees.Payments',

		'App.view.administration.Facilities',
		'App.view.administration.Globals',
		'App.view.administration.Layout',
		'App.view.administration.Lists',
		'App.view.administration.Log',
		'App.view.administration.Practice',
		'App.view.administration.Roles',
		'App.view.administration.Services',
		'App.view.administration.Users',

		'App.view.miscellaneous.Addressbook',
		'App.view.miscellaneous.MyAccount',
		'App.view.miscellaneous.MySettings',
		'App.view.miscellaneous.OfficeNotes',
		'App.view.miscellaneous.Websearch'

	],
	initComponent: function() {

		var me = this;

		me.lastCardNode = null;
		me.currCardCmp = null;
		me.currPatient = null;
		/**
		 * TaskScheduler
		 * This will run all the procedures inside the checkSession
		 */
		Ext.TaskManager.start({
			run     : function() {
				//me.checkSession();
				me.patientPoolStore.load();
			},
			interval: 50000
		});

		me.storeTree = Ext.create('App.store.navigation.Navigation', {
			listeners: {
				scope: me,
				load : me.navigateToDefault
			}
		});

		/**
		 * This store will handle the patient pool area
		 */
		me.patientPoolStore = Ext.create('App.store.poolarea.PoolArea');

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
					scope  : me,
					handler: function() {
						me.showMiframe('http://mitosehr.org/projects/mitosehr001/issues');
					}
				}, '-', {
					text   : lang.newIssueBug,
					iconCls: 'icoAddRecord',
					scope  : me,
					handler: function() {
						me.showMiframe('http://mitosehr.org/projects/mitosehr001/issues/new');
					}
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
			frame      : false,
			border     : false,
			bodyStyle  : 'background: transparent',
			margins    : '0 0 0 0',
			items      : [
				{
					xtype : 'container',
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
						afterrender: me.patientUnset
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
					xtype   : 'button',
					scale   : 'large',
					style   : 'float:left',
					margin  : '0 0 0 3',
					cls     : 'headerLargeBtn',
					padding : 0,
					itemId  : 'patientPushFor',
					iconCls : 'icoArrowRight',
					scope   : me,
					tooltip : 'Sent Current Patient Record To...',
					arrowCls: 'none',
					menu    : [
						{
							text   : 'Front Office',
							iconCls: 'icoArrowRight',
							action : 'fronOffice',
							handler: me.sendPatientTo
						},
						{
							text   : 'Triage',
							iconCls: 'icoArrowRight',
							action : 'triage',
							handler: me.sendPatientTo
						},
						{
							text   : 'Doctor',
							iconCls: 'icoArrowRight',
							action : 'doctor',
							scope  : me,
							handler: me.sendPatientTo
						}
					]
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
					handler: me.checkOutPatient,
					tooltip: 'Check Out Patient'
				},
				{
					xtype      : 'panel',
					width      : 260,
					bodyPadding: '8 11 5 11',
					margin     : '0 0 0 3',
					style      : 'float:left',
					layout     : 'anchor',
					items      : [
						{
							xtype    : 'patienlivetsearch',
							emptyText: 'Patient Live Search...',
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
					tooltip: 'Create New Ememercency'
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
					root       : {
						nodeType : 'async',
						draggable: false
					},
					listeners  : {
						scope          : me,
						selectionchange: me.onNavigationNodeSelected
					}
				},
				{
					xtype      : 'panel',
					title      : lang.patientPoolArea,
					layout     : 'vbox',
					region     : 'south',
					itemId     : 'patientPoolArea',
					bodyPadding: 5,
					height     : 300,
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
								render: me.initializePatientDragZone
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
						scope  : me,
						handler: function() {
							me.showMiframe('http://mitosehr.org/projects/mitosehr001/wiki');
						}
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


			/**
			 * Fees Area
			 */
				Ext.create('App.view.fees.Billing'),
				Ext.create('App.view.fees.Checkout'),
				Ext.create('App.view.fees.FeesSheet'),
				Ext.create('App.view.fees.Payments'),


			/**
			 * Miscellaneous
			 */
				Ext.create('App.view.miscellaneous.Addressbook'),
				Ext.create('App.view.miscellaneous.MyAccount'),
				Ext.create('App.view.miscellaneous.MySettings'),
				Ext.create('App.view.miscellaneous.OfficeNotes'),
				Ext.create('App.view.miscellaneous.Websearch')

			],
			listeners: {
				scope      : me,
				afterrender: me.initializeHospitalDropZone
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
			height : 30,
			split  : false,
			padding: '3 0',
			region : 'south',
			items  : [
				{
					xtype            : 'dataview',
					margin           : '0 0 3 0',
					hidden           : true,
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
					store            : me.patientPoolStore,
					listeners        : {
						scope : me,
						render: me.initializePatientDragZone
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
							scope   : me,
							handler : function() {
								me.showMiframe('http://mitosehr.org/projects/mitosehr001');
							}
						},
						'->',
						{
							text   : 'news',
							scope  : me,
							handler: function() {
								me.showMiframe('http://mitosehr.org/projects/mitosehr001/news');
							}
						},
						'-',
						{
							text   : 'wiki',
							scope  : me,
							handler: function() {
								me.showMiframe('http://mitosehr.org/projects/mitosehr001/wiki');
							}
						},
						'-',
						{
							text   : 'issues',
							scope  : me,
							handler: function() {
								me.showMiframe('http://mitosehr.org/projects/mitosehr001/issues');
							}
						},
						'-',
						{
							text   : 'forums',
							scope  : me,
							handler: function() {
								me.showMiframe('http://mitosehr.org/projects/mitosehr001/boards');
							}
						}
					]
				}
			]
		});

		me.layout = { type: 'border', padding: 3 };
		me.defaults = { split: true };
		me.items = [ me.Header, me.navColumn, me.MainPanel, me.Footer ];

		me.listeners = {
			afterrender: me.afterAppRender
		};

		me.callParent(arguments);
	},

	onMedicalWin: function(action) {
		//if(typeof this.MedicalWindow === "undefined"){
			this.MedicalWindow = Ext.create('App.view.patientfile.MedicalWindow').show();
		//}else{
		//	this.MedicalWindow.show();
		//}
	},

	onChartsWin: function() {
		if(typeof this.ChartsWindow === "undefined"){
			this.ChartsWindow = Ext.create('App.view.patientfile.ChartsWindow').show();
		}else{
			this.ChartsWindow.show();
		}
	},

	newPatient: function() {
		var me = this;
		me.navigateTo('panelNewPatient', function() {
			me.patientUnset();

		});
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
		this.navigateTo('panelDashboard');
	},

	onNavigationNodeSelected: function(model, selected) {
		var me = this;

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
	},

	goBack: function() {
		var tree = this.navColumn.down('treepanel'),
			sm = tree.getSelectionModel();
		sm.select(this.lastCardNode);
	},

	navCollapsed: function() {
		var navView = this.navColumn.getComponent('patientPoolArea'),
			foot = this.Footer,
			footView = foot.down('dataview');

		navView.hide();
		foot.setHeight(60);
		footView.show();
	},

	navExpanded: function() {
		var navView = this.navColumn.getComponent('patientPoolArea'),
			foot = this.Footer,
			footView = foot.down('dataview');

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
				me.currPatient = {
					pid : post.get('pid'),
					name: post.get('fullname')
				};
				btn.update({name: post.get('fullname'), info: '(' + post.get('pid') + ')'});
				btn.enable();
				me.openPatientSummary();
			});
		}
	},

	setCurrPatient: function(pid, fullname, callback) {
		var btn = this.Header.getComponent('patientButton');

		this.currPatient = {
			pid : pid,
			name: fullname
		};
		btn.update({name: fullname, info: '(' + pid + ')'});
		btn.enable();
		if(typeof callback == 'function') {
			callback(true);
		}
	},

	patientUnset: function() {
		var btn = this.Header.getComponent('patientButton');
		/**
		 * Ext.direct function
		 */
		Patient.currPatientUnset(function() {
			btn.update({name: 'No Patient Selected', info: '( record )'});
		});
	},


	showMiframe: function(src) {
		this.winSupport.remove(this.miframe);
		this.winSupport.add(this.miframe = Ext.create('App.ManagedIframe', {src: src}));
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
		return new Ext.create('Ext.XTemplate',
			'<div class="patient_btn">',
			'<div class="patient_btn_img"><img src="ui_icons/user_32.png"></div>',
			'<div class="patient_btn_info">',
			'<div class="patient_btn_name">{name}</div>',
			'<div class="patient_btn_record">{info}</div>',
			'</div>',
			'</div>', {
				defaultValue: function(v) {
					return (v) ? v : 'No Patient Selected';
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


	/**
	 *
	 * @param panel
	 */
	initializePatientDragZone: function(panel) {
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
	initializeHospitalDropZone: function(panel) {
		var me = this;
		panel.dropZone = Ext.create('Ext.dd.DropZone', panel.getEl(), {
			ddGroup   : 'patient',
			notifyOver: function() {
				return Ext.dd.DropZone.prototype.dropAllowed;
			},
			notifyDrop: function(dd, e, data) {
				app.MainPanel.el.unmask();
				Patient.currPatientSet({pid:data.patientData.pid});
				me.setCurrPatient(data.patientData.pid, data.patientData.name);
				me.openEncounter(data.patientData.eid);

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
	}

});