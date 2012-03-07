Ext.Loader.setConfig({ enabled: true });
Ext.Loader.setPath('Ext.data.proxy.Kiva', 'lib/KivaProxy.js');
Ext.ClassManager.setAlias('Ext.data.proxy.Kiva', 'proxy.kiva');

Ext.application({
    name: 'Kiva',

    views : ['Main', 'Detail', 'LoanFilter'],
    controllers: ['Loans'],
    models: ['Loan'],
    stores: ['Loans'],

    launch: function() {
        Ext.create('Kiva.view.Main');
    }
});
