Ext.onReady(function() {
    Ext.getBody().removeCls('ext-no-border-radius');
    Ext.getBody().removeCls('ext-no-linear-gradient');
});

Ext.regApplication({
    name: "themer",
    autoInitViewport: false,
    
    // defaultUrl   : 'searches/first',
    defaultTarget: "viewport",
    
    /**
     * This is called automatically when the page loads. Here we set up the main component on the page - the Viewport
     */
    launch: function() {
        this.viewport = new themer.views.Viewport({
            application: this
        });
        
        Ext.dispatch({
            controller: 'compiler',
            action    : 'compile'
        });
    }
});