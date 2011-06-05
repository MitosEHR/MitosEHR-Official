<?php 
//******************************************************************************
// Users.ejs.php
// Description: Users Screen
// v0.0.4
// 
// Author: Ernesto J Rodriguez
// Modified: n/a
// 
// MitosEHR (Eletronic Health Records) 2011
//******************************************************************************
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');
include_once("../../library/I18n/I18n.inc.php");
//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0; ?>
<script type="text/javascript">
Ext.require([
    'Ext.layout.container.*',
    'Ext.resizer.Splitter',
    'Ext.fx.target.Element',
    'Ext.fx.target.Component',
    'Ext.window.Window',
    // mitos custom classes
    'Ext.mitos.TopRenderPanel',
    'Ext.mitos.dashboard.Portlet',
    'Ext.mitos.dashboard.PortalColumn',
    'Ext.mitos.dashboard.PortalPanel',
    'Ext.mitos.dashboard.PortalDropZone',
    'Ext.mitos.dashboard.GridPortlet',
    'Ext.mitos.dashboard.ChartPortlet', 
    'Ext.mitos.dashboard.OnotesPortlet'
]);
Ext.onReady(function(){
	Ext.define('Ext.mitos.dashboard.DashboardPage',{
		extend:'Ext.panel.Panel',
		uses: ['Ext.mitos.dashboard.PortalPanel', 'Ext.mitos.dashboard.PortalColumn', 'Ext.mitos.dashboard.GridPortlet', 'Ext.mitos.dashboard.ChartPortlet'],

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
	            id: 'app-viewport',
	            layout: {
	                type: 'border',
	                padding: '0 5 5 5' // pad the layout from the window edges
	            },
	            items: [{
	                xtype: 'container',
	                region: 'center',
	                layout: 'border',
	                padding: '0 2 0 0',
	                items: [{
	                    id: 'app-options',
	                    title: 'Options',
	                    region: 'east',
	                    animCollapse: true,
	                    width: 200,
	                    minWidth: 150,
	                    maxWidth: 400,
	                    split: true,
	                    collapsible: true,
	                    layout: 'accordion',
	                    layoutConfig:{
	                        animate: true
	                    },
	                    items: [{
	                        html: content,
	                        title:'Navigation',
	                        autoScroll: true,
	                        border: false,
	                        iconCls: 'nav'
	                    },{
	                        title:'Settings',
	                        html: content,
	                        border: false,
	                        autoScroll: true,
	                        iconCls: 'settings'
	                    }]
	                },{
	                    id: 'app-portal',
	                    xtype: 'portalpanel',
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
	            }]
	        });
	        this.callParent(arguments);
	    },

		 onPortletClose: function(portlet) {
	        this.showMsg('"' + portlet.title + '" was removed');
	    },
	
	    showMsg: function(msg) {
	        var el = Ext.get('app-msg'),
	            msgId = Ext.id();
	
	        this.msgId = msgId;
	        el.update(msg).show();
	
	        Ext.defer(this.clearMsg, 3000, this, [msgId]);
	    },
	
	    clearMsg: function(msgId) {
	        if (msgId === this.msgId) {
	            Ext.get('app-msg').hide();
	        }
	    }
	}); //ens UserPage class
	
	new Ext.create('Ext.mitos.TopRenderPanel', {
        pageTitle: '<?php i18n('Dashboard'); ?>',
        pageBody: Ext.create('Ext.mitos.dashboard.DashboardPage')
    });
    Ext.create('Ext.mitos.dashboard.DashboardPage');
}); // End ExtJS
</script>