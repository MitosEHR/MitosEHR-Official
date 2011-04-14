Ext.define('ForumBrowser.Main', {
    extend: 'Ext.container.Viewport',
    
    initComponent: function(){
        Ext.apply(this, {
            layout: 'border',
            itemId: 'main',
            items: [{
                xtype: 'forumlist',
                region: 'west',
                width: 300,
                title: 'Forums',
                split: true
                //collapsible: true
            }, {
                region: 'center',
                xtype: 'tabpanel',
                items: {
                    itemId: 'topic',
                    xtype: 'topiccontainer'
                }
            }]
        });
        this.callParent();
    },
    
    loadForum: function(rec){
        this.down('#topic').loadForum(rec);
    }  
});
