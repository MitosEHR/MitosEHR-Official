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
    
    viewType: 'flattreeview',
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
    
    initComponent: function() {
        var me = this,
            optionalCls = '';

        if (me.lines) {
            optionalCls += ' ' + Ext.baseCSSPrefix + 'tree-lines';
        }
        if (me.useArrows) {
            optionalCls += ' ' + Ext.baseCSSPrefix + 'tree-arrows';
        }
        me.cls = me.cls + optionalCls;
        me.callParent();
    },
    
    getViewStore: function(node) {
        var store = this.store;
        return store.getSubStore(node ? node : store.getRootNode());
    }
});