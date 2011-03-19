/**
 * @class Ext.grid.HeaderDragZone
 * @extends Ext.dd.DragZone
 * @private
 */
Ext.define('Ext.tree.TreeViewDropZone', {
    extend: 'Ext.view.DropZone',

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
     * @cfg {String} expandDelay
     * The delay in milliseconds to wait before expanding a target tree node while dragging a droppable node
     * over the target (defaults to 1000)
     */
    expandDelay : 1000,

    indicatorCls: 'x-tree-ddindicator',
    
    // private
    expandNode : function(node) {
        var view = this.view;
        if (!node.isLeaf() && !node.isExpanded()) {
            view.expand(node);
            this.expandProcId = false;
        }
    },

    // private
    queueExpand : function(node) {
        this.expandProcId = Ext.Function.defer(this.expandNode, this.expandDelay, this, [node]);
    },

    // private
    cancelExpand : function() {
        if (this.expandProcId) {
            clearTimeout(this.expandProcId);
            this.expandProcId = false;
        }
    },
        
    getPosition: function(e, node) {
        var view = this.view,
            record = view.getRecord(node),
            y = e.getPageY(),
            noAppend = record.isLeaf(),
            noBelow = false,
            region = Ext.fly(node).getRegion(),
            fragment;
        
        // If we are dragging on top of the root node of the tree, we always want to append.
        if (record.isRoot()) {
            return 'append';
        }
        
        // Return 'append' if the node we are dragging on top of is not a leaf else return false.
        if (this.appendOnly) {
            return noAppend ? false : 'append';
        }
        
        if (!this.allowParentInsert) {
            noBelow = record.hasChildNodes() && record.isExpanded();
        }
        
        fragment = (region.bottom - region.top) / (noAppend ? 2 : 3);
        if (y >= region.top && y < (region.top + fragment)) {
            return 'above';
        }
        else if (!noBelow && (noAppend || (y >= (region.bottom - fragment) && y <= region.bottom))) {
            return 'below';
        }
        else {
            return 'append';
        }
    },
    
    isValidDropPoint : function(node, position, dragZone, e, data) {
        if (!node || !data.item) {
            return false;
        }

        var view = this.view,
            targetRecord = view.getRecord(node),
            dropRecord = view.getRecord(data.item);
        
        if (!(targetRecord && position)) {
            return false;
        }
        
        if (targetRecord && (targetRecord == dropRecord || dropRecord.contains(targetRecord))) {
            return false;
        }
        
        // @TODO: fire some event to notify that there is a valid drop possible for the node your dragging
        return true;
    },
    
    onNodeOver : function(node, dragZone, e, data) {
        var position = this.getPosition(e, node),
            returnCls = this.dropNotAllowed,
            view = this.view,
            targetRecord = view.getRecord(node),
            indicator = this.getIndicator(),
            indicatorX = 0,
            indicatorY = 0;

        // auto node expand check
        if (position == 'append' && !this.expandProcId && !targetRecord.isLeaf() && !targetRecord.isExpanded()) {
            this.queueExpand(targetRecord);
        } 
        else if (position != 'append') {
            this.cancelExpand();
        }
                    
        if (this.isValidDropPoint(node, position, dragZone, e, data)) {
            this.valid = true;
            this.currentPosition = position;
            this.overRecord = targetRecord;            
            
            indicator.setWidth(Ext.fly(node).getWidth());
            indicatorY = Ext.fly(node).getY() - Ext.fly(view.el).getY() - 1;
            
            if (position == 'above') {
                returnCls = targetRecord.isFirst() ? Ext.baseCSSPrefix + 'tree-drop-ok-above' : Ext.baseCSSPrefix + 'tree-drop-ok-between';
                indicator.showAt(0, indicatorY);
                indicator.toFront();
            }
            else if (position == 'below') {
                returnCls = targetRecord.isLast() ? Ext.baseCSSPrefix + 'tree-drop-ok-below' : Ext.baseCSSPrefix + 'tree-drop-ok-between';
                indicatorY += Ext.fly(node).getHeight();
                indicator.showAt(0, indicatorY);
                indicator.toFront();
            }
            else {
                returnCls = Ext.baseCSSPrefix + 'tree-drop-ok-append';
                // @TODO: set a class on the parent folder node to be able to style it
                indicator.hide();
            }
        }
        else {
            this.valid = false;
        }
        
        this.currentCls = returnCls;
        return returnCls;
    },
    
    onContainerOver : function(dd, e, data) {
        return e.getTarget('.' + this.indicatorCls) ? this.currentCls : this.dropNotAllowed;
    },
    
    handleNodeDrop : function(data, targetRecord, position) {
        var view = this.view,
            sourceRecord = view.getRecord(data.item),
            treeStore = view.getStore(),
            parentNode = targetRecord.parentNode;
        
        // Cancel any pending expand operation
        this.cancelExpand();
   
        if (position == 'above') {
            parentNode.insertBefore(sourceRecord, targetRecord);
        }
        else if (position == 'below') {
            if (targetRecord.nextSibling) {
                parentNode.insertBefore(sourceRecord, targetRecord.nextSibling);
            }
            else {
                parentNode.appendChild(sourceRecord);
            }
        }
        else {
            if (!targetRecord.isExpanded()) {
                targetRecord.expand(function() {
                    targetRecord.appendChild(sourceRecord);
                });
            }
            else {
                targetRecord.appendChild(sourceRecord);
            }
        }
    }
});