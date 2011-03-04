/**
 * @class Ext.fx.target.CompositeElementCSS
 * @private
 * @extends Ext.fx.target.CompositeElement
 */

Ext.define('Ext.fx.target.CompositeElementCSS', {

    /* Begin Definitions */

    extend: 'Ext.fx.target.CompositeElement',

    requires: ['Ext.fx.target.ElementCSS'],

    /* End Definitions */
    setAttr: function() {
        return Ext.fx.target.ElementCSS.prototype.setAttr.apply(this, arguments);
    }
});