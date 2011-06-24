//******************************************************************************
// Render panel
//******************************************************************************
Ext.define('Ext.mitos.RenderPanel', {
    extend      : 'Ext.panel.Panel',
    alias       : 'widget.renderpanel',
    layout      : 'border',
    frame       : false,
    border      : false,
    id          : 'RenderPanel',
    pageLayout	: 'fit',
    initComponent: function(){
        //var TopRender = this;
        TopRender = this;
    	var me = this;
    	var config = {
    		renderTo: app.MainApp.body,
    		height	: app.MainApp.getHeight()
    	};
    	Ext.apply(me, Ext.apply(me.initialConfig, config));
        me.items = [{
        	id: 'RenderPanel-header',
			xtype: 'box',
            region: 'north',
            height: 40,
            html: '<div class="dashboard_title">' + me.pageTitle + '</div>'
        },{
            id      	: 'RenderPanel-body',
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
