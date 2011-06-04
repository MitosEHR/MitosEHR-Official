<?php 
//******************************************************************************
// layout.ejs.php
// Description: Layout Screen Panel
// v0.0.1
// 
// Author: Gino Rivera Falú
// Modified: n/a
// 
// MitosEHR (Eletronic Health Records) 2011
//******************************************************************************

session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

include_once("../../../library/I18n/I18n.inc.php");

//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;
?>

<script type="text/javascript">
Ext.onReady(function() {


	// *************************************************************************************
	// Facility Record Structure
	// *************************************************************************************
	var LayoutStore = Ext.create('Ext.mitos.CRUDStore',{
		fields: [
			{name: 'id',					type: 'int'},
			{name: 'name',					type: 'string'},
			{name: 'phone',					type: 'string'},
			{name: 'fax',					type: 'string'},
			{name: 'street',				type: 'string'},
			{name: 'city',					type: 'string'},
			{name: 'state',					type: 'string'}
		],
			model 		:'layoutModel',
			idProperty 	:'id',
			read	: 'interface/administration/layout/data_read.ejs.php',
			create	: 'interface/administration/layout/data_create.ejs.php',
			update	: 'interface/administration/layout/data_update.ejs.php',
			destroy : 'interface/administration/layout/data_destroy.ejs.php'
	});


	// *************************************************************************************
	// Layout fields Grid Panel
	// *************************************************************************************
	var LayoutGrid = Ext.create('Ext.grid.Panel', {
		id			: 'LayoutGrid',
		store		: LayoutStore,
        layout	    : 'fit',
	  	frame		: true,
	  	border		: true,
        columns: [
			{
				text     : '<?php i18n("Name"); ?>',
				flex     : 1,
				sortable : true,
				dataIndex: 'name'
            },
            {
				text     : '<?php i18n("Phone"); ?>',
				width    : 100,
				sortable : true,
				dataIndex: 'phone'
            },
            {
				text     : '<?php i18n("Fax"); ?>',
				width    : 100,
				sortable : true,
				dataIndex: 'fax'
            },
            {
				text     : '<?php i18n("City"); ?>',
				width    : 100,
				sortable : true,
				dataIndex: 'city'
            }
		],
		// Slider bar or Pagin
        bbar: Ext.create('Ext.PagingToolbar', {
            pageSize: 30,
            store: LayoutStore,
            displayInfo: true,
            plugins: Ext.create('Ext.ux.SlidingPager', {})
        }),
		viewConfig: { stripeRows: true },
		listeners: {
			itemclick: {
            	fn: function(DataView, record, item, rowIndex, e){ 
            		Ext.getCmp('facilityForm').getForm().reset(); // Clear the form
            		Ext.getCmp('cmdEdit').enable();
            		Ext.getCmp('cmdDelete').enable();
					var rec = FacilityStore.getAt(rowIndex);
					Ext.getCmp('facilityForm').getForm().loadRecord(rec);
            		currRec = rec;
            		rowPos = rowIndex;
            	}
			},
			itemdblclick: {
            	fn: function(DataView, record, item, rowIndex, e){ 
            		Ext.getCmp('facilityForm').getForm().reset(); // Clear the form
            		Ext.getCmp('cmdEdit').enable();
            		Ext.getCmp('cmdDelete').enable();
					var rec = FacilityStore.getAt(rowIndex);
					Ext.getCmp('facilityForm').getForm().loadRecord(rec);
            		currRec = rec;
            		rowPos = rowIndex;
            		winFacility.setTitle('<?php i18n("Edit field"); ?>');
            		winFacility.show();
            	}
			}
		},
		dockedItems: [{
			xtype: 'toolbar',
			dock: 'top',
			items: [{
				text: '<?php i18n("Add field"); ?>',
				iconCls: 'icoAddRecord',
				handler: function(){
					Ext.getCmp('facilityForm').getForm().reset(); // Clear the form
					winFacility.show();
					winFacility.setTitle('<?php i18n("Add field"); ?>'); 
				}
			},'-',{
				text: '<?php i18n("Edit field"); ?>',
				iconCls: 'edit',
				id: 'cmdEdit',
				disabled: true,
				handler: function(){
					winFacility.setTitle('<?php i18n("Edit field"); ?>');
					winFacility.show(); 
				}
			},'-',{
				text: '<?php i18n("Delete field"); ?>',
				iconCls: 'delete',
				disabled: true,
				id: 'cmdDelete',
				handler: function(){
					Ext.Msg.show({
						title: '<?php i18n('Please confirm...'); ?>', 
						icon: Ext.MessageBox.QUESTION,
						msg:'<?php i18n('Are you sure to delete this field?'); ?>',
						buttons: Ext.Msg.YESNO,
						fn:function(btn,msgGrid){
							if(btn=='yes'){
								FacilityStore.remove( currRec );
								FacilityStore.save();
								FacilityStore.load();
							}
						}
					});
				}
			}]
		}]
    }); // END LayoutGrid Grid

	//***********************************************************************************
	// Top Render Panel 
	// This Panel needs only 3 arguments...
	// PageTigle 	- Title of the current page
	// PageLayout 	- default 'fit', define this argument if using other than the default value
	// PageBody 	- List of items to display [foem1, grid1, grid2]
	//***********************************************************************************
    Ext.create('Ext.mitos.TopRenderPanel', {
        pageTitle: '<?php i18n('Layout Form Editor'); ?>',
        pageBody: [LayoutGrid]
    });
    
}); // End ExtJS