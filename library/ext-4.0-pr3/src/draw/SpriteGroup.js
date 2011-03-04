/*
 * @class Ext.draw.SpriteGroup
 * @extends Ext.util.MixedCollection
 */
Ext.define('Ext.draw.SpriteGroup', {

    /* Begin Definitions */

    extend: 'Ext.util.MixedCollection',
    mixins: {
        animate: 'Ext.util.Animate'
    },

    /* End Definitions */
    isSpriteGroup: true,
    constructor: function(config) {
        config = config || {};
        Ext.apply(this, config);

        this.addEvents(
            'mousedown',
            'mouseup',
            'mouseover',
            'mouseout',
            'click'
        );
        this.id = Ext.id(null, 'ext-sprite-group-');
        Ext.draw.SpriteGroup.superclass.constructor.call(this);
    },

    // private
    onClick: function(e) {
        this.fireEvent('click', e);
    },

    // private
    onMouseUp: function(e) {
        this.fireEvent('mouseup', e);
    },

    // private
    onMouseDown: function(e) {
        this.fireEvent('mousedown', e);
    },

    // private
    onMouseOver: function(e) {
        this.fireEvent('mouseover', e);
    },

    // private
    onMouseOut: function(e) {
        this.fireEvent('mouseout', e);
    },

    attachEvents: function(o) {
        o.on({
            scope: this,
            mousedown: this.onMouseDown,
            mouseup: this.onMouseUp,
            mouseover: this.onMouseOver,
            mouseout: this.onMouseOut,
            click: this.onClick
        });
    },

    add: function(key, o) {
        var ans = Ext.draw.SpriteGroup.superclass.add.apply(this, Array.prototype.slice.call(arguments));
        this.attachEvents(ans);
        return ans;
    },

    insert: function(index, key, o) {
        return Ext.draw.SpriteGroup.superclass.insert.apply(this, Array.prototype.slice.call(arguments));
    },

    remove: function(o) {
        // clean this up for 4.x un syntax
        // o.un('mousedown', this.onMouseUp);
        // o.un('mouseup', this.onMouseDown);
        // o.un('mouseover', this.onMouseOver);
        // o.un('mouseout', this.onMouseOut);
        // o.un('click', this.onClick);
        Ext.draw.SpriteGroup.superclass.remove.apply(this, arguments);
    },
    // Returns the group bounding box.
    getBBox: function() {
        var i,
            sprite,
            bb,
            items = this.items,
            ln = this.length,
            infinity = Infinity,
            minX = infinity,
            maxHeight = -infinity,
            minY = infinity,
            maxWidth = -infinity,
            maxWidthBBox, maxHeightBBox;
        
        for (i = 0; i < ln; i++) {
            sprite = items[i];
            if (sprite.el) {
                bb = sprite.getBBox();
                minX = Math.min(minX, bb.x);
                minY = Math.min(minY, bb.y);
                maxHeight = Math.max(maxHeight, bb.height + bb.y);
                maxWidth = Math.max(maxWidth, bb.width + bb.x);
            }
        }
        
        return {
            x: minX,
            y: minY,
            height: maxHeight - minY,
            width: maxWidth - minX
        };
    },

    setAttributes: function(attrs, redraw) {
        var i,
            items = this.items,
            ln = this.length;
        for (i = 0; i < ln; i++) {
            items[i].setAttributes(attrs, redraw);
        }
        return this;
    },

    hide: function(attrs) {
        var i,
            items = this.items,
            ln = this.length;
        for (i = 0; i < ln; i++) {
            items[i].hide();
        }
        return this;
    },

    show: function(attrs) {
        var i,
            items = this.items,
            ln = this.length;
        for (i = 0; i < ln; i++) {
            items[i].show();
        }
        return this;
    },

    redraw: function() {
        var i,
            items = this.items,
            surface = items.length? items[0].surface : false,
            ln = this.length;
        
        if (surface) {
            for (i = 0; i < ln; i++) {
                surface.renderItem(items[i]);
            }
        }
        return this;
    },

    setStyle: function(obj) {
        var items = this.items,
            ln = this.length,
            i, item;
        for (i = 0; i < ln; i++) {
            item = items[i];
            if (item.el) {
                el.setStyle(obj);
            }
        }
    },

    addCls: function(obj) {
        var i,
            items = this.items,
            surface = items.length? items[0].surface : false,
            ln = this.length;
        
        if (surface) {
            for (i = 0; i < ln; i++) {
                surface.addCls(items[i], obj);
            }
        }
    },

    removeCls: function(obj) {
        var i,
            items = this.items,
            surface = items.length? items[0].surface : false,
            ln = this.length;
        
        if (surface) {
            for (i = 0; i < ln; i++) {
                surface.removeCls(items[i], obj);
            }
        }
    }
});
