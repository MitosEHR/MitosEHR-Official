/**
 * @class Ext.form.FieldContainer
 * @extends Ext.container.Container
 * <p>A container which participates in {@link Ext.layout.component.form.Field field layout}.
 * This allows grouping of several components with a {@link #fieldLabel field label} and optional
 * {@link #msgTarget error message}, so that it lines up nicely with other fields in a form. The
 * {@link #items} of the container will be layed out within the field body area according to the
 * configured {@link #layout}.</p>
 * <p>Like regular fields, FieldContainer can inherit its decoration configuration from the
 * {@link Ext.form.FormPanel#fieldDefaults fieldDefaults} of an enclosing FormPanel. In addition,
 * FieldContainer itself can pass {@link #fieldDefaults} to any {@link Ext.form.Labelable fields}
 * it may itself contain.</p>
 * <p>Example usage:</p>
 * <pre><code>Ext.create('Ext.form.FormPanel', {
    renderTo: Ext.getBody(),
    title: 'FieldContainer Examples',
    width: 600,
    bodyPadding: 10,

    items: [{
        fieldLabel: 'Panels',
        xtype: 'fieldcontainer',
        layout: 'hbox',
        defaults: {
            height: 50,
            flex: 1
        },
        items: [{
            xtype: 'panel',
            title: 'Panel 1'
        }, {
            xtype: 'splitter'
        }, {
            xtype: 'panel',
            title: 'Panel 2'
        }, {
            xtype: 'splitter'
        }, {
            xtype: 'panel',
            title: 'Panel 3'
        }]
    }]
});</code></pre>

 * @constructor
 * Creates a new Ext.form.FieldContainer instance.
 * @param {Object} config The component configuration.
 *
 * @xtype fieldcontainer
 */
Ext.define('Ext.form.FieldContainer', {
    extend: 'Ext.container.Container',
    mixins: {
        labelable: 'Ext.form.Labelable'
    },
    alias: 'widget.fieldcontainer',

    componentLayout: 'field',

    /**
     * @cfg {Object} fieldDefaults
     * <p>If specified, the properties in this object are used as default config values for each
     * {@link Ext.form.Labelable} instance (e.g. {@link Ext.form.BaseField} or {@link Ext.form.FieldContainer})
     * that is added as a descendant of this FieldContainer. Corresponding values specified in an individual field's
     * own configuration, or from the {@link Ext.lib.Container#defaults defaults config} of its parent container,
     * will take precedence. See the documentation for {@link Ext.form.Labelable} to see what config
     * options may be specified in the <tt>fieldDefaults</tt>.</p>
     * <p>Example:</p>
     * <pre><code>new Ext.form.FieldContainer({
    fieldDefaults: {
        labelAlign: 'left',
        labelWidth: 100
    },
    items: [{
        xtype: 'fieldset',
        defaults: {
            labelAlign: 'top'
        },
        items: [{
            name: 'field1'
        }, {
            name: 'field2'
        }]
    }, {
        xtype: 'fieldset',
        items: [{
            name: 'field3',
            labelWidth: 150
        }, {
            name: 'field4'
        }]
    }]
});</code></pre>
     * <p>In this example, field1 and field2 will get labelAlign:'top' (from the fieldset's <tt>defaults</tt>)
     * and labelWidth:100 (from <tt>fieldDefaults</tt>), field3 and field4 will both get labelAlign:'left' (from
     * <tt>fieldDefaults</tt> and field3 will use the labelWidth:150 from its own config.</p>
     */



    initComponent: function() {
        var me = this;

        // Init mixin
        me.initLabelable();

        // Catch addition of descendant fields
        me.on('add', me.onSubCmpAdded, me);

        me.callParent();
    },

    /**
     * @private
     * Handle the addition of components to the FieldContainer's child tree.
     */
    onSubCmpAdded: function(parent, child) {
        var me = this;
        function handleCmp(cmp) {
            var isLabelable = cmp.isFieldLabelable,
                isField = cmp.isFormField;
            if (isLabelable || isField) {
                if (isLabelable) {
                    me.onLabelableAdded(cmp);
                }
                if (isField) {
                    me.onFieldAdded(cmp);
                }
            }
            else if (cmp.isContainer) {
                cmp.items.each(handleCmp);
            }
        }
        handleCmp(child);
    },

    /**
     * @protected Called when a {@link Ext.form.Labelable} instance is added to the container's subtree.
     * @param {Ext.form.Labelable} labelable The instance that was added
     */
    onLabelableAdded: function(labelable) {
        labelable.applyFieldDefaults(this.fieldDefaults);
    },

    /**
     * @protected Called when a {@link Ext.form.Field} instance is added to the container's subtree.
     * @param {Ext.form.Field} field The field which was added
     */
    onFieldAdded: Ext.emptyFn,

    onRender: function() {
        var me = this,
            renderSelectors = me.renderSelectors,
            applyIf = Ext.applyIf;

        applyIf(renderSelectors, me.getLabelableSelectors());

        me.callParent(arguments);
    },

    initRenderTpl: function() {
        var me = this;
        if (!me.hasOwnProperty('renderTpl')) {
            me.renderTpl = me.labelableRenderTpl;
        }
        return me.callParent();
    },

    initRenderData: function() {
        return Ext.applyIf(this.callParent(), this.getLabelableRenderData());
    },

    //private
    onDisable: function() {
        this.down('[isFormField]').each(function(field) {
            field.disable();
        });
    },

    //private
    onEnable: function() {
        this.down('[isFormField]').each(function(field) {
            field.enable();
        });
    },

    getTargetEl: function() {
        return this.bodyEl || this.callParent();
    }

    /*
    TODO merging fieldDefaults objects down doesn't work due to the order of component addition
    applyFieldDefaults: function(defaults) {
        this.getMixin('labelable').applyFieldDefaults.call(this, defaults);

        // merge defaults with our own
        this.fieldDefaults = Ext.apply({}, this.fieldDefaults, defaults);
    }*/

});
