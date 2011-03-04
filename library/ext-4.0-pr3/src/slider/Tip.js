/**
 * @class Ext.slider.Tip
 * @extends Ext.tip.Tip
 * Simple plugin for using an Ext.tip.Tip with a slider to show the slider value. Example usage:
<pre>
new Ext.slider.Slider({
    width: 214,
    minValue: 0,
    maxValue: 100,
    plugins: new Ext.slider.Tip()
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
    minWidth: 35,
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
        var text = this.getText(thumb),
            width;
        this.update(text);
        this.show();
        width = this.body.getTextWidth(text) + this.el.getFrameWidth('lr') + this.body.getPadding('lr') + this.body.getBorderWidth('lr');
        this.setWidth(width);
        this.el.alignTo(thumb.el, 'b-t?', this.offsets);
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