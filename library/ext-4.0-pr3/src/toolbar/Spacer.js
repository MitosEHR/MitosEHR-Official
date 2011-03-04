/**
 * @class Ext.toolbar.Spacer
 * @extends Ext.toolbar.Item
 * A simple element that adds extra horizontal space between items in a toolbar.
 * By default a 2px wide space is added via css specification:<pre><code>
.x-toolbar .x-toolbar-spacer {
    width:2px;
}
 * </code></pre>
 * <p>Example usage:</p>
 * <pre><code>
new Ext.panel.Panel({
    tbar : [
        'Item 1',
        {xtype: 'tbspacer'}, // or ' '
        'Item 2',
        // space width is also configurable via javascript
        {xtype: 'tbspacer', width: 50}, // add a 50px space
        'Item 3'
    ]
});
</code></pre>
 * @constructor
 * Creates a new Spacer
 * @xtype tbspacer
 */
Ext.define('Ext.toolbar.Spacer', {
    extend: 'Ext.Component',
    alias: 'widget.tbspacer',
    baseCls: Ext.baseCSSPrefix + 'toolbar-spacer'
});