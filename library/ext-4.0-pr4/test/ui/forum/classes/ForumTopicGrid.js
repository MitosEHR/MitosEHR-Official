Ext.define('Forum.TopicGrid', {
    extend: 'Ext.grid.GridPanel',
    alias: 'widget.forumtopicgrid',

    initComponent: function(){
        this.addEvents(
            /**
             * @event select
             * Fires when a grid row is selected
             * @param {Forum.TopicGrid} this
             * @param {Ext.data.Record} rec
             */
            'topicselected'
        );
        
        var headers = [{
            id: 'topic',
            text: "Topic",
            dataIndex: 'title',
            flex: 1,
            //renderer: Forum.Renderers.topic
        },{
            id: 'author',
            text: "Author",
            dataIndex: 'author',
            width: 100,
            hidden: true
        },{
            id: 'replies',
            text: "Replies",
            dataIndex: 'replycount',
            width: 70,
            align: 'right'
        },{
            id: 'last',
            header: "Last Post",
            dataIndex: 'lastpost',
            width: 150,
            //renderer: Forum.Renderers.lastPost
        }];
        
        Ext.apply(this, {
            store: this.store,
            headers: headers,
            selModel: {
                mode: 'SINGLE',
                listeners: {
                    scope: this,
                    selectionchange: function(model, selections){
                        var selected = selections[0];
                        if (selected) {
                            this.fireEvent('topicselected', this, selected);
                        }
                    }
                }
            },
            trackMouseOver:false,
            loadMask: {msg:'Loading Topics...'},
            viewConfig: {
                forceFit:true,
                enableRowBody:true,
                showPreview:true,
                features: [{
                    ftype: 'rowbody'
                }],
                plugins: [{
                    pluginId: 'preview',
                    ptype: 'preview',
                    bodyField: 'excerpt',
                    expanded: this.showPreview
                }]
            },
            tbar:[{
                pressed: true,
                enableToggle:true,
                text:'Preview Pane',
                tooltip: {title:'Preview Pane',text:'Show or hide the Preview Pane'},
                iconCls: 'preview',
                toggleHandler: Ext.bind(this.togglePreview, this)
            }, ' ', {
                pressed: true,
                enableToggle:true,
                text:'Summary',
                tooltip: {title:'Post Summary',text:'View a short summary of each post in the list'},
                iconCls: 'summary',
                toggleHandler: Ext.bind(this.toggleDetails, this)
            }],
//            bbar: new Ext.PagingToolbar({
//                pageSize: 25,
//                store: ds,
//                displayInfo: true,
//                displayMsg: 'Displaying topics {0} - {1} of {2}',
//                emptyMsg: "No topics to display"
//            })
        });
        
        this.callParent();
    },
    
    toggleDetails: function(btn, pressed){
        this.view.showPreview = pressed;
        this.view.refresh();
    },

    togglePreview: function(btn, pressed){
//        var preview = Ext.getCmp('preview');
//        preview[pressed ? 'show' : 'hide']();
//        preview.ownerCt.doLayout();
    }
});