Ext.define('Kiva.view.Main', {
    extend: 'Ext.Container',
    requires: [
        'Kiva.view.LoansList',
        'Kiva.view.LoanFilter'
    ],

    config: {
        fullscreen: true,
        layout: 'fit',
        items: [
            {
                xtype : 'loanfilter',
                docked: 'top'
            },
            {
                xtype: 'loanslist'
            }
        ]
    }
});