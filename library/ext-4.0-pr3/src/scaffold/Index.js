Ext.ns('Ext.scaffold');

/**
 * @class Ext.scaffold.Index
 * @extends Ext.DataView
 * @private
 * A scaffold view for easily displaying the instances of a given model
 */
Ext.scaffold.Index = Ext.extend(Ext.DataView, {
    /**
     * @cfg {String/Function} model The model to create the scaffold for. This is usually the name
     * of a model
     */
    
    /**
     * @cfg {RegExp} ignoreFieldRe Regex that matches any fields that should be ignored. Any fields that
     * match this regex will not be included in the template. The default regex just ignores any fields
     * ending in "_id"
     */
    ignoreFieldRe: /^id$|_id$/,
    
    /**
     * @cfg {Boolean} hasNewButton True to add a 'New X' button to the toolbar (where X is the model being scaffolded).
     * Defaults to true
     */
    hasNewButton: true,
    
    /**
     * @cfg {Boolean} hasEditButton True to add an 'Edit' button to the toolbar. This calls the configurable {@link #onEdit}
     * function. Defaults to true.
     */
    hasEditButton: true,
    
    /**
     * @cfg {String} newButtonFormat The format string used to render the New button text. Defaults to "New {0}". The "{0}" will
     * be automatically replaced with the name of the model (e.g. "New User" for the "User" model).
     */
    newButtonFormat: "New {0}",
    
    /**
     * @cfg {String} editButtonFormat The format string used to render the New button text. Defaults to "Edit"
     */
    editButtonFormat: 'Edit',
    
    /**
     * @cfg {Boolean} tapToEdit Automatically fires the 'edit' event when an item is tapped on. Set to false to cancel this behavior.
     * Defaults to true.
     */
    tapToEdit: true,

    baseCls: Ext.baseCSSPrefix + 'scaffold',
    
    //inherit docs
    constructor: function(config) {
        config = config || {};
        
        this.addEvents(
          /**
           * @event build
           * Fires when the user clicks the New button on the top toolbar
           * @param {Ext.scaffold.Index} scaffold The scaffold instance
           */
          'build'
        );
        
        this.setModel(config.model);
        delete config.model;
        
        Ext.scaffold.Index.superclass.constructor.call(this, config);
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
    
    //inherit docs
    initComponent: function() {
        var model = this.model;
        
        Ext.applyIf(this, {
            title: model.modelName,
            store: this.buildStore(),
            tpl  : this.buildTemplate(),
            
            itemSelector: "." + this.buildItemSelectorClass(),
            dockedItems : this.buildToolbar()
        });
        
        Ext.scaffold.Index.superclass.initComponent.apply(this, arguments);
    },
    
    /**
     * Creates and returns a customised XTemplate that is used to render the list of model instances
     * @return {Ext.XTemplate} The built template
     */
    buildTemplate: function() {
        var selector = this.buildItemSelectorClass(),
            fields   = this.model.prototype.fields.items,
            length   = fields.length,
            items    = [],
            headings = [],
            name, i;
        
        for (i = 0; i < length; i++) {
            name = fields[i].name;
            
            if (!this.ignoreFieldRe.test(name)) {
                headings.push("<td>" + name + "</td>");
                items.push("<td>{" + name + "}</td>");
            }
        }
        
        return new Ext.XTemplate(
            '<table class="x-scaffold-index">',
                '<thead>',
                    '<tr>',
                        headings.join(""),
                    '</tr>',
                '</thead>',
                '<tpl for=".">',
                    '<tr class="' + selector + '">',
                        items.join(""),
                    '</tr>',
                '</tpl>',
            '</table>'
        );
    },
    
    /**
     * Returns the CSS selector used for this DataView's itemSelector. By default this generates a string
     * based on the model name.
     * @return {String} The selector
     */
    buildItemSelectorClass: function() {
        return Ext.String.format("x-scaffold-{0}", this.model.modelName);
    },
    
    /**
     * Builds and returns a store based on the configured model
     * @return {Ext.data.Store} The store
     */
    buildStore: function() {
        return new Ext.data.Store({
            autoLoad: true,
            
            model: this.model,
            proxy: this.model.getProxy()
        });
    },
    
    /**
     * Builds and returns the scaffold top toolbar. By default this just adds a "New X" button, where X is 
     * the name of the model being scaffolded.
     * @return {Ext.toolbar.Toolbar} The top toolbar
     */
    buildToolbar: function() {
        var items = [],
            modelName = this.model.modelName;
        
        if (this.hasNewButton) {
            items.push({
                text   : Ext.String.format(this.newButtonFormat, modelName),
                scope  : this,
                handler: this.onNewButtonClick
            });
        }
        
        if (this.hasEditButton) {
            items.push({
                text   : Ext.String.format(this.editButtonFormat, modelName),
                scope  : this,
                handler: this.onEditButtonClick
            });
        }
        
        return new Ext.toolbar.Toolbar({
            dock : 'top',
            items: items
        });
    },
    
    /**
     * Handler tied to the New button's click or tap event. By default just fires the 'build' event
     */
    onNewButtonClick: function() {
        this.fireEvent('build', this);
    },
    
    /**
     * Handler tied to the Edit button's click or tap event.
     */
    onEditButtonClick: function() {
        console.log('test');
    },
    
    /**
     * @private
     * Fires the 'edit' event. Usually dataview just fires itemtap but we want an 'edit' event for the Controller
     * to pick up on
     */
    onItemTap: function(item, index, e) {
        if (Ext.scaffold.Index.superclass.onItemTap.apply(this, arguments) && this.tapToEdit) {
            this.fireEvent('edit', this.store.getAt(index), this);
        }
    }
});

Ext.reg('scaffold-index', Ext.scaffold.Index);