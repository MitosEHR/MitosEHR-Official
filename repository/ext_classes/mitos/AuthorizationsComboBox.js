Ext.define('Ext.mitos.AuthorizationsComboBox',{
	extend      : 'Ext.form.ComboBox',
    alias       : 'mitos.authorizationscombobox',
    initComponent: function(){	
    	var me = this;
		
		
		me.storeSeeAuthorizations = Ext.create('Ext.data.Store', {
		    fields: ['abbr', 'name'],
		    data : [
		        {"id":"1", "name":"None"},
		        {"id":"2", "name":"Only Mine"},
		        {"id":"3", "name":"All"}
		    ]
		});

    	Ext.apply(this, {
    		name: 'see_auth', 
    		editable: false, 
    		displayField: 'name',
    		valueField: 'id',  
    		queryMode: 'local',
    		emptyText:'Select', 
    		store: me.storeSeeAuthorizations
		});
		me.callParent();
	} // end initComponent
});