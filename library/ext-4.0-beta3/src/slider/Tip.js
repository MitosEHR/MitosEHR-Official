/**
 * @class Ext.slider.Tip
 * @extends Ext.tip.Tip
 * Simple plugin for using an Ext.tip.Tip with a slider to show the slider value. 
 * {@img Ext.slider.Tip/Ext.slider.Tip1.png Ext.slider.Tip component}
 * Example usage:
<pre>
    Ext.create('Ext.slider.Single', {
        width: 214,
        minValue: 0,
        maxValue: 100,
        plugins: new Ext.slider.Tip(),
        renderTo: Ext.getBody()
    });   
</pre>
 * Optionally provide your own tip text by overriding getText:
 <pre>
 new Ext.slider.Slider({
     width: 214,
     minValue: 0,
     maxValue: 100,
     plugins: new Ext.slider.Tip({
         getText: function(thumb){
             return Ext.String.format('<b>{0}% complete</b>', thumb.value);
         }
     })
 });
 </pre>
 * @xtype slidertip
 */
Ext.define('Ext.slider.Tip', {
    extend: 'Ext.tip.Tip',
    minWidth: 10,
    alias: 'widget.slidertip',
    offsets : [0, -10],

    init: function(slider) {
        slider.on({
            scope    : this,
            dragstart: this.onSlide,
            drag     : this.onSlide,
            dragend  : this.hide,
            destroy  : this.destroy
        });
    },
    /**
     * @private
     * Called whenever a dragstart or drag event is received on the associated Thumb. 
     * Aligns the Tip with the Thumb's new position.
     * @param {Ext.slider.MultiSlider} slider The slider
     * @param {Ext.EventObject} e The Event object
     * @param {Ext.slider.Thumb} thumb The thumb that the Tip is attached to
     */
    onSlide : function(slider, e, thumb) {
        var me = this;
        me.show();
        me.update(me.getText(thumb));
        me.doComponentLayout();
        me.el.alignTo(thumb.el, 'b-t?', this.offsets);
    },

    /**
     * Used to create the text that appears in the Tip's body. By default this just returns
     * the value of the Slider Thumb that the Tip is attached to. Override to customize.
     * @param {Ext.slider.Thumb} thumb The Thumb that the Tip is attached to
     * @return {String} The text to display in the tip
     */
    getText : function(thumb) {
        return String(thumb.value);
    }
});