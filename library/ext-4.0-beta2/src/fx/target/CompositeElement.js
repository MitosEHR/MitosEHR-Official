/**
 * @class Ext.fx.target.CompositeElement
 * @private
 * @extends Ext.fx.target.Element
 */

Ext.define('Ext.fx.target.CompositeElement', {

    /* Begin Definitions */

    extend: 'Ext.fx.target.Element',

    /* End Definitions */

    isComposite: true,
    constructor: function(target) {
        target.id = target.id || Ext.id(null, 'ext-composite-');
        Ext.fx.target.CompositeElement.superclass.constructor.call(this, target);
    },

    getAttr: function(attr, val) {
        var out = [],
            target = this.target;
        target.each(function(el) {
            out.push([el, this.getElVal(el, attr, val)]);
        }, this);
        return out;
    }
});