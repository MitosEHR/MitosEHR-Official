/**
 * @class Ext.FocusManager
 * @singleton

The FocusManager is responsible for globally:

1. Managing component focus
2. Providing basic keyboard navigation
3. (optional) Provide a visual cue for focused components, in the form of a focus ring/frame.

To activate the FocusManager, simply call {@link #enable `Ext.FocusManager.enable();`}. In turn, you may
deactivate the FocusManager by subsequently calling {@link #disable `Ext.FocusManager.disable();`}.  The
FocusManager is disabled by default.

To enable the optional focus frame, pass `true` or `{focusFrame: true}` to {@link #enable}.

 * @markdown
 */
Ext.define('Ext.FocusManager', {
    singleton: true,
    alternateClassName: 'Ext.FocusMgr',
    
    mixins: {
        observable: 'Ext.util.Observable'
    },
    
    requires: [
        'Ext.ComponentMgr',
        'Ext.ComponentQuery',
        'Ext.util.KeyNav'
    ],
    
    /**
     * @property {Boolean} enabled
     * Whether or not the FocusManager is currently enabled
     */
    enabled: false,
    
    /**
     * @property {Ext.Component} focusedCmp
     * The currently focused component. Defaults to `undefined`.
     * @markdown
     */
    
    focusElementCls: Ext.baseCSSPrefix + 'focus-element',
    
    focusFrameCls: Ext.baseCSSPrefix + 'focus-frame',
    
    // xtypes to ignore for input keys (backspace, del, left, right, up, down)
    whitelist: [
        'textfield'
    ],
    
    constructor: function() {
        var me = this,
            CQ = Ext.ComponentQuery;
        
        me.addEvents(
            /**
             * @event beforecomponentfocus
             * Fires before a component becomes focused. Return `false` to prevent
             * the component from gaining focus.
             * @param {Ext.FocusManager} fm A reference to the FocusManager singleton
             * @param {Ext.Component} cmp The component that is being focused
             * @param {Ext.Component} previousCmp The component that was previously focused,
             * or `undefined` if there was no previously focused component.
             * @markdown
             */
            'beforecomponentfocus',
            
            /**
             * @event componentfocus
             * Fires after a component becomes focused.
             * @param {Ext.FocusManager} fm A reference to the FocusManager singleton
             * @param {Ext.Component} cmp The component that has been focused
             * @param {Ext.Component} previousCmp The component that was previously focused,
             * or `undefined` if there was no previously focused component.
             * @markdown
             */
            'componentfocus',
            
            /**
             * @event disable
             * Fires when the FocusManager is disabled
             * @param {Ext.FocusManager} fm A reference to the FocusManager singleton
             */
            'disable',
            
            /**
             * @event enable
             * Fires when the FocusManager is enabled
             * @param {Ext.FocusManager} fm A reference to the FocusManager singleton
             */
            'enable'
        );
        
        // Subscribe to ComponentMgr's add event so we can hook into
        // any component that's created
        Ext.ComponentMgr.all.on('add', me.onComponentCreated, me);
        
        // Setup KeyNav that's bound to document to catch all
        // unhandled/bubbled key events for navigation
        me.keyNav = new Ext.util.KeyNav(Ext.getDoc(), {
            disabled: true,
            scope: me,
            
            backspace: me.focusLast,
            enter: me.navigateIn,
            esc: me.navigateOut,
            tab: me.navigateSiblings
            
            //space: me.navigateIn,
            //del: me.focusLast,
            //left: me.navigateSiblings,
            //right: me.navigateSiblings,
            //down: me.navigateSiblings,
            //up: me.navigateSiblings
        });
        
        me.focusData = {};
        
        // Setup some ComponentQuery pseudos
        Ext.apply(CQ.pseudos, {
            focusable: function(cmps) {
                var len = cmps.length,
                    results = [],
                    i = 0,
                    c,
                    
                    isFocusable = function(x) {
                        return x && x.focusable !== false && CQ.is(x, '[rendered]:not([disabled]){isVisible(true)}{el.isVisible()}');
                    };
                    
                for (; i < len; i++) {
                    c = cmps[i];
                    if (isFocusable(c)) {
                        results.push(c);
                    }
                }
                
                return results;
            },
            
            nextFocus: function(cmps, idx, step) {
                step = step || 1;
                idx = parseInt(idx, 10);
                
                var len = cmps.length,
                    i = idx + step,
                    c;
                    
                for (; i != idx; i += step) {
                    if (i >= len) {
                        i = 0;
                    } else if (i < 0) {
                        i = len - 1;
                    }
                    
                    c = cmps[i];
                    if (CQ.is(c, ':focusable')) {
                        return [c];
                    } else if (c.placeHolder && CQ.is(c.placeHolder, ':focusable')) {
                        return [c.placeHolder];
                    }
                }
                
                return [];
            },
            
            prevFocus: function(cmps, idx) {
                return this.nextFocus(cmps, idx, -1);
            },
            
            root: function(cmps) {
                var len = cmps.length,
                    results = [],
                    i = 0,
                    c;
                    
                for (; i < len; i++) {
                    c = cmps[i];
                    if (!c.ownerCt) {
                        results.push(c);
                    }
                }
                
                return results;
            }
        });
    },
    
    clearComponent: function(cmp) {
        clearTimeout(this.cmpFocusDelay);
        cmp.blur();
    },
    
    /**
     * Disables the FocusManager by turning of all automatic focus management and keyboard navigation
     */
    disable: function() {
        var me = this;
        
        if (!me.enabled) {
            return;
        }
        
        me.removeDOM();
        
        // Stop handling key navigation
        me.keyNav.disable();
        
        // disable focus for all components
        me.setFocusAll(false);
        
        me.enabled = false;
        me.fireEvent('disable', me);
    },
    
    /**
     * Enables the FocusManager by turning on all automatic focus management and keyboard navigation
     * @param {Boolean/Object} options Either `true`/`false` or an object of the following options:
        - focusFrame : Boolean
            `true` to show the focus frame around a component when it is focused.
     * @markdown
     */
    enable: function(options) {
        var me = this;
        
        if (options === true) {
            options = { focusFrame: true };
        }
        options = options || {};
        
        if (me.enabled) {
            return;
        }
        
        me.initDOM();
        
        if (!options.focusFrame) {
            me.focusFrame.addCls(Ext.baseCSSPrefix + 'hide-display');
        }
        
        me.enabled = true;
        
        // Start handling key navigation
        me.keyNav.enable();
        
        // enable focus for all components
        me.setFocusAll(true);
        
        // Finally, let's focus our global focus el so we start fresh
        me.focusEl.focus();
        delete me.focusedCmp;
        
        me.fireEvent('enable', me);
    },
    
    focusLast: function(e) {
        var me = this;
        
        if (me.isWhitelisted(me.focusedCmp)) {
            return true;
        }
        
        // Go back to last focused item
        if (me.previousFocusedCmp) {
            me.previousFocusedCmp.focus();
        }
    },
    
    getRootComponents: function() {
        var me = this,
            CQ = Ext.ComponentQuery,
            inline = CQ.query(':focusable:root:not([floating])'),
            floating = CQ.query(':focusable:root[floating]');
            
        // Floating items should go to the top of our root stack, and be ordered
        // by their z-index (highest first)
        floating.sort(function(a, b) {
            return a.el.getZIndex() > b.el.getZIndex();
        });
        
        return floating.concat(inline);
    },
    
    initDOM: function() {
        var me = this,
            sp = '&#160',
            cls = me.focusFrameCls;
            
        if (!Ext.isReady) {
            Ext.onReady(me.initDOM, me);
            return;
        }
        
        // Create global focus element
        me.focusEl = Ext.getBody().createChild({
            tabIndex: '-1',
            cls: me.focusElementCls,
            html: sp
        });
        
        // Create global focus frame
        me.focusFrame = Ext.getBody().createChild({
            cls: cls,
            children: [
                { cls: cls + '-top' },
                { cls: cls + '-bottom' },
                { cls: cls + '-left' },
                { cls: cls + '-right' }
            ],
            style: 'top: -100px; left: -100px;'
        });
        me.focusFrame.setVisibilityMode(Ext.core.Element.DISPLAY);
        me.focusFrameWidth = me.focusFrame.child('.' + cls + '-top').getHeight();
        me.focusFrame.hide().setLeftTop(0, 0);
    },
    
    isWhitelisted: function(cmp) {
        return cmp && Ext.Array.some(this.whitelist, function(x) {
            return cmp.isXType(x);
        });
    },
    
    navigateIn: function(e) {
        var me = this,
            focusedCmp = me.focusedCmp,
            rootCmps,
            firstChild;
        
        if (!focusedCmp) {
            // No focus yet, so focus the first root cmp on the page
            rootCmps = me.getRootComponents();
            if (rootCmps.length) {
                rootCmps[0].focus();
            }
        } else {
            // Drill into child ref items of the focused cmp, if applicable.
            // This works for any Component with a getRefItems implementation.
            firstChild = Ext.ComponentQuery.query('>:focusable', focusedCmp)[0];
            if (firstChild) {
                firstChild.focus();
            } else {
                // Let's try to fire a click event, as if it came from the mouse
                if (Ext.isFunction(focusedCmp.onClick)) {
                    e.button = 0;
                    focusedCmp.onClick(e);
                    focusedCmp.focus();
                }
            }
        }
    },
    
    navigateOut: function(e) {
        var me = this,
            parent;
        
        if (!me.focusedCmp || !(parent = me.focusedCmp.up())) {
            me.focusEl.focus();
            return;
        }
        
        parent.focus();
    },
    
    navigateSiblings: function(e, source, parent) {
        var me = this,
            src = source || me,
            key = e.getKey(),
            EO = Ext.EventObject,
            goBack = e.shiftKey || key == EO.LEFT || key == EO.UP,
            checkWhitelist = key == EO.LEFT || key == EO.RIGHT || key == EO.UP || key == EO.DOWN,
            nextSelector = goBack ? 'prev' : 'next',
            idx, next;
        
        focusedCmp = (src.focusedCmp && src.focusedCmp.comp) || src.focusedCmp;
        if (!focusedCmp && !parent) {
            return;
        }
        
        if (checkWhitelist && me.isWhitelisted(focusedCmp)) {
            return true;
        }
        
        parent = parent || focusedCmp.up();
        if (parent) {
            idx = focusedCmp ? Ext.Array.indexOf(parent.getRefItems(), focusedCmp) : -1;
            next = Ext.ComponentQuery.query('>:' + nextSelector + 'Focus(' + idx + ')', parent)[0];
            if (next) {
                next.focus();
            }
            
            return next;
        }
    },
    
    onComponentBlur: function(cmp, e) {
        var me = this;
        
        if (me.focusedCmp === cmp) {
            me.previousFocusedCmp = cmp;
            delete me.focusedCmp;
        }
        
        me.focusFrame.hide();
    },
    
    onComponentCreated: function(hash, idx, cmp) {
        this.setFocus(cmp, true);
    },
    
    onComponentFocus: function(cmp, e) {
        var me = this;
        
        if (!Ext.ComponentQuery.is(cmp, ':focusable')) {
            me.clearComponent(cmp);
            
            // Try to focus the parent instead
            var parent = cmp.up();
            if (parent) {
                parent.focus();
            }
            
            return;
        }
        
        // Defer focusing for 90ms so components can do a layout/positioning
        // and give us an ability to buffer focuses
        clearTimeout(me.cmpFocusDelay);
        if (arguments.length !== 2) {
            me.cmpFocusDelay = Ext.defer(me.onComponentFocus, 90, me, [cmp, e]);
            return;
        }
        
        if (me.fireEvent('beforecomponentfocus', me, cmp, me.previousFocusedCmp) === false) {
            me.clearComponent(cmp);
            return;
        }
        
        var cls = '.' + me.focusFrameCls + '-',
            ff = me.focusFrame,
            fw = me.focusFrameWidth;
        
        me.focusedCmp = cmp;
        
        var box = cmp.el.getPageBox();
        
        // Size the focus frame's t/b/l/r according to the box
        // This leaves a hole in the middle of the frame so user
        // interaction w/ the mouse can continue
        var bt = box.top,
            bl = box.left,
            bw = box.width,
            bh = box.height,
            ft = ff.child(cls + 'top'),
            fb = ff.child(cls + 'bottom'),
            fl = ff.child(cls + 'left'),
            fr = ff.child(cls + 'right');
        ft.setWidth(bw - 2).setLeftTop(bl + 1, bt);
        fb.setWidth(bw - 2).setLeftTop(bl + 1, bt + bh - fw);
        fl.setHeight(bh - 2).setLeftTop(bl, bt + 1);
        fr.setHeight(bh - 2).setLeftTop(bl + bw - fw, bt + 1);
        
        ff.show();
        
        me.fireEvent('componentfocus', me, cmp, me.previousFocusedCmp);
    },
    
    onComponentHide: function(cmp) {
        var me = this,
            CQ = Ext.ComponentQuery,
            focusedCmp,
            parent;
        
        if (me.focusedCmp) {
            focusedCmp = CQ.query('[id=' + me.focusedCmp.id + ']', cmp)[0];
            if (focusedCmp) {
                me.clearComponent(focusedCmp);
            }
        }
        
        me.clearComponent(cmp);
        
        parent = CQ.query('^:focusable', cmp)[0];
        if (parent) {
            parent.focus();
        }
    },
    
    removeDOM: function() {
        var me = this;
        
        Ext.destroy(
            me.focusEl,
            me.focusFrame
        );
        delete me.focusEl;
        delete me.focusFrame;
        delete me.focusFrameWidth;
    },
    
    setFocus: function(cmp, focusable) {
        var me = this;
        
        if (!me.enabled) {
            return;
        }
        
        // Come back and do this after the component is rendered
        if (!cmp.rendered) {
            cmp.on('afterrender', Ext.pass(me.setFocus, [cmp, focusable], me), me, { single: true });
            return;
        }
        
        var el = cmp.getFocusEl(),
            cls = Ext.baseCSSPrefix + 'focusable';
        
        // Decorate the component's focus el for focus-ability
        if ((focusable && !el.hasCls(cls)) || (!focusable && el.hasCls(cls))) {
            if (focusable) {
                el.addCls(cls);
                var data = {
                    tabIndex: el.dom.tabIndex
                };
                el.dom.tabIndex = '-1';
                el.on('focus', data.focusFn = Ext.bind(me.onComponentFocus, me, [cmp], 0), me);
                el.on('blur', data.blurFn = Ext.bind(me.onComponentBlur, me, [cmp], 0), me);
                cmp.on('hide', me.onComponentHide, me);
                cmp.on('close', me.onComponentHide, me);
                
                me.focusData[cmp.id] = data;
            } else {
                el.removeCls(cls);
                var data = me.focusData[cmp.id];
                el.dom.tabIndex = data.tabIndex;
                el.un('focus', data.focusFn, me);
                el.un('blur', data.blurFn, me);
                cmp.un('hide', me.onComponentHide, me);
                cmp.un('close', me.onComponentHide, me);
                
                delete me.focusData[cmp.id];
            }
        }
    },
    
    setFocusAll: function(focusable) {
        var me = this,
            cmps = Ext.ComponentMgr.all.getArray(),
            len = cmps.length,
            cmp,
            i = 0;
            
        for (; i < len; i++) {
            me.setFocus(cmps[i], focusable);
        }
    }
});
