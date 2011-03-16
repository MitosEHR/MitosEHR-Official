Ext.require(
    'Ext.panel.Panel'
);

Ext.onReady(function() {
    new Ext.Panel({
        renderTo: 'dock-example',
        title: 'foo',
        width: 300,
        height: 200,
        dockedItems: [{
            xtype: 'component',
            dock: 'top',
            height: 0,
            html: 'Should NOT be visible'
        }],
        html: 'Test'
    });
});