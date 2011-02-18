/**
 * @class Ext.chart.axis.Category
 * @extends Ext.chart.axis.Axis
 * 
 * A type of axis that displays items in categories.
 */

Ext.define('Ext.chart.axis.Category', {

    /* Begin Definitions */

    extend: 'Ext.chart.axis.Axis',

    /* End Definitions */

    /**
     * A list of category names to display along this axis.
     *
     * @property categoryNames
     * @type Array
     */
    categoryNames: null,

    /**
     * Indicates whether or not to calculate the number of categories (ticks and
     * labels) when there is not enough room to display all labels on the axis.
     * If set to true, the axis will determine the number of categories to plot.
     * If not, all categories will be plotted.
     *
     * @property calculateCategoryCount
     * @type Boolean
     */
    calculateCategoryCount: false,

    // @private creates an array of labels to be used when rendering.
    setLabels: function() {
        var store = this.chart.store,
            fields = this.fields,
            ln = fields.length,
            i;

        this.labels = [];
        store.each(function(record) {
            for (i = 0; i < ln; i++) {
                this.labels.push(record.get(fields[i]));
            }
        }, this);
    },

    // @private calculates labels positions and marker positions for rendering.
    applyData: function() {
        Ext.chart.axis.Category.superclass.applyData.call(this);
        this.setLabels();
        var count = this.chart.store.getCount();
        return {
            from: 0,
            to: count,
            power: 1,
            step: 1,
            steps: count - 1
        };
    }
});