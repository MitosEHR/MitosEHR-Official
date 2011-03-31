/**
 * @class Ext.tree.TreePanel
 * @extends Ext.panel.TablePanel
 * @xtype treepanel
 * @markdown

The TreePanel provides tree-structured UI representation of tree-structured data.
A TreePanel must be bound to a {@link Ext.data.TreeStore}. TreePanel's support
multiple headers through the {@link headers} configuration. 

An example of a tree rendered to the body of the document:

    var tree = new Ext.tree.TreePanel({
        renderTo: Ext.getBody(),
        width: 400,
        height: 400,
        store: treeStore,
        hideHeaders: true,
        headers: [{
            // specify you want indenting on this header
            xtype: 'treeheader',
            flex: 1,
            sortable: false,
            // links back to field name in store
            dataIndex: 'fileName'
        }]
    });
 */
Ext.define('Ext.tree.TreePanel', {
    extend: 'Ext.panel.TablePanel',
    alias: 'widget.treepanel',
    
    viewType: 'treeview',
    selType: 'treemodel',
    
    cls: 'x-tree-panel',
    
    /**
     * @cfg {Boolean} lines false to disable tree lines (defaults to true)
     */
    lines: true,
    
    /**
     * @cfg {Boolean} useArrows true to use Vista-style arrows in the tree (defaults to false)
     */
    useArrows: false,
    
    /**
     * @cfg {Boolean} singleExpand <tt>true</tt> if only 1 node per branch may be expanded
     */
    singleExpand: false,
    
    ddConfig: {
        enableDrag: true,
        enableDrop: true
    },
    
    /** 
     * @cfg {Boolean} animate <tt>true</tt> to enable animated expand/collapse (defaults to the value of {@link Ext#enableFx Ext.enableFx})
     */
            
    /** 
     * @cfg {Boolean} rootVisible <tt>false</tt> to hide the root node (defaults to <tt>true</tt>)
     */
    rootVisible: true,
    
    /** 
     * @cfg {Boolean} displayField The field inside the model that will be used as the node's text. (defaults to <tt>text</tt>)
     */    
    displayField: 'text',

    /** 
     * @cfg {Boolean} root Allows you to not specify a store on this TreePanel. This is useful for creating a simple
     * tree with preloaded data without having to specify a TreeStore and Model. A store and model will be created and
     * root will be passed to that store.
     */
    root: null,
    
    // @TODO: provide backwards compatibility for the following things
    
    // These are just plain stupid
    hlDrop: false,
    hlColor: null,
    // These become part of the ddConfig
    enableDrag: false,
    enableDrop: false,
    enableDD: false,
    // These methods should now be called on the treestore
    getNodeById : function(id){},
    setRootNode : function(node){},
    getRootNode : function(){},  
    getChecked : function(a, startNode){},

    constructor: function(config) {
        if (config.animate === undefined) {
            config.animate = Ext.enableFx;
        }
        this.enableAnimations = config.animate;
        delete config.animate;
        
        this.callParent([config]);
    },
    
    initComponent: function() {
        var me = this,
            cls = [];

        if (me.useArrows) {
            cls.push(Ext.baseCSSPrefix + 'tree-arrows');
            me.lines = false;
        }
        
        if (me.lines) {
            cls.push(Ext.baseCSSPrefix + 'tree-lines');
        } else if (!me.useArrows) {
            cls.push(Ext.baseCSSPrefix + 'tree-no-lines');
        }

        if (!me.store) {
            me.store = Ext.create('Ext.data.TreeStore', {
                root: me.root
            });
        }
        else if (me.root) {
            me.store.setRootNode(me.root);
        }
                
        me.viewConfig = Ext.applyIf(me.viewConfig || {}, {
            rootVisible: me.rootVisible,
            animate: me.enableAnimations,
            singleExpand: me.singleExpand,
            treeStore: me.store
        });
    
        me.relayEvents(me.store, [
            /**
             * @event beforeload
             * Event description
             * @param {Ext.data.Store} store This Store
             * @param {Ext.data.Operation} operation The Ext.data.Operation object that will be passed to the Proxy to load the Store
             */
            'beforeload',

            /**
             * @event load
             * Fires whenever the store reads data from a remote data source.
             * @param {Ext.data.store} this
             * @param {Array} records An array of records
             * @param {Boolean} successful True if the operation was successful.
             */
            'load',
            
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
             "beforecollapse"    
        ]);
        
        // If the user specifies the headers collection manually then dont inject our own
        if (!me.headers) {
            if (me.initialConfig.hideHeaders === undefined) {
                me.hideHeaders = true;
            }
            me.headers = [{
                xtype    : 'treeheader',
                text     : 'Name',
                flex     : 1,
                dataIndex: me.displayField         
            }];
        }
        
        if (me.cls) {
            cls.push(me.cls);
        }
        me.cls = cls.join(' ');
        me.callParent();
        
        this.relayEvents(this.view, [
            /**
             * @event beforeclick
             * Fires before a click is processed. Returns false to cancel the default action.
             * @param {Ext.DataView} this
             * @param {Number} index The index of the target node
             * @param {HTMLElement} node The target node
             * @param {Ext.EventObject} e The raw event object
             */
            'beforeclick',

            /**
             * @event click
             * Fires when a template node is clicked.
             * @param {Ext.DataView} this
             * @param {Number} index The index of the target node
             * @param {HTMLElement} node The target node
             * @param {Ext.EventObject} e The raw event object
             */
            'click',

            /**
             * @event mouseenter
             * Fires when the mouse enters a template node. trackOver:true and an overItemCls must be set to enable this event.
             * @param {Ext.DataView} this
             * @param {Number} index The index of the target node
             * @param {HTMLElement} node The target node
             * @param {Ext.EventObject} e The raw event object
             */
            'mouseenter',

            /**
             * @event mouseleave
             * Fires when the mouse leaves a template node. trackOver:true and an overItemCls must be set to enable this event.
             * @param {Ext.DataView} this
             * @param {Number} index The index of the target node
             * @param {HTMLElement} node The target node
             * @param {Ext.EventObject} e The raw event object
             */
            'mouseleave',

            /**
             * @event containerclick
             * Fires when a click occurs and it is not on a template node.
             * @param {Ext.DataView} this
             * @param {Ext.EventObject} e The raw event object
             */
            'containerclick',

            /**
             * @event dblclick
             * Fires when a template node is double clicked.
             * @param {Ext.DataView} this
             * @param {Number} index The index of the target node
             * @param {HTMLElement} node The target node
             * @param {Ext.EventObject} e The raw event object
             */
            'dblclick',

            /**
             * @event contextmenu
             * Fires when a template node is right clicked.
             * @param {Ext.DataView} this
             * @param {Number} index The index of the target node
             * @param {HTMLElement} node The target node
             * @param {Ext.EventObject} e The raw event object
             */
            'contextmenu',

            /**
             * @event containercontextmenu
             * Fires when a right click occurs that is not on a template node.
             * @param {Ext.DataView} this
             * @param {Ext.EventObject} e The raw event object
             */
            'containercontextmenu',

            /**
             * @event selectionchange
             * Fires when the selected nodes change. Relayed event from the underlying selection model.
             * @param {Ext.DataView} this
             * @param {Array} selections Array of the selected nodes
             */
            'selectionchange',

            /**
             * @event beforeselect
             * Fires before a selection is made. If any handlers return false, the selection is cancelled.
             * @param {Ext.DataView} this
             * @param {HTMLElement} node The node to be selected
             * @param {Array} selections Array of currently selected nodes
             */
            'beforeselect'
        ]);
    },

    getView: function() {
        var me = this;
        me.callParent(arguments);
        me.store = me.view.treeStore;
        return me.view;
    },
    
    /**
     * Expand all nodes
     */
    expandAll : function() {
    },

    /**
     * Collapse all nodes
     */
    collapseAll : function() {
    },

    expandPath: function() {
    },
    
    selectPath: function() {
    }
});