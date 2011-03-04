/**
 * @class Ext.layout.container.Accordion
 * @extends Ext.layout.container.VBox
 * <p>This is a layout that manages multiple Panels in an expandable accordion style such that only
 * <b>one Panel can be expanded at any given time</b>. Each Panel has built-in support for expanding and collapsing.</p>
 * <p>Note: Only Ext.Panels <b>and all subclasses of Ext.panel.Panel</b> may be used in an accordion layout Container.</p>
 * <p>Example usage:</p>
 * <pre><code>
var accordion = new Ext.panel.Panel({
    title: 'Accordion Layout',
    layout:'accordion',
    defaults: {
        // applied to each contained panel
        bodyStyle: 'padding:15px'
    },
    layoutConfig: {
        // layout-specific configs go here
        titleCollapse: false,
        animate: true,
        activeOnTop: true
    },
    items: [{
        title: 'Panel 1',
        html: '&lt;p&gt;Panel content!&lt;/p&gt;'
    },{
        title: 'Panel 2',
        html: '&lt;p&gt;Panel content!&lt;/p&gt;'
    },{
        title: 'Panel 3',
        html: '&lt;p&gt;Panel content!&lt;/p&gt;'
    }]
});
</code></pre>
 */
Ext.define('Ext.layout.container.Accordion', {
    extend: 'Ext.layout.container.VBox',

    alias: ['layout.accordion'],

    align: 'stretch',

    /**
     * @cfg {Boolean} fill
     * <p>Only <b><code>fill: true</code> is supported in PR2.</b></p>
     * True to adjust the active item's height to fill the available space in the container, false to use the
     * item's current height, or auto height if not explicitly set (defaults to true).
     */
    fill : true,
    /**
     * @cfg {Boolean} autoWidth
     * <p><b>This config is ignored in ExtJS 4.x.</b></p>
     * Child Panels have their width actively managed to fit within the accordion's width.
     */
    autoWidth : true,
    /**
     * @cfg {Boolean} titleCollapse
     * <p><b>Not implemented in PR2.</b></p>
     * True to allow expand/collapse of each contained panel by clicking anywhere on the title bar, false to allow
     * expand/collapse only when the toggle tool button is clicked (defaults to true).  When set to false,
     * {@link #hideCollapseTool} should be false also.
     */
    titleCollapse : true,
    /**
     * @cfg {Boolean} hideCollapseTool
     * True to hide the contained panels' collapse/expand toggle buttons, false to display them (defaults to false).
     * When set to true, {@link #titleCollapse} should be true also.
     */
    hideCollapseTool : false,
    /**
     * @cfg {Boolean} collapseFirst
     * True to make sure the collapse/expand toggle button always renders first (to the left of) any other tools
     * in the contained panels' title bars, false to render it last (defaults to false).
     */
    collapseFirst : false,
    /**
     * @cfg {Boolean} animate
     * True to slide the contained panels open and closed during expand/collapse using animation, false to open and
     * close directly with no animation (defaults to <code>true</code>).  Note: The layout performs animated collapsing
     * and expanding, <i>not</i> the child Panels.
     */
    animate : true,
    /**
     * @cfg {Boolean} activeOnTop
     * <p><b>Not implemented in PR2.</b></p>
     * True to swap the position of each panel as it is expanded so that it becomes the first item in the container,
     * false to keep the panels in the rendered order. <b>This is NOT compatible with "animate:true"</b> (defaults to false).
     */
    activeOnTop : false,

    constructor: function() {
        var me = this;

        me.callParent(arguments);

        // animate flag must be false during initial render phase so we don't get animations.
        me.initialAnimate = me.animate;
        me.animate = false;
    },

    // Cannot lay out a fitting accordion before we have been allocated a height.
    // So during render phase, layout will not be performed.
    beforeLayout: function() {
        this.callParent(arguments);
        if (this.fill && !this.owner.el.dom.style.height) {
            return false;
        }
    },

    renderItems : function(items, target) {
        var me = this,
            ln = items.length,
            i = 0,
            comp,
            targetSize = me.getLayoutTargetSize(),
            renderedPanels = [];

        for (; i < ln; i++) {
            comp = items[i];
            if (!comp.rendered) {
                renderedPanels.push(comp);

                // Set up initial properties for Panels in an accordion.
                if (me.collapseFirst) {
                    comp.collapseFirst = me.collapseFirst;
                }

                delete comp.hideHeader;
                comp.collapsible = true;
                comp.title = comp.title || '&#160;';
                comp.border = !(me.owner instanceof Ext.panel.Panel) || me.owner.border === false;

                // Set initial sizes
                comp.width = targetSize.width;
                if (me.fill) {
                    delete comp.height;
                    delete comp.flex;

                    // If there is an expanded item, all others must be rendered collapsed.
                    if (me.expandedItem !== undefined) {
                        comp.collapsed = true;
                    }
                    // Otherwise expand the first item with collapsed explicitly configured as false
                    else if (comp.collapsed === false) {
                        comp.flex = 1;
                        me.expandedItem = i;
                    } else {
                        comp.collapsed = true;
                    }
                }
            }
        }

        // If no collapsed:false Panels found, make the first one expanded.
        if (me.expandedItem === undefined) {
            me.expandedItem = 0;
            comp = items[0];
            comp.collapsed = false;
            if (me.fill) {
                comp.flex = 1;
            }
        }

        // Render all Panels.
        me.callParent(arguments);

        // Postprocess rendered Panels.
        ln = renderedPanels.length;
        for (i = 0; i < ln; i++) {
            comp = renderedPanels[i];

            // Delete the dimension property so that our align: 'stretch' processing manages the width from here
            delete comp.width;

            comp.header.addCls(Ext.baseCSSPrefix + 'accordion-hd');

            // If we are fitting, then intercept expand/collapse requests. 
            if (me.fill) {
                me.owner.mon(comp, {
                    beforeexpand: me.onComponentExpand,
                    beforecollapse: me.onComponentCollapse,
                    scope: me
                });
            }
        }
    },

    // When a Component expands, adjust the heights of the other Components to be just enough to accommodate
    // their headers.
    // The expanded Component receives the only flex value, and so gets all remaining space.
    onComponentExpand: function(toExpand) {
        var it = this.owner.items.items,
            len = it.length,
            i = 0,
            comp;

        for (; i < len; i++) {
            comp = it[i];
            if (comp === toExpand && comp.collapsed) {
                comp.body.show();
                delete comp.collapsed;
                delete comp.height;
                comp.flex = 1;
                comp.el.removeCls(comp.collapsedCls);
                comp.fireEvent('expand', comp);
                comp.collapseTool.setType('collapse-' + comp.collapseDirection);
            } else if (comp !== toExpand && !comp.collapsed) {
                comp.height = comp.header.getHeight();
                comp.collapsed = true;
                delete comp.flex;
                comp.el.addCls(comp.collapsedCls);
                comp.fireEvent('collapse', comp);
                comp.collapseTool.setType('expand-' + comp.getOppositeDirection(comp.collapseDirection));
            }
        }
        this.animate = this.initialAnimate;
        this.layout();
        this.animate = false;
        return false;
    },

    onComponentCollapse: function(comp) {
        var toExpand = comp.next() || comp.prev();

        // Expand the next sibling if possible, prev sibling if we collapsed the last
        if (toExpand) {
            this.onComponentExpand(toExpand);
        }
        return false;
    }
});