/**
 * @class Ext.grid.Header
 * @extends Ext.Component
 *
 * Clicking on a header will toggle sort by the bound dataIndex.
 *
 * Opening a menu will allow you to turn on/off Headers found in a particular
 * section.
 *
 * Allows a user to freeze columns
 * @xtype gridheader
 */
Ext.define('Ext.grid.Header', {
    extend: 'Ext.Component',
    alias: 'widget.gridheader',
    
    headerCls: Ext.baseCSSPrefix + 'column-header ' + Ext.baseCSSPrefix + 'unselectable',
    overCls: Ext.baseCSSPrefix + 'column-header-over',
    height: 23,
    handleWidth: 5,


    sortState: null,
    possibleSortStates: ['ASC', 'DESC'],
    
    renderTpl: [
        '<span class="' + Ext.baseCSSPrefix + 'column-header-inner">{text}</span>',
        '<img src="{[Ext.BLANK_IMAGE_URL]}" class="' + Ext.baseCSSPrefix + 'sort-indicator" border="0"/>',
        // TODO: Use an additional CSS class because
        // this does not allow a user to dynamically re-enable a menu.
        '<tpl if="!values.menuDisabled"><div class="' + Ext.baseCSSPrefix + 'column-header-trigger"></div></tpl>'
    ],
    
    /**
     * @cfg {String} dataIndex <p><b>Required</b>. The name of the field in the
     * grid's {@link Ext.data.Store}'s {@link Ext.data.Model} definition from
     * which to draw the column's value.</p>
     */
    dataIndex: null,

    
    /**
     * @cfg {String} text Optional. The header text to be used as innerHTML
     * (html tags are accepted) to display in the Grid.  <b>Note</b>: to
     * have a clickable header with no text displayed you can use the
     * default of <tt>'&#160;'</tt>.
     */
    text: '&#160',
    
    /**
     * @cfg {Boolean} sortable Optional. <tt>true</tt> if sorting is to be allowed on this column.
     * Whether local/remote sorting is used is specified in <code>{@link Ext.data.Store#remoteSort}</code>.
     */
    sortable: true,
    
    /**
     * @cfg {Boolean} hideable Optional. Specify as <tt>false</tt> to prevent the user from hiding this column
     * (defaults to true).
     */
    hideable: true,
    
    /**
     * @cfg {Boolean} menuDisabled
     * Defaults to false.
     */
    menuDisabled: false,
    
    /**
     * @cfg {Function} renderer
     * Defaults to false.
     */
    renderer: false,
    
    /**
     * @cfg {String} align Sets the alignment of the header and renderered columns.
     * Defaults to 'left'.
     */
    align: 'left',
    
    /**
     * @cfg {Boolean} draggable Indicates whether or not the header can be drag and drop re-ordered.
     * Defaults to true.
     */
    draggable: true,
    
    // Header does not use the typical ComponentDraggable class and therefore we
    // override this with an emptyFn. It is controlled at the HeaderDragZone.
    initDraggable: Ext.emptyFn,
    
    /**
     * @property {Ext.core.Element} triggerEl
     */
    
    /**
     * @property {Ext.core.Element} textEl
     */
    
    initComponent: function() {
        this.cls = this.headerCls + ' ' + (this.cls ? this.cls : '');
        if (Ext.isDefined(this.header)) {
            console.warn("Header is now using text instead of header.");
            this.text = this.header;
            delete this.header;
        }
        
        if (!this.triStateSort) {
            this.possibleSortStates.length = 2;
        }
    
        
        Ext.applyIf(this.renderSelectors, {
            triggerEl: '.' + Ext.baseCSSPrefix + 'column-header-trigger',
            textEl: 'span'
        });
        Ext.grid.Header.superclass.initComponent.call(this);
    },
    
    initRenderData: function() {
        Ext.applyIf(this.renderData, {
            text: this.text,
            menuDisabled: this.menuDisabled
        });
        return Ext.grid.Header.superclass.initRenderData.call(this);
    },
    
    // note that this should invalidate the menu cache
    setText: function(text) {
        this.text = text;
        if (this.rendered) {
            this.textEl.update(text);
        } 
    },
    
    afterRender: function() {
        Ext.grid.Header.superclass.afterRender.call(this);
        var el = this.el;
        el.addCls(Ext.baseCSSPrefix + 'column-header-align-' + this.align);
        el.addClsOnOver(this.overCls);
        el.on('click', this.onElClick, this);
        el.on('dblclick', this.onElDblClick, this);
    },
    
    onElDblClick: function(e, t) {
        var ownerCt = this.ownerCt;
        if (ownerCt && ownerCt.items.indexOf(this) !== 0 && this.isOnLeftEdge(e) ) {
            ownerCt.expandToFit(this.previousSibling('gridheader'));
        }
    },
    
    onElClick: function(e, t) {
        var ownerCt = this.ownerCt;
        
        if (ownerCt && !ownerCt.locked) {
            // Firefox doesn't check the current target in a within check.
            // Therefore we check the target directly and then within (ancestors)
            if (this.triggerEl && (e.target === this.triggerEl.dom || e.within(this.triggerEl))) {
                ownerCt.onHeaderTriggerClick(this, e, t);
            // if its not on the left hand edge, sort
            } else if (!this.isOnLeftEdge(e) && !this.isOnRightEdge(e)) {
                this.toggleSortState();
                ownerCt.onHeaderClick(this, e, t);
            }
        }
    },
    
    toggleSortState: function() {
        if (this.sortable) {
            var idx = Ext.Array.indexOf(this.possibleSortStates, this.sortState),
                nextIdx;

            nextIdx = (idx + 1) % this.possibleSortStates.length;
            this.setSortState(this.possibleSortStates[nextIdx]);
        }
    },

    //setSortState: function(state, updateUI) {
    //setSortState: function(state, doSort) {
    setSortState: function(state, skipClear) {
        var colSortClsPrefix = Ext.baseCSSPrefix + 'column-header-sort-',
            ascCls = colSortClsPrefix + 'ASC',
            descCls = colSortClsPrefix + 'DESC',
            nullCls = colSortClsPrefix + 'null',
            ds = this.up('gridpanel').store;

        this.addCls(colSortClsPrefix + state);
        
        if (state) {
            ds.sort(this.dataIndex, state);
        }
        
        switch (state) {
            case 'DESC':
                this.removeCls(ascCls, nullCls);
                break;
            case 'ASC':
                this.removeCls(descCls, nullCls);
                break;
            case null:
                this.removeCls(ascCls, descCls);
                break;
        }
        
        
        if (!this.triStateSort && !skipClear) {
            this.ownerCt.clearOtherSortStates(this);
        }
        this.sortState = state;
    },
    
    hide: function() {
        this.oldWidth = this.getWidth();
        Ext.grid.Header.superclass.hide.apply(this, arguments);

        var ownerCt = this.ownerCt;
        // Notify owning HeaderContainer
        if (ownerCt) {
            ownerCt.onHeaderHide(this);
        }
    },
    
    show: function() {
        Ext.grid.Header.superclass.show.apply(this, arguments);
        var ownerCt = this.ownerCt;
        // Notify owning HeaderContainer
        if (ownerCt) {
            ownerCt.onHeaderShow(this);
        }
    },
    
    onResize: function() {

    },
    
    setSize: function(w, h) {
        Ext.grid.Header.superclass.setSize.call(this, w, h);
        var ownerCt = this.ownerCt;
        if (ownerCt) {
            ownerCt.onHeaderResize(this, w);
        }
    },
    
    // invoked when dynamically calculating a flex'd value
    setCalculatedSize: function(w, h) {
        Ext.grid.Header.superclass.setCalculatedSize.call(this, w, h);
        //this.width = w;
        //delete this.flex;
        var ownerCt = this.ownerCt;
        if (ownerCt) {
            ownerCt.onHeaderResize(this, w);
        }
    },
    
    
    
    getDesiredWidth: function() {
        if (this.rendered) {
            // headers always have either a width or a flex
            // because HeaderContainer sets a defaults width
            // therefore we can ignore the natural width
            // we use the componentLayout's tracked width so that
            // we can calculate the desired width when renderered
            // but not visible because its being obscured by a layout
            return this.componentLayout.lastComponentSize.width;
        } else {
            return this.width;
        }
    },
    
    getCellSelector: function() {
        return '.' + Ext.baseCSSPrefix + 'grid-cell-' + this.id;
    },
    
    getCellInnerSelector: function() {
        return this.getCellSelector() + ' .' + Ext.baseCSSPrefix + 'grid-cell-inner';
    },
    
    isOnLeftEdge: function(e) {
        return (e.getXY()[0] - this.el.getLeft() <= this.handleWidth);
    },
    
    isOnRightEdge: function(e) {
        return (this.el.getRight() - e.getXY()[0] <= this.handleWidth);
    }
});