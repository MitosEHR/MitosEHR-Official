/**
 * @class Ext.tree.View
 * @extends Ext.view.Table
 */
Ext.define('Ext.tree.View', {
    extend: 'Ext.view.Table',
    alias: 'widget.treeview',

    loadingCls: Ext.baseCSSPrefix + 'grid-tree-loading',
    expandedCls: Ext.baseCSSPrefix + 'grid-tree-node-expanded',

    expanderSelector: '.' + Ext.baseCSSPrefix + 'tree-expander',
    expanderIconOverCls: Ext.baseCSSPrefix + 'tree-expander-over',

    blockRefresh: true,

    /** 
     * @cfg {Boolean} rootVisible <tt>false</tt> to hide the root node (defaults to <tt>true</tt>)
     */
    rootVisible: true,

    /** 
     * @cfg {Boolean} animate <tt>true</tt> to enable animated expand/collapse (defaults to the value of {@link Ext#enableFx Ext.enableFx})
     */

    expandDuration: 250,
    collapseDuration: 250,
    
    toggleOnDblClick: true,

    initComponent: function() {
        var me = this;
        
        if (me.initialConfig.animate === undefined) {
            me.animate = Ext.enableFx;
        }
        
        me.store = Ext.create('Ext.data.NodeStore', {
            recursive: true,
            rootVisible: me.rootVisible,
            listeners: {
                beforeexpand: me.onBeforeExpand,
                expand: me.onExpand,
                beforecollapse: me.onBeforeCollapse,
                collapse: me.onCollapse,
                scope: me
            }
        });
        
        if (me.node) {
            me.setRootNode(me.node);
        }
        me.animQueue = {};
        me.callParent(arguments);
    },

    setRootNode: function(node) {
        var me = this;        
        me.store.setNode(node);
        me.node = node;
        if (!me.rootVisible) {
            node.expand();
        }
    },
    
    onRender: function() {
        var me = this,
            opts = {delegate: me.expanderSelector},
            el;

        me.callParent(arguments);

        el = me.el;
        el.on({
            scope: me,
            delegate: me.expanderSelector,
            mouseover: me.onExpanderMouseOver,
            mouseout: me.onExpanderMouseOut
        });
        el.on({
            scope: me,
            delegate: me.checkboxSelector,
            change: me.onCheckboxChange
        });
    },

    onCheckboxChange: function(e, t) {
        var item = e.getTarget(this.getItemSelector(), this.getTargetEl()),
            record;
        if (item) {
            record = this.getRecord(item);
            record.set('checked', !record.get('checked'));
        }
    },

    getChecked: function() {
        var checked = [];
        this.node.cascadeBy(function(rec){
            if (rec.get('checked')) {
                checked.push(rec);
            }
        });
        return checked;
    },
    
    isItemChecked: function(rec){
        return rec.get('checked');
    },

    createAnimWrap: function(record, index) {
        var thHtml = '',
            headerCt = this.panel.headerCt,
            headers = headerCt.getGridColumns(),
            i = 0, ln = headers.length, item,
            node = this.getNode(record),
            tmpEl, nodeEl;

        for (; i < ln; i++) {
            item = headers[i];
            thHtml += '<th style="width: ' + (item.hidden ? 0 : item.getDesiredWidth()) + 'px; height: 0px;"></th>';
        }

        nodeEl = Ext.get(node);        
        tmpEl = nodeEl.insertSibling({
            tag: 'tr',
            html: [
                '<td colspan="' + headerCt.getColumnCount() + '">',
                    '<div class="' + Ext.baseCSSPrefix + 'tree-animator-wrap' + '">',
                        '<table class="' + Ext.baseCSSPrefix + 'grid-table" style="width: ' + headerCt.getFullWidth() + 'px;"><tbody>',
                            thHtml,
                        '</tbody></table>',
                    '</div>',
                '</td>'
            ].join('')
        }, 'after');

        return {
            record: record,
            node: node,
            el: tmpEl,
            expanding: false,
            collapsing: false,
            animating: false,
            animateEl: tmpEl.down('div'),
            targetEl: tmpEl.down('tbody')
        };
    },

    getAnimWrap: function(parent) {
        if (!this.animate) {
            return null;
        }

        // We are checking to see which parent is having the animation wrap
        while (parent) {
            if (parent.animWrap) {
                return parent.animWrap;
            }
            parent = parent.parentNode;
        }
        return null;
    },

    doAdd: function(nodes, records, index) {
        // If we are adding records which have a parent that is currently expanding
        // lets add them to the animation wrap
        var record = records[0],
            parent = record.parentNode,
            a = this.all.elements,
            relativeIndex = 0,
            animWrap = this.getAnimWrap(parent),
            targetEl, children, ln;

        if (!animWrap || !animWrap.expanding) {
            return this.callParent(arguments);
        }

        // We need the parent that has the animWrap, not the nodes parent
        parent = animWrap.record;
        
        // If there is an anim wrap we do our special magic logic
        targetEl = animWrap.targetEl;
        children = targetEl.dom.childNodes;
        
        // We subtract 1 from the childrens length because we have a tr in there with the th'es
        ln = children.length-1;
        
        // The relative index is the index in the full flat collection minus the index of the wraps parent
        relativeIndex = index - this.indexOf(parent) - 1;
        
        // If we are adding records to the wrap that have a higher relative index then there are currently children
        // it means we have to append the nodes to the wrap
        if (!ln || relativeIndex >= ln) {
            targetEl.appendChild(nodes);
        }
        // If there are already more children then the relative index it means we are adding child nodes of
        // some expanded node in the anim wrap. In this case we have to insert the nodes in the right location
        else {
            // +1 because of the tr with th'es that is already there
            Ext.fly(children[relativeIndex + 1]).insertSibling(nodes, 'before', true);
        }
        
        // We also have to update the CompositeElementLite collection of the DataView
        if (index < a.length) {
            a.splice.apply(a, [index, 0].concat(nodes));
        }
        else {            
            a.push.apply(a, nodes);
        }
        
        // If we were in an animation we need to now change the animation
        // because the targetEl just got higher.
        if (animWrap.isAnimating) {
            this.onExpand(parent);
        }
    },
    
    doRemove: function(record, index) {
        // If we are adding records which have a parent that is currently expanding
        // lets add them to the animation wrap
        var parent = record.parentNode,
            all = this.all,
            animWrap = this.getAnimWrap(record),
            node = all.item(index).dom;

        if (!animWrap || !animWrap.collapsing) {
            return this.callParent(arguments);
        }

        animWrap.targetEl.appendChild(node);
        all.removeElement(index);
    },

    onBeforeExpand: function(parent, records, index) {
        if (!this.animate) {
            return;
        }

        if (this.getNode(parent)) {
            var animWrap = this.getAnimWrap(parent);
            if (!animWrap) {
                animWrap = parent.animWrap = this.createAnimWrap(parent);
                animWrap.animateEl.setHeight(1);
            }
            else if (animWrap.collapsing) {
                // If we expand this node while it is still expanding then we
                // have to remove the nodes from the animWrap.
                animWrap.targetEl.select(this.itemSelector).remove();
            } 
            animWrap.expanding = true;
            animWrap.collapsing = false;
        }
    },

    onExpand: function(parent) {
        var me = this,
            queue = me.animQueue,
            id = parent.getId(),
            animWrap,
            animateEl, 
            targetEl,
            queueItem;        
        
        if (me.singleExpand) {
            me.ensureSingleExpand(parent);
        }
        
        animWrap = me.getAnimWrap(parent);

        if (!animWrap) {
            me.panel.determineScrollbars();
            me.panel.invalidateScroller();
            return;
        }
        
        animateEl = animWrap.animateEl;
        targetEl = animWrap.targetEl;

        animateEl.stopAnimation();
        // @TODO: we are setting it to 1 because quirks mode on IE seems to have issues with 0
        queue[id] = true;
        animateEl.animate({
            to: {
                height: targetEl.getHeight() + 'px'
            },
            duration: me.expandDuration,
            listeners: {
                scope: me,
                lastframe: function() {
                    // grab data from the queue
                    queueItem = queue[id];
                    
                    // Move all the nodes out of the anim wrap to their proper location
                    animWrap.el.insertSibling(targetEl.query(me.itemSelector), 'before');
                    animWrap.el.remove();
                    me.panel.determineScrollbars();
                    me.panel.invalidateScroller();
                    delete animWrap.record.animWrap;
                    delete queue[id];
                    
                    if (Ext.isObject(queueItem)) {
                        queueItem.handler.call(me, queueItem.nodes);
                    }
                }
            }
        });
        animWrap.isAnimating = true;
    },

    onBeforeCollapse: function(parent, records, index) {
        var me = this,
            animWrap;
            
        if (!me.animate) {
            return;
        }

        if (me.getNode(parent)) {
            animWrap = me.getAnimWrap(parent);
            if (!animWrap) {
                animWrap = parent.animWrap = me.createAnimWrap(parent, index);
            }
            else if (animWrap.expanding) {
                // If we collapse this node while it is still expanding then we
                // have to remove the nodes from the animWrap.
                animWrap.targetEl.select(this.itemSelector).remove();
            }
            animWrap.expanding = false;
            animWrap.collapsing = true;
        }
    },
    
    onCollapse: function(parent) {
        var me = this,
            animWrap = me.getAnimWrap(parent),
            animateEl, targetEl;

        if (!animWrap) {
            me.panel.determineScrollbars();
            me.panel.invalidateScroller();
            return;
        }
        
        animateEl = animWrap.animateEl;
        targetEl = animWrap.targetEl;

        // @TODO: we are setting it to 1 because quirks mode on IE seems to have issues with 0
        animateEl.stopAnimation();
        animateEl.animate({
            to: {
                height: '1px'
            },
            duration: me.collapseDuration,
            listeners: {
                scope: me,
                lastframe: function() {
                    animWrap.el.remove();
                    delete animWrap.record.animWrap;;
                    me.panel.determineScrollbars();
                    me.panel.invalidateScroller();
                }             
            }
        });
        animWrap.isAnimating = true;
    },
    
    /**
     * Checks if a node is currently undergoing animation
     * @private
     * @param {Ext.data.Model} node The node
     * @return {Boolean} True if the node is animating
     */
    isAnimating: function(node) {
        return !!this.animQueue[node.getId()];    
    },
    
    collectData: function(records) {
        var data = this.callParent(arguments),
            rows = data.rows,
            ln = rows.length,
            i, row, record;
            
        for (i = 0; i < ln; i++) {
            row = rows[i];
            record = records[i];
            if (record.get('qtip')) {
                row.rowAttr = 'data-qtip="' + record.get('qtip') + '"';
                if (record.get('qtitle')) {
                    row.rowAttr += ' ' + 'data-qtitle="' + record.get('qtitle') + '"';
                }
            }
            if (record.isExpanded()) {
                row.rowCls = (row.rowCls || '') + ' ' + this.expandedCls;
            }
            if (!record.isLoaded() && (record.isExpanded() || record.expanding)) {
                row.rowCls = (row.rowCls || '') + ' ' + this.loadingCls;
            }
        }
        
        return data;
    },
    
    /**
     * Expand a record that is loaded in the view.
     * @param {Ext.data.Model} record The record to expand
     * @param {Boolean} deep (optional) True to expand nodes all the way down the tree hierarchy.
     * @param {Function} callback (optional) The function to run after the expand is completed
     * @param {Object} scope (optional) The scope of the callback function.
     */
    expand: function(record, deep, callback, scope) {
        var me = this,
            childNodes = record.childNodes;
        
        if (record.isLeaf()) {
            return;
        }
        
        if (!record.isExpanded()) {
            if (deep) {
                record.expand(me.expandChildren, me);
            } else {
                record.expand(callback, scope);
            } 
        } else {
            if (deep && childNodes) {
                me.expandChildren(childNodes);
            } else {
                Ext.callback(callback, scope || record, [childNodes]);
            }
        }
    },
    
    /**
     * Expands an array of child nodes.
     * @private
     * @param {Array} nodes The child nodes
     */
    expandChildren: function(nodes){
        var me = this,
            i = 0,
            len = nodes.length,
            parent;
            
        if (len === 0) {
            return;
        }
        
        parent = nodes[0].parentNode;
        if (me.isAnimating(parent)) {
            me.animQueue[parent.getId()] = {
                nodes: nodes,
                handler: me.expandChildren
            };
            return;
        }
            
        for (; i < len; ++i) {
            me.expand(nodes[i], true);
        }
    },
    
    /**
     * Collapse a record that is loaded in the view.
     * @param {Ext.data.Model} record The record to collapse
     * @param {Boolean} deep (optional) True to collapse nodes all the way up the tree hierarchy.
     * @param {Function} callback (optional) The function to run after the collapse is completed
     * @param {Object} scope (optional) The scope of the callback function.
     */
    collapse: function(record, deep, callback, scope) {
        var me = this,
            childNodes = record.childNodes;
        
        if (record.isLeaf()) {
            return;
        }
        
        if (record.isExpanded()) {
            if (deep) {
                record.collapse(me.collapseChildren, me);
            } else {
                record.collapse(callback, scope);
            } 
        } else {
            if (deep && childNodes) {
                me.collapseChildren(childNodes);
            } else {
                Ext.callback(callback, scope || record, [childNodes]);
            }
        }
    },
    
    /**
     * Collapses an array of child nodes.
     * @private
     * @param {Array} nodes The child nodes
     */
    collapseChildren: function(nodes){
        var me = this,
            i = 0,
            len = nodes.length,
            parent;
            
        if (len === 0) {
            return;
        }
        
        parent = nodes[0].parentNode;
        if (me.isAnimating(parent)) {
            me.animQueue[parent.getId()] = {
                nodes: nodes,
                handler: me.collapseChildren
            };
            return;
        }
            
        for (; i < len; ++i) {
            me.collapse(nodes[i], true);
        }
    },
    
    /**
     * Toggle a record between expanded and collapsed.
     * @param {Ext.data.Record} recordInstance
     */
    toggle: function(record) {
        this[record.isExpanded() ? 'collapse' : 'expand'](record);
    },
    
    onItemDblClick: function(record, item, index) {
        this.callParent(arguments);
        if (this.toggleOnDblClick) {
            this.toggle(record);
        }
    },
    
    onBeforeItemMouseDown: function(record, item, index, e) {
        if (e.getTarget(this.expanderSelector, item)) {
            return false;
        }
        return this.callParent(arguments);
    },
    
    onItemClick: function(record, item, index, e) {
        if (e.getTarget(this.expanderSelector, item)) {
            this.toggle(record);
            return false;
        }
        return this.callParent(arguments);
    },
    
    onExpanderMouseOver: function(e, t) {
        e.getTarget(this.cellSelector, 10, true).addCls(this.expanderIconOverCls);
    },
    
    onExpanderMouseOut: function(e, t) {
        e.getTarget(this.cellSelector, 10, true).removeCls(this.expanderIconOverCls);
    },
    
    /**
     * Gets the base TreeStore from the bound TreePanel.
     */
    getTreeStore: function() {
        return this.panel.store;
    },    
    
    ensureSingleExpand: function(node) {
        var parent = node.parentNode;
        if (parent) {
            parent.eachChild(function(child) {
                if (child !== node && child.isExpanded()) {
                    child.collapse();
                }
            });
        }
    }
});