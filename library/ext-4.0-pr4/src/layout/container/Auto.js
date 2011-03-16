/**
 * @class Ext.layout.container.Auto
 * @extends Ext.layout.Container
 *
 * <p>The AutoLayout is the default layout manager delegated by {@link Ext.container.Container} to
 * render any child Components when no <tt>{@link Ext.container.Container#layout layout}</tt> is configured into
 * a <tt>{@link Ext.container.Container Container}.</tt>.  AutoLayout provides only a passthrough of any layout calls
 * to any child containers.</p>
 */

Ext.define('Ext.layout.container.Auto', {

    /* Begin Definitions */

    alias: ['layout.auto', 'layout.autocontainer'],

    extend: 'Ext.layout.Container',

    /* End Definitions */

    type: 'autocontainer',

    fixedLayout: false,

    bindToOwnerCtComponent: true,

    // @private
    onLayout : function(owner, target) {
        var items = this.getLayoutItems(),
            ln = items.length,
            i, item;
        for (i = 0; i < ln; i++) {
            item = items[i];
            this.setItemSize(item);
        }
    }
});