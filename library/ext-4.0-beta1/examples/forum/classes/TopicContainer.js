Ext.define('ForumBrowser.TopicContainer', {
    
    extend: 'Ext.container.Container',
    
    alias: 'widget.topiccontainer',
    
    title: 'Loading...',
    
    initComponent: function(){
        Ext.apply(this, {
            layout: 'border',
            items: [{
                itemId: 'grid',
                xtype: 'topicgrid',
                region: 'center'
            }, {
                split: true,
                height: 300,
                region: 'south',
                itemId: 'preview',
                title: 'View Topic',
                bodyPadding: 10,
                tpl: '<b><u>{title}</u></b><br /><br />Post details here.'
            }]
        });
        this.callParent();
    },
    
    loadForum: function(rec) {
        this.tab.setText(rec.get('text'));
        this.child('#grid').loadForum(rec.getId());
    },
    
    onSelect: function(rec) {
        this.child('#preview').update({
            title: rec.get('title')
        });
    },
    
    togglePreview: function(show){
        var preview = this.child('#preview');
        if (show) {
            preview.show();
        } else {
            preview.hide();
        }
    }
});