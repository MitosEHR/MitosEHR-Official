/**
 * @class Ext.data.TreeStore
 * @extends Ext.data.AbstractStore
 * Tree Store
 */
Ext.define('Ext.data.TreeStore', {
    extend: 'Ext.data.AbstractStore',
    alias: 'store.tree',
    requires: ['Ext.data.Tree', 'Ext.data.NodeInterface', 'Ext.data.NodeStore'],

    /**
     * @cfg {Boolean} clearOnLoad (optional) Default to true. Remove previously existing
     * child nodes before loading.
     */
    clearOnLoad : true,

    /**
     * @cfg {String} nodeParam The name of the parameter sent to the server which contains
     * the identifier of the node. Defaults to <tt>'node'</tt>.
     */
    nodeParam: 'node',

    /**
     * @cfg {String} defaultRootId
     * The default root id. Defaults to 'root'
     */
    defaultRootId: 'root',

    /**
     * @cfg {Boolean} folderSort Set to true to automatically prepend a leaf sorter (defaults to <tt>undefined</tt>)
     */
    folderSort: false,
    
    constructor: function(config) {
        var me = this, root;
        config = config || {};
        
        if (!config.proxy) {
            config.proxy = {type: 'memory'};
        }
        
        if (!config.proxy.isProxy) {
            config.proxy.reader = Ext.applyIf(config.proxy.reader || {}, {
                type: 'json',
                root: 'children'
            });
        }
        
        if (!config.model && !config.fields) {
            config.fields = [{name: 'text', type: 'string'}];
        }

        me.callParent([config]);
        
        // We create our data tree.
        me.tree = Ext.create('Ext.data.Tree');
        
        me.tree.on({
            beforeexpand: this.onBeforeNodeExpand,
            beforecollapse: this.onBeforeNodeCollapse,
            scope: this
        });

        me.onBeforeSort();
                
        root = me.root;
        delete me.root;
        me.setRootNode(root);

        me.relayEvents(me.tree, [
            /**
             * @event append
             * Fires when a new child node is appended to a node in this store's tree.
             * @param {Tree} tree The owner tree
             * @param {Node} parent The parent node
             * @param {Node} node The newly appended node
             * @param {Number} index The index of the newly appended node
             */
            "append",
            
            /**
             * @event remove
             * Fires when a child node is removed from a node in this store's tree.
             * @param {Tree} tree The owner tree
             * @param {Node} parent The parent node
             * @param {Node} node The child node removed
             */
            "remove",
            
            /**
             * @event move
             * Fires when a node is moved to a new location in the store's tree
             * @param {Tree} tree The owner tree
             * @param {Node} node The node moved
             * @param {Node} oldParent The old parent of this node
             * @param {Node} newParent The new parent of this node
             * @param {Number} index The index it was moved to
             */
            "move",
            
            /**
             * @event insert
             * Fires when a new child node is inserted in a node in this store's tree.
             * @param {Tree} tree The owner tree
             * @param {Node} parent The parent node
             * @param {Node} node The child node inserted
             * @param {Node} refNode The child node the node was inserted before
             */
            "insert",
            
            /**
             * @event beforeappend
             * Fires before a new child is appended to a node in this store's tree, return false to cancel the append.
             * @param {Tree} tree The owner tree
             * @param {Node} parent The parent node
             * @param {Node} node The child node to be appended
             */
            "beforeappend",
            
            /**
             * @event beforeremove
             * Fires before a child is removed from a node in this store's tree, return false to cancel the remove.
             * @param {Tree} tree The owner tree
             * @param {Node} parent The parent node
             * @param {Node} node The child node to be removed
             */
            "beforeremove",
            
            /**
             * @event beforemove
             * Fires before a node is moved to a new location in the store's tree. Return false to cancel the move.
             * @param {Tree} tree The owner tree
             * @param {Node} node The node being moved
             * @param {Node} oldParent The parent of the node
             * @param {Node} newParent The new parent the node is moving to
             * @param {Number} index The index it is being moved to
             */
            "beforemove",
            
            /**
             * @event beforeinsert
             * Fires before a new child is inserted in a node in this store's tree, return false to cancel the insert.
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
             "beforecollapse",

             /**
              * @event sort
              * Fires when this TreeStore is sorted.
              * @param {Node} node The node that is sorted.
              */             
             "sort"          
        ]);
        
        //<deprecated since=0.99>
        if (Ext.isDefined(me.nodeParameter)) {
            throw "Ext.data.TreeStore: nodeParameter has been renamed to nodeParam for consistency";
        }
        //</deprecated>
    },
    
    onBeforeSort: function() {
        if (this.folderSort) {
            this.sort({
                property: 'leaf',
                direction: 'ASC'
            }, 'prepend', false);    
        }
    },
    
    onBeforeNodeExpand: function(node, callback, scope) {
        if (node.loaded) {
            callback.call(scope || node, node.childNodes);
        }
        else {
            this.read({
                node: node,
                callback: callback,
                scope: scope || node
            });
        }
    },
    
    onBeforeNodeCollapse: function(node, callback, scope) {
        callback.call(scope || node, node.childNodes);
    },

    setRootNode: function(root) {
        var me = this,
            proxy = me.getProxy(),
            reader = proxy.getReader(),
            children, dataRoot;

        root = root || {};        
        if (!root.isNode) {
            // create a default rootNode and create internal data struct.        
            Ext.applyIf(root, {
                id: me.defaultRootId,
                text: 'Root'
            });
            dataRoot = reader.getRoot(root);
            root = Ext.ModelMgr.create(root, me.model);
        }

        // When we add the root to the tree, it will automaticaly get the NodeInterface
        me.tree.setRootNode(root);

        // Because the tree might have decorated the model with new fields,
        // we need to build new extactor functions on the reader.
        me.getProxy().getReader().buildExtractors(true);
        
        // We want to load any children descending the root node        
        if (dataRoot) {
            children = reader.extractData(dataRoot);
            this.fillNode(root, children);
        }

        // If the user has set expanded: true on the root, we want to call the expand function
        if (root.isExpanded()) {
            root.expand();
        }
    },
    
    /**
     * Returns the root node for this tree.
     * @return {Ext.data.Record}
     */
    getRootNode: function() {
        return this.tree.getRootNode();
    },

    /**
     * Returns the record node by id
     * @return {Ext.data.Record}
     */
    getNodeById: function(id) {
        return this.tree.getNodeById(id);
    },


    // new options are
    // * node - a node within the tree
    // * doPreload - private option used to preload existing childNodes
    load: function(options) {
        options = options || {};
        options.params = options.params || {};
        
        var me = this,
            node = options.node || me.tree.getRootNode(),
            reader = this.proxy.reader,
            root;
        
        if (me.clearOnLoad) {
            node.removeAll();
        }
        
        Ext.applyIf(options, {
            node: node
        });
        options.params[me.nodeParam] = node ? node.get('id') : 'root';
        return me.callParent([options]);
    },
        
    // @private
    // fills an Ext.data.RecordNode with records
    fillNode: function(node, records) {
        var me = this,
            ln = records ? records.length : 0,
            reader = me.proxy.reader,
            recordNode,
            record,
            dataRoot,
            preloadChildren,
            i = 0,
            raw;

        if (ln && me.sortOnLoad && !me.remoteSort && me.sorters && me.sorters.items) {
            sortCollection = Ext.create('Ext.util.MixedCollection');
            sortCollection.addAll(records);
            sortCollection.sort(me.sorters.items);
            records = sortCollection.items;
        }

        node.loaded = true;
        for (; i < ln; i++) {
            record = records[i];
            node.appendChild(record, true);
            
            // Since we are suppressing the event, we have to manually register the node with the tree
            me.tree.registerNode(record);
            
            // If the record contains any children then extract them and add them
            if (record.raw) {
                dataRoot = reader.getRoot(record.raw);
                if (dataRoot) {
                    preloadChildren = reader.extractData(dataRoot);
                    me.fillNode(record, preloadChildren);    
                }
            }
        }
        
        return records;
    },

    onProxyLoad: function(operation) {
        var me = this,
            successful = operation.wasSuccessful(),
            records = operation.getRecords(),
            node = operation.node,
            sortCollection;

        if (successful) {
            records = me.fillNode(node, records);
        }
        // deprecate read?
        me.fireEvent('read', me, operation.node, records, successful);
        me.fireEvent('load', me, operation.node, records, successful);
        //this is a callback that would have been passed to the 'read' function and is optional
        Ext.callback(operation.callback, operation.scope || me, [records, operation, successful]);
    },

    removeAll: function() {
        this.getRootNode().destroy();
    },

    doSort: function(sorterFn) {
        var me = this;
        if (me.remoteSort) {
            //the load function will pick up the new sorters and request the sorted data from the proxy
            me.load();
        } else {
            me.tree.sort(sorterFn, true);
            me.fireEvent('datachanged', me);
        }   
        me.fireEvent('sort', me);
    }
});