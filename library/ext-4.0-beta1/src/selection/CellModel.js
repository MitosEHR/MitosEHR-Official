/**
 * @class Ext.selection.CellModel
 * @extends Ext.selection.Model
 * @private
 */
Ext.define('Ext.selection.CellModel', {
    extend: 'Ext.selection.Model',
    alias: 'selection.cellmodel',
    requires: ['Ext.util.KeyNav'],
    
    /**
     * @cfg {Boolean} enableKeyNav
     * Turns on/off keyboard navigation within the grid. Defaults to true.
     */
    enableKeyNav: true,
    
    /**
     * @cfg {Boolean} preventWrap
     * Set this configuration to true to prevent wrapping around of selection as
     * a user navigates to the first or last column. Defaults to false.
     */
    preventWrap: false,

    constructor: function(){
        this.addEvents(
            /**
             * @event deselect
             * Fired after a record is deselected
             * @param {Ext.selection.RowSelectionModel} this
             * @param {Ext.data.Model} record The deselected record
             * @param {Number} index The row index deselected
             */
            'deselect',
            
            /**
             * @event select
             * Fired after a record is selected
             * @param {Ext.selection.RowSelectionModel} this
             * @param {Ext.data.Model} record The selected record
             * @param {Number} index The row index selected
             */
            'select'
        );
        this.callParent(arguments);    
    },

    bindComponent: function(view) {
        var me = this;
        me.primaryView = view;
        me.views = me.views || [];
        me.views.push(view);
        me.bind(view.getStore(), true);

        view.on({
            cellmousedown: this.onMouseDown,
            refresh: this.onViewRefresh,
            scope: me
        });

        if (me.enableKeyNav) {
            me.initKeyNav(view);
        }
    },

    initKeyNav: function(view) {
        var me = this;
        
        if (!view.rendered) {
            view.on('render', Ext.Function.bind(me.initKeyNav, me, [view], 0), me, {single: true});
            return;
        }

        view.el.set({
            tabIndex: -1
        });

        // view.el has tabIndex -1 to allow for
        // keyboard events to be passed to it.
        me.keyNav = new Ext.util.KeyNav(view.el, {
            up: me.onKeyUp,
            down: me.onKeyDown,
            right: me.onKeyRight,
            left: me.onKeyLeft,
            tab: me.onKeyTab,
            scope: me
        });
    },
    
    getHeaderCt: function() {
        return this.primaryView.headerCt;
    },
    
    getActiveHeader: function() {
        if (this.position) {
            return this.getHeaderCt().getHeaderByIndex(this.position.column);
        }
        return false;

    },

    onKeyUp: function(e, t) {
        this.move('up', e);
    },

    onKeyDown: function(e, t) {
        this.move('down', e);
    },

    onKeyLeft: function(e, t) {
        this.move('left', e);
    },
    
    onKeyRight: function(e, t) {
        this.move('right', e);
    },
    
    move: function(dir, e) {
        var pos = this.primaryView.walkCells(this.getCurrentPosition(), dir, e, this.preventWrap);
        if (pos) {
            this.setCurrentPosition(pos);
        }
        return pos;
    },

    /**
     * Returns the current position in the format {row: row, column: column}
     */
    getCurrentPosition: function() {
        return this.position;
    },
    
    /**
     * Sets the current position
     * @param {Object} position The position to set.
     */
    setCurrentPosition: function(pos) {
        if (this.position) {
            this.onCellDeselect(this.position);
        }
        if (pos) {
            this.onCellSelect(pos);
        }
        this.position = pos;
    },
    
    /**
     * Set the current position based on where the user clicks.
     * @private
     */
    onMouseDown: function(view, cell, cellIndex, record, row, rowIndex, e) {
        this.setCurrentPosition({
            row: rowIndex,
            column: cellIndex
        });
    },
    
    // notify the view that the cell has been selected to update the ui
    // approriately and bring the cell into focus
    onCellSelect: function(position) {
        this.primaryView.onCellSelect(position);
        // TODO: Remove temporary cellFocus call here.
        this.primaryView.onCellFocus(position);
    },
    
    // notify view that the cell has been deselected to update the ui
    // appropriately
    onCellDeselect: function(position) {
        this.primaryView.onCellDeselect(position);
    },
    
    
    onKeyTab: function(e, t) {
        var direction = e.shiftKey ? 'left' : 'right';
        this.move(direction, e);
    },
    
    onEditorTab: function(editingPlugin, e) {
        var direction = e.shiftKey ? 'left' : 'right',
            position  = this.move(direction, e);
        if (position) {
            editingPlugin.startEditByPosition(position);
        }
        
    },
    
    refresh: function() {
        var pos = this.getCurrentPosition();
        if (pos) {
            this.onCellSelect(pos);
        }
    },
    
    onViewRefresh: function() {
        var pos = this.getCurrentPosition();
        if (pos) {
            this.onCellDeselect(pos);
            this.setCurrentPosition(null);
        }
    },
    
    selectByPosition: function(position) {
        this.setCurrentPosition(position);
    }
});
