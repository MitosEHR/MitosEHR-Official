Ext.require([
    'widget.menu',
    'widget.textfield'
]);


Ext.onReady(function() {
    var btnClick = function(btn) {
        alert('Clicked ' + btn.text);
    };
    
    var toolbar = Ext.createWidget('toolbar', {
        renderTo: Ext.getBody(),
        
        items: [
            {
                text: 'Users Menu',
                iconCls: 'group',
                itemId: 'testBtn',
                menu: {
                    title: 'Test Menu',
                    headerPosition: 'left',
                    items: [
                        {
                            text: 'Add User',
                            iconCls: 'add',
                            handler: btnClick,
                            disabled: true
                        },
                        {
                            text: 'Edit User',
                            iconCls: 'edit',
                            handler: btnClick
                        },
                        {
                            text: 'Hidden Feature',
                            hidden: true
                        },
                        '-',
                        {
                            text: 'Delete User',
                            iconCls: 'delete',
                            disabled: true,
                            handler: btnClick
                        },
                        {
                            text: 'Sub Menu...',
                            menu: [
                                {
                                    text: 'Option 1',
                                    handler: btnClick
                                },
                                {
                                    text: 'Option 2',
                                    handler: btnClick
                                }
                            ]
                        },
                        {
                            text: 'Sub Menu 2...',
                            menu: {
                                items: [
                                    {
                                        text: 'I like Sencha!',
                                        checked: true,
                                        checkHandler: function(item, checked) {
                                            // do something
                                        }
                                    },
                                    '-',
                                    '<div class="menu-title">Choose Option</div>',
                                    {
                                        xtype: 'menucheckitem',
                                        text: 'Radio 1',
                                        group: 'group',
                                        checked: true
                                    },
                                    {
                                        xtype: 'menucheckitem',
                                        text: 'Radio 2',
                                        group: 'group'
                                    },
                                    {
                                        xtype: 'menucheckitem',
                                        text: 'Radio 3',
                                        group: 'group'
                                    },
                                    '-',
                                    {
                                        xtype: 'button',
                                        text: 'Button 1',
                                        handler: function() {
                                            console.log('clicked');
                                        }
                                    },
                                    {
                                        xtype: 'button',
                                        text: 'Indented',
                                        indent: true
                                    },
                                    {
                                        xtype: 'button',
                                        text: 'Button 2'
                                    },
                                    '-',
                                    {
                                        xtype: 'panel',
                                        title: 'My Panel',
                                        html: 'Some <b>html</b>'
                                    },
                                    {
                                        xtype: 'panel',
                                        title: 'My Panel 2',
                                        html: '<i>Indented</i>',
                                        indent: true
                                    },
                                    {
                                        xtype: 'textfield',
                                        width: 300,
                                        height: 22,
                                        hideLabel: true
                                    },
                                    {
                                        xtype: 'textfield',
                                        width: 300,
                                        height: 22,
                                        hideLabel: true,
                                        indent: true,
                                        value: 'indented'
                                    }
                                ]
                            }
                        }
                    ]
                }
            },
            {
                text: 'Overflow Menu',
                menu: {
                    height: 400,
                    items: (function() {
                        var items = [];
                        for (var i = 0; i < 10; i++) {
                            items.push({ text: 'Item ' + (i + 1) });
                        }
                        return items;
                    })()
                }
            }
        ]
    });
});
