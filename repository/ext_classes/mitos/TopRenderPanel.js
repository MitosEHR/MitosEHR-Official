//******************************************************************************
// Render panel
//******************************************************************************
Ext.define('Ext.mitos.TopRenderPanel', {
    extend      : 'Ext.panel.Panel',
    alias       : 'widget.toprenderpanel',
    layout      : 'border',
    frame       : false,
    border      : false,
    id          : 'topRenderPanel',
    pageTitle	: 'Page Title',
    pageLayout	: 'fit',
    pageBody	: '',
    initComponent: function() {
    	var me = this;
    	config = {renderTo:MainApp.body,height:MainApp.getHeight()};
    	Ext.apply(me, Ext.apply(me.initialConfig, config)); 	
        me.items = [{
            id: 'topRenderPanel-header',
            xtype: 'box',
            region: 'north',
            height: 40,
            html: me.pageTitle
        },{
            id      	: 'topRenderPanel-body',
            xtype 		: 'panel',
            region  	: 'center',
            layout  	: me.pageLayout,
            height  	: MainApp.getHeight() - 40,
            border  	: false,
            defaults	: {frame:true, border:true, autoScroll:true},
            items    	: me.pageBody
        }],
        me.callParent();
    },
});