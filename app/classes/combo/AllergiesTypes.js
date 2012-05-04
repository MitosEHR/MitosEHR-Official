Ext.define('App.classes.combo.AllergiesTypes', {
	extend       : 'Ext.form.ComboBox',
	alias        : 'widget.mitos.allergiestypescombo',
	initComponent: function() {
		var me = this;

		Ext.define('AllergiesTypesModel', {
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
					list_id: 85
				}
			}
		});

		me.store = Ext.create('Ext.data.Store', {
			model   : 'AllergiesTypesModel',
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