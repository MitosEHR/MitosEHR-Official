/**
 * @class Ext.slider.Multi
 * @extends Ext.Component
 * <p>Slider which supports vertical or horizontal orientation, keyboard adjustments, configurable snapping, axis
 * clicking and animation. Can be added as an item to any container. In addition,  
 * <p>Example usage:</p>
<pre>
new Ext.slider.Multi({
    renderTo: Ext.getBody(),
    width: 200,
    value: 50,
    increment: 10,
    minValue: 0,
    maxValue: 100
});
</pre>
 * Sliders can be created with more than one thumb handle by passing an array of values instead of a single one:
<pre>
new Ext.slider.Multi({
    renderTo: Ext.getBody(),
    width: 200,
    values: [25, 50, 75],
    minValue: 0,
    maxValue: 100,

    //this defaults to true, setting to false allows the thumbs to pass each other
    {@link #constrainThumbs}: false
});
</pre>
 * @xtype multislider
 */
Ext.define('Ext.slider.Multi', {
    extend: 'Ext.form.BaseField',
    alias: 'widget.multislider',
    requires: ['Ext.slider.Thumb', 'Ext.slider.Tip', 'Ext.Number', 'Ext.util.Format', 'Ext.Template'],

    /**
     * @cfg {Number} value
     * A value with which to initialize the slider. Defaults to minValue. Setting this will only
     * result in the creation of a single slider thumb; if you want multiple thumbs then use the
     * {@link #values} config instead.
     */

    /**
     * @cfg {Array} values
     * Array of Number values with which to initalize the slider. A separate slider thumb will be created for
     * each value in this array. This will take precedence over the single {@link #value} config.
     */

    /**
     * @cfg {Boolean} vertical Orient the Slider vertically rather than horizontally, defaults to false.
     */
    vertical: false,
    /**
     * @cfg {Number} minValue The minimum value for the Slider. Defaults to 0.
     */
    minValue: 0,
    /**
     * @cfg {Number} maxValue The maximum value for the Slider. Defaults to 100.
     */
    maxValue: 100,
    /**
     * @cfg {Number/Boolean} decimalPrecision.
     * <p>The number of decimal places to which to round the Slider's value. Defaults to 0.</p>
     * <p>To disable rounding, configure as <tt><b>false</b></tt>.</p>
     */
    decimalPrecision: 0,
    /**
     * @cfg {Number} keyIncrement How many units to change the Slider when adjusting with keyboard navigation. Defaults to 1. If the increment config is larger, it will be used instead.
     */
    keyIncrement: 1,
    /**
     * @cfg {Number} increment How many units to change the slider when adjusting by drag and drop. Use this option to enable 'snapping'.
     */
    increment: 0,

    /**
     * @private
     * @property clickRange
     * @type Array
     * Determines whether or not a click to the slider component is considered to be a user request to change the value. Specified as an array of [top, bottom],
     * the click event's 'top' property is compared to these numbers and the click only considered a change request if it falls within them. e.g. if the 'top'
     * value of the click event is 4 or 16, the click is not considered a change request as it falls outside of the [5, 15] range
     */
    clickRange: [5,15],

    /**
     * @cfg {Boolean} clickToChange Determines whether or not clicking on the Slider axis will change the slider. Defaults to true
     */
    clickToChange : true,
    /**
     * @cfg {Boolean} animate Turn on or off animation. Defaults to true
     */
    animate: true,

    /**
     * True while the thumb is in a drag operation
     * @type Boolean
     */
    dragging: false,

    /**
     * @cfg {Boolean} constrainThumbs True to disallow thumbs from overlapping one another. Defaults to true
     */
    constrainThumbs: true,

    componentLayout: 'sliderfield',

    /**
     * @cfg {Boolean} useTips
     * True to use an Ext.slider.Tip to display tips for the value. Defaults to <tt>true</tt>.
     */
    useTips : true,

    /**
     * @cfg {Function} tipText
     * A function used to display custom text for the slider tip. Defaults to <tt>null</tt>, which will
     * use the default on the plugin.
     */
    tipText : null,

    ariaRole: 'slider',

    // private override
    initValue: function() {
        var me = this,
            extValue = Ext.value,
            i, len,
            // Fallback for initial values: values config -> value config -> minValue config -> 0
            values = extValue(me.values, [extValue(me.value, extValue(me.minValue, 0))]);

        // Store for use in dirty check
        me.originalValue = values;

        // Add a thumb for each value
        for (i = 0, len = values.length; i < len; i++) {
            this.addThumb(values[i]);
        }
    },

    // private override
    initComponent : function() {
        /**
         * @property thumbs
         * @type Array
         * Array containing references to each thumb
         */
        this.thumbs = [];

        this.keyIncrement = Math.max(this.increment, this.keyIncrement);

        this.addEvents(
            /**
             * @event beforechange
             * Fires before the slider value is changed. By returning false from an event handler,
             * you can cancel the event and prevent the slider from changing.
             * @param {Ext.slider.Multi} slider The slider
             * @param {Number} newValue The new value which the slider is being changed to.
             * @param {Number} oldValue The old value which the slider was previously.
             */
            'beforechange',

            /**
             * @event change
             * Fires when the slider value is changed.
             * @param {Ext.slider.Multi} slider The slider
             * @param {Number} newValue The new value which the slider has been changed to.
             * @param {Ext.slider.Thumb} thumb The thumb that was changed
             */
            'change',

            /**
             * @event changecomplete
             * Fires when the slider value is changed by the user and any drag operations have completed.
             * @param {Ext.slider.Multi} slider The slider
             * @param {Number} newValue The new value which the slider has been changed to.
             * @param {Ext.slider.Thumb} thumb The thumb that was changed
             */
            'changecomplete',

            /**
             * @event dragstart
             * Fires after a drag operation has started.
             * @param {Ext.slider.Multi} slider The slider
             * @param {Ext.EventObject} e The event fired from Ext.dd.DragTracker
             */
            'dragstart',

            /**
             * @event drag
             * Fires continuously during the drag operation while the mouse is moving.
             * @param {Ext.slider.Multi} slider The slider
             * @param {Ext.EventObject} e The event fired from Ext.dd.DragTracker
             */
            'drag',

            /**
             * @event dragend
             * Fires after the drag operation has completed.
             * @param {Ext.slider.Multi} slider The slider
             * @param {Ext.EventObject} e The event fired from Ext.dd.DragTracker
             */
            'dragend'
        );

        if (this.vertical) {
            Ext.apply(this, Ext.slider.Multi.Vertical);
        }

        this.callParent();

        // only can use it if it exists.
        if (this.useTips) {
            var plug = this.tipText ? {getText: this.tipText} : {};
            this.plugins = this.plugins || [];
            this.plugins.push(new Ext.slider.Tip(plug));
        }
    },

    /**
     * Creates a new thumb and adds it to the slider
     * @param {Number} value The initial value to set on the thumb. Defaults to 0
     * @return {Ext.slider.Thumb} The thumb
     */
    addThumb: function(value) {
        var thumb = new Ext.slider.Thumb({
            value    : value,
            slider   : this,
            index    : this.thumbs.length,
            constrain: this.constrainThumbs
        });
        this.thumbs.push(thumb);

        //render the thumb now if needed
        if (this.rendered) {
            thumb.render();
        }

        return thumb;
    },

    /**
     * @private
     * Moves the given thumb above all other by increasing its z-index. This is called when as drag
     * any thumb, so that the thumb that was just dragged is always at the highest z-index. This is
     * required when the thumbs are stacked on top of each other at one of the ends of the slider's
     * range, which can result in the user not being able to move any of them.
     * @param {Ext.slider.Thumb} topThumb The thumb to move to the top
     */
    promoteThumb: function(topThumb) {
        var thumbs = this.thumbs,
            ln = thumbs.length,
            zIndex, thumb, i;
        for (i = 0; i < ln; i++) {
            thumb = thumbs[i];

            if (thumb == topThumb) {
                thumb.bringToFront();
            } else {
                thumb.sendToBack();
            }
        }
    },

    // private override
    onRender : function() {
        var i,
            thumbs = this.thumbs,
            ln = thumbs.length,
            thumb;

        Ext.applyIf(this.subTplData, {
            vertical: this.vertical ? Ext.baseCSSPrefix + 'slider-vert' : Ext.baseCSSPrefix + 'slider-horz',
            minValue: this.minValue,
            maxValue: this.maxValue,
            value: this.value
        });

        Ext.applyIf(this.renderSelectors, {
            endEl: '.' + Ext.baseCSSPrefix + 'slider-end',
            innerEl: '.' + Ext.baseCSSPrefix + 'slider-inner',
            focusEl: '.' + Ext.baseCSSPrefix + 'slider-focus'
        });

        this.callParent(arguments);

        //render each thumb
        for (i = 0; i < ln; i++) {
            thumbs[i].render();
        }

        //calculate the size of half a thumb
        thumb = this.innerEl.down('.' + Ext.baseCSSPrefix + 'slider-thumb');
        this.halfThumb = (this.vertical ? thumb.getHeight() : thumb.getWidth()) / 2;

    },

    /**
     * Utility method to set the value of the field when the slider changes.
     * @param {Object} slider The slider object.
     * @param {Object} v The new value.
     * @private
     */
    onChange : function(slider, v) {
        this.setValue(v, undefined, true);
    },

    /**
     * @private
     * Adds keyboard and mouse listeners on this.el. Ignores click events on the internal focus element.
     */
    initEvents : function() {
        this.mon(this.el, {
            scope    : this,
            mousedown: this.onMouseDown,
            keydown  : this.onKeyDown,
            change : this.onChange
        });

        this.focusEl.swallowEvent("click", true);
    },

    /**
     * @private
     * Mousedown handler for the slider. If the clickToChange is enabled and the click was not on the draggable 'thumb',
     * this calculates the new value of the slider and tells the implementation (Horizontal or Vertical) to move the thumb
     * @param {Ext.EventObject} e The click event
     */
    onMouseDown : function(e) {
        if(this.disabled) {
            return;
        }

        //see if the click was on any of the thumbs
        var thumbClicked = false;
        for (var i=0; i < this.thumbs.length; i++) {
            thumbClicked = thumbClicked || e.target == this.thumbs[i].el.dom;
        }

        if (this.clickToChange && !thumbClicked) {
            var local = this.innerEl.translatePoints(e.getXY());
            this.onClickChange(local);
        }
        this.focus();
    },

    /**
     * @private
     * Moves the thumb to the indicated position. Note that a Vertical implementation is provided in Ext.slider.Multi.Vertical.
     * Only changes the value if the click was within this.clickRange.
     * @param {Object} local Object containing top and left values for the click event.
     */
    onClickChange : function(local) {
        var thumb, index;
        if (local.top > this.clickRange[0] && local.top < this.clickRange[1]) {
            //find the nearest thumb to the click event
            thumb = this.getNearest(local, 'left');
            if (!thumb.disabled) {
                index = thumb.index;
                this.setValue(index, Ext.util.Format.round(this.reverseValue(local.left), this.decimalPrecision), undefined, true);
            }
        }
    },

    /**
     * @private
     * Returns the nearest thumb to a click event, along with its distance
     * @param {Object} local Object containing top and left values from a click event
     * @param {String} prop The property of local to compare on. Use 'left' for horizontal sliders, 'top' for vertical ones
     * @return {Object} The closest thumb object and its distance from the click event
     */
    getNearest: function(local, prop) {
        var localValue = prop == 'top' ? this.innerEl.getHeight() - local[prop] : local[prop],
            clickValue = this.reverseValue(localValue),
            nearestDistance = (this.maxValue - this.minValue) + 5, //add a small fudge for the end of the slider
            index = 0,
            nearest = null;

        for (var i=0; i < this.thumbs.length; i++) {
            var thumb = this.thumbs[i],
                value = thumb.value,
                dist  = Math.abs(value - clickValue);

            if (Math.abs(dist <= nearestDistance)) {
                nearest = thumb;
                index = i;
                nearestDistance = dist;
            }
        }
        return nearest;
    },

    /**
     * @private
     * Handler for any keypresses captured by the slider. If the key is UP or RIGHT, the thumb is moved along to the right
     * by this.keyIncrement. If DOWN or LEFT it is moved left. Pressing CTRL moves the slider to the end in either direction
     * @param {Ext.EventObject} e The Event object
     */
    onKeyDown : function(e) {
        /*
         * The behaviour for keyboard handling with multiple thumbs is currently undefined.
         * There's no real sane default for it, so leave it like this until we come up
         * with a better way of doing it.
         */
        if(this.disabled || this.thumbs.length !== 1) {
            e.preventDefault();
            return;
        }
        var k = e.getKey(),
            val;
        switch(k) {
            case e.UP:
            case e.RIGHT:
                e.stopEvent();
                val = e.ctrlKey ? this.maxValue : this.getValue(0) + this.keyIncrement;
                this.setValue(0, val, undefined, true);
            break;
            case e.DOWN:
            case e.LEFT:
                e.stopEvent();
                val = e.ctrlKey ? this.minValue : this.getValue(0) - this.keyIncrement;
                this.setValue(0, val, undefined, true);
            break;
            default:
                e.preventDefault();
        }
    },

    /**
     * @private
     * If using snapping, this takes a desired new value and returns the closest snapped
     * value to it
     * @param {Number} value The unsnapped value
     * @return {Number} The value of the nearest snap target
     */
    doSnap : function(value) {
        if (!(this.increment && value)) {
            return value;
        }
        var newValue = value,
            inc = this.increment,
            m = value % inc;
        if (m !== 0) {
            newValue -= m;
            if (m * 2 >= inc) {
                newValue += inc;
            } else if (m * 2 < -inc) {
                newValue -= inc;
            }
        }
        return Ext.Number.constrain(newValue, this.minValue,  this.maxValue);
    },

    // private
    afterRender : function() {
        this.callParent(arguments);

        for (var i=0; i < this.thumbs.length; i++) {
            var thumb = this.thumbs[i];

            if (thumb.value !== undefined) {
                var v = this.normalizeValue(thumb.value);
                if (v !== thumb.value) {
                    // delete this.value;
                    this.setValue(i, v, false);
                } else {
                    thumb.move(this.translateValue(v), false);
                }
            }
        }
    },

    /**
     * @private
     * Returns the ratio of pixels to mapped values. e.g. if the slider is 200px wide and maxValue - minValue is 100,
     * the ratio is 2
     * @return {Number} The ratio of pixels to mapped values
     */
    getRatio : function() {
        var w = this.innerEl.getWidth(),
            v = this.maxValue - this.minValue;
        return v === 0 ? w : (w/v);
    },

    /**
     * @private
     * Returns a snapped, constrained value when given a desired value
     * @param {Number} value Raw number value
     * @return {Number} The raw value rounded to the correct d.p. and constrained within the set max and min values
     */
    normalizeValue : function(v) {
        v = this.doSnap(v);
        v = Ext.util.Format.round(v, this.decimalPrecision);
        v = Ext.Number.constrain(v, this.minValue, this.maxValue);
        return v;
    },

    /**
     * Sets the minimum value for the slider instance. If the current value is less than the
     * minimum value, the current value will be changed.
     * @param {Number} val The new minimum value
     */
    setMinValue : function(val) {
        this.minValue = val;
        this.inputEl.dom.setAttribute('aria-valuemin', val);
        var i = 0,
            thumbs = this.thumbs,
            len = thumbs.length,
            t;

        for(; i < len; ++i) {
            t = thumbs[i];
            t.value = t.value < val ? val : t.value;
        }
        this.syncThumbs();
    },

    /**
     * Sets the maximum value for the slider instance. If the current value is more than the
     * maximum value, the current value will be changed.
     * @param {Number} val The new maximum value
     */
    setMaxValue : function(val) {
        this.maxValue = val;
        this.inputEl.dom.setAttribute('aria-valuemax', val);
        var i = 0,
            thumbs = this.thumbs,
            len = thumbs.length,
            t;

        for(; i < len; ++i) {
            t = thumbs[i];
            t.value = t.value > val ? val : t.value;
        }
        this.syncThumbs();
    },

    /**
     * Programmatically sets the value of the Slider. Ensures that the value is constrained within
     * the minValue and maxValue.
     * @param {Number} index Index of the thumb to move
     * @param {Number} value The value to set the slider to. (This will be constrained within minValue and maxValue)
     * @param {Boolean} animate Turn on or off animation, defaults to true
     */
    setValue : function(index, value, animate, changeComplete) {
        var me = this,
            thumb = me.thumbs[index];

        // ensures value is contstrained and snapped
        value = me.normalizeValue(value);

        if (value !== thumb.value && me.fireEvent('beforechange', me, value, thumb.value, thumb) !== false) {
            thumb.value = value;
            if (me.rendered) {
                // TODO this only handles a single value; need a solution for exposing multiple values to aria.
                // Perhaps this should go on each thumb element rather than the outer element.
                me.inputEl.set({
                    'aria-valuenow': value,
                    'aria-valuetext': value
                });

                thumb.move(me.translateValue(value), Ext.isDefined(animate) ? animate !== false : me.animate);

                me.fireEvent('change', me, value, thumb);
                if (changeComplete) {
                    me.fireEvent('changecomplete', me, value, thumb);
                }
            }
        }
    },

    /**
     * @private
     */
    translateValue : function(v) {
        var ratio = this.getRatio();
        return (v * ratio) - (this.minValue * ratio) - this.halfThumb;
    },

    /**
     * @private
     * Given a pixel location along the slider, returns the mapped slider value for that pixel.
     * E.g. if we have a slider 200px wide with minValue = 100 and maxValue = 500, reverseValue(50)
     * returns 200
     * @param {Number} pos The position along the slider to return a mapped value for
     * @return {Number} The mapped value for the given position
     */
    reverseValue : function(pos) {
        var ratio = this.getRatio();
        return (pos + (this.minValue * ratio)) / ratio;
    },

    // private
    focus : function() {
        this.focusEl.focus(10);
    },

    //private
    onDisable: function() {
        this.callParent();

        for (var i=0; i < this.thumbs.length; i++) {
            var thumb = this.thumbs[i],
                el    = thumb.el;

            thumb.disable();

            if(Ext.isIE) {
                //IE breaks when using overflow visible and opacity other than 1.
                //Create a place holder for the thumb and display it.
                var xy = el.getXY();
                el.hide();

                this.innerEl.addCls(this.disabledCls).dom.disabled = true;

                if (!this.thumbHolder) {
                    this.thumbHolder = this.endEl.createChild({cls: Ext.baseCSSPrefix + 'slider-thumb ' + this.disabledCls});
                }

                this.thumbHolder.show().setXY(xy);
            }
        }
    },

    //private
    onEnable: function() {
        this.callParent();

        for (var i=0; i < this.thumbs.length; i++) {
            var thumb = this.thumbs[i],
                el    = thumb.el;

            thumb.enable();

            if (Ext.isIE) {
                this.innerEl.removeCls(this.disabledCls).dom.disabled = false;

                if (this.thumbHolder) {
                    this.thumbHolder.hide();
                }

                el.show();
                this.syncThumbs();
            }
        }
    },

    /**
     * Synchronizes thumbs position to the proper proportion of the total component width based
     * on the current slider {@link #value}.  This will be called automatically when the Slider
     * is resized by a layout, but if it is rendered auto width, this method can be called from
     * another resize handler to sync the Slider if necessary.
     */
    syncThumbs : function() {
        if (this.rendered) {
            var thumbs = this.thumbs,
                length = thumbs.length,
                i;

            for (i = 0; i < length; i++) {
                thumbs[i].move(this.translateValue(thumbs[i].value));
            }
        }
    },

    /**
     * Returns the current value of the slider
     * @param {Number} index The index of the thumb to return a value for
     * @return {Number/Array} The current value of the slider at the given index, or an array of
     * all thumb values if no index is given.
     */
    getValue : function(index) {
        return Ext.isNumber(index) ? this.thumbs[index].value : this.getValues();
    },

    /**
     * Returns an array of values - one for the location of each thumb
     * @return {Array} The set of thumb values
     */
    getValues: function() {
        var values = [];

        for (var i=0; i < this.thumbs.length; i++) {
            values.push(this.thumbs[i].value);
        }

        return values;
    },

    getSubmitValue: function() {
        var me = this;
        return (me.disabled || !me.submitValue) ? null : me.getValue();
    },
    
    // private
    beforeDestroy : function() {
        Ext.destroyMembers(this.innerEl, this.endEl, this.focusEl);
        Ext.each(this.thumbs, function(thumb) {
            Ext.destroy(thumb);
        }, this);

        this.callParent();
    },

    statics: {
        // Method overrides to support slider with vertical orientation
        Vertical: {
            getRatio : function() {
                var h = this.innerEl.getHeight(),
                    v = this.maxValue - this.minValue;
                return h/v;
            },

            onClickChange : function(local) {
                var thumb, index, bottom;

                if (local.left > this.clickRange[0] && local.left < this.clickRange[1]) {
                    thumb = this.getNearest(local, 'top');
                    if (!thumb.disabled) {
                        index = thumb.index;
                        bottom =  this.reverseValue(this.innerEl.getHeight() - local.top);
                        
                        this.setValue(index, Ext.util.Format.round(this.minValue + bottom, this.decimalPrecision), undefined, true);
                    }
                }
            }
        }
    }
}, function() {
    this.prototype.fieldSubTpl = new Ext.Template(
        '<div class="' + Ext.baseCSSPrefix + 'slider {fieldCls} {vertical}" aria-valuemin="{minValue}" aria-valuemax="{maxValue}" aria-valuenow="{value}" aria-valuetext="{value}">',
            '<div class="' + Ext.baseCSSPrefix + 'slider-end" role="presentation">',
                '<div class="' + Ext.baseCSSPrefix + 'slider-inner" role="presentation">',
                    '<a class="' + Ext.baseCSSPrefix + 'slider-focus" href="#" tabIndex="-1" hidefocus="on" role="presentation"></a>',
                '</div>',
            '</div>',
        '</div>',
        {
            disableFormats: true,
            compiled: true
        }
    );
});
