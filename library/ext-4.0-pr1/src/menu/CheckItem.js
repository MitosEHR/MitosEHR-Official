/**
 * @class Ext.menu.CheckItem
 * @extends Ext.menu.Item
 */

Ext.define('Ext.menu.CheckItem', {
    extend: 'Ext.menu.Item',
    alias: 'widget.menucheckitem',

    checkedCls: Ext.baseCSSPrefix + 'menu-item-checked',
    
    groupCls: Ext.baseCSSPrefix + 'menu-group-item',
    
    hideOnClick: false,
    
    uncheckedCls: Ext.baseCSSPrefix + 'menu-item-unchecked',
    
    afterRender: function() {
        var me = this;
        Ext.menu.CheckItem.superclass.afterRender.call(me);
        me.checked = !me.checked;
        me.setChecked(!me.checked, true);
    },
    
    initComponent: function() {
        var me = this;
        me.addEvents(
            /**
             * @event beforecheckchange
             * Fires before a change event. Return false to cancel.
             * @param {Ext.menu.CheckItem} this
             * @param {Boolean} checked
             */
            'beforecheckchange',
            
            /**
             * @event beforecheckchange
             * Fires after a change event.
             * @param {Ext.menu.CheckItem} this
             * @param {Boolean} checked
             */
            'checkchange'
        );
        
        Ext.menu.MenuMgr.registerCheckable(me);
        
        if (me.group) {
            me.baseCls += ' ' + me.groupCls;
            if (me.initialConfig.hideOnClick !== false) {
                me.hideOnClick = true;
            }
        }
        
        Ext.menu.CheckItem.superclass.initComponent.call(me);
        
        if (me.checkHandler) {
            me.on('checkchange', me.checkHandler, me.scope);
        }
    },
    
    onClick: function(e) {
        var me = this;
        if(!me.disabled && !(me.checked && me.group)) {
            me.setChecked(!me.checked);
        }
        Ext.menu.CheckItem.superclass.onClick.call(me, e);
    },
    
    onDestroy: function() {
        Ext.menu.MenuMgr.unregisterCheckable(this);
        Ext.menu.CheckItem.superclass.onDestroy.call(this);
    },
    
    setChecked: function(checked, suppressEvents) {
        var me = this;
        if (me.checked !== checked && (suppressEvents || me.fireEvent('beforecheckchange', me, checked) !== false)) {
            me.setIconClass(me[(checked ? '' : 'un') + 'checkedCls']);
            me.checked = checked;
            
            Ext.menu.MenuMgr.onCheckChange(me, checked);
            if (!suppressEvents) {
                me.fireEvent('checkchange', me, checked);
            }
        }
    }
});