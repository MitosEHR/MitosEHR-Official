/**
 * @class Ext.chart.series.Series
 * 
 * Series is the abstract class containing the common logic to all chart series. Series includes 
 * methods from Labels, Highlights, Tips and Callouts mixins. This class implements the logic of handling 
 * mouse events, animating, hiding, showing all elements and returning the color of the series to be used as a legend item.
 */
Ext.define('Ext.chart.series.Series', {

    /* Begin Definitions */

    mixins: {
        labels: 'Ext.chart.Labels',
        highlights: 'Ext.chart.Highlights',
        tips: 'Ext.chart.Tips',
        callouts: 'Ext.chart.Callouts'
    },

    /* End Definitions */

    /**
     * @cfg {String} type
     * The type of series. Set in subclasses.
     */
    type: null,

    /**
     * @cfg {String} title
     * The human-readable name of the series.
     */
    title: null,

    /**
     * @cfg {Boolean} showInLegend
     * Whether to show this series in the legend.
     */
    showInLegend: true,

    /**
     * @cfg {Function} renderer
     * A function that can be overridden to set custom styling properties to each rendered element.
     * Passes in (sprite, record, attributes, index, store) to the function.
     */
    renderer: function(sprite, record, attributes, index, store) {
        return attributes;
    },

    /**
     * @cfg {Array} shadowAttributes
     * An array with shadow attributes
     */
    shadowAttributes: null,

    /**
     * @cfg {Object} listeners  
     * An (optional) object with event callbacks. All event callbacks get the target *item* as first parameter. The callback functions are:
     *  
     *  <ul>
     *      <li>itemmouseover</li>
     *      <li>itemmouseout</li>
     *      <li>itemmousedown</li>
     *      <li>itemmouseup</li>
     *  </ul>
     */
    
    constructor: function(config) {
        var me = this;
        if (config) {
            Ext.apply(me, config);
        }
        
        me.listeners = Ext.applyIf(config.listeners || {}, {
            itemmouseover: Ext.emptyFn,
            itemmouseout: Ext.emptyFn,
            itemmousedown: Ext.emptyFn,
            itemmouseup: Ext.emptyFn
        });
        
        me.shadowGroups = [];

        me.mixins.labels.constructor.call(me, config);
        me.mixins.highlights.constructor.call(me, config);
        me.mixins.tips.constructor.call(me, config);
        me.mixins.callouts.constructor.call(me, config);

        me.chart.on({
            scope: me,
            itemmouseover: me.onItemMouseOver,
            itemmouseout: me.onItemMouseOut,
            itemmousedown: me.onItemMouseDown,
            itemmouseup: me.onItemMouseUp,
            mouseleave: me.onMouseLeave
        });
    },

    // @private set the bbox and clipBox for the series
    setBBox: function() {
        var me = this,
            chart = me.chart,
            chartBBox = chart.chartBBox,
            gutterX = chart.maxGutter[0],
            gutterY = chart.maxGutter[1],
            clipBox, bbox;

        clipBox = {
            x: chartBBox.x,
            y: chartBBox.y,
            width: chartBBox.width,
            height: chartBBox.height
        };
        me.clipBox = clipBox;

        bbox = {
            x: (clipBox.x + gutterX) - (chart.zoom.x * chart.zoom.width),
            y: (clipBox.y + gutterY) - (chart.zoom.y * chart.zoom.height),
            width: (clipBox.width - (gutterX * 2)) * chart.zoom.width,
            height: (clipBox.height - (gutterY * 2)) * chart.zoom.height
        };
        me.bbox = bbox;
    },

    // @private set the animation for the sprite
    onAnimate: function(sprite, attr) {
        sprite.stopFx();
        return sprite.animate(Ext.applyIf(attr, this.chart.animate));
    },

    // @private return the gutter.
    getGutters: function() {
        return [0, 0];
    },

    // @private wrapper for the itemmouseup event.
    onItemMouseUp: function(item) {
        this.listeners.itemmouseup(item);
    },
    // @private wrapper for the itemmousedown event.
    onItemMouseDown: function(item) {
        this.listeners.itemmousedown(item);
    },

    // @private wrapper for the itemmouseover event.
    onItemMouseOver: function(item) { 
        var me = this;
        if (item.series === me) {
            if (me.highlight) {
                me.highlightItem(item);
            }
            if (me.tooltip) {
                me.showTip(item);
            }
        }
        me.listeners.itemmouseover(item);
    },

    // @private wrapper for the itemmouseout event.
    onItemMouseOut: function(item) {
        var me = this;
        if (item.series === me) {
            me.unHighlightItem();
            if (me.tooltip) {
                me.hideTip(item);
            }
        }
        me.listeners.itemmouseout(item);
    },

    // @private wrapper for the mouseleave event.
    onMouseLeave: function() {
        var me = this;
        me.unHighlightItem();
        if (me.tooltip) {
            me.hideTip();
        }
    },

    /**
     * For a given x/y point relative to the Surface, find a corresponding item from this
     * series, if any.
     * @param {Number} x
     * @param {Number} y
     * @return {Object} An object describing the item, or null if there is no matching item. The exact contents of
     *                  this object will vary by series type, but should always contain at least the following:
     *                  <ul>
     *                    <li>{Ext.chart.series.Series} series - the Series object to which the item belongs</li>
     *                    <li>{Object} value - the value(s) of the item's data point</li>
     *                    <li>{Array} point - the x/y coordinates relative to the chart box of a single point
     *                        for this data item, which can be used as e.g. a tooltip anchor point.</li>
     *                    <li>{Ext.draw.Sprite} sprite - the item's rendering Sprite.
     *                  </ul>
     */
    getItemForPoint: function(x, y) {
        return null;
    },

    /**
     * Hides all the elements in the series.
     */
    hideAll: function() {
        var me = this,
            items = me.items,
            item, len, i, sprite;

        me._prevShowMarkers = me.showMarkers;

        me.showMarkers = false;
        //hide all labels
        me.hideLabels(0);
        //hide all sprites
        for (i = 0, len = items.length; i < len; i++) {
            item = items[i];
            sprite = item.sprite;
            if (sprite) {
                sprite.setAttributes({
                    hidden: true
                }, true);
            }
        }
    },

    /**
     * Shows all the elements in the series.
     */
    showAll: function() {
        var me = this,
            prevAnimate = me.chart.animate;
        me.chart.animate = false;
        me.showMarkers = me._prevShowMarkers;
        me.drawSeries();
        me.chart.animate = prevAnimate;
    },
    
    /**
     * Returns a string with the color to be used for the series legend item. 
     */
    getLegendColor: function(index) {
        var me = this, fill, stroke;
        if (me.seriesStyle) {
            fill = me.seriesStyle.fill;
            stroke = me.seriesStyle.stroke;
            if (fill && fill != 'none') {
                return fill;
            }
            return stroke;
        }
        return '#000';
    }
});
