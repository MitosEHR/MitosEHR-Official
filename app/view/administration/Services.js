/**
 * services.ejs.php
 * Services
 * v0.0.1
 *
 * Author: Ernest Rodriguez
 *
 * MitosEHR (Electronic Health Records) 2011
 *
 *
 * @namespace Services.getServices
 * @namespace Services.addService
 * @namespace Services.updateService
 */
Ext.define('App.view.administration.Services', {
	extend       : 'App.classes.RenderPanel',
	id           : 'panelServices',
	pageTitle    : 'Services',
	pageLayout   : 'border',
	uses         : [
		'App.classes.GridPanel',
		'App.classes.combo.CodesTypes',
		'App.classes.combo.Titles'
	],
	initComponent: function() {
		var me = this;

		me.active = 1;
		me.query = '';
        me.code_type = '2';

		me.store = Ext.create('App.store.administration.Services');


		function code_type(val) {
			if(val == '1') {
				return 'CPT4';
			} else if(val == '2') {
				return 'ICD9';
			} else if(val == '3') {
				return 'HCPCS';
			} else if(val == '100') {
				return 'CVX';
			}
			return val;
		}

		function bool(val) {
			if(val == '0') {
				return '<img src="ui_icons/no.gif" />';
			} else if(val == '1') {
				return '<img src="ui_icons/yes.gif" />';
			}
			return val;
		}

		me.servicesGrid = Ext.create('App.classes.GridPanel', {
			region : 'center',
			store  : me.store,
			columns: [
				{ header: 'id', sortable: false, dataIndex: 'id', hidden: true},
				{ width: 80, header: 'Code Type', sortable: true, dataIndex: 'code_type', renderer: code_type },
				{ width: 80, header: 'Code', sortable: true, dataIndex: 'code' },
				{ width: 80, header: 'Modifier', sortable: true, dataIndex: 'modifier' },
				{ width: 60, header: 'Active', sortable: true, dataIndex: 'active', renderer: bool },
				{ width: 70, header: 'Reportable', sortable: true, dataIndex: 'reportable', renderer: bool },
				{ flex: 1, header: 'Description', sortable: true, dataIndex: 'code_text' },
				{ width: 100, header: 'Standard', sortable: true, dataIndex: 'none' }
			],
			plugins: Ext.create('App.classes.grid.RowFormEditing', {
				autoCancel  : false,
				errorSummary: false,
				clicksToEdit: 1,
				formItems   : [
					{ layout         : 'column',
						region       : 'center',
						defaults     : { border: false, columnWidth: .5, defaultType: 'textfield', layout: 'anchor'},
						fieldDefaults: { msgTarget: 'side', labelWidth: 100, anchor: '80%' },
						items        : [
							{
								xtype: 'container',
								items: [
									{
										fieldLabel     : 'Immunization Name',
										name           : 'immunization_name'

									},
									{
										fieldLabel     : 'Sex',
										name           : 'sex'

									},
									{
										fieldLabel: '',
										name      : ''

									},
									{
										fieldLabel: 'Immunization Manufacturer',
										name      : 'manufacturer'

									},
									{
										fieldLabel: 'Immunization Lot Number',
										name      : 'lot_number'

									}
								]
							},
							{
								xtype: 'container',
								items: [
									{
										fieldLabel: 'Ocurrence',
										xtype     : 'mitos.occurrencecombo',
										name      : 'ocurrence'

									},
									{
										fieldLabel: 'Name and Title of Immunization Administrator',
										name      : 'administered_by'

									},
									{
										fieldLabel: 'Date Immunization Information Statements Given',
										xtype     : 'datefield',
										format    : 'Y-m-d H:i:s',
										name      : 'education_date'
									},
									{
										fieldLabel: 'Date of VIS Statement (?)',
										xtype     : 'datefield',
										format    : 'Y-m-d H:i:s',
										name      : 'vis_date'
									},
									{
										fieldLabel: 'Notes',
										xtype     : 'textarea',
										height    : 70,
										name      : 'note'

									}
								]
							}
						]

					},
					{ xtype   : 'container',
						layout: 'column',
						items : [

							{
								xtype    : 'fieldcontainer',
								defaults : { labelWidth: 70 },
								msgTarget: 'under',
								items    : [
									{ width: 200, fieldLabel: 'Type', xtype: 'mitos.codestypescombo', name: 'code_type' },
									{ width: 155, fieldLabel: 'Code', xtype: 'textfield', name: 'code', labelWidth: 40 },
									{ width: 200, fieldLabel: 'Modifier', xtype: 'textfield', name: 'mod' },
									{ width: 280, fieldLabel: 'Active?', xtype: 'mitos.checkbox', name: 'active' }
								]
							},
							{
								xtype    : 'fieldcontainer',
								defaults : { labelWidth: 70 },
								msgTarget: 'under',
								items    : [
									{ width: 380, fieldLabel: 'Description', xtype: 'textfield', name: 'code_text' },
									{ width: 200, fieldLabel: 'Category', xtype: 'mitos.titlescombo', name: 'title' },
									// placeholder
									{ width: 200, fieldLabel: 'Reportable?', xtype: 'mitos.checkbox', name: 'reportable' }
								]
							}


						]

					},
					{ xtype   : 'container',
						layout: 'column',
						items : [
							{
								xtype    : 'fieldcontainer',
								defaults : { labelWidth: 70 },
								msgTarget: 'under',
								items    : [
									{ width: 200, fieldLabel: 'Type', xtype: 'mitos.codestypescombo', name: 'code_type' },
									{ width: 155, fieldLabel: 'Code', xtype: 'textfield', name: 'code', labelWidth: 40 },
									{ width: 200, fieldLabel: 'Modifier', xtype: 'textfield', name: 'mod' },
									{ width: 280, fieldLabel: 'Active?', xtype: 'mitos.checkbox', name: 'active' }
								]
							},
							{
								xtype    : 'fieldcontainer',
								defaults : { labelWidth: 70 },
								msgTarget: 'under',
								items    : [
									{ width: 380, fieldLabel: 'Description', xtype: 'textfield', name: 'code_text' },
									{ width: 200, fieldLabel: 'Category', xtype: 'mitos.titlescombo', name: 'title' },
									// placeholder
									{ width: 200, fieldLabel: 'Reportable?', xtype: 'mitos.checkbox', name: 'reportable' }
								]
							}
						]

					}
				]
			}),


			listeners: {
				scope    : me,
				itemclick: function(view, record) {
					me.onItemclick(me.store, record, 'Edit Service');
				}
			},
			tbar     : Ext.create('Ext.PagingToolbar', {
				store      : me.store,
				displayInfo: true,
				emptyMsg   : "No Office Notes to display",
				plugins    : Ext.create('Ext.ux.SlidingPager', {}),
				items      : ['-', {
					xtype    : 'mitos.codestypescombo',
					width    : 100,
					listeners: {
						scope : me,
						select: me.onCodeTypeSelect
					}
				}, '-', {
					xtype          : 'textfield',
					emptyText      : 'Search',
					enableKeyEvents: true,
					listeners      : {
						scope : me,
						keyup : me.onSearch,
						buffer: 500
					}
				}, '-', {
					xtype       : 'button',
					text        : 'Show Inactive Codes Only',
					iconCls     : 'save',
					enableToggle: true,
					listeners   : {
						scope : me,
						toggle: me.onActivePressed
					}
				}]
			})
		}); // END GRID

		me.servicesFormPanel = Ext.create('Ext.form.FormPanel', {
			title        : 'Add Service',
			region       : 'north',
			collapsible  : true,
			collapsed    : true,
			titleCollapse: true,
			animCollapse : false,
			collapseMode : 'header',
			height       : 150,
			margin       : '0 0 3 0',
			layout       : 'anchor',
			bodyBorder   : true,
			bodyPadding  : '10 10 0 10',
			listeners    : {
				collapse: function() {
					me.action('close');
				},
				expand  : function() {
					me.onNew(this, 'ServiceModel');
				}
			},
			defaults     : {
				labelWidth: 50,
				anchor    : '100%',
				layout    : {
					type          : 'hbox',
					defaultMargins: {top: 0, right: 25, bottom: 0, left: 0}
				}
			},
			items        : [
				{
					xtype: 'textfield', hidden: true, name: 'id'
				},
				{
					xtype    : 'fieldcontainer',
					defaults : { labelWidth: 70 },
					msgTarget: 'under',
					items    : [
						{ width: 200, fieldLabel: 'Type', xtype: 'mitos.codestypescombo', name: 'code_type' },
						{ width: 155, fieldLabel: 'Code', xtype: 'textfield', name: 'code', labelWidth: 40 },
						{ width: 200, fieldLabel: 'Modifier', xtype: 'textfield', name: 'mod' },
						{ width: 280, fieldLabel: 'Active?', xtype: 'mitos.checkbox', name: 'active' }
					]
				},
				{
					xtype    : 'fieldcontainer',
					defaults : { labelWidth: 70 },
					msgTarget: 'under',
					items    : [
						{ width: 380, fieldLabel: 'Description', xtype: 'textfield', name: 'code_text' },
						{ width: 200, fieldLabel: 'Category', xtype: 'mitos.titlescombo', name: 'title' },
						// placeholder
						{ width: 200, fieldLabel: 'Reportable?', xtype: 'mitos.checkbox', name: 'reportable' }
					]
				},
				{
					xtype    : 'fieldcontainer',
					defaults : { labelWidth: 70 },
					msgTarget: 'under',
					items    : [
						//<?php include_once ($_SESSION['site']['root']."/app/administration/services/fees_taxes.ejs.php") ?>
					]
				}
			],
			dockedItems  : [
				{
					xtype: 'toolbar',
					dock : 'bottom',
					items: [
						{
							text   : 'Save',
							iconCls: 'save',
							handler: function() {
								me.onSave(me.servicesFormPanel, me.store);
							}
						},
						'-',
						{
							text   : 'Reset / New',
							handler: function() {
								me.onNew(me.servicesFormPanel, 'ModelService');
							}
						},
						'-',
						{
							text   : 'Close / Cancel',
							handler: function() {
								var formPanel = this.up('form'),
									form = formPanel.getForm();
								formPanel.collapse();
								form.reset();
							}
						},
						'->',
						{
							text    : 'Not all fields are required for all codes or code types.',
							disabled: true

						}
					]
				}
			]
		});


		me.pageBody = [ me.servicesFormPanel, me.servicesGrid ];
		me.callParent(arguments);
	}, // end of initComponent

	onSearch: function(field) {

		var me = this,
			store = me.store;
		me.query = field.getValue();

		store.proxy.extraParams = {active: me.active, code_type: me.code_type, query: me.query};
		me.store.load();
	},

	onCodeTypeSelect: function(combo, record) {
		var me = this,
			store = me.store;
		me.code_type = record[0].data.ct_id;

		store.proxy.extraParams = {active: me.active, code_type: me.code_type, query: me.query};
		me.store.load();
	},

	onActivePressed: function(btn, pressed) {
		var me = this,
			store = me.store;
		me.active = pressed ? 0 : 1;

		store.proxy.extraParams = {active: me.active, code_type: me.code_type, query: me.query};
		me.store.load();
	},

	onNew: function(form, model) {
		form.getForm().reset();
		var newModel = Ext.ModelManager.create({}, model);
		form.getForm().loadRecord(newModel);
	},

	onSave: function(panel, store) {
		var form = panel.getForm(),
			record = form.getRecord(),
			values = form.getValues(),
			storeIndex = store.indexOf(record);
		if(storeIndex == -1) {
			store.add(values);
		} else {
			record.set(values);
		}
		store.sync();
		store.load();
		store.on('load', function() {
			panel.collapse();
		});
	},

	onDelete: function(form, store) {
		Ext.Msg.show({
			title  : 'Please confirm...',
			icon   : Ext.MessageBox.QUESTION,
			msg    : 'Are you sure to delete this record?',
			buttons: Ext.Msg.YESNO,
			scope  : this,
			fn     : function(btn) {
				if(btn == 'yes') {
					var currentRec = form.getRecord();
					store.remove(currentRec);
					store.destroy();
					this.servicesFormPanel.collapse();
				}
			}
		});
	},

	onItemclick: function(store, record) {
		var form = this.servicesFormPanel;
		form.expand();
		form.setTitle('Edit Service');
		form.getForm().loadRecord(record);
	},

	action  : function(action) {
		var formPanel = this.servicesFormPanel;

		if(action == 'close') {
			formPanel.setTitle('Add Service');
		}
	},
	/**
	 * This function is called from MitosAPP.js when
	 * this panel is selected in the navigation panel.
	 * place inside this function all the functions you want
	 * to call every this panel becomes active
	 */
	onActive: function(callback) {
        this.servicesGrid.query('combobox')[0].setValue("2");
        this.store.proxy.extraParams = {active: this.active, code_type: this.code_type, query: this.query};
		this.store.load();
		callback(true);
	}
}); //ens servicesPage class