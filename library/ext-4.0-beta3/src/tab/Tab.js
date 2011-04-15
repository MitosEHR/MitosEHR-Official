/**
 * @author Ed Spencer
 * @class Ext.tab.Tab
 * @extends Ext.button.Button
 * 
 * <p>Represents a single Tab in a {@link Ext.tab.TabPanel TabPanel}. A Tab is simply a slightly customized {@link Ext.button.Button Button}, 
 * styled to look like a tab. Tabs are optionally closable, and can also be disabled. 99% of the time you will not
 * need to create Tabs manually as the framework does so automatically when you use a {@link Ext.tab.TabPanel TabPanel}</p>
 *
 * @xtype tab
 */
Ext.define('Ext.tab.Tab', {
    extend: 'Ext.button.Button',
    alias: 'widget.tab',
    
    requires: ['Ext.util.KeyNav'],

    isTab: true,

    baseCls: Ext.baseCSSPrefix + 'tab',

    /**
     * @cfg {String} pressedCls
     * The CSS class to be applied to a Tab when it is pressed. Defaults to 'x-tab-pressed'.
     * Providing your own CSS for this class enables you to customize the pressed state.
     */

    /**
     * @cfg {String} activeCls
     * The CSS class to be applied to a Tab when it is active. Defaults to 'x-tab-active'.
     * Providing your own CSS for this class enables you to customize the active state.
     */
    
    /**
     * @cfg {String} disabledCls
     * The CSS class to be applied to a Tab when it is disabled. Defaults to 'x-tab-disabled'.
     */

    /**
     * @cfg {String} closableCls
     * The CSS class which is added to the tab when it is closable
     */

    /**
     * @cfg {Boolean} closable True to make the Tab start closable (the close icon will be visible). Defaults to true
     */
    closable: true,

    /**
     * @cfg {String} closeText 
     * The accessible text label for the close button link; only used when {@link #closable} = true.
     * Defaults to 'Close Tab'.
     */
    closeText: 'Close Tab',

    /**
     * @property Boolean
     * Read-only property indicating that this tab is currently active. This is NOT a public configuration.
     */
    active: false,

    /**
     * @property closable
     * @type Boolean
     * True if the tab is currently closable
     */

    scale: false,

    position: 'top',
    
    initComponent: function() {
        var me = this;

        me.addEvents(
            /**
             * @event activate
             * @param {Ext.tab.Tab} this
             */
            'activate',

            /**
             * @event deactivate
             * @param {Ext.tab.Tab} this
             */
            'deactivate',

            /**
             * @event beforeclose
             * Fires if the user clicks on the Tab's close button, but before the {@link #close} event is fired. Return
             * false from any listener to stop the close event being fired
             * @param {Ext.tab.Tab} tab The Tab object
             */
            'beforeclose',

            /**
             * @event beforeclose
             * Fires to indicate that the tab is to be closed, usually because the user has clicked the close button.
             * @param {Ext.tab.Tab} tab The Tab object
             */
            'close'
        );
        
        me.callParent(arguments);

        if (me.card) {
            me.setCard(me.card);
        }
    },

    /**
     * @ignore
     */
    onRender: function() {
        var me = this;
        me.ui = [me.ui + '-' + me.position, me.position];
        
        // Set all the state classNames, as they need to include the UI
        me.pressedCls = me.getClsWithUIs('pressed');
        me.activeCls = me.getClsWithUIs('active');
        me.disabledCls = me.getClsWithUIs('disabled');
        me.closableCls = me.getClsWithUIs('closable');

        me.setClosable(me.closable);
        me.callParent(arguments);
        
        if (me.active) {
            me.activate(true);
        }
        
        if (me.closable) {
            me.closeEl = me.el.createChild({
                tag: 'a',
                cls: me.baseCls + '-close-btn',
                href: '#',
                html: me.closeText,
                title: me.closeText
            }).on('click', Ext.EventManager.preventDefault);
        }
        
        me.keyNav = Ext.create('Ext.util.KeyNav', me.el, {
            enter: me.onEnterKey,
            del: me.onDeleteKey,
            scope: me
        });
    },
    
    /**
     * @ignore
     */
    onDestroy: function() {
        var me = this;
        Ext.destroy(me.keyNav);
        delete me.keyNav;
        me.callParent(arguments);
    },

    /**
     * Sets the tab as either closable or not
     * @param {Boolean} closable Pass false to make the tab not closable. Otherwise the tab will be made closable (eg a
     * close button will appear on the tab)
     */
    setClosable: function(closable) {
        var me  = this;
            // cls = me.getClsWithUIs(me.closableCls),
            // cls2 = me.getClsWithUIs(me.closableCls + '-' + me.position);

        // Closable must be true if no args
        closable = !arguments.length || !!closable;
        me.closable = closable;

        if (closable) {
            me.addCls(me.closableCls);
        } else {
            me.removeCls(me.closableCls);
        }
 
        // Tab will change width to accommodate close icon
        if (me.ownerCt && me.rendered) {
            me.ownerCt.doLayout();
        }
    },

    /**
     * Sets this tab's attached card. Usually this is handled automatically by the {@link Ext.tab.TabPanel} that this Tab
     * belongs to and would not need to be done by the developer
     * @param {Ext.Component} card The card to set
     */
    setCard: function(card) {
        var me = this;

        me.card = card;
        me.setText(me.title || card.title);
        me.setIconCls(me.iconCls || card.iconCls);
    },

    /**
     * @private
     * Listener attached to click events on the Tab's close button
     */
    onCloseClick: function() {
        var me = this;

        if (me.fireEvent('beforeclose', me) !== false) {
            if (me.tabBar) {
                me.tabBar.closeTab(me);
            }

            me.fireEvent('close', me);
        }
    },
    
    /**
     * @private
     */
    onEnterKey: function(e) {
        var me = this;
        
        if (me.tabBar) {
            me.tabBar.onClick(e, me.el);
        }
    },
    
   /**
     * @private
     */
    onDeleteKey: function(e) {
        var me = this;
        
        if (me.closable) {
            me.onCloseClick();
        }
    },
    
    // @private
    activate : function(supressEvent) {
        var me = this;
        
        me.active = true;
        me.addCls(me.activeCls);

        if (supressEvent !== true) {
            me.fireEvent('activate', me);
        }
    },

    // @private
    deactivate : function(supressEvent) {
        var me = this;
        
        me.active = false;
        me.removeCls(me.activeCls);
        
        if (supressEvent !== true) {
            me.fireEvent('deactivate', me);
        }
    }
});
