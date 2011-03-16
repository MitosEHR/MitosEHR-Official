/**
 * @class Ext.tree.TreeHeader
 * @extends Ext.grid.Header
 * 
 * Provides indentation and folder structure markup for a Tree taking into account
 * depth and position within the tree hierarchy.
 * 
 * @private
 */
Ext.define('Ext.tree.TreeHeader', {
    extend: 'Ext.grid.Header',
    alias: 'widget.treeheader',
    initComponent: function() {
        
        var origRenderer = this.renderer || this.defaultRenderer,
            origScope    = this.scope || window;
            
        this.renderer = function(value, metaData, record, rowIdx, colIdx, store, view) {
            var buf   = [],
                node  = record.node,
                depth = node.getDepth(),
                treePrefix  = Ext.baseCSSPrefix + 'tree-',
                elbowPrefix = treePrefix + 'elbow-',
                expanderCls = treePrefix + 'expander',
                imgText     = '<img src="' + Ext.BLANK_IMAGE_URL + '" class="{0}" />',
                formattedValue = origRenderer.apply(origScope, arguments);
    
            while (node) {
                if (!node.isRoot || (node.isRoot && view.panel.rootVisible)) {
                    if (node.getDepth() === depth) {
                        buf.unshift(Ext.String.format(imgText, treePrefix + 'icon ' + treePrefix + 'icon' + (node.leaf ? '-leaf' : '-parent')));
                        if (node.isLast()) {
                            if (node.leaf) {
                                buf.unshift(Ext.String.format(imgText, (elbowPrefix + 'end')));
                            } else {
                                buf.unshift(Ext.String.format(imgText, (elbowPrefix + 'end-plus ' + expanderCls)));
                            }
                            
                        } else {
                            if (node.leaf) {
                                buf.unshift(Ext.String.format(imgText, (treePrefix + 'elbow')));
                            } else {
                                buf.unshift(Ext.String.format(imgText, (elbowPrefix + 'plus ' + expanderCls)));
                            }
                            
                        }
                    } else {
                        if (node.isLast()) {
                            buf.unshift(Ext.String.format(imgText, (elbowPrefix + 'empty')));
                        } else {
                            buf.unshift(Ext.String.format(imgText, (elbowPrefix + 'line')));
                        }
                        
                    }
                }
                node = node.parentNode;
            }
            return buf.join("") + formattedValue;
        };
        this.callParent(arguments);
    },
    defaultRenderer: function(value) {
        return value;
    }
});
