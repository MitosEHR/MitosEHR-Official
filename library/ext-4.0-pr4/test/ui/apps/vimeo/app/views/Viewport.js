/**
 * @class Vimeo.Viewport
 * @extends Ext.Panel
 * This is a default generated class which would usually be used to initialize your application's
 * main viewport. By default this is simply a welcome screen that tells you that the app was
 * generated correctly.
 */
Ext.define("Vimeo.Viewport", {
    extend: 'Ext.Viewport',

    id        : 'viewport',
    layout    : 'fit',
    fullscreen: true,

    initComponent: function() {
        Ext.apply(this, {
            items: [
                {
                    id: 'mainPanel',
                    layout: 'card'
                }
            ]
        });
        
        Vimeo.Viewport.superclass.initComponent.apply(this, arguments);
    }
});

Ext.LoadMask = Ext.extend(Object, {
    bindStore: Ext.emptyFn
});
