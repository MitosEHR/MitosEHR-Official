/**
 *
 * list.ejs.php
 * List Options Panel
 * v0.0.2
 *
 * Author: Ernest Rodriguez
 * Modified: GI Technologies, 2011
 *
 * MitosEHR (Eletronic Health Records) 2011
 *
 * @namespace Lists.getOptions
 * @namespace Lists.addOption
 * @namespace Lists.updateOption
 * @namespace Lists.deleteOption
 *
 */
Ext.define('Ext.mitos.panel.administration.lists.Lists',{
    extend      : 'Ext.mitos.RenderPanel',
    id          : 'panelLists',
    pageTitle   : 'Select List Options',
    uses        : [
        'Ext.mitos.restStoreModel',
        'Ext.mitos.GridPanel',
        'Ext.mitos.window.Window',
        'Ext.mitos.form.FormPanel',
        'Ext.mitos.window.Window'
    ],
    initComponent: function(){

        var me = this;
        me.currList = null;
        me.currTask = null; 

        Ext.define('LogsModel', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'id',			type: 'int'		},
                {name: 'list_id', 		type: 'string'	},
                {name: 'option_value', 	type: 'string'	},
                {name: 'option_name', 	type: 'string'	},
                {name: 'seq', 			type: 'int' 	},
                {name: 'notes', 		type: 'string'	}
            ]

        });

        me.store = Ext.create('Ext.data.Store', {
            model: 'LogsModel',
            proxy: {
                type: 'direct',
                api: {
                    read    : Lists.getOptions,
                    create  : Lists.addOption,
                    update  : Lists.updateOption,
                    destroy : Lists.deleteOption
                }
            },
            autoLoad: false
        });
        // *************************************************************************************
        // Create list Window Dialog
        // *************************************************************************************
        me.win = Ext.create('Ext.mitos.window.Window', {
            width: 400,
            title: 'Create List',
            items:[{
                xtype    : 'mitos.form',
                defaults : { labelWidth: 100, anchor: '100%' },
                items:[{
                    xtype       : 'textfield',
                    fieldLabel  : 'List Name',
                    name        : 'list_name',
                    width       : 200,
                    allowBlank  : false
                },{
                    xtype       : 'textfield',
                    fieldLabel  : 'Unique name',
                    name        : 'option_id',
                    width       : 200,
                    allowBlank  : false
                }]
            }],
            buttons:[{
                text		: 'Create',
                iconCls		: 'save',
                itemId      : 'cmdSave',
                cls         : 'winSave',
                handler		: function() {
                    var form = Ext.getCmp('frmLists').getForm();
                    if(form.isValid()){
                        me.onSave();
                    }
                }
            },'-',{
                text		: 'Cancel',
                iconCls		: 'delete',
                itemId      : 'cmdClose',
                handler		: function(){
                    me.win.hide();
                }
            }]
        }); // END WINDOW

        // *************************************************************************************
        // RowEditor Class
        // *************************************************************************************
        me.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            autoCancel      : false,
            errorSummary    : false,
            listeners       : {
                afteredit   : function(){
                    me.store.sync();
                    me.store.load({params:{list_id: me.currList }});
                }
            }
        });

        // *************************************************************************************
        // Create the GridPanel
        // *************************************************************************************
        // FIXME: On the double click event, is giving a error on ExtJSv4, don't know what
        // is cousing the problem. I will check this error later.
        me.listGrid = Ext.create('Ext.mitos.GridPanel', {
            store		: me.store,
            plugins		: [me.rowEditing],
            columns:[{
                text        : 'Option Title',
                width       : 200,
                sortable    : true,
                dataIndex   : 'option_name',
                editor      : { allowBlank: false }
            },{
                text        : 'Option Value',
                width       : 200,
                sortable    : true,
                dataIndex   : 'option_value',
                editor      : { allowBlank: false }
            },{
                text        : 'Order',
                width       : 100,
                sortable    : true,
                dataIndex   : 'seq',
                editor      : { allowBlank: false }
            },{
                text        : 'Notes',
                sortable    : true,
                dataIndex   : 'notes',
                flex        : 1,
                editor      : { allowBlank: true }
            }],
            listeners:{
                scope       : this,
                itemclick   : me.onItemClick
            },
            dockedItems:[{
                xtype	    : 'toolbar',
                dock	    : 'top',
                items:[{
                    xtype	    : 'button',
                    text	    : 'Create New Select List',
                    iconCls	    : 'icoListOptions',
                    handler     : function(){
                        me.currTask = 'list';
                        me.onNewList();
                    }
                },'-',{
                    text	    : 'Delete Select List',
                    iconCls	    : 'delete',
                    cls         : 'toolDelete',
                    handler	    : function(){
                        me.currTask = 'list';
                        this.onDelete();
                    }
                },'-',{
                    fieldLabel  : 'Select List',
                    xtype	    : 'mitos.listscombo',
                    name		: 'cmbList',
                    itemId      : 'cmbList',
                    labelWidth  : 60,
                    handler     : function(){
                        me.rowEditing.cancelEdit();
                    },
                    listeners: {
                        scope   : this,
                        select  : this.onSelectList
                    }
                },'->',{
                    text        : 'Add Option',
                    iconCls     : 'icoAddRecord',
                    handler     : function() {
                        me.currTask = 'option';
                        me.onNewOption();
                    }
                },'-',{
                    text        : 'Delete Option',
                    iconCls     : 'delete',
                    cls         : 'toolDelete',
                    handler     : function(){
                        me.currTask = 'option';
                        me.onDelete();
                    }
                }]
            }] // END GRID TOP MENU
        }); // END GRID
        me.pageBody = [ me.listGrid ];
        me.callParent(arguments);
    },

    onNewList:function(){
        this.win.show();
        //TODO
    },

    onNewOption:function(){
        //TODO
    },

    onSave:function(){
        //TODO
    },

    onDelete:function(){
        Ext.Msg.show({
            title   : 'Please confirm...',
            icon    : Ext.MessageBox.QUESTION,
            msg     : 'Are you sure to delete this record?',
            buttons : Ext.Msg.YESNO,
            scope   : this,
            fn      : function(btn){
                if(btn=='yes'){
                    alert('TODO');
                }
            }
        });
    },

    onItemClick:function(){
        //TODO
    },

    onSelectList:function(combo, record){
        this.currList = record[0].data.id;
        this.loadGrid();
    },
    
    loadGrid:function(){
        var combo = this.listGrid.down('toolbar').getComponent('cmbList'),
        store = combo.getStore();
        if(this.currList === null){
            this.currList = store.getAt(0).data.option_id;
            combo.setValue(this.currList);
        }
        this.store.load({params:{list_id: this.currList}});
    },
    /**
    * This function is called from MitosAPP.js when
    * this panel is selected in the navigation panel.
    * place inside this function all the functions you want
    * to call every this panel becomes active
    */
    onActive:function(callback){
        this.loadGrid();
        callback(true);
    }
});
