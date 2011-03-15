/**
 * @author Jacky Nguyen
 * @markdown
 * @class Ext.Class

Handles class creation throughout the whole framework. Note that most of the time {@link Ext#define} should
be used instead, since it's a higher level wrapper that aliases to {@link Ext.ClassManager#create}
to enable namespacing and dynamic dependency resolution.

# Basic syntax: #

    Ext.define(className, properties);

in which `properties` is an object represent a collection of properties that apply to the class. See
{@link Ext.ClassManager#create} for more detailed instructions.

    Ext.define('Person', {
         name: 'Unknown',

         constructor: function(name) {
             if (name) {
                 this.name = name;
             }

             return this;
         },

         eat: function(foodType) {
             alert("I'm eating: " + foodType);

             return this;
         }
    });

    var aaron = new Person("Aaron");
    aaron.eat("Sandwich"); // alert("I'm eating: Sandwich");

Ext.Class has a powerful set of extensible {@link Ext.Class#registerPreprocessor pre-processors} which takes care of
everything related to class creation, including but not limited to inheritance, mixins, configuration, statics, etc.

# Inheritance: #

    Ext.define('Developer', {
         extend: 'Person',

         constructor: function(name, isGeek) {
             this.isGeek = isGeek;

             // Apply a method from the parent class' prototype
             this.callParent([name]);

             return this;

         },

         code: function(language) {
             alert("I'm coding in: " + language);

             this.eat("Bugs");

             return this;
         }
    });

    var jacky = new Developer("Jacky", true);
    jacky.code("JavaScript"); // alert("I'm coding in: JavaScript");
                              // alert("I'm eating: Bugs");

See {@link Ext.Base#callParent} for more details on calling superclass' methods

# Mixins: #

    Ext.define('CanPlayGuitar', {
         playGuitar: function() {
            alert("F#...G...D...A");
         }
    });

    Ext.define('CanComposeSongs', {
         composeSongs: function() { ... }
    });

    Ext.define('CanSing', {
         sing: function() {
             alert("I'm on the highway to hell...")
         }
    });

    Ext.define('Musician', {
         extend: 'Person',

         mixins: {
             canPlayGuitar: 'CanPlayGuitar',
             canComposeSongs: 'CanComposeSongs',
             canSing: 'CanSing'
         }
    })

    Ext.define('CoolPerson', {
         extend: 'Person',

         mixins: {
             canPlayGuitar: 'CanPlayGuitar',
             canSing: 'CanSing'
         },

         sing: function() {
             alert("Ahem....");

             this.mixins.canSing.sing.call(this);

             alert("[Playing guitar at the same time...]");

             this.mixins.canPlayGuitar.playGuitar.call(this);
         }
    });

    var me = new CoolPerson("Jacky");

    me.sing(); // alert("Ahem...");
               // alert("I'm on the highway to hell...");
               // alert("[Playing guitar at the same time...]");
               // alert("F#...G...D...A");

# Config: #

    Ext.define('SmartPhone', {
         config: {
             hasTouchScreen: false,
             operatingSystem: 'Other',
             price: 500
         },

         isExpensive: false,

         constructor: function(config) {
             this.initConfig(config);

             return this;
         },

         applyPrice: function(price) {
             this.isExpensive = (price > 500);

             return price;
         },

         applyOperatingSystem: function(operatingSystem) {
             if (!(/^(iOS|Android|BlackBerry)$/i).test(operatingSystem)) {
                 return 'Other';
             }

             return operatingSystem;
         }
    });

    var iPhone = new SmartPhone({
         hasTouchScreen: true,
         operatingSystem: 'iOS'
    });

    iPhone.getPrice(); // 500;
    iPhone.getOperatingSystem(); // 'iOS'
    iPhone.getHasTouchScreen(); // true;
    iPhone.hasTouchScreen(); // true

    iPhone.isExpensive; // false;
    iPhone.setPrice(600);
    iPhone.getPrice(); // 600
    iPhone.isExpensive; // true;

    iPhone.setOperatingSystem('AlienOS');
    iPhone.getOperatingSystem(); // 'Other'

# Statics: #

    Ext.define('Computer', {
         statics: {
             factory: function(brand) {
                // 'this' in static methods refer to the class itself
                 return new this(brand);
             }
         },

         constructor: function() { ... }
    });

    var dellComputer = Computer.factory('Dell');

 * Also see {@link Ext.Base#statics} and {@link Ext.Base#self} for more details on accessing
 * static properties within class methods
 *
 */

(function() {

    var flexSetter = Ext.Function.flexSetter;

    /**
     * @constructor
     * @param {Object} classData An object represent the properties of this class
     * @param {Function} createdFn Optional, the callback function to be executed when this class is fully created.
     * Note that the creation process can be asynchronous depending on the pre-processors used.
     * @return {Ext.Base} The newly created class
     */
    Ext.Class = function(newClass, classData, createdFn) {
        if (Ext.isObject(newClass)) {
            createdFn = classData;
            classData = newClass;
            newClass = function() {
                return this.constructor.apply(this, arguments);
            };
        }

        var self = this.constructor,
            preprocessors = Ext.Array.from(classData.preprocessors || self.getDefaultPreprocessors()),
            staticProp, process;

        for (staticProp in Ext.Base) {
            if (Ext.Base.hasOwnProperty(staticProp)) {
                newClass[staticProp] = Ext.Base[staticProp];
            }
        }

        delete classData.preprocessors;

        process = function(cls, data) {
            var name = preprocessors.shift();

            if (!name) {
                cls.implement(data);

                if (Ext.isFunction(createdFn)) {
                    createdFn.call(cls);
                }

                return;
            }

            this.getPreprocessor(name).call(this, cls, data, process);
        };

        process.call(self, newClass, classData);

        return newClass;
    };

    Ext.apply(Ext.Class, {

        /** @private */
        preprocessors: {},

        /**
         * Register a new pre-processor to be used during the class creation process
         *
         * @member Ext.Class registerPreprocessor
         * @param {String} name The pre-processor's name
         * @param {Function} fn The callback function to be executed. Typical format:

    function(cls, data, fn) {
        // Your code here

        // Execute this when the processing is finished.
        // Asynchronous processing is perfectly ok
        if (fn) {
            fn.call(this, cls, data);
        }
    });

         * Passed arguments for this function are:
         *
         * - `{Function} cls`: The created class
         * - `{Object} data`: The set of properties passed in {@link Ext.Class} constructor
         * - `{Function} fn`: The callback function that <b>must</b> to be executed when this pre-processor finishes,
         * regardless of whether the processing is synchronous or aynchronous
         *
         * @return {Ext.Class} this
         * @markdown
         */
        registerPreprocessor: flexSetter(function(name, fn) {
            this.preprocessors[name] = fn;

            return this;
        }),

        /**
         * Retrieve a pre-processor callback function by its name, which has been registered before
         *
         * @param {String} name
         * @return {Function} preprocessor
         */
        getPreprocessor: function(name) {
            return this.preprocessors[name];
        },

        /**
         * Retrieve the array stack of default pre-processors
         *
         * @return {Function} defaultPreprocessors
         */
        getDefaultPreprocessors: function() {
            return this.defaultPreprocessors || [];
        },

        /**
         * Set the default array stack of default pre-processors
         *
         * @param {Array} preprocessors
         * @return {Ext.Class} this
         */
        setDefaultPreprocessors: function(preprocessors) {
            this.defaultPreprocessors = Ext.Array.from(preprocessors);

            return this;
        },

        /**
         * Insert this pre-processor at a specific position in the stack, optionally relative to
         * any existing pre-processor. For example:

    Ext.Class.registerPreprocessor('debug', function(cls, data, fn) {
        // Your code here

        if (fn) {
            fn.call(this, cls, data);
        }
    }).insertDefaultPreprocessor('debug', 'last');

         * @param {String} name The pre-processor name. Note that it needs to be registered with
         * {@link Ext#registerPreprocessor registerPreprocessor} before this
         * @param {String} offset The insertion position. Four possible values are:
         * 'first', 'last', or: 'before', 'after' (relative to the name provided in the third argument)
         * @param {String} relativeName
         * @return {Ext.Class} this
         * @markdown
         */
        insertDefaultPreprocessor: function(name, offset, relativeName) {
            var defaultPreprocessors = this.defaultPreprocessors,
                index;

            if (Ext.isString(offset)) {
                if (offset === 'first') {
                    defaultPreprocessors.unshift(name);

                    return this;
                }
                else if (offset === 'last') {
                    defaultPreprocessors.push(name);

                    return this;
                }

                offset = (offset === 'after') ? 1 : -1;
            }

            index = Ext.Array.indexOf(defaultPreprocessors, relativeName);

            if (index !== -1) {
                defaultPreprocessors.splice(Math.max(0, index + offset), 0, name);
            }

            return this;
        }
    });

    Ext.Class.registerPreprocessor({
        extend: function(cls, data, fn) {
            var extend = data.extend,
                base = Ext.Base,
                temp = function() {},
                parent, i;

            if (typeof extend === 'function' && extend !== Object) {
                parent = extend;
            }
            else {
                parent = base;
            }

            temp.prototype = parent.prototype;
            cls.prototype = new temp();

            if (!('$class' in parent)) {
                for (i in base.prototype) {
                    if (!parent.prototype[i]) {
                        parent.prototype[i] = base.prototype[i];
                    }
                }
            }

            cls.prototype.self = cls;

            if (data.hasOwnProperty('constructor')) {
                cls.prototype.constructor = cls;
            }
            else {
                cls.prototype.constructor = parent.prototype.constructor;
            }

            cls.superclass = cls.prototype.superclass = parent.prototype;

            delete data.extend;


            // Merge the parent class' config object without referencing it
            Ext.merge(cls.prototype.config, parent.prototype.config || {});


            if (fn) {
                fn.call(this, cls, data);
            }
        },

        mixins: function(cls, data, fn) {
            var mixins = data.mixins;

            if (mixins) {
                cls.mixin(mixins);
            }

            delete data.mixins;

            if (fn) {
                fn.call(this, cls, data);
            }
        },

        config: function(cls, data, fn) {
            var config = data.config;

            if (config) {
                Ext.Object.each(config, function(name) {
                    var cName = Ext.String.capitalize(name),
                        pName = '_' + name,
                        apply = 'apply' + cName,
                        setter = 'set' + cName,
                        getter = 'get' + cName,
                        reset = 'reset' + cName,
                        prototype = cls.prototype;

                    if (!(apply in prototype)) {
                        prototype[apply] = function(val) {
                            return val;
                        };
                    }

                    if (!(setter in prototype)) {
                        prototype[setter] = function(val) {
                            var ret = this[apply].call(this, val, this[pName]);

                            if (ret !== undefined) {
                                this[pName] = ret;
                            }

                            return this;
                        };
                    }

                    if (!(getter in prototype)) {
                        prototype[getter] = function() {
                            return this[pName];
                        };
                    }

                    if (!(reset in prototype)) {
                        prototype[reset] = function() {
                            return this[setter].call(this, this.config[name]);
                        };
                    }

                    if (name.search(/^is|has/) !== -1) {
                        if (!(name in prototype)) {
                            prototype[name] = function() {
                                return !!this[getter].apply(this, arguments);
                            };
                        }
                    }
                });
            }

            if (fn) {
                fn.call(this, cls, data);
            }
        },

        statics: function(cls, data, fn) {
            if (Ext.isObject(data.statics)) {
                var name, statics = data.statics;

                for (name in statics) {
                    if (statics.hasOwnProperty(name)) {
                        cls[name] = statics[name];
                    }
                }
            }

            delete data.statics;

            if (fn) {
                fn.call(this, cls, data);
            }
        }
    });

    Ext.Class.setDefaultPreprocessors(['extend', 'mixins', 'config', 'statics']);

    Ext.extend = function(subclass, superclass, members) {
        if (arguments.length === 2 && Ext.isObject(superclass)) {
            members = superclass;
            superclass = subclass;
            subclass = null;
        }

        var cls;

        if (!superclass) {
            throw new Error("Attempting to extend from a class which has not been loaded on the page.");
        }

        members.extend = superclass;
        members.preprocessors = ['extend', 'mixins', 'config', 'statics'];

        if (subclass) {
            cls = new Ext.Class(subclass, members);
        }
        else {
            cls = new Ext.Class(members);
        }

        cls.prototype.override = function(o) {
            for (var m in o) {
                if (o.hasOwnProperty(m)) {
                    this[m] = o[m];
                }
            }
        };

        return cls;
    };

})();
