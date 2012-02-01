/**
 * @private
 */
Ext.define('Ext.slider.Toggle', {
    extend: 'Ext.slider.Slider',

    config: {
        // @inherit
        baseCls: 'x-toggle',

        /**
         * @cfg {String} minValueCls CSS class added to the field when toggled to its minValue
         * @accessor
         */
        minValueCls: 'x-toggle-off',

        /**
         * @cfg {String} maxValueCls CSS class added to the field when toggled to its maxValue
         * @accessor
         */
        maxValueCls: 'x-toggle-on'
    },

    applyMinValue: function() {
        return 0;
    },

    applyMaxValue: function() {
        return 1;
    },

    applyIncrement: function() {
        return 1;
    },

    onTap: function() {
        this.setValue(this.getValue() > 0 ? 0 : 1);
    },

    fireChangeEvent: function() {
        var me = this,
            value = this.getValue(),
            isOn = value > 0,
            onCls = me.getMaxValueCls(),
            offCls = me.getMinValueCls();

        this.addCls(isOn ? onCls : offCls);
        this.removeCls(isOn ? offCls : onCls);

        this.callParent();
    },

    getValue: function() {
        return this.callParent()[0];
    }
});
