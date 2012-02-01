//**********************************************************************************
// roles.ejs.php
// Description: Facilities Screen
// v0.0.3
// 
// Author: Ernesto J Rodriguez
// Modified: n/a
// 
// MitosEHR (Eletronic Health Records) 2011
//**********************************************************************************
Ext.define('Ext.mitos.panel.administration.roles.Roles',{
    extend      : 'Ext.mitos.RenderPanel',
    id          : 'panelRoles',
    pageTitle   : 'Roles and Permissions',
    uses:[
        'Ext.mitos.restStoreModel',
        'Ext.mitos.CRUDStore',
        'Ext.mitos.GridPanel',
        'Ext.mitos.combo.Roles',
        'Ext.mitos.combo.PermValues'
    ],
    initComponent: function(){

        var me = this;
        me.currTask = null;
        me.currRole = null;

        //******************************************************************************
        // Roles Store
        //******************************************************************************
        me.permStore = Ext.create('Ext.mitos.restStoreModel',{
            fields: [
                {name: 'roleID', 		type: 'int'},
                {name: 'role_name', 	type: 'string'},
                {name: 'permID', 		type: 'int'},
                {name: 'perm_key', 		type: 'string'},
                {name: 'perm_name', 	type: 'string'},
                {name: 'rolePermID', 	type: 'int'},
                {name: 'role_id', 		type: 'int'},
                {name: 'perm_id', 		type: 'int'},
                {name: 'value', 		type: 'string'},
                {name: 'ac_perm', 		type: 'string'},
                {name: 'task', 		    type: 'string'}

            ],
            model		: 'PermissionList',
            idProperty	: 'permID',
            url		    : 'app/administration/roles/data.php'
        });

        function permck(val) {
            if (val == 'No Access') {
                return 'View <img src="ui_icons/no.gif" /> / Edit <img src="ui_icons/no.gif" /> / Delete <img src="ui_icons/no.gif" />';
            } else if(val == 'View') {
                return 'View <img src="ui_icons/yes.gif" /> / Edit <img src="ui_icons/no.gif" /> / Delete <img src="ui_icons/no.gif" />';
            } else if (val == 'View/Edit'){
                return 'View <img src="ui_icons/yes.gif" /> / Edit <img src="ui_icons/yes.gif" /> / Delete <img src="ui_icons/no.gif" />';
            } else if (val == 'View/Edit/Delete'){
                return 'View <img src="ui_icons/yes.gif" /> / Edit <img src="ui_icons/yes.gif" /> / Delete <img src="ui_icons/yes.gif" />';
            }
            return val;
        }
        // ****************************************************************************
        // Role Form Itemes
        // ****************************************************************************
        me.rolesFormItems = [{
            xtype		: 'textfield',
            fieldLabel	: 'Role Name',
            name		: 'role_name'
        }];
        // ****************************************************************************
        // Permision Form Items
        // ****************************************************************************
        me.permsFormItems = [{
            xtype		: 'textfield',
            fieldLabel	: 'Permission Name',
            name		: 'perm_name'
        },{
            xtype		: 'textfield',
            fieldLabel	: 'Permission Unique Name',
            name		: 'perm_key'
        }];

        // *************************************************************************************
        // RowEditor Class
        // *************************************************************************************
        //noinspection JSUnusedGlobalSymbols
        me.rowEditing = Ext.create('Ext.grid.plugin.CellEditing', {
            saveText: 'Update',
            errorSummary: false,
            listeners: {
                afteredit: function () {
                    me.permStore.proxy.extraParams = {task:me.currTask};
                    me.permStore.sync();
                    me.permStore.proxy.extraParams = { };
                    me.loadGrid();
                }
            }
        });
        // ****************************************************************************
        // Create the GridPanel
        // ****************************************************************************
        me.rolesGrid = Ext.create('Ext.mitos.GridPanel', {
            store	: me.permStore,
            plugins	: [me.rowEditing],
            columns	: [{
                dataIndex: 'permID',
                hidden: true
            },{
                text     	: 'Secction Area',
                flex     	: 1,
                sortable 	: true,
                dataIndex	: 'perm_name',
                field: {
                    xtype: 'textfield',
                    allowBlank: false
                }
            },{
                header		: 'Access Control / Permision',
                dataIndex	: 'ac_perm',
                renderer 	: permck,
                flex     	: 1,
                field       : { xtype:'mitos.permvaluescombo' },
                lazyRender: true,
                listClass: 'x-combo-list-small'
            }],
            listeners: {
                scope:this,
                itemclick: me.onItemclick
            },
            dockedItems: [{
                xtype	: 'toolbar',
                dock	: 'top',
                items: [{
                    xtype   : 'button',
                    text	: 'Add a Role',
                    iconCls	:'icoAddRecord',
                    handler	: function(){
                        var form = me.win.down('form');
                        me.currTask = 'role';
                        me.onNew(form, me.rolesFormItems, 'PermissionList', 'Add New Role' );
                    }
                },'-',{
                    xtype       : 'button',
                    text		: 'Edit a Role',
                    iconCls		: 'edit',
                    handler		: function(){
                        var form = me.win.down('form');
                        me.currTask = 'role';
                        me.onEdit(form, me.rolesFormItems, 'PermissionList', 'Edit Role');
                    }
                },'-',{
                    xtype           : 'mitos.rolescombo',
                    name			: 'cmbList',
                    width			: 250,
                    iconCls			: 'icoListOptions',
                    itemId          : 'roleCombo',
                    listeners: {
                        scope   : this,
                        select  : me.onSelect,
                        expand   : me.onExpand
                    }

                },'-',{
                    xtype       : 'button',
                    text		: 'Delete Role',
                    iconCls		: 'delete',
                    cls         : 'toolDelete',
                    scope       : this,
                    handler: function(){
                        me.currTask = 'role';
                        me.onDeleteRole();
                    }
                },'->',{
                    xtype   : 'button',
                    text	: 'Add a Permission',
                    iconCls	:'icoAddRecord',
                    handler	: function(){
                        var form = me.win.down('form');
                        me.currTask = 'perm';
                        me.onNew(form, me.permsFormItems, 'PermissionList', 'Add New Permission');
                    }
                },'-',{
                    xtype       : 'button',
                    text		: 'Delete Permission',
                    iconCls		: 'delete',
                    cls         : 'toolDelete',
                    itemId      : 'deletePerm',
                    disabled  	: true,
                    scope       : this,
                    handler: function(){
                        me.currTask = 'perm';
                        me.onDeletePerm();
                    }
                }
                ]
            }]
        }); // END Facility Grid

        me.win = Ext.create('Ext.mitos.window.Window', {
            width : 450,
            items:[{
                xtype:'mitos.form',
                fieldDefaults: {
                    msgTarget	: 'side',
                    labelWidth	: 150
                },
                defaultType	: 'textfield',
                defaults	: { anchor: '100%' }
            }],
            buttons: [{
                text: 'save',
                cls : 'winSave',
                handler: function(){
                    var form = me.win.down('form').getForm();
                    if (form.isValid()) {
                        me.onSave(form, me.permStore);
                        me.action('close');
                    }
                }
            }],
            listeners:{
                scope:me,
                close:function(){
                    me.action('close');
                }
            }
        }); // END WINDOW

        me.pageBody = [ me.rolesGrid ];
        me.callParent(arguments);
    },

    onNew:function(form, formItmes, model, title){
        this.setForm(form, formItmes, title);
        form.getForm().reset();
        var newModel  = Ext.ModelManager.create({}, model );
        form.getForm().loadRecord(newModel);
        this.win.show();
    },

    onEdit:function(form, formItmes, model, title){
        this.setForm(form, formItmes, title);
        this.rolesGrid.getSelectionModel().select(0);
        var s = this.rolesGrid.getSelectionModel().getSelection();
        form.loadRecord(s[0]);
        this.win.show();
    },

    onSave:function(form, store){
        var record      = form.getRecord(),
            values      = form.getValues(),
            storeIndex  = store.indexOf(record);
        if (storeIndex == -1){
            store.add(values);
        }else{
            record.set(values);
        }
        store.proxy.extraParams = {task:this.currTask};
        store.sync();
        if(this.currTask == 'role'){
            this.loadRoles();
        }
        this.win.close();
        this.loadGrid();
    },

    onDeleteRole:function(){
        Ext.Msg.show({
            title   : 'Please confirm...',
            icon    : Ext.MessageBox.QUESTION,
            msg     : 'Are you sure to delete this?',
            buttons : Ext.Msg.YESNO,
            scope   : this,
            fn:function(btn){
                if(btn=='yes'){
                    this.rowEditing.cancelEdit();
                    this.rolesGrid.getSelectionModel().select(0);
                    var s = this.rolesGrid.getSelectionModel().getSelection();
                    this.permStore.proxy.extraParams = {task:this.currTask};
                    this.permStore.remove(s[0],{});
                    this.permStore.destroy();
                    this.loadRoles();
                    this.currRole = null;
                    this.loadGrid();
                }
            }
        });
    },

    onDeletePerm:function(){
        Ext.Msg.show({
            title   : 'Please confirm...',
            icon    : Ext.MessageBox.QUESTION,
            msg     : 'Are you sure to delete this?',
            buttons : Ext.Msg.YESNO,
            scope   : this,
            fn:function(btn){
                if(btn=='yes'){
                    this.rowEditing.cancelEdit();
                    var s = this.rolesGrid.getSelectionModel().getSelection();
                    this.permStore.proxy.extraParams = {task:this.currTask};
                    this.permStore.remove(s[0],{});
                    this.permStore.destroy();
                    this.rolesGrid.getSelectionModel().deselectAll();
                }
            }
        });
    },

    onItemclick:function(){
        var delPerm = this.rolesGrid.down('toolbar').getComponent('deletePerm');
        this.currTask = 'perm';
        delPerm.enable();
    },

    onSelect:function(combo, record){
        this.currRole = record[0].data.id;
        this.loadGrid();
    },

    onExpand:function(){
        var combo = this.rolesGrid.down('toolbar').getComponent('roleCombo');
        combo.picker.loadMask.destroy();
    },

    setForm:function(form, formItmes, title){
        var win = form.up('window');
        form.removeAll();
        form.add(formItmes);
        win.setTitle(title);
        win.doLayout();
    },

    action:function(action) {
        var win = this.win,
            form = win.down('form');
        if (action == 'close') {
            form.getForm().reset();
        }
    },

    loadRoles:function(){
        var combo = this.rolesGrid.down('toolbar').getComponent('roleCombo'),
        store = combo.getStore();
        store.load();
    },

    loadGrid:function(){
        var combo = this.rolesGrid.down('toolbar').getComponent('roleCombo'),
        store = combo.getStore();
        if(this.currRole === null){
            this.currRole = store.getAt(0).data.id;
            combo.setValue(this.currRole);
        }
        this.permStore.load({params:{role_id: this.currRole}});
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
}); // end roles class