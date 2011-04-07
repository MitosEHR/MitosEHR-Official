/**
 * @class Ext.grid.GridPanel
 * @extends Ext.panel.TablePanel
 */
Ext.define('Ext.grid.GridPanel', {
    extend: 'Ext.panel.TablePanel',
    requires: ['Ext.grid.GridView'],
    alias: ['widget.gridpanel', 'widget.grid'],
    alternateClassName: ['Ext.list.ListView', 'Ext.ListView'],
    viewType: 'gridview',
    
    lockable: false,
    
    /**
     * @cfg {Boolean} columnLines Adds column line styling
     */
    
    initComponent: function() {
        var me        = this,
            columns   = me.columns,
            columnsLn = columns.length,
            i = 0;
        
        for (; i < columnsLn; i++) {
            if (Ext.isDefined(columns[i].locked) && !columns[i].processed) {
                me.lockable = true;
                break;
            }
        }
        
        if (me.lockable) {
            me.self.mixin('lockable', Ext.grid.Lockable);
            me.injectLockable();
        }

        if (me.columnLines) {
            me.cls = (me.cls || '') + ' ' + Ext.baseCSSPrefix + 'grid-with-col-lines';
        }
        me.callParent();
    }
});