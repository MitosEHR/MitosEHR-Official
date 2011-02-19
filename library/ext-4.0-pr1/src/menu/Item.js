Ext.define('Ext.menu.Item', {
    extend: 'Ext.Component',
    alias: 'widget.menuitem',
    alternateClassName: 'Ext.menu.TextItem',

    activeCls: Ext.baseCSSPrefix + 'menu-item-active',
    
    ariaRole: 'menuitem',
    
    baseCls: Ext.baseCSSPrefix + 'menu-item',
    
    canActivate: true,
    
    clickHideDelay: 1,
    
    destroyMenu: true,
    
    disabledCls: Ext.baseCSSPrefix + 'menu-item-disabled',
    
    hideOnClick: true,
    
    isMenuItem: true,
    
    menuAlign: 'tl-tr?',
    
    menuExpandDelay: 200,
    
    menuHideDelay: 200,
    
    renderTpl: [
        '<tpl if="plain">',
            '{text}',
        '</tpl>',
        '<tpl if="!plain">',
            '<a class="' + Ext.baseCSSPrefix + 'menu-item-link" href="{href}" <tpl if="hrefTarget">target="{hrefTarget}"</tpl> hidefocus="true" unselectable="on">',
                '<img src="{icon}" class="' + Ext.baseCSSPrefix + 'menu-item-icon {iconCls}" />',
                '<span class="' + Ext.baseCSSPrefix + 'menu-item-text" <tpl if="menu">style="margin-right: 17px;"</tpl> >{text}</span>',
                '<tpl if="menu">',
                    '<img src="' + Ext.BLANK_IMAGE_URL + '" class="' + Ext.baseCSSPrefix + 'menu-item-arrow" />',
                '</tpl>',
            '</a>',
        '</tpl>'
    ],
    
    activate: function() {
        var me = this;
        
        if (!me.activated && me.canActivate && me.rendered && !me.disabled) {
            me.el.addCls(me.activeCls);
            if (me.focus) {
                me.focus();
            }
            me.expandMenu();
            me.activated = true;
            
            me.fireEvent('activate', me);
        }
    },
    
    deactivate: function() {
        var me = this;
        
        if (me.activated) {
            me.el.removeCls(me.activeCls);
            if (me.blur) {
                me.blur();
            }
            me.hideMenu();
            me.activated = false;
            
            me.fireEvent('deactivate', this);
        }
    },
    
    deferExpandMenu: function() {
        var me = this;
        
        if (!me.menu.rendered || !me.menu.isVisible()) {
            me.parentMenu.activeChild = me.menu;
            me.menu.showBy(me, me.menuAlign);
        }
    },
    
    deferHideMenu: function() {
        if (this.menu.isVisible()) {
            this.menu.hide();
        }
    },
    
    deferHideParentMenus: function() {
        Ext.menu.MenuMgr.hideAll();
    },
    
    expandMenu: function() {
        var me = this;
        
        if (me.menu) {
            if (me.hideMenuTimer) {
                clearTimeout(me.hideMenuTimer);
            }
            me.expandMenuTimer = Ext.defer(me.deferExpandMenu, me.menuExpandDelay, me);
        }
    },
    
    hideMenu: function() {
        var me = this;
        
        if (me.menu) {
            if (me.expandMenuTimer) {
                clearTimeout(me.expandMenuTimer);
            }
            me.hideMenuTimer = Ext.defer(me.deferHideMenu, me.menuHideDelay, me);
        }
    },
    
    initComponent: function() {
        var me = this;
        
        me.addEvents(
            'activate',
            
            'click',
            
            'deactivate'
        );
        
        if (me.plain) {
            me.baseCls += ' ' + Ext.baseCSSPrefix + 'menu-item-plain';
        }
        
        if (me.menu) {
            me.menu = Ext.menu.MenuMgr.get(me.menu);
            me.menu.parentItem = me;
            me.menu.parentMenu = me.menu.ownerCt = me.parentMenu;
        }
        
        me.callParent(arguments);
    },
    
    onClick: function(e) {
        var me = this;
        
        if (!me.href) {
            e.stopEvent();
        }
        
        if (me.disabled) {
            return;
        }
        
        if (me.hideOnClick) {
            me.deferHideParentMenusTimer = Ext.defer(me.deferHideParentMenus, me.clickHideDelay, me);
        }
        
        Ext.callback(me.handler, me.scope || me, [me, e]);
        me.fireEvent('click', me, e);
    },
    
    onDestroy: function() {
        var me = this;
        
        clearTimeout(me.expandMenuTimer);
        clearTimeout(me.hideMenuTimer);
        clearTimeout(me.deferHideParentMenusTimer);
        
        if (me.menu) {
            delete me.menu.ownerCt;
            if (me.destroyMenu !== false) {
                me.menu.destroy();
            }
        }
        me.callParent(arguments);
    },
    
    onDisable: function(v) {
        this.onDisableChange(true);
    },
    
    onDisableChange: function(disabled) {
        var me = this,
            cls = me.disabledCls;
            
        if (me.rendered) {
            if (disabled) {
                me.el.addCls(cls);
            } else {
                me.el.removeCls(cls);
            }
        }
    },
    
    onEnable: function() {
        this.onDisableChange(false);
    },
    
    onRender: function(ct, pos) {
        var me = this;
        
        Ext.applyIf(me.renderData, {
            href: me.href || '#',
            hrefTarget: me.hrefTarget,
            icon: me.icon || Ext.BLANK_IMAGE_URL,
            iconCls: me.iconCls,
            menu: Ext.isDefined(me.menu),
            plain: me.plain,
            text: me.text
        });
        
        Ext.applyIf(me.renderSelectors, {
            itemEl: '.' + Ext.baseCSSPrefix + 'menu-item-link',
            iconEl: '.' + Ext.baseCSSPrefix + 'menu-item-icon',
            textEl: '.' + Ext.baseCSSPrefix + 'menu-item-text',
            arrowEl: '.' + Ext.baseCSSPrefix + 'menu-item-arrow'
        });
        
        me.callParent(arguments);
    },
    
    // private
    getRefItems: function(deep){
        var menu = this.menu,
            items;
        
        if (menu) {
            items = menu.getRefItems(deep);
            items.unshift(menu);
        }   
        return items || [];   
    },
    
    shouldDeactivate: function(e) {
        var menu = this.menu;
        if (menu && menu.rendered && menu.isVisible()) {
            return !e.within(menu.el, true, true);
        }
        
        return true;
    },
    
    setHandler: function(fn, scope) {
        this.handler = fn || null;
        this.scope = scope;
    },
    
    setIconClass: function(iconCls) {
        var me = this;
        
        if (me.iconEl) {
            if (me.iconCls) {
                me.iconEl.removeCls(me.iconCls);
            }
            
            if (iconCls) {
                me.iconEl.addCls(iconCls);
            }
        }
        
        me.iconCls = iconCls;
    },
    
    setText: function(text) {
        var me = this,
            el = me.textEl || me.el,
            newWidth;
        
        if (text && el) {
            el.update(text);
                
            if (me.textEl) {
                // Resize the menu to fit the text
                newWidth = me.textEl.getWidth() + me.iconEl.getWidth() + 25 + (me.arrowEl ? me.arrowEl.getWidth() : 0);
                if (newWidth > me.itemEl.getWidth()) {
                    me.parentMenu.setWidth(newWidth);
                }
            }
        } else if (el) {
            el.update('');
        }
        
        me.text = text;
    }
});
