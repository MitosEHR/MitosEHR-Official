/**
 * @class Ext.layout.Component
 * @extends Ext.layout.Layout
 * @private
 * <p>This class is intended to be extended or created via the <tt><b>{@link Ext.Component#componentLayout layout}</b></tt>
 * configuration property.  See <tt><b>{@link Ext.Component#componentLayout}</b></tt> for additional details.</p>
 */

Ext.define('Ext.layout.Component', {

    /* Begin Definitions */

    extend: 'Ext.layout.Layout',

    /* End Definitions */

    type: 'component',

    monitorChildren: true,

    initLayout : function() {
        var me = this,
            owner = me.owner,
            ownerEl = owner.el;
            
        if (!me.initialized) {
            if (owner.frameSize) {
                me.frameSize = owner.frameSize;
            }
            else {
                owner.frameSize = me.frameSize = {
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0
                };                
            }            
        }
        me.callParent(arguments);
    },
    
    beforeLayout : function(width, height, isSetSize, layoutOwner) {
        this.callParent(arguments);
        
        var owner = this.owner,
            ownerCt = owner.ownerCt,
            isVisible = owner.isVisible(true),
            ownerElChild = owner.el.child,
            layoutCollection;
        
        /**
        * Do not layout calculatedSized components for fixedLayouts unless the ownerCt == layoutOwner
        */
        if (!isSetSize && ownerCt && ownerCt.layout && ownerCt.layout.fixedLayout && ownerCt != layoutOwner) {
            ownerCt.layout.bindToOwnerCtComponent = true;
            return false;
        }

        // If an ownerCt is hidden, add my reference onto the layoutOnShow stack.  Set the needsLayout flag.
        if (!isVisible && owner.hiddenAncestor) {
            layoutCollection = owner.hiddenAncestor.layoutOnShow;
            layoutCollection.remove(owner);
            layoutCollection.add(owner);
            owner.needsLayout = {
                width: width,
                height: height,
                isSetSize: false
            };
        }

        if (isVisible && this.needsLayout(width, height)) {
            this.rawWidth = width;
            this.rawHeight = height;
            return true;
        }
        else {
            return false;
        }
    },

    /**
    * Check if the new size is different from the current size and only
    * trigger a layout if it is necessary.
    * @param {Mixed} width The new width to set.
    * @param {Mixed} height The new height to set.
    */
    needsLayout : function(width, height) {
        this.lastComponentSize = this.lastComponentSize || {
            width: -Infinity,
            height: -Infinity
        };

        var childrenChanged = this.childrenChanged;
        this.childrenChanged = false;

        return (childrenChanged || this.lastComponentSize.width !== width || this.lastComponentSize.height !== height);
    },

    /**
    * Set the size of any element supporting undefined, null, and values.
    * @param {Mixed} width The new width to set.
    * @param {Mixed} height The new height to set.
    */
    setElementSize: function(el, width, height) {
        if (width !== undefined && height !== undefined) {
            el.setSize(width, height);
        }
        else if (height !== undefined) {
            el.setHeight(height);
        }
        else if (width !== undefined) {
            el.setWidth(width);
        }
    },

    /**
     * Returns the owner component's resize element.
     * @return {Ext.core.Element}
     */
     getTarget : function() {
         return this.owner.el;
     },

    /**
     * <p>Returns the element into which rendering must take place. Defaults to the owner Component's encapsulating element.</p>
     * May be overridden in Component layout managers which implement an inner element.
     * @return {Ext.core.Element}
     */
    getRenderTarget : function() {
        return this.owner.el;
    },

    /**
    * Set the size of the target element.
    * @param {Mixed} width The new width to set.
    * @param {Mixed} height The new height to set.
    */
    setTargetSize : function(width, height) {
        var me = this;
        me.setElementSize(me.owner.el, width, height);
        
        if (me.owner.frameBody) {
            var targetInfo = me.getTargetInfo(),
                padding = targetInfo.padding,
                border = targetInfo.border,
                frameSize = me.frameSize;
            
            me.setElementSize(me.owner.frameBody,
                Ext.isNumber(width) ? (width - frameSize.left - frameSize.right - padding.left - padding.right - border.left - border.right) : width,
                Ext.isNumber(height) ? (height - frameSize.top - frameSize.bottom - padding.top - padding.bottom - border.top - border.bottom) : height
            );
        }
        
        me.lastComponentSize = {
            width: width,
            height: height
        };
    },
    
    getTargetInfo : function() {
        if (!this.targetInfo) {
            var target = this.getTarget(),
                body = this.owner.getTargetEl();

            this.targetInfo = {
                padding: {
                    top: target.getPadding('t'),
                    right: target.getPadding('r'),
                    bottom: target.getPadding('b'),
                    left: target.getPadding('l')
                },
                border: {
                    top: target.getBorderWidth('t'),
                    right: target.getBorderWidth('r'),
                    bottom: target.getBorderWidth('b'),
                    left: target.getBorderWidth('l')
                },
                bodyMargin: {
                    top: body.getMargin('t'),
                    right: body.getMargin('r'),
                    bottom: body.getMargin('b'),
                    left: body.getMargin('l')
                }            
            };            
        }
        return this.targetInfo;
    },

    afterLayout : function() {
        var owner = this.owner,
            layout = owner.layout,
            ownerCt = owner.ownerCt,
            ownerCtSize, activeSize, ownerSize;

        owner.afterComponentLayout(this.rawWidth, this.rawHeight);

        // Run the container layout if it exists (layout for child items)
        // **Unless automatic laying out is suspended**
        if (!owner.suspendLayout && layout && layout.isLayout) {
            layout.layout();
        }

        if (ownerCt && ownerCt.componentLayout && ownerCt.componentLayout.monitorChildren && !ownerCt.componentLayout.layoutBusy) {
            ownerCt.componentLayout.childrenChanged = true;

            if (ownerCt.componentLayout.bindToOwnerCtComponent === true) {
                ownerCt.doComponentLayout();
            }
            else if (!ownerCt.suspendLayout && ownerCt.layout && !ownerCt.layout.layoutBusy) {
                if (ownerCt.layout.bindToOwnerCtComponent === true) {
                    ownerCt.doComponentLayout();
                }
                else if (ownerCt.componentLayout.bindToOwnerCtContainer === true || ownerCt.layout.bindToOwnerCtContainer === true) {
                    ownerCt.layout.layout();
                }
            }
        }
    }
});
