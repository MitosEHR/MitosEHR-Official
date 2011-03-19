/**
 * @class Ext.data.TreeStore
 * @extends Ext.data.AbstractStore
 * Tree Store
 */
Ext.define('Ext.data.TreeStore', {
    extend: 'Ext.data.AbstractStore',
    alias: 'data.treestore',
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
        
        root = me.root;
        delete me.root;
        me.setRootNode(root);
        
        //<deprecated since=0.99>
        if (Ext.isDefined(me.nodeParameter)) {
            throw "Ext.data.TreeStore: nodeParameter has been renamed to nodeParam for consistency";
        }
        //</deprecated>
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
            root.set('expanded', false);
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
        var ln = records.length,
            reader = this.proxy.reader,        
            recordNode,
            record,
            dataRoot,
            preloadChildren,
            i = 0,
            raw;

        node.loaded = true;
        for (; i < ln; i++) {
            record = records[i];
            
            // While we are going to fill this record, set its state to not expanded
            // expanded = false;
            // if (record.isExpanded()) {
            //     record.set('expanded', false);
            //     expanded = true;
            // }

            node.appendChild(record);
                        
            // If the record contains any children then extract them and add them
            if (record.raw) {
                dataRoot = reader.getRoot(record.raw);
                if (dataRoot) {
                    preloadChildren = reader.extractData(dataRoot);
                    this.fillNode(record, preloadChildren);    
                }
            }
            
            // If the data came back with expanded true on a child, then expand it
            // if (expanded) {                
            //     record.expand();
            // }
        }
    },
        
    onProxyLoad: function(operation) {
        var me = this,
            successful = operation.wasSuccessful(),
            records = operation.getRecords(),
            node = operation.node,
            sortCollection = this.sortCollection;

        if (successful) {
            if (me.sortOnLoad && !this.remoteSort && me.sorters && me.sorters.items) {
                if (!sortCollection) {
                    sortCollection = this.sortCollection = Ext.create('Ext.util.MixedCollection');
                }
                sortCollection.clear();
                sortCollection.addAll(records);
                sortCollection.sort(me.sorters.items);
                records = sortCollection.items;
                node.sorters = me.sorters.items;
            }
            me.fillNode(node, records);
        }

        me.fireEvent('read', me, operation.node, records, successful);
        //this is a callback that would have been passed to the 'read' function and is optional
        Ext.callback(operation.callback, operation.scope || me, [records, operation, successful]);
    },
    
    removeAll: function() {
        this.getRootNode().destroy();
    }
    
    // 
    // sort: function(sorters, direction) {
    //     var me = this,
    //         property,
    //         sortToggle,
    //         toggle;
    //         
    //     if (Ext.isString(sorters)) {
    //         property = sorters;
    //         sortToggle = me.sortToggle;
    //         toggle = Ext.String.toggle;
    // 
    //         if (direction === undefined) {
    //             sortToggle[property] = toggle(sortToggle[property] || "", "ASC", "DESC");
    //             direction = sortToggle[property];
    //         }
    // 
    //         sorters = {
    //             property : property,
    //             direction: direction
    //         };
    //     }
    //     
    //     if (arguments.length !== 0) {
    //         me.sorters.clear();
    //     }
    //     
    //     me.sorters.addAll(me.decodeSorters(sorters));
    //     // 
    //     // if (me.remoteSort) {
    //     //     //the load function will pick up the new sorters and request the sorted data from the proxy
    //     //     me.load();
    //     // } else {
    //     // console.log(me.sorters.items);
    //     // me.data.sort(me.sorters.items);
    //     me.fireEvent('datachanged', me);
    //     // }        
    // }
});