Ext.define('Ext.mitos.combo.Titles',{
	extend      : 'Ext.form.ComboBox',
    alias       : 'widget.mitos.titlescombo',
    initComponent: function(){	
    	var me = this;

        Ext.define('TitlesModel', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'option_id', type: 'string' },
                {name: 'title',     type: 'string' }
            ],
            proxy: {
                type: 'direct',
                api: {
                    read: CombosData.getTitles
                }
            }
        });

        me.store = Ext.create('Ext.data.Store', {
            model: 'TitlesModel',
            autoLoad: true
        });

    	Ext.apply(this, {
            editable    : false,
            queryMode   : 'local',
            valueField  : 'option_id',
            displayField: 'title',
            emptyText   : 'Select',
            store       : me.store
		}, null);
		me.callParent(arguments);
	} 
});