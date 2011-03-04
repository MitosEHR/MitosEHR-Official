/**
 * @class Ext.form.FieldSet
 * @extends Ext.container.Container
 * Standard container used for grouping items within a {@link Ext.form.FormPanel form}.
 * <pre><code>
var form = new Ext.form.FormPanel({
    title: 'Simple Form with FieldSets',
    labelWidth: 75, // label settings here cascade unless overridden
    url: 'save-form.php',
    frame:true,
    bodyStyle:'padding:5px 5px 0',
    width: 700,
    renderTo: document.body,
    layout:'column', // arrange items in columns
    defaults: {      // defaults applied to items
        layout: 'form',
        border: false,
        bodyStyle: 'padding:4px'
    },
    items: [{
        // Fieldset in Column 1
        xtype:'fieldset',
        columnWidth: 0.5,
        title: 'Fieldset 1',
        collapsible: true,
        autoHeight:true,
        defaults: {
            anchor: '-20' // leave room for error icon
        },
        defaultType: 'textfield',
        items :[{
                fieldLabel: 'Field 1'
            }, {
                fieldLabel: 'Field 2'
            }, {
                fieldLabel: 'Field 3'
            }
        ]
    },{
        // Fieldset in Column 2 - Panel inside
        xtype:'fieldset',
        title: 'Show Panel', // title or checkboxToggle creates fieldset header
        autoHeight:true,
        columnWidth: 0.5,
        checkboxToggle: true,
        collapsed: true, // fieldset initially collapsed
        layout:'anchor',
        items :[{
            xtype: 'panel',
            anchor: '100%',
            title: 'Panel inside a fieldset',
            frame: true,
            height: 100
        }]
    }]
});
 * </code></pre>
 * @constructor
 * @param {Object} config Configuration options
 * @xtype fieldset
 */
Ext.define('Ext.form.FieldSet', {
    extend: 'Ext.container.Container',
    alias: 'widget.fieldset',
    requires: ['Ext.form.Checkbox', 'Ext.panel.Tool', 'Ext.layout.container.Anchor'],

    /**
     * @cfg {String} title
     * A title to be displayed in the fieldset's legend. May contain HTML markup.
     */

    /**
     * @cfg {Boolean} checkboxToggle
     * Set to <tt>true</tt> to render a checkbox into the fieldset frame just
     * in front of the legend to expand/collapse the fieldset when the checkbox is toggled. (defaults
     * to <tt>false</tt>). This checkbox will be included in form submits using the {@link #checkboxName}.
     */

    /**
     * @cfg {String} checkboxName
     * The name to assign to the fieldset's checkbox if <tt>{@link #checkboxToggle} = true</tt>
     * (defaults to <tt>'[fieldset id]-checkbox'</tt>).
     */

    /**
     * @cfg {Boolean} collapsible
     * Set to <tt>true</tt> to make the fieldset collapsible and have the expand/collapse toggle button automatically
     * rendered into the legend element, <tt>false</tt> to keep the fieldset statically sized with no collapse
     * button (defaults to <tt>false</tt>). Another option is to configure <tt>{@link #checkboxToggle}</tt>.
     * Use the {@link #collapsed} config to collapse the fieldset by default.
     */

    /**
     * @cfg {Boolean} collapsed
     * Set to <tt>true</tt> to render the fieldset as collapsed by default. If {@link #checkboxToggle} is specified,
     * the checkbox will also be unchecked by default.
     */
     collapsed: false,

    /**
     * @property legend
     * @type Ext.Component
     * The component for the fieldset's legend. Will only be defined if the configuration requires a legend
     * to be created, by setting the {@link #title} or {@link #checkboxToggle} options.
     */

    /**
     * @cfg {String} baseCls The base CSS class applied to the fieldset (defaults to <tt>'x-fieldset'</tt>).
     */
    baseCls: Ext.baseCSSPrefix + 'fieldset',

    /**
     * @cfg {String} layout The {@link Ext.container.Container#layout} for the fieldset's immediate child items.
     * Defaults to <tt>'anchor'</tt>.
     */
    layout: 'anchor',

    // No aria role necessary as fieldset has its own recognized semantics
    ariaRole: '',

    renderTpl: ['<div class="{baseCls}-body"></div>'],
    
    getElConfig: function(){
        return {tag: 'fieldset', id: this.id};
    },

    initComponent: function() {
        var me = this,
            baseCls = me.baseCls;

        me.callParent();

        // Create the Legend component if needed
        me.initLegend();

        // Add body el selector
        Ext.applyIf(me.renderSelectors, {
            body: '.' + baseCls + '-body'
        });

        if (me.collapsed) {
            me.addCls(baseCls + '-collapsed');
            me.collapse();
        }
    },

    // private
    onRender: function(container, position) {
        this.callParent(arguments);
        // Make sure the legend is created and rendered
        this.initLegend();
    },

    /**
     * @private
     * Initialize and render the legend component if necessary
     */
    initLegend: function() {
        var me = this,
            legendItems,
            legend = me.legend;

        // Create the legend component if needed and it hasn't been already
        if (!legend && (me.title || me.checkboxToggle || me.collapsible)) {
            legendItems = [];

            // Checkbox
            if (me.checkboxToggle) {
                legendItems.push(me.createCheckboxCmp());
            }
            // Toggle button
            else if (me.collapsible) {
                legendItems.push(me.createToggleCmp());
            }

            // Title
            legendItems.push(me.createTitleCmp());

            legend = me.legend = new Ext.container.Container({
                baseCls: me.baseCls + '-header',
                ariaRole: '',
                getElConfig: function(){
                    return {tag: 'legend', cls: this.baseCls};
                },
                items: legendItems
            });
        }

        // Make sure legend is rendered if the fieldset is rendered
        if (legend && !legend.rendered && me.rendered) {
            me.legend.render(me.el, me.body); //insert before body element
        }
    },

    /**
     * @protected
     * Creates the legend title component. This is only called internally, but could be overridden in subclasses
     * to customize the title component.
     * @return Ext.Component
     */
    createTitleCmp: function() {
        var me = this;
        me.titleCmp = new Ext.Component({
            html: me.title,
            cls: me.baseCls + '-header-text'
        });
        return me.titleCmp;
        
    },

    /**
     * @protected
     * Creates the checkbox component. This is only called internally, but could be overridden in subclasses
     * to customize the checkbox's configuration or even return an entirely different component type.
     * @return Ext.Component
     */
    createCheckboxCmp: function() {
        var me = this,
            suffix = '-checkbox';
            
        me.checkboxCmp = new Ext.form.Checkbox({
            name: me.checkboxName || me.id + suffix,
            cls: me.baseCls + '-header' + suffix,
            checked: !me.collapsed,
            hideLabel: true,
            listeners: {
                change: me.onCheckChange,
                scope: me
            }
        });
        return me.checkboxCmp;
    },

    /**
     * @protected
     * Creates the toggle button component. This is only called internally, but could be overridden in
     * subclasses to customize the toggle component.
     * @return Ext.Component
     */
    createToggleCmp: function() {
        var me = this;
        me.toggleCmp = new Ext.panel.Tool({
            type: me.collapsed ? 'down' : 'up',
            handler: me.toggle,
            scope: me
        });
        return me.toggleCmp;
    },
    
    /**
     * Sets the title of this fieldset
     * @param {String} title The new title
     * @return {Ext.form.FieldSet} this
     */
    setTitle: function(title) {
        var me = this;
        me.title = title;
        me.initLegend();
        me.titleCmp.update(title);
        return me;
    },
    
    getTargetEl : function() {
        return this.body || this.frameBody || this.el;
    },
    
    getContentTarget: function() {
        return this.body;
    },
    
    /**
     * @private
     * Include the legend component in the items for ComponentQuery
     */
    getRefItems: function(deep) {
        var refItems = this.callParent(arguments),
            legend = this.legend;
        if (legend) {
            refItems.push(legend);
            if (deep) {
                refItems = refItems.concat(legend.getRefItems(true));
            }
        }
        return refItems;
    },

    /**
     * Expands the fieldset.
     * @return {Ext.form.FieldSet} this
     */
    expand : function(){
        return this.setExpanded(true);
    },
    
    /**
     * Collapses the fieldset.
     * @return {Ext.form.FieldSet} this
     */
    collapse : function() {
        return this.setExpanded(false);
    },

    /**
     * @private Collapse or expand the fieldset
     */
    setExpanded: function(expanded) {
        var me = this,
            checkboxCmp = me.checkboxCmp,
            toggleCmp = me.toggleCmp;

        expanded = !!expanded;
        
        if (checkboxCmp) {
            checkboxCmp.setValue(expanded);
        }
        
        if (toggleCmp) {
            toggleCmp.setType(expanded ? 'up' : 'down');
        }
        
        if (expanded) {
            me.removeCls(me.baseCls + '-collapsed');
        } else {
            me.addCls(me.baseCls + '-collapsed');
        }
        me.collapsed = !expanded;
        me.doComponentLayout();
        return me;
    },

    /**
     * Toggle the fieldset's collapsed state to the opposite of what it is currently
     */
    toggle: function() {
        this.setExpanded(!!this.collapsed);
    },

    /**
     * @private Handle changes in the checkbox checked state
     */
    onCheckChange: function(cmp, checked) {
        this.setExpanded(checked);
    },

    beforeDestroy : function() {
        var legend = this.legend;
        if (legend) {
            legend.destroy();
        }
        this.callParent();
    }
});
