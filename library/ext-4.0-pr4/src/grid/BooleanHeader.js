/**
 * @class Ext.grid.BooleanHeader
 * @extends Ext.grid.Header
 * <p>A Column definition class which renders boolean data fields.  See the {@link Ext.grid.Header#xtype xtype}
 * config option of {@link Ext.grid.Header} for more details.</p>
 */
Ext.define('Ext.grid.BooleanHeader', {
    extend: 'Ext.grid.Header',
    alias: ['widget.booleanheader'],
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
        Ext.grid.BooleanHeader.superclass.constructor.call(this, cfg);
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