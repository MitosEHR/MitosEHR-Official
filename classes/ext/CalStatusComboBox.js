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

        Ext.define('CalendarStatusModel', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'option_id', type: 'string'},
                {name: 'title', type: 'string'}
            ],
            proxy: {
                type: 'direct',
                api: {
                    read: CombosData.getCalendarStatus
                }
            }
        });

        me.store = Ext.create('Ext.data.Store', {
            model: 'CalendarStatusModel',
            autoLoad: true
        });

    	Ext.apply(this, {
    		store: me.store
		},null);
		me.callParent();
	} // end initComponent
}); 