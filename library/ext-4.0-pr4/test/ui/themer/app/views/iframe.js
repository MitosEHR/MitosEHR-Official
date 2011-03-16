Ext.define("themer.views.iframe", {
    extend: 'Ext.Panel',
    alias: 'widget.iframe',

    renderTpl: [
        '<div class="{baseCls}-wrap">',
            '<div class="{baseCls}-body<tpl if="bodyCls"> {bodyCls}</tpl>"<tpl if="bodyStyle"> style="{bodyStyle}"</tpl>>',
                '<iframe id="theme_iframe" src="" width="100%" height="100%" style="border-width:0;"></iframe>',
            '</div>',
        '</div>'
    ],
    
    initComponent: function() {
        Ext.applyIf(this, {
            border: false
        });
        
        themer.views.iframe.superclass.initComponent.call(this);
    }
});