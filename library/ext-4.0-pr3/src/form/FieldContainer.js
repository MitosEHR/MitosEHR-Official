/**
 * @class Ext.form.FieldContainer
 * @extends Ext.container.Container
 * <p>A container which participates in field layout.
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
     * own configuration, or from the {@link Ext.container.Container#defaults defaults config} of its parent container,
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

    /**
     * @cfg {Boolean} combineLabels
     * If set to true, and there is no defined {@link #fieldLabel}, the field container will automatically
     * generate its label by combining the labels of all the fields it contains. Defaults to false.
     */
    combineLabels: false,

    /**
     * @cfg {String} labelConnector
     * The string to use when joining the labels of individual sub-fields, when {@link #combineLabels} is
     * set to true. Defaults to ', '.
     */
    labelConnector: ', ',

    /**
     * @cfg {Boolean} combineErrors
     * If set to true, the field container will automatically combine and display the validation errors from
     * all the fields it contains as a single error on the container, according to the configured
     * {@link #msgTarget}. Defaults to false.
     */
    combineErrors: false,

    initComponent: function() {
        var me = this,
            onSubCmpAddOrRemove = me.onSubCmpAddOrRemove;

        // Init mixin
        me.initLabelable();

        // Catch addition of descendant fields
        me.on('add', onSubCmpAddOrRemove, me);
        me.on('remove', onSubCmpAddOrRemove, me);

        me.initFieldDefaults();
        me.callParent();
    },

    /**
     * @private Initialize the {@link #fieldDefaults} object
     */
    initFieldDefaults: function() {
        if (!this.fieldDefaults) {
            this.fieldDefaults = {};
        }
    },

    /**
     * @private
     * Handle the addition and removal of components in the FieldContainer's child tree.
     */
    onSubCmpAddOrRemove: function(parent, child) {
        var me = this,
            isAdding = !!child.ownerCt;

        function handleCmp(cmp) {
            var isLabelable = cmp.isFieldLabelable,
                isField = cmp.isFormField;
            if (isLabelable || isField) {
                if (isLabelable) {
                    me['onLabelable' + (isAdding ? 'Added' : 'Removed')](cmp);
                }
                if (isField) {
                    me['onField' + (isAdding ? 'Added' : 'Removed')](cmp);
                }
            }
            else if (cmp.isContainer) {
                Ext.Array.forEach(cmp.getRefItems(), handleCmp);
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
        this.updateLabel();
    },

    /**
     * @protected Called when a {@link Ext.form.Field} instance is added to the container's subtree.
     * @param {Ext.form.Field} field The field which was added
     */
    onFieldAdded: function(field) {
        var me = this;
        if (me.combineErrors) {
            // buffer slightly to avoid excessive re-layouts while sub-fields are changing en masse
            me.mon(field, 'errorchange', me.onFieldErrorChange, me, {buffer: 10});
        }
    },

    /**
     * @protected Called when a {@link Ext.form.Labelable} instance is removed from the container's subtree.
     * @param {Ext.form.Labelable} labelable The instance that was removed
     */
    onLabelableRemoved: function(labelable) {
        this.updateLabel();
    },

    /**
     * @protected Called when a {@link Ext.form.Field} instance is removed from the container's subtree.
     * @param {Ext.form.Field} field The field which was removed
     */
    onFieldRemoved: function(field) {
        var me = this;
        if (me.combineErrors) {
            me.mun(field, 'errorchange', me.onFieldErrorChange, me);
        }
    },

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

    /**
     * Returns the combined field label if {@link #combineLabels} is set to true and if there is no
     * set {@link #fieldLabel}. Otherwise returns the fieldLabel like normal. You can also override
     * this method to provide a custom generated label.
     */
    getFieldLabel: function() {
        var label = this.fieldLabel || '';
        if (!label && this.combineLabels) {
            label = Ext.Array.map(this.query('[isFieldLabelable]'), function(field) {
                return field.getFieldLabel();
            }).join(this.labelConnector);
        }
        return label;
    },

    /**
     * @private Updates the content of the labelEl if it is rendered
     */
    updateLabel: function() {
        var me = this,
            label = me.labelEl;
        if (label) {
            label.update(me.getFieldLabel());
        }
    },

    //private
    onDisable: function() {
        Ext.Array.forEach(this.query('[isFormField]'), function(field) {
            field.disable();
        });
    },

    //private
    onEnable: function() {
        Ext.Array.forEach(this.query('[isFormField]'), function(field) {
            field.enable();
        });
    },


    /**
     * @private Fired when the error message of any field within the container changes, and updates the
     * combined error message to match.
     */
    onFieldErrorChange: function() {
        var me = this,
            oldError = me.getActiveError(),
            invalidFields = Ext.Array.filter(me.query('[isFormField]'), function(field) {
                return field.hasActiveError();
            }),
            newError = me.buildCombinedError(invalidFields);

        if (newError) {
            me.setActiveError(newError);
        } else {
            me.unsetActiveError();
        }

        if (oldError !== newError) {
            me.doComponentLayout();
        }
    },

    /**
     * Takes an Array of invalid {@link Ext.form.Field} objects and builds a combined error message
     * string from them. Defaults to placing each error message on a new line, each one preceded by
     * the field name and a colon. This can be overridden to provide custom combined error message
     * handling, for instance changing the output markup format or sorting the array (it is sorted
     * in order of appearance by default).
     * @param {Array} invalidFields An Array of the sub-fields which are currently invalid.
     * @return {String} The combined error message
     */
    buildCombinedError: function(invalidFields) {
        return Ext.Array.map(invalidFields, function(field) {
            return field.getFieldLabel() + ': ' + field.getActiveError();
        }).join('<br>');
    },

    getTargetEl: function() {
        return this.bodyEl || this.callParent();
    }

});
