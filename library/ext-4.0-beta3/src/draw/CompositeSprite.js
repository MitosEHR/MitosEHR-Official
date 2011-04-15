/**
 * @class Ext.draw.CompositeSprite
 * @extends Ext.util.MixedCollection
 */
Ext.define('Ext.draw.CompositeSprite', {

    /* Begin Definitions */

    extend: 'Ext.util.MixedCollection',
    mixins: {
        animate: 'Ext.util.Animate'
    },

    /* End Definitions */
    isSpriteGroup: true,
    constructor: function(config) {
        var me = this;
        
        config = config || {};
        Ext.apply(me, config);

        me.addEvents(
            'mousedown',
            'mouseup',
            'mouseover',
            'mouseout',
            'click'
        );
        me.id = Ext.id(null, 'ext-sprite-group-');
        me.callParent();
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
        var me = this;
        
        o.on({
            scope: me,
            mousedown: me.onMouseDown,
            mouseup: me.onMouseUp,
            mouseover: me.onMouseOver,
            mouseout: me.onMouseOut,
            click: me.onClick
        });
    },

    add: function(key, o) {
        var result = this.callParent(arguments);
        this.attachEvents(result);
        return result;
    },

    insert: function(index, key, o) {
        return this.callParent(arguments);
    },

    remove: function(o) {
        var me = this;
        
        o.un({
            scope: me,
            mousedown: me.onMouseDown,
            mouseup: me.onMouseUp,
            mouseover: me.onMouseOver,
            mouseout: me.onMouseOut,
            click: me.onClick
        });
        me.callParent(arguments);
    },
    // Returns the group bounding box.
    getBBox: function() {
        var i = 0,
            sprite,
            bb,
            items = this.items,
            len = this.length,
            infinity = Infinity,
            minX = infinity,
            maxHeight = -infinity,
            minY = infinity,
            maxWidth = -infinity,
            maxWidthBBox, maxHeightBBox;
        
        for (; i < len; i++) {
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
        var i = 0,
            items = this.items,
            len = this.length;
            
        for (; i < len; i++) {
            items[i].setAttributes(attrs, redraw);
        }
        return this;
    },

    hide: function(attrs) {
        var i = 0,
            items = this.items,
            len = this.length;
            
        for (; i < len; i++) {
            items[i].hide();
        }
        return this;
    },

    show: function(attrs) {
        var i = 0,
            items = this.items,
            len = this.length;
            
        for (; i < len; i++) {
            items[i].show();
        }
        return this;
    },

    redraw: function() {
        var me = this,
            i = 0,
            items = me.items,
            surface = me.getSurface(),
            len = me.length;
        
        if (surface) {
            for (; i < len; i++) {
                surface.renderItem(items[i]);
            }
        }
        return me;
    },

    setStyle: function(obj) {
        var i = 0,
            items = this.items,
            len = this.length,
            item;
            
        for (; i < len; i++) {
            item = items[i];
            if (item.el) {
                el.setStyle(obj);
            }
        }
    },

    addCls: function(obj) {
        var i = 0,
            items = this.items,
            surface = this.getSurface(),
            len = this.length;
        
        if (surface) {
            for (; i < len; i++) {
                surface.addCls(items[i], obj);
            }
        }
    },

    removeCls: function(obj) {
        var i = 0,
            items = this.items,
            surface = this.getSurface(),
            len = this.length;
        
        if (surface) {
            for (; i < len; i++) {
                surface.removeCls(items[i], obj);
            }
        }
    },
    
    /**
     * Grab the surface from the items
     * @private
     * @return {Ext.draw.Surface} The surface, null if not found
     */
    getSurface: function(){
        var first = this.first();
        if (first) {
            return first.surface;
        }
        return null;
    },
    
    /**
     * Destroys the SpriteGroup
     */
    destroy: function(){
        var me = this,
            surface = me.getSurface(),
            item;
            
        if (surface) {
            while (me.getCount() > 0) {
                item = me.first();
                me.remove(item);
                surface.remove(item);
            }
        }
        me.clearListeners();
    }
});
