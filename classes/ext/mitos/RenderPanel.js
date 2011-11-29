//******************************************************************************
// Render panel
//******************************************************************************
Ext.define('Ext.mitos.RenderPanel', {
    extend      : 'Ext.container.Container',
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
                cls      : 'RenderPanel-header',
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
                    border      : true,
                    layout  	: this.pageLayout,
                    border  	: false,
                    defaults	: {frame:false, border:false, autoScroll:true},
                    items    	: me.pageBody
                    }]
            }]
        });
        me.callParent(arguments);
    },

    msg: function(title, format){
        if(!this.msgCt){
            this.msgCt = Ext.core.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
        }
        this.msgCt.alignTo(document, 't-t');
        var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
        var m = Ext.core.DomHelper.append(this.msgCt, {html:'<div class="msg"><h3>' + title + '</h3><p>' + s + '</p></div>'}, true);

        m.slideIn('t').pause(3000).ghost('t', {remove:true});
    }
});
