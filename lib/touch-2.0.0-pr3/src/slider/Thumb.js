/**
 * @ignore
 * Utility class used by Ext.slider.Slider - should never need to be used directly.
 */
Ext.define('Ext.slider.Thumb', {
    extend: 'Ext.Component',
    xtype : 'thumb',

    config: {
        // @inherit
        baseCls: Ext.baseCSSPrefix + 'thumb',

        // @inherit
        draggable: {
            direction: 'horizontal'
        }
    },

    elementWidth: 0,

    initialize: function() {
        this.callParent();

        this.getDraggable().on({
            dragstart: 'onDragStart',
            drag: 'onDrag',
            dragend: 'onDragEnd',
            scope: this
        });

        this.on('painted', 'onPainted');
    },

    onDragStart: function(draggable, e, offset, options, controller) {
        // @TODO Temporary only, better API to replace this later
        this.doFireEvent('dragstart', [this, e, offset], null, controller);
    },

    onDrag: function(draggable, e, offset, options, controller) {
        // @TODO Temporary only, better API to replace this later
        this.doFireEvent('drag', [this, e, offset], null, controller);
    },

    onDragEnd: function(draggable, e, options, controller) {
        // @TODO Temporary only, better API to replace this later
        this.doFireEvent('dragend', [this, e], null, controller);
    },

    onPainted: function() {
        this.elementWidth = this.element.dom.offsetWidth;
    },

    getElementWidth: function() {
        return this.elementWidth;
    }
});
