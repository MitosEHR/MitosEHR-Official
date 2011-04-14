Ext.define('FV.view.feed.Show', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.feedshow',

    requires: [
        'FV.view.article.Grid',
        'FV.view.article.Preview'
    ],

	closable: false,
	layout: 'fit',

	initComponent: function() {
		Ext.apply(this, {
			items: [{
				xtype: 'articlegrid'
			}],

			dockedItems: [{
				xtype: 'articlepreview',
				dock: 'bottom',
				height: 300,
				padding: '0 5 5 5'
			}]
		});

		this.callParent(arguments);
	}
});
