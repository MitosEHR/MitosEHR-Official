Ext.define('themer.views.Viewport', {
    extend: 'Ext.Viewport',

    initComponent: function() {
        Ext.apply(this, {
            items: [
                {
                    xtype : 'panel',
                    layout: 'fit',
                    
                    dockedItems: [
                        //{xtype: 'header'},
                        {xtype: 'options'}
                    ],
                    
                    items: [
                        {xtype: 'iframe'}
                    ]
                }
            ]
        });
        
        themer.views.Viewport.superclass.initComponent.call(this);
    }
});
