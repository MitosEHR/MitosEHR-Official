/**
 * @class Ext.ux.TabCloseMenu
 * @extends Object 
 * Plugin (ptype = 'tabclosemenu') for adding a close context menu to tabs. Note that the menu respects
 * the closable configuration on the tab. As such, commands like remove others and remove all will not
 * remove items that are not closable.
 * 
 * @constructor
 * @param {Object} config The configuration options
 * @ptype tabclosemenu
 */
Ext.define('Ext.tab.TabCloseMenu', {
    alias: 'widget.tabclosemenu',
    alternateClassName: 'Ext.ux.TabCloseMenu',
    extend: 'Ext.util.Observable',
    /**
     * @cfg {String} closeTabText
     * The text for closing the current tab. Defaults to <tt>'Close Tab'</tt>.
     */
    closeTabText: 'Close Tab',
    
    /**
     * @cfg {Boolean} showCloseOthers
     * Indicates whether to show the 'Close Others' option. Defaults to <tt>true</tt>. 
     */
    showCloseOthers: true,
    
    /**
     * @cfg {String} closeOtherTabsText
     * The text for closing all tabs except the current one. Defaults to <tt>'Close Other Tabs'</tt>.
     */
    closeOthersTabsText: 'Close Other Tabs',
    
    /**
     * @cfg {Boolean} showCloseAll
     * Indicates whether to show the 'Close All' option. Defaults to <tt>true</tt>. 
     */
    showCloseAll: true,
    
    /**
     * @cfg {String} closeAllTabsText
     * <p>The text for closing all tabs. Defaults to <tt>'Close All Tabs'</tt>.
     */
    closeAllTabsText: 'Close All Tabs',
    
    //public
    init : function(tabpanel){
        this.tabPanel = tabpanel;
        this.tabBar = tabpanel.down("tabbar");

        this.mon(this.tabPanel, {
            scope: this,
            afterrender: this.onAfterRender
        });
    },
    
    onAfterRender: function() {
        this.mon(this.tabBar.el, {
            scope: this,
            contextmenu: this.onContextMenu,
            delegate: 'div.x-tab'
        });
    },
    
    onBeforeDestroy : function(){
        Ext.destroy(this.menu);
        this.callParent(arguments);
    },

    // private
    onContextMenu : function(event, target){
        var me = this,
            menu = me.createMenu(),
            disableAll = true,
            disableOthers = true,
            closeAll = menu.child('*[text="' + me.closeAllTabsText + '"]'),
            tab = me.tabBar.getChildByElement(target),
            index = me.tabBar.items.indexOf(tab);
        
        me.item = me.tabPanel.getComponent(index);
        menu.child('*[text="' + me.closeTabText + '"]').setDisabled(!me.item.closable);
        
        me.tabPanel.items.each(function(item){
            if (item.closable) {
                disableAll = false;
                if(item != me.item){
                    disableOthers = false;
                    return false;
                }
            }
        });
        
        menu.child('*[text="' + me.closeOthersTabsText + '"]').setDisabled(disableOthers);
        if(closeAll){
            closeAll.setDisabled(disableAll);
        }
        
        event.preventDefault();
        menu.showAt(event.getXY());
    },
    
    createMenu : function(){
        if(!this.menu){
            var items = [{
                text: this.closeTabText,
                scope: this,
                handler: this.onClose
            }];
            if (this.showCloseAll || this.showCloseOthers) {
                items.push('-');
            }
            if (this.showCloseOthers) {
                items.push({
                    text: this.closeOthersTabsText,
                    scope: this,
                    handler: this.onCloseOthers
                });
            }
            if (this.showCloseAll) {
                items.push({
                    text: this.closeAllTabsText,
                    scope: this,
                    handler: this.onCloseAll
                });
            }
            this.menu = new Ext.menu.Menu({
                items: items
            });
        }
        return this.menu;
    },
    
    onClose : function(){
        this.tabPanel.remove(this.item);
    },
    
    onCloseOthers : function(){
        this.doClose(true);
    },
    
    onCloseAll : function(){
        this.doClose(false);
    },
    
    doClose : function(excludeActive){
        var items = [];
        
        this.tabPanel.items.each(function(item){
            if(item.closable){
                if(!excludeActive || item != this.item){
                    items.push(item);
                }
            }
        }, this);
        
        Ext.each(items, function(item){
            this.tabPanel.remove(item);
        }, this);
    }
});