/**
 * @class Ext.grid.PagingScroller
 * @extends Ext.grid.Scroller
 *
 * @private
 */
Ext.define('Ext.grid.PagingScroller', {
    extend: 'Ext.grid.Scroller',
    alias: 'widget.paginggridscroller',
    renderTpl: null,
    tpl: [
        '<tpl for="pages">',
            '<div class="' + Ext.baseCSSPrefix + 'stretcher" style="width: {width}px;height: {height}px;"></div>',
        '</tpl>'
    ],
    /**
     * @cfg {Number} percentageFromEdge This is a number above 0 and less than 1 which specifies
     * at what percentage to begin fetching the next page. For example if the pageSize is 100
     * and the percentageFromEdge is the default of 0.35, the paging scroller will prefetch pages
     * when scrolling up between records 0 and 34 and when scrolling down between records 65 and 99.
     */
    percentageFromEdge: 0.35,
    
    chunkSize: 50,
    snapIncrement: 25,
    
    syncScroll: true,
    
    initComponent: function() {
        
        var me = this,
            ds = me.store;
        if (Ext.isWebKit) {
            me.rowHeight = 21;
        } else if (Ext.isIE) {
            me.rowHeight = 20;
        } else {
            me.rowHeight = 22;
        }
        ds.on('guaranteedrange', this.onGuaranteedRange, this);
        this.callParent(arguments);
    },
    
    
    onGuaranteedRange: function(range, start, end) {
        var me = this,
            ds = me.store,
            rs;
        // this should never happen
        if (range.length && me.visibleStart < range[0].index) {
            return;
        }
        
        ds.loadRecords(range);

        if (!me.firstLoad) {
            if (me.rendered) {
                me.invalidate();
            } else {
                me.on('afterrender', this.invalidate, this, {single: true});
            }
            me.firstLoad = true;
        } else {
            // adjust to visible
            me.syncTo();
        }
    },
    
    syncTo: function() {
        var me = this,
            pnl = me.getPanel(),
            store = pnl.store,
            scrollerElDom = this.el.dom,
            rowOffset = me.visibleStart - store.guaranteedStart,
            scrollBy = rowOffset * me.rowHeight;
        
        if (scrollerElDom.scrollHeight - scrollerElDom.clientHeight - scrollerElDom.scrollTop === 0) {
            this.setViewScrollTop(scrollBy, true);
        } else {
            this.setRawViewScrollTop(scrollBy);
        }
    },
    
    // invalidate the scroller by creating a single stretcher for every page of data
    // that comes back
    invalidate: function() {
        if (this.el && this.el.dom) {
            var pages = [],
                pageCount = this.getPageData().pageCount,
                elDom = this.el.dom,
                size = this.getSizeCalculation(),
                i = 0;
                
            for (; i < pageCount; i++) {
                pages.push(size);
            }
            this.tpl.overwrite(this.getTargetEl(), {pages: pages});
            
            // BrowserBug: IE7
            // This makes the scroller enabled, when initially rendering.
            elDom.scrollTop = elDom.scrollTop;
        }
    },
    
    getPageData : function(){
        var panel = this.getPanel(),
            store = panel.store,
            totalCount = store.getTotalCount();
            
        return {
            total : totalCount,
            currentPage : store.currentPage,
            pageCount: Math.ceil(totalCount / store.pageSize),
            fromRecord: ((store.currentPage - 1) * store.pageSize) + 1,
            toRecord: Math.min(store.currentPage * store.pageSize, totalCount)
        };
    },
    
    onElScroll: function(e, t) {
        var me = this,
            panel = me.getPanel(),
            store = panel.store,
            pageSize = store.pageSize,
            guaranteedStart = store.guaranteedStart,
            guaranteedEnd = store.guaranteedEnd,
            totalCount = store.getTotalCount(),
            numFromEdge = Math.ceil(me.percentageFromEdge * store.pageSize),
            position = t.scrollTop,
            visibleStart = Math.floor(position / me.rowHeight),
            view = panel.down('tableview'),
            viewEl = view.el,
            visibleHeight = viewEl.getHeight(),
            visibleAhead = Math.ceil(visibleHeight / me.rowHeight),
            visibleEnd = visibleStart + visibleAhead,
            prevPage = Math.floor(visibleStart / store.pageSize),
            nextPage = Math.floor(visibleEnd / store.pageSize) + 2,
            lastPage = Math.ceil(totalCount / store.pageSize),
            //requestStart = visibleStart,
            requestStart = Math.floor(visibleStart / me.snapIncrement) * me.snapIncrement,
            requestEnd = requestStart + pageSize - 1;

        me.visibleStart = visibleStart;
        me.visibleEnd = visibleEnd;
        
        this.cancelLoad();        
        me.syncScroll = true;
        if (requestEnd > totalCount - 1) {
            if (store.rangeSatisfied(totalCount - pageSize, totalCount - 1)) {
                me.syncScroll = true;
            }
            store.guaranteeRange(totalCount - pageSize, totalCount - 1);
        // Out of range, need to reset the current data set
        } else if (visibleStart < guaranteedStart || visibleEnd > guaranteedEnd) {
            if (store.rangeSatisfied(requestStart, requestEnd)) {
                store.guaranteeRange(requestStart, requestEnd);
            } else {
                store.mask();
                me.attemptLoad(requestStart, requestEnd);
            }
            // dont sync the scroll view immediately, sync after the range has been guaranteed
            me.syncScroll = false;
        } else if (visibleStart < (guaranteedStart + numFromEdge) && prevPage > 0) {
            me.syncScroll = true;
            store.prefetchPage(prevPage);
        } else if (visibleEnd > (guaranteedEnd - numFromEdge) && nextPage < lastPage) {
            me.syncScroll = true;
            store.prefetchPage(nextPage);
        }


        if (me.syncScroll) {
            me.syncTo();
        }
    },
    
    attemptLoad: function(start, end) {
        if (!this.loadTask) {
            this.loadTask = new Ext.util.DelayedTask(this.doAttemptLoad, this, []);
        }
        this.loadTask.delay(100, this.doAttemptLoad, this, [start, end]);
    },
    
    cancelLoad: function() {
        if (this.loadTask) {
            this.loadTask.cancel();
        }
    },
    
    doAttemptLoad:  function(start, end) {
        var store = this.getPanel().store;
        store.guaranteeRange(start, end);
    },
    

    setRawViewScrollTop: function(scrollTop) {
        var owner = this.getPanel(),
            items = owner.query('tableview'),
            i = 0,
            len = items.length,
            center,
            centerEl,
            calcScrollTop = scrollTop,
            maxScrollTop,
            scrollerElDom = this.el.dom;
            
        center = items[1] || items[0];
        centerEl = center.el.dom;
        
        maxScrollTop = (centerEl.scrollHeight - centerEl.clientHeight);
        if (maxScrollTop === 0) {
            return;
        }
        if (calcScrollTop > maxScrollTop) {
            //throw "Calculated scrollTop was larger than maxScrollTop";
            return;
            calcScrollTop = maxScrollTop;
        }
        for (; i < len; i++) {
            items[i].el.dom.scrollTop = calcScrollTop;
        }
    },
    
    setViewScrollTop: function(scrollTop, useMax) {
        var owner = this.getPanel(),
            items = owner.query('tableview'),
            i = 0,
            len = items.length,
            center,
            centerEl,
            calcScrollTop,
            maxScrollTop,
            scrollerElDom = this.el.dom;
            
        center = items[1] || items[0];
        centerEl = center.el.dom;
        
        maxScrollTop = ((owner.store.pageSize * this.rowHeight) - centerEl.clientHeight);
        calcScrollTop = (scrollTop % ((owner.store.pageSize * this.rowHeight) + 1));
        if (useMax) {
            calcScrollTop = maxScrollTop;
        }
        if (calcScrollTop > maxScrollTop) {
            //throw "Calculated scrollTop was larger than maxScrollTop";
            return;
            calcScrollTop = maxScrollTop;
        }
        for (; i < len; i++) {
            items[i].el.dom.scrollTop = calcScrollTop;
        }
    }
});

