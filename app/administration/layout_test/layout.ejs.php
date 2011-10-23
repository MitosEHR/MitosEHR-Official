<?php 
//******************************************************************************
// layout.ejs.php
// Description: Layout Screen Panel
// v0.0.1
// 
// Author: GI Technologies, 2011
// Modified: n/a
// 
// MitosEHR (Eletronic Health Records) 2011
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
delete Ext.mitos.Panel;
Ext.onReady(function() {
	Ext.define('Ext.mitos.Panel',{
        extend      : 'Ext.mitos.RenderPanel',
        pageTitle   : '<?php i18n("Layout Form Editor"); ?>',
        pageLayout  : 'border',
		uses        : ['Ext.mitos.CRUDStore','Ext.mitos.GridPanel','Ext.mitos.SaveCancelWindow'],
		initComponent: function(){
            /** @namespace Ext.QuickTips */
            /** @namespace app */
            Ext.QuickTips.init();
            var panel = this;
			var form_id = 'Demographics'; 	// Stores the current form group selected by the user.
			var rowPos; 					// Stores the current Grid Row Position (int)
			var currRec; 					// A stored current record selected by the user.

			// *************************************************************************************
			// Layout Record Structure
			// *************************************************************************************
			Ext.define('layoutModel', {
                extend: 'Ext.data.Model',
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
				]
			});

            panel.LayoutStore = Ext.create('Ext.data.TreeStore', {
                model: 'layoutModel',
                proxy: {
                    type: 'ajax',
                    api:{
                       	read		: 'app/administration/layout_test/data_read.ejs.php',
                        create		: 'app/administration/layout_test/data_create.ejs.php',
                        update      : 'app/administration/layout_test/data_update.ejs.php',
                        destroy 	: 'app/administration/layout_test/data_destroy.ejs.php'
                    }
                },
                folderSort: true
            });

            // *************************************************************************************
			// Type combo options
			// *************************************************************************************
			panel.fieldTypesStore = Ext.create('Ext.mitos.CRUDStore',{
				fields: [
					{name: 'id',		type: 'string'},
					{name: 'name',	    type: 'string'},
					{name: 'value',	    type: 'string'}
				],
				model 		:'field_typesModel',
				idProperty 	:'id',
				read		: 'app/administration/layout_test/component_data.ejs.php',
				extraParams	: {"task": "field_types"}
			});

			// *************************************************************************************
			// Form List Record Structure & Store
			// *************************************************************************************
			panel.formlistStore = Ext.create('Ext.mitos.CRUDStore',{
				fields: [
					{name: 'id',		type: 'string'},
					{name: 'form_id',	type: 'string'}
				],
				model 		:'formlistModel',
				idProperty 	:'id',
				read		: 'app/administration/layout_test/component_data.ejs.php',
				extraParams	: {"task": "form_list"}
			});
	
			// *************************************************************************************
			// Form List Record Structure & Store
			// *************************************************************************************
			panel.uorStore = Ext.create('Ext.mitos.CRUDStore',{
				fields: [
					{name: 'id',	type: 'string'},
					{name: 'uor',	type: 'string'}
				],
				model 		:'uorModel',
				idProperty 	:'id',
				read		: 'app/administration/layout_test/component_data.ejs.php',
				extraParams	: {"task": "uor"}
			});
	
			// *************************************************************************************
			// Data Types Record Structure & Store
			// *************************************************************************************
			panel.datatypesStore = Ext.create('Ext.mitos.CRUDStore',{
				fields: [
					{name: 'id',	type: 'string'},
					{name: 'type',	type: 'string'}
				],
				model 		:'typeModel',
				idProperty 	:'id',
				read		: 'app/administration/layout_test/component_data.ejs.php',
				extraParams	: {"task": "data_types"}
			});
	
			// *************************************************************************************
			// List Options Record Structure & Store
			// *************************************************************************************
			panel.listoptionStore = Ext.create('Ext.mitos.CRUDStore',{
				fields: [
					{name: 'id',		type: 'int'},
					{name: 'title',		type: 'string'},
					{name: 'list_id',	type: 'string'},
					{name: 'option_id',	type: 'string'}
				],
				model 		:'listoptionModel',
				idProperty 	:'id',
				read		: 'app/administration/layout_test/component_data.ejs.php',
				extraParams	: {"task": "lists"}
			});
	
			// *************************************************************************************
			// List Options Record Structure & Store
			// *************************************************************************************
			panel.whereStore = Ext.create('Ext.mitos.CRUDStore',{
				fields: [
					{name: 'group_name',type: 'string'}
				],
				model 		:'whereModel',
				idProperty 	:'group_name',
				read		: 'app/administration/layout_test/component_data.ejs.php',
				extraParams	: {"task": "groups", "form_id": form_id}
			});

            // *************************************************************************************
			// List Options Grid
			// *************************************************************************************
            panel.optionGrid = new Ext.create('Ext.grid.Panel', {
				store		: panel.formlistStore,
				region		: 'east',
				frame		: true,
                collapseMode:'mini',
                split       : true,
                hideCollapseTool :true,
				width		: 200,
				collapsible	: true,
                collapsed   : true,
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
        		    },
                    {
						text     : '<?php i18n("Value"); ?>',
						flex     : 1,
						sortable : true,
						dataIndex: 'form_id'
        		    }
				],
				listeners: {
					itemclick: {
        		    	fn: function(DataView, record, item, rowIndex, e){
            				panel.rowEditing.cancelEdit();
							form_id = record.get('form_id');
							panel.LayoutStore.load({params:{form_id: form_id }});
							panel.whereStore.load({params:{task: 'groups', form_id: form_id} });
							panel.layoutGrid.setTitle('<?php i18n("Field editor"); ?> ('+form_id+')');
        		    	}
					}
				},
                dockedItems: [{
                    xtype:'toolbar',
                    items:[{
                        xtype			: 'combo',
                        name			: 'where',
                        displayField	: 'group_name',
                        valueField		: 'group_name',
                        editable		: false,
                        store			: panel.whereStore,
                        queryMode		: 'local',
                        itemId		    : 'combo',
                        width           : 185
                    }]
                }]
            });
            

			// *************************************************************************************
			// User form
			// *************************************************************************************
    		panel.whereForm = new Ext.create('Ext.mitos.FormPanel', {
                region          : 'center',
                frameHeader     : true,
                title		    : 'Field Properties',
                autoScroll      : true,
                frame           : true,
        		fieldDefaults   : { msgTarget: 'side', labelWidth: 100 },
        		defaults        : { anchor:'100%' },
        		items: [{
                    fieldLabel      : 'Title',
                    xtype           : 'textfield',
                    name            : 'title',
                    itemId          : 'title',
                    margin          : '5px 5px 5px 10px',
                    enableKeyEvents : true,
                    listeners:{
                        keyup: function(){
                            var q = this.getValue();
                            var f = panel.whereForm.getComponent('aditionalProperties').getComponent('name');
                            f.setValue(q.toLowerCase().replace(" ","_"));

                        }
                    }
                },{
                    fieldLabel      : 'Type',
                    xtype           : 'combo',
                    name            : 'xtype',
                    displayField	: 'name',
                    valueField		: 'value',
                    editable		: false,
                    store			: panel.fieldTypesStore,
                    queryMode		: 'local',
                    margin          : '5px 5px 5px 10px',
                    itemId          : 'xtype',
                    listeners       : {
                        select: function(combo, record){
                            var type = record[0].data.value;

                            if(type == 'combobox'){
                                panel.optionGrid.setTitle('Select List Options');
                                panel.optionGrid.expand();
                                panel.optionGrid.enable();
                            } else {
                                panel.optionGrid.collapse();
                                panel.optionGrid.disable();
                            }

                            Array.prototype.find = function(searchStr) {
                                var returnArray = false;
                                for (i=0; i<this.length; i++) {
                                    if (typeof(searchStr) == 'function') {
                                        if (searchStr.test(this[i])) {
                                            if (!returnArray) { returnArray = [] }
                                                returnArray.push(i);
                                            }
                                        } else {
                                            if (this[i]===searchStr) {
                                                if (!returnArray) { returnArray = [] }
                                            returnArray.push(i);
                                        }
                                    }
                                }
                                return returnArray;
                            };

                            var addProp = panel.whereForm.getComponent('aditionalProperties');
                            var is = addProp.items.keys;

                            function enableItems(itmes){
                                for (var i=0; i<is.length; i++){
                                    if ( !itmes.find(is[i]) ){
                                        addProp.getComponent(is[i]).hide();
                                    } else {
                                        addProp.getComponent(is[i]).show();
                                    }

                                }
                            }
                            switch(type){
                                case 'combobox':
                                    enableItems(['name','width','allowBlank']);
                                    break;
                                case 'fieldset':
                                    enableItems(['']);
                                    break;
                                case 'fieldcontainer':
                                    enableItems(['']);
                                    break;
                                case 'textfield':
                                    enableItems(['name','allowBlank']);
                                    break;
                                case 'textareafield':
                                    enableItems(['name','allowBlank']);
                                    break;
                                case 'checkboxfield':
                                    enableItems(['name','allowBlank']);
                                    break;
                                default:
                                    enableItems(['name','allowBlank']);


                            }
                        }
                    }
                },{
                    fieldLabel      : 'Child Of',
                    xtype			: 'combo',
                    name			: 'where',
                    displayField	: 'group_name',
                    valueField		: 'group_name',
                    editable		: false,
                    store			: panel.whereStore,
                    queryMode		: 'local',
                    margin          : '5px 5px 5px 10px',
                    itemId		    : 'combo'
                },{
                    xtype   : 'fieldset',
                    itemId  : 'aditionalProperties',
                    title   : 'Aditional Properties',
                    defaults        : { anchor:'100%' },
                    items   : [{
                        fieldLabel      : 'Name',
                        xtype           : 'textfield',
                        name            : 'name',
                        itemId          : 'name',
                        hidden          : true
                    },{
                        fieldLabel      : 'Width',
                        xtype           : 'textfield',
                        name            : 'width',
                        itemId          : 'width',
                        hidden          : true
                    },{
                        fieldLabel      : 'Height',
                        xtype           : 'textfield',
                        name            : 'height',
                        itemId          : 'height',
                        hidden          : true
                    },{
                        fieldLabel      : 'Flex',
                        xtype           : 'checkbox',
                        name            : 'flex',
                        itemId          : 'flex',
                        hidden          : true
                    },{
                        fieldLabel      : 'Input Value',
                        xtype           : 'textfield',
                        name            : 'inputValue',
                        itemId          : 'inputValue',
                        hidden          : true
                    },{
                        fieldLabel      : 'Label Width',
                        xtype           : 'textfield',
                        name            : 'labelWidth',
                        itemId          : 'labelWidth',
                        hidden          : true
                    },{
                        fieldLabel      : 'Allow Blank',
                        xtype           : 'checkbox',
                        name            : 'allowBlank',
                        itemId          : 'allowBlank',
                        hidden          : true
                    },{
                        fieldLabel      : 'Value',
                        xtype           : 'textfield',
                        name            : 'value',
                        itemId          : 'value',
                        hidden          : true
                    },{
                        fieldLabel      : 'Max Value',
                        xtype           : 'textfield',
                        name            : 'maxValue',
                        itemId          : 'maxValue',
                        hidden          : true
                    },{
                        fieldLabel      : 'Min Value',
                        xtype           : 'textfield',
                        name            : 'minValue',
                        itemId          : 'minValue',
                        hidden          : true
                    },{
                        fieldLabel      : 'Box Label',
                        xtype           : 'textfield',
                        name            : 'boxLabel',
                        itemId          : 'boxLabel',
                        hidden          : true
                    },{
                        fieldLabel      : 'Grow',
                        xtype           : 'checkbox',
                        name            : 'grow',
                        itemId          : 'grow',
                        hidden          : true
                    },{
                        fieldLabel      : 'Increment',
                        xtype           : 'textfield',
                        name            : 'increment',
                        itemId          : 'increment',
                        hidden          : true
                    }]
        		}]
    		});
	
			// *************************************************************************************
			// window - Add Field Window
			// *************************************************************************************
			panel.winAddField = Ext.create('Ext.mitos.Window', {
				title		: '<?php i18n("Add Form Field."); ?>',
                layout      : 'border',
                height      : 400,
				width		: 550,
				items		: [ panel.whereForm, panel.optionGrid ],
				buttons:[{
					text		:'<?php i18n("Add"); ?>',
					name		: 'cmdSave',
					id			: 'cmdSave',
					iconCls		: 'save',
            		handler: function(){
						app.save();
					}
				},'-',{
					text:'<?php i18n("Close"); ?>',
					iconCls: 'delete',
		            handler: function(){
        		    	panel.rowEditing.cancelEdit();
            			panel.winAddField.hide();
		            }
				}]
			});

			// *************************************************************************************
			// Grouping - group_name
			// *************************************************************************************
    		panel.groupingLayout = Ext.create('Ext.grid.feature.Grouping',{
    			enableNoGroups: false,
        		groupHeaderTpl: '<?php i18n("Group"); ?>: {name} ({rows.length} <?php i18n("Field"); ?>{[values.rows.length > 1 ? "s" : ""]})'
    		});

    		// *************************************************************************************
    		// RowEditor Plugin
    		// *************************************************************************************
    		panel.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
        		autoCancel: false,
				errorSummary: false,
				listeners:{
					afteredit: function(){
						panel.LayoutStore.sync();
						panel.LayoutStore.load({params:{form_id: form_id }});
						panel.layoutGrid.setTitle('<?php i18n("Field editor"); ?> ('+form_id+')');
					}
				}
    		});

			// *************************************************************************************
			// Layout fields Grid Panel
			// *************************************************************************************
			panel.layoutGrid = Ext.create('Ext.tree.Panel', {
				store	: panel.LayoutStore,
        		region	: 'center',
   	    		border	: true,
  	    		frame	: true,
  	    		sortable: false,
                useArrows: true,
                rootVisible: false,
                singleExpand: true,
   	    		title	: '<?php i18n("Field editor"); ?> (<?php i18n("Demographics"); ?>)',
        		columns	: [
					{
                        xtype       : 'treecolumn',
                        text     	: '<?php i18n("Field Group"); ?>',
						sortable 	: false,
						dataIndex	: 'group_name',
						width		: 100,
						align		: 'left'
                    },
					{
						text     	: '<?php i18n("Data Type"); ?>',
						sortable 	: false,
						dataIndex	: 'data_type',
						width		: 100,
						align		: 'left'
		            },
					{
						text     	: '<?php i18n("Label"); ?>',
						sortable 	: false,
						dataIndex	: 'title',
						width		: 130,
						align		: 'left'
		            },
					{
						text     	: '<?php i18n("Description"); ?>',
						sortable 	: false,
						dataIndex	: 'description',
						flex		: 1,
						align		: 'left'
		            },
					{ text: 'item_id', hidden: true, dataIndex: 'item_id' },
					{ text: 'form_id', hidden: true, dataIndex: 'form_id' }
				],
				listeners: {
					itemclick: {
            			//fn: function(DataView, record, item, rowIndex, e){
		                //		panel.rowEditing.cancelEdit();
        		    	//	currRec = panel.LayoutStore.getAt(rowIndex);
            			//	rowPos = rowIndex;
            			//	panel.cmdDelete.enable();
            			//}
					}
				},
				dockedItems: [{
					xtype: 'toolbar',
					dock: 'top',
					items: [
						panel.cmdAdd = new Ext.create('Ext.Button', {
							name: 'cmdAddField',
							text: '<?php i18n("Add field"); ?>',
							iconCls: 'icoAddRecord',
							handler: function(){
								panel.rowEditing.cancelEdit();
                                panel.whereForm.getForm().reset();
                                panel.optionGrid.collapse();
                                panel.optionGrid.disable();
								panel.winAddField.show();
							}
						})
					,'-',
                        panel.cmdUpdate = new Ext.create('Ext.Button', {
							name: 'cmdAddField',
							text: '<?php i18n("Edit field"); ?>',
							iconCls: 'icoAddRecord',
							handler: function(){
								panel.rowEditing.cancelEdit();
                                panel.whereForm.getForm().reset();
                                panel.optionGrid.collapse();
                                panel.optionGrid.disable();
								panel.winAddField.show();
							}
						})
					,'-',
						panel.cmdDelete = new Ext.create('Ext.Button', {
							name: 'cmdDelField',
							text: '<?php i18n("Delete field"); ?>',
							iconCls: 'delete',
							disabled: true,
							handler: function(){
								panel.rowEditing.cancelEdit();
								Ext.Msg.show({
									title: '<?php i18n("Please confirm..."); ?>', 
									icon: Ext.MessageBox.QUESTION,
									msg:'<?php i18n("Are you sure to delete this field?<br>WARNING: This will also detele the field and data on the table."); ?>',
									buttons: Ext.Msg.YESNO,
									fn:function(btn,msgGrid){
										if(btn=='yes'){
											panel.LayoutStore.remove( currRec );
											panel.LayoutStore.sync();
											panel.LayoutStore.load();
						    		    }
									}
								});
							}
						})
					]
				}]
		    }); // END LayoutGrid Grid
    
    		// *************************************************************************************
    		// Panel to choose Layouts
    		// *************************************************************************************
    		panel.chooseGrid = Ext.create('Ext.grid.Panel', {
				store		: panel.formlistStore,
				region		: 'east',
				border		: true,
				frame		: true,
                margin      : '0 0 0 3px',
				title		: '<?php i18n("Form list"); ?>',
				width		: 150,
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
            				panel.rowEditing.cancelEdit();
							form_id = record.get('form_id');
							panel.LayoutStore.load({params:{form_id: form_id }});
							panel.whereStore.load({params:{task: 'groups', form_id: form_id} });
							panel.layoutGrid.setTitle('<?php i18n("Field editor"); ?> ('+form_id+')');
        		    	}
					}
				}
		    }); // END LayoutChoose
            panel.pageBody = [ panel.layoutGrid, panel.chooseGrid ];
			panel.callParent(arguments);
		} // end of initComponent
	}); //ens LayoutPanel class
    MitosPanel = Ext.create('Ext.mitos.Panel');
}); // End ExtJS
</script>