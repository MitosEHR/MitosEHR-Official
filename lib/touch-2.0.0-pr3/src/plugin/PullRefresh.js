/**
 * This plugin adds pull to refresh functionality to the List.
 */
Ext.define('Ext.plugin.PullRefresh', {
    extend: 'Ext.Component',
    alias: 'plugin.pullrefresh',
    requires: ['Ext.DateExtras'],

    config: {
        /*
         * @accessor
         */
        list: null,

        /*
         * @cfg {String} pullRefreshText The text that will be shown while you are pulling down.
         * @accessor
         */
        pullRefreshText: 'Pull down to refresh...',

        /*
         * @cfg {String} releaseRefreshText The text that will be shown after you have pulled down enough to show the release message.
         * @accessor
         */
        releaseRefreshText: 'Release to refresh...',

        /*
         * @cfg {String} loadingText The text that will be shown while the list is refreshing.
         * @accessor
         */
        loadingText: 'Loading...',

        /*
         * @cfg {Number} snappingAnimationDuration The duration for snapping back animation after the data has been refreshed
         * @accessor
         */
        snappingAnimationDuration: 150,

        /*
         * @cfg {Function} refreshFn The function that will be called to refresh the list. If this is not defined, the store's load
         * @accessor
         * function will be called. The refresh function gets called with two parameters. The first one is the callback function
         * that should be called after your refresh is complete. The second one is a reference to this plugin instance.
         */
        refreshFn: null,

        /*
         * @cfg {XTemplate/String/Array} pullTpl The template being used for the pull to refresh markup.
         * @accessor
         */
        pullTpl: [
            '<div class="x-list-pullrefresh">',
                '<div class="x-list-pullrefresh-arrow"></div>',
//                '<div class="x-loading-spinner">',
//                    '<span class="x-loading-top"></span>',
//                    '<span class="x-loading-right"></span>',
//                    '<span class="x-loading-bottom"></span>',
//                    '<span class="x-loading-left"></span>',
//                '</div>',
                '<div class="x-list-pullrefresh-wrap">',
                    '<h3 class="x-list-pullrefresh-message">{message}</h3>',
                    '<div class="x-list-pullrefresh-updated">Last Updated: <span>{lastUpdated:date("m/d/Y h:iA")}</span></div>',
                '</div>',
            '</div>'
        ].join('')
    },

    isRefreshing: false,
    isLoading: false,
    currentViewState: '',

    initialize: function() {
        this.callParent();

        this.on({
            painted: 'onPainted',
            scope: this
        });
    },

    onPainted: function() {
        this.pullHeight = this.loadingElement.getHeight();
    },

    init: function(list) {
        var pullTpl = this.getPullTpl(),
            element = this.element,
            scroller = list.getScrollable().getScroller();

        this.setList(list);
        this.lastUpdated = new Date();

        this.getList().insert(0, this);

        if (!this.getRefreshFn()) {
            this.onLoadComplete.call(this);
        }

        list.onAfter('refresh', this.onLoadComplete, this);

        pullTpl.overwrite(element, {
            message: this.getPullRefreshText(),
            lastUpdated: this.lastUpdated
        }, true);

        this.loadingElement = element.getFirstChild();
        this.messageEl = element.down('.x-list-pullrefresh-message');
        this.updatedEl = element.down('.x-list-pullrefresh-updated > span');

        this.maxScroller = scroller.getMaxPosition();

        scroller.on({
            maxpositionchange: this.setMaxScroller,
            scroll: this.onScrollChange,
            scope: this
        });
    },

    setMaxScroller: function(scroller, position) {
        this.maxScroller = position;
    },

    onScrollChange: function(scroller, x, y) {
        if (y < 0) {
            this.onBounceTop(y);
        }
        if (y > this.maxScroller.y) {
            this.onBounceBottom(y);
        }
    },

    /**
     * @private
     */
    applyPullTpl: function(config) {
        return (Ext.isObject(config) && config.isTemplate) ? config : new Ext.XTemplate(config);
    },

    onBounceTop: function(y) {
        var list = this.getList(),
            scroller = list.getScrollable().getScroller();

        if (!this.isRefreshing && -y >= this.pullHeight) {
            this.isRefreshing = true;
            this.isLoading = true;

            scroller.minPosition.y = -this.pullHeight;
            this.setViewState('loading');

            if (this.refreshFn) {
                this.refreshFn.call(this, this.onLoadComplete, this);
            }
            else {
                list.getStore().load();
            }
        }
    },

    onBounceBottom: function(y) {
    },

    setViewState: function(state) {
        if (state === this.currentViewState) {
            return this;
        }
        this.currentViewState = state;

        var prefix = Ext.baseCSSPrefix,
            messageEl = this.messageEl,
            loadingElement = this.loadingElement;

        if (messageEl && loadingElement) {
            switch (state) {
                case 'pull':
                    messageEl.setHTML(this.getPullRefreshText());
                    loadingElement.removeCls([prefix + 'list-pullrefresh-release', prefix + 'list-pullrefresh-loading']);
                break;

                case 'release':
                    messageEl.setHTML(this.getReleaseRefreshText());
                    loadingElement.addCls(prefix + 'list-pullrefresh-release');
                break;

                case 'loading':
                    messageEl.setHTML(this.getLoadingText());
                    loadingElement.addCls(prefix + 'list-pullrefresh-loading');
                    break;
            }
        }

        return this;
    },

    /**
     * This function is called after the List has been refreshed. It resets the Pull to Refresh markup and
     * updates the last updated date. It also animates the pull to refresh markup away.
     * @private
     */
    onLoadComplete: function() {
        var list = this.getList(),
            scroller = list.getScrollable().getScroller();

        if (this.isLoading) {
            scroller.minPosition.y = 0;

            if (!scroller.isDragging) {
                this.resetRefreshState();
                scroller.scrollToAnimated(null, 0);
            }
            else {
                scroller.on({
                    scrollend: this.resetRefreshState,
                    single: true,
                    scope: this
                });
            }
        }
    },

    resetRefreshState: function() {
        this.isRefreshing = false;
        this.isLoading = false;
        this.lastUpdated = new Date();

        this.setViewState('pull');
        this.updatedEl.setHTML(Ext.util.Format.date(this.lastUpdated, "m/d/Y h:iA"));
    }
});