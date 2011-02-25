/**
 * @class Ext.toolbar.TextItem
 * @extends Ext.toolbar.Item
 * A simple class that renders text directly into a toolbar.
 * Example usage:
 * <pre><code>
new Ext.panel.Panel({
    tbar : [
        {xtype: 'tbtext', text: 'Item 1'} // or simply 'Item 1'
    ]
});
</code></pre>
 * @constructor
 * Creates a new TextItem
 * @param {Object} text A text string, or a config object containing a <tt>text</tt> property
 * @xtype tbtext
 */
Ext.define('Ext.toolbar.TextItem', {
    extend: 'Ext.toolbar.Item',
    requires: ['Ext.XTemplate'],
    alias: 'widget.tbtext',
    /**
     * @cfg {String} text The text to be used as innerHTML (html tags are accepted)
     */
    text: '',
    
    renderTpl: '{text}',
    //
    baseCls: Ext.baseCSSPrefix + 'toolbar-text',
    
    onRender : function() {
        Ext.apply(this.renderData, {
            text: this.text
        });
        Ext.toolbar.TextItem.superclass.onRender.apply(this, arguments);
    },

    /**
     * Updates this item's text, setting the text to be used as innerHTML.
     * @param {String} t The text to display (html accepted).
     */
    setText : function(t) {
        if (this.rendered) {
            this.el.update(t);
        } else {
            this.text = t;
        }
    }
});