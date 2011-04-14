/**
 * @class Ext.grid.CellEditor
 * @extends Ext.Editor
 * Internal utility class that provides default configuration for cell editing.
 * @ignore
 */
Ext.define('Ext.grid.CellEditor', {
    extend: 'Ext.Editor',
    constructor: function(config) {
        if (config.field) {
            config.field.monitorTab = false;
        }
        config.autoSize = {
            width: 'boundEl'
        };
        this.callParent(arguments);
    },
    alignment: "tl-tl",
    hideEl : false,
    cls: Ext.baseCSSPrefix + "small-editor " + Ext.baseCSSPrefix + "grid-editor",
    shim: false,
    shadow: false
});