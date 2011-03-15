Ext.Loader.setConfig({enabled: true});

Ext.Loader.setPath('Ext.ux', '../ux/');

Ext.require([
    'Ext.tab.*',
    'Ext.ux.TabReorderer'
]);

Ext.onReady(function() {
    var tabCount = 3;

    var tabPanel = Ext.create('Ext.tab.TabPanel', {
        renderTo: Ext.getBody(),
        width: 600,
        height: 400,
        //plain: true,
        bodyStyle: 'padding:5px',
        plugins: Ext.create('Ext.ux.TabReorderer'),
        items: [{
            xtype: 'panel',
            title: 'First Panel',
            html : 'Test 1',
            closable: true
        }, {
            xtype: 'panel',
            title: 'Second Panel',
            html : 'Test 2',
            closable: true
        }, {
            xtype: 'panel',
            title: 'Third Panel',
            reorderable: false,
            html : 'Test 3: Reorderable set to false',
            closable: true
        }],

        dockedItems: {
            dock: 'bottom',
            xtype: 'toolbar',
            items: [{
                text : 'Add an item',
                handler: function() {
                    tabCount++;

                    tabPanel.add({
                        xtype: 'panel',
                        title: 'Tab ' + tabCount,
                        html : 'Content for tab ' + tabCount,
                        closable: true
                    });
                }
            }, {
                text: 'Toggle tabs enabled',
                handler: function() {
                    tabPanel.tabBar.items.each(function(tab) {
                        tab.disabled ? tab.enable() : tab.disable();
                    });
                }
            }, {
                text: 'Remove 2nd item',
                handler: function() {
                    var item = tabPanel.items.items[1];

                    if (item) {
                        tabPanel.remove(item);
                    }
                }
            }]
        }
    });
});