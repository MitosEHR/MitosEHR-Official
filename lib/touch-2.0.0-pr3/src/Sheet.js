/**
 * A general sheet class. This renderable container provides base support for orientation-aware transitions for popup or
 * side-anchored sliding Panels. In most cases, you should use {@link Ext.ActionSheet}, {@link Ext.MessageBox}, {@link Ext.picker.Picker} or {@link Ext.picker.Date}.
 *
 * ## Example
 *
 *     @example preview
 *     var sheet = Ext.create('Ext.Sheet', {
 *         items: [
 *             {
 *                 dock : 'bottom',
 *                 xtype: 'button',
 *                 text : 'Click me'
 *             }
 *         ]
 *     });
 *     sheet.show();
 */
Ext.define('Ext.Sheet', {
    extend: 'Ext.Container',
    alias : 'widget.sheet',

    config: {
        // @inherited
        baseCls: Ext.baseCSSPrefix + 'sheet',

        /**
         * @cfg {Boolean} hidden
         * True to hide this component
         * @accessor
         */
        hidden: true,

        /**
         * @cfg {Boolean} modal True to make this Component modal. This will create a mask underneath the Component
         * that covers the whole page and does not allow the user to interact with any other Components until this
         * Component is dismissed
         * @accessor
         */
        modal: true,

        /**
         * @cfg {Boolean} centered
         * Whether or not this component is absolutely centered inside its container
         * @accessor
         * @evented
         */
        centered: true,

        /**
         * @cfg {Boolean} hideOnMaskTap When using a {@link #modal} Component, setting this to true (the default) will
         * hide the modal mask and the Component when the mask is tapped on
         * @accessor
         */
        hideOnMaskTap: false,

        /**
         * @cfg {Boolean} stretchX True to stretch this sheet horizontally.
         */
        stretchX: null,

        /**
         * @cfg {Boolean} stretchY True to stretch this sheet vertically.
         */
        stretchY: null,

        /**
         * @cfg {String} enter
         * The viewport side used as the enter point when shown (top, bottom, left, right)
         * Applies to sliding animation effects only. Defaults to 'bottom'
         */
        enter: 'bottom',

        /**
         * @cfg {String} exit
         * The viewport side used as the exit point when hidden (top, bottom, left, right)
         * Applies to sliding animation effects only. Defaults to 'bottom'
         */
        exit: 'bottom',

        /**
         * @cfg {String/Object} enterAnimation
         * the named Ext.anim effect or animation configuration object used for transitions
         * when the component is shown. Defaults to 'slide'
         */
        enterAnimation: 'slide',

        /**
         * @cfg {String/Object} exitAnimation
         * the named Ext.anim effect or animation configuration object used for transitions
         * when the component is hidden. Defaults to 'slide'
         */
        exitAnimation: 'slide'
    },

    updateStretchX: function(newStretchX) {
        var initialConfig = this.getInitialConfig();
        
        if (newStretchX) {
            this.setLeft(0);
            this.setRight(0);
        } else {
            this.setLeft(initialConfig.left || 'auto');
            this.setRight(initialConfig.right || 'auto');
        }
    },

    updateStretchY: function(newStretchY) {
        var initialConfig = this.getInitialConfig();

        if (newStretchY) {
            this.setTop(0);
            this.setBottom(0);
        } else {
            this.setTop(initialConfig.top || 'auto');
            this.setBottom(initialConfig.bottom || 'auto');
        }
    },

    onHiddenChange: function(hidden) {
        if (!hidden) {
            Ext.Viewport.hideKeyboard();
        }

        this.callParent(arguments);
    }
});
