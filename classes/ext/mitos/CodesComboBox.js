Ext.define('Ext.mitos.CodesComboBox',{
	extend      : 'Ext.form.ComboBox',
    alias       : 'mitos.codescombobox',
    name        : 'code_type',
    editable    : false,
    displayField: 'ct_key',
    valueField  : 'ct_id',
    queryMode   : 'local',
    initComponent: function(){	
    	var me = this;

    	// *************************************************************************************
		// Structure, data for Types
		// AJAX -> component_data.ejs.php
		// *************************************************************************************
		if (!Ext.ModelManager.isRegistered('Codes')){
		Ext.define("Codes", {extend: "Ext.data.Model", fields: [
			{name: 'ct_id', type: 'int'},
		    {name: 'ct_key', type: 'string'}
		],
			idProperty: 'option_id'
		});
		}
		me.storeTypes = new Ext.data.Store({
			model		: 'Codes',
			proxy		: {
				type		: 'ajax',
				url			: 'classes/ext/mitos/data/components_data.ejs.php',
				extraParams	: {"task": "codetypes"},
				reader	: {
					type			: 'json',
					idProperty		: 'ct_id',
					totalProperty	: 'totals',
					root			: 'row'
				}
			},
			autoLoad: true
		}); // end storeTypes
			

    	Ext.apply(this, {
    		store: me.storeTypes
		});
		me.callParent(arguments);
	} // end initComponent
});