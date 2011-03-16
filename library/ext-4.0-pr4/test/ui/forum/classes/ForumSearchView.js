Forum.SearchView = function(search){

    this.preview = new Ext.Panel({
        region:'south',
        height:250,
        title:'View Message',
        split:true
    });

    this.store = new Ext.data.Store({
        remoteSort: true,
        proxy: new Ext.data.ScriptTagProxy({
            url: 'http://extjs.com/forum/topics-browse-remote.php'
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: 'post_id'
        }, [
            {name: 'postId', mapping: 'post_id'},
            {name: 'title', mapping: 'topic_title'},
            {name: 'topicId', mapping: 'topic_id'},
            {name: 'author', mapping: 'author'},
            {name: 'lastPost', mapping: 'post_time', type: 'date', dateFormat: 'timestamp'},
            {name: 'excerpt', mapping: 'post_text'}
        ])
    });
    this.store.setDefaultSort('lastpost', 'desc');


    this.grid = new Ext.grid.GridPanel({
        region:'center',

        store: this.store,

        cm: new Ext.grid.ColumnModel([{
           id: 'topic',
           header: "Post Title",
           dataIndex: 'title',
           width: 420,
           renderer: Forum.Renderers.topic
        },{
           id: 'last',
           header: "Date Posted",
           dataIndex: 'lastpost',
           width: 150,
           renderer: Ext.util.Format.dateRenderer('M j, Y, g:i a')
        }]),

        sm: new Ext.grid.RowSelectionModel({
            singleSelect:true
        }),

        trackMouseOver:false,

        loadMask: {msg:'Searching...'},

        viewConfig: {
            forceFit:true,
            enableRowBody:true,
            showPreview:true,
            getRowClass : function(record, rowIndex, p, ds){
                if(this.showPreview){
                    p.body = '<p>'+record.data.excerpt+'</p>';
                    return 'x-grid3-row-expanded';
                }
                return 'x-grid3-row-collapsed';
            }
        },

        bbar: new Ext.PagingToolbar({
            pageSize: 25,
            store: ds,
            displayInfo: true,
            displayMsg: 'Displaying results {0} - {1} of {2}',
            emptyMsg: "No results to display"
        })
    });

    Forum.SearchView.superclass.constructor.call(this, {
        layout:'border',
        title:'Search: '+Ext.util.Format.htmlEncode('"'+search+'"'),
        items:[ this.grid, this.preview ]
     });

    this.store.baseParams = {
        query: search
    };

    this.store.load({params:{start:0, limit: 25}});
};

Ext.extend(Forum.SearchView, Ext.Panel);