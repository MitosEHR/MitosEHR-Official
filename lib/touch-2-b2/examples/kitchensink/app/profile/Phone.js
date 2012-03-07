Ext.define('Kitchensink.profile.Phone', {
    extend: 'Ext.app.Profile',
    
    config: {
        controllers: ['Main']
    },
    
    isActive: function() {
        return Ext.os.is.Phone; // || Ext.os.is.Desktop;
    },
    
    launch: function() {
        Ext.create('Kitchensink.view.phone.Main');
    }
});