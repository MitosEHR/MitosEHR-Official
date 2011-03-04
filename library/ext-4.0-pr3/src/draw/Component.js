/**
 * @class Ext.draw.Component
 * @extends Ext.component
 */
Ext.define('Ext.draw.Component', {

    /* Begin Definitions */

    alias: 'widget.draw',

    extend: 'Ext.Component',

    requires: [
        'Ext.draw.Surface',
        'Ext.layout.component.Draw'
    ],

    /* End Definitions */

    /**
     * @cfg {Array} implOrder
     * Defines the priority order for which Surface implementation to use. The first
     * one supported by the current environment will be used.
     */
    implOrder: ['SVG', 'Canvas', 'VML'],

    baseCls: Ext.baseCSSPrefix + 'surface',

    componentLayout: 'draw',

    /**
     * @cfg {Boolean} viewBox
     * Turn on view box support which will scale and position items in the draw component to fit to the component while
     * maintaining aspect ratio. Defaults to true.
     */
    viewBox: true,

    /**
     * @cfg {Boolean} autoSize
     * Turn on autoSize support which will set the bounding div's size to the natural size of the contents. Defaults to false.
     */
    autoSize: false,

    initComponent: function() {
        this.callParent(arguments);

        this.addEvents(
            'mousedown',
            'mouseup',
            'mousemove',
            'mouseenter',
            'mouseleave',
            'click'
        );
    },

    /**
     * Create the Surface on initial render
     */
    onRender: function() {
        var me = this,
            viewBox = me.viewBox,
            autoSize = me.autoSize,
            bbox, items, width, height, x, y;
        this.callParent(arguments);

        me.createSurface();

        items = me.surface.items;

        if (viewBox || autoSize) {
            bbox = items.getBBox();
            width = bbox.width;
            height = bbox.height;
            x = bbox.x;
            y = bbox.y;
            if (me.viewBox) {
                me.surface.setViewBox(x, y, width, height);
            }
            else {
                items.setAttributes({
                    translate: {
                        x: -x,
                        y: -y
                    }
                }, true);
                me.surface.setSize(width, height);
                me.el.setSize(width, height);
            }
        }
    },

    /**
     * Create the Surface instance. Resolves the correct Surface implementation to
     * instantiate based on the 'implOrder' config.
     */
    createSurface: function() {
        var surface = Ext.draw.Surface.newInstance(Ext.apply({}, {
                width: this.width,
                height: this.height,
                renderTo: this.el
            }, this.initialConfig));
        this.surface = surface;

        function refire(eventName) {
            return function(e) {
                this.fireEvent(eventName, e);
            };
        }

        surface.on({
            scope: this,
            mouseup: refire('mouseup'),
            mousedown: refire('mousedown'),
            mousemove: refire('mousemove'),
            mouseenter: refire('mouseenter'),
            mouseleave: refire('mouseleave'),
            click: refire('click')
        });
    },


    /**
     * Clean up the Surface instance on component destruction
     */
    onDestroy: function() {
        var surface = this.surface;
        if (surface) {
            surface.destroy();
        }
        this.callParent(arguments);
    }

});
