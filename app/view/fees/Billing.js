//******************************************************************************
// Billing.ejs.php
// Billing Forms
// v0.0.1
// Author: Ernest Rodriguez
// Modified: 
// MitosEHR (Electronic Health Records) 2011
//******************************************************************************
Ext.define('App.view.fees.Billing', {
	extend       : 'App.classes.RenderPanel',
	id           : 'panelBilling',
	pageTitle    : 'Billing',
	uses         : [ 'App.classes.GridPanel' ],
	initComponent: function() {
		var page = this;

		//******************************************************************
		// Grid...
		//******************************************************************
		page.billingGrid = Ext.create('App.classes.GridPanel', {
			title    : 'Billing History',
			columns  : [
				{ header: 'id', sortable: false, dataIndex: 'id', hidden: true},
				{ width: 150, sortable: true, dataIndex: 'date', renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s') },
				{ width: 150, sortable: true, dataIndex: 'user' },
				{ flex: 1, sortable: true, dataIndex: 'body' },
				{ flex: 1, sortable: true, dataIndex: 'body' },
				{ flex: 1, sortable: true, dataIndex: 'body' },
				{ flex: 1, sortable: true, dataIndex: 'body' }
			],
			listeners: {
				itemclick: function() {

				}
			}
		});
		page.pageBody = [  page.billingGrid ];
		page.callParent(arguments);
	}, // end of initComponent
	/**
	 * This function is called from MitosAPP.js when
	 * this panel is selected in the navigation panel.
	 * place inside this function all the functions you want
	 * to call every this panel becomes active
	 */
	onActive     : function(callback) {
		callback(true);
	}
}); //ens oNotesPage class