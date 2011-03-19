/**
 * @class Ext.layout.component.ProgressBar
 * @extends Ext.layout.Component
 * @private
 */

Ext.define('Ext.layout.component.ProgressBar', {

    /* Begin Definitions */

    alias: ['layout.progressbar'],

    extend: 'Ext.layout.Component',

    /* End Definitions */

    type: 'progressbar',

    onLayout: function(width, height) {
        var me = this,
            owner = me.owner,
            textEl = owner.textEl;
        
        me.setElementSize(owner.el, width, height);
        textEl.setWidth(owner.el.getWidth(true));
        
        Ext.layout.component.ProgressBar.superclass.onLayout.call(this, width, height);
        
        owner.updateProgress(owner.value);
    }
});