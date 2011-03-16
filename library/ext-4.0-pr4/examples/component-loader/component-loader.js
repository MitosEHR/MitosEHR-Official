Ext.require([
    'Ext.panel.Panel',
    'Ext.form.Number'
]);

Ext.onReady(function(){
    var main = Ext.create('Ext.panel.Panel', {
        renderTo: document.body,
        width: 800,
        height: 400,
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        items: [{
            flex: 1,
            title: 'Load raw html',
            styleHtmlContent: true,
            bodyPadding: 5,
            loader: {
                autoLoad: true,
                url: 'content.htm'
            }
        }, {
            flex: 1,
            title: 'Load data for template',
            bodyPadding: 5,
            tpl: 'Favorite Colors<br /><br /><tpl for="."><b>{name}</b> - <span style="color: #{hex};">{color}</span><br /></tpl>',
            loader: {
                autoLoad: true,
                url: 'data.json',
                renderer: 'data'
            }
        }, {
            flex: 1,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            title: 'Load Dynamic Components - No autoLoad',
            itemId: 'dynamic',
            dockedItems: [{
                dock: 'bottom',
                xtype: 'toolbar',
                items: ['->', {
                    fieldLabel: '# to load',
                    xtype: 'numberfield',
                    value: 5,
                    minValue: 1,
                    itemId: 'toLoad'
                }, {
                    text: 'Load!',
                    handler: function(){
                        var dynamic = main.child('#dynamic'),
                            value = dynamic.down('#toLoad').getValue();
                            
                        dynamic.getLoader().load({
                            params: {
                                total: value
                            }
                        });
                    }
                }]
            }],
            loader: {
                loadMask: true,
                removeAll: true,
                url: 'boxes.php',
                renderer: 'component',
                success: function(loader){
                    var panel = loader.getTarget();
                    panel.setTitle('Loaded ' + panel.items.getCount() + ' items');
                }
            }
        }]    
    });
});
