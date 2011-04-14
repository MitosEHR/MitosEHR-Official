/**
 * <p>This feature is used to place a summary row at the bottom
 * of each group in the grid. If not using a grouping, see {@link Ext.grid.SummaryFeature}.
 * 
 * The detail for displaying summaries are described in the single summary feature class:
 * {@link Ext.grid.SummaryFeature}.
 * 
 * @class Ext.grid.feature.GroupingSummary
 * @extends Ext.grid.feature.Grouping
 */

Ext.define('Ext.grid.feature.GroupingSummary', {
    
    /* Begin Definitions */
    
    extend: 'Ext.grid.feature.Grouping',
    
    alias: 'feature.groupingsummary',
    
    mixins: {
        summary: 'Ext.grid.feature.AbstractSummary'
    },
    
    /* End Definitions */

     
   /**
    * Modifies the row template to include the summary row.
    * @private
    * @return {String} The modified template
    */
   getFeatureTpl: function() {
        var tpl = this.callParent(arguments);
            
        if (this.showSummaryRow) {
            // lop off the end </tpl> so we can attach it
            tpl = tpl.replace('</tpl>', '');
            tpl += '{[this.printSummaryRow(xindex)]}</tpl>';
        }
        return tpl;
    },
    
    /**
     * Gets any fragments needed for the template.
     * @private
     * @return {Object} The fragments
     */
    getFragmentTpl: function() {
        var me = this,
            fragments = me.callParent();
            
        Ext.apply(fragments, me.getSummaryFragments());
        if (me.showSummaryRow) {
            // this gets called before render, so we'll setup the data here.
            me.summaryGroups = me.view.store.getGroups();
            me.summaryData = me.generateSummaryData();
        }
        return fragments;
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
            name = me.summaryGroups[index - 1].name,
            active = me.summaryData[name],
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
            remoteData = {},
            store = me.view.store,
            groupField = this.getGroupField(),
            reader = store.proxy.reader,
            groups = me.summaryGroups,
            columns = me.view.headerCt.getColumnsForTpl(),
            i,
            length,
            fieldData,
            root,
            key,
            comp;
            
        for (i = 0, length = groups.length; i < length; ++i) {
            data[groups[i].name] = {};
        }
        
    /**
     * @cfg {String} remoteRoot.  The name of the property
     * which contains the Array of summary objects.  Defaults to <tt>undefined</tt>.
     * It allows to use server-side calculated summaries.
     */
        if (me.remoteRoot && reader.rawData) {
            // reset reader root and rebuild extractors to extract summaries data
            root = reader.root;
            reader.root = me.remoteRoot;
            reader.buildExtractors(true);
            Ext.Array.each(reader.getRoot(reader.rawData), function(value) {
                 data[value[groupField]] = value;
                 data[value[groupField]]._remote = true;
            });
            // restore initial reader configuration
            reader.root = root;
            reader.buildExtractors(true);
        }
        
        for (i = 0, length = columns.length; i < length; ++i) {
            comp = Ext.getCmp(columns[i].id);
            fieldData = me.getSummary(store, comp.summaryType, comp.dataIndex, true);
            
            for (key in fieldData) {
                if (fieldData.hasOwnProperty(key)) {
                    if (!data[key]._remote) {
                        data[key][comp.dataIndex] = fieldData[key];
                    }
                }
            }
        }
        return data;
    }
});
