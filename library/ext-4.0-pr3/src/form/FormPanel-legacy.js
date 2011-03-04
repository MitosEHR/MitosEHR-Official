/**
 * @ignore
 */
Ext.override(Ext.form.FormPanel, {

    /**
     * @cfg {Boolean} monitorValid If <tt>true</tt>, the form monitors its valid state <b>client-side</b> and
     * regularly fires the {@link #clientvalidation} event passing that state.<br>
     * <p>When monitoring valid state, the FormPanel enables/disables any of its configured
     * {@link #buttons} which have been configured with <code>formBind: true</code> depending
     * on whether the {@link Ext.form.Basic#isValid form is valid} or not. Defaults to <tt>false</tt></p>
     * @deprecated Use the {@link Ext.form.Field#validateOnChange} and {@link Ext.form.FormPanel#pollForChanges} options instead.
     */
    monitorValid: false,

    /**
     * @cfg {Number} monitorPoll The milliseconds to poll valid state, ignored if monitorValid is not true (defaults to 200)
     * @deprecated Use the {@link Ext.form.Field#validateOnChange} and {@link Ext.form.FormPanel#pollInterval} options instead.
     */
    monitorPoll: 200,

    /**
     * Starts monitoring of the valid state of this form. Usually this is done by passing the config
     * option "monitorValid"
     * @deprecated Use {@link Ext.form.FormPanel#startPolling} instead.
     */
    startMonitoring: function() {
        //<debug>
        console.log('Ext.form.FormPanel.startMonitoring is deprecated. Use the startPolling method instead.');
        //</debug>

        this.startPolling(this.monitorPoll);
    },

    /**
     * Stops monitoring of the valid state of this form
     * @deprecated Use {@link Ext.form.FormPanel#stopPolling} instead.
     */
    stopMonitoring: function() {
        //<debug>
        console.log('Ext.form.FormPanel.stopMonitoring is deprecated. Use the stopPolling method instead.');
        //</debug>

        this.stopPolling();
    }

});