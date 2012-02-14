//******************************************************************************
// Users.ejs.php
// Description: Users Screen
// v0.0.4
//
// Author: Ernesto J Rodriguez
// Modified: n/a
//
// MitosEHR (Eletronic Health Records) 2011
//******************************************************************************
Ext.define('Ext.mitos.view.miscellaneous.websearch.Websearch',{
    extend      : 'Ext.mitos.classes.RenderPanel',
    id          : 'panelWebsearch',
    pageTitle   : 'National Library of Medicine Search',
    pageLayout  : 'border',
    uses:[
        'Ext.mitos.classes.CRUDStore',
        'Ext.mitos.classes.GridPanel'
    ],
    initComponent: function(){

        var page = this;
        var search_type;
        var rec;
        if (!Ext.ModelManager.isRegistered('webSearch')){
            Ext.define("webSearch", {
                extend: 'Ext.data.Model',
                fields: [
                    {name: 'title', 		type: 'string'},
                    {name: 'source', 		type: 'string'},
                    {name: 'FullSummary',   type: 'string'},
                    {name: 'snippet',       type: 'string'}
                ]
            });
        }
        page.store = Ext.create('Ext.data.Store', {
            pageSize	: 15,
            model		: 'webSearch',
            proxy: {
                type	    : 'ajax',
                url 	    : 'app/miscellaneous/websearch/data_read.ejs.php',
                noCache     : false,
                startParam  : 'retstart',
                limitParam  : 'retmax',
                pageParam   : 'file',
                reader: {
                    type			: 'json',
                    root            : 'row',
                    totalProperty	: 'totals',
                    idProperty      : 'id'
                }
            }
            //autoLoad:true
        });
        page.searchPanel = Ext.create('Ext.panel.Panel', {
            region      : 'north',
            bodyPadding	: '8 11 5 11',
            margin		: '0 0 2 0',
            layout		: 'anchor',
            items: [{
                xtype: 'radiogroup',
                fieldLabel: 'Search By',
                items: [
                    {boxLabel: 'Heath Topics', name: 'type', inputValue: 'health_topics'},
                    {boxLabel: 'ICD-9-CM', name: 'type', inputValue: 'icd9cm'}
                    //{boxLabel: 'N/A', name: 'type', inputValue: 3},
                    //{boxLabel: 'N/A', name: 'type', inputValue: 4},
                    //{boxLabel: 'N/A', name: 'type', inputValue: 5}
                ],
                listeners:{
                    change: function(){
                        var value = this.getValue();
                        search_type = value.type;
                        page.searchField.enable();
                        page.searchField.reset();
                    }
                }
            },  page.searchField = Ext.create('Ext.form.field.Text',{
                    emptyText	    : 'Web search...',
                    enableKeyEvents : true,
                    hideLabel	    : true,
                    anchor		    : '100%',
                    disabled        : true,
                    listeners:{
                        keyup: function(){
                            var query = this.getValue();
                            if(query.length > 2){
                                page.store.load({params:{ type:search_type, q:query }});
                            }
                        },buffer:500,
                        focus: function(){
                          page.viewPanel.collapse();
                        }
                    }
                })
            ]
        });
        page.searchRow = function(value, p, record){
            return Ext.String.format('<div class="topic"><span class="search_title">{0}</span><br><span class="search_source">{1}</span><br><span class="search_snippet" style="white-space: normal;">{2}</span></div>', value, record.get('source')||"Unknown", record.get('snippet')||"Unknown");
        };
        page.onotesGrid = Ext.create('Ext.mitos.classes.GridPanel', {
            margin      : '0 0 2 0',
            region		: 'center',
            store       : page.store,
            viewConfig: {
                deferEmptyText  : false,
                emptyText       : '<p class="search_nothing_found" style="padding: 10px 0 0 20px; font-size: 24px">Nothing Found!</p>',
                stripeRows      : true,
                loadingText     : 'Searching...  Please Wait!'
            },
            columns: [
                { flex: 1, header:'Search Results', sortable: true, dataIndex: 'title', renderer:page.searchRow  },
                { hidden: true, sortable: true, dataIndex: 'source' },
                { hidden: true, sortable: true, dataIndex: 'snippet' }
            ],
            tbar: Ext.create('Ext.PagingToolbar', {
                store       : page.store,
                displayInfo : true,
                emptyMsg    : "Nothing to display",
                plugins     : Ext.create('Ext.ux.SlidingPager', {})
            }),
            listeners:{
                itemclick:function(DataView, record, item, rowIndex){
                    page.viewPanel.expand();
                    rec = page.store.getAt(rowIndex);
                    page.viewPanel.update(rec.data);
                }
            }
        }); // END GRID
        page.viewPanel = Ext.create('Ext.panel.Panel', {
            region      : 'south',
            height      : 300,
            collapsible : true,
            collapsed   : true,
            layout      : 'fit',
            frame       : true,
            bodyBorder  : true,
            tpl: Ext.create('Ext.XTemplate',
                '<div class="search_container">',
                '<div class="search_data">',
                    '<h3 class="search_title">Title: {title}</h3>',
                    '<h4 class="search_source">Source: {source}</h4>',
                '</div>',
                '<div class="search_body">{FullSummary}</div>',
                '</div>')
        });

        page.pageBody = [ page.searchPanel, page.onotesGrid, page.viewPanel ];
        page.callParent(arguments);
    }, // end of initComponent
    /**
    * This function is called from MitosAPP.js when
    * this panel is selected in the navigation panel.
    * place inside this function all the functions you want
    * to call every this panel becomes active
    */
    onActive:function(callback){
        callback(true);
    }
}); //ens UserPage class