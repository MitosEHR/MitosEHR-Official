/**
 * @class Ext.AbstractPanel
 * @extends Ext.container.Container
 * <p>A base class which provides methods common to Panel classes across the Sencha product range.</p>
 * <p>Please refer to sub class's documentation</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('Ext.AbstractPanel', {

    /* Begin Definitions */

    extend: 'Ext.container.Container',

    requires: ['Ext.util.MixedCollection', 'Ext.core.Element', 'Ext.toolbar.Toolbar'],

    /* End Definitions */

    /**
     * @cfg {String} baseCls
     * The base CSS class to apply to this panel's element (defaults to <code>'x-panel'</code>).
     */
    baseCls : Ext.baseCSSPrefix + 'panel',

    /**
     * @cfg {Number/String} bodyPadding
     * A shortcut for setting a padding style on the body element. The value can either be
     * a number to be applied to all sides, or a normal css string describing padding.
     * Defaults to <code>undefined</code>.
     */

    /**
     * @cfg {Number/String} bodyMargin
     * A shortcut for setting a margin style on the body element. The value can either be
     * a number to be applied to all sides, or a normal css string describing margins.
     * Defaults to <code>undefined</code>.
     */

    /**
     * @cfg {Number/String} bodyBorder
     * A shortcut for setting a border style on the body element. The value can either be
     * a number to be applied to all sides, or a normal css string describing borders.
     * Defaults to <code>undefined</code>.
     */

    isPanel: true,

    componentLayout: 'dock',

    renderTpl: ['<div class="{baseCls}-body<tpl if="bodyCls"> {bodyCls}</tpl>"<tpl if="bodyStyle"> style="{bodyStyle}"</tpl>></div>'],

    // TODO: Move code examples into product-specific files. The code snippet below is Touch only.
    /**
     * @cfg {Object/Array} dockedItems
     * A component or series of components to be added as docked items to this panel.
     * The docked items can be docked to either the top, right, left or bottom of a panel.
     * This is typically used for things like toolbars or tab bars:
     * <pre><code>
var panel = new Ext.panel.Panel({
    fullscreen: true,
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [{
            text: 'Docked to the top'
        }]
    }]
});</pre></code>
     */

    initComponent : function() {
        var me = this;
        
        me.addEvents(
            /**
             * @event bodyresize
             * Fires after the Panel has been resized.
             * @param {Ext.panel.Panel} p the Panel which has been resized.
             * @param {Number} width The Panel body's new width.
             * @param {Number} height The Panel body's new height.
             */
            'bodyresize'
            // // inherited
            // 'activate',
            // // inherited
            // 'deactivate'
        );

        Ext.applyIf(me.renderSelectors, {
            body: '.' + me.baseCls + '-body'
        });
        me.callParent();
    },

    // @private
    initItems : function() {
        var me = this,
            items = me.dockedItems;
            
        me.callParent();
        me.dockedItems = new Ext.util.MixedCollection(false, me.getComponentId);
        if (items) {
            me.addDocked(items);
        }
    },

    /**
     * Finds a docked component by id, itemId or position. Also see {@link #getDockedItems}
     * @param {String/Number} comp The id, itemId or position of the docked component (see {@link #getComponent} for details)
     * @return {Ext.Component} The docked component (if found)
     */
    getDockedComponent: function(comp) {
        if (Ext.isObject(comp)) {
            comp = comp.getItemId();
        }
        return this.dockedItems.get(comp);
    },

    /**
     * Attempts a default component lookup (see {@link Ext.container.Container#getComponent}). If the component is not found in the normal
     * items, the dockedItems are searched and the matched component (if any) returned (see {@loink #getDockedComponent}). Note that docked
     * items will only be matched by component id or itemId -- if you pass a numeric index only non-docked child components will be searched.
     * @param {String/Number} comp The component id, itemId or position to find
     * @return {Ext.Component} The component (if found)
     */
    getComponent: function(comp) {
        var component = this.callParent(arguments);
        if (component == undefined && !Ext.isNumber(comp)) {
            // If the arg is a numeric index skip docked items
            component = this.getDockedComponent(comp);
        }
        return component;
    },

    /**
     * Function description
     * @return {String} A CSS style string with style, padding, margin and border.
     * @private
     */
    initBodyStyles: function() {
        var me = this,
            bodyStyle = Ext.isString(me.bodyStyle) ? me.bodyStyle.split(';') : [],
            Element = Ext.core.Element;

        if (me.bodyPadding != undefined) {
            bodyStyle.push('padding: ' + Element.unitizeBox((me.bodyPadding === true) ? 5 : me.bodyPadding));
        }
        if (me.bodyMargin != undefined) {
            bodyStyle.push('margin: ' + Element.unitizeBox((me.bodyMargin === true) ? 5 : me.bodyMargin));
        }
        if (me.bodyBorder != undefined) {
            bodyStyle.push('border-width: ' + Element.unitizeBox((me.bodyBorder === true) ? 1 : me.bodyBorder));
        }
        delete me.bodyStyle;
        return bodyStyle.length ? bodyStyle.join(';') : undefined;
    },

    /**
     * Initialized the renderData to be used when rendering the renderTpl.
     * @return {Object} Object with keys and values that are going to be applied to the renderTpl
     * @private
     */
    initRenderData: function() {
        return Ext.applyIf(this.callParent(), {
            bodyStyle: this.initBodyStyles(),
            bodyCls: this.bodyCls
        });
    },

    /**
     * Adds docked item(s) to the panel.
     * @param {Object/Array} component. The Component or array of components to add. The components
     * must include a 'dock' parameter on each component to indicate where it should be docked ('top', 'right',
     * 'bottom', 'left').
     * @param {Number} pos (optional) The index at which the Component will be added
     */
    addDocked : function(items, pos) {
        var me = this, item, i, ln;
        items = me.prepareItems(items);

        for (i = 0, ln = items.length; i < ln; i++) {
            item = items[i];
            item.dock = item.dock || 'top';

            // Allow older browsers to target docked items to style without borders
            if (me.border === false) {
                item.cls = item.cls || '' + ' ' + me.baseCls + '-noborder-docked-' + item.dock;
            }

            if (pos !== undefined) {
                me.dockedItems.insert(pos + i, item);
            }
            else {
                me.dockedItems.add(item);
            }
            item.onAdded(me, i);
            me.onDockedAdd(item);
        }
        if (me.rendered) {
            me.doComponentLayout();
        }
        return items;
    },

    // Placeholder empty functions
    onDockedAdd : Ext.emptyFn,
    onDockedRemove : Ext.emptyFn,

    /**
     * Inserts docked item(s) to the panel at the indicated position.
     * @param {Number} pos The index at which the Component will be inserted
     * @param {Object/Array} component. The Component or array of components to add. The components
     * must include a 'dock' paramater on each component to indicate where it should be docked ('top', 'right',
     * 'bottom', 'left').
     */
    insertDocked : function(pos, items) {
        this.addDocked(items, pos);
    },

    /**
     * Removes the docked item from the panel.
     * @param {Ext.Component} item. The Component to remove.
     * @param {Boolean} autoDestroy (optional) Destroy the component after removal.
     */
    removeDocked : function(item, autoDestroy) {
        if (!this.dockedItems.contains(item)) {
            return item;
        }

        var layout = this.componentLayout,
            hasLayout = layout && this.rendered;

        if (hasLayout) {
            layout.onRemove(item);
        }

        this.dockedItems.remove(item);
        item.onRemoved();
        this.onDockedRemove(item);

        if (autoDestroy === true || (autoDestroy !== false && this.autoDestroy)) {
            item.destroy();
        }

        if (hasLayout && !autoDestroy) {
            layout.afterRemove(item);
        }
        this.doComponentLayout();

        return item;
    },

    /**
     * Retrieve an array of all currently docked Components.
     * @param {String} cqSelector A {@link Ext.ComponentQuery ComponentQuery} selector string to filter the returned items.
     * @return {Array} An array of components.
     */
    getDockedItems : function(cqSelector) {
        var me = this,
            dockedItems,
            i, len;

        if (me.dockedItems && me.dockedItems.items.length) {

            // Allow filtering of returned docked items by CQ selector.
            if (cqSelector) {
                dockedItems = Ext.ComponentQuery.query(cqSelector, me.dockedItems.items);
            } else {
                dockedItems = me.dockedItems.items.slice();
            }

            dockedItems.sort(function(a, b) {
                var aw = a.weight || 0,
                    bw = b.weight || 0;
                if (Ext.isNumber(aw) && Ext.isNumber(bw)) {
                    return aw - bw;
                }
                return 0;
            });
            return dockedItems;
        }
        return [];
    },

    // @private
    getTargetEl : function() {
        return this.body;
    },

    getRefItems: function(deep) {
        // deep fetches all docked items, and their descendants using '*' selector and then '* *'
        return this.callParent(arguments).concat(this.getDockedItems(deep ? '*,* *' : undefined));
    },

    beforeDestroy: function(){
        var docked = this.dockedItems,
            c;

        if (docked) {
            while ((c = docked.first())) {
                this.removeDocked(c, true);
            }
        }
        this.callParent();
    }
});