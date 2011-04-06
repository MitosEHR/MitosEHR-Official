/**
 * @class Ext.tree.TreePanel
 * @extends Ext.panel.TablePanel

The TreePanel provides tree-structured UI representation of tree-structured data.
A TreePanel must be bound to a {@link Ext.data.TreeStore}. TreePanel's support
multiple columns through the {@link columns} configuration. 

An example of a tree rendered to the body of the document:

    var tree = new Ext.tree.TreePanel({
        renderTo: Ext.getBody(),
        width: 400,
        height: 400,
        store: treeStore,
        hideHeaders: true,
        columns: [{
            // specify you want indenting on this header
            xtype: 'treecolumn',
            flex: 1,
            sortable: false,
            // links back to field name in store
            dataIndex: 'fileName'
        }]
    });
 * @xtype treepanel
 * @markdown
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

    constructor: function(config) {
        config = config || {};
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
            me.store = Ext.data.StoreMgr.lookup(me.store);
            me.store.setRootNode(me.root);
        }
        
        if (me.initialConfig.rootVisible === undefined && !me.getRootNode()) {
            me.rootVisible = false;
        }
                
        me.viewConfig = Ext.applyIf(me.viewConfig || {}, {
            rootVisible: me.rootVisible,
            animate: me.enableAnimations,
            singleExpand: me.singleExpand,
            node: me.store.getRootNode()
        });
        
        me.mon(me.store, {
            rootchange: me.onRootChange,
            scope: me
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
            'load'   
        ]);
        
        me.store.on({
            /**
             * @event itemappend
             * Fires when a new child node is appended to a node in the tree.
             * @param {Tree} tree The owner tree
             * @param {Node} parent The parent node
             * @param {Node} node The newly appended node
             * @param {Number} index The index of the newly appended node
             */
            append: me.createRelayer('itemappend'),
            
            /**
             * @event itemremove
             * Fires when a child node is removed from a node in the tree
             * @param {Tree} tree The owner tree
             * @param {Node} parent The parent node
             * @param {Node} node The child node removed
             */
            remove: me.createRelayer('itemremove'),
            
            /**
             * @event itemmove
             * Fires when a node is moved to a new location in the tree
             * @param {Tree} tree The owner tree
             * @param {Node} node The node moved
             * @param {Node} oldParent The old parent of this node
             * @param {Node} newParent The new parent of this node
             * @param {Number} index The index it was moved to
             */
            move: me.createRelayer('itemmove'),
            
            /**
             * @event iteminsert
             * Fires when a new child node is inserted in a node in tree
             * @param {Tree} tree The owner tree
             * @param {Node} parent The parent node
             * @param {Node} node The child node inserted
             * @param {Node} refNode The child node the node was inserted before
             */
            insert: me.createRelayer('iteminsert'),
            
            /**
             * @event beforeitemappend
             * Fires before a new child is appended to a node in this tree, return false to cancel the append.
             * @param {Tree} tree The owner tree
             * @param {Node} parent The parent node
             * @param {Node} node The child node to be appended
             */
            beforeappend: me.createRelayer('beforeitemappend'),
            
            /**
             * @event beforeitemremove
             * Fires before a child is removed from a node in this tree, return false to cancel the remove.
             * @param {Tree} tree The owner tree
             * @param {Node} parent The parent node
             * @param {Node} node The child node to be removed
             */
            beforeremove: me.createRelayer('beforeitemremove'),
            
            /**
             * @event beforeitemmove
             * Fires before a node is moved to a new location in the tree. Return false to cancel the move.
             * @param {Tree} tree The owner tree
             * @param {Node} node The node being moved
             * @param {Node} oldParent The parent of the node
             * @param {Node} newParent The new parent the node is moving to
             * @param {Number} index The index it is being moved to
             */
            beforemove: me.createRelayer('beforeitemmove'),
            
            /**
             * @event beforeiteminsert
             * Fires before a new child is inserted in a node in this tree, return false to cancel the insert.
             * @param {Tree} tree The owner tree
             * @param {Node} parent The parent node
             * @param {Node} node The child node to be inserted
             * @param {Node} refNode The child node the node is being inserted before
             */
            beforeinsert: me.createRelayer('beforeiteminsert'),
             
            /**
             * @event itemexpand
             * Fires when a node is expanded.
             * @param {Node} this The expanding node
             */
            expand: me.createRelayer('itemexpand'),
             
            /**
             * @event itemcollapse
             * Fires when a node is collapsed.
             * @param {Node} this The collapsing node
             */
            collapse: me.createRelayer('itemcollapse'),
             
            /**
             * @event beforeitemexpand
             * Fires before a node is expanded.
             * @param {Node} this The expanding node
             */
            beforexpand: me.createRelayer('beforeitemexpand'),
             
            /**
             * @event beforeitemcollapse
             * Fires before a node is collapsed.
             * @param {Node} this The collapsing node
             */
            beforecollapse: me.createRelayer('beforeitemcollapse')
        });
        
        // If the user specifies the headers collection manually then dont inject our own
        if (!me.columns) {
            if (me.initialConfig.hideHeaders === undefined) {
                me.hideHeaders = true;
            }
            me.columns = [{
                xtype    : 'treecolumn',
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
             * @event beforeitemmousedown
             * Fires before the mousedown event on an item is processed. Returns false to cancel the default action.
             * @param {Ext.DataView} this
             * @param {Ext.data.Model} record The record that belongs to the item
             * @param {HTMLElement} item The item's element
             * @param {Number} index The item's index
             * @param {Ext.EventObject} e The raw event object
             */
            'beforeitemmousedown',
            /**
             * @event beforeitemmouseup
             * Fires before the mouseup event on an item is processed. Returns false to cancel the default action.
             * @param {Ext.DataView} this
             * @param {Ext.data.Model} record The record that belongs to the item
             * @param {HTMLElement} item The item's element
             * @param {Number} index The item's index
             * @param {Ext.EventObject} e The raw event object
             */
            'beforeitemmouseup',
            /**
             * @event beforeitemmouseenter
             * Fires before the mouseenter event on an item is processed. Returns false to cancel the default action.
             * @param {Ext.DataView} this
             * @param {Ext.data.Model} record The record that belongs to the item
             * @param {HTMLElement} item The item's element
             * @param {Number} index The item's index
             * @param {Ext.EventObject} e The raw event object
             */
            'beforeitemmouseenter',
            /**
             * @event beforeitemmouseleave
             * Fires before the mouseleave event on an item is processed. Returns false to cancel the default action.
             * @param {Ext.DataView} this
             * @param {Ext.data.Model} record The record that belongs to the item
             * @param {HTMLElement} item The item's element
             * @param {Number} index The item's index
             * @param {Ext.EventObject} e The raw event object
             */
            'beforeitemmouseleave',
            /**
             * @event beforeitemclick
             * Fires before the click event on an item is processed. Returns false to cancel the default action.
             * @param {Ext.DataView} this
             * @param {Ext.data.Model} record The record that belongs to the item
             * @param {HTMLElement} item The item's element
             * @param {Number} index The item's index
             * @param {Ext.EventObject} e The raw event object
             */
            'beforeitemclick',
            /**
             * @event beforeitemdblclick
             * Fires before the dblclick event on an item is processed. Returns false to cancel the default action.
             * @param {Ext.DataView} this
             * @param {Ext.data.Model} record The record that belongs to the item
             * @param {HTMLElement} item The item's element
             * @param {Number} index The item's index
             * @param {Ext.EventObject} e The raw event object
             */
            'beforeitemdblclick',
            /**
             * @event beforeitemcontextmenu
             * Fires before the contextmenu event on an item is processed. Returns false to cancel the default action.
             * @param {Ext.DataView} this
             * @param {Ext.data.Model} record The record that belongs to the item
             * @param {HTMLElement} item The item's element
             * @param {Number} index The item's index
             * @param {Ext.EventObject} e The raw event object
             */
            'beforeitemcontextmenu',            
            /**
             * @event itemmousedown
             * Fires when there is a mouse down on an item
             * @param {Ext.DataView} this
             * @param {Ext.data.Model} record The record that belongs to the item
             * @param {HTMLElement} item The item's element
             * @param {Number} index The item's index
             * @param {Ext.EventObject} e The raw event object
             */
            'itemmousedown',
            /**
             * @event itemmouseup
             * Fires when there is a mouse up on an item
             * @param {Ext.DataView} this
             * @param {Ext.data.Model} record The record that belongs to the item
             * @param {HTMLElement} item The item's element
             * @param {Number} index The item's index
             * @param {Ext.EventObject} e The raw event object
             */
            'itemmouseup',
            /**
             * @event itemmouseenter
             * Fires when the mouse enters an item.
             * @param {Ext.DataView} this
             * @param {Ext.data.Model} record The record that belongs to the item
             * @param {HTMLElement} item The item's element
             * @param {Number} index The item's index
             * @param {Ext.EventObject} e The raw event object
             */
            'itemmouseenter',
            /**
             * @event itemmouseleave
             * Fires when the mouse leaves an item.
             * @param {Ext.DataView} this
             * @param {Ext.data.Model} record The record that belongs to the item
             * @param {HTMLElement} item The item's element
             * @param {Number} index The item's index
             * @param {Ext.EventObject} e The raw event object
             */
            'itemmouseleave',
            /**
             * @event itemclick
             * Fires when an item is clicked.
             * @param {Ext.DataView} this
             * @param {Ext.data.Model} record The record that belongs to the item
             * @param {HTMLElement} item The item's element
             * @param {Number} index The item's index
             * @param {Ext.EventObject} e The raw event object
             */
            'itemclick',
            /**
             * @event itemdblclick
             * Fires when an item is double clicked.
             * @param {Ext.DataView} this
             * @param {Ext.data.Model} record The record that belongs to the item
             * @param {HTMLElement} item The item's element
             * @param {Number} index The item's index
             * @param {Ext.EventObject} e The raw event object
             */
            'itemdblclick',
            /**
             * @event itemcontextmenu
             * Fires when an item is right clicked.
             * @param {Ext.DataView} this
             * @param {Ext.data.Model} record The record that belongs to the item
             * @param {HTMLElement} item The item's element
             * @param {Number} index The item's index
             * @param {Ext.EventObject} e The raw event object
             */
            'itemcontextmenu',            
            /**
             * @event beforecontainermousedown
             * Fires before the mousedown event on the container is processed. Returns false to cancel the default action.
             * @param {Ext.DataView} this
             * @param {Ext.EventObject} e The raw event object
             */
            'beforecontainermousedown',
            /**
             * @event beforecontainermouseup
             * Fires before the mouseup event on the container is processed. Returns false to cancel the default action.
             * @param {Ext.DataView} this
             * @param {Ext.EventObject} e The raw event object
             */
            'beforecontainermouseup',
            /**
             * @event beforecontainermouseover
             * Fires before the mouseover event on the container is processed. Returns false to cancel the default action.
             * @param {Ext.DataView} this
             * @param {Ext.EventObject} e The raw event object
             */
            'beforecontainermouseover',
            /**
             * @event beforecontainermouseout
             * Fires before the mouseout event on the container is processed. Returns false to cancel the default action.
             * @param {Ext.DataView} this
             * @param {Ext.EventObject} e The raw event object
             */
            'beforecontainermouseout',
            /**
             * @event beforecontainerclick
             * Fires before the click event on the container is processed. Returns false to cancel the default action.
             * @param {Ext.DataView} this
             * @param {Ext.EventObject} e The raw event object
             */
            'beforecontainerclick',
            /**
             * @event beforecontainerdblclick
             * Fires before the dblclick event on the container is processed. Returns false to cancel the default action.
             * @param {Ext.DataView} this
             * @param {Ext.EventObject} e The raw event object
             */
            'beforecontainerdblclick',
            /**
             * @event beforecontainercontextmenu
             * Fires before the contextmenu event on the container is processed. Returns false to cancel the default action.
             * @param {Ext.DataView} this
             * @param {Ext.EventObject} e The raw event object
             */
            'beforecontainercontextmenu',
            /**
             * @event containermouseup
             * Fires when there is a mouse up on the container
             * @param {Ext.DataView} this
             * @param {Ext.EventObject} e The raw event object
             */
            'containermouseup',
            /**
             * @event containermouseover
             * Fires when you move the mouse over the container.
             * @param {Ext.DataView} this
             * @param {Ext.EventObject} e The raw event object
             */
            'containermouseover',
            /**
             * @event containermouseout
             * Fires when you move the mouse out of the container.
             * @param {Ext.DataView} this
             * @param {Ext.EventObject} e The raw event object
             */
            'containermouseout',
            /**
             * @event containerclick
             * Fires when the container is clicked.
             * @param {Ext.DataView} this
             * @param {Ext.EventObject} e The raw event object
             */
            'containerclick',
            /**
             * @event containerdblclick
             * Fires when the container is double clicked.
             * @param {Ext.DataView} this
             * @param {Ext.EventObject} e The raw event object
             */
            'containerdblclick',
            /**
             * @event containercontextmenu
             * Fires when the container is right clicked.
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
    
    setRootNode: function() {
        return this.store.setRootNode.apply(this.store, arguments);
    },
    
    getRootNode: function() {
        return this.store.getRootNode();
    },
    
    onRootChange: function(store, root) {
        this.view.setRootNode(root);
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