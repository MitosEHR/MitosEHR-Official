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
	Ext.define('Ext.mitos.LogPage',{
		extend:'Ext.panel.Panel',
		uses:[
			'Ext.mitos.CRUDStore',
			'Ext.mitos.GridPanel',
			'Ext.mitos.TopRenderPanel'
		],

		initComponent: function(){
			Ext.QuickTips.init();

			var page = this;
			var rowPos; // Stores the current Grid Row Position (int)
			var currRec; // Store the current record (Object)

			page.logStore = Ext.create('Ext.mitos.CRUDStore',{
				fields: [
					{name: 'id',             type: 'int'},
					{name: 'date',           type: 'string'},
					{name: 'event',          type: 'auto'},
					{name: 'user',           type: 'string'},
					{name: 'facility',       type: 'string'},
					{name: 'comments',       type: 'string'},
					{name: 'user_notes',     type: 'string'},
					{name: 'patient_id',     type: 'string'},
					{name: 'success',        type: 'int'},
					{name: 'checksum',       type: 'string'},
					{name: 'crt_user',       type: 'string'}
				],
				model 		:'logModel',
				idProperty 	:'id',
				read		:'interface/administration/log/data_read.ejs.php'
			});

			// *************************************************************************************
			// Create the GridPanel
			// *************************************************************************************
			page.logGrid = new Ext.create('Ext.mitos.GridPanel', {
				store : page.logStore,
				columns: [
					{ text: 'id', sortable: false, dataIndex: 'id', hidden: true},
			    	{ width: 120, text: '<?php i18n("Date"); ?>',       sortable: true, dataIndex: 'date' },
			    	{ width: 170, text: '<?php i18n("User"); ?>',       sortable: true, dataIndex: 'user' },
                    { width: 140, text: '<?php i18n("Event"); ?>',      sortable: true, dataIndex: 'event' },
			    	{ flex: 1,    text: '<?php i18n("Activity"); ?>',   sortable: true, dataIndex: 'comments' }
			  	],
			  	listeners: {
			   		// -----------------------------------------
			   	  	// Single click to select the record
			   	  	// -----------------------------------------
			   	  	itemclick: {
			   			fn: function(DataView, record, item, rowIndex, e){
							page.frmLog.getForm().reset();
							page.cmdDetail.enable();
			   		  		var rec = page.logStore.getAt(rowIndex);
			   		  		page.frmLog.getForm().loadRecord(rec);
							currRec = rec;
		            		page.rowPos = rowIndex;
			   		  	}
			   	  	},
			   	  	// -----------------------------------------
			   	  	// Double click to select the record, and edit the record
			   	  	// -----------------------------------------
			   	  	itemdblclick: {
			   			fn: function(DataView, record, item, rowIndex, e){
							page.frmLog.getForm().reset();
							page.cmdDetail.enable();
							var rec = page.logStore.getAt(rowIndex); // get the record from the store
							page.frmLog.getForm().loadRecord(rec); // load the record selected into the form
							currRec = rec;
		            		page.rowPos = rowIndex;
							page.winLog.setTitle('Log Event Details');
			   		  		page.winLog.show();
			   		  	}
			  	  	}
			  	},
                tbar: Ext.create('Ext.PagingToolbar', {
                    store: page.logStore,
                    displayInfo: true,
                    emptyMsg: "<?php i18n('No Office Notes to display'); ?>",
                    plugins: Ext.create('Ext.ux.SlidingPager', {}),
                    items: [
                        page.cmdDetail = new Ext.create('Ext.Button', {
                            text      : '<?php i18n("View Log Event Details"); ?>',
                            iconCls   : 'edit',
                            disabled  : true,
                            handler: function(){
                                page.winLog.setTitle('<?php i18n("Log Event Details"); ?>');
                                page.winLog.show();
                            }
                        })
                    ]
                })
			});
			// *************************************************************************************
			// User Add/Eddit Form
			// *************************************************************************************
			page.frmLog = new Ext.form.FormPanel({
				bodyStyle   : 'padding: 10px;',
				autoWidth   : true,
				border      : false,
				hideLabels  : true,
				defaults: { labelWidth: 89, anchor: '100%',
				    layout: { type: 'hbox', defaultMargins: {top: 0, right: 5, bottom: 0, left: 0} }
				},
				items: [
					{ xtype: 'textfield', hidden: true, id: 'id', name: 'id'},
                    { fieldLabel  : '<?php i18n("Date"); ?>', xtype: 'displayfield', name: 'date'},
                    { fieldLabel  : '<?php i18n("Event"); ?>', xtype: 'displayfield', name: 'event'},
                    { fieldLabel  : '<?php i18n("User"); ?>', xtype: 'displayfield', name: 'user'},
                    { fieldLabel  : '<?php i18n("Facility"); ?>', xtype: 'displayfield', name: 'facility'},
                    { fieldLabel  : '<?php i18n("Comments"); ?>', xtype: 'displayfield', name: 'comments'},
                    { fieldLabel  : '<?php i18n("user Notes"); ?>', xtype: 'displayfield', name: 'user_notes'},
                    { fieldLabel  : '<?php i18n("Patient ID"); ?>', xtype: 'displayfield', name: 'patient_id'},
                    { fieldLabel  : '<?php i18n("Success"); ?>', xtype: 'displayfield', name: 'success'},
                    { fieldLabel  : '<?php i18n("Check Sum"); ?>', xtype: 'displayfield', name: 'checksum'},
                    { fieldLabel  : '<?php i18n("CRT USER"); ?>', xtype: 'displayfield', name: 'crt_user'}
				]
			});
			// *************************************************************************************
			// Event Detail Window
			// *************************************************************************************
            page.winLog = new Ext.window.Window({
                width   : 500,
                items   : [page.frmLog],
                buttons: [{
                    text: '<?php i18n('Close'); ?>',
                    handler: function(){
                        this.up('window').hide();
                    }
                }]
            });
			// *************************************************************************************
			// Render Panel
			// *************************************************************************************
			new Ext.create('Ext.mitos.TopRenderPanel', {
		        pageTitle: '<?php i18n('Event History Log'); ?>',
		        pageBody: [page.logGrid]
		    });
			page.callParent(arguments);
		} // end of initComponent
	}); //ens UserPage class
    Ext.create('Ext.mitos.LogPage');
}); // End ExtJS
</script>