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
								xtype : 'tabpanel',
								layout: 'fit',
								items : [
									{
										title   : 'general',
										xtype   : 'container',
										defaults: { margin: '0 0 10 10'},
										items   : [
											{
												xtype     : 'textfield',
												fieldLabel: 'Immunization Name',
												name      : 'immunization_name'

											},
											{
												xtype     : 'textfield',
												fieldLabel: 'Sex',
												name      : 'sex'

											},
											{
												boxLabel: 'Must be pregnant',
												xtype   : 'checkboxfield',
												margin  : '0 0 10 120',
												name    : 'pregnant'

											},
											{
												xtype     : 'textfield',
												fieldLabel: 'Coding System',
												name      : 'coding_system'

											},
											{
												xtype     : 'textfield',
												fieldLabel: 'Code',
												name      : 'code'

											},
											{
												xtype:'container',
												layout:'hbox',
												items:
													[
														{
															xtype     : 'numberfield',
															fieldLabel: 'Frequency',
															value     : 0,
															minValue  : 0,
															name      : 'frequency'

														},{
														xtype     : 'mitos.timecombo',
														name      : 'frequency',
														defaultValue:'Month'

													}
													]
											},
											{
												xtype     : 'numberfield',
												fieldLabel: 'Times to Perform',
												value     : 0,
												minValue  : 0,
												name      : 'times',
												tooltip   : 'Please enter a number greater than 1 or just check "Perform once"'

											},
											{
												boxLabel: 'perform only once',
												xtype   : 'checkboxfield',
												margin  : '0 0 10 125',
												name    : 'perform'

											}
										]
									},{
										title   : 'Active Problems',
										xtype  : 'grid',
										itemId : 'patientSurgeryListGrid',
										columns: [
											{
												header   : 'Type',
												width    : 100,
												dataIndex: 'type'
											},
											{
												header   : 'Diagnosis Code',
												width    : 100,
												dataIndex: 'diagnosis_code'
											}

										]
									},{
										title   : 'general',
										xtype   : 'container',
										defaults: { margin: '0 0 10 10'},
										items   : [
											{
												xtype     : 'textfield',
												fieldLabel: 'Immunization Name',
												name      : 'immunization_name'

											},
											{
												xtype     : 'textfield',
												fieldLabel: 'Sex',
												name      : 'sex'

											},
											{
												boxLabel: 'Must be pregnant',
												xtype   : 'checkboxfield',
												margin  : '0 0 10 120',
												name    : 'pregnant'

											},
											{
												xtype     : 'textfield',
												fieldLabel: 'Coding System',
												name      : 'coding_system'

											},
											{
												xtype     : 'textfield',
												fieldLabel: 'Code',
												name      : 'code'

											},
											{
											xtype:'container',
											layout:'hbox',
											items:
												[
													{
														xtype     : 'numberfield',
														fieldLabel: 'Frequency',
														value     : 0,
														minValue  : 0,
														name      : 'frequency'

													},{
														xtype     : 'mitos.timecombo',
														name      : 'frequency',
													  defaultValue:'Month'

													}
												]
											},
											{
												xtype     : 'numberfield',
												fieldLabel: 'Times to Perform',
												value     : 0,
												minValue  : 0,
												name      : 'times',
												tooltip   : 'Please enter a number greater than 1 or just check "Perform once"'

											},
											{
												boxLabel: 'perform only once',
												xtype   : 'checkboxfield',
												margin  : '0 0 10 125',
												name    : 'perform'

											}
										]
									}
								]
							}
						]

					},
					{ xtype   : 'container',
						hidden: true,
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
						hidden: true,
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


			tbar: Ext.create('Ext.PagingToolbar', {
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


		me.pageBody = [ me.servicesGrid ];
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
//		form.getForm().reset();
//		var newModel = Ext.ModelManager.create({}, model);
//		form.getForm().loadRecord(newModel);
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