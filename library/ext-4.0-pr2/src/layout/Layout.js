/**
* @class Ext.layout.Layout
* @private
* @extends Ext.layout.AbstractLayout
*/
Ext.define('Ext.layout.Layout', {

    /* Begin Definitions */

    extend: 'Ext.layout.AbstractLayout',

    /* End Definitions */

    layoutItem: function(item, box) {
        box = box || {};
        if (item.componentLayout.initialized !== true) {
            item.doComponentLayout(box.width || item.width || undefined, box.height || item.height || undefined);
        }
    }
});