//******************************************************************************
// Photo ID Window
//******************************************************************************
Ext.define('Ext.mitos.classes.PhotoIdWindow', {
    extend      : 'Ext.window.Window',
    alias       : 'widget.photoidwindow',
    height      : 292,
    width       : 320,
    layout      : 'fit',
    renderTo	: document.body,
    initComponent: function() {
        var me = this;
		Ext.apply(this, {
			items: {
                xtype: 'flash',
                flashParams: {
                    allowScriptAccess   : 'always',
                    quality             : 'high'
                },
                url: 'lib/webcam_control/camcanvas.swf'
            }
	    });
        me.callParent(arguments);
    }
});