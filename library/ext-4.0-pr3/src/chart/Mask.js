/**
 * @class Ext.chart.Mask
 *
 * Defines a mask for a chart's series.
 * The 'chart' member must be set prior to rendering.
 *
 * @constructor
 */

Ext.define('Ext.chart.Mask', {
    constructor: function(config) {
        var me = this;

        me.addEvents('select');

        if (config) {
            Ext.apply(me, config);
        }
        if (me.mask) {
            me.on('afterrender', function() {
                me.maskSprite = me.surface.add({
                    type: 'path',
                    path: ['M', 0, 0],
                    zIndex: 1001,
                    opacity: 0.7,
                    hidden: true,
                    stroke: '#444'
                });
            }, me, { single: true });
        }
    },

    onMouseUp: function(e) {
        var me = this,
            bbox = me.bbox || me.chartBBox,
            sel = me.maskSelection;
        me.maskMouseDown = false;
        me.onMouseMove(e);
        me.fireEvent('select', me, {
            x: sel.x - bbox.x,
            y: sel.y - bbox.y,
            width: sel.width,
            height: sel.height
        });
    },

    onMouseDown: function(e) {
        var me = this;
        me.maskMouseDown = {
            x: e.getPageX() - me.el.getX(),
            y: e.getPageY() - me.el.getY()
        };
        me.onMouseMove(e);
    },

    onMouseMove: function(e) {
        var me = this,
            mask = me.mask,
            bbox = me.bbox || me.chartBBox,
            x = bbox.x,
            y = bbox.y,
            math = Math,
            floor = math.floor,
            abs = math.abs,
            min = math.min,
            max = math.max,
            height = floor(y + bbox.height),
            width = floor(x + bbox.width),
            staticX = e.getPageX() - me.el.getX(),
            staticY = e.getPageY() - me.el.getY(),
            maskMouseDown = me.maskMouseDown,
            path;
        staticX = max(staticX, x);
        staticY = max(staticY, y);
        staticX = min(staticX, width);
        staticY = min(staticY, height);
        if (maskMouseDown) {
            if (mask == 'horizontal') {
                staticY = y;
                maskMouseDown.y = height;
            }
            else if (mask == 'vertical') {
                staticX = x;
                maskMouseDown.x = width;
            }
            width = maskMouseDown.x - staticX;
            height = maskMouseDown.y - staticY;
            path = ['M', staticX, staticY, 'l', width, 0, 0, height, -width, 0, 'z'];
            me.maskSelection = {
                x: width > 0 ? staticX : staticX + width,
                y: height > 0 ? staticY : staticY + height,
                width: abs(width),
                height: abs(height)
            };
        }
        else {
            if (mask == 'horizontal') {
                path = ['M', staticX, y, 'L', staticX, height];
            }
            else if (mask == 'vertical') {
                path = ['M', x, staticY, 'L', width, staticY];
            }
            else {
                path = ['M', staticX, y, 'L', staticX, height, 'M', x, staticY, 'L', width, staticY];
            }
        }
        me.maskSprite.setAttributes({
            path: path,
            fill: me.maskMouseDown ? me.maskSprite.stroke : false,
            'stroke-width': mask === true ? 1 : 3,
            hidden: false
        }, true);
    },

    onMouseLeave: function(e) {
        this.maskMouseDown = false;
        this.maskSprite.hide(true);
    }
});
    