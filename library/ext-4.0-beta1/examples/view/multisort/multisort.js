Ext.Loader.setConfig({ enabled: true});
Ext.Loader.setPath('Ext.multisort', '.');
Ext.Loader.setPath('Ext.ux', '../../ux/');

Ext.require([
    'Ext.data.Store',
    'Ext.data.AjaxProxy',
    'Ext.multisort.Panel',
    'Ext.multisort.SortButton',
    'Ext.ux.BoxReorderer',
    'Ext.ux.DataView.Animated'
]);

Ext.onReady(function() {
    Ext.create('Ext.multisort.Panel', {
        renderTo: Ext.getBody()
    });
});