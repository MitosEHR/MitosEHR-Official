/**
 * @author Ed Spencer
 * @class Ext.tab.Tab
 * @extends Ext.button.Button
 * 
 * <p>Represents a single Tab in a TabPanel. A Tab is simply a slightly customized {@link Ext.button.Button Button}, 
 * styled to look like a tab. Tabs are optionally closable, and can also be disabled. 99% of the time you will not
 * need to create Tabs manually as the framework does so automatically when you use a {@link Ext.tab.TabPanel TabPanel}</p>
 *
 * @xtype tab
 */
Ext.define('Ext.tab.Tab', {
    extend: 'Ext.button.Button',
    alias: 'widget.tab',

    isTab: true,

    baseCls: Ext.baseCSSPrefix + 'tab',

    /**
     * @cfg {String} pressedCls
     * The CSS class to be applied to a Tab when it is pressed. Defaults to 'x-tab-pressed'.
     * Providing your own CSS for this class enables you to customize the pressed state.
     */
    pressedCls: Ext.baseCSSPrefix + 'tab-pressed',

    /**
     * @cfg {String} activeCls
     * The CSS class to be applied to a Tab when it is active. Defaults to 'x-tab-active'.
     * Providing your own CSS for this class enables you to customize the active state.
     */
    activeCls: Ext.baseCSSPrefix + 'tab-active',
    
    /**
     * @cfg {String} disabledCls
     * The CSS class to be applied to a Tab when it is disabled. Defaults to 'x-tab-disabled'.
     */
    disabledCls: Ext.baseCSSPrefix + 'tab-disabled',

    /**
     * @cfg {String} closableCls
     * The CSS class which is added to the tab when it is closable
     */
    closableCls: Ext.baseCSSPrefix + 'tab-closable',

    /**
     * @cfg {Boolean} closable True to make the Tab start closable (the close icon will be visible). Defaults to true
     */
    closable: true,

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
        me.setClosable(me.closable);

        if (me.card) {
            me.setCard(me.card);
        }
    },

    /**
     * @ignore
     */
    onRender: function() {
        var me = this;
        me.ui = me.position;
        if (me.active) {
            me.activate(true);
        }
        me.callParent(arguments);
    },

    /**
     * Sets the tab as either closable or not
     * @param {Boolean} closable Pass false to make the tab not closable. Otherwise the tab will be made closable (eg a
     * close button will appear on the tab)
     */
    setClosable: function(closable) {
        var me  = this,
            cls = me.closableCls;

        // Closable must be true if no args
        closable = !arguments.length || !!closable;
        me.closable = closable;

        if (closable) {
            me.addCls(cls);
        } else {
            me.removeCls(cls);
        }
 
        // Tab will change width to accommodate close icon
        me.ownerCt && me.ownerCt.doLayout();
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
        me.setIconClass(me.iconCls || card.iconCls);
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

    // @private
    activate : function(supressEvent) {
        var me = this;

        me.active = true;
        me.addCls(me.activeCls, me.baseCls + '-' + me.ui + '-active');
        if (supressEvent !== true) {
            me.fireEvent('activate', me);
        }
    },

    // @private
    deactivate : function(supressEvent) {
        var me = this;

        me.active = false;
        me.removeCls(me.activeCls, me.baseCls + '-' + me.ui + '-active');
        if (supressEvent !== true) {
            me.fireEvent('deactivate', me);
        }
    }
});