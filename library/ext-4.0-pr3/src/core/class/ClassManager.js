/**
 * @author Jacky Nguyen
 * @class Ext.ClassManager

Ext.ClassManager manages all classes and handles mapping from string class name to
actual class objects throughout the whole framework. It is not generally accessed directly, rather through
these convenient shorthands:

- {@link Ext#define}
- {@link Ext#create}
- {@link Ext#widget}
- {@link Ext#getClass}
- {@link Ext#getClassName}

 * @singleton
 * @markdown
 */
(function(Class, alias) {

    var Manager = Ext.ClassManager = {

        /**
         * @property classes
         * @type Object
         * All classes which were defined through the ClassManager. Keys are the
         * name of the classes and the values are references to the classes.
         * @private
         */
        classes: {},

        /**
         * @private
         */
        existCache: {},

        /**
         * @private
         */
        namespaceRewrites: [{
            from: 'Ext.',
            to: Ext
        }],

        /**
         * @private
         */
        maps: {
            alternateToName: {},
            aliasToName: {},
            nameToAliases: {}
        },

        /**
         * Checks to see if a class has already been created. If the provided argument is an array, it will return true if
         * all corresponding classes exist, false otherwise.
         *
         * @param {String/Array} className
         * @return {Boolean} exist
         */
        exist: function(className) {
            var i, ln, part, root, parts;

            if (!className) {
                return false;
            }

            if (Ext.isArray(className)) {
                for (i = 0; i < className.length; i++) {
                    if (!this.exist.call(this, className[i])) {
                        return false;
                    }
                }

                return true;
            }

            //<debug error>
            if (!Ext.isString(className)) {
                throw new Error("[Ext.ClassManager.exist] Invalid classname, must be a string");
            }
            //</debug>

            if (this.classes.hasOwnProperty(className) || this.existCache.hasOwnProperty(className)) {
                return true;
            }

            root = Ext.global;
            parts = this.parseNamespace(className);

            for (i = 0, ln = parts.length; i < ln; i++) {
                part = parts[i];

                if (!Ext.isString(part)) {
                    root = part;
                } else {
                    if (!root || !root[part]) {
                        return false;
                    }

                    root = root[part];
                }
            }

            Ext.Loader.historyPush(className);

            this.existCache[className] = true;

            return true;
        },

        /**
         * Supports namespace rewriting
         * @private
         */
        parseNamespace: function(namespace) {
            //<debug error>
            if (!Ext.isString(namespace)) {
                throw new Error("[Ext.ClassManager.parseNamespace] namespace must be a string");
            }
            //</debug>

            var parts = [],
                rewrites = this.namespaceRewrites,
                rewrite, from, to, i, ln, root = Ext.global;

            for (i = 0, ln = rewrites.length; i < ln; i++) {
                rewrite = rewrites[i];
                from = rewrite.from;
                to = rewrite.to;

                if (namespace === from || namespace.substring(0, from.length) === from) {
                    namespace = namespace.substring(from.length);

                    if (!Ext.isString(to)) {
                        root = to;
                    } else {
                        parts = parts.concat(to.split('.'));
                    }

                    break;
                }
            }

            parts.push(root);

            parts = parts.concat(namespace.split('.'));

            return Ext.Array.clean(parts);
        },

        /**
         * Creates a namespace and assign the `value` to the created object

    Ext.ClassManager.assignNamespace('MyCompany.pkg.Example', someObject);

    alert(MyCompany.pkg.Example === someObject); // alerts true

         * @param {String} name
         * @param {Mixed} value
         * @markdown
         */
        assignNamespace: function(name, value) {
            var root = Ext.global,
                parts = this.parseNamespace(name),
                leaf = parts.pop(),
                i, ln, part;

            for (i = 0, ln = parts.length; i < ln; i++) {
                part = parts[i];

                if (!Ext.isString(part)) {
                    root = part;
                } else {
                    if (!root[part]) {
                        root[part] = {};
                    }

                    root = root[part];
                }
            }

            root[leaf] = value;

            return root[leaf];
        },

        /**
         * The new Ext.ns, supports namespace rewriting
         * @private
         */
        createNamespaces: function() {
            var root = Ext.global,
                namespaces = Ext.Array.toArray(arguments),
                parts, part, i, j, ln, subLn;

            for (i = 0, ln = namespaces.length; i < ln; i++) {
                parts = this.parseNamespace(namespaces[i]);

                for (j = 0, subLn = parts.length; j < subLn; j++) {
                    part = parts[j];

                    if (!Ext.isString(part)) {
                        root = part;
                    } else {
                        if (!root[part]) {
                            root[part] = {};
                        }

                        root = root[part];
                    }
                }
            }

            return root;
        },

        /**
         * Sets a name reference to a class.
         *
         * @param {String} name
         * @param {Object} value
         * @return {Ext.ClassManager} this
         */
        set: function(name, value) {
            var targetName = this.getName(value);

            this.classes[name] = this.assignNamespace(name, value);

            if (targetName && targetName !== name) {
                this.maps.alternateToName[name] = targetName;
            }

            return this;
        },

        /**
         * Retrieve a class by its name.
         *
         * @param {String} name
         * @return {Class} class
         */
        get: function(name) {
            if (this.classes.hasOwnProperty(name)) {
                return this.classes[name];
            }

            var root = Ext.global,
                parts = this.parseNamespace(name),
                part, i, ln;

            for (i = 0, ln = parts.length; i < ln; i++) {
                part = parts[i];

                if (!Ext.isString(part)) {
                    root = part;
                } else {
                    if (!root || !root[part]) {
                        return null;
                    }

                    root = root[part];
                }
            }

            return root;
        },

        /**
         * Register the alias for a class.
         *
         * @param {Class/String} cls a reference to a class or a className
         * @param {String} alias Alias to use when referring to this class
         */
        setAlias: function(cls, alias) {
            var aliasToNameMap = this.maps.aliasToName,
                nameToAliasesMap = this.maps.nameToAliases,
                className;

            if (Ext.isString(cls)) {
                className = cls;
            } else {
                className = this.getName(cls);
            }

            if (alias && aliasToNameMap[alias] !== className) {
                //<debug info>
                if (aliasToNameMap.hasOwnProperty(alias) && Ext.isDefined(window.console)) {
                    console.log("[Ext.ClassManager] Overriding already existed alias: '" + alias + "' " +
                                "of: '" + aliasToNameMap[alias] + "' with: '" + className + "'. Be sure it's intentional.");
                }
                //</debug>

                aliasToNameMap[alias] = className;
            }

            if (!nameToAliasesMap[className]) {
                nameToAliasesMap[className] = [];
            }

            if (alias) {
                Ext.Array.include(nameToAliasesMap[className], alias);
            }

            return this;
        },

        /**
         * Get a reference to the class by its alias.
         *
         * @param {String} alias
         * @return {Class} class
         */
        getByAlias: function(alias) {
            return this.get(this.getNameByAlias(alias));
        },

        /**
         * Get the name of a class by its alias.
         *
         * @param {String} alias
         * @return {String} className
         */
        getNameByAlias: function(alias) {
            return this.maps.aliasToName[alias] || '';
        },

        /**
         * Get the name of a class by its alternate name.
         *
         * @param {String} alias
         * @return {String} className
         */
        getNameByAlternate: function(alternate) {
            return this.maps.alternateToName[alternate] || '';
        },

        /**
         * Get the aliases of a class by the class name
         *
         * @param {String} name
         * @return {Array} aliases
         */
        getAliasesByName: function(name) {
            return this.maps.nameToAliases[name] || [];
        },

        /**
         * Get the name of the class by its reference or its instance;
         * usually invoked by the shorthand {@link Ext#getClassName}

    Ext.ClassManager.getName(Ext.Action); // returns "Ext.Action"

         * @param {Class/Object} object
         * @return {String} className
         * @markdown
         */
        getName: function(object) {
            return object && object.$className || '';
        },

        /**
         * Get the class of the provided object; returns null if it's not an instance
         * of any class created with Ext.define. This is usually invoked by the shorthand {@link Ext#getClass}
         *
    var component = new Ext.Component();

    Ext.ClassManager.getClass(component); // returns Ext.Component
             *
         * @param {Object} object
         * @return {Class/null} class
         * @markdown
         */
        getClass: function(object) {
            return object && object.self || null;
        },

        /**
         * Defines a class. This is usually invoked via the alias {@link Ext#define}

    Ext.ClassManager.create('My.awesome.Class', {
        someProperty: 'something',
        someMethod: function() { ... }
        ...

    }, function() {
        alert('Created!');
        alert(this === My.awesome.Class); // alerts true

        var myInstance = new this();
    });

         * @param {String} className The class name to create in string dot-namespaced format, for example:
         * 'My.very.awesome.Class', 'FeedViewer.plugin.CoolPager'
         * It is highly recommended to follow this simple convention:

- The root and the class name are 'CamelCased'
- Everything else is lower-cased

         * @param {Object} data The key - value pairs of properties to apply to this class. Property names can be of any valid
         * strings, except those in the reserved listed below:

- `mixins`
- `statics`
- `config`
- `alias`
- `self`
- `singleton`
- `alternateClassName`
         *
         * @param {Function} createdFn Optional callback to execute after the class is created, the execution scope of which
         * (`this`) will be the newly created class itself.
         * @return {Ext.Base}
         * @markdown
         */
        create: function(className, data, createdFn) {
            var manager = this;

            //<debug error>
            if (!Ext.isString(className)) {
                throw new Error("[Ext.define] Invalid class name of: '" + className + "', must be a valid string");
            }
            //</debug>

            data.$className = className;

            return new Class(data, function() {
                var postprocessors = Ext.Array.from(data.postprocessors || manager.getDefaultPostprocessors()),
                    process = function(clsName, cls, clsData) {
                        var name = postprocessors.shift();

                        if (!name) {
                            manager.set(className, cls);

                            if (Ext.isFunction(createdFn)) {
                                createdFn.call(cls, cls);
                            }

                            return;
                        }

                        this.getPostprocessor(name).call(this, clsName, cls, clsData, process);
                    };

                process.call(manager, className, this, data);
            });
        },

        /**
         * Instantiate a class by its alias; usually invoked by the convenient shorthand {@link Ext#createByAlias}
         * If {@link Ext.Loader} is {@link Ext.Loader#setConfig enabled} and the class has not been defined yet, it will
         * attempt to load the class via synchronous loading.

    var window = Ext.ClassManager.instantiateByAlias('widget.window', { width: 600, height: 800, ... });

         * @param {String} alias
         * @param {Mixed} args,... Additional arguments after the alias will be passed to the
         * class constructor.
         * @return {Object} instance
         * @markdown
         */
        instantiateByAlias: function() {
            var args = Ext.Array.toArray(arguments),
                alias = args.shift(),
                className = this.getNameByAlias(alias);

            if (!className) {
                className = this.maps.aliasToName[alias];

                //<debug error>
                if (!className) {
                    throw new Error("[Ext.ClassManager] Cannot create an instance of unrecognized alias: " + alias);
                }
                //</debug>

                //<debug warn>
                if (typeof window !== 'undefined' && Ext.isDefined(window.console)) {
                    console.warn("[Ext.Loader] Synchronously loading '" + className + "'; consider adding " +
                                 "Ext.require('" + alias + "') above Ext.onReady");
                }
                //</debug>

                Ext.Loader.enableSyncMode(true);
                Ext.require(className, function() {
                    Ext.Loader.triggerReady();
                    Ext.Loader.enableSyncMode(false);
                });
            }

            args.unshift(className);

            return this.instantiate.apply(this, args);
        },

        /**
         * Instantiate a class by either full name, alias or alternate name; usually invoked by the convenient
         * shorthand {@link Ext#create}
         *
         * If {@link Ext.Loader} is {@link Ext.Loader#setConfig enabled} and the class has not been defined yet, it will
         * attempt to load the class via synchronous loading.
         *
         * For example, all these three lines return the same result:

    // alias
    var window = Ext.ClassManager.instantiate('widget.window', { width: 600, height: 800, ... });

    // alternate name
    var window = Ext.ClassManager.instantiate('Ext.Window', { width: 600, height: 800, ... });

    // full class name
    var window = Ext.ClassManager.instantiate('Ext.window.Window', { width: 600, height: 800, ... });

         * @param {String} name
         * @param {Mixed} args,... Additional arguments after the name will be passed to the class' constructor.
         * @return {Object} instance
         * @markdown
         */
        instantiate: function() {
            var args = Ext.Array.toArray(arguments),
                name = args.shift(),
                alias = name,
                temp = function() {},
                possibleName, cls, constructor, instanceCls;

            if (!Ext.isFunction(name)) {
                //<debug error>
                if ((!Ext.isString(name) || name.length < 1)) {
                    throw new Error("[Ext.create] Invalid class name or alias: '" + name + "', must be a valid string");

                }
                //</debug>

                cls = this.get(name);
            }
            else {
                cls = name;
            }

            // No record of this class name, it's possibly an alias, so look it up
            if (!cls) {
                possibleName = this.getNameByAlias(name);

                if (possibleName) {
                    name = possibleName;

                    cls = this.get(name);
                }
            }

            // Still no record of this class name, it's possibly an alternate name, so look it up
            if (!cls) {
                possibleName = this.getNameByAlternate(name);

                if (possibleName) {
                    name = possibleName;

                    cls = this.get(name);
                }
            }

            // Still not existing at this point, try to load it via synchronous mode as the last resort
            if (!cls) {
                //<debug warn>
                if (typeof window !== 'undefined' && Ext.isDefined(window.console)) {
                    console.warn("[Ext.Loader] Synchronously loading '" + name + "'; consider adding " +
                                 "Ext.require('" + ((possibleName) ? alias : name) + "') above Ext.onReady");
                }
                //</debug>

                Ext.Loader.enableSyncMode(true);

                Ext.require(name, function() {
                    // Switch Ext.Loader back to async mode right after this class and all
                    // its dependencies have been resolved
                    Ext.Loader.triggerReady();
                    Ext.Loader.enableSyncMode(false);
                });

                cls = this.get(name);
            }

            //<debug error>
            if (!cls) {
                throw new Error("[Ext.ClassManager] Cannot create an instance of unrecognized class name / alias: " + alias);
            }

            if (!Ext.isFunction(cls)) {
                throw new Error("[Ext.create] '" + name + "' is a singleton and cannot be instantiated");
            }
            //</debug>

            constructor = cls.prototype.constructor;
            instanceCls = function() {
                return constructor.apply(this, args);
            };

            temp.prototype = cls.prototype;
            instanceCls.prototype = new temp();
            instanceCls.prototype.constructor = instanceCls;

            return new instanceCls();
        },

        /**
         * @private
         */
        postprocessors: {},

        /**
         * Register post-processors. This method is a {@link Ext.Function#flexSetter flexSetter}
         *
         * @param {String} name
         * @param {Function} postprocessor
         */
        registerPostprocessor: Ext.Function.flexSetter(function(name, fn) {
            this.postprocessors[name] = fn;

            return this;
        }),

        /**
         * Retrieve a post processor by name
         *
         * @param {String} name
         * @return {Class} postProcessor
         */
        getPostprocessor: function(name) {
            return this.postprocessors[name];
        },

        /**
         * Get the default post-processors array stack which are applied to every class.
         *
         * @return {Array} defaultPostprocessors
         */
        getDefaultPostprocessors: function() {
            return this.defaultPostprocessors || [];
        },

        /**
         * Set the default post processors array stack which are applied to every class.
         *
         * @param {String/Array} The name of a registered post processor or an array of registered names.
         * @return {Ext.ClassManager} this
         */
        setDefaultPostprocessors: function(postprocessors) {
            this.defaultPostprocessors = Ext.Array.from(postprocessors);

            return this;
        },

        /**
         * Insert this post-processor at a specific position in the stack, optionally relative to
         * any existing post-processor
         *
         * @param {String} name The post-processor name. Note that it needs to be registered with
         * {@link Ext.ClassManager#registerPostprocessor registerPostprocessor} before this
         * @param {String} offset The insertion position. Four possible values are:
         * 'first', 'last', or: 'before', 'after' (relative to the name provided in the third argument)
         * @param {String} relativeName
         * @return {Ext.ClassManager} this
         */
        insertDefaultPostprocessor: function(name, offset, relativeName) {
            var defaultPostprocessors = this.defaultPostprocessors,
                index;

            if (Ext.isString(offset)) {
                if (offset === 'first') {
                    defaultPostprocessors.unshift(name);

                    return this;
                }
                else if (offset === 'last') {
                    defaultPostprocessors.push(name);

                    return this;
                }

                offset = (offset === 'after') ? 1 : -1;
            }

            index = Ext.Array.indexOf(defaultPostprocessors, relativeName);

            if (index !== -1) {
                defaultPostprocessors.splice(Math.max(0, index + offset), 0, name);
            }

            return this;
        },

        /**
         * Converts a string expression to an array of matching class names. An expression can either refers to class aliases
         * or class names. Expressions support wildcards:

     // returns ['Ext.window.Window']
    var window = Ext.ClassManager.getNamesByExpression('widget.window');

    // returns ['widget.panel', 'widget.window', ...]
    var allWidgets = Ext.ClassManager.getNamesByExpression('widget.*');

    // returns ['Ext.data.Store', 'Ext.data.ArrayProxy', ...]
    var allData = Ext.ClassManager.getNamesByExpression('Ext.data.*');

         * @param {String} expression
         * @return {Array} classNames
         * @markdown
         */
        getNamesByExpression: function(expression) {
            var nameToAliasesMap = this.maps.nameToAliases,
                names = [],
                name, alias, aliases, possibleName, regex, i, ln;

            //<debug error>
            if (!Ext.isString(expression) || expression.length < 1) {
                throw new Error("[Ext.ClassManager.getNamesByExpression] expression must be a valid string");
            }
            //</debug>

            if (expression.indexOf('*') !== -1) {
                expression = expression.replace(/\*/g, '(.*?)');
                regex = new RegExp('^' + expression + '$');

                for (name in nameToAliasesMap) {
                    if (nameToAliasesMap.hasOwnProperty(name)) {
                        aliases = nameToAliasesMap[name];

                        if (name.search(regex) !== -1) {
                            names.push(name);
                        }
                        else {
                            for (i = 0, ln = aliases.length; i < ln; i++) {
                                alias = aliases[i];

                                if (alias.search(regex) !== -1) {
                                    names.push(name);
                                    break;
                                }
                            }
                        }
                    }
                }

            } else {
                possibleName = this.getNameByAlias(expression);

                if (possibleName) {
                    names.push(possibleName);
                } else {
                    possibleName = this.getNameByAlternate(expression);

                    if (possibleName) {
                        names.push(possibleName);
                    } else {
                        names.push(expression);
                    }
                }
            }

            return names;
        }
    };

    Manager.registerPostprocessor({
        alias: function(name, cls, data, fn) {
            var aliases = Ext.Array.from(data.alias),
                widgetPrefix = 'widget.',
                i, ln, alias;

            for (i = 0, ln = aliases.length; i < ln; i++) {
                alias = aliases[i];

                //<debug error>
                if (!Ext.isString(alias)) {
                    throw new Error("[Ext.define] Invalid alias of: '" + alias + "' for class: '" + name + "'; must be a valid string");
                }
                //</debug>

                this.setAlias(cls, alias);
            }

            // This is ugly, will change to make use of parseNamespace for alias later on
            for (i = 0, ln = aliases.length; i < ln; i++) {
                alias = aliases[i];

                if (alias.substring(0, widgetPrefix.length) === widgetPrefix) {
                    // Only the first alias with 'widget.' prefix will be used for xtype
                    // TODO change the property name to $xtype instead
                    cls.xtype = cls.$xtype = alias.substring(widgetPrefix.length);
                    break;
                }
            }

            if (fn) {
                fn.call(this, name, cls, data);
            }
        },

        singleton: function(name, cls, data, fn) {
            if (data.singleton === true) {
                cls = new cls();
            }

            if (fn) {
                fn.call(this, name, cls, data);
            }
        },

        alternateClassName: function(name, cls, data, fn) {
            var alternates = Ext.Array.from(data.alternateClassName),
                i, ln, alternate;

            for (i = 0, ln = alternates.length; i < ln; i++) {
                alternate = alternates[i];

                //<debug error>
                if (!Ext.isString(alternate)) {
                    throw new Error("[Ext.define] Invalid alternate of: '" + alternate + "' for class: '" + name +
                                    "'; must be a valid string");
                }
                //</debug>

                this.set(alternate, cls);
            }

            if (fn) {
                fn.call(this, name, cls, data);
            }
        }
    });

    Manager.setDefaultPostprocessors(['alias', 'singleton', 'alternateClassName']);

    Ext.apply(Ext, {
        /**
         * Convenient shorthand, see {@link Ext.ClassManager#instantiate}
         * @member Ext
         * @method create
         */
        create: alias(Manager, 'instantiate'),

        /**
         *
         * @param {Mixed} item
         * @param {String} namespace
         */
        factory: function(item, namespace) {
            if (Ext.isArray(item)) {
                var i, ln;

                for (i = 0, ln = item.length; i < ln; i++) {
                    item[i] = Ext.factory(item[i], namespace);
                }

                return item;
            }
            else if (Ext.isString(item) || Ext.isPlainObject(item)) {
                var name, config = {};

                if (Ext.isString(item)) {
                    name = item;
                }
                else {
                    name = item.name;
                    config = item.config;
                }

                if (namespace) {
                    name = namespace + '.' + Ext.String.capitalize(name);
                }

                return Ext.create(name, config);

            } else if (Ext.isFunction(item)) {
                return Ext.create(item);
            }

            return item;
        },

        /**
         * Convenient shorthand to create a widget by its xtype, also see {@link Ext.ClassManager#instantiateByAlias}

    var button = Ext.widget('button'); // Equivalent to Ext.create('widget.button')
    var panel = Ext.widget('panel'); // Equivalent to Ext.create('widget.panel')

         * @member Ext
         * @method widget
         * @markdown
         */
        widget: function(name) {
            return Manager.instantiateByAlias.apply(Manager, ['widget.' + name].concat(Array.prototype.slice.call(arguments, 1)));
        },

        /**
         * Convenient shorthand, see {@link Ext.ClassManager#instantiateByAlias}
         * @member Ext
         * @method createByAlias
         */
        createByAlias: alias(Manager, 'instantiateByAlias'),

        /**
         * Convenient shorthand for {@link Ext.ClassManager#create}, see detailed {@link Ext.Class explanation}
         * @member Ext
         * @method define
         */
        define: alias(Manager, 'create'),

        /**
         * Convenient shorthand, see {@link Ext.ClassManager#getName}
         * @member Ext
         * @method getClassName
         */
        getClassName: alias(Manager, 'getName'),

        /**
         *
         * @param {Mixed} object
         */
        getDisplayName: function(object) {
            if (object.displayName) {
                return object.displayName;
            }

            if (object.$name && object.$class) {
                return Ext.getClassName(object.$class) + '#' + object.$name;
            }

            if (object.$className) {
                return object.$className;
            }

            return 'Anonymous';
        },

        /**
         * Convenient shorthand, see {@link Ext.ClassManager#getClass}
         * @member Ext
         * @method getClassName
         */
        getClass: alias(Manager, 'getClass'),

        /**
         * Creates namespaces to be used for scoping variables and classes so that they are not global.
         * Specifying the last node of a namespace implicitly creates all other nodes. Usage:

    Ext.namespace('Company', 'Company.data');

     // equivalent and preferable to the above syntax
    Ext.namespace('Company.data');

    Company.Widget = function() { ... };

    Company.data.CustomStore = function(config) { ... };

         * @param {String} namespace1
         * @param {String} namespace2
         * @param {String} etc
         * @return {Object} The namespace object. (If multiple arguments are passed, this will be the last namespace created)
         * @function
         * @member Ext
         * @method namespace
         * @markdown
         */
        namespace: alias(Manager, 'createNamespaces')
    });

    Ext.createWidget = Ext.widget;

    /**
     * Convenient alias for {@link Ext#namespace}
     * @member Ext
     * @method ns
     */
    Ext.ns = Ext.namespace;

    Class.registerPreprocessor('className', function(cls, data, fn) {
        if (data.$className) {
            cls.$className = data.$className;
            //<debug>
            cls.displayName = cls.$className;
            //</debug>
        }

        if (fn) {
            fn.call(this, cls, data);
        }

    }).insertDefaultPreprocessor('className', 'first');

})(Ext.Class, Ext.Function.alias);
