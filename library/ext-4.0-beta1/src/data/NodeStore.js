/**
 * @class Ext.data.NodeStore
 * @extends Ext.data.AbstractStore
 * Node Store
 */
Ext.define('Ext.data.NodeStore', {
    extend: 'Ext.data.Store',
    alias: 'store.node',
    requires: ['Ext.data.NodeInterface'],
    
    /**
     * @cfg {Ext.data.Record} node The Record you want to bind this Store to. Note that
     * this record will be decorated with the Ext.data.NodeInterface if this is not the
     * case yet.
     */
    node: null,
    
    /**
     * @cfg {Boolean} recursive Set this to true if you want this NodeStore to represent
     * all the descendents of the node in its flat data collection. This is useful for
     * rendering a tree structure to a DataView and is being used internally by
     * the TreeView. Any records that are moved, removed, inserted or appended to the
     * node at any depth below the node this store is bound to will be automatically
     * updated in this Store's internal flat data structure.
     */
    recursive: false,
    
    /** 
     * @cfg {Boolean} rootVisible <tt>false</tt> to not include the root node in this Stores collection (defaults to <tt>true</tt>)
     */    
    rootVisible: false,
    
    constructor: function(config) {
        config = config || {};
        Ext.apply(this, config);
        
        //<debug>
        if (Ext.isDefined(this.proxy)) {
            throw "Ext.data.NodeStore: A NodeStore can not be bound to a proxy. Instead bind it to a record decorated with the NodeInterface by setting the node config.";
        }
        //</debug>

        config.proxy = {type: 'proxy'};
        this.callParent([config]);

        this.addEvents('expand', 'collapse', 'beforeexpand', 'beforecollapse');
        
        var node = this.node;
        if (node) {
            this.node = null;
            this.setNode(node);
        }
    },
    
    setNode: function(node) {
        if (this.node && this.node != node) {
            // We want to unbind our listeners on the old node
            this.mun(this.node, {
                expand: this.onNodeExpand,
                collapse: this.onNodeCollapse,
                append: this.onNodeAppend,
                insert: this.onNodeInsert,
                remove: this.onNodeRemove,
                sort: this.onNodeSort,
                scope: this
            });
            this.node = null;
        }
        
        if (node) {
            Ext.data.NodeInterface.decorate(node);
            this.removeAll();
            if (this.rootVisible) {
                this.add(node);
            }
            this.mon(node, {
                expand: this.onNodeExpand,
                collapse: this.onNodeCollapse,
                append: this.onNodeAppend,
                insert: this.onNodeInsert,
                remove: this.onNodeRemove,
                sort: this.onNodeSort,
                scope: this
            });
            this.node = node;
            if (node.isExpanded() && node.loaded) {
                this.onNodeExpand(node, node.childNodes, true);
            }
        }
    },
    
    onNodeSort: function(node, childNodes) {
        if ((this.indexOf(node) !== -1 || (node === this.node && !this.rootVisible) && node.isExpanded())) {
            this.onNodeCollapse(node, childNodes, true);
            this.onNodeExpand(node, childNodes, true);
        }
    },
    
    onNodeExpand: function(parent, records, suppressEvent) {
        var insertIndex = this.indexOf(parent) + 1,
            ln = records ? records.length : 0,
            i, record;

        if (!this.recursive && parent !== this.node) {
            return;
        }

        if (!suppressEvent && this.fireEvent('beforeexpand', parent, records, insertIndex) === false) {
            return;
        }

        if (ln) {
            this.insert(insertIndex, records);
            for (i = 0; i < ln; i++) {
                record = records[i];
                if (record.isExpanded()) {
                    this.onNodeExpand(record, record.childNodes, true);
                }
            }
        }

        if (!suppressEvent) {
            this.fireEvent('expand', parent, records);
        }
    },

    onNodeCollapse: function(parent, records, suppressEvent) {
        var ln = records.length,
            collapseIndex = this.indexOf(parent) + 1,
            i, record;
            
        if (!this.recursive && parent !== this.node) {
            return;
        }
        
        if (!suppressEvent && this.fireEvent('beforecollapse', parent, records, collapseIndex) === false) {
            return;
        }

        for (i = 0; i < ln; i++) {
            record = records[i];
            this.remove(record);
            if (record.isExpanded()) {
                this.onNodeCollapse(record, record.childNodes, true);
            }
        }
        
        if (!suppressEvent) {
            this.fireEvent('collapse', parent, records, collapseIndex);
        }
    },
    
    onNodeAppend: function(parent, node, index) {
        var me = this,
            refNode, sibling;

        if (parent.isExpanded()) {
            if (index == 0) {
                refNode = parent;
            }
            else {
                sibling = node.previousSibling;
                refNode = sibling.isExpanded() ? (sibling.lastChild || sibling) : sibling;
            }
            me.insert(me.indexOf(refNode) + 1, node);
            if (!node.isLeaf() && node.isExpanded()) {
                me.onNodeExpand(node, node.childNodes, true);
            }
        } 
    },
    
    onNodeInsert: function(parent, node, refNode) {
        var me = this,
            index = this.indexOf(refNode);
            
        if (index != -1 && parent.isExpanded()) {
            me.insert(index, node);
            if (!node.isLeaf() && node.isExpanded()) {
                me.onNodeExpand(node, node.childNodes, true);
            }
        }
    },
    
    onNodeRemove: function(parent, node, index) {
        var me = this;
        if (me.indexOf(node) != -1) {
            if (!node.isLeaf() && node.isExpanded()) {
                me.onNodeCollapse(node, node.childNodes, true);
            }            
            me.remove(node);
        }
    }
});