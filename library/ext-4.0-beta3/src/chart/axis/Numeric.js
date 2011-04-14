/**
 * @class Ext.chart.axis.Numeric
 * @extends Ext.chart.axis.Axis
 *
 * An axis to handle numeric values. This axis is used for quantitative data as
 * opposed to the category axis. You can set mininum and maximum values to the
 * axis so that the values are bound to that. If no values are set, then the
 * scale will auto-adjust to the values.
 *
 * For example:

    <pre><code>
    axes: [{
        type: 'Numeric',
        minimum: 0,
        position: 'left',
        fields: ['data1', 'data2', 'data3'],
        title: 'Number of Hits',
        grid: {
            odd: {
                opacity: 1,
                fill: '#ddd',
                stroke: '#bbb',
                'stroke-width': 0.5
            }
        }
    }]
    </code></pre>

 *
 * In this example we create an axis of Numeric type. We set a minimum value so that
 * even if all series have values greater than zero, the grid starts at zero. We bind
 * the axis onto the left part of the surface by setting <em>position</em> to <em>left</em>.
 * We bind three different store fields to this axis by setting <em>fields</em> to an array.
 * We set the title of the axis to <em>Number of Hits</em> by using the <em>title</em> property.
 * We use a <em>grid</em> configuration to set odd background rows to a certain style and even rows
 * to be transparent/ignored.
 *
 *
 * @constructor
 */
Ext.define('Ext.chart.axis.Numeric', {

    /* Begin Definitions */

    extend: 'Ext.chart.axis.Axis',

    alternateClassName: 'Ext.chart.NumericAxis',

    /* End Definitions */

    type: 'numeric',

    alias: 'axis.numeric',

    constructor: function(config) {
        var me = this, label, f;
        me.callParent([config]);
        label = me.label;
        if (me.roundToDecimal === false) {
            return;
        }
        if (label.renderer) {
            f = label.renderer;
            label.renderer = function(v) {
                return me.roundToDecimal( f(v), me.decimals );
            };
        } else {
            label.renderer = function(v) {
                return me.roundToDecimal(v, me.decimals);
            };
        }
    },
    
    roundToDecimal: function(v, dec) {
        var val = Math.pow(10, dec || 0);
        return ((v * val) >> 0) / val;
    },
    
    /**
     * The minimum value drawn by the axis. If not set explicitly, the axis
     * minimum will be calculated automatically.
     *
     * @property minimum
     * @type Number
     */
    minimum: NaN,

    /**
     * The maximum value drawn by the axis. If not set explicitly, the axis
     * maximum will be calculated automatically.
     *
     * @property maximum
     * @type Number
     */
    maximum: NaN,

    /**
     * The number of decimals to round the value to.
     * Default's 2.
     *
     * @property decimals
     * @type Number
     */
    decimals: 2,

    /**
     * The scaling algorithm to use on this axis. May be "linear" or
     * "logarithmic".
     *
     * @property scale
     * @type String
     */
    scale: "linear",

    /**
     * Indicates the position of the axis relative to the chart
     *
     * @property position
     * @type String
     */
    position: 'left',

    /**
     * Indicates whether to extend maximum beyond data's maximum to the nearest
     * majorUnit.
     *
     * @property adjustMaximumByMajorUnit
     * @type Boolean
     */
    adjustMaximumByMajorUnit: false,

    /**
     * Indicates whether to extend the minimum beyond data's minimum to the
     * nearest majorUnit.
     *
     * @property adjustMinimumByMajorUnit
     * @type Boolean
     */
    adjustMinimumByMajorUnit: false,

    // @private apply data.
    applyData: function() {
        this.callParent();
        return this.calcEnds();
    }
});
