
Ext.define('Ext.mitos.Window',{
	extend      : 'Ext.window.Window',
    alias       : 'mitos.window',
	autoHeight	: true,
	modal		: true,
	resizable	: false,
	autoScroll	: true,
	renderTo	: document.body,
    initComponent: function(){	
    	var me = this;
    	Ext.apply(this, {

		});
		me.callParent(arguments);
	} // end initComponent
});