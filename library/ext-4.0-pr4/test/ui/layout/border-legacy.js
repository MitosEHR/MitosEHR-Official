Ext.override(Ext.container.Container, {
    initComponent: Ext.createInterceptor(Ext.container.Container.prototype.initComponent, function() {
        if ((Ext.isObject(this.layout) && this.layout.type) === 'border' || this.layout === 'border') {
            //console.log('Using deprecated border layout class. Attempting backwards compat layer.');

            this.layout = Ext.applyIf({
                type: 'vbox',
                align: 'stretch',
                targetCls: 'x-box-layout-ct x-border-layout-ct'
            }, this.layout);
            var origItems = this.items,
                ln = origItems.length,
                comp,
                i = 0,
                items,
                region,
                possibleRegions = {};

            // build map
            for (; i < ln; i++) {
                comp = origItems[i];
                possibleRegions[origItems[i].region] = comp = this.createComponent(comp);

                // Inject our own collapse function into collapsible region
                if (comp.collapsible) {
                    comp.on({
                        beforecollapse: this.onBeforeRegionCollapse,
                        scope: this
                    });
                }
            }

            if (!possibleRegions.center) {
                throw "No center region defined in BorderLayout.";
            }

            // center regions are required.
            possibleRegions.center.flex = 1;
            possibleRegions.center.maintainFlex = true;
            var center = {
                xtype: 'container',
                flex: 1,
                maintainFlex: true,
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items: [
                    possibleRegions.center
                ]
            };
            if (possibleRegions.west) {
                possibleRegions.west.collapseDirection = Ext.Component.DIRECTION_LEFT;
                if (possibleRegions.west.split) {
                    center.items.unshift({
                        collapseTarget: 'prev',
                        xtype: 'splitter'
                    });
                }
                center.items.unshift(possibleRegions.west);
            }
            if (possibleRegions.east) {
                possibleRegions.east.collapseDirection = Ext.Component.DIRECTION_RIGHT;
                if (possibleRegions.east.split) {
                    center.items.push({
                        xtype: 'splitter'
                    });
                }
                center.items.push(possibleRegions.east);
            }

            this.items = [
                center
            ];
            if (possibleRegions.north) {
                possibleRegions.north.collapseDirection = Ext.Component.DIRECTION_UP;
                if (possibleRegions.north.split) {
                    this.items.unshift({
                        xtype: 'splitter',
                        collapseTarget: 'prev'
                    });
                }
                this.items.unshift(possibleRegions.north);
            }
            if (possibleRegions.south) {
                possibleRegions.south.collapseDirection = Ext.Component.DIRECTION_DOWN;
                if (possibleRegions.south.split) {
                    this.items.push({
                        xtype: 'splitter'
                    });
                }
                this.items.push(possibleRegions.south);
            }
        }
    }),

    // Collapsing a region hides its associated splitter
    onBeforeRegionCollapse: function(comp, direction, animate, newSize) {
        var s,
            marginSide,
            sl = comp.ownerCt.suspendLayout;

//      Do not trigger a layout before the collapse begins
        comp.ownerCt.suspendLayout = true;
        if (direction == Ext.Component.DIRECTION_LEFT) {
            s = comp.next();
            marginSide = 'right';
        } else if (direction == Ext.Component.DIRECTION_UP) {
            s = comp.next();
            marginSide = 'bottom';
        } else if (direction == Ext.Component.DIRECTION_RIGHT) {
            s = comp.prev();
            marginSide = 'left';
        } else if (direction == Ext.Component.DIRECTION_DOWN) {
            s = comp.prev();
            marginSide = 'top';
        }

        // If collapsing to nothing, the side from which we collapsed must have no margin
        if (newSize == 0) {
            comp.margins[marginSide] = 0;
        } else {
            if (s.isXType('splitter')) {
                s.hide();
            }
            comp.margins[marginSide] = newSize ? s.width : 0;
        }
        comp.ownerCt.suspendLayout = sl;
    },

    // Collapsing a region hides its associated splitter
    onRegionCollapse: function(comp) {
        var s, marginSide;

        if (comp.region == 'west')  {
            s = comp.next();
            marginSide = 'right';
        } else if (comp.region == 'north') {
            s = comp.next();
            marginSide = 'bottom';
        } else if (comp.region == 'east') {
            s = comp.prev();
            marginSide = 'left';
        } else if (comp.region == 'south') {
            s = comp.prev();
            marginSide = 'top';
        }
        if (s.isXType('splitter')) {
            s.hide();
            comp.margins[marginSide] = s.width;
        }
    }
});

Ext.onReady(function() {
    new Ext.Viewport({
        layout: {
            type: 'border',
            padding: 5
        },
        defaults: {
            split: true
        },
        items: [{
            iconCls: 'north-icon',
            region: 'north',
            collapsible: true,
            title: 'North',
            split: true,
            height: 100,
            html: 'north'
        },{
            region: 'west',
            title: 'West',
            collapsible: true,
            split: true,
            width: 100,
            html: 'west'
        },{
            region: 'center',
            title: 'Center',
            layout: 'border',
            border: false,
            items: [{
                region: 'center',
                html: 'center center',
                margins: '5 0 0 0'
            },{
                region: 'south',
                height: 100,
                title: 'No Splitter',
                margins: '5 0 0 0',
                html: 'center south'
            }]
        },{
            region: 'east',
            collapsible: true,
            split: true,
            width: 100,
            title: 'East',
            html: 'east'
        },{
            region: 'south',
            collapsible: true,
            split: true,
            height: 200,
            title: 'South',
            html: 'testing'
        }]
    })
});