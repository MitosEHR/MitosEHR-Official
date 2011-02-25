/**
 *  @class Ext.menu.KeyNav
 */
Ext.define('Ext.menu.KeyNav', {
    extend: 'Ext.util.KeyNav',
    
    constructor: function(menu) {
        var me = this;
        me.menu = menu;
        
        var config = {
            down: me.down,
            enter: me.enter,
            esc: me.escape,
            left: me.left,
            right: me.right,
            space: me.enter,
            tab: me.tab,
            up: me.up
        };
        
        me.callParent([menu.el, config]);
    },
    
    down: function(e) {
        this.focusNextItem(1);
    },
    
    enter: function(e) {
        var menu = this.menu;
        
        if (menu.activeItem) {
            menu.onClick(e);
        }
    },
    
    escape: function(e) {
        Ext.menu.MenuManager.hideAll();
    },
    
    focusNextItem: function(step) {
        var menu = this.menu,
            items = menu.items,
            focusedItem = menu.focusedItem,
            startIdx = focusedItem ? items.indexOf(focusedItem) : -1,
            idx = startIdx + step;
            
        while (idx != startIdx) {
            if (idx < 0) {
                idx = items.length - 1;
            } else if (idx >= items.length) {
                idx = 0;
            }
            
            var item = items.getAt(idx);
            if (menu.canActivateItem(item)) {
                menu.setActiveItem(item);
                break;
            }
            idx += step;
        }
    },
    
    left: function(e) {
        var menu = this.menu;
        
        menu.hide();
        if (menu.parentMenu) {
            menu.parentMenu.focus();
        }
    },
    
    right: function(e) {
        var menu = this.menu,
            ai = menu.activeItem;
        
        if (ai) {
            var am = menu.activeItem.menu;
            if (am) {
                ai.expandMenu(0);
                am.setActiveItem(am.items.getAt(0));
            }
        }
    },
    
    tab: function(e) {
        var me = this;
        
        e.stopEvent();
        if (e.shiftKey) {
            me.up(e);
        } else {
            me.down(e);
        }
    },
    
    up: function(e) {
        this.focusNextItem(-1);
    }
});