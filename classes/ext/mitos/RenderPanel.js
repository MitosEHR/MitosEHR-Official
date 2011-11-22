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
