/**
 * @author Ed Spencer
 * @class Ext.data.JsonWriter
 * @extends Ext.data.Writer
 * 
 * <p>Writer that outputs model data in JSON format</p>
 */
Ext.define('Ext.data.JsonWriter', {
    extend: 'Ext.data.Writer',
    alias: 'writer.json',
    
    /**
     * @cfg {String} root The key under which the records in this Writer will be placed. Defaults to 'records'.
     * Example generated request:
<pre><code>
{'records': [{name: 'my record'}, {name: 'another record'}]}
</code></pre>
     */
    root: 'records',
    
    /**
     * @cfg {Boolean} encode True to use Ext.encode() on the data before sending. Defaults to <tt>false</tt>.
     */
    encode: false,
    
    //inherit docs
    writeRecords: function(request, data) {
        if (this.encode === true) {
            data = Ext.encode(data);
        }
        
        request.jsonData = request.jsonData || {};
        request.jsonData[this.root] = data;
        
        return request;
    }
});
