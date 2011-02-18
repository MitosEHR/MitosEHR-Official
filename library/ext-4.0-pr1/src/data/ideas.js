Ext.regModel('Product', {
    extend: 'SomeModel',
    
    fields: [
        {type: 'number', name: 'id'},
        {type: 'string', name: 'name'},
        {type: 'string', name: 'description'},
        {type: 'number', name: 'price'},
        {type: 'string', name: 'color'}
    ],
    
    validations: [
        {type: 'presence',  field: 'name'},
        {type: 'length',    field: 'description', min: 100, max: 200},
        {type: 'inclusion', field: 'color', list: ['red', 'white', 'blue']},
        
        {type: 'format',    field: 'phone', matcher: /123/},
        {type: 'email',     field: 'email'}
    ],
    
    validate: function() {
        //custom validations
    },
    
    associations: [
        {type: 'hasMany',   model: 'Variant', name: 'variants'},
        {type: 'belongsTo', model: 'Category'},
        
        {type: 'polymorphic', name: 'attachable'},
        
        //in another model
        {type: 'hasMany', as: 'attachable'}
    ],
    
    plugins: [
        {
            name: 'statemachine',
            states: ['pending', 'active', 'deleted'],
            initialState: 'pending'
        }
    ]
});


Ext.preg('statemachine', {
    name: 'statemachine',
    type: 'model',
    
    options: {
        stateField: 'state'
    },
    
    bootstrap: function(model, config) {
        var opts = Ext.apply(this.options, config);
        
        if (fields[config.stateField] == undefined) {
            //add the state field
        }
        
        //add methods to the model's prototype
        Ext.override(model, {
            getState: function() {
                return this.get(opts.stateField);
            },
            
            //returns the array of states we can transition to
            getNextStates: function() {
                
            }
        });
        
        Ext.each(config.states, function(state) {
            model.prototype['make' + Ext.String.capitalize(state)] = function() {
                console.log('yea');
            };
        }, this);
    },
    
    init: function(instance) {
        var opts = this.options;
        
        instance.set(opts.stateField, opts.initialState);
    }
});

var product = new Product({
    name: 'Ext',
    price: 100000
});

product.makeActive();
product.categories.getStore();

product.validate();
product.isValid();
product.getErrors(true);


