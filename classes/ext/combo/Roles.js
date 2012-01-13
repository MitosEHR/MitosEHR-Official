Ext.define('Ext.mitos.combo.Roles',{
	extend      : 'Ext.form.ComboBox',
    alias       : 'widget.mitos.rolescombo',
    initComponent: function(){	
    	var me = this;
    	me.store = Ext.create('Ext.mitos.restStoreModel',{
            fields: [
                {name: 'id', type: 'int'},
		        {name: 'role_name', type: 'string'}
            ],
            model		: 'RolesCombo',
            idProperty	: 'id',
            url	    	: 'classes/ext/data/components_data.ejs.php',
            extraParams	: { task:"roles"},
            autoLoad    : true
        });

    	Ext.apply(this, {
            editable    : false,
            queryMode   : 'local',
            valueField  : 'id',
            displayField: 'role_name',
            emptyText   : 'Select',
            store       : me.store
		},null);
		me.callParent(arguments);
	} 
});