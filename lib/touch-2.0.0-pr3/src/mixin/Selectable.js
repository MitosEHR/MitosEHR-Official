/**
 * Tracks what records are currently selected in a databound widget. This class is mixed in to
 * @private
 */
Ext.define('Ext.mixin.Selectable', {
    //this was the name in 1.x, remove this alias in 3.x
    alternateClassName: 'Ext.AbstractStoreSelectionModel',

    extend: 'Ext.mixin.Mixin',

    mixinConfig: {
        id: 'selectable',
        hooks: {
            applyStore : 'applyStore',
            updateStore: 'updateStore'
        }
    },

    /**
     * @deprecated
     * @event beforeselectionchange
     * @preventable selectionchange
     * Fires before an item is selected
     */

    /**
     * @event selectionchange
     * Fires when a selection changes
     * @param {Ext.mixin.Selectable} this
     * @param {Ext.data.Model[]} records The records whose selection has changed
     */

    config: {
        /**
         * @cfg {Boolean} locked
         * When true, locks the current selection so that the user cannot change what is selected. Defaults to false,
         * see {@link #setLocked} to dynamically change locking at run time
         * @accessor
         */
        locked: false,

        /**
         * @cfg {String} mode
         * Modes of selection.
         * Valid values are SINGLE, SIMPLE, and MULTI. Defaults to 'SINGLE'
         * @accessor
         */
        mode: 'SINGLE',

        /**
         * @cfg {Ext.util.MixedCollection} selected
         * The {@link Ext.util.MixedCollection MixedCollection} that maintains the set of currently selected items
         * @accessor
         */
        selected: null,

        /**
         * @cfg {Boolean} allowDeselect
         * Allow users to deselect a record in a DataView, List or Grid. Only applicable when the Selectable's mode is
         * 'SINGLE'. Defaults to false.
         * @accessor
         */
        allowDeselect: false,

        /**
         * @cfg
         * @private
         * @accessor
         */
        lastSelected: null,

        /**
         * @cfg
         * @private
         * @accessor
         */
        lastFocused: null,

        /**
         * @cfg {Boolean} deselectOnContainerClick True to deselect current selection when the container body is
         * clicked. Defaults to true
         * @accessor
         */
        deselectOnContainerClick: true
    },

    modes: {
        SINGLE: true,
        SIMPLE: true,
        MULTI: true
    },

    selectableEventHooks: {
        add: 'onSelectionStoreAdd',
        remove: 'onSelectionStoreRemove',
        update: 'onSelectionStoreUpdate',
        clear: 'onSelectionStoreClear',
        load: 'refreshSelection',
        sort: 'refreshSelection',
        filter: 'refreshSelection'
    },

    constructor: function() {
        this._selected = new Ext.util.MixedCollection();
        this.callParent(arguments);
    },

    applySelected: function(newSelected, selectedCollection) {
        if (newSelected) {
            if (!Ext.isArray(newSelected)) {
                selectedCollection.add(newSelected);
            }
            else {
                selectedCollection.addAll(newSelected);
            }
        }
    },

    applyMode: function(mode) {
        mode = mode ? mode.toUpperCase() : 'SINGLE';
        // set to mode specified unless it doesnt exist, in that case
        // use single.
        return this.modes[mode] ? mode : 'SINGLE';
    },

    applyStore: function(store) {
        var me = this,
            bindEvents = Ext.apply({}, me.selectableEventHooks, { scope: me });

        if (store) {
            store = Ext.data.StoreManager.lookup(store);
            if (store && Ext.isObject(store) && store.isStore) {
                store.on(bindEvents);
            }
        }
    },

    updateStore: function(newStore, oldStore) {
        var me = this,
            bindEvents = Ext.apply({}, me.selectableEventHooks, { scope: me });

        if (oldStore && Ext.isObject(oldStore) && oldStore.isStore) {
            if (oldStore.autoDestroy) {
                oldStore.destroy();
            }
            else {
                oldStore.un(bindEvents);
            }
        }

        if (newStore) {
            me.refreshSelection();
        }
    },

    selectAll: function(silent) {
        var me = this,
            selections = me.getStore().getRange(),
            ln = selections.length,
            i = 0;
        for (; i < ln; i++) {
            me.select(selections[i], true, silent);
        }
    },

    deselectAll: function() {
        var me = this,
            selections = me.getStore().getRange(),
            ln = selections.length,
            i = 0;
        for (; i < ln; i++) {
            me.deselect(selections[i]);
        }
    },

    // Provides differentiation of logic between MULTI, SIMPLE and SINGLE
    // selection modes.
    selectWithEvent: function(record) {
        var me = this,
            isSelected = me.isSelected(record);
        switch (me.getMode()) {
            case 'MULTI':
            case 'SIMPLE':
                if (isSelected) {
                    me.deselect(record);
                }
                else {
                    me.select(record, true);
                }
                break;
            case 'SINGLE':
                if (me.getAllowDeselect() && isSelected) {
                    // if allowDeselect is on and this record isSelected, deselect it
                    me.deselect(record);
                } else {
                    // select the record and do NOT maintain existing selections
                    me.select(record, false);
                }
                break;
        }
    },

    /**
     * Selects a range of rows if the selection model {@link Ext.mixin.Selectable#getLocked is not locked}.
     * All rows in between startRow and endRow are also selected.
     * @param {Number} startRow The index of the first row in the range
     * @param {Number} endRow The index of the last row in the range
     * @param {Boolean} keepExisting (optional) True to retain existing selections
     */
    selectRange: function(startRecord, endRecord, keepExisting, dir) {
        var me = this,
            store = me.getStore(),
            startRow = store.indexOf(startRecord),
            endRow = store.indexOf(endRecord),
            selectedCount = 0,
            tmp, dontDeselect, i;

        if (me.getLocked()) {
            return;
        }

        // swap values
        if (startRow > endRow) {
            tmp = endRow;
            endRow = startRow;
            startRow = tmp;
        }

        for (i = startRow; i <= endRow; i++) {
            if (me.isSelected(store.getAt(i))) {
                selectedCount++;
            }
        }

        if (!dir) {
            dontDeselect = -1;
        }
        else {
            dontDeselect = (dir == 'up') ? startRow : endRow;
        }

        for (i = startRow; i <= endRow; i++) {
            if (selectedCount == (endRow - startRow + 1)) {
                if (i != dontDeselect) {
                    me.deselect(i, true);
                }
            } else {
                me.select(i, true);
            }

        }
    },

    /**
     * Adds the given records to the currently selected set
     * @param {Ext.data.Model/Array/Number} records The records to select
     * @param {Boolean} keepExisting If true, the existing selection will be added to (if not, the old selection is replaced)
     * @param {Boolean} suppressEvent If true, the 'select' event will not be fired
     */
    select: function(records, keepExisting, suppressEvent) {
        var me = this,
            record;

        if (me.getLocked()) {
            return;
        }

        if (typeof records === "number") {
            records = [me.getStore().getAt(records)];
        }

        if (!records) {
            return;
        }

        if (me.getMode() == "SINGLE" && records) {
            record = records.length ? records[0] : records;
            me.doSingleSelect(record, suppressEvent);
        } else {
            me.doMultiSelect(records, keepExisting, suppressEvent);
        }
    },

    doSingleSelect: function(record, suppressEvent) {
        var me = this,
            selected = me.getSelected();

        if (me.getLocked()) {
            return;
        }

        // already selected.
        // should we also check beforeselect?
        if (me.isSelected(record)) {
            return;
        }

        if (selected.getCount() > 0) {
            me.deselect(me.getLastSelected(), suppressEvent);
        }

        selected.add(record);
        me.setLastSelected(record);
        me.onItemSelect(record, suppressEvent);
        me.setLastFocused(record);
        me.fireSelectionChange(!suppressEvent);
    },

    doMultiSelect: function(records, keepExisting, suppressEvent) {
        if (records === null || this.getLocked()) {
            return;
        }
        records = !Ext.isArray(records) ? [records] : records;

        var me = this,
            selected = me.getSelected(),
            ln = records.length,
            change = false,
            i = 0,
            record;

        if (!keepExisting && selected.getCount() > 0) {
            change = true;
            me.deselect(me.getSelection(), true);
        }
        for (; i < ln; i++) {
            record = records[i];
            if (keepExisting && me.isSelected(record)) {
                continue;
            }
            change = true;
            me.setLastSelected(record);
            selected.add(record);
            if (!suppressEvent) {
                me.setLastFocused(record);
            }

            me.onItemSelect(record, suppressEvent);
        }
        this.fireSelectionChange(change && !suppressEvent);
    },

    /**
     * Deselects the given record(s). If many records are currently selected, it will only deselect those you pass in.
     * @param {Number/Array/Ext.data.Model} records The record(s) to deselect. Can also be a number to reference by index
     * @param {Boolean} suppressEvent If true the deselect event will not be fired
     */
    deselect: function(records, suppressEvent) {
        var me = this,
            selected = me.getSelected(),
            ln = records.length,
            change = false,
            i = 0,
            record;

        if (me.getLocked()) {
            return;
        }

        if (typeof records === "number") {
            records = [me.getStore().getAt(records)];
        }

        if (!Ext.isArray(records)) {
            records = [records];
            ln = 1;
        }

        for (; i < ln; i++) {
            record = records[i];
            if (selected.remove(record)) {
                if (me.getLastSelected() == record) {
                    me.setLastSelected(selected.last());
                }
                me.onItemDeselect(record, suppressEvent);
                change = true;
            }
        }
        me.fireSelectionChange(change && !suppressEvent);
    },

    /**
     * @param {Ext.data.Record} record
     * Set a record as the last focused record. This does NOT mean
     * that the record has been selected.
     */
    updateLastFocused: function(newRecord, oldRecord) {
        this.onLastFocusChanged(oldRecord, newRecord);
    },

    fireSelectionChange: function(fireEvent) {
        var me = this;
        if (fireEvent) {
            //<deprecated product=touch since=2.0>
            me.fireAction('beforeselectionchange', [], function() {
            //</deprecated>
                me.fireEvent('selectionchange', me, me.getSelection());
            //<deprecated product=touch since=2.0>
            });
            //</deprecated>
        }
    },

    /**
     * Returns an array of the currently selected records.
     */
    getSelection: function() {
        return this.getSelected().getRange();
    },

    /**
     * Returns <tt>true</tt> if the specified row is selected.
     * @param {Ext.data.Model/Number} record The record or index of the record to check
     * @return {Boolean}
     */
    isSelected: function(record) {
        record = Ext.isNumber(record) ? this.getStore().getAt(record) : record;
        return this.getSelected().indexOf(record) !== -1;
    },

    /**
     * Returns true if there is a selected record.
     * @return {Boolean}
     */
    hasSelection: function() {
        return this.getSelected().getCount() > 0;
    },

    refreshSelection: function() {
        var me = this,
            newSelection = [],
            oldSelections = me.getSelection(),
            ln = oldSelections.length,
            i = 0,
            selection, change;

        // check to make sure that there are no records
        // missing after the refresh was triggered, prune
        // them from what is to be selected if so
        for (; i < ln; i++) {
            selection = oldSelections[i];
            if (me.getStore().indexOf(selection) != -1) {
                newSelection.push(selection);
            }
        }

        // there was a change from the old selected and
        // the new selection
        if (me.getSelected().getCount() != newSelection.length) {
            change = true;
        }

        me.clearSelections();

        if (newSelection.length) {
            // perform the selection again
            me.select(newSelection, false, true);
        }

        me.fireSelectionChange(change);
    },

    clearSelections: function() {
        // reset the entire selection to nothing
        var me = this;
        me.getSelected().clear();
        me.setLastSelected(null);
        me.setLastFocused(null);
    },

    // when a store is cleared remove all selections
    // (if there were any)
    onSelectionStoreClear: function() {
        var me = this,
            selected = me.getSelected();
        if (selected.getCount > 0) {
            selected.clear();
            me.setLastSelected(null);
            me.setLastFocused(null);
            me.fireSelectionChange(true);
        }
    },

    // prune records from the SelectionModel if
    // they were selected at the time they were
    // removed.
    onSelectionStoreRemove: function(store, record) {
        var me = this,
            selected = me.getSelected();

        if (me.getLocked()) {
            return;
        }

        if (selected.remove(record)) {
            if (me.getLastSelected() == record) {
                me.setLastSelected(null);
            }
            if (me.getLastFocused() == record) {
                me.setLastFocused(null);
            }
            me.fireSelectionChange(true);
        }
    },

    getCount: function() {
        return this.getSelected().getCount();
    },

    onSelectionStoreAdd: Ext.emptyFn,
    onSelectionStoreUpdate: Ext.emptyFn,
    onItemSelect: Ext.emptyFn,
    onItemDeselect: Ext.emptyFn,
    onLastFocusChanged: Ext.emptyFn,
    onEditorKey: Ext.emptyFn
}, function() {
    /**
     * Selects a record instance by record instance or index.
     * @deprecated
     * @member Ext.mixin.Selectable
     * @method doSelect
     * @param {Ext.data.Model/Number} records An array of records or an index
     * @param {Boolean} keepExisting
     * @param {Boolean} suppressEvent Set to false to not fire a select event
     */

    /**
     * Deselects a record instance by record instance or index.
     * @deprecated
     * @member Ext.mixin.Selectable
     * @method doDeselect
     * @param {Ext.data.Model/Number} records An array of records or an index
     * @param {Boolean} suppressEvent Set to false to not fire a deselect event
     */

    /**
     * Returns the selection mode currently used by this Selectable
     * @member Ext.mixin.Selectable
     * @method getSelectionMode
     * @deprecated
     * @return {String} The current mode
     */

    /**
     * Returns the array of previously selected items
     * @member Ext.mixin.Selectable
     * @method getLastSelected
     * @deprecated
     * @return {Array} The previous selection
     */

    /**
     * Returns true if the Selectable is currently locked
     * @member Ext.mixin.Selectable
     * @method isLocked
     * @deprecated
     * @return {Boolean} True if currently locked
     */

     /**
      * This was an internal function accidentally exposed in 1.x and now deprecated. Calling it has no effect
      * @member Ext.mixin.Selectable
      * @method setLastFocused
      * @deprecated
      */

    //<deprecated product=touch since=2.0>
    Ext.deprecateClassMethod(this, 'isLocked', this.prototype.getLocked, "'isLocked()' is deprecated, please use 'getLocked' instead");
    Ext.deprecateClassMethod(this, 'getSelectionMode', this.prototype.getMode, "'getSelectionMode()' is deprecated, please use 'getMode' instead");
    Ext.deprecateClassMethod(this, 'doDeselect', this.prototype.deselect, "'doDeselect()' is deprecated, please use 'deselect()' instead");
    Ext.deprecateClassMethod(this, 'doSelect', this.prototype.select, "'doSelect()' is deprecated, please use 'select()' instead");
    Ext.deprecateClassMethod(this, 'bind', this.prototype.setStore, "'bind()' is deprecated, please use 'setStore()' instead");
    //</deprecated>
});