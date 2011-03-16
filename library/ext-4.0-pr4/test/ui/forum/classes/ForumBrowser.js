
Ext.define('Forum.App', {
    extend: 'Ext.container.Viewport',
    //requires: ['Forum.TopicGrid'],
    
    initComponent: function(){
        Ext.regModel('Forum', {
            idProperty: 'id',
            fields: [
                {name: 'id', type: 'string'},
                {name: 'text', type: 'string'}
            ]
        });
        var forumStore = new Ext.data.TreeStore({
            model: 'Forum',
            proxy: {
                type: 'ajax',
                //url: 'http://extjs.com/forum/forums-remote.php',
                url: 'forums.json',
                reader: {
                    type: 'tree',
                    root: 'forums'
                }
            }
        });
        
        Ext.regModel('Topics', {
            idProperty: 'threadid',
            //sorters: ['lastpost'],
            fields: [
                'title', 'forumtitle', 'forumid', 'author',
                {name: 'replycount', type: 'int'},
                {name: 'lastpost', mapping: 'lastpost', type: 'date', dateFormat: 'timestamp'},
                'lastposter', 'excerpt'
            ]
        });
        var topicStore = new Ext.data.Store({
            model: 'Topics',
            autoLoad: true,
            proxy: {
                type: 'scripttag',
                url: 'http://extjs.com/forum/topics-browse-remote.php',
                reader: {
                    type: 'json',
                    root: 'topics',
                    totalProperty: 'totalCount',
                    id: 'threadid'
                }
            },
            loadForum : function(forumId){
                this.baseParams = {
                    forumId: forumId
                };
                this.load({
                    params: {
                        start: 0,
                        limit: 25
                    }
                });
            }
        });
        
        Ext.apply(this, {
            layout: 'border',
            items:[{
                xtype: 'box',
                region: 'north',
                el: 'header',
                height: 40
            },{
                xtype: 'treepanel',
                id: 'forum-tree',
                region: 'west',
                title: 'Sencha Forums',
                split: true,
                width: 325,
                minSize: 175,
                maxSize: 400,
                collapsible: true,
                margins: '0 0 5 5',
                store: forumStore,
                rootVisible: false,
                lines: false,
                autoScroll: true
//                root: new Ext.tree.AsyncTreeNode({
//                    text: 'Forums',
//                    expanded: true
//                })
            },{
                xtype: 'tabpanel',
                id: 'main-tabs',
                activeTab: 0,
                region: 'center',
                margins: '0 5 5 0',
                resizeTabs: true,
                tabWidth: 150,
                items: {
                    id: 'main-view',
                    layout: 'border',
                    title: 'Loading...',
                    items:[{
                        id:'topic-grid',
                        xtype: 'forumtopicgrid',
                        region: 'center',
                        store: topicStore,
                        listeners: {
                            'topicselected': function(grid, rec){
                                Ext.getCmp('preview').body.update('<b><u>' + rec.get('title') + 
                                    '</u></b><br /><br />' + rec.get('excerpt'));
                            }
                        }
                    },{
                        id: 'preview',
                        region: 'south',
                        height: 250,
                        title: 'View Topic',
                        split: true,
                        bodyStyle: 'padding: 10px; font-family: Arial; font-size: 12px;'
                    }]
                 }
            }]
        });
        
        this.callParent(arguments);
        
    
//        var ds = new Forum.TopicStore();
//    
//        var cm = new Ext.grid.ColumnModel([{
//               id: 'topic',
//               header: "Topic",
//               dataIndex: 'title',
//               width: 420,
//               renderer: Forum.Renderers.topic
//            },{
//               header: "Author",
//               dataIndex: 'author',
//               width: 100,
//               hidden: true
//            },{
//               header: "Replies",
//               dataIndex: 'replycount',
//               width: 70,
//               align: 'right'
//            },{
//               id: 'last',
//               header: "Last Post",
//               dataIndex: 'lastpost',
//               width: 150,
//               renderer: Forum.Renderers.lastPost
//            }]);
//    
//        cm.defaultSortable = true;
//    
//        var viewport = new Ext.Viewport({
//            layout:'border',
//            items:[
//                new Ext.BoxComponent({ // raw
//                    region:'north',
//                    el: 'header',
//                    height:32
//                }),
//                new Ext.tree.TreePanel({
//                    id:'forum-tree',
//                    region:'west',
//                    title:'Forums',
//                    split:true,
//                    width: 325,
//                    minSize: 175,
//                    maxSize: 400,
//                    collapsible: true,
//                    margins:'0 0 5 5',
//                    loader: new Forum.TreeLoader(),
//                    rootVisible:false,
//                    lines:false,
//                    autoScroll:true,
//                    root: new Ext.tree.AsyncTreeNode({
//                              text: 'Forums',
//                              expanded:true
//                          })
//                }),
//                new Ext.TabPanel({
//                    id:'main-tabs',
//                    activeTab:0,
//                    region:'center',
//                    margins:'0 5 5 0',
//                    resizeTabs:true,
//                    tabWidth:150,
//                    items: {
//                        id:'main-view',
//                        layout:'border',
//                        title:'Loading...',
//                        items:[Forum.TopicGrid, {
//                                id:'preview',
//                                region:'south',
//                                height:250,
//                                title:'View Topic',
//                                split:true,
//                                bodyStyle: 'padding: 10px; font-family: Arial; font-size: 12px;'
//                            }
//                         ]
//                     }
//                  })
//             ]
//        });
//    
//        var tree = Ext.getCmp('forum-tree');
//        tree.on('append', function(tree, p, node){
//           if(node.id == 40){
//               node.select.defer(100, node);
//           }
//        });
//        var sm = tree.getSelectionModel();
//        sm.on('beforeselect', function(sm, node){
//             return node.isLeaf();
//        });
//        sm.on('selectionchange', function(sm, node){
//            ds.loadForum(node.id);
//            Ext.getCmp('main-view').setTitle(node.text);
//        });
//    
//    
//         var searchStore = new Ext.data.Store({
//            proxy: new Ext.data.ScriptTagProxy({
//                url: 'http://extjs.com/forum/topics-browse-remote.php'
//            }),
//            reader: new Ext.data.JsonReader({
//                root: 'topics',
//                totalProperty: 'totalCount',
//                id: 'threadid'
//            }, [
//                'title', 'author',
//                {name: 'lastpost', type: 'date', dateFormat: 'timestamp'}
//            ])
//        });
//    
//        // Custom rendering Template
//        var resultTpl = new Ext.XTemplate(
//            '<tpl for=".">',
//                '<div class="x-combo-list-item search-item">{title} by <b>{author}</b></div>',
//            '</tpl>'
//        );
//    
//        var search = new Ext.form.ComboBox({
//            store: searchStore,
//            renderTo: 'search',
//            cls: 'x-small-editor',
//            displayField:'title',
//            typeAhead: false,
//            loadingText: 'Searching...',
//            width: 200,
//            pageSize:10,
//            listWidth:550,
//            hideTrigger:true,
//            tpl: resultTpl,
//            minChars:3,
//            emptyText:'Quick Search',
//            onSelect: function(record){ // override default onSelect to do redirect
//                window.location =
//                    String.format('http://extjs.com/forum/showthread.php?t={0}&p={1}', record.data.topicId, record.id);
//            }
//        });
//        // apply it to the exsting input element
//        //search.applyTo('search');
//    
//    
//    
//        function toggleDetails(btn, pressed){
//            var view = Ext.getCmp('topic-grid').getView();
//            view.showPreview = pressed;
//            view.refresh();
//        }
//    
//        function togglePreview(btn, pressed){
//            var preview = Ext.getCmp('preview');
//            preview[pressed ? 'show' : 'hide']();
//            preview.ownerCt.doLayout();
//        }
    }
});


