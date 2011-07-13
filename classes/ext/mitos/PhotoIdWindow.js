//******************************************************************************
// Photo ID Window
//******************************************************************************
Ext.define('Ext.mitos.PhotoIdWindow', {
    extend      : 'Ext.window.Window',
    alias       : 'widget.photoidwindow',
    height      : 292,
    width       : 320,
    layout      : 'fit',
    closeAction : 'hide',
    renderTo	: document.body,
    initComponent: function() {
        var me = this;
		Ext.apply(this, {
			items: {
                xtype: 'flash',
                url: 'repo/camcanvas.swf'
            }
	    });
        me.callParent(arguments);
    }
});