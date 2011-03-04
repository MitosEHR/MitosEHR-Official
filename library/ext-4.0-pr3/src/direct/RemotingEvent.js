Ext.define('Ext.direct.RemotingEvent', {
    extend: 'Ext.direct.Event',
    alternateClassName: 'Ext.Direct.RemotingEvent',
    alias: 'directevent.rpc',
    type: 'rpc',
    getTransaction: function(){
        return this.transaction || Ext.direct.Direct.getTransaction(this.tid);
    }
});
