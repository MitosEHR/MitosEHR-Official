/**
 * @class Ext.chart.LegendItem
 * @extends Ext.draw.SpriteGroup
 * A single item of a legend (marker plus label)
 * @constructor
 */
Ext.define('Ext.chart.LegendItem', {

    /* Begin Definitions */

    extend: 'Ext.draw.SpriteGroup',

    requires: ['Ext.chart.Shapes'],

    /* End Definitions */

    // Position of the item, relative to the upper-left corner of the legend box
    x: 0,
    y: 0,
    zIndex: 500,

    constructor: function(config) {
        this.callParent(arguments);
        this.createSprites(config);
    },

    /**
     * Creates all the individual sprites for this legend item
     */
    createSprites: function(config) {
        var me = this,
            index = config.yFieldIndex,
            series = me.series,
            seriesType = series.type,
            idx = me.yFieldIndex,
            legend = me.legend,
            surface = me.surface,
            refX = legend.x + me.x,
            refY = legend.y + me.y,
            bbox, z = me.zIndex,
            markerCfg, label, mask,
            radius, toggle = false,
            seriesStyle = Ext.apply(series.seriesStyle, series.style);

        function getSeriesProp(name) {
            var val = series[name];
            return (Ext.isArray(val) ? val[idx] : val);
        }
        
        label = me.add('label', surface.add({
            type: 'text',
            x: 20,
            y: 0,
            zIndex: z || 0,
            font: legend.labelFont,
            text: getSeriesProp('title') || getSeriesProp('yField')
        }));

        // Line series - display as short line with optional marker in the middle
        if (seriesType === 'line' || seriesType === 'scatter') {
            if(seriesType === 'line') {
                me.add('line', surface.add({
                    type: 'path',
                    path: 'M0.5,0.5L16.5,0.5',
                    zIndex: z,
                    "stroke-width": series.lineWidth,
                    "stroke-linejoin": "round",
                    "stroke-dasharray": series.dash,
                    stroke: seriesStyle.stroke || '#000',
                    style: {
                        cursor: 'pointer'
                    }
                }));
            }
            if (series.showMarkers || seriesType === 'scatter') {
                markerCfg = Ext.apply(series.markerStyle, series.markerCfg || {});
                me.add('marker', Ext.chart.Shapes[markerCfg.type](surface, {
                    fill: markerCfg.fill,
                    x: 8.5,
                    y: 0.5,
                    zIndex: z,
                    radius: markerCfg.radius || markerCfg.size,
                    style: {
                        cursor: 'pointer'
                    }
                }));
            }
        }
        // All other series types - display as filled box
        else {
            me.add('box', surface.add({
                type: 'rect',
                zIndex: z,
                x: 0,
                y: 0,
                width: 12,
                height: 12,
                fill: series.getLegendColor(index),
                style: {
                    cursor: 'pointer'
                }
            }));
        }
        
        me.setAttributes({
            hidden: false
        }, true);
        
        bbox = me.getBBox();
        
        mask = me.add('mask', surface.add({
            type: 'rect',
            x: bbox.x,
            y: bbox.y,
            width: bbox.width || 20,
            height: bbox.height || 20,
            zIndex: (z || 0) + 1000,
            fill: '#f00',
            opacity: 0,
            style: {
                'cursor': 'pointer'
            }
        }));

        //add toggle listener
        me.on('mouseover', function() {
            label.setStyle({
                'font-weight': 'bold'
            });
            mask.setStyle({
                'cursor': 'pointer'
            });
            series._index = index;
            series.highlightItem();
        }, me);

        me.on('mouseout', function() {
            label.setStyle({
                'font-weight': 'normal'
            });
            series._index = index;
            series.unHighlightItem();
        }, me);
        
        if (!series.visibleInLegend(index)) {
            toggle = true;
            label.setAttributes({
               opacity: 0.5
            }, true);
        }

        me.on('mousedown', function() {
            if (!toggle) {
                series.hideAll();
                label.setAttributes({
                    opacity: 0.5
                }, true);
            } else {
                series.showAll();
                label.setAttributes({
                    opacity: 1
                }, true);
            }
            toggle = !toggle;
        }, me);
        me.updatePosition({x:0, y:0}); //Relative to 0,0 at first so that the bbox is calculated correctly
    },

    /**
     * Update the positions of all this item's sprites to match the root position
     * of the legend box.
     * @param {Object} relativeTo (optional) If specified, this object's 'x' and 'y' values will be used
     *                 as the reference point for the relative positioning. Defaults to the Legend.
     */
    updatePosition: function(relativeTo) {
        var me = this,
            items = me.items,
            ln = items.length,
            i = 0,
            item;
        if (!relativeTo) {
            relativeTo = me.legend;
        }
        for (; i < ln; i++) {
            item = items[i];
            switch (item.type) {
                case 'text':
                    item.setAttributes({
                        x: 20 + relativeTo.x + me.x,
                        y: relativeTo.y + me.y
                    }, true);
                    break;
                case 'rect':
                    item.setAttributes({
                        translate: {
                            x: relativeTo.x + me.x,
                            y: relativeTo.y + me.y - 6
                        }
                    }, true);
                    break;
                default:
                    item.setAttributes({
                        translate: {
                            x: relativeTo.x + me.x,
                            y: relativeTo.y + me.y
                        }
                    }, true);
            }
        }
    }
});