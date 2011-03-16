/**
 * @class Ext.tree.FlatTreeView
 * @extends Ext.view.TableView
 */
Ext.define('Ext.tree.FlatTreeView', {
    extend: 'Ext.view.TableView',
    alias: 'widget.flattreeview',

    loadingCls: Ext.baseCSSPrefix + 'grid-tree-loading',
    expandedCls: Ext.baseCSSPrefix + 'grid-tree-node-expanded',

    expanderSelector: '.' + Ext.baseCSSPrefix + 'tree-expander',
    expanderIconOverCls: Ext.baseCSSPrefix + 'tree-expander-over',

    blockRefresh: true,

    onRender: function() {
        var me = this,
            opts = {delegate: me.expanderSelector},
            el;
            
        me.callParent(arguments);
        el = me.el;
        el.on('click', me.onExpanderClick, this, opts);
        el.on('mouseover', me.onExpanderMouseOver, this, opts);
        el.on('mouseout', me.onExpanderMouseOut, this, opts);
    },

    // maintain expanded status when a record is updated.
    getRowClass: function(record) {
        return record.expanded ? this.expandedCls : '';
    },
    
    /**
     * Expand a record that is loaded in the view.
     * @param {Ext.data.Record} recordInstance
     */
    expand: function(record, callback, scope) {
        var recordNode = record.node;
        
        if (!recordNode.isLeaf()) {
            this.doExpand(record, false, null, callback, scope);
        }
    },
    
    // recursive method to do an expand
    doExpand: function(record, suppressStatusChange, rootRecord, callback, scope) {
        var panel = this.ownerCt,
            recordNode = record.node,
            htmlEl = this.getNode(record),
            expandedCls = this.expandedCls,
            loadingCls = this.loadingCls;

        if (!rootRecord) {
            rootRecord = record;
            Ext.apply(rootRecord, {
                loading: 0
            });
        }
        
        if (!suppressStatusChange) {
            record.expanded = true;
        }
        
        // Lets increment the amount of substore loading operations on the record
        rootRecord.loading++;
        
        // indicate loading starts
        Ext.fly(htmlEl).addCls(loadingCls);      
        panel.store.getSubStore(record, function(records) {
            Ext.fly(htmlEl).removeCls(loadingCls);
            if (record.expanded) {
                var iterRecord,
                    i = 0,
                    ln = records.length;
                    
                // loading over
                Ext.fly(htmlEl).addCls(expandedCls);
                this.store.insert(this.indexOf(record) + 1, records);
                
                for (; i < ln; i++) {
                    iterRecord = records[i];
                    if (!iterRecord.node.isLeaf() && iterRecord.expanded) {
                        // recurse
                        this.doExpand(iterRecord, true, rootRecord, callback, scope);
                    }
                }
                
                rootRecord.loading--;
                if (rootRecord.loading == 0 && callback) {
                    callback.call(scope || this);
                }
                
                panel.invalidateScroller();
            }
        }, this);

    },
    
    /**
     * Collapse a record that is loaded in the view.
     * @param {Ext.data.Record} recordInstance
     */
    collapse: function(record, callback, scope) {
        var recordNode = record.node;
            
        if (!recordNode.isLeaf()) {
            this.doCollapse(record);
            if (callback) {
                callback.call(scope || this);
            }
        }
    },
    
    // recursive method to do a collapse
    doCollapse: function(record, suppressStatusChange) {
        var panel = this.ownerCt,
            recordNode = record.node,
            htmlEl = this.getNode(record),
            expandedCls = this.expandedCls;
            
        if (!suppressStatusChange) {
            record.expanded = false;
        }
        
        panel.store.getSubStore(record, function(records) {
            var iterRecord,
                i = 0,
                ln = records.length;


            if (htmlEl) {
                Ext.fly(htmlEl).removeCls(expandedCls);
            }
            for (; i < ln; i++) {
                iterRecord = records[i];
                if (!iterRecord.node.isLeaf() && iterRecord.expanded) {
                    // recurse
                    this.doCollapse(iterRecord, true);
                }
            }
            this.store.remove(records);
            panel.invalidateScroller();
        }, this);
    },
    
    /**
     * Toggle a record between expanded and collapsed.
     * @param {Ext.data.Record} recordInstance
     */
    toggle: function(record) {
        this[record.expanded ? 'collapse' : 'expand'](record);
    },
    
    // toggle the record
    onExpanderClick: function(e, t) {
        e.stopEvent();
        var node = e.getTarget(this.getItemSelector());
        this.toggle(this.getRecord(node));
    },
    
    onExpanderMouseOver: function(e, t) {
        Ext.fly(t).up(this.cellSelector).addCls(this.expanderIconOverCls);
    },
    
    onExpanderMouseOut: function(e, t) {
        Ext.fly(t).up(this.cellSelector).removeCls(this.expanderIconOverCls);
    },
    
    // cancel click events from being fired when a user clicks on
    // the expander.
    onItemClick: function(item, index, e) {
        var result = this.callParent(arguments),
            isExpander = e.getTarget(this.expanderSelector);
        return result && !isExpander;
    },
    
    // cancel mousedown events from being fired when a user clicks on
    // the expander.
    onItemMouseDown: function(item, index, e) {
        var result = this.callParent(arguments),
            isExpander = e.getTarget(this.expanderSelector);
        return result && !isExpander;
    },
    
    /**
     * Gets the base TreeStore from the bound TreePanel.
     */
    getTreeStore: function() {
        return this.panel.store;
    }
});