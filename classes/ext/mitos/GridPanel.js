Ext.define('Ext.mitos.GridPanel',{
	extend      : 'Ext.grid.GridPanel',
    alias       : 'mitos.gridpanel',
    autoHeight 	: true,
    border     	: true,
    frame		: true,
    loadMask    : true,
    viewConfig 	: {forceFit: true, stripeRows : true}
});