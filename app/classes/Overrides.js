//Ext.override(Ext.grid.RowEditor, {
//	loadRecord: function(record) {
//		var me = this,
//			form = me.getForm(),
//			valid = form.isValid();
//
//		form.loadRecord(record);
//		if(me.errorSummary) {
//			me[valid ? 'hideToolTip' : 'showToolTip']();
//		}
//
//		Ext.Array.forEach(me.query('>displayfield'), function(field) {
//			me.renderColumnData(field, record);
//		}, me);
//	}
//});
Ext.override(Ext.form.field.Checkbox, {
	inputValue    : '1',
	uncheckedValue: '0'
});

Ext.override(Ext.grid.ViewDropZone, {

    handleNodeDrop : function(data, record, position) {
        var view = this.view,
            store = view.getStore(),
            index, records, i, len;
        /**
         * fixed to handle the patient button data
         */
        if(data.patient){
            data.records = data.patient;
            delete data.patient;
        }else{
            if (data.copy) {
                records = data.records;
                data.records = [];
                for (i = 0, len = records.length; i < len; i++) {
                    delete records[i].data.id;
                    //say(records[i].data);
                    data.records.push(records[i].data);
                }
            } else {
                data.view.store.remove(data.records, data.view === view);
            }
        }

        index = store.indexOf(record);
        if (position !== 'before') {
            index++;
        }
        store.add(data.records);
        view.getSelectionModel().select(data.records);
    }

});