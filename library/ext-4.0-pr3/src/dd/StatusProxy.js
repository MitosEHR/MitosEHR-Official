/**
 * @class Ext.dd.StatusProxy
 * A specialized drag proxy that supports a drop status icon, {@link Ext.Layer} styles and auto-repair.  This is the
 * default drag proxy used by all Ext.dd components.
 * @constructor
 * @param {Object} config
 */
Ext.define('Ext.dd.StatusProxy', {
    // EAC: 1/20/11 temporarily turned off while Ext.Fx gets updated.
    animRepair: false,
    constructor: function(config){
        Ext.apply(this, config);
        this.id = this.id || Ext.id();
        this.el = new Ext.Layer({
            hidden: true,
            dh: {
                id: this.id,
                tag: "div",
                cls: Ext.baseCSSPrefix + 'dd-drag-proxy ' + this.dropNotAllowed,
                children: [
                    {tag: "div", cls: Ext.baseCSSPrefix + 'dd-drop-icon'},
                    {tag: "div", cls: Ext.baseCSSPrefix + 'dd-drag-ghost'}
                ]
            }, 
            shadow: !config || config.shadow !== false
        });
        this.ghost = Ext.get(this.el.dom.childNodes[1]);
        this.dropStatus = this.dropNotAllowed;
    },
    /**
     * @cfg {String} dropAllowed
     * The CSS class to apply to the status element when drop is allowed (defaults to "x-dd-drop-ok").
     */
    dropAllowed : Ext.baseCSSPrefix + 'dd-drop-ok',
    /**
     * @cfg {String} dropNotAllowed
     * The CSS class to apply to the status element when drop is not allowed (defaults to "x-dd-drop-nodrop").
     */
    dropNotAllowed : Ext.baseCSSPrefix + 'dd-drop-nodrop',

    /**
     * Updates the proxy's visual element to indicate the status of whether or not drop is allowed
     * over the current target element.
     * @param {String} cssClass The css class for the new drop status indicator image
     */
    setStatus : function(cssClass){
        cssClass = cssClass || this.dropNotAllowed;
        if(this.dropStatus != cssClass){
            this.el.replaceCls(this.dropStatus, cssClass);
            this.dropStatus = cssClass;
        }
    },

    /**
     * Resets the status indicator to the default dropNotAllowed value
     * @param {Boolean} clearGhost True to also remove all content from the ghost, false to preserve it
     */
    reset : function(clearGhost){
        this.el.dom.className = Ext.baseCSSPrefix + 'dd-drag-proxy ' + this.dropNotAllowed;
        this.dropStatus = this.dropNotAllowed;
        if(clearGhost){
            this.ghost.update("");
        }
    },

    /**
     * Updates the contents of the ghost element
     * @param {String/HTMLElement} html The html that will replace the current innerHTML of the ghost element, or a
     * DOM node to append as the child of the ghost element (in which case the innerHTML will be cleared first).
     */
    update : function(html){
        if(typeof html == "string"){
            this.ghost.update(html);
        }else{
            this.ghost.update("");
            html.style.margin = "0";
            this.ghost.dom.appendChild(html);
        }
        var el = this.ghost.dom.firstChild; 
        if(el){
            Ext.fly(el).setStyle('float', 'none');
        }
    },

    /**
     * Returns the underlying proxy {@link Ext.Layer}
     * @return {Ext.Layer} el
    */
    getEl : function(){
        return this.el;
    },

    /**
     * Returns the ghost element
     * @return {Ext.core.Element} el
     */
    getGhost : function(){
        return this.ghost;
    },

    /**
     * Hides the proxy
     * @param {Boolean} clear True to reset the status and clear the ghost contents, false to preserve them
     */
    hide : function(clear){
        this.el.hide();
        if(clear){
            this.reset(true);
        }
    },

    /**
     * Stops the repair animation if it's currently running
     */
    stop : function(){
        if(this.anim && this.anim.isAnimated && this.anim.isAnimated()){
            this.anim.stop();
        }
    },

    /**
     * Displays this proxy
     */
    show : function(){
        this.el.show();
    },

    /**
     * Force the Layer to sync its shadow and shim positions to the element
     */
    sync : function(){
        this.el.sync();
    },

    /**
     * Causes the proxy to return to its position of origin via an animation.  Should be called after an
     * invalid drop operation by the item being dragged.
     * @param {Array} xy The XY position of the element ([x, y])
     * @param {Function} callback The function to call after the repair is complete.
     * @param {Object} scope The scope (<code>this</code> reference) in which the callback function is executed. Defaults to the browser window.
     */
    repair : function(xy, callback, scope){
        this.callback = callback;
        this.scope = scope;
        if (xy && this.animRepair !== false) {
            this.el.addCls(Ext.baseCSSPrefix + 'dd-drag-repair');
            this.el.hideUnders(true);
            this.anim = this.el.animate({
                duration: this.repairDuration || 500,
                easing: 'ease-out',
                to: {
                    x: xy[0],
                    y: xy[1]
                },
                stopFx: true,
                callback: this.afterRepair,
                scope: this
            });
        } else {
            this.afterRepair();
        }
    },

    // private
    afterRepair : function(){
        this.hide(true);
        if(typeof this.callback == "function"){
            this.callback.call(this.scope || this);
        }
        this.callback = null;
        this.scope = null;
    },
    
    destroy: function(){
        Ext.destroy(this.ghost, this.el);    
    }
});