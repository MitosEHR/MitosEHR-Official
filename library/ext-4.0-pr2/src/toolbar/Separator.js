/**
 * @class Ext.toolbar.Separator
 * @extends Ext.toolbar.Item
 * A simple class that adds a vertical separator bar between toolbar items
 * (css class:<tt>'x-toolbar-separator'</tt>). Example usage:
 * <pre><code>
new Ext.panel.Panel({
    tbar : [
        'Item 1',
        {xtype: 'tbseparator'}, // or '-'
        'Item 2'
    ]
});
</code></pre>
 * @constructor
 * Creates a new Separator
 * @xtype tbseparator
 */
Ext.define('Ext.toolbar.Separator', {
    extend: 'Ext.toolbar.Item',
    alias: 'widget.tbseparator',
    cls: Ext.baseCSSPrefix + 'toolbar-separator'
});