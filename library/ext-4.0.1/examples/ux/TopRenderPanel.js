	//******************************************************************************
	// Render panel
	//******************************************************************************
	Ext.define('Ext.ux.TopRenderPanel', {
        extend      : 'Ext.panel.Panel',
        alias       : 'widget.toprenderpanel',
        renderTo 	: Ext.getCmp('MainApp').body,
        layout      : 'border',
        height      : Ext.getCmp('MainApp').getHeight(),
        frame       : false,
        border      : false,
        id          : 'topRenderPanel',
        pageTitle	: 'Page Title',
        pageLayout	: 'fit',
        pageBody	: '',
        initComponent: function() {
        	var me = this;
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
	        }]
	        this.callParent();
	    },

    });