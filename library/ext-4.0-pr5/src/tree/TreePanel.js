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
     * @cfg {Boolean} sortableHeaders
     * Hide this configuration. The TreeStore does not currently support sorting.
     * @private
     */
    sortableHeaders: false,
    
    // @TODO: implement following config options
    singleExpand: false,
    ddConfig: {
        enableDrag: true,
        enableDrop: true
    },
    /** 
     * @cfg {Boolean} animate <tt>true</tt> to enable animated expand/collapse (defaults to the value of {@link Ext#enableFx Ext.enableFx})
     */
    animate: Ext.enableFx,
    
            
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

   
    initComponent: function() {
        var me = this,
            optionalCls = '';

        if (me.useArrows) {
            optionalCls += ' ' + Ext.baseCSSPrefix + 'tree-arrows';
            me.lines = false;
        }
        if (me.lines) {
            optionalCls += ' ' + Ext.baseCSSPrefix + 'tree-lines';
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
            animate: me.animate,
            singleExpand: me.singleExpand,
            treeStore: me.store
        });
        
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
        
        me.cls = me.cls + optionalCls;
        me.callParent();
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