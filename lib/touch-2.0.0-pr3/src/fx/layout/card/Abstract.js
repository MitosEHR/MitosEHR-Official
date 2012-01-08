/**
 * @private
 */
Ext.define('Ext.fx.layout.card.Abstract', {
    isAnimation: true,

    config: {
        layout: null
    },

    updateLayout: function() {
        this.enable();
    },

    enable: function() {
        var layout = this.getLayout();

        if (layout) {
            layout.on(layout.eventNames.activeItemChange, 'onActiveItemChange', this);
        }
    },

    disable: function() {
        var layout = this.getLayout();

        if (layout) {
            layout.un(layout.eventNames.activeItemChange, 'onActiveItemChange', this);
        }
    },

    onActiveItemChange: Ext.emptyFn,

    destroy: function() {
        var layout = this.getLayout();

        if (layout) {
            this._layout = null;
            layout.un(layout.eventNames.activeItemChange, 'onActiveItemChange', this);
        }
    }
});
