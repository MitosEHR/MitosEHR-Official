/**
 * @private
 * @class Ext.layout.component.form.Trigger
 * @extends Ext.layout.component.form.Field
 * Layout class for {@link Ext.form.Trigger} fields. Adjusts the input field size to accommodate
 * the trigger button(s).
 * @private
 */

Ext.define('Ext.layout.component.form.Trigger', {

    /* Begin Definitions */

    alias: ['layout.triggerfield'],

    extend: 'Ext.layout.component.form.Field',

    /* End Definitions */

    type: 'triggerfield',

    sizeBodyContents: function(width, height) {
        var me = this,
            owner = me.owner,
            inputEl = owner.inputEl,
            triggerWrap = owner.triggerWrap,
            triggerWidth = owner.getTriggerWidth();

        // Decrease the field's width by the width of the triggers. Both the field and the triggerWrap
        // are floated left in CSS so they'll stack up side by side.
        me.setElementSize(inputEl, width - triggerWidth, height);

        // Explicitly set the triggerWrap's width, to prevent wrapping
        triggerWrap.setWidth(triggerWidth);
    }
});