/**
 * This file sets application-wide settings and launches the application when everything has
 * been loaded onto the page. By default we just render the application's Viewport inside the
 * launch method (see app/views/Viewport.js).
 * 
 * The global variable Vimeo holds a reference to your application, and namespaces have been
 * set up for Vimeo.views, Vimeo.models, Vimeo.controllers and Vimeo.stores
 */ 
new Ext.Application({
    defaultTarget: "mainPanel",
    name         : "Vimeo",
    usesHistory  : true,
    defaultUrl   : 'videos',
    autoInitViewport: false,
    
    launch: function() {
        this.viewport = new Vimeo.Viewport({
            application: this
        });
    }
});

