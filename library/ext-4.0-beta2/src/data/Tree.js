/**
 * @class Ext.data.Tree
 * Represents a tree data structure and bubbles all the events for its nodes. The nodes
 * in the tree have most standard DOM functionality.
 * @constructor
 * @param {Node} root (optional) The root node
 */
Ext.define('Ext.data.Tree', {
    alias: 'data.tree',
    
    mixins: {
        observable: "Ext.util.Observable"
    },

    /**
     * The root node for this tree
     * @type Node
     */
    root: null,
        
    constructor: function(root) {
        this.nodeHash = {};

        this.mixins.observable.constructor.call(this);
                        
        if (root) {
            this.setRootNode(root);
        }
    },
    
    /**
     * @cfg {String} pathSeparator
     * The token used to separate paths in node ids (defaults to '/').
     */
    pathSeparator: "/",

    /**
     * Returns the root node for this tree.
     * @return {Node}
     */
    getRootNode : function() {
        return this.root;
    },

    /**
     * Sets the root node for this tree.
     * @param {Node} node
     * @return {Node}
     */
    setRootNode : function(node) {
        this.root = node;
        node.set('root', true);
        Ext.data.NodeInterface.decorate(node);
        node.updateInfo();
                
        this.relayEvents(node, [
            /**
             * @event append
             * Fires when a new child node is appended to a node in this tree.
             * @param {Tree} tree The owner tree
             * @param {Node} parent The parent node
             * @param {Node} node The newly appended node
             * @param {Number} index The index of the newly appended node
             */
            "append",
            
            /**
             * @event remove
             * Fires when a child node is removed from a node in this tree.
             * @param {Tree} tree The owner tree
             * @param {Node} parent The parent node
             * @param {Node} node The child node removed
             */
            "remove",
            
            /**
             * @event move
             * Fires when a node is moved to a new location in the tree
             * @param {Tree} tree The owner tree
             * @param {Node} node The node moved
             * @param {Node} oldParent The old parent of this node
             * @param {Node} newParent The new parent of this node
             * @param {Number} index The index it was moved to
             */
            "move",
            
            /**
             * @event insert
             * Fires when a new child node is inserted in a node in this tree.
             * @param {Tree} tree The owner tree
             * @param {Node} parent The parent node
             * @param {Node} node The child node inserted
             * @param {Node} refNode The child node the node was inserted before
             */
            "insert",
            
            /**
             * @event beforeappend
             * Fires before a new child is appended to a node in this tree, return false to cancel the append.
             * @param {Tree} tree The owner tree
             * @param {Node} parent The parent node
             * @param {Node} node The child node to be appended
             */
            "beforeappend",
            
            /**
             * @event beforeremove
             * Fires before a child is removed from a node in this tree, return false to cancel the remove.
             * @param {Tree} tree The owner tree
             * @param {Node} parent The parent node
             * @param {Node} node The child node to be removed
             */
            "beforeremove",
            
            /**
             * @event beforemove
             * Fires before a node is moved to a new location in the tree. Return false to cancel the move.
             * @param {Tree} tree The owner tree
             * @param {Node} node The node being moved
             * @param {Node} oldParent The parent of the node
             * @param {Node} newParent The new parent the node is moving to
             * @param {Number} index The index it is being moved to
             */
            "beforemove",
            
            /**
             * @event beforeinsert
             * Fires before a new child is inserted in a node in this tree, return false to cancel the insert.
             * @param {Tree} tree The owner tree
             * @param {Node} parent The parent node
             * @param {Node} node The child node to be inserted
             * @param {Node} refNode The child node the node is being inserted before
             */
            "beforeinsert",
             
             /**
              * @event expand
              * Fires when this node is expanded.
              * @param {Node} this The expanding node
              */
             "expand",
             
             /**
              * @event collapse
              * Fires when this node is collapsed.
              * @param {Node} this The collapsing node
              */
             "collapse",
             
             /**
              * @event beforeexpand
              * Fires before this node is expanded.
              * @param {Node} this The expanding node
              */
             "beforeexpand",
             
             /**
              * @event beforecollapse
              * Fires before this node is collapsed.
              * @param {Node} this The collapsing node
              */
             "beforecollapse"
        ]);
        
        node.on({
            insert: this.onNodeInsert,
            append: this.onNodeAppend,
            remove: this.onNodeRemove,
            scope: this
        });
        
        return node;
    },
    
    onNodeInsert: function(parent, node) {
        this.registerNode(node);
    },
    
    onNodeAppend: function(parent, node) {
        this.registerNode(node);
    },
    
    onNodeRemove: function(parent, node) {
        this.unregisterNode(node);
    },

    /**
     * Gets a node in this tree by its id.
     * @param {String} id
     * @return {Node}
     */
    getNodeById : function(id) {
        return this.nodeHash[id];
    },

    // private
    registerNode : function(node) {
        this.nodeHash[node.get('id') || node.interalId] = node;
    },

    // private
    unregisterNode : function(node) {
        delete this.nodeHash[node.get('id') || node.interalId];
    },

    toString : function() {
        return "[Tree"+(this.id?" "+this.id:"")+"]";
    },
    
    sort: function(sorterFn, recursive) {
        this.getRootNode().sort(sorterFn, recursive);
    },
    
    filter: function(filters, recursive) {
        this.getRootNode().filter(filters, recursive);
    }
});