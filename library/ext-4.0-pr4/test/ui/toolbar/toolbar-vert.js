Ext.onReady(function() {
    Ext.create('Ext.toolbar.Toolbar', {
        renderTo: Ext.getBody(),
        vertical: true,
        cls : 'floater',
        height : 600,
        width: 70,
        items: [
            {
                text: 'Top',
                handler: function() {
                    alert('clicked button');
                }
            },
            {
                xtype: 'tbfill'
            },
            {
                text: 'Middle',
                handler: function() {
                    alert('clicked button');
                }
            },
            {
                xtype: 'tbfill'
            },
            {
                xtype: 'tbtext',
                text : 'Text'
            },
            {
                text: 'Bottom',
                handler: function() {
                    alert('clicked button');
                }
            }
        ]
    });
});