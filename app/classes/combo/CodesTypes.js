Ext.define('Ext.mitos.classes.combo.CodesTypes', {
	extend       : 'Ext.form.ComboBox',
	alias        : 'widget.mitos.codestypescombo',
	initComponent: function() {
		var me = this;

		Ext.define('CodesTypesModel', {
			extend: 'Ext.data.Model',
			fields: [
				{name: 'ct_id', type: 'string'},
				{name: 'ct_key', type: 'string'}
			],
			proxy : {
				type: 'direct',
				api : {
					read: CombosData.getCodeTypes
				}
			}
		});

		me.store = Ext.create('Ext.data.Store', {
			model   : 'CodesTypesModel',
			autoLoad: true
		});

		Ext.apply(this, {
			editable    : false,
			queryMode   : 'local',
			valueField  : 'ct_id',
			displayField: 'ct_key',
			emptyText   : 'Select',
			store       : me.store
		}, null);
		me.callParent(arguments);
	}
});