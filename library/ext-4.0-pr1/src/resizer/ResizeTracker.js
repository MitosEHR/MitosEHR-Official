Ext.define('Ext.resizer.ResizeTracker', {
    extend: 'Ext.dd.DragTracker',
    dynamic: true,
    preserveRatio: false,

    // Default to no constraint
    constrainTo: null,

    constructor: function(config) {
        if (!config.el) {
            if (config.target.isComponent) {
                this.el = config.target.getEl();
            } else {
                this.el = config.target;
            }
        }
        Ext.resizer.ResizeTracker.superclass.constructor.apply(this, arguments);

        // If configured as throttled, create an instance version of resize which calls
        // a throttled function to perform the resize operation.
        if (this.throttle) {
            var me = this,
                throttledResizeFn = Ext.Function.createThrottled(function() {
                    Ext.resizer.ResizeTracker.prototype.resize.apply(me, arguments);
                }, this.throttle);

            this.resize = function(box, direction, atEnd) {
                if (atEnd) {
                    Ext.resizer.ResizeTracker.prototype.resize.apply(this, arguments);
                } else {
                    throttledResizeFn.apply(null, arguments);
                }
            };
        }
    },

    onBeforeStart: function(e) {
        // record the startBox
        this.startBox = this.el.getBox();
    },

    /**
     * @private
     * Returns the object that will be resized on every mousemove event.
     * If dynamic is false, this will be a proxy, otherwise it will be our actual target.
     */
    getDynamicTarget: function() {
        var d = this.target;
        if (this.dynamic) {
            return d;
        } else if (!this.proxy) {
            this.proxy = d.isComponent ? d.getProxy().addCls(Ext.baseCSSPrefix + 'resizable-proxy') : d.createProxy({tag: 'div', cls: Ext.baseCSSPrefix + 'resizable-proxy', id: d.id + '-rzproxy'}, Ext.getBody());
            this.proxy.removeCls(Ext.baseCSSPrefix + 'proxy-el');
        }
        this.proxy.show();
        return this.proxy;
    },

    onStart: function(e) {
        // returns the Ext.ResizeHandle that the user started dragging
        this.activeResizeHandle = Ext.getCmp(this.getDragTarget().id);

        // If we are using a proxy, ensure it is sized.
        if (!this.dynamic) {
            this.resize(this.startBox, {
                horizontal: 'none',
                vertical: 'none'
            });
        }
    },

    onDrag: function(e) {
        // dynamic resizing, update dimensions during resize
        if (this.dynamic || this.proxy) {
            this.updateDimensions(e);
        }
    },

    updateDimensions: function(e, atEnd) {
        var region = this.activeResizeHandle.region,
            offset = this.getOffset(this.constrainTo ? 'dragTarget' : null),
            box = this.startBox,
            widthAdjust = 0,
            heightAdjust = 0,
            adjustX = 0,
            adjustY = 0,
            horizDir = offset[0] < 0 ? 'right' : 'left',
            vertDir = offset[1] < 0 ? 'down' : 'up';

        switch (region) {
            case 'south':
                heightAdjust = offset[1];
                break;
            case 'north':
                heightAdjust = -offset[1];
                adjustY = -heightAdjust;
                break;
            case 'east':
                widthAdjust = offset[0];
                break;
            case 'west':
                widthAdjust = -offset[0];
                adjustX = -widthAdjust;
                break;
            case 'northeast':
                heightAdjust = -offset[1];
                adjustY = -heightAdjust;
                widthAdjust = offset[0];
                break;
            case 'southeast':
                heightAdjust = offset[1];
                widthAdjust = offset[0];
                break;
            case 'southwest':
                widthAdjust = -offset[0];
                adjustX = -widthAdjust;
                heightAdjust = offset[1];
                break;
            case 'northwest':
                heightAdjust = -offset[1];
                adjustY = -heightAdjust;
                widthAdjust = -offset[0];
                adjustX = -widthAdjust;
                break;
        }

        var newBox = {
            width: box.width + widthAdjust,
            height: box.height + heightAdjust,
            x: box.x + adjustX,
            y: box.y + adjustY
        };

        // out of bounds
        if (newBox.width < this.minWidth || newBox.width > this.maxWidth) {
            newBox.width = Ext.Number.constrain(newBox.width, this.minWidth, this.maxWidth);
            newBox.x = this.lastX || newBox.x;
        } else {
            this.lastX = newBox.x;
        }
        if (newBox.height < this.minHeight || newBox.height > this.maxHeight) {
            newBox.height = Ext.Number.constrain(newBox.height, this.minHeight, this.maxHeight);
            newBox.y = this.lastY || newBox.y;
        } else {
            this.lastY = newBox.y;
        }

        // If this is configured to preserve the aspect ratio, or they are dragging using the shift key
        if (this.preserveRatio || e.shiftKey) {
            var ratio = box.width / box.height;
            if (heightAdjust) {
                newBox.width = (newBox.height) * ratio;
                newBox.width = Ext.Number.constrain(newBox.width, this.minWidth, this.maxWidth);
            } else {
                newBox.height =  (newBox.width) * (1/ratio);
                newBox.height = Ext.Number.constrain(newBox.height, this.minHeight, this.maxHeight);
            }
        }

        if (heightAdjust === 0) {
            vertDir = 'none';
        }
        if (widthAdjust === 0) {
            horizDir = 'none';
        }
        this.resize(newBox, {
            horizontal: horizDir,
            vertical: vertDir
        }, atEnd);
    },

    getResizeTarget: function(atEnd) {
        return atEnd ? this.target : this.getDynamicTarget();
    },

    resize: function(box, direction, atEnd) {
        var target = this.getResizeTarget(atEnd);
        if (target.isComponent) {
            if (target.floating) {
                target.setPagePosition(box.x, box.y);
            }
            target.setSize(box.width, box.height);
        } else {
            target.setBox(box);
            // update the originalTarget if this was wrapped.
            if (this.originalTarget) {
                this.originalTarget.setBox(box);
            }
        }
    },

    onEnd: function(e) {
        this.updateDimensions(e, true);
        if (this.proxy) {
            this.proxy.hide();
        }
    }
});