<?php 
//******************************************************************************
// new.ejs.php
// New payments Forms
// v0.0.1
// 
// Author: Ernest Rodriguez
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
Ext.onReady(function(){
	Ext.define('Ext.mitos.paymentsPage',{
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
            page.paymentStore = new Ext.create('Ext.mitos.CRUDStore',{
                fields: [
                    {name: 'id',      		type: 'int'},
                    {name: 'date',          type: 'date', dateFormat: 'c'},
                    {name: 'body',          type: 'string'},
                    {name: 'user',          type: 'string'},
                    {name: 'facility_id',   type: 'string'},
                    {name: 'activity',   	type: 'string'}
                ],
                model		: 'modelBilling',
                idProperty	: 'id',
                read      	: 'app/miscellaneous/office_notes/data_read.ejs.php',
                create    	: 'app/miscellaneous/office_notes/data_create.ejs.php',
                update    	: 'app/miscellaneous/office_notes/data_update.ejs.php',
              //destroy		: <-- delete not allow -->
                autoLoad	: false
            });
            //******************************************************************
            // Payments Tab Panel
            //******************************************************************
            page.paymentTabPanel = new Ext.create('Ext.tab.Panel', {
                region:'center',
                frame:true,
                items: [{
                    title: '<?php i18n('New Payment'); ?>',
                    dockedItems: [{
                        xtype: 'toolbar',
                        dock: 'top',
                        items: [
                            new Ext.create('Ext.Button', {
                                text      	: '<?php i18n("Save"); ?>',
                                iconCls   	: 'save',
                                handler   : function(){

                                }
                            }),'-',
                            new Ext.create('Ext.Button', {
                                text		: '<?php i18n("Cancel"); ?>',
                                iconCls   	: 'save',
                                handler		: function(){

                                }
                            }),'-',
                            new Ext.create('Ext.Button', {
                                text		: '<?php i18n("Allocate"); ?>',
                                iconCls   	: 'save',
                                handler		: function(){

                                }
                            })
                        ]
                    }]
                }, {
                    title: '<?php i18n('Search Payments'); ?>',
                    dockedItems: [{
                        xtype: 'toolbar',
                        dock: 'top',
                        items: [
                            new Ext.create('Ext.Button', {
                                text      	: '<?php i18n("Search"); ?>',
                                iconCls   	: 'save',
                                handler   : function(){
                                    page.paymentGrid.show();
                                }
                            }),'-',
                            new Ext.create('Ext.Button', {
                                text		: '<?php i18n("Reset"); ?>',
                                iconCls   	: 'save',
                                handler		: function(){
                                    page.paymentGrid.hide();
                                }
                            })
                        ]
                    }]
                }, {
                    title: '<?php i18n('ERA posting'); ?>',
                    dockedItems: [{
                        xtype: 'toolbar',
                        dock: 'top',
                        items: [
                            new Ext.create('Ext.Button', {
                                text		: '<?php i18n("Proccess ERA File"); ?>',
                                iconCls   	: 'save',
                                handler		: function(){

                                }
                            })
                        ]
                    }]
                }]
            });
            //******************************************************************
            // Payment history Grid
            //******************************************************************
            page.paymentGrid = new Ext.create('Ext.mitos.GridPanel',{
                title           : 'Payments Search Results',
                margin          : '3 0 0 0',
                height          : 300,
                region	        : 'south',
                hidden          : true,
                store           : page.paymentStore,
                columns : [
                    { header: 'id', sortable: false, dataIndex: 'id', hidden: true},
                    { width: 150,   sortable: true, dataIndex: 'date', renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s') },
                    { width: 150,   sortable: true, dataIndex: 'user' },
                    { flex: 1,      sortable: true, dataIndex: 'body' },
                    { flex: 1,      sortable: true, dataIndex: 'body' },
                    { flex: 1,      sortable: true, dataIndex: 'body' },
                    { flex: 1,      sortable: true, dataIndex: 'body' }
                ],
                listeners	: {
                    itemclick: function(){

                    }
                }
            });
            Ext.create('Ext.mitos.RenderPanel', {
                pageTitle: '<?php i18n('Payments'); ?>',
                pageLayout: 'border',
                pageBody: [page.paymentTabPanel, page.paymentGrid]
            });
			page.callParent(arguments);
		} // end of initComponent
	}); //ens oNotesPage class
    Ext.create('Ext.mitos.paymentsPage');
}); // End ExtJS
</script>