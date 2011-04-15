/**
 * @class Ext.util.Floating
 * A mixin to add floating capability to a Component
 */
Ext.define('Ext.util.Floating', {

    uses: ['Ext.Layer'],

    /**
     * @cfg {Boolean} focusOnToFront
     * Specifies whether the floated component should be automatically {@link #focus focused} when it is
     * {@link #toFront brought to the front}. Defaults to true.
     */
    focusOnToFront: true,

    /**
     * @cfg {String/Boolean} shadow Specifies whether the floating component should be given a shadow. Set to
     * <tt>true</tt> to automatically create an {@link Ext.Shadow}, or a string indicating the
     * shadow's display {@link Ext.Shadow#mode}. Set to <tt>false</tt> to disable the shadow.
     * (Defaults to <tt>'sides'</tt>.)
     */
    shadow: 'sides',

    constructor: function(config) {
        this.floating = true;
        this.el = Ext.create('Ext.Layer', Ext.apply({}, config, {
            hideMode: this.hideMode,
            hidden: this.hidden,
            shadow: Ext.isDefined(this.shadow) ? this.shadow : 'sides',
            shadowOffset: this.shadowOffset,
            constrain: false,
            shim: this.shim === false ? false : undefined
        }), this.el);
    },

    // private
    // z-index is managed by the zIndexManager and may be overwritten at any time.
    // Returns the next z-index to be used.
    // If this is a Container, then it will have rebased any managed floating Components,
    // and so the next available z-index will be approximately 10000 above that.
    setZIndex: function(index) {
        var me = this;
        this.el.setZIndex(index);

        // Next item goes 10 above;
        index += 10;

        // When a Container with floating items has its z-index set, it rebases any floating items it is managing.
        // The returned value is a round number approximately 10000 above the last z-index used.
        if (me.floatingItems) {
            index = Math.floor(me.floatingItems.setBase(index) / 100) * 100 + 10000;
        }
        return index;
    },

    /**
     * <p>Moves this floating Component into a constrain region.</p>
     * <p>By default, this Component is constrained to be within the container it was added to, or the element
     * it was rendered to.</p>
     * <p>An alternative constraint may be passed.</p>
     * @param {Mixed} constrainTo Optional. The Element or {@link Ext.util.Region Region} into which this Component is to be constrained.
     */
    doConstrain: function(constrainTo) {
        var me = this,
            constrainEl,
            vector,
            xy;

        if (me.constrain || me.constrainHeader) {
            if (me.constrainHeader) {
                constrainEl = me.header.el;
            } else {
                constrainEl = me.el;
            }
            vector = constrainEl.getConstrainVector(constrainTo || (me.floatParent && me.floatParent.getTargetEl()) || me.container);
            if (vector) {
                xy = me.getPosition();
                xy[0] += vector[0];
                xy[1] += vector[1];
                me.setPosition(xy);
            }
        }
    },

    /**
     * Aligns this floating Component to the specified element
     * @param {Mixed} element The element to align to.
     * @param {String} position (optional, defaults to "tl-bl?") The position to align to (see {@link Ext.core.Element#alignTo} for more details).
     * @param {Array} offsets (optional) Offset the positioning by [x, y]
     * @return {Component} this
     */
    alignTo: function(element, position, offsets) {
        var xy = this.el.getAlignToXY(element, position, offsets);
        this.setPagePosition(xy);
        return this;
    },

    /**
     * <p>Brings this floating Component to the front of any other visible, floating Components managed by the same {@link Ext.ZIndexManager ZIndexManager}</p>
     * <p>If this Component is modal, inserts the modal mask just below this Component in the z-index stack.</p>
     * @param {Boolean} preventFocus (optional) Specify <code>true</code> to prevent the Component from being focused.
     * @return {Component} this
     */
    toFront: function(preventFocus) {
        var me = this;
        if (me.zIndexManager.bringToFront(me)) {
            if (!Ext.isDefined(preventFocus)) {
                preventFocus = !me.focusOnToFront;
            }
            if (!preventFocus) {
                // Kick off a delayed focus request.
                // If another floating Component is toFronted before the delay expires
                // this will not receive focus.
                me.focus(false, true);
            }
        }
        return me;
    },

    /**
     * Makes this the active Component by showing its shadow, or deactivates it by hiding its shadow.  This method also
     * fires the {@link #activate} or {@link #deactivate} event depending on which action occurred. This method is
     * called internally by {@link Ext.ZIndexManager}.
     * @param {Boolean} active True to activate the Component, false to deactivate it (defaults to false)
     */
    setActive: function(active) {
        if (active) {
            if (!this.maximized) {
                this.el.enableShadow(true);
            }
            this.fireEvent('activate', this);
        } else {
            this.el.disableShadow();
            this.fireEvent('deactivate', this);
        }
    },

    /**
     * Sends this Component to the back of (lower z-index than) any other visible windows
     * @return {Component} this
     */
    toBack: function() {
        this.zIndexManager.sendToBack(this);
        return this;
    },

    /**
     * Center this Component in its container.
     * @return {Component} this
     */
    center: function() {
        var xy = this.el.getAlignToXY(this.container, 'c-c');
        this.setPagePosition(xy);
        return this;
    },

    // private
    syncShadow : function(){
        if (this.floating) {
            this.el.sync(true);
        }
    },

    // private
    fitContainer: function() {
        var parent = this.floatParent,
            container = parent ? parent.getTargetEl() : this.container,
            size = container.getViewSize(false);
            
        this.setSize(size);
    }
});