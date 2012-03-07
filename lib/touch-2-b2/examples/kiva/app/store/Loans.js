Ext.define('Kiva.store.Loans', {
    extend: 'Ext.data.Store',
    requires: ['Kiva.model.Loan'],

    config: {
        model: 'Kiva.model.Loan',
        autoLoad: true,
        remoteFilter: true
    }
});
