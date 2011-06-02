Ext.define('Ext.mitos.CRUDStore',{
	extend      : 'Ext.data.Store',
    alias       : 'mitos.crudstore',

    constructor: function(config){
		var me = this;
	    config = {
			noCache		: true,
			autoSync	: false,
		    proxy		: {
		    	type	: 'ajax',
				api		: {
				read		: 'interface/administration/users/data_read.ejs.php',
				create		: 'interface/administration/users/data_create.ejs.php',
				update		: 'interface/administration/users/data_update.ejs.php',
				destroy 	: 'interface/administration/users/data_destroy.ejs.php',
				},
		        reader: {
		            type			: 'json',
		            idProperty		: me.idProperty,
		            totalProperty	: 'totals',
		            root			: 'row'
		    	},
		    	writer: {
					type	 		: 'json',
					writeAllFields	: true,
					allowSingle	 	: true,
					encode	 		: true,
					root	 		: 'row'
				}
		    },
		    autoLoad: true
	    }
		Ext.mitos.CRUDStore.superclass.constructor.call(me, config);
		
	} // end constructor
});