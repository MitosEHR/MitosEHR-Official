/**
 * @class Ext.chart.series.Column
 * @extends Ext.chart.series.Bar
 * 
  <p>
  Creates a Column Chart. Much of the methods are inherited from Bar. A Column Chart is a useful visualization technique to display quantitative information for different 
  categories that can show some progression (or regression) in the data set.
  As with all other series, the Column Series must be appended in the *series* Chart array configuration. See the Chart 
  documentation for more information. A typical configuration object for the column series could be:
  </p>
  
  <pre><code>
    series: [{
        type: 'column',
        axis: 'bottom',
        highlight: true,
        xField: 'name',
        yField: 'data1'
    }]
   </code></pre>
 
  <p>
  In this configuration we set `column` as the series type, bind the values of the bars to the bottom axis, set `highlight` to true so that bars are smoothly highlighted
  when hovered and bind the `xField` or category field to the data store `name` property and the `yField` as the data1 property of a store element. 
  </p>
 */

Ext.define('Ext.chart.series.Column', {

    /* Begin Definitions */

    extend: 'Ext.chart.series.Bar',

    /* End Definitions */

    type: 'column',
    column: true,

    /**
     * @cfg {Number} xpadding
     * Padding between the left/right axes and the bars
     */
    xpadding: 10,

    /**
     * @cfg {Number} ypadding
     * Padding between the top/bottom axes and the bars
     */
    ypadding: 0
});