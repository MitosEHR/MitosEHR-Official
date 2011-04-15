/**
 * @class Ext.grid.column.Template
 * @extends Ext.grid.column.Column
 * <p>A Column definition class which renders a value by processing a {@link Ext.data.Model Model}'s
 * {@link Ext.data.Model#data data} using a {@link #tpl configured} {@link Ext.XTemplate XTemplate}.</p>
 */
Ext.define('Ext.grid.column.Template', {
    extend: 'Ext.grid.column.Column',
    alias: ['widget.templatecolumn'],
    requires: ['Ext.XTemplate'],
    alternateClassName: 'Ext.grid.TemplateColumn',

    /**
     * @cfg {String/XTemplate} tpl
     * An {@link Ext.XTemplate XTemplate}, or an XTemplate <i>definition string</i> to use to process a
     * {@link Ext.data.Model Model}'s {@link Ext.data.Model#data data} to produce a column's rendered value.
     */
    constructor: function(cfg){
        this.callParent(arguments);

        var tpl = this.tpl = (!Ext.isPrimitive(this.tpl) && this.tpl.compile) ? this.tpl : Ext.create('Ext.XTemplate', this.tpl);

        this.renderer = function(value, p, record) {
            return tpl.apply(record.data);
        };
    }
});
