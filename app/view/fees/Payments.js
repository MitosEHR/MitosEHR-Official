//******************************************************************************
// new.ejs.php
// New payments Forms
// v0.0.1
// 
// Author: Ernest Rodriguez
// Modified: 
// 
// MitosEHR (Electronic Health Records) 2011
//******************************************************************************
Ext.define('App.view.fees.Payments', {
	extend       : 'App.classes.RenderPanel',
	id           : 'panelPayments',
	pageTitle    : 'Payments',
	pageLayout   : 'border',
	uses         : ['App.classes.GridPanel'],
	initComponent: function() {
		var page = this;

		//******************************************************************
		// Payments Tab Panel
		//******************************************************************
		page.paymentTabPanel = Ext.create('Ext.tab.Panel', {
			region: 'center',
			items : [
				{
					title      : 'New Payment',
					dockedItems: [
						{
							xtype: 'toolbar',
							dock : 'top',
							items: [
								Ext.create('Ext.Button', {
									text   : 'Save',
									iconCls: 'save',
									handler: function() {

									}
								}), '-',
								Ext.create('Ext.Button', {
									text   : 'Cancel',
									iconCls: 'save',
									handler: function() {

									}
								}), '-',
								Ext.create('Ext.Button', {
									text   : 'Allocate',
									iconCls: 'save',
									handler: function() {

									}
								})
							]
						}
					]
				},
				{
					title      : 'Search Payments',
					dockedItems: [
						{
							xtype: 'toolbar',
							dock : 'top',
							items: [
								Ext.create('Ext.Button', {
									text   : 'Search',
									iconCls: 'save',
									handler: function() {
										page.paymentGrid.show();
									}
								}), '-',
								Ext.create('Ext.Button', {
									text   : 'Reset',
									iconCls: 'save',
									handler: function() {
										page.paymentGrid.hide();
									}
								})
							]
						}
					]
				},
				{
					title      : 'ERA posting',
					dockedItems: [
						{
							xtype: 'toolbar',
							dock : 'top',
							items: [
								Ext.create('Ext.Button', {
									text   : 'Proccess ERA File',
									iconCls: 'save',
									handler: function() {

									}
								})
							]
						}
					]
				}
			]
		});
		//******************************************************************
		// Payment history Grid
		//******************************************************************
		page.paymentGrid = Ext.create('App.classes.GridPanel', {
			title    : 'Payments Search Results',
			margin   : '3 0 0 0',
			height   : 300,
			region   : 'south',
			hidden   : true,
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
		page.pageBody = [ page.paymentTabPanel, page.paymentGrid];
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