Ext.define('Ext.mitos.CalStatusComboBox',{
	extend          : 'Ext.form.ComboBox',
    alias           : 'widget.mitos.calstatuscombobox',
    name            : 'status',
    editable        : false,
    displayField    : 'title',
    valueField      : 'option_id',
    queryMode       : 'local',
    emptyText       : 'Select',
    
    initComponent: function(){	
    	var me = this;

            if (!Ext.ModelManager.isRegistered('Titles')){
                Ext.define("Titles", {extend: "Ext.data.Model",
                    fields: [
                        {name: 'option_id', type: 'string'},
                        {name: 'title', type: 'string'}
                    ],
                    idProperty: 'option_id'
                });
            }
			me.store = new Ext.data.Store({
				model		: 'Titles',
				proxy		: {
					type	: 'ajax',
					url			: 'lib/layoutEngine/listOptions.json.php',
                    extraParams	: {"filter": "apptstat"},
					reader	: {
                        type			: 'json',
                        idProperty		: 'option_id',
                        totalProperty	: 'totals',
                        root			: 'row'
					}
				},
				autoLoad: true
			}); // end storeFacilities

    	Ext.apply(this, {
    		store: me.store
		});
		me.callParent();
	} // end initComponent
}); 