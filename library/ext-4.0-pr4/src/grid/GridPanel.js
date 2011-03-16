/**
 * @class Ext.grid.GridPanel
 * @extends Ext.panel.TablePanel
 */
Ext.define('Ext.grid.GridPanel', {
    extend: 'Ext.panel.TablePanel',
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
        
        // <debug>
        // if (me.autoExpandColumn) {
        //     console.warn("Ext.grid.GridPanel: autoExpandColumn has been removed in favor of flexible headers.");
        // }
        // if (me.trackMouseOver) {
        //     console.warn('Ext.grid.GridPanel: trackMouseOver has been removed in favor of the trackOver configuration inherited from DataView. Pass in viewConfig: {trackOver: false}');
        // }
        // </debug>
        me.callParent();
    }
});