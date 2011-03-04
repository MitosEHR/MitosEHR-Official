Ext.require([
    'Ext.data.*',
    'Ext.form.*'
]);

Ext.onReady(function(){

    Ext.regModel("Post", {
        proxy: {
            type: 'scripttag',
            url : 'http://www.sencha.com/forum/topics-remote.php',
            reader: {
                type: 'json',
                root: 'topics',
                totalProperty: 'totalCount'
            }
        },

        fields: [
            {name: 'id', mapping: 'post_id'},
            {name: 'title', mapping: 'topic_title'},
            {name: 'topicId', mapping: 'topic_id'},
            {name: 'author', mapping: 'author'},
            {name: 'lastPost', mapping: 'post_time', type: 'date', dateFormat: 'timestamp'},
            {name: 'excerpt', mapping: 'post_text'}
        ]
    });

    var ds = Ext.create('Ext.data.Store', {
        model: 'Post'
    });


    var panel = Ext.create('Ext.panel.Panel', {
        renderTo: Ext.getBody(),
        title: 'Search the Ext Forums',
        width: 600,
        bodyPadding: 10,

        items: [{
            xtype: 'combo',
            store: ds,
            displayField: 'title',
            typeAhead: false,
            listLoadingText: 'Searching...',
            listEmptyText: 'No matching posts found.',
            hideLabel: true,
            hideTrigger:true,
            // TODO? pageSize:10,

            // Custom rendering template for each item
            getInnerTpl: function() {
                return '<div class="search-item">' +
                    '<h3><span>{[Ext.Date.format(values.lastPost, "M j, Y")]}<br />by {author}</span>{title}</h3>' +
                    '{excerpt}' +
                '</div>';
            },

            // override default onSelect to do redirect
            listeners: {
                select: function(combo, selection) {
                    var post = selection[0];
                    if (post) {
                        window.location =
                            Ext.String.format('http://www.sencha.com/forum/showthread.php?t={0}&p={1}', post.get('topicId'), post.get('id'));
                    }
                }
            }
        }, {
            xtype: 'component',
            style: 'margin-top:10px',
            html: 'Live search requires a minimum of 4 characters.'
        }]
    });
});