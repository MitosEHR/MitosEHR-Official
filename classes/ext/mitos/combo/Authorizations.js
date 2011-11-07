Ext.define('Ext.mitos.combo.Authorizations',{
	extend      : 'Ext.form.ComboBox',
    alias       : 'widget.mitos.authorizationscombo',
    initComponent: function(){	
    	var me = this;
    	me.store = Ext.create('Ext.data.Store', {
		    fields: ['id', 'name'],
		    data : [
		        {"id":"1", "name":"Print"},
		        {"id":"2", "name":"Email"},
		        {"id":"3", "name":"Email"}
		    ]
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