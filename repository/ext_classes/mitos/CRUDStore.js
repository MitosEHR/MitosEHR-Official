//  *******************************************
//  Required properties 
//  *******************************************
Ext.define('Ext.mitos.CRUDStore',{
	extend      : 'Ext.data.Store',
//  idProperty	:  databade table id
//  read		:  url to data_read.eje.php
//  create		:  url to data_create.eje.php
//  update		:  url to data_update.eje.php
//  destroy 	:  url to data_destroy.eje.php
//  *******************************************
	constructor:function(config){
		
		if (!Ext.ModelManager.isRegistered( config.model )){
			Ext.define( config.model, {extend:"Ext.data.Model", groupField: config.groupField, fields: config.fields, idProperty: config.idProperty });
		}
		var config = {
			model		: config.model,
			noCache		: true,
			autoSync	: false,
			sortOnFilter: false,
			remoteSort	: true,
			groupField	: config.groupField,
		    proxy		: {
		    	type	: 'ajax',
				api		: {
					read	: config.read,
					create	: config.create,
					update	: config.update,
					destroy : config.destroy
				},
		        reader: {
		            type			: 'json',
		            idProperty		: config.idProperty,
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
		Ext.apply(this, Ext.apply(this.initialConfig, config));
        Ext.mitos.CRUDStore.superclass.constructor.call(this, config);
	}
});