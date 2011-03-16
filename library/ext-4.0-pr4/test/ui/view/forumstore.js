(function() {
    Ext.regModel('Topic', {
        fields: [
            {name: 'title', mapping: 'topic_title'},
            {name: 'topicId', mapping: 'topic_id'},
            {name: 'author', mapping: 'author'},
            {name: 'lastPost', mapping: 'post_time', type: 'date', dateFormat: 'timestamp'},
            {name: 'excerpt', mapping: 'post_text'}
        ],
        idProperty: 'topicId'
    });
    
    var ds = new Ext.data.Store({
        storeId: 'forumStore',
        autoLoad: true,
        model: 'Topic',
        proxy: {
            type: 'scripttag',
            url: 'http://extjs.com/forum/topics-remote.php',
            reader: {
                type: 'json',
                root: 'topics',
                totalProperty: 'totalCount'
            }
        }
    });

})();