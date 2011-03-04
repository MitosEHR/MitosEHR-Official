/**
 * @class Ext.AbstractComponent
 * Please refer to sub classes documentation
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

Ext.define('Ext.AbstractComponent', {

    /* Begin Definitions */

    mixins: {
        observable: 'Ext.util.Observable',
        animate: 'Ext.util.Animate'
    },

    requires: [
        'Ext.PluginMgr',
        'Ext.ComponentMgr',
        'Ext.core.Element',
        'Ext.core.DomHelper',
        'Ext.XTemplate',
        'Ext.ComponentQuery',
        'Ext.LoadMask',
        'Ext.ComponentLoader',
        'Ext.EventManager',
        'Ext.layout.Manager',
        'Ext.layout.component.Auto'
    ],

    // Please remember to add dependencies whenever you use it
    // I had to fix these many times already
    uses: [
        'Ext.ZIndexManager'
    ],

    statics: {
        AUTO_ID: 1000
    },

    /* End Definitions */

    isComponent: true,

    getAutoId: function() {
        return ++Ext.AbstractComponent.AUTO_ID;
    },

    /**
     * @cfg {String} id
     * <p>The <b><u>unique id of this component instance</u></b> (defaults to an {@link #getId auto-assigned id}).</p>
     * <p>It should not be necessary to use this configuration except for singleton objects in your application.
     * Components created with an id may be accessed globally using {@link Ext#getCmp Ext.getCmp}.</p>
     * <p>Instead of using assigned ids, use the {@link #itemId} config, and {@link Ext.ComponentQuery ComponentQuery} which
     * provides selector-based searching for Sencha Components analogous to DOM querying. The {@link Ext.container.Container Container}
     * class contains {@link Ext.container.Container#down shortcut methods} to query its descendant Components by selector.</p>
     * <p>Note that this id will also be used as the element id for the containing HTML element
     * that is rendered to the page for this component. This allows you to write id-based CSS
     * rules to style the specific instance of this component uniquely, and also to select
     * sub-elements using this component's id as the parent.</p>
     * <p><b>Note</b>: to avoid complications imposed by a unique <tt>id</tt> also see <code>{@link #itemId}</code>.</p>
     * <p><b>Note</b>: to access the container of a Component see <code>{@link #ownerCt}</code>.</p>
     */

    /**
     * @cfg {String} itemId
     * <p>An <tt>itemId</tt> can be used as an alternative way to get a reference to a component
     * when no object reference is available.  Instead of using an <code>{@link #id}</code> with
     * {@link Ext}.{@link Ext#getCmp getCmp}, use <code>itemId</code> with
     * {@link Ext.container.Container}.{@link Ext.container.Container#getComponent getComponent} which will retrieve
     * <code>itemId</code>'s or <tt>{@link #id}</tt>'s. Since <code>itemId</code>'s are an index to the
     * container's internal MixedCollection, the <code>itemId</code> is scoped locally to the container --
     * avoiding potential conflicts with {@link Ext.ComponentMgr} which requires a <b>unique</b>
     * <code>{@link #id}</code>.</p>
     * <pre><code>
var c = new Ext.panel.Panel({ //
    {@link Ext.Component#height height}: 300,
    {@link #renderTo}: document.body,
    {@link Ext.container.Container#layout layout}: 'auto',
    {@link Ext.container.Container#items items}: [
        {
            itemId: 'p1',
            {@link Ext.panel.Panel#title title}: 'Panel 1',
            {@link Ext.Component#height height}: 150
        },
        {
            itemId: 'p2',
            {@link Ext.panel.Panel#title title}: 'Panel 2',
            {@link Ext.Component#height height}: 150
        }
    ]
})
p1 = c.{@link Ext.container.Container#getComponent getComponent}('p1'); // not the same as {@link Ext#getCmp Ext.getCmp()}
p2 = p1.{@link #ownerCt}.{@link Ext.container.Container#getComponent getComponent}('p2'); // reference via a sibling
     * </code></pre>
     * <p>Also see <tt>{@link #id}</tt>, <code>{@link #query}</code>, <code>{@link #down}</code> and <code>{@link #child}</code>.</p>
     * <p><b>Note</b>: to access the container of an item see <tt>{@link #ownerCt}</tt>.</p>
     */

    /**
     * This Component's owner {@link Ext.container.Container Container} (defaults to undefined, and is set automatically when
     * this Component is added to a Container).  Read-only.
     * <p><b>Note</b>: to access items within the Container see <tt>{@link #itemId}</tt>.</p>
     * @type Ext.Container
     * @property ownerCt
     */

    /**
     * @cfg {Mixed} autoEl
     * <p>A tag name or {@link Ext.DomHelper DomHelper} spec used to create the {@link #getEl Element} which will
     * encapsulate this Component.</p>
     * <p>You do not normally need to specify this. For the base classes {@link Ext.Component} and {@link Ext.container.Container},
     * this defaults to <b><tt>'div'</tt></b>. The more complex Sencha classes use a more complex
     * DOM structure specified by their own {@link #renderTpl}s.</p>
     * <p>This is intended to allow the developer to create application-specific utility Components encapsulated by
     * different DOM elements. Example usage:</p><pre><code>
{
    xtype: 'component',
    autoEl: {
        tag: 'img',
        src: 'http://www.example.com/example.jpg'
    }
}, {
    xtype: 'component',
    autoEl: {
        tag: 'blockquote',
        html: 'autoEl is cool!'
    }
}, {
    xtype: 'container',
    autoEl: 'ul',
    cls: 'ux-unordered-list',
    items: {
        xtype: 'component',
        autoEl: 'li',
        html: 'First list item'
    }
}
</code></pre>
     */

    /**
     * @cfg {Mixed} renderTpl
     * <p>An {@link Ext.XTemplate XTemplate} used to create the internal structure inside this Component's
     * encapsulating {@link #getEl Element}.</p>
     * <p>You do not normally need to specify this. For the base classes {@link Ext.Component}
     * and {@link Ext.container.Container}, this defaults to <b><code>null</code></b> which means that they will be initially rendered
     * with no internal structure; they render their {@link #getEl Element} empty. The more specialized ExtJS and Touch classes
     * which use a more complex DOM structure, provide their own template definitions.</p>
     * <p>This is intended to allow the developer to create application-specific utility Components with customized
     * internal structure.</p>
     * <p>Upon rendering, any created child elements may be automatically imported into object properties using the
     * {@link #renderSelectors} option.</p>
     */
    renderTpl: null,

    /**
     * @cfg {Object} renderSelectors
     
An object containing properties specifying {@link Ext.DomQuery DomQuery} selectors which identify child elements
created by the render process.

After the Component's internal structure is rendered according to the {@link renderTpl}, this object is iterated through,
and the found Elements are added as properties to the Component using the `renderSelector` property name.

For example, a Component which rendered an image, and description into its element might use the following properties
coded into its prototype:

    renderTpl: '&lt;img src="{imageUrl}" class="x-image-component-img">&lt;div class="x-image-component-desc">{description}&gt;/div&lt;',

    renderSelectors: {
        image: 'img.x-image-component-img',
        descEl: 'div.x-image-component-desc'
    }

After rendering, the Component would have a property <code>image</code> referencing its child `img` Element,
and a property `descEl` referencing the `div` Element which contains the description.

     * @markdown
     */

    /**
     * @cfg {Mixed} renderTo
     * <p>Specify the id of the element, a DOM element or an existing Element that this component
     * will be rendered into.</p><div><ul>
     * <li><b>Notes</b> : <ul>
     * <div class="sub-desc">Do <u>not</u> use this option if the Component is to be a child item of
     * a {@link Ext.container.Container Container}. It is the responsibility of the
     * {@link Ext.container.Container Container}'s {@link Ext.container.Container#layout layout manager}
     * to render and manage its child items.</div>
     * <div class="sub-desc">When using this config, a call to render() is not required.</div>
     * </ul></li>
     * </ul></div>
     * <p>See <code>{@link #render}</code> also.</p>
     */

    /**
     * @cfg {Boolean} frame
     * <p>Specify as <code>true</code> to have the Component inject framing elements within the Component at render time to
     * provide a graphical rounded frame around the Component content.</p>
     * <p>This is only necessary when running on outdated, or non standard-compliant browsers such as Microsoft's Internet Explorer
     * prior to version 9 which do not support rounded corners natively.</p>
     * <p>The extra space taken up by this framing is available from the read only property {@link #frameSize}.</p>
     */

    /**
     * <p>Read-only property indicating the width of any framing elements which were added within the encapsulating element
     * to provide graphical, rounded borders. See the {@link #frame} config.</p>
     * <p> This is an object containing the frame width in pixels for all four sides of the Component containing
     * the following properties:</p><div class="mdetail-params"><ul>
     * <li><code>top</code> The width of the top framing element in pixels.</li>
     * <li><code>right</code> The width of the right framing element in pixels.</li>
     * <li><code>bottom</code> The width of the bottom framing element in pixels.</li>
     * <li><code>left</code> The width of the left framing element in pixels.</li>
     * </ul></div>
     * @property frameSize
     * @type {Object}
     */

    /**
     * @cfg {String/Object} componentLayout
     * <p>The sizing and positioning of a Component's internal Elements is the responsibility of
     * the Component's layout manager which sizes a Component's internal structure in response to the Component being sized.</p>
     * <p>Generally, developers will not use this configuration as all provided Components which need their internal
     * elements sizing (Such as {@link Ext.form.Field input fields}) come with their own componentLayout managers.</p>
     * <p>The {@link Ext.layout.container.Auto default layout manager} will be used on instances of the base Ext.Component class
     * which simply sizes the Component's encapsulating element to the height and width specified in the {@link setSize} method.</p>
     */

    /**
     * @cfg {Mixed} tpl
     * An <bold>{@link Ext.Template}</bold>, <bold>{@link Ext.XTemplate}</bold>
     * or an array of strings to form an Ext.XTemplate.
     * Used in conjunction with the <code>{@link #data}</code> and
     * <code>{@link #tplWriteMode}</code> configurations.
     */

    /**
     * @cfg {Mixed} data
     * The initial set of data to apply to the <code>{@link #tpl}</code> to
     * update the content area of the Component.
     */

    /**
     * @cfg {String} tplWriteMode The Ext.(X)Template method to use when
     * updating the content area of the Component. Defaults to <code>'overwrite'</code>
     * (see <code>{@link Ext.XTemplate#overwrite}</code>).
     */
    tplWriteMode: 'overwrite',

    /**
     * @cfg {String} baseCls
     * The base CSS class to apply to this components's element. This will also be prepended to
     * elements within this component like Panel's body will get a class x-panel-body. This means
     * that if you create a subclass of Panel, and you want it to get all the Panels styling for the
     * element and the body, you leave the baseCls x-panel and use componentCls to add specific styling for this
     * component.
     */
    baseCls: Ext.baseCSSPrefix + 'component',

    /**
     * @cfg {String} componentCls
     * CSS Class to be added to a components root level element to give distinction to it
     * via styling.
     */

    /**
     * @cfg {String} cls
     * An optional extra CSS class that will be added to this component's Element (defaults to '').  This can be
     * useful for adding customized styles to the component or any of its children using standard CSS rules.
     */

    /**
     * @cfg {String} overCls
     * An optional extra CSS class that will be added to this component's Element when the mouse moves
     * over the Element, and removed when the mouse moves out. (defaults to '').  This can be
     * useful for adding customized 'active' or 'hover' styles to the component or any of its children using standard CSS rules.
     */

    /**
     * @cfg {String} disabledCls
     * CSS class to add when the Component is disabled. Defaults to 'x-item-disabled'.
     */
    disabledCls: Ext.baseCSSPrefix + 'item-disabled',

    /**
     * @cfg {String} ui
     * A set of predefined ui styles for individual components.
     *
     * Most components support 'light' and 'dark'.
     *
     * Extra string added to the baseCls with an extra '-'.
     * <pre><code>
      new Ext.panel.Panel({
          title: 'Some Title',
          baseCls: 'x-component'
          ui: 'green'
      });
       </code></pre>
     * <p>The ui configuration in this example would add 'x-component-green' as an additional class.</p>
     */

   /**
     * @cfg {String} style
     * A custom style specification to be applied to this component's Element.  Should be a valid argument to
     * {@link Ext.core.Element#applyStyles}.
     * <pre><code>
        new Ext.panel.Panel({
            title: 'Some Title',
            renderTo: Ext.getBody(),
            width: 400, height: 300,
            layout: 'form',
            items: [{
                xtype: 'textarea',
                style: {
                    width: '95%',
                    marginBottom: '10px'
                }
            },
            new Ext.button.Button({
                text: 'Send',
                minWidth: '100',
                style: {
                    marginBottom: '10px'
                }
            })
            ]
        });
     </code></pre>
     */

    /**
     * @cfg {Number} width
     * The width of this component in pixels.
     */

    /**
     * @cfg {Number} height
     * The height of this component in pixels.
     */

    /**
     * @cfg {Number/String} border
     * Specifies the border for this component. The border can be a single numeric value to apply to all sides or
     * it can be a CSS style specification for each style, for example: '10 5 3 10'.
     */

    /**
     * @cfg {Number/String} padding
     * Specifies the padding for this component. The padding can be a single numeric value to apply to all sides or
     * it can be a CSS style specification for each style, for example: '10 5 3 10'.
     */

    /**
     * @cfg {Number/String} margin
     * Specifies the margin for this component. The margin can be a single numeric value to apply to all sides or
     * it can be a CSS style specification for each style, for example: '10 5 3 10'.
     */

    /**
     * @cfg {Boolean} hidden
     * Defaults to false.
     */
    hidden: false,

    /**
     * @cfg {Boolean} disabled
     * Defaults to false.
     */
    disabled: false,

    /**
     * @cfg {Boolean} draggable
     * Allows the component to be dragged via the touch event.
     */

    /**
     * Read-only property indicating whether or not the component can be dragged
     * @property draggable
     * @type {Boolean}
     */
    draggable: false,

    /**
     * @cfg {Boolean} floating
     * Create the Component as a floating and use absolute positioning.
     * Defaults to false.
     */
    floating: false,

    /**
     * @cfg {String} hideMode
     * A String which specifies how this Component's encapsulating DOM element will be hidden.
     * Values may be<div class="mdetail-params"><ul>
     * <li><code>'display'</code> : The Component will be hidden using the <code>display: none</code> style.</li>
     * <li><code>'visibility'</code> : The Component will be hidden using the <code>visibility: hidden</code> style.</li>
     * <li><code>'offsets'</code> : The Component will be hidden by absolutely positioning it out of the visible area of the document. This
     * is useful when a hidden Component must maintain measurable dimensions. Hiding using <code>display</code> results
     * in a Component having zero dimensions.</li></ul></div>
     * Defaults to <code>'display'</code>.
     */
    hideMode: 'display',

    /**
     * @cfg {String} contentEl
     * <p>Optional. Specify an existing HTML element, or the <code>id</code> of an existing HTML element to use as the content
     * for this component.</p>
     * <ul>
     * <li><b>Description</b> :
     * <div class="sub-desc">This config option is used to take an existing HTML element and place it in the layout element
     * of a new component (it simply moves the specified DOM element <i>after the Component is rendered</i> to use as the content.</div></li>
     * <li><b>Notes</b> :
     * <div class="sub-desc">The specified HTML element is appended to the layout element of the component <i>after any configured
     * {@link #html HTML} has been inserted</i>, and so the document will not contain this element at the time the {@link #render} event is fired.</div>
     * <div class="sub-desc">The specified HTML element used will not participate in any <code><b>{@link Ext.container.Container#layout layout}</b></code>
     * scheme that the Component may use. It is just HTML. Layouts operate on child <code><b>{@link Ext.container.Container#items items}</b></code>.</div>
     * <div class="sub-desc">Add either the <code>x-hidden</code> or the <code>x-hide-display</code> CSS class to
     * prevent a brief flicker of the content before it is rendered to the panel.</div></li>
     * </ul>
     */

    /**
     * @cfg {String/Object} html
     * An HTML fragment, or a {@link Ext.core.DomHelper DomHelper} specification to use as the layout element
     * content (defaults to ''). The HTML content is added after the component is rendered,
     * so the document will not contain this HTML at the time the {@link #render} event is fired.
     * This content is inserted into the body <i>before</i> any configured {@link #contentEl} is appended.
     */

    /**
     * @cfg {String} styleHtmlContent
     * True to automatically style the html inside the content target of this component (body for panels).
     * Defaults to false.
     */
    styleHtmlContent: false,

    /**
     * @cfg {String} styleHtmlCls
     * The class that is added to the content target when you set styleHtmlContent to true.
     * Defaults to 'x-html'
     */
    styleHtmlCls: Ext.baseCSSPrefix + 'html',

    /**
     * @cfg {Number} minHeight
     * <p>The minimum value in pixels which this Component will set its height to.</p>
     * <p><b>Warning:</b> This will override any size management applied by layout managers.</p>
     */
    /**
     * @cfg {Number} minWidth
     * <p>The minimum value in pixels which this Component will set its width to.</p>
     * <p><b>Warning:</b> This will override any size management applied by layout managers.</p>
     */
    /**
     * @cfg {Number} maxHeight
     * <p>The maximum value in pixels which this Component will set its height to.</p>
     * <p><b>Warning:</b> This will override any size management applied by layout managers.</p>
     */
    /**
     * @cfg {Number} maxWidth
     * <p>The maximum value in pixels which this Component will set its width to.</p>
     * <p><b>Warning:</b> This will override any size management applied by layout managers.</p>
     */

    /**
     * @cfg {Ext.ComponentLoader/Object} loader
     * A configuration object or an instance of a {@link Ext.ComponentLoader} to load remote
     * content for this Component.
     */

     // @private
     allowDomMove: true,

     autoShow: false,

    /**
     * @cfg {Mixed} autoRender
     * <p>This config is intended mainly for {@link #floating} Components which may or may not be shown. Instead
     * of using {@link #renderTo} in the configuration, and rendering upon construction, this allows a Component
     * to render itself upon first <i>{@link #show}</i>.</p>
     * <p>Specify as <code>true</code> to have this Component render to the document body upon first show.</p>
     * <p>Specify as an element, or the ID of an element to have this Component render to a specific element upon first show.</p>
     * <p><b>This defaults to <code>true</code> for the {@link Ext.window.Window Window} class.</b></p>
     */
     autoRender: false,

     needsLayout: false,

    /**
     * @cfg {Object/Array} plugins
     * An object or array of objects that will provide custom functionality for this component.  The only
     * requirement for a valid plugin is that it contain an init method that accepts a reference of type Ext.Component.
     * When a component is created, if any plugins are available, the component will call the init method on each
     * plugin, passing a reference to itself.  Each plugin can then call methods or respond to events on the
     * component as needed to provide its functionality.
     */

    /**
     * Read-only property indicating whether or not the component has been rendered.
     * @property rendered
     * @type {Boolean}
     */
    rendered: false,

    constructor : function(config) {
        var me = this,
            i, len;

        config = config || {};
        me.initialConfig = config;
        Ext.apply(me, config);

        me.addEvents(
            /**
             * @event beforeactivate
             * Fires before a Component has been visually activated.
             * Returning false from an event listener can prevent the activate
             * from occurring.
             * @param {Ext.Component} this
             */
             'beforeactivate',
            /**
             * @event activate
             * Fires after a Component has been visually activated.
             * @param {Ext.Component} this
             */
             'activate',
            /**
             * @event beforedeactivate
             * Fires before a Component has been visually deactivated.
             * Returning false from an event listener can prevent the deactivate
             * from occurring.
             * @param {Ext.Component} this
             */
             'beforedeactivate',
            /**
             * @event deactivate
             * Fires after a Component has been visually deactivated.
             * @param {Ext.Component} this
             */
             'deactivate',
            /**
             * @event added
             * Fires after a Component had been added to a Container.
             * @param {Ext.Component} this
             * @param {Ext.container.Container} container Parent Container
             * @param {Number} pos position of Component
             */
             'added',
            /**
             * @event disable
             * Fires after the component is disabled.
             * @param {Ext.Component} this
             */
             'disable',
            /**
             * @event enable
             * Fires after the component is enabled.
             * @param {Ext.Component} this
             */
             'enable',
            /**
             * @event beforeshow
             * Fires before the component is shown when calling the {@link #show} method.
             * Return false from an event handler to stop the show.
             * @param {Ext.Component} this
             */
             'beforeshow',
            /**
             * @event show
             * Fires after the component is shown when calling the {@link #show} method.
             * @param {Ext.Component} this
             */
             'show',
            /**
             * @event beforehide
             * Fires before the component is hidden when calling the {@link #hide} method.
             * Return false from an event handler to stop the hide.
             * @param {Ext.Component} this
             */
             'beforehide',
            /**
             * @event hide
             * Fires after the component is hidden.
             * Fires after the component is hidden when calling the {@link #hide} method.
             * @param {Ext.Component} this
             */
             'hide',
            /**
             * @event removed
             * Fires when a component is removed from an Ext.container.Container
             * @param {Ext.Component} this
             * @param {Ext.container.Container} ownerCt Container which holds the component
             */
             'removed',
            /**
             * @event beforerender
             * Fires before the component is {@link #rendered}. Return false from an
             * event handler to stop the {@link #render}.
             * @param {Ext.Component} this
             */
             'beforerender',
            /**
             * @event render
             * Fires after the component markup is {@link #rendered}.
             * @param {Ext.Component} this
             */
             'render',
            /**
             * @event afterrender
             * <p>Fires after the component rendering is finished.</p>
             * <p>The afterrender event is fired after this Component has been {@link #rendered}, been postprocesed
             * by any afterRender method defined for the Component, and, if {@link #stateful}, after state
             * has been restored.</p>
             * @param {Ext.Component} this
             */
             'afterrender',
            /**
             * @event beforedestroy
             * Fires before the component is {@link #destroy}ed. Return false from an event handler to stop the {@link #destroy}.
             * @param {Ext.Component} this
             */
             'beforedestroy',
            /**
             * @event destroy
             * Fires after the component is {@link #destroy}ed.
             * @param {Ext.Component} this
             */
             'destroy',
            /**
             * @event resize
             * Fires after the component is resized.
             * @param {Ext.Component} this
             * @param {Number} adjWidth The box-adjusted width that was set
             * @param {Number} adjHeight The box-adjusted height that was set
             */
             'resize',
            /**
             * @event move
             * Fires after the component is moved.
             * @param {Ext.Component} this
             * @param {Number} x The new x position
             * @param {Number} y The new y position
             */
             'move',

             'beforestaterestore',
             'staterestore',
             'beforestatesave',
             'statesave'
        );

        me.getId();

        me.mons = [];
        me.additionalCls = [];
        me.renderData = me.renderData || {};
        me.renderSelectors = me.renderSelectors || {};

        if (me.plugins) {
            me.plugins = [].concat(me.plugins);
            for (i = 0, len = me.plugins.length; i < len; i++) {
                me.plugins[i] = me.constructPlugin(me.plugins[i]);
            }
        }

        me.initComponent();

        // ititComponent gets a chance to change the id property before registering
        Ext.ComponentMgr.register(me);

        // Dont pass the config so that it is not applied to 'this' again
        me.mixins.observable.constructor.call(me);

        // Move this into Observable?
        if (me.plugins) {
            me.plugins = [].concat(me.plugins);
            for (i = 0, len = me.plugins.length; i < len; i++) {
                me.plugins[i] = me.initPlugin(me.plugins[i]);
            }
        }

        me.loader = me.getLoader();

        // This won't work in Touch
        if (me.applyTo) {
            me.applyToMarkup(me.applyTo);
            delete me.applyTo;
        }
        else if (me.renderTo) {
            me.render(me.renderTo);
        }

        //<debug>
        if (Ext.isDefined(me.disabledClass)) {
            throw "Component: disabledClass has been deprecated. Please use disabledCls.";
        }
        //</debug>
    },

    initComponent: Ext.emptyFn,
    applyToMarkup: Ext.emptyFn,

    show: Ext.emptyFn,

    animate: function(animObj) {
        var me = this,
            to;

        animObj = animObj || {};
        to = animObj.to || {};

        if (Ext.fx.Manager.hasFxBlock(me.id)) {
            return me;
        }
        // Special processing for animating Component dimensions.
        if (!animObj.dynamic && (to.height || to.width)) {
            var curWidth = me.getWidth(),
                w = curWidth,
                curHeight = me.getHeight(),
                h = curHeight,
                needsResize = false;

            if (to.height && to.height > curHeight) {
                h = to.height;
                needsResize = true;
            }
            if (to.width && to.width > curWidth) {
                w = to.width;
                needsResize = true;
            }

            // If any dimensions are being increased, we must resize the internal structure
            // of the Component, but then clip it by sizing its encapsulating element back to original dimensions.
            // The animation will then progressively reveal the larger content.
            if (needsResize) {
                var clearWidth = !Ext.isNumber(me.width),
                    clearHeight = !Ext.isNumber(me.height);

                me.componentLayout.childrenChanged = true;
                me.setSize(w, h, me.ownerCt);
                me.el.setSize(curWidth, curHeight);
                if (clearWidth) {
                    delete me.width;
                }
                if (clearHeight) {
                    delete me.height;
                }
            }
        }
        return me.mixins.animate.animate.apply(me, arguments);
    },

    onShow : function() {
        // Layout if needed
        var needsLayout = this.needsLayout;
        if (Ext.isObject(needsLayout)) {
            this.doComponentLayout(needsLayout.width, needsLayout.height, needsLayout.isSetSize, needsLayout.ownerCt);
        }
    },

    constructPlugin: function(plugin) {
        if (plugin.ptype && typeof plugin.init != 'function') {
            plugin.cmp = this;
            plugin = Ext.PluginMgr.create(plugin);
        }
        else if (typeof plugin == 'string') {
            plugin = Ext.PluginMgr.create({
                ptype: plugin,
                cmp: this
            });
        }
        return plugin;
    },


    // @private
    initPlugin : function(plugin) {
        plugin.init(this);

        return plugin;
    },

    /**
     * Handles autoRender.
     * Floating Components may have an ownerCt. If they are asking to be constrained, constrain them within that
     * ownerCt, and have their z-index managed locally. Floating Components are always rendered to document.body
     */
    doAutoRender: function() {
        var me = this;
        if (me.floating) {
            me.render(document.body);
        } else {
            me.render(Ext.isBoolean(me.autoRender) ? Ext.getBody() : me.autoRender);
        }
    },

    /**
     * @private
     * <p>Finds the ancestor Container responsible for allocating zIndexes for the passed Component.</p>
     * <p>That will be the outermost Container (a Container which has no ownerCt).</p>
     * <p>If we have no ancestors, or we walk all the way up to the document body, there's no zIndexParent,
     * and the global Ext.WindowMgr will be used.</p>
     */
    getZIndexParent: function() {
        var p = this.ownerCt,
            c;

        if (p) {
            while (p) {
                c = p;
                p = p.ownerCt;
            }
            if (c.el.dom !== document.body) {
                return c;
            }
        }
    },

    // @private
    render : function(container, position) {
        var me = this;

        if (!me.rendered && me.fireEvent('beforerender', me) !== false) {
            // If this.el is defined, we want to make sure we are dealing with
            // an Ext Element.
            if (me.el) {
                me.el = Ext.get(me.el);
            }

            // Floaters must register with a ZIndexManager at render time when the ownerCt chain is complete
            if (me.floating) {
                me.zIndexParent = me.getZIndexParent();
                me.floatParent = me.ownerCt;
                delete me.ownerCt;

                // If a floating Component is configured to be constrained, but has no configured
                // constrainTo setting, set its constrainTo to be it's ownerCt before rendering.
                if ((me.constrain || me.constrainHeader) && !me.constrainTo) {
                    me.constrainTo = me.floatParent ? me.floatParent.getTargetEl() : Ext.getBody();
                }
                if (me.zIndexParent) {
                    me.zIndexParent.registerFloatingItem(me);
                } else {
                    Ext.WindowMgr.register(me);
                }
            }

            container = me.initContainer(container);

            me.onRender(container, position);

            // Tell the encapsulating element to hide itself in the way the Component is configured to hide
            // This means DISPLAY, VISIBILITY or OFFSETS.
            me.el.setVisibilityMode(Ext.core.Element[me.hideMode.toUpperCase()]);

            if(me.overCls){
                me.el.addClsOnOver(me.overCls);
            }
            me.fireEvent('render', me);

            me.initContent();

            me.afterRender(container);
            me.fireEvent('afterrender', me);

            me.initEvents();

            if (me.autoShow) {
                me.show();
            }

            if (me.hidden) {
                // call this so we don't fire initial hide events.
                me.onHide(false); // no animation after render
            }

            if (me.disabled) {
                // pass silent so the event doesn't fire the first time.
                me.disable(true);
            }
        }
        return me;
    },

    // @private
    onRender : function(container, position) {
        var me = this,
            el = me.el,
            cls = me.initCls(),
            styles = me.initStyles(),
            renderTpl,
            renderData;

        position = me.getInsertPosition(position);

        if (!el) {
            if (position) {
                el = Ext.core.DomHelper.insertBefore(position, me.getElConfig(), true);
            } else {
                el = Ext.core.DomHelper.append(container, me.getElConfig(), true);
            }
        }
        else if (me.allowDomMove !== false) {
            if (position) {
                container.dom.insertBefore(el.dom, position);
            } else {
                container.dom.appendChild(el.dom);
            }
        }

        if (Ext.scopeResetCSS && !me.ownerCt) {
            // If this component's el is the body element, we add the reset class to the html tag
            if (el.dom == Ext.getBody().dom) {
                el.parent().addCls(Ext.baseCSSPrefix + 'reset');
            }
            else {
                // Else we wrap this element in an element that adds the reset class.
                me.resetEl = el.wrap({
                    cls: Ext.baseCSSPrefix + 'reset'
                });                
            }
        }
                
        el.addCls(cls);
        el.setStyle(styles);

        // Here we check if the component has a height set through style or css.
        // If it does then we set the this.height to that value and it won't be
        // considered an auto height component
        // if (this.height === undefined) {
        //     var height = el.getHeight();
        //     // This hopefully means that the panel has an explicit height set in style or css
        //     if (height - el.getPadding('tb') - el.getBorderWidth('tb') > 0) {
        //         this.height = height;
        //     }
        // }

        me.el = el;

        if (!Ext.supports.CSS3BorderRadius) {
            me.initFrame(cls, styles);
        }

        renderTpl = me.initRenderTpl();
        if (renderTpl) {
            renderData = me.initRenderData();
            renderTpl.append(me.getTargetEl(), renderData);
        }

        me.applyRenderSelectors();
        me.rendered = true;
    },

    // @private
    afterRender : function() {
        var me = this,
            pos,
            xy;

        me.getComponentLayout();

        // Set the size if a size is configured, or if this is the outermost Container
        if (!me.ownerCt || (me.height || me.width)) {
            me.setSize(me.width, me.height);
        }

        // For floaters, calculate x and y if they aren't defined by aligning
        // the sized element to the center of either the the container or the ownerCt
        if (me.floating && (me.x === undefined || me.y === undefined)) {
            if (me.floatParent) {
                xy = me.el.getAlignToXY(me.floatParent.getTargetEl(), 'c-c');
                pos = me.floatParent.getTargetEl().translatePoints(xy[0], xy[1]);
            } else {
                xy = me.el.getAlignToXY(me.container, 'c-c');
                pos = me.el.translatePoints(xy[0], xy[1]);
            }
            me.x = me.x === undefined ? pos.left: me.x;
            me.y = me.y === undefined ? pos.top: me.y;
        }

        if (me.x || me.y) {
            me.setPosition(me.x, me.y);
        }

        if (me.styleHtmlContent) {
            me.getTargetEl().addCls(me.styleHtmlCls);
        }
    },

    frameCls: Ext.baseCSSPrefix + 'frame',

    frameTpl: [
        '<tpl if="top">',
            '<tpl if="left"><div class="{frameCls}-tl {baseCls}-tl" style="background-position: 0 -{tl}px; padding-left: {frameWidth}px" role="presentation"></tpl>',
                '<tpl if="right"><div class="{frameCls}-tr {baseCls}-tr" style="background-position: right -{tr}px; padding-right: {frameWidth}px" role="presentation"></tpl>',
                    '<div class="{frameCls}-tc {baseCls}-tc" style="background-position: 0 0; height: {frameWidth}px" role="presentation"></div>',
                '<tpl if="right"></div></tpl>',
            '<tpl if="left"></div></tpl>',
        '</tpl>',
        '<tpl if="left"><div class="{frameCls}-ml {baseCls}-ml" style="background-position: 0 0; padding-left: {frameWidth}px" role="presentation"></tpl>',
            '<tpl if="right"><div class="{frameCls}-mr {baseCls}-mr" style="background-position: right 0; padding-right: {frameWidth}px" role="presentation"></tpl>',
                '<div class="{frameCls}-mc {baseCls}-mc" role="presentation"></div>',
            '<tpl if="right"></div></tpl>',
        '<tpl if="left"></div></tpl>',
        '<tpl if="bottom">',
            '<tpl if="left"><div class="{frameCls}-bl {baseCls}-bl" style="background-position: 0 -{bl}px; padding-left: {frameWidth}px" role="presentation"></tpl>',
                '<tpl if="right"><div class="{frameCls}-br {baseCls}-br" style="background-position: right -{br}px; padding-right: {frameWidth}px" role="presentation"></tpl>',
                    '<div class="{frameCls}-bc {baseCls}-bc" style="background-position: 0 -{frameWidth}px; height: {frameWidth}px" role="presentation"></div>',
                '<tpl if="right"></div></tpl>',
            '<tpl if="left"></div></tpl>',
        '</tpl>'
    ],

    frameTableTpl: [
        '<tpl if="top">',
            '<tr>',
                '<tpl if="left"><td class="{frameCls}-tl {baseCls}-tl" style="background-position: 0 -{tl}px; width: {frameWidth}px" role="presentation"></td></tpl>',
                '<td class="{frameCls}-tc {baseCls}-tc" style="background-position: 0 0; height: {frameWidth}px" role="presentation"></td>',
                '<tpl if="right"><td class="{frameCls}-tr {baseCls}-tr" style="background-position: right -{tr}px; width: {frameWidth}px" role="presentation"></td></tpl>',
            '</tr>',
        '</tpl>',
        '<tr>',
            '<tpl if="left"><td class="{frameCls}-ml {baseCls}-ml" style="background-position: 0 -{ml}px; width: {frameWidth}px" role="presentation"></td></tpl>',
            '<td class="{frameCls}-mc {baseCls}-mc" style="background-position: 0 0;" role="presentation"></td>',
            '<tpl if="right"><td class="{frameCls}-mr {baseCls}-mr" style="background-position: right 0; width: {frameWidth}px" role="presentation"></td></tpl>',
        '</tr>',
        '<tpl if="bottom">',
            '<tr>',
                '<tpl if="left"><td class="{frameCls}-bl {baseCls}-bl" style="background-position: 0 -{bl}px; width: {frameWidth}px" role="presentation"></td></tpl>',
                '<td class="{frameCls}-bc {baseCls}-bc" style="background-position: 0 -{frameWidth}px; height: {frameWidth}px" role="presentation"></td>',
                '<tpl if="right"><td class="{frameCls}-br {baseCls}-br" style="background-position: right -{br}px; width: {frameWidth}px" role="presentation"></td></tpl>',
            '</tr>',
        '</tpl>'
    ],

    initFrame : function(cls, styles) {
        var me = this,
            frameBaseCls = me.baseCls + (me.ui ? '-' + me.ui : ''),
            left = me.el.getStyle('background-position-x'),
            top = me.el.getStyle('background-position-y'),
            frameWidth = 0, frameSize,
            frameRenderTarget, frameTpl,
            isTable, radius, info;

        // Some browsers dont support background-position-x and y, so for those
        // browsers let's split background-position into two parts.
        if (!left && !top) {
            info = me.el.getStyle('background-position').split(' ');
            left = info[0];
            top = info[1];
        }
        
        // We actually pass a string in the form of '[type][tl][tr]px [type][br][bl]px' as
        // the background position of this.el from the css to indicate to IE that this component needs
        // framing. We parse it here and change the markup accordingly.
        if (parseInt(left, 10) >= 1000000 && parseInt(top, 10) >= 1000000) {
            // Table markup starts with 100, div markup with 110.
            if (left.substr(0, 3) == '110') {
                // If we are going to be using a table for framing, we are going to replace
                // this.el with a table.
                me.el.replaceWith({
                    tag: 'table',
                    id: me.el.id,
                    html: '<tbody></tbody>'
                });
        
                // We have to reapply the classes and styling to the table
                me.el.addCls(cls);
                me.el.setStyle(styles);
        
                // The true makes sure we get the table framing
                frameTpl = me.getFrameTpl(true);
        
                // The render target for the frame now becomes the tbody instead of this.getTargetEl
                frameRenderTarget = me.el.down('tbody');
            } else {
                frameTpl = me.getFrameTpl();
                frameRenderTarget = me.getTargetEl();
            }
            // Get and parse the different border radius sizes
            frameSize  = {
                top:    Math.max(left.substr(3, 2), left.substr(5, 2)),
                right:  Math.max(left.substr(5, 2), top.substr(3, 2)),
                bottom: Math.max(top.substr(3, 2), top.substr(5, 2)),
                left:   Math.max(top.substr(5, 2), left.substr(3, 2))
            };
            frameWidth = Math.max(frameSize.top, frameSize.right, frameSize.bottom, frameSize.left);
        
            // Just to be sure we set the background image of the el to none.
            me.el.setStyle('background-image', 'none');
        }
        
        // This happens when you set frame: true explicitly without using the x-frame mixin in sass.
        // This way IE can't figure out what sizes to use and thus framing can't work.
        if (me.frame === true && !frameSize) {
            //<debug error>
            throw new Error("[" + Ext.getClassName(me) + "#initFrame] You have set frame: true explicity on this component " +
                            "while it doesnt have any framing in sass. This way IE can't figure out what sizes to use and thus framing" +
                            "on this component will be disabled");
            //</debug>
        }
        
        me.frame = me.frame || !!frameWidth;
        me.frameSize = frameSize || false;
        
        if (me.frame) {
            //<debug error>
            if (!frameSize) {
                throw new Error("[" + Ext.getClassName(me) + "#initFrame] Unable to read background-image style " +
                                "(got '" + info + "') of element: " + me.el.dom.outerHTML + " to handle framing.");
            }
            //</debug>
        
            // Here we render the frameTpl to this component. This inserts the 9point div or the table framing.
            frameTpl.append(frameRenderTarget, {
                frameCls:   me.frameCls,
                baseCls:    frameBaseCls,
                frameWidth: frameWidth,
                top:        !!frameSize.top,
                left:       !!frameSize.left,
                right:      !!frameSize.right,
                bottom:     !!frameSize.bottom,
                tl:         (frameWidth * 2),
                tr:         (frameWidth * 3),
                bl:         (frameWidth * 4),
                br:         (frameWidth * 5)
            });
        
            // The frameBody is returned in getTargetEl, so that layouts render items to the correct target.
            me.frameBody = me.el.down('.' + frameBaseCls + '-mc');
        }
    },

    getFrameTpl : function(table) {
        var frameTpl = table ? this.frameTableTpl : this.frameTpl;

        if (Ext.isArray(frameTpl) || typeof frameTpl === "string") {
            frameTpl = new Ext.XTemplate(frameTpl);
        }

        return frameTpl;
    },

    /**
     * <p>Creates an array of class names from the configurations to add to this Component's <code>el</code> on render.</p>
     * <p>Private, but (possibly) used by ComponentQuery for selection by class name if Component is not rendered.</p>
     * @return {Array} An array of class names with which the Component's element will be rendered.
     * @private
     */
    initCls: function() {
        var me = this,
            cls = [];
        
        cls.push(me.baseCls);

        //<deprecated since=0.99>
        if (Ext.isDefined(me.cmpCls)) {
            throw "Ext.Component: cmpCls renamed to componentCls";
        }
        //</deprecated>
        if (me.componentCls) {
            cls.push(me.componentCls);
        } else {
            me.componentCls = me.baseCls;
        }
        if (me.cls) {
            cls.push(me.cls);
            delete me.cls;
        }
        if (me.ui) {
            cls.push(me.componentCls + '-' + me.ui);
        }
        if (me.frame) {
            cls.push('x-framed ' + me.baseCls + '-' + (me.ui ? me.ui + '-' : '') + 'framed');
        }
        return cls.concat(me.additionalCls);
    },

    getElConfig : function() {
        var result = this.autoEl || {tag: 'div'};
        result.id = this.id;
        return result;
    },

    /**
     * This function takes the position argument passed to onRender and returns a
     * DOM element that you can use in the insertBefore.
     * @param {String/Number/Element/HTMLElement} position Index, element id or element you want
     * to put this component before.
     * @return {HTMLElement} DOM element that you can use in the insertBefore
     */
    getInsertPosition: function(position) {
        // Convert the position to an element to insert before
        if (position !== undefined) {
            if (Ext.isNumber(position)) {
                position = this.container.dom.childNodes[position];
            }
            else {
                position = Ext.getDom(position);
            }
        }

        return position;
    },

    /**
     * Adds ctCls to container.
     * @return {Ext.core.Element} The initialized container
     * @private
     */
    initContainer: function(container) {
        var me = this;
        
        // If you render a component specifying the el, we get the container
        // of the el, and make sure we dont move the el around in the dom
        // during the render
        if (!container && me.el) {
            container = me.el.dom.parentNode;
            me.allowDomMove = false;
        }

        me.container = Ext.get(container);

        if (me.ctCls) {
            me.container.addCls(me.ctCls);
        }

        return me.container;
    },

    /**
     * Initialized the renderData to be used when rendering the renderTpl.
     * @return {Object} Object with keys and values that are going to be applied to the renderTpl
     * @private
     */
    initRenderData: function() {
        var me = this;
        
        return Ext.applyIf(me.renderData, {
            ui: me.ui,
            baseCls: me.baseCls,
            componentCls: me.componentCls,
            frame: me.frame
        });
    },

    /**
     * Initializes the renderTpl.
     * @return {Ext.XTemplate} The renderTpl XTemplate instance.
     * @private
     */
    initRenderTpl: function() {
        var renderTpl = this.renderTpl,
            prototype = Ext.AbstractComponent.prototype;

        if (renderTpl) {
            if (prototype.renderTpl !== renderTpl) {
                if (Ext.isArray(renderTpl) || typeof renderTpl === "string") {
                    renderTpl = new Ext.XTemplate(renderTpl);
                }
            }
            else if (Ext.isArray(prototype.renderTpl)){
                renderTpl = prototype.renderTpl = new Ext.XTemplate(renderTpl);
            }
        }
        return renderTpl;
    },

    /**
     * Function description
     * @return {String} A CSS style string with style, padding, margin and border.
     * @private
     */
    initStyles: function() {
        var style = {},
            me = this,
            Element = Ext.core.Element,
            i, ln, split, prop;

        if (Ext.isString(me.style)) {
            style = Element.parseStyles(me.style);
        } else {
            style = Ext.apply({}, me.style);
        }

        // Convert the padding, margin and border properties from a space seperated string
        // into a proper style string
        if (me.padding != undefined) {
            style.padding = Element.unitizeBox((me.padding === true) ? 5 : me.padding);
        }

        if (me.margin != undefined) {
            style.margin = Element.unitizeBox((me.margin === true) ? 5 : me.margin);
        }

        if (me.border != undefined) {
            style.borderWidth = Element.unitizeBox((me.border === true) ? 1 : me.border);
        }

        delete me.style;
        return style;
    },

    /**
     * Initializes this components contents. It checks for the properties
     * html, contentEl and tpl/data.
     * @private
     */
    initContent: function() {
        var me = this,
            target = me.getTargetEl(),
            contentEl,
            pre;

        if (me.html) {
            target.update(Ext.core.DomHelper.markup(me.html));
            delete me.html;
        }

        if (me.contentEl) {
            contentEl = Ext.get(me.contentEl);
            pre = Ext.baseCSSPrefix;
            contentEl.removeCls([pre + 'hidden', pre + 'hide-display', pre + 'hide-offsets', pre + 'hide-nosize']);
            target.appendChild(contentEl.dom);
        }

        if (me.tpl) {
            // Make sure this.tpl is an instantiated XTemplate
            if (!me.tpl.isTemplate) {
                me.tpl = new Ext.XTemplate(me.tpl);
            }

            if (me.data) {
                me.tpl[me.tplWriteMode](target, me.data);
                delete me.data;
            }
        }
    },

    // @private
    initEvents : function() {
        var me = this,
            afterRenderEvents = me.afterRenderEvents,
            property, listeners;
        if (afterRenderEvents) {
            for (property in afterRenderEvents) {
                if (!afterRenderEvents.hasOwnProperty(property)) {
                    continue;
                }
                listeners = afterRenderEvents[property];
                if (me[property] && me[property].on) {
                    me.mon(me[property], listeners);
                }
            }
        }
    },

    /**
     * Sets references to elements inside the component. E.g body -> x-panel-body
     * @private
     */
    applyRenderSelectors: function() {
        var selectors = this.renderSelectors || {},
            el = this.el.dom,
            selector;

        for (selector in selectors) {
            if (!selectors.hasOwnProperty(selector) || !selectors[selector]) {
                continue;
            }
            this[selector] = Ext.get(Ext.DomQuery.selectNode(selectors[selector], el));
        }
    },

    is: function(selector) {
        return Ext.ComponentQuery.is(this, selector);
    },

    /**
     * <p>Walks up the <code>ownerCt</code> axis looking for an ancestor Container which matches
     * the passed simple selector.</p>
     * <p>Example:<pre><code>
var owningTabContainer = grid.up('tabcontainer');
</code></pre>
     * @param {String} selector Optional. The simple selector to test.
     * @return {Ext.container.Container} The matching ancestor Container (or <code>undefined</code> if no match was found).
     */
    up: function(selector) {
        var result = this.ownerCt;
        if (selector) {
            for (; result; result = result.ownerCt) {
                if (Ext.ComponentQuery.is(result, selector)) {
                    return result;
                }
            }
        }
        return result;
    },

    /**
     * <p>Returns the next sibling of this Component.</p>
     * <p>Optionally selects the next sibling which matches the passed {@link Ext.ComponentQuery ComponentQuery} selector.</p>
     * <p>May also be refered to as <code><b>prev()</b></code></p>
     * @param selector Optional. A {@link Ext.ComponentQuery ComponentQuery} selector to filter the following items.
     * @returns The next sibling (or the next sibling which matches the selector). Returns null if there is no matching sibling.
     */
    nextSibling: function(selector) {
        var o = this.ownerCt, it, last, idx, c;
        if (o) {
            it = o.items;
            idx = it.indexOf(this) + 1;
            if (idx) {
                if (selector) {
                    for (last = it.getCount(); idx < last; idx++) {
                        if ((c = it.getAt(idx)).is(selector)) {
                            return c;
                        }
                    }
                } else {
                    if (idx < it.getCount()) {
                        return it.getAt(idx);
                    }
                }
            }
        }
        return null;
    },

    /**
     * <p>Returns the previous sibling of this Component.</p>
     * <p>Optionally selects the previous sibling which matches the passed {@link Ext.ComponentQuery ComponentQuery} selector.</p>
     * <p>May also be refered to as <code><b>prev()</b></code></p>
     * @param selector Optional. A {@link Ext.ComponentQuery ComponentQuery} selector to filter the preceding items.
     * @returns The previous sibling (or the previous sibling which matches the selector). Returns null if there is no matching sibling.
     */
    previousSibling: function(selector) {
        var o = this.ownerCt, it, idx, c;
        if (o) {
            it = o.items;
            idx = it.indexOf(this);
            if (idx != -1) {
                if (selector) {
                    for (--idx; idx >= 0; idx--) {
                        if ((c = it.getAt(idx)).is(selector)) {
                            return c;
                        }
                    }
                } else {
                    if (idx) {
                        return it.getAt(--idx);
                    }
                }
            }
        }
        return null;
    },

    /**
     * Retrieves the id of this component.
     * Will autogenerate an id if one has not already been set.
     */
    getId : function() {
        return this.id || (this.id = 'ext-comp-' + (this.getAutoId()));
    },

    getItemId : function() {
        return this.itemId || this.id;
    },

    /**
     * Retrieves the top level element representing this component.
     */
    getEl : function() {
        return this.el;
    },

    /**
     * This is used to determine where to insert the 'html', 'contentEl' and 'items' in this component.
     * @private
     */
    getTargetEl: function() {
        return this.frameBody || this.el;
    },

    /**
     * <p>Tests whether or not this Component is of a specific xtype. This can test whether this Component is descended
     * from the xtype (default) or whether it is directly of the xtype specified (shallow = true).</p>
     * <p><b>If using your own subclasses, be aware that a Component must register its own xtype
     * to participate in determination of inherited xtypes.</b></p>
     * <p>For a list of all available xtypes, see the {@link Ext.Component} header.</p>
     * <p>Example usage:</p>
     * <pre><code>
var t = new Ext.form.Text();
var isText = t.isXType('textfield');        // true
var isBoxSubclass = t.isXType('field');       // true, descended from Ext.form.Field
var isBoxInstance = t.isXType('field', true); // false, not a direct Ext.form.Field instance
</code></pre>
     * @param {String} xtype The xtype to check for this Component
     * @param {Boolean} shallow (optional) False to check whether this Component is descended from the xtype (this is
     * the default), or true to check whether this Component is directly of the specified xtype.
     * @return {Boolean} True if this component descends from the specified xtype, false otherwise.
     */
    isXType: function(xtype, shallow) {
        //assume a string by default
        if (Ext.isFunction(xtype)) {
            xtype = xtype.xtype;
            //handle being passed the class, e.g. Ext.Component
        } else if (Ext.isObject(xtype)) {
            xtype = xtype.statics().xtype;
            //handle being passed an instance
        }

        return !shallow ? ('/' + this.getXTypes() + '/').indexOf('/' + xtype + '/') != -1: this.self.xtype == xtype;
    },

    /**
     * <p>Returns this Component's xtype hierarchy as a slash-delimited string. For a list of all
     * available xtypes, see the {@link Ext.Component} header.</p>
     * <p><b>If using your own subclasses, be aware that a Component must register its own xtype
     * to participate in determination of inherited xtypes.</b></p>
     * <p>Example usage:</p>
     * <pre><code>
var t = new Ext.form.Text();
alert(t.getXTypes());  // alerts 'component/field/textfield'
</code></pre>
     * @return {String} The xtype hierarchy string
     */
    getXTypes: function() {
        var self = this.self,
            xtypes      = [],
            parentPrototype  = this,
            xtype;

        if (!self.xtypes) {
            while (parentPrototype && Ext.getClass(parentPrototype)) {
                xtype = Ext.getClass(parentPrototype).xtype;

                if (xtype !== undefined) {
                    xtypes.unshift(xtype);
                }

                parentPrototype = parentPrototype.superclass;
            }

            self.xtypeChain = xtypes;
            self.xtypes = xtypes.join('/');
        }

        return self.xtypes;
    },

    /**
     * Update the content area of a component.
     * @param {Mixed} htmlOrData
     * If this component has been configured with a template via the tpl config
     * then it will use this argument as data to populate the template.
     * If this component was not configured with a template, the components
     * content area will be updated via Ext.core.Element update
     * @param {Boolean} loadScripts
     * (optional) Only legitimate when using the html configuration. Defaults to false
     * @param {Function} callback
     * (optional) Only legitimate when using the html configuration. Callback to execute when scripts have finished loading
     */
    update : function(htmlOrData, loadScripts, cb) {
        var me = this;
        
        if (me.tpl && !Ext.isString(htmlOrData)) {
            me.data = htmlOrData;
            if (me.rendered) {
                me.tpl[me.tplWriteMode](me.getTargetEl(), htmlOrData || {});
            }
        } else {
            me.html = Ext.isObject(htmlOrData) ? Ext.core.DomHelper.markup(htmlOrData) : htmlOrData;
            if (me.rendered) {
                me.getTargetEl().update(me.html, loadScripts, cb);
            }
        }

        if (me.rendered) {
            me.doComponentLayout();
        }
    },

    /**
     * Convenience function to hide or show this component by boolean.
     * @param {Boolean} visible True to show, false to hide
     * @return {Ext.Component} this
     */
    setVisible : function(visible) {
        return this[visible ? 'show': 'hide']();
    },

    /**
     * Returns true if this component is visible.
     * @param {Boolean} deep. <p>Optional. Pass <code>true</code> to interrogate the visibility status of all
     * parent Containers to determine whether this Component is truly visible to the user.</p>
     * <p>Generally, to determine whether a Component is hidden, the no argument form is needed. For example
     * when creating dynamically laid out UIs in a hidden Container before showing them.</p>
     * @return {Boolean} True if this component is visible, false otherwise.
     */
    isVisible: function(deep) {
        var me = this,
            child = me,
            visible = !me.hidden,
            ancestor = me.ownerCt;

        // Clear hiddenOwnerCt property
        me.hiddenAncestor = false;
        if (me.destroyed) {
            return false;
        }

        if (deep && visible && me.rendered && ancestor) {
            while (ancestor) {
                // If any ancestor is hidden, then this is hidden.
                // If an ancestor Panel (only Panels have a collapse method) is collapsed,
                // then its layoutTarget (body) is hidden, so this is hidden unless its within a
                // docked item; they are still visible when collapsed (Unless they themseves are hidden)
                if (ancestor.hidden || (ancestor.collapsed &&
                        !(ancestor.getDockedItems && Ext.Array.contains(ancestor.getDockedItems(), child)))) {
                    // Store hiddenOwnerCt property if needed
                    me.hiddenAncestor = ancestor;
                    visible = false;
                    break;
                }
                child = ancestor;
                ancestor = ancestor.ownerCt;
            }
        }
        return visible;
    },

    /**
     * Enable the component
     * @param {Boolean} silent
     * Passing false will supress the 'enable' event from being fired.
     */
    enable : function(silent) {
        var me = this;
        
        if (me.rendered) {
            me.el.removeCls(me.disabledCls);
            me.el.dom.disabled = false;
            me.onEnable();
        }

        me.disabled = false;

        if (silent !== true) {
            me.fireEvent('enable', me);
        }

        return me;
    },

    /**
     * Disable the component.
     * @param {Boolean} silent
     * Passing true, will supress the 'disable' event from being fired.
     */
    disable : function(silent) {
        var me = this;
        
        if (me.rendered) {
            me.el.addCls(me.disabledCls);
            me.el.dom.disabled = true;
            me.onDisable();
        }

        me.disabled = true;

        if (silent !== true) {
            me.fireEvent('disable', me);
        }

        return me;
    },

    /**
     * Method to determine whether this Component is currently disabled.
     * @return {Boolean} the disabled state of this Component.
     */
    isDisabled : function() {
        return this.disabled;
    },

    /**
     * Enable or disable the component.
     * @param {Boolean} disabled
     */
    setDisabled : function(disabled) {
        return this[disabled ? 'disable': 'enable']();
    },

    /**
     * Method to determine whether this Component is currently set to hidden.
     * @return {Boolean} the hidden state of this Component.
     */
    isHidden : function() {
        return this.hidden;
    },

    /**
     * Adds a CSS class to the top level element representing this component.
     * @returns {Ext.Component} Returns the Component to allow method chaining.
     */
    addCls : function() {
        var me = this,
            args = Ext.Array.toArray(arguments);
        if (me.rendered) {
            me.el.addCls(args);
        } else {
            me.additionalCls = Ext.Array.unique(me.additionalCls.concat(args));
        }
        return me;
    },

    //<debug>
    addClass : function() {
        throw "Component: addClass has been deprecated. Please use addCls.";
    },
    //</debug>

    /**
     * Removes a CSS class from the top level element representing this component.
     * @returns {Ext.Component} Returns the Component to allow method chaining.
     */
    removeCls : function() {
        var me = this,
            args = Ext.Array.toArray(arguments);
        if (me.rendered) {
            me.el.removeCls(args);
        } else if (me.additionalCls.length) {
            Ext.each(args, function(cls) {
                Ext.Array.remove(me.additionalCls, cls);
            });
        }
        return me;
    },

    //<debug>
    removeClass : function() {
        throw "Component: removeClass has been deprecated. Please use removeCls.";
    },
    //</debug>

    addListener : function(element, listeners, scope, options) {
        var me = this,
            fn,
            option;
        
        if (Ext.isString(element) && (Ext.isObject(listeners) || options && options.element)) {
            if (options.element) {
                fn = listeners;

                listeners = {};
                listeners[element] = fn;
                element = options.element;
                if (scope) {
                    listeners.scope = scope;
                }

                for (option in options) {
                    if (!options.hasOwnProperty(option)) {
                        continue;
                    }
                    if (me.eventOptionsRe.test(option)) {
                        listeners[option] = options[option];
                    }
                }
            }

            // At this point we have a variable called element,
            // and a listeners object that can be passed to on
            if (me[element] && me[element].on) {
                me.mon(me[element], listeners);
            } else {
                me.afterRenderEvents = me.afterRenderEvents || {};
                me.afterRenderEvents[element] = listeners;
            }
        }

        return me.mixins.observable.addListener.apply(me, arguments);
    },

    // @TODO: implement removelistener to support the dom event stuff

    /**
     * Provides the link for Observable's fireEvent method to bubble up the ownership hierarchy.
     * @return {Ext.container.Container} the Container which owns this Component.
     */
    getBubbleTarget : function() {
        return this.ownerCt;
    },

    /**
     * Method to determine whether this Component is floating.
     * @return {Boolean} the floating state of this component.
     */
    isFloating : function() {
        return this.floating;
    },

    /**
     * Method to determine whether this Component is draggable.
     * @return {Boolean} the draggable state of this component.
     */
    isDraggable : function() {
        return !!this.draggable;
    },

    /**
     * Method to determine whether this Component is droppable.
     * @return {Boolean} the droppable state of this component.
     */
    isDroppable : function() {
        return !!this.droppable;
    },

    /**
     * @private
     * Method to manage awareness of when components are added to their
     * respective Container, firing an added event.
     * References are established at add time rather than at render time.
     * @param {Ext.container.Container} container Container which holds the component
     * @param {number} pos Position at which the component was added
     */
    onAdded : function(container, pos) {
        this.ownerCt = container;
        this.fireEvent('added', this, container, pos);
    },

    /**
     * @private
     * Method to manage awareness of when components are removed from their
     * respective Container, firing an removed event. References are properly
     * cleaned up after removing a component from its owning container.
     */
    onRemoved : function() {
        var me = this;
        
        me.fireEvent('removed', me, me.ownerCt);
        delete me.ownerCt;
    },

    // @private
    onEnable : Ext.emptyFn,
    // @private
    onDisable : Ext.emptyFn,
    // @private
    beforeDestroy : Ext.emptyFn,
    // @private
    // @private
    onResize : Ext.emptyFn,

    /**
     * Sets the width and height of this Component. This method fires the {@link #resize} event. This method can accept
     * either width and height as separate arguments, or you can pass a size object like <code>{width:10, height:20}</code>.
     * @param {Mixed} width The new width to set. This may be one of:<div class="mdetail-params"><ul>
     * <li>A Number specifying the new width in the {@link #getEl Element}'s {@link Ext.core.Element#defaultUnit}s (by default, pixels).</li>
     * <li>A String used to set the CSS width style.</li>
     * <li>A size object in the format <code>{width: widthValue, height: heightValue}</code>.</li>
     * <li><code>undefined</code> to leave the width unchanged.</li>
     * </ul></div>
     * @param {Mixed} height The new height to set (not required if a size object is passed as the first arg).
     * This may be one of:<div class="mdetail-params"><ul>
     * <li>A Number specifying the new height in the {@link #getEl Element}'s {@link Ext.core.Element#defaultUnit}s (by default, pixels).</li>
     * <li>A String used to set the CSS height style. Animation may <b>not</b> be used.</li>
     * <li><code>undefined</code> to leave the height unchanged.</li>
     * </ul></div>
     * @return {Ext.Component} this
     */
    setSize : function(width, height) {
        var me = this,
            layoutCollection;
            
        // support for standard size objects
        if (Ext.isObject(width)) {
            height = width.height;
            width  = width.width;
        }

        // Constrain within configured maxima
        if (Ext.isNumber(width)) {
            width = Ext.Number.constrain(width, me.minWidth, me.maxWidth);
        }
        if (Ext.isNumber(height)) {
            height = Ext.Number.constrain(height, me.minHeight, me.maxHeight);
        }

        if (!me.rendered || !me.isVisible()) {
            // If an ownerCt is hidden, add my reference onto the layoutOnShow stack.  Set the needsLayout flag.
            if (me.hiddenAncestor) {
                layoutCollection = me.hiddenAncestor.layoutOnShow;
                layoutCollection.remove(me);
                layoutCollection.add(me);
            }
            me.needsLayout = {
                width: width,
                height: height,
                isSetSize: true
            };
            if (!me.rendered) {
                me.width  = (width !== undefined) ? width : me.width;
                me.height = (height !== undefined) ? height : me.height;
            }
            return me;
        }
        me.doComponentLayout(width, height, true);

        return me;
    },

    setCalculatedSize : function(width, height, ownerCt) {
        var me = this,
            layoutCollection;

        // support for standard size objects
        if (Ext.isObject(width)) {
            ownerCt = width.ownerCt;
            height = width.height;
            width  = width.width;
        }

        // Constrain within configured maxima
        if (Ext.isNumber(width)) {
            width = Ext.Number.constrain(width, me.minWidth, me.maxWidth);
        }
        if (Ext.isNumber(height)) {
            height = Ext.Number.constrain(height, me.minHeight, me.maxHeight);
        }

        if (!me.rendered || !me.isVisible()) {
            // If an ownerCt is hidden, add my reference onto the layoutOnShow stack.  Set the needsLayout flag.
            if (me.hiddenAncestor) {
                layoutCollection = me.hiddenAncestor.layoutOnShow;
                layoutCollection.remove(me);
                layoutCollection.add(me);
            }
            me.needsLayout = {
                width: width,
                height: height,
                isSetSize: false,
                ownerCt: ownerCt
            };
            return me;
        }
        me.doComponentLayout(width, height, false, ownerCt);

        return me;
    },

    /**
     * This method needs to be called whenever you change something on this component that requires the Component's
     * layout to be recalculated.
     * @return {Ext.container.Container} this
     */
    doComponentLayout : function(width, height, isSetSize, ownerCt) {
        var me = this,
            componentLayout = me.getComponentLayout();

        // collapsed state is not relevant here, so no testing done.
        // Only Panels have a collapse method, and that just sets the width/height such that only
        // a single docked Header parallel to the collapseTo side are visible, and the Panel body is hidden.
        if (me.rendered && componentLayout) {
            width = (width !== undefined) ? width : me.width;
            height = (height !== undefined) ? height : me.height;
            if (isSetSize) {
                me.width = width;
                me.height = height;
            }

            componentLayout.layout(width, height, isSetSize, ownerCt);
        }
        return me;
    },

    // @private
    setComponentLayout : function(layout) {
        var currentLayout = this.componentLayout;
        if (currentLayout && currentLayout.isLayout && currentLayout != layout) {
            currentLayout.setOwner(null);
        }
        this.componentLayout = layout;
        layout.setOwner(this);
    },

    getComponentLayout : function() {
        var me = this;
        
        if (!me.componentLayout || !me.componentLayout.isLayout) {
            me.setComponentLayout(Ext.layout.Manager.create(me.componentLayout, 'autocomponent'));
        }
        return me.componentLayout;
    },

    /**
     * @param {Ext.Component} this
     * @param {Number} adjWidth The box-adjusted width that was set
     * @param {Number} adjHeight The box-adjusted height that was set
     */
    afterComponentLayout: function(width, height) {
        this.fireEvent('resize', this, width, height);
    },

    /**
     * Sets the left and top of the component.  To set the page XY position instead, use {@link #setPagePosition}.
     * This method fires the {@link #move} event.
     * @param {Number} left The new left
     * @param {Number} top The new top
     * @return {Ext.Component} this
     */
    setPosition : function(x, y) {
        var me = this;
        
        if (Ext.isObject(x)) {
            y = x.y;
            x = x.x;
        }

        if (!me.rendered) {
            return me;
        }

        if (x !== undefined || y !== undefined) {
            me.el.setBox(x, y);
            me.onPosition(x, y);
            me.fireEvent('move', me, x, y);
        }
        return me;
    },

    /* @private
     * Called after the component is moved, this method is empty by default but can be implemented by any
     * subclass that needs to perform custom logic after a move occurs.
     * @param {Number} x The new x position
     * @param {Number} y The new y position
     */
    onPosition: Ext.emptyFn,

    /**
     * Sets the width of the component.  This method fires the {@link #resize} event.
     * @param {Number} width The new width to setThis may be one of:<div class="mdetail-params"><ul>
     * <li>A Number specifying the new width in the {@link #getEl Element}'s {@link Ext.core.Element#defaultUnit}s (by default, pixels).</li>
     * <li>A String used to set the CSS width style.</li>
     * </ul></div>
     * @return {Ext.Component} this
     */
    setWidth : function(width) {
        return this.setSize(width);
    },

    /**
     * Sets the height of the component.  This method fires the {@link #resize} event.
     * @param {Number} height The new height to set. This may be one of:<div class="mdetail-params"><ul>
     * <li>A Number specifying the new height in the {@link #getEl Element}'s {@link Ext.core.Element#defaultUnit}s (by default, pixels).</li>
     * <li>A String used to set the CSS height style.</li>
     * <li><i>undefined</i> to leave the height unchanged.</li>
     * </ul></div>
     * @return {Ext.Component} this
     */
    setHeight : function(height) {
        return this.setSize(undefined, height);
    },

    /**
     * Gets the current size of the component's underlying element.
     * @return {Object} An object containing the element's size {width: (element width), height: (element height)}
     */
    getSize : function() {
        return this.el.getSize();
    },

    /**
     * Gets the current width of the component's underlying element.
     * @return {Number}
     */
    getWidth : function() {
        return this.el.getWidth();
    },

    /**
     * Gets the current height of the component's underlying element.
     * @return {Number}
     */
    getHeight : function() {
        return this.el.getHeight();
    },

    /**
     * Gets the {@link Ext.ComponentLoader} for this Component.
     * @return {Ext.ComponentLoader} The loader instance, null if it doesn't exist.
     */
    getLoader: function(){
        var me = this,
            autoLoad = me.autoLoad ? (Ext.isObject(me.autoLoad) ? me.autoLoad : {url: me.autoLoad}) : null,
            loader = me.loader || autoLoad;

        if (loader) {
            if (!loader.isLoader) {
                me.loader = Ext.create('Ext.ComponentLoader', Ext.apply({
                    target: me,
                    autoLoad: autoLoad
                }, loader));
            } else {
                loader.setTarget(me);
            }
            return me.loader;

        }
        return null;
    },

    /**
     * This method allows you to show or hide a LoadMask on top of this component.
     * @param {Boolean/Object} load True to show the default LoadMask or a config object
     * that will be passed to the LoadMask constructor. False to hide the current LoadMask.
     * @param {Boolean} targetEl True to mask the targetEl of this Component instead of the this.el.
     * For example, setting this to true on a Panel will cause only the body to be masked. (defaults to false)
     * @return {Ext.LoadMask} The LoadMask instance that has just been shown.
     */
    setLoading : function(load, targetEl) {
        var me = this;
        
        if (me.rendered) {
            if (load !== false) {
                me.loadMask = me.loadMask || new Ext.LoadMask(targetEl ? me.getTargetEl() : me.el, Ext.applyIf(Ext.isObject(load) ? load : {}));
                me.loadMask.show();
            } else {
                Ext.destroy(me.loadMask);
                me.loadMask = null;
            }
        }

        return me.loadMask;
    },

    /**
     * Sets the dock position of this component in its parent panel. Note that
     * this only has effect if this item is part of the dockedItems collection
     * of a parent that has a DockLayout (note that any Panel has a DockLayout
     * by default)
     * @return {Component} this
     */
    setDocked : function(dock, layoutParent) {
        var me = this;
        
        me.dock = dock;
        if (layoutParent && me.ownerCt && me.rendered) {
            me.ownerCt.doComponentLayout();
        }
        return me;
    },

    onDestroy : function() {
        var me = this;
        
        if (me.monitorResize && Ext.EventManager.resizeEvent) {
            Ext.EventManager.resizeEvent.removeListener(me.setSize, me);
        }
        Ext.destroy(me.componentLayout, me.loadMask);
    },

    /**
     * Destroys the Component.
     */
    destroy : function() {
        var me = this;
        
        if (!me.isDestroyed) {
            if (me.fireEvent('beforedestroy', me) !== false) {
                me.destroying = true;
                me.beforeDestroy();

                if (me.ownerCt && me.ownerCt.remove) {
                    me.ownerCt.remove(me, false);
                }

                if (me.rendered) {
                    me.el.remove();
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

    /**
     * Retrieves a plugin by its pluginId which has been bound to this
     * component.
     * @returns {Ext.AbstractPlugin} pluginInstance
     */
    getPlugin: function(pluginId) {
        var i = 0,
            plugins = this.plugins,
            ln = plugins.length;
        for (; i < ln; i++) {
            if (plugins[i].pluginId === pluginId) {
                return plugins[i];
            }
        }
    }
}, function() {
    this.createAlias({
        on: 'addListener',
        prev: 'previousSibling',
        next: 'nextSibling'
    });
});
