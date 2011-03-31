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
    
    expandDuration: 250,
    collapseDuration: 250,
    
    initComponent: function() {
        var me = this;
        
        if (me.initialConfig.animate === undefined) {
            me.animate = Ext.enableFx;
        }
        
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
        //return this.getTreeStore().filter('checked', true);
        // @TODO: implement this function
    },
    
    afterRender: function(){
        this.callParent();
        // Expand the root node if it's not visible, otherwise we have an empty tree
        if (!this.rootVisible && !this.treeStore.getRootNode().isExpanded()) {
            this.treeStore.getRootNode().expand();
        }    
    },
    
    createAnimWrap: function(record, index) {
        var thHtml = '',
            headerCt = this.panel.headerCt,
            headers = headerCt.query('gridheader'),
            i = 0, ln = headers.length, item,
            node = this.getNode(record),
            tmpEl, parentEl;
            
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
        relativeIndex = index - this.indexOf(parent);
        
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
                parent.animWrap = this.createAnimWrap(parent);
                // @TODO: we are setting it to 1 because quirks mode on IE seems to have issues with 0
                parent.animWrap.animateEl.setHeight(1);
                parent.animWrap.expanding = true;
            }
            else {
                animWrap.targetEl.select(this.itemSelector).remove();
            }            
        }
    },
    
    onExpand: function(parent) {
        if (this.singleExpand) {
            this.ensureSingleExpand(parent);
        }
        
        var animWrap = this.getAnimWrap(parent),
            animateEl, targetEl;

        if (!animWrap) {
            this.panel.determineScrollbars();
            this.panel.invalidateScroller();
            return;
        }
        
        animateEl = animWrap.animateEl;
        targetEl = animWrap.targetEl;

        animateEl.stopFx();
        // @TODO: we are setting it to 1 because quirks mode on IE seems to have issues with 0
        animateEl.animate({
            from: {
                height: animateEl.getHeight() + 'px'
            },
            to: {
                height: targetEl.getHeight() + 'px'
            },
            duration: this.expandDuration,
            listeners: {
                lastframe: function() {
                    // Move all the nodes out of the anim wrap to their proper location
                    animWrap.el.insertSibling(targetEl.query(this.itemSelector), 'before');
                    animWrap.el.remove();
                    this.panel.determineScrollbars();
                    this.panel.invalidateScroller();
                    delete parent.animWrap;
                },
                scope: this                
            }
        });
        animWrap.isAnimating = true;
    },

    onBeforeCollapse: function(parent, records, index) {
        if (!this.animate) {
            return;
        }

        if (this.getNode(parent)) {
            var animWrap = this.getAnimWrap(parent);
            if (!animWrap) {
                parent.animWrap = this.createAnimWrap(parent, index);
                parent.animWrap.collapsing = true;
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
            this.panel.determineScrollbars();
            this.panel.invalidateScroller();
            return;
        }
        
        animateEl = animWrap.animateEl;
        targetEl = animWrap.targetEl;

        // @TODO: we are setting it to 1 because quirks mode on IE seems to have issues with 0
        animateEl.stopFx();
        animateEl.animate({
            from: {
                height: animateEl.getHeight() + 'px'
            },
            to: {
                height: '1px'
            },
            duration: this.collapseDuration,
            listeners: {
                lastframe: function() {
                    animWrap.el.remove();
                    delete parent.animWrap;
                    this.panel.determineScrollbars();
                    this.panel.invalidateScroller();
                },
                scope: this                
            }
        });
        animWrap.isAnimating = true;
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
    
    onItemDblClick: function(record, item, index) {
        this.callParent(arguments);
        this.toggle(record);
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