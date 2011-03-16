Ext.require([
    'widget.panel',
    'widget.tbtext'
]);

Ext.onReady(function() {
    var el = Ext.getBody().createChild({
        children: [
            {
                tag : 'h1',
                html: 'Complex docked layout'
            }
        ]
    });

    var a = Ext.createWidget('panel', {
        renderTo: el.createChild({cls:'x-container'}),
        width   : 800,
        height  : 500,

        title: 'Complex',
        dockedItems: [
            // top
            {
                xtype : 'panel',
                dock  : 'top',
                // autoHeight: true,
                items : [
                    {
                        xtype: 'component',
                        html : 'Header of a complex layout!',

                        style: {
                            padding: '10px',

                            background: '#ccc',

                            fontSize  : '18px',
                            fontWeight: 'bold',
                            textShadow: '0 1px 0 #fff'
                        }
                    }
                ]
            },
            {
                xtype : 'toolbar',
                dock  : 'top',
                items : [
                    {
                        xtype: 'button',
                        text : 'File'
                        // color: 'toolbar'
                    },
                    {
                        xtype: 'button',
                        text : 'Edit'
                        // color: 'toolbar'
                    },
                    {
                        xtype: 'button',
                        text : 'View'
                        // color: 'toolbar'
                    },
                    '->',
                    {
                        xtype: 'tbtext',
                        text : 'ExtJS Version 4.0'
                    }
                ]
            },

            // left
            {
                xtype: 'panel',
                dock : 'left',
                width: 150,

                layout: {
                    type : 'vbox',
                    align: 'stretch'
                },

                items: [
                    {
                        xtype : 'panel',
                        html  : 'This panel has "border:false".',
                        border: false
                    },
                    {
                        xtype : 'panel',
                        title : 'Panel',
                        html  : 'Container has "layout:vbox", "align:stretch", "dock:left". This panel has "flex:1".',
                        flex  : 1,
                        margin: '5'
                    }
                ]
            },

            // right
            {
                xtype: 'panel',
                dock : 'right',
                title: 'dock:right Panel'
            },
            {
                xtype: 'panel',
                dock : 'right',
                title: 'dock:right Panel'
            },

            // bottom
            {
                xtype: 'toolbar',
                dock : 'bottom',
                items: [
                    {
                        xtype: 'tbtext',
                        text : 'Status bar'
                    }
                ]
            }
        ],

        items: [
            {
                xtype: 'component',
                html : 'This panel should have:<br /><br />2x top dock items (panel, toolbar)<br />1x left dock item (panel)<br />2x right dock items (panel, panel)<br />1x bottom dock item (toolbar)'
            }
        ]
    });

    var el = Ext.getBody().createChild({
        children: [
            {
                tag : 'h1',
                html: 'Basic (using panels, without titles)'
            }
        ]
    });

    var a = Ext.createWidget('panel', {
        renderTo: el.createChild({cls:'x-container'}),
        width   : 300,
        height  : 200,

        title: 'dock:top',
        dockedItems: [
            {
                xtype : 'panel',
                dock  : 'top',
                html  : 'top',
                height: 50
            }
        ]
    });

    a.cloneConfig({
        title: 'dock:bottom',
        dockedItems: [
            {
                xtype : 'panel',
                dock  : 'bottom',
                html  : 'bottom',
                height: 50
            }
        ]
    });

    a.cloneConfig({
        title: 'dock:left',
        dockedItems: [
            {
                xtype: 'panel',
                dock : 'left',
                html : 'left',
                width: 100
            }
        ]
    });

    a.cloneConfig({
        title: 'dock:right',
        dockedItems: [
            {
                xtype: 'panel',
                dock : 'right',
                html : 'right',
                width: 100
            }
        ]
    });

    var el = Ext.getBody().createChild({
        children: [
            {
                tag : 'h1',
                html: 'Basic (with titles)'
            }
        ]
    });

    var a = a.cloneConfig({
        renderTo: el.createChild({cls:'x-container'}),
        title   : 'dock:top',

        dockedItems: [
            {
                xtype : 'panel',
                dock  : 'top',
                html  : 'top',
                height: 50,
                title : 'Title'
            }
        ]
    });

    a.cloneConfig({
        title: 'dock:bottom',
        dockedItems: [
            {
                xtype : 'panel',
                dock  : 'bottom',
                html  : 'bottom',
                height: 50,
                title : 'Title'
            }
        ]
    });

    a.cloneConfig({
        title: 'dock:left',
        dockedItems: [
            {
                xtype: 'panel',
                dock : 'left',
                html : 'left',
                width: 70,
                title : 'Title'
            }
        ]
    });

    a.cloneConfig({
        title: 'dock:right',
        dockedItems: [
            {
                xtype: 'panel',
                dock : 'right',
                html : 'right',
                width: 70,
                title : 'Title'
            }
        ]
    });

    var el = Ext.getBody().createChild({
        children: [
            {
                tag : 'h1',
                html: 'Multiple (with no titles)'
            }
        ]
    });

    var a = a.cloneConfig({
        renderTo: el.createChild({cls:'x-container'}),
        title   : 'dock:top',
        html    : 'Content...',

        dockedItems: [
            {
                xtype : 'panel',
                dock  : 'top',
                html  : 'top',
                height: 50
            },
            {
                xtype : 'panel',
                dock  : 'top',
                html  : 'top',
                height: 50
            }
        ]
    });

    a.cloneConfig({
        title: 'dock:bottom',
        dockedItems: [
            {
                xtype : 'panel',
                dock  : 'bottom',
                html  : 'bottom',
                height: 50
            },
            {
                xtype : 'panel',
                dock  : 'bottom',
                html  : 'bottom',
                height: 50
            }
        ]
    });

    a.cloneConfig({
        title: 'dock:left',
        dockedItems: [
            {
                xtype: 'panel',
                dock : 'left',
                html : 'left',
                width: 70
            },
            {
                xtype: 'panel',
                dock : 'left',
                html : 'left',
                width: 70
            }
        ]
    });

    a.cloneConfig({
        title: 'dock:right',
        dockedItems: [
            {
                xtype: 'panel',
                dock : 'right',
                html : 'right',
                width: 70
            },
            {
                xtype: 'panel',
                dock : 'right',
                html : 'right',
                width: 70
            }
        ]
    });

    var el = Ext.getBody().createChild({
        children: [
            {
                tag : 'h1',
                html: 'Multiple (with titles)'
            }
        ]
    });

    var a = a.cloneConfig({
        renderTo: el.createChild({cls:'x-container'}),
        title   : 'dock:top',
        html    : 'Content...',

        dockedItems: [
            {
                xtype : 'panel',
                dock  : 'top',
                html  : 'top',
                height: 50,
                title : 'Title'
            },
            {
                xtype : 'panel',
                dock  : 'top',
                html  : 'top',
                height: 50,
                title : 'Title'
            }
        ]
    });

    a.cloneConfig({
        title: 'dock:bottom',
        dockedItems: [
            {
                xtype : 'panel',
                dock  : 'bottom',
                html  : 'bottom',
                height: 50,
                title : 'Title'
            },
            {
                xtype : 'panel',
                dock  : 'bottom',
                html  : 'bottom',
                height: 50,
                title : 'Title'
            }
        ]
    });

    a.cloneConfig({
        title: 'dock:left',
        dockedItems: [
            {
                xtype: 'panel',
                dock : 'left',
                html : 'left',
                width: 70,
                title : 'Title'
            },
            {
                xtype: 'panel',
                dock : 'left',
                html : 'left',
                width: 70,
                title : 'Title'
            }
        ]
    });

    a.cloneConfig({
        title: 'dock:right',
        dockedItems: [
            {
                xtype: 'panel',
                dock : 'right',
                html : 'right',
                width: 70,
                title : 'Title'
            },
            {
                xtype: 'panel',
                dock : 'right',
                html : 'right',
                width: 70,
                title : 'Title'
            }
        ]
    });

    var el = Ext.getBody().createChild({
        children: [
            {
                tag : 'h1',
                html: 'Multiple (mixed)'
            }
        ]
    });

    var a = a.cloneConfig({
        renderTo: el.createChild({cls:'x-container'}),
        title   : 'dock:top',
        html    : 'Content...',

        dockedItems: [
            {
                xtype : 'panel',
                dock  : 'top',
                html  : 'top',
                height: 50
            },
            {
                xtype : 'panel',
                dock  : 'top',
                html  : 'top',
                height: 50,
                title : 'Title'
            }
        ]
    });

    a.cloneConfig({
        dockedItems: [
            {
                xtype : 'panel',
                dock  : 'top',
                html  : 'top',
                height: 50,
                title : 'Title'
            },
            {
                xtype : 'panel',
                dock  : 'top',
                html  : 'top',
                height: 50
            }
        ]
    });

    a.cloneConfig({
        title: 'dock:bottom',
        dockedItems: [
            {
                xtype : 'panel',
                dock  : 'bottom',
                html  : 'bottom',
                height: 50
            },
            {
                xtype : 'panel',
                dock  : 'bottom',
                html  : 'bottom',
                height: 50,
                title : 'Title'
            }
        ]
    });

    a.cloneConfig({
        title: 'dock:bottom',
        dockedItems: [
            {
                xtype : 'panel',
                dock  : 'bottom',
                html  : 'bottom',
                height: 50,
                title : 'Title'
            },
            {
                xtype : 'panel',
                dock  : 'bottom',
                html  : 'bottom',
                height: 50
            }
        ]
    });

    a.cloneConfig({
        title: 'dock:left',
        dockedItems: [
            {
                xtype: 'panel',
                dock : 'left',
                html : 'left',
                width: 70
            },
            {
                xtype: 'panel',
                dock : 'left',
                html : 'left',
                width: 70,
                title : 'Title'
            }
        ]
    });

    a.cloneConfig({
        title: 'dock:left',
        dockedItems: [
            {
                xtype: 'panel',
                dock : 'left',
                html : 'left',
                width: 70,
                title : 'Title'
            },
            {
                xtype: 'panel',
                dock : 'left',
                html : 'left',
                width: 70
            }
        ]
    });

    a.cloneConfig({
        title: 'dock:right',
        dockedItems: [
            {
                xtype: 'panel',
                dock : 'right',
                html : 'right',
                width: 70
            },
            {
                xtype: 'panel',
                dock : 'right',
                html : 'right',
                width: 70,
                title : 'Title'
            }
        ]
    });

    a.cloneConfig({
        title: 'dock:right',
        dockedItems: [
            {
                xtype: 'panel',
                dock : 'right',
                html : 'right',
                width: 70,
                title : 'Title'
            },
            {
                xtype: 'panel',
                dock : 'right',
                html : 'right',
                width: 70
            }
        ]
    });

    var el = Ext.getBody().createChild({
        children: [
            {
                tag : 'h1',
                html: 'Basic (using toolbars)'
            }
        ]
    });

    var toolbarItems = [
        {
            xtype: 'button',
            text : 'Button',
            color: 'toolbar'
        },
        {
            xtype: 'tbtext',
            text : 'Testing'
        }
    ];

    var a = a.cloneConfig({
        renderTo: el.createChild({cls:'x-container'}),
        title   : 'dock:top',

        dockedItems: [
            {
                xtype : 'toolbar',
                dock  : 'top',

                items: toolbarItems
            }
        ]
    });

    a.cloneConfig({
        title: 'dock:bottom',
        dockedItems: [
            {
                xtype : 'toolbar',
                dock  : 'bottom',

                items: toolbarItems
            }
        ]
    });

    a.cloneConfig({
        title: 'dock:left',
        dockedItems: [
            {
                xtype   : 'toolbar',
                dock    : 'left',
                vertical: true,

                items: toolbarItems
            }
        ]
    });

    a.cloneConfig({
        title: 'dock:right',
        dockedItems: [
            {
                xtype   : 'toolbar',
                dock    : 'right',
                vertical: true,

                items: toolbarItems
            }
        ]
    });
});
