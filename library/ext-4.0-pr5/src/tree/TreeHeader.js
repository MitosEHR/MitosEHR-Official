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
                depth = record.getDepth(),
                treePrefix  = Ext.baseCSSPrefix + 'tree-',
                elbowPrefix = treePrefix + 'elbow-',
                expanderCls = treePrefix + 'expander',
                imgText     = '<img src="{1}" class="{0}" />',
                formattedValue = origRenderer.apply(origScope, arguments);
    
            while (record) {
                if (!record.isRoot() || (record.isRoot() && view.rootVisible)) {
                    if (record.getDepth() === depth) {
                        buf.unshift(Ext.String.format(imgText,
                            treePrefix + 'icon ' + 
                            treePrefix + 'icon' + (record.get('icon') ? '-inline ' : (record.isLeaf() ? '-leaf ' : '-parent ')) +
                            (record.get('iconCls') || ''),
                            record.get('icon') || Ext.BLANK_IMAGE_URL
                        ));
                        if (record.isLast()) {
                            if (record.isLeaf()) {
                                buf.unshift(Ext.String.format(imgText, (elbowPrefix + 'end'), Ext.BLANK_IMAGE_URL));
                            } else {
                                buf.unshift(Ext.String.format(imgText, (elbowPrefix + 'end-plus ' + expanderCls), Ext.BLANK_IMAGE_URL));
                            }
                            
                        } else {
                            if (record.isLeaf()) {
                                buf.unshift(Ext.String.format(imgText, (treePrefix + 'elbow'), Ext.BLANK_IMAGE_URL));
                            } else {
                                buf.unshift(Ext.String.format(imgText, (elbowPrefix + 'plus ' + expanderCls), Ext.BLANK_IMAGE_URL));
                            }
                            
                        }
                    } else {
                        if (record.isLast() || record.getDepth() == 0) {
                            buf.unshift(Ext.String.format(imgText, (elbowPrefix + 'empty'), Ext.BLANK_IMAGE_URL));
                        } else if (record.getDepth() != 0) {
                            buf.unshift(Ext.String.format(imgText, (elbowPrefix + 'line'), Ext.BLANK_IMAGE_URL));
                        }                      
                    }
                }
                record = record.parentNode;
            }
            return buf.join("") + formattedValue;
        };
        this.callParent(arguments);
    },
    
    defaultRenderer: function(value) {
        return value;
    }
});
