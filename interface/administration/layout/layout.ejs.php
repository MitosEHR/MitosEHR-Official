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
	var layoutGrid = Ext.create('Ext.grid.Panel', {
		store	: LayoutStore,
        region	: 'center',
   	    border	: true,
  	    frame	: true,
   	    title	: 'Center',
        columns	: [
			{
				text     : '<?php i18n("Order"); ?>',
				flex     : 1,
				sortable : true,
				dataIndex: 'order'
            },
            {
				text     : '<?php i18n("ID"); ?>',
				width    : 100,
				sortable : true,
				dataIndex: 'id'
            },
            {
				text     : '<?php i18n("Label"); ?>',
				width    : 100,
				sortable : true,
				dataIndex: 'label'
            },
            {
				text     : '<?php i18n("UOR"); ?>',
				width    : 100,
				sortable : true,
				dataIndex: 'uor'
            },
            {
				text     : '<?php i18n("Data Type"); ?>',
				width    : 100,
				sortable : true,
				dataIndex: 'data_type'
            },
            {
				text     : '<?php i18n("Size"); ?>',
				width    : 100,
				sortable : true,
				dataIndex: 'size'
            },
            {
				text     : '<?php i18n("List"); ?>',
				width    : 100,
				sortable : true,
				dataIndex: 'list'
            },
            {
				text     : '<?php i18n("Label Cols"); ?>',
				width    : 100,
				sortable : true,
				dataIndex: 'label_cols'
            },
            {
				text     : '<?php i18n("Data Cols"); ?>',
				width    : 100,
				sortable : true,
				dataIndex: 'data_cols'
            },
            {
				text     : '<?php i18n("Options"); ?>',
				width    : 100,
				sortable : true,
				dataIndex: 'options'
            },
            {
				text     : '<?php i18n("Description"); ?>',
				width    : 100,
				sortable : true,
				dataIndex: 'desc'
            }
		],
		dockedItems: [{
			xtype: 'toolbar',
			dock: 'top',
			items: [{
				text: '<?php i18n("Add field"); ?>',
				iconCls: 'icoAddRecord',
				handler: function(){
				}
			},'-',{
				text: '<?php i18n("Edit field"); ?>',
				iconCls: 'edit',
				id: 'cmdEdit',
				disabled: true,
				handler: function(){
				}
			},'-',{
				text: '<?php i18n("Delete field"); ?>',
				iconCls: 'delete',
				disabled: true,
				id: 'cmdDelete',
				handler: function(){
				}
			}]
		}]
    }); // END LayoutGrid Grid
    
    // *************************************************************************************
    // Panel to choose Layouts
    // *************************************************************************************
    var chooseGrid = Ext.create('Ext.grid.Panel', {
		store		: LayoutStore,
		region		: 'east',
		border		: true,
		frame		: true,
		title		: 'East',
		width		: 200,
		collapsible	: true,
        columns		: [
			{
				text     : '<?php i18n("Name"); ?>',
				flex     : 1,
				sortable : true,
				dataIndex: 'order'
            }
		]
    }); // END LayoutChoose
    
	// *************************************************************************************
	// Layout Panel Screen
	// *************************************************************************************
	var LayoutPanel = Ext.create('Ext.Panel', {
		layout	: { type: 'border' },
        defaults: { split: true },
		border: true,
		frame: true,
        items	: [layoutGrid, chooseGrid]
	}); // END LayoutPanel

	//***********************************************************************************
	// Top Render Panel 
	// This Panel needs only 3 arguments...
	// PageTigle 	- Title of the current page
	// PageLayout 	- default 'fit', define this argument if using other than the default value
	// PageBody 	- List of items to display [foem1, grid1, grid2]
	//***********************************************************************************
    Ext.create('Ext.mitos.TopRenderPanel', {
        pageTitle: '<?php i18n('Layout Form Editor'); ?>',
        pageBody: [LayoutPanel]
    });
    
}); // End ExtJS
</script>