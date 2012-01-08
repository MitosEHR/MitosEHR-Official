/**
 * A simple class used to mask any {@link Ext.Container}.
 * This should rarely be used directly, instead look at the {@link Ext.Container#cfg-mask} configuration.
 */
Ext.define('Ext.Mask', {
    extend: 'Ext.Component',
    xtype: 'mask',

    config: {
        // @inherit
        baseCls: Ext.baseCSSPrefix + 'mask',

        /**
         * @cfg {Boolean} transparent True to make this mask transparent.
         */
        transparent: false,

        /**
         * @hide
         */
        hidden: true,

        /**
         * @hide
         */
        top: 0,

        /**
         * @hide
         */
        left: 0,

        /**
         * @hide
         */
        right: 0,

        /**
         * @hide
         */
        bottom: 0
    },

    /**
     * @event tap
     * A tap event fired when a user taps on this mask
     * @param {Ext.Mask} this The mask instance
     * @param {Ext.EventObject} e The event object
     */

    initialize: function() {
        var me = this;

        me.callParent();

        me.element.on({
            tap: 'onTap',
            scope: me
        });
    },

    onTap: function(e) {
        this.fireEvent('tap', this, e);
    },

    updateTransparent: function(newTransparent) {
        this[newTransparent ? 'addCls' : 'removeCls'](this.getBaseCls() + '-transparent');
    }
});
