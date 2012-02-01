/**
 *
 */
Ext.define('Ext.env.Feature', {

    requires: ['Ext.env.Browser', 'Ext.env.OS'],

    constructor: function() {
        this.testElements = {};

        this.has = function(name) {
            return !!this.has[name];
        };

        return this;
    },

    getTestElement: function(tag, createNew) {
        if (tag === undefined) {
            tag = 'div';
        }
        else if (typeof tag !== 'string') {
            return tag;
        }

        if (createNew) {
            return document.createElement(tag);
        }

        if (!this.testElements[tag]) {
            this.testElements[tag] = document.createElement(tag);
        }

        return this.testElements[tag];
    },

    isStyleSupported: function(name, tag) {
        var elementStyle = this.getTestElement(tag).style,
            cName = Ext.String.capitalize(name);

        if (typeof elementStyle[name] !== 'undefined'
            || typeof elementStyle[Ext.browser.getStylePrefix(name) + cName] !== 'undefined') {
            return true;
        }

        return false;
    },

    isEventSupported: function(name, tag) {
        if (tag === undefined) {
            tag = window;
        }

        var element = this.getTestElement(tag),
            eventName = 'on' + name.toLowerCase(),
            isSupported = false;

        isSupported = (eventName in element);

        if (!isSupported) {
            if (element.setAttribute && element.removeAttribute) {
                element.setAttribute(eventName, '');
                isSupported = typeof element[eventName] === 'function';

                if (typeof element[eventName] !== 'undefined') {
                    element[eventName] = undefined;
                }

                element.removeAttribute(eventName);
            }
        }

        return isSupported;
    },

    getSupportedPropertyName: function(object, name) {
        var vendorName = Ext.browser.getVendorProperyName(name);

        if (vendorName in object) {
            return vendorName;
        }
        else if (name in object) {
            return name;
        }

        return null;
    },

    registerTest: Ext.Function.flexSetter(function(name, fn) {
        this.has[name] = fn.call(this);

        return this;
    })

}, function() {

    Ext.feature = new this;

    var has = Ext.feature.has;

    Ext.feature.registerTest({
        Canvas: function() {
            var element = this.getTestElement('canvas');
            return !!(element && element.getContext && element.getContext('2d'));
        },
        Svg: function() {
            var doc = document;

            return !!(doc.createElementNS && !!doc.createElementNS("http:/" + "/www.w3.org/2000/svg", "svg").createSVGRect);
        },
        Vml: function() {
            var element = this.getTestElement(),
                ret = false;

            element.innerHTML = "<!--[if vml]><br><![endif]-->";
            ret = (element.childNodes.length === 1);
            element.innerHTML = "";

            return ret;
        },
        Touch: function() {
            return this.isEventSupported('touchstart') && !(Ext.os && Ext.os.name.match(/Windows|MacOSX|Linux/));
        },
        Orientation: function() {
            return ('orientation' in window) && this.isEventSupported('orientationchange');
        },
        OrientationChange: function() {
            return this.isEventSupported('orientationchange');
        },
        DeviceMotion: function() {
            return this.isEventSupported('devicemotion');
        },
        Geolocation: function() {
            return 'geolocation' in window.navigator;
        },
        SqlDatabase: function() {
            return 'openDatabase' in window;
        },
        WebSockets: function() {
            return 'WebSocket' in window;
        },
        History: function() {
            return ('history' in window && 'pushState' in window.history);
        },
        CssTransforms: function() {
            return this.isStyleSupported('transform');
        },
        Css3dTransforms: function() {
            //TODO Implement a better test for the buggy 3D Transform implementation in Android 2.x
            return this.has('CssTransforms') && this.isStyleSupported('perspective') && !Ext.os.is.Android2;
        },
        CssAnimations: function() {
            return this.isStyleSupported('animationName');
        },
        CssTransitions: function() {
            return this.isStyleSupported('transitionProperty');
        },
        Audio: function() {
            return !!this.getTestElement('audio').canPlayType;
        },
        Video: function() {
            return !!this.getTestElement('video').canPlayType;
        }
    });

    //<deprecated product=touch since=2.0>
    /**
     * @class Ext.supports
     * @deprecated 2.0.0
     */
    /**
     * @member Ext.supports
     * @property Transitions
     * @deprecated 2.0.0
     */
    Ext.deprecateProperty(has, 'Transitions', has.CssTransitions,
                          "Ext.supports.Transitions is deprecated, please use Ext.feature.has.CssTransitions instead");

    Ext.deprecateProperty(has, 'SVG', has.Svg,
                          "Ext.supports.SVG is deprecated, please use Ext.feature.has.Svg instead");

    Ext.deprecateProperty(has, 'VML', has.Vml,
                          "Ext.supports.VML is deprecated, please use Ext.feature.has.Vml instead");

    Ext.deprecateProperty(has, 'AudioTag', has.Audio,
                          "Ext.supports.AudioTag is deprecated, please use Ext.feature.has.Audio instead");

    Ext.deprecateProperty(has, 'GeoLocation', has.Geolocation,
                          "Ext.supports.GeoLocation is deprecated, please use Ext.feature.has.Geolocation instead");

    var name;

    if (!Ext.supports) {
        Ext.supports = {};
    }

    for (name in has) {
        if (has.hasOwnProperty(name)) {
            Ext.deprecateProperty(Ext.supports, name, has[name], "Ext.supports." + name + " is deprecated, please use Ext.feature.has." + name + " instead");
        }
    }
    //</deprecated>
});
