/**
 * @class Ext.form.CompositeField
 * @extends Ext.container.Container
 * Composite field allowing a number of form Fields to be rendered on the same row. The fields are rendered
 * using an hbox layout internally, so all of the normal HBox layout config items are available. Example usage:
 * <pre>
{
    xtype: 'compositefield',
    labelWidth: 120
    items: [
        {
            xtype     : 'textfield',
            fieldLabel: 'Title',
            width     : 20
        },
        {
            xtype     : 'textfield',
            fieldLabel: 'First',
            flex      : 1
        },
        {
            xtype     : 'textfield',
            fieldLabel: 'Last',
            flex      : 1
        }
    ]
}
 * </pre>
 * In the example above the composite's fieldLabel will be set to 'Title, First, Last' as it groups the fieldLabels
 * of each of its children. This can be overridden by setting a fieldLabel on the compositefield itself:
 * <pre>
{
    xtype: 'compositefield',
    fieldLabel: 'Custom label',
    items: [...]
}
 * </pre>
 * Any Ext.form.* component can be placed inside a composite field.
 *
 * @xtype compositefield
 */
Ext.define('Ext.form.CompositeField', {
    extend: 'Ext.container.Container',
    alias: 'widget.compositefield',
    requires: ['Ext.util.MixedCollection'],

    /**
     * @property defaultMargins
     * @type String
     * The margins to apply by default to each field in the composite
     */
    defaultMargins: '0 5 0 0',

    /**
     * @property skipLastItemMargin
     * @type Boolean
     * If true, the defaultMargins are not applied to the last item in the composite field set (defaults to true)
     */
    skipLastItemMargin: true,

    /**
     * @property isComposite
     * @type Boolean
     * Signifies that this is a Composite field
     */
    isComposite: true,

    /**
     * @property combineErrors
     * @type Boolean
     * True to combine errors from the individual fields into a single error message at the CompositeField level (defaults to true)
     */
    combineErrors: true,

    /**
     * @cfg {String} labelConnector The string to use when joining segments of the built label together (defaults to ', ')
     */
    labelConnector: ', ',

    layout: 'hbox',

    componentLayout: 'field',

    tabSequence: 'row',

    labelWidth : 100,

    labelPad : 5,

    labelSeparator : ':',

    //inherit docs
    //Builds the composite field label
    initComponent: function() {
        //this.fieldLabel = this.fieldLabel || this.buildLabel(labels);

        /**
         * @property fieldErrors
         * @type Ext.util.MixedCollection
         * MixedCollection of current errors on the Composite's subfields. This is used internally to track when
         * to show and hide error messages at the Composite level. Listeners are attached to the MixedCollection's
         * add, remove and replace events to update the error icon in the UI as errors are added or removed.
         */
        this.fieldErrors = new Ext.util.MixedCollection(true, function(item) {
            return item.field;
        });

        this.fieldErrors.on({
            scope  : this,
            add    : this.updateInvalidMark,
            remove : this.updateInvalidMark,
            replace: this.updateInvalidMark
        });

        Ext.form.CompositeField.superclass.initComponent.apply(this, arguments);
    },

    /**
     * @private
     * Creates an internal container using hbox and renders the fields to it
     */
    //onRender: function(ct, position) {
    //},
/*
    initEvents : function() {
        //if we're combining subfield errors into a single message, override the markInvalid and clearInvalid
        //methods of each subfield and show them at the Composite level instead
        if (this.combineErrors) {
            this.eachItem(function(field) {
                Ext.apply(field, {
                    markInvalid : Ext.Function.bind(this.onFieldMarkInvalid, this, [field], 0),
                    clearInvalid: Ext.Function.bind(this.onFieldClearInvalid, this, [field], 0)
                });
            });
        }
        Ext.form.CompositeField.superclass.initEvents.apply(this, arguments);
    },
*/

    getErrors: function() {
        return [];
    },

    /**
     * Called if combineErrors is true and a subfield's markInvalid method is called.
     * By default this just adds the subfield's error to the internal fieldErrors MixedCollection
     * @param {Ext.form.Field} field The field that was marked invalid
     * @param {String} message The error message
     */
    onFieldMarkInvalid: function(field, message) {
        var name  = field.getName(),
            error = {field: name, error: message};

        this.fieldErrors.replace(name, error);

        field.el.addCls(field.invalidCls);
    },

    /**
     * Called if combineErrors is true and a subfield's clearInvalid method is called.
     * By default this just updates the internal fieldErrors MixedCollection.
     * @param {Ext.form.Field} field The field that was marked invalid
     */
    onFieldClearInvalid: function(field) {
        this.fieldErrors.removeByKey(field.getName());

        field.el.removeCls(field.invalidCls);
    },

    /**
     * @private
     * Called after a subfield is marked valid or invalid, this checks to see if any of the subfields are
     * currently invalid. If any subfields are invalid it builds a combined error message marks the composite
     * invalid, otherwise clearInvalid is called
     */
    updateInvalidMark: function() {
        var ieStrict = Ext.isIE6 && Ext.isStrict;

        if (this.fieldErrors.length == 0) {
            this.clearInvalid();

            //IE6 in strict mode has a layout bug when using 'under' as the error message target. This fixes it
            if (ieStrict) {
                 Ext.defer(this.clearInvalid, 50, this);
            }
        } else {
            var message = this.buildCombinedErrorMessage(this.fieldErrors.items);

            this.sortErrors();
            this.markInvalid(message);

            //IE6 in strict mode has a layout bug when using 'under' as the error message target. This fixes it
            if (ieStrict) {
                this.markInvalid(message);
            }
        }
    },

    /**
     * Performs validation checks on each subfield and returns false if any of them fail validation.
     * @return {Boolean} False if any subfield failed validation
     */
    validateValue: function() {
        var valid = true;

        this.eachItem(function(field) {
            if (!field.isValid()) {
                valid = false;
            }
        });

        return valid;
    },

    /**
     * Takes an object containing error messages for contained fields, returning a combined error
     * string (defaults to just placing each item on a new line). This can be overridden to provide
     * custom combined error message handling.
     * @param {Array} errors Array of errors in format: [{field: 'title', error: 'some error'}]
     * @return {String} The combined error message
     */
    buildCombinedErrorMessage: function(errors) {
        var combined = [],
            error;

        for (var i = 0, j = errors.length; i < j; i++) {
            error = errors[i];

            combined.push(Ext.util.Format.format("{0}: {1}", error.field, error.error));
        }

        return combined.join("<br />");
    },

    /**
     * Sorts the internal fieldErrors MixedCollection by the order in which the fields are defined.
     * This is called before displaying errors to ensure that the errors are presented in the expected order.
     * This function can be overridden to provide a custom sorting order if needed.
     */
    sortErrors: function() {
        var fields = this.items;

        this.fieldErrors.sort("ASC", function(a, b) {
            var findByName = function(key) {
                return function(field) {
                    return field.getName() == key;
                };
            };

            var aIndex = fields.findIndexBy(findByName(a.field)),
                bIndex = fields.findIndexBy(findByName(b.field));

            return aIndex < bIndex ? -1 : 1;
        });
    },

    /**
     * Resets each field in the composite to their previous value
     */
    reset: function() {
        this.eachItem(function(item) {
            item.reset();
        });

        // Defer the clearInvalid so if BaseForm's collection is being iterated it will be called AFTER it is complete.
        // Important because reset is being called on both the group and the individual items.
        Ext.defer(function() {
            this.clearInvalid();
        }, 50, this);
    },

    /**
     * Calls clearInvalid on all child fields. This is a convenience function and should not often need to be called
     * as fields usually take care of clearing themselves
     */
    clearInvalidChildren: function() {
        this.eachItem(function(item) {
            item.clearInvalid();
        });
    },

    /**
     * Builds a label string from an array of subfield labels.
     * By default this just joins the labels together with a comma
     * @param {Array} segments Array of each of the labels in the composite field's subfields
     * @return {String} The built label
     */
    buildLabel: function(segments) {
        return Ext.clean(segments).join(this.labelConnector);
    },

    /**
     * Checks each field in the composite and returns true if any is dirty
     * @return {Boolean} True if any field is dirty
     */
    isDirty: function(){
        //override the behaviour to check sub items.
        if (this.disabled || !this.rendered) {
            return false;
        }

        var dirty = false;
        this.eachItem(function(item){
            if(item.isDirty()){
                dirty = true;
                return false;
            }
        });
        return dirty;
    },

    /**
     * @private
     * Convenience function which passes the given function to every item in the composite
     * @param {Function} fn The function to call
     * @param {Object} scope Optional scope object
     */
    eachItem: function(fn, scope) {
        if(this.items && this.items.each){
            this.items.each(fn, scope || this);
        }
    },

    //override the behaviour to check sub items.
    setReadOnly : function(readOnly) {
        if (readOnly == undefined) {
            readOnly = true;
        }
        readOnly = !!readOnly;

        if(this.rendered){
            this.eachItem(function(item){
                item.setReadOnly(readOnly);
            });
        }
        this.readOnly = readOnly;
    },

    //override the behaviour to check sub items.
    onDisable : function(){
        this.eachItem(function(item){
            item.disable();
        });
    },

    //override the behaviour to check sub items.
    onEnable : function(){
        this.eachItem(function(item){
            item.enable();
        });
    }
});

