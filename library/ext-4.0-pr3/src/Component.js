/**
 * @class Ext.Component
 * @extends Ext.AbstractComponent
 * <p>Base class for all Ext components.  All subclasses of Component may participate in the automated
 * Ext component lifecycle of creation, rendering and destruction which is provided by the {@link Ext.container.Container Container} class.
 * Components may be added to a Container through the {@link Ext.container.Container#items items} config option at the time the Container is created,
 * or they may be added dynamically via the {@link Ext.container.Container#add add} method.</p>
 * <p>The Component base class has built-in support for basic hide/show and enable/disable behavior.</p>
 * <p>All Components are registered with the {@link Ext.ComponentMgr} on construction so that they can be referenced at any time via
 * {@link Ext#getCmp}, passing the {@link #id}.</p>
 * <p>All user-developed visual widgets that are required to participate in automated lifecycle and size management should subclass Component (or
 * {@link Ext.AbstractComponent} if managed box model handling is required, ie height and width management).</p>
 * <p>See the <a href="http://extjs.com/learn/Tutorial:Creating_new_UI_controls">Creating new UI controls</a> tutorial for details on how
 * and to either extend or augment ExtJs base classes to create custom Components.</p>
 * <p>Every component has a specific xtype, which is its Ext-specific type name, along with methods for checking the
 * xtype like {@link #getXType} and {@link #isXType}. This is the list of all valid xtypes:</p>
 * <pre>
xtype            Class
-------------    ------------------
button           {@link Ext.button.Button}
buttongroup      {@link Ext.container.ButtonGroup}
colorpalette     {@link Ext.picker.Color}
component        {@link Ext.Component}
container        {@link Ext.container.Container}
cycle            {@link Ext.button.Cycle}
dataview         {@link Ext.DataView}
datepicker       {@link Ext.picker.Date}
editor           {@link Ext.Editor}
editorgrid       {@link Ext.grid.Editing}
grid             {@link Ext.grid.GridPanel}
multislider      {@link Ext.slider.Multi}
panel            {@link Ext.panel.Panel}
progress         {@link Ext.ProgressBar}
slider           {@link Ext.slider.Single}
spacer           {@link Ext.toolbar.Spacer}
splitbutton      {@link Ext.button.Split}
tabpanel         {@link Ext.tab.TabPanel}
treepanel        {@link Ext.tree.TreePanel}
viewport         {@link Ext.container.ViewPort}
window           {@link Ext.window.Window}

Toolbar components
---------------------------------------
paging           {@link Ext.toolbar.PagingToolbar}
toolbar          {@link Ext.toolbar.Toolbar}
tbfill           {@link Ext.toolbar.Fill}
tbitem           {@link Ext.toolbar.Item}
tbseparator      {@link Ext.toolbar.Separator}
tbspacer         {@link Ext.toolbar.Spacer}
tbtext           {@link Ext.toolbar.TextItem}

Menu components
---------------------------------------
menu             {@link Ext.menu.Menu}
menucheckitem    {@link Ext.menu.CheckItem}
menuitem         {@link Ext.menu.Item}
menuseparator    {@link Ext.menu.Separator}
menutextitem     {@link Ext.menu.Item}

Form components
---------------------------------------
form             {@link Ext.form.FormPanel}
checkbox         {@link Ext.form.Checkbox}
checkboxgroup    {@link Ext.form.CheckboxGroup}
combo            {@link Ext.form.ComboBox}
compositefield   {@link Ext.form.CompositeField}
datefield        {@link Ext.form.Date}
displayfield     {@link Ext.form.Display}
field            {@link Ext.form.Field}
fieldset         {@link Ext.form.FieldSet}
hidden           {@link Ext.form.Hidden}
htmleditor       {@link Ext.form.HtmlEditor}
label            {@link Ext.form.Label}
numberfield      {@link Ext.form.Number}
radio            {@link Ext.form.Radio}
radiogroup       {@link Ext.form.RadioGroup}
textarea         {@link Ext.form.TextArea}
textfield        {@link Ext.form.Text}
timefield        {@link Ext.form.Time}
trigger          {@link Ext.form.Trigger}

Chart components
---------------------------------------
chart            {@link Ext.chart.Chart}
barchart         {@link Ext.chart.series.Bar}
cartesianchart   {@link Ext.chart.series.Cartesian}
columnchart      {@link Ext.chart.series.Column}
linechart        {@link Ext.chart.series.Line}
piechart         {@link Ext.chart.series.Pie}

</pre>
 * @constructor
 * @param {Ext.core.Element/String/Object} config The configuration options may be specified as either:
 * <div class="mdetail-params"><ul>
 * <li><b>an element</b> :
 * <p class="sub-desc">it is set as the internal element and its id used as the component id</p></li>
 * <li><b>a string</b> :
 * <p class="sub-desc">it is assumed to be the id of an existing element and is used as the component id</p></li>
 * <li><b>anything else</b> :
 * <p class="sub-desc">it is assumed to be a standard config object and is applied to the component</p></li>
 * </ul></div>
 */

Ext.define('Ext.Component', {

    /* Begin Definitions */

    alias: ['widget.component', 'widget.box'],

    extend: 'Ext.AbstractComponent',

    requires: [
        'Ext.util.DelayedTask'
    ],

    uses: [
        'Ext.Layer',
        'Ext.resizer.Resizer',
        'Ext.util.ComponentDragger',
        'Ext.state.Manager'
    ],

    mixins: {
        floating: 'Ext.util.Floating'
    },

    statics: {
        // Collapse/expand directions
        DIRECTION_TOP: 'top',
        DIRECTION_RIGHT: 'right',
        DIRECTION_BOTTOM: 'bottom',
        DIRECTION_LEFT: 'left'
    },

    /* End Definitions */

    /**
     * @cfg {Mixed} resizable
     * <p>Specify as <code>true</code> to apply a {@link Ext.resizer.Resizer Resizer} to this Component
     * after rendering.</p>
     * <p>May also be specified as a config object to be passed to the constructor of {@link Ext.resizer.Resizer Resizer}
     * to override any defaults. By default the Component passes its minimum and maximum size, and uses
     * <code>{@link Ext.resizer.Resizer#dynamic}: false</code></p>
     */

    /**
     * @cfg {String} resizeHandles
     * A valid {@link Ext.resizer.Resizer} handles config string (defaults to 'all').  Only applies when resizable = true.
     */
    resizeHandles: 'all',

    /**
     * @cfg {Boolean} autoScroll
     * <code>true</code> to use overflow:'auto' on the components layout element and show scroll bars automatically when
     * necessary, <code>false</code> to clip any overflowing content (defaults to <code>false</code>).
     */

    /**
     * @cfg {Boolean} floating
     * <p>Specify as true to float the Component outside of the document flow using CSS absolute positioning.</p>
     * <p>Components such as {@link Ext.window.Window Window}s and {@link Ext.menu.Menu Menu}s are floating
     * by default.</p>
     */
    floating: false,

    /**
     * @cfg {Boolean} maintainFlex
     * <p><b>Only valid when a sibling element of a {@link Ext.resizer.Splitter Splitter} within a {@link Ext.layout.container.VBox VBox} or
     * {@link Ext.layout.container.HBox HBox} layout.</b></p>
     * <p>Specifies that if an immediate sibling Splitter is moved, the Component on the <i>other</i> side is resized, and this
     * Component maintains its configured {@link Ext.layout.container.Box#flex flex} value.</p>
     */

    /**
     * @property {Ext.ZIndexManager} zIndexManager
     * <p>Optional. Only valid for {@link #floating} Components. A reference to the ZIndexManager that should manage this Component.</p>
     * <p>This defaults to the global {@link Ext.WindowMgr} for floating Components that are programatically {@link Ext.Component#render rendered}.</p>
     * <p>For {@link #floating} Components which are added at a Container, the Container assigns a ZIndexManager.</p>
     */

    hideMode: 'display',
    // Deprecate 5.0
    hideParent: false,

    ariaRole: 'presentation',

    bubbleEvents: [],

    actionMode: 'el',
    monPropRe: /^(?:scope|delay|buffer|single|stopEvent|preventDefault|stopPropagation|normalized|args|delegate)$/,

    //renderTpl: new Ext.XTemplate(
    //    '<div id="{id}" class="{baseCls} {cls} {cmpCls}<tpl if="typeof ui !== \'undefined\'"> {uiBase}-{ui}</tpl>"<tpl if="typeof style !== \'undefined\'"> style="{style}"</tpl>></div>', {
    //        compiled: true,
    //        disableFormats: true
    //    }
    //),
    constructor: function(config) {
        config = config || {};
        if (config.initialConfig) {
            /*if(config.isAction){           // actions
                this.baseAction = config;
            }*/
            config = config.initialConfig;
            // component cloning / action set up
        }
        else if (config.tagName || config.dom || Ext.isString(config)) {
            // element object
            config = {
                applyTo: config,
                id: config.id || config
            };
        }

        Ext.Component.superclass.constructor.call(this, config);

        /*
        if(this.baseAction){
            this.baseAction.addComponent(this);
        }*/

        if (this.stateful !== false) {
            this.initState();
        }
    },

    initComponent: function() {
        if (this.listeners) {
            this.on(this.listeners);
            delete this.listeners;
        }
        this.enableBubble(this.bubbleEvents);
        this.mons = [];
    },

    render: function(ct, position, overwrite) {
        Ext.Component.superclass.render.apply(this, arguments);
        if (this.stateful !== false) {
            this.initStateEvents();
        }
        return this;
    },

    // private
    afterRender: function() {
        var me = this,
            // not sure which is spelled properly. lets use both
            resizeable = me.resizable || me.resizeable;

        if (me.floating) {
            me.makeFloating(me.floating);
        } else {
            me.el.setVisibilityMode(Ext.core.Element[me.hideMode.toUpperCase()]);
        }

        me.setAutoScroll(me.autoScroll);
        Ext.Component.superclass.afterRender.apply(me, arguments);

        if (!(me.x && me.y) && (me.pageX || me.pageY)) {
            me.setPagePosition(me.pageX, me.pageY);
        }

        if (resizeable) {
            me.initResizable(resizeable);
        }

        if (me.draggable) {
            me.initDraggable();
        }

        me.initAria();
    },

    initAria: function() {
        var actionEl = this.getActionEl(),
            role = this.ariaRole;
        if (role) {
            actionEl.dom.setAttribute('role', role);
        }
    },

    /**
     * Sets the overflow on the content element of the component.
     * @param {Boolean} scroll True to allow the Component to auto scroll.
     * @return {Ext.Component} this
     */
    setAutoScroll : function(scroll){
        scroll = !!scroll;
        if (this.rendered) {
            this.getTargetEl().setStyle('overflow', scroll ? 'auto' : '');
        }
        this.autoScroll = scroll;
        return this;
    },

    // private
    makeFloating : function(cfg){
        this.mixins.floating.constructor.call(this, cfg);
    },

    initResizable: function(resizeable) {
        resizeable = Ext.apply({
            target: this,
            dynamic: false,
            constrainTo: this.constrainTo,
            handles: this.resizeHandles
        }, resizeable);
        resizeable.target = this;
        this.resizer = new Ext.resizer.Resizer(resizeable);
    },

    getDragEl: function() {
        return this.el;
    },

    initDraggable: function() {
        var me = this,
            ddConfig = Ext.applyIf({
                el: this.getDragEl(),
                constrainTo: me.constrainTo || me.el.dom.parentNode
            }, this.draggable);

        // Add extra configs if Component is specified to be constrained
        if (me.constrain || me.constrainDelegate) {
            ddConfig.constrain = me.constrain;
            ddConfig.constrainDelegate = me.constrainDelegate;
        }

        this.dd = new Ext.util.ComponentDragger(this, ddConfig);
},

    /**
     * Sets the left and top of the component.  To set the page XY position instead, use {@link #setPagePosition}.
     * This method fires the {@link #move} event.
     * @param {Number} left The new left
     * @param {Number} top The new top
     * @param {Mixed} animate If true, the Component is <i>animated</i> into its new position. You may also pass an animation configuration.
     * @return {Ext.Component} this
     */
    setPosition: function(x, y, animate) {
        var me = this,
            el = me.el,
            to = {},
            adj, adjX, adjY, xIsNumber, yIsNumber;

        if (Ext.isArray(x)) {
            animate = y;
            y = x[1];
            x = x[0];
        }
        me.x = x;
        me.y = y;

        if (!me.rendered) {
            return me;
        }

        adj = me.adjustPosition(x, y);
        adjX = adj.x;
        adjY = adj.y;
        xIsNumber = Ext.isNumber(adjX);
        yIsNumber = Ext.isNumber(adjY);

        if (xIsNumber || yIsNumber) {
            if (animate) {
                if (xIsNumber) {
                    to.left = adjX;
                }
                if (yIsNumber) {
                    to.top = adjY;
                }

                me.stopFx();
                me.animate(Ext.apply({
                    duration: 1000,
                    listeners: {
                        afteranimate: Ext.Function.bind(me.afterSetPosition, me, [adjX, adjY])
                    },
                    to: to
                }, animate));
            }
            else {
                if (!xIsNumber) {
                    el.setTop(adjY);
                }
                else if (!yIsNumber) {
                    el.setLeft(adjX);
                }
                else {
                    el.setLeftTop(adjX, adjY);
                }
                me.afterSetPosition(adjX, adjY);
            }
        }
        return me;
    },

    /**
     * @private Template method called after a Component has been positioned.
     */
    afterSetPosition: function(ax, ay) {
        this.onPosition(ax, ay);
        this.fireEvent('move', this, ax, ay);
    },

    showAt: function(x, y, animate) {
        // A floating Component is positioned relative to its ownerCt if any.
        if (this.floating) {
            this.setPosition(x, y, animate);
        } else {
            this.setPagePosition(x, y, animate);
        }
        this.show();
    },

    /**
     * Sets the page XY position of the component.  To set the left and top instead, use {@link #setPosition}.
     * This method fires the {@link #move} event.
     * @param {Number} x The new x position
     * @param {Number} y The new y position
     * @param {Mixed} animate If passed, the Component is <i>animated</i> into its new position. If this parameter
     * is a number, it is used as the animation duration in milliseconds.
     * @return {Ext.Component} this
     */
    setPagePosition: function(x, y, animate) {
        var me = this,
            p;

        if (Ext.isArray(x)) {
            y = x[1];
            x = x[0];
        }
        me.pageX = x;
        me.pageY = y;
        if (me.floating && me.floatParent) {
            // Floating Components being positioned in their ownerCt have to be made absolute
            p = me.floatParent.getTargetEl().getViewRegion();
            if (Ext.isNumber(x) && Ext.isNumber(p.left)) {
                x -= p.left;
            }
            if (Ext.isNumber(y) && Ext.isNumber(p.top)) {
                y -= p.top;
            }
            me.setPosition(x, y, animate);
        }
        else {
            p = me.el.translatePoints(x, y);
            me.setPosition(p.left, p.top, animate);
        }
        return me;
    },

    /**
     * Gets the current box measurements of the component's underlying element.
     * @param {Boolean} local (optional) If true the element's left and top are returned instead of page XY (defaults to false)
     * @return {Object} box An object in the format {x, y, width, height}
     */
    getBox : function(local){
        var pos = this.getPosition(local);
        var s = this.getSize();
        s.x = pos[0];
        s.y = pos[1];
        return s;
    },

    /**
     * Sets the current box measurements of the component's underlying element.
     * @param {Object} box An object in the format {x, y, width, height}
     * @return {Ext.Component} this
     */
    updateBox : function(box){
        this.setSize(box.width, box.height);
        this.setPagePosition(box.x, box.y);
        return this;
    },

    // Include margins
    getOuterSize: function() {
        var el = this.el;
        return {
            width: el.getWidth() + el.getMargin('lr'),
            height: el.getHeight() + el.getMargin('tb')
        };
    },

    // private
    adjustSize: function(w, h) {
        if (this.autoWidth) {
            w = 'auto';
        }

        if (this.autoHeight) {
            h = 'auto';
        }

        return {
            width: w,
            height: h
        };
    },

    // private
    adjustPosition: function(x, y) {

        // Floating Components being positioned in their ownerCt have to be made absolute
        if (this.floating && this.floatParent) {
            var o = this.floatParent.getTargetEl().getViewRegion();
            x += o.left;
            y += o.top;
        }

        return {
            x: x,
            y: y
        };
    },

    /**
     * Gets the current XY position of the component's underlying element.
     * @param {Boolean} local (optional) If true the element's left and top are returned instead of page XY (defaults to false)
     * @return {Array} The XY position of the element (e.g., [100, 200])
     */
    getPosition: function(local) {
        var el = this.el,
            xy;

        if (local === true) {
            return [el.getLeft(true), el.getTop(true)];
        }
        xy = this.xy || el.getXY();

        // Floating Components in an ownerCt have to have their positions made relative
        if (this.floating && this.floatParent) {
            var o = this.floatParent.getTargetEl().getViewRegion();
            xy[0] -= o.left;
            xy[1] -= o.top;
        }
        return xy;
    },

    // Todo: add in xtype prefix support
    getId: function() {
        return this.id || (this.id = (this.getXType() || 'ext-comp') + '-' + this.getAutoId());
    },

    // overriden
    onEnable: function() {
        var actionEl = this.getActionEl();
        actionEl.removeCls(this.disabledCls);
        actionEl.dom.removeAttribute('aria-disabled');
        actionEl.dom.disabled = false;
    },

    // overriden
    onDisable: function() {
        var actionEl = this.getActionEl();
        actionEl.addCls(this.disabledCls);
        actionEl.dom.setAttribute('aria-disabled', true);
        actionEl.dom.disabled = true;
    },

    /**
     * <p>Shows this Component, rendering it first if {@link Ext.Component#autoRender} is <code>true</code>.</p>
     * <p>For a {@link Ext.window.Window Window}, it activates it and brings it to front if hidden.</p>
     * @param {String/Element} animateTarget (optional) The target element or id from which the Component should
     * animate while opening (defaults to null with no animation)
     * @param {Function} callback (optional) A callback function to call after the window is displayed. <b>Only necessary is animation was specified.</b>
     * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the callback is executed. Defaults to this Component.
     * @return {Component} this
     */
    show: function(animateTarget, cb, scope) {
        if (!(this.rendered && this.isVisible()) && this.fireEvent('beforeshow', this) !== false) {
            this.hidden = false;

            // Render on first show if there is an autoRender config, or if this is a floater (Window, Menu, BoundList etc).
            if (!this.rendered && (this.autoRender || this.floating)) {
                this.doAutoRender();
            }
            if (this.rendered) {
                this.beforeShow();
                this.onShow.apply(this, arguments);

                // Notify any owning Container unless it's suspended.
                // Floating Components do not participate in layouts.
                if (this.ownerCt && !this.ownerCt.suspendLayout && !this.floating) {
                    this.ownerCt.doLayout();
                }
            }
            this.afterShow();
        }
        return this;
    },

    beforeShow: Ext.emptyFn,

    afterShow: function() {
        if (this.floating) {
            this.toFront();
        }
        this.fireEvent('show', this);
    },

    hide: function() {
        if (!(this.rendered && !this.isVisible()) && this.fireEvent('beforehide', this) !== false) {
            this.hidden = true;
            if (this.rendered) {
                this.onHide();

                // Notify any owning Container unless it's suspended.
                // Floating Components do not participate in layouts.
                if (this.ownerCt && !this.ownerCt.suspendLayout && !this.floating) {
                    this.ownerCt.doLayout();
                }
            }
            this.fireEvent('hide', this);
        }
        return this;
    },

    // Private. Override in subclasses where more complex behaviour is needed.
    onShow: function() {
        this.el.show();
        Ext.Component.superclass.onShow.call(this);
    },

    // Private. Override in subclasses where more complex behaviour is needed.
    onHide: function() {
        this.el.hide();
    },

    destroy: function() {
        var me = this;
        if (!me.isDestroyed) {
            if (me.fireEvent('beforedestroy', me) !== false) {
                me.destroying = true;
                me.beforeDestroy();

                if (me.ownerCt && me.ownerCt.remove) {
                    me.ownerCt.remove(me, false);
                }
                delete me.floatParent;

                // Ensure that any ancillary components are destroyed.
                if (me.rendered) {
                    Ext.destroy(
                        me.proxy,
                        me.resizer
                    );
                    me.el.remove();
                    // Different from AbstractComponent
                    if (me.actionMode == 'container' || me.removeMode == 'container') {
                        me.container.remove();
                    }
                }

                // A zIndexManager is stamped into a *floating* Component when it is added to a Container.
                // If it has no zIndexManager at render time, it is assigned to the global Ext.WindowMgr instance.
                if (me.zIndexManager) {
                    me.zIndexManager.unregister(me);
                }

                me.onDestroy();

                Ext.ComponentMgr.unregister(me);
                me.fireEvent('destroy', me);

                me.clearListeners();
                me.destroying = false;
                me.isDestroyed = true;
            }
        }
    },

    // private
    initState: function() {
        if (Ext.state.Manager) {
            var id = this.getStateId();
            if (id) {
                var state = Ext.state.Manager.get(id);
                if (state) {
                    if (this.fireEvent('beforestaterestore', this, state) !== false) {
                        this.applyState(Ext.apply({},
                        state));
                        this.fireEvent('staterestore', this, state);
                    }
                }
            }
        }
    },

    // private
    getStateId: function() {
        return this.stateId || ((/^(ext-comp-|ext-gen)/).test(String(this.id)) ? null: this.id);
    },

    // private
    initStateEvents: function() {
        if (this.stateEvents) {
            for (var i = 0, e; e = this.stateEvents[i]; i++) {
                this.on(e, this.saveState, this, {
                    delay: 100
                });
            }
        }
    },

    // private
    applyState: function(state) {
        if (state) {
            Ext.apply(this, state);
        }
    },

    // private
    getState: function() {
        return null;
    },

    // private
    saveState: function() {
        if (Ext.state.Manager && this.stateful !== false) {
            var id = this.getStateId();
            if (id) {
                var state = this.getState();
                if (this.fireEvent('beforestatesave', this, state) !== false) {
                    Ext.state.Manager.set(id, state);
                    this.fireEvent('statesave', this, state);
                }
            }
        }
    },

    // This needs to die a horrible death.  For now it's a replaceMarkup, I can't see supporting this methodology going forward.
    /**
     * Apply this component to existing markup that is valid. With this function, no call to render() is required.
     * @param {String/HTMLElement} el
     */
    applyToMarkup: function(el) {
        this.allowDomMove = false;
        this.render(Ext.getDom(el).parentNode, null, true);
    },

    deleteMembers: function() {
        var args = arguments,
            len = args.length,
            i = 0;
        for (; i < len; ++i) {
            delete this[args[i]];
        }
    },

    /**
     * Try to focus this component.
     * @param {Boolean} selectText (optional) If applicable, true to also select the text in this component
     * @param {Boolean/Number} delay (optional) Delay the focus this number of milliseconds (true for 10 milliseconds).
     * @return {Ext.Component} this
     */
    focus: function(selectText, delay) {
        var me = this,
                focusEl;

        if (delay) {
            me.focusTask.delay(Ext.isNumber(delay) ? delay: 10, null, me, [selectText, false]);
            return me;
        }

        if (me.rendered && !me.isDestroyed) {
            // getFocusEl could return a Component.
            focusEl = me.getFocusEl();
            focusEl.focus();
            if (focusEl.dom && selectText === true) {
                focusEl.dom.select();
            }

            // Focusing a floating Component brings it to the front of its stack.
            // this is performed by its zIndexManager. Pass preventFocus true to avoid recursion.
            if (me.floating) {
                me.toFront(true);
            }
        }
        return me;
    },

    /**
     * @private
     * Returns the focus holder element associated with this Component. By default, this is the Component's encapsulating
     * element. Subclasses which use embedded focusable elements (such as Window and Button) should override this for use
     * by the {@link #focus} method.
     * @returns {Ext.core.Element} the focus holing element.
     */
    getFocusEl: function() {
        return this.el;
    },

    // private
    blur: function() {
        if (this.rendered) {
            this.getFocusEl().blur();
        }
        return this;
    },

    getEl: function() {
        return this.el;
    },

    // Deprecate 5.0
    getResizeEl: function() {
        return this.el;
    },

    // Deprecate 5.0
    getPositionEl: function() {
        return this.el;
    },

    // Deprecate 5.0
    getActionEl: function() {
        return this.el;
    },

    // Deprecate 5.0
    getVisibilityEl: function() {
        return this.el;
    },

    // Deprecate 5.0
    onResize: Ext.emptyFn,

    // private
    getBubbleTarget: function() {
        return this.ownerCt;
    },

    // private
    getContentTarget: function() {
        return this.el;
    },

    /**
     * Clone the current component using the original config values passed into this instance by default.
     * @param {Object} overrides A new config containing any properties to override in the cloned version.
     * An id property can be passed on this object, otherwise one will be generated to avoid duplicates.
     * @return {Ext.Component} clone The cloned copy of this component
     */
    cloneConfig: function(overrides) {
        overrides = overrides || {};
        var id = overrides.id || Ext.id();
        var cfg = Ext.applyIf(overrides, this.initialConfig);
        cfg.id = id;

        var self = Ext.getClass(this);

        // prevent dup id
        return new self(cfg);
    },

    /**
     * Gets the xtype for this component as registered with {@link Ext.ComponentMgr}. For a list of all
     * available xtypes, see the {@link Ext.Component} header. Example usage:
     * <pre><code>
var t = new Ext.form.Text();
alert(t.getXType());  // alerts 'textfield'
</code></pre>
     * @return {String} The xtype
     */
    getXType: function() {
        return this.self.xtype;
    },

    /**
     * Find a container above this component at any level by a custom function. If the passed function returns
     * true, the container will be returned.
     * @param {Function} fn The custom function to call with the arguments (container, this component).
     * @return {Ext.container.Container} The first Container for which the custom function returns true
     */
    findParentBy: function(fn) {
        var p;
        for (p = this.ownerCt; (p != null) && !fn(p, this); p = p.ownerCt);
        return p || null;
    },

    /**
     * <p>Find a container above this component at any level by xtype or class</p>
     * <p>See also the {@link Ext.Component#up up} method.</p>
     * @param {String/Class} xtype The xtype string for a component, or the class of the component directly
     * @return {Ext.container.Container} The first Container which matches the given xtype or class
     */
    findParentByType: function(xtype) {
        return Ext.isFunction(xtype) ?
            this.findParentBy(function(p) {
                return p.constructor === xtype;
            })
        :
            this.up(xtype);
    },

    /**
     * Bubbles up the component/container heirarchy, calling the specified function with each component. The scope (<i>this</i>) of
     * function call will be the scope provided or the current component. The arguments to the function
     * will be the args provided or the current component. If the function returns false at any point,
     * the bubble is stopped.
     * @param {Function} fn The function to call
     * @param {Object} scope (optional) The scope of the function (defaults to current node)
     * @param {Array} args (optional) The args to call the function with (default to passing the current component)
     * @return {Ext.Component} this
     */
    bubble: function(fn, scope, args) {
        var p = this;
        while (p) {
            if (fn.apply(scope || p, args || [p]) === false) {
                break;
            }
            p = p.ownerCt;
        }
        return this;
    },

    alignTo: function(el, position, offsets) {
        this.el.alignTo.apply(this.el, arguments);
    },

    getProxy: function() {
        if (!this.proxy) {
            this.proxy = this.el.createProxy(Ext.baseCSSPrefix + 'proxy-el', Ext.getBody(), true);
        }
        return this.proxy;
    }
}, function() {

    // A single focus delayer for all Components.
    this.prototype.focusTask = new Ext.util.DelayedTask(this.prototype.focus);

});
