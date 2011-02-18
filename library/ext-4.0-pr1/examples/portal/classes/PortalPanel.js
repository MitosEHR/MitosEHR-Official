/*
 * Added try/catch to avoid "Access denied" error in IE in certain situations.
 * 
 * The MS KB article is out of date, but this is the error for reference:
 * http://support.microsoft.com/kb/934364/en-us
 * 
 * Google's implementation of preventDefault:
 * http://closure-library.googlecode.com/svn/docs/closure_goog_events_browserevent.js.source.html
 * 
 * and jQuery
 * https://github.com/jquery/jquery/blob/master/src/event.js
 */
Ext.EventManager.preventDefault = function(event) {
    event = event.browserEvent || event;
    if (event.preventDefault) {
        event.preventDefault();
    } else {
        event.returnValue = false;
        try {
            event.keyCode = -1;
        } catch(ex) {
            // ignore. this is simply to avoid IE's access denied error
        }
    }
};

/**
 * @class Ext.ux.PortalPanel
 * @extends Ext.Panel
 * A {@link Ext.Panel Panel} class used for providing drag-drop-enabled portal layouts.
 */
Ext.define('Ext.ux.PortalPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.portalpanel',
    autoScroll : true,
    cls: 'x-portal',
    defaultType: 'portalcolumn',
    defaults: {
        margins: '0 8 0 0'
    },

    initComponent : function(){
        this.layout = {
            type : 'hbox',
            clearInnerCtOnLayout: true,
            afterLayout: Ext.bind(this.adjustInnerSize, this),
            padding: '8 0 0 8'
        };
        Ext.ux.PortalPanel.superclass.initComponent.call(this);

        this.addEvents({
            validatedrop: true,
            beforedragover: true,
            dragover: true,
            beforedrop: true,
            drop: true
        });
        
        this.on('drop', Ext.isIE ? this.doLayout : this.adjustInnerSize, this);
    },
    
    adjustInnerSize: function() {
        var layout = this.getLayout(),
            innerHeight = layout.getLayoutTargetSize().height,
            newHeight = innerHeight,
            items = layout.getVisibleItems(),
            len = items.length,
            i = 0, h = 0;

        for (; i < len; i++) {
            h = items[i].getHeight();
            newHeight = Math.max(newHeight, h);
        }
        if(newHeight > innerHeight){
            newHeight += 15; // we're going to scroll so pad the bottom a little
        }
        layout.innerCt.setHeight(newHeight);
    },
    
    // private
    initEvents : function(){
        Ext.ux.PortalPanel.superclass.initEvents.call(this);
        this.dd = new Ext.ux.PortalDropZone(this, this.dropConfig);
    },

    // private
    beforeDestroy : function() {
        if(this.dd){
            this.dd.unreg();
        }
        Ext.ux.PortalPanel.superclass.beforeDestroy.call(this);
    }
});