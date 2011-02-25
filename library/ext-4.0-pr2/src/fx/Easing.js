/**
 * @class Ext.fx.Easing
 * @singleton
This describes how the intermediate values used during a transition will be calculated. It allows for a transition to change
speed over its duration. 

         -backIn
         -backOut
         -bounceIn
         -bounceOut
         -ease
         -easeIn
         -easeOut
         -easeInOut
         -elasticIn
         -elasticOut
         -cubic-bezier(x1, y1, x2, y2)

Note that cubic-bezier will create a custom easing curve following the CSS3 transition-timing-function specification `{@link http://www.w3.org/TR/css3-transitions/#transition-timing-function_tag}`. The four values specify points P1 and P2 of the curve
as (x1, y1, x2, y2). All values must be in the range [0, 1] or the definition is invalid.
 * @markdown
 */
Ext.ns('Ext.fx');

Ext.require('Ext.fx.CubicBezier', function() {
    var math = Math,
        pi = math.PI,
        pow = math.pow,
        sin = math.sin,
        backInSeed = 1.70158;
    Ext.fx.Easing = {
        // ease: Ext.fx.CubicBezier.cubicBezier(0.25, 0.1, 0.25, 1),
        // linear: Ext.fx.CubicBezier.cubicBezier(0, 0, 1, 1),
        // 'ease-in': Ext.fx.CubicBezier.cubicBezier(0.42, 0, 1, 1),
        // 'ease-out': Ext.fx.CubicBezier.cubicBezier(0, 0.58, 1, 1),
        // 'ease-in-out': Ext.fx.CubicBezier.cubicBezier(0.42, 0, 0.58, 1),
        // 'easeIn': Ext.fx.CubicBezier.cubicBezier(0.42, 0, 1, 1),
        // 'easeOut': Ext.fx.CubicBezier.cubicBezier(0, 0.58, 1, 1),
        // 'easeInOut': Ext.fx.CubicBezier.cubicBezier(0.42, 0, 0.58, 1)
    };

    Ext.apply(Ext.fx.Easing, {
        linear: function(n) {
            return n;
        },
        ease: function(n) {
            n = n * 2;
            if (n < 1) {
                return pow(n, 3) / 2;
            }
            n -= 2;
            return (pow(n, 3) + 2) / 2;
        },
        easeIn: function (n) {
            return pow(n, 3);
        },
        easeOut: function (n) {
            return pow(n - 1, 3) + 1;
        },
        backIn: function (n) {
            return n * n * ((backInSeed + 1) * n - backInSeed);
        },
        backOut: function (n) {
            n = n - 1;
            return n * n * ((backInSeed + 1) * n + backInSeed) + 1;
        },
        elasticIn: function (n) {
            if (n == 0 || n == 1) {
                return n;
            }
            var p = 0.3,
                s = p / 4;
            return pow(2, -10 * n) * sin((n - s) * (2 * pi) / p) + 1;
        },
        bounceOut: function (n) {
            var s = 7.5625,
                p = 2.75,
                l;
            if (n < (1 / p)) {
                l = s * n * n;
            } else {
                if (n < (2 / p)) {
                    n -= (1.5 / p);
                    l = s * n * n + 0.75;
                } else {
                    if (n < (2.5 / p)) {
                        n -= (2.25 / p);
                        l = s * n * n + 0.9375;
                    } else {
                        n -= (2.625 / p);
                        l = s * n * n + 0.984375;
                    }
                }
            }
            return l;
        }
    });
    Ext.apply(Ext.fx.Easing, {
        'back-in': Ext.fx.Easing.backIn,
        'back-out': Ext.fx.Easing.backOut,
        'ease-in': Ext.fx.Easing.easeIn,
        'ease-out': Ext.fx.Easing.easeOut,
        'bounce-out': Ext.fx.Easing.bounceOut,
        'elastic-in': Ext.fx.Easing.elasticIn,
        // TODO
        'easeInOut': Ext.fx.Easing.ease,
        'ease-in-out': Ext.fx.Easing.ease,
        'bounceIn': Ext.fx.Easing.bounceOut,
        'bounce-in': Ext.fx.Easing.bounceOut,
        'elastic-out': Ext.fx.Easing.elasticIn,
        'elasticOut': Ext.fx.Easing.elasticIn
    });
});