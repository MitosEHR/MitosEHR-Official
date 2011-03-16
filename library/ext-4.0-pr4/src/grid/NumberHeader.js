/**
 * @class Ext.grid.NumberHeader
 * @extends Ext.grid.Header
 * <p>A Column definition class which renders a numeric data field according to a {@link #format} string.  See the
 * {@link Ext.grid.Header#xtype xtype} config option of {@link Ext.grid.Header} for more details.</p>
 */
Ext.define('Ext.grid.NumberHeader', {
    extend: 'Ext.grid.Header',
    alias: ['widget.numberheader'],
    requires: ['Ext.util.Format'],
    /**
     * @cfg {String} format
     * A formatting string as used by {@link Ext.util.Format#number} to format a numeric value for this Column
     * (defaults to <tt>'0,000.00'</tt>).
     */
    format : '0,000.00',
    constructor: function(cfg){
        Ext.grid.NumberColumn.superclass.constructor.call(this, cfg);
        this.renderer = Ext.util.Format.numberRenderer(this.format);
    }
});
