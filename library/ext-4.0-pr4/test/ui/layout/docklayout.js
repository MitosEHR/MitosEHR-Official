Ext.onReady(function() {
    var items = [];
    
    var a = Ext.create('Ext.Panel', {
        renderTo: Ext.getBody(),
        width   : 200,
        height  : 200,
        
        x: 10,
        y: 10,
        
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
    
    items.push(a);
    
    items.push(a.cloneConfig({
        x: 220,
        
        title: 'dock:bottom',
        dockedItems: [
            {
                xtype : 'panel',
                dock  : 'bottom',
                html  : 'bottom',
                height: 50
            }
        ]
    }));
    
    items.push(a.cloneConfig({
        x: 430,
        
        title: 'dock:left',
        dockedItems: [
            {
                xtype: 'panel',
                dock : 'left',
                html : 'left',
                width: 100
            }
        ]
    }));
    
    items.push(a.cloneConfig({
        x: 640,
        
        title: 'dock:right',
        dockedItems: [
            {
                xtype: 'panel',
                dock : 'right',
                html : 'right',
                width: 100
            }
        ]
    }));
    
    a = a.cloneConfig({
        x: 850,
        
        renderTo: Ext.getBody(),
        title   : 'dock:top - with title/header',
        
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
    
    items.push(a);
    
    items.push(a.cloneConfig({
        x: 1060,
        
        title: 'dock:bottom - with title/header',
        dockedItems: [
            {
                xtype : 'panel',
                dock  : 'bottom',
                html  : 'bottom',
                height: 50,
                title : 'Title'
            }
        ]
    }));
    
    items.push(a.cloneConfig({
        x: 1270,
        
        title: 'dock:left - with title/header',
        dockedItems: [
            {
                xtype: 'panel',
                dock : 'left',
                html : 'left',
                width: 70,
                title : 'Title'
            }
        ]
    }));
    
    items.push(a.cloneConfig({
        x: 1480,
        
        title: 'dock:right - with title/header',
        dockedItems: [
            {
                xtype: 'panel',
                dock : 'right',
                html : 'right',
                width: 70,
                title : 'Title'
            }
        ]
    }));
    
    a = a.cloneConfig({
        x: 10,
        y: 220,
        
        renderTo: Ext.getBody(),
        title   : 'dock:top - x2',
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
    
    items.push(a);
    
    items.push(a.cloneConfig({
        x: 220,
        
        title: 'dock:bottom - x2',
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
    }));
    
    items.push(a.cloneConfig({
        x: 430,
        
        title: 'dock:left - x2',
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
    }));
    
    items.push(a.cloneConfig({
        x: 640,
        
        title: 'dock:right - x2',
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
    }));
    
    a = a.cloneConfig({
        x: 850,
        
        renderTo: Ext.getBody(),
        title   : 'dock:top - x2, with title/header',
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
    
    items.push(a);
    
    items.push(a.cloneConfig({
        x: 1060,
        
        title: 'dock:bottom - x2, with title/header',
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
    }));
    
    items.push(a.cloneConfig({
        x: 1270,
        
        title: 'dock:left - x2, with title/header',
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
    }));
    
    items.push(a.cloneConfig({
        x: 1480,
        
        title: 'dock:right - x2, with title/header',
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
    }));
    
    a = a.cloneConfig({
        x: 10,
        y: 430,
        
        renderTo: Ext.getBody(),
        title   : 'dock:top - x2, 1 with title',
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
    
    items.push(a);
    
    items.push(a.cloneConfig({
        x: 220,
        
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
    }));
    
    items.push(a.cloneConfig({
        x: 430,
        
        title: 'dock:bottom - x2, 1 with title',
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
    }));
    
    items.push(a.cloneConfig({
        x: 640,
        
        title: 'dock:bottom - x2, 1 with title',
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
    }));
    
    items.push(a.cloneConfig({
        x: 850,
        
        title: 'dock:left - x2, 1 with title',
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
    }));
    
    items.push(a.cloneConfig({
        x: 1060,
        
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
    }));
    
    items.push(a.cloneConfig({
        x: 1270,
        
        title: 'dock:right - x2, 1 with title',
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
    }));
    
    items.push(a.cloneConfig({
        x: 1480,
        
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
    }));
    
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
    
    a = a.cloneConfig({
        x: 10,
        y: 640,
        
        renderTo: Ext.getBody(),
        title   : 'dock:top - toolbar',
        
        dockedItems: [
            {
                xtype : 'toolbar',
                dock  : 'top',
                
                items: toolbarItems
            }
        ]
    });
    
    items.push(a);
    
    items.push(a.cloneConfig({
        x: 220,
        
        title: 'dock:bottom - toolbar',
        dockedItems: [
            {
                xtype : 'toolbar',
                dock  : 'bottom',
                
                items: toolbarItems
            }
        ]
    }));
    
    items.push(a.cloneConfig({
        x: 430,
        
        title: 'dock:left - toolbar',
        dockedItems: [
            {
                xtype   : 'toolbar',
                dock    : 'left',
                vertical: true,
                
                items: toolbarItems
            }
        ]
    }));
    
    items.push(a.cloneConfig({
        x: 640,
        
        title: 'dock:right - toolbar',
        dockedItems: [
            {
                xtype   : 'toolbar',
                dock    : 'right',
                vertical: true,
                
                items: toolbarItems
            }
        ]
    }));
    
    Ext.create('Ext.Viewport', {
        layout: 'absolute',
        autoScroll: true,
        items: items
    });
});
