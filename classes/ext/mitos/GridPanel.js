Ext.define('Ext.mitos.GridPanel',{
	extend      : 'Ext.grid.GridPanel',
    alias       : 'widget.mitos.grid',
    autoHeight 	: true,
    border     	: true,
    frame		: true,
    loadMask    : true,
    viewConfig 	: {forceFit: true, stripeRows : true}
});