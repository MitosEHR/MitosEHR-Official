
Ext.define('Ext.mitos.GridPanel',{
	extend      : 'Ext.grid.GridPanel',
    alias       : 'mitos.gridpanel',
    border      : true,    
	frame       : true,
    viewConfig  : { stripeRows: true },
    loadMask    : true,
    initComponent: function(){	
    	var me = this;

    	Ext.apply(this, {
		  	layout	    : 'fit',
		  	columnLines	: true,
		  	frameHeader	: false
		});
		me.callParent(arguments);
		
	} // end initComponent
});