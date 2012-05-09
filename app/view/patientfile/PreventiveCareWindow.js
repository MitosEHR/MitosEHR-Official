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
Ext.define('App.view.patientfile.PreventiveCareWindow', {
	extend       : 'Ext.window.Window',
	title        : 'Preventive Care Window',
	closeAction  : 'hide',
	height       : 350,
	width        : 700,
	bodyStyle    : 'background-color:#fff',
	modal        : true,
    layout:'fit',
	defaults     : {
		margin: 5
	},
	initComponent: function() {
		var me = this;

		me.patientPreventiveCare = Ext.create('App.store.patientfile.PreventiveCare', {
			groupField: 'type',
			sorters   : ['type'],
			autoSync  : true
		});

		me.grid  = Ext.create('App.classes.GridPanel', {
			title      : 'Suggestions',
            store      : me.patientPreventiveCare,
			features: Ext.create('Ext.grid.feature.Grouping', {
					groupHeaderTpl   : 'Type: {name} ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})',
					hideGroupedHeader: true,
				    startCollapsed: true
			}),
            columns    : [
	            {
		            text     : 'type',
		            dataIndex: 'type',
		            flex:1
	            },
                {
                    text     : 'Description',
                    dataIndex: 'description',
	                flex:1
                },
                {
	                text     : 'Reason',
	                dataIndex: 'reason'

                },
                {

	                text     : 'Dismiss',
	                dataIndex: 'dismiss'
                }


            ],
			plugins: Ext.create('App.classes.grid.RowFormEditing', {
				autoCancel  : true,
				errorSummary: false,
				clicksToEdit: 1,
				formItems   : [

					{

						title : 'general',
						xtype : 'container',
						layout: 'vbox',
						items : [
							{
								/**
								 * Line one
								 */
								xtype   : 'fieldcontainer',
								layout  : 'hbox',
								items   : [

									{
										xtype       : 'textfield',
										fieldLabel  : 'Type',
										readOnly    : true,
										name        : 'type'

									},{
										xtype       : 'textfield',
										fieldLabel  : 'Description',
										readOnly    : true,
										name        : 'description'

									},{
										xtype       : 'textfield',
										fieldLabel  : 'Reason',
										name        : 'reason'

									},{
										xtype       : 'checkboxfield',
										fieldLabel  : 'Dismiss',
										name        : 'dismiss'

									}

								]
							}
						]
					}
				]
			})


		});

		me.items = [ me.grid ];

		me.listeners = {
			scope: me,
			show: me.onPreventiveCareWindowShow
		};


		this.callParent(arguments);

	},

	onPreventiveCareWindowShow: function() {
	    this.patientPreventiveCare.load({params: {pid: app.currPatient.pid}});

    }

});