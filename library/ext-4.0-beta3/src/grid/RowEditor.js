// Currently has the following issues:
// - Does not handle postEditValue
// - Fields without editors need to sync with their values in Store
// - starting to edit another record while already editing and dirty should probably prevent it
// - aggregating validation messages
// - tabIndex is not managed bc we leave elements in dom, and simply move via positioning
// - layout issues when changing sizes/width while hidden (layout bug)

/**
 * @class Ext.grid.RowEditor
 * @extends Ext.form.Panel
 * 
 * Internal utility class used to provide row editing functionality. For developers, they should use
 * the RowEditing plugin to use this functionality with a grid.
 * 
 * @ignore
 */
Ext.define('Ext.grid.RowEditor', {
    extend: 'Ext.form.Panel',
    requires: [
        'Ext.tip.ToolTip',
        'Ext.util.HashMap',
        'Ext.util.KeyNav'
    ],

    saveBtnText  : 'Update',
    cancelBtnText: 'Cancel',
    errorsText: 'Errors',
    
    lastScrollLeft: 0,
    lastScrollTop: 0,
    
    border: false,

    initComponent: function() {
        var me = this,
            form;
        
        me.cls = Ext.baseCSSPrefix + 'grid-row-editor';
        
        me.layout = {
            type: 'hbox'
        };
        
        // Maintain field-to-column mapping
        // It's easy to get a field from a column, but not vice versa
        me.columns = Ext.create('Ext.util.HashMap');
        me.columns.getKey = function(o) {
            var f;
            if (o.getField && (f = o.getField())) {
                return f.id;
            }
            return o.id;
        };
        me.mon(me.columns, {
            add: me.onFieldAdd,
            remove: me.onFieldRemove,
            replace: me.onFieldReplace,
            scope: me
        });
        
        me.callParent(arguments);
        
        if (me.fields) {
            me.setField(me.fields);
            delete me.fields;
        }
        
        form = me.getForm();
        form.trackResetOnLoad = true;
        if (me.errorSummary) {
            me.mon(form, 'validitychange', me.onValidityChange, me);
        }
    },
    
    onValidityChange: function(form, valid) {
        var me = this;
        if (me.isVisible()) {
            me[valid ? 'hideToolTip' : 'showToolTip']();
        }
    },

    afterRender: function() {
        var me = this,
            plugin = me.editingPlugin;
            
        me.callParent(arguments);
        me.renderTo.on('scroll', me.onCtScroll, me, { buffer: 100 });
        
        // Prevent from bubbling click events to the grid view
        me.mon(me.el, {
            click: Ext.emptyFn,
            stopPropagation: true
        });
        
        me.el.swallowEvent([
            'keypress',
            'keydown'
        ]);
        
        me.keyNav = Ext.create('Ext.util.KeyNav', me.el, {
            enter: plugin.completeEdit,
            esc: plugin.onEscKey,
            scope: plugin
        });
        
        me.mon(plugin.view, {
            beforerefresh: me.onBeforeViewRefresh,
            refresh: me.onViewRefresh,
            scope: me
        });
    },
    
    onBeforeViewRefresh: function(view) {
        var me = this,
            viewDom = view.el.dom;
        
        if (me.el.dom.parentNode === viewDom) {
            viewDom.removeChild(me.el.dom);
        }
    },
    
    onViewRefresh: function(view) {
        var me = this,
            viewDom = view.el.dom,
            params = me.params,
            idx;
            
        viewDom.appendChild(me.el.dom);
        
        // Recover our row node after a view refresh
        if (params && (idx = params.store.indexOf(params.record)) >= 0) {
            params.row = view.getNode(idx);
            me.reposition();
            if (me.tooltip && me.tooltip.isVisible()) {
                me.tooltip.setTarget(params.row);
            }
        } else {
            me.editingPlugin.cancelEdit();
        }
    },
    
    onCtScroll: function(e, target) {
        var me = this,
            scrollTop  = target.scrollTop,
            scrollLeft = target.scrollLeft;
        
        if (scrollTop !== me.lastScrollTop) {
            me.lastScrollTop = scrollTop;
            if (me.tooltip.isVisible() || me.hiddenTip) {
                me.repositionTip();
            }
        }
        if (scrollLeft !== me.lastScrollLeft) {
            me.lastScrollLeft = scrollLeft;
            me.reposition();
        }
    },
    
    onColumnAdd: function(column) {
        this.setField(column);
    },
    
    onColumnRemove: function(column) {
        this.columns.remove(column);
    },
    
    onColumnResize: function(column, width) {
        column.getField().setWidth(width - 2);
        if (this.isVisible()) {
            this.reposition();
        }
    },
    
    onColumnHide: function(column) {
        column.getField().hide();
        if (this.isVisible()) {
            this.reposition();
        }
    },
    
    onColumnShow: function(column) {
        var field = column.getField();
        field.setWidth(column.getWidth() - 2).show();
        if (this.isVisible()) {
            this.reposition();
        }
    },
    
    onColumnMove: function(column, fromIdx, toIdx) {
        var field = column.getField();
        if (this.items.indexOf(field) != toIdx) {
            this.move(fromIdx, toIdx);
        }
    },
    
    onFieldAdd: function(hm, fieldId, column) {
        var me = this,
            colIdx = me.editingPlugin.grid.headerCt.getHeaderIndex(column),
            field = column.getField({ xtype: 'displayfield' });
        
        me.insert(colIdx, field);
    },
    
    onFieldRemove: function(hm, fieldId, column) {
        var me = this,
            field = column.getField(),
            fieldDom = field.el.dom;
        me.remove(field, false);
        fieldDom.parentNode.removeChild(fieldDom);
    },
    
    onFieldReplace: function(hm, fieldId, column, oldColumn) {
        var me = this;
        me.onFieldRemove(hm, fieldId, oldColumn);
    },
    
    clearFields: function() {
        var me = this,
            hm = me.columns;
        hm.each(function(fieldId) {
            hm.removeAtKey(fieldId);
        });
    },

    getFloatingButtons: function() {
        var me = this,
            cssPrefix = Ext.baseCSSPrefix,
            btnsCss = cssPrefix + 'grid-row-editor-buttons',
            plugin = me.editingPlugin,
            btns;
        
        if (!me.floatingButtons) {
            btns = me.floatingButtons = Ext.create('Ext.Container', {
                renderTpl: [
                    '<div class="{baseCls}-ml"></div>',
                    '<div class="{baseCls}-mr"></div>',
                    '<div class="{baseCls}-bl"></div>',
                    '<div class="{baseCls}-br"></div>',
                    '<div class="{baseCls}-bc"></div>'
                ],
                
                renderTo: me.el,
                baseCls: btnsCss,
                layout: 'hbox',
                defaults: {
                    margins: '0 1 1 1'
                },
                items: [{
                    flex: 1,
                    xtype: 'button',
                    handler: plugin.completeEdit,
                    scope: plugin,
                    text: me.saveBtnText
                }, {
                    flex: 1,
                    xtype: 'button',
                    handler: plugin.cancelEdit,
                    scope: plugin,
                    text: me.cancelBtnText
                }]
            });
            
            // Prevent from bubbling click events to the grid view
            me.mon(btns.el, {
                click: Ext.emptyFn,
                stopEvent: true
            });
        }
        
        return me.floatingButtons;
    },

    // floating buttons are positioned independently of the roweditor itself
    // this method will reposition the buttons to be immediately below 
    reposition: function(animate) {
        var me = this,
            params = me.params,
            row = params && Ext.get(params.row),
            btns = me.getFloatingButtons(),
            btnEl = btns.el,
            grid = me.editingPlugin.grid,
            scroller = grid.verticalScroller,
            
            // always get data from ColumnModel as its what drives
            // the GridView's sizing
            mainBodyWidth = grid.headerCt.getFullWidth(),
            scrollerWidth = grid.getWidth(),
            
            // use the minimum as the columns may not fill up the entire grid
            // width
            width = Math.min(mainBodyWidth, scrollerWidth),
            scrollLeft = grid.view.el.dom.scrollLeft,
            btnWidth = btns.getWidth(),
            left = (width - btnWidth) / 2 + scrollLeft,
            y, rowH, newHeight,
            
            invalidateScroller = function() {
                // Bring our row into view if necessary, so a row editor that's already
                // visible and animated to the row will appear smooth
                if (scroller) {
                    row.scrollIntoView(scroller.el, false);
                    scroller.invalidate();
                    btnEl.scrollIntoView(scroller.el, false);
                }
                
                if (animate && animate.callback) {
                    animate.callback();
                }
            };

        // need to set both top/left
        if (row && Ext.isElement(row.dom)) {
            // Get the y position of the row relative to its top-most static parent.
            // offsetTop will be relative to the table, and is incorrect
            // when mixed with certain grid features (e.g., grouping).
            y = row.getXY()[1] - 5;
            rowH = row.getHeight();
            newHeight = rowH + 10;
            
            // IE doesn't set the height quite right.
            // This isn't a border-box issue, it even happens
            // in IE8 and IE7 quirks.
            // TODO: Test in IE9!
            if (Ext.isIE) {
                newHeight += 2;
            }
            
            if (me.getHeight() != newHeight) {
                me.setHeight(newHeight);
                me.resizeFields(rowH);
                me.el.setLeft(0);
            }
            
            if (animate) {
                var animObj = {
                    to: {
                        y: y
                    },
                    listeners: {
                        afteranimate: invalidateScroller
                    }
                };
                me.animate(animObj);
            } else {
                me.el.setY(y);
                invalidateScroller();
            }
        }
        if (me.getWidth() != mainBodyWidth) {
            me.setWidth(mainBodyWidth);
        }
        btnEl.setLeft(left);
    },
    
    resizeFields: function(height) {
        var me = this;
        
        Ext.Array.forEach(me.query('>[isFormField]'), function(field) {
            if (field.getHeight() != height) {
                field.setHeight(height);
            }
        }, me);
    },
    
    getField: function(fieldInfo) {
        var me = this;
        
        if (Ext.isNumber(fieldInfo)) {
            // Query only form fields. This just future-proofs us incase we add
            // other components to RowEditor later on.  Don't want to mess with
            // indicies.
            return me.query('>[isFormField]')[fieldInfo];
        } else if (fieldInfo instanceof Ext.grid.Header) {
            return fieldInfo.getField();
        }
    },
    
    removeField: function(field) {
        var me = this;
        
        // Incase we pass a column instead, which is fine
        field = me.getField(field);
        
        // Remove field/column from our mapping, which will fire the event to
        // remove the field from our container
        me.columns.removeKey(field.id);
    },
    
    setField: function(column) {
        var me = this,
            field;
        
        if (Ext.isArray(column)) {
            Ext.Array.forEach(column, me.setField, me);
            return;
        }
        
        // Get a default display field if necessary
        field = column.getField({ xtype: 'displayfield' });
        field.margins = '5 0 5 2';
        field.setWidth(column.getWidth() - 2);
        
        // Maintain mapping of fields-to-columns
        // This will fire events that maintain our container items
        me.columns.add(field.id, column);
    },
    
    loadRecord: function(record) {
        var me = this,
            form = me.getForm();
        form.loadRecord(record);
        if (form.isValid()) {
            me.hideToolTip();
        } else {
            me.showToolTip();
        }
        
        // render display fields so they honor the column renderer/template
        Ext.Array.forEach(me.query('>displayfield'), function(field) {
            me.renderColumnData(field, record);
        }, me);
    },
    
    renderColumnData: function(field, record) {
        var me = this,
            grid = me.editingPlugin.grid,
            headerCt = grid.headerCt,
            view = grid.view,
            store = view.store,
            column = me.columns.get(field.id),
            value = field.getRawValue();
        
        // honor our column's renderer (TemplateHeader sets renderer for us!)
        if (column.renderer) {
            var metaData = { tdCls: '', style: '' },
                rowIdx = store.indexOf(record),
                colIdx = headerCt.getHeaderIndex(column);
            
            value = column.renderer.call(
                column.scope || headerCt.ownerCt,
                value,
                metaData,
                record,
                rowIdx,
                colIdx,
                store,
                view
            );
        }
        
        field.setRawValue(value);
        field.resetOriginalValue();
    },

    startEdit: function(params) {
        var me = this,
            field, record,
            
            focusCell = function() {
                field = me.getField(params.colIdx);
                if (field && field.focus) {
                    field.focus();
                }
            };
        
        // Store our params
        me.params = params;
        record = params.record;

        // make sure our row is selected before editing
        params.grid.getSelectionModel().select(record);
        
        // Reload the record data
        me.loadRecord(record);
        
        if (!me.isVisible()) {
            me.show();
            focusCell();
        } else {
            me.reposition({
                animate: true,
                callback: focusCell
            });
        }
    },

    cancelEdit: function() {
        var me = this,
            form = me.getForm();
        me.hide();
        form.clearInvalid();
        form.reset();
    },

    completeEdit: function() {
        var me = this,
            form = me.getForm();
            
        if (!form.isValid()) {
            return;
        }
        
        form.updateRecord(me.params.record);
        me.hide();
        return true;
    },

    onShow: function() {
        var me = this;
        me.callParent(arguments);
        me.reposition();
    },

    onHide: function() {
        var me = this;
        me.callParent(arguments);
        me.hideToolTip();
        me.invalidateScroller();
        if (me.params) {
            me.params.view.focus();
        }
    },
    
    isDirty: function() {
        var me = this,
            form = me.getForm();
        return form.isDirty();
    },
    
    getToolTip: function() {
        var me = this,
            tip;
        
        if (!me.tooltip) {
            tip = me.tooltip = Ext.createWidget('tooltip', {
                cls: Ext.baseCSSPrefix + 'grid-row-editor-errors',
                title: me.errorsText,
                autoHide: false,
                closable: true,
                closeAction: 'disable',
                anchor: 'left'
            });
        }
        
        return me.tooltip;
    },
    
    hideToolTip: function() {
        var me = this,
            tip = me.getToolTip();
        if (tip.rendered) {
            tip.disable();
        }
        me.hiddenTip = false;
    },
    
    showToolTip: function() {
        var me = this,
            tip = me.getToolTip(),
            params = me.params,
            row = Ext.get(params.row),
            viewEl = params.grid.view.el;
        
        tip.setTarget(row);
        tip.showAt([-10000, -10000]);
        tip.body.update(me.getErrors());
        tip.mouseOffset = [viewEl.getWidth() - row.getWidth() + me.lastScrollLeft + 15, 0];
        me.repositionTip();
        tip.doLayout();
        tip.enable();
    },
    
    repositionTip: function() {
        var me = this,
            tip = me.getToolTip(),
            params = me.params,
            row = Ext.get(params.row),
            viewEl = params.grid.view.el,
            viewHeight = viewEl.getHeight(),
            viewTop = me.lastScrollTop,
            viewBottom = viewTop + viewHeight,
            rowHeight = row.getHeight(),
            rowTop = row.dom.offsetTop,
            rowBottom = rowTop + rowHeight;
        
        if (rowBottom > viewTop && rowTop < viewBottom) {
            tip.show();
            me.hiddenTip = false;
        } else {
            tip.hide();
            me.hiddenTip = true;
        }
    },
    
    getErrors: function() {
        var me = this,
            errors = [];
        
        Ext.Array.forEach(me.query('>[isFormField]'), function(field) {
            errors = errors.concat(
                Ext.Array.map(field.getErrors(), function(e) {
                    return '<li>' + e + '</li>';
                })
            );
        }, me);
        
        return '<ul>' + errors.join('') + '</ul>';
    },
    
    invalidateScroller: function() {
        var me = this,
            params = me.params,
            scroller = params.grid.verticalScroller;
        
        if (scroller) {
            scroller.invalidate();
        }
    }
});