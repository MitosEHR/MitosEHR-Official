/**
 * @class Ext.tree.TreeViewDDPlugin
 * @extends Ext.AbstractPlugin
 */
Ext.define('Ext.tree.TreeViewDDPlugin', {
    extend: 'Ext.AbstractPlugin',
    alias: 'plugin.treeviewdd',
    
    requires: [
        'Ext.tree.TreeViewDragZone',
        'Ext.tree.TreeViewDropZone'
    ],
    
    dragText : '{0} selected node{1}',

    /**
     * @cfg {Boolean} allowParentInsert
     * Allow inserting a dragged node between an expanded parent node and its first child that will become a
     * sibling of the parent when dropped (defaults to false)
     */
    allowParentInserts: false,
    
    /**
     * @cfg {String} allowContainerDrop
     * True if drops on the tree container (outside of a specific tree node) are allowed (defaults to false)
     */
    allowContainerDrops: false,
    
    /**
     * @cfg {String} appendOnly
     * True if the tree should only allow append drops (use for trees which are sorted, defaults to false)
     */
    appendOnly: false,

    /**
     * @cfg {String} ddGroup
     * A named drag drop group to which this object belongs.  If a group is specified, then this object will only
     * interact with other drag drop objects in the same group (defaults to 'TreeDD').
     */
    ddGroup : "TreeDD",

    /**
     * @cfg {String} expandDelay
     * The delay in milliseconds to wait before expanding a target tree node while dragging a droppable node
     * over the target (defaults to 1000)
     */
    expandDelay : 1000,
        
    init : function(view) {
        view.on('render', this.onViewRender, this);
    },
    
    onViewRender : function(view) {
        this.dragZone = Ext.create('Ext.tree.TreeViewDragZone', {
            view: view,
            dragText: this.dragText
        });

        this.dropZone = Ext.create('Ext.tree.TreeViewDropZone', {
            view: view,
            allowContainerDrops: this.allowContainerDrops,
            appendOnly: this.appendOnly,
            allowParentInserts: this.allowParentInserts,
            expandDelay: this.expandDelay
        });
    }
});