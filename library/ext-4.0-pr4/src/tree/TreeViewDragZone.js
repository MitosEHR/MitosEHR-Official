Ext.define('Ext.tree.TreeViewDragZone', {
    extend: 'Ext.view.DragZone',
    
    isPreventDrag: function(e) {
        return !!e.getTarget(this.view.expanderSelector);
    }
});