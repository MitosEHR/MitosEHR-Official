//******************************************************************************
// list.ejs.php
// List Options Panel
// v0.0.2
// 
// Author: Ernest Rodriguez
// Modified: GI Technologies, 2011
// 
// MitosEHR (Eletronic Health Records) 2011
//******************************************************************************
Ext.define('Ext.mitos.panel.administration.lists.Lists',{
    extend      : 'Ext.mitos.RenderPanel',
    id          : 'panelLists',
    pageTitle   : 'List Options',
    pageLayout  : 'border',
    uses        : ['Ext.mitos.CRUDStore','Ext.mitos.GridPanel','Ext.mitos.SaveCancelWindow','Ext.mitos.FormPanel','Ext.mitos.Window'],

    initComponent: function(){
        //******************************************************************************
        // ExtJS Global variables
        //******************************************************************************
        var panel = this;
        var rowPos; // Stores the current Grid Row Position (int)
        var currList; // Stores the current List Option (string)
        var currRec; // Store the current record (Object)

        // *************************************************************************************
        // Structure of the message record
        // creates a subclass of Ext.data.Record
        // This should be the structure of the database table
        // *************************************************************************************
        panel.storeListsOption = Ext.create('Ext.mitos.CRUDStore', {
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
            read		: 'app/administration/lists/data_read.ejs.php',
            create		: 'app/administration/lists/data_create.ejs.php',
            update		: 'app/administration/lists/data_update.ejs.php',
            destroy 	: 'app/administration/lists/data_destroy.ejs.php'
        });

        // ****************************************************************************
        // Structure, data for List Select list
        // AJAX -> component_data.ejs.php
        // ****************************************************************************
        panel.storeEditList = Ext.create('Ext.mitos.CRUDStore', {
            fields: [
                {name: 'option_id', type: 'string'},
                {name: 'title', type: 'string'}
            ],
            model		: 'editListModel',
            idProperty	: 'option_id',
            read		: 'app/administration/lists/component_data.ejs.php?task=editlist',
            destroy		: 'app/administration/lists/component_data.ejs.php?task=d_list'
        });

        //--------------------------
        // When the data is loaded
        // Select the first record
        //--------------------------
        panel.storeEditList.on('load',function(ds,records,o){
            if (!currList){
                Ext.getCmp('cmbList').setValue(records[0].data.option_id);
                currList = records[0].data.option_id; 					// Get first result for first grid data
                panel.storeListsOption.load({params:{list_id: currList}}); 	// Filter the data store from the currList value
            } else {
                Ext.getCmp('cmbList').setValue( currList );
                panel.storeListsOption.load({params:{list_id: currList }});
            }
        });

        // *************************************************************************************
        // List Create Form
        // Create or Closse purpose
        // *************************************************************************************
        panel.frmLists = Ext.create('Ext.mitos.FormPanel', {
            defaults	: { labelWidth: 100, anchor: '100%' },
            items:[
                {
                    xtype: 'textfield',
                    width: 200,
                    id: 'option_id',
                    name: 'option_id',
                    allowBlank: false,
                    fieldLabel: 'Unique name'
                },
                {
                    xtype: 'textfield',
                    width: 200,
                    id: 'list_name',
                    name: 'list_name',
                    allowBlank: false,
                    fieldLabel: 'List Name'
                }
            ]
        });

        // *************************************************************************************
        // Create list Window Dialog
        // *************************************************************************************
        panel.winLists = Ext.create('Ext.mitos.Window', {
            id			: 'winList',
            width		: 400,
            title		: 'Create List',
            items		: [ panel.frmLists ],
            // -----------------------------------------
            // Window Bottom Bar
            // -----------------------------------------
            buttons:[{
                text		:'Create',
                name		: 'cmdSave',
                id			: 'cmdSave',
                iconCls		: 'save',
                handler		: function() {
                    var form = Ext.getCmp('frmLists').getForm();
                    if(form.isValid()){
                        form.submit({
                            url: 'app/administration/lists/component_data.ejs.php?task=c_list',
                            timeout: 1800000, // 30 minutes to timeout.
                            waitMsg: 'Saving new list...',
                            waitTitle: 'Processing...',
                            failure: function(form, action){
                                var obj = Ext.JSON.decode(action.response.responseText);
                                Ext.Msg.alert('Failed', obj.errors.reason);
                                panel.frmLists.getForm().reset();
                            },
                            success: function(form, action) {
                                panel.storeEditList.sync();
                                panel.storeEditList.load();
                                currList = Ext.getCmp('option_id').getValue();
                                panel.frmLists.getForm().reset();
                            }
                        });
                    }
                    panel.winLists.hide();
                }
            },'-',{
                text		: 'Close',
                name		: 'cmdClose',
                id			: 'cmdClose',
                iconCls		: 'delete',
                handler		: function(){ panel.winLists.hide(); }
            }]
        }); // END WINDOW

        // *************************************************************************************
        // RowEditor Class
        // *************************************************************************************
        panel.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            autoCancel: false,
            errorSummary: false,
            listeners:{
                afteredit: function(){
                    panel.storeListsOption.sync();
                    panel.storeListsOption.load({params:{list_id: currList }});
                }
            }
        });

        // *************************************************************************************
        // Create the GridPanel
        // *************************************************************************************
        // FIXME: On the double click event, is giving a error on ExtJSv4, don't know what
        // is cousing the problem. I will check this error later.
        panel.listGrid = Ext.create('Ext.mitos.GridPanel', {
            store		: panel.storeListsOption,
            plugins		: [panel.rowEditing],
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
                text: 'Title',
                sortable: true,
                dataIndex: 'title',
                editor: {
                    allowBlank: false
                }
            },{
                text: 'Order',
                sortable: true,
                dataIndex: 'seq',
                editor: {
                    allowBlank: false
                }
            },{
                text: 'Default',
                sortable: true,
                dataIndex: 'is_default',
                editor: {
                    xtype: 'checkbox',
                    allowBlank: false
                }
            },{
                text: 'Notes',
                sortable: true,
                dataIndex: 'notes',
                flex: 1,
                editor: {
                    allowBlank: true
                }
            }],
            listeners:{
                itemclick: function(view, record, item, rowIndex, element ){
                    currRec = panel.storeListsOption.getAt(rowIndex); // Copy the record to the global variable
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
                    text	: 'Create a list',
                    iconCls	: 'icoListOptions',
                    handler: function(){
                        panel.rowEditing.cancelEdit();
                        panel.frmLists.getForm().reset(); // Clear the form
                        panel.winLists.show();
                    }
                },'-',{
                    id		: 'delList',
                    text	: 'Delete list',
                    iconCls	: 'delete',
                    handler	: function(){
                        Ext.Msg.show({
                            title: 'Please confirm...',
                            icon: Ext.MessageBox.QUESTION,
                            msg:'Are you sure to delete this List?',
                            buttons: Ext.Msg.YESNO,
                            fn:function(btn,msgGrid){
                                if(btn=='yes'){
                                    panel.rowEditing.cancelEdit();
                                    Ext.getCmp('option_id').setValue( Ext.getCmp('cmbList').getValue() );
                                    Ext.getCmp('list_name').setValue( "DEL" ); // This has no purpose.
                                    var form = panel.frmLists.getForm();
                                    if(form.isValid()){
                                        form.submit({
                                            url: 'app/administration/lists/component_data.ejs.php?task=d_list',
                                            timeout: 1800000, // 30 minutes to timeout.
                                            waitMsg: 'Deleting list...',
                                            waitTitle: 'Processing...',
                                            failure: function(form, action){
                                                var obj = Ext.JSON.decode(action.response.responseText);
                                                Ext.Msg.alert('Failed', obj.errors.reason);
                                                panel.frmLists.getForm().reset();
                                            },
                                            success: function(form, action) {
                                                panel.storeEditList.sync();
                                                panel.storeEditList.load();
                                                currList = panel.storeEditList.getAt(0);
                                                panel.frmLists.getForm().reset();
                                                Ext.getCmp('cmbList').select(currList);
                                                currList = currList.data.option_id;
                                                panel.storeListsOption.load({params:{list_id: currList }});
                                            }
                                        });
                                    }
                                }
                            }
                        });
                    }
                },'-','Select list: ',{
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
                    store			: panel.storeEditList,
                    handler: function(){
                        panel.rowEditing.cancelEdit();
                    },
                    listeners: {
                        select: function(combo, record){
                            // Reload the data store to reflect the new selected list filter
                            currList = record[0].data.option_id;
                            panel.storeListsOption.load({params:{list_id: currList }});
                        }
                    }

                },'-',{
                    text   : "Add User",
                    iconCls: 'icon-add',
                    handler: function(){
                        // add an empty record
                        panel.storeListsOption.insert(0, ListRecord({list_id:currList}));
                        panel.rowEditing.startEdit(0, 0);
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
                    text		:'Add record',
                    iconCls		: 'icoAddRecord',
                    handler: function() {
                        panel.rowEditing.cancelEdit();
                        currRec = ListRecord();
                        currRec.set('list_id', Ext.getCmp('cmbList').value);
                        panel.storeListsOption.add( currRec );
                        panel.rowEditing.startEdit( panel.storeListsOption.getTotalCount(), 0 );
                    }
                },'-',{
                    // Delete the selected record.
                    text:'Delete record',
                    iconCls: 'delete',
                    handler: function(){
                        Ext.Msg.show({
                            title: 'Please confirm...',
                            icon: Ext.MessageBox.QUESTION,
                            msg:'Are you sure to delete this record?',
                            buttons: Ext.Msg.YESNO,
                            fn:function(btn,msgGrid){
                                if(btn=='yes'){
                                    if(currRec.fields.get('option_id').value == ""){
                                        panel.rowEditing.cancelEdit();
                                        panel.storeListsOption.remove(currRec);
                                    } else {
                                        panel.rowEditing.cancelEdit();
                                        panel.storeListsOption.remove( currRec );
                                        panel.storeListsOption.sync();
                                        panel.storeListsOption.load({params:{list_id: currList }});
                                    }
                                }
                            }
                        });
                    }
                }]
            }] // END GRID TOP MENU
        }); // END GRID
        panel.pageBody = [ panel.listGrid ];
        panel.callParent(arguments);
    }
}); // End ExtJS
