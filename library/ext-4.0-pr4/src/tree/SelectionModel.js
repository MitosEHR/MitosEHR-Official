/**
 * @class Ext.tree.SelectionModel
 * @extends Ext.grid.RowSelectionModel
 *
 * Adds custom behavior for left/right keyboard navigation for use with a tree.
 * Depends on the view having an expand and collapse method which accepts a
 * record.
 * 
 * @private
 */
Ext.define('Ext.tree.SelectionModel', {
    extend: 'Ext.grid.RowSelectionModel',
    alias: 'selection.treemodel',
    
    // typically selection models prune records from the selection
    // model when they are removed, because the FlatTreeView constantly
    // adds/removes records as they are expanded/collapsed
    pruneRemoved: false,
    
    onKeyRight: function(e, t) {
        var focused = this.getLastFocused(),
            view    = this.view;
            
        if (focused) {
            // tree node is already expanded, go down instead
            // this handles both the case where we navigate to firstChild and if
            // there are no children to the nextSibling
            if (focused.expanded) {
                this.onKeyDown(e, t);
            // if its not a leaf node, expand it
            } else if (!focused.node.isLeaf()) {
                view.expand(focused);
            // this enables scrolling to the left/right when there are no
            // available actions left.
            } /*else {
                this.callParent(arguments);
            }*/
        }
    },
    
    onKeyLeft: function(e, t) {
        var focused = this.getLastFocused(),
            view    = this.view,
            viewSm  = view.getSelectionModel(),
            parentNode, parentRecord;

        if (focused) {
            parentNode = focused.node.parentNode;
            // if focused node is already expanded, collapse it
            if (focused.expanded) {
                view.collapse(focused);
            // has a parentNode and its not root
            // TODO: this needs to cover the case where the root isVisible
            } else if (parentNode && !parentNode.isRoot) {
                parentRecord = parentNode.attributes.record;
                // Select a range of records when doing multiple selection.
                if (e.shiftKey) {
                    viewSm.selectRange(parentRecord, focused, e.ctrlKey, 'up');
                    viewSm.setLastFocused(parentRecord);
                // just move focus, not selection
                } else if (e.ctrlKey) {
                    viewSm.setLastFocused(parentRecord);
                // select it
                } else {
                    viewSm.select(parentRecord);
                }
            // this enables scrolling to the left/right when there are no
            // available actions left.
            } /*else {
                this.callParent(arguments);
            }*/
        }
    }
});
