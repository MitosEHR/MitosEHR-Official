<<<<<<< HEAD
<?php
//******************************************************************************
// new.ejs.php
// New Patient Entry Form
// v0.0.1
//
// Author: Ernest Rodriguez
// Modified: Gino Rivera
//
// MitosEHR (Electronic Health Records) 2011
//******************************************************************************
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');
include_once($_SESSION['site']['root']."/library/I18n/I18n.inc.php");
//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;
?>
<script type="text/javascript">
Ext.onReady(function(){
	Ext.define('Ext.mitos.webSearchPage',{
		extend:'Ext.panel.Panel',
		uses:[
			'Ext.mitos.CRUDStore',
			'Ext.mitos.GridPanel',
			'Ext.mitos.TopRenderPanel'
		],
		initComponent: function(){
            var page = this;

            // *************************************************************************************
            // Search for patient...
            // *************************************************************************************
            if (!Ext.ModelManager.isRegistered('Post')){
                Ext.define("Post", {
                    extend: 'Ext.data.Model',
                    proxy: {
                        type	: 'ajax',
                        url 	: 'library/patient/patient_search.inc.php?task=search',
                        reader: {
                            type			: 'json',
                            root			: 'row',
                            totalProperty	: 'totals'
                        }
                    },
                    fields: [
                        {name: 'id', 			type: 'int'},
                        {name: 'pid', 			type: 'int'},
                        {name: 'pubpid', 		type: 'int'},
                        {name: 'patient_name', 	type: 'string'},
                        {name: 'patient_dob', 	type: 'string'},
                        {name: 'patient_ss', 	type: 'string'}
                    ]
                });
            }
            page.searchStore = Ext.create('Ext.data.Store', {
                pageSize	: 10,
                model		: 'Post'
            });
            page.searchPanel = Ext.create('Ext.panel.Panel', {
                //width		: 400,
                bodyPadding	: '8 11 5 11',
                region		: 'north',
                margin		: '0 0 5 0 ',
                style 		: 'float:left',
                layout		: 'anchor',
                items: [{
                    xtype		: 'combo',
                    id			: 'liveSearch',
                    store		: page.searchStore,
                    displayField: 'title',
                    emptyText	: 'Web Search',
                    typeAhead	: false,
                    hideLabel	: true,
                    hideTrigger	:true,
                    minChars	: 1,
                    anchor		: '100%',
                    listConfig: {
                        loadingText	: 'Searching...',
                        emptyText	: 'No matching posts found.',
                        //---------------------------------------------------------------------
                        // Custom rendering template for each item
                        //---------------------------------------------------------------------
                        getInnerTpl: function() {
                            return '<div class="search-item">' +
                                '<h3><span>{patient_name}</span>  ({pid})</h3>' +
                                'DOB: {patient_dob} SS: {patient_ss}' +
                            '</div>';
                        }
                    },
                    pageSize: 10,
                    //--------------------------------------------------------------------------
                    // override default onSelect to do redirect
                    //--------------------------------------------------------------------------
                    listeners: {
                        select: function(combo, selection) {
                            var post = selection[0];
                            if (post) {
                                Ext.Ajax.request({
                                    url: Ext.String.format('library/patient/patient_search.inc.php?task=set&pid={0}&pname={1}',post.get('pid'),post.get('patient_name') ),
                                    success: function(response, opts){
                                        var newPatientBtn = Ext.String.format('<img src="ui_icons/32PatientFile.png" height="32" width="32" style="float:left"><strong>{0}</strong><br>Record ({1})', post.get('patient_name'), post.get('pid'));
                                        Ext.getCmp('patientButton').setText( newPatientBtn );
                                        Ext.getCmp('patientButton').enable();
                                    }
                                });
                                Ext.data.Request()
                            }
                        },
                        blur: function(){
                         Ext.getCmp('liveSearch').reset();
                        }
                    }
                }]
            });
            page.searchResults = Ext.create('Ext.panel.Panel', {
                title       : '<?php i18n('Serach Results'); ?>',
                region		: 'center',
                frame       : true,
                border      : true,
                layout      : 'fit'
            });



            Ext.create('Ext.mitos.TopRenderPanel', {
                pageTitle: '<?php i18n('Web Search'); ?>',
                pageLayout: 'border',
                pageBody: [page.searchPanel,page.searchResults ]
            });
			page.callParent(arguments);
		} // end of initComponent
	}); //ens oNotesPage class
    Ext.create('Ext.mitos.webSearchPage');
}); // End ExtJS
=======
<?php
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
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');
include_once($_SESSION['site']['root']."/library/I18n/I18n.inc.php");
//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0; ?>
<script type="text/javascript">
Ext.onReady(function(){
	Ext.define('Ext.mitos.WebSearchPage',{
		extend:'Ext.panel.Panel',
		uses:[
			'Ext.mitos.CRUDStore',
			'Ext.mitos.GridPanel',
			'Ext.mitos.TopRenderPanel'
		],
		initComponent: function(){
            /** @namespace Ext.QuickTips */
            Ext.QuickTips.init();
			var page = this;
            var bseUrl;
            var rec = '';
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
                pageSize	: 10,
                model		: 'webSearch',
                proxy: {
                    type	: 'ajax',
                    url 	: 'interface/miscellaneous/websearch/data_read.ejs.php',
                    reader: {
                        type			: 'json',
                        root            : 'row',
                        totalProperty	: 'totals',
                        idProperty      : 'id'
                    }
                },
                autoLoad:true
            });

            page.searchPanel = new Ext.create('Ext.panel.Panel', {
                region      : 'north',
                bodyPadding	: '8 11 5 11',
                margin		: '0 0 2 0',
                layout		: 'anchor',
                items: [{
                    xtype: 'radiogroup',
                    fieldLabel: 'Search By',
                    items: [
                        {boxLabel: 'Heath Topics', name: 'url', inputValue: 'http://wsearch.nlm.nih.gov/ws/query'},
                        {boxLabel: 'N/A', name: 'url', inputValue: 2},
                        {boxLabel: 'N/A', name: 'url', inputValue: 3},
                        {boxLabel: 'N/A', name: 'url', inputValue: 4},
                        {boxLabel: 'N/A', name: 'url', inputValue: 5}
                    ],
                    listeners:{
                        change: function(){
                            var value = this.getValue();
                            baseUrl = value.url;
                        }
                    }
                },{
                    xtype		: 'textfield',
                    id			: 'liveSearch',
                    emptyText	: 'Live patient search...',
                    enableKeyEvents: true,
                    hideLabel	: true,
                    anchor		: '100%',
                    listeners:{
                        keyup: function(){
                            var query = this.getValue();
                            if(query.length > 2){
                                page.store.load({params:{ baseUrl:baseUrl, query:query }});
                            }
                        },
                        focus: function(){
                          page.viewPanel.collapse();
                        },
                        blur: function(){
                         Ext.getCmp('liveSearch').reset();
                        },
                        select: function(combo, selection) {
                            var post = selection[0];
                            if (post) {
                                Ext.Ajax.request({
                                    url: Ext.String.format('library/patient/patient_search.inc.php?task=set&pid={0}&pname={1}',post.get('pid'),post.get('patient_name') ),
                                    success: function(response, opts){
                                        var newPatientBtn = Ext.String.format('<img src="ui_icons/32PatientFile.png" height="32" width="32" style="float:left"><strong>{0}</strong><br>Record ({1})', post.get('patient_name'), post.get('pid'));
                                        Ext.getCmp('patientButton').setText( newPatientBtn );
                                        Ext.getCmp('patientButton').enable();
                                    }
                                });
                                Ext.data.Request()
                            }
                        }
                    }
                }]
            });

            page.searchRow = function(value, p, record){
                return Ext.String.format('<div class="topic"><span class="search_title">{0}</span><br><span class="search_source">{1}</span><br><span class="search_snippet" style="white-space: normal;">{2}</span></div>', value, record.get('source')||"Unknown", record.get('snippet')||"Unknown");
            };

 			page.onotesGrid = new Ext.create('Ext.mitos.GridPanel', {
                margin      : '0 0 2 0',
                region		: 'center',
                store       : page.store,
                columns: [
                    { flex: 1, header:'<?php i18n("Search Results"); ?>', sortable: true, dataIndex: 'title', renderer:page.searchRow  },
                    { hidden: true, sortable: true, dataIndex: 'source' },
                    { hidden: true, sortable: true, dataIndex: 'snippet' }
                ],
                tbar: Ext.create('Ext.PagingToolbar', {
                    store: page.store,
                    displayInfo: true,
                    emptyMsg: "<?php i18n('No Office Notes to display'); ?>",
                    plugins: Ext.create('Ext.ux.SlidingPager', {})
                }),
                listeners:{
                    itemclick:function(DataView, record, item, rowIndex, e){
                        page.viewPanel.expand();
                        rec = page.store.getAt(rowIndex);
                        page.viewPanel.update(rec.data)
                    }
                }
            }); // END GRID

            page.viewPanel = new Ext.create('Ext.panel.Panel', {
                region: 'south',
                height:300,
                collapsible:true,
                collapsed: true,
                layout:'fit',
                tpl: Ext.create('Ext.XTemplate',
                    '<div class="search-data">',
                        '<h3 class="search-title">Title:{title}</h3>',
                        '<h4 class="search-source">Source: {source}</h4>',
                    '</div>',
                    '<div class="search-body">{FullSummary}</div>'
                 )
            });
            Ext.create('Ext.mitos.TopRenderPanel', {
                pageTitle: '<?php i18n('Web Search'); ?>',
                pageLayout: 'border',
                pageBody: [page.searchPanel,page.onotesGrid, page.viewPanel ]
            });
			page.callParent(arguments);
		} // end of initComponent
	}); //ens UserPage class
    Ext.create('Ext.mitos.WebSearchPage');
}); // End ExtJS
>>>>>>> 54657868882d5987ef1b3699df1497adf49dc6ce
</script>