/**
 * @class Ext.tip.QuickTip
 * @extends Ext.tip.ToolTip
 * A specialized tooltip class for tooltips that can be specified in markup and automatically managed by the global
 * {@link Ext.tip.QuickTips} instance.  See the QuickTips class header for additional usage details and examples.
 * @constructor
 * Create a new Tip
 * @param {Object} config The configuration options
 * @xtype quicktip
 */
Ext.define('Ext.tip.QuickTip', {
    extend: 'Ext.tip.ToolTip',
    alias: 'widget.quicktip',
    alternateClassName: 'Ext.QuickTip',
    /**
     * @cfg {Mixed} target The target HTMLElement, Ext.core.Element or id to associate with this Quicktip (defaults to the document).
     */
    /**
     * @cfg {Boolean} interceptTitles True to automatically use the element's DOM title value if available (defaults to false).
     */
    interceptTitles : false,

    // Force creation of header Component
    title: '&#160;',

    // private
    tagConfig : {
        namespace : "ext",
        attribute : "qtip",
        width : "qwidth",
        target : "target",
        title : "qtitle",
        hide : "hide",
        cls : "qclass",
        align : "qalign",
        anchor : "anchor"
    },

    // private
    initComponent : function(){
        var me = this;
        
        me.target = me.target || Ext.getDoc();
        me.targets = me.targets || {};
        me.callParent();
    },

    /**
     * Configures a new quick tip instance and assigns it to a target element.  The following config values are
     * supported (for example usage, see the {@link Ext.tip.QuickTips} class header):
     * <div class="mdetail-params"><ul>
     * <li>autoHide</li>
     * <li>cls</li>
     * <li>dismissDelay (overrides the singleton value)</li>
     * <li>target (required)</li>
     * <li>text (required)</li>
     * <li>title</li>
     * <li>width</li></ul></div>
     * @param {Object} config The config object
     */
    register : function(config){
        var configs = Ext.isArray(config) ? config : arguments,
            i = 0,
            len = configs.length,
            target, j, targetLen;
            
        for (; i < len; i++) {
            config = configs[i];
            target = config.target;
            if (target) {
                if (Ext.isArray(target)) {
                    for (j = 0, targetLen = target.length; j < targetLen; j++) {
                        this.targets[Ext.id(target[j])] = config;
                    }
                } else{
                    this.targets[Ext.id(target)] = config;
                }
            }
        }
    },

    /**
     * Removes this quick tip from its element and destroys it.
     * @param {String/HTMLElement/Element} el The element from which the quick tip is to be removed.
     */
    unregister : function(el){
        delete this.targets[Ext.id(el)];
    },
    
    /**
     * Hides a visible tip or cancels an impending show for a particular element.
     * @param {String/HTMLElement/Element} el The element that is the target of the tip.
     */
    cancelShow: function(el){
        var me = this,
            activeTarget = me.activeTarget;
            
        el = Ext.get(el).dom;
        if (me.isVisible()) {
            if (activeTarget && activeTarget.el == el) {
                me.hide();
            }
        } else if (activeTarget && activeTarget.el == el) {
            me.clearTimer('show');
        }
    },
    
    getTipCfg: function(e) {
        var t = e.getTarget(), 
            ttp, 
            cfg;
            
        if(this.interceptTitles && t.title && Ext.isString(t.title)){
            ttp = t.title;
            t.qtip = ttp;
            t.removeAttribute("title");
            e.preventDefault();
        }else{
            cfg = this.tagConfig;
            ttp = t.qtip || Ext.fly(t).getAttribute(cfg.attribute, cfg.namespace);
        }
        return ttp;
    },

    // private
    onTargetOver : function(e){
        var me = this,
            target = e.getTarget(),
            elTarget,
            cfg,
            ns,
            ttp,
            autoHide;
            
        if (me.disabled) {
            return;
        }
        
        me.targetXY = e.getXY();
        if(!target || target.nodeType !== 1 || target == document || target == document.body){
            return;
        }
        
        if (me.activeTarget && ((target == me.activeTarget.el) || Ext.fly(me.activeTarget.el).contains(target))) {
            me.clearTimer('hide');
            me.show();
            return;
        }

        if (target && me.targets[target.id]) {
            me.activeTarget = me.targets[target.id];
            me.activeTarget.el = target;
            me.anchor = me.activeTarget.anchor;
            if (me.anchor) {
                me.anchorTarget = target;
            }
            me.delayShow();
            return;
        }
        elTarget = Ext.fly(target); 
        cfg = me.tagConfig;
        ns = cfg.namespace; 
        ttp = me.getTipCfg(e);
        
        if (ttp) {
            autoHide = elTarget.getAttribute(cfg.hide, ns);
                 
            me.activeTarget = {
                el: target,
                text: ttp,
                width: +elTarget.getAttribute(cfg.width, ns) || null,
                autoHide: autoHide != "user" && autoHide !== 'false',
                title: elTarget.getAttribute(cfg.title, ns),
                cls: elTarget.getAttribute(cfg.cls, ns),
                align: elTarget.getAttribute(cfg.align, ns)
                
            };
            me.anchor = elTarget.getAttribute(cfg.anchor, ns);
            if (me.anchor) {
                me.anchorTarget = target;
            }
            me.delayShow();
        }
    },

    // private
    onTargetOut : function(e){
        var me = this;
        
        // If moving within the current target, and it does not have a new tip, ignore the mouseout
        if (me.activeTarget && e.within(me.activeTarget.el) && !me.getTipCfg(e)) {
            return;
        }

        me.clearTimer('show');
        if (me.autoHide !== false) {
            me.delayHide();
        }
    },

    // inherit docs
    showAt : function(xy){
        var me = this,
            target = me.activeTarget;
        
        if (target) {
            if (!me.rendered) {
                me.render(Ext.getBody());
                me.activeTarget = target;
            }
            if (target.title) {
                me.setTitle(target.title || '');
                me.header.show();
            } else {
                me.header.hide();
            }
            me.body.update(target.text);
            me.autoHide = target.autoHide;
            me.dismissDelay = target.dismissDelay || me.dismissDelay;
            if (me.lastCls) {
                me.el.removeCls(me.lastCls);
                delete me.lastCls;
            }
            if (target.cls) {
                me.el.addCls(target.cls);
                me.lastCls = target.cls;
            }

            me.setWidth(target.width);
            
            if (me.anchor) {
                me.constrainPosition = false;
            } else if (target.align) { // TODO: this doesn't seem to work consistently
                xy = me.el.getAlignToXY(target.el, target.align);
                me.constrainPosition = false;
            }else{
                me.constrainPosition = true;
            }
        }
        me.callParent([xy]);
    },

    // inherit docs
    hide: function(){
        delete this.activeTarget;
        this.callParent();
    }
});
