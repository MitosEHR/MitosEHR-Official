/**
 * @class Ext.grid.HeaderReorderer
 * @extends Ext.util.Observable
 * @private
 */
Ext.define('Ext.grid.HeaderReorderer', {
    extend: 'Ext.util.Observable',
    requires: ['Ext.grid.HeaderDragZone', 'Ext.grid.HeaderDropZone'],
    alias: 'plugin.gridheaderreorderer',
    
    init: function(headerCt) {
        this.headerCt = headerCt;
        headerCt.on('render', this.onHeaderCtRender, this);
    },
    onHeaderCtRender: function() {
        this.dragZone = new Ext.grid.HeaderDragZone(this.headerCt);
        this.dropZone = new Ext.grid.HeaderDropZone(this.headerCt);
    }
});