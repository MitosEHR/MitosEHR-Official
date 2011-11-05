Ext.define('Ext.mitos.combo.CodesTypes',{
	extend      : 'Ext.form.ComboBox',
    alias       : 'widget.mitos.codestypescombo',
    initComponent: function(){	
    	var me = this;
    	me.store = Ext.create('Ext.mitos.restStoreModel',{
            fields: [
                {name: 'ct_id', type: 'string'},
			    {name: 'ct_key',     type: 'string'}
            ],
            model		: 'CodesTypes',
            idProperty	: 'option_id',
            url	    	: 'classes/ext/mitos/data/components_data.ejs.php',
            extraParams	: { task:"codetypes"},
            autoLoad    : true
        });

    	Ext.apply(this, {
            editable    : false,
            queryMode   : 'local',
            valueField  : 'ct_id',
            displayField: 'ct_key',
            emptyText   : 'Select',
            store       : me.store
		});
		me.callParent(arguments);
	} 
});