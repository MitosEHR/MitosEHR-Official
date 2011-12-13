//******************************************************************************
// layout.ejs.php
// Description: Layout Screen Panel
// v0.0.1
//
// Author: GI Technologies, 2011
// Modified: n/a
//
// MitosEHR (Electronic Health Records) 2011
//******************************************************************************
Ext.define('Ext.mitos.panel.administration.layout.Layout',{
    extend      : 'Ext.mitos.RenderPanel',
    id          : 'panelLayout',
    pageTitle   : 'Layout Form Editor',
    pageLayout  : 'border',
    uses        : [
        'Ext.mitos.restStoreModel',
        'Ext.mitos.GridPanel'
    ],
    initComponent: function(){
        
        var me = this;
        me.currForm = null;
        me.currField = null;

        // *************************************************************************************
        // Form Fields TreeGrid Store
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
                {name: 'name',		        type: 'string'},
                {name: 'list_id',		    type: 'string'}
            ],
            idProperty: 'id'
        });
        /**
         * form fields list (center grid)
         */
        me.fieldsGridStore = Ext.create('Ext.data.TreeStore', {
            model       : 'layoutTreeModel',
            clearOnLoad : true,
            proxy:{
                type        : 'rest',
                url	        : 'app/administration/layout/data.php',
                extraParams	: { task: "treeRequest" }
            },
            folderSort: true
        });
        /**
         * Xtype Combobox store
         */
        me.fieldXTypesStore = Ext.create('Ext.mitos.restStoreModel',{
            fields: [
                {name: 'id',		type: 'string'},
                {name: 'name',	    type: 'string'},
                {name: 'value',	    type: 'string'}
            ],
            model 		: 'field_typesModel',
            idProperty 	: 'id',
            url		    : 'app/administration/layout/component_data.ejs.php',
            autoLoad    : true,
            extraParams	: { task: 'field_types' }

        });

        /**
         * Forms grid store (left grid)
         */
        me.formsGridStore = Ext.create('Ext.mitos.restStoreModel',{
            fields: [
                {name: 'id',		type: 'string'},
                {name: 'name',	    type: 'string'}
            ],
            model 		: 'formlistModel',
            idProperty 	: 'id',
            url		    : 'app/administration/layout/component_data.ejs.php',
            autoLoad    : true,
            extraParams	: { task: 'form_list' }

        });

        /**
         * Field available on this form as parent items (fieldset / fieldcontainer )
         * use to get the "Child of" combobox data
         */
        me.parentFieldsStore = Ext.create('Ext.mitos.restStoreModel',{
            fields: [
                {name: 'name',		type: 'string'},
                {name: 'value',	    type: 'string'}
            ],
            model 		: 'parentFieldsModel',
            idProperty 	: 'value',
            url		    : 'app/administration/layout/component_data.ejs.php',
            autoLoad    : true,
            extraParams	: { task: 'parent_fields' }

        });
        /**
         * This are the select lists available to use for comboboxes
         * this lists can be created an modified at "Lists" administration panel.
         */
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
            extraParams	: { task: 'optionsRequest' }
        });
        /**
         * This grid only available if the field is a Combobox
         */
        me.selectListGrid = Ext.create('Ext.mitos.GridPanel', {
            store		    : me.selectListoptionsStore,
            region		    : 'south',
            collapseMode    : 'mini',
            width		    : 250,
            height          : 250,
            split           : true,
            border          : false,
            titleCollapse   : false,
            hideCollapseTool: true,
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
            }]
        });
        /**
         * form to create and modified the fields
         */
        me.fieldForm = Ext.create('Ext.mitos.form.FormPanel', {
            region          : 'center',
            url	            : 'app/administration/layout/data.php?task=formRequest',
            border          : false,
            autoScroll      : true,
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
                hideTrigger     : true,
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
                    fieldLabel      : 'Input Value',
                    xtype           : 'textfield',
                    name            : 'inputValue',
                    itemId          : 'inputValue',
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
                    fieldLabel      : 'Max Value',
                    xtype           : 'timefield',
                    name            : 'maxValue',
                    itemId          : 'timeMaxValue',
                    hidden          : true
                },{
                    fieldLabel      : 'Min Value',
                    xtype           : 'timefield',
                    name            : 'minValue',
                    itemId          : 'timeMinValue',
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
                },{
                    fieldLabel      : 'List Options',
                    xtype	        : 'mitos.listscombo',
                    name		    : 'list_id',
                    itemId          : 'list_id',
                    hidden          : true,
                    allowBlank      : false,
                    listeners:{
                        scope   : this,
                        change  : me.onSelectListSelect
                    }
                }]
            }]
        });
        /**
         * this container holds the form and the select list grid.
         * remember that the select list grid only shows if
         * the field xtype is a combobox
         */
        me.formContainer = Ext.create('Ext.panel.Panel',{
            title		: 'Field Configuration',
            border		: true,
            split		: true,
            width		: 390,
            region      : 'east',
            layout      : 'border',
            bodyStyle   : 'background-color:#fff!important',
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
         * This is the fields associated with the current Form selected
         */
        me.fieldsGrid = Ext.create('Ext.tree.Panel', {
            store	    : me.fieldsGridStore,
            region	    : 'center',
            border	    : true,
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
        /**
         * Form grid will show the available forms to modified.
         * the user will not have the options to create
         * forms, just to modified the fields of existing forms.
         */
        me.formsGrid = Ext.create('Ext.mitos.GridPanel', {
            title		: 'Form list',
            region		: 'west',
            store		: me.formsGridStore,
            width		: 200,
            border		: true,
            split       : true,
            hideHeaders : true,
            columns:[{
                dataIndex   : 'id',
                hidden      : true
            },{
                flex        : 1,
                sortable    : true,
                dataIndex   : 'name'
            }],
            listeners: {
                scope     : me,
                itemclick : me.onFormGridItemClick
            }
        });
        /**
         * this panel will render the current form to preview
         * all the changes done.
         */
        me.fromPreview = Ext.create('Ext.panel.Panel',{
            region          : 'south',
            height          : 300,
            collapsible     : true,
            titleCollapse   : false,
            hideCollapseTool: true,
            collapsed       : true,
            border		    : true,
            split           : true,
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

        me.pageBody = [ me.fieldsGrid, me.formsGrid ,me.formContainer, me.fromPreview ];
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
                },
                failure: function(form, action) {
                    Ext.Msg.alert('Opps!', action.result.errors.reason);
                }
            });
        }
    },
    /**
     * TODO: check database is field has database... if YES... cant delete!
     */
    onDelete:function(){
        var form = this.fieldForm.getForm(),
        rec = form.getRecord();

        Ext.Msg.show({
            title   : 'Please confirm...',
            icon    : Ext.MessageBox.QUESTION,
            msg     : 'Are you sure to delete this field?',
            buttons : Ext.Msg.YESNO,
            scope   : this,
            fn:function(btn){
                if (btn == 'yes') {
                    Ext.Ajax.request({
                        scope   : this,
                        url     : 'app/administration/layout/data.php',
                        params:{
                            id      : rec.data.id,
                            form_id : rec.data.form_id,
                            name    : rec.data.name,
                            xtype   : rec.data.xtype,
                            task    : 'deleteRequest'
                        },
                        success:function(callback){
                            var responseText = Ext.JSON.decode(callback.responseText);
                            if(responseText.success){
                                this.msg('Sweet!', 'Field deleted');
                                this.currField = null;
                                this.loadFieldsGrid();
                                this.previewFormRender();
                                this.onFormReset();
                            }else{
                                Ext.Msg.alert('Opps!', responseText.errors.reason);
                            }
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
     */
    onDragDrop:function(node,data,overModel){
        var childItems = [];
        Ext.each(overModel.parentNode.childNodes, function(childItem){
            childItems.push(childItem.data.id);
        });
        //noinspection JSUnusedGlobalSymbols
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
            success:function(callback){
                var responseText = Ext.JSON.decode(callback.responseText);
                if(responseText.success){
                    this.msg('Sweet!', 'Field Updated');
                    this.loadFieldsGrid();
                    this.previewFormRender();
                    this.onFormReset();
                }else{
                    Ext.Msg.alert('Opps!', responseText.errors.reason);
                }
            }
        });
    },
    /**
     * This is to reset the Form and load
     * a new Model with the currForm id
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
     * the field allows child items (fieldset or fieldcontainer)
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
    onFormGridItemClick:function(DataView, record){
        this.currForm = record.get('id');
        this.fieldsGrid.setTitle('Field editor ('+record.get('name')+')');
        this.loadFieldsGrid();
    },
    /**
     *
     * This will load the Select List options. This Combobox shows only when
     * a Type of Combobox is selected
     *
     * @param combo
     * @param value
     */
    onSelectListSelect:function(combo, value){
        this.selectListoptionsStore.load({params:{list_id: value}});
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
         * @param items
         */
        function enableItems(items) {
            for (var i = 0; i < is.length; i++) {
                if (!items.find(is[i])) {
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
        } else if (value == 'combobox') {
            items = [
                'name',
                'width',
                'emptyText',
                'fieldLabel',
                'hideLabel',
                'labelWidth',
                'margin',
                'list_id'
            ];
        } else if (value == 'mitos.checkbox') {
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
        } else if (value == 'timefield') {
            items = [
                'name',
                'width',
                'value',
                'timeMaxValue',
                'timeMinValue',
                'increment',
                'fieldLabel',
                'labelWidth',
                'hideLabel',
                'margin'
            ];
        } else if (value == 'radiofield') {
            items = [
                'name',
                'width',
                'fieldLabel',
                'labelWidth',
                'hideLabel',
                'margin',
                'inputValue'
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
            url     : 'classes/formLayoutEngine.class.php',
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
     *  parent fields of this form.
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
         * this.fieldsGridStore.setRootNode() is to manage a sencha bug
         * that removes the treeNotes when you load() the store.
         *
         */
        this.fieldsGridStore.setRootNode();
        this.fieldsGridStore.load({params:{currForm: this.currForm }});
        this.parentFieldsStore.load({params:{currForm: this.currForm }});
    },
    /**
    * This function is called from MitosAPP.js when
    * this panel is selected in the navigation panel.
    * place inside this function all the functions you want
    * to call every this panel becomes active
    */
    onActive:function(){
        this.loadFieldsGrid();
    }
});