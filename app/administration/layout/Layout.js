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
        me.currField = null;

        // *************************************************************************************
        // Form Fileds TreeGrid Store
        // *************************************************************************************
        Ext.define('layoutTreeModel', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'id',			    type: 'string'},
                {name: 'text', 			    type: 'string'},
                {name: 'pos', 			    type: 'string'},
                {name: 'xtype', 			type: 'string'},
                {name: 'form_id',			type: 'string'},
                {name: 'item_of',			type: 'string'},
                {name: 'title',			    type: 'string'},
                {name: 'fieldLabel',		type: 'string'},
                {name: 'emptyText',		    type: 'string'},
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
            clearOnLoad:true,
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
                name            : 'pos',
                xtype           : 'textfield',
                itemId          : 'pos',
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
                allowBlank      : false,
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
                hideTrigger:true,
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
                    fieldLabel      : 'Empty Text',
                    xtype           : 'textfield',
                    name            : 'emptyText',
                    itemId          : 'emptyText',
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
                    fieldLabel      : 'Is Required',
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
            width		: 390,
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
                    text    : 'New',
                    iconCls : 'icoAddRecord',
                    scope   : me,
                    handler : me.onFormReset
                },'-',{
                    text    : 'Add Child',
                    iconCls : 'icoAddRecord',
                    itemId  : 'addChild',
                    disabled: true,
                    scope   : me,
                    handler : me.onAddChild
                },'-',{
                    text    : 'Delete',
                    iconCls : 'delete',
                    cls     : 'toolDelete',
                    scope   : me,
                    handler : me.onDelete
                },'-',{
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
        /**
         * This is the fields associated with the current Form seleted
         */
        me.fieldsGrid = Ext.create('Ext.tree.Panel', {
            store	    : me.treeStore,
            region	    : 'center',
            margin      : '0 2 2 2',
            border	    : true,
            frame	    : true,
            sortable    : false,
            rootVisible : false,
            title	    : 'Field editor (Demographics)',
            viewConfig: {
                plugins   : { ptype: 'treeviewdragdrop', allowParentInsert:true },

                listeners : {
                    scope : me,
                    drop  : me.onDragDrop
                }
            },
            columns:[{
                text:'id',
                dataIndex:'id',
                width:30
            },{
                text:'pos',
                dataIndex:'pos',
                width:40
            },{
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
                flex		: 1,
                align		: 'left'
            }],
            listeners: {
                scope: me,
                itemclick: me.onFieldsGridClick
            }
        });

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
                dataIndex   : 'id',
                hidden      : true
            },{
                flex        : 1,
                sortable    : true,
                dataIndex   : 'name'
            }],
            listeners: {
                scope     : me,
                itemclick : me.onFormGriditemClick
            }
        });

        me.fromPreview = Ext.create('Ext.panel.Panel',{
            //title           : '',
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
            tools: [{
                itemId  : 'refresh',
                type    : 'refresh',
                scope   : me,
                handler : me.previewFormRender
            }]
        });

        me.pageBody = [ me.fieldsGrid, me.formsGrid ,me.formContainer,me.fromPreview];
        me.callParent(arguments);
    },
    /**
     * if the form is valid send the POST request
     */
    onSave:function(){
        var form = this.fieldForm.getForm();

        if (form.isValid()) {
            form.submit({
                submitEmptyText:false,
                scope   : this,
                success : function() {
                    this.loadFieldsGrid();
                    this.previewFormRender();
                }
            });
        }
    },
    /**
     * TODO: check database is field has database... if YES... cant delete!
     */
    onDelete:function(){
        Ext.Msg.show({
            title   : 'Please confirm...',
            icon    : Ext.MessageBox.QUESTION,
            msg     : 'Are you sure to delete this field?',
            buttons : Ext.Msg.YESNO,
            scope   : this,
            fn:function(btn){
                if(btn=='yes'){
                    Ext.Ajax.request({
                        scope:this,
                        url: 'app/administration/layout/data.php',
                        params: {
                            id  : this.currField,
                            task: 'deleteRequest'
                        },
                        success: function(){
                            Ext.topAlert.msg('Delete!', 'Field deleted');
                            this.currField = null;
                            this.loadFieldsGrid();
                            this.previewFormRender();
                        }
                    });
                }
            }
        });
    },
    /**
     *
     * @param node
     * @param data
     * @param overModel
     * @param dropPosition
     */
    onDragDrop:function(node,data,overModel){
        var childItems = [];
        Ext.each(overModel.parentNode.childNodes, function(childItem){
            childItems.push(childItem.data.id);
        });

        Ext.Ajax.request({
            scope : this,
            url   : 'app/administration/layout/data.php',
            params:{
                task: 'sortRequest',
                item: Ext.JSON.encode({
                    id               : data.records[0].data.id,
                    parentNode       : overModel.parentNode.data.id,
                    parentNodeChilds : childItems
                })

            },
            success: function(){

            }
        });
        //console.log(data.records[0].data.id);           //this id
        //console.log(overModel.parentNode.data.id);      //parent id
        //console.log(overModel.parentNode.childNodes);   //child nodes
        //console.log(overModel);
        //console.log(dropPosition);
    },
    /**
     * This is to reset the Form and load
     * a new Model with the currFormm id
     */
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
    /**
     *
     * load a new model with the form_id and item_of values.
     * This is the easy way to add a child to a fieldset or fieldcontainer.
     */
    onAddChild:function(){
        var form = this.fieldForm.getForm(),
        row = this.fieldsGrid.getSelectionModel();
        row.deselectAll();
        form.reset();
        var model = Ext.ModelManager.getModel('layoutTreeModel'),
        newModel  = Ext.ModelManager.create({
            form_id  : this.currForm,
            item_of  : this.currField
        }, model );
        form.loadRecord(newModel);
    },
    /**
     *
     * This will load the current field data to the form,
     * set the currField, and enable the Add Child btn if
     * the field allows child itmes (fieldset or fieldcontainer)
     * 
     * @param grid
     * @param record
     */
    onFieldsGridClick:function(grid, record){
        var form = this.fieldForm.getForm();
        form.loadRecord(record);
        this.currField = record.data.id;
        if(record.data.xtype == 'fieldset' || record.data.xtype == 'fieldcontainer'){
            this.formContainer.down('toolbar').getComponent('addChild').enable();
        }else{
            this.formContainer.down('toolbar').getComponent('addChild').disable();
        }
    },
    /**
     *
     * @param DataView
     * @param record
     */
    onFormGriditemClick:function(DataView, record){
        this.currForm = record.get('id');
        this.fieldsGrid.setTitle('Field editor ('+record.get('name')+')');
        this.loadFieldsGrid();

    },
    /**
     *
     * This will load the Select List options. This Combobox shows only when
     * a Type of Comboboc is selected
     *
     * @param combo
     * @param record
     */
    onSelectListSelect:function(combo, record){
        var option_id = record[0].data.option_id;
        this.selectListoptionsStore.load({params:{list_id: option_id}});
    },
    /**
     *
     * This is to handle a error when loading a combobox store.
     * 
     * @param combo
     */
    onParentFieldsExpand:function(combo){
        combo.picker.loadMask.destroy();
    },
    /**
     *
     * onXtypeChange will search the combo value and enable/disable
     * the fields appropriate for the xtype selected
     *
     * @param combo
     * @param value
     */
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
        /**
         * 
         * @param searchStr
         */
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

        /**
         *
         * @param itmes
         */
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
            ];
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
                'emptyText',
                'fieldLabel',
                'hideLabel',
                'labelWidth',
                'margin'
            ];

        } else if (value == 'textfield') {
            items = [
                'name',
                'width',
                'emptyText',
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
                'emptyText',
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
                'width',
                'fieldLabel',
                'labelWidth',
                'hideLabel',
                'margin'
            ];


        }
        enableItems(items);
    },
    /**
     *
     * On toggle down/true expand the preview panel and re-render the form
     *
     * @param btn
     * @param toggle
     */
    onFormPreview:function(btn,toggle){
        if(toggle === true){
            this.previewFormRender();
            this.fromPreview.expand(false);
        }else{
            this.fromPreview.collapse(false);
        }
    },
    /**
     *
     *  this function re-render the preview form
     */
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
    /**
     *
     *  re-load the fields grid (main TreeGrid)
     *  check if a form is selected, if not the select the first choice
     *  save the form id inside this.currForm and load the grid and the
     *  parent filds of this form.
     *
     *  parentFieldsStore is use to create the child of select list
     */
    loadFieldsGrid:function(){
        var row = this.formsGrid.getSelectionModel();
        if(this.currForm === null){
            row.select(0);
        }
        this.currForm = row.getLastSelected().data.id;
        /**
         *
         * this.treeStore.setRootNode() is to manage a sencha bug
         * that removes the treeNotes when you load() the store.
         *
         */
        this.treeStore.setRootNode();
        this.treeStore.load({params:{currForm: this.currForm }});
        this.parentFieldsStore.load({params:{currForm: this.currForm }});
    },
    /**
     *
     * This function si called when the Navigation menu is click
     */
    loadStores:function(){
        this.loadFieldsGrid();
    }
});