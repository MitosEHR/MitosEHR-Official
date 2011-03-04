/**
 * @class Ext.direct.Transaction
 * @extends Object
 * <p>Supporting Class for Ext.direct.Direct (not intended to be used directly).</p>
 * @constructor
 * @param {Object} config
 */
Ext.define('Ext.direct.Transaction', {
    constructor: function(config){
        Ext.apply(this, config);
        this.tid = ++Ext.direct.Direct.TID;
        this.retryCount = 0;
    },
    send: function(){
        this.provider.queueTransaction(this);
    },

    retry: function(){
        this.retryCount++;
        this.send();
    },

    getProvider: function(){
        return this.provider;
    }
});
