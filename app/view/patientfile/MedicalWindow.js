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
	extend     : 'Ext.window.Window',
	title      : 'Medical Window',
	layout     : 'card',
	closeAction: 'hide',
	height     : '700',
	width      : '1000',
	minHeight  : 400,
	minWidth   : 550,
	modal      : true,
	initComponent: function() {

		var me = this;


		me.ImmuListStore = Ext.create('App.store.patientfile.Immunization');
		me.patientImmuListStore =Ext.create('App.store.patientfile.PatientImmunization');
		me.patienAllergiesListStore = Ext.create('App.store.patientfile.Allergies');
		me.patientMedicalIssuesStore = Ext.create('App.store.patientfile.MedicalIssues');
		me.patientSurgeryStore = Ext.create('App.store.patientfile.Surgery');
		me.patientDentalStore = Ext.create('App.store.patientfile.Dental');


		me.items = [
			{
				xtype : 'panel',
				title : 'Immunization',
				layout: 'border',
				bodyPadding : 5,
				items : [
					{
						xtype        : 'panel',
						region       : 'north',
						layout       : 'border',
						itemId       : 'immuNorth',
						height       : 340,
						collapsed    : true,
						border       : true,
						hidden       : true,
						margin       : '0 0 3 0',
						items        :[
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
										height     : 70,
										name      : 'note'

									}
								],
								buttons      : [
									{
										minWidth: 80,
										text    : 'Save',
										itemId  : 'SaveImmunization',
										scope   : me,
										handler : me.onSave
									},
									{
										minWidth: 80,
										text    : 'Cancel',
										scope: me,
										handler : me.onCancelImmu

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
							}
						]
					},
					{
						xtype      : 'grid',
						region     : 'center',
						itemId     : 'patientImmuListGrid',
						store      : me.patientImmuListStore,
						split      : true,
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
				xtype       : 'panel',
				title       : 'Allergies',
				layout      : 'border',
				bodyPadding : 5,
				items : [
					{
						xtype        : 'mitos.form',
						title        : 'Allergies Form',
						region       : 'north',
						fieldDefaults: { msgTarget: 'side', labelWidth: 100 },
						defaultType  : 'textfield',
						defaults     : { width: 500, labelWidth: 300 },
						height       : 340,
						collapsed    : true,
						border       : true,
						hidden       : true,
						margin       : '0 0 3 0',
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
								name      : 'title'
							},
							{
								fieldLabel: 'Diagnosis Code',
								name      : 'diagnosis_code'

							},
							{
								fieldLabel: 'Begin Date',
								xtype     : 'datefield',
								format    : 'Y-m-d',
								name      : 'begin_date'

							},
							{
								fieldLabel: 'End Date',
								xtype     : 'datefield',
								format    : 'Y-m-d',
								name      : 'end_date'

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
								name      : 'referred_by'
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
								itemId  : 'SaveAllergies',
								scope   : me,
								handler : me.onSave
							},
							{
								minWidth: 80,
								text    : 'Cancel',
								scope   : me,
								handler : me.onCancel

							}
						]
					},
					{
						xtype      : 'grid',
						region     : 'center',
						itemId     : 'patientAllergyListGrid',
						store      : me.patienAllergiesListStore,
						split      : true,
						columns  : [
							{
								header   : 'Type',
								width    : 100,
								dataIndex: 'type'
							},
							{
								header   : 'Title',
								width    : 100,
								dataIndex: 'title'
							},
							{
								header   : 'Diagnosis Code',
								width    : 100,
								dataIndex: 'diagnosis_code'
							},
							{
								header   : 'Begin Date',
								width    : 100,
								dataIndex: 'begin_date'
							},
							{
								header   : 'End Date',
								flex     : 1,
								dataIndex: 'end_date'
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
								dataIndex: 'referred_by'
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
				bodyPadding : 5,
				items : [
					{
						xtype        : 'mitos.form',
						region       : 'north',
						fieldDefaults: { msgTarget: 'side', labelWidth: 100 },
						defaultType  : 'textfield',
						hidden       : true,
						height       : 320,
						defaults     : { width: 500, labelWidth: 300 },
						items        : [
							{
								fieldLabel     : 'Type',
								name           : 'type',
								allowBlank     : false,
								xtype          : 'mitos.medicalissuescombo',
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
								name      : 'title'
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
								name      : 'end_date'

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
								itemId  : 'SaveMedicalIssues',
								scope   : me,
								handler : me.onSave
							},
							{
								minWidth: 80,
								text    : 'Cancel',
								scope   : me,
								handler : me.onCancel

							}
						]
					},
					{
						xtype      : 'grid',
						region     : 'center',
						itemId     : 'patientMedicalListGrid',
						store      : me.patientMedicalIssuesStore,
						columns  : [
							{
								header   : 'Type',
								width    : 100,
								dataIndex: 'type'
							},{
								header   : 'Title',
								width    : 100,
								dataIndex: 'title'
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
								dataIndex: 'begindate',
								renderer : Ext.util.Format.dateRenderer('Y-m-d')
							},
							{
								header   : 'End Date',
								flex     : 1,
								dataIndex: 'end_date',
								renderer : Ext.util.Format.dateRenderer('Y-m-d')
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
			},{
				/**
				 * Surgery Card panel
				 */
				xtype : 'panel',
				title : 'Surgery',
				layout: 'border',
				bodyPadding : 5,
				items : [
					{
						xtype        : 'mitos.form',
						region       : 'north',
						fieldDefaults: { msgTarget: 'side', labelWidth: 100 },
						defaultType  : 'textfield',
						hidden       : true,
						height       : 320,
						defaults     : { width: 500, labelWidth: 300 },
						items        : [
							{
								fieldLabel     : 'Type',
								name           : 'type',
								allowBlank     : false,
								xtype          : 'mitos.surgerycombo',
								itemId         : 'surgery',
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
								itemId  : 'SaveSurgery',
								scope   : me,
								handler : me.onSave
							},
							{
								minWidth: 80,
								text    : 'Cancel',
								scope   : me,
								handler : me.onCancel

							}
						]
					},
					{
						xtype      : 'grid',
						region     : 'center',
						itemId     : 'patientSurgeryListGrid',
						store      : me.patientSurgeryListStore,
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
								dataIndex: 'end_date'
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
			},{
				/**
				 * Dental Card panel
				 */
				xtype : 'panel',
				title : 'Dental',
				layout: 'border',
				bodyPadding : 5,
				items : [
					{
						xtype        : 'mitos.form',
						region       : 'north',
						fieldDefaults: { msgTarget: 'side', labelWidth: 100 },
						defaultType  : 'textfield',
						hidden       : true,
						height       : 320,
						defaults     : { width: 500, labelWidth: 300 },
						items        : [
							{
								fieldLabel: 'Title',
								itemId    : 'title',
								name      : 'title'
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
								itemId  : 'SaveDental',
								scope   : me,
								handler : me.onSave
							},
							{
								minWidth: 80,
								text    : 'Cancel',
								scope   : me,
								handler : me.onCancel

							}
						]
					},
					{
						xtype      : 'grid',
						region     : 'center',
						itemId     : 'patientDentalListGrid',
						store      : me.patientDentalListStore,
						height     : 605,
						columns  : [
							{
								header   : 'Title',
								width    : 100,
								dataIndex: 'title'
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
						itemId      : 'immunization',
						action      : 'immunization',
						scope       : me,
						handler     : me.cardSwitch
					},
					'-',
					{
						text        : 'Allergies',
						enableToggle: true,
						toggleGroup : 'medicalWin',
						itemId      : 'allergies',
						action      : 'allergies',
						scope       : me,
						handler     : me.cardSwitch
					},
					'-',
					{
						text        : 'Medical Issues',
						enableToggle: true,
						toggleGroup : 'medicalWin',
						itemId      : 'issues',
						action      : 'issues',
						scope       : me,
						handler     : me.cardSwitch
					},
					'-',
					{
						text        : 'Surgery',
						enableToggle: true,
						toggleGroup : 'medicalWin',
						itemId      : 'surgery',
						action      : 'surgery',
						scope       : me,
						handler     : me.cardSwitch
					},
					'-',
					{
						text        : 'Dental',
						enableToggle: true,
						toggleGroup : 'medicalWin',
						itemId      : 'dental',
						action      : 'dental',
						scope       : me,
						handler     : me.cardSwitch
					}
				]
			}
		];

		me.listeners = {
			scope      : me,
			afterrender: me.onAfterRender,
			show       : me.onMedicalWinShow
		};


		me.callParent(arguments);
	},



	/*onSave: function(btn) {
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

	 onSaveAllergies: function(btn) {
	 var form = btn.up('form').getForm(),
	 record = form.getRecord(),
	 values = form.getValues(),
	 store = this.patienAllergiesListStore,
	 storeIndex = store.indexOf(record);
	 if(storeIndex == -1) {
	 store.add(values);
	 } else {
	 record.set(values);
	 }
	 store.sync();
	 },
	 onSaveMedicalIssues: function(btn) {
	 var form = btn.up('form').getForm(),
	 record = form.getRecord(),
	 values = form.getValues(),
	 store = this.patientMedicalIssuesStore,
	 storeIndex = store.indexOf(record);
	 if(storeIndex == -1) {
	 store.add(values);
	 } else {
	 record.set(values);
	 }
	 store.sync();
	 }, */

	onSave:function(btn) {

		var form = btn.up('form').getForm(),
			record = form.getRecord(),
			store,
			values = form.getValues();
		if(btn.itemId == 'SaveImmunization'){

			 store = this.patientImmuListStore;
		}
		else if(btn.itemId == 'SaveAllergies'){

			store = this.patienAllergiesListStore;
		}
		else if(btn.itemId == 'SaveMedicalIssues'){

			 store = this.patientMedicalIssuesStore;
		}
		else if(btn.itemId == 'SaveSurgery'){

			 store = this.patientSurgeryStore;
		}
		else if(btn.itemId == 'SaveDental'){

			 store = this.patientDentalStore;
		}

		var	storeIndex = store.indexOf(record);
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
			MedicalIssue = this.getComponent(2).getDockedItems()[0],
			Surgery = this.getComponent(3).getDockedItems()[0],
			Dental = this.getComponent(4).getDockedItems()[0];

		ImmuHeader.add({
			xtype  : 'button',
			text   : 'Add Immunization',
			iconCls: 'icoAddRecord',
			scope  : me,
			handler: me.onAddImmunization
		});
		AllergyHeader.add({
			xtype  : 'button',
			text   : 'Allergies',
			iconCls: 'icoAddRecord',
			scope  : me,
			handler: me.onAdd

		});
		MedicalIssue.add({
			xtype  : 'button',
			text   : 'Medical Issue',
			iconCls: 'icoAddRecord',
			scope  : me,
			handler: me.onAdd

		});
		Surgery.add({
			xtype  : 'button',
			text   : 'Surgery',
			iconCls: 'icoAddRecord',
			scope  : me,
			handler: me.onAdd

		});
		Dental.add({
			xtype  : 'button',
			text   : 'Dental',
			iconCls: 'icoAddRecord',
			scope  : me,
			handler: me.onAdd

		});

		me.doLayout();
	},
	/*newImmunization: function() {
		var me = this, form, model;



		form = this.getLayout().getActiveItem().getComponent('immuNorth');
		form = form.down('form');
		form.getForm().reset();
		model = Ext.ModelManager.getModel('App.model.patientfile.Immunization');
		model = Ext.ModelManager.create({
			lot_number: '1'
		}, model);
		form.getForm().loadRecord(model);
		me.form.show();




	},*/


	onAddImmunization: function() {
		var	northContainer = this.getLayout().getActiveItem().getComponent('immuNorth'),
			form = northContainer.down('form').getForm(),
			m = Ext.create('ListsGridModel', {

			});
		northContainer.show();
		northContainer.expand(true);
		form.loadRecord(m);
	},

	onAdd: function() {
		var formPanel = this.getLayout().getActiveItem().down('form'),
			form = formPanel.getForm(),
			m = Ext.create('ListsGridModel', {

			});
		formPanel.show();
		formPanel.expand(true);
		form.loadRecord(m);
	},
	onCancelImmu: function() {
		var	northContainer = this.getLayout().getActiveItem().getComponent('immuNorth'),
			form = northContainer.down('form').getForm();

		northContainer.collapse();
		northContainer.hide();
		form.reset();

	},
	onCancel: function() {
		var formPanel = this.getLayout().getActiveItem().down('form'),
			form = formPanel.getForm();

		formPanel.collapse();
		formPanel.hide();
		form.reset();
	},

	onGridResized: function() {
		this.doLayout();
	},


	onCodeFieldFocus: function() {
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

	cardSwitch: function(btn) {
		var layout = this.getLayout(), title;

		if(btn.action == 'immunization') {
			layout.setActiveItem(0);
			title = 'Immunizations';
		} else if(btn.action == 'allergies') {
			layout.setActiveItem(1);
			title = 'Allergies';
		} else if(btn.action == 'issues') {
			layout.setActiveItem(2);
			title = 'Medical Issues';
		}else if(btn.action == 'surgery') {
			layout.setActiveItem(3);
			title = 'Surgeries';
		}else if(btn.action == 'dental') {
			layout.setActiveItem(4);
			title = 'Dentals';
		}

		layout.getActiveItem().setTitle(app.currPatient.name+' - '+title);

	},

	onMedicalWinShow: function() {
		this.patientImmuListStore.load();
	}
});