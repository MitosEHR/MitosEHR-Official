Ext.require([
    'Ext.Button',
    'Ext.Panel',
    'Ext.Toolbar'
]);

Ext.setup({
    icon: 'icon.png',
    glossOnIcon: false,
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    onReady: function () {
        var overlay;

        Ext.Viewport.add({
            layout: {
                type: 'vbox',
                pack: 'center',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'toolbar',
                    docked: 'top',
                    items: [
                        {
                            text: 'Show'
                        },
                        {flex: 1, xtype: 'component'},
                        {
                            text: 'Show'
                        },
                        {flex: 1, xtype: 'component'},
                        {
                            text: 'Show'
                        },
                        {flex: 1, xtype: 'component'},
                        {
                            text: 'Show'
                        },
                        {flex: 1, xtype: 'component'},
                        {
                            text: 'Show'
                        }
                    ]
                },
                {
                    xtype: 'toolbar',
                    items: [
                        {
                            text: 'Show'
                        },
                        {flex: 1, xtype: 'component'},
                        {
                            text: 'Show'
                        },
                        {flex: 1, xtype: 'component'},
                        {
                            text: 'Show'
                        },
                        {flex: 1, xtype: 'component'},
                        {
                            text: 'Show'
                        },
                        {flex: 1, xtype: 'component'},
                        {
                            text: 'Show'
                        }
                    ]
                },
                {
                    xtype: 'toolbar',
                    docked: 'bottom',
                    items: [
                        {
                            text: 'Show'
                        },
                        {flex: 1, xtype: 'component'},
                        {
                            text: 'Show'
                        },
                        {flex: 1, xtype: 'component'},
                        {
                            text: 'Show'
                        },
                        {flex: 1, xtype: 'component'},
                        {
                            text: 'Show'
                        },
                        {flex: 1, xtype: 'component'},
                        {
                            text: 'Show'
                        }
                    ]
                }
            ]
        });

        overlay = Ext.Viewport.add({
            xtype: 'panel',
            left: 0,
            top: 0,
            modal: true,
            hidden: true,
            height: 300,
            width: '50%',
            contentEl: 'content',
            styleHtmlContent: true,
            scrollable: true,
            items: [
                {
                    docked: 'top',
                    xtype: 'toolbar',
                    title: 'Overlay Title'
                }
            ]
        });

        Ext.Viewport.on({
            delegate: 'button',
            tap: function (button) {
                overlay.showBy(button);
            }
        });
    }
});
