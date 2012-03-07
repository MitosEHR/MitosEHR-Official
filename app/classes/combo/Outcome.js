Ext.define('App.classes.combo.Outcome', {
	extend       : 'Ext.form.ComboBox',
	alias        : 'widget.mitos.outcomecombo',
	initComponent: function() {
		var me = this;

		Ext.define('OutcomeModel', {
			extend: 'Ext.data.Model',
			fields: [
				{name: 'option_name', type: 'string' },
				{name: 'option_value', type: 'string' }
			],
			proxy : {
				type       : 'direct',
				api        : {
					read: CombosData.getOptionsByListId
				},
				extraParams: {
					list_id: 75
				}
			}
		});

		me.store = Ext.create('Ext.data.Store', {
			model   : 'OutcomeModel',
			autoLoad: true
		});

		Ext.apply(this, {
			editable    : false,
			queryMode   : 'local',
			displayField: 'option_name',
			valueField  : 'option_value',
			emptyText   : 'Select',
			store       : me.store
		}, null);
		me.callParent(arguments);
	}
});