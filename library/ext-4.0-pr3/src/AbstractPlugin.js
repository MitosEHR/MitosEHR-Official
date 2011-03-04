/**
 * @class Ext.AbstractPlugin
 * @extends Object
 *
 * Plugins are injected 
 */
Ext.define('Ext.AbstractPlugin', {
    disabled: false,
    
    constructor: function(config) {
        if (!config.cmp) {
            console.warn("Attempted to attach a plugin ");
        }
        Ext.apply(this, config);
    },
    
    getCmp: function() {
        return this.cmp;
    },

    /**
     * The init method is invoked after initComponent has been run for the
     * component which we are injecting the plugin into.
     */
    init: Ext.emptyFn,

    /**
     * Enable the plugin and set the disabled flag to false.
     */
    enable: function() {
        this.disabled = false;
    },

    /**
     * Disable the plugin and set the disabled flag to true.
     */
    disable: function() {
        this.disabled = true;
    }
});
