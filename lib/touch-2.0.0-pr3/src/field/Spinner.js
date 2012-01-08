/**
 * Wraps an HTML5 number field. Example usage:
 *
 *     new Ext.field.Spinner({
 *         minValue: 0,
 *         maxValue: 100,
 *         incrementValue: 2,
 *         cycle: true
 *     });
 *
 */
Ext.define('Ext.field.Spinner', {
    extend: 'Ext.field.Number',
    xtype: 'spinnerfield',
    alternateClassName: 'Ext.form.Spinner',
    requires: ['Ext.util.TapRepeater'],

    /**
     * @event spin
     * Fires when the value is changed via either spinner buttons
     * @param {Ext.field.Spinner} this
     * @param {Number} value
     * @param {String} direction 'up' or 'down'
     */
    /**
     * @event spindown
     * Fires when the value is changed via the spinner down button
     * @param {Ext.field.Spinner} this
     * @param {Number} value
     */
    /**
     * @event spinup
     * Fires when the value is changed via the spinner up button
     * @param {Ext.field.Spinner} this
     * @param {Number} value
     */

    config: {
        // @inherit
        cls: Ext.baseCSSPrefix + 'spinner',

        /**
         * @cfg {Number} [minValue=-infinity] The minimum allowed value.
         * @accessor
         */
        minValue: Number.NEGATIVE_INFINITY,
        /**
         * @cfg {Number} [maxValue=infinity] The maximum allowed value.
         * @accessor
         */
        maxValue: Number.MAX_VALUE,

        /**
         * @cfg {Number} increment Value that is added or subtracted from the current value when a spinner is used.
         * @accessor
         */
        increment: .1,

        /**
         * @cfg {Boolean} accelerateOnTapHold True if autorepeating should start slowly and accelerate.
         * @accessor
         */
        accelerateOnTapHold: true,

        /**
         * @cfg {Boolean} cycle When set to true, it will loop the values of a minimum or maximum is reached.
         * If the maximum value is reached, the value will be set to the minimum.
         * @accessor
         */
        cycle: false,

        /**
         * @cfg {Boolean} clearIcon
         * @hide
         * @accessor
         */
        clearIcon: false,

        defaultValue: 0,

        /**
         * @cfg {Number} tabIndex
         * @hide
         */
        tabIndex: -1
    },

    constructor: function() {
        this.callParent(arguments);

        if (!this.getValue()) {
            this.setValue(this.getDefaultValue());
        }
    },

    /**
     * Updates the {@link #component} configuration
     */
    updateComponent: function(newComponent) {
        this.callParent(arguments);

        var cls = this.getCls();

        if (newComponent) {
            this.spinDownButton = newComponent.element.createChild({
                cls : cls + '-button ' + cls + '-button-down',
                html: '-'
            });

            newComponent.element.insertFirst(this.spinDownButton);

            this.spinUpButton = newComponent.element.createChild({
                cls : cls + '-button ' + cls + '-button-up',
                html: '+'
            });

            this.downRepeater = this.createRepeater(this.spinDownButton, this.onSpinDown);
            this.upRepeater = this.createRepeater(this.spinUpButton,     this.onSpinUp);
        }
    },

    // @inherit
    applyValue: function(value) {
        value = parseFloat(value);
        if (isNaN(value)) {
            value = this.getDefaultValue();
        }

        //round the value to 1 decimal
        value = Math.round(value * 10) / 10;

        return this.callParent([value]);
    },

    // @private
    createRepeater: function(el, fn) {
        var me = this,
            repeater = Ext.create('Ext.util.TapRepeater', {
                el: el,
                accelerate: me.getAccelerateOnTapHold()
            });

        repeater.on({
            tap: fn,
            touchstart: 'onTouchStart',
            touchend: 'onTouchEnd',
            scope: me
        });

        return repeater;
    },

    // @private
    onSpinDown: function() {
        if (!this.getDisabled()) {
            this.spin(true);
        }
    },

    // @private
    onSpinUp: function() {
        if (!this.getDisabled()) {
            this.spin(false);
        }
    },

    // @private
    onTouchStart: function(repeater) {
        if (!this.getDisabled()) {
            repeater.getEl().addCls(Ext.baseCSSPrefix + 'button-pressed');
        }
    },

    // @private
    onTouchEnd: function(repeater) {
        repeater.getEl().removeCls(Ext.baseCSSPrefix + 'button-pressed');
    },

    // @private
    spin: function(down) {
        var me = this,
            value = me.getValue(),
            increment = me.getIncrement(),
            direction = down ? 'down' : 'up';

        if (down) {
            value -= increment;
        }
        else {
            value += increment;
        }

        me.setValue(value);
        value = me._value;

        me.fireEvent('spin', me, value, direction);
        me.fireEvent('spin' + direction, me, value);
    },

    reset: function() {
        this.setValue(this.getDefaultValue());
    },

    // @private
    destroy: function() {
        var me = this;
        Ext.destroy(me.downRepeater, me.upRepeater);
        me.callParent(arguments);
    }
}, function() {
    //incrementValue
});
