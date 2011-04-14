/**
 * @class Ext.data.BufferStore
 * @extends Ext.data.Store
 * @ignore
 */
Ext.define('Ext.data.BufferStore', {
    extend: 'Ext.data.Store',
    alias: 'store.buffer',
    sortOnLoad: false,
    filterOnLoad: false,
    /**
     * @cfg {Number} purgePageCount The number of pages to keep in the cache before purging additional records. A value of 0 indicates to never purge the prefetched data.
     */
    purgePageCount: 5,
    
    constructor: function() {
        // key is by index rather than internalId
        this.prefetchData = Ext.create('Ext.util.MixedCollection', false, function(record) {
            return record.index;
        });
        this.pendingRequests = [];
        this.pagesRequested = [];

        this.callParent(arguments);
    },
    
    /**
     * Loads the Store using its configured {@link #proxy}.
     * @param {Object} options Optional config object. This is passed into the {@link Ext.data.Operation Operation}
     * object that is created and then sent to the proxy's {@link Ext.data.proxy.Proxy#read} function
     */
    prefetch: function(options) {
        var me = this,
            operation,
            requestId = this.getRequestId();

        options = options || {};

        Ext.applyIf(options, {
            action : 'read',
            filters: me.filters.items,
            sorters: me.sorters.items,
            requestId: requestId
        });
        this.pendingRequests.push(requestId);

        operation = Ext.create('Ext.data.Operation', options);

        // HACK to implement loadMask support.
        //if (operation.blocking) {
        //    me.fireEvent('beforeload', me, operation);
        //}
        if (me.fireEvent('beforeprefetch', me, operation) !== false) {
            me.loading = true;
            me.proxy.read(operation, me.onProxyPrefetch, me);
        }
        
        return me;
    },
    
    prefetchPage: function(page, opts) {
        var me = this,
            pageSize = me.pageSize,
            start = (page - 1) * me.pageSize,
            end = start + pageSize;
        
        // Currently not requesting this page and range isn't already satisified 
        if (Ext.Array.indexOf(this.pagesRequested, page) === -1 && !this.rangeSatisfied(start, end)) {
            opts = opts || {};
            this.pagesRequested.push(page);
            Ext.applyIf(opts, {
                page : page,
                start: start,
                limit: pageSize,
                callback: me.onWaitForGuarantee,
                scope: me
            });
            
            me.prefetch(opts);
        }
        
    },
    
    /**
     * Returns a unique requestId to track requests.
     * @private
     */
    getRequestId: function() {
        this.requestSeed = this.requestSeed || 1;
        return this.requestSeed++;
    },
    
    onProxyPrefetch: function(operation) {
        var me         = this,
            resultSet  = operation.getResultSet(),
            records    = operation.getRecords(),
            
            successful = operation.wasSuccessful();
        
        if (resultSet) {
            me.totalCount = resultSet.total;
            me.fireEvent('totalcountchange', me.totalCount);
        }
        
        if (successful) {
            me.cacheRecords(records, operation);
        }
        Ext.Array.remove(this.pendingRequests, operation.requestId);
        if (operation.page) {
            Ext.Array.remove(this.pagesRequested, operation.page);
        }
        
        me.loading = false;
        me.fireEvent('prefetch', me, records, successful, operation);
        
        // HACK to support loadMask
        if (operation.blocking) {
            me.fireEvent('load', me, records, successful);
        }

        //this is a callback that would have been passed to the 'read' function and is optional
        Ext.callback(operation.callback, operation.scope || me, [records, operation, successful]);
    },
    
    /**
     * Caches the records in the prefetch and stripes them with their server-side
     * index.
     * @private
     */
    cacheRecords: function(records, operation) {
        var me     = this,
            i      = 0,
            length = records.length,
            start  = operation ? operation.start : 0;
        
        if (!Ext.isDefined(me.totalCount)) {
            me.totalCount = records.length;
            me.fireEvent('totalcountchange', me.totalCount);
        }
        
        for (; i < length; i++) {
            // this is the true index, not the viewIndex
            records[i].index = start + i;
        }
        
        me.prefetchData.addAll(records);
        if (me.purgePageCount) {
            me.purgeRecords();
        }
        
    },
    
    
    /**
     * Purge the least recently used records in the prefetch if the purgeCount
     * has been exceeded.
     * @private
     */
    purgeRecords: function() {
        var me = this,
            prefetchCount = me.prefetchData.getCount(),
            purgeCount = me.purgePageCount * me.pageSize,
            numRecordsToPurge = prefetchCount - purgeCount - 1,
            i = 0;

        for (; i <= numRecordsToPurge; i++) {
            this.prefetchData.removeAt(0);
        }
    },
    
    /**
     * Determines if the range has already been satisfied in the prefetchData.
     * @private
     */
    rangeSatisfied: function(start, end) {
        var me = this,
            i = start,
            satisfied = true;

        for (; i < end; i++) {
            if (!me.prefetchData.getByKey(i)) {
                satisfied = false;
                //<debug>
                if (end - i > this.pageSize) {
                    Ext.Error.raise("A single page prefetch could never satisfy this request.");
                }
                //</debug>
                break;
            }
        }
        return satisfied;
    },
    
    /**
     * Determines the page from a record index
     */
    getPageFromRecordIndex: function(index) {
        return Math.floor(index / this.pageSize) + 1;
    },
    
    onGuaranteedRange: function() {
        var me = this,
            totalCount = me.getTotalCount(),
            start = me.requestStart,
            end = ((totalCount - 1) < me.requestEnd) ? totalCount - 1 : me.requestEnd,
            range = [],
            record,
            i = start;
            
        //<debug>
        if (start > end) {
            Ext.Error.raise("Start (" + start + ") was greater than end (" + end + ")");
        }
        //</debug>
        
        if (start !== me.guaranteedStart && end !== me.guaranteedEnd) {
            me.guaranteedStart = start;
            me.guaranteedEnd = end;
            
            for (; i <= end; i++) {
                record = me.prefetchData.getByKey(i);
                //<debug>
                if (!record) {
                    Ext.Error.raise("Record was not found and store said it was guaranteed");
                }
                //</debug>
                range.push(record);
            }
            this.fireEvent('guaranteedrange', range, start, end);
            if (me.cb) {
                me.cb.call(me.scope || me, range);
            }
        }
        
        this.unmask();
    },
    
    // hack to support loadmask
    mask: function() {
        this.masked = true;
        this.fireEvent('beforeload');
    },
    
    // hack to support loadmask
    unmask: function() {
        if (this.masked) {
            this.fireEvent('load');
        }
    },
    
    /**
     * Returns the number of pending requests out.
     */
    hasPendingRequests: function() {
        return this.pendingRequests.length;
    },
    
    
    // wait until all requests finish, until guaranteeing the range.
    onWaitForGuarantee: function() {
        if (!this.hasPendingRequests()) {
            this.onGuaranteedRange();
        }
    },
    
    /**
     * Guarantee a specific range, this will load the store with a range (that
     * must be the pageSize or smaller) and take care of any loading that may
     * be necessary.
     */
    guaranteeRange: function(start, end, cb, scope) {
        //<debug>
        if (start && end) {
            if (end - start > this.pageSize) {
                Ext.Error.raise({
                    start: start,
                    end: end,
                    pageSize: this.pageSize,
                    msg: "Requested a bigger range than the specified pageSize"
                });
            }
        }
        //</debug>
        
        end = (end > this.totalCount) ? this.totalCount - 1 : end;
        
        var me = this,
            i = start,
            prefetchData = me.prefetchData,
            range = [],
            startLoaded = !!prefetchData.getByKey(start),
            endLoaded = !!prefetchData.getByKey(end),
            startPage = this.getPageFromRecordIndex(start),
            endPage = this.getPageFromRecordIndex(end);
            
        me.cb = cb;
        me.scope = scope;

        me.requestStart = start;
        me.requestEnd = end;
        // neither beginning or end are loaded
        if (!startLoaded || !endLoaded) {
            // same page, lets load it
            if (startPage === endPage) {
                this.mask();
                this.prefetchPage(startPage, {
                    //blocking: true,
                    callback: this.onWaitForGuarantee,
                    scope: this
                });
            // need to load two pages
            } else {
                this.mask();
                this.prefetchPage(startPage, {
                    //blocking: true,
                    callback: this.onWaitForGuarantee,
                    scope: this
                });
                this.prefetchPage(endPage, {
                    //blocking: true,
                    callback: this.onWaitForGuarantee,
                    scope: this
                });
            }
        // Request was already satisfied via the prefetch
        } else {
            this.onGuaranteedRange();
        }
    },
    
    // because prefetchData is stored by index
    // this invalidates all of the prefetchedData
    sort: function() {
        var me = this,
            prefetchData = this.prefetchData;

        if (me.remoteSort) {
            prefetchData.clear();
            me.callParent(arguments);
        } else {
            var sorters = this.getSorters(),
                start = me.guaranteedStart,
                end = me.guaranteedEnd,
                range;

            if (sorters.length) {
                prefetchData.sort(sorters);
                range = prefetchData.getRange();
                prefetchData.clear();
                me.cacheRecords(range);
                delete me.guaranteedStart;
                delete me.guaranteedEnd;
                me.guaranteeRange(start, end);
            }
            me.callParent(arguments);
        }
    }
});