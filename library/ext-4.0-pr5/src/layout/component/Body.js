/**
 * Component layout for components which maintain an inner body element which must be resized to synchronize with the
 * Component size.
 * @class Ext.layout.component.Body
 * @extends Ext.layout.Component
 * @private
 */

Ext.define('Ext.layout.component.Body', {

    /* Begin Definitions */

    alias: ['layout.body'],

    extend: 'Ext.layout.Component',

    uses: ['Ext.layout.Container'],

    /* End Definitions */

    type: 'body',

    onLayout: function(width, height) {
        var me = this;

        // Size the Component's encapsulating element according to the dimensions
        me.setTargetSize(width, height);

        // Size the Component's body element according to the content box of the encapsulating element
        me.setBodySize.apply(me, arguments);

        me.callParent(arguments);
    },

    /**
     * @private
     * <p>Sizes the Component's body element to fit exactly within the content box of the Component's encapsulating element.<p>
     * <p>Uses Container layout's getLayoutTargetSize method to ascertain the content box</p>
     * @returns
     */
    setBodySize: function(width, height) {
        var size = Ext.layout.Container.prototype.getLayoutTargetSize.call(this);

        if (!Ext.isDefined(width)) {
            size.width = undefined;
        }
        if (!Ext.isDefined(height)) {
            size.height = undefined;
        }
        this.owner.body.setSize(size);
    }
});