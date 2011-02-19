/**
 * @class Ext.layout.Manager
 * @private
 * @extends Ext.AbstractManager
 */
Ext.define('Ext.layout.Manager', {
    extend: 'Ext.AbstractManager',
    requires: ['Ext.layout.AbstractLayout'],

    singleton: true,

    typeName: 'type',

    create: function(layout, defaultType) {
        var type;
        if (layout instanceof Ext.layout.AbstractLayout) {
            return Ext.createByAlias('layout.' + layout);
        } else {
            if (Ext.isObject(layout)) {
                type = layout.type;
            }
            else {
                type = layout || defaultType;
                layout = {};
            }
            return Ext.createByAlias('layout.' + type, layout || {});
        }
    }
});
