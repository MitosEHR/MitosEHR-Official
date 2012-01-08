/**
 * Tab Panels are a great way to allow the user to switch between several pages that are all full screen. Each
 * Component in the Tab Panel gets its own Tab, which shows the Component when tapped on. Tabs can be positioned at
 * the top or the bottom of the Tab Panel, and can optionally accept title and icon configurations.
 *
 * Here's how we can set up a simple Tab Panel with tabs at the bottom. Use the controls at the top left of the example
 * to toggle between code mode and live preview mode (you can also edit the code and see your changes in the live
 * preview):
 *
 *     @example preview
 *     Ext.create('Ext.TabPanel', {
 *         fullscreen: true,
 *         tabBarPosition: 'bottom',
 *
 *         defaults: {
 *             styleHtmlContent: true
 *         },
 *
 *         items: [
 *             {
 *                 title: 'Home',
 *                 iconCls: 'home',
 *                 html: 'Home Screen'
 *             },
 *             {
 *                 title: 'Contact',
 *                 iconCls: 'user',
 *                 html: 'Contact Screen'
 *             }
 *         ]
 *     });
 * One tab was created for each of the {@link Ext.Panel panels} defined in the items array. Each tab automatically uses
 * the title and icon defined on the item configuration, and switches to that item when tapped on. We can also position
 * the tab bar at the top, which makes our Tab Panel look like this:
 *
 *     @example preview
 *     Ext.create('Ext.TabPanel', {
 *         fullscreen: true,
 *
 *         defaults: {
 *             styleHtmlContent: true
 *         },
 *
 *         items: [
 *             {
 *                 title: 'Home',
 *                 html: 'Home Screen'
 *             },
 *             {
 *                 title: 'Contact',
 *                 html: 'Contact Screen'
 *             }
 *         ]
 *     });
 *
 */
Ext.define('Ext.tab.Panel', {
    extend: 'Ext.Container',
    xtype : ['tabpanel'],
    alternateClassName: 'Ext.TabPanel',

    requires: ['Ext.tab.Bar'],

    /**
     * @cfg {Object} layout
     * @hide
     */
    config: {
        /**
         * @cfg {String} ui
         * @accessor
         */
        ui: 'dark',

        /**
         * @cfg {Object} tabBar
         * An Ext.tab.Bar configuration.
         * @accessor
         */
        tabBar: true,

        /**
         * @cfg {String} tabBarPosition
         * The docked position for the {@link #tabBar} instance
         * @accessor
         */
        tabBarPosition: 'top',

        // @inherit
        layout: {
            type: 'card',
            animation: {
                type: 'slide',
                direction: 'left'
            }
        },

        // @inherit
        cls: Ext.baseCSSPrefix + 'tabpanel'
    },

    initialize: function() {
        this.callParent();

        this.on({
            tabchange: 'doTabChange',
            delegate: '> tabbar',
            scope   : this
        });
    },

    /**
     * Updates the Ui for this component and the {@link #tabBar}.
     */
    updateUi: function(newUi, oldUi) {
        this.callParent(arguments);

        if (this.initialized) {
            this.getTabBar().setUi(newUi);
        }
    },

    /**
     * Updates the {@link #tabBar} instance with the new {@link Ext.tab.Bar#activeTab}.
     */
    doActiveItemChange: function(newCard) {
        this.callParent(arguments);
        this.getTabBar().setActiveTab(this.getInnerItems().indexOf(newCard));
    },

    /**
     * @private
     */
    doSetActiveItem: function(newActiveItem, oldActiveItem) {
        if (newActiveItem) {
            var items = this.getInnerItems(),
                oldIndex = items.indexOf(oldActiveItem),
                newIndex = items.indexOf(newActiveItem),
                reverse = oldIndex > newIndex;

            this.getLayout().getAnimation().setReverse(reverse);

            this.callParent(arguments);

            if (newIndex != -1) {
                this.getTabBar().setActiveTab(newIndex);
            }
        }
    },

    /**
     * Updates this container with the new active item.
     */
    doTabChange: function(tabBar, newTab, oldTab) {
        var index = tabBar.indexOf(newTab);
        this.setActiveItem(index);
    },

    /**
     * Creates a new {@link Ext.tab.Bar} instance using {@link Ext.Factory}.
     * @private
     */
    applyTabBar: function(config) {
        if (config === true) {
            config = {};
        }

        if (config) {
            Ext.applyIf(config, {
                ui: this.getUi(),
                docked: this.getTabBarPosition()
            });
        }

        return Ext.factory(config, Ext.tab.Bar, this.getTabBar());
    },

    /**
     * Adds the new {@link Ext.tab.Bar} instance into this container.
     * @private
     */
    updateTabBar: function(newTabBar) {
        if (newTabBar) {
            this.add(newTabBar);
            this.setTabBarPosition(newTabBar.getDocked());
        }
    },

    /**
     * Updates the docked position of the {@link #tabBar}.
     * @private
     */
    updateTabBarPosition: function(position) {
        var tabBar = this.getTabBar();
        if (tabBar) {
            tabBar.setDocked(position);
        }
    },

    // @inherit
    onItemAdd: function(card) {
        var me = this;

        if (!card.isInnerItem()) {
            return me.callParent(arguments);
        }

        var tabBar             = me.getTabBar(),
            initialConfig      = card.getInitialConfig(),
            tabConfig          = initialConfig.tab || {},
            tabTitle           = initialConfig.title,
            tabIconCls         = initialConfig.iconCls,
            tabBadgeText       = initialConfig.badgeText,
            innerItems         = me.getInnerItems(),
            index              = innerItems.indexOf(card),
            tabs               = tabBar.getItems(),
            cards              = me.getInnerItems(),
            currentTabInstance = (tabs.length >= cards.length) && tabs.getAt(index),
            tabInstance;

        if (tabTitle && !tabConfig.title) {
            tabConfig.title = tabTitle;
        }

        if (tabIconCls && !tabConfig.iconCls) {
            tabConfig.iconCls = tabIconCls;
        }

        if (tabBadgeText && !tabConfig.badgeText) {
            tabConfig.badgeText = tabBadgeText;
        }

        //<debug warn>
        if (!currentTabInstance && !tabConfig.title && !tabConfig.iconCls) {
            if (!tabConfig.title && !tabConfig.iconCls) {
                Ext.Logger.error('Adding a card to a tab container without specifying any tab configuration');
            }
        }
        //</debug>

        tabInstance = Ext.factory(tabConfig, Ext.tab.Tab, currentTabInstance);

        if (!currentTabInstance) {
            tabBar.insert(index, tabInstance);
        }

        me.callParent(arguments);
    }

//    onRemove: function(cmp, autoDestroy) {
//        // remove the tab from the tabBar
//        if (!this.destroying) {
//            this.getTabBar().remove(cmp.tab, autoDestroy);
//        }
//    },


//    applyDelay: function(config) {
//        var sortable  = this.getSortable();
//        if (sortable) {
//            sortable.setDelay(config);
//        }
//    },

//    getDelay: function() {
//        var sortable  = this.getSortable();
//        return sortable ? sortable.getDelay() : null;
//    },

//    applySortable: function(config) {
//        var me = this,
//            tabBar = me.getTabBar().setSortable(config),
//            delay = this.getDelay();
//        if (delay) {
//            this.setDelay(delay);
//        }
//        return tabBar;
//    },

//    getSortable: function(){
//        return this.getTabBar().getSortable();
//    },

    // @private
//    applyCardSwitchAnimation: function(config){
//        //return this.tabBar.cardSwitchAnimation = config;
//    },
//
//    getCardSwitchAnimation: function(){
//        //return this.tabBar.cardSwitchAnimation;
//    }
});
