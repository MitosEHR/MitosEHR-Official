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

var form_id = 'Demographics'; // Stores the current form group selected by the user.
var rowPos; // Stores the current Grid Row Position (int)
var currRec; // A stored current record selected by the user.

	// *************************************************************************************
	// If a object called winUser exists destroy it, to create a new one.
	// *************************************************************************************
	if ( Ext.getCmp('winAddField') ){ Ext.getCmp('winAddField').destroy(); }

	// *************************************************************************************
	// Layout Record Structure
	// *************************************************************************************
	var LayoutStore = Ext.create('Ext.mitos.CRUDStore',{
		fields: [
			{name: 'item_id',			type: 'int'},
			{name: 'form_id',			type: 'string'},
			{name: 'field_id',			type: 'string'},
			{name: 'group_name',		type: 'string'},
			{name: 'listDesc',			type: 'string'},
			{name: 'title',				type: 'string'},
			{name: 'seq',				type: 'int'},
			{name: 'data_type',			type: 'string'},
			{name: 'uor',				type: 'string'},
			{name: 'fld_length',		type: 'string'},
			{name: 'max_length',		type: 'string'},
			{name: 'list_id',			type: 'string'},
			{name: 'titlecols',			type: 'string'},
			{name: 'datacols',			type: 'string'},
			{name: 'default_value',		type: 'string'},
			{name: 'edit_options',		type: 'string'},
			{name: 'description',		type: 'string'},
			{name: 'group_order',		type: 'string'}
		],
			groupField	: 'group_name',
			model 		: 'layoutModel',
			idProperty 	: 'item_id',
			read		: 'interface/administration/layout/data_read.ejs.php',
			create		: 'interface/administration/layout/data_create.ejs.php',
			update		: 'interface/administration/layout/data_update.ejs.php',
			destroy 	: 'interface/administration/layout/data_destroy.ejs.php'
	});
	
	// *************************************************************************************
	// Form List Record Structure & Store
	// *************************************************************************************
	var formlistStore = Ext.create('Ext.mitos.CRUDStore',{
		fields: [
			{name: 'id',		type: 'string'},
			{name: 'form_id',	type: 'string'}
		],
			model 		:'formlistModel',
			idProperty 	:'id',
			read		: 'interface/administration/layout/component_data.ejs.php?task=form_list'
	});
	
	// *************************************************************************************
	// Form List Record Structure & Store
	// *************************************************************************************
	var uorStore = Ext.create('Ext.mitos.CRUDStore',{
		fields: [
			{name: 'id',	type: 'string'},
			{name: 'uor',	type: 'string'}
		],
			model 		:'uorModel',
			idProperty 	:'id',
			read		: 'interface/administration/layout/component_data.ejs.php?task=uor'
	});
	
	// *************************************************************************************
	// Data Types Record Structure & Store
	// *************************************************************************************
	var datatypesStore = Ext.create('Ext.mitos.CRUDStore',{
		fields: [
			{name: 'id',	type: 'string'},
			{name: 'type',	type: 'string'}
		],
			model 		:'typeModel',
			idProperty 	:'id',
			read		: 'interface/administration/layout/component_data.ejs.php?task=data_types'
	});
	
	// *************************************************************************************
	// List Options Record Structure & Store
	// *************************************************************************************
	var listoptionStore = Ext.create('Ext.mitos.CRUDStore',{
		fields: [
			{name: 'id',		type: 'int'},
			{name: 'title',		type: 'string'},
			{name: 'list_id',	type: 'string'},
			{name: 'option_id',	type: 'string'}
		],
			model 		:'listoptionModel',
			idProperty 	:'id',
			read		: 'interface/administration/layout/component_data.ejs.php?task=lists'
	});
	
	// *************************************************************************************
	// List Options Record Structure & Store
	// *************************************************************************************
	var whereStore = Ext.create('Ext.mitos.CRUDStore',{
		fields: [
			{name: 'group_name',type: 'string'}
		],
			model 		:'whereModel',
			idProperty 	:'group_name',
			read		: 'interface/administration/layout/component_data.ejs.php?task=groups&form_id=' + form_id
	});
	
	// *************************************************************************************
	// User form
	// *************************************************************************************
    var whereForm = new Ext.create('Ext.mitos.FormPanel', {
    	id: 'facilityForm',
        fieldDefaults: { msgTarget: 'side', labelWidth: 100 },
        defaults: {
            anchor: '100%'
        },
        items: [{
			xtype: 'combo', 
			displayField: 'group_name',
			valueField: 'group_name', 
			editable: false, 
			store: whereStore, 
			queryMode: 'local',
            name: 'where'
        }]
    });
	
	// *************************************************************************************
	// window - Add Field Window
	// *************************************************************************************
	var winAddField = Ext.create('Ext.mitos.Window', {
		title		: '<?php i18n('Select a group to add the field.'); ?>',
		id			: 'winAddField',
		width		: 450,
		height		: 100,
		items		: [ whereForm ],
		buttons:[{
			text		:'<?php i18n('Add'); ?>',
			name		: 'cmdSave',
			id			: 'cmdSave',
			iconCls		: 'save',
            handler: function(){
				winAddField.hide();		// Finally hide the dialog window
			}
		},'-',{
			text:'<?php i18n('Close'); ?>',
			iconCls: 'delete',
            handler: function(){
            	winAddField.hide();
            }
		}]
	});
	
	// *************************************************************************************
	// Grouping - group_name
	// *************************************************************************************
    var groupingLayout = Ext.create('Ext.grid.feature.Grouping',{
    	enableNoGroups: false,
        groupHeaderTpl: '<?php i18n("Group"); ?>: {name} ({rows.length} <?php i18n("Field"); ?>{[values.rows.length > 1 ? "s" : ""]})'
    });
    
    // *************************************************************************************
    // RowEditor Plugin
    // *************************************************************************************
    var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
        autoCancel: false,
		errorSummary: false,
		listeners:{
			afteredit: function(){
				LayoutStore.sync();
				LayoutStore.load({params:{form_id: form_id }});
				layoutGrid.setTitle('<?php i18n("Field editor"); ?> ('+form_id+')');
			}
		}
    });
	
	// *************************************************************************************
	// Layout fields Grid Panel
	// *************************************************************************************
	var layoutGrid = Ext.create('Ext.grid.Panel', {
		store	: LayoutStore,
        region	: 'center',
   	    border	: true,
  	    frame	: true,
  	    sortable: false,
  	    features: [groupingLayout],
  	    plugins	: [rowEditing],
   	    title	: '<?php i18n("Field editor"); ?> (<?php i18n("Demographics"); ?>)',
        columns	: [
			{
				name		: 'seq',
				text     	: '<?php i18n("Order"); ?>',
				sortable 	: false,
				dataIndex	: 'seq',
				width		: 50,
				align		: 'center',
            	editor: {
            		name: 'seq',
	                xtype: 'numberfield',
    	            allowBlank: false,
        	        minValue: 1,
            	    maxValue: 100
            	}
            },
			{
				text     	: '<?php i18n("Group"); ?>',
				sortable 	: false,
				dataIndex	: 'group_name',
				width		: 70,
				align		: 'left',
            	editor: {
            		name: 'group_name',
	                xtype: 'textfield',
    	            allowBlank: false
            	}
            },
			{
				text     	: '<?php i18n("ID"); ?>',
				sortable 	: false,
				dataIndex	: 'field_id',
				width		: 120,
				align		: 'left',
            	editor: {
            		name: 'field_id',
	                xtype: 'textfield',
    	            allowBlank: false
            	}
            },
			{
				text     	: '<?php i18n("Label"); ?>',
				sortable 	: false,
				dataIndex	: 'title',
				width		: 130,
				align		: 'left',
            	editor: {
            		name: 'title',
	                xtype: 'textfield'
            	}
            },
			{
				text     	: '<?php i18n("UOR"); ?>',
				sortable 	: false,
				dataIndex	: 'uor',
				width		: 50,
				align		: 'center',
				editor: {
					name: 'uor',
					xtype: 'combo', 
					displayField: 'uor',
					valueField: 'uor', 
					editable: false, 
					store: uorStore, 
					queryMode: 'local'
				}
            },
			{
				text     	: '<?php i18n("Data Type"); ?>',
				sortable 	: false,
				dataIndex	: 'data_type',
				width		: 100,
				align		: 'left',
				editor: {
					name: 'data_type',
					xtype: 'combo', 
					displayField: 'type',
					valueField: 'type', 
					editable: false, 
					store: datatypesStore, 
					queryMode: 'local'
				}
            },
			{
				text     	: '<?php i18n("Size"); ?>',
				sortable 	: false,
				dataIndex	: 'max_length',
				width		: 50,
				align		: 'center',
            	editor: {
            		name: 'max_length',
	                xtype: 'numberfield',
    	            minValue: 0,
            	    maxValue: 255
            	}
            },
			{
				text     	: '<?php i18n("List"); ?>',
				sortable 	: false,
				dataIndex	: 'listDesc',
				width		: 100,
				align		: 'center',
				editor: {
					name: 'list_id',
					xtype: 'combo', 
					displayField: 'title',
					valueField: 'title', 
					editable: false, 
					store: listoptionStore, 
					queryMode: 'local'
				}
            },
			{
				text     	: '<?php i18n("Label Cols"); ?>',
				sortable 	: false,
				dataIndex	: 'titlecols',
				width		: 80,
				align		: 'center',
            	editor: {
            		name: 'titlecols',
	                xtype: 'numberfield',
    	            allowBlank: false,
        	        minValue: 0,
            	    maxValue: 100
            	}
            },
			{
				text     	: '<?php i18n("Data Cols"); ?>',
				sortable 	: false,
				dataIndex	: 'datacols',
				width		: 80,
				align		: 'center',
            	editor: {
            		name: 'datacols',
	                xtype: 'numberfield',
    	            allowBlank: false,
        	        minValue: 0,
            	    maxValue: 100
            	}
            },
			{
				text     	: '<?php i18n("Options"); ?>',
				sortable 	: false,
				dataIndex	: 'edit_options',
				width		: 80,
				align		: 'center',
            	editor: {
            		name: 'edit_options',
	                xtype: 'textfield'
            	}
            },
			{
				text     	: '<?php i18n("Description"); ?>',
				sortable 	: false,
				dataIndex	: 'description',
				flex		: 1,
				align		: 'left',
            	editor: {
            		name: 'description',
	                xtype: 'textfield',
    	            allowBlank: false
            	}
            },
			{ text: 'item_id', hidden: true, dataIndex: 'item_id' },
			{ text: 'form_id', hidden: true, dataIndex: 'form_id' }
		],
		listeners: {
			itemclick: {
            	fn: function(DataView, record, item, rowIndex, e){ 
            		currRec = LayoutStore.getAt(rowIndex);
            		rowPos = rowIndex;
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
					winAddField.show();
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
		store		: formlistStore,
		region		: 'east',
		border		: true,
		frame		: true,
		title		: '<?php i18n("Form list"); ?>',
		width		: 100,
		collapsible	: true,
        columns		: [
			{
				hidden		: true,
				sortable 	: true,
				dataIndex	: 'id'
            },
			{
				text     : '<?php i18n("Name"); ?>',
				flex     : 1,
				sortable : true,
				dataIndex: 'form_id'
            }
		],
		listeners: {
			itemclick: {
            	fn: function(DataView, record, item, rowIndex, e){
					form_id = record.get('form_id');
					LayoutStore.load({params:{form_id: form_id }});
					layoutGrid.setTitle('<?php i18n("Field editor"); ?> ('+form_id+')');
            	}
			}
		}
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
    var TopPanel = Ext.create('Ext.mitos.TopRenderPanel', {
        pageTitle: '<?php i18n('Layout Form Editor'); ?>',
        pageBody: [LayoutPanel]
    });
    
}); // End ExtJS
</script>