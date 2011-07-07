<?php 
//******************************************************************************
// new.ejs.php
// New Patient Entry Form
// v0.0.1
// 
// Author: Ernest Rodriguez
// Modified: GI Technologies, 2011
// 
// MitosEHR (Electronic Health Records) 2011
//******************************************************************************
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');
include_once($_SESSION['site']['root']."/classes/I18n.class.php");
//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;
?>
<script type="text/javascript">
Ext.onReady(function(){
	Ext.define('Ext.mitos.VisitsPage',{
		extend:'Ext.panel.Panel',
		uses:[
			'Ext.mitos.CRUDStore',
			'Ext.mitos.GridPanel',
			'Ext.mitos.RenderPanel'
		],
		initComponent: function(){
            var page = this;
            //******************************************************************
            // Stores...
            //******************************************************************
            page.historyStore = new Ext.create('Ext.mitos.CRUDStore',{
                fields: [
                    {name: 'id',      		type: 'int'},
                    {name: 'date',          type: 'date', dateFormat: 'c'},
                    {name: 'body',          type: 'string'},
                    {name: 'user',          type: 'string'},
                    {name: 'facility_id',   type: 'string'},
                    {name: 'activity',   	type: 'string'}
                ],
                model		: 'modelOnotes',
                idProperty	: 'id',
                read      	: 'app/miscellaneous/office_notes/data_read.ejs.php',
                create    	: 'app/miscellaneous/office_notes/data_create.ejs.php',
                update    	: 'app/miscellaneous/office_notes/data_update.ejs.php',
              //destroy		: <-- delete not allow -->
                autoLoad	: false
            });



            //******************************************************************
            // Visit Form
            //******************************************************************
            page.currentVisitPanel = Ext.panel.Panel({
                region:'center',
                layout: 'card',
                deferredRender:true,
                activeItem: 0,
                defaults: {
                    bodyStyle: 'padding:15px'
                },
                items: [{
                    title: 'Step 1',
                    html: '<h1>Welcome to new visit Wizard!</h1><p>Step 1 of 6</p>'
                },{
                    title: 'Step 2',
                    html: '<h1>Wizard Cont.</h1><p>Step 2 of 6</p>'
                },{
                    title: 'Step 3',
                    html: '<h1>Wizard Cont.</h1><p>Step 3 of 6</p>'
                },{
                    title: 'Step 4',
                    html: '<h1>Wizard Cont.</h1><p>Step 4 of 6</p>'
                },{
                    title: 'Step 5',
                    html: '<h1>Wizard Cont.</h1><p>Step 5 of 6</p>'
                },{
                    title: 'Step 6',
                    html: '<h1>Congratulations!</h1><p>Step 6 of 6 - Complete</p>'
                }],
                dockedItems:[{
                    xtype: 'toolbar',
                    dock: 'top',
                    items:[
                        new Ext.create('Ext.Button', {
                            text      	: '<?php i18n("Step 1"); ?>',
                            iconCls   	: '',
                            handler: function(btn) {
                                btn.up("panel").getLayout().setActiveItem(0);
                            }
                        }),'-',
                        new Ext.create('Ext.Button', {
                            text      	: '<?php i18n("Step 2"); ?>',
                            iconCls   	: '',
                            handler: function(btn) {
                                btn.up("panel").getLayout().setActiveItem(1);
                            }
                        }),'-',
                        new Ext.create('Ext.Button', {
                            text      	: '<?php i18n("Step 3"); ?>',
                            iconCls   	: '',
                            handler: function(btn) {
                                btn.up("panel").getLayout().setActiveItem(2);
                            }
                        }),'-',
                        new Ext.create('Ext.Button', {
                            text      	: '<?php i18n("Step 4"); ?>',
                            iconCls   	: '',
                            handler: function(btn) {
                                btn.up("panel").getLayout().setActiveItem(3);
                            }
                        }),'-',
                        new Ext.create('Ext.Button', {
                            text      	: '<?php i18n("Step 5"); ?>',
                            iconCls   	: '',
                            handler: function(btn) {
                                btn.up("panel").getLayout().setActiveItem(4);
                            }
                        }),'-',
                        new Ext.create('Ext.Button', {
                            text      	: '<?php i18n("Step 6"); ?>',
                            iconCls   	: '',
                            handler: function(btn) {
                                btn.up("panel").getLayout().setActiveItem(5);
                            }
                        }),'->',
                        new Ext.create('Ext.Button', {
                            text      	: '<?php i18n("Create New Visit"); ?>',
                            iconCls   	: 'icoAddRecord',
                            handler   	: function(){
                                page.historyGrid.hide();
                                page.showHist.show();
                                page.hideHist.hide();
                            }
                        }),'-',
                        page.showHist = new Ext.create('Ext.Button', {
                            text      	: '<?php i18n("Show Visits History"); ?>',
                            iconCls   	: 'icoListOptions',
                            handler  : function(){
                                page.historyGrid.show();
                                page.hideHist.show();
                                this.hide();
                            }
                        }),
                        page.hideHist = new Ext.create('Ext.Button', {
                            text      	: '<?php i18n("Hide Visits History"); ?>',
                            iconCls   	: 'icoListOptions',
                            hidden      : true,
                            handler  : function(){
                                page.historyGrid.hide();
                                page.showHist.show();
                                this.hide();
                            }
                        })
                    ]
                },{
                    xtype: 'toolbar',
                    dock: 'bottom',
                    items:[
                        new Ext.create('Ext.Button', {
                            text      	: '<?php i18n("Save"); ?>',
                            iconCls   	: 'save',
                            disabled	: true,
                            handler   : function(){

                            }
                        }),'-',
                        new Ext.create('Ext.Button', {
                            text      	: '<?php i18n("Reset Form"); ?>',
                            iconCls   	: 'save',
                            disabled	: true,
                            handler   	: function(){

                            }
                        })
                    ]
                }]
            });

            //******************************************************************
            // Visit History Grid
            //******************************************************************
            page.historyGrid = Ext.create('Ext.mitos.GridPanel',{
                title           : 'Visit History',
                hidden          : true,
                margin          : '3 0 0 0',
                region	        : 'south',
                height          : 200,
                store           : page.historyStore,
                columns : [
                    { header: 'id', sortable: false, dataIndex: 'id', hidden: true},
                    { width: 150, header: '<?php i18n('Date'); ?>',     sortable: true, dataIndex: 'date', renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s') },
                    { width: 150, header: '<?php i18n('Issue'); ?>',    sortable: true, dataIndex: 'user' },
                    { flex: 1,    header: '<?php i18n('Reason'); ?>',   sortable: true, dataIndex: 'body' },
                    { flex: 1,    header: '<?php i18n('Provider'); ?>', sortable: true, dataIndex: 'body' },
                    { flex: 1,    header: '<?php i18n('Billing'); ?>',  sortable: true, dataIndex: 'body' },
                    { flex: 1,    header: '<?php i18n('Insurance'); ?>',sortable: true, dataIndex: 'body' }

                ],
                listeners	: {
                    itemclick: function(){

                    }
                }
            });

            Ext.create('Ext.mitos.RenderPanel', {
                pageTitle: '<?php echo $_SESSION['patient']['name'].' - ';  i18n('(Visits)'); ?>',
                pageLayout: 'border',
                pageBody: [ page.currentVisitPanel, page.historyGrid ]
            });
			page.callParent(arguments);
		} // end of initComponent
	}); //ens oNotesPage class
    Ext.create('Ext.mitos.VisitsPage');
}); // End ExtJS
</script>