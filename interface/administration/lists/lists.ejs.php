<?php 
//******************************************************************************
// list.ejs.php
// List Options Panel
// v0.0.2
// 
// Author: Ernest Rodriguez
// Modified: Gino Rivera
// 
// MitosEHR (Eletronic Health Records) 2011
//******************************************************************************

session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

include_once("../../../library/I18n/I18n.inc.php");

//**********************************************************************************
// Reset session count 10 secs = 1 Flop
//**********************************************************************************
$_SESSION['site']['flops'] = 0;

?>

<script type="text/javascript">
Ext.onReady(function(){
	//******************************************************************************
	// ExtJS Global variables 
	//******************************************************************************
	var rowPos; // Stores the current Grid Row Position (int)
	var currList; // Stores the current List Option (string)
	var currRec; // Store the current record (Object)

	//******************************************************************************
	// Sanitizing Objects!
	// Destroy them, if already exists in the browser memory.
	// This destructions must be called for all the objects that
	// are rendered on the document.body 
	//******************************************************************************
	if ( Ext.getCmp('winList') ){ Ext.getCmp('winList').destroy(); }
	
	// *************************************************************************************
	// Structure of the message record
	// creates a subclass of Ext.data.Record
	// This should be the structure of the database table
	// *************************************************************************************
	var storeListsOption = new Ext.create('Ext.mitos.CRUDStore', {
		fields: [
			{name: 'id',			type: 'int'		},
			{name: 'list_id', 		type: 'string'	},
			{name: 'option_id', 	type: 'string'	},
			{name: 'title', 		type: 'string'	},
			{name: 'seq', 			type: 'int' 	},
			{name: 'is_default', 	type: 'boolean'	},
			{name: 'option_value', 	type: 'string'	},
			{name: 'mapping', 		type: 'string'	},
			{name: 'notes', 		type: 'string'	}
		],
		model		: 'ListRecord',
		idProperty	: 'id',
		read		: 'interface/administration/lists/data_read.ejs.php',
		create		: 'interface/administration/lists/data_create.ejs.php',
		update		: 'interface/administration/lists/data_update.ejs.php',
		destroy 	: 'interface/administration/lists/data_destroy.ejs.php'
	});
	
	// ****************************************************************************
	// Structure, data for List Select list
	// AJAX -> component_data.ejs.php
	// ****************************************************************************
	var storeEditList = new Ext.create('Ext.mitos.CRUDStore', {
		fields: [
			{name: 'option_id', type: 'string'},
		    {name: 'title', type: 'string'}
		],
		model		: 'editListModel',
		idProperty	: 'option_id',
		read		: 'interface/administration/lists/component_data.ejs.php?task=editlist',
		destroy		: 'interface/administration/lists/component_data.ejs.php?task=d_list'
	});
	
	//--------------------------
	// When the data is loaded
	// Select the first record
	//--------------------------
	storeEditList.on('load',function(ds,records,o){
		if (!currList){
			Ext.getCmp('cmbList').setValue(records[0].data.option_id);
			currList = records[0].data.option_id; 					// Get first result for first grid data
			storeListsOption.load({params:{list_id: currList}}); 	// Filter the data store from the currList value
		} else {
			Ext.getCmp('cmbList').setValue( currList );
			storeListsOption.load({params:{list_id: currList }});
		}
	});
	
	// *************************************************************************************
	// List Create Form
	// Create or Closse purpose
	// *************************************************************************************
	var frmLists = Ext.create('Ext.mitos.FormPanel', {
		id			: 'frmLists',
		defaults	: { labelWidth: 100, anchor: '100%' },
		items:[
			{ 
				xtype: 'textfield', 
				width: 200, 
				id: 'option_id', 
				name: 'option_id', 
				allowBlank: false,
				fieldLabel: '<?php i18n('Unique name'); ?>' 
			},
			{ 
				xtype: 'textfield', 
				width: 200, 
				id: 'list_name', 
				name: 'list_name',
				allowBlank: false, 
				fieldLabel: '<?php i18n('List Name'); ?>' 
			}
	    ]
	});
	
	// *************************************************************************************
	// Create list Window Dialog
	// *************************************************************************************
	var winLists = Ext.create('Ext.mitos.Window', {
		id			: 'winList',
		width		: 400,
		title		: '<?php i18n('Create List'); ?>',
		items		: [ frmLists ],
		// -----------------------------------------
		// Window Bottom Bar
		// -----------------------------------------
		buttons:[{
			text		:'<?php i18n('Create'); ?>',
			name		: 'cmdSave',
			id			: 'cmdSave',
			iconCls		: 'save',
			handler		: function() { 
            	var form = Ext.getCmp('frmLists').getForm();
            	if(form.isValid()){
                	form.submit({
                    	url: 'interface/administration/lists/component_data.ejs.php?task=c_list',
                    	timeout: 1800000, // 30 minutes to timeout.
	                    waitMsg: '<?php i18n("Saving new list..."); ?>',
	                    waitTitle: '<?php i18n("Processing..."); ?>',
						failure: function(form, action){
							var obj = Ext.JSON.decode(action.response.responseText);
        	                Ext.Msg.alert('<?php i18n("Failed"); ?>', obj.errors.reason);
        	                Ext.getCmp('frmLists').getForm().reset();
						},
    	                success: function(form, action) {
    	                	storeEditList.sync();
    	                	storeEditList.load();
    	                	currList = Ext.getCmp('option_id').getValue();
    	                	Ext.getCmp('frmLists').getForm().reset();
            	        }
                	});
            	}
				winLists.hide(); 
			} 
		},'-',{
			text		: '<?php i18n('Close'); ?>',
			name		: 'cmdClose',
			id			: 'cmdClose',
			iconCls		: 'delete',
			handler		: function(){ winLists.hide(); }
		}]
	}); // END WINDOW
	
	// *************************************************************************************
	// RowEditor Class
	// *************************************************************************************
	var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
		autoCancel: false,
		errorSummary: false,
		listeners:{
			afteredit: function(){
				storeListsOption.sync();
				storeListsOption.load({params:{list_id: currList }});
			}
		}
	});
	
	// *************************************************************************************
	// Create the GridPanel
	// *************************************************************************************
	// FIXME: On the double click event, is giving a error on ExtJSv4, don't know what 
	// is cousing the problem. I will check this error later.
	var listGrid = new Ext.create('Ext.mitos.GridPanel', {
		id			: 'listGrid',
		store		: storeListsOption,
		plugins		: [rowEditing],
		columns: [{
			name: 'id',
			width: 100, 
			text: 'ID', 
			sortable: true, 
			dataIndex: 'option_id',
            editor: {
                allowBlank: false
            }
		},{ 
			width: 175, 
			text: '<?php i18n('Title'); ?>', 
			sortable: true, 
			dataIndex: 'title',
            editor: {
                allowBlank: false
            }
		},{ 
			text: '<?php i18n('Order'); ?>', 
			sortable: true, 
			dataIndex: 'seq',
			editor: {
                allowBlank: false
            }
		},{ 
			text: '<?php i18n('Default'); ?>', 
			sortable: true, 
			dataIndex: 'is_default',
            editor: {
                xtype: 'checkbox',
                allowBlank: false
            } 
		},{ 
			text: '<?php i18n('Notes'); ?>', 
			sortable: true, 
			dataIndex: 'notes',
			flex: 1,
            editor: {
                allowBlank: true
            } 
		}],
		listeners:{
			itemclick: function(view, record, item, rowIndex, element ){ 
				currRec = storeListsOption.getAt(rowIndex); // Copy the record to the global variable
			}
		},
		// -----------------------------------------
		// Grid Top Menu
		// -----------------------------------------s
		dockedItems: [{
			xtype	: 'toolbar',
			dock	: 'top',
			items: [{
				xtype	:'button',
				id		: 'addList',
				text	: '<?php i18n('Create a list'); ?>',
				iconCls	: 'icoListOptions',
				handler: function(){
					rowEditing.cancelEdit();
					Ext.getCmp('frmLists').getForm().reset(); // Clear the form
					winLists.show();
				}
			},'-',{
				id		: 'delList',
				text	: '<?php i18n('Delete list'); ?>',
				iconCls	: 'delete',
				handler	: function(){
					Ext.Msg.show({
						title: '<?php i18n('Please confirm...'); ?>', 
						icon: Ext.MessageBox.QUESTION,
						msg:'<?php i18n('Are you sure to delete this List?'); ?>',
						buttons: Ext.Msg.YESNO,
						fn:function(btn,msgGrid){
							if(btn=='yes'){
								rowEditing.cancelEdit();
								Ext.getCmp('option_id').setValue( Ext.getCmp('cmbList').getValue() );
								Ext.getCmp('list_name').setValue( "DEL" ); // This has no purpose.
				            	var form = Ext.getCmp('frmLists').getForm();
            					if(form.isValid()){
				                	form.submit({
                				    	url: 'interface/administration/lists/component_data.ejs.php?task=d_list',
				                    	timeout: 1800000, // 30 minutes to timeout.
	            				        waitMsg: '<?php i18n("Deleting list..."); ?>',
					                    waitTitle: '<?php i18n("Processing..."); ?>',
										failure: function(form, action){
											var obj = Ext.JSON.decode(action.response.responseText);
        	    				            Ext.Msg.alert('<?php i18n("Failed"); ?>', obj.errors.reason);
				        	                Ext.getCmp('frmLists').getForm().reset();
										},
				    	                success: function(form, action) {
    	        				        	storeEditList.sync();
				    	                	storeEditList.load();
				    	                	currList = storeEditList.getAt(0);
				    	                	Ext.getCmp('frmLists').getForm().reset();
				    	                	Ext.getCmp('cmbList').select(currList);
				    	                	currList = currList.data.option_id;
				    	                	storeListsOption.load({params:{list_id: currList }});
            					        }
                					});
            					}
							}
						}
					});
				}
			},'-','<?php i18n('Select list'); ?>: ',{
				name			: 'cmbList', 
				width			: 250,
				xtype			: 'combo',
				displayField	: 'title',
				id				: 'cmbList',
				mode			: 'local',
				triggerAction	: 'all', 
				hiddenName		: 'option_id',
				valueField		: 'option_id',
				iconCls			: 'icoListOptions',
				editable		: false,
				store			: storeEditList,
				handler: function(){
					rowEditing.cancelEdit();
				},
				listeners: {
					select: function(combo, record){
						// Reload the data store to reflect the new selected list filter
						currList = record[0].data.option_id;
						storeListsOption.load({params:{list_id: currList }});
					}
				}

            },'-',{
                text   : "Add User",
                iconCls: 'icon-add',
                handler: function(){
                    // add an empty record
                    storeListsOption.insert(0, new ListRecord({list_id:currList}));
                    rowEditing.startEdit(0, 0);
                }
			}]
		},{
			// -----------------------------------------
			// Grid Bottom Menu
			// -----------------------------------------
			xtype	: 'toolbar',
			dock	: 'bottom',
			items:[{
				// Add a new record.
				text		:'<?php i18n('Add record'); ?>',
				iconCls		: 'icoAddRecord',
				handler: function() {
					rowEditing.cancelEdit();
					currRec = new ListRecord();
					currRec.set('list_id', Ext.getCmp('cmbList').value);
					storeListsOption.add( currRec );
					rowEditing.startEdit( storeListsOption.getTotalCount(), 0 );
				}
			},'-',{
				// Delete the selected record.
				text:'<?php i18n('Delete record'); ?>',
				iconCls: 'delete',
				handler: function(){ 
					Ext.Msg.show({
						title: '<?php i18n('Please confirm...'); ?>', 
						icon: Ext.MessageBox.QUESTION,
						msg:'<?php i18n('Are you sure to delete this record?'); ?>',
						buttons: Ext.Msg.YESNO,
						fn:function(btn,msgGrid){
							if(btn=='yes'){
								if(currRec.fields.get('option_id').value == ""){
									rowEditing.cancelEdit();
									storeListsOption.remove(currRec);
								} else {
									rowEditing.cancelEdit();
									storeListsOption.remove( currRec );
									storeListsOption.sync();
									storeListsOption.load({params:{list_id: currList }});
								}
				    	    }
						}
					});
				}
			}]
		}] // END GRID TOP MENU
	}); // END GRID

	//***********************************************************************************
	// Top Render Panel 
	// This Panel needs only 3 arguments...
	// PageTigle 	- Title of the current page
	// PageLayout 	- default 'fit', define this argument if using other than the default value
	// PageBody 	- List of items to display [foem1, grid1, grid2]
	//***********************************************************************************
    Ext.create('Ext.mitos.TopRenderPanel', {
        pageTitle: '<?php i18n('List Options'); ?>',
        pageBody: [listGrid]
    });
}); // End ExtJS

</script>