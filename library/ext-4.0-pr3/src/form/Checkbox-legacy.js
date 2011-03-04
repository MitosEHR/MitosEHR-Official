/**
 * Overrides for maintaining back-compat with pre-Ext4 legacy Checkbox API
 * @ignore
 */
(function() {

    var Checkbox = Ext.form.Checkbox,
        proto = Checkbox.prototype,
        _initComponent = proto.initComponent,
        _onChange = proto.onChange;

    Ext.override(Checkbox, {

        initComponent: function() {
            _initComponent.call(this);
            this.addEvents(
                /**
                 * @event check
                 * Fires when the checkbox is checked or unchecked.
                 * @deprecated Use the 'change' event instead.
                 * @param {Ext.form.Checkbox} this This checkbox
                 * @param {Boolean} checked The new checked value
                 */
                'check'
            );
        },

        /**
         * Fires the legacy 'check' event when the checkbox's checked state changes. This event has
         * been replaced by the 'change' event in Ext4, which behaves exactly the same.
         */
        onChange: function(newVal, oldVal) {
            var result = _onChange.call(this, newVal, oldVal);
            this.fireEvent('check', this, this.checked);
            return result;
        }

    });

})();
