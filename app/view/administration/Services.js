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
		me.dataQuery = '';
		me.code_type = 'CPT4';

		me.store = Ext.create('App.store.administration.Services');

		me.activeProblemsStore = Ext.create('App.store.administration.ActiveProblems');
		me.medicationsStore = Ext.create('App.store.administration.Medications');

		function code_type(val) {
			if(val == '1') {
				return 'CPT4';
			} else if(val == '2') {
				return 'ICD9';
			} else if(val == '3') {
				return 'HCPCS';
			}else if(val == '100') {
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
						 * CPT Container
 						 */
						xtype   : 'container',
						layout: 'column',
						action:'CPT4',
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
						action:'ICD9',
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
						action:'HCPCS',
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
			code_type = e.record.data.code_type;
			say(code_type);
	    var nextForm = editor.query('[action="'+code_type+'"]')[0];


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
				   field.disable();
            });
		    Ext.each(nextForm.query('[action="field"]'), function(field){
                field.enable();
            });

		    this.currForm.hide();
		    nextForm.show();
		    this.currForm = nextForm;

	    }

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



	/**
	 * This function is called from MitosAPP.js when
	 * this panel is selected in the navigation panel.
	 * place inside this function all the functions you want
	 * to call every this panel becomes active
	 */
	onActive: function(callback) {
		this.servicesGrid.query('combobox')[0].setValue("CPT4");
		this.store.proxy.extraParams = {active: this.active, code_type: this.code_type, query: this.query};
		this.store.load();
		callback(true);
	}
}); //ens servicesPage class