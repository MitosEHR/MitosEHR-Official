/**
 * @class Ext.toolbar.Fill
 * @extends Ext.Component
 * A non-rendering placeholder item which instructs the Toolbar's Layout to begin using
 * the right-justified button container.
 * <pre><code>
new Ext.panel.Panel({
    tbar : [
        'Item 1',
        {xtype: 'tbfill'}, // or '->'
        'Item 2'
    ]
});
</code></pre>
 * @constructor
 * Creates a new Fill
 * @xtype tbfill
 */
Ext.define('Ext.toolbar.Fill', {
    extend: 'Ext.Component',
    alias: 'widget.tbfill',
    isFill : true,
    flex: 1
});