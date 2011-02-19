/**
 * @class Ext.layout.container.boxOverflow.Menu
 * @extends Ext.layout.container.boxOverflow.None
 * @private
 */
Ext.define('Ext.layout.container.boxOverflow.Menu', {

    /* Begin Definitions */

    extend: 'Ext.layout.container.boxOverflow.None',

    requires: ['Ext.toolbar.Separator', 'Ext.button.Button'],

    /* End Definitions */

    /**
     * @cfg afterCls
     * @type String
     * CSS class added to the afterCt element. This is the element that holds any special items such as scrollers,
     * which must always be present at the rightmost edge of the Container
     */
    afterCls: Ext.baseCSSPrefix + 'strip-right',
    
    /**
     * @property noItemsMenuText
     * @type String
     * HTML fragment to render into the toolbar overflow menu if there are no items to display
     */
    noItemsMenuText : '<div class="' + Ext.baseCSSPrefix + 'toolbar-no-items">(None)</div>',
    
    constructor: function(layout) {
        Ext.layout.container.boxOverflow.Menu.superclass.constructor.apply(this, arguments);
        
        /**
         * @property menuItems
         * @type Array
         * Array of all items that are currently hidden and should go into the dropdown menu
         */
        this.menuItems = [];
    },
    
    /**
     * @private
     * Creates the beforeCt, innerCt and afterCt elements if they have not already been created
     * @param {Ext.container.Container} container The Container attached to this Layout instance
     * @param {Ext.core.Element} target The target Element
     */
    createInnerElements: function() {
        if (!this.afterCt) {
            this.afterCt  = this.layout.innerCt.insertSibling({cls: this.afterCls},  'before');
        }
    },
    
    /**
     * @private
     */
    clearOverflow: function(calculations, targetSize) {
        var newWidth = targetSize.width + (this.afterCt ? this.afterCt.getWidth() : 0),
            items    = this.menuItems;
        
        this.hideTrigger();
        
        for (var index = 0, length = items.length; index < length; index++) {
            items.pop().component.show();
        }
        
        return {
            targetSize: {
                height: targetSize.height,
                width : newWidth
            }
        };
    },
    
    /**
     * @private
     */
    showTrigger: function() {
        this.createMenu();
        this.menuTrigger.show();
    },
    
    /**
     * @private
     */
    hideTrigger: function() {
        if (this.menuTrigger != undefined) {
            this.menuTrigger.hide();
        }
    },
    
    /**
     * @private
     * Called before the overflow menu is shown. This constructs the menu's items, caching them for as long as it can.
     */
    beforeMenuShow: function(menu) {
        var items = this.menuItems,
            len   = items.length,
            item,
            prev;

        var needsSep = function(group, item){
            return group.isXType('buttongroup') && !(item instanceof Ext.toolbar.Separator);
        };
        
        this.clearMenu();
        menu.removeAll();
        
        for (var i = 0; i < len; i++) {
            item = items[i].component;
            
            if (prev && (needsSep(item, prev) || needsSep(prev, item))) {
                menu.add('-');
            }
            
            this.addComponentToMenu(menu, item);
            prev = item;
        }

        // put something so the menu isn't empty if no compatible items found
        if (menu.items.length < 1) {
            menu.add(this.noItemsMenuText);
        }
    },
    
    /**
     * @private
     * Returns a menu config for a given component. This config is used to create a menu item
     * to be added to the expander menu
     * @param {Ext.Component} component The component to create the config for
     * @param {Boolean} hideOnClick Passed through to the menu item
     */
    createMenuConfig : function(component, hideOnClick){
        var config = Ext.apply({}, component.initialConfig),
            group  = component.toggleGroup;

        Ext.copyTo(config, component, [
            'iconCls', 'icon', 'itemId', 'disabled', 'handler', 'scope', 'menu'
        ]);

        Ext.apply(config, {
            text       : component.overflowText || component.text,
            hideOnClick: hideOnClick
        });

        if (group || component.enableToggle) {
            Ext.apply(config, {
                group  : group,
                checked: component.pressed,
                listeners: {
                    checkchange: function(item, checked){
                        component.toggle(checked);
                    }
                }
            });
        }

        delete config.ownerCt;
        delete config.xtype;
        delete config.id;

        return config;
    },

    /**
     * @private
     * Adds the given Toolbar item to the given menu. Buttons inside a buttongroup are added individually.
     * @param {Ext.menu.Menu} menu The menu to add to
     * @param {Ext.Component} component The component to add
     */
    addComponentToMenu : function(menu, component) {
        if (component instanceof Ext.toolbar.Separator) {
            menu.add('-');

        } else if (Ext.isFunction(component.isXType)) {
            if (component.isXType('splitbutton')) {
                menu.add(this.createMenuConfig(component, true));

            } else if (component.isXType('button')) {
                menu.add(this.createMenuConfig(component, !component.menu));

            } else if (component.isXType('buttongroup')) {
                component.items.each(function(item){
                     this.addComponentToMenu(menu, item);
                }, this);
            }
        }
    },
    
    /**
     * @private
     * Deletes the sub-menu of each item in the expander menu. Submenus are created for items such as
     * splitbuttons and buttongroups, where the Toolbar item cannot be represented by a single menu item
     */
    clearMenu : function(){
        var menu = this.moreMenu;
        if (menu && menu.items) {
            menu.items.each(function(item){
                delete item.menu;
            });
        }
    },
    
    /**
     * @private
     * Creates the overflow trigger and menu used when enableOverflow is set to true and the items
     * in the layout are too wide to fit in the space available
     */
    createMenu: function() {
        if (!this.menuTrigger) {
            this.createInnerElements();
            
            /**
             * @private
             * @property menu
             * @type Ext.menu.Menu
             * The expand menu - holds items for every item that cannot be shown
             * because the container is currently not large enough.
             */
            this.menu = new Ext.menu.Menu({
                ownerCt : this.layout.container,
                listeners: {
                    scope: this,
                    beforeshow: this.beforeMenuShow
                }
            });

            /**
             * @private
             * @property menuTrigger
             * @type Ext.button.Button
             * The expand button which triggers the overflow menu to be shown
             */
            this.menuTrigger = new Ext.button.Button({
                iconCls : Ext.baseCSSPrefix + 'toolbar-more-icon',
                cls     : Ext.baseCSSPrefix + 'toolbar-more',
                menu    : this.menu,
                renderTo: this.afterCt
            });
        }
    },
    
    /**
     * @private
     */
    destroy: function() {
        Ext.destroy(this.menu, this.menuTrigger);
    }
});