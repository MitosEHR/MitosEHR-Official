/**
 * @class Ext.layout.container.AbstractCard
 * @extends Ext.layout.container.Fit
 * <p>This layout manages multiple child Components, each is fit to the Container, where only a single child Component
 * can be visible at any given time.  This layout style is most commonly used for wizards, tab implementations, etc.
 * This class is intended to be extended or created via the layout:'card' {@link Ext.container.Container#layout} config,
 * and should generally not need to be created directly via the new keyword.</p>
 * <p>The CardLayout's focal method is {@link #setActiveItem}.  Since only one panel is displayed at a time,
 * the only way to move from one Component to the next is by calling setActiveItem, passing the id or index of
 * the next panel to display.  The layout itself does not provide a user interface for handling this navigation,
 * so that functionality must be provided by the developer.</p>
 * <p>Containers that are configured with a card layout will have a method setActiveItem dynamically added to it. 
 * <pre><code>
      var p = new Ext.panel.Panel({
          fullscreen: true,
          layout: 'card',
          items: [{
              html: 'Card 1'
          },{
              html: 'Card 2'
          }]
      });
      p.setActiveItem(1);
   </code></pre>
 * </p>
 */

Ext.define('Ext.layout.container.AbstractCard', {

    /* Begin Definitions */

    extend: 'Ext.layout.container.Fit',

    /* End Definitions */

    type: 'card',

    sizeAllCards: false,
    hideInactive: true,

    beforeLayout: function() {
        this.activeItem = this.getActiveItem();
        return Ext.layout.container.AbstractCard.superclass.beforeLayout.apply(this, arguments);
    },

    onLayout: function() {
        var me = this,
            activeItem = me.activeItem,
            items = me.getVisibleItems(),
            ln = items.length,
            targetBox = me.getTargetBox(),
            i, item;

        for (i = 0; i < ln; i++) {
            item = items[i];
            me.setItemBox(item, targetBox);
        }

        if (!me.firstActivated && activeItem) {
            if (activeItem.fireEvent('beforeactivate', activeItem) !== false) {
                activeItem.fireEvent('activate', activeItem);
            }
            me.firstActivated = true;
        }
    },

    /**
     * Return the active (visible) component in the layout.
     * @returns {Ext.Component}
     */
    getActiveItem: function() {
        var me = this;
        if (!me.activeItem && me.owner) {
            me.activeItem = me.parseActiveItem(me.owner.activeItem);
        }

        if (me.activeItem && me.owner.items.indexOf(me.activeItem) != -1) {
            return me.activeItem;
        }

        return null;
    },

    // @private
    parseActiveItem: function(item) {
        if (item && item.isComponent) {
            return item;
        }
        else if (typeof item == 'number' || item == undefined) {
            return this.getLayoutItems()[item || 0];
        }
        else {
            return this.owner.getComponent(item);
        }
    },

    // @private
    configureItem: function(item, position) {
        Ext.layout.container.AbstractCard.superclass.configureItem.call(this, item, position);
        if (this.hideInactive && this.activeItem !== item) {
            item.hide();
        }
        else {
            item.show();
        }
    },

    onRemove: function(component) {
        if (component === this.activeItem) {
            this.activeItem = null;
            if (this.owner.items.getCount() == 0) {
                this.firstActivated = false;
            }
        }
    },

    // @private
    getAnimation: function(newCard, owner) {
        var newAnim = (newCard || {}).cardSwitchAnimation;
        if (newAnim === false) {
            return false;
        }
        return newAnim || owner.cardSwitchAnimation;
    },

    /**
     * Return the active (visible) component in the layout to the next card, optional wrap parameter to wrap to the first
     * card when the end of the stack is reached.
     * @param {boolean} wrap Wrap to the first card when the end of the stack is reached.
     * @returns {Ext.Component}
     */
    getNext: function(wrap) {
        var items = this.getLayoutItems(),
            index = Ext.Array.indexOf(items, this.activeItem);
        return items[index + 1] || (wrap ? items[0] : false);
    },

    /**
     * Sets the active (visible) component in the layout to the next card, optional wrap parameter to wrap to the first
     * card when the end of the stack is reached.
     * @param {Mixed} anim Animation to use for the card transition
     * @param {boolean} wrap Wrap to the first card when the end of the stack is reached.
     */
    next: function(anim, wrap) {
        return this.setActiveItem(this.getNext(wrap), anim);
    },

    /**
     * Return the active (visible) component in the layout to the previous card, optional wrap parameter to wrap to
     * the last card when the beginning of the stack is reached.
     * @param {boolean} wrap Wrap to the first card when the end of the stack is reached.
     * @returns {Ext.Component}
     */
    getPrev: function(wrap) {
        var items = this.getLayoutItems(),
            index = Ext.Array.indexOf(items, this.activeItem);
        return items[index - 1] || (wrap ? items[items.length - 1] : false);
    },

    /**
     * Sets the active (visible) component in the layout to the previous card, optional wrap parameter to wrap to
     * the last card when the beginning of the stack is reached.
     * @param {Mixed} anim Animation to use for the card transition
     * @param {boolean} wrap Wrap to the first card when the end of the stack is reached.
     */
    prev: function(anim, wrap) {
        return this.setActiveItem(this.getPrev(wrap), anim);
    }
});