/**
 * @class Ext.scaffold.Form
 * @extends Ext.form.FormPanel
 * 
 */
Ext.scaffold.Form = Ext.extend(Ext.form.FormPanel, {
    /**
     * @cfg {String/Function} model The model to create the scaffold for
     */
    
    /**
     * @cfg {String} toolbarDock The dock location for the toolbar. Defaults to 'bottom'
     */
    toolbarDock: 'bottom',
    
    /**
     * @cfg {String} saveButtonText The text to display on the save button (defaults to 'Save')
     */
    saveButtonText: 'Save',
    
    /**
     * @cfg {String} cancelButtonText The text to display on the cancel button (defaults to 'Cancel')
     */
    cancelButtonText: 'Cancel',
    
    /**
     * @cfg {RegExp} ignoreFieldRe Regex that matches any fields that should be ignored. Any fields that
     * match this regex will not be included in the form. The default regex just ignores any fields ending
     * in "_id"
     */
    ignoreFieldRe: /^id$|_id$/,
    
    /**
     * @cfg {Regex} textAreaRe Regex that matches any model fields that should be turned into a textarea
     */
    textAreaRe: /(body)/,
    
    /**
     * @cfg {String} titleFormat A string suitable for passing into Ext.String.format to generate the title text
     */
    titleFormat: "Edit {0}",
    
    //inherit docs
    constructor: function(config) {
        config = config || {};
        
        this.addEvents(
            /**
             * @event save
             * Fires when the user wishes to save the new model instance
             * @param {Ext.scaffold.Build} scaffold The scaffold form
             */
            'save',
            
            /**
             * @event cancel
             * Fires when the user wishes to cancel the creation of the new model instance
             * @param {Ext.scaffold.Build} scaffold The scaffold form
             */
            'cancel'
        );
        
        this.setModel(config.model);
        delete config.model;
        
        Ext.scaffold.Form.superclass.constructor.call(this, config);
    },
    
    /**
     * Sets the model used by this scaffold. Can pass in the model string name or the model constructor
     * @param {String/Function} model The model to set
     */
    setModel: function(model) {
        if (typeof model == 'string') {
            this.model = Ext.ModelMgr.getModel(model);
        }
    },
    
    initComponent: function() {
        Ext.applyIf(this, {
            items: this.buildFormItems(),
            title: Ext.String.format(this.titleFormat, this.model.modelName),
            dockedItems: this.buildToolbar()
        });
        
        Ext.scaffold.Form.superclass.initComponent.apply(this, arguments);
    },
    
    /**
     * Creates and returns a toolbar containing (by default) save and cancel buttons
     * @return {Ext.toolbar.Toolbar} The toolbar
     */
    buildToolbar: function() {
        return new Ext.toolbar.Toolbar({
            dock: this.toolbarDock,
            items: [
                {
                    scope  : this,
                    text   : this.saveButtonText,
                    handler: this.onSaveButtonClick
                },
                {
                    scope  : this,
                    text   : this.cancelButtonText,
                    handler: this.onCancelButtonClick
                }
            ]
        });
    },
    
    /**
     * Returns an array of form items to create for the scaffold. The configured model's fields are reflected upon
     * and automatically turned into the appropriate form item types
     * @return {Array} The form items to create
     */
    buildFormItems: function() {
        var model  = this.model,
            fields = model.prototype.fields.items,
            length = fields.length,
            items  = [],
            field, type, i;
        
        for (i = 0; i < length; i++) {
            field = fields[i];
            
            if (!this.ignoreFieldRe.test(field.name)) {
                items.push({
                    fieldLabel: field.name,
                    name      : field.name,
                    xtype     : this.getFieldType(field)
                });
            } 
        }
        
        return {
            xtype: 'fieldset',
            items: items
        };
    },
    
    /**
     * Returns the xtype string for the best form field to create for a given field from a Model definition
     * @param {Ext.data.Field} field The field
     * @return {String} The xtype
     */
    getFieldType: function(field) {
        var xtype,
            mapping = {
            'int'   : 'numberfield',
            'string': 'textfield'
        };
        
        xtype = mapping[field.type.type];
        
        if (this.textAreaRe.test(field.name)) {
            xtype = 'textareafield';
        }
        
        return xtype;
    },
    
    /**
     * Handler tied to the save button. By default this just fires the 'save' event
     */
    onSaveButtonClick: function() {
        this.fireEvent('save', this);
    },
    
    /**
     * Handler tied to the cancel button. By default this just fires the 'cancel' event
     */
    onCancelButtonClick: function() {
        this.fireEvent('cancel', this);
    }
});