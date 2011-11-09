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
        Ext.define('layoutTreeModel', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'id',			    type: 'string'},
                {name: 'fid',			    type: 'string'},
                {name: 'text', 			    type: 'string'},
                {name: 'xtype', 			type: 'string'},
                {name: 'form_id',			type: 'string'},
                {name: 'item_of',			type: 'string'},
                {name: 'title',			    type: 'string'},
                {name: 'fieldLabel',		type: 'string'},
                {name: 'labelWidth',		type: 'string'},
                {name: 'hideLabel',		    type: 'string'},
                {name: 'layout',		    type: 'string'},
                {name: 'width',		        type: 'string'},
                {name: 'height',		    type: 'string'},
                {name: 'margin',		    type: 'string'},
                {name: 'flex',		        type: 'string'},
                {name: 'collapsible',		type: 'string'},
                {name: 'checkboxToggle',	type: 'string'},
                {name: 'collapsed',		    type: 'string'},
                {name: 'inputValue',		type: 'string'},
                {name: 'allowBlank',		type: 'string'},
                {name: 'value',		        type: 'string'},
                {name: 'maxValue',		    type: 'string'},
                {name: 'minValue',		    type: 'string'},
                {name: 'boxLabel',		    type: 'string'},
                {name: 'grow',		        type: 'string'},
                {name: 'increment',		    type: 'string'},
                {name: 'name',		        type: 'string'}
            ],
            idProperty: 'id'
        });
        
        me.treeStore = Ext.create('Ext.data.TreeStore', {
            model: 'layoutTreeModel',
            proxy: {
                type: 'rest',
                url	: 'app/administration/layout/data.php',
                extraParams	: { task: "treeRequest" }
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
                {name: 'name',	    type: 'string'}
            ],
            model 		:'formlistModel',
            idProperty 	:'id',
            read		: 'app/administration/layout/component_data.ejs.php',
            extraParams	: {"task": "form_list"}
        });


        // *************************************************************************************
        // Field available on this form as parent items (fieldset / fieldcontainer )
        // *************************************************************************************
        me.parentFieldsStore = Ext.create('Ext.mitos.CRUDStore',{
            fields: [
                {name: 'name',		type: 'string'},
                {name: 'value',	    type: 'string'}
            ],
            model 		:'parentFieldsModel',
            idProperty 	:'value',
            read		: 'app/administration/layout/component_data.ejs.php',
            extraParams	: { task: "parent_fields" }
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
            extraParams	: {task: "optionsRequest"}
        });
        // *************************************************************************************
        // List Options Grid
        // *************************************************************************************
        me.selectListGrid = Ext.create('Ext.grid.Panel', {
            store		    : me.selectListoptionsStore,
            region		    : 'south',
            frame		    : false,
            collapseMode    : 'mini',
            split           : true,
            border           : true,
            titleCollapse   : false,
            hideCollapseTool: true,
            width		    : 250,
            height          : 250,
            collapsible	    : true,
            collapsed       : true,
            columns:[{
                text        : 'Name',
                flex        : 1,
                sortable    : false,
                dataIndex   : 'title'
            },{
                text        : 'Value',
                flex        : 1,
                sortable    : false,
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
            url	            : 'app/administration/layout/data.php?task=formRequest',
            border          : true,
            autoScroll      : true,
            frame           : false,
            fieldDefaults   : { msgTarget: 'side', labelWidth: 100 },
            defaults        : { anchor:'100%' },
            items: [{
                name            : 'id',
                xtype           : 'textfield',
                itemId          : 'id',
                hidden          : true
            },{
                name            : 'form_id',
                xtype           : 'textfield',
                itemId          : 'form_id',
                hidden          : true
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
                    scope   : me,
                    change  : me.onXtypeChange
                }
            },{
                fieldLabel      : 'Child Of',
                xtype			: 'combo',
                name			: 'item_of',
                displayField	: 'name',
                valueField	    : 'value',
                editable		: false,
                store			: me.parentFieldsStore,
                queryMode		: 'local',
                margin          : '5px 5px 5px 10px',
                emptyText       : 'None',
                itemId		    : 'parentFields',
                listeners:{
                    scope: me,
                    expand   : me.onParentFieldsExpand
                }
            },{
                xtype    : 'fieldset',
                itemId   : 'aditionalProperties',
                title    : 'Aditional Properties',
                defaults : { anchor:'100%' },
                items:[{
                    fieldLabel      : 'Title',
                    xtype           : 'textfield',
                    name            : 'title',
                    itemId          : 'title',
                    allowBlank      : false,
                    hidden          : true
                },{
                    fieldLabel      : 'Field Label',
                    xtype           : 'textfield',
                    name            : 'fieldLabel',
                    itemId          : 'fieldLabel',
                    allowBlank      : false,
                    hidden          : true
                },{
                    fieldLabel      : 'Label Width',
                    xtype           : 'textfield',
                    name            : 'labelWidth',
                    itemId          : 'labelWidth',
                    hidden          : true
                },{
                    fieldLabel      : 'Hide Label',
                    xtype           : 'checkbox',
                    name            : 'hideLabel',
                    itemId          : 'hideLabel',
                    hidden          : true
                },{
                    fieldLabel      : 'Layout',
                    xtype           : 'textfield',
                    name            : 'layout',
                    itemId          : 'layout',
                    hidden          : true
                },{
                    fieldLabel      : 'Name',
                    xtype           : 'textfield',
                    name            : 'name',
                    itemId          : 'name',
                    allowBlank      : false,
                    hidden          : true
                },{
                    fieldLabel      : 'Width',
                    xtype           : 'textfield',
                    name            : 'width',
                    itemId          : 'width',
                    emptyText       : 'ei. 5 for 5px',
                    hidden          : true
                },{
                    fieldLabel      : 'Height',
                    xtype           : 'textfield',
                    name            : 'height',
                    itemId          : 'height',
                    emptyText       : 'ei. 5 for 5px',
                    hidden          : true
                },{
                    fieldLabel      : 'Flex',
                    xtype           : 'checkbox',
                    name            : 'flex',
                    itemId          : 'flex',
                    hidden          : true
                },{
                    fieldLabel      : 'Collapsible',
                    xtype           : 'checkbox',
                    name            : 'collapsible',
                    itemId          : 'collapsible',
                    hidden          : true
                },{
                    fieldLabel      : 'Checkbox Toggle',
                    xtype           : 'checkbox',
                    name            : 'checkboxToggle',
                    itemId          : 'checkboxToggle',
                    hidden          : true
                },{
                    fieldLabel      : 'Collapsed',
                    xtype           : 'checkbox',
                    name            : 'collapsed',
                    itemId          : 'collapsed',
                    hidden          : true
                },{
                    fieldLabel      : 'Margin',
                    xtype           : 'textfield',
                    name            : 'margin',
                    itemId          : 'margin',
                    emptyText       : 'ei. 5 5 5 5',
                    hidden          : true
                },{
                    fieldLabel      : 'Input Value',
                    xtype           : 'textfield',
                    name            : 'inputValue',
                    itemId          : 'inputValue',
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
            bodyStyle   : 'background-color:#eeeeee!important',
            items       : [ me.fieldForm, me.selectListGrid ],
            dockedItems : [{
                xtype   : 'toolbar',
                items   : [{
                    text    : 'Save',
                    iconCls : 'save',
                    scope   : me,
                    handler : me.onSave
                },'-',{
                    text    : 'New / Reset',
                    iconCls : 'icoAddRecord',
                    scope   : me,
                    handler : me.onFormReset
                },'-',{
                    text    : 'Delete',
                    iconCls : 'delete',
                    cls     : 'toolDelete'
                },'-','->',{
                    text    : 'Form Preview',
                    iconCls : 'icoPreview',
                    enableToggle : true,
                    listeners:{
                        scope   : me,
                        toggle  : me.onFormPreview
                    }
                }]
                
            }]
        });
        // *************************************************************************************
        // This is the fields associated with the current Form seleted
        // *************************************************************************************
        me.fieldsGrid = Ext.create('Ext.tree.Panel', {
            store	    : me.treeStore,
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
                scope: me,
                itemclick: me.onFieldsGridClick
            }
        }); // END LayoutGrid Grid

        // *************************************************************************************
        // This Grif dispay the forms throughout the patient file
        // *************************************************************************************
        me.formsGrid = Ext.create('Ext.grid.Panel', {
            store		: me.selectListStore,
            region		: 'west',
            border		: true,
            frame		: true,
            margin      : '0 0 2 0',
            title		: 'Form list',
            width		: 200,
            hideHeaders:true,
            columns		: [{
                flex        : 1,
                sortable    : true,
                dataIndex   : 'name'
            }],
            listeners: {
                scope     : this,
                itemclick : me.onFormGriditemClick
            }
        }); // END LayoutChoose

        me.fromPreview = Ext.create('Ext.panel.Panel',{
            //title           : 'Form Preview',
            region          : 'south',
            height          : 300,
            collapsible     : true,
            titleCollapse   : false,
            hideCollapseTool: true,
            collapsed       : true,
            border		    : true,
            frame		    : true,
            collapseMode    : 'header',
            bodyStyle       : 'padding: 5px',
            layout          : 'anchor',
            fieldDefaults   : {msgTarget:'side'},
            dockedItems:{
                xtype:'toolbar',
                items:['->',{
                    text    : 'Reload Form',
                    cls     : 'toolGreen',
                    iconCls : 'icoReload',
                    scope   : me,
                    handler : me.previewFormRender
                }]
            }
        });

        me.pageBody = [ me.fieldsGrid, me.formsGrid ,me.formContainer,me.fromPreview];
        me.callParent(arguments);
    },

    onSave:function(){
        var form = this.fieldForm.getForm();

        if (form.isValid()) {
            form.submit({
                submitEmptyText:false,
                scope   : this,
                success : function() {
                    form.reset();
                    this.loadFieldsGrid();
                }
            });
        }
    },

    onFormReset:function(){
        var form = this.fieldForm.getForm(),
        row = this.fieldsGrid.getSelectionModel();
        row.deselectAll();
        form.reset();
        var model = Ext.ModelManager.getModel('layoutTreeModel'),
        newModel  = Ext.ModelManager.create({
            form_id  : this.currForm
        }, model );
        form.loadRecord(newModel);
    },

    onFieldsGridClick:function(grid, record){
        var form = this.fieldForm.getForm();
        form.loadRecord(record);
    },

    onFormGriditemClick:function(DataView, record){
        this.currForm = record.get('id');
        this.fieldsGrid.setTitle('Field editor ('+record.get('name')+')');
        this.loadFieldsGrid();
    },

    onSelectListSelect:function(combo, record){
        var option_id = record[0].data.option_id;
        this.selectListoptionsStore.load({params:{list_id: option_id}});

    },

    onParentFieldsExpand:function(combo){
        combo.picker.loadMask.destroy();
    },

    onXtypeChange:function(combo, value){
        if (value == 'combobox') {
            this.selectListGrid.setTitle('Select List Options');
            this.selectListGrid.expand();
            this.selectListGrid.enable();
        } else {
            this.selectListGrid.setTitle('');
            this.selectListGrid.collapse();
            this.selectListGrid.disable();
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

        var addProp = this.fieldForm.getComponent('aditionalProperties');
        var is = addProp.items.keys;

        function enableItems(itmes) {
            for (var i = 0; i < is.length; i++) {
                if (!itmes.find(is[i])) {
                    addProp.getComponent(is[i]).hide();
                    addProp.getComponent(is[i]).disable();
                } else {
                    addProp.getComponent(is[i]).show();
                    addProp.getComponent(is[i]).enable();
                }

            }
        }
        var items;
        if(value == 'fieldset'){
            items = [
                'title',
                'collapsible',
                'collapsed',
                'checkboxToggle',
                'margin'
            ]
        } else if (value == 'fieldcontainer') {
            items = [
                'fieldLabel',
                'labelWidth',
                'hideLabel',
                'layout',
                'margin'
            ];

        } else if (value == 'combobox' || value == 'mitos.checkbox') {
            items = [
                'name',
                'width',
                'fieldLabel',
                'hideLabel',
                'labelWidth',
                'margin'
            ];

        } else if (value == 'textfield') {
            items = [
                'name',
                'width',
                'fieldLabel',
                'hideLabel',
                'labelWidth',
                'allowBlank',
                'margin'
            ];


        } else if (value == 'textarea') {
            items = [
                'name',
                'width',
                'height',
                'fieldLabel',
                'hideLabel',
                'labelWidth',
                'allowBlank',
                'grow',
                'margin'
            ];

        } else if (value == 'numberfield') {
            items = [
                'name',
                'width',
                'value',
                'maxValue',
                'minValue',
                'increment',
                'fieldLabel',
                'labelWidth',
                'hideLabel',
                'margin'
            ];

        } else {
            items =[
                'name',
                'fieldLabel',
                'labelWidth',
                'hideLabel',
                'margin'
            ];


        }
        enableItems(items);
    },

    onFormPreview:function(btn,toggle){
        var form = this.fromPreview;
        if(toggle === true){
            this.previewFormRender();
            this.fromPreview.expand(false);
        }else{
            this.fromPreview.collapse(false);
        }
    },

    previewFormRender:function(){
        var form = this.fromPreview;
        form.el.mask();
        form.removeAll();
        Ext.Ajax.request({
            url     : 'lib/layoutEngine/layoutEngine.class.php',
            params  : { form:this.currForm },
            success : function(response){
                form.add(eval(response.responseText));
                form.doLayout();
                form.el.unmask();
            }
        });

    },

    loadFieldsGrid:function(){
        var row = this.formsGrid.getSelectionModel();
        if(this.currForm === null){
            row.select(0);
        }
        this.currForm = row.getSelection()[0].data.id;
        this.treeStore.load({params:{currForm: this.currForm }});
        this.parentFieldsStore.load({params:{currForm: this.currForm }})
        this.onFormReset();
    },

    loadStores:function(){
        this.loadFieldsGrid();
        
    }
}); //ens LayoutPanel class