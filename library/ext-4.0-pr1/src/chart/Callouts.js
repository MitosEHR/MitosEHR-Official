/**
 * @class Ext.chart.Callouts
 * @ignore
 */
Ext.define('Ext.chart.Callouts', {

    /* Begin Definitions */

    /* End Definitions */

    constructor: function(config) {
        if (config.callouts) {
            this.callouts = Ext.apply(this.callouts || {},
            config.callouts, {
                styles: {
                    color: "#000",
                    font: "11px Helvetica, sans-serif"
                }
            });
            this.calloutsArray = [];
        }
    },

    renderCallouts: function() {
        if (!this.callouts) {
            return;
        }

        var me = this,
            items = me.items,
            animate = me.chart.animate,
            config = me.callouts,
            styles = config.styles,
            group = me.calloutsArray,
            store = me.chart.store,
            len = store.getCount(),
            ratio = items.length / len,
            previouslyPlacedCallouts = [],
            i,
            count,
            j,
            p;

        for (i = 0, count = 0; i < len; i++) {
            for (j = 0; j < ratio; j++) {
                var item = items[count],
                    label = group[count],
                    storeItem = store.getAt(i),
                    display = config.renderer(label, storeItem);
                if (display) {
                    if (!label) {
                        group[count] = label = me.onCreateCallout(storeItem, item, i, display, j, count);
                    }
                    for (p in label) {
                        label[p].setAttributes(styles, true);
                    }
                    me.onPlaceCallout(label, storeItem, item, i, display, animate, j, count, previouslyPlacedCallouts);
                    previouslyPlacedCallouts.push(label);
                    count++;
                }
            }
        }
        this.hideCallouts(count);
    },

    onCreateCallout: function(storeItem, item, i, display) {
        var me = this,
            group = me.calloutsGroup,
            config = me.callouts,
            styles = config.styles,
            surface = me.chart.surface,
            calloutObj = {
                label: false,
                box: false,
                lines: false
            };

        calloutObj.lines = surface.add(Ext.apply({},
        {
            type: 'path',
            path: 'M0,0',
            stroke: '#555'
        },
        styles));

        calloutObj.box = surface.add(Ext.apply({},
        {
            type: 'rect',
            stroke: '#555',
            fill: '#fff'
        },
        styles));

        calloutObj.label = surface.add(Ext.apply({},
        {
            type: 'text',
            text: display
        },
        styles));

        return calloutObj;
    },

    hideCallouts: function(index) {
        var calloutsArray = this.calloutsArray,
            len = calloutsArray.length,
            co,
            p;
        while (len-->index) {
            co = calloutsArray[len];
            for (p in co) {
                co[p].hide(true);
            }
        }
    }
});