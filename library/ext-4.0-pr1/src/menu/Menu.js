Ext.define('Ext.menu.Menu', {
    extend: 'Ext.container.Container',
    alias: 'widget.menu',
    requires: [
        'Ext.layout.container.Fit',
        'Ext.layout.container.VBox',
        'Ext.menu.MenuMgr',
        'Ext.menu.Item',
        'Ext.menu.CheckItem',
        'Ext.menu.Separator'
    ],
    
    allowOtherMenus: false,

    ariaRole: 'menu',

    autoRender: true,

    baseCls: Ext.baseCSSPrefix + 'menu',

    defaultAlign: 'tl-bl?',

    floating: true,

    ignoreParentClicks: false,

    isMenu: true,

    minWidth: 120,

    hidden: true,

    renderTpl: [
        '<div class="' + Ext.baseCSSPrefix + 'menu-icon-separator">&#160;</div>'
    ],

    afterRender: function(ct) {
        var me = this;
        me.callParent(arguments);

        me.mon(me.el, {
            click: me.onClick,
            mouseleave: me.onMouseLeave,
            mouseover: me.onMouseOver,
            scope: me
        });
        
        if (Ext.isBorderBox || Ext.isIE6) {
            me.iconSepEl.setHeight(me.el.getHeight());
        }
    },

    deactivateActiveItem: function() {
        var me = this;
        
        if (me.activeItem) {
            me.activeItem.deactivate();
            if (!me.activeItem.activated) {
                delete me.activeItem;
            }
        }
    },

    hide: function() {
        this.deactivateActiveItem();
        this.callParent(arguments);
    },

    initComponent: function() {
        var me = this;
        
        me.addEvents(
            'click',
            'mouseleave',
            'mouseover'
        );

        Ext.menu.MenuMgr.register(me);

        if (me.floating) {
            me.baseCls += ' ' + Ext.baseCSSPrefix + 'menu-floating';
        }

        if (me.plain) {
            me.baseCls += ' ' + Ext.baseCSSPrefix + 'menu-plain';
        }

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

        me.callParent(arguments);
    },

    itemFromEvent: function(e) {
        return this.getChildByElement(e.getTarget());
    },

    itemFromObject: function(cmp) {
        var me = this;
        
        if (!cmp.isComponent) {
            if (!cmp.xtype) {
                // this is going to create a menu item
                cmp.parentMenu = me;
                cmp = new Ext.menu[(Ext.isBoolean(cmp.checked) ? 'Check': '') + 'Item'](cmp);
            } else {
                cmp = Ext.ComponentMgr.create(cmp, cmp.xtype);
            }
        } else if (cmp.isMenuItem) {
            cmp.parentMenu = me;
        }

        if (!cmp.isMenuItem) {
            var cls = [
                    Ext.baseCSSPrefix + 'menu-item',
                    Ext.baseCSSPrefix + 'menu-item-cmp'
                ],
                indent = cmp.indent === true;
                
            cmp = Ext.createWidget('container', {
                layout: 'fit',
                items: [cmp],
                width: cmp.width || 1,
                height: cmp.height,
                style: 'height: auto;'
            });
            
            if (!me.plain && indent) {
                cls.push(Ext.baseCSSPrefix + 'menu-item-indent');
            }

            if (cmp.rendered) {
                cmp.el.addCls(cls);
            } else {
                cmp.cls = (cmp.cls ? cmp.cls: '') + ' ' + cls.join(' ');
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
            item = me.itemFromEvent(e);

        if (item) {
            if (item instanceof Ext.menu.Item) {
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
        Ext.menu.MenuMgr.unregister(this);
        this.callParent(arguments);
    },

    onMouseLeave: function(e) {
        var me = this;

        if (me.activeItem && me.activeItem.shouldDeactivate(e)) {
            me.deactivateActiveItem();
        }

        me.fireEvent('mouseleave', me, e);
    },

    onMouseOver: function(e) {
        var me = this,
            item = me.itemFromEvent(e);

        if (item) {
            me.setActiveItem(item);
        }

        if (me.parentMenu) {
            me.parentMenu.setActiveItem(me.parentItem);
        }

        me.fireEvent('mouseover', me, item, e);
    },

    onRender: function(ct, pos) {
        Ext.applyIf(this.renderSelectors, {
            iconSepEl: '.' + Ext.baseCSSPrefix + 'menu-icon-separator'
        });
        this.callParent(arguments);
    },

    setActiveItem: function(item) {
        var me = this;
        
        if (item && item != me.activeItem) {
            me.deactivateActiveItem();
            if (item.activate) {
                item.activate();
                if (item.activated) {
                    me.activeItem = item;
                }
            }
        }
    },

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