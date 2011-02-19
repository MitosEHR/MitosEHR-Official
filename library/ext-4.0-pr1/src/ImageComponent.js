/**
 * @class Ext.ImageComponent
 * @extends Ext.Component
 * Simple helper class for easily creating image components. This simply renders an image tag to the DOM
 * with the configured src.
 */
Ext.define('Ext.ImageComponent', {
    extend: 'Ext.Component',
    alias: ['widget.image', 'widget.imagecomponent'],
    /** @cfg {String} src The image src */
    src: '',
    
    onRender: function(container) {
        if (!this.el) {
            this.el = container.createChild({
                tag: 'img',
                src: this.src
            });
        }
    }
});