/**
 * @class Ext.data.TreeStore
 * @extends Ext.data.AbstractStore

The TreeStore is a store implementation that is backed by by an {@link Ext.data.Tree}.
It provides convenience methods for loading nodes, as well as the ability to use
the hierarchical tree structure combined with a store. This class is generally used
in conjunction with {@link Ext.tree.Panel}. This class also relays many events from
the Tree for convenience.

__Using Models__
If no Model is specified, an implicit model will be created that implements {@link Ext.data.NodeInterface}.
The standard Tree fields will also be copied onto the Model for maintaining their state.

__Reading Nested Data__
For the tree to read nested data, the {@link Ext.data.Reader} must be configured with a root property,
so the reader can find nested data for each node. If a root is not specified, it will default to
'children'.

 * @markdown
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
     * @cfg {String} defaultRootProperty
     * The root property to specify on the reader if one is not explicitly defined.
     */
    defaultRootProperty: 'children',

    /**
     * @cfg {Boolean} folderSort Set to true to automatically prepend a leaf sorter (defaults to <tt>undefined</tt>)
     */
    folderSort: false,
    
    constructor: function(config) {
        var me = this, 
            root,
            fields;
            
        
        config = Ext.apply({}, config);
        
        /**
         * If we have no fields declare for the store, add some defaults.
         * These will be ignored if a model is explicitly specified.
         */
        fields = config.fields || me.fields;
        if (!fields) {
            config.fields = [{name: 'text', type: 'string'}];
        }

        me.callParent([config]);
        
        // We create our data tree.
        me.tree = Ext.create('Ext.data.Tree');
        
        me.tree.on({
            scope: me,
            beforeexpand: me.onBeforeNodeExpand,
            beforecollapse: me.onBeforeNodeCollapse
        });

        me.onBeforeSort();
                
        root = me.root;
        if (root) {
            delete me.root;
            me.setRootNode(root);            
        }

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
        
        me.addEvents(
            /**
             * @event rootchange
             * Fires when the root node on this TreeStore is changed.
             * @param {Ext.data.TreeStore} store This TreeStore
             * @param {Node} The new root node.
             */
            'rootchange'
        );
        
        //<deprecated since=0.99>
        if (Ext.isDefined(me.nodeParameter)) {
            if (Ext.isDefined(Ext.global.console)) {
                Ext.global.console.warn('Ext.data.TreeStore: nodeParameter has been deprecated. Please use nodeParam instead.');
            }
            me.nodeParam = me.nodeParameter;
            delete me.nodeParameter;
        }
        //</deprecated>
    },
    
    // inherit docs
    setProxy: function(proxy) {
        var reader,
            needsRoot;
        
        if (proxy instanceof Ext.data.proxy.Proxy) {
            // proxy instance, check if a root was set
            needsRoot = Ext.isEmpty(proxy.getReader().root);
        } else if (Ext.isString(proxy)) {
            // string type, means a reader can't be set
            needsRoot = true;
        } else {
            // object, check if a reader and a root were specified.
            reader = proxy.reader;
            needsRoot = !(reader && !Ext.isEmpty(reader.root));
        }
        proxy = this.callParent(arguments);
        if (needsRoot) {
            reader = proxy.getReader();
            reader.root = this.defaultRootProperty;
            // force rebuild
            reader.buildExtractors(true);
        }
    },
    
    // inherit docs
    onBeforeSort: function() {
        if (this.folderSort) {
            this.sort({
                property: 'leaf',
                direction: 'ASC'
            }, 'prepend', false);    
        }
    },
    
    /**
     * Called before a node is expanded.
     * @private
     * @param {Ext.data.NodeInterface} node The node being expanded.
     * @param {Function} callback The function to run after the expand finishes
     * @param {Object} scope The scope in which to run the callback function
     */
    onBeforeNodeExpand: function(node, callback, scope) {
        if (node.isLoaded()) {
            Ext.callback(callback, scope || node, [node.childNodes]);
        }
        else if (node.loading) {
            this.on('load', function() {
                Ext.callback(callback, scope || node, [node.childNodes]);
            }, this, {single: true});
        }
        else {
            this.read({
                node: node,
                callback: function() {
                    Ext.callback(callback, scope || node, [node.childNodes]);
                }
            });            
        }
    },
    
    /**
     * Called before a node is collapsed.
     * @private
     * @param {Ext.data.NodeInterface} node The node being collapsed.
     * @param {Function} callback The function to run after the collapse finishes
     * @param {Object} scope The scope in which to run the callback function
     */
    onBeforeNodeCollapse: function(node, callback, scope) {
        callback.call(scope || node, node.childNodes);
    },
    
    /**
     * Sets the root node for this store
     * @param {Ext.data.Model/Ext.data.NodeInterface} root
     * @return {Ext.data.NodeInterface} The new root
     */
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
                text: 'Root',
                allowDrag: false
            });
            dataRoot = reader.getRoot(root);
            root = Ext.ModelManager.create(root, me.model);
        }

        // When we add the root to the tree, it will automaticaly get the NodeInterface
        me.tree.setRootNode(root);

        me.fireEvent('rootchange', me, root);
        
        // Because the tree might have decorated the model with new fields,
        // we need to build new extactor functions on the reader.
        me.getProxy().getReader().buildExtractors(true);
        
        // We want to load any children descending the root node        
        if (dataRoot) {
            children = reader.extractData(dataRoot);
            me.fillNode(root, children);
        }

        // If the user has set expanded: true on the root, we want to call the expand function
        if (!root.isLoaded() && root.isExpanded()) {
            me.load({
                node: root
            });
        }
        
        return root;
    },
        
    /**
     * Returns the root node for this tree.
     * @return {Ext.data.NodeInterface}
     */
    getRootNode: function() {
        return this.tree.getRootNode();
    },

    /**
     * Returns the record node by id
     * @return {Ext.data.NodeInterface}
     */
    getNodeById: function(id) {
        return this.tree.getNodeById(id);
    },

    /**
     * Loads the Store using its configured {@link #proxy}.
     * @param {Object} options Optional config object. This is passed into the {@link Ext.data.Operation Operation}
     * object that is created and then sent to the proxy's {@link Ext.data.proxy.Proxy#read} function.
     * The options can also contain a node, which indicates which node is to be loaded. If not specified, it will
     * default to the root node.
     */
    load: function(options) {
        options = options || {};
        options.params = options.params || {};
        
        var me = this,
            node = options.node || me.tree.getRootNode(),
            root;
            
        // If there is not a node it means the user hasnt defined a rootnode yet. In this case lets just
        // create one for them.
        if (!node) {
            node = me.setRootNode({
                expanded: true
            });
        }
        
        if (me.clearOnLoad) {
            node.removeAll();
        }
        
        Ext.applyIf(options, {
            node: node
        });
        options.params[me.nodeParam] = node ? node.getId() : 'root';
        
        if (node) {
            node.loading = true;
        }
        
        return me.callParent([options]);
    },
        

    /**
     * Fills a node with a series of child records.
     * @private
     * @param {Ext.data.NodeInterface} node The node to fill
     * @param {Array} records The records to add
     */
    fillNode: function(node, records) {
        var me = this,
            ln = records ? records.length : 0,
            reader = me.proxy.reader,
            i = 0,
            recordNode, record, dataRoot, preloadChildren, raw, sortCollection, fillChild;

        if (ln && me.sortOnLoad && !me.remoteSort && me.sorters && me.sorters.items) {
            sortCollection = Ext.create('Ext.util.MixedCollection');
            sortCollection.addAll(records);
            sortCollection.sort(me.sorters.items);
            records = sortCollection.items;
        }
        
        node.set('loaded', true);
        for (; i < ln; i++) {
            record = records[i];
            fillChild = false;
            
            // If the record contains any children then extract them and add them
            if (record.raw) {
                dataRoot = reader.getRoot(record.raw);
                if (dataRoot) {
                    preloadChildren = reader.extractData(dataRoot);
                    fillChild = true;
                    record.set('loaded', true);
                }
            }
                        
            node.appendChild(record);
            
            if (fillChild) {
                me.fillNode(record, preloadChildren);
            }
        }
        
        return records;
    },

    // inherit docs
    onProxyLoad: function(operation) {
        var me = this,
            successful = operation.wasSuccessful(),
            records = operation.getRecords(),
            node = operation.node;

        delete node.loading;
        if (successful) {
            records = me.fillNode(node, records);
        }
        // deprecate read?
        me.fireEvent('read', me, operation.node, records, successful);
        me.fireEvent('load', me, operation.node, records, successful);
        //this is a callback that would have been passed to the 'read' function and is optional
        Ext.callback(operation.callback, operation.scope || me, [records, operation, successful]);
    },

    // inherit docs
    removeAll: function() {
        this.getRootNode().destroy();
    },

    // inherit docs
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