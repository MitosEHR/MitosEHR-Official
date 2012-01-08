/**
 * @private
 */
Ext.define('Ext.fx.layout.Card', {
    requires: [
        'Ext.fx.layout.card.Slide',
        'Ext.fx.layout.card.Fade',
        'Ext.fx.layout.card.Flip',
        'Ext.fx.layout.card.Pop',
        'Ext.fx.layout.card.Cube',
        'Ext.fx.layout.card.Scroll'
    ],

    constructor: function(config) {
        var defaultClass = Ext.fx.layout.card.Css,
            type;

        if (typeof config == 'string') {
            type = config;

            config = {};
        }
        else if (config.type) {
            type = config.type;
        }

        config.elementBox = false;

        if (type) {
            if (type === 'slide' && Ext.os.is.Android2) {
                type = 'scroll';
            }

            defaultClass = Ext.ClassManager.getByAlias('fx.layout.card.' + type);

            //<debug error>
            if (!defaultClass) {
                Ext.Logger.error("Unknown card animation type: '" + type + "'");
            }
            //</debug>
        }

        return Ext.factory(config, defaultClass);
    }
});
