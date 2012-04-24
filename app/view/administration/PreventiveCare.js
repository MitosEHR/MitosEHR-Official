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
Ext.define('App.view.administration.PreventiveCare', {
	extend       : 'App.classes.RenderPanel',
	id           : 'panelPreventiveCare',
	pageTitle    : 'Preventive Care',
	uses         : [
		'App.classes.GridPanel',
		'App.classes.combo.CodesTypes',
		'App.classes.combo.Titles'
	],
	initComponent: function() {
		var me = this;

		me.active = 1;
		me.dataQuery = '';
		me.code_type = 'Immunizations';

		me.store = Ext.create('App.store.administration.PreventiveCare');
        me.ImmuRelationStore = Ext.create('App.store.administration.Immunization_Relations');
		me.activeProblemsStore = Ext.create('App.store.administration.ActiveProblems');
		me.medicationsStore = Ext.create('App.store.administration.Medications');

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

		me.servicesGrid = Ext.create('App.classes.GridPanel', {
			region : 'center',
			store  : me.store,
			columns: [
				{ width: 100, header: 'Type', sortable: true, dataIndex: 'code_type', renderer: code_type },
				{ width: 80, header: 'Code', sortable: true, dataIndex: 'code' },
				{ flex: 1, header: 'Description', sortable: true, dataIndex: 'code_text' },
                { width: 60, header: 'Active', sortable: true, dataIndex: 'active', renderer: this.boolRenderer }
			],
			plugins: Ext.create('App.classes.grid.RowFormEditing', {
				autoCancel  : false,
				errorSummary: false,
				clicksToEdit: 1,
                listeners:{
                    scope:me,
	                beforeedit:me.beforeServiceEdit
                },
				formItems   : [
					{
						/**
						 * CVX Container
						 */
						xtype: 'tabpanel',
						hidden:true,
						action:'Immunizations',
						layout:'fit',
						plain:true,
						listeners: {
							scope:me,
							tabchange:me.onFormTapChange
						},
						items: [
							{
								title : 'general',
								xtype : 'container',
								padding:10,
								layout:'vbox',
								items : [
									{
										/**
										 * line One
										 */
										xtype   : 'fieldcontainer',
										layout:'hbox',
										defaults:{ margin:'0 10 5 0', disabled:true, action:'field' },
										items   : [
											{

												xtype     : 'textfield',
												fieldLabel: 'Immunization Name',
												name      : 'code_text',
												labelWidth:130,
												width:703
											},
											{
												xtype     : 'mitos.sexcombo',
												fieldLabel: 'Sex',
												name      : 'sex',
												width     : 100,
												labelWidth: 30

											}



										]
									},
									{
										/**
										 * Line two
										 */
										xtype   : 'fieldcontainer',
										layout:'hbox',
										defaults:{ margin:'0 10 5 0', disabled:true , action:'field'  },
										items   : [
											{
												xtype     : 'mitos.codestypescombo',
												fieldLabel: 'Coding System',
												labelWidth:130,
												value     : 'CVX',
												name      : 'code_type',
												readOnly:true

											},
											{
												xtype     : 'numberfield',
												fieldLabel: 'Frequency',
												margin:'0 0 5 0',
												value     : 0,
												minValue  : 0,
												width:150,
												name      : 'frequency_number'

											},
											{
												xtype: 'mitos.timecombo',
												name : 'frequency_time',
												width:100

											},
											{
                                                xtype     : 'numberfield',
                                                fieldLabel: 'Age Start',
                                                name: 'age_start',
                                                labelWidth: 75,
                                                width:140,
                                                value     : 0,
                                                minValue  : 0

											},
                                            {
                                                fieldLabel: 'Must be pregnant',
                                                xtype   : 'checkboxfield',
                                                labelWidth:105,
                                                name    : 'pregnant'


                                            }
										]

									},
									{
										/**
										 * Line three
										 */
										xtype   : 'fieldcontainer',
										layout:'hbox',
										defaults:{ margin:'0 10 5 0', disabled:true , action:'field'  },
										items   : [
											{
												xtype     : 'textfield',
												fieldLabel: 'Code',
												name      : 'code',
												labelWidth:130

											},
											{
												xtype     : 'numberfield',
												fieldLabel: 'Times to Perform',
												name      : 'times_to_perform',
												width     : 250,
												value     : 0,
												minValue  : 0,
												tooltip   : 'Please enter a number greater than 1 or just check "Perform once"'

											},
											{

                                                xtype     : 'numberfield',
                                                fieldLabel: 'Age End',
                                                name: 'age_end',
                                                labelWidth: 75,
                                                width:140,
                                                value     : 0,
                                                minValue  : 0


											},

                                            {
                                                fieldLabel: 'perform only once',
                                                xtype   : 'checkboxfield',
                                                labelWidth:105,
                                                //margin  : '5 0 0 10',
                                                name    : 'only_once'
                                            }



										]

									}

								]
							},
							{
								title  : 'Active Problems',
								action:'problems',
								xtype  : 'grid',
								margin:5,
								store: me.ImmuRelationStore,
								columns: [

									{
										xtype:'actioncolumn',
										width:20,
										items: [
											{
												icon: 'ui_icons/delete.png',
												tooltip: 'Remove',
												scope:me,
												handler: me.onRemoveRelation
											}
										]
									},
									{
										header   : 'Code',
										width     : 100,
										dataIndex: 'code'
									},
									{
										header   : 'Description',
										flex     : 1,
										dataIndex: 'code_text'
									}

								],
								bbar:{
									xtype:'liveicdxsearch',
									margin:5,
									fieldLabel:'Add Problem',
									hideLabel:false,
									disable:true,
									listeners:{
										scope:me,
										select:me.addActiveProblem
									}
								}
							},
							{
								title  : 'Medications',
								action :'medications',
								xtype  : 'grid',
								width  : 300,
								store: me.ImmuRelationStore,
								columns: [
									{
										xtype:'actioncolumn',
										width:20,
										items: [
											{
												icon: 'ui_icons/delete.png',
												tooltip: 'Remove',
												scope:me,
												handler: me.onRemoveRelation
											}
										]
									},
									{
										header   : 'Code',
										width     : 100,
										dataIndex: 'code'
									},
									{
										header   : 'Description',
										flex     : 1,
										dataIndex: 'code_text'
									}

								],
								bbar:{
									xtype:'medicationlivetsearch',
									margin:5,
									fieldLabel:'Add Problem',
									hideLabel:false,
									disable:true,
									listeners:{
										scope:me,
										select:me.addMedications
									}
								}
							},
							{
								title  : 'Labs',
								action:'labs',
								xtype  : 'grid',
								store: me.ImmuRelationStore,
								width  : 300,
								columns: [
									{
										xtype:'actioncolumn',
										width:20,
										items: [
											{
												icon: 'ui_icons/delete.png',
												tooltip: 'Remove',
												scope:me,
												handler: me.onRemoveRelation
											}
										]
									},
									{
										header   : 'Value Name',
										flex     : 1,
										dataIndex: 'value_name'
									},
									{
										header   : 'Less Than',
										flex     : 1,
										dataIndex: 'less_than'
									},
									{
										header   : 'Greater Than',
										flex     : 1,
										dataIndex: 'greater_than'
									},
									{
										header   : 'Equal To',
										flex     : 1,
										dataIndex: 'equal_to'
									}


								]
							}

						]

					},
					{
						/**
						 * CPT Container
 						 */
						xtype   : 'container',
						layout: 'column',
                        action:'Laboratories',
						hidden:true,
						items : [

							{
								xtype    : 'fieldcontainer',
								msgTarget: 'under',
								defaults:{ disabled:true, action:'field'  },
								items    : [
									{

										fieldLabel: 'Type',
										xtype: 'mitos.codestypescombo',
										name: 'code_type'
									},
									{

										fieldLabel: 'Code',
										xtype: 'textfield',
										name: 'code'
									},
									{

										fieldLabel: 'Modifier',
										xtype: 'textfield',
										name: 'mod'
									}

								]
							},
							{
								xtype    : 'fieldcontainer',
								margin:'0 0 0 10',
								defaults:{ disabled:true, action:'field' },
								items    : [
									{

										fieldLabel: 'Description',
										xtype: 'textfield',
										name: 'code_text'
									},
									{
										fieldLabel: 'Category',
										xtype: 'mitos.titlescombo',
										name: 'title'
									}
								]
							},
							{
								xtype    : 'fieldcontainer',
								margin:'0 0 0 20',
								defaults:{ disabled:true, action:'field' },
								items    : [

									{

										boxLabel: 'Reportable?',
										xtype: 'checkboxfield',
										name: 'reportable'

									}
									,
									{

										boxLabel: 'Active?',
										labelWidth: 75,
										xtype: 'checkboxfield',
										name: 'active'


									}
								]
							}


						]

					},
					{
						/**
						 * ICD9 Container
 						 */
						xtype   : 'container',
						layout: 'column',
                        action:'Diagnostic Tests',
						hidden:true,
						items : [

							{
								xtype    : 'fieldcontainer',
								msgTarget: 'under',
								defaults:{ disabled:true, action:'field' },
								items    : [
									{

										fieldLabel: 'Type',
										xtype: 'mitos.codestypescombo',
										name: 'code_type'
									},
									{

										fieldLabel: 'Code',
										xtype: 'textfield',
										name: 'code'
									}
								]
							},
							{
								xtype    : 'fieldcontainer',
								margin:'0 0 0 10',
								defaults:{ disabled:true, action:'field'  },
								items    : [
									{

										fieldLabel: 'Description',
										xtype: 'textfield',
										name: 'code_text'
									},
									{
										fieldLabel: 'Category',
										xtype: 'mitos.titlescombo',
										name: 'title'
									}
								]
							},
							{
								xtype    : 'fieldcontainer',
								margin:'0 0 0 20',
								defaults:{ disabled:true, action:'field'  },
								items    : [

									{

										boxLabel: 'Reportable?',
										xtype: 'checkboxfield',
										name: 'reportable'

									}
									,
									{

										boxLabel: 'Active?',
										labelWidth: 75,
										xtype: 'checkboxfield',
										name: 'active'


									}
								]
							}


						]

					},
					{
						/**
						 * HCPSC Container
 						 */
						xtype   : 'container',
						layout: 'column',
						action:'3',
						hidden:true,
						items : [

							{
								xtype    : 'fieldcontainer',
								msgTarget: 'under',
								defaults:{ disabled:true, action:'field'  },
								items    : [
									{

										fieldLabel: 'Type',
										xtype: 'mitos.codestypescombo',
										name: 'code_type'
									},
									{

										fieldLabel: 'Code',
										xtype: 'textfield',
										name: 'code'
									},
									{

										fieldLabel: 'Modifier',
										xtype: 'textfield',
										name: 'mod'
									}

								]
							},
							{
								xtype    : 'fieldcontainer',
								margin:'0 0 0 10',
								defaults:{ disabled:true, action:'field' },
								items    : [
									{

										fieldLabel: 'Description',
										xtype: 'textfield',
										name: 'code_text'
									},
									{
										fieldLabel: 'Category',
										xtype: 'mitos.titlescombo',
										name: 'title'
									}
								]
							},
							{
								xtype    : 'fieldcontainer',
								margin:'0 0 0 20',
								defaults:{ disabled:true, action:'field' },
								items    : [

									{

										boxLabel: 'Reportable?',
										xtype: 'checkboxfield',
										name: 'reportable'

									}
									,
									{

										boxLabel: 'Active?',
										labelWidth: 75,
										xtype: 'checkboxfield',
										name: 'active'


									}
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
					xtype    : 'mitos.preventivecaretypescombo',
					width    : 150,
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

    beforeServiceEdit:function(context, e){


		var editor = context.editor,
			code_type = e.record.data.code_type,
			nextForm = editor.query('[action="'+code_type+'"]')[0];

	    /**
	     * TODO: disable/enable the fields
	     */
	    if(!this.currForm){

		    Ext.each(nextForm.query(), function(field){
			    field.enable();
		    });

		    nextForm.show();
			this.currForm = nextForm;

	    }else if(this.currForm !== nextForm){

		    Ext.each(this.currForm.query('[action="field"]'), function(field){
					say(field);
				   field.disable();
            });
		    Ext.each(nextForm.query('[action="field"]'), function(field){
			    say(field);
                field.enable();
            });

		    this.currForm.hide();
		    nextForm.show();
		    this.currForm = nextForm;

	    }

    },

	onFormTapChange:function(panel, newCard, oldCard){
		this.ImmuRelationStore.proxy.extraParams = { code_type: newCard.action, selected_id:this.getSelectId() };
		this.ImmuRelationStore.load();
	},

	onSearch: function(field) {

		var me = this,
			store = me.store;
		me.dataQuery = field.getValue();

		store.proxy.extraParams = {active: me.active, code_type: me.code_type, query: me.dataQuery};
		me.store.load();
	},

	onCodeTypeSelect: function(combo, record) {
		var me = this,
			store = me.store;
		me.code_type = record[0].data.option_value;

		store.proxy.extraParams = {active: me.active, code_type: me.code_type, query: me.dataQuery};
		me.store.load();
	},

	onActivePressed: function(btn, pressed) {
		var me = this,
			store = me.store;
		me.active = pressed ? 0 : 1;

		store.proxy.extraParams = {active: me.active, code_type: me.code_type, query: me.dataQuery};
		me.store.load();
	},

	onNew: function(form, model) {
//		form.getForm().reset();
//		var newModel = Ext.ModelManager.create({}, model);
//		form.getForm().loadRecord(newModel);
	},

	addActiveProblem:function(field, model){

		this.ImmuRelationStore.add({
			code:model[0].data.code,
			code_text:model[0].data.code_text,
			code_type:'problems',
			foreign_id:model[0].data.id,
			immunization_id: this.getSelectId()
		});
		say(this.ImmuRelationStore);
		field.reset();
	},
	addMedications:function(field, model){
		this.ImmuRelationStore.add({
			code:model[0].data.PRODUCTNDC,
			code_text:model[0].data.PROPRIETARYNAME,
			code_type:'medications',
			foreign_id:model[0].data.id,
			immunization_id: this.getSelectId()
		});
		say(this.ImmuRelationStore);
		field.reset();

	},

    onRemoveRelation:function(grid, rowIndex, colIndex){
		var me = this,
            store = grid.getStore(),
			record = store.getAt(rowIndex);
        store.remove(record);
	},


	getSelectId:function(){
		var row = this.servicesGrid.getSelectionModel().getLastSelected();

		return row.data.id;
	},

	/**
	 * This function is called from MitosAPP.js when
	 * this panel is selected in the navigation panel.
	 * place inside this function all the functions you want
	 * to call every this panel becomes active
	 */
	onActive: function(callback) {
		this.servicesGrid.query('combobox')[0].setValue("Immunizations");
		this.store.proxy.extraParams = {active: this.active, code_type: this.code_type, query: this.dataQuery};
		this.store.load();
		callback(true);
	}
}); //ens servicesPage class