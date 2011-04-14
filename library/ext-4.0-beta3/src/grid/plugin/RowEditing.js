/**
 * @class Ext.grid.plugin.RowEditing
 * @extends Ext.grid.plugin.Editing

The Ext.grid.plugin.RowEditing plugin injects editing at a row level for a Grid. When editing begins,
a small floating dialog will be shown for the appropriate row. Each editable column will show a field
for editing. There is a button to save or cancel all changes for the edit. 

The field that will be used for the editor is defined at the 
{@link Ext.grid.column.Column#field field}. The editor can be a field instance or a field configuration.
If an editor is not specified for a particular column then that column won't be editable and the value of 
the column will be displayed.
The editor may be shared for each column in the grid, or a different one may be specified for each column. 
An appropriate field type should be chosen to match the data structure that it will be editing. For example, 
to edit a date, it would be useful to specify {@link Ext.form.field.Date} as the editor.

__Example Usage__
Attaching the editor to the grid is quite simple:

    var rowEditing = Ext.create('Ext.grid.plugin.RowEditing');

    Ext.create('Ext.grid.Panel', {
        renderTo: document.body,
        store: store,
        plugins: [rowEditing],
        columns: [{
            text: 'Age',
            dataIndex: 'age',
            field: {
                xtype: 'numberfield',
                minValue: 21
            }
        }, {
            text: 'Name',
            dataIndex: 'name',
            field: {
                xtype: 'textfield',
                allowBlank: false
            }
            
        }]
    });

 
 * @markdown
 *
 */
Ext.define('Ext.grid.plugin.RowEditing', {
    // extend: 'Ext.grid.plugin.Editing',
    alias: 'plugin.rowediting',
    requires: [
        'Ext.grid.column.Column',
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
        me.addEvents(
            'beforeedit',
            'edit'
        );
        me.mixins.observable.constructor.call(me);
    },

    init: function(grid) {
        var me = this;

        me.grid = grid;
        me.view = grid.view;
        me.initEvents();
        me.initFieldAccessors(grid.headerCt.getGridColumns());
        grid.relayEvents(me, ['beforeedit', 'edit']);
    },

    /**
     * @private
     * AbstractComponent calls destroy on all its plugins at destroy time.
     */
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

        // Clear all listeners from all our events, clear all managed listeners we added to other Observables
        me.clearListeners();

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
            if (Ext.isString(field)) {
                field = { xtype: field };
            }
            if (Ext.isObject(field) && !field.isFormField) {
                field = Ext.ComponentManager.create(field, 'textfield');
                column.field = field;
            }

            Ext.apply(field, {
                name: column.dataIndex
            });

            return field;
        }
    },

    // setColumnField: function(column, field) {
    //     if (Ext.isObject(field) && !field.isFormField) {
    //         field = Ext.ComponentManager.create(field);
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
                params.column = headerCt.getHeaderAtIndex(colIdx);
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

    initEditor: function() {
        var me = this,
            grid = me.grid,
            view = me.view,
            headerCt = grid.headerCt;

        return Ext.create('Ext.grid.RowEditor', {
            errorSummary: me.errorSummary,
            fields: headerCt.getGridColumns(),
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
            field = Ext.ComponentManager.create(field);
        }
        column.field = field;
        // End Abstract

        me.getEditor().setField(field, column);
    }
});