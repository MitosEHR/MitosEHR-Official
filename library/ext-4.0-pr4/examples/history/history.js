Ext.require([
    'Ext.util.History',
    'Ext.tab.TabPanel'
]);

Ext.onReady(function() {
    // The only requirement for this to work is that you must have a hidden field and
    // an iframe available in the page with ids corresponding to Ext.History.fieldId
    // and Ext.History.iframeId.  See history.html for an example.
    Ext.History.init();

    // Needed if you want to handle history for multiple components in the same page.
    // Should be something that won't be in component ids.
    var tokenDelimiter = ':';
    
    function onTabChange(tabPanel, tab) {
        var tabs = [],
            ownerCt = tabPanel.ownerCt, 
            oldToken, newToken;

        tabs.push(tab.id);
        tabs.push(tabPanel.id);
        
        while (ownerCt && ownerCt.is('tabpanel')) {
            tabs.push(ownerCt.id);
            ownerCt = ownerCt.ownerCt;
        }
        newToken = tabs.reverse().join(tokenDelimiter);
        
        oldToken = Ext.History.getToken();
       
        if (oldToken === null || oldToken.search(newToken) === -1) {
            Ext.History.add(newToken);
        }
    }
    
    // Handle this change event in order to restore the UI to the appropriate history state
    function onAfterRender() {
        Ext.History.on('change', function(token) {
            var parts, tabPanel, length, i;
            
            if (token) {
                parts = token.split(tokenDelimiter);
                length = parts.length;
                
                // setActiveTab in all nested tabs
                for (i = 0; i < length - 1; i++) {
                    Ext.getCmp(parts[i]).setActiveTab(Ext.getCmp(parts[i + 1]));
                }
            }
        });
        
        // This is the initial default state.  Necessary if you navigate starting from the
        // page without any existing history token params and go back to the start state.
        this.getActiveTab().setActiveTab(0);
    }
    
    Ext.create('Ext.TabPanel', {
        renderTo: Ext.getBody(),
        id: 'main-tabs',
        height: 300,
        width: 600,
        activeTab: 0,
        items: [{
            xtype: 'tabpanel',
            title: 'Tab 1',
            id: 'tab1',
            activeTab: 0,

            items: [{
                title: 'Sub-tab 1',
                id: 'subtab1'
            },{
                title: 'Sub-tab 2',
                id: 'subtab2'
            },{
                title: 'Sub-tab 3',
                id: 'subtab3'
            }],
            
            listeners: {
                tabchange: onTabChange
            }
        },{
            title: 'Tab 2',
            id: 'tab2'
        },{
            title: 'Tab 3',
            id: 'tab3'
        },{
            title: 'Tab 4',
            id: 'tab4'
        },{
            title: 'Tab 5',
            id: 'tab5'
        }],
        listeners: {
            tabchange: onTabChange,
            afterrender: onAfterRender 
        }
    });
});