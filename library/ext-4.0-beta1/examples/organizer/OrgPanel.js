Ext.define('Ext.org.OrgPanel', {
    extend: 'Ext.panel.Panel',
    requires: 'Ext.layout.container.Border',
    
    layout: 'border',
    
    initComponent: function() {
        this.items = [
            {
                xtype: 'albumtree',
                region: 'west',
                padding: 5,
                width: 200
            },
            {
                xtype: 'panel',
                title: 'My Images',
                layout: 'fit',
                region: 'center',
                padding: '5 5 5 0',
                items: {
                    xtype: 'imageview'
                }
            }
        ];
        
        this.callParent(arguments);
    }
});