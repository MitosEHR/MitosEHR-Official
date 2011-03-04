/**
 * @class Ext.fx.target.Element
 * @private
 * @extends Objects
 */

Ext.define('Ext.fx.target.Element', {

    /* Begin Definitions */

    /* End Definitions */

    isAnimTarget: true,

    constructor: function(target) {
        this.target = target;
        this.id = this.getId();
        Ext.fx.target.Element.superclass.constructor.call(this, target);
    },

    type: 'element',

    getId: function() {
        return this.target.id;
    },

    getElVal: function(el, attr, val) {
        if (val == undefined) {
            if (attr === 'x') {
                val = el.getX();
            }
            else if (attr === 'y') {
                val = el.getY();
            }
            else if (attr === 'scrollTop') {
                val = el.getScroll().top;
            }
            else if (attr === 'scrollLeft') {
                val = el.getScroll().left;
            }
            else {
                val = el.getStyle(attr);
            }
        }
        return val;
    },

    getAttr: function(attr, val) {
        var el = this.target;
        return [[ el, this.getElVal(el, attr, val)]];
    },

    setAttr: function(targetData) {
        var target = this.target,
            ln = targetData.length,
            attrs, attr, o, i, j, ln2, element, value;
        for (i = 0; i < ln; i++) {
            attrs = targetData[i].attrs;
            for (attr in attrs) {
                if (attrs.hasOwnProperty(attr)) {
                    ln2 = attrs[attr].length;
                    for (j = 0; j < ln2; j++) {
                        o = attrs[attr][j];
                        element = o[0];
                        value = o[1];
                        if (attr === 'x') {
                            element.setX(value);
                        }
                        else if (attr === 'y') {
                            element.setY(value);
                        }
                        else if (attr === 'scrollTop') {
                            element.scrollTo('top', value);
                        }
                        else if (attr === 'scrollLeft') {
                            element.scrollTo('left',value);
                        }
                        else {
                            element.setStyle(attr, value);
                        }
                    }
                }
            }
        }
    }
});