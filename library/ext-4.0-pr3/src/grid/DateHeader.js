/**
 * @class Ext.grid.DateHeader
 * @extends Ext.grid.Header
 * <p>A Column definition class which renders a passed date according to the default locale, or a configured
 * {@link #format}. See the {@link Ext.grid.Header#xtype xtype} config option of {@link Ext.grid.Header}
 * for more details.</p>
 */
Ext.define('Ext.grid.DateHeader', {
    extend: 'Ext.grid.Header',
    alias: ['widget.dateheader'],
    requires: ['Ext.util.Format'],
    
    /**
     * @cfg {String} format
     * A formatting string as used by {@link Date#format} to format a Date for this Column
     * (defaults to <tt>'m/d/Y'</tt>).
     */
    format : 'm/d/Y',
    constructor: function(cfg){
        Ext.grid.DateHeader.superclass.constructor.call(this, cfg);
        this.renderer = Ext.util.Format.dateRenderer(this.format);
    }
});