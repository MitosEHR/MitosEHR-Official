/**
 * @class Ext.grid.GroupingFeature
 * @extends Ext.grid.Feature
 * 
 * The Grouping Feature enhances a grid view's markup to support grouping at
 * any arbitrary depth via recursion.
 *
 * Will expose additional events on the gridview with the prefix of 'group'.
 * For example: 'groupclick', 'groupdblclick', 'groupcontextmenu'.
 * 
 * @xtype grouping
 */

Ext.define('Ext.grid.GroupingFeature', {
    extend: 'Ext.grid.Feature',
    alias: 'feature.grouping',

    eventPrefix: 'group',
    eventSelector: '.' + Ext.baseCSSPrefix + 'grid-group-hd',

    
    /**
     * @event groupclick
     * @param {Ext.grid.View} view
     * @param {HTMLElement} node
     * @param {Number} unused
     * @param {Number} unused
     * @param {Ext.EventObject} e
     */
    
    /**
     * @event groupdblclick
     * @param {Ext.grid.View} view
     * @param {HTMLElement} node
     * @param {Number} unused
     * @param {Number} unused
     * @param {Ext.EventObject} e
     */
    
    /**
     * @event groupcontextmenu
     * @param {Ext.grid.View} view
     * @param {HTMLElement} node
     * @param {Number} unused
     * @param {Number} unused
     * @param {Ext.EventObject} e
     */
    
    /**
     * @event groupcollapse
     * @param {Ext.grid.View} view
     * @param {HTMLElement} node
     * @param {Number} unused
     * @param {Number} unused
     * @param {Ext.EventObject} e
     */
    
    /**
     * @event groupexpand
     * @param {Ext.grid.View} view
     * @param {HTMLElement} node
     * @param {Number} unused
     * @param {Number} unused
     * @param {Ext.EventObject} e
     */
    
    /**
     * @cfg {String} groupHdTpl
     * Template snippet, this cannot be an actual template. {name} will be replaced with the current group.
     * Defaults to 'Group: {name}'
     */
    groupHdTpl: 'Group: {name}',
    
    /**
     * @cfg {Number} depthToIndent
     * Number of pixels to indent per grouping level
     */
    depthToIndent: 17,
    
    collapsedCls: Ext.baseCSSPrefix + 'grid-group-collapsed',
    hdCollapsedCls: Ext.baseCSSPrefix + 'grid-group-hd-collapsed',
    
    /**
     * @cfg {String} groupByText Text displayed in the grid header menu for grouping by a column
     * (defaults to 'Group By This Field').
     */
    groupByText : 'Group By This Field',
    /**
     * @cfg {String} showGroupsText Text displayed in the grid header for enabling/disabling grouping
     * (defaults to 'Show in Groups').
     */
    showGroupsText : 'Show in Groups',
    
    /**
     * @cfg {Boolean} hideGroupedColumn <tt>true</tt> to hide the column that is currently grouped (defaults to <tt>false</tt>)
     */
    hideGroupedColumn : false,
    
    /**
     * @cfg {Boolean} startCollapsed <tt>true</tt> to start all groups collapsed (defaults to <tt>false</tt>)
     */
    startCollapsed : false,
    
    /**
     * @cfg {Boolean} enableGroupingMenu <tt>true</tt> to enable the grouping control in the column menu (defaults to <tt>true</tt>)
     */
    enableGroupingMenu : true,
    
    /**
     * @cfg {Boolean} enableNoGroups <tt>true</tt> to allow the user to turn off grouping (defaults to <tt>true</tt>)
     */
    enableNoGroups : true,
    
    enable: function() {
        Ext.grid.GroupingFeature.superclass.enable.call(this);
        this.groupToggleMenuItem.setChecked(true, true);
    },
    
    disable: function() {
        Ext.grid.GroupingFeature.superclass.disable.call(this);
        this.groupToggleMenuItem.setChecked(false, true);
    },
    
    getFeatureTpl: function(values, parent, x, xcount) {
        return [
            '<tpl if="typeof rows !== \'undefined\'">',
                // group row tpl
                '<tr class="' + Ext.baseCSSPrefix + 'grid-group-hd ' + (this.startCollapsed ? this.hdCollapsedCls : '') + '"><td class="' + Ext.baseCSSPrefix + 'grid-cell" colspan="' + parent.columns.length + '" {[this.indentByDepth(values)]}"><div class="' + Ext.baseCSSPrefix + 'grid-group-title">' + this.groupHdTpl + '</div></td></tr>',
                // this is the rowbody
                '<tr class="' + Ext.baseCSSPrefix + 'grid-group-body ' + (this.startCollapsed ? this.collapsedCls : '') + '"><td colspan="' + parent.columns.length + '">{[this.recurse(values)]}</td></tr>',
            '</tpl>'
        ].join('');
    },
    
    getTplFragments: function() {
        return {
            indentByDepth: this.indentByDepth,
            depthToIndent: this.depthToIndent
        };
    },
    
    indentByDepth: function(values) {
        var depth = values.depth || 0;
        return 'style="padding-left:'+ depth * this.depthToIndent + 'px;"';
    },
    
    // Containers holding these components are responsible for
    // destroying them, we are just deleting references.
    destroy: function() {
        delete this.groupMenuItem;
        delete this.groupToggleMenuItem;
        delete this.view;
        delete this.prunedColumn;
    },
    
    // perhaps rename to afterViewRender
    attachEvents: function() {
        var view = this.view,
            menu;
            
        view.on('groupclick', this.onGroupClick, this);
        view.on('rowfocus', this.onRowFocus, this);
        
        this.pruneGroupedColumn();
        
        if (this.enableGroupingMenu) {
            menu = view.headerCt.getMenu();
            menu.add('-');
            this.groupMenuItem = menu.add({
                text: this.groupByText,
                handler: this.onGroupMenuItemClick,
                scope: this
            });
            
            if (this.enableNoGroups) {
                this.groupToggleMenuItem = menu.add({
                    text: this.showGroupsText,
                    checked: true,
                    checkHandler: this.onGroupToggleMenuItemClick,
                    scope: this
                });
            }
        }
    },
    
    /**
     * Group by the header the user has clicked on.
     * @private
     */
    onGroupMenuItemClick: function(menuItem, e) {
        var menu = menuItem.parentMenu,
            hdr  = menu.activeHeader,
            view = this.view;
            
        view.store.groupField = hdr.dataIndex;
        this.pruneGroupedColumn();
        this.enable();
        view.refresh();
    },
    
    /**
     * Turn on and off grouping via the menu
     * @private
     */
    onGroupToggleMenuItemClick: function(menuItem, checked) {
        this[checked ? 'enable' : 'disable']();
        this.view.refresh();
    },
    
    /**
     * Prunes the grouped column from the header container
     * @private
     */
    pruneGroupedColumn: function() {
        var view       = this.view,
            store      = view.store,
            groupField = store.groupField,
            headerCt   = view.headerCt,
            header     = headerCt.down('header[dataIndex=' + groupField + ']');
            
        if (header) {
            if (this.prunedColumn) {
                this.prunedColumn.show();
            }
            this.prunedColumn = header;
            header.hide();
        }
    },

    
    /**
     * When a row gains focus, expand the groups above it
     * @private
     */
    onRowFocus: function(rowIdx) {
        var node    = this.view.getNode(rowIdx),
            groupBd = Ext.fly(node).up('.' + this.collapsedCls);
            
        if (groupBd) {
            // for multiple level groups, should expand every groupBd
            // above
            this.expand(groupBd);
        }
    },
    
    /**
     * Expand a group by the groupBody
     * @param {Ext.core.Element} groupBd
     * @private
     */
    expand: function(groupBd) {
        var view = this.view,
            grid = view.up('gridpanel');
            
        groupBd.removeCls(this.collapsedCls);
        groupBd.prev().removeCls(this.hdCollapsedCls);
        
        grid.invalidateScroller();
        view.fireEvent('groupexpand');
    },
    
    /**
     * Collapse a group by the groupBody
     * @param {Ext.core.Element} groupBd
     * @private
     */
    collapse: function(groupBd) {
        var view = this.view,
            grid = view.up('gridpanel');

        groupBd.addCls(this.collapsedCls);
        groupBd.prev().addCls(this.hdCollapsedCls);
        
        grid.invalidateScroller();
        view.fireEvent('groupcollapse');
    },
    
    /**
     * Toggle between expanded/collapsed state when clicking on
     * the group.
     * @private
     */
    onGroupClick: function(view, group, idx, foo, e) {
        var toggleCls = this.toggleCls,
            groupBd = Ext.fly(group.nextSibling, '_grouping');

        if (groupBd.hasCls(this.collapsedCls)) {
            this.expand(groupBd);
        } else {
            this.collapse(groupBd);
        }
    },

    // Injects isRow and closeRow into the metaRowTpl.
    getMetaRowTplFragments: function() {
        return {
            isRow: this.isRow,
            closeRow: this.closeRow
        };
    },
    
    // injected into rowtpl and wrapped around metaRowTpl
    // becomes part of the standard tpl
    isRow: function() {
        return '<tpl if="typeof rows === \'undefined\'">';
    },
    
    // injected into rowtpl and wrapped around metaRowTpl
    // becomes part of the standard tpl
    closeRow: function() {
        return '</tpl>';
    },
    
    // isRow and closeRow are injected via getMetaRowTplFragments
    mutateMetaRowTpl: function(metaRowTpl) {
        metaRowTpl.unshift('{[this.isRow()]}');
        metaRowTpl.push('{[this.closeRow()]}');
    },
    
    // injects an additional style attribute via tdAttrKey with the proper
    // amount of padding
    getAdditionalData: function(data, idx, record, orig) {
        var view = this.view,
            hCt  = view.headerCt,
            col  = hCt.items.getAt(0),
            o = {},
            tdAttrKey = col.id + '-tdAttr';
        
        // maintain the current tdAttr that a user may ahve set.
        o[tdAttrKey] = this.indentByDepth(data) + " " + (orig[tdAttrKey] ? orig[tdAttrKey] : '');
        return o;
    },
    

    //// return the data in a grouped format.
    collectData: function(records, startIndex, fullWidth, orig) {
        if (this.disabled) {
            return orig;
        }
        var view   = this.view,
            groups = view.store.getGroups(),
            ln = groups.length,
            i  = 0,
            j, jln;
            
        for (; i < ln; i++) {
            groups[i].fullWidth = fullWidth;
            // need additional check to determine if this is a group or not
            // that way we can invoke GridView directly.
            groups[i].rows = Ext.grid.View.superclass.collectData.call(this.view, groups[i].children, 0);
            for (j = 0, jln = groups[i].rows.length; j < jln; j++) {
                groups[i].rows[j].depth = 1;
            }
            delete groups[i].children;
        }
        
        return {
            rows: groups,
            fullWidth: fullWidth
        };
    }
});