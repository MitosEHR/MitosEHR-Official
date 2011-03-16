/**
 * @class Vimeo.Tags
 * @extends Ext.DataView
 * 
 */
Ext.define("Vimeo.Tags", {
    extend: 'Ext.DataView',
    alias: 'widget.tagslist',

    title: 'Tags',
    multiSelect: true,
    
    initComponent: function() {
        Ext.apply(this, {
            store: 'Tags',
            itemSelector: 'li',
            tpl: [
                '<ul class="x-video-tags">',
                    '<tpl for=".">',
                        '<li>{name}</li>',
                    '</tpl>',
                '</ul>'
            ]
        });
        
        Vimeo.Tags.superclass.initComponent.apply(this, arguments);
    }
});