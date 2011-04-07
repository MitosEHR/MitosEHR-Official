/**
 * @class Ext.grid.column.Number
 * @extends Ext.grid.column.Column
 * <p>A Column definition class which renders a numeric data field according to a {@link #format} string.</p>
 */
Ext.define('Ext.grid.column.Number', {
    extend: 'Ext.grid.column.Column',
    alias: ['widget.numbercolumn'],
    requires: ['Ext.util.Format'],
    alternateClassName: 'Ext.grid.NumberColumn',

    /**
     * @cfg {String} format
     * A formatting string as used by {@link Ext.util.Format#number} to format a numeric value for this Column
     * (defaults to <code>'0,000.00'</code>).
     */
    format : '0,000.00',
    constructor: function(cfg) {
        this.callParent(arguments);
        this.renderer = Ext.util.Format.numberRenderer(this.format);
    }
});