/**
 * @class Ext.chart.axis.Gauge
 * @extends Ext.chart.axis.Abstract
 * @ignore
 */
Ext.define('Ext.chart.axis.Gauge', {

    /* Begin Definitions */

    extend: 'Ext.chart.axis.Abstract',

    /* End Definitions */

    position: 'gauge',

    drawAxis: function(init) {
        var chart = this.chart,
            surface = chart.surface,
            bbox = chart.chartBBox,
            centerX = bbox.x + (bbox.width / 2),
            centerY = bbox.y + bbox.height,
            margin = this.margin || 10,
            rho = bbox.width /2 + margin,
            sprites = [], sprite,
            steps = this.steps,
            i, pi = Math.PI,
            cos = Math.cos,
            sin = Math.sin;

        if (this.sprites && !chart.resizing) {
            this.drawLabels();
            return;
        }

        if (this.margin >= 0) {
            if (!this.sprites) {
                //draw circles
                for (i = 0; i <= steps; i++) {
                    sprite = surface.add({
                        type: 'path',
                        path: ['M', centerX + (rho - margin) * cos(i / steps * pi - pi),
                                    centerY + (rho - margin) * sin(i / steps * pi - pi),
                                    'L', centerX + rho * cos(i / steps * pi - pi),
                                    centerY + rho * sin(i / steps * pi - pi), 'Z'],
                        stroke: '#ccc'
                    });
                    sprite.setAttributes({
                        hidden: false
                    }, true);
                    sprites.push(sprite);
                }
            } else {
                sprites = this.sprites;
                //draw circles
                for (i = 0; i <= steps; i++) {
                    sprites[i].setAttributes({
                        path: ['M', centerX + (rho - margin) * cos(i / steps * pi - pi),
                                    centerY + (rho - margin) * sin(i / steps * pi - pi),
                               'L', centerX + rho * cos(i / steps * pi - pi),
                                    centerY + rho * sin(i / steps * pi - pi), 'Z'],
                        stroke: '#ccc'
                    }, true);
                }
            }
        }
        this.sprites = sprites;
        this.drawLabels();
        if (this.title) {
            this.drawTitle();
        }
    },
    
    drawTitle: function() {
        var me = this,
            chart = me.chart,
            surface = chart.surface,
            bbox = chart.chartBBox,
            centerX = bbox.x + (bbox.width / 2),
            centerY = bbox.y + bbox.height,
            labelSprite = me.titleSprite;
        
        if (!labelSprite) {
            me.titleSprite = labelSprite = surface.add({
                type: 'text',
                text: me.title
            });    
        }
        labelSprite.setAttributes(Ext.apply({
            text: me.title
        }, me.label || {}), true);
    },

    drawLabels: function() {
        var chart = this.chart,
            surface = chart.surface,
            bbox = chart.chartBBox,
            store = chart.store,
            centerX = bbox.x + (bbox.width / 2),
            centerY = bbox.y + bbox.height,
            margin = this.margin || 10,
            rho = bbox.width /2 + 2 * margin,
            max = Math.max, round = Math.round,
            labelArray = [], label, categories = [],
            maxValue = this.maximum || 0,
            steps = this.steps, i = 0, j, dx, dy,
            pi = Math.PI,
            cos = Math.cos,
            sin = Math.sin,
            labelConf = this.label,
            display = labelConf.display,
            renderer = labelConf.renderer || function(v) { return v; };

        if (!this.labelArray) {
            //draw scale
            for (i = 0; i <= steps; i++) {
                // TODO Adjust for height of text / 2 instead
                adjY = (i == 0 || i == steps) ? 7 : 0;
                label = surface.add({
                    type: 'text',
                    text: renderer(round(i / steps * maxValue)),
                    x: centerX + rho * cos(i / steps * pi - pi),
                    y: centerY + rho * sin(i / steps * pi - pi) - adjY,
                    'text-anchor': 'middle',
                    stroke: false,
                    'stroke-width': 0.2,
                    zIndex: 10,
                    stroke: '#333'
                });
                label.setAttributes({
                    hidden: false
                }, true);
                labelArray.push(label);
            }
        }
        else {
            labelArray = this.labelArray;
            //draw values
            for (i = 0; i <= steps; i++) {
                // TODO Adjust for height of text / 2 instead
                adjY = (i == 0 || i == steps) ? 7 : 0;
                labelArray[i].setAttributes({
                    text: renderer(round(i / steps * maxValue)),
                    x: centerX + rho * cos(i / steps * pi - pi),
                    y: centerY + rho * sin(i / steps * pi - pi) - adjY
                }, true);
            }
        }
        this.labelArray = labelArray;
    }
});