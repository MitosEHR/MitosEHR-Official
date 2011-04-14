/**
 * @author Ed Spencer
 * @class Ext.ModelManager
 * @extends Ext.AbstractManager
 * @singleton
 * 
 * <p>Creates and manages the current set of models</p>
 */
Ext.define('Ext.ModelManager', {
    extend: 'Ext.AbstractManager',
    alternateClassName: 'Ext.ModelMgr',
    requires: ['Ext.data.Association'],
    
    singleton: true,
    
    typeName: 'mtype',
    
    /**
     * Private stack of associations that must be created once their associated model has been defined
     * @property associationStack
     * @type Array
     */
    associationStack: [],
    
    /**
     * Registers a model definition. All model plugins marked with isDefault: true are bootstrapped
     * immediately, as are any addition plugins defined in the model config.
     */
    registerType: function(name, config) {
        var proto = config.prototype,
            model;
        if (proto && proto.isModel) {
            // registering an already defined model
            model = config;
        } else {
            // passing in a configuration
            if (!config.extend) {
                config.extend = 'Ext.data.Model';
            }
            model = Ext.define(name, config);
        }
        this.types[name] = model;
        return model;
    },
    
    /**
     * @private
     * Private callback called whenever a model has just been defined. This sets up any associations
     * that were waiting for the given model to be defined
     * @param {Function} model The model that was just created
     */
    onModelDefined: function(model) {
        var stack  = this.associationStack,
            length = stack.length,
            create = [],
            association, i, created;
        
        for (i = 0; i < length; i++) {
            association = stack[i];
            
            if (association.associatedModel == model.modelName) {
                create.push(association);
            }
        }
        
        for (i = 0, length = create.length; i < length; i++) {
            created = create[i];
            this.types[created.ownerModel].prototype.associations.add(Ext.data.Association.create(created));
            Ext.Array.remove(stack, created);
        }
    },
    
    /**
     * Registers an association where one of the models defined doesn't exist yet.
     * The ModelManager will check when new models are registered if it can link them
     * together
     * @private
     * @param {Ext.data.Association} association The association
     */
    registerDeferredAssociation: function(association){
        this.associationStack.push(association);
    },
    
    /**
     * Returns the {@link Ext.data.Model} for a given model name
     * @param {String/Object} id The id of the model or the model instance.
     */
    getModel: function(id) {
        var model = id;
        if (typeof model == 'string') {
            model = this.types[model];
        }
        return model;
    },
    
    /**
     * Creates a new instance of a Model using the given data.
     * @param {Object} data Data to initialize the Model's fields with
     * @param {String} name The name of the model to create
     * @param {Number} id Optional unique id of the Model instance (see {@link Ext.data.Model})
     */
    create: function(config, name, id) {
        var con = typeof name == 'function' ? name : this.types[name || config.name];
        
        return new con(config, id);
    }
}, function() {
    
    /**
     * Shorthand for {@link Ext.ModelManager#registerType}
     * Creates a new Model class from the specified config object. See {@link Ext.data.Model} for full examples.
     * 
     * @param {Object} config A configuration object for the Model you wish to create.
     * @return {Ext.data.Model} The newly registered Model
     * @member Ext
     * @method regModel
     */
    Ext.regModel = function() {
        return this.ModelManager.registerType.apply(this.ModelManager, arguments);
    };
});
