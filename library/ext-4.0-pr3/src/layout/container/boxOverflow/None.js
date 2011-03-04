/**
 * @class Ext.layout.container.boxOverflow.None
 * @extends Object
 * @private
 * Base class for Box Layout overflow handlers. These specialized classes are invoked when a Box Layout
 * (either an HBox or a VBox) has child items that are either too wide (for HBox) or too tall (for VBox)
 * for its container.
 */
Ext.define('Ext.layout.container.boxOverflow.None', {

    /* Begin Definitions */

    /* End Definitions */

    constructor: function(layout, config) {
        this.layout = layout;

        Ext.apply(this, config || {});
    },

    handleOverflow: Ext.emptyFn,

    clearOverflow: Ext.emptyFn
});