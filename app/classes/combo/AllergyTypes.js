Ext.define('App.classes.combo.AllergyTypes', {
	extend       : 'Ext.form.ComboBox',
	alias        : 'widget.mitos.allergytypescombo',
	initComponent: function() {
		var me = this;

		Ext.define('AllergyTypesModel', {
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
					list_id: 73
				}
			}
		});

		me.store = Ext.create('Ext.data.Store', {
			model   : 'AllergyTypesModel',
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