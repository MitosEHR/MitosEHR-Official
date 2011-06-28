Ext.define('Ext.mitos.CalCategoryComboBox',{
	extend          : 'Ext.form.ComboBox',
    alias           : 'widget.mitos.calcategoriescombobox',
    //name            : 'categories',
    editable        : false,
    displayField    : 'catname',
    valueField      : 'catid',
    //queryMode       : 'local',
    emptyText       : 'Select',
    
    initComponent: function(){	
    	var me = this;

            if (!Ext.ModelManager.isRegistered('Categories')){
                Ext.define("Categories", {extend: "Ext.data.Model",
                    fields: [
                        {name: 'catid', type: 'int'},
                        {name: 'catname', type: 'string'}
                    ],
                    idProperty: 'catid'
                });
            }
			me.store = new Ext.data.Store({
				model		: 'Categories',
				proxy		: {
					type	: 'ajax',
					url			: 'classes/ext/mitos/data/components_data.ejs.php',
                    extraParams	: {"task": "calcategories"},
					reader	: {
                        type			: 'json',
                        idProperty		: 'catid',
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