Ext.define('Ext.grid.GridViewDropZone', {
    extend: 'Ext.view.DropZone',

    indicatorHtml: '<div class="x-grid-drop-indicator-left"></div><div class="x-grid-drop-indicator-right"></div>',
    indicatorCls: 'x-grid-drop-indicator',

    handleNodeDrop : function(data, record, position) {
        var view = this.view,
            store = view.getStore(),
            index, records, i, len;

        // If the copy flag is set, create a copy of the Models with the same IDs
        if (data.copy) {
            records = data.records;
            data.records = [];
            for (i = 0, len = records.length; i < len; i++) {
                data.records.push(records[i].copy(records[i].getId()));
            }
        }

        // No copy flag: remove the Models from the source Store if it's not the destination Store
        else if (data.view !== view) {
            data.view.store.remove(data.records);
        }

        index = store.indexOf(record);
        if (position == 'after') {
            index++;
        }
        store.insert(index, data.records);
        view.getSelectionModel().select(data.records);
    }
});