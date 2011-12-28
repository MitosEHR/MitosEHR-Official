/**
 * @private
 */
Ext.define('Ext.field.TextAreaInput', {
    extend: 'Ext.field.Input',
    xtype : 'textareainput',

    config: {
        /**
         * @cfg {String} tag The el tag
         * @accessor
         */
        tag: 'textarea'
    },

    // @private
    getTemplate: function() {
        var items = [
            {
                reference: 'input',
                tag: this.getTag()
            },
            {
                reference: 'clearIcon',
                cls: 'x-clear-icon',
                html: 'x'
            }
        ];

        items.push({
            reference: 'mask',
            classList: [this.getMaskCls()]
        });

        return items;
    }
});
