
Ext.define('Ext.mitos.FormPanel',{
	extend      : 'Ext.form.Panel',
    alias       : 'widget.mitosformpanel',
    bodyStyle   : 'padding: 5px;',
	autoWidth   : true,
	border      : false,

    initComponent: function(){	
    	var me = this;

    	Ext.apply(this, {
			
		});
		me.callParent(arguments);
		
	} // end initComponent
});