Ext.require('Ext.data.TreeStore', function(TreeStore) {

Ext.define('Kitchensink.view.NestedList', {
    requires: ['Kitchensink.view.EditorPanel'],
    extend: 'Ext.Container',
    config: {
        layout: 'fit',
        items: [{
            xtype: 'nestedlist',
            store: new TreeStore({
                id: 'NestedListStore',
                model: 'Kitchensink.model.Cars',
                root: {},
                proxy: {
                    type: 'ajax',
                    url: 'carregions.json'
                }
            }),
            displayField: 'text',
            listeners: {
                leafitemtap: function(list, index, item) {
                    var editorPanel = Ext.getCmp('editorPanel') || new Kitchensink.view.EditorPanel();
                    editorPanel.setRecord(list.getStore().getAt(index));
                    editorPanel.show();
                }
            }
        }]
    }
});

});
