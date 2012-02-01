Ext.define('Ext.mitos.combo.Types',{
	extend      : 'Ext.form.ComboBox',
    alias       : 'mitos.typescombobox',
    initComponent: function(){	
    	var me = this;
    	
    	// *************************************************************************************
		// Structure, data for Types
		// AJAX -> component_data.ejs.php
		// *************************************************************************************


        Ext.define('TypesModel', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'option_id', type: 'string'},
      			    {name: 'title', type: 'string'}
            ],
            proxy: {
                type: 'direct',
                api: {
                    read: CombosData.getTypes
                }
            }
        });

        me.store = Ext.create('Ext.data.Store', {
            model: 'TypesModel',
            autoLoad: true
        });

    	Ext.apply(this, {
    		name: 'abook_type', 
			editable: false, 
    		displayField: 'title',
    		valueField: 'option_id',
    		queryMode: 'local',
    		store: me.storeTypes
		}, null);
		me.callParent(arguments);
	} 
});