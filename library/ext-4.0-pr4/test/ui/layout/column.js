Ext.onReady(function() {
    Ext.create('Ext.Panel', {
        title: 'Colum Layout Mixed',
        height: 300,
        width: 500,
        renderTo: Ext.getBody(),
        layout:'column',
        autoScroll: true,
        items: [{
            title: 'Column 1',
            width: 120,
            html: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        },{
            title: 'Column 2',
            html: 'Column 2',
            columnWidth: 0.6
        },{
            title: 'Column 3',
            autoScroll: true,
            height: 200,
            html: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            columnWidth: 0.4
        }]
    });
});
