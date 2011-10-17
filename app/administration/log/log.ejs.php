<?php
//******************************************************************************
// Users.ejs.php
// Description: Users Screen
// v0.0.4
//
// Author: Ernesto J Rodriguez
// Modified: n/a
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
$_SESSION['site']['flops'] = 0; ?>
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
            /** @namespace Ext.QuickTips */
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
				read		:'app/administration/log/data_read.ejs.php'
			});

			// *************************************************************************************
			// Create the GridPanel
			// *************************************************************************************
			page.logGrid = new Ext.create('Ext.mitos.GridPanel', {
				store : page.logStore,
				columns: [
					{ text: 'id', sortable: false, dataIndex: 'id', hidden: true},
			    	{ width: 120, text: '<?php i18n("Date"); ?>',       sortable: true, dataIndex: 'date' },
			    	{ width: 160, text: '<?php i18n("User"); ?>',       sortable: true, dataIndex: 'user' },
                    { width: 100, text: '<?php i18n("Event"); ?>',      sortable: true, dataIndex: 'event' },
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
			// Event Detail Form
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
					{ xtype: 'textfield', hidden: true, name: 'id'},
                    { fieldLabel: '<?php i18n("Date"); ?>',         xtype: 'displayfield', name: 'date'},
                    { fieldLabel: '<?php i18n("Event"); ?>',        xtype: 'displayfield', name: 'event'},
                    { fieldLabel: '<?php i18n("User"); ?>',         xtype: 'displayfield', name: 'user'},
                    { fieldLabel: '<?php i18n("Facility"); ?>',     xtype: 'displayfield', name: 'facility'},
                    { fieldLabel: '<?php i18n("Comments"); ?>',     xtype: 'displayfield', name: 'comments'},
                    { fieldLabel: '<?php i18n("user Notes"); ?>',   xtype: 'displayfield', name: 'user_notes'},
                    { fieldLabel: '<?php i18n("Patient ID"); ?>',   xtype: 'displayfield', name: 'patient_id'},
                    { fieldLabel: '<?php i18n("Success"); ?>',      xtype: 'displayfield', name: 'success'},
                    { fieldLabel: '<?php i18n("Check Sum"); ?>',    xtype: 'displayfield', name: 'checksum'},
                    { fieldLabel: '<?php i18n("CRT USER"); ?>',     xtype: 'displayfield', name: 'crt_user'}
				]
			});
			// *************************************************************************************
			// Event Detail Window
			// *************************************************************************************
            page.winLog = new Ext.window.Window({
                width       : 500,
                closeAction : 'hide',
                items       : [page.frmLog],
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
			new Ext.create('Ext.mitos.RenderPanel', {
		        pageTitle: '<?php i18n('Event History Log'); ?>',
		        pageBody: [page.logGrid]
		    });
			page.callParent(arguments);
		} // end of initComponent
	}); //ens LogPage class
    MitosPanel = Ext.create('Ext.mitos.Page');
}); // End ExtJS
</script>