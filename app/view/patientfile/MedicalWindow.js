/**
 * Created by JetBrains PhpStorm.
 * User: Ernesto J. Rodriguez (Certun)
 * File:
 * Date: 2/15/12
 * Time: 4:30 PM
 *
 * @namespace Immunization.getImmunizationsList
 * @namespace Immunization.getPatientImmunizations
 * @namespace Immunization.addPatientImmunization
 */
Ext.define('App.view.patientfile.MedicalWindow', {
	extend           : 'Ext.window.Window',
	title            : 'MedicalWindow',
	height           : '700',
	width            : '1000',
	layout           : 'card',
	bodyStyle        : 'padding: 5px;',
	collapseDirection: 'bottom',
	modal            : true,

	animCollapse: true,

	initComponent: function() {

		var me = this;

		Ext.define('immunizationsModel', {
			extend: 'Ext.data.Model',
			fields: [
				{name: 'code', type: 'int'},
				{name: 'code_text', type: 'string'}

			],
			proxy : {
				type: 'direct',
				api : {
					read: Immunization.getImmunizationsList
				}
			}
		});
		me.ImmuListStore = Ext.create('Ext.data.Store', {
			model     : 'immunizationsModel',
			remoteSort: true,
			autoLoad  : true
		});

		Ext.define('patientImmunizationsModel', {
			extend: 'Ext.data.Model',
			fields: [
				{name: 'immunization_id', type: 'int'},
				{name: 'administered_date', type: 'date', dateFormat: 'c'},
				{name: 'manufacturer', type: 'string'},
				{name: 'lot_number', type: 'string'},
				{name: 'administered_by', type: 'string'},
				{name: 'education_date', type: 'date', dateFormat: 'c'},
				{name: 'vis_date', type: 'date', dateFormat: 'c'},
				{name: 'note', type: 'string'}
			],
			proxy : {
				type: 'direct',
				api : {
					read  : Immunization.getPatientImmunizations,
					create: Immunization.addPatientImmunization
				}
			}
		});
		me.patientImmuListStore = Ext.create('Ext.data.Store', {
			model     : 'patientImmunizationsModel',
			remoteSort: true,
			autoLoad  : false
		});


		me.items = [
			{
				xtype : 'panel',
				title : 'Immunization',
				layout: 'border',
				height: 300,
				items : [
					{
						xtype        : 'mitos.form',
						region       : 'center',
						fieldDefaults: { msgTarget: 'side', labelWidth: 100 },
						defaultType  : 'textfield',
						defaults     : { width: 500, labelWidth: 300 },
						items        : [
							{
								fieldLabel     : 'Immunization (CVX Code)',
								name           : 'immunization_id',
								itemId         : 'immuName',
								enableKeyEvents: true,
								listeners      : {
									scope: me,
									focus: me.onCodeFieldFocus
								}
							},
							{
								fieldLabel: 'Date Administered',
								xtype     : 'datefield',
								format    : 'Y-m-d',
								name      : 'administered_date'
							},
							{
								fieldLabel: 'Immunization Manufacturer',
								name      : 'manufacturer'

							},
							{
								fieldLabel: 'Immunization Lot Number',
								name      : 'lot_number'

							},
							{
								fieldLabel: 'Name and Title of Immunization Administrator',
								name      : 'administered_by'

							},
							{
								fieldLabel: 'Date Immunization Information Statements Given',
								xtype     : 'datefield',
								format    : 'Y-m-d',
								name      : 'education_date'
							},
							{
								fieldLabel: 'Date of VIS Statement (?)',
								xtype     : 'datefield',
								format    : 'Y-m-d',
								name      : 'vis_date'
							},
							{
								fieldLabel: 'Notes',
								xtype     : 'textarea',
								name      : 'note'

							}
						],
						buttons      : [
							{
								minWidth: 80,
								text    : 'Save',
								scope   : me,
								handler : me.onSave
							},
							{
								minWidth: 80,
								text    : 'Cancel'

							}
						],
						dockedItems  : [
							{
								xtype       : 'toolbar',
								dock        : 'top',
								enableToggle: true,
								layout      : {
									pack: 'left'
								},
								items       : [
									{
										minWidth: 80,
										text    : 'Print Record (PDF)'
									},
									'-',
									{
										minWidth: 80,
										text    : 'Print Record (HTML)'
									}
								]
							}
						]
					},
					{
						xtype      : 'grid',
						region     : 'east',
						itemId     : 'immuListGrid',
						listeners  : {
							scope       : me,
							itemdblclick: me.onImmuGridClick
						},
						title      : 'Immunizations List',
						width      : 400,
						split      : true,
						collapsible: true,
						store      : me.ImmuListStore,
						columns    : [
							{
								header   : 'Code',
								width    : 40,
								dataIndex: 'code'
							},
							{
								header   : 'Description',
								flex     : 1,
								dataIndex: 'code_text'
							}
						]
					},
					{
						xtype      : 'grid',
						region     : 'south',
						itemId     : 'patientImmuListGrid',
						store      : me.patientImmuListStore,
						height     : 605,
						split      : true,
						collapsible: true,

						columns  : [
							{
								header   : 'Code Type',
								width    : 100,
								dataIndex: 'immunization_id'
							},
							{
								header   : 'Date',
								width    : 100,
								dataIndex: 'administered_date',
								renderer : Ext.util.Format.dateRenderer('Y-m-d')
							},
							{
								header   : 'Lot Number',
								width    : 100,
								dataIndex: 'lot_number'
							},
							{
								header   : 'Provider',
								width    : 100,
								dataIndex: 'administered_by'
							},
							{
								header   : 'Date Immunization',
								flex     : 1,
								dataIndex: 'education_date',
								renderer : Ext.util.Format.dateRenderer('Y-m-d')
							},
							{
								header   : 'Date VIS Statement',
								flex     : 1,
								dataIndex: 'vis_date',
								renderer : Ext.util.Format.dateRenderer('Y-m-d')
							},
							{
								header   : 'Notes',
								flex     : 1,
								dataIndex: 'note'
							}
						],
						listeners: {
							scope : me,
							resize: me.onGridResized
						}
					}
				]
			},
			{
				/**
				 * Allergies Card panel
				 */
				xtype : 'panel',
				title : 'Allergies',
				layout: 'border',
				height: 300,
				items : [
					{
						xtype        : 'mitos.form',
						region       : 'center',
						fieldDefaults: { msgTarget: 'side', labelWidth: 100 },
						defaultType  : 'textfield',
						defaults     : { width: 500, labelWidth: 300 },
						items        : [
							{
								fieldLabel     : 'Type',
								name           : 'type',
								allowBlank     : false,
								xtype          : 'mitos.allergytypescombo',
								itemId         : 'allergie',
								enableKeyEvents: true,
								listeners      : {
									scope   : me,
									'select': me.onOptionType
								}
							},
							{
								fieldLabel: 'Title',
								itemId    : 'title',
								name      : 'date'
							},
							{
								fieldLabel: 'Diagnosis Code',
								name      : 'diagnosiscode'

							},
							{
								fieldLabel: 'Begin Date',
								xtype     : 'datefield',
								name      : 'begindate'

							},
							{
								fieldLabel: 'End Date',
								xtype     : 'datefield',
								name      : 'begindate'

							},
							{
								fieldLabel: 'Ocurrence',
								xtype     : 'mitos.occurrencecombo',
								name      : 'ocurrence'

							},
							{
								fieldLabel: 'Reaction',
								name      : 'reaction'
							},
							{
								fieldLabel: 'Referred by',
								name      : 'referred'
							},
							{
								fieldLabel: 'Outcome',
								xtype     : 'mitos.outcomecombo',
								name      : 'outcome'

							},
							{
								fieldLabel: 'Destination',
								name      : 'destination'
							}
						],
						buttons      : [
							{
								minWidth: 80,
								text    : 'Save',
								scope   : me,
								handler : me.onSave
							},
							{
								minWidth: 80,
								text    : 'Cancel'

							}
						]
					},
					{
						xtype      : 'grid',
						region     : 'south',
						itemId     : 'patientAllergyListGrid',
						store      : me.patientAllergyListStore,
						height     : 605,
						split      : true,
						collapsible: true,


						columns  : [
							{
								header   : 'Type',
								width    : 100,
								dataIndex: 'type'
							},
							{
								header   : 'Date',
								width    : 100,
								dataIndex: 'date'
							},
							{
								header   : 'Diagnosis Code',
								width    : 100,
								dataIndex: 'diagnosiscode'
							},
							{
								header   : 'Begin Date',
								width    : 100,
								dataIndex: 'begindate'
							},
							{
								header   : 'End Date',
								flex     : 1,
								dataIndex: 'enddate'
							},
							{
								header   : 'Ocurrence',
								flex     : 1,
								dataIndex: 'ocurrence'
							},
							{
								header   : 'Reaction',
								flex     : 1,
								dataIndex: 'reaction'
							},
							{
								header   : 'Referred by',
								flex     : 1,
								dataIndex: 'referredby'
							},
							{
								header   : 'Outcome',
								flex     : 1,
								dataIndex: 'outcome'
							},
							{
								header   : 'Destination',
								flex     : 1,
								dataIndex: 'destination'
							}
						],
						listeners: {
							scope : me,
							resize: me.onGridResized
						}
					}
				]
			},
			{
				/**
				 * Medical Issues Card panel
				 */
				xtype : 'panel',
				title : 'Medical Issues',
				layout: 'border',
				height: 300,
				items : [
					{
						xtype        : 'mitos.form',
						region       : 'center',
						fieldDefaults: { msgTarget: 'side', labelWidth: 100 },
						defaultType  : 'textfield',
						defaults     : { width: 500, labelWidth: 300 },
						items        : [
							{
								fieldLabel     : 'Type',
								name           : 'type',
								allowBlank     : false,
								xtype          : 'mitos.medicationscombo',
								itemId         : 'medications',
								enableKeyEvents: true,
								listeners      : {
									scope   : me,
									'select': me.onOptionType
								}
							},
							{
								fieldLabel: 'Title',
								itemId    : 'title',
								name      : 'date'
							},
							{
								fieldLabel: 'Diagnosis Code',
								name      : 'diagnosiscode'

							},
							{
								fieldLabel: 'Begin Date',
								xtype     : 'datefield',
								name      : 'begindate'

							},
							{
								fieldLabel: 'End Date',
								xtype     : 'datefield',
								name      : 'begindate'

							},
							{
								fieldLabel: 'Ocurrence',
								xtype     : 'mitos.occurrencecombo',
								name      : 'ocurrence'

							},
							{
								fieldLabel: 'Referred by',
								name      : 'referred'
							},
							{
								fieldLabel: 'Outcome',
								xtype     : 'mitos.outcomecombo',
								name      : 'outcome'

							},
							{
								fieldLabel: 'Destination',
								name      : 'destination'
							}
						],
						buttons      : [
							{
								minWidth: 80,
								text    : 'Save',
								scope   : me,
								handler : me.onSave
							},
							{
								minWidth: 80,
								text    : 'Cancel'

							}
						]
					},
					{
						xtype      : 'grid',
						region     : 'south',
						itemId     : 'patientMedicalListGrid',
						store      : me.patientMedicalListStore,
						height     : 605,
						split      : true,
						collapsible: true,


						columns  : [
							{
								header   : 'Type',
								width    : 100,
								dataIndex: 'type'
							},
							{
								header   : 'Date',
								width    : 100,
								dataIndex: 'date'
							},
							{
								header   : 'Diagnosis Code',
								width    : 100,
								dataIndex: 'diagnosiscode'
							},
							{
								header   : 'Begin Date',
								width    : 100,
								dataIndex: 'begindate'
							},
							{
								header   : 'End Date',
								flex     : 1,
								dataIndex: 'enddate'
							},
							{
								header   : 'Ocurrence',
								flex     : 1,
								dataIndex: 'ocurrence'
							},
							{
								header   : 'Referred by',
								flex     : 1,
								dataIndex: 'referredby'
							},
							{
								header   : 'Outcome',
								flex     : 1,
								dataIndex: 'outcome'
							},
							{
								header   : 'Destination',
								flex     : 1,
								dataIndex: 'destination'
							}
						],
						listeners: {
							scope : me,
							resize: me.onGridResized
						}
					}
				]
			}
		];

		me.dockedItems = [
			{
				xtype: 'toolbar',
				items: [
					{

						text        : 'Immunization',
						enableToggle: true,
						toggleGroup : 'medicalWin',
						pressed     : true,
						action      : 'immunization',
						scope       : me,
						handler     : me.OnCardSwitch
					},
					'-',
					{
						text        : 'Allergies',
						enableToggle: true,
						toggleGroup : 'medicalWin',
						action      : 'allergies',
						scope       : me,
						handler     : me.OnCardSwitch
					},
					'-',
					{
						text        : 'Medical Issues',
						enableToggle: true,
						toggleGroup : 'medicalWin',
						action      : 'issues',
						scope       : me,
						handler     : me.OnCardSwitch
					}
				]
			}
		];

		me.listeners = {
			scope      : me,
			afterrender: me.onAfterRender,
			show       : me.onShow
		}


		me.callParent(arguments);
	},

	onSave: function(btn) {
		var form = btn.up('form').getForm(),
			record = form.getRecord(),
			values = form.getValues(),
			store = this.patientImmuListStore,
			storeIndex = store.indexOf(record);
		if(storeIndex == -1) {
			store.add(values);
		} else {
			record.set(values);
		}
		store.sync();
	},

	onAfterRender: function() {
		var me = this,
			ImmuHeader = this.getComponent(0).getDockedItems()[0],
			AllergyHeader = this.getComponent(1).getDockedItems()[0],
			MedicalIssue = this.getComponent(2).getDockedItems()[0];

		ImmuHeader.add({
			xtype  : 'button',
			text   : 'Add Immunization',
			iconCls: 'icoAddRecord',
			scope  : me,
			handler: me.onAddImmunization
		});
		AllergyHeader.add({
			xtype  : 'button',
			text   : 'Add Allergies',
			iconCls: 'icoAddRecord',
			scope  : me,
			handler: me.onAddAllergy

		});
		MedicalIssue.add({
			xtype  : 'button',
			text   : 'Add Medical Issue',
			iconCls: 'icoAddRecord',
			scope  : me,
			handler: me.onAddMedication

		});
	},


	onAddImmunization: function(btn) {
		var gridPanel = btn.up('panel').getComponent('patientImmuListGrid'),
			form = this.getLayout().getActiveItem().down('form').getForm(),
			m = Ext.create('ListsGridModel', {

			});
		gridPanel.setHeight(245);
		form.loadRecord(m);
	},
	onAddAllergy: function(btn) {
		var gridPanel = btn.up('panel').getComponent('patientAllergyListGrid'),
			form = this.getLayout().getActiveItem().down('form').getForm(),
			m = Ext.create('ListsGridModel', {

			});
		gridPanel.setHeight(245);
		form.loadRecord(m);
	},
	onAddMedication: function(btn) {
		var gridPanel = btn.up('panel').getComponent('patientMedicalListGrid'),
			form = this.getLayout().getActiveItem().down('form').getForm(),
			m = Ext.create('ListsGridModel', {

			});
		gridPanel.setHeight(245);
		form.loadRecord(m);
	},

	onGridResized: function() {
		this.doLayout();
	},


	onCodeFieldFocus: function(field) {
		var gridPanel = this.getComponent('immuListGrid');
		gridPanel.expand(true);
	},

	onOptionType: function(combo) {

		var value = combo.getValue(),
			titlefield = combo.up('form').getComponent('title');
		titlefield.setValue(value);


	},

	onImmuGridClick: function(view, record) {
		var gridPanel = this.getComponent('immuListGrid'),
			textField = this.down('form').getComponent('immuName'),
			value = record.data.code;
		textField.setValue(value);
		gridPanel.up('form').collapse(true);
	},

	OnCardSwitch: function(btn) {
		var layout = this.getLayout();

		if(btn.action == 'immunization') {
			layout.setActiveItem(0);
		} else if(btn.action == 'allergies') {
			layout.setActiveItem(1);
		} else if(btn.action == 'issues') {
			layout.setActiveItem(2);
		}
	},

	onShow: function() {
		this.patientImmuListStore.load();
	}
});