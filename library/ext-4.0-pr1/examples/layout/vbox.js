Ext.onReady(function() {
    Ext.create('Ext.Viewport', {
        id: 'vp',
        layout: {
            type: 'vbox',
            align: 'stretchmax'
        },
        items: [{
            xtype: 'panel',
            title: 'box 1',
            id: 'box1',
            margins: '5 5 0 5',
            width: 300,
            flex: 1,
            items: [{
                xtype: 'button',
                text: 'set box 1 to random width',
                handler: function() {
                    var w = Math.floor(Math.random() * 200) + 400;
                    Ext.getCmp('box1').setWidth(w);
                }
            }]
        },{
            xtype: 'panel',
            title: 'box 2',
            id: 'box2',
            margins: '5 5 0 5',
            width: 250,
            flex: 1,
            html: 'testing'
        },{
            xtype: 'panel',
            title: 'box 3',
            width: 180,
            id: 'box3',
            margins: '5 5 5 5',
            flex: 1,
            html: 'tiny space'
        }]
    });
});
