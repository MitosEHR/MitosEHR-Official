Ext.define('Ext.mitos.TransmitMedthodComboBox',{
	extend      : 'Ext.form.ComboBox',
    alias       : 'mitos.transmitmethodcombox',
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
    		name: 'transmit_method',
    		editable: false, 
    		displayField: 'name',
    		valueField: 'id',  
    		queryMode: 'local',
    		emptyText:'Select', 
    		store: me.store
		});
		me.callParent();
	} // end initComponent
});