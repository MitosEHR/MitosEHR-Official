Ext.define('Ext.mitos.combo.Titles',{
	extend      : 'Ext.form.ComboBox',
    alias       : 'widget.mitos.titlescombo',
    initComponent: function(){	
    	var me = this;
    	me.store = Ext.create('Ext.mitos.restStore',{
            fields: [
                {name: 'option_id', type: 'string'},
			    {name: 'title',     type: 'string'}
            ],
            model		: 'TitlesCombo',
            idProperty	: 'option_id',
            url	    	: 'lib/layoutEngine/listOptions.json.php',
            extraParams	: { filter:"titles" },
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