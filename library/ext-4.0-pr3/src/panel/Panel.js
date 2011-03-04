/**
 * @class Ext.panel.Panel
 * @extends Ext.AbstractPanel
 * <p>Panel is a container that has specific functionality and structural components that make
 * it the perfect building block for application-oriented user interfaces.</p>
 * <p>Panels are, by virtue of their inheritance from {@link Ext.container.Container}, capable
 * of being configured with a {@link Ext.container.Container#layout layout}, and containing child Components.</p>
 * <p>When either specifying child {@link Ext.Component#items items} of a Panel, or dynamically {@link Ext.container.Container#add adding} Components
 * to a Panel, remember to consider how you wish the Panel to arrange those child elements, and whether
 * those child elements need to be sized using one of Ext's built-in <code><b>{@link Ext.container.Container#layout layout}</b></code> schemes. By
 * default, Panels use the {@link Ext.layout.Container ContainerLayout} scheme. This simply renders
 * child components, appending them one after the other inside the Container, and <b>does not apply any sizing</b>
 * at all.</p>
 * <p>A Panel may also contain {@link #bbar bottom} and {@link #tbar top} toolbars, along with separate
 * {@link #header}, {@link #footer} and {@link #body} sections (see {@link #frame} for additional
 * information).</p>
 * <p>Panel also provides built-in {@link #collapsible expandable and collapsible behavior}, along with
 * a variety of {@link #tools prebuilt tool buttons} that can be wired up to provide other customized
 * behavior.  Panels can be easily dropped into any {@link Ext.container.Container Container} or layout, and the
 * layout and rendering pipeline is {@link Ext.container.Container#add completely managed by the framework}.</p>
 * <p><b>Note:</b> By default, the <code>{@link #closable close}</code> header tool <i>destroys</i> the Window resulting in
 * destruction of any child Components. This makes the Window object, and all its descendants <b>unusable</b>. To enable
 * re-use of a Window, use <b><code>{@link #closeAction closeAction: 'hide'}</code></b>.</p>
 * @constructor
 * @param {Object} config The config object
 * @xtype panel
 */
Ext.define('Ext.panel.Panel', {
    extend: 'Ext.AbstractPanel',
    requires: [
        'Ext.panel.Header',
        'Ext.fx.Anim',
        'Ext.util.KeyMap',
        'Ext.panel.DD',
        'Ext.XTemplate',
        'Ext.layout.component.Dock'
    ],
    alias: 'widget.panel',
    alternateClassName: 'Ext.Panel',

    /**
     * @cfg {String} collapsedCls
     * A CSS class to add to the panel's element after it has been collapsed (defaults to
     * <code>'x-panel-collapsed'</code>).
     */

    /**
     * @cfg {Boolean} animCollapse
     * <code>true</code> to animate the transition when the panel is collapsed, <code>false</code> to skip the
     * animation (defaults to <code>true</code> if the {@link Ext.fx.Anim} class is available, otherwise <code>false</code>).
     * May also be specified as the animation duration in milliseconds.
     */
    animCollapse: Ext.enableFx,
    
    /**
     * @cfg {Number} minButtonWidth
     * Minimum width of all form buttons in pixels (defaults to <tt>75</tt>). If set, this will
     * be used as the default value for the <tt>{@link Ext.button.Button#minWidth}</tt> config of
     * each Button added to the <b>footer toolbar</b>. Will be ignored for buttons that have this value configured some
     * other way, e.g. in their own config object or via the {@link Ext.Container#config-defaults defaults} of
     * their parent container.
     */
    minButtonWidth: 75,

    /**
     * @cfg {Boolean} collapsed
     * <code>true</code> to render the panel collapsed, <code>false</code> to render it expanded (defaults to
     * <code>false</code>).
     */
    collapsed: false,

    /**
     * @cfg {Boolean} collapseFirst
     * <code>true</code> to make sure the collapse/expand toggle button always renders first (to the left of)
     * any other tools in the panel's title bar, <code>false</code> to render it last (defaults to <code>true</code>).
     */
    collapseFirst: true,

    /**
     * @cfg {Boolean} hideCollapseTool
     * <code>true</code> to hide the expand/collapse toggle button when <code>{@link #collapsible} == true</code>,
     * <code>false</code> to display it (defaults to <code>false</code>).
     */
    hideCollapseTool: false,

    /**
     * @cfg {Boolean} titleCollapse
     * <code>true</code> to allow expanding and collapsing the panel (when <code>{@link #collapsible} = true</code>)
     * by clicking anywhere in the header bar, <code>false</code>) to allow it only by clicking to tool button
     * (defaults to <code>false</code>)).
     */
    titleCollapse: true,

    /**
     * @cfg {String} collapseMode
     * <p><b>Important: this config is only effective for {@link #collapsible} Panels which are direct child items of a {@link Ext.layout.container.Border border layout}.</b></p>
     * <p>When <i>not</i> a direct child item of a {@link Ext.layout.container.Border border layout}, then the Panel's header remains visible, and the body is collapsed to zero dimensions.
     * If the Panel has no header, then a new header (orientated correctly depending on the {@link #collapseDirection}) will be inserted to show a the title and a re-expand tool.</p>
     * <p>When a child item of a {@link Ext.layout.container.Border border layout}, this config has two options:
     * <div class="mdetail-params"><ul>
     * <li><b><code>alt</code></b> : <b>Default.</b><div class="sub-desc">When collapsed, a placeholder Container is injected into the layout to represent the Panel
     * and to provide a UI with a Tool to allow the user to re-expand the Panel.</div></li>
     * <li><b><code>header</code></b> : <div class="sub-desc">The Panel collapses to leave a header visible as when not inside a {@link Ext.layout.container.Border border layout}.</div></li>
     * </ul></div></p>
     */

    /**
     * @cfg {Mixed} placeHolder
     * <p><b>Important: This config is only effective for {@link #collapsible} Panels which are direct child items of a {@link Ext.layout.container.Border border layout}
     * when using the default <code>'alt'</code> {@link #collapseMode}.</b></p>
     * <p>b>Optional.</b> A Component (or config object for a Component) to show in place of this Panel when this Panel is collapsed by a
     * {@link Ext.layout.container.Border border layout}. Defaults to a generated {@link Ext.panel.Header Header}
     * containing a {@link Ext.panel.Tool Tool} to re-expand the Panel.</p>
     */

    /**
     * @cfg {Boolean} floatable
     * <p><b>Important: This config is only effective for {@link #collapsible} Panels which are direct child items of a {@link Ext.layout.container.Border border layout}.</b></p>
     * <tt>true</tt> to allow clicking a collapsed Panel's {@link #placeHolder} to display the Panel floated
     * above the layout, <tt>false</tt> to force the user to fully expand a collapsed region by
     * clicking the expand button to see it again (defaults to <tt>true</tt>).
     */
    floatable: true,

    /**
     * @cfg {Boolean} collapsible
     * <p>True to make the panel collapsible and have an expand/collapse toggle Tool added into
     * the header tool button area. False to keep the panel sized either statically, or by an owning layout manager, with no toggle Tool (defaults to false).</p>
     * See {@link #collapseMode} and {@link #collapseDirection}
     */
    collapsible: false,

    /**
     * @cfg {Boolean} collapseDirection
     * <p>The direction to collapse the Panel when the toggle button is clicked.</p>
     * <p>Defaults to the {@link #headerPosition}</p>
     * <p><b>Important: This config is <u>ignored</u> for {@link #collapsible} Panels which are direct child items of a {@link Ext.layout.container.Border border layout}.</b></p>
     * <p>Specify as <code>'top'</code>, <code>'bottom'</code>, <code>'left'</code> or <code>'right'</code>.</p>
     */

    /**
     * @cfg {Boolean} closable
     * <p>True to display the 'close' tool button and allow the user to close the window, false to
     * hide the button and disallow closing the window (defaults to <code>false</code>).</p>
     * <p>By default, when close is requested by clicking the close button in the header, the {@link #close}
     * method will be called. This will <i>{@link Ext.Component#destroy destroy}</i> the Panel and its content
     * meaning that it may not be reused.</p>
     * <p>To make closing a Panel <i>hide</i> the Panel so that it may be reused, set
     * {@link #closeAction} to 'hide'.</p>
     */
    closable: false,

    /**
     * @cfg {String} closeAction
     * <p>The action to take when the close header tool is clicked:
     * <div class="mdetail-params"><ul>
     * <li><b><code>'{@link #close}'</code></b> : <b>Default</b><div class="sub-desc">
     * {@link #close remove} the window from the DOM and {@link Ext.Component#destroy destroy}
     * it and all descendant Components. The window will <b>not</b> be available to be
     * redisplayed via the {@link #show} method.
     * </div></li>
     * <li><b><code>'{@link #hide}'</code></b> : <div class="sub-desc">
     * {@link #hide} the window by setting visibility to hidden and applying negative offsets.
     * The window will be available to be redisplayed via the {@link #show} method.
     * </div></li>
     * </ul></div>
     * <p><b>Note:</b> This behavior has changed! setting *does* affect the {@link #close} method
     * which will invoke the approriate closeAction.
     */
    closeAction: 'destroy',

     /**
      * @cfg {Boolean} preventHeader Prevent a Header from being created and shown. Defaults to false.
      */
    preventHeader: false,
         
     /**
      * @cfg {String} headerPosition Specify as <code>'top'</code>, <code>'bottom'</code>, <code>'left'</code> or <code>'right'</code>. Defaults to <code>'top'</code>.
      */
    headerPosition: 'top',

     /**
     * @cfg {Boolean} frame
     * True to apply a frame to the panel.
     */
    frame: false,

    renderTpl: [
        '<div class="{baseCls}-body<tpl if="bodyCls"> {bodyCls}</tpl><tpl if="frame"> {baseCls}-body-framed</tpl><tpl if="ui"> {baseCls}-body-{ui}</tpl>"<tpl if="bodyStyle"> style="{bodyStyle}"</tpl>></div>'
    ],

    initComponent: function() {
        var me = this,
            cls;

        me.callParent();
        if (me.unstyled) {
            me.baseCls = me.baseCSSPrefix + 'plain';
        }
        
        if (me.frame) {
            me.ui = 'framed';
        }

        me.collapsedCls = me.collapsedCls || me.baseCls + '-collapsed';
        me.collapseDirection = me.collapseDirection || me.headerPosition || Ext.Component.DIRECTION_TOP;

        // Backwards compatibility
        me.bridgeToolbars();
    },

    hideBorders : function() {
        var me = this,
            cls = me.baseCls + '-noborder';

        me.addCls(cls);
        if (me.rendered) {
            me.body.addCls(cls + '-body');
        }
        else {
            me.renderData.bodyCls = me.renderData.bodyCls || '' + (' ' + cls + '-body');
        }
    },

    showBorders : function() {
        var me = this,
            cls = me.baseCls + '-noborder';

        me.removeCls(cls);
        if (me.rendered) {
            me.body.removeCls(cls + '-body');
        }
        else {
            me.renderData.bodyCls = me.renderData.bodyCls.replace(cls + '-body', '');
        }
    },

    beforeDestroy: function() {
        Ext.destroy(
            this.ghostPanel
        );
        this.callParent();
    },

    initAria: function() {
        Ext.panel.Panel.superclass.initAria.call(this);
        this.initHeaderAria();
    },

    initHeaderAria: function() {
        var me = this,
            el = me.el,
            header = me.header;
        if (el && header) {
            el.dom.setAttribute('aria-labelledby', header.titleCmp.id);
        }
    },

    /**
     * Set a title for the panel's header. See {@link Ext.panel.Header#title}.
     * @param {String} title
     */
    setTitle: function(title) {
        var me = this;
        me.title = title;
        if (me.header) {
            me.header.setTitle(title);
        } else {
            me.updateHeader();
        }
    },

    /**
     * Set the iconCls for the panel's header. See {@link Ext.panel.Header#iconCls}.
     * @param cls
     */
    setIconClass: function(cls) {
        this.iconCls = cls;
        var header = this.header;
        if (header) {
            header.setIconClass(cls);
        }
    },

    initItems: function() {
        // Catch addition of descendant fields
        this.on('add', this.onSubCmpAdded, this);
        this.callParent(arguments);
    },

    onSubCmpAdded: function(parent, cmp) {
        var minButtonWidth = this.minButtonWidth;

        if (minButtonWidth && cmp.isButton/* && parent && parent.ui == 'footer'*/) {
            if (!cmp.hasOwnProperty('minWidth')) {
                cmp.minWidth = minButtonWidth;
            }
        }
    },

    bridgeToolbars: function() {
        var me = this,
            fbar,
            buttons = me.buttons,
            minButtonWidth = me.minButtonWidth,
            initToolbar = function(toolbar, pos) {
                if (Ext.isArray(toolbar)) {
                    toolbar = {
                        xtype: 'toolbar',
                        items: toolbar
                    };
                }
                else if (!toolbar.xtype) {
                    toolbar.xtype = 'toolbar';
                }
                toolbar.dock = pos;
            return toolbar;
        };
        
        // Apply the minButtonWidth config to the items in the 'buttons' toolbar config
        if (buttons && minButtonWidth) {
            Ext.each(buttons, function(button) {
                if (Ext.isObject(button) && !('minWidth' in button)) {
                    button.minWidth = minButtonWidth;
                }
            });
        }

        // Backwards compatibility
        if (me.tbar) {
            me.addDocked(initToolbar(me.tbar, 'top'));
            me.tbar = null;
        }

        if (me.bbar) {
            me.addDocked(initToolbar(me.bbar, 'bottom'));
            me.bbar = null;
        }

        if (me.buttons) {
            me.fbar = me.buttons;
            me.buttons = null;
        }

        if (me.fbar) {
            fbar = initToolbar(me.fbar, 'bottom');
            fbar.ui = 'footer';

            fbar = me.addDocked(fbar)[0];
            fbar.insert(0, {
                flex: 1,
                xtype: 'component'
            });
            me.fbar = null;
        }
    },

    /**
     * @private.
     * Tools are a Panel-specific capabilty.
     * Panel uses initTools. Subclasses may contribute tools by implementing addTools.
     */
    initTools: function() {
        var me = this;

        me.tools = me.tools || [];

        // Add a collapse tool unless configured to not show a collapse tool
        // or to not even show a header.
        if (me.collapsible && !(me.hideCollapseTool || me.header === false)) {
            me.collapseDirection = me.collapseDirection || me.headerPosition || 'top';
            me.collapseTool = me.expandTool = me.createComponent({
                xtype: 'tool',
                type: 'collapse-' + me.collapseDirection,
                expandType: me.getOppositeDirection(me.collapseDirection),
                handler: me.toggleCollapse,
                scope: me
            });

            // Prepend collapse tool is configured to do so.
            if (me.collapseFirst) {
                me.tools.unshift(me.collapseTool);
            }
        }

        // Add subclass-specific tools.
        this.addTools();

        // Make Panel closable.
        if (this.closable) {
            this.addCls(this.baseCls + '-closable');
            this.addTool({
                type: 'close',
                handler: Ext.Function.bind(this.close, this, [])
            });
        }

        // Append collapse tool if needed.
        if (me.collapseTool && !me.collapseFirst) {
            me.tools.push(me.collapseTool);
        }
    },

    /**
     * @private
     * Template method to be implemented in subclasses to add their tools after the collapsible tool.
     */
    addTools: Ext.emptyFn,

    /**
     * <p>Closes the Panel. By default, this method, removes it from the DOM, {@link Ext.Component#destroy destroy}s
     * the Panel object and all its descendant Components. The {@link #beforeclose beforeclose}
     * event is fired before the close happens and will cancel the close action if it returns false.<p>
     * <p><b>Note:</b> This method is not affected by the {@link #closeAction} setting which
     * only affects the action triggered when clicking the {@link #closable 'close' tool in the header}.
     * To hide the Panel without destroying it, call {@link #hide}.</p>
     */
    close: function() {
        if (this.fireEvent('beforeclose', this) !== false) {
            this.doClose();
        }
    },

    // private
    doClose: function() {
        this.fireEvent('close', this);
        this[this.closeAction]();
    },

    onRender: function(ct, position) {
        var me = this;

        // Correct border visibility just before render.
        if (me.border === false) {
            me.hideBorders();
        }

        // Add class-specific header tools.
        // Panel adds collapsible and closable.
        me.initTools();

        // Dock the header/title
        me.updateHeader();

        // Call to super after adding the header, to prevent an unnecessary re-layout
        me.callParent(arguments);

        // If initially collapsed, ensure that any header is rendered out, and perform a collapse.
        // collapsed flag must indicate true current state at this point.
        if (me.collapsed) {
            me.header.render(me.el);
            me.header.doComponentLayout();
            me.collapsed = false;
            me.collapse(null, false, true);
        }
    },

    /**
     * Create, hide, or show the header component as appropriate based on the current config.
     * @private
     */
    updateHeader: function() {
        var me = this,
            header = me.header,
            title = me.title,
            tools = me.tools;

        if (!me.preventHeader && (title || (tools && tools.length))) {
            if (!header) {
                header = me.header = new Ext.panel.Header({
                    title       : title,
                    orientation : (me.headerPosition == 'left' || me.headerPosition == 'right') ? 'vertical' : 'horizontal',
                    dock        : me.headerPosition || 'top',
                    textCls     : me.headerTextCls,
                    iconCls     : me.iconCls,
                    baseCls     : me.baseCls + '-header',
                    tools       : tools,
                    ui          : me.ui,
                    indicateDrag: me.draggable,
                    frame       : me.frame,
                    ignoreParentFrame : me.frame || me.overlapHeader
                });
                me.addDocked(header, 0);

                // Reference the Header's tool array.
                // Header injects named references.
                me.tools = header.tools;
            }
            header.show();
            this.initHeaderAria();
        }
        else if (header) {
            header.hide();
        }
    },

    // private
    getContentTarget: function() {
        return this.body;
    },

    getTargetEl: function() {
        return this.body || this.frameBody || this.el;
    },

    addTool: function(tool) {
        this.tools.push(tool);
        var header = this.header;
        if (header) {
            header.addTool(tool);
        }
        this.updateHeader();
    },

    getOppositeDirection: function(d) {
        var c = Ext.Component;
        switch (d) {
            case c.DIRECTION_TOP:
                return c.DIRECTION_BOTTOM;
            case c.DIRECTION_RIGHT:
                return c.DIRECTION_LEFT;
            case c.DIRECTION_BOTTOM:
                return c.DIRECTION_TOP;
            case c.DIRECTION_LEFT:
                return c.DIRECTION_RIGHT;
        }
    },

    /**
     * Collapses the panel body so that the body becomes hidden. Docked Components parallel to the
     * border towards which the collapse takes place will remain visible.  Fires the {@link #beforecollapse} event which will
     * cancel the collapse action if it returns false.
     * @param {Number} direction. The direction to collapse towards. Must be one of<ul>
     * <li>Ext.Component.DIRECTION_TOP</li>
     * <li>Ext.Component.DIRECTION_RIGHT</li>
     * <li>Ext.Component.DIRECTION_BOTTOM</li>
     * <li>Ext.Component.DIRECTION_LEFT</li></ul>
     * @param {Boolean} animate True to animate the transition, else false (defaults to the value of the
     * {@link #animCollapse} panel config)
     * @return {Ext.panel.Panel} this
     */
    collapse: function(direction, animate, /* private - passed if called at render time */ internal) {
        var me = this,
            c = Ext.Component,
            height = me.getHeight(),
            width = me.getWidth(),
            newSize = 0,
            dockedItems = me.dockedItems.items,
            dockedItemCount = dockedItems.length,
            i = 0,
            comp,
            pos,
            anim = {
                from: {
                    height: height,
                    width: width
                },
                to: {
                    height: height,
                    width: width
                },
                listeners: {
                    afteranimate: me.afterCollapse,
                    scope: me
                },
                duration: Ext.num(animate, Ext.fx.Anim.prototype.duration)
            },
            reExpander,
            reExpanderOrientation,
            reExpanderDock,
            hideOnCollapse = me.collapseMode == 'mini';

        if (!direction) {
            direction = me.collapseDirection;
        }
        reExpanderDock = direction;
        me.expandDirection = this.getOppositeDirection(direction);

        // Track docked items which he hide during collapsed state
        me.hiddenDocked = [];

        switch (direction) {
            case c.DIRECTION_TOP:
            case c.DIRECTION_BOTTOM:
                me.expandedSize = me.getHeight();
                reExpanderOrientation = 'horizontal';

                // Collect the height of the visible header.
                // Hide all docked items except the header.
                // Hide *ALL* docked items if we're going to end up hiding the whole Panel anyway
                for (; i < dockedItemCount; i++) {
                    comp = dockedItems[i];
                    if (comp.isVisible()) {
                        if (!hideOnCollapse && comp.isHeader && (!comp.dock || comp.dock == 'top' || comp.dock == 'bottom')) {
                            newSize += comp.getHeight();
                            reExpander = comp;
                        } else {
                            me.hiddenDocked.push(comp);
                        }
                    }
                }

                anim.to.height = newSize;
                if (direction == Ext.Component.DIRECTION_BOTTOM) {
                    pos = me.getPosition()[1] - Ext.fly(me.el.dom.offsetParent).getRegion().top;
                    anim.from.top = pos;
                }
                break;

            case c.DIRECTION_LEFT:
            case c.DIRECTION_RIGHT:
                me.expandedSize = me.getWidth();
                reExpanderOrientation = 'vertical';

                // Collect the height of the visible header.
                // Hide all docked items except the header.
                // Hide *ALL* docked items if we're going to end up hiding the whole Panel anyway
                for (; i < dockedItemCount; i++) {
                    comp = dockedItems[i];
                    if (comp.isVisible()) {
                        if (!hideOnCollapse && comp.isHeader && (comp.dock == 'left' || comp.dock == 'right')) {
                            newSize += comp.getWidth();
                            reExpander = comp;
                        } else {
                            me.hiddenDocked.push(comp);
                        }
                    }
                }

                anim.to.width = newSize;
                if (direction == Ext.Component.DIRECTION_RIGHT) {
                    pos = me.getPosition()[0] - Ext.fly(me.el.dom.offsetParent).getRegion().left;
                    anim.from.left = pos;
                }
                break;

            default:
                throw('Panel collapse must be passed a valid Component collapse direction');
        }

        // If internal (called from within Panel's rendering), then no animation, and no events.
        if (internal) {
            animate = false;
        } else if (me.collapsed || me.fireEvent('beforecollapse', me, direction, animate, newSize) === false) {
            return false;
        }

        // No scrollbars when we shrink this Panel
        // And no laying out of any children... we're effectively *hiding* the body
        me.setAutoScroll(false);
        me.suspendLayout = true;
        me.body.setVisibilityMode(Ext.core.Element.DISPLAY);

        // Disable toggle tool during animated collapse
        if (animate && me.collapseTool) {
            me.collapseTool.disable();
        }

        // If we're not in collapseMode: 'mini'
        if (!hideOnCollapse) {
            // No placeholder header: Insert one.
            if (!reExpander) {
                reExpander = {
                    temporary: true,
                    title: me.title,
                    orientation: reExpanderOrientation,
                    hideMode: 'offsets',
                    dock: reExpanderDock,
                    textCls: me.headerTextCls,
                    iconCls: me.iconCls,
                    baseCls: me.baseCls + '-header',
                    ui: me.ui,
                    indicateDrag: me.draggable,
                    cls: me.baseCls + '-collapsed-placeholder ' + me.baseCls + '-collapsed-' + direction + '-placeholder'
                };
                reExpander[(reExpander.orientation == 'horizontal') ? 'tools' : 'items'] = [{
                    xtype: 'tool',
                    type: 'expand-' + me.expandDirection,
                    handler: me.toggleCollapse,
                    scope: me
                }];
                reExpander = me.reExpander = new Ext.panel.Header(reExpander);

                // Programatically render it so that it can be measured.
                reExpander.render(me.getTargetEl());
                newSize += (reExpanderOrientation == 'vertical') ? reExpander.getWidth() : reExpander.getHeight();
                reExpander.hide();

                // Insert the new docked item
                me.insertDocked(0, reExpander);
            }

            // Animate to the new size
            anim.to[(reExpanderOrientation == 'vertical') ? 'width' : 'height'] = newSize;
            me.reExpander = reExpander;

            // If collapsing right or down, we'll be also animating the left or top.
            if (direction == Ext.Component.DIRECTION_RIGHT) {
                anim.to.left = pos + (width - newSize);
            } else if (direction == Ext.Component.DIRECTION_BOTTOM) {
                anim.to.top = pos + (height - newSize);
            }
        }

        // Remove any flex config before we attempt to collapse.
        me.savedFlex = me.flex;
        me.savedMinWidth = me.minWidth;
        me.savedMinHeight = me.minHeight;
        me.minWidth = 0;
        me.minHeight = 0;
        delete me.flex;

        if (animate) {
            this.animate(anim);
        } else {
            if (!hideOnCollapse) {
                me.setSize(anim.to.width, anim.to.height);
            }
            if (anim.to.x) {
                me.setLeft(anim.to.x);
            }
            if (anim.to.y) {
                me.setTop(anim.to.y);
            }
            me.afterCollapse(false, internal);
        }
        return me;
    },

    afterCollapse: function(animated, internal) {
        var me = this,
            i = 0,
            l = me.hiddenDocked.length,
            hideOnCollapse = me.collapseMode == 'mini';

        me.minWidth = me.savedMinWidth;
        me.minHeight = me.savedMinHeight;
        if (hideOnCollapse) {
            me.el.hide();
            me.hiddenDocked.length = 0;
        }
        else {
            me.body.hide();
            for (; i < l; i++) {
                me.hiddenDocked[i].hide();
            }
        }
        if (me.reExpander) {
            me.reExpander.show();
        }
        me.collapsed = true;
        me.el.addCls(me.collapsedCls);

        // Reinstate laying out of child items
        delete me.suspendLayout;

        if (!internal) {
            if (animated && me.ownerCt) {
                me.ownerCt.doLayout();
            } else {
                me.doComponentLayout();
            }
        }

        // If me Panel was configured with a collapse tool in its header, flip it's type
        if (me.collapseTool) {
            me.collapseTool.setType('expand-' + me.expandDirection);
        }
        if (!internal) {
            me.fireEvent('collapse', me);
        }

        // Re-enable the toggle tool after an animated collapse
        if (animated && me.collapseTool) {
            me.collapseTool.enable();
        }
    },

    /**
     * Expands the panel body so that it becomes visible.  Fires the {@link #beforeexpand} event which will
     * cancel the expand action if it returns false.
     * @param {Boolean} animate True to animate the transition, else false (defaults to the value of the
     * {@link #animCollapse} panel config)
     * @return {Ext.panel.Panel} this
     */
    expand: function(animate) {
        if (!this.collapsed || this.fireEvent('beforeexpand', this, animate) === false) {
            return false;
        }
        var me = this,
            i = 0,
            l = me.hiddenDocked.length,
            direction = me.expandDirection,
            height = me.getHeight(),
            width = me.getWidth(),
            showOnExpand = me.collapseMode == 'mini',
            pos, anim, satisfyJSLint;

        // Disable toggle tool during animated expand
        if (animate && me.collapseTool) {
            me.collapseTool.disable();
        }

        // Show any docked items that we hid on collapse
        // And hide the injected reExpander Header
        for (; i < l; i++) {
            me.hiddenDocked[i].show();
        }
        if (me.reExpander && me.reExpander.temporary) {
            me.reExpander.hide();
        }

        // If me Panel was configured with a collapse tool in its header, flip it's type
        if (me.collapseTool) {
            me.collapseTool.setType('collapse-' + me.collapseDirection);
        }

        anim = {
            to: {
            },
            from: {
                height: height,
                width: width
            },
            listeners: {
                afteranimate: me.afterExpand,
                scope: me
            }
        };

        // Unset the flag before the potential call to calculateChildBox to calculate our newly flexed size
        me.collapsed = false;

        if ((direction == Ext.Component.DIRECTION_TOP) || (direction == Ext.Component.DIRECTION_BOTTOM)) {

            // If we were flexed, then we can't just restore to the saved size.
            // We must restore to the currently correct, flexed size, so we much ask the Box layout what that is.
            if (me.savedFlex) {
                me.flex = me.savedFlex;
                anim.to.height = me.ownerCt.layout.calculateChildBox(me).height;
                delete me.flex;
            } else {
                anim.to.height = me.expandedSize;
            }

            // top needs animating upwards
            if (direction == Ext.Component.DIRECTION_TOP) {
                pos = me.getPosition()[1] - Ext.fly(me.el.dom.offsetParent).getRegion().top;
                anim.from.top = pos;
                anim.to.top = pos - (anim.to.height - height);
            }
        } else if ((direction == Ext.Component.DIRECTION_LEFT) || (direction == Ext.Component.DIRECTION_RIGHT)) {

            // If we were flexed, then we can't just restore to the saved size.
            // We must restore to the currently correct, flexed size, so we much ask the Box layout what that is.
            if (me.savedFlex) {
                me.flex = me.savedFlex;
                anim.to.width = me.ownerCt.layout.calculateChildBox(me).width;
                delete me.flex;
            } else {
                anim.to.width = me.expandedSize;
            }

            // left needs animating leftwards
            if (direction == Ext.Component.DIRECTION_LEFT) {
                pos = me.getPosition()[0] - Ext.fly(me.el.dom.offsetParent).getRegion().left;
                anim.from.left = pos;
                anim.to.left = pos - (anim.to.width - width);
            }
        }

        if (showOnExpand) {
            me.el.show();
        } else {
            me.body.show();
        }

        // Remove any collapsed styling before any animation begins
        me.el.removeCls(me.collapsedCls);
        if (animate) {
            me.animate(anim);
        } else {
            me.setSize(anim.to.width, anim.to.height);
            if (anim.to.x) {
                me.setLeft(anim.to.x);
            }
            if (anim.to.y) {
                me.setTop(anim.to.y);
            }
            me.afterExpand(false);
        }

        return me;
    },

    afterExpand: function(animated) {
        var me = this;
        me.setAutoScroll(me.initialConfig.autoScroll);

        // Restored to a calculated flex. Delete the set width and height properties so that flex works from now on.
        if (me.savedFlex) {
            me.flex = me.savedFlex;
            delete me.savedFlex;
            delete me.width;
            delete me.height;
        }

        // Reinstate layout out after Panel has re-expanded
        delete me.layout.onLayout;
        if (animated && me.ownerCt) {
            me.ownerCt.doLayout();
        }

        me.fireEvent('expand', me);

        // Re-enable the toggle tool after an animated expand
        if (animated && me.collapseTool) {
            me.collapseTool.enable();
        }
    },

    /**
     * Shortcut for performing an {@link #expand} or {@link #collapse} based on the current state of the panel.
     * @return {Ext.panel.Panel} this
     */
    toggleCollapse: function() {
        if (this.collapsed) {
            this.expand(this.animCollapse);
        } else {
            this.collapse(this.collapseDirection, this.animCollapse);
        }
        return this;
    },

    // private
    getKeyMap : function(){
        if(!this.keyMap){
            this.keyMap = new Ext.util.KeyMap(this.el, this.keys);
        }
        return this.keyMap;
    },

    // private
    initDraggable : function(){
        /**
         * <p>If this Panel is configured {@link #draggable}, this property will contain
         * an instance of {@link Ext.dd.DragSource} which handles dragging the Panel.</p>
         * The developer must provide implementations of the abstract methods of {@link Ext.dd.DragSource}
         * in order to supply behaviour for each stage of the drag/drop process. See {@link #draggable}.
         * @type Ext.dd.DragSource.
         * @property dd
         */
        this.dd = new Ext.panel.DD(this, Ext.isBoolean(this.draggable) ? null : this.draggable);
    },

    // private - used for dragging
    ghost: function(cls) {
        var me = this,
            box = me.getBox();

        if (!me.ghostPanel) {
            me.ghostPanel = new Ext.panel.Panel({
                renderTo: document.body,
                floating: true,
                frame: me.frame,
                title: me.title,
                overlapHeader: me.overlapHeader,
                headerPosition: me.headerPosition,
                width: me.getWidth(),
                height: me.getHeight(),
                baseCls: me.baseCls,
                tools: [{
                    type: 'placeholder'
                }],
                cls: me.baseCls + '-ghost ' + (cls ||'')
            });
        }
        me.ghostPanel.floatParent = me.floatParent;
        me.ghostPanel.setZIndex(Ext.num(me.el.getStyle('zIndex'), 0));
        me.ghostPanel.el.show();
        me.ghostPanel.setPosition(box.x, box.y);
        me.ghostPanel.setSize(box.width, box.height);
        me.el.hide();
        if (me.floatingItems) {
            me.floatingItems.hide();
        }
        return me.ghostPanel;
    },

    // private
    unghost: function(show, matchPosition) {
        var me = this;
        if (!me.ghostPanel) {
            return;
        }
        if (show !== false) {
            me.el.show();
            if (matchPosition !== false) {
                me.setPosition(me.ghostPanel.getPosition());
            }
            if (me.floatingItems) {
                me.floatingItems.show();
            }
            Ext.defer(me.focus, 10, me);
        }
        me.ghostPanel.el.hide();
    },

    // should update body's el.
    doAutoLoad: function() {

    }
});
