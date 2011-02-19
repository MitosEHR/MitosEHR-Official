/**
 * @class Ext.menu.Separator
 * @extends Ext.menu.Item
 * Adds a separator bar to a menu, used to divide logical groups of menu items. Generally you will
 * add one of these by using "-" in your call to add() or in your items config rather than creating one directly.
 * @constructor
 * @param {Object} config Configuration options
 * @xtype menuseparator
 */
Ext.define('Ext.menu.Separator', {
    extend: 'Ext.menu.Item',
    alias: 'widget.menuseparator',
    
    canActivate: false,
    
    hideOnClick: false,
    
    plain: true,
    
    text: '&#160;',
    
    onRender: function(ct, pos) {
        var me = this,
            sepCls = Ext.baseCSSPrefix + 'menu-item-separator';
            
        me.baseCls += ' ' + sepCls;
        
        Ext.applyIf(me.renderSelectors, {
            itemSepEl: '.' + sepCls
        });
        
        me.callParent(arguments);
    }
});