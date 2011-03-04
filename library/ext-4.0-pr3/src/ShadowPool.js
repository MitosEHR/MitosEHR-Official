/**
 * @class Ext.ShadowPool
 * @extends Object
 * Private utility class that manages the internal Shadow cache
 * @private
 */
Ext.define('Ext.ShadowPool', {
    singleton: true,
    requires: ['Ext.core.DomHelper'],
    statics: {
        markup: Ext.isIE ?
            '<div class="' + Ext.baseCSSPrefix + 'ie-shadow" role="presentation"></div>':
            '<div class="' + Ext.baseCSSPrefix + 'shadow" role="presentation"><div class="xst" role="presentation"><div class="xstl" role="presentation"></div><div class="xstc" role="presentation"></div><div class="xstr" role="presentation"></div></div><div class="xsc" role="presentation"><div class="xsml" role="presentation"></div><div class="xsmc" role="presentation"></div><div class="xsmr" role="presentation"></div></div><div class="xsb" role="presentation"><div class="xsbl" role="presentation"></div><div class="xsbc" role="presentation"></div><div class="xsbr" role="presentation"></div></div></div>',
        shadows: []
    },
    pull: function() {
        var sh = this.statics().shadows.shift();
        if (!sh) {
            sh = Ext.get(Ext.core.DomHelper.insertHtml("beforeBegin", Ext.getBody().firstChild, this.statics().markup));
            sh.autoBoxAdjust = false;
        }
        return sh;
    },

    push: function(sh) {
        this.statics().shadows.push(sh);
    }
});
