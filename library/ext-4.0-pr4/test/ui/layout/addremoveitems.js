Ext.onReady(function() {
    var i = 0;
    new Ext.Viewport({
        id: 'vp',
        layout: {
            type: 'vbox',
            align: 'stretchmax'
        },
        items: [{
            xtype: 'button',
            text: 'Add Panel',
            height: 30,
            width: 100,
            handler: function() {
                i++;
                var o = new Ext.Panel({
                    title: 'Panel ' + i,
                    width: 300,
                    flex: 1,
                    items: [{
                        xtype: 'button',
                        text: 'Hide Me',
                        handler: function(o) {
                            o.ownerCt.hide();
                            o.ownerCt.ownerCt.doLayout();
                        }
                    }]
                });
                Ext.getCmp('vp').add(o);
            }
        }, {
            xtype: 'button',
            text: 'Remove Panel',
            height: 30,
            width: 100,
            handler: function() {
                var vp = Ext.getCmp('vp');
                vp.remove(vp.items.last());
            }
        }, {
            xtype: 'button',
            text: 'Move Panel 1 to 3',
            height: 30,
            width: 100,
            handler: function() {
                var vp = Ext.getCmp('vp');
                vp.move(5, 3);
            }
        }]
    });
});
