//******************************************************************************
// Render panel
//******************************************************************************
Ext.define('Ext.mitos.RenderPanel', {
    extend      : 'Ext.container.Container',
    alias       : 'widget.renderpanel',
    layout      : 'border',
    frame       : false,
    border      : false,
    cls          : 'RenderPanel',
    pageLayout	: 'fit',
    pageBody    : [],
    pageTitle   : '',
    initComponent: function(){
        TopRender = this;
        var me = this;
    	Ext.apply(me,{
            items   : [{
                cls      : 'RenderPanel-header',
                xtype   : 'container',
                region  : 'north',
                layout  : 'fit',
                height  : 40,
                html    : '<div class="dashboard_title">' + me.pageTitle + '</div>'
            },{
                cls      	: 'RenderPanel-body',
                xtype 		: 'panel',
                region  	: 'center',
                layout  	: this.pageLayout,
                border  	: false,
                defaults	: {frame:true, border:true, autoScroll:true},
                items    	: me.pageBody
            }]
        });
        me.callParent(arguments);
    }
});
