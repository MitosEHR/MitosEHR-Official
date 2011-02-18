/**
 * @class Ext.layout.AbstractContainer
 * @extends Ext.layout.Layout
 * <p>This class is intended to be extended or created via the <tt><b>{@link Ext.container.Container#layout layout}</b></tt>
 * configuration property.  See <tt><b>{@link Ext.container.Container#layout}</b></tt> for additional details.</p>
 */

Ext.define('Ext.layout.AbstractContainer', {

    /* Begin Definitions */

    extend: 'Ext.layout.Layout',

    /* End Definitions */

    type: 'container',

    fixedLayout: true,

    // @private
    managedHeight: true,
    // @private
    managedWidth: true,

    /**
     * @cfg {Boolean} bindToOwnerCtComponent
     * Flag to notify the ownerCt Component on afterLayout of a change
     */
    bindToOwnerCtComponent: false,

    /**
     * @cfg {Boolean} bindToOwnerCtContainer
     * Flag to notify the ownerCt Container on afterLayout of a change
     */
    bindToOwnerCtContainer: false,

    /**
     * @cfg {String} itemCls
     * <p>An optional extra CSS class that will be added to the container. This can be useful for adding
     * customized styles to the container or any of its children using standard CSS rules. See
     * {@link Ext.Component}.{@link Ext.Component#ctCls ctCls} also.</p>
     * </p>
     */

    isManaged: function(dimension) {
        dimension = Ext.String.capitalize(dimension);
        var me = this,
            child = me,
            managed = me['managed' + dimension],
            ancestor = me.owner.ownerCt;

        if (ancestor && ancestor.layout) {
            while (ancestor && ancestor.layout) {
                if (managed === false || ancestor.layout['managed' + dimension] === false) {
                    managed = false;
                    break;
                }
                ancestor = ancestor.ownerCt;
            }
        }
        return managed;
    },

    layout: function() {
        var me = this,
            owner = me.owner;
        if (Ext.isNumber(owner.height) || owner.isViewPort) {
            me.managedHeight = false;
        }
        if (Ext.isNumber(owner.width) || owner.isViewPort) {
            me.managedWidth = false;
        }
        me.callParent(arguments);
    },

    /**
     * <p>Returns an array of child components either for a render phase (Performed in the beforeLayout method of the layout's
     * base class), or the layout phase (onLayout).</p>
     * @return {Array} of child components
     */
    getLayoutItems: function() {
        return this.owner && this.owner.items && this.owner.items.items || [];
    },

    afterLayout: function() {
        this.owner.afterLayout(this);
    },
    /**
     * Returns the owner component's resize element.
     * @return {Ext.core.Element}
     */
     getTarget: function() {
         return this.owner.getTargetEl();
     },
    /**
     * <p>Returns the element into which rendering must take place. Defaults to the owner Container's {@link Ext.AbstractComponent#targetEl}.</p>
     * May be overridden in layout managers which implement an inner element.
     * @return {Ext.core.Element}
     */
     getRenderTarget: function() {
         return this.owner.getTargetEl();
     }
});
