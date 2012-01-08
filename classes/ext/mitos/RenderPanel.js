//******************************************************************************
// Render panel
//******************************************************************************
Ext.define('Ext.mitos.RenderPanel', {
    extend      : 'Ext.container.Container',
    mixins      : { app: 'Ext.mitos.panel.MitosApp'},
    alias       : 'widget.renderpanel',
    cls         : 'RenderPanel',
    layout      : 'border',
    frame       : false,
    border      : false,
    pageLayout	: 'fit',
    pageBody    : [],
    pageTitle   : '',
    initComponent: function(){
        var me = this;
    	Ext.apply(me,{
            items   : [{
                cls     : 'RenderPanel-header',
                itemId  : 'RenderPanel-header',
                xtype   : 'container',
                region  : 'north',
                layout  : 'fit',
                height  : 40,
                html    : '<div class="dashboard_title">' + me.pageTitle + '</div>'
            },{
                cls     : 'RenderPanel-body-container',
                xtype   : 'container',
                region  : 'center',
                layout  : 'fit',
                padding : 5,
                items:[{
                    cls      	: 'RenderPanel-body',
                    xtype 		: 'panel',
                    frame       : true,
                    layout  	: this.pageLayout,
                    border  	: false,
                    defaults	: {frame:false, border:false, autoScroll:true},
                    items    	: me.pageBody
                    }]
            }]
        },this);
        me.callParent(arguments);
    },

    updateTitle:function(pageTitle){
        this.getComponent('RenderPanel-header').update('<div class="dashboard_title">' + pageTitle + '</div>');
    },

    getMitosApp:function(){
        return this.mixins.app.getMitosApp();
    },

    msg: function(title, format){
        this.mixins.app.msg(title, format)
    }
});
