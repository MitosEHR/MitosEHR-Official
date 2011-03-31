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
    
    /**
     * @cfg {Boolean} columnLines Adds column line styling
     */
    
    initComponent: function() {
        var me = this;
        if (me.columnLines) {
            me.cls = (me.cls || '') + ' ' + Ext.baseCSSPrefix + 'grid-with-col-lines';
        }
        me.callParent();
    }
});