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

		me.activeProblemsStore = Ext.create('App.store.administration.ActiveProblems');

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
						action:'100',
						layout:'fit',
						plain:true,
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
												width:640
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
												name      : 'frequency'

											},
											{
												xtype: 'mitos.timecombo',
												name : 'frequency',
												width:100

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
												width     : 250,
												value     : 0,
												minValue  : 0,
												name      : 'times',
												tooltip   : 'Please enter a number greater than 1 or just check "Perform once"'

											},
											{
												fieldLabel: 'perform only once',
												xtype   : 'checkboxfield',
												labelWidth:105,
												//margin  : '5 0 0 10',
												name    : 'perform'

											}



										]

									}

								]
							},
							{
								title  : 'Active Problems',
								xtype  : 'grid',
								margin:5,
								store: me.activeProblemsStore,
								columns: [
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
								xtype  : 'grid',
								width  : 300,
								columns: [
									{
										header   : 'Name',
										flex     : 1,
										dataIndex: 'name'
									}
								]
							},
							{
								title  : 'Labs',
								xtype  : 'grid',
								width  : 300,
								columns: [
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
						action:'1',
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
						action:'2',
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

    beforeServiceEdit:function(context, e){


		var editor = context.editor,
//			cptForm = editor.getComponent('1'),
//			icdForm = editor.getComponent('2'),
//			hcpcsForm = editor.getComponent('3'),
//			cvxForm = editor.getComponent('100'),
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

		    //say(this.currForm.query('[action="field"]'));
		    Ext.each(this.currForm.query('[action="field"]'), function(field){
					say(field);
				   field.disable();
            });
			say('break');
		    //say(nextForm.query('[action="field"]'));
		    Ext.each(nextForm.query('[action="field"]'), function(field){
			    say(field);
                field.enable();
            });

		    this.currForm.hide();
		    nextForm.show();
		    //
		    this.currForm = nextForm;

	    }

//	    if(this.code_type != code_type){
//
//		    say(editor);
//            say(cptForm);
//            say(icdForm);
//            say(hcpcsForm);
//            say(cvxForm);
//
//
//		    if(code_type == 1){
//                say('CPT');
//            }else if(code_type == 2){
//                say('ICD9');
//            }else if(code_type == 100){
//                say('CVX');
//            }else{
//                say('HCPCS');
//            }
//	    }

    },

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

	addActiveProblem:function(field, model){

		say(field);
		this.activeProblemsStore.add(model[0]);

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