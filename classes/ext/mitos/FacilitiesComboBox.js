Ext.define('Ext.mitos.FacilitiesComboBox',{
	extend      : 'Ext.form.ComboBox',
    alias       : 'widget.mitos.facilitiescombobox',
    name        : 'facility_id',
    editable    : false,
    displayField: 'name',
    valueField  : 'id',
    queryMode   : 'local',
    emptyText   :'Select',
    
    initComponent: function(){	
    	var me = this;

		if (!Ext.ModelManager.isRegistered('Facilities')){
			Ext.define("Facilities", {extend: "Ext.data.Model", fields: [
				{name: 'id', type: 'int'},
			    {name: 'name', type: 'string'}
			],
				idProperty: 'id'
			});
			}
			me.storeFacilities = new Ext.data.Store({
				model		: 'Facilities',
				proxy		: {
					type	: 'ajax',
					url		: 'classes/ext/mitos/data/components_data.ejs.php?task=facilities',
					reader	: {
						type			: 'json',
						idProperty		: 'id',
						totalProperty	: 'totals',
						root			: 'row'
					}
				},
				autoLoad: true
			}); // end storeFacilities

    	Ext.apply(this, {
    		store: me.storeFacilities
		});
		me.callParent();
	} // end initComponent
}); 