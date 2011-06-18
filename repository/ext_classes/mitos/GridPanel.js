
Ext.define('Ext.mitos.GridPanel',{
	extend      : 'Ext.grid.GridPanel',
    alias       : 'mitos.gridpanel',
    border      : true,    
	frame       : true,

    initComponent: function(){	
    	var me = this;

    	Ext.apply(this, {
		  	layout	    : 'fit',
		  	loadMask    : true,
		  	columnLines	: true,
		  	frameHeader	: false,
		  	viewConfig  : { stripeRows: true }		});
		me.callParent(arguments);
		
	} // end initComponent
});