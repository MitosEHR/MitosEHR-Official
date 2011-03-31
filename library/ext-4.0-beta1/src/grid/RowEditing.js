/**
 * @class Ext.grid.RowEditing
 * @extends Ext.grid.Editing
 */
Ext.define('Ext.grid.RowEditing', {
    // extend: 'Ext.grid.Editing',
    alias: 'plugin.rowediting',
    requires: [
        'Ext.grid.Header',
        'Ext.grid.RowEditor',
        'Ext.util.KeyNav',
        'Ext.XTemplate'
    ],
    mixins: {
        observable: 'Ext.util.Observable'
    },
    
    /**********************************
     * Abstract properties & methods
     **********************************/
    clicksToEdit: 2,
    editStyle: 'row',
    
    constructor: function(config) {
        var me = this;
        Ext.apply(me, config);
        me.mixins.observable.constructor.call(me);
    },
    
    destroy: function() {
        var me = this,
            grid = me.grid,
            headerCt = grid.headerCt,
            events = grid.events;
        
        Ext.destroy(
            me.editor,
            me.keyNav
        );
        me.removeFieldAccessors(grid.headerCt.getGridColumns());
        
        // Remove the events we added
        if (events.beforeedit.isEvent) {
            events.beforeedit.clearListeners();
        }
        if (events.edit.isEvent) {
            events.edit.clearListeners();
        }
        delete events.beforeedit;
        delete events.edit;
        
        delete me.grid;
        delete me.view;
        delete me.editor;
        delete me.keyNav;
    },
    
    getEditor: function() {
        var me = this;
        
        if (!me.editor) {
            me.editor = me.initEditor();
        }
        
        return me.editor;
    },
    
    getEditStyle: function() {
        return this.editStyle;
    },
    
    // initEditor: Ext.emptyFn,
    
    initEvents: function() {
        var me = this,
            grid = me.grid,
            view = me.view,
            headerCt = grid.headerCt,
            clickEvent = me.clicksToEdit === 1 ? 'click' : 'dblclick';
        
        // Start editing
        me.mon(view, 'cell' + clickEvent, me.onCellDblClick, me);
        view.on('render', function() {
            me.keyNav = Ext.create('Ext.util.KeyNav', view.el, {
                enter: me.onEnterKey,
                esc: me.onEscKey,
                scope: me
            });
        
            // Column events
            me.mon(headerCt, {
                add: me.onColumnAdd,
                remove: me.onColumnRemove,
                headerresize: me.onColumnResize,
                headerhide: me.onColumnHide,
                headershow: me.onColumnShow,
                headermove: me.onColumnMove,
                scope: me
            });
        }, me, { single: true });
        
        // Cleanup
        me.mon(grid, 'beforedestroy', me.destroy, me);
    },
    
    onCellDblClick: function(view, cell, colIdx, record, row, rowIdx, e) {
        var me = this,
            params = {
                cell: cell,
                colIdx: colIdx,
                row: row,
                rowIdx: rowIdx,
                record: record
            };
        
        me.startEdit(params);
    },
    
    onColumnAdd: function(ct, column) {
        var me = this,
            editor = me.getEditor();
        
        me.initFieldAccessors(column);
        if (editor && editor.onColumnAdd) {
            editor.onColumnAdd(column);
        }
    },
    
    onColumnRemove: function(ct, column) {
        var me = this,
            editor = me.getEditor();
        
        if (editor && editor.onColumnRemove) {
            editor.onColumnRemove(column);
        }
        me.removeFieldAccessors(column);
    },
    
    onColumnResize: function(ct, column, width) {
        var me = this,
            editor = me.getEditor();
        
        if (editor && editor.onColumnResize) {
            editor.onColumnResize(column, width);
        }
    },
    
    onColumnHide: function(ct, column) {
        var me = this,
            editor = me.getEditor();
        
        if (editor && editor.onColumnHide) {
            editor.onColumnHide(column);
        }
    },
    
    onColumnShow: function(ct, column) {
        var me = this,
            editor = me.getEditor();
        
        if (editor && editor.onColumnShow) {
            editor.onColumnShow(column);
        }
    },
    
    onColumnMove: function(ct, column, fromIdx, toIdx) {
        var me = this,
            editor = me.getEditor();
        
        if (editor && editor.onColumnMove) {
            editor.onColumnMove(column, fromIdx, toIdx);
        }
    },
    
    onEnterKey: function(e) {
        var me = this,
            grid = me.grid,
            selModel = grid.getSelectionModel(),
            params, pos;
        
        if (selModel.getCurrentPosition) {
            // CellSelectionModel
            pos = selModel.getCurrentPosition();
            params = {
                colIdx: pos.column,
                rowIdx: pos.row
            };
        } else {
            // RowSelectionModel
            params = {
                colIdx: 0,
                rowIdx: grid.view.store.indexOf(selModel.getLastSelected())
            };
        }
        
        me.startEdit(params);
    },
    
    onEscKey: function(e) {
        this.cancelEdit();
    },
    
    initFieldAccessors: function(column) {
        var me = this;
        
        if (Ext.isArray(column)) {
            Ext.Array.forEach(column, me.initFieldAccessors, me);
            return;
        }
        
        // Augment the Header class to have a getField and setField method
        Ext.apply(column, {
            getField: function(defaultField) {
                return me.getColumnField(this, defaultField);
            },
            
            setField: function(field) {
                me.setColumnField(this, field);
            }
        });
    },
    
    removeFieldAccessors: function(column) {
        var me = this;
        
        if (Ext.isArray(column)) {
            Ext.Array.forEach(column, me.removeFieldAccessors, me);
            return;
        }
        
        delete column.getField;
        delete column.setField;
    },
    
    getColumnField: function(column, defaultField) {
        var field = column.field;
            
        if (!field && column.editor) {
            field = column.editor;
            delete column.editor;
        }
        
        if (!field && defaultField) {
            field = defaultField;
        }
        
        if (field) {
            if (Ext.isObject(field) && !field.isFormField) {
                field = Ext.ComponentMgr.create(field);
                column.field = field;
            }
            
            Ext.apply(field, {
                name: column.dataIndex,
                hideLabel: true
            });
            
            return field;
        }
    },
    
    // setColumnField: function(column, field) {
    //     if (Ext.isObject(field) && !field.isFormField) {
    //         field = Ext.ComponentMgr.create(field);
    //     }
    //     column.field = field;
    // },
    
    beforeEdit: Ext.emptyFn,
    
    startEdit: function() {
        var me = this,
            args = Ext.Array.toArray(arguments),
            params = args.shift(),
            grid = me.grid,
            view = me.view,
            store = view.store,
            headerCt = grid.headerCt,
            rowIdx, colIdx;
        
        // Support simpler signature
        //   (rowIdx, [colIdx])
        if (!Ext.isObject(params)) {
            rowIdx = params;
            colIdx = args.shift(); // can be null
            params = {
                rowIdx: rowIdx,
                colIdx: colIdx
            };
        } else {
            rowIdx = params.rowIdx;
            colIdx = params.colIdx;
        }
        
        if (Ext.isNumber(colIdx)) {
            if (!params.column) {
                params.column = headerCt.getHeaderByIndex(colIdx);
            }
            
            if (!params.cell) {
                params.cell = view.getCellByPosition({ row: rowIdx, column: colIdx });
            }
        }
        
        if (Ext.isNumber(rowIdx)) {
            if (!params.row) {
                params.row = view.getNode(rowIdx);
            }
            
            if (!params.record) {
                params.record = store.getAt(rowIdx);
            }
        }
        
        Ext.apply(params, {
            grid: grid,
            view: view,
            store: store
        });
        
        if (me.beforeEdit() === false || me.fireEvent('beforeedit', params) === false) {
            return;
        }
        
        me.params = params;
        me.editing = true;
        
        // Fire off our editor
        me.getEditor().startEdit(params);
    },
    
    cancelEdit: function() {
        var me = this;
        
        if (me.editing) {
            me.getEditor().cancelEdit();
            me.editing = false;
        }
    },
    
    completeEdit: function() {
        var me = this;
        
        if (me.editing && me.getEditor().completeEdit()) {
            me.editing = false;
            me.fireEvent('edit', me.params);
        }
    },


    /**********************************
     * RowEditing specific
     **********************************/
    errorSummary: true,
     
    init: function(grid) {
        var me = this;
        
        /**
         * Abstract, place in parent
         */
        
        me.grid = grid;
        me.view = grid.view;
        me.initEvents();
        me.initFieldAccessors(grid.headerCt.getGridColumns());
        
        me.addEvents(
            'beforeedit',
            
            'edit'
        );
        grid.relayEvents(me, ['beforeedit', 'edit']);
        
        /**
         * End of abstract
         */
    },

    initEditor: function() {
        var me = this,
            grid = me.grid,
            view = me.view,
            headerCt = grid.headerCt;

        return Ext.create('Ext.grid.RowEditor', {
            errorSummary: me.errorSummary,
            fields: headerCt.getGridColumns(),
            floating: true,
            hidden: true,
            
            // keep a reference..
            editingPlugin: me,
            renderTo: view.el
        });
    },
    
    setColumnField: function(column, field) {
        var me = this;
        
        // Abstract
        // me.callParent(arguments);
        if (Ext.isObject(field) && !field.isFormField) {
            field = Ext.ComponentMgr.create(field);
        }
        column.field = field;
        // End Abstract
        
        me.getEditor().setField(field, column);
    }
});