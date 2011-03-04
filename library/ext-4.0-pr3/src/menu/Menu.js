/**
 * @class Ext.menu.Menu
 * @extends Ext.panel.Panel

A menu object. This is the container to which you may add {@link Ext.menu.Item menu items}.

Menus may contain either {@link Ext.menu.Item menu items}, or general {@link Ext.Component Components}.
Menus may also contain {@link Ext.AbstractPanel#dockedItems docked items} because it extends {@link Ext.panel.Panel}.

To make a contained general {@link Ext.Component Component} line up with other {@link Ext.menu.Item menu items},
specify `{@link Ext.menu.Item#iconCls iconCls}: 'no-icon'` _or_ `{@link Ext.menu.Item#indent indent}: true`.
This reserves a space for an icon, and indents the Component in line with the other menu items.
See {@link Ext.form.ComboBox}.{@link Ext.form.ComboBox#getListParent getListParent} for an example.

By default, Menus are absolutely positioned, floating Components. By configuring a Menu with `{@link #floating}:false`,
a Menu may be used as a child of a {@link Ext.container.Container Container}.

 * @xtype menu
 * @markdown
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('Ext.menu.Menu', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.menu',
    requires: [
        'Ext.layout.container.Fit',
        'Ext.layout.container.VBox',
        'Ext.menu.CheckItem',
        'Ext.menu.Item',
        'Ext.menu.KeyNav',
        'Ext.menu.MenuManager',
        'Ext.menu.Separator'
    ],
    
    /**
     * @cfg {Boolean} allowOtherMenus
     * True to allow multiple menus to be displayed at the same time. Defaults to `false`.
     * @markdown
     */
    allowOtherMenus: false,

    /**
     * @cfg {String} ariaRole @hide
     */
    ariaRole: 'menu',

    /**
     * @cfg {Boolean} autoRender @hide
     * floating is true, so autoRender always happens
     */

    /**
     * @cfg {String} defaultAlign
     * The default {@link Ext.core.Element#getAlignToXY Ext.core.Element#getAlignToXY} anchor position value for this menu
     * relative to its element of origin. Defaults to `'tl-bl?'`.
     * @markdown
     */
    defaultAlign: 'tl-bl?',

    /**
     * @cfg {Boolean} floating
     * A Menu configured as `floating: true` (the default) will be rendered as an absolutely positioned,
     * {@link Ext.Component#floating floating} {@link Ext.Component Component}. If configured as `floating: false`, the Menu may be
     * used as a child item of another {@link Ext.container.Container Container}.
     * @markdown
     */
    floating: true,

    /**
     * @cfg {Boolean} hidden
     * True to initially render the Menu as hidden, requiring to be shown manually.
     * Defaults to `true` when `floating: true`, and defaults to `false` when `floating: false`.
     * @markdown
     */
    hidden: true,

    /**
     * @cfg {Boolean} ignoreParentClicks
     * True to ignore clicks on any item in this menu that is a parent item (displays a submenu)
     * so that the submenu is not dismissed when clicking the parent item. Defaults to `false`.
     * @markdown
     */
    ignoreParentClicks: false,

    isMenu: true,
    
    /**
     * @cfg {String/Object} layout @hide
     */

    /**
     * @cfg {Number} minWidth
     * The minimum width of the Menu. Defaults to `120`.
     * @markdown
     */
    minWidth: 120,
    
    /**
     * @cfg {Boolean} plain
     * True to remove the incised line down the left side of the menu and to not
     * indent general Component items. Defaults to `false`.
     * @markdown
     */
     
    afterLayout: function() {
        var me = this;
        me.callParent(arguments);
        
        // For IE6 & IE quirks, we have to resize the el and body since position: absolute
        // floating elements inherit their parent's width, making them the width of
        // document.body instead of the width of their contents.
        //
        // For IE7, the width is sometimes collapsed, needing the same treatment.
        //
        // This includes left/right dock items.
        if ((!Ext.iStrict && Ext.isIE) || Ext.isIE6 || Ext.isIE7) {
            var newWidth = me.layout.innerCt.getWidth() + me.body.getBorderWidth('lr') + me.body.getPadding('lr'),
                dis = me.dockedItems,
                l = dis.length,
                i = 0,
                di;
            
            // First set the body to the new width
            me.body.setWidth(newWidth);
             
            // Now we calculate additional width (docked items) and set the el's width
            for (; i < l, di = dis.getAt(i); i++) {
                if (di.dock == 'left' || di.dock == 'right') {
                    newWidth += di.getWidth();
                }
            }
            me.el.setWidth(newWidth);
        }
    },

    afterRender: function(ct) {
        var me = this,
            prefix = Ext.baseCSSPrefix,
            space = '&#160;';
        
        me.callParent(arguments);
        
        me.iconSepEl = me.body.insertFirst({
            cls: prefix + 'menu-icon-separator',
            html: space
        });
        me.focusEl = me.el.createChild({
            tag: 'a',
            cls: prefix + 'menu-focus',
            href: '#',
            html: space
        });
        
        me.mon(me.el, {
            click: me.onClick,
            mouseleave: me.onMouseLeave,
            mouseover: me.onMouseOver,
            scope: me
        });
        
        if ((!Ext.isStrict && Ext.isIE) || Ext.isIE6) {
            me.iconSepEl.setHeight(me.el.getHeight());
        }
        
        me.keyNav = new Ext.menu.KeyNav(me);
    },
    
    canActivateItem: function(item) {
        return item && !item.isDisabled() && item.isVisible() && (item.canActivate || item.getXTypes().indexOf('menuitem') < 0);
    },

    deactivateActiveItem: function() {
        var me = this;
        
        if (me.activeItem) {
            me.activeItem.deactivate();
            if (!me.activeItem.activated) {
                delete me.activeItem;
            }
        }
        if (me.focusedItem) {
            me.focusedItem.blur();
            if (!me.focusedItem.$focused) {
                delete me.focusedItem;
            }
        }
    },
    
    deferDeactivateActiveItem: function() {
        var me = this;
        clearTimeout(me.deactivateActiveItemTimer);
        me.deactivateActiveItemTimer = Ext.defer(me.deactivateActiveItem, 50, me);
    },
    
    getFocusEl: function() {
        return this.focusEl;
    },

    hide: function() {
        this.deactivateActiveItem();
        this.callParent(arguments);
    },

    initComponent: function() {
        var me = this,
            prefix = Ext.baseCSSPrefix;
        
        me.addEvents(
            /**
             * @event click
             * Fires when this menu is clicked
             * @param {Ext.menu.Menu} menu The menu which has been clicked
             * @param {Ext.Component} item The menu item that was clicked. `undefined` if not applicable.
             * @param {Ext.EventObject} e The underlying {@link Ext.EventObject}.
             * @markdown
             */
            'click',
            
            /**
             * @event mouseleave
             * Fires when the mouse leaves this menu
             * @param {Ext.menu.Menu} menu The menu
             * @param {Ext.EventObject} e The underlying {@link Ext.EventObject}
             * @markdown
             */
            'mouseleave',
            
            /**
             * @event mouseover
             * Fires when the mouse is hovering over this menu
             * @param {Ext.menu.Menu} menu The menu
             * @param {Ext.Component} item The menu item that the mouse is over. `undefined` if not applicable.
             * @param {Ext.EventObject} e The underlying {@link Ext.EventObject}
             */
            'mouseover'
        );

        Ext.menu.MenuManager.register(me);

        // Menu classes
        var cls = [prefix + 'menu'];
        if (me.plain) {
            cls.push(prefix + 'menu-plain');
        }
        me.cls = cls.join(' ');
        
        // Menu body classes
        var bodyCls = me.bodyCls ? [me.bodyCls] : [];
        bodyCls.unshift(prefix + 'menu-body');
        me.bodyCls = bodyCls.join(' ');

        // Internal vbox layout, with scrolling overflow
        // Placed in initComponent (rather than prototype) in order to support dynamic layout/scroller
        // options if we wish to allow for such configurations on the Menu.
        // e.g., scrolling speed, vbox align stretch, etc.
        me.layout = {
            type: 'vbox',
            align: 'stretchmax',
            autoSize: true,
            clearInnerCtOnLayout: true/*,
            overflowHandler: {
                type: 'VerticalScroller'
            }*/
        };
        
        // hidden defaults to false if floating is configured as false
        if (me.floating === false && me.initialConfig.hidden !== true) {
            me.hidden = false;
        }

        me.callParent(arguments);
    },

    itemFromEvent: function(e) {
        return this.getChildByElement(e.getTarget());
    },

    itemFromObject: function(cmp) {
        var me = this,
            prefix = Ext.baseCSSPrefix;
        
        if (!cmp.isComponent) {
            if (!cmp.xtype) {
                cmp = new Ext.menu[(Ext.isBoolean(cmp.checked) ? 'Check': '') + 'Item'](cmp);
            } else {
                cmp = Ext.ComponentMgr.create(cmp, cmp.xtype);
            }
        }
        
        if (cmp.isMenuItem) {
            cmp.parentMenu = me;
        }
        
        // For IE6 & IE quirks, we have to give a bogus size to child components
        // so they don't inherit the bogus width of this menu. Since the menu is
        // position: absolute, it inherits the width of document.body.
        //
        // This includes left/right dock items.
        if (!cmp.isMenuItem
                && cmp.dock != 'top' && cmp.dock != 'bottom'
                && ((!Ext.isStrict && Ext.isIE) || Ext.isIE6)) {
            cmp.width = cmp.width || 1;
        }

        if (!cmp.isMenuItem && !cmp.dock) {
            var cls = [
                    prefix + 'menu-item',
                    prefix + 'menu-item-cmp'
                ],
                intercept = Ext.Function.createInterceptor;
            
            // Wrap focus/blur to control component focus
            cmp.focus = intercept(cmp.focus, function() {
                this.$focused = true;
            }, cmp);
            cmp.blur = intercept(cmp.blur, function() {
                this.$focused = false;
            }, cmp);
            
            if (!me.plain && (cmp.indent === true || cmp.iconCls === 'no-icon')) {
                cls.push(prefix + 'menu-item-indent');
            }

            if (cmp.rendered) {
                cmp.el.addCls(cls);
            } else {
                cmp.cls = (cmp.cls ? cmp.cls : '') + ' ' + cls.join(' ');
            }
            cmp.isMenuItem = true;
        }

        return cmp;
    },

    itemFromString: function(cmp) {
        return (cmp == 'separator' || cmp == '-') ?
            Ext.createWidget('menuseparator')
            : Ext.createWidget('menuitem', {
                canActivate: false,
                hideOnClick: false,
                plain: true,
                text: cmp
            });
    },

    lookupComponent: function(cmp) {
        if (Ext.isString(cmp)) {
            cmp = this.itemFromString(cmp);
        } else if (Ext.isObject(cmp)) {
            cmp = this.itemFromObject(cmp);
        }
        
        return cmp;
    },

    onClick: function(e) {
        var me = this,
            item = me.activeItem || me.itemFromEvent(e);

        if (item) {
            if (item.getXTypes().indexOf('menuitem') >= 0) {
                if (!item.menu || !me.ignoreParentClicks) {
                    item.onClick(e);
                } else {
                    e.stopEvent();
                }
            }
        }

        me.fireEvent('click', me, item, e);
    },

    onDestroy: function() {
        var me = this;
        
        clearTimeout(me.deactivateActiveItemTimer);
        
        Ext.menu.MenuManager.unregister(me);
        
        if (me.keyNav) {
            me.keyNav.destroy();
            delete me.keyNav;
        }
        
        me.callParent(arguments);
    },

    onMouseLeave: function(e) {
        var me = this;
        me.deferDeactivateActiveItem();

        me.fireEvent('mouseleave', me, e);
    },

    onMouseOver: function(e) {
        var me = this,
            item = me.itemFromEvent(e);

        if (me.parentMenu) {
            me.parentMenu.setActiveItem(me.parentItem);
        }

        if (item) {
            me.setActiveItem(item);
            if (item.activated && item.expandMenu) {
                item.expandMenu();
            }
        }

        me.fireEvent('mouseover', me, item, e);
    },

    setActiveItem: function(item) {
        var me = this;
        
        // Enforce focus on this menu for key navigation
        me.focus();
        
        clearTimeout(me.deactivateActiveItemTimer);
        
        if (item && (item != me.activeItem && item != me.focusedItem)) {
            me.deactivateActiveItem();
            if (item.activate) {
                item.activate();
                if (item.activated) {
                    me.activeItem = item;
                    me.focusedItem = item;
                }
            } else {
                item.focus();
                me.focusedItem = item;
            }
        }
    },

    /**
     * Shows the floating menu by the specified {@link Ext.Component Component} or {@link Ext.core.Element Element}.
     * @param {Mixed component} The {@link Ext.Component} or {@link Ext.core.Element} to show the menu by.
     * @param {String} position (optional) Alignment position as used by {@link Ext.core.Element#getAlignToXY Ext.core.Element.getAlignToXY}. Defaults to `{@link #defaultAlign}`.
     * @param {Array} offsets (optional) Alignment offsets as used by {@link Ext.core.Element#getAlignToXY Ext.core.Element.getAlignToXY}. Defaults to `undefined`.
     * @markdown
     */
    showBy: function(cmp, pos, off) {
        var me = this;
        
        if (me.floating && cmp) {
            me.show();

            // Component or Element
            cmp = cmp.el || cmp;

            // Convert absolute to floatParent-relative coordinates if necessary.
            var xy = me.el.getAlignToXY(cmp, pos || me.defaultAlign, off);
            if (me.floatParent) {
                var r = me.floatParent.getTargetEl().getViewRegion();
                xy[0] -= r.x;
                xy[1] -= r.y;
            }
            me.showAt(xy);
        }
    }
});
