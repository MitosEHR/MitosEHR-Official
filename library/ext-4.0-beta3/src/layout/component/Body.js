/**
 * Component layout for components which maintain an inner body element which must be resized to synchronize with the
 * Component size.
 * @class Ext.layout.component.Body
 * @extends Ext.layout.component.Component
 * @private
 */

Ext.define('Ext.layout.component.Body', {

    /* Begin Definitions */

    alias: ['layout.body'],

    extend: 'Ext.layout.component.Component',

    uses: ['Ext.layout.container.Container'],

    /* End Definitions */

    type: 'body',
    
    onLayout: function(width, height) {
        var me = this,
            owner = me.owner;

        // Size the Component's encapsulating element according to the dimensions
        me.setTargetSize(width, height);

        // Size the Component's body element according to the content box of the encapsulating element
        me.setBodySize.apply(me, arguments);

        // We need to bind to the owner whenever we do not have a user set height or width.
        if (owner && owner.layout && owner.layout.isLayout) {
            if (!Ext.isNumber(owner.height) || !Ext.isNumber(owner.width)) {
                owner.layout.bindToOwnerCtComponent = true;
            }
            else {
                owner.layout.bindToOwnerCtComponent = false;
            }
        }
        
        me.callParent(arguments);
    },

    /**
     * @private
     * <p>Sizes the Component's body element to fit exactly within the content box of the Component's encapsulating element.<p>
     * <p>Uses Container layout's getLayoutTargetSize method to ascertain the content box</p>
     */
    setBodySize: function(width, height) {
        var me = this,
            isNumber = Ext.isNumber,
            isDefined = Ext.isDefined,
            bodySize, bodyWidth, bodyHeight;

        if (isDefined(width) || isDefined(height)) {
            bodySize = Ext.layout.container.Container.prototype.getLayoutTargetSize.call(me);
            bodyWidth = isNumber(width) ? bodySize.width : width;
            bodyHeight = isNumber(height) ? bodySize.height : height;
        }

        me.setElementSize(me.owner.body, bodyWidth, bodyHeight);
    }
});