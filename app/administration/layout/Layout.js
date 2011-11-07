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
Ext.define('Ext.mitos.panel.administration.layout.Layout',{
    extend      : 'Ext.mitos.RenderPanel',
    id          : 'panelLayout',
    pageTitle   : 'Layout Form Editor',
    pageLayout  : 'border',
    uses        : [
        'Ext.mitos.CRUDStore',
        'Ext.mitos.restStoreModel',
        'Ext.mitos.GridPanel',
        'Ext.mitos.window.Window'
    ],
    initComponent: function(){
        
        var me = this;
        me.currForm = null;

        // *************************************************************************************
        // Form Fileds TreeGrid Store
        // *************************************************************************************
        Ext.define('layoutModel', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'id',			    type: 'int'},
                {name: 'text', 			    type: 'string'},
                {name: 'xtype', 			type: 'string'},
                {name: 'form_id',			type: 'string'},
                {name: 'item_of',			type: 'string'},
                {name: 'title',			    type: 'string'},
                {name: 'fieldLabel',		type: 'string'},
                {name: 'name',		        type: 'string'}
            ]
        });

        me.fieldsStore = Ext.create('Ext.data.TreeStore', {
            model: 'layoutModel',
            proxy: {
                type: 'rest',
                url	: 'app/administration/layout/data.php'
            },
            folderSort: true
        });

        // *************************************************************************************
        // Xtype Combobox
        // *************************************************************************************
        me.fieldXTypesStore = Ext.create('Ext.mitos.CRUDStore',{
            fields: [
                {name: 'id',		type: 'string'},
                {name: 'name',	    type: 'string'},
                {name: 'value',	    type: 'string'}
            ],
            model 		:'field_typesModel',
            idProperty 	:'id',
            read		: 'app/administration/layout/component_data.ejs.php',
            extraParams	: {"task": "field_types"}
        });

        // *************************************************************************************
        // Select List (Comboboxes) Options...
        // *************************************************************************************
        me.selectListStore = Ext.create('Ext.mitos.CRUDStore',{
            fields: [
                {name: 'id',		type: 'string'},
                {name: 'form_id',	type: 'string'}
            ],
            model 		:'formlistModel',
            idProperty 	:'id',
            read		: 'app/administration/layout/component_data.ejs.php',
            extraParams	: {"task": "form_list"}
        });

        me.selectListoptionsStore = Ext.create('Ext.mitos.restStoreModel',{
            fields: [
                {name: 'id',		    type: 'string'},
                {name: 'list_id',		type: 'string'},
                {name: 'option_id',		type: 'string'},
                {name: 'title',	        type: 'string'}
            ],
            model 		: 'formlistoptionsModel',
            idProperty 	: 'id',
            url	        : 'app/administration/layout/data.php',
            extraParams	: {task: "options"}
        });
        // *************************************************************************************
        // List Options Grid
        // *************************************************************************************
        me.selectListGrid = Ext.create('Ext.grid.Panel', {
            store		    : me.selectListoptionsStore,
            region		    : 'south',
            frame		    : true,
            collapseMode    : 'mini',
            split           : true,
            hideCollapseTool: true,
            width		    : 250,
            height          : 250,
            collapsible	    : true,
            collapsed       : true,
            columns:[{
                text        : 'Name',
                flex        : 1,
                sortable    : true,
                dataIndex   : 'title'
            },{
                text        : 'Value',
                flex        : 1,
                sortable    : true,
                dataIndex   : 'option_id'
            }],
            dockedItems: [{
                xtype  : 'toolbar',
                items  : [{
                    xtype	    : 'mitos.listscombo',
                    name		: 'cmbList',
                    itemId      : 'cmbList',
                    width       : 235,
                    listeners:{
                        scope   : this,
                        select  : me.onSelectListSelect
                    }
                }]
            }]
        });


        // *************************************************************************************
        // User form
        // *************************************************************************************
        me.fieldForm = Ext.create('Ext.mitos.form.FormPanel', {
            region          : 'center',
            frameHeader     : true,
            autoScroll      : true,
            frame:true,
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
                        //var q = this.getValue();
                        //var f = me.fieldForm.getComponent('aditionalProperties').getComponent('name');
                        //f.setValue(q.toLowerCase().replace(" ","_"));

                    }
                }
            },{
                fieldLabel      : 'Type',
                xtype           : 'combo',
                name            : 'xtype',
                displayField	: 'name',
                valueField		: 'value',
                editable		: false,
                store			: me.fieldXTypesStore,
                queryMode		: 'local',
                margin          : '5px 5px 5px 10px',
                itemId          : 'xtype',
                listeners       : {
                    select: function(combo, record) {
                        var type = record[0].data.value;

                        if (type == 'combobox') {
                            me.selectListGrid.setTitle('Select List Options');
                            me.selectListGrid.expand();
                            me.selectListGrid.enable();
                        } else {
                            me.selectListGrid.collapse();
                            me.selectListGrid.disable();
                        }

                        Array.prototype.find = function(searchStr) {
                            var returnArray = false;
                            for (var i = 0; i < this.length; i++) {
                                if (typeof(searchStr) == 'function') {
                                    if (searchStr.test(this[i])) {
                                        if (!returnArray) {
                                            returnArray = [];
                                        }
                                        returnArray.push(i);
                                    }
                                } else {
                                    if (this[i] === searchStr) {
                                        if (!returnArray) {
                                            returnArray = [];
                                        }
                                        returnArray.push(i);
                                    }
                                }
                            }
                            return returnArray;
                        };

                        var addProp = me.fieldForm.getComponent('aditionalProperties');
                        var is = addProp.items.keys;

                        function enableItems(itmes) {
                            for (var i = 0; i < is.length; i++) {
                                if (!itmes.find(is[i])) {
                                    addProp.getComponent(is[i]).hide();
                                } else {
                                    addProp.getComponent(is[i]).show();
                                }

                            }
                        }

                        if (type == 'combobox') {
                            enableItems(['name','width','allowBlank']);
                        } else if (type == 'fieldset') {
                            enableItems(['']);
                        } else if (type == 'fieldcontainer') {
                            enableItems(['']);
                        } else if (type == 'textfield') {
                            enableItems(['name','allowBlank']);
                        } else if (type == 'textarea') {
                            enableItems(['name','allowBlank']);
                        } else if (type == 'mitos.checkbox') {
                            enableItems(['name','allowBlank']);
                        } else {
                            enableItems(['name','allowBlank']);
                        }
                    }
                }
            },{
                //fieldLabel      : 'Child Of',
                //xtype			: 'combo',
                //name			: 'where',
                //displayField	: 'xtype',
                //valueField		: 'id',
                //editable		: false,
                //store			: me.fieldsStore,
                //queryMode		: 'local',
                //margin          : '5px 5px 5px 10px',
                //itemId		    : 'combo'
            },{
                xtype    : 'fieldset',
                itemId   : 'aditionalProperties',
                title    : 'Aditional Properties',
                defaults : { anchor:'100%' },
                items:[{
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


        me.formContainer = Ext.create('Ext.panel.Panel',{
            border		: true,
            frame		: true,
            margin      : '0 0 2 0',
            title		: 'Field Configuration',
            width		: 350,
            region      : 'east',
            layout      : 'border',
            items       : [ me.fieldForm, me.selectListGrid ],
            dockedItems : [{
                xtype   : 'toolbar',
                items   : [{
                    text    : 'Save',
                    iconCls : 'save'
                },'-',{
                    text    : 'Reset/New',
                    iconCls : 'icoAddRecord'
                },'-',{
                    text    : 'Delete',
                    iconCls : 'delete',
                    cls     : 'toolDelete'
                }]
                
            }]
        });
        // *************************************************************************************
        // Layout fields Grid Panel
        // *************************************************************************************
        me.fieldsGrid = Ext.create('Ext.tree.Panel', {
            store	    : me.fieldsStore,
            region	    : 'center',
            margin      : '0 2 2 2',
            border	    : true,
            frame	    : true,
            sortable    : false,
            rootVisible : false,
            title	    : 'Field editor (Demographics)',
            columns:[{
                xtype       : 'treecolumn',
                text     	: 'Field Type',
                sortable 	: false,
                dataIndex	: 'xtype',
                width		: 200,
                align		: 'left'
            },{
                text     	: 'Title',
                sortable 	: false,
                dataIndex	: 'title',
                width		: 100,
                align		: 'left'
            },{
                text     	: 'Label',
                sortable 	: false,
                dataIndex	: 'fieldLabel',
                width		: 100,
                align		: 'left'
            },{
                text     	: 'name',
                sortable 	: false,
                dataIndex	: 'name',
                flex		: 1,
                align		: 'left'
            }],
            listeners: {
                //itemclick: {
                    //fn: function(DataView, record, item, rowIndex, e){
                    //		me.rowEditing.cancelEdit();
                    //	currRec = me.fieldsStore.getAt(rowIndex);
                    //	rowPos = rowIndex;
                    //	me.cmdDelete.enable();
                    //}
                //}
            }
        }); // END LayoutGrid Grid

        // *************************************************************************************
        // Panel to choose Layouts
        // *************************************************************************************
        me.formsGrid = Ext.create('Ext.grid.Panel', {
            store		: me.selectListStore,
            region		: 'west',
            border		: true,
            frame		: true,
            margin      : '0 0 2 0',
            title		: 'Form list',
            width		: 200,
            columns		: [{
                text        : 'Name',
                flex        : 1,
                sortable    : true,
                dataIndex   : 'form_id'
            }],
            listeners: {
                scope     : this,
                itemclick : me.onFormGriditemClick
            }
        }); // END LayoutChoose

        me.fromPreview = Ext.create('Ext.panel.Panel',{
            title           : 'Form Preview',
            region          : 'south',
            height          : 300,
            collapsible     : true,
            titleCollapse   : true,
            collapsed       : true,
            collapseMode    : 'header',
            itmes:[{

            }]
        });



        me.pageBody = [ me.fieldsGrid, me.formsGrid ,me.formContainer,me.fromPreview];
        me.callParent(arguments);
    },

    onFormGriditemClick:function(DataView, record){
        this.currForm = record.get('form_id');
        this.fieldsGrid.setTitle('Field editor ('+this.currForm+')');
        this.loadFieldsGrid();
    },

    onSelectListSelect:function(combo, record){
        var option_id = record[0].data.option_id;
        console.log(record[0].data);
        this.selectListoptionsStore.load({params:{list_id: option_id}});

    },

    loadFieldsGrid:function(){
        var sm = this.formsGrid.getSelectionModel();
        if(this.currForm === null){
            sm.select(0);
        }
        var form_id = sm.getSelection()[0].data.form_id;
        this.currForm = form_id;
        this.fieldsStore.load({params:{currForm: form_id }});
    },

    loadStores:function(){
        this.loadFieldsGrid();
        
    }
}); //ens LayoutPanel class