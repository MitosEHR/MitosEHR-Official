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
	height       : 500,
	width        : 500,
	bodyStyle    : 'background-color:#fff',
	modal        : true,
    layout:'fit',
	defaults     : {
		margin: 5
	},
	initComponent: function() {
		var me = this;

		me.patientPreventiveCare = Ext.create('App.store.patientfile.PreventiveCare',{
			autoSync : true
		});

		me.grid  = Ext.create('App.classes.GridPanel', {
			title      : 'Active Medications',
            hideHeaders: true,
            store      : me.patientPreventiveCare,
            columns    : [
                {

                    header   : 'id',
                    dataIndex: 'id',
                    flex     : 1
                },
                {
                    text     : 'description',
                    dataIndex: 'description'
                }

            ]


		});

		me.items = [ me.grid ];

		me.listeners = {
			scope: me,
			show: me.onPreventiveCareWindowShow
		};


		this.callParent(arguments);

	},

	onPreventiveCareWindowShow: function() {
        say(this.patientPreventiveCare);
	    this.patientPreventiveCare.load({params: {pid: app.currPatient.pid}});

    }

});