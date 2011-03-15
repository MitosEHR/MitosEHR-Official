/**
 * @class Ext.grid.HeaderDragZone
 * @extends Ext.dd.DragZone
 * @private
 */
Ext.define('Ext.grid.HeaderDragZone', {
    extend: 'Ext.dd.DragZone',
    colHeaderCls: Ext.baseCSSPrefix + 'column-header',
    maxProxyWidth: 120,
    
    constructor: function(headerCt) {
        this.headerCt = headerCt;
        this.ddGroup = 'header-dd-zone-' + headerCt.id;
        Ext.grid.HeaderDragZone.superclass.constructor.call(this, headerCt.el);
        this.proxy.el.addCls(Ext.baseCSSPrefix + 'grid-col-dd');
    },
    
    getDragData: function(e) {
        var header = e.getTarget('.'+this.colHeaderCls),
            headerCmp;
        
        if (header) {
            headerCmp = Ext.getCmp(header.id);
            if (!this.headerCt.dragging && headerCmp.draggable && !(headerCmp.isOnLeftEdge(e) || headerCmp.isOnRightEdge(e))) {
                var ddel = document.createElement('div');
                ddel.innerHTML = Ext.getCmp(header.id).text;
                return {
                    ddel: ddel,
                    header: header
                };
            }
        }
        return false;
    },
    
    onBeforeDrag: function() {
        return !this.headerCt.dragging;
    },
    
    onInitDrag: function() {
        this.headerCt.dragging = true;
        this.callParent(arguments);
    },
    
    onDragDrop: function() {
        this.headerCt.dragging = false;
        this.callParent(arguments);
    },
    
    afterRepair: function() {
        this.callParent();
        this.headerCt.dragging = false;
    }
});