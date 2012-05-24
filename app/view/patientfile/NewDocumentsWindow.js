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
Ext.define('App.view.patientfile.NewDocumentsWindow', {
    extend       : 'Ext.window.Window',
    title        : 'Document Window',
    layout       : 'fit',
    closeAction  : 'hide',
    height       : 800,
    width        : 1200,
    bodyStyle    : 'background-color:#fff',
    modal        : true,
    defaults     : {
        margin: 5
    },
    mixins: ['App.classes.RenderPanel'],

    initComponent: function() {
        var me = this;

        me.items = [
            me.tabPanel = Ext.create('Ext.tab.Panel',{

	            items:[
		            {
			            title:'New Lab Order'
		            },
		            {
			            title:'New X-Ray Order'
		            },
		            {
			            title:'New Prescription'
		            },
		            {
			            title:'New Doctors Note'
		            }
	            ]

            })
        ];
        me.listeners = {
            scope: me,
            show: me.onDocumentsWinShow
        };
        me.callParent(arguments);
    },

	cardSwitch:function(action){

		var layout = this.tabPanel.getLayout();

		if(action == 'lab') {
            layout.setActiveItem(0);
        } else if(action == 'xRay') {
            layout.setActiveItem(1);
        } else if(action == 'prescription') {
            layout.setActiveItem(2);
        } else if(action == 'notes') {
            layout.setActiveItem(3);
		}
	},

	onDocumentsWinShow: function() {

    }
});