Ext.define('Ext.mitos.combo.Lists',{
	extend      : 'Ext.form.ComboBox',
    alias       : 'widget.mitos.listscombo',
    width		: 250,
    iconCls		: 'icoListOptions',
    initComponent: function(){	
    	var me = this;
    	me.store = Ext.create('Ext.mitos.restStoreModel',{
            fields: [
                {name: 'option_id', type: 'string'},
                {name: 'title',     type: 'string'}
            ],
            model		: 'ListModelCombo',
            idProperty	: 'option_id',
            url	    	: 'app/administration/lists/component_data.ejs.php',
            extraParams	: { task:"list"},
            autoLoad    : true
        });

    	Ext.apply(this, {
            editable    : false,
            queryMode   : 'local',
            valueField  : 'option_id',
            displayField: 'title',
            emptyText   : 'Select',
            store       : me.store
		});
		me.callParent(arguments);
	} 
});