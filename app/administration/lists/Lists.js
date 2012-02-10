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
 * @namespace Lists.sortOptions
 * @namespace Lists.addList
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

        Ext.define('ListOptionsModel', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'id',			type: 'int'		},
                {name: 'list_id', 		type: 'string'	},
                {name: 'option_value', 	type: 'string'	},
                {name: 'option_name', 	type: 'string'	},
                {name: 'seq', 			type: 'string' 	},
                {name: 'notes', 		type: 'string'	}
            ]

        });

        me.store = Ext.create('Ext.data.Store', {
            model: 'ListOptionsModel',
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
                    fieldLabel  : 'List Name/Title',
                    name        : 'title',
                    width       : 200,
                    allowBlank  : false
                }]
            }],
            buttons:[{
                text		: 'Create',
                scope       : me,
                handler		: me.onListSave
            },'-',{
                text		: 'Cancel',
                handler		: function(){
                    me.win.down('form').getForm().reset();
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
            deleteBtnText   : 'Disable',
            listeners       : {
                scope       : me,
                afteredit: function(){
                    me.store.sync();
                    me.store.load({params:{list_id: me.currList }});
                },
                destroy     : me.onOptionDelete,
                canceledit  : me.onCancelEdit
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
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    dragText: 'Drag and drop to reorganize'
                },
                listeners : {
                    scope : me,
                    drop  : me.onDragDrop
                }
            },
            columns:[{
                text        : 'Option Title',
                width       : 200,
                sortable    : true,
                dataIndex   : 'option_name',
                editor      : {
                    allowBlank: false,
                    enableKeyEvents: true,
                    listeners:{
                        scope: me,
                        keyup: me.onOptionTitleChange
                    }
                }
            },{
                text        : 'Option Value',
                width       : 200,
                sortable    : true,
                dataIndex   : 'option_value',
                editor      : {
                    allowBlank  : false,
                    readOnly    : true,
                    itemId      : 'optionValueTextField'
                }
            },{
                text        : 'Notes',
                sortable    : true,
                dataIndex   : 'notes',
                flex        : 1,
                editor      : { allowBlank: true }
            }],
            dockedItems:[{
                xtype	    : 'toolbar',
                dock	    : 'top',
                items:[{
                    xtype	    : 'button',
                    text	    : 'Create New Select List',
                    iconCls	    : 'icoListOptions',
                    scope       : me,
                    handler     : me.onNewList
                },'-',{
                    fieldLabel  : 'Select List',
                    xtype	    : 'mitos.listscombo',
                    name		: 'cmbList',
                    itemId      : 'cmbList',
                    labelWidth  : 60,
                    width       : 300,
                    handler     : function(){
                        me.rowEditing.cancelEdit();
                    },
                    listeners: {
                        scope   : me,
                        select  : me.onSelectList,
                        expand  : me.onExpand
                    }
                },'->',{
                    text        : 'Add Option',
                    iconCls     : 'icoAddRecord',
                    scope       : me,
                    handler     : me.onNewOption
                }]
            }] // END GRID TOP MENU
        }); // END GRID
        me.pageBody = [ me.listGrid ];
        me.callParent(arguments);
    },

    onNewList:function(){
        this.win.show();
    },

    onListSave:function(){
        var me      = this,
            win     = me.win,
            form    = win.down('form').getForm(),
            cmbList = me.listGrid.down('toolbar').getComponent('cmbList'),
            cmbStore= cmbList.getStore(),
            params  = form.getValues();

        if(form.isValid()){


            Lists.addList(params, function(provider, response){
                if(response.result.success){
                    me.currList = response.result.list_id;

                    cmbStore.load();
                    cmbList.setValue(me.currList);
                    me.store.load({params:{list_id: me.currList}});

                    form.reset();
                    win.close();

                }else{
                    me.msg('Opps!', 'Something went wrong');
                }
            });

        }

    },
        
    onNewOption:function(){
        var me = this;
        me.rowEditing.cancelEdit();
        var r = Ext.create('ListOptionsModel', {
            list_id: me.currList
        });
        me.store.insert(0, r);
        me.rowEditing.startEdit(0, 0);
    },

    onCancelEdit:function(){
        this.store.load({params:{list_id: this.currList}});
    },

    onOptionTitleChange:function(a){
        var value   = this.strToLowerUnderscores(a.getValue()),
            field   = a.up('container').getComponent('optionValueTextField');
        field.setValue(value);
    },

    onDragDrop:function(node, data, overModel, dropPosition){
        var me = this,
            items = overModel.store.data.items,
            gridItmes = [];
        Ext.each(items, function(iteme){
            gridItmes.push(iteme.data.id);
        });
        var params = {
            list_id   : data.records[0].data.list_id,
            fields    : gridItmes
        };
        Lists.sortOptions(params, function(){
            me.store.load({params:{list_id: me.currList}});
        });
    },

    onOptionDelete:function(context){
        Ext.Msg.show({
            title   : 'Please confirm...',
            icon    : Ext.MessageBox.QUESTION,
            msg     : 'Are you sure to delete this record?',
            buttons : Ext.Msg.YESNO,
            scope   : this,
            fn      : function(btn){
                if(btn=='yes'){
                    context.store.remove(context.record);
                    context.store.sync();
                }
            }
        });
    },


    onSelectList:function(combo, record){
        var me = this;
        me.currList = record[0].data.id;
        me.loadGrid();
    },

    onExpand:function(cmb){
        cmb.picker.loadMask.destroy()
    },
    
    loadGrid:function(){
        var me = this,
            combo = me.listGrid.down('toolbar').getComponent('cmbList'),
            store = combo.getStore();
        if(me.currList === null){
            me.currList = store.getAt(0).data.id;
            combo.setValue(me.currList);
        }

        me.store.load({params:{list_id: me.currList}});
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
