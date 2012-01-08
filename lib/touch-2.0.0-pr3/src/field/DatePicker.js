/**
This is a specialized field which shows a {@link Ext.picker.Date} when tapped. If it has a predefined value,
or a value is selected in the {@link Ext.picker.Date}, it will be displayed like a normal {@link Ext.field.Text}
(but not selectable/changable).

    Ext.create('Ext.field.DatePicker', {
        label: 'Birthday',
        value: new Date()
    });

{@link Ext.field.DatePicker} fields are very simple to implement, and have no required configurations.

## Examples

It can be very useful to set a default {@link #value} configuration on {@link Ext.field.DatePicker} fields. In
this example, we set the {@link #value} to be the current date. You can also use the {@link #setValue} method to
update the value at any time.

    @example preview
    Ext.create('Ext.form.Panel', {
        fullscreen: true,
        items: [
            {
                xtype: 'fieldset',
                items: [
                    {
                        xtype: 'datepickerfield',
                        label: 'Birthday',
                        name: 'birthday',
                        value: new Date()
                    }
                ]
            },
            {
                xtype: 'toolbar',
                docked: 'bottom',
                items: [
                    { xtype: 'spacer' },
                    {
                        text: 'setValue',
                        handler: function() {
                            var datePickerField = Ext.ComponentQuery.query('datepickerfield')[0];

                            var randomNumber = function(from, to) {
                                return Math.floor(Math.random() * (to - from + 1) + from);
                            };

                            datePickerField.setValue({
                                month: randomNumber(0, 11),
                                day  : randomNumber(0, 28),
                                year : randomNumber(1980, 2011)
                            });
                        }
                    },
                    { xtype: 'spacer' }
                ]
            }
        ]
    });

When you need to retrieve the date from the {@link Ext.field.DatePicker}, you can either use the {@link #getValue} or
{@link #getFormattedValue} methods:

    @example preview
    Ext.create('Ext.form.Panel', {
        fullscreen: true,
        items: [
            {
                xtype: 'fieldset',
                items: [
                    {
                        xtype: 'datepickerfield',
                        label: 'Birthday',
                        name: 'birthday',
                        value: new Date()
                    }
                ]
            },
            {
                xtype: 'toolbar',
                docked: 'bottom',
                items: [
                    {
                        text: 'getValue',
                        handler: function() {
                            var datePickerField = Ext.ComponentQuery.query('datepickerfield')[0];
                            Ext.Msg.alert(null, datePickerField.getValue());
                        }
                    },
                    { xtype: 'spacer' },
                    {
                        text: 'getFormattedValue',
                        handler: function() {
                            var datePickerField = Ext.ComponentQuery.query('datepickerfield')[0];
                            Ext.Msg.alert(null, datePickerField.getFormattedValue());
                        }
                    }
                ]
            }
        ]
    });


 */
Ext.define('Ext.field.DatePicker', {
    extend: 'Ext.field.Text',
    alternateClassName: 'Ext.form.DatePicker',
    xtype: 'datepickerfield',
    requires: [
        'Ext.picker.Date',
        'Ext.DateExtras'
    ],

    /**
     * @event change
     * Fires when a date is selected
     * @param {Ext.field.DatePicker} this
     * @param {Date} date The new date
     */

    config: {
        ui: 'select',

        /**
         * @cfg {Object/Ext.picker.Date} picker
         * An object that is used when creating the internal {@link Ext.picker.Date} component or a direct instance of {@link Ext.picker.Date}
         * Defaults to true
         * @accessor
         */
        picker: true,

        /**
         * @cfg {Boolean}
         * @hide
         * @accessor
         */
        clearIcon: false,

        /**
         * @cfg {Object/Date} value
         * Default value for the field and the internal {@link Ext.picker.Date} component. Accepts an object of 'year',
         * 'month' and 'day' values, all of which should be numbers, or a {@link Date}.
         *
         * Example: {year: 1989, day: 1, month: 5} = 1st May 1989 or new Date()
         * @accessor
         */

        /**
         * @cfg {Boolean} destroyPickerOnHide
         * Whether or not to destroy the picker widget on hide. This save memory if it's not used frequently,
         * but increase delay time on the next show due to re-instantiation. Defaults to false
         * @accessor
         */
        destroyPickerOnHide: false,

        /**
         * @cfg {Number} tabIndex
         * @hide
         */
        tabIndex: -1,

        /**
         * @cfg {Object}
         * @hide
         */
        component: {
            useMask: true
        }
    },

    initialize: function() {
        this.callParent();

        this.getComponent().on({
            scope: this,

            masktap: 'onMaskTap'
        });
    },

    applyValue: function(value) {
        if (!Ext.isDate(value) && !Ext.isObject(value)) {
            value = null;
        }

        if (Ext.isObject(value)) {
            value = new Date(value.year, value.month - 1, value.day);
        }

        return value;
    },

    // @inherit
    updateValue: function(newValue) {
        var picker = this.getPicker();
        if (this.initialized && picker) {
            picker.setValue(newValue);
        }

        // Ext.Date.format expects a Date
        if (newValue !== null) {
            this.getComponent().setValue(Ext.Date.format(newValue, Ext.util.Format.defaultDateFormat));
        }

        this._value = newValue;
    },

    getValue: function() {
        return this._value;
    },

    /**
     * Returns the value of the field, which will be a {@link Date} unless the <tt>format</tt> parameter is true.
     * @param {Boolean} format True to format the value with <tt>Ext.util.Format.defaultDateFormat</tt>
     */
    getFormattedValue: function(format) {
        var value = this.getValue();
        return (Ext.isDate(value)) ? Ext.Date.format(value, format || Ext.util.Format.defaultDateFormat) : value;
    },

    applyPicker: function(config) {
        if (!this.initialized) {
            //if this field has not been initialized yet, we don't want to create the picker
            //as it will not be shown immeditely. We will hold this off until the first time
            //it needs to be shown
            return null;
        }

        return Ext.factory(config, Ext.picker.Date, this.getPicker());
    },

    updatePicker: function(newPicker) {
        if (newPicker) {
            newPicker.on({
                scope: this,

                change: 'onPickerChange',
                hide  : 'onPickerHide'
            });

            newPicker.hide();
        }
    },

    /**
     * @private
     * Listener to the tap event of the mask element. Shows the internal {@link #datePicker} component when the button has been tapped.
     */
    onMaskTap: function() {
        if (this.getDisabled()) {
            return false;
        }

        var picker = this.getPicker(),
            initialConfig = this.getInitialConfig();

        if (!picker) {
            picker = this.applyPicker(initialConfig.picker);
            this.updatePicker(picker);
            picker.setValue(initialConfig.value);
            this._picker = picker;
        }

        picker.show();

        return false;
    },

    /**
     * Called when the picker changes its value
     * @param {Ext.picker.Date} picker The date picker
     * @param {Object} value The new value from the date picker
     * @private
     */
    onPickerChange: function(picker, value) {
        var me = this;

        me.setValue(value);
        me.fireEvent('change', me, me.getValue());
    },

    /**
     * Destroys the picker when it is hidden, if
     * {@link Ext.field.DatePicker#destroyPickerOnHide destroyPickerOnHide} is set to true
     * @private
     */
    onPickerHide: function() {
        var picker = this.getPicker();

        if (this.getDestroyPickerOnHide() && picker) {
            picker.destroy();
            this.setPicker(null);
        }
    },

    reset: function() {
        this.setValue(this.originalValue);
    },

    // @private
    onDestroy: function() {
        var picker = this.getPicker();
        if (picker) {
            picker.destroy();
        }

        this.callParent(arguments);
    }
}, function() {
    //<deprecated product=touch since=2.0>
    this.override({
        getValue: function(format) {
            if (format) {
                //<debug warn>
                Ext.Logger.deprecate("format argument of the getValue method is deprecated, please use getFormattedValue instead", this);
                //</debug>
                return this.getFormattedValue(format);
            }
            return this.callOverridden();
        }
    });
    //</deprecated>
});
