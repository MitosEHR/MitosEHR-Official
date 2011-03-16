
//Ext.define('Forum.TopicStore', {
//    extend: 'Ext.data.Store',
//    
//    initComponent: function(){
//        Ext.regModel('Topics', {
//            fields: [
//                'title', 'forumtitle', 'forumid', 'author',
//                {name: 'replycount', type: 'int'},
//                {name: 'lastpost', mapping: 'lastpost', type: 'date', dateFormat: 'timestamp'},
//                'lastposter', 'excerpt'
//            ],
//            sorters: ['lastpost', 'desc']
//        });
//        
//        Ext.apply(this, {
//            model: 'Forum',
//            proxy: {
//                type: 'scripttag',
//                url: 'http://extjs.com/forum/topics-browse-remote.php',
//                reader: {
//                    type: 'json',
//                    root: 'topics',
//                    totalProperty: 'totalCount',
//                    id: 'threadid'
//                }
//            }
//        });
//        
//        this.callParent();
//    },
//    
//    loadForum : function(forumId){
//        this.baseParams = {
//            forumId: forumId
//        };
//        this.load({
//            params: {
//                start: 0,
//                limit: 25
//            }
//        });
//    }
//});

//Forum.TopicStore = function(){
//    Forum.TopicStore.superclass.constructor.call(this, {
//        remoteSort: true,
//
//        proxy: new Ext.data.ScriptTagProxy({
//            url: 'http://extjs.com/forum/topics-browse-remote.php'
//        }),
//
//        reader: new Ext.data.JsonReader({
//            root: 'topics',
//            totalProperty: 'totalCount',
//            id: 'threadid'
//        }, [
//            'title', 'forumtitle', 'forumid', 'author',
//            {name: 'replycount', type: 'int'},
//            {name: 'lastpost', mapping: 'lastpost', type: 'date', dateFormat: 'timestamp'},
//            'lastposter', 'excerpt'
//        ])
//    });
//
//    this.setDefaultSort('lastpost', 'desc');
//};
//Ext.extend(Forum.TopicStore, Ext.data.Store, {
//    loadForum : function(forumId){
//        this.baseParams = {
//            forumId: forumId
//        };
//        this.load({
//            params: {
//                start:0,
//                limit:25
//            }
//        });
//    }
//});