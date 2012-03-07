/**
 * This is a simple example which shows some of the built-in icons that are supported in Sencha Touch.
 */

// Define our application
Ext.application({
    // Setup the icons and startup images for the example
    icon: 'icon.png',
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    glossOnIcon: false,

    // Require the components which will be used in this example
    requires: [
        'Ext.tab.Panel',
        'Ext.Toolbar'
    ],

    /**
     * The launch method is called when the browser is ready, and the application can launch.
     *
     * In this method we will create a TabPanel which will demonstrate the different icons you can have on taps. Then we will also
     * create a docked top toolbar with a bunch of buttons which also show icons.
     */
    launch: function() {
        // Create the tab panel component
        Ext.create('Ext.tab.Panel', {
            // Make the tab panel fullscreen
            fullscreen: true,

            // Give the tabBar a custom configuration
            tabBar: {
                // Dock it to the bottom
                docked: 'bottom',

                // Change the layout so each of the tabs are centered vertically and horizontally
                layout: {
                    pack: 'center',
                    align: 'center'
                },

                // Make the tabbar scrollable horizontally, and disabled the indicators
                scrollable: {
                    direction: 'horizontal',
                    indicators: false
                }
            },

            // Set the UI of the tabbar to light
            ui  : 'light',

            // Add some text about the example into the tabpanel as html and style it using default CSS
            html: 'Both toolbars and tabbars have built-in, ready to use icons. Styling custom icons is no hassle.<p><small>If you cant see all of the buttons below, try scrolling left/right.</small></p>',
            styleHtmlContent: true,

            // Add a bunch of items into the tabpanel, with iconCls'
            items: [
                { iconCls: 'bookmarks', title: 'Bookmarks' },
                { iconCls: 'download',  title: 'Download' },
                { iconCls: 'favorites', title: 'Favorites' },
                { iconCls: 'info',      title: 'Info' },
                { iconCls: 'more',      title: 'More' },
                { iconCls: 'search',    title: 'Search' },
                { iconCls: 'settings',  title: 'Settings' },
                { iconCls: 'team',      title: 'Team' },
                { iconCls: 'time',      title: 'Time' },
                { iconCls: 'user',      title: 'User' },

                // Also add a toolbar
                {
                    xtype: 'toolbar',

                    // Dock it to the top
                    docked: 'top',

                    // Center all items horizontally and vertically
                    layout: {
                        pack: 'center',
                        align: 'center'
                    },

                    // Make the toolbar scrollable
                    scrollable: {
                        direction: 'horizontal',
                        indicators: false
                    },

                    // Add some default configurations to all items added to this toolbar
                    defaults: {
                        // iconMask is used when you need an pictos icon in a button
                        iconMask: true,
                        ui: 'plain'
                    },

                    // Add a bunch of buttons into the toolbar
                    items: [
                        { iconCls: 'action' },
                        { iconCls: 'add' },
                        { iconCls: 'arrow_up' },
                        { iconCls: 'arrow_right' },
                        { iconCls: 'arrow_down' },
                        { iconCls: 'arrow_left' },
                        { iconCls: 'compose' },
                        { iconCls: 'delete' },
                        { iconCls: 'refresh' },
                        { iconCls: 'reply' },
                        { iconCls: 'search' },
                        { iconCls: 'star' },
                        { iconCls: 'trash' }
                    ]
                }
            ]
        });
    }
});
