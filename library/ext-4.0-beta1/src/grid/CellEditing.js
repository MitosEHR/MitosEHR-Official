/**
 * @class Ext.grid.CellEditing
 * @extends Ext.grid.Editing
 *
 * The Ext.grid.CellEditing plugin injects editing capabilities into a GridPanel.
 *
 * The field that will be used for the editor is defined at the {@link Ext.grid.Header#field field}
 *
 */
Ext.define('Ext.grid.CellEditing', {
    alias: 'plugin.cellediting',
    extend: 'Ext.grid.Editing',
    requires: ['Ext.grid.CellEditor'],
    
    /**
     * @cfg {Number} clicksToEdit
     * <p>The number of clicks on a cell required to display the cell's editor (defaults to 2).</p>
     */
    clicksToEdit: 2,
    
    constructor: function() {
        this.addEvents(
            'afteredit'
        );
        this.callParent(arguments);
        this.editors = new Ext.util.MixedCollection(false, function(editor) {
            return editor.headerId;
        });
    },

    // setup event handlers for what triggers an edit
    initEditTrigger: function() {
        var me    = this,
            grid  = me.grid,
            event = me.clicksToEdit === 1 ? 'cellclick' : 'celldblclick',
            view  = grid.getView(),
            viewEl = view.el;
            
        me.keyNav = new Ext.util.KeyNav(viewEl, {
            enter: me.onEnterKey,
            scope: me
        });
        
        view.on(event, me.triggerEditByClick, this);
    },
    
    // triggers an edit by clicking or double clicking
    triggerEditByClick: function(view, cell, cellIndex, record, row, rowIndex, e) {
        var headerCt = view.headerCt,
            store    = view.store,
            header   = headerCt.getHeaderByIndex(cellIndex);
            
        this.startEdit(record, header);
    },
    
    /**
     * Starts editing the specified record and header.
     * @param {Ext.data.Model} record
     * @param {Ext.grid.Header} header
     */
    startEdit: function(record, header) {
        if (!record) {
            return;
        }
        this.completeEdit();
        var ed   = this.getEditor(header),
            cell = this.getCell(record, header);
            
        if (ed) {
            this.setActiveEditor(ed);
            this.setActiveRecord(record);
            this.setActiveHeader(header);
            ed.startEdit(cell, record.get(header.dataIndex));
        } else {
            // BrowserBug: WebKit & IE refuse to focus the element, rather
            // it will focus it and then immediately focus the body. This
            // temporary hack works for Webkit and IE6. IE7 and 8 are still
            // broken
            this.grid.getView().el.focus((Ext.isWebKit || Ext.isIE) ? 10 : false);
        }
    },
    
    /**
     * Complete the edit if there is an activeEditor.
     */
    completeEdit: function() {
        var activeEd = this.getActiveEditor();
        if (activeEd) {
            activeEd.completeEdit();
        }
    },
    
    // internal getters/setters
    setActiveEditor: function(ed) {
        this.activeEditor = ed;
    },
    
    getActiveEditor: function() {
        return this.activeEditor;
    },
    
    setActiveHeader: function(header) {
        this.activeHeader = header;
    },
    
    getActiveHeader: function() {
        return this.activeHeader;
    },
    
    setActiveRecord: function(record) {
        this.activeRecord = record;
    },
    
    getActiveRecord: function() {
        return this.activeRecord;
    },
    
    /**
     * Get an Ext.grid.CellEditor with the appropriate editing field
     * for a Header.
     * @param {Ext.grid.Header} header
     * @returns {Ext.grid.CellEditor} editor Returns false if there is no editing field configured for the header.
     */
    getEditor: function(header) {
        var editors = this.editors,
            ed = editors.getByKey(header.id),
            field;
            
        if (ed) {
            return ed;
        } else {
            field = header.getEditingField();
            if (!field) {
                return false;
            }
            ed = new Ext.grid.CellEditor({
                field: header.getEditingField()
            });
            ed.headerId = header.id;
            ed.parentEl = this.grid.getEditorParent();
            // ed.parentEl should be set here.
            ed.on({
                scope: this,
                specialkey: this.onSpecialKey,
                complete: this.onEditComplete,
                canceledit: this.cancelEdit
            });
            editors.add(ed);
            return ed;
        }
    },

    /**
     * Get the cell (td) for a particular record and header.
     * @param {Ext.data.Record} record
     * @param {Ext.grid.Header} header
     * @private
     */
    getCell: function(record, header) {
        var view = this.grid.getView(),
            row  = view.getNode(record);

        return Ext.fly(row).down(header.getCellSelector());
    },  
    
    onSpecialKey: function(ed, field, e) {
        var grid = this.grid,
            sm;
        if (e.getKey() === e.TAB) {
            //this.stopEditing();
            sm = grid.getSelectionModel();
            if (sm.onEditorTab) {
                sm.onEditorTab(this, e);
            }
        }
    },
    
    onEditComplete : function(ed, value, startValue){
        var me = this,
            grid = me.grid,
            activeHeader = me.getActiveHeader(),
            activeRecord = me.getActiveRecord(),
            dataIndex = activeHeader.dataIndex,
            row = grid.store.indexOf(activeRecord),
            col = grid.getView().headerCt.getIndexOfHeader(activeHeader);
            
        activeRecord.set(dataIndex, value);
        
        me.setActiveEditor(null);
        me.setActiveHeader(null);
        me.setActiveRecord(null);
        
        me.fireEvent('afteredit', me, {
           grid: grid, 
           record: activeRecord,
           field: dataIndex,
           value: value,
           originalValue: startValue,
           row: row,
           col: col
        });
    },
    
    cancelEdit: function() {
        var me = this,
            viewEl = me.grid.getView().el;

        me.completeEdit();
        viewEl.focus();
    },
    
    /**
     * Starts editing by position (row/column)
     * @param {Object} position A position with keys of row and column.
     */
    startEditByPosition: function(position) {
        var sm = this.grid.getSelectionModel();
        if (sm.selectByPosition) {
            sm.selectByPosition(position);
        }
        
        var row    = position.row,
            col    = position.column,
            view   = this.grid.getView(),
            store  = view.store,
            record = store.getAt(row),
            header = view.headerCt.getHeaderByIndex(col);

        this.startEdit(record, header);
    },
    
    /**
     * Begin editing the currently selected cell.
     * @private
     */
    onEnterKey: function(e, t) {
        var me       = this,
            grid     = me.grid,
            selModel = grid.getSelectionModel();
            
        if (selModel.getCurrentPosition) {
            me.startEditByPosition(selModel.getCurrentPosition());
        }
    }
});