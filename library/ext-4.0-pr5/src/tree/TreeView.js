/**
 * @class Ext.tree.TreeView
 * @extends Ext.view.TableView
 */
Ext.define('Ext.tree.TreeView', {
    extend: 'Ext.view.TableView',
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
    animate: Ext.enableFx,
    
    expandDuration: 250,
    collapseDuration: 250,
    
    initComponent: function() {
        var me = this;
        me.store = Ext.create('Ext.data.NodeStore', {
            node: me.treeStore.getRootNode(),
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
            
        me.callParent(arguments);        
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
            click: me.onExpanderClick,
            mouseover: me.onExpanderMouseOver,
            mouseout: me.onExpanderMouseOut
        });
    },
    
    onDblClick: function(e) {
        this.callParent(arguments);
        var item = e.getTarget(this.getItemSelector(), this.getTargetEl());
        if (item) {
            this.toggle(this.getRecord(item));
        }
    },
    
    afterRender: function(){
        this.callParent();
        // Expand the root node if it's not visible, otherwise we have an empty tree
        if (!this.rootVisible && !this.treeStore.getRootNode().isExpanded()) {
            this.treeStore.getRootNode().expand();
        }    
    },
    
    createAnimWrap: function(parent, index) {
        var thHtml = '',
            headerCt = this.panel.headerCt,
            headers = headerCt.query('gridheader'),
            i = 0, ln = headers.length, item,
            tmpEl;
            
        for (; i < ln; i++) {
            item = headers[i];
            thHtml += '<th style="width: ' + (item.hidden ? 0 : item.getDesiredWidth()) + 'px; height: 0px;"></th>';
        }
        
        parent = Ext.get(parent);        
        tmpEl = parent.insertSibling({
            tag: 'tr',
            html: [
                '<td colspan="' + headerCt.getCount() + '">',
                    '<div class="' + Ext.baseCSSPrefix + 'tree-animator-wrap' + '">',
                        '<table class="' + Ext.baseCSSPrefix + 'grid-table" style="width: ' + headerCt.getFullWidth() + 'px;"><tbody>',
                            thHtml,
                        '</tbody></table>',
                    '</div>',
                '</td>'
            ].join('')
        }, 'after');
        
        return {
            index: index,
            el: tmpEl,
            animateEl: tmpEl.down('div'),
            targetEl: tmpEl.down('tbody')      
        };
    },
    
    getAnimWrap: function(parent) {
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

        // If there is an anim wrap we do our special magic logic
        targetEl = animWrap.targetEl;
        children = targetEl.dom.childNodes;
        
        // We subtract 1 from the childrens length because we have a tr in there with the th'es
        ln = children.length-1;
        
        // The relative index is the index in the full flat collection minus the index of the wraps parent
        relativeIndex = index - animWrap.index;
        
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
        parentNode = this.getNode(parent);
        if (parentNode) {
            var animWrap = this.getAnimWrap(parent);
            if (!animWrap) {
                parent.animWrap = this.createAnimWrap(parentNode, index);
                parent.animWrap.animateEl.setHeight(0);
                parent.animWrap.collapsing = false;
                parent.animWrap.expanding = true;
            }
            else {
                animWrap.targetEl.select(this.itemSelector).remove();
            }
        }
    },
        
    onExpand: function(parent) {
        var animWrap = this.getAnimWrap(parent),
            animateEl, targetEl;

        if (!animWrap) {
            return;
        }
        
        animateEl = animWrap.animateEl;
        targetEl = animWrap.targetEl;
        
        animateEl.stopFx();
        animateEl.animate({
            to: {
                height: targetEl.getHeight() + 'px'
            },
            duration: this.expandDuration,
            listeners: {
                lastframe: function() {
                    // Move all the nodes out of the anim wrap to their proper location
                    animWrap.el.insertSibling(targetEl.query(this.itemSelector), 'before');
                    animWrap.el.remove();
                    this.panel.invalidateScroller();
                    delete parent.animWrap;
                },
                scope: this                
            }
        });
    },

    onBeforeCollapse: function(parent, records, index) {
        parentNode = this.getNode(parent);
        if (parentNode) {
            var animWrap = this.getAnimWrap(parent);
            if (!animWrap) {
                parent.animWrap = this.createAnimWrap(parentNode, index);
                parent.animWrap.collapsing = true;
                parent.animWrap.expanding = false;
            }
            else {
                animWrap.targetEl.select(this.itemSelector).remove();
            }
        }
    },
    
    onCollapse: function(parent) {
        var animWrap = this.getAnimWrap(parent),
            animateEl, targetEl;

        if (!animWrap) {
            return;
        }
        
        animateEl = animWrap.animateEl;
        targetEl = animWrap.targetEl;

        animateEl.stopFx();
        animateEl.animate({
            to: {
                height: '0px'
            },
            duration: this.collapseDuration,
            listeners: {
                lastframe: function() {
                    animWrap.el.remove();
                    delete parent.animWrap;
                    this.panel.invalidateScroller();
                },
                scope: this                
            }
        });
    },
        
    // maintain expanded status when a record is updated.
    getRowClass: function(record) {
        return record.isExpanded() ? this.expandedCls : '';
    },
    
    /**
     * Expand a record that is loaded in the view.
     * @param {Ext.data.Record} recordInstance
     */
    expand: function(record, callback, scope) {
        if (!record.isLeaf()) {
            Ext.fly(this.getNode(record)).addCls(this.loadingCls);
            record.expand(callback, scope);        
        }
    },
    
    /**
     * Collapse a record that is loaded in the view.
     * @param {Ext.data.Record} recordInstance
     */
    collapse: function(record, callback, scope) {
        if (!record.isLeaf()) {
            record.collapse(callback, scope);        
        }
    },
    
    /**
     * Toggle a record between expanded and collapsed.
     * @param {Ext.data.Record} recordInstance
     */
    toggle: function(record) {
        this[record.isExpanded() ? 'collapse' : 'expand'](record);
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