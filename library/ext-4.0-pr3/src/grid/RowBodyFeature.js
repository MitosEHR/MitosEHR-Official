/**
 * @class Ext.grid.RowBodyFeature
 * @extends Ext.grid.Feature
 *
 * The rowbody feature enhances the grid's markup to have an additional
 * tr -> td -> div which spans the entire width of the original row.
 *
 * This is useful to to associate additional information with a particular
 * record in a grid.
 *
 * Rowbodies are initially hidden unless you override getAdditionalData.
 *
 * Will expose additional events on the gridview with the prefix of 'rowbody'.
 * For example: 'rowbodyclick', 'rowbodydblclick', 'rowbodycontextmenu'.
 *
 * @ftype rowbody
 */
Ext.define('Ext.grid.RowBodyFeature', {
    extend: 'Ext.grid.Feature',
    alias: 'feature.rowbody',
    rowBodyHiddenCls: Ext.baseCSSPrefix + 'grid-row-body-hidden',

    eventPrefix: 'rowbody',
    eventSelector: '.' + Ext.baseCSSPrefix + 'grid-rowbody-tr',
    
    getRowBody: function(values) {
        return [
            '<tr class="' + Ext.baseCSSPrefix + 'grid-rowbody-tr {rowBodyCls}">',
                '<td class="' + Ext.baseCSSPrefix + 'grid-cell-rowbody" colspan="{rowBodyColspan}">',
                    '<div class="' + Ext.baseCSSPrefix + 'grid-rowbody">{rowBody}</div>',
                '</td>',
            '</tr>'
        ].join('');
    },
    
    // injects getRowBody into the metaRowTpl.
    getMetaRowTplFragments: function() {
        return {
            getRowBody: this.getRowBody
        };
    },
    
    mutateMetaRowTpl: function(metaRowTpl) {
        metaRowTpl.push('{[this.getRowBody(values)]}');
    },
    
    /**
     * Provide additional data to the prepareData call within the grid view.
     * The rowbody feature adds 3 additional variables into the grid view's template.
     * These are rowBodyCls, rowBodyColspan, and rowBody.
     * @param {Object} data The data for this particular record.
     * @param {Number} idx The row index for this record.
     * @param {Ext.data.Model} record The record instance
     * @param {Object} orig The original result from the prepareData call to massage.
     */
    getAdditionalData: function(data, idx, record, orig) {
        var headerCt = this.view.headerCt,
            colspan  = headerCt.getCount();
            
        return {
            rowBody: "",
            rowBodyCls: this.rowBodyCls,
            rowBodyColspan: colspan
        };
    }
});
