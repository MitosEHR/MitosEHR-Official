/**
 * @class Ext.Layer
 * @extends Ext.core.Element
 * An extended {@link Ext.core.Element} object that supports a shadow and shim, constrain to viewport and
 * automatic maintaining of shadow/shim positions.
 * @cfg {Boolean} shim False to disable the iframe shim in browsers which need one (defaults to true)
 * @cfg {String/Boolean} shadow True to automatically create an {@link Ext.Shadow}, or a string indicating the
 * shadow's display {@link Ext.Shadow#mode}. False to disable the shadow. (defaults to false)
 * @cfg {Object} dh DomHelper object config to create element with (defaults to {tag: 'div', cls: 'x-layer'}).
 * @cfg {Boolean} constrain False to disable constrain to viewport (defaults to true)
 * @cfg {String} cls CSS class to add to the element
 * @cfg {Number} zindex Starting z-index (defaults to 11000)
 * @cfg {Number} shadowOffset Number of pixels to offset the shadow (defaults to 4)
 * @cfg {Boolean} useDisplay
 * Defaults to use css offsets to hide the Layer. Specify <tt>true</tt>
 * to use css style <tt>'display:none;'</tt> to hide the Layer.
 * @cfg {String} visibilityCls The CSS class name to add in order to hide this Layer if this layer
 * is configured with <code>{@link #hideMode}: 'asclass'</code>
 * @cfg {String} hideMode
 * A String which specifies how this Layer will be hidden.
 * Values may be<div class="mdetail-params"><ul>
 * <li><code>'display'</code> : The Component will be hidden using the <code>display: none</code> style.</li>
 * <li><code>'visibility'</code> : The Component will be hidden using the <code>visibility: hidden</code> style.</li>
 * <li><code>'offsets'</code> : The Component will be hidden by absolutely positioning it out of the visible area of the document. This
 * is useful when a hidden Component must maintain measurable dimensions. Hiding using <code>display</code> results
 * in a Component having zero dimensions.</li></ul></div>
 * @constructor
 * @param {Object} config An object with config options.
 * @param {String/HTMLElement} existingEl (optional) Uses an existing DOM element. If the element is not found it creates it.
 */
Ext.define('Ext.Layer', {
    // shims are shared among layer to keep from having 100 iframes
    statics: {
        shims: []
    },

    extend: 'Ext.core.Element',

    constructor: function(config, existingEl){
        config = config || {};
        var me = this,
            dh = Ext.core.DomHelper,
            cp = config.parentEl,
            pel = cp ? Ext.getDom(cp) : document.body,
            hm = config.hideMode;

        if (existingEl) {
            me.dom = Ext.getDom(existingEl);
        }
        if (!me.dom) {
            me.dom = dh.append(pel, config.dh || {tag: 'div', cls: Ext.baseCSSPrefix + 'layer'});
        } else {
            me.addCls(Ext.baseCSSPrefix + 'layer');
            if (!me.dom.parentNode) {
                pel.appendChild(me.dom);
            }
        }

        if(config.cls){
            me.addCls(config.cls);
        }
        me.constrain = config.constrain !== false;

        // Allow Components to pass their hide mode down to the Layer if they are floating.
        // Otherwise, allow useDisplay to override the default hiding method which is visibility.
        // TODO: Have ExtJS's Element implement visibilityMode by using classes as in Mobile.
        if (hm) {
            me.setVisibilityMode(Ext.core.Element[hm.toUpperCase()]);
            if (me.visibilityMode == Ext.core.Element.ASCLASS) {
                me.visibilityCls = config.visibilityCls;
            }
        } else if (config.useDisplay) {
            me.setVisibilityMode(Ext.core.Element.DISPLAY);
        } else {
            me.setVisibilityMode(Ext.core.Element.VISIBILITY);
        }

        if(config.id){
            me.id = me.dom.id = config.id;
        }else{
            me.id = Ext.id(me.dom);
        }
        me.position('absolute');
        // if(config.shadow){
        //     me.shadowOffset = config.shadowOffset || 4;
        //     me.shadow = new Ext.Shadow({
        //         offset : me.shadowOffset,
        //         mode : config.shadow
        //     });
        // }else{
            me.shadowOffset = 0;
        // }
        me.useShim = config.shim !== false && Ext.useShims;
        if (config.hidden === true) {
            me.hide();
        } else {
            this.show();
        }
    },

    getZIndex : function(){
        return parseInt((this.getShim() || this).getStyle('z-index'), 10);
    },

    getShim : function(){
        if(!this.useShim){
            return null;
        }
        if(this.shim){
            return this.shim;
        }
        var shim = shims.shift();
        if(!shim){
            shim = this.createShim();
            shim.enableDisplayMode('block');
            shim.dom.style.display = 'none';
            shim.dom.style.visibility = 'visible';
        }
        var pn = this.dom.parentNode;
        if(shim.dom.parentNode != pn){
            pn.insertBefore(shim.dom, this.dom);
        }
        shim.setStyle('z-index', this.getZIndex()-2);
        this.shim = shim;
        return shim;
    },

    hideShim : function(){
        if(this.shim){
            this.shim.setDisplayed(false);
            shims.push(this.shim);
            delete this.shim;
        }
    },

    disableShadow : function(){
        if(this.shadow){
            this.shadowDisabled = true;
            this.shadow.hide();
            this.lastShadowOffset = this.shadowOffset;
            this.shadowOffset = 0;
        }
    },

    enableShadow : function(show){
        if(this.shadow){
            this.shadowDisabled = false;
            this.shadowOffset = this.lastShadowOffset;
            delete this.lastShadowOffset;
            if(show){
                this.sync(true);
            }
        }
    },

    // private
    // this code can execute repeatedly in milliseconds (i.e. during a drag) so
    // code size was sacrificed for efficiency (e.g. no getBox/setBox, no XY calls)
    sync : function(doShow){
        var shadow = this.shadow;
        if(!this.updating && this.isVisible() && (shadow || this.useShim)){
            var shim = this.getShim(),
                w = this.getWidth(),
                h = this.getHeight(),
                l = this.getLeft(true),
                t = this.getTop(true);

            if(shadow && !this.shadowDisabled){
                if(doShow && !shadow.isVisible()){
                    shadow.show(this);
                }else{
                    shadow.realign(l, t, w, h);
                }
                if(shim){
                    if(doShow){
                       shim.show();
                    }
                    // fit the shim behind the shadow, so it is shimmed too
                    var shadowAdj = shadow.el.getXY(), shimStyle = shim.dom.style,
                        shadowSize = shadow.el.getSize();
                    shimStyle.left = (shadowAdj[0])+'px';
                    shimStyle.top = (shadowAdj[1])+'px';
                    shimStyle.width = (shadowSize.width)+'px';
                    shimStyle.height = (shadowSize.height)+'px';
                }
            }else if(shim){
                if(doShow){
                   shim.show();
                }
                shim.setSize(w, h);
                shim.setLeftTop(l, t);
            }
        }
        return this;
    },

    remove : function(){
        this.hideUnders();
        Ext.Layer.superclass.remove.call(this);
    },

    // private
    beginUpdate : function(){
        this.updating = true;
    },

    // private
    endUpdate : function(){
        this.updating = false;
        this.sync(true);
    },

    // private
    hideUnders : function(){
        if(this.shadow){
            this.shadow.hide();
        }
        this.hideShim();
    },

    // private
    constrainXY : function(){
        if(this.constrain){
            var vw = Ext.core.Element.getViewWidth(),
                vh = Ext.core.Element.getViewHeight();
            var s = Ext.getDoc().getScroll();

            var xy = this.getXY();
            var x = xy[0], y = xy[1];
            var so = this.shadowOffset;
            var w = this.dom.offsetWidth+so, h = this.dom.offsetHeight+so;
            // only move it if it needs it
            var moved = false;
            // first validate right/bottom
            if((x + w) > vw+s.left){
                x = vw - w - so;
                moved = true;
            }
            if((y + h) > vh+s.top){
                y = vh - h - so;
                moved = true;
            }
            // then make sure top/left isn't negative
            if(x < s.left){
                x = s.left;
                moved = true;
            }
            if(y < s.top){
                y = s.top;
                moved = true;
            }
            if(moved){
                if(this.avoidY){
                    var ay = this.avoidY;
                    if(y <= ay && (y+h) >= ay){
                        y = ay-h-5;
                    }
                }
                xy = [x, y];
                Ext.Layer.superclass.setXY.call(this, xy);
                this.sync();
            }
        }
        return this;
    },

    getConstrainOffset : function(){
        return this.shadowOffset;    
    },

    // overridden Element method
    setVisible : function(visible, animate, d, callback, e){
        // If animating into full visibility...
        var cb;
        if(animate && visible){
            cb = Ext.Function.bind(function(){
                this.sync(true);
                if(callback){
                    callback();
                }
            }, this);
            Ext.Layer.superclass.setVisible.call(this, true, true, d, cb, e);
        }else{
//          Here we are either showing with no animation, or hiding
            if(!visible){
                this.hideUnders(true);
            }
            cb = callback;
            if(animate){
                cb = Ext.Function.bind(function(){
                    this.hideAction();
                    if(callback){
                        callback();
                    }
                }, this);
            }
            Ext.Layer.superclass.setVisible.call(this, visible, animate, d, cb, e);
            if(visible){
                this.sync(true);
            }
        }
        return this;
    },

    // private
    beforeFx : function(){
        this.beforeAction();
        return Ext.Layer.superclass.beforeFx.apply(this, arguments);
    },

    // private
    afterFx : function(){
        Ext.Layer.superclass.afterFx.apply(this, arguments);
        this.sync(this.isVisible());
    },

    // private
    beforeAction : function(){
        if(!this.updating && this.shadow){
            this.shadow.hide();
        }
    },

    // overridden Element method
    setLeft : function(left){
        Ext.Layer.superclass.setLeft.apply(this, arguments);
        return this.sync();
    },

    setTop : function(top){
        Ext.Layer.superclass.setTop.apply(this, arguments);
        return this.sync();
    },

    setLeftTop : function(left, top){
        Ext.Layer.superclass.setLeftTop.apply(this, arguments);
        return this.sync();
    },

    setXY : function(xy, a, d, c, e){
        this.fixDisplay();
        this.beforeAction();
        var cb = this.createCB(c);
        Ext.Layer.superclass.setXY.call(this, xy, a, d, cb, e);
        if(!a){
            cb();
        }
        return this;
    },

    // private
    createCB : function(c){
        var el = this;
        return function(){
            el.constrainXY();
            el.sync(true);
            if(c){
                c();
            }
        };
    },

    // overridden Element method
    setX : function(x, a, d, c, e){
        this.setXY([x, this.getY()], a, d, c, e);
        return this;
    },

    // overridden Element method
    setY : function(y, a, d, c, e){
        this.setXY([this.getX(), y], a, d, c, e);
        return this;
    },

    // overridden Element method
    setSize : function(w, h, a, d, c, e){
        this.beforeAction();
        var cb = this.createCB(c);
        Ext.Layer.superclass.setSize.call(this, w, h, a, d, cb, e);
        if(!a){
            cb();
        }
        return this;
    },

    // overridden Element method
    setWidth : function(w, a, d, c, e){
        this.beforeAction();
        var cb = this.createCB(c);
        Ext.Layer.superclass.setWidth.call(this, w, a, d, cb, e);
        if(!a){
            cb();
        }
        return this;
    },

    // overridden Element method
    setHeight : function(h, a, d, c, e){
        this.beforeAction();
        var cb = this.createCB(c);
        Ext.Layer.superclass.setHeight.call(this, h, a, d, cb, e);
        if(!a){
            cb();
        }
        return this;
    },

    // overridden Element method
    setBounds : function(x, y, width, height, animate, d, callback, e){
        this.beforeAction();
        var cb = this.createCB(callback);
        if(!animate){
            Ext.Layer.superclass.setXY.call(this, [x, y]);
            Ext.Layer.superclass.setSize.call(this, width, height, animate, d, cb, e);
            cb();
        }else{
            Ext.Layer.superclass.setBounds.call(this, x, y, width, height, animate, d, cb, e);
        }
        return this;
    },

    /**
     * Sets the z-index of this layer and adjusts any shadow and shim z-indexes. The layer z-index is automatically
     * incremented by two more than the value passed in so that it always shows above any shadow or shim (the shadow
     * element, if any, will be assigned z-index + 1, and the shim element, if any, will be assigned the unmodified z-index).
     * @param {Number} zindex The new z-index to set
     * @return {this} The Layer
     */
    setZIndex : function(zindex){
        this.zindex = zindex;
        this.setStyle('z-index', zindex + 2);
        if(this.shadow){
            this.shadow.setZIndex(zindex + 1);
        }
        if(this.shim){
            this.shim.setStyle('z-index', zindex);
        }
        return this;
    }
});