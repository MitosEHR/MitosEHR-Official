//******************************************************************************
// Users.ejs.php
// Description: Users Screen
// v0.0.4
// 
// Author: Ernesto J Rodriguez
// Modified: n/a
// 
// MitosEHR (Electronic Health Records) 2011
//******************************************************************************
Ext.require([
    'Ext.layout.container.*',
    'Ext.resizer.Splitter',
    'Ext.fx.target.Element',
    'Ext.fx.target.Component',
    'Ext.mitos.dashboard.Portlet',
    'Ext.mitos.dashboard.PortalColumn',
    'Ext.mitos.dashboard.PortalPanel',
    'Ext.mitos.dashboard.PortalDropZone',
    'Ext.mitos.dashboard.GridPortlet',
    'Ext.mitos.dashboard.ChartPortlet',
    'Ext.mitos.dashboard.OnotesPortlet'
]);
	Ext.define('Ext.mitos.panel.dashboard.Dashboard',{
        extend      : 'Ext.mitos.RenderPanel',
        id          : 'panelDashboard',
        pageTitle   : 'Dashboard',
		uses        : ['Ext.mitos.dashboard.PortalPanel', 'Ext.mitos.dashboard.PortalColumn', 'Ext.mitos.dashboard.GridPortlet', 'Ext.mitos.dashboard.ChartPortlet'],
	    getTools: function(){
	        return [{
	            xtype: 'tool',
	            type: 'gear',
	            handler: function(e, target, panelHeader, tool){
	                var portlet = panelHeader.ownerCt;
	                portlet.setLoading('Working...');
	                Ext.defer(function(){
	                    portlet.setLoading(false);
	                }, 2000);
	            }
	        }];
	    },
		initComponent: function(){
			var content = '<div class="portlet-content">HELLO WORLD!</div>';
			Ext.apply(this, {
	            pageBody: [{
                    id: 'app-portal',
                    xtype: 'portalpanel',
                    frame : true,
                    layout: 'fit',
                    border: true,
                    region: 'center',
                    items: [{
                        id: 'col-1',
                        items: [{
                            id: 'portlet-onotes',
                            title: 'Office Notes',
                            tools: this.getTools(),
                            items: Ext.create('Ext.mitos.dashboard.OnotesPortlet'),
                            listeners: {
                                'close': Ext.bind(this.onPortletClose, this)
                            }
                        },{
                            id: 'portlet-2',
                            title: 'Portlet 2',
                            tools: this.getTools(),
                            html: content,
                            listeners: {
                                'close': Ext.bind(this.onPortletClose, this)
                            }
                        }]
                    },{
                        id: 'col-2',
                        items: [{
                            id: 'portlet-1',
                            title: 'Grid Portlet',
                            tools: this.getTools(),
                            items: Ext.create('Ext.mitos.dashboard.GridPortlet'),
                            listeners: {
                                'close': Ext.bind(this.onPortletClose, this)
                            }
                        }]
                    },{
                        id: 'col-3',
                        items: [{
                            id: 'portlet-4',
                            title: 'Portlet 4',
                            tools: this.getTools(),
                            items: Ext.create('Ext.mitos.dashboard.ChartPortlet'),
                            listeners: {
                                'close': Ext.bind(this.onPortletClose, this)
                            }
                        }]
                    }]
	            }]
	        });
	        this.callParent(arguments);
	    },
		 onPortletClose: function(portlet) {
	        Ext.topAlert.msg('Message!',  portlet.title + ' was removed');
	    }
	}); //ens UserPage class
