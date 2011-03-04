/**
 * @class Ext.layout.container.Border
 * @extends Ext.layout.Container
 * <p>This is a multi-pane, application-oriented UI layout style that supports multiple
 * nested panels, automatic bars between regions and built-in
 * {@link Ext.panel.Panel#collapsible expanding and collapsing} of regions.</p>
 * <p>This class is intended to be extended or created via the <code>layout:'border'</code>
 * {@link Ext.container.Container#layout} config, and should generally not need to be created directly
 * via the new keyword.</p>
 * <p>Example usage:</p>
 * <pre><code>
var myBorderPanel = new Ext.panel.Panel({
    {@link Ext.Component#renderTo renderTo}: document.body,
    {@link Ext.AbstractComponent#width width}: 700,
    {@link Ext.AbstractComponent#height height}: 500,
    {@link Ext.panel.Panel#title title}: 'Border Layout',
    {@link Ext.container.Container#layout layout}: 'border',
    {@link Ext.container.Container#items items}: [{
        {@link Ext.panel.Panel#title title}: 'South Region is resizable',
        {@link Ext.layout.BorderLayout.Region#BorderLayout.Region region}: 'south',     // position for region
        {@link Ext.AbstractComponent#height height}: 100,
        {@link Ext.layout.BorderLayout.Region#split split}: true,         // enable resizing
        {@link Ext.layout.BorderLayout.Region#margins margins}: '0 5 5 5'
    },{
        // xtype: 'panel' implied by default
        {@link Ext.panel.Panel#title title}: 'West Region is collapsible',
        {@link Ext.layout.BorderLayout.Region#BorderLayout.Region region}:'west',
        {@link Ext.layout.BorderLayout.Region#margins margins}: '5 0 0 5',
        {@link Ext.AbstractComponent#width width}: 200,
        {@link Ext.layout.BorderLayout.Region#collapsible collapsible}: true,   // make collapsible
        {@link Ext.Component#id id}: 'west-region-container',
        {@link Ext.container.Container#layout layout}: 'fit',
        {@link Ext.panel.Panel#unstyled unstyled}: true
    },{
        {@link Ext.panel.Panel#title title}: 'Center Region',
        {@link Ext.layout.BorderLayout.Region#BorderLayout.Region region}: 'center',     // center region is required, no width/height specified
        {@link Ext.Component#xtype xtype}: 'container',
        {@link Ext.container.Container#layout layout}: 'fit',
        {@link Ext.layout.BorderLayout.Region#margins margins}: '5 5 0 0'
    }]
});
</code></pre>
 * <p><b><u>Notes</u></b>:</p><div class="mdetail-params"><ul>
 * <li>Any Container using the Border layout <b>must</b> have a child item with <code>region:'center'</code>.
 * The child item in the center region will always be resized to fill the remaining space not used by
 * the other regions in the layout.</li>
 * <li>Any child items with a region of <code>west</code> or <code>east</code> may be configured with either
 * an initial <code>width</code>, or a {@link Ext.layout.container.Box#flex} value, or an initial percentage width <b>string</b> (Which is simply divided by 100 and used as a flex value). The 'center' region has a flex value of <code>1</code>.</li>
 * <li>Any child items with a region of <code>north</code> or <code>south</code> may be configured with either
 * an initial <code>height</code>, or a {@link Ext.layout.container.Box#flex} value, or an initial percentage height <b>string</b> (Which is simply divided by 100 and used as a flex value). The 'center' region has a flex value of <code>1</code>.</li>
 * <li>The regions of a BorderLayout are <b>fixed at render time</b> and thereafter, its child Components may not be removed or added</b>.To add/remove
 * Components within a BorderLayout, have them wrapped by an additional Container which is directly
 * managed by the BorderLayout.  If the region is to be collapsible, the Container used directly
 * by the BorderLayout manager should be a Panel.  In the following example a Container (an Ext.panel.Panel)
 * is added to the west region:<pre><code>
wrc = {@link Ext#getCmp Ext.getCmp}('west-region-container');
wrc.{@link Ext.container.Container#removeAll removeAll}();
wrc.{@link Ext.container.Container#add add}({
    title: 'Added Panel',
    html: 'Some content'
});
 * </code></pre>
 * </li>
 * <li><b>There is no BorderLayout.Region class in ExtJS 4.0+</b></li>
 * </ul></div>
 */
Ext.define('Ext.layout.container.Border', {

    alias: ['layout.border'],

    extend: 'Ext.layout.Container',

    requires: ['Ext.resizer.Splitter', 'Ext.container.Container', 'Ext.util.MixedCollection', 'Ext.fx.Anim'],

    uses: ['Ext.fx.Anim'],

    targetCls: Ext.baseCSSPrefix + 'border-layout-ct',

    itemCls: Ext.baseCSSPrefix + 'border-item',

    bindToOwnerCtContainer: true,

    fixedLayout: false,

    percentageRe: /(\d+)%/,

    slideDirection: {
        north: 't',
        south: 'b',
        west: 'l',
        east: 'r'
    },

    constructor: function(config) {
        this.initialConfig = config;
        this.callParent(arguments);
    },

    onLayout: function() {
        var me = this;
        if (!me.borderLayoutInitialized) {
            me.initializeBorderLayout();
        }

        // Delegate this operation to the shadow "V" or "H" box layout, and then down to any embedded layout.
        me.shadowLayout.onLayout();
        if (me.embeddedContainer) {
            me.embeddedContainer.layout.onLayout();
        }

        // If the panel was originally configured with collapsed: true, it will have
        // been initialized with a "borderCollapse" flag: Collapse it now before the first layout.
        if (!me.initialCollapsedComplete) {
            Ext.iterate(me.regions, function(name, region){
                if (region.borderCollapse) {
                    me.onBeforeRegionCollapse(region, region.collapseDirection, false, 0);
                }
            });
            me.initialCollapsedComplete = true;
        }
    },

    isValidParent : function(item, target, position) {
        if (!this.borderLayoutInitialized) {
            this.initializeBorderLayout();
        }

        // Delegate this operation to the shadow "V" or "H" box layout.
        return this.shadowLayout.isValidParent(item, target, position);
    },

    beforeLayout: function() {
        if (!this.borderLayoutInitialized) {
            this.initializeBorderLayout();
        }

        // Delegate this operation to the shadow "V" or "H" box layout.
        this.shadowLayout.beforeLayout();
    },

    renderItems: function(items, target) {
        throw 'This should not be called';
    },

    renderItem: function(item) {
        throw 'This should not be called';
    },

    initializeBorderLayout: function() {
        var me = this,
            i = 0,
            items = me.getLayoutItems(),
            ln = items.length,
            regions = (me.regions = {}),
            vBoxItems = [],
            hBoxItems = [],
            horizontalFlex = 0,
            verticalFlex = 0,
            comp, percentage;

        // Map of Splitters for each region
        me.splitters = {};

        // Map of regions
        for (; i < ln; i++) {
            comp = items[i];
            regions[comp.region] = comp;

            // Intercept collapsing to implement showing an alternate Component as a collapsed placeHolder
            if (comp.region != 'center' && comp.collapsible && comp.collapseMode != 'header' && comp.collapseMode != 'mini') {

                // This layout intercepts any initial collapsed state. Panel must not do this itself.
                comp.borderCollapse = comp.collapsed;
                delete comp.collapsed;

                comp.on({
                    beforecollapse: me.onBeforeRegionCollapse,
                    beforeexpand: me.onBeforeRegionExpand,
                    destroy: me.onRegionDestroy,
                    scope: me
                });
            }
        }
        if (!regions.center) {
            throw "No center region defined in BorderLayout.";
        }
        comp = regions.center;
        if (!comp.flex) {
            comp.flex = 1;
        }
        delete comp.width;
        comp.maintainFlex = true;

        // Begin the VBox and HBox item list.
        comp = regions.west;
        if (comp) {
            comp.collapseDirection = Ext.Component.DIRECTION_LEFT;
            hBoxItems.push(comp);
            if (comp.split) {
                hBoxItems.push(me.splitters.west = me.createSplitter(comp));
            }
            percentage = Ext.isString(comp.width) && comp.width.match(me.percentageRe);
            if (percentage) {
                horizontalFlex += (comp.flex = parseInt(percentage[1], 10) / 100);
                delete comp.width;
            }
        }
        comp = regions.north;
        if (comp) {
            comp.collapseDirection = Ext.Component.DIRECTION_TOP;
            vBoxItems.push(comp);
            if (comp.split) {
                vBoxItems.push(me.splitters.north = me.createSplitter(comp));
            }
            percentage = Ext.isString(comp.height) && comp.height.match(me.percentageRe);
            if (percentage) {
                verticalFlex += (comp.flex = parseInt(percentage[1], 10) / 100);
                delete comp.height;
            }
        }

        // Decide into which Collection the center region goes.
        if (regions.north || regions.south) {
            if (regions.east || regions.west) {

                // Create the embedded center. Mark it with the region: 'center' property so that it can be identified as the center.
                vBoxItems.push(me.embeddedContainer = new Ext.container.Container({
                    xtype: 'container',
                    region: 'center',
                    id: me.owner.id + '-embedded-center',
                    cls: Ext.baseCSSPrefix + 'border-item',
                    flex: regions.center.flex,
                    maintainFlex: true,
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    }
                }));
                hBoxItems.push(regions.center);
            }
            // No east or west: the original center goes straight into the vbox
            else {
                vBoxItems.push(regions.center);
            }
        }
        // If we have no north or south, then the center is part of the HBox items
        else {
            hBoxItems.push(regions.center);
        }

        // Finish off the VBox and HBox item list.
        comp = regions.south;
        if (comp) {
            comp.collapseDirection = Ext.Component.DIRECTION_BOTTOM;
            if (comp.split) {
                vBoxItems.push(me.splitters.south = me.createSplitter(comp));
            }
            percentage = Ext.isString(comp.height) && comp.height.match(me.percentageRe);
            if (percentage) {
                verticalFlex += (comp.flex = parseInt(percentage[1], 10) / 100);
                delete comp.height;
            }
            vBoxItems.push(comp);
        }
        comp = regions.east;
        if (comp) {
            comp.collapseDirection = Ext.Component.DIRECTION_RIGHT;
            if (comp.split) {
                hBoxItems.push(me.splitters.east = me.createSplitter(comp));
            }
            percentage = Ext.isString(comp.width) && comp.width.match(me.percentageRe);
            if (percentage) {
                horizontalFlex += (comp.flex = parseInt(percentage[1], 10) / 100);
                delete comp.width;
            }
            hBoxItems.push(comp);
        }

        // Create the injected "items" collections for the Containers.
        // If we have north or south, then the shadow Container will be a VBox.
        // If there are also east or west regions, its center will be a shadow HBox.
        // If there are *only* east or west regions, then the shadow layout will be an HBox (or Fit).
        if (regions.north || regions.south) {

            me.shadowContainer = new Ext.container.Container({
                ownerCt: me.owner,
                el: me.getTarget(),
                layout: Ext.applyIf({
                    type: 'vbox',
                    align: 'stretch'
                }, me.initialConfig)
            });
            // Have to inject an items Collection *after* construction.
            // The child items of the shadow layout must retain their original, user-defined ownerCt
            me.shadowContainer.items = new Ext.util.MixedCollection();
            me.shadowContainer.items.addAll(vBoxItems);

            // Allow the Splitters to orientate themselves
            if (me.splitters.north) {
                me.splitters.north.ownerCt = me.shadowContainer;
            }
            if (me.splitters.south) {
                me.splitters.south.ownerCt = me.shadowContainer;
            }

            // Inject items into the HBox Container if there is one - if there was an east or west.
            if (me.embeddedContainer) {
                me.embeddedContainer.ownerCt = me.shadowContainer;

                // Have to inject an items Collection *after* construction.
                me.embeddedContainer.items = new Ext.util.MixedCollection();
                me.embeddedContainer.items.addAll(hBoxItems);

                // Allow the Splitters to orientate themselves
                if (me.splitters.east) {
                    me.splitters.east.ownerCt = me.embeddedContainer;
                }
                if (me.splitters.west) {
                    me.splitters.west.ownerCt = me.embeddedContainer;
                }

                // The east or west region wanted a percentage
                if (horizontalFlex) {
                    regions.center.flex -= horizontalFlex;
                }
                // The north or south region wanted a percentage
                if (verticalFlex) {
                    me.embeddedContainer.flex -= verticalFlex;
                }
            } else {
                // The north or south region wanted a percentage
                if (verticalFlex) {
                    regions.center.flex -= verticalFlex;
                }
            }
        }
        // If we have no north or south, then there's only one Container, and it's
        // an HBox, or, if only a center region was specified, a Fit.
        else {
            me.shadowContainer = new Ext.container.Container({
                ownerCt: me.owner,
                el: me.getTarget(),
                layout: Ext.applyIf({
                    type: (hBoxItems.length == 1) ? 'fit' : 'hbox',
                    align: 'stretch'
                }, me.initialConfig)
            });
            // Have to inject an items Collection *after* construction.
            // The child items of the shadow layout must retain their original, user-defined ownerCt
            me.shadowContainer.items = new Ext.util.MixedCollection();
            me.shadowContainer.items.addAll(hBoxItems);

            // Allow the Splitters to orientate themselves
            if (me.splitters.east) {
                me.splitters.east.ownerCt = me.shadowContainer;
            }
            if (me.splitters.west) {
                me.splitters.west.ownerCt = me.shadowContainer;
            }

            // The east or west region wanted a percentage
            if (horizontalFlex) {
                regions.center.flex -= verticalFlex;
            }
        }

        // Create upward links from the region Components to their shadow ownerCts
        for (i = 0, items = me.shadowContainer.items.items, ln = items.length; i < ln; i++) {
            items[i].shadowOwnerCt = me.shadowContainer;
        }
        if (me.embeddedContainer) {
            for (i = 0, items = me.embeddedContainer.items.items, ln = items.length; i < ln; i++) {
                items[i].shadowOwnerCt = me.embeddedContainer;
            }
        }

        // This is the layout that we delegate all operations to
        me.shadowLayout = me.shadowContainer.getLayout();

        me.borderLayoutInitialized = true;
    },

    // Private
    // Create a splitter for a child of the layout.
    createSplitter: function(comp) {
        var me = this,
            interceptCollapse = (comp.collapseMode != 'header' && comp.collapseMode != 'mini'),
            resizer;
            
        resizer = new Ext.resizer.Splitter({
            hidden: !!comp.hidden,
            collapseTarget: comp,
            performCollapse: !interceptCollapse,
            listeners: interceptCollapse ? {
                click: {
                    fn: Ext.Function.bind(me.onSplitterCollapseClick, me, [comp]),
                    element: 'collapseEl'
                }
            } : null
        });
        comp.on({
            hide: Ext.Function.bind(me.onComponentHide, me, [resizer], 1),
            show: Ext.Function.bind(me.onComponentShow, me, [resizer], 1)
        });
        return resizer;
    },

    onComponentHide: function(comp, resizer){
        resizer.hide();
        this.layout();
    },

    onComponentShow: function(comp, resizer){
        resizer.show();
        this.layout();
    },

    // Called when a splitter mini-collapse tool is clicked on.
    // The listener is only added if this layout is controlling collapsing,
    // not if the component's collapseMode is 'mini' or 'header'.
    onSplitterCollapseClick: function(comp) {
        if (comp.collapsed) {
            this.onPlaceHolderToolClick(null, null, null, {client: comp});
        } else {
            comp.collapse();
        }
    },

    /**
     * <p>Return the {@link Ext.panel.Panel#placeHolder placeHolder} Component to which the passed child Panel of the layout will collapse.
     * By default, this will be a {@link Ext.panel.Header Header} component (Docked to the appropriate border). See {@link Ext.panel.Panel#placeHolder placeHolder}.
     * config to customize this.</p>
     * <p><b>Note that this will be a fully instantiated Component, but will only be <i>rendered</i> when the Panel is first collapsed.</b></p>
     * @param {Panel} panel The child Panel of the layout for which to return the {@link Ext.panel.Panel#placeHolder placeHolder}.
     * @returns {Component} The Panel's {@link Ext.panel.Panel#placeHolder placeHolder} unless the {@link Ext.panel.Panel#collapseMode collapseMode} is
     * <code>'mini'</code> or <code>'header'</code>, in which case <i>undefined</i> is returned.
     */
    getPlaceHolder: function(comp) {
        var me = this,
            placeHolder = comp.placeHolder,
            shadowContainer = comp.shadowOwnerCt,
            shadowLayout = shadowContainer.layout,
            oppositeDirection = Ext.panel.Panel.prototype.getOppositeDirection(comp.collapseDirection),
            horiz = (comp.region == 'north' || comp.region == 'south');

        // No placeHolder if the collapse mode is not the Border layout default
        if ((comp.collapseMode == 'mini') || (comp.collapseMode == 'header')) {
            return;
        }

        // Provide a replacement Container with an expand tool
        if (!placeHolder) {
            placeHolder = {
                id: 'collapse-placeholder-' + comp.id,
                margins: comp.initialConfig.margins,
                xtype: 'header',
                orientation: horiz ? 'horizontal' : 'vertical',
                title: comp.title,
                textCls: comp.headerTextCls,
                iconCls: comp.iconCls,
                baseCls: comp.baseCls + '-header',
                ui: comp.ui,
                indicateDrag: comp.draggable,
                cls: Ext.baseCSSPrefix + 'region-collapsed-placeholder ' + Ext.baseCSSPrefix + 'region-collapsed-' + comp.collapseDirection + '-placeholder',
                listeners: {
                    click: {
                        fn: function(e) {
                            me.floatCollapsedPanel(e, comp);
                        },
                        element: 'el'
                    }
                }
            };
            // Hack for IE6/7's inability to display an inline-block
            if ((Ext.isIE6 || Ext.isIE7) && !horiz) {
                placeHolder.width = 22;
            }
            placeHolder[horiz ? 'tools' : 'items'] = [{
                xtype: 'tool',
                client: comp,
                type: 'expand-' + oppositeDirection,
                handler: me.onPlaceHolderToolClick,
                scope: me
            }];
        }
        placeHolder = me.owner.createComponent(placeHolder);

        // The collapsed Component holds a reference to its placeHolder
        comp.placeHolder = placeHolder;

        return placeHolder;
    },

    /**
     * @private
     * Calculates the size and positioning of the passed child item. Must be present because Panel's expand,
     * when configured with a flex, calls this method on its ownerCt's layout.
     * @param {Component} child The child Component to calculate the box for
     * @return {Object} Object containing box measurements for the child. Properties are left,top,width,height.
     */
    calculateChildBox: function(comp) {
        var me = this;
        if (me.shadowContainer.items.contains(comp)) {
            return me.shadowContainer.layout.calculateChildBox(comp);
        }
        else if (me.embeddedContainer && me.embeddedContainer.items.contains(comp)) {
            return me.embeddedContainer.layout.calculateChildBox(comp);
        }
    },

    /**
     * @private
     * Intercepts the Panel's own collapse event and perform's substitution of the Panel
     * with a placeholder Header orientated in the appropriate dimension.
     * @param comp The Panel being collapsed.
     * @param direction
     * @param animate
     * @param newSize
     * @returns {Boolean} false to inhibit the Panel from performing its own collapse.
     */
    onBeforeRegionCollapse: function(comp, direction, animate, newSize) {
        var me = this,
            compEl = comp.el,
            shadowContainer = comp.shadowOwnerCt,
            shadowLayout = shadowContainer.layout,
            centerComp = shadowContainer.child('[region=center]'),
            placeHolder = comp.placeHolder,
            placeHolderBox,
            targetSize = shadowLayout.getLayoutTargetSize(),
            sl = me.owner.suspendLayout,
            scsl = shadowContainer.suspendLayout,
            isNorthOrWest = (comp.region == 'north' || comp.region == 'west'); // Flag to keep the placeHolder non-adjacent to any Splitter

        // Do not trigger a layout during transition to collapsed Component
        me.owner.suspendLayout = true;
        shadowContainer.suspendLayout = true;

        // Prevent upward notifications from downstream layouts
        shadowLayout.layoutBusy = true;
        if (shadowContainer.componentLayout) {
            shadowContainer.componentLayout.layoutBusy = true;
        }
        me.shadowContainer.layout.layoutBusy = true;
        me.layoutBusy = true;
        me.owner.componentLayout.layoutBusy = true;

        // Provide a replacement Container with an expand tool
        if (!placeHolder) {
            placeHolder = me.getPlaceHolder(comp);
        }

        // placeHolder already in place; show it.
        if (placeHolder.shadowOwnerCt === shadowContainer) {
            placeHolder.show();
        }
        // Insert the collapsed placeHolder Component into the appropriate Box layout shadow Container
        // It must go next to its client Component, but non-adjacent to the splitter so splitter can find its collapse client.
        // Inject an ownerCt value pointing to the owner, border layout Container as the user will expect.
        else {
            shadowContainer.insert(shadowContainer.items.indexOf(comp) + (isNorthOrWest ? 0 : 1), placeHolder);
            placeHolder.shadowOwnerCt = shadowContainer;
            placeHolder.ownerCt = me.owner;
        }

        // Flag the collapsing Component as hidden and show the placeHolder.
        // This causes the shadow Box layout's calculateChildBoxes to calculate the correct new arrangement.
        // We hide or slideOut the Component's element
        comp.hidden = true;

        if (!placeHolder.rendered) {
            shadowLayout.renderItem(placeHolder, shadowLayout.innerCt);
        }

        // Jobs to be done after the collapse has been done
        function afterCollapse() {

            // Reinstate automatic laying out.
            me.owner.suspendLayout = sl;
            shadowContainer.suspendLayout = scsl;
            delete shadowLayout.layoutBusy;
            if (shadowContainer.componentLayout) {
                delete shadowContainer.componentLayout.layoutBusy;
            }
            delete me.shadowContainer.layout.layoutBusy;
            delete me.layoutBusy;
            delete me.owner.componentLayout.layoutBusy;

            // Fire the collapse event: The Panel has in fact been collapsed, but by substitution of an alternative Component
            comp.collapsed = true;
            comp.fireEvent('collapse', comp);
        }

        /**
         * Set everything to the new positions. Note that we
         * only want to animate the collapse if it wasn't configured
         * initially with collapsed: true
         */
        if (comp.animCollapse && me.initialCollapsedComplete) {
            shadowLayout.layout();
            compEl.dom.style.zIndex = 100;
            placeHolder.el.hide();
            compEl.slideOut(me.slideDirection[comp.region], {
                duration: Ext.num(comp.animCollapse, Ext.fx.Anim.prototype.duration),
                listeners: {
                    afteranimate: function() {
                        compEl.show().setLeftTop(-10000, -10000);
                        compEl.dom.style.zIndex = '';
                        placeHolder.el.slideIn(me.slideDirection[comp.region], {
                            easing: 'linear',
                            duration: 100
                        });
                        afterCollapse();
                    }
                }
            });
        } else {
            compEl.setLeftTop(-10000, -10000);
            shadowLayout.layout();
            afterCollapse();
        }

        return false;
    },

    // Calculate a position just off screen in the collapse direction to prime a slide-in operation
    getCollapsedPosition: function(comp) {
        var result = {},
            shadowContainer = comp.shadowOwnerCt,
            shadowLayout = shadowContainer.layout,
            targetSize = shadowLayout.getLayoutTargetSize();

        if (comp.region == 'north') {
            result.top = -comp.el.getHeight();
        }
        else if (comp.region == 'south') {
            result.top = targetSize.height;
        }
        else {
            result.top = shadowLayout.padding.top;
        }

        if (comp.region == 'west') {
            result.left = -comp.el.getWidth();
        }
        else if (comp.region == 'east') {
            result.left = targetSize.width;
        }
        else {
            result.left = shadowLayout.padding.left;
        }
        return result;
    },

    // Hijack the expand operation to remove the placeholder and slide the region back in.
    onBeforeRegionExpand: function(comp, animate) {
        this.onPlaceHolderToolClick(null, null, null, {client: comp});
        return false;
    },

    // Called when the collapsed placeHolder is clicked to reinstate a "collapsed" (in reality hidden) Panel.
    onPlaceHolderToolClick: function(e, target, owner, tool) {
        var me = this,
            comp = tool.client,
            compEl = comp.el,
            toCompBox,
            placeHolder = comp.placeHolder,
            placeHolderEl = placeHolder.el,
            shadowContainer = comp.shadowOwnerCt,
            shadowLayout = shadowContainer.layout,
            curSize,
            sl = me.owner.suspendLayout,
            scsl = shadowContainer.suspendLayout,
            isFloating;

        // If the slide in is still going, stop it.
        // This will either leave the Component in its fully floated state (which is processed below)
        // or in its collapsed state. Either way, we expand it..
        if (comp.hasActiveFx()) {
            comp.stopFx();
        }

        // If the Component is fully floated when they click the placeHolder Tool,
        // it will be primed with a slide out animation object... so delete that
        // and remove the mouseout listeners
        if (comp.slideOutAnim) {
            // Remove mouse leave monitors
            compEl.un(comp.panelMouseMon);
            placeHolderEl.un(comp.placeHolderMouseMon);

            delete comp.slideOutAnim;
            delete comp.panelMouseMon;
            delete comp.placeHolderMouseMon;

            // If the Panel was floated and primed with a slideOut animation, we don't want to animate its layout operation.
            isFloating = true;
        }

        // Do not trigger a layout during transition to expanded Component
        me.owner.suspendLayout = true;
        shadowContainer.suspendLayout = true;

        // Prevent upward notifications from downstream layouts
        shadowLayout.layoutBusy = true;
        if (shadowContainer.componentLayout) {
            shadowContainer.componentLayout.layoutBusy = true;
        }
        me.shadowContainer.layout.layoutBusy = true;
        me.layoutBusy = true;
        me.owner.componentLayout.layoutBusy = true;

        // Unset the hidden and collapsed flags set in onBeforeRegionCollapse. The shadowLayout will now take it into account
        // Find where the shadow Box layout plans to put the expanding Component.
        comp.hidden = false;
        comp.collapsed = false;
        placeHolder.hidden = true;
        toCompBox = shadowLayout.calculateChildBox(comp);
        // If we're going to animate, we need to hide the component before moving it back into position
        if (comp.animCollapse && !isFloating) {
            compEl.setStyle('visibility', 'hidden');
        }
        compEl.setLeftTop(toCompBox.left, toCompBox.top);
        comp.hidden = true;

        // Equalize the size of the expanding Component prior to animation
        // in case the layout area has changed size during the time it was collapsed.
        curSize = comp.getSize();
        if (curSize.height != toCompBox.height || curSize.width != toCompBox.width) {
            me.setItemSize(comp, toCompBox.width, toCompBox.height);
        }

        // Jobs to be done after the expand has been done
        function afterExpand() {
            // Reinstate automatic laying out.
            me.owner.suspendLayout = sl;
            shadowContainer.suspendLayout = scsl;
            delete shadowLayout.layoutBusy;
            if (shadowContainer.componentLayout) {
                delete shadowContainer.componentLayout.layoutBusy;
            }
            delete me.shadowContainer.layout.layoutBusy;
            delete me.layoutBusy;
            delete me.owner.componentLayout.layoutBusy;

            // In case it was floated out and they clicked the re-expand tool
            comp.removeCls(Ext.baseCSSPrefix + 'border-region-slide-in');

            // Fire the expand event: The Panel has in fact been expanded, but by substitution of an alternative Component
            comp.fireEvent('expand', comp);
        }

        // Show the collapse tool in case it was hidden by the slide-in
        if (comp.collapseTool) {
            comp.collapseTool.show();
        }

        // Slide the expanding Component to its new position.
        // When that is done, layout the layout.
        if (comp.animCollapse && !isFloating) {
            placeHolder.el.hide();
            compEl.dom.style.zIndex = 100;
            compEl.slideIn(me.slideDirection[comp.region], {
                duration: Ext.num(comp.animCollapse, Ext.fx.Anim.prototype.duration),
                listeners: {
                    afteranimate: function() {
                        compEl.dom.style.zIndex = '';
                        comp.hidden = false;
                        shadowLayout.onLayout();
                        afterExpand();
                    }
                }
            });
        } else {
            comp.hidden = false;
            shadowLayout.onLayout();
            afterExpand();
        }
    },

    floatCollapsedPanel: function(e, comp) {
        var me = this,
            compEl = comp.el,
            placeHolder = comp.placeHolder,
            placeHolderEl = placeHolder.el,
            shadowContainer = comp.shadowOwnerCt,
            shadowLayout = shadowContainer.layout,
            placeHolderBox = shadowLayout.getChildBox(placeHolder),
            scsl = shadowContainer.suspendLayout,
            curSize, toCompBox, compAnim;

        // Ignore clicks on tools.
        if (e.getTarget('.' + Ext.baseCSSPrefix + 'tool')) {
            return;
        }

        // It's *being* animated, ignore the click.
        // Possible future enhancement: Stop and *reverse* the current active Fx.
        if (compEl.hasActiveFx()) {
            return;
        }

        // If the Component is already fully floated when they click the placeHolder,
        // it will be primed with a slide out animation object... so slide it out.
        if (comp.slideOutAnim) {
            me.slideOutFloatedComponent(comp);
            return;
        }

        // Function to be called when the mouse leaves the floated Panel
        // Slide out when the mouse leaves the region bounded by the slid Component and its placeHolder.
        function onMouseLeaveFloated(e) {
            var slideRegion = compEl.getRegion().union(placeHolderEl.getRegion()).adjust(1, -1, -1, 1);

            // If mouse is not within slide Region, slide it out
            if (!slideRegion.contains(e.getPoint())) {
                me.slideOutFloatedComponent(comp);
            }
        }

        // Do not trigger a layout during slide out of the Component
        shadowContainer.suspendLayout = true;

        // Prevent upward notifications from downstream layouts
        me.layoutBusy = true;
        me.owner.componentLayout.layoutBusy = true;

        // Set flags so that the layout will calculate the boxes for what we want
        comp.hidden = false;
        comp.collapsed = false;
        placeHolder.hidden = true;

        // Recalculate new arrangement of the Component being floated.
        toCompBox = shadowLayout.calculateChildBox(comp);
        placeHolder.hidden = false;

        // Component to appear just after the placeholder, whatever "after" means in the context of the shadow Box layout.
        if (comp.region == 'north' || comp.region == 'west') {
            toCompBox[shadowLayout.parallelBefore] += placeHolderBox[shadowLayout.parallelPrefix] - 1;
        } else {
            toCompBox[shadowLayout.parallelBefore] -= (placeHolderBox[shadowLayout.parallelPrefix] - 1);
        }
        compEl.setStyle('visibility', 'hidden');
        compEl.setLeftTop(toCompBox.left, toCompBox.top);

        // Equalize the size of the expanding Component prior to animation
        // in case the layout area has changed size during the time it was collapsed.
        curSize = comp.getSize();
        if (curSize.height != toCompBox.height || curSize.width != toCompBox.width) {
            me.setItemSize(comp, toCompBox.width, toCompBox.height);
        }

        // This animation slides the collapsed Component's el out to just beyond its placeHolder
        compAnim = {
            listeners: {
                afteranimate: function() {
                    shadowContainer.suspendLayout = scsl;
                    delete me.layoutBusy;
                    delete me.owner.componentLayout.layoutBusy;

                    // Prime the Component with an Anim config object to slide it back out
                    compAnim.listeners = {
                        afterAnimate: function() {
                            compEl.show().removeCls(Ext.baseCSSPrefix + 'border-region-slide-in').setLeftTop(-10000, -10000);

                            // Reinstate the correct, current state after slide out animation finishes
                            comp.hidden = true;
                            comp.collapsed = true;
                            delete comp.slideOutAnim;
                            delete comp.panelMouseMon;
                            delete comp.placeHolderMouseMon;
                        }
                    };
                    comp.slideOutAnim = compAnim;
                }
            },
            duration: 500
        };

        // The collapse tool is hidden while slid.
        // It is re-shown on expand.
        if (comp.collapseTool) {
            comp.collapseTool.hide();
        }

        // Give the element the correct class which places it at a high z-index
        compEl.addCls(Ext.baseCSSPrefix + 'border-region-slide-in');

        // Begin the slide in
        compEl.slideIn(me.slideDirection[comp.region], compAnim);

        // Monitor for mouseouting of the slid area. Hide it is they exit for half a second or more
        comp.panelMouseMon = compEl.monitorMouseLeave(500, onMouseLeaveFloated);
        comp.placeHolderMouseMon = placeHolderEl.monitorMouseLeave(500, onMouseLeaveFloated);

    },

    slideOutFloatedComponent: function(comp) {
        var compEl = comp.el,
            slideOutAnim;

        // Remove mouse leave monitors
        compEl.un(comp.panelMouseMon);
        comp.placeHolder.el.un(comp.placeHolderMouseMon);

        // Slide the Component out
        compEl.slideOut(this.slideDirection[comp.region], comp.slideOutAnim);

        delete comp.slideOutAnim;
        delete comp.panelMouseMon;
        delete comp.placeHolderMouseMon;
    },

    /*
     * @private
     * Ensure any collapsed placeHolder Component is destroyed along with its region.
     * Can't do this in onDestroy because they may remove a Component and use it elsewhere.
     */
    onRegionDestroy: function(comp) {
        Ext.destroy(comp.placeHolder);
    },

    /*
     * @private
     * Ensure any shadow Containers are destroyed.
     * Ensure we don't keep references to Components.
     */
    onDestroy: function() {
        var me = this,
            shadowContainer = me.shadowContainer,
            embeddedContainer = me.embeddedContainer;

        if (shadowContainer) {
            delete shadowContainer.ownerCt;
        }

        if (embeddedContainer) {
            Ext.destroy(embeddedContainer);
        }
        delete me.regions;
        delete me.splitters;
        delete me.shadowContainer;
        delete me.embeddedContainer;
        me.callParent(arguments);
    }
});