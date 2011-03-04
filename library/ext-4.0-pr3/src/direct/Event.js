Ext.define('Ext.direct.Event', {
    alias: 'direct.event',
    constructor: function(config){
        Ext.apply(this, config);
    },
    status: true,
    getData: function(){
        return this.data;
    }
});