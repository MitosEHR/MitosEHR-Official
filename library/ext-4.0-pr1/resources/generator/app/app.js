Ext.onReady(function() {
    Ext.regModel('Widget', {
        fields: [
            {name: 'xtype', type: 'string'},
            {name: 'filename', type: 'string'},
            {name: 'config', type: 'object'}
        ]
    });
        
    var widgetStore = new Ext.data.Store({
        model: 'Widget',
        listeners: {
            add: function(store) {
                store.each(function(record) {
                    var slicer = new WidgetSlicer({
                        record: record
                    });
                });
                
                Slicer.slice();
                PageSlice.terminate();
            }
        }
    });
    
    widgetStore.add(manifest.widgets);
});