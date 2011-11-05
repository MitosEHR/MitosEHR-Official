Ext.define('Ext.mitos.combo.PermValues',{
	extend      : 'Ext.form.ComboBox',
    alias       : 'widget.mitos.permvaluescombo',
    initComponent: function(){	
    	var me = this;
    	me.store = Ext.create('Ext.mitos.restStoreModel',{
            fields: [
                {name: 'value',	type: 'string'},
                {name: 'perm',	type: 'string'}
            ],
            model		: 'PermValuesCombo',
            idProperty	: 'value',
            url	    	: 'app/administration/roles/component_data.ejs.php',
            extraParams	: { task:"perms"},
            autoLoad    : true
        });

    	Ext.apply(this, {
            editable    : false,
            queryMode   : 'local',
            valueField	: 'value',
            displayField: 'perm',
            store       : me.store
		});
		me.callParent(arguments);
	} 
});