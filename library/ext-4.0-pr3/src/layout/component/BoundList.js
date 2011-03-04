/**
 * Component layout for {@link Ext.view.BoundList}. Handles constraining the height to the configured maxHeight.
 * @class Ext.layout.component.BoundList
 * @extends Ext.layout.Component
 * @private
 */
Ext.define('Ext.layout.component.BoundList', {
    extend: 'Ext.layout.Component',
    alias: 'layout.boundlist',

    type: 'component',

    onLayout : function(width, height) {
        var me = this,
            owner = me.owner,
            el = owner.el,
            maxHeight = owner.maxHeight,
            undef;

        Ext.layout.component.BoundList.superclass.onLayout.call(this, width, height);

        me.setElementSize(el, width, height);

        // Handle maxHeight config
        if (maxHeight && !Ext.isNumber(height)) {
            el.setStyle('height', 'auto');
            if (el.getHeight() > maxHeight) {
                me.setElementSize(el, undef, maxHeight);
            }
        }
    }
});
