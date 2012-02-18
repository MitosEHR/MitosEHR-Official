Ext.define('Ext.mitos.classes.GridPanel', {
	extend    : 'Ext.grid.GridPanel',
	alias     : 'widget.mitos.grid',
	autoHeight: true,
	border    : true,
	frame     : false,
	loadMask  : true,
	viewConfig: {forceFit: true, stripeRows: true}
});