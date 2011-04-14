/**
 * @class Ext.grid.Section
 * @extends Ext.panel.Panel
 *
 * Section of a Grid. Headers are docked in this area and this class
 * synchronizes the viewable area and headers.
 *
 * Locked Sections
 * - cannot flex headers.
 * - must have a fixed width
 *
 * Virtualized (non locked) or Scrollable Sections must be synchronized vertically.
 *
 * Sections can resize based off of header size/visibility changes.
 *
 * Templates can become dirty based off of visibility changes.
 * @xtype gridsection
 */

Ext.define('Ext.grid.Section', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Ext.grid.View',
        'Ext.grid.header.Container'
    ],
    alias: 'widget.gridsection',

    layout: 'fit',
    cls: Ext.baseCSSPrefix + 'grid-section',
    isGridSection: true,
    scroll: true,
    border: false,
    

    extraBodyCls: Ext.baseCSSPrefix + 'grid-body',
    

    
    
    /**
     * Boolean to indicate that GridView has been injected into this Grid Section.
     * @property hasGridView
     */
    hasGridView: false,
    
    // TODO: Rename headers -> columns
    
    initComponent: function() {
        var me         = this,
            scroll     = me.scroll,
            vertical   = false,
            horizontal = false;
            
        // turn both on.
        if (scroll === true || scroll === 'both') {
            vertical = horizontal = true;
        } else if (scroll === 'horizontal') {
            horizontal = true;
        } else if (scroll === 'vertical') {
            vertical = true;
        }
        // All other values become 'none' or false.
        
        
        if (vertical) {
            me.verticalScroller = Ext.ComponentManager.create({
                dock: me.verticalScrollDock,
                xtype: 'gridscroller'
            });
        }
        
        if (horizontal) {
            me.horizontalScroller = Ext.ComponentManager.create({
                xtype: 'gridscroller',
                section: me,
                dock: 'bottom'
            });
        }
        
        me.callParent();
    }
});
