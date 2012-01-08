/**
 * @class kiva.views.List
 * @extends Ext.List
 *
 * This simple Ext.List subclass is used to display the Loans that are returned from Kiva's API. The largest
 * part of this class is the XTemplate used to render each item - all other functionality is already provided
 * by Ext.List
 */
Ext.define('Kiva.view.LoansList', {
    extend: 'Ext.dataview.ComponentView',
    xtype : 'loanslist',
    requires: [
        'Kiva.view.LoansListItem'
    ],

    config: {
        ui   : 'loans',
        store: 'Loans',
        defaultType: 'loanslistitem',
        deselectOnContainerClick: false
    },

    /**
     * Used so the "sorry something went wrong" message doesn't appear on first load
     * @private
     */
    refreshed: false,

    doRefresh: function(me) {
        me.callParent(arguments);

        var store = me.getStore();
        if (this.refreshed && store.getCount() === 0) {
            me.setMask({
                message: 'Sorry, something went wrong!'
            });
        }
        
        this.refreshed = true;
    }
});
