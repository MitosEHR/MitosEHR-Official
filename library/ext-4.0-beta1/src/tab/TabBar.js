/**
 * @author Ed Spencer
 * @class Ext.tab.TabBar
 * @extends Ext.panel.Header
 * <p>TabBar is used internally by a {@link Ext.tab.TabPanel TabPanel} and wouldn't usually need to be created manually.</p>
 *
 * @xtype tabbar
 */
Ext.define('Ext.tab.TabBar', {
    extend: 'Ext.panel.Header',
    alias: 'widget.tabbar',
    baseCls: Ext.baseCSSPrefix + 'tab-bar',

    requires: [
        'Ext.tab.Tab',
        'Ext.FocusManager'
    ],

    // @private
    defaultType: 'tab',

    /**
     * @cfg Boolean plain
     * True to not show the full background on the tabbar
     */
    plain: false,

    // @private
    renderTpl: [
        '<div class="{baseCls}-body<tpl if="ui"> {baseCls}-body-{ui}</tpl>"<tpl if="bodyStyle"> style="{bodyStyle}"</tpl>></div>',
        '<div class="{baseCls}-strip<tpl if="ui"> {baseCls}-strip-{ui}</tpl>"></div>'
    ],

    /**
     * @cfg {Number} minTabWidth The minimum width for each tab. Defaults to <tt>30</tt>.
     */
    minTabWidth: 30,

    /**
     * @cfg {Number} maxTabWidth The maximum width for each tab. Defaults to <tt>undefined</tt>.
     */
    maxTabWidth: undefined,

    // @private
    initComponent: function() {
        var me = this,
            keys;

        if (me.plain) {
            me.ui = 'plain';
        }

        me.addEvents(
            /**
             * @event change
             * Fired when the currently-active tab has changed
             * @param {Ext.tab.TabBar} tabBar The TabBar
             * @param {Ext.Tab} tab The new Tab
             * @param {Ext.Component} card The card that was just shown in the TabPanel
             */
            'change'
        );

        Ext.applyIf(this.renderSelectors, {
            body : '.' + this.baseCls + '-body',
            strip: '.' + this.baseCls + '-strip'
        });
        me.callParent(arguments);

        // TabBar must override the Header's align setting.
        me.layout.align = (me.orientation == 'vertical') ? 'left' : 'top';
        me.layout.overflowHandler = Ext.create('Ext.layout.container.boxOverflow.Scroller', me.layout);
        me.layout.overflowHandler.on('scroll', me.updateStrip, me);
        me.items.removeAt(me.items.getCount() - 1);
        me.items.removeAt(me.items.getCount() - 1);
        
        // Subscribe to Ext.FocusManager for key navigation
        keys = me.orientation == 'vertical' ? ['up', 'down'] : ['left', 'right'];
        Ext.FocusManager.subscribe(me, {
            keys: keys
        });
    },

    // @private
    onAdd: function(tab) {
        var me = this,
            tabPanel = me.tabPanel,
            hasOwner = !!tabPanel;

        me.callParent(arguments);
        tab.position = me.dock;
        if (hasOwner) {
            tab.minWidth = tabPanel.minTabWidth;
        }
        else {
            tab.minWidth = me.minTabWidth + (tab.iconCls ? 25 : 0);
        }
        tab.maxWidth = me.maxTabWidth || (hasOwner ? tabPanel.maxTabWidth : undefined);
    },

    // @private
    afterRender: function() {
        var me = this;

        me.mon(me.el, {
            scope: me,
            click: me.onClick,
            delegate: '.' + Ext.baseCSSPrefix + 'tab'
        });
        me.callParent(arguments);
    },

    afterComponentLayout : function() {
        var me = this;

        me.callParent(arguments);
        me.updateStrip();
    },

    // @private
    onClick: function(e, target) {
        // The target might not be a valid tab el.
        var tab = Ext.getCmp(target.id),
            tabPanel = this.tabPanel;

        target = e.getTarget();

        if (tab && tab.isDisabled && !tab.isDisabled()) {
            if (tab.closable && target === tab.closeEl.dom) {
                tab.onCloseClick();
            } else {
                this.setActiveTab(tab);
                if (tabPanel) {
                    tabPanel.setActiveTab(tab.card);
                }
                tab.focus();
            }
        }
    },

    /**
     * @private
     * Closes the given tab by removing it from the TabBar and removing the corresponding card from the TabPanel
     * @param {Ext.Tab} tab The tab to close
     */
    closeTab: function(tab) {
        var card    = tab.card,
            tabPanel = this.tabPanel,
            nextTab;

        if (tab.active && this.items.getCount() > 1) {
            nextTab = tab.next('tab') || this.items.items[0];
            this.setActiveTab(nextTab);
            if (tabPanel) {
                tabPanel.setActiveTab(nextTab.card);
            }
        }
        this.remove(tab);

        if (tabPanel && card) {
            tabPanel.remove(card);
        }
        
        if (nextTab) {
            nextTab.focus();
        }
    },

    /**
     * @private
     * Marks the given tab as active
     * @param {Ext.Tab} tab The tab to mark active
     */
    setActiveTab: function(tab) {
        if (tab.disabled) {
            return;
        }
        var me = this;

        if (me.rendered) {
            if (me.activeTab) {
                me.activeTab.deactivate();
            }
            tab.activate();
            me.layout.layout();
            tab.el.scrollIntoView(me.layout.getRenderTarget());
        }
        me.activeTab = tab;
        me.updateStrip();
        me.fireEvent('change', me, tab, tab.card);
    },
    
    /**
     * @private
     * Makes the strip border move under the active tab.
     */
    updateStrip: function() {
        var me = this,
            stripBorder,
            activeTab = me.activeTab,
            top = (me.dock == 'top');

        // @TODO: clean up this super nasty (really nasty) uber nasty hack
        Ext.defer(function() {
            if (me.rendered && activeTab && activeTab.rendered) {
                me.strip.setWidth(me.el.getWidth());
                if (!me.stripBorder) {
                    me.stripBorder = me.body.createChild({
                        cls: me.baseCls + '-strip-border'
                    });
                }
                me.stripBorder.setWidth(activeTab.getWidth());
                me.stripBorder.alignTo(activeTab.el, (top ? 'bl' : 'tl'));
            }
        }, 1);
    }
});