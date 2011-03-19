/*
 * @class Ext.draw.engine.Canvas
 * @extends Ext.draw.Surface
 * Provides specific methods to draw with Canvas.
 */
Ext.define('Ext.draw.engine.Canvas', {

    /* Begin Definitions */

    extend: 'Ext.draw.Surface',

    requires: ['Ext.draw.Draw', 'Ext.draw.Sprite', 'Ext.core.Element'],

    /* End Definitions */

    fontSizeRE: /(?:^|\s)(\d+)px(?:\s|$)/,
    fontWeightRE: /(?:^|\s)(normal|bold|bolder|lighter|[1-9]00)(?:\s|$)/,
    fontStyleRE: /(?:^|\s)(normal|italic)(?:\s|$)/,
    fontFamilyRE: /^\s+|\s+$/g,
    urlRE: /^url\(['"]?([^\)]+?)['"]?\)$/i,
    separatorRE: /[, ]+/,
    
    constructor: function(config) {
        this.translateAttrs = {
            rotate: "rotation",
            stroke: "strokeStyle",
            fill: "fillStyle",
            "text-anchor": "textAlign",
            "stroke-width": "lineWidth",
            "stroke-linecap": "lineCap",
            "stroke-linejoin": "lineJoin",
            "stroke-miterlimit": "miterLimit",
            opacity: "globalAlpha"
        };
        this.attrDefaults = {
            strokeStyle: "#000",
            fillStyle: "#000",
            lineWidth: 1,
            lineCap: "square",
            lineJoin: "miter",
            miterLimit: 1,
            shadowColor: "none",
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowBlur: 0,
            rotate: null,
            font: "10px Helvetica, sans-serif",
            translation: null,
            "font-size": null,
            "font-family": null,
            "font-weight": null,
            "font-style": null,
            textAlign: "left",
            globalAlpha: 1
        };
        Ext.draw.engine.Canvas.superclass.constructor.call(this, config);
    },

    updateMaxBoundingBox: function(sprite) {
        if (sprite.type == "image" || sprite.type == "text") {
            delete sprite.realPath;
            Ext.draw.Draw.rectPath(this.getBBox(sprite));
            sprite.realPath = Ext.draw.Draw.rotateAndTranslatePath(sprite);
        }
        var newBBox = this.getBBox(sprite),
            oldBBox = sprite.curBBox,
            x,
            y;
        if (!oldBBox) {
            sprite.maxBBox = newBBox;
        }
        else {
            x = Math.min(newBBox.x, oldBBox.x);
            y = Math.min(newBBox.y, oldBBox.y);
            sprite.maxBBox = {
                x: x,
                y: y,
                width: Math.max(newBBox.x + newBBox.width, oldBBox.x + oldBBox.width) - x,
                height: Math.max(newBBox.y + newBBox.height, oldBBox.y + oldBBox.height) - y
            };
        }    
        sprite.curBBox = newBBox;
    },

    getBBox: function(sprite) {
        var bb,
            textAlign;
        if (sprite.realPath) {
            bb = Ext.draw.Draw.pathDimensions(sprite.realPath);
        } else {
            switch (sprite.type) {
                case "rect":
                case "image":
                    bb = {
                        x: sprite.x,
                        y: sprite.y,
                        width: sprite.width,
                        height: sprite.height
                    };
                break;
                case "circle":
                    bb = {
                        x: sprite.x - sprite.radius,
                        y: sprite.y - sprite.radius,
                        width: sprite.radius * 2,
                        height: sprite.radius * 2
                    };
                break;
                case "ellipse":
                    bb = {
                        x: sprite.x - sprite.radiusX,
                        y: sprite.y - sprite.radiusY,
                        width: sprite.radiusX * 2,
                        height: sprite.radiusY * 2
                    };
                break;
                case "path":
                    bb = Ext.draw.Draw.pathDimensions(sprite.path);
                break;
                case "text":
                    var shadow = this.shadow;
                    shadow.save();
                    // Normalize middle to center for Canvas
                    textAlign = sprite["text-anchor"] || this.attrDefaults.textAlign;
                    if (textAlign == 'middle') {
                        textAlign = 'center';
                    }
                    shadow.textAlign = textAlign;
                    shadow.font = sprite.font || this.attrDefaults.font;
                    var width = 0,
                        rows = (sprite.text + "").split("\n"),
                        rlength = rows.length,
                        i = rlength,
                        height = sprite["font-size"] * 1.2,
                        x = sprite.x,
                        y = sprite.y - rlength * height / 2;
                    while (i--) {
                        width = Math.max(width, shadow.measureText(rows[i]).width);
                    }
                    switch (shadow.textAlign) {
                        case "center":
                            x -= width / 2;
                        break;
                        case "end":
                            x -= width;
                        break;
                    }
                    bb = {
                        x: x,
                        y: y,
                        width: width,
                        height: height * rlength
                    };
                break;
            }
        }
        bb.x2 = bb.x + bb.width;
        bb.y2 = bb.y + bb.height;
        return bb;
    },

    setSize: function(w, h) {
        if (typeof w == 'object') {
            h = w.height;
            w = w.width;
        }
        this.el.width = this.shadow.width = w;
        this.el.height = this.shadow.height = h;
        this.width = w;
        this.height = h;
    },

    render: function(container) {
        var doc = Ext.getDoc().dom,
            el,
            shadow,
            span,
            containerHeight = Ext.get(container).getHeight(),
            containerWidth = Ext.get(container).getWidth();
        this.container = Ext.get(container);
        el = doc.createElement("canvas");
        el.id = this.id;

        shadow = doc.createElement("canvas").getContext("2d");
        span = doc.createElement("span");
        span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;";

        shadow.save();

        container.appendChild(el);
        container.appendChild(span);
        this.el = el;
        this.context = el.getContext("2d");
        this.shadow = shadow;
        this.span = span;
        this.renderAll();
    },

    createItem: function(config) {
        config.context = Ext.getDoc().dom.createElement("canvas").getContext("2d");
        config.context.canvas.width = this.width;
        config.context.canvas.height = this.height;
        var sprite = Ext.apply(new Ext.draw.Sprite(config), {change: this.change});
        // Update the maxBBox when there's a change to the spriteitive
        //sprite.on('change', this.updateMaxBoundingBox, sprite);
        return sprite;
    },

    renderItem: function() {
        this.renderAll();
    },

    renderAll: function() {
        //var maxBBox = spriteitive.maxBBox,
        //    bbox = {
        //        x: Math.round(maxBBox.x - 5),
        //        y: Math.round(maxBBox.y - 5),
        //        width: Math.round(maxBBox.width + 10),
        //        height: Math.round(maxBBox.height + 10)
        //    },
        var context = this.context;
        context.restore();
        context.save();
        //context.beginPath();
        //canvas.rect(bbox.x, bbox.y, bbox.width, bbox.height);
        //canvas.clip();
        context.clearRect(0, 0, this.width, this.height);
        context.restore();
        context.save();

        this.items.each(this.renderItems, this);
        //while (bot) {
        //    (!bb || isOverlap(bb, bot._maxbbox)) && bot.draw(cnv, bb);
        //    bot = bot.next;
        //}
    },

    updateSprite: function(sprite) {
        //if (this.fireEvent('beforechange', this) !== false) {
            this.applyChange(sprite);
            this.updateMaxBoundingBox(sprite);
        //}
    },

    applyChange: function(sprite) {
        var oldPath = sprite.path;
        // Handle Attributes
        this.cleanAttrs(sprite, this.scrubAttrs(sprite));

        // Handle Path
        switch (sprite.type) {
            case "circle":
                sprite.radiusX = sprite.radiusY = sprite.radius;
                sprite.path = Ext.draw.Draw.path2curve(Ext.draw.Draw.ellipsePath(sprite));
            break;
            case "ellipse":
                sprite.path = Ext.draw.Draw.path2curve(Ext.draw.Draw.ellipsePath(sprite));
                break;
            case "path":
                sprite.path = Ext.draw.Draw.path2curve(sprite.path);
                break;
            case "rect":
                sprite.path = Ext.draw.Draw.path2curve(Ext.draw.Draw.rectPath(sprite));
                break;
            case "text":
                sprite.path = Ext.draw.Draw.path2curve(Ext.draw.Draw.rectPath(sprite));
                break;
        }

        if (sprite.path && sprite.path.length) {
            sprite.realPath = Ext.draw.Draw.rotateAndTranslatePath(sprite);
        }
        if (oldPath != sprite.path) {
            sprite.dirty = true;
        }
    },

    drawPath: function(context, path) {
        if (!path) {
            return;
        }
        var x,
            y,
            i,
            ln = path.length;
        context.beginPath();
        for (i = 0; i < ln; i++) {
            switch (path[i][0]) {
                case "M":
                    context.moveTo(path[i][1], path[i][2]);
                    if (x == null) {
                        x = path[i][1];
                    }
                    if (y == null) {
                        y = path[i][2];
                    }
                break;
                case "C":
                    context.bezierCurveTo(path[i][1], path[i][2], path[i][3], path[i][4], path[i][5], path[i][6]);
                break;
                case "Z":
                    context.lineTo(x, y);
                break;
            }
        }
    },

    scrubAttrs: function(sprite) {
        var attrs = Ext.draw.engine.Canvas.superclass.scrubAttrs.apply(this, [sprite]);
        if (attrs.hasOwnProperty('textAlign') && attrs.textAlign == 'middle') {
            attrs.textAlign = 'center';
        }
        return attrs;
    },

    renderItems: function(sprite) {
        this.updateSprite(sprite);
        var context = this.context,
            cache = sprite.context,
            clipbox,
            i;
        if (sprite.hidden || sprite.opacity == 0) {
            return;
        }
        context.restore();
        context.save();
        if (clipbox) {
            context.beginPath();
            context.rect(clipbox.x, clipbox.y, clipbox.width, clipbox.height);
            context.clip();
        }
        if (sprite.dirty) {
            cache.restore();
            cache.save();
            cache.clearRect(-1e3, -1e3, this.width + 2e3, this.height + 2e3);
            var attrs = this.scrubAttrs(sprite);
            for (i in attrs) {
                cache[i] = attrs[i];
            }

            var rotate = sprite.rotation,
                radians = rotate.degrees * Math.PI / 180,
                tx = sprite.translation.x,
                ty = sprite.translation.y,
                scale = this.scaling;
            // Apply Rotation
            if (rotate.degrees) {
                cache.translate(rotate.x, rotate.y);
                cache.rotate(radians);
                cache.translate(-rotate.x, -rotate.y);
                // Translation AND Rotation requires a bit more work
                if (tx !== 0 || ty !== 0) {
                    var x = tx,
                        y = ty,
                        cos = Math.cos(-radians),
                        sin = Math.sin(-radians);
                    tx = x * cos - y * sin;
                    ty = x * sin + y * cos;
                    cache.translate(tx, ty);
                }
            // Apply only Translation
            } else {
                cache.translate(tx, ty);
            }
            // special case: image

            if (this.type == "image") {
                if (!(this._imgdata && this._imgdata[attrs.src])) {
                    var img = R.doc.createElement("img"),
                        el = this,
                        paper = this.m;
                    img.src = attrs.src;
                    img.style.cssText = "position:absolute;left:-9999em;top-9999em";
                    img.onload = function () {
                        var cn = R.doc.createElement("canvas"),
                            c = cn.getContext("2d");
                        cn.width = img.offsetWidth;
                        cn.height = img.offsetHeight;
                        c.drawImage(img, 0, 0, cn.width, cn.height);
                        el._imgdata = el._imgdata || {};
                        el._imgdatacount = el._imgdatacount || [];
                        el._imgdatacount.push(el._imgdata[el.attrs.src] = cn);
                        el._imgdatacount[length] > 1e3 && delete el._imgdata[el._imgdatacount.shift()];
                        img.parentNode.removeChild(img);
                        paper.refresh(this);
                    };
                    this.m.canvas.parentNode.appendChild(img);
                } else {
                    // scale
                    if (sc.x || sc.y) {
                        c.scale(sc.x, sc.y);
                        c.translate(sc.cx / sc.x - sc.cx, sc.cy / sc.y - sc.cy);
                    }
                    c.drawImage(this._imgdata[attrs.src], attrs.x, attrs.y, attrs.width, attrs.height);
                    c.restore();
                    return;
                }
            }
            else if (sprite.type == "text") {
                var fill,
                    stroke,
                    j,
                    jj,
                    top,
                    rows = (sprite.text + "").split("\n"),
                    textAlign;
                // Normalize middle to center for Canvas
                textAlign = sprite["text-anchor"] || this.attrDefaults.textAlign;
                if (textAlign == 'middle') {
                    textAlign = 'center';
                }
                cache.textAlign = textAlign;
                cache.font = sprite.font || this.attrDefaults.font;
                cache.textBaseline = "middle";
                //"fill-opacity" in attrs && (c.globalAlpha = attrs["fill-opacity"] * (attrs.opacity || 1));
                fill = sprite.fillStyle && sprite.fillStyle != "none";
                //"stroke-opacity" in attrs && (c.globalAlpha = attrs["stroke-opacity"] * (attrs.opacity || 1));
                stroke = sprite.strokeStyle && sprite.strokeStyle != "none";
                top = sprite.y - (rows.length - 1) * sprite["font-size"] * 1.2 / 2;
                for (j = 0, jj = rows.length; j < jj; j++) {
                    if (fill) {
                        cache.fillText(rows[j], sprite.x, top + sprite["font-size"] * 1.2 * j);
                    }
                    if (stroke) {
                        cache.strokeText(rows[j], sprite.x, top + sprite["font-size"] * 1.2 * j);
                    }
                }
            } else {
                this.drawPath(cache, sprite.path);
            }

            cache.save();
            if (this.type != "text") {
                // Gradient
                var grad = attrs.gradient;
                if (grad) {
                    var g;
                    if (grad.type == "linear") {
                        var bb = this.getBBox();
                        g = cache.createLinearGradient(bb.x + grad.vector[0] * bb.width, bb.y + grad.vector[1] * bb.height, bb.x + grad.vector[2] * bb.width, bb.y + grad.vector[3] * bb.height);
                    } else {
                        // TODO: Make it work for ellipses with transformation
                        var rx = attrs.rx || attrs.r,
                            ry = attrs.ry || attrs.r;
                        g = cache.createRadialGradient(attrs.cx - rx + rx * 2 * grad.fx, attrs.cy - ry + ry * 2 * grad.fy, 0, attrs.cx, attrs.cy, mmax(rx, ry));
                    }
                    var opacity = (isNaN(attrs["fill-opacity"]) ? 1 : attrs["fill-opacity"]) * (isNaN(attrs.opacity) ? 1 : attrs.opacity),
                        dot = grad.dots[grad.dots[length] - 1],
                        lastcolor = dot.color;
                    dot.color = "rgba(" + [lastcolor.r, lastcolor.g, lastcolor.b, opacity] + ")";
                    for (i = grad.dots.length; i--;) {
                        dot = grad.dots[i];
                        g.addColorStop(toFloat(dot.offset) / 100, dot.color);
                    }
                    cache.globalAlpha = 1;
                    cache.fillStyle = g;
                    cache.fill();
                } else {
                    //"fill-opacity" in attrs && (cache.globalAlpha = attrs["fill-opacity"] * (attrs.opacity || 1));
                    if (attrs.fillStyle && attrs.fillStyle != "none") {
                        cache.fill();
                    }
                }
                //"stroke-opacity" in attrs && (cache.globalAlpha = attrs["stroke-opacity"] * (attrs.opacity || 1));
                if (attrs.strokeStyle && attrs.strokeStyle != "none") {
                    cache.stroke();
                }
            }
            cache.restore();

            cache.translate(-tx, -ty);
            sprite.dirty = false;
        }
        context.drawImage(cache.canvas, 0, 0);
    },

    cleanAttrs: function(sprite, attrs) {
        var value,
            color,
            xy,
            i;
        for (i in attrs) {
            value = attrs[i];
            switch (i) {
                case "translate":
                    // this.translate(value);
                    xy = (value + "").split(this.separatorRE);
                    sprite.translation.x += +xy[0];
                    sprite.translation.y += +xy[1];
                break;
                case "font-size":
                    sprite["font-size"] = parseInt(value, 10);
                case "font-family":
                case "font-weight":
                case "font-style":
                    sprite.font = (sprite["font-weight"] || "") + " " + (sprite["font-style"] || "") + " " + (sprite["font-size"] ? sprite["font-size"] + "px " : "") + (sprite["font-family"] || "");
                break;
                case "font":
                    value = value.replace(this.fontSizeRE, function (all, size) {
                        sprite["font-size"] = size;
                        return "";
                    });
                    value = value.replace(this.fontWeightRE, function (all, weight) {
                        sprite["font-weight"] = weight;
                        return "";
                    });
                    value = value.replace(this.fontStyleRE, function (all, style) {
                        sprite["font-style"] = style;
                        return "";
                    });
                    sprite["font-family"] = value.replace(this.fontFamilyRE, "") || sprite["font-family"];
                case "stroke":
                case "strokeStyle":
                    //color = Ext.draw.Color.getRGB(value);
                    sprite.stroke = sprite.strokeStyle = value;
                break;
                case "fill":
                case "fillStyle":
                    //color = Ext.draw.Color.getRGB(value);
                    sprite.fill = sprite.fillStyle = value;
                break;
                case "rotate":
                case "rotation":
                    this.rotate(sprite, value);
                break;
                case "scale":
                break;
                /*
                case "gradient":
                    var isURL = (value + "").match(this.urlRE);
                    if (false && isURL) {
                        // TODO: Pattern
                        el = $("pattern");
                        var ig = $("image");
                        el.id = "r" + (R._id++)[toString](36);
                        $(el, {x: 0, y: 0, patternUnits: "userSpaceOnUse", height: 1, width: 1});
                        $(ig, {x: 0, y: 0});
                        ig.setAttributeNS(o.paper.xlink, "href", isURL[1]);
                        el[appendChild](ig);

                        var img = R.doc.createElement("img");
                        img.style.cssText = "position:absolute;left:-9999em;top-9999em";
                        img.onload = function () {
                            $(el, {width: this.offsetWidth, height: this.offsetHeight});
                            $(ig, {width: this.offsetWidth, height: this.offsetHeight});
                            R.doc.body.removeChild(this);
                            o.paper.safari();
                        };
                        R.doc.body[appendChild](img);
                        img.src = isURL[1];
                        o.paper.defs[appendChild](el);
                        node.style.fill = "url(#" + el.id + ")";
                        $(node, {fill: "url(#" + el.id + ")"});
                        o.pattern = el;
                        o.pattern && updatePosition(o);
                        break;
                    }
                    if (!clr.error) {
                        delete attrs.gradient;
                        delete this.attrs.gradient;
                        this.attrs.fill = clr.hex;
                    } else if ((({circle: 1, ellipse: 1})[has](this.type) || (value + E).charAt() != "r") && (this.attrs.gradient = gradientParser(value))) {
                        this.attrs.fill = "none";
                        break;
                    }
                    clr[has]("o") && (this.attrs["fill-opacity"] = clr.o / 100);
                break;
                */
            }
        }
    },

    change: function () {
        var oldPath = this.path;
        // Handle Attributes
        this.surface.cleanAttrs(this, this.surface.scrubAttrs(this));

        // Handle Path
        switch (this.type) {
            case "circle":
                this.radiusX = this.radiusY = this.radius;
                this.path = Ext.draw.Draw.path2curve(Ext.draw.Draw.ellipsePath(this));
            break;
            case "ellipse":
                this.path = Ext.draw.Draw.path2curve(Ext.draw.Draw.ellipsePath(this));
                break;
            case "rect":
                this.path = Ext.draw.Draw.path2curve(Ext.draw.Draw.rectPath(this));
                break;
            case "text":
                this.path = Ext.draw.Draw.path2curve(Ext.draw.Draw.rectPath(this));
                break;
        }

        if (this.path && this.path.length) {
            this.realPath = Ext.draw.Draw.rotateAndTranslatePath(this);
        }
        if (oldPath != this.path) {
            this.dirty = true;
            return true;
        }
    },

    rotate: function(sprite, rotate) {
        if (typeof rotate.x == 'number') {
            sprite.rotation = {
                degrees: rotate.degrees,
                x: rotate.x,
                y: rotate.y
            };
        }
        else if (typeof rotate.degrees == 'number') {
            var bbox = this.getBBox(sprite);
            sprite.rotation = {
                degrees: parseFloat(rotate.degrees),
                x: bbox.x + bbox.width / 2,
                y: bbox.y + bbox.height / 2 
            };
        }
        sprite.dirty = true;
    },

    getRegion: function() {
        return Ext.fly(this.el).getRegion();
    }
});
