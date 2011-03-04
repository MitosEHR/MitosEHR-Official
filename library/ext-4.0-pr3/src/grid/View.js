/**
 * @class Ext.grid.View
 * @extends Ext.DataView
 *
 * The grid view binds a store to the underlying html markup of a grid. In most
 * cases you may configure a grid view from the Ext.grid.GridPanel with the
 * viewConfig configuration.
 *
 * The selection model is shared across sibling grid views.
 * @xtype gridview
 */
Ext.define('Ext.grid.View', {
    extend: 'Ext.DataView',
    alias: 'widget.gridview',
    requires: [
        'Ext.util.DelayedTask',
        'Ext.grid.TableChunker'
    ],

    cls: Ext.baseCSSPrefix + 'grid-view ' + Ext.baseCSSPrefix + 'unselectable',
    // row
    itemSelector: '.' + Ext.baseCSSPrefix + 'grid-row',
    // cell
    cellSelector: '.' + Ext.baseCSSPrefix + 'grid-cell',
    selectedItemCls: Ext.baseCSSPrefix + 'grid-row-selected',
    focusedItemCls: Ext.baseCSSPrefix + 'grid-row-focused',
    overItemCls: Ext.baseCSSPrefix + 'grid-row-over',
    altRowCls:   Ext.baseCSSPrefix + 'grid-row-alt',
    
    rowClsRe: /(?:^|\s*)grid3-row-(first|last|alt)(?:\s+|$)/g,
    
    /**
     * @cfg {Boolean} stripeRows <tt>true</tt> to stripe the rows. Default is <tt>false</tt>.
     * <p>This causes the CSS class <tt><b>x-grid-row-alt</b></tt> to be added to alternate rows of
     * the grid. A default CSS rule is provided which sets a background colour, but you can override this
     * with a rule which either overrides the <b>background-color</b> style using the '!important'
     * modifier, or which uses a CSS selector of higher specificity.</p>
     */
    stripeRows: false,
    
    // cfg docs inherited
    trackOver: true,
    
    /**
     * Override this function to apply custom CSS classes to rows during rendering.  You can also supply custom
     * parameters to the row template for the current row to customize how it is rendered using the <b>rowParams</b>
     * parameter.  This function should return the CSS class name (or empty string '' for none) that will be added
     * to the row's wrapping div.  To apply multiple class names, simply return them space-delimited within the string
     * (e.g., 'my-class another-class'). Example usage:
    <pre><code>
viewConfig: {
    forceFit: true,
    showPreview: true, // custom property
    enableRowBody: true, // required to create a second, full-width row to show expanded Record data
    getRowClass: function(record, rowIndex, rp, ds){ // rp = rowParams
        if(this.showPreview){
            rp.body = '&lt;p>'+record.data.excerpt+'&lt;/p>';
            return 'x-grid3-row-expanded';
        }
        return 'x-grid3-row-collapsed';
    }
},
    </code></pre>
     * @param {Model} model The {@link Ext.data.Model} corresponding to the current row.
     * @param {Number} index The row index.
     * @param {Object} rowParams (DEPRECATED) A config object that is passed to the row template during rendering that allows
     * customization of various aspects of a grid row.
     * <p>If {@link #enableRowBody} is configured <b><tt></tt>true</b>, then the following properties may be set
     * by this function, and will be used to render a full-width expansion row below each grid row:</p>
     * <ul>
     * <li><code>body</code> : String <div class="sub-desc">An HTML fragment to be used as the expansion row's body content (defaults to '').</div></li>
     * <li><code>bodyStyle</code> : String <div class="sub-desc">A CSS style specification that will be applied to the expansion row's &lt;tr> element. (defaults to '').</div></li>
     * </ul>
     * The following property will be passed in, and may be appended to:
     * <ul>
     * <li><code>tstyle</code> : String <div class="sub-desc">A CSS style specification that willl be applied to the &lt;table> element which encapsulates
     * both the standard grid row, and any expansion row.</div></li>
     * </ul>
     * @param {Store} store The {@link Ext.data.Store} this grid is bound to
     * @method getRowClass
     * @return {String} a CSS class name to add to the row.
     */
    getRowClass: null,
    
    initComponent: function() {
        this.scrollState = {};
        this.initFeatures();
        this.setNewTemplate();
        this.store.on('load', this.onStoreLoad, this);
        Ext.grid.View.superclass.initComponent.call(this);
        
        this.addEvents(
            /**
             * @event rowfocus
             * @param {Ext.data.Record} record
             * @param {HTMLElement} row
             * @param {Number} rowIdx
             */
            'rowfocus'
        );
        
    },
    
    // scroll to top of the grid when store loads
    onStoreLoad: function(){
        if (Ext.isGecko) {
            if (!this.scrollToTopTask) {
                this.scrollToTopTask = new Ext.util.DelayedTask(this.scrollToTop, this);
            }
            this.scrollToTopTask.delay(1);
        } else {
            this.scrollToTop();
        }
    },
    
    /**
     * Scroll the GridView to the top by scrolling the scroller.
     */
    scrollToTop : function(){
        var section = this.up('gridsection'),
            verticalScroller = section.verticalScroller;
        
        verticalScroller.scrollToTop();
    },
    
    /**
     * Initializes each feature and bind it to this view.
     * @private
     */
    initFeatures: function() {
        this.features = this.features || [];
        var features = this.features,
            ln       = features.length,
            i        = 0;

        for (; i < ln; i++) {
            // ensure feature hasnt already been instantiated
            if (!features[i].isFeature) {
                // inject a reference to view
                features[i].view = this;
                features[i] = Ext.create('feature.'+features[i].ftype, features[i]);
            }
        }
    },
    
    /**
     * Gives features an injection point to attach events to the markup that
     * has been created for this view.
     * @private
     */
    attachEventsForFeatures: function() {
        var features = this.features,
            ln       = features.length,
            i        = 0;

        for (; i < ln; i++) {
            if (features[i].isFeature) {
                features[i].attachEvents();
            }
        }
    },
    
    afterRender: function() {
        Ext.grid.View.superclass.afterRender.call(this);
        this.el.on('scroll', this.fireBodyScroll, this);
        this.attachEventsForFeatures();
    },
    
    
    fireBodyScroll: function(e, t) {
        this.fireEvent('bodyscroll', e, t);
    },
    
    /**
     * Uses the headerCt to transform data from dataIndex keys in a record to
     * headerId keys in each header and then run them through each feature to
     * get additional data for variables they have injected into the view template.
     * @private
     */
    prepareData: function(data, idx, record) {
        var orig     = this.headerCt.prepareData(data, idx, record),
            features = this.features,
            ln       = features.length,
            i        = 0,
            node, feature;

        for (; i < ln; i++) {
            feature = features[i];
            if (feature.isFeature) {
                Ext.apply(orig, feature.getAdditionalData(data, idx, record, orig, this));
            }
        }

        return orig;
    },
    
    
    collectData: function(records, startIndex) {
        var preppedRecords = Ext.grid.View.superclass.collectData.apply(this, arguments),
            headerCt  = this.headerCt,
            fullWidth = headerCt.getFullWidth(),
            features  = this.features,
            ln = features.length,
            i  = 0,
            feature,
            o = {
                rows: preppedRecords,
                fullWidth: fullWidth
            },
            j = 0,
            jln = preppedRecords.length,
            rowParams;
        
        // process row classes, rowParams has been deprecated and has been moved
        // to the individual features that implement the behavior. 
        if (this.getRowClass) {
            for (; j < jln; j++) {
                rowParams = {};
                preppedRecords[j]['rowCls'] = this.getRowClass(preppedRecords[j], j, rowParams, this.store);
                if (rowParams.alt) {
                    throw "GridView: getRowClass alt is no longer supported.";
                }
                if (rowParams.tstyle) {
                    throw "GridView: getRowClass tstyle is no longer supported.";
                }
                if (rowParams.cells) {
                    throw "GridView: getRowClass cells is no longer supported.";
                }
                if (rowParams.body) {
                    throw "GridView: getRowClass body is no longer supported. Use getAdditionalData of the rowbody feature.";
                }
                if (rowParams.bodyStyle) {
                    throw "GridView: getRowClass bodyStyle is no longer supported.";
                }
                if (rowParams.cols) {
                    throw "GridView: getRowClass cols is no longer supported.";
                }
                
            }
        }
        
        
        // currently only one feature may implement collectData. This is to modify
        // whats returned to the view before its renderered
        for (; i < ln; i++) {
            feature = features[i];
            if (feature.isFeature && feature.collectData && !feature.disabled) {
                o = feature.collectData(records, startIndex, fullWidth, o);
                break;
            }
        }
        
        return o;
        
    },
    
    /**
     * When a header is resized, setWidth on the individual columns resizer class,
     * the top level table, save/restore scroll state, generate a new template and
     * restore focus to the grid view's element so that keyboard navigation
     * continues to work.
     * @private
     */
    onHeaderResize: function(header, w, suppressFocus) {
        var el = this.el;
        if (el) {
            this.saveScrollState();
            // Grab the col and set the width, css
            // class is generated in TableChunker.
            el.select('.' + Ext.baseCSSPrefix + 'grid-col-resizer-'+header.id).setWidth(w);
            el.select('.' + Ext.baseCSSPrefix + 'grid-table-resizer').setWidth(this.headerCt.getFullWidth());
            this.restoreScrollState();
            this.setNewTemplate();
            if (!suppressFocus) {
                this.el.focus();
            }
        }
    },
    
    /**
     * When a header is shown restore its oldWidth if it was previously hidden.
     * @private
     */
    onHeaderShow: function(headerCt, header, idx, suppressFocus) {
        // restore headers that were dynamically hidden
        if (header.oldWidth) {
            this.onHeaderResize(header, header.oldWidth, suppressFocus);
            delete header.oldWidth;
        // flexed headers will have a calculated size set
        // this additional check has to do with the fact that
        // defaults: {width: 100} will fight with a flex value
        } else if (header.width && !header.flex) {
            this.onHeaderResize(header, header.width, suppressFocus);
        }
        this.setNewTemplate();
    },
    
    /**
     * When the header hides treat it as a resize to 0.
     */
    onHeaderHide: function(headerCt, header, idx, suppressFocus) {
        this.onHeaderResize(header, 0, suppressFocus);
    },
    
    /**
     * Set a new template based on the current columns displayed in the
     * grid.
     */
    setNewTemplate: function() {
        var columns = this.headerCt.getColumnsForTpl();
        this.tpl = this.getTableChunker().getTableTpl({
            columns: columns,
            features: this.features
        });
    },
    
    /**
     * Get the configured chunker or default of Ext.grid.TableChunker
     */
    getTableChunker: function() {
        return this.chunker || Ext.grid.TableChunker;
    },
    
    /**
     * Add a CSS Class to a specific row.
     * @param {HTMLElement/String/Number/Ext.data.Model} rowInfo An HTMLElement, index or instance of a model representing this row
     * @param {String} cls
     */
    addRowCls: function(rowInfo, cls) {
        var row = this.getNode(rowInfo);
        if (row) {
            Ext.fly(row).addCls(cls);
        }
    },
    
    /**
     * Remove a CSS Class from a specific row.
     * @param {HTMLElement/String/Number/Ext.data.Model} rowInfo An HTMLElement, index or instance of a model representing this row
     * @param {String} cls
     */
    removeRowCls: function(rowInfo, cls) {
        var row = this.getNode(rowInfo);
        if (row) {
            Ext.fly(row).removeCls(cls);
        }
    },
    
    // GridSelectionModel invokes onRowSelect as selection changes
    onRowSelect : function(rowIdx) {
        this.addRowCls(rowIdx, this.selectedItemCls);
    },

    // GridSelectionModel invokes onRowDeelect as selection changes
    onRowDeselect : function(rowIdx) {
        this.removeRowCls(rowIdx, this.selectedItemCls);
    },

    // GridSelectionModel invokes onRowFocus to 'highlight'
    // the last row focused
    onRowFocus: function(rowIdx, highlight) {
        var row = this.getNode(rowIdx),
            grid = this.up('gridpanel');
        if (highlight) {
            this.addRowCls(rowIdx, this.focusedItemCls);
            this.focusRow(rowIdx);
            //this.el.dom.setAttribute('aria-activedescendant', row.id);
        } else {
            this.removeRowCls(rowIdx, this.focusedItemCls);
        }
    },
    
    /**
     * Focus a particular row and bring it into view. Will fire the rowfocus event.
     * @cfg {Mixed} An HTMLElement template node, index of a template node, the
     * id of a template node or the record associated with the node.
     */
    focusRow: function(rowIdx) {
        var row        = this.getNode(rowIdx),
            el         = this.el,
            adjustment = 0,
            elRegion   = el.getRegion(),
            gridpanel  = this.up('gridpanel'),
            rowRegion,
            record;
        
        if (row) {
            rowRegion = Ext.fly(row).getRegion();
            // row is above
            if (rowRegion.top < elRegion.top) {
                adjustment = rowRegion.top - elRegion.top;
            // row is below
            } else if (rowRegion.bottom > elRegion.bottom) {
                adjustment = rowRegion.bottom - elRegion.bottom;
            }
            record = this.getRecord(row);
            rowIdx = this.store.indexOf(record);
            
            if (adjustment) {
                // scroll the grid itself, so that all gridview's update.
                gridpanel.scrollByDeltaY(adjustment);
            }
            this.fireEvent('rowfocus', record, row, rowIdx);
        }
    },
    
    /**
     * Scroll by delta. This affects this individual view ONLY and does not
     * synchronize across views or scrollers.
     * @param {Number} delta
     * @param {String} dir (optional) Valid values are scrollTop and scrollLeft. Defaults to scrollTop.
     * @private
     */
    scrollByDelta: function(delta, dir) {
        dir = dir || 'scrollTop';
        var elDom = this.el.dom;
        elDom[dir] = (elDom[dir] += delta);
    },
    
    // after adding a row stripe rows from then on
    onAdd: function(ds, records, index) {
        Ext.grid.View.superclass.onAdd.call(this, ds, records, index);
        this.doStripeRows(index);
    },
    
    // after removing a row stripe rows from then on
    onRemove: function(ds, records, index) {
        Ext.grid.View.superclass.onRemove.call(this, ds, records, index);
        this.doStripeRows(index);
    },
    
    onUpdate: function(ds, index) {
        Ext.grid.View.superclass.onUpdate.call(this, ds, index);
    },
    
    /**
     * Save the scrollState in a private variable.
     * Must be used in conjunction with restoreScrollState
     */
    saveScrollState: function() {
        var dom = this.el.dom,
            state = this.scrollState;
        
        state.left = dom.scrollLeft;
        state.top = dom.scrollTop;
    },
    
    /**
     * Restore the scrollState.
     * Must be used in conjunction with saveScrollState
     * @private
     */
    restoreScrollState: function() {
        var dom = this.el.dom,
            state = this.scrollState,
            headerEl = this.headerCt.el.dom;
            
        headerEl.scrollLeft = dom.scrollLeft = state.left;
        dom.scrollTop = state.top;
    },
    
    
    /**
     * Refresh the grid view.
     * Saves and restores the scroll state, generates a new template, stripes rows
     * and invalidates the scrollers.
     * @param {Boolean} firstPass This is a private flag for internal use only.
     */
    refresh: function(firstPass) {
        this.saveScrollState();
        this.setNewTemplate();
        Ext.grid.View.superclass.refresh.call(this, firstPass);
        this.doStripeRows(0);
        this.up('gridpanel').invalidateScroller();
        this.restoreScrollState();
        if (!firstPass) {
            // give focus back to gridview
            this.el.focus();
        }
        
    },
    
    /**
     * Stripe rows from a particular row index
     * @param {Number} startRow
     * @private
     */
    doStripeRows: function(startRow) {
        // ensure stripeRows configuration is turned on
        if (this.stripeRows) {
            var rows   = this.getNodes(startRow),
                rowsLn = rows.length,
                i      = 0,
                row;
                
            for (; i < rowsLn; i++) {
                row = rows[i];
                // Remove prior applied row classes.
                row.className = row.className.replace(this.rowClsRe, ' ');
                // Every odd row will get an additional cls
                if (i % 2 === 1) {
                    row.className += (' ' + this.altRowCls);
                }
            }
        }
    },
    
    // Currently processing click, dblclick and contextmenu for cell's
    // No Support for mousedown atm
    processEvent: function(name, item, index, e) {
        var t     = e.getTarget(),
            cell  = Ext.fly(t).is(this.cellSelector) ? t : Ext.fly(t).up(this.cellSelector);
            
        if (cell) {
            cell = cell.dom ? cell.dom : cell;
            this.fireEvent('cell' + name, this, cell, index, cell.cellIndex, e);
        }
        
        
        // Process event features and fire events for a particular feature such
        // as groupclick, groupdblclick, etc
        var features = this.features,
            ln = features.length,
            i  = 0,
            node, feature;

        for (; i < ln; i++) {
            feature = features[i];
            if (feature.hasFeatureEvent) {
                node = Ext.fly(t).is(feature.eventSelector) ? t : Ext.fly(t).up(feature.eventSelector);
                if (node) {
                    node = node.dom ? node.dom : node;
                    this.fireEvent(feature.eventPrefix + name, this, node, index, {}, e);
                }
            }
        }
    },
    
    // process click events
    onContainerClick: function(e) {
        this.processEvent('click', null, null, e);
    },
    
    // process click events
    onItemClick: function(item, index, e) {
        var result = Ext.grid.View.superclass.onItemClick.call(this, item, index, e);
        if (result) {
            this.processEvent('click', item, index, e);
        }
        return result;
    },
    
    // process dblclick events
    onDblClick: function(e) {
        Ext.grid.View.superclass.onDblClick.call(this,  e);
        var item = e.getTarget(this.itemSelector, this.getTargetEl());
        if (item) {
            this.processEvent('dblclick', item, this.indexOf(item), e);
        }
    },
    
    
    // proccess contextmenu events
    onContextMenu: function(e) {
        Ext.grid.View.superclass.onContextMenu.call(this,  e);
        var item = e.getTarget(this.itemSelector, this.getTargetEl());
        
        if (item) {
            this.processEvent('contextmenu', item, this.indexOf(item), e);
        }
    },

    /**
     * Expand a particular header to fit the max content width.
     * This will ONLY expand, not contract.
     * @private
     */
    expandToFit: function(header) {
        var maxWidth = this.getMaxContentWidth(header);
        delete header.flex;
        header.setWidth(maxWidth);
    },
    
    /**
     * Get the max contentWidth of the header's text and all cells
     * in the grid under this header.
     * @private
     */
    getMaxContentWidth: function(header) {
        var cellSelector = header.getCellInnerSelector(),
            cells        = this.el.query(cellSelector),
            i = 0,
            ln = cells.length,
            maxWidth = header.el.dom.scrollWidth,
            scrollWidth;

        for (; i < ln; i++) {
            scrollWidth = cells[i].scrollWidth;
            if (scrollWidth > maxWidth) {
                maxWidth = scrollWidth;
            }
        }
        return maxWidth;
    }
});