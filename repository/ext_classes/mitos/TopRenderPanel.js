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
    pageLayout	: 'fit',
    initComponent: function(){
    	var me = this;
    	var config = {
    		renderTo: app.MainApp.body,
    		height	: app.MainApp.getHeight()
    	};
    	Ext.apply(me, Ext.apply(me.initialConfig, config));
        me.items = [{
        	id: 'topRenderPanel-header',
			xtype: 'box',
            region: 'north',
            height: 40,
            html: '<div class="dashboard_title">' + me.pageTitle + '</div>'
        },{
            id      	: 'topRenderPanel-body',
            xtype 		: 'panel',
            region  	: 'center',
            layout  	: me.pageLayout,
            border  	: false,
            defaults	: {frame:true, border:true, autoScroll:true},
            items    	: me.pageBody
        }],
        me.callParent();
    }
});
