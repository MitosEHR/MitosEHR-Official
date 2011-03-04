/**
 * @class Ext.fx.target.SpriteGroup
 * @extends Ext.fx.target.Sprite
 * @private
 */

Ext.define('Ext.fx.target.SpriteGroup', {

    /* Begin Definitions */

    extend: 'Ext.fx.target.Sprite',

    /* End Definitions */

    getAttr: function(attr, val) {
        var out = [],
            target = this.target;
        target.each(function(sprite) {
            out.push([sprite, val != undefined ? val : this.getFromPrim(sprite, attr)]);
        }, this);
        return out;
    }
});
