/**
 * @class Ext.draw.Sprite
 * @extends Object
 * Base drawing spriteitive class.  Provides bucket for all spriteitive attributes and basic methods for updating them.
 */
Ext.define('Ext.draw.Sprite', {
    /* Begin Definitions */

    mixins: {
        observable: 'Ext.util.Observable',
        animate: 'Ext.util.Animate'
    },

    /* End Definitions */

    dirty: false,
    dirtyHidden: false,
    dirtyTransform: false,
    dirtyPath: true,
    dirtyFont: true,
    zIndexDirty: true,
    isSprite: true,
    zIndex: 0,
    fontProperties: [
        'font',
        'font-size',
        'font-weight',
        'font-style',
        'font-family',
        'text-anchor',
        'text'
    ],
    pathProperties: [
        'x',
        'y',
        'd',
        'path',
        'height',
        'width',
        'radius',
        'r',
        'rx',
        'ry',
        'cx',
        'cy'
    ],
    constructor: function(config) {
        config = config || {};
        this.id = Ext.id(null, 'ext-sprite-');
        this.transformations = [];
        Ext.copyTo(this, config, 'surface,group,type');
        //attribute bucket
        this.bbox = {};
        this.attr = {
            zIndex: 0,
            translation: {
                x: null,
                y: null
            },
            rotation: {
                degrees: null,
                x: null,
                y: null
            },
            scaling: {
                x: null,
                y: null,
                cx: null,
                cy: null
            }
        };
        //delete not bucket attributes
        delete config.surface;
        delete config.group;
        delete config.type;
        this.setAttributes(config);
        this.addEvents(
            'render',
            'mousedown',
            'mouseup',
            'mouseover',
            'mouseout',
            'click'
        );
        this.mixins.observable.constructor.apply(this, arguments);
    },

    /**
     * Change the attributes of the sprite.
     * @param {Object} attrs attributes to be changed on the sprite.
     * @param {Boolean} redraw Flag to immediatly draw the change.
     * @return {Ext.draw.Sprite} this
     */
    setAttributes: function(attrs, redraw) {
        var me = this,
            fontProps = me.fontProperties,
            fontPropsLength = fontProps.length,
            pathProps = me.pathProperties,
            pathPropsLength = pathProps.length,
            custom = me.surface.customAttributes,
            spriteAttrs = me.attr,
            attr, i, translate, translation, rotate, rotation, scale, scaling;

        for (attr in custom) {
            if (attrs.hasOwnProperty(attr) && typeof custom[attr] == "function") {
                Ext.apply(attrs, custom[attr].apply(me, [].concat(attrs[attr])));
            }
        }

        // Flag a change in hidden
        if (!!attrs.hidden !== !!spriteAttrs.hidden) {
            me.dirtyHidden = true;
        }

        // Flag path change
        for (i = 0; i < pathPropsLength; i++) {
            attr = pathProps[i];
            if (attr in attrs && attrs[attr] !== spriteAttrs[attr]) {
                me.dirtyPath = true;
                break;
            }
        }

        // Flag zIndex change
        if ('zIndex' in attrs) {
            me.zIndexDirty = true;
        }

        // Flag font/text change
        for (i = 0; i < fontPropsLength; i++) {
            attr = fontProps[i];
            if (attr in attrs && attrs[attr] !== spriteAttrs[attr]) {
                me.dirtyFont = true;
                break;
            }
        }

        translate = attrs.translate;
        translation = spriteAttrs.translation;
        if (translate) {
            if ((translate.x && translate.x !== translation.x) ||
                (translate.y && translate.y !== translation.y)) {
                Ext.apply(translation, translate);
                me.dirtyTransform = true;
            }
            delete attrs.translate;
        }

        rotate = attrs.rotate;
        rotation = spriteAttrs.rotation;
        if (rotate) {
            if ((rotate.x && rotate.x !== rotation.x) || 
                (rotate.y && rotate.y !== rotation.y) ||
                (rotate.degrees && rotate.degrees !== rotation.degrees)) {
                Ext.apply(rotation, rotate);
                me.dirtyTransform = true;
            }
            delete attrs.rotate;
        }

        scale = attrs.scale;
        scaling = spriteAttrs.scaling;
        if (scale) {
            if ((scale.x && scale.x !== scaling.x) || 
                (scale.y && scale.y !== scaling.y) ||
                (scale.cx && scale.cx !== scaling.cx) ||
                (scale.cy && scale.cy !== scaling.cy)) {
                Ext.apply(scaling, scale);
                me.dirtyTransform = true;
            }
            delete attrs.scale;
        }

        Ext.apply(spriteAttrs, attrs);
        me.dirty = true;

        if (redraw === true) {
            me.redraw();
        }
        return this;
    },

    /**
     * Retrieve the bounding box of the sprite. This will be returned as an object with x, y, width, and height properties.
     * @return {Object} bbox
     */
    getBBox: function() {
        return this.surface.getBBox(this);
    },

    /**
     * Hide the sprite.
     * @param {Boolean} redraw Flag to immediatly draw the change.
     * @return {Ext.draw.Sprite} this
     */
    hide: function(redraw) {
        this.setAttributes({
            hidden: true
        }, redraw);
        return this;
    },

    /**
     * Show the sprite.
     * @param {Boolean} redraw Flag to immediatly draw the change.
     * @return {Ext.draw.Sprite} this
     */
    show: function(redraw) {
        this.setAttributes({
            hidden: false
        }, redraw);
        return this;
    },

    /**
     * Redraw the sprite.
     * @return {Ext.draw.Sprite} this
     */
    redraw: function() {
        this.surface.renderItem(this);
        return this;
    },

    /**
     * Wrapper for setting style properties, also takes single object parameter of multiple styles.
     * @param {String/Object} property The style property to be set, or an object of multiple styles.
     * @param {String} value (optional) The value to apply to the given property, or null if an object was passed.
     * @return {Ext.draw.Sprite} this
     */
    setStyle: function() {
        this.el.setStyle.apply(this.el, arguments);
        return this;
    },

    /**
     * Adds one or more CSS classes to the element. Duplicate classes are automatically filtered out.  Note this method
     * is severly limited in VML.
     * @param {String/Array} className The CSS class to add, or an array of classes
     * @return {Ext.draw.Sprite} this
     */
    addCls: function(obj) {
        this.surface.addCls(this, obj);
        return this;
    },

    /**
     * Removes one or more CSS classes from the element.
     * @param {String/Array} className The CSS class to remove, or an array of classes.  Note this method
     * is severly limited in VML.
     * @return {Ext.draw.Sprite} this
     */
    removeCls: function(obj) {
        this.surface.removeCls(this, obj);
        return this;
    }
});
