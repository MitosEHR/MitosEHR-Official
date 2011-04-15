/**
 * @class Ext.grid.column.Boolean
 * @extends Ext.grid.column.Column
 * <p>A Column definition class which renders boolean data fields.  See the {@link Ext.grid.column.Column#xtype xtype}
 * config option of {@link Ext.grid.Column} for more details.</p>
 */
Ext.define('Ext.grid.column.Boolean', {
    extend: 'Ext.grid.column.Column',
    alias: ['widget.booleancolumn'],
    alternateClassName: 'Ext.grid.BooleanColumn',

    /**
     * @cfg {String} trueText
     * The string returned by the renderer when the column value is not falsey (defaults to <tt>'true'</tt>).
     */
    trueText: 'true',

    /**
     * @cfg {String} falseText
     * The string returned by the renderer when the column value is falsey (but not undefined) (defaults to
     * <tt>'false'</tt>).
     */
    falseText: 'false',

    /**
     * @cfg {String} undefinedText
     * The string returned by the renderer when the column value is undefined (defaults to <tt>'&#160;'</tt>).
     */
    undefinedText: '&#160;',

    constructor: function(cfg){
        this.callParent(arguments);
        var trueText      = this.trueText,
            falseText     = this.falseText,
            undefinedText = this.undefinedText;

        this.renderer = function(value){
            if(value === undefined){
                return undefinedText;
            }
            if(!value || value === 'false'){
                return falseText;
            }
            return trueText;
        };
    }
});