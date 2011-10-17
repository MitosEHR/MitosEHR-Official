<?php 
//******************************************************************************
// visits.ejs.php
// Visits Forms
// v0.0.1
// 
// Author: Ernesto J. Rodriguez
// Modified:
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
delete Ext.mitos.Page;
Ext.onReady(function(){
	Ext.define('Ext.mitos.Page',{
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
            // Panels/Forms...
            //******************************************************************
            page.createPanel = new Ext.panel.Panel({
                title:'<?php i18n("Create New Visit"); ?>',
                html: '<h1>Create new Visit form placeholder!</h1>'
            });
            page.MiscBillingOptionsPanel = new Ext.panel.Panel({
                title:'<?php i18n("Misc. Billing Options HCFA"); ?>',
                html: '<h1>Misc. Billing Options HCFA form placeholder!</h1>'
            });
            page.procedurePanel = new Ext.panel.Panel({
                title:'<?php i18n("Procedure Order"); ?>',
                html: '<h1>Procedure Order form placeholder!</h1>'
            });
            page.reviewSysPanel = new Ext.panel.Panel({
                title:'<?php i18n("Review of Systems"); ?>',
                html: '<h1>Review of Systems form placeholder!</h1>'
            });
            page.reviewSysCkPanel = new Ext.panel.Panel({
                title:'<?php i18n("Review of Systems Checks"); ?>',
                html: '<h1>Review of Systems Checks form placeholder!</h1>'
            });
            page.soapPanel = new Ext.panel.Panel({
                title:'<?php i18n("SOAP"); ?>',
                html: '<h1>SOAP form placeholder!</h1>'
            });
            page.speechDicPanel = new Ext.panel.Panel({
                title:'<?php i18n("Speech Dictation"); ?>',
                html: '<h1>Speech Dictation form placeholder!</h1>'
            });
            page.vitalsPanel = new Ext.panel.Panel({
                title:'<?php i18n("Vitals"); ?>',
                html: '<h1>Vitals form placeholder!</h1>'
            });
            //******************************************************************
            // Visit Form
            //******************************************************************
            page.currentVisitPanel = new Ext.panel.Panel({
                region:'center',
                layout: 'card',
                activeItem: 0,
                defaults: {
                    bodyStyle   : 'padding:15px',
                    border      : false,
                    bodyBorder  : false
                },
                items: [
                    page.MiscBillingOptionsPanel,
                    page.procedurePanel,
                    page.reviewSysPanel,
                    page.reviewSysCkPanel,
                    page.soapPanel,
                    page.speechDicPanel,
                    page.vitalsPanel
                ],
                dockedItems:[{
                    xtype: 'toolbar',
                    dock: 'top',
                    items:[
                        new Ext.create('Ext.Button', {
                            text      	: '<?php i18n("Misc. Billing Options HCFA"); ?>',
                            enableToggle: true,
                            toggleGroup : '1',
                            iconCls   	: '',
                            listeners	: {
                                afterrender: function(){
                                    this.toggle(true);
                                }
                            },
                            handler: function(btn) {
                                btn.up("panel").getLayout().setActiveItem(0);
                            }
                        }),'-',
                        new Ext.create('Ext.Button', {
                            text      	: '<?php i18n("Procedure Order"); ?>',
                            enableToggle: true,
                            toggleGroup : '1',
                            iconCls   	: '',
                            handler: function(btn) {
                                btn.up("panel").getLayout().setActiveItem(1);
                            }
                        }),'-',
                        new Ext.create('Ext.Button', {
                            text      	: '<?php i18n("Review of Sys"); ?>',
                            enableToggle: true,
                            toggleGroup : '1',
                            iconCls   	: '',
                            handler: function(btn) {
                                btn.up("panel").getLayout().setActiveItem(2);
                            }
                        }),'-',
                        new Ext.create('Ext.Button', {
                            text      	: '<?php i18n("Review of Sys Cks"); ?>',
                            enableToggle: true,
                            toggleGroup : '1',
                            iconCls   	: '',
                            handler: function(btn) {
                                btn.up("panel").getLayout().setActiveItem(3);
                            }
                        }),'-',
                        new Ext.create('Ext.Button', {
                            text      	: '<?php i18n("SOAP"); ?>',
                            enableToggle: true,
                            toggleGroup : '1',
                            iconCls   	: '',
                            handler: function(btn) {
                                btn.up("panel").getLayout().setActiveItem(4);
                            }
                        }),'-',
                        new Ext.create('Ext.Button', {
                            text      	: '<?php i18n("Speech Dictation"); ?>',
                            enableToggle: true,
                            toggleGroup : '1',
                            iconCls   	: '',
                            handler: function(btn) {
                                btn.up("panel").getLayout().setActiveItem(5);
                            }
                        }),'-',
                        new Ext.create('Ext.Button', {
                            text      	: '<?php i18n("Vitals"); ?>',
                            enableToggle: true,
                            toggleGroup : '1',
                            iconCls   	: '',
                            handler: function(btn) {
                                btn.up("panel").getLayout().setActiveItem(6);
                            }
                        }),'->',
                        new Ext.create('Ext.Button', {
                            text      	: '<?php i18n("Create New Visit"); ?>',
                            enableToggle: true,
                            toggleGroup : '1',
                            iconCls   	: 'icoAddRecord',
                            handler   	: function(btn){
                                page.currentVisitPanel.add(page.createPanel);
                                btn.up("panel").getLayout().setActiveItem(7);
                                page.historyGrid.hide();
                                page.showHist.show();
                                page.hideHist.hide();
                                this.disable();

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
    MitosPanel = Ext.create('Ext.mitos.Page');
}); // End ExtJS
</script>