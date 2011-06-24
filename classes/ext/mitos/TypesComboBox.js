Ext.define('Ext.mitos.TypesComboBox',{
	extend      : 'Ext.form.ComboBox',
    alias       : 'mitos.typescombobox',
    initComponent: function(){	
    	var me = this;
    	
    	// *************************************************************************************
		// Structure, data for Types
		// AJAX -> component_data.ejs.php
		// *************************************************************************************
		if (!Ext.ModelManager.isRegistered('Types')){
			Ext.define("Types", {extend: "Ext.data.Model", fields: [
				{name: 'option_id', type: 'string'},
			    {name: 'title', type: 'string'}
			],
				idProperty: 'option_id'
			});
			}
			me.storeTypes = new Ext.data.Store({
				model		: 'Types',
				proxy		: {
					type		: 'ajax',
					url			: 'lib/layoutEngine/listOptions.json.php',
					extraParams	: {"filter": "types"},
					reader	: {
						type			: 'json',
						idProperty		: 'option_id',
						totalProperty	: 'totals',
						root			: 'row'
					}
				},
				autoLoad: true
			}); // End storeTypes
	

    	Ext.apply(this, {
    		name: 'abook_type', 
			editable: false, 
    		displayField: 'title',
    		valueField: 'option_id',
    		queryMode: 'local',
    		store: me.storeTypes
		});
		me.callParent(arguments);
	} 
});