/**
 * @class Ext.Img
 * @extends Ext.Component
 * Simple helper class for easily creating image components. This simply renders an image tag to the DOM
 * with the configured src.
 */
Ext.define('Ext.Img', {
    extend: 'Ext.Component',
    alias: ['widget.image', 'widget.imagecomponent'],
    /** @cfg {String} src The image src */
    src: '',

    getElConfig: function() {
        return {
            tag: 'img',
            src: this.src
        };
    },
    
    /**
     * Updates the {@link #src} of the image
     */
    setSrc: function(src) {
        var me = this,
            img = me.el;
        me.src = src;
        if (img) {
            img.dom.src = src;
        }
    }
});
