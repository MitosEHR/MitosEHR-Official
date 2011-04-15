/**
 * <p>This feature is used to place a summary row at the bottom
 * of the grid. If using a grouping, see {@link Ext.grid.GroupingSummaryFeature}.
 * There are 2 aspects to calculating the summaries, calculation and rendering.</p>
 * <br />
 * <b>Calculation</b>
 * <p>The summary value needs to be calculated for each header in the grid. This is controlled
 * by the summaryType option specified on the column. There are several built in summary types,
 * which can be specified as a string on the header configuration. These call underlying methods
 * on the store.
 * <ul>
 *     <li>{@link Ext.data.Store#count count}</li>
 *     <li>{@link Ext.data.Store#sum sum}</li>
 *     <li>{@link Ext.data.Store#min min}</li>
 *     <li>{@link Ext.data.Store#max max}</li>
 *     <li>{@link Ext.data.Store#average average}</li>
 * </ul>
 * Alternatively, the summaryType can be a function definition. If this is the case,
 * the function is called with an array of records to calculate the summary value.</p>
 * 
 * <b>Rendering</b>
 * <p>Similar to a header, the summary also supports a summaryRenderer function. This
 * summaryRenderer is called before displaying a value. The function is optional, if
 * not specified the default calculated value is shown. The summaryRenderer is called with:
 * <ul class="mdetail-params">
 *     <li><code>value</code> : Object<div class="sub-desc">The calculated value.</div></li>
 *     <li><code>data</code> : Object<div class="sub-desc">Contains all raw summary values for the row.</div></li>
 *     <li><code>field</code> : String<div class="sub-desc">The name of the field we are calculating.</div></li>
 * </ul>
 * </p>
 * 
 * @class Ext.grid.feature.Summary
 * @extends Ext.grid.feature.AbstractSummary
 */
Ext.define('Ext.grid.feature.Summary', {
    
    /* Begin Definitions */
    
    extend: 'Ext.grid.feature.AbstractSummary',
    
    alias: 'feature.summary',
    
    /* End Definitions */
    
    /**
     * Gets any fragments needed for the template.
     * @private
     * @return {Object} The fragments
     */
    getFragmentTpl: function() {
        // this gets called before render, so we'll setup the data here.
        this.summaryData = this.generateSummaryData(); 
        return this.getSummaryFragments();
    },
    
    /**
     * Overrides the closeRows method on the template so we can include our own custom
     * footer.
     * @private
     * @return {Object} The custom fragments
     */
    getTableFragments: function(){
        if (this.showSummaryRow) {
            return {
                closeRows: this.closeRows
            };
        }
    },
    
    /**
     * Provide our own custom footer for the grid.
     * @private
     * @return {String} The custom footer
     */
    closeRows: function() {
        return '</tpl>{[this.printSummaryRow()]}';
    },
    
    /**
     * Gets the data for printing a template row
     * @private
     * @param {Number} index The index in the template
     * @return {Array} The template values
     */
    getPrintData: function(index){
        var me = this,
            columns = me.view.headerCt.getColumnsForTpl(),
            i = 0,
            length = columns.length,
            data = [],
            active = me.summaryData,
            column;
            
        for (; i < length; ++i) {
            column = columns[i];
            column.gridSummaryValue = this.getColumnValue(column, active);
            data.push(column);
        }
        return data;
    },
    
    /**
     * Generates all of the summary data to be used when processing the template
     * @private
     * @return {Object} The summary data
     */
    generateSummaryData: function(){
        var me = this,
            data = {},
            store = me.view.store,
            columns = me.view.headerCt.getColumnsForTpl(),
            i = 0,
            length = columns.length,
            fieldData,
            key,
            comp;
            
        for (i = 0, length = columns.length; i < length; ++i) {
            comp = Ext.getCmp(columns[i].id);
            data[comp.dataIndex] = me.getSummary(store, comp.summaryType, comp.dataIndex, false);
        }
        return data;
    }
});