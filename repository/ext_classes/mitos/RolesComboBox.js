Ext.define('Ext.mitos.RolesComboBox',{
	extend      : 'Ext.form.ComboBox',
    alias       : 'mitos.rolescombobox',
    initComponent: function(){	
    	var me = this;

    	// *************************************************************************************
		// Structure, data for Types
		// AJAX -> component_data.ejs.php
		// *************************************************************************************
		if (!Ext.ModelManager.isRegistered('Roles')){
		Ext.define("Roles", {extend: "Ext.data.Model", fields: [
			{name: 'id', type: 'int'},
		    {name: 'role_name', type: 'string'}
		],
			idProperty: 'id'
		});
		}
		me.storeTypes = new Ext.data.Store({
			model		: 'Roles',
			proxy		: {
				type	: 'ajax',
				url		: 'repository/ext_classes/mitos/data/components_data.ejs.php?task=roles',
				reader	: {
					type			: 'json',
					idProperty		: 'id',
					totalProperty	: 'totals',
					root			: 'row'
				}
			},
			autoLoad: true
		}); // end storeTypes
			

    	Ext.apply(this, {
    		name: 'role_name', 
    		editable: false, 
    		displayField: 'role_name',
    		valueField: 'id',  
    		queryMode: 'local',
    		emptyText:'Select', 
    		store: me.storeTypes
		});
		me.callParent();
	} // end initComponent
});