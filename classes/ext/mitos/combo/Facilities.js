Ext.define('Ext.mitos.combo.Facilities',{
	extend      : 'Ext.form.ComboBox',
    alias       : 'widget.mitos.facilitiescombo',
    initComponent: function(){	
    	var me = this;
    	me.store = Ext.create('Ext.mitos.restStoreModel',{
            fields: [
                {name: 'id', type: 'int'},
			    {name: 'name', type: 'string'}
            ],
            model		: 'FacilitiesCombo',
            idProperty	: 'id',
            url	    	: 'classes/ext/mitos/data/components_data.ejs.php',
            extraParams	: { task:"facilities"},
            autoLoad    : true
        });

    	Ext.apply(this, {
            editable    : false,
            queryMode   : 'local',
            valueField  : 'id',
            displayField: 'name',
            emptyText   : 'Select',
            store       : me.store
		});
		me.callParent(arguments);
	} 
});