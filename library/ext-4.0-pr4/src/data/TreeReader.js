/**
 * @class Ext.data.TreeReader
 * @extends Ext.data.JsonReader
 * @ignore
 */
Ext.define('Ext.data.TreeReader', {
    extend: 'Ext.data.JsonReader',
    alias: 'reader.tree',
    
    extractData : function(root) {
        var records = this.callParent([root]),
            len = records.length,
            i  = 0,
            record;

        if (records) {
            for (; i < len; i++) {
                record = records[i];
                // only attempt to preload if a root is specified
                if (this.root) {
                    record.doPreload = !!this.getRoot(record.raw);
                }
            }
        }
        return records;
    }
});
