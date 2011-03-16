Ext.onReady(function() {

    Ext.create('Ext.Panel', {
        renderTo: Ext.getBody(),
        title: 'Docked Panel - Top/Left toolbars',
        width: 600,
        height: 500,
        bodyStyle: 'padding: 5px;',
        dockedItems: [{
            xtype : 'toolbar',
            dock  : 'top',
            items: ['->', {
                xtype: 'button',
                text : 'One'
            }, {
                xtype: 'button',
                text : 'Two'
            }, {
                xtype: 'button',
                text : 'Three'
            }, {
                xtype: 'button',
                text : 'Four'
            }, {
                xtype: 'button',
                text : 'Five'
            }]
        }, {
            xtype : 'toolbar',
            dock  : 'left',
            vertical : true,
            layout: {
                align: 'stretchmax'
            },
            items: [{
                xtype: 'button',
                text : 'Six'
            }, {
                xtype: 'button',
                text : 'Seven'
            }, {
                xtype: 'button',
                text : 'Eight'
            }, {
                xtype: 'button',
                text : 'Nine'
            }, {
                xtype: 'button',
                text : 'Ten'
            }]
        }],
        html: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    });
});
