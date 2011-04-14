/**
 * @class FeedViewer.FeedPost
 * @extends Ext.panel.Panel
 *
 * Shows the detail of a feed post
 *
 * @constructor
 * Create a new Feed Post
 * @param {Object} config The config object
 */
Ext.define('FeedViewer.FeedPost', {

    extend: 'Ext.panel.Panel',
    requires: ['Ext.util.KeyNav'],
    alias: 'widget.feedpost',
    cls: 'preview',
    autoScroll: true,

    initComponent: function(){
        Ext.apply(this, {
            dockedItems: [this.createToolbar()],
            tpl: Ext.create('Ext.XTemplate',
                '<div class="post-data">',
                    '<span class="post-date">{pubDate:this.formatDate}</span>',
                    '<h3 class="post-title">{title}</h3>',
                    '<h4 class="post-author">by {author:this.defaultValue}</h4>',
                '</div>',
                '<div class="post-body">{content:this.getBody}</div>',
                {
                    getBody: function(value, all){
                        return Ext.util.Format.stripScripts(value);
                    },

                    defaultValue: function(v){
                        return v ? v : 'Unknown';
                    },

                    formatDate: function(value){
                        if (!value) {
                            return '';
                        }
                        return Ext.Date.format(value, 'M j, Y, g:i a');
                    }
                }
             )
        });
        this.callParent(arguments);
    },

    afterRender: function() {
        this.callParent(arguments);
        this.keyNav = Ext.create('Ext.util.KeyNav', this.el, {
            down: this.onNavKey,
            up: this.onNavKey,
            pageUp: this.onNavKey,
            pageDown: this.onNavKey,
            space: this.onNavKey,
            scope: this
        });
    },

    onDestroy: function() {
        Ext.destroy(this.keyNav);
        delete this.keyNav;
        this.callParent(arguments);
    },

    onNavKey: function(e) {
        var body = this.body,
            fs = parseInt(body.getStyle('font-size'), 10) + 10,
            height = body.getHeight(),
            amount = 0,
            dir = 'b';

        switch (e.getKey()) {
            case Ext.EventObject.DOWN:
                amount = fs;
                break;
            case Ext.EventObject.UP:
                amount = fs;
                dir = 't';
                break;
            case Ext.EventObject.PAGE_DOWN:
            case Ext.EventObject.SPACE:
                amount = height;
                break;
            case Ext.EventObject.PAGE_UP:
                amount = height;
                dir = 't';
                break;
        }

        body.scroll(dir, amount);
    },

    /**
     * Set the active post
     * @param {Ext.data.Model} rec The record
     */
    setActive: function(rec) {
        this.active = rec;
        this.update(rec.data);
    },

    /**
     * Create the top toolbar
     * @private
     * @return {Ext.toolbar.Toolbar} toolbar
     */
    createToolbar: function(){
        var items = [];
        if (!this.inTab) {
            items.push({
                scope: this,
                handler: this.openTab,
                text: 'View in new tab',
                iconCls: 'tab-new'
            }, '-');
        }
        items.push({
            scope: this,
            handler: this.goToPost,
            text: 'Go to post',
            iconCls: 'post-go'
        });
        return Ext.create('widget.toolbar', {
            items: items
        });
    },

    /**
     * Navigate to the active post in a new window
     * @private
     */
    goToPost: function(){
        window.open(this.active.get('link'));
    },

    /**
     * Open the post in a new tab
     * @private
     */
    openTab: function(){
        this.fireEvent('opentab', this, this.active);
    }

});
