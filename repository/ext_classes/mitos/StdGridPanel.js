
Ext.define('Ext.mitos.StdGridPanel',{
	extend      : 'Ext.grid.GridPanel',
    alias       : 'mitos.stdgridpanel',
    fields		: [],
    idProperty 	: '',
    read		: '',
    create		: '',
    update		: '',
    destroy		: '',

    initComponent: function(){	
    	var me = this;
    	if (!Ext.ModelManager.isRegistered('gModel')){
			model = Ext.define("gModel", {extend:"Ext.data.Model", fields:me.fields, idProperty:me.idProperty });
		}
		me.store = Ext.data.Store({
		    model		: 'gModel',
			noCache		: true,
	    	autoSync	: false,
		    proxy		: {
		    	type	: 'ajax',
				api		: {
					read	: me.read,
					create	: me.create,
					update	: me.update,
					destroy : me.destroy
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
		});

    	Ext.apply(this, {
    		height		: me.height,
		  	store       : me.store,
		  	layout	    : 'fit',
		  	border      : true,    
		  	frame       : true,
		  	loadMask    : true,
		  	viewConfig  : { stripeRows: true },
		  			});
		me.callParent(arguments);
		
	} // end initComponent
}); // END GRID