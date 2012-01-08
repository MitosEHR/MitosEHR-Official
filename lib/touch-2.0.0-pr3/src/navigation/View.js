/**
 * NavigationView is basically a {@link Ext.Container} with a {@link Ext.layout.Card card} layout, so only one view
 * can be visible at a time. However, NavigationView also adds extra functionality on top of this to allow
 * you to `push` and `pop` views at any time. When you do this, your NavigationView will automatically animate
 * between your current active view, and the new view you want to `push`, or the previous view you want to `pop`.
 *
 * Using the NavigationView is very simple. Here is a basic example of it in action:
 *
 *     var view = Ext.create('Ext.NavigationView', {
 *         fullscreen: true,
 *
 *         items: [{
 *             title: 'First',
 *             items: [{
 *                 xtype: 'button',
 *                 text: 'Push a new view!',
 *                 handler: function() {
 *                     //use the push() method to push another view. It works much like
 *                     //add() or setActiveItem(). it accepts a view instance, or you can give it
 *                     //a view config.
 *                     view.push({
 *                         title: 'Second',
 *                         html: 'Second view!'
 *                     });
 *                 }
 *             }]
 *         }]
 *     });
 *
 * Now, here comes the fun part: you can push any view/item into the NavigationView, at any time, and it will
 * automatically handle the animations between the two views, including adding a back button (if necessary)
 * and showing the new title.
 *
 *     view.push({
 *         title: 'A new view',
 *         html: 'Some new content'
 *     });
 *
 * As you can see, it is as simple as calling the {@link #method-push} method, with a new view (instance or object). Done.
 *
 * You can also `pop` a view at any time. This will remove the top-most view from the NavigationView, and animate back
 * to the previous view. You can do this using the {@link #method-pop} method (which requires no arguments).
 *
 *     view.pop();
 *
 */
Ext.define('Ext.navigation.View', {
    extend: 'Ext.Container',
    alternateClassName: 'Ext.NavigationView',
    xtype: 'navigationview',
    requires: ['Ext.navigation.Bar'],

    config: {
        /**
         * @cfg {Boolean/Object} navigationBar
         * The NavigationBar used in this navigation view. It defaults to be docked to the top.
         *
         * You can just pass in a normal object if you want to customize the NavigationBar. For example:
         *
         *     navigationBar: {
         *         ui: 'dark',
         *         docked: 'bottom'
         *     }
         *
         * If you want to add a button on the right of the NavigationBar, use the {@link #rightButton} configuration.
         *
         * There will *always* be a NavigationBar, even if you pass false. If you do pass false, it will just
         * be hidden. This means you can show/hide the NavigationBars at any time.
         * @accessor
         */
        navigationBar: {
            docked: 'top'
        },

        /**
         * @cfg {String} defaultBackButtonText
         * The text to be displayed on the back button if:
         * a) The previous view does not have a title
         * b) The {@link #useTitleForBackButtonText} configuration is true.
         * @accessor
         */
        defaultBackButtonText: 'Back',

        /**
         * @cfg {Boolean} useTitleForBackButtonText
         * Set to true if you always want to display the {@link #defaultBackButtonText} as the text
         * on the back button. False if you want to use the previous views title.
         * @accessor
         */
        useTitleForBackButtonText: false,

        /**
         * @cfg {Array/Object} items The child items to add to this NavigationView. This is usually an array of Component
         * configurations or instances, for example:
         *
         *    Ext.create('Ext.Container', {
         *        items: [
         *            {
         *                xtype: 'panel',
         *                title: 'My title',
         *                html: 'This is an item'
         *            }
         *        ]
         *    });
         *
         * If you want a title to be displayed in the {@link #navigationBar}, you must specify a `title` configuration in your
         * view, like above.
         *
         * Note: only one view will be visible at a time. If you want to change to another view, use the {@link #method-push} or
         * {@link #setActiveItem} methods.
         * @accessor
         */

        /**
         * @hide
         */
        layout: {
            type: 'card',
            // animation: false
            animation: {
                duration: 300,
                easing: 'ease-in-out',
                type: 'slide',
                direction: 'left'
            }
        }

        // @todo add rightButton configuration
    },

    /**
     * @event push
     * Fires when a view is pushed into this navigation view
     * @param {Ext.navigation.View} this The component instance
     * @param {Mixed} view The view that has been pushed
     */

    /**
     * @event pop
     * Fires when a view is popped from this navigation view
     * @param {Ext.navigation.View} this The component instance
     * @param {Mixed} view The view that has been popped
     */

    /**
     * A stack array of all views in this navigation view.
     * @cfg {Array} stack
     * @private
     */

    /**
     * True of we are popping a view from the NavigationView
     * @cfg {Boolean} popping
     * @private
     */

    // @private
    initialize: function() {
        this.stack = [];

        this.callParent();
        //add a listener onto the back button in the navigationbar
        this.on({
            delegate: 'navigationbar button[ui=back]',

            tap: this.pop
        });
    },

    /**
     * Pushes a new view into this navigation view.
     * Convience method for {@link #setActiveItem}
     * @param {Object} view The view to push
     * @return {Object} The new item you just pushed
     */
    push: function(view) {
        if (!this.canPush()) {
            return;
        }

        this.fireEvent('push', this, view);

        this.popping = false;

        return this.setActiveItem(view);
    },

    /**
     * Removes the current active view from the stack and animates to the previous view.
     */
    pop: function() {
        var me = this,
            animation = me.getLayout().getAnimation();

        if (!this.canPop()) {
            return;
        }

        //reverse the animation
        if (animation && animation.isAnimation) {
            animation.setReverse(true);
        }

        me.fireEvent('pop', this, me.getActiveItem());

        //remove the last item in the stack
        me.stack.pop();

        //set the new active item to be the new last item of the stack
        me.popping = true;
        me.setActiveItem(me.stack[me.stack.length - 1]);
        me.popping = false;

        //unreverse the animation
        if (animation && animation.isAnimation) {
            animation.setReverse(false);
        }
    },

    /**
     * Simply returns true if this navigation view can purrently push a new item.
     * @return {Boolean} True if you can push
     */
    canPush: function() {
        var navigationBar = this.getNavigationBar();

        if (navigationBar && navigationBar.animating) {
            return false;
        }

        return true;
    },

    /**
     * Simply returns true if this navigation view can currently pop and item. False if there is only one view
     * in the stack.
     * @return {Boolean} True if you can pop
     */
    canPop: function() {
        var canPop = this.stack.length > 1,
            navigationBar = this.getNavigationBar();

        if (navigationBar && navigationBar.animating) {
            return false;
        }

        //<debug>
        if (!canPop) {
            Ext.Logger.warn('Ext.navigation.View#pop: Trying to pop a view, but there are no views to pop.');
        }
        //</debug>

        return canPop;
    },

    /**
     * Returns the previous item, if one exists.
     * @return {Mixed} The previous view
     */
    getPreviousItem: function() {
        var stack = this.stack;
        return stack[stack.length - 1];
    },

    /**
     * Updates the backbutton text accordingly in the {@link #navigationBar}
     * @private
     */
    updateUseTitleForBackButtonText: function(useTitleForBackButtonText) {
        var navigationBar = this.getNavigationBar();
        if (navigationBar) {
            navigationBar.setUseTitleForBackButtonText(useTitleForBackButtonText);
        }
    },

    // @private
    applyNavigationBar: function(config) {
        if (!config) {
            config = {
                hidden: false,
                docked: 'top'
            };
        }

        return Ext.factory(config, Ext.navigation.Bar, this.getNavigationBar());
    },

    // @private
    updateNavigationBar: function(newNavigationBar, oldNavigationBar) {
        if (oldNavigationBar) {
            this.remove(oldNavigationBar);
        }

        if (newNavigationBar) {
            newNavigationBar.setAnimationDuration(this.getAnimationDuration());
            this.add(newNavigationBar);
        }
    },

    getAnimationDuration: function() {
        var initialConfig = this.getInitialConfig(),
            layout = initialConfig.layout,
            animationDuration = (layout && layout.animation && layout.animation.duration) ? layout.animation.duration : 0;

        return animationDuration;
    },

    // @private
    doSetActiveItem: function(activeItem, oldActiveItem) {
        var me = this,
            navigationBar = me.getNavigationBar(),
            stack = me.stack,
            layout = me.getLayout(),
            animation = layout.getAnimation() && layout.getAnimation().isAnimation,
            pushFn = (animation) ? 'pushAnimated' : 'push',
            popFn = (animation) ? 'popAnimated' : 'pop';

        if (!activeItem) {
            return;
        }

        //if we are not popping a view, then add it to the stack
        if (!me.popping) {
            stack.push(activeItem);
        }

        if (navigationBar) {
            //if there is a previous item in the stack, then we must show the backbutton
            //else we should just hide it
            if (stack.length > 1) {
                if (me.popping) {
                    navigationBar[popFn](activeItem.title);
                } else {
                    navigationBar[pushFn](activeItem.title);
                }
            } else {
                if (me.isPainted()) {
                    navigationBar[popFn](activeItem.title);
                } else {
                    navigationBar.setTitle(activeItem.title);
                }
            }
        }

        me.callParent(arguments);
    }
});
