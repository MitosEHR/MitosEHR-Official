/**
 * @class Ext.tree.TreeView
 * @extends Ext.view.TableView
 *
 * Currently not in use.
 * @private
 */
Ext.define('Ext.tree.TreeView', {
    extend: 'Ext.view.TableView',
    alias: 'widget.treeview',
    depth: 1,
    
    rowBodyHiddenCls: Ext.baseCSSPrefix + 'grid-row-body-hidden',
    rowCollapsedCls: Ext.baseCSSPrefix + 'grid-row-collapsed',
    loadingCls: Ext.baseCSSPrefix + 'grid-tree-loading',
    expandedCls: Ext.baseCSSPrefix + 'grid-tree-node-expanded',
    
    initComponent: function() {
        this.features = [{
            ftype: 'rowbody',
            rowBodyCls: this.rowBodyHiddenCls
        }];
        this.mutateHeaderCt();
        this.callParent();
        this.on('click', this.onDblClick, this);
    },
    
    onRender: function() {
        this.callParent(arguments);
        // cancel clicking of anchors
        this.el.on('click', function(e) {
            e.stopEvent();
        }, this, {delegate: 'a'});
    },
    
    onRowSelect: function(rowIdx, suppressEvent) {
        this.callParent(arguments);
        if (!suppressEvent) {
            this.focus(rowIdx);
        }
    },
    
    focus: function(nodeInfo) {
        var node = this.getNode(nodeInfo);
        Ext.fly(node).down('a').focus();
    },
    
    setNewTemplate: function() {
        var columns = this.headerCt.getColumnsForTpl();
        this.tpl = this.getTableChunker().getTableTpl({
            columns: columns,
            features: this.features,
            // chop off the first . of the itemSelector
            addlSelector: this.getItemSelector().substr(1)
        });
    },
    
    // guarantee a unique dynamic itemSelector
    getItemSelector: function() {
        return this.itemSelector + '-' + this.id;
    },
    
    // ported
    getRowClass: function(record) {
        return record.expanded ? this.expandedCls : '';
    },
    
    // ported
    mutateHeaderCt: function() {
        var first = this.headerCt.items.first();
        // TODO: Add renderer support by wrapping the original renderer in here.
        first.renderer = function(value, metaData, record, rowIdx, colIdx, store, view) {
            // TODO: Must maintain collapsed/expanded status
            var buf   = [],
                node  = record.node,
                depth = node.getDepth(),
                baseCSSPrefix = Ext.baseCSSPrefix,
                imgText = '<img src="' + Ext.BLANK_IMAGE_URL + '" class="{0}" />';

            while (node) {
                if (!node.isRoot || (node.isRoot && view.panel.rootVisible)) {
                    if (node.getDepth() === view.depth) {
                        buf.unshift(Ext.String.format(imgText, baseCSSPrefix + 'tree-icon ' + baseCSSPrefix + 'tree-icon' + (node.leaf ? '-leaf' : '-parent')));
                        if (node.isLast()) {
                            if (node.leaf) {
                                buf.unshift(Ext.String.format(imgText, (baseCSSPrefix + 'tree-elbow-end')));
                            } else {
                                buf.unshift(Ext.String.format(imgText, (baseCSSPrefix + 'tree-elbow-end-plus')));
                            }
                            
                        } else {
                            if (node.leaf) {
                                buf.unshift(Ext.String.format(imgText, (baseCSSPrefix + 'tree-elbow')));
                            } else {
                                buf.unshift(Ext.String.format(imgText, (baseCSSPrefix + 'tree-elbow-plus')));
                            }
                            
                        }
                    } else {
                        if (node.isLast()) {
                            buf.unshift(Ext.String.format(imgText, (baseCSSPrefix + 'tree-elbow-empty')));
                        } else {
                            buf.unshift(Ext.String.format(imgText, (baseCSSPrefix + 'tree-elbow-line')));
                        }
                        
                    }
                }
                node = node.parentNode;
            }
            return buf.join("") + Ext.String.format('<a href="">{0}</a>', value);
        };
    },
    
    expand: function(nodeInfo) {
        if (nodeInfo) {
            var node = this.getNode(nodeInfo),
                record = this.getRecord(node),
                nextTr, bd, subStore, sm, depth;

            if (!record.node.isLeaf()) {
                nextTr = Ext.fly(node).next();
                bd = nextTr.down('.' + Ext.baseCSSPrefix + 'grid-rowbody');
    
                if (!record.node.loaded && !record.node.isLeaf()) {
                    depth = record.node.getDepth() + 1;
                    
                    // indicate loading starts
                    Ext.fly(node).addCls(this.loadingCls);
                    subStore = this.panel.store.getSubStore(record, function() {
                        // loading over
                        Ext.fly(node).addCls(this.expandedCls);
                        Ext.fly(node).removeCls(this.loadingCls);
                        nextTr.removeCls(this.rowBodyHiddenCls);
                    }, this);
                    
                    sm = new Ext.tree.SelectionModel();
                    record.subView = new Ext.tree.TreeView({
                        selModel: sm,
                        headerCt: this.headerCt,
                        panel: this.panel,
                        store: subStore,
                        renderTo: bd,
                        depth: depth
                    });
                    sm.view = record.subView;
                    record.expanded = true;
                }
                if (!record.expanded) {
                    Ext.fly(node).addCls(this.expandedCls);
                    nextTr = Ext.fly(node).next();
                    bd = nextTr.down('.' + Ext.baseCSSPrefix + 'grid-rowbody');
                    nextTr.removeCls(this.rowBodyHiddenCls);
                }
            }
        }
    },
    
    collapse: function(nodeInfo) {
        if (nodeInfo) {
            var node = this.getNode(nodeInfo),
                record = this.getRecord(node),
                bd, nextTr;

            if (record.expanded) {
                Ext.fly(node).removeCls(this.expandedCls);
                nextTr = Ext.fly(node).next();
                nextTr.addCls(this.rowBodyHiddenCls);
                bd = Ext.fly(node).next().down('.' + Ext.baseCSSPrefix + 'grid-rowbody');

                record.expanded = false;
            }
        }
    },
    
    toggle: function(record) {
        var node = this.getNode(record);
        this[record.expanded ? 'collapse' : 'expand'](node);
    },
    
    getChildIndent : function(){
        if(!this.childIndent){
            var buf = [],
                i   = -1;
            for (; i < this.depth; i++) {
                buf.push('-> ');
            }
            this.childIndent = buf.join("");
        }
        return this.childIndent;
    },
    
    onDblClick: function(dv, idx, node, e) {
        if (node.tagName) {
            var r = this.getRecord(node);
            this.toggle(r);
        }
        
    },
    
    onRowFocus: Ext.emptyFn
});