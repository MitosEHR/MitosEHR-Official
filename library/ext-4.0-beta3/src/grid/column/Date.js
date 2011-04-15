/**
 * @class Ext.grid.column.Date
 * @extends Ext.grid.column.Column
 * <p>A Column definition class which renders a passed date according to the default locale, or a configured
 * {@link #format}.</p>
 */
Ext.define('Ext.grid.column.Date', {
    extend: 'Ext.grid.column.Column',
    alias: ['widget.datecolumn'],
    requires: ['Ext.Date'],
    alternateClassName: 'Ext.grid.DateColumn',

    /**
     * @cfg {String} format
     * A formatting string as used by {@link Date#format Date.format} to format a Date for this Column.
     * This defaults to the default date from {@link Ext.Date#defaultFormat} which itself my be overridden
     * in a locale file.
     */
    format : Ext.Date.defaultFormat,

    constructor: function(cfg){
        this.callParent(arguments);
        this.renderer = Ext.util.Format.dateRenderer(this.format);
    }
});