/**
 * @class Ext.layout.component.SliderField
 * @extends Ext.layout.component.form.Field
 * @private
 */

Ext.define('Ext.layout.component.SliderField', {

    /* Begin Definitions */

    alias: ['layout.sliderfield'],

    extend: 'Ext.layout.component.form.Field',

    /* End Definitions */

    type: 'sliderfield',

    sizeBodyContents: function(width, height) {
        var owner = this.owner,
            thumbs = owner.thumbs,
            len = thumbs.length,
            inputEl = owner.inputEl,
            innerEl = owner.innerEl,
            endEl = owner.endEl,
            i;

        /*
         * If we happen to be animating during a resize, the position of the thumb will likely be off
         * when the animation stops. As such, just stop any animations before syncing the thumbs.
         */
        //~ for(i = 0; i < len; ++i) {
            //~ new Ext.fx.Anim({
                //~ target: thumbs[i].el,
                //~ suspend: true
            //~ });
        //~ }
        inputEl.setSize(width, height);
        if (owner.vertical) {
            innerEl.setHeight(height - inputEl.getPadding('t') - endEl.getPadding('b'));
        }
        else {
            innerEl.setWidth(width - inputEl.getPadding('l') - endEl.getPadding('r'));
        }
        owner.syncThumbs();
    }
});
