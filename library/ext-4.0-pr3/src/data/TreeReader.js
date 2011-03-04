/**
 * @class Ext.data.TreeReader
 * @extends Ext.data.JsonReader
 * @ignore
 */
Ext.define('Ext.data.TreeReader', {
    extend: 'Ext.data.JsonReader',
    alias: 'reader.tree',
    
    extractData : function(root, returnRecords) {
        var records = Ext.data.TreeReader.superclass.extractData.call(this, root, returnRecords),
            ln = records.length,
            i  = 0,
            record;

        if (returnRecords) {
            for (; i < ln; i++) {
                record = records[i];
                record.doPreload = !!this.getRoot(record.raw);
            }
        }
        return records;
    }
});
