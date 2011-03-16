/**
 * @class Ext.grid.RowNumberer
 * @extends Ext.grid.Header
 * This is a utility class that can be passed into a {@link Ext.grid.Header} as a column config that provides
 * an automatic row numbering column.
 * <br>Usage:<br>
 <pre><code>
 // This is a typical column config with the first column providing row numbers
 var colModel = new Ext.grid.ColumnModel([
    new Ext.grid.RowNumberer(),
    {header: "Name", width: 80, sortable: true},
    {header: "Code", width: 50, sortable: true},
    {header: "Description", width: 200, sortable: true}
 ]);
 </code></pre>
 * @constructor
 * @param {Object} config The configuration options
 */
Ext.define('Ext.grid.RowNumberer', {
    extend: 'Ext.grid.Header',
    /**
     * @cfg {String} text Any valid text or HTML fragment to display in the header cell for the row
     * number column (defaults to '&#160').
     */
    text: "&#160",
    
    /**
     * @cfg {Number} width The default width in pixels of the row number column (defaults to 23).
     */
    width: 23,
    
    /**
     * @cfg {Boolean} sortable True if the row number column is sortable (defaults to false).
     * @hide
     */
    sortable: false,
    
    align: 'right',
    
    constructor : function(config){
        this.callParent(arguments);
        if (this.rowspan) {
            this.renderer = Ext.Function.bind(this.renderer, this);
        }
    },

    // private
    fixed: true,
    hideable: false,
    menuDisabled: true,
    dataIndex: '',
    cls: Ext.baseCSSPrefix + 'row-numberer',
    rowspan: undefined,

    // private
    renderer: function(value, metaData, record, rowIdx, colIdx, store) {
        if (this.rowspan){
            metaData.cellAttr = 'rowspan="'+this.rowspan+'"';
        }
        
        metaData.tdCls = Ext.baseCSSPrefix + 'grid-cell-special';
        
        return store.indexOf(record) + 1;
    }
});
