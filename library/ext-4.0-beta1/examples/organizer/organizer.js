Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath('Ext.org', '.');
Ext.Loader.setPath('Ext.ux.DataView', 'ux');

Ext.require([
    'Ext.org.ImageView',
    'Ext.org.AlbumTree',
    'Ext.org.OrgPanel'
]);

Ext.require([
    'Ext.data.TreeStore',
    'Ext.data.AjaxProxy',
    'Ext.tree.TreeHeader',
    'Ext.tree.TreeView',
    'Ext.tree.SelectionModel',
    'Ext.tree.TreeViewDDPlugin'
]);

Ext.onReady(function() {
    Ext.create('Ext.org.OrgPanel', {
        renderTo: Ext.getBody(),
        height: 490,
        width : 700
    });
});