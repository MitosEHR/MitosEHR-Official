
Ext.define('Ext.mitos.Window',{
	extend      : 'Ext.window.Window',
    alias       : 'mitos.window',

    initComponent: function(){	
    	var me = this;

    	Ext.apply(this, {
			autoHeight	: true,
			modal		: true,
			resizable	: false,
			autoScroll	: false,
			closeAction	: 'hide',
			renderTo	: document.body		});
		me.callParent(arguments);
		
	} // end initComponent
});