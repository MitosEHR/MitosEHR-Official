Ext.define('Ext.mitos.CodeTypesComboBox',{
	extend      : 'Ext.form.ComboBox',
    alias       : 'mitos.codetypescombobox',
    initComponent: function(){	
    	var me = this;
    	
    	// *************************************************************************************
		// Structure, data for Types
		// AJAX -> component_data.ejs.php
		// *************************************************************************************
		if (!Ext.ModelManager.isRegistered('Types')){
			Ext.define("CodeTypes", {extend: "Ext.data.Model", fields: [
				{name: 'ct_id', type: 'int'},
			    {name: 'ct_key', type: 'string'}
			],
				idProperty: 'ct_id'
			});
			}
			me.storeCodeTypes = new Ext.data.Store({
				model		: 'CodeTypes',
				proxy		: {
					type	: 'ajax',
					url		: 'classes/ext/mitos/data/components_data.ejs.php?task=codetypes',
					reader	: {
						type			: 'json',
						idProperty		: 'ct_id',
						totalProperty	: 'totals',
						root			: 'row'
					}
				},
				autoLoad: true
			}); 
	

    	Ext.apply(this, {
    		name: 'code_type',
            emptyText:'Select',
			editable: false,
            width:100,
    		displayField: 'ct_key',
    		valueField: 'ct_id',
    		queryMode: 'local',
    		store: me.storeCodeTypes
		});
		me.callParent(arguments);
	} 
});