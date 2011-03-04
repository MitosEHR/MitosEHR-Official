(function(){
(function(){
/**
 * @class Ext
 * @singleton
 */
(function() {
    var global = this,
        objectPrototype = Object.prototype,
        enumerables = true,
        enumerablesTest = { toString: 1 },
        i;

    if (typeof Ext === 'undefined') {
        global.Ext = {};
    }

    Ext.global = global;

    for (i in enumerablesTest) {
        enumerables = null;
    }

    if (enumerables) {
        enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable',
                       'toLocaleString', 'toString', 'constructor'];
    }

    /**
     * Put it into Ext namespace so that we can reuse outside this
     * @type Array
     */
    Ext.enumerables = enumerables;

    /**
     * Copies all the properties of config to the specified object.
     * IMPORTANT: Note that it doesn't take care of recursive merging and cloning without referencing the original objects / arrays
     * Use Ext.merge instead if you need that.
     * @param {Object} object The receiver of the properties
     * @param {Object} config The source of the properties
     * @param {Object} defaults A different object that will also be applied for default values
     * @return {Object} returns obj
     */
    Ext.apply = function(object, config, defaults) {
        if (defaults) {
            Ext.apply(object, defaults);
        }

        if (object && config && typeof config === 'object') {
            var i, j, k;

            for (i in config) {
                object[i] = config[i];
            }

            if (enumerables) {
                for (j = enumerables.length; j--;) {
                    k = enumerables[j];
                    if (config.hasOwnProperty(k)) {
                        object[k] = config[k];
                    }
                }
            }
        }

        return object;
    };

    Ext.buildSettings = Ext.apply({
        baseCSSPrefix: 'x-',
        scopeResetCSS: false
    }, Ext.buildSettings || {});

    Ext.apply(Ext, {
        /**
         * A reusable empty function
         */
        emptyFn: function() {},

        baseCSSPrefix: Ext.buildSettings.baseCSSPrefix,

        /**
         * Copies all the properties of config to object if they don't already exist.
         * @function
         * @param {Object} object The receiver of the properties
         * @param {Object} config The source of the properties
         * @return {Object} returns obj
         */
        applyIf: function(object, config) {
            var property;

            if (object) {
                for (property in config) {
                    if (object[property] === undefined) {
                        object[property] = config[property];
                    }
                }
            }

            return object;
        },

        /**
         * Iterates either the elements in an array, or the properties in an object.
         * @param {Object/Array} object The object or array to be iterated
         * @param {Function} fn The function to be called for each iteration.
         * The iteration will stop if the supplied function returns false, or
         * all array elements / object properties have been covered. The signature
         * varies depending on the type of object being interated:
         * <ul>
         * <li>Arrays : <tt>(Object item, Number index, Array allItems)</tt>
         * When iterating an array, the supplied function is called with each item.
         * </li>
         * <li>Objects : <tt>(String key, Object value, Object)</tt>
         * When iterating an object, the supplied function is called with each key-value pair in
         * the object, and the iterated object
         * </li>
         * </ul>
         * @param {Object} scope The scope (<tt>this</tt> reference) in which the specified function is executed. Defaults to
         * the <tt>object</tt> being iterated.
         */
        each: function(obj, fn, scope) {
            if (Ext.isEmpty(obj)) {
                return;
            }

            if (Ext.isIterable(obj)) {
                Ext.Array.each.apply(this, arguments);
            }
            else {
                Ext.Object.each.apply(this, arguments);
            }
        }
    });

    Ext.apply(Ext, {

        /**
         * Since Core version 4 this method is meant to be used internally only. Use {@link Ext.define Ext.define} instead.
         * @function
         * @param {Function} superclass
         * @param {Object} overrides
         * @return {Function} The subclass constructor from the <tt>overrides</tt> parameter, or a generated one if not provided.
         * @deprecated Use {@link Ext.define Ext.define} instead
         */
        extend: function() {
            // inline overrides
            var objectConstructor = objectPrototype.constructor,
                inlineOverrides = function(o) {
                for (var m in o) {
                    if (!o.hasOwnProperty(m)) {
                        continue;
                    }
                    this[m] = o[m];
                }
            };

            return function(subclass, superclass, overrides) {
                // First we check if the user passed in just the superClass with overrides
                if (Ext.isObject(superclass)) {
                    overrides = superclass;
                    superclass = subclass;
                    subclass = overrides.constructor !== objectConstructor ? overrides.constructor : function() {
                        superclass.apply(this, arguments);
                    };
                }

                if (!superclass) {
                    throw "Attempting to extend from a class which has not been loaded on the page.";
                }

                // We create a new temporary class
                var F = function() {},
                    subclassProto, superclassProto = superclass.prototype;

                F.prototype = superclassProto;
                subclassProto = subclass.prototype = new F();
                subclassProto.constructor = subclass;
                subclass.superclass = superclassProto;

                if (superclassProto.constructor === objectConstructor) {
                    superclassProto.constructor = superclass;
                }

                subclass.override = function(overrides) {
                    Ext.override(subclass, overrides);
                };

                subclassProto.override = inlineOverrides;
                subclassProto.proto = subclassProto;

                subclass.override(overrides);
                subclass.extend = function(o) {
                    return Ext.extend(subclass, o);
                };

                return subclass;
            };
        }(),

        /**
         * Adds a list of functions to the prototype of an existing class, overwriting any existing methods with the same name.
         * @example
         Ext.override(MyClass, {
         newMethod1: function(){
         // etc.
         },
         newMethod2: function(foo){
         // etc.
         }
         });
         * @param {Object} origclass The class to override
         * @param {Object} overrides The list of functions to add to origClass.  This should be specified as an object literal
         * containing one or more methods.
         * @method override
         * @deprecated Make use of {@link Ext.Base#override} instead
         */
        override: function(origclass, overrides) {
            Ext.apply(origclass.prototype, overrides);
        }
    });

    /**
     * A full set of static methods to do type checking
     * @ignore
     */
    Ext.apply(Ext, {
        
        deprecate: function() {
            
        },

        /**
         * Returns true if the passed value is empty. The value is deemed to be empty if it is:
         * <ul>
         * <li>null</li>
         * <li>undefined</li>
         * <li>an empty array</li>
         * <li>a zero length string (Unless the <tt>allowBlank</tt> parameter is <tt>true</tt>)</li>
         * </ul>
         * @param {Mixed} value The value to test
         * @param {Boolean} allowBlank (optional) true to allow empty strings (defaults to false)
         * @return {Boolean}
         */
        isEmpty: function(value, allowBlank) {
            return (value === null) || (value === undefined) || ((Ext.isArray(value) && !value.length)) || (!allowBlank ? value === '' : false);
        },

        /**
         * Returns true if the passed value is a JavaScript Array, false otherwise.
         * @param {Mixed} target The target to test
         * @return {Boolean}
         */
        isArray: function(value) {
            return objectPrototype.toString.apply(value) === '[object Array]';
        },

        /**
         * Returns true if the passed value is a JavaScript Date object, false otherwise.
         * @param {Object} object The object to test
         * @return {Boolean}
         */
        isDate: function(value) {
            return objectPrototype.toString.apply(value) === '[object Date]';
        },

        /**
         * Returns true if the passed value is a JavaScript Object, false otherwise.
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
        isObject: function(value) {
            return !!value && !value.tagName && objectPrototype.toString.call(value) === '[object Object]';
        },

        /**
         * Returns true if the passed value is a JavaScript 'primitive', a string, number or boolean.
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
        isPrimitive: function(value) {
            return Ext.isString(value) || Ext.isNumber(value) || Ext.isBoolean(value);
        },

        /**
         * Returns true if the passed value is a JavaScript Function, false otherwise.
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
        isFunction: function(value) {
            return objectPrototype.toString.apply(value) === '[object Function]';
        },

        /**
         * Returns true if the passed value is a number. Returns false for non-finite numbers.
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
        isNumber: function(value) {
            return objectPrototype.toString.apply(value) === '[object Number]' && isFinite(value);
        },

        /**
         * Validates that a value is numeric.
         * @param {Mixed} value Examples: 1, '1', '2.34'
         * @return {Boolean} True if numeric, false otherwise
         */
        isNumeric: function(value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
        },

        /**
         * Returns true if the passed value is a string.
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
        isString: function(value) {
            return typeof value === 'string';
        },

        /**
         * Returns true if the passed value is a boolean.
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
        isBoolean: function(value) {
            return objectPrototype.toString.apply(value) === '[object Boolean]';
        },

        /**
         * Returns true if the passed value is an HTMLElement
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
        isElement: function(value) {
            return value ? !! value.tagName : false;
        },

        /**
         * Returns true if the passed value is defined.
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
        isDefined: function(value) {
            return typeof value !== 'undefined';
        },

        /**
         * Returns true if the passed value is iterable, false otherwise
         * @param {Mixed} value The value to test
         * @return {Boolean}
         */
        isIterable: function(value) {
            if (!value) {
                return false;
            }
            //check for array or arguments
            if (Ext.isArray(value) || value.callee) {
                return true;
            }
            //check for node list type
            if (/NodeList|HTMLCollection/.test(objectPrototype.toString.call(value))) {
                return true;
            }

            //NodeList has an item and length property
            //IXMLDOMNodeList has nextNode method, needs to be checked first.
            return ((typeof value.nextNode !== 'undefined' || value.item) && Ext.isNumber(value.length)) || false;
        }
    });

    Ext.apply(Ext, {

        /**
         * Clone almost any type of variable including array, object, DOM nodes and Date without keeping the old reference
         * @param {Mixed} item The variable to clone
         * @return {Mixed} clone
         */
        clone: function(item) {
            if (!item) {
                return item;
            }

            // DOM nodes
            // TODO proxy this to Ext.Element.clone to handle automatic id attribute changing
            // recursively
            if (item.nodeType && item.cloneNode) {
                return item.cloneNode(true);
            }

            // Date
            if (item instanceof Date) {
                return new Date(item.getTime());
            }

            var i, j, k, clone, key;

            // Array
            if (Ext.isArray(item)) {
                i = item.length;

                clone = new Array(i);

                while (i--) {
                    clone[i] = Ext.clone(item[i]);
                }
            }
            // Object
            else if (Ext.isObject(item)) {
                clone = item.constructor ? new item.constructor() : {};

                for (key in item) {
                    clone[key] = Ext.clone(item[key]);
                }

                if (enumerables) {
                    for (j = enumerables.length; j--;) {
                        k = enumerables[j];
                        clone[k] = item[k];
                    }
                }
            }
            return clone || item;
        },

        /**
         * @private
         * Generate a unique reference of Ext in the global scope, useful for sandboxing
         */
        getUniqueGlobalNamespace: function() {
            if (!this.uniqueGlobalNamespace) {
                var i = 0;

                do {
                    this.uniqueGlobalNamespace = 'ExtSandbox' + (++i);
                } while (typeof Ext.global[this.uniqueGlobalNamespace] !== 'undefined');

                Ext.global[this.uniqueGlobalNamespace] = Ext;
            }

            return this.uniqueGlobalNamespace;
        },

        /**
         * @private
         */
        functionFactory: function() {
            var args = Array.prototype.slice.call(arguments);

            if (args.length > 0) {
                args[args.length - 1] = 'return (function(Ext){' +  args[args.length - 1] + '}).call(this, window.'+this.getUniqueGlobalNamespace()+');';
            }

            return Function.prototype.constructor.apply(Function.prototype, args);
        }
    });

})();

/**
 * @class Ext.Version
 */
(function() {

// Current core version
var version = '4.0.0dev',
    Version = Ext.Version = Ext.extend(Object, {

        /**
         * A utility class that wrap around a string version number and provide convenient
         * method to do comparison. See also: {@link Ext.Version#compare compare}. Example:
         * <pre><code>
         * var version = new Ext.Version('1.0.2beta');
         * console.log("Version is " + version); // Version is 1.0.2beta
         *
         * console.log(version.getMajor()); // 1
         * console.log(version.getMinor()); // 0
         * console.log(version.getPatch()); // 2
         * console.log(version.getBuild()); // 0
         * console.log(version.getRelease()); // beta
         *
         * console.log(version.gt('1.0.1')); // True
         * console.log(version.gt('1.0.2alpha')); // True
         * console.log(version.gt('1.0.2RC')); // False
         * console.log(version.gt('1.0.2')); // False
         *
         * console.log(version.match(1.0)); // True
         * console.log(version.match('1.0.2')); // True
         * </code></pre>
         *
         * @constructor
         * @param {String/Number} version The version number in the follow standard format: major[.minor[.patch[.build[release]]]]
         * Examples: 1.0 or 1.2.3beta or 1.2.3.4RC
         * @return {Ext.Version} this
         */
        constructor: function(version) {
            var parts, releaseStartIndex;

            if (version instanceof Version) {
                return version;
            }

            this.version = this.simplified = String(version).toLowerCase().replace(/_/g, '.').replace(/[\-+]/g, '');

            releaseStartIndex = this.version.search(/([^\d\.])/);

            if (releaseStartIndex !== -1) {
                this.release = this.version.substr(releaseStartIndex, version.length);
                this.simplified = this.version.substr(0, releaseStartIndex);
            }

            this.simplified = this.simplified.replace(/[^\d]/g, '');

            parts = this.version.split('.');

            this.major = parseInt(parts.shift(), 10);
            this.minor = parseInt(parts.shift(), 10);
            this.patch = parseInt(parts.shift(), 10);
            this.build = parseInt(parts.shift(), 10);

            return this;
        },

        /**
         * Override the native toString method
         * @private
         * @return {String} version
         */
        toString: function() {
            return this.version;
        },

        /**
         * Override the native valueOf method
         * @private
         * @return {String} version
         */
        valueOf: function() {
            return this.version;
        },

        /**
         * Returns the major component value
         * @return {Number} major
         */
        getMajor: function() {
            return this.major || 0;
        },

        /**
         * Returns the minor component value
         * @return {Number} minor
         */
        getMinor: function() {
            return this.minor || 0;
        },

        /**
         * Returns the patch component value
         * @return {Number} patch
         */
        getPatch: function() {
            return this.patch || 0;
        },

        /**
         * Returns the build component value
         * @return {Number} build
         */
        getBuild: function() {
            return this.build || 0;
        },

        /**
         * Returns the release component value
         * @return {Number} release
         */
        getRelease: function() {
            return this.release || '';
        },

        /**
         * Returns whether this version if greater than the supplied argument
         * @param {String/Number} target The version to compare with
         * @return {Boolean} True if this version if greater than the target, false otherwise
         */
        isGreaterThan: function(target) {
            return Version.compare(this.version, target) === 1;
        },

        /**
         * Convenient shortcut for {@link Ext.Version#isGreaterThan isGreaterThan}
         * @param {String/Number} target The version to compare with
         * @return {Boolean} True if this version if greater than the target, false otherwise
         */
        gt: function() {
            return this.isGreaterThan.apply(this, arguments);
        },

        /**
         * Returns whether this version if smaller than the supplied argument
         * @param {String/Number} target The version to compare with
         * @return {Boolean} True if this version if smaller than the target, false otherwise
         */
        isSmallerThan: function(target) {
            return Version.compare(this.version, target) === -1;
        },

        /**
         * Convenient shortcut for {@link Ext.Version#isSmallerThan isSmallerThan}
         * @param {String/Number} target The version to compare with
         * @return {Boolean} True if this version if smaller than the target, false otherwise
         */
        lt: function() {
            return this.isSmallerThan.apply(this, arguments);
        },

        /**
         * Returns whether this version equals to the supplied argument
         * @param {String/Number} target The version to compare with
         * @return {Boolean} True if this version equals to the target, false otherwise
         */
        equals: function(target) {
            return Version.compare(this.version, target) === 0;
        },

        /**
         * Convenient shortcut for {@link Ext.Version#equals equals}
         * @param {String/Number} target The version to compare with
         * @return {Boolean} True fs this version equals to the target, false otherwise
         */
        eq: function() {
            return this.equals.apply(this, arguments);
        },

        /**
         * Returns whether this version matches the supplied argument. Example:
         * <pre><code>
         * var version = new Ext.Version('1.0.2beta');
         * console.log(version.match(1)); // True
         * console.log(version.match(1.0)); // True
         * console.log(version.match('1.0.2')); // True
         * console.log(version.match('1.0.2RC')); // False
         * </code></pre>
         * @param {String/Number} target The version to compare with
         * @return {Boolean} True if this version matches the target, false otherwise
         */
        match: function(target) {
            target = String(target);
            return this.version.substr(0, target.length) === target;
        },

        /**
         * Returns this format: [major, minor, patch, build, release]. Useful for comparison
         * @return {Array}
         */
        toArray: function() {
            return [this.getMajor(), this.getMinor(), this.getPatch(), this.getBuild(), this.getRelease()];
        },

        /**
         * Returns simplified version without dots and release
         * @return {String}
         */
        getSimplified: function() {
            return this.simplified;
        }
    });

    Ext.apply(Version, {
        // @private
        releaseValueMap: {
            'dev': -6,
            'alpha': -5,
            'a': -5,
            'beta': -4,
            'b': -4,
            'rc': -3,
            '#': -2,
            'p': -1,
            'pl': -1
        },

        /**
         * Converts a version component to a comparable value
         * @param {Mixed} value The value to convert
         * @return {Mixed}
         */
        getComponentValue: function(value) {
            return !value ? 0 : (isNaN(value) ? this.releaseValueMap[value] || value : parseInt(value, 10));
        },

        /**
         * Compare 2 specified versions, starting from left to right. If a part contains special version strings,
         * they are handled in the following order:
         * 'dev' < 'alpha' = 'a' < 'beta' = 'b' < 'RC' = 'rc' < '#' < 'pl' = 'p' < 'anything else'
         * @param {String} current The current version to compare to
         * @param {String} target The target version to compare to
         * @return {Number} Returns -1 if the current version is smaller than the target version, 1 if greater, and 0 if they're equivalent
         */
        compare: function(current, target) {
            var currentValue, targetValue, i;

            current = new Version(current).toArray();
            target = new Version(target).toArray();

            for (i = 0; i < Math.max(current.length, target.length); i++) {
                currentValue = this.getComponentValue(current[i]);
                targetValue = this.getComponentValue(target[i]);

                if (currentValue < targetValue) {
                    return -1;
                } else if (currentValue > targetValue) {
                    return 1;
                }
            }

            return 0;
        }
    });

    Ext.apply(Ext, {
        // @private
        versions: {},

        /**
         * Set version number of the supplied package name.
         * Note: This is not meant to be called from the application-level, only from framework-level
         * @param {String} packageName The package name, for example: 'core', 'touch', 'extjs'
         * @param {String} version The version, for example: '1.2.3alpha', '2.4.0-dev'
         * @return {Ext}
         */
        setVersion: function(packageName, version) {
            Ext.versions[packageName] = new Version(version);

            return this;
        },

        /**
         * Get the version number of the supplied package name
         * @param {String} packageName The package name, for example: 'core', 'touch', 'extjs'
         * @return {Ext.Version} The version
         */
        getVersion: function(packageName) {
            return Ext.versions[packageName];
        },

        /**
         * Create a closure for deprecated code. Note that for max performance, this will be stripped out automatically
         * when being built with JSBuilder
         * @param {String} packageName The package name
         * @param {String} since The last version before it's deprecated
         * @param {Function} closure The callback function to be executed with the specified version is less than the current version
         * @param {Object} scope The execution scope (<tt>this</tt>) if the closure
         */
        deprecate: function(packageName, since, closure, scope) {
            if (Version.compare(Ext.getVersion(packageName), since) < 1) {
                closure.call(scope);
            }
        }
    }); // End Versioning
    
    Ext.setVersion('core', version);

    // Deprecated stuff
    Ext.deprecate('core', '4.0dev', function() {
        var versionMessage = "[DEPRECATED][Ext.version] Please use Ext.getVersion(packageName) instead. For example: Ext.getVersion('core')";

        /**
         * <b>This property is deprecated.</b>
         * Please use {@link Ext#getVersion Ext.getVersion(packageName)} instead. For example:
         * <pre><code>
         * var coreVersion = Ext.getVersion('core');
         * </code></pre>
         * @deprecated
         * @property version
         * @type string
         */
        if ('__defineGetter__' in Ext) {
            Ext.__defineGetter__('version', function() {
                throw new Error(versionMessage);
            });
        }
        else {
            // For old browsers...
            Ext.version = versionMessage;
        }

        /**
         * <b>This method is deprecated.</b>
         * Please use Ext.each instead.
         * It's now a wrapper for both {@link Ext.Array#each} and {@link Ext.Object#each}
         * @deprecated
         */
        Ext.iterate = function() {
            if (console) {
                console.warn("[DEPRECATED][core][4.0dev][Ext.iterate] Please use Ext.each instead. " + "It's now a wrapper for both Ext.Array.forEach and Ext.Object.each");
            }

            Ext.each.apply(this, arguments);
        };
    });

})();

/**
 * @class Ext.String
 *
 * A collection of useful static methods to deal with strings
 * @singleton
 */

Ext.String = {
    trimRegex: /^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g,
    escapeRe: /('|\\)/g,
    formatRe: /\{(\d+)\}/g,
    escapeRegexRe: /([-.*+?^${}()|[\]\/\\])/g,

    /**
     * Takes an encoded URL and and converts it to an object. Example:
     * <pre><code>
Ext.String.parseQueryString("foo=1&bar=2"); // returns {foo: "1", bar: "2"}
Ext.String.parseQueryString("foo=1&bar=2&bar=3&bar=4", false); // returns {foo: "1", bar: ["2", "3", "4"]}
     * </code></pre>
     * @param {String} string
     * @param {Boolean} overwrite (optional) Items of the same name will overwrite previous values instead of creating an an array (Defaults to false).
     * @return {Object} A literal with members
     */
    parseQueryString : function(string, overwrite) {
        if (Ext.isEmpty(string)) {
            return {};
        }

        var obj = {},
        pairs = string.split('&'),
        d = decodeURIComponent,
        name,
        value;

        Ext.each(pairs, function(pair) {
            pair = pair.split('=');
            name = d(pair[0]);
            value = pair[1] ? d(pair[1]) : undefined;
            obj[name] = overwrite || !obj[name] ? value : [].concat(obj[name]).concat(value);
        });

        return obj;
    },

    /**
     * Convert certain characters (&, <, >, and ') to their HTML character equivalents for literal display in web pages.
     * @param {String} value The string to encode
     * @return {String} The encoded text
     */
    htmlEncode: function(value) {
        return (!value) ? value : String(value).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
    },

    /**
     * Convert certain characters (&, <, >, and ') from their HTML character equivalents.
     * @param {String} value The string to decode
     * @return {String} The decoded text
     */
    htmlDecode: function(value) {
        return (!value) ? value : String(value).replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
    },

    /**
     * Appends content to the query string of a URL, handling logic for whether to place
     * a question mark or ampersand.
     * @param {String} url The URL to append to.
     * @param {String} string The content to append to the URL.
     * @return (String) The resulting URL
     */
    urlAppend : function(url, string) {
        if (!Ext.isEmpty(string)) {
            return url + (url.indexOf('?') === -1 ? '?' : '&') + string;
        }

        return url;
    },

    /**
     * Trims whitespace from either end of a string, leaving spaces within the string intact.  Example:
     * @example
var s = '  foo bar  ';
alert('-' + s + '-');         //alerts "- foo bar -"
alert('-' + Ext.String.trim(s) + '-');  //alerts "-foo bar-"

     * @param {String} string The string to escape
     * @return {String} The trimmed string
     */
    trim: function(string) {
        return string.replace(Ext.String.trimRegex, "");
    },

    /**
     * Capitalize the given string
     * @param {String} string
     * @return {String}
     */
    capitalize: function(string) {
        return string.charAt(0).toUpperCase() + string.substr(1);
    },

    /**
     * Truncate a string and add an ellipsis ('...') to the end if it exceeds the specified length
     * @param {String} value The string to truncate
     * @param {Number} length The maximum length to allow before truncating
     * @param {Boolean} word True to try to find a common word break
     * @return {String} The converted text
     */
    ellipsis: function(value, len, word) {
        if (value && value.length > len) {
            if (word) {
                var vs = value.substr(0, len - 2),
                index = Math.max(vs.lastIndexOf(' '), vs.lastIndexOf('.'), vs.lastIndexOf('!'), vs.lastIndexOf('?'));
                if (index !== -1 && index >= (len - 15)) {
                    return vs.substr(0, index) + "...";
                }
            }
            return value.substr(0, len - 3) + "...";
        }
        return value;
    },

    /**
     * Escapes the passed string for use in a regular expression
     * @param {String} string
     * @return {String}
     */
    escapeRegex: function(string) {
        return string.replace(Ext.String.escapeRegexRe, "\\$1");
    },

    /**
     * Escapes the passed string for ' and \
     * @param {String} string The string to escape
     * @return {String} The escaped string
     */
    escape: function(string) {
        return string.replace(Ext.String.escapeRe, "\\$1");
    },

    /**
     * Utility function that allows you to easily switch a string between two alternating values.  The passed value
     * is compared to the current string, and if they are equal, the other value that was passed in is returned.  If
     * they are already different, the first value passed in is returned.  Note that this method returns the new value
     * but does not change the current string.
     * <pre><code>
    // alternate sort directions
    sort = Ext.String.toggle(sort, 'ASC', 'DESC');

    // instead of conditional logic:
    sort = (sort == 'ASC' ? 'DESC' : 'ASC');
       </code></pre>
     * @param {String} string The current string
     * @param {String} value The value to compare to the current string
     * @param {String} other The new value to use if the string already equals the first value passed in
     * @return {String} The new value
     */
    toggle: function(string, value, other) {
        return string === value ? other : value;
    },

    /**
     * Pads the left side of a string with a specified character.  This is especially useful
     * for normalizing number and date strings.  Example usage:
     *
     * <pre><code>
var s = Ext.String.leftPad('123', 5, '0');
// s now contains the string: '00123'
       </code></pre>
     * @param {String} string The original string
     * @param {Number} size The total length of the output string
     * @param {String} character (optional) The character with which to pad the original string (defaults to empty string " ")
     * @return {String} The padded string
     */
    leftPad: function(string, size, character) {
        var result = String(string);
        character = character || " ";
        while (result.length < size) {
            result = character + result;
        }
        return result;
    },

    /**
     * Allows you to define a tokenized string and pass an arbitrary number of arguments to replace the tokens.  Each
     * token must be unique, and must increment in the format {0}, {1}, etc.  Example usage:
     * <pre><code>
var cls = 'my-class', text = 'Some text';
var s = Ext.String.format('&lt;div class="{0}">{1}&lt;/div>', cls, text);
// s now contains the string: '&lt;div class="my-class">Some text&lt;/div>'
       </code></pre>
     * @param {String} string The tokenized string to be formatted
     * @param {String} value1 The value to replace token {0}
     * @param {String} value2 Etc...
     * @return {String} The formatted string
     */
    format: function(format) {
        var args = Ext.Array.toArray(arguments, 1);
        return format.replace(Ext.String.formatRe, function(m, i) {
            return args[i];
        });
    }
};

//Ext.deprecate('core', '4.0dev', function() {
//    Ext.urlDecode = function() {
//        console.warn("[DEPRECATED][core][4.0dev][Ext.urlDecode] please use Ext.String.parseQueryString instead");
//        return Ext.String.parseQueryString.apply(Ext.String, arguments);
//    };
//});

/**
 * @class Ext.Number
 *
 * A collection of useful static methods to deal with numbers
 * @singleton
 */

(function() {

var isToFixedBroken = (0.9).toFixed() !== '1';

Ext.Number = {
    /**
     * Checks whether or not the current number is within a desired range.  If the number is already within the
     * range it is returned, otherwise the min or max value is returned depending on which side of the range is
     * exceeded. Note that this method returns the constrained value but does not change the current number.
     * @param {Number} number The number to check
     * @param {Number} min The minimum number in the range
     * @param {Number} max The maximum number in the range
     * @return {Number} The constrained value if outside the range, otherwise the current value
     */
    constrain: function(number, min, max) {
        number = parseFloat(number);

        if (!isNaN(min)) {
            number = Math.max(number, min);
        }
        if (!isNaN(max)) {
            number = Math.min(number, max);
        }
        return number;
    },

    /**
     * Formats a number using fixed-point notation
     * @param {Number} value The number to format
     * @param {Number} precision The number of digits to show after the decimal point
     */
    toFixed: function(value, precision) {
        if (isToFixedBroken) {
            precision = precision || 0;
            var pow = Math.pow(10, precision);
            return (Math.round(value * pow) / pow).toFixed(precision);
        }

        return value.toFixed(precision);
    }
};

})();

/**
 * Utility method for validating that a value is numeric, returning the specified default value if it is not.
 * @param {Mixed} value Should be a number, but any type will be handled appropriately
 * @param {Number} defaultValue The value to return if the original value is non-numeric
 * @return {Number} Value, if numeric, else defaultValue
 */
Ext.num = function(v, defaultValue) {
    v = Number(Ext.isEmpty(v) || Ext.isArray(v) || typeof v === 'boolean' || (typeof v === 'string' && Ext.String.trim(v).length === 0) ? NaN : v);
    return isNaN(v) ? defaultValue : v;
};

/**
 * @class Ext.Array
 *
 * A set of useful static methods to deal with arrays; provide missing methods for older browsers
 * @singleton
 */
(function() {

    var arrayPrototype = Array.prototype,
        supportsForEach = 'forEach' in arrayPrototype,
        supportsMap = 'map' in arrayPrototype,
        supportsIndexOf = 'indexOf' in arrayPrototype,
        supportsEvery = 'every' in arrayPrototype,
        supportsSome = 'some' in arrayPrototype,
        supportsFilter = 'filter' in arrayPrototype;

    Ext.Array = {
        /**
         * Iterates an array calling the supplied function.
         * @param {Array/NodeList/Mixed} array The array to be iterated. If this
         * argument is not really an array, the supplied function is called once.
         * @param {Function} fn The function to be called with each item. If the
         * supplied function returns false, iteration stops and this method returns
         * the current <tt>index</tt>. This function is called with
         * the following arguments:
         * <ul>
         * <li><tt>item</tt> : <i>Mixed</i> The item at the current <tt>index</tt> in the passed <tt>array</tt></li>
         * <li><tt>index</tt> : <i>Number</i> The current index within the array</li>
         * <li><tt>allItems</tt> : <i>Array</i> The <tt>array</tt> passed as the first
         * argument to <tt>Ext.each</tt>.</li>
         * </ul>
         * @param {Object} scope The scope (<tt>this</tt> reference) in which the specified function is executed.
         * Defaults to the <tt>item</tt> at the current <tt>index</tt>
         * within the passed <tt>array</tt>.
         * @return {Boolean} See description for the fn parameter.
         */
        each: function(array, fn, scope) {
            if (Ext.isEmpty(array, true)) {
                return 0;
            }

            if (!Ext.isIterable(array) || Ext.isPrimitive(array)) {
                array = [array];
            }

            for (var i = 0, len = array.length; i < len; i++) {
                if (fn.call(scope || array[i], array[i], i, array) === false) {
                    return i;
                }
            }

            return true;
        },

        /**
         * Executes the provided function (callback) once for each element present in the array.
         * Note that this will delegate to the native forEach method in Array.prototype if the current
         * browser supports it. It doesn't support breaking out of the iteration by returning false
         * in the callback function like {@link Ext.Array#each}. Use this method when you don't need
         * that feature for a <b>huge</b> performance boost on modern browsers
         *
         * @param {Array} array The array to loop through
         * @param {Function} fn The function callback, to be invoked with three arguments: the value of the element,
         * the index of the element, and the Array object being traversed.
         * @param {Object} scope The scope (<code>this</code> reference) in which the specified function is executed.
         */
        forEach: function(array, fn, scope) {
            if (supportsForEach) {
                return array.forEach(fn, scope);
            }

            return Ext.Array.each(array, fn, scope);
        },

        /**
         * Get the index of the provided <code>item</code> in the given <code>array</code>, a supplement for the
         * missing Array.prototype.indexOf in Internet Explorer.
         *
         * @param {Array} array The array to check
         * @param {Mixed} item The item to look for
         * @param {Number} from (Optional) The index at which to begin the search
         * @return {Number} The index of item in the array (or -1 if it is not found)
         */
        indexOf: function(array, item, from) {
            if (supportsIndexOf) {
                return array.indexOf(item, from);
            }

            var i, length = array.length;

            for (i = (from < 0) ? Math.max(0, length + from) : from || 0; i < length; i++) {
                if (array[i] === item) {
                    return i;
                }
            }

            return -1;
        },

        /**
         * Checks whether or not the given <code>array</code> contains the specified <code>item</code>
         *
         * @param {Array} array The array to check
         * @param {Mixed} item The item to look for
         * @return {Boolean} True if the array contains the item, false otherwise
         */
        contains: function(array, item) {
            return (Ext.Array.indexOf(array, item) !== -1);
        },

        /**
         * Converts any iterable (numeric indices and a length property) into a true array
         * Don't use this on strings. IE doesn't support "abc"[0] which this implementation depends on.
         * For strings, use this instead: <code>"abc".match(/./g) => [a,b,c];</code>
         *
         * @param {Iterable} array the iterable object to be turned into a true Array.
         * @param {Number} start a number that specifies where to start the selection.
         * @param {Number} end a number that specifies where to end the selection.
         * @return {Array} array
         */
        toArray: function(array, start, end) {
            return Array.prototype.slice.call(array, start || 0, end || array.length);
        },

        /**
         * Plucks the value of a property from each item in the Array
         * Example:
         * <pre><code>
         * Ext.pluck(Ext.query("p"), "className"); // [el1.className, el2.className, ..., elN.className]
         * </code></pre>
         *
         * @param {Array|NodeList} arr The Array of items to pluck the value from.
         * @param {String} prop The property name to pluck from each element.
         * @return {Array} The value from each item in the Array.
         */
        pluck: function(arr, prop) {
            var ret = [];
            Ext.each(arr, function(v) {
                ret.push(v[prop]);
            });
            return ret;
        },

        /**
         * Creates a new array with the results of calling a provided function on every element in this array.
         * @param {Array} array
         * @param {Function} fn Callback function for each item
         * @param {Object} scope Callback function scope
         * @return {Array} results
         */
        map: function(array, fn, scope) {
            if (!fn) {
                throw new Error("[Ext.Array.map] fn must be a valid callback function");
            }

            if (supportsMap) {
                return array.map(fn, scope);
            }

            var results = [],
                i = 0,
                len = array.length;

            for (; i < len; i++) {
                if (i in array) {
                    results[i] = fn.call(scope, array[i], i, array);
                }
            }

            return results;
        },

        /**
         * Executes the specified function for each array element until the function returns a falsy value.
         * If such an item is found, the function will return false immediately.
         * Otherwise, it will return true.
         * @param {Array} array
         * @param {Function} fn Callback function for each item
         * @param {Object} scope Callback function scope
         * @return {Boolean} True if no false value is returned by the callback function.
         */
        every: function(array, fn, scope) {
            if (supportsEvery) {
                return array.every(fn, scope);
            }

            var i = 0,
                len = array.length;

            for (; i < len; ++i) {
                if (i in array && !fn.call(scope, array[i], i, array)) {
                    return false;
                }
            }
            return true;
        },

        /**
         * Executes the specified function for each array element until the function returns a truthy value.
         * If such an item is found, the function will return true immediately. Otherwise, it will return false.
         * @param {Array} array
         * @param {Function} fn Callback function for each item
         * @param {Object} scope Callback function scope
         * @return {Boolean} True if the callback function returns a truthy value.
         */
        some: function(array, fn, scope) {
            if (supportsSome) {
                return array.some(fn, scope);
            }

            var i = 0,
                len = array.length;

            for (; i < len; ++i) {
                if (i in array && fn.call(scope, array[i], i, array)) {
                    return true;
                }
            }
            return false;
        },

        /**
         * Filter through an array and remove empty item as defined in {@link Ext#isEmpty}
         * @see Ext.Array.filter
         * @param {Array} array
         * @return {Array} results
         */
        clean: function(array) {
            var results = [],
                i, ln, item;

            for (i = 0, ln = array.length; i < ln; i++) {
                item = array[i];

                if (!Ext.isEmpty(item)) {
                    results.push(item);
                }
            }

            return results;
        },

        /**
         * Returns a new array with unique items
         * @param {Array} array
         * @return {Array} results
         */
        unique: function(array) {
            var clone = [],
                me = Ext.Array;

            me.forEach(array, function(item) {
                if (!me.contains(clone, item)) {
                    clone.push(item);
                }
            });

            return clone;
        },

        /**
         * Creates a new array with all of the elements of this array for which
         * the provided filtering function returns true.
         * @param {Array} array
         * @param {Function} fn Callback function for each item
         * @param {Object} scope Callback function scope
         * @return {Array} results
         */
        filter: function(array, fn, scope) {
            if (!fn) {
                throw new Error("[Ext.Array.filter] fn must be a valid callback function");
            }

            if (supportsFilter) {
                return array.filter(fn, scope);
            }

            var results = [],
                i = 0,
                len = array.length;

            for (; i < len; i++) {
                if ((i in array) && fn.call(scope, array[i], i, array)) {
                    results.push(array[i]);
                }
            }

            return results;
        },

        /**
         * Converts a value to an array if it's not already an array
         *
         * @param {Array/Mixed} value The value to convert to an array if it is defined and not already an array.
         * @return {Array} array
         */
        from: function(value) {
            if (Ext.isIterable(value)) {
                return Ext.Array.toArray(value);
            }

            if (Ext.isDefined(value) && value !== null) {
                return [value];
            }

            return [];
        },

        /**
         * Removes the specified item from the array if it exists
         *
         * @param {Array} array The array
         * @param {Mixed} item The item to remove
         * @return {Array} The passed array itself
         */
        remove: function(array, item) {
            var index = Ext.Array.indexOf(array, item);

            if (index !== -1) {
                array.splice(index, 1);
            }

            return array;
        },

        /**
         * Push an item into the array only if the array doesn't contain it yet
         *
         * @param {Array} array The array
         * @param {Mixed} item The item to include
         * @return {Array} The passed array itself
         */
        include: function(array, item) {
            if (!Ext.Array.contains(array, item)) {
                array.push(item);
            }
        },

        /**
         * Clone a flat array without referencing the previous one. Note that this is different
         * from Ext.clone since it doesn't handle recursive cloning. Simply a convenient, easy-to-remember method
         * for Array.prototype.slice.call(array)
         *
         * @param {Array} array The array
         * @return {Array} The clone array
         */
        clone: function(array) {
            return arrayPrototype.slice.call(array);
        },

        /**
         * Merge multiple arrays into one with unique items. Alias to {@link Ext.Array#union}.
         *
         * @param {Array} array,...
         * @return {Array} merged
         */
        merge: function() {
            var me = Ext.Array,
                source = me.unique(arguments[0]),
                toMerge = arrayPrototype.slice.call(arguments, 1),
                i, j, ln, subLn, array;

            for (i = 0, ln = toMerge.length; i < ln; i++) {
                array = toMerge[i];

                for (j = 0, subLn = array.length; j < subLn; j++) {
                    me.include(source, array[j]);
                }
            }

            return source;
        },
        
        /**
         * Merge multiple arrays into one with unique items that exist in all of the arrays.
         * 
         * @param {Array} array,...
         * @return {Array} intersect
         */
        intersect: function() {
            var intersect = [],
                arrays = arrayPrototype.slice.call(arguments),
                i, j, k, minArray, array, x, y, ln, arraysLn, arrayLn;
                
            if (!arrays.length) {
                return intersect;
            }
            
            // Find the smallest array
            for (i = x = 0, ln = arrays.length; i < ln, array = arrays[i]; i++) {
                if (!minArray || array.length < minArray.length) {
                    minArray = array;
                    x = i;
                }
            }
            minArray = Ext.Array.unique(minArray);
            arrays.splice(x, 1);
            
            // Use the smallest unique'd array as the anchor loop. If the other array(s) do contain
            // an item in the small array, we're likely to find it before reaching the end
            // of the inner loop and can terminate the search early.
            for (i = 0, ln = minArray.length; i < ln, x = minArray[i]; i++) {
                var count = 0;
                
                for (j = 0, arraysLn = arrays.length; j < arraysLn, array = arrays[j]; j++) {
                    for (k = 0, arrayLn = array.length; k < arrayLn, y = array[k]; k++) {
                        if (x === y) {
                            count++;
                            break;
                        }
                    }
                }
                
                if (count == arraysLn) {
                    intersect.push(x);
                }
            }
            
            return intersect;
        },
        
        /**
         * Perform a set difference A-B by subtracting all items in array B from array A.
         * 
         * @param {Array} array A
         * @param {Array} array B
         * @return {Array} difference
         */
        difference: function(arrayA, arrayB) {
            var clone = Ext.Array.clone(arrayA),
                ln = clone.length,
                i, j, lnB;
            
            for (i = 0, lnB = arrayB.length; i < lnB; i++) {
                for (j = 0; j < ln; j++) {
                    if (clone[j] === arrayB[i]) {
                        clone.splice(j, 1);
                        j--;
                        ln--;
                    }
                }
            }
            
            return clone;
        }
    };
    
    /**
     * Merge multiple arrays into one with unique items. Alias to {@link Ext.Array#merge}.
     * 
     * @param {Array} array,...
     * @return {Array} union
     * @member Ext.Array
     * @method union
     */
    Ext.Array.union = Ext.Array.merge;

    Ext.deprecate('core', '4.0dev', function() {
        /**
         * This method is deprecated, use {@link Ext.Array#toArray} instead
         * @member Ext
         * @method toArray
         * @deprecated
         */
        Ext.toArray = function() {
            console.warn("[DEPRECATED][Ext.toArray] please use Ext.Array.toArray instead");

            return Ext.Array.toArray.apply(Ext.Array, arguments);
        };

        /**
         * This method is deprecated, Use {@link Ext.Array#pluck} instead
         * @member Ext
         * @method pluck
         * @deprecated
         */
        Ext.pluck = function(arr, prop) {
            console.warn("[DEPRECATED][Ext.pluck] please use Ext.Array.pluck instead");

            return Ext.Array.pluck.apply(Ext.Array, arguments);
        };
    });

})();

/**
 * @class Ext.Function
 *
 * A collection of useful static methods to deal with function callbacks
 * @singleton
 */

Ext.Function = {

    /**
     * A very commonly used method throughout the framework. It acts as a wrapper around another method
     * which originally accepts 2 arguments for <code>name</code> and <code>value</code>.
     * The wrapped function then allows "flexible" value setting of either:
     *
     * <ul>
     *      <li><code>name</code> and <code>value</code> as 2 arguments</li>
     *      <li>one single object argument with multiple key - value pairs</li>
     * </ul>
     *
     * For example:
     * <pre><code>
var setValue = Ext.Function.flexSetter(function(name, value) {
    this[name] = value;
});

// Afterwards
// Setting a single name - value
setValue('name1', 'value1');

// Settings multiple name - value pairs
setValue({
    name1: 'value1',
    name2: 'value2',
    name3: 'value3'
});
     * </code></pre>
     * @param {Function} setter
     * @returns {Function} flexSetter
     */
    flexSetter: function(fn) {
        return function(a, b) {
            var k, i;

            if (a === null) {
                return this;
            }

            if (typeof a !== 'string') {
                for (k in a) {
                    if (a.hasOwnProperty(k)) {
                        fn.call(this, k, a[k]);
                    }
                }

                if (Ext.enumerables) {
                    for (i = Ext.enumerables.length; i--;) {
                        k = Ext.enumerables[i];
                        if (a.hasOwnProperty(k)) {
                            fn.call(this, k, a[k]);
                        }
                    }
                }
            } else {
                fn.call(this, a, b);
            }

            return this;
        };
    },

   /**
     * Create a new function from the provided <code>fn</code>, change <code>this</code> to the provided scope, optionally
     * overrides arguments for the call. (Defaults to the arguments passed by the caller)
     *
     * @param {Function} fn The function to delegate.
     * @param {Object} scope (optional) The scope (<code><b>this</b></code> reference) in which the function is executed.
     * <b>If omitted, defaults to the browser window.</b>
     * @param {Array} args (optional) Overrides arguments for the call. (Defaults to the arguments passed by the caller)
     * @param {Boolean/Number} appendArgs (optional) if True args are appended to call args instead of overriding,
     * if a number the args are inserted at the specified position
     * @return {Function} The new function
     */
    bind: function(fn, scope, args, appendArgs) {
        var method = fn,
            applyArgs;

        return function() {
            var callArgs = args || arguments;
            if (appendArgs === true) {
                callArgs = Array.prototype.slice.call(arguments, 0);
                callArgs = callArgs.concat(args);
            } else if (Ext.isNumber(appendArgs)) {
                callArgs = Array.prototype.slice.call(arguments, 0); // copy arguments first
                applyArgs = [appendArgs, 0].concat(args); // create method call params
                Array.prototype.splice.apply(callArgs, applyArgs); // splice them in
            }

            return method.apply(scope || window, callArgs);
        };
    },

    /**
     * Creates a callback that passes arguments[0], arguments[1], arguments[2], ...
     * Call directly on any function. Example: <code>Ext.pass(myFunction, arg1, arg2)</code>
     * Will create a function that is bound to those 2 args. <b>If a specific scope is required in the
     * callback, use {@link Ext.Function#bind} instead.</b> The function returned by 'pass' always
     * executes in the window scope.
     * <p>This method is required when you want to pass arguments to a callback function.  If no arguments
     * are needed, you can simply pass a reference to the function as a callback (e.g., callback: myFn).
     * However, if you tried to pass a function with arguments (e.g., callback: myFn(arg1, arg2)) the function
     * would simply execute immediately when the code is parsed. Example usage:
    <pre><code>
var sayHi = function(name){
   alert('Hi, ' + name);
}

// clicking the button alerts "Hi, Fred"
new Ext.button.Button({
    text: 'Say Hi',
    renderTo: Ext.getBody(),
    handler: Ext.pass(sayHi, 'Fred')
});
     </code></pre>
     * @return {Function} The callback function bound to the passed arguments.
     */
    pass: function(fn, args, scope) {
        if (args) {
            args = Ext.Array.from(args);
        }

        return function() {
            return fn.apply(scope, args || arguments);
        };
    },

    /**
     * Create an alias to the provided method property with name <code>methodName</code> of <code>object</code>.
     * Note that the execution scope will still be bound to the provided <code>object</code> itself.
     *
     * @param {Object/Function} object
     * @param {String} methodName
     * @return {Function} aliasFn
     */
    alias: function(object, methodName) {
        return function() {
            return object[methodName].apply(object, arguments);
        };
    },

    /**
     * Creates an interceptor function. The passed function is called before the original one. If it returns false,
     * the original one is not called. The resulting function returns the results of the original function.
     * The passed function is called with the parameters of the original function. Example usage:
     * <pre><code>
var sayHi = function(name){
    alert('Hi, ' + name);
}

sayHi('Fred'); // alerts "Hi, Fred"

// create a new function that validates input without
// directly modifying the original function:
var sayHiToFriend = Ext.Function.createInterceptor(sayHi, function(name){
    return name == 'Brian';
});

sayHiToFriend('Fred');  // no alert
sayHiToFriend('Brian'); // alerts "Hi, Brian"
     </code></pre>
     * @param {Function} origFn The original function.
     * @param {Function} newFn The function to call before the original
     * @param {Object} scope (optional) The scope (<code><b>this</b></code> reference) in which the passed function is executed.
     * <b>If omitted, defaults to the scope in which the original function is called or the browser window.</b>
     * @param {Mixed} returnValue (optional) The value to return if the passed function return false (defaults to null).
     * @return {Function} The new function
     */
    createInterceptor: function(origFn, newFn, scope, returnValue) {
        var method = origFn;
        if (!Ext.isFunction(newFn)) {
            return origFn;
        }
        else {
            return function() {
                var me = this,
                    args = arguments;
                newFn.target = me;
                newFn.method = origFn;
                return (newFn.apply(scope || me || window, args) !== false) ? origFn.apply(me || window, args) : returnValue || null;
            };
        }
    },

    /**
     * Calls this function after the number of millseconds specified, optionally in a specific scope. Example usage:
     * <pre><code>
var sayHi = function(name){
    alert('Hi, ' + name);
}

// executes immediately:
sayHi('Fred');

// executes after 2 seconds:
Ext.Function.defer(sayHi, 2000, this, ['Fred']);

// this syntax is sometimes useful for deferring
// execution of an anonymous function:
Ext.Function.defer(function(){
    alert('Anonymous');
}, 100);
     </code></pre>
     * @param {Function} fn The function to defer.
     * @param {Number} millis The number of milliseconds for the setTimeout call (if less than or equal to 0 the function is executed immediately)
     * @param {Object} scope (optional) The scope (<code><b>this</b></code> reference) in which the function is executed.
     * <b>If omitted, defaults to the browser window.</b>
     * @param {Array} args (optional) Overrides arguments for the call. (Defaults to the arguments passed by the caller)
     * @param {Boolean/Number} appendArgs (optional) if True args are appended to call args instead of overriding,
     * if a number the args are inserted at the specified position
     * @return {Number} The timeout id that can be used with clearTimeout
     */
    defer: function(fn, millis, obj, args, appendArgs) {
        fn = Ext.Function.bind(fn, obj, args, appendArgs);
        if (millis > 0) {
            return setTimeout(fn, millis);
        }
        fn();
        return 0;
    },


    /**
     * Create a combined function call sequence of the original function + the passed function.
     * The resulting function returns the results of the original function.
     * The passed function is called with the parameters of the original function. Example usage:
     *
     * <pre><code>
var sayHi = function(name){
    alert('Hi, ' + name);
}

sayHi('Fred'); // alerts "Hi, Fred"

var sayGoodbye = Ext.Function.createSequence(sayHi, function(name){
    alert('Bye, ' + name);
});

sayGoodbye('Fred'); // both alerts show
     * </code></pre>
     *
     * @param {Function} origFn The original function.
     * @param {Function} newFn The function to sequence
     * @param {Object} scope (optional) The scope (this reference) in which the passed function is executed.
     * If omitted, defaults to the scope in which the original function is called or the browser window.
     * @return {Function} The new function
     */
    createSequence: function(origFn, newFn, scope) {
        if (!Ext.isFunction(newFn)) {
            return origFn;
        }
        else {
            return function() {
                var retval = origFn.apply(this || window, arguments);
                newFn.apply(scope || this || window, arguments);
                return retval;
            };
        }
    },

    /**
     * <p>Creates a delegate function, optionally with a bound scope which, when called, buffers
     * the execution of the passed function for the configured number of milliseconds.
     * If called again within that period, the impending invocation will be canceled, and the
     * timeout period will begin again.</p>
     *
     * <p>The resulting function is also an instance of {@link Ext.util.DelayedTask}, and so
     * therefore implements the <code>{@link Ext.util.DelayedTask#cancel cancel}</code> and
     * <code>{@link Ext.util.DelayedTask#delay delay}</code> methods.</p>
     *
     * @param {Function} fn The function to invoke on a buffered timer.
     * @param {Number} buffer The number of milliseconds by which to buffer the invocation of the
     * function.
     * @param {Object} scope (optional) The scope (<code><b>this</b></code> reference) in which
     * the passed function is executed. If omitted, defaults to the scope specified by the caller.
     * @param {Array} args (optional) Override arguments for the call. Defaults to the arguments
     * passed by the caller.
     * @return {Function} A function which invokes the passed function after buffering for the specified time.
     */
    createBuffered: function(fn, buffer, scope, args) {
        var task = fn.task || (fn.task = new Ext.util.DelayedTask());
        return Ext.apply(function() {
            task.delay(buffer, fn, scope || this, args || Ext.toArray(arguments));
        }, task);
    },

    /**
     * <p>Creates a throttled version of the passed function which, when called repeatedly and
     * rapidly, invokes the passed function only after a certain interval has elapsed since the
     * previous invocation.</p>
     *
     * <p>This is useful for wrapping functions which may be called repeatedly, such as
     * a handler of a mouse move event when the processing is expensive.</p>
     *
     * @param fn {Function} The function to execute at a regular time interval.
     * @param interval {Number} The interval <b>in milliseconds</b> on which the passed function is executed.
     * @param scope (optional) The scope (<code><b>this</b></code> reference) in which
     * the passed function is executed. If omitted, defaults to the scope specified by the caller.
     * @returns {Function} A function which invokes the passed function at the specified interval.
     */
    createThrottled: function(fn, interval, scope) {
        var lastCallTime, elapsed, lastArgs, timer, execute = function() {
            fn.apply(scope || this, lastArgs);
            lastCallTime = new Date().getTime();
        };

        return function() {
            elapsed = new Date().getTime() - lastCallTime;
            lastArgs = arguments;

            clearTimeout(timer);
            if (!lastCallTime || (elapsed >= interval)) {
                execute();
            } else {
                timer = setTimeout(execute, interval - elapsed);
            }
        };
    }
};

/**
 * Shorthand for {@link Ext.Function#defer}
 * @member Ext
 * @method defer
 */
Ext.defer = Ext.Function.alias(Ext.Function, 'defer');

/**
 * Shorthand for {@link Ext.Function#pass}
 * @member Ext
 * @method pass
 */
Ext.pass = Ext.Function.alias(Ext.Function, 'pass');

/**
 * Shorthand for {@link Ext.Function#bind}
 * @member Ext
 * @method bind
 */
Ext.bind = Ext.Function.alias(Ext.Function, 'bind');

Ext.deprecate('core', '4.0dev', function() {

    /**
     * Shorthand for {@link Ext.Function#createDelegate}
     * @param {Function} fn The function to delegate.
     * @param {Object} scope (optional) The scope (<code><b>this</b></code> reference) in which the function is executed.
     * <b>If omitted, defaults to the browser window.</b>
     * @param {Array} args (optional) Overrides arguments for the call. (Defaults to the arguments passed by the caller)
     * @param {Boolean/Number} appendArgs (optional) if True args are appended to call args instead of overriding,
     * if a number the args are inserted at the specified position
     * @return {Function} The new function
     * @member Ext
     * @method createDelegate
     * @deprecated
     */
    Ext.createDelegate = function() {
        if (Ext.isDefined(window.console)) {
            console.warn("[DEPRECATED][Ext.createDelegate] Use Ext.bind instead");
        }
        return Ext.Function.bind.apply(Ext.Function, arguments);
    };

    Ext.createCallback = function() {
        if (Ext.isDefined(window.console)) {
            console.warn("[DEPRECATED][Ext.createCallback] Use Ext.pass instead");
        }
        return Ext.Function.pass.apply(Ext.Function, arguments);
    };


    /**
     * Shorthand for {@link Ext.Function#createInterceptor}
     * @param {Function} origFn The original function.
     * @param {Function} newFn The function to call before the original
     * @param {Object} scope (optional) The scope (<code><b>this</b></code> reference) in which the passed function is executed.
     * <b>If omitted, defaults to the scope in which the original function is called or the browser window.</b>
     * @return {Function} The new function
     * @member Ext
     * @method createInterceptor
     * @deprecated
     */
    Ext.createInterceptor = function() {
        if (Ext.isDefined(window.console)) {
            console.warn("[DEPRECATED][Ext.createInterceptor] Use Ext.Function.createInterceptor instead");
        }
        return Ext.Function.createInterceptor.apply(Ext.Function, arguments);
    };

    /**
     * Shorthand for {@link Ext.Function#createSequence}
     * @param {Function} origFn The original function.
     * @param {Function} newFn The function to sequence
     * @param {Object} scope (optional) The scope (this reference) in which the passed function is executed.
     * If omitted, defaults to the scope in which the original function is called or the browser window.
     * @return {Function} The new function
     * @member Ext
     * @method createSequence
     * @deprecated
     */
    Ext.createSequence = function() {
        if (Ext.isDefined(window.console)) {
            console.warn("[DEPRECATED][Ext.createSequence] Use Ext.Function.createSequence instead");
        }
        return Ext.Function.createSequence.apply(Ext.Function, arguments);
    };

});

/**
 * @class Ext.Object
 *
 * A collection of useful static methods to deal with objects
 * @singleton
 */

Ext.Object = {

    /**
     * Takes an object and converts it to an encoded URL.
     * <pre><code>
Ext.Object.toQueryString({foo: 1, bar: 2}); // returns "foo=1&bar=2"
     * </code></pre>
     * Optionally, property values can be arrays, instead of keys and the resulting string that's returned
     * will contain a name/value pair for each array value.
     *
     * @param {Object} object The object to encode
     * @param {String} pre (optional) A prefix to add to the url encoded string
     * @return {String}
     */
    toQueryString: function(object, pre) {
        var encode = window.encodeURIComponent,
            buf = [],
            empty = Ext.isEmpty,
            result;

        Ext.iterate(object, function(key, item){
            if (!empty(item)) {
                Ext.each(item, function(val){
                    result = '';
                    if (!empty(val)) {
                        result = Ext.isDate(val) ? Ext.JSON.encode(val).replace(/"/g, '') : encode(val);
                    }
                    buf.push('&', encode(key), '=', result);
                });
            } else {
                buf.push('&', encode(key), '=');
            }
        });

        if (!pre) {
            buf.shift();
            pre = '';
        }

        return pre + buf.join('');
    },

    /**
     * Iterate through an object
     *
     * @param {Object} obj The object to iterate
     * @param {Function} fn The callback function. Passed arguments for each iteration are:
     * <ul>
     * <li><tt>{String}</tt> key</li>
     * <li><tt>{Mixed}</tt> value</li>
     * <li><tt>{Object}</tt> object The object itself</li>
     * </ul>
     * @param {Object} scope The execution scope (<tt>this</tt>) of the callback function
     */
    each: function(obj, fn, scope) {
        var prop;

        scope = scope || obj;

        for (prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                if (fn.call(scope || obj, prop, obj[prop], obj) === false) {
                    return;
                }
            }
        }
    },

    /**
     * Merges any number of objects recursively without referencing them or their children.
     * @param {Object} source,...
     * @return {Object} merged The object that is created as a result of merging all the objects passed in.
     */
    merge: function(source, key, value) {
        if (Ext.isString(key)) {
            if (Ext.isObject(value) && Ext.isObject(source[key])) {
                if (value.constructor === Object) {
                    Ext.Object.merge(source[key], value);
                } else {
                    source[key] = value;
                }
            }
            else if (Ext.isObject(value) && value.constructor !== Object){
                source[key] = value;
            }
            else {
                source[key] = Ext.clone(value);
            }

            return source;
        }

        var i = 1,
            len = arguments.length,
            obj, prop;

        for (; i < len; i++) {
            obj = arguments[i];
            for (prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    Ext.Object.merge(source, prop, obj[prop]);
                }
            }
        }

        return source;
    },

    /**
     * Finds the first matching key that has a particular value. Uses strict type matching.
     * If no value is found, null is returned.
     * @param {Object} object
     * @param {Object} value The value to find
     */
    keyOf: function(object, value) {
        for (var prop in object) {
            if (object.hasOwnProperty(prop) && object[prop] === value) {
                return prop;
            }
        }
        return null;
    },

    /**
     * Gets a list of values from the passed object.
     * @param {Object} object
     * @return {Array} An array of values from the object
     */
    getValues: function(object) {
        var values = [], prop;

        for (prop in object) {
            if (object.hasOwnProperty(prop)) {
                values.push(object[prop]);
            }
        }
        return values;
    },

    /**
     * Gets a list of keys from the passed object.
     * @param {Object} object
     * @return {Array} An array of keys from the object
     */
    getKeys: function(object) {
        var keys = [], prop;

        for (prop in object) {
            if (object.hasOwnProperty(prop)) {
                keys.push(prop);
            }
        }
        return keys;
    },

    /**
     * Gets the total number of properties of this object
     * @param {Object} object
     * @return {Number} size
     */
    getSize: function(object) {
        var size = 0, prop;

        for (prop in object) {
            if (object.hasOwnProperty(prop)) {
                size++;
            }
        }

        return size;
    }
};


/**
 * A convenient alias method for {@link Ext.Object#merge}
 * @member Ext
 * @method merge
 */
Ext.merge = function() {
    return Ext.Object.merge.apply(Ext.Object, arguments);
};

//Ext.deprecate('core', '4.0dev', function() {
//    Ext.urlEncode = function() {
//        console.warn("[DEPRECATED][core][4.0dev][Ext.urlEncode] please use Ext.Object.toQueryString instead");
//        return Ext.Object.toQueryString.apply(Ext.Object, arguments);
//    };
//});

/**
 * @class Ext.Date
 *
 * A set of useful static methods to deal with date
 * @singleton
 */

/*
 * Note that if Ext.util.Date is required and loaded, it will copy all methods / properties to
 * this object, for convenience
 */
Ext.Date = {
    /**
     * Returns the current timestamp
     * @return {Date} The current timestamp
     */
    now: Date.now || function() {
        return +new Date();
    },

    /**
     * Returns the number of milliseconds between two dates
     * @param {Date} dateA
     * @param {Date} dateB (optional) Defaults to now
     * @return {Number} The diff in milliseconds
     */
    getElapsed: function(dateA, dateB) {
        return Math.abs(dateA - (dateB || new Date()));
    }
};

/**
 * @author Jacky Nguyen
 * @class Ext.Base
 *
 * The root of all classes created with {@link Ext#define}
 * All prototype and static properties of this class are inherited by any other class
 *
 */
(function(flexSetter) {

var Base = Ext.Base = function() {};
    Base.prototype = {
        $className: 'Ext.Base',

        $class: Base,

        /**
         * Get the reference to the current class from which this object was instantiated. Unlike {@link Ext.Base#statics},
         * `this.self` is scope-dependent and it's meant to be used for dynamic inheritance. See {@link Ext.Base#statics}
         * for a detailed comparison

    Ext.define('My.Cat', {
        statics: {
            speciciesName: 'Cat' // My.Cat.speciciesName = 'Cat'
        },

        constructor: function() {
            alert(this.self.speciciesName); / dependent on 'this'

            return this;
        },

        clone: function() {
            return new this.self();
        }
    });


    Ext.define('My.SnowLeopard', {
        extend: 'My.Cat',
        statics: {
            speciciesName: 'Snow Leopard' // My.SnowLeopard.speciciesName = 'Snow Leopard'
        }
    });

    var kitty = new My.Cat();           // alerts 'Cat'
    var katty = new My.SnowLeopard();   // alerts 'Snow Leopard'

    var cutie = katty.clone();
    alert(Ext.getClassName(cutie));     // alerts 'My.SnowLeopard'

         * @type Class
         * @protected
         * @markdown
         */
        self: Base,

        /**
         * Default constructor, simply returns `this`
         * @constructor
         * @protected
         * @return {Object} this
         */
        constructor: function() {
            return this;
        },

        /**
         * Initialize configuration for this class. a typical example:

    Ext.define('My.awesome.Class', {
        // The default config
        config: {
            name: 'Awesome',
            isAwesome: true
        },

        constructor: function(config) {
            this.initConfig(config);

            return this;
        }
    });

    var awesome = new My.awesome.Class({
        name: 'Super Awesome'
    });

    alert(awesome.getName()); // 'Super Awesome'

         * @protected
         * @param {Object} config
         * @return {Object} mixins The mixin prototypes as key - value pairs
         */
        initConfig: function(config) {
            if (!this.$configInited) {
                this.config = Ext.Object.merge({}, this.config || {}, config || {});

                this.applyConfig(this.config);

                this.$configInited = true;
            }

            return this;
        },

        /**
         * @private
         */
        setConfig: function(config) {
            this.applyConfig(config || {});

            return this;
        },

        /**
         * @private
         */
        applyConfig: flexSetter(function(name, value) {
            var setter = 'set' + Ext.String.capitalize(name);

            if (typeof this[setter] === 'function') {
                this[setter].call(this, value);
            }

            return this;
        }),

        /**
         * @deprecated
         * @ignore
         */
        parent: function(args) {
            if (Ext.isDefined(Ext.global.console)) {
                console.warn("[" + this.parent.caller.displayName + "] this.parent is deprecated. " +
                             "Please use this.callParent instead.");
            }

            return this.callParent.apply(this, arguments);
        },

        /**
         * Call the overridden superclass' method. For example:

    Ext.define('My.own.A', {
        constructor: function(test) {
            alert(test);
        }
    });

    Ext.define('My.own.B', {
        constructor: function(test) {
            alert(test);

            this.callParent([test + 1]);
        }
    });

    var a = new My.own.A(1); // alerts '1'
    var b = new My.own.B(1); // alerts '1', then alerts '2'

         * @protected
         * @param {Array/Arguments} args The arguments, either an array or the `arguments` object
         * from the current method, for example: `this.callParent(arguments)`
         * @return {Mixed} Returns the result from the superclass' method
         * @markdown
         */
        callParent: function(args) {
            var method = this.callParent.caller,
                parentClass, methodName;

            if (!method.$owner) {
                if (!method.caller) {
                    throw new Error("[" + Ext.getClassName(this) + "#callParent] Calling a protected method from the " +
                                    "public scope");
                }

                method = method.caller;
            }

            parentClass = method.$owner.superclass;
            methodName = method.$name;

            if (!(methodName in parentClass)) {
                throw new Error("[" + Ext.getClassName(this) + "#" + methodName + "] this.parent was called but there's no " +
                                "such method (" + methodName + ") found in the parent class (" +
                                (Ext.getClassName(parentClass) || 'Object') + ")");
            }
            return parentClass[methodName].apply(this, args || []);
        },


        /**
         * Get the reference to the class from which this object was instantiated. Note that unlike {@link Ext.Base#self},
         * `this.statics()` is scope-independent and it always returns the class from which it was called, regardless of what
         * `this` points to during runtime

    Ext.define('My.Cat', {
        statics: {
            speciciesName: 'Cat' // My.Cat.speciciesName = 'Cat'
        },

        constructor: function() {
            alert(this.statics().speciciesName); // always equals to 'Cat' no matter what 'this' refers to
                                                 // equivalent to: My.Cat.speciciesName

            alert(this.self.speciciesName);      // dependent on 'this'

            return this;
        },

        clone: function() {
            var cloned = new this.self;                      // dependent on 'this'

            cloned.groupName = this.statics().speciciesName; // equivalent to: My.Cat.speciciesName

            return cloned;
        }
    });


    Ext.define('My.SnowLeopard', {
        statics: {
            speciciesName: 'Snow Leopard' // My.SnowLeopard.speciciesName = 'Snow Leopard'
        },

        constructor: function() {
            this.callParent();
        }
    });

    var kitty = new My.Cat();         // alerts 'Cat', then alerts 'Cat'

    var katty = new My.SnowLeopard(); // alerts 'Cat', then alerts 'Snow Leopard'

    var cutie = kitty.clone();
    alert(Ext.getClassName(cutie));   // alerts 'My.SnowLeopard'
    alert(cutie.groupName);           // alerts 'Cat'

         * @protected
         * @return {Class}
         * @markdown
         */
        statics: function() {
            var method = this.statics.caller,
                self = this.self;

            if (!method) {
                return self;
            }

            return method.$owner;
        },

        /**
         * Call the original method that was previously overridden with {@link Ext.Base#override}

    Ext.define('My.Cat', {
        constructor: function() {
            alert("I'm a cat!");

            return this;
        }
    });

    My.Cat.override({
        constructor: function() {
            alert("I'm going to be a cat!");

            var instance = this.callOverridden();

            alert("Meeeeoooowwww");

            return instance;
        }
    });

    var kitty = new My.Cat(); // alerts "I'm going to be a cat!"
                              // alerts "I'm a cat!"
                              // alerts "Meeeeoooowwww"

         * @param {Array/Arguments} args The arguments, either an array or the `arguments` object
         * @return {Mixed} Returns the result after calling the overridden method
         * @markdown
         */
        callOverridden: function(args) {
            var method = this.callOverridden.caller;

            if (!method.$owner) {
                throw new Error("[" + Ext.getClassName(this) + "#callOverridden] Calling a protected method from the " +
                                "public scope");
            }

            if (!method.$previous) {
                throw new Error("[" + Ext.getClassName(this) + "] this.callOverridden was called in '" + method.$name +
                                "' but this method has never been overridden");
            }

            return method.$previous.apply(this, args || []);
        },

        destroy: function() {}
    };

    // These static properties will be copied to every newly created class with {@link Ext#define}
    Ext.apply(Ext.Base, {

        /**
         * @private
         */
        ownMethod: flexSetter(function(name, fn) {
            var originalFn, className;

            if (fn === Ext.emptyFn) {
                this.prototype[name] = fn;
                return;
            }

            if (fn.$isOwned) {
                originalFn = fn;

                fn = function() {
                    return originalFn.apply(this, arguments);
                };
            }

            className = Ext.getClassName(this);
            if (className) {
                fn.displayName = className + '#' + name;
            }
            fn.$owner = this;
            fn.$name = name;
            fn.$isOwned = true;

            this.prototype[name] = fn;
        }),

        /**
         * @private
         */
        borrowMethod: flexSetter(function(name, fn) {
            if (!fn.$isOwned) {
                this.ownMethod(name, fn);
            }
            else {
                this.prototype[name] = fn;
            }
        }),

        /**
         * Add / override static properties of this class. This method is a {@link Ext.Function#flexSetter flexSetter}.
         * It can either accept an object of key - value pairs or 2 arguments of name - value.

    Ext.define('My.cool.Class', {
        ...
    });

    My.cool.Class.extend({
        someProperty: 'someValue',      // My.cool.Class.someProperty = 'someValue'
        method1: function() { ... },    // My.cool.Class.method1 = function() { ... };
        method2: function() { ... }     // My.cool.Class.method2 = function() { ... };
    });

    My.cool.Class.extend('method3', function(){ ... }); // My.cool.Class.method3 = function() { ... };

         * @property extend
         * @static
         * @type Function
         * @param {String/Object} name See {@link Ext.Function#flexSetter flexSetter}
         * @param {Mixed} value See {@link Ext.Function#flexSetter flexSetter}
         * @markdown
         */
        extend: flexSetter(function(name, value) {
            this[name] = value;
        }),

        /**
         * Add / override prototype properties of this class. This method is a {@link Ext.Function#flexSetter flexSetter}.
         * It can either accept an object of key - value pairs or 2 arguments of name - value.

    Ext.define('My.cool.Class', {
        ...
    });

    // Object with key - value pairs
    My.cool.Class.implement({
        someProperty: 'someValue',
        method1: function() { ... },
        method2: function() { ... }
    });

    var cool = new My.cool.Class();
    alert(cool.someProperty); // alerts 'someValue'
    cool.method1();
    cool.method2();

    // name - value arguments
    My.cool.Class.implement('method3', function(){ ... });
    cool.method3();

         * @property implement
         * @static
         * @type Function
         * @param {String/Object} name See {@link Ext.Function#flexSetter flexSetter}
         * @param {Mixed} value See {@link Ext.Function#flexSetter flexSetter}
         */
        implement: flexSetter(function(name, value) {
            if (Ext.isObject(this.prototype[name]) && Ext.isObject(value)) {
                Ext.Object.merge(this.prototype[name], value);
            }
            else if (Ext.isFunction(value)) {
                this.ownMethod(name, value);
            }
            else {
                this.prototype[name] = value;
            }
        }),

        /**
         * Add / override prototype properties of this class. This method is similar to {@link Ext.Base#implement implement},
         * except that it stores the reference of the overridden method which can be called later on via {@link Ext.Base#callOverridden}
         *
         * @property override
         * @static
         * @type Function
         * @param {String/Object} name See {@link Ext.Function#flexSetter flexSetter}
         * @param {Mixed} value See {@link Ext.Function#flexSetter flexSetter}
         */
        override: flexSetter(function(name, value) {
            if (Ext.isObject(this.prototype[name]) && Ext.isObject(value)) {
                Ext.Object.merge(this.prototype[name], value);
            }
            else if (Ext.isFunction(this.prototype[name]) && Ext.isFunction(value)) {
                var previous = this.prototype[name];

                this.ownMethod(name, value);
                this.prototype[name].$previous = previous;
            }
            else {
                this.prototype[name] = value;
            }
        }),

       /**
         * Used internally by the mixins pre-processor
         * @private
         */
        mixin: flexSetter(function(name, cls) {
            var mixinPrototype = cls.prototype,
                myPrototype = this.prototype,
                i;

            for (i in mixinPrototype) {
                if (mixinPrototype.hasOwnProperty(i)) {
                    if (myPrototype[i] === undefined) {
                        if (Ext.isFunction(mixinPrototype[i])) {
                            this.borrowMethod(i, mixinPrototype[i]);
                        }
                        else {
                            myPrototype[i] = mixinPrototype[i];
                        }
                    }
                    else if (i === 'config' && Ext.isObject(myPrototype[i]) && Ext.isObject(mixinPrototype[i])) {
                        Ext.Object.merge(myPrototype[i], mixinPrototype[i]);
                    }
                }
            }

            if (!myPrototype.mixins) {
                myPrototype.mixins = {};
            }

            myPrototype.mixins[name] = mixinPrototype;
        }),

        /**
         * Create aliases for current prototype methods. Example:

    Ext.define('My.cool.Class', {
        method1: function() { ... },
        method2: function() { ... }
    });

    var test = new My.cool.Class();

    My.cool.Class.createAlias({
        method3: 'method1',
        method4: 'method2'
    });

    test.method3(); // test.method1()

    My.cool.Class.createAlias('method5', 'method3');

    test.method5(); // test.method3() -> test.method1()

         * @property createAlias
         * @static
         * @type Function
         * @param {String/Object} alias The new method name, or an object to set multiple aliases. See
         * {@link Ext.Function#flexSetter flexSetter}
         * @param {String/Object} origin The original method name
         * @markdown
         */
        createAlias: flexSetter(function(alias, origin) {
            this.prototype[alias] = this.prototype[origin];
        })
    });

})(Ext.Function.flexSetter);

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

            if (!Ext.isString(className)) {
                throw new Error("[Ext.ClassManager.exist] Invalid classname, must be a string");
            }

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
            if (!Ext.isString(namespace)) {
                throw new Error("[Ext.ClassManager.parseNamespace] namespace must be a string");
            }

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
                if (aliasToNameMap.hasOwnProperty(alias) && Ext.isDefined(window.console)) {
                    console.log("[Ext.ClassManager] Overriding already existed alias: '" + alias + "' " +
                                "of: '" + aliasToNameMap[alias] + "' with: '" + className + "'. Be sure it's intentional.");
                }

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

            if (!Ext.isString(className)) {
                throw new Error("[Ext.define] Invalid class name of: '" + className + "', must be a valid string");
            }

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

                if (!className) {
                    throw new Error("[Ext.ClassManager] Cannot create an instance of unrecognized alias: " + alias);
                }

                if (typeof window !== 'undefined' && Ext.isDefined(window.console)) {
                    console.warn("[Ext.Loader] Synchronously loading '" + className + "'; consider adding " +
                                 "Ext.require('" + alias + "') above Ext.onReady");
                }

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
                if ((!Ext.isString(name) || name.length < 1)) {
                    throw new Error("[Ext.create] Invalid class name or alias: '" + name + "', must be a valid string");

                }

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
                if (typeof window !== 'undefined' && Ext.isDefined(window.console)) {
                    console.warn("[Ext.Loader] Synchronously loading '" + name + "'; consider adding " +
                                 "Ext.require('" + ((possibleName) ? alias : name) + "') above Ext.onReady");
                }

                Ext.Loader.enableSyncMode(true);

                Ext.require(name, function() {
                    // Switch Ext.Loader back to async mode right after this class and all
                    // its dependencies have been resolved
                    Ext.Loader.triggerReady();
                    Ext.Loader.enableSyncMode(false);
                });

                cls = this.get(name);
            }

            if (!cls) {
                throw new Error("[Ext.ClassManager] Cannot create an instance of unrecognized class name / alias: " + alias);
            }

            if (!Ext.isFunction(cls)) {
                throw new Error("[Ext.create] '" + name + "' is a singleton and cannot be instantiated");
            }

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

            if (!Ext.isString(expression) || expression.length < 1) {
                throw new Error("[Ext.ClassManager.getNamesByExpression] expression must be a valid string");
            }

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

                if (!Ext.isString(alias)) {
                    throw new Error("[Ext.define] Invalid alias of: '" + alias + "' for class: '" + name + "'; must be a valid string");
                }

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

                if (!Ext.isString(alternate)) {
                    throw new Error("[Ext.define] Invalid alternate of: '" + alternate + "' for class: '" + name +
                                    "'; must be a valid string");
                }

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
            cls.displayName = cls.$className;
        }

        if (fn) {
            fn.call(this, cls, data);
        }

    }).insertDefaultPreprocessor('className', 'first');

})(Ext.Class, Ext.Function.alias);

/**
 * @author Jacky Nguyen
 * @class Ext.Loader
 *
 * Ext.Loader is the heart of the new dynamic dependency loading capability in Ext JS 4+. It is most commonly used
 * via the {@link Ext#require} shorthand
 *
 * <pre><code>
Ext.require([
    'widget.window',
    'widget.button',
    'layout.fit'
]);

Ext.onReady(function() {
    var window = Ext.widget('window', {
        width: 500,
        height: 300,
        layout: 'fit',
        items: {
            xtype: 'button',
            text: 'Hello World',
            handler: function() { alert(this.text) }
        }
    });

    window.show();
});
 * </code></pre>
 *
 * @singleton
 */

(function(Manager, Class, flexSetter) {

    var defaultClassPreprocessors = Class.getDefaultPreprocessors(),
        isNonBrowser = typeof window === 'undefined',
        isNodeJS = isNonBrowser && (typeof require === 'function'),
        Loader;

    Loader = Ext.Loader = {

        /**
         * Flag indicating whether there are still files being loaded
         * @private
         */
        isLoading: false,

        /**
         * Maintain the queue for all dependencies. Each item in the array is an object of the format:
         * {
         *      requires: [...], // The required classes for this queue item
         *      callback: function() { ... } // The function to execute when all classes specified in requires exist
         * }
         * @private
         */
        queue: [],

        /**
         * Maintain the list of files that have already been handled so that they never get double-loaded
         * @private
         */
        isFileLoaded: {},

        /**
         * Maintain the list of listeners to execute when all required scripts are fully loaded
         * @private
         */
        readyListeners: [],

        /**
         * Contains all class names that are ever required via {@link Ext.Loader#require}
         * @private
         */
        requireHistory: {},

        /**
         * Contains optional dependencies to be loaded last
         * @private
         */
        optionalRequires: [],

        /**
         * Map of fully qualified class names to an array of dependent classes.
         * @private
         */
        requiresMap: {},

        /**
         * @private
         */
        numPendingFiles: 0,

        /**
         * @private
         */
        numLoadedFiles: 0,

        /**
         * @private
         */
        classNameToFilePathMap: {},

        /**
         * An array of class names to keep track of the dependency loading order.
         * This is not guaranteed to be the same everytime due to the asynchronous
         * nature of the Loader.
         *
         * @property history
         * @type Array
         */
        history: [],

        /**
         * Configuration
         * @private
         */
        config: {
            /**
             * Whether or not to enable the dynamic dependency loading feature
             * Defaults to false
             * @cfg {Boolean} enabled
             */
            enabled: false,

            /**
             * Whether or not to enable automatic deadlock detection, very useful
             * during development
             * Defaults to true
             * @cfg {Boolean} enableDeadlockDetection
             */
            enableDeadlockDetection: true,

            /**
             * Whether or not to enable automatic deadlock detection, very useful
             * during development
             * Defaults to true
             * @cfg {Boolean} enableCacheBuster
             */
            enableCacheBuster: true,

            /**
             * The mapping from namespaces to file paths
             * <pre><code>
             * {
             *      'Ext': './src' // This is set by default, Ext.layout.Container will refer to ./src/layout/Container.js
             *      'My': './src/my_own_folder' // My.layout.Container will refer to ./src/my_own_folder/layout/Container.js
             * }
             * </code></pre>
             *
             * If not being specified, for example, <code>Other.awesome.Class</code>
             * will simply refer to <code>./Other/awesome/Class.js</code>
             * @cfg {Object} paths
             */
            paths: {
                'Ext': '.'
            }
        },

        /**
         * Set the configuration for the loader. This should be called right after ext-core.js
         * (or ext-core-debug.js) is included in the page, i.e:
         * <pre><code>
         * &lt;script type="text/javascript" src="ext-core-debug.js">&lt;/script>
         * &lt;script type="text/javascript">
         *      Ext.Loader.setConfig({
         *          enabled: true,
         *          paths: {
         *              'My': 'my_own_path'
         *          }
         *      });
         * &lt;/script>
         * &lt;script type="text/javascript">
         *      Ext.require(...);
         *
         *      Ext.onReady(function() {
         *          // application code here
         *      });
         * &lt;/script>
         * </code></pre>
         * Refer to {@link Ext.Loader#config} for the list of possible properties
         *
         * @param {Object} config The config object to override the default values in {@link Ext.Loader#config}
         * @return {Ext.Loader} this
         */
        setConfig: function(name, value) {
            if (Ext.isObject(name) && arguments.length === 1) {
                Ext.merge(this.config, name);
            }
            else {
                this.config[name] = (Ext.isObject(value)) ? Ext.merge(this.config[name], value) : value;
            }

            return this;
        },

        /**
         * Get the config value corresponding to the specified name. If no name is given, will return the config object
         * @param {String} name The config property name
         * @return {Object/Mixed}
         */
        getConfig: function(name) {
            if (name) {
                return this.config[name];
            }

            return this.config;
        },

        /**
         * Sets the path of a namespace.
         * For Example:
         *   Ext.Loader.setPath('Ext', '.');
         * Indicates that any classes with the top level object "Ext" will be found
         * at the root basePath.
         * @param {String/Object} name See {@link Ext.Function#flexSetter flexSetter}
         * @param {String} path See {@link Ext.Function#flexSetter flexSetter}
         */
        setPath: flexSetter(function(name, path) {
            this.config.paths[name] = path;

            return this;
        }),

        /**
         * Translates a className to a path to load the file from by prefixing
         * the proper prefix and converting the .'s to /'s.
         *
         * For example:
         *
         * <pre><code>
         * ("Ext.layout.Layout" => "./src/Ext/layout/Layout.js")
         *</code></pre>
         *
         * @param {String} className
         * @return {String} path
         */
        getPath: function(className) {
            var path = '',
                paths = this.config.paths,
                prefix, deepestPrefix = '';

            if (paths.hasOwnProperty(className)) {
                return paths[className];
            }

            for (prefix in paths) {
                if (paths.hasOwnProperty(prefix) && prefix === className.substring(0, prefix.length)) {
                    if (prefix.length > deepestPrefix.length) {
                        deepestPrefix = prefix;
                    }
                }
            }

            path += paths[deepestPrefix];
            className = className.substring(deepestPrefix.length + 1);

            path = path + "/" + className.replace(/\./g, "/") + '.js';
            path = path.replace(/\/\.\//g, '/');

            return path;
        },

        /**
         * Refresh all items in the queue. If all dependencies for an item exist during looping,
         * it will execute the callback and call refreshQueue again. Triggers onReady when the queue is
         * empty
         * @private
         */
        refreshQueue: function() {
            var ln = this.queue.length,
                i, item, j, requires;

            if (ln === 0) {
                this.triggerReady();
                return;
            }

            for (i = 0; i < ln; i++) {
                item = this.queue[i];

                if (item) {
                    requires = item.requires;

                    // Don't bother checking when the number of files loaded
                    // is still less than the array length
                    if (requires.length > this.numLoadedFiles) {
                        continue;
                    }

                    j = 0;

                    do {
                        if (Manager.exist(requires[j])) {
                            requires.splice(j, 1);
                        }
                        else {
                            j++;
                        }
                    } while (j < requires.length);

                    if (item.requires.length === 0) {
                        this.queue.splice(i, 1);
                        item.callback.call(item.scope);
                        this.refreshQueue();
                        break;
                    }
                }
            }
        },

        /**
         * @private
         */
        injectScriptElement: function(url, onLoad, onError, scope) {
            var script = document.createElement('script'),
                head = document.head || document.getElementsByTagName('head')[0],
                isLoaded = false,
                onLoadFn = function() {
                    if (!isLoaded) {
                        isLoaded = true;
                        onLoad.call(scope);
                    }
                };

            Ext.apply(script, {
                type: 'text/javascript',
                src: url,
                onload: onLoadFn,
                onerror: onError,
                onreadystatechange: function() {
                    if (this.readyState === 'loaded' || this.readyState === 'complete') {
                        onLoadFn();
                    }
                }
            });

            head.appendChild(script);

            return script;
        },

        /**
         * Load a script file, supports both asynchronous and synchronous approaches
         * @param {String} url
         * @param {Function} onLoad
         * @param {Scope} scope
         * @param {Boolean} synchronous
         * @private
         */
        loadScriptFile: function(url, onLoad, scope, synchronous) {
            var me = this,
                noCacheUrl = url + (this.getConfig('enableCacheBuster') ? '?' + Ext.Date.now() : ''),
                fileName = url.split('/').pop(),
                xhr, status, onScriptError;

            scope = scope || this;

            this.isLoading = true;

            if (!synchronous) {
                onScriptError = function() {
                    me.onFileLoadError.call(me, {
                        message: "Failed loading '" + url + "', please verify that it exists",
                        url: url,
                        synchronous: false
                    });
                };

                if (!Ext.isReady && Ext.onDocumentReady) {
                    Ext.onDocumentReady(function() {
                        me.injectScriptElement(noCacheUrl, onLoad, onScriptError, scope);
                    });
                }
                else {
                    this.injectScriptElement(noCacheUrl, onLoad, onScriptError, scope);
                }
            }
            else {
                if (typeof XMLHttpRequest !== 'undefined') {
                    xhr = new XMLHttpRequest();
                } else {
                    xhr = new ActiveXObject('Microsoft.XMLHTTP');
                }

                xhr.open('GET', noCacheUrl, false);
                xhr.send(null);

                status = (xhr.status === 1223) ? 204 : xhr.status;

                if (status >= 200 && status < 300) {
                    // Firebug friendly, file names are still shown even though they're eval'ed code
                    new Function(xhr.responseText + "\n//@ sourceURL=" + fileName)();

                    onLoad.call(scope);
                }
                else {
                    this.onFileLoadError.call(this, {
                        message: "Failed loading synchronously via XHR: '" + url + "'; please " +
                                 "verify that the file exists. " +
                                 "XHR status code: " + status,
                        url: url,
                        synchronous: true
                    });
                }
            }
        },

        /**
         * @private
         */
        onFileLoadError: function(error) {
            throw new Error("[Ext.Loader] " + error.message);
        },

        /**
         * Explicitly exclude
         */
        exclude: function(excludes) {
            var me = this;

            return {
                require: function(expressions, fn, scope) {
                    return me.require(expressions, fn, scope, excludes);
                }
            };
        },

        /**
         * Loads all classes by the given names and all their direct dependencies; optionally executes the given callback function when
         * finishes, within the optional scope. This method is aliased by {@link Ext#require} for convenience
         * @param {String/Array} expressions Can either be a string or an array of string
         * @param {Function} fn (Optional) The callback function
         * @param {Object} scope (Optional) The execution scope (<code>this</code>) of the callback function
         * @param {String/Array} excludes (Optional) Stuff to be excluded, useful when being used with expressions
         * @private
         */
        require: function(expressions, fn, scope, excludes) {
            var filePath, expression, exclude, className, excluded = {},
                excludedClassNames = [],
                possibleClassNames = [],
                possibleClassName, classNames = [],
                me = this,
                i, j, ln, subLn, onFileLoaded;

            expressions = Ext.Array.from(expressions);
            excludes = Ext.Array.from(excludes);

            fn = fn || Ext.emptyFn;

            scope = scope || Ext.global;

            for (i = 0, ln = excludes.length; i < ln; i++) {
                exclude = excludes[i];

                if (Ext.isString(exclude) && exclude.length > 0) {
                    excludedClassNames = Manager.getNamesByExpression(exclude);

                    for (j = 0, subLn = excludedClassNames.length; j < subLn; j++) {
                        excluded[excludedClassNames[j]] = true;
                    }
                }
            }

            for (i = 0, ln = expressions.length; i < ln; i++) {
                expression = expressions[i];

                if (Ext.isString(expression) && expression.length > 0) {
                    possibleClassNames = Manager.getNamesByExpression(expression);

                    for (j = 0, subLn = possibleClassNames.length; j < subLn; j++) {
                        possibleClassName = possibleClassNames[j];

                        if (!excluded.hasOwnProperty(possibleClassName) && !Manager.exist(possibleClassName)) {
                            Ext.Array.include(classNames, possibleClassName);
                        }
                    }
                }
            }

            // If the dynamic dependency feature is not being used, throw an error
            // if the dependencies are not defined
            if (!this.config.enabled) {
                if (classNames.length > 0) {
                    throw new Error("[Ext.Loader][not enabled] Missing required class" + ((classNames.length > 1) ? "es" : "") +
                                    ": " + classNames.join(', '));
                }
            }

            if (classNames.length === 0) {
                fn.call(scope);
                return this;
            }

            this.queue.push({
                requires: classNames,
                callback: fn,
                scope: scope
            });

            classNames = classNames.slice();

            for (i = 0, ln = classNames.length; i < ln; i++) {
                className = classNames[i];

                if (!(this.isFileLoaded.hasOwnProperty(className) && this.isFileLoaded[className] === true)) {
                    this.requireHistory[className] = true;

                    this.isFileLoaded[className] = true;

                    filePath = this.getPath(className);

                    this.classNameToFilePathMap[className] = filePath;

                    this.numPendingFiles++;

                    if (this.numLoadedFiles === 0) {
                        this.startLoadingTime = Ext.Date.now();
                    }

                    this.loadScriptFile(filePath, Ext.Function.pass(this.onFileLoaded, [className, filePath], this), this, this.syncModeEnabled);
                }
            }

            return this;
        },

        onFileLoaded: function(className, filePath) {
            this.numLoadedFiles++;

            // window.status = "Loaded: " + className + " (" + this.numLoadedFiles + " total)";

            this.numPendingFiles--;

            if (this.numPendingFiles === 0) {
                this.refreshQueue();
            }

            if (this.numPendingFiles === 0 && this.isLoading) {
                var queue = this.queue,
                    requires,
                    i, ln, j, subLn, missingClasses = [], missingPaths = [];

                for (i = 0, ln = queue.length; i < ln; i++) {
                    requires = queue[i].requires;

                    for (j = 0, subLn = requires.length; j < ln; j++) {
                        if (this.isFileLoaded[requires[j]]) {
                            missingClasses.push(requires[j]);
                        }
                    }
                }

                if (missingClasses.length < 1) {
                    return;
                }

                for (i = 0, ln = missingClasses.length; i < ln; i++) {
                    missingPaths.push(this.classNameToFilePathMap[missingClasses[i]]);
                }

                throw new Error("[Ext.Loader] The following classes are not declared even if their files have been loaded: " +
                                missingClasses.join(', ') + ". Please check the source code of their " +
                                "corresponding files for possible typos: " + missingPaths.join(', '));
            }
        },

        /**
         * @private
         */
        addOptionalRequires: function(requires) {
            var optionalRequires = this.optionalRequires,
                i, ln, require;

            requires = Ext.Array.from(requires);

            for (i = 0, ln = requires.length; i < ln; i++) {
                require = requires[i];

                Ext.Array.include(optionalRequires, require);
            }

            return this;
        },

        /**
         * @private
         */
        triggerReady: function(force) {
            var readyListeners = this.readyListeners,
                optionalRequires, listener;

            if (this.isLoading || force) {
                this.isLoading = false;

                if (this.optionalRequires.length) {
                    // Clone then empty the array to eliminate potential recursive loop issue
                    optionalRequires = Ext.Array.clone(this.optionalRequires);

                    // Empty the original array
                    this.optionalRequires.length = 0;

                    this.require(optionalRequires, Ext.Function.pass(this.triggerReady, [true], this), this);
                    return this;
                }

                //window.status = "All dependencies are loaded. (" + this.numLoadedFiles + " files in " +
                //                 ((Ext.Date.now() - this.startLoadingTime) / 1000)+"s | using " +
                //                Math.round(((this.numLoadedFiles / Ext.Object.getSize(Manager.maps.nameToAliases)) * 100)) + "% of the whole library)";

                while (readyListeners.length) {
                    listener = readyListeners.shift();
                    listener.fn.call(listener.scope);
                }
            }

            return this;
        },

        /**
         * Add a new listener to be executed when all required scripts are fully loaded
         * @param {Function} fn The function callback to be executed
         * @param {Object} scope The execution scope (<code>this</code>) of the callback function
         * @param {Boolean} withDomReady Whether or not to wait for document dom ready as well
         */
        onReady: function(fn, scope, withDomReady, options) {
            var me = this,
                oldFn;

            if (withDomReady !== false && Ext.onDocumentReady) {
                oldFn = fn;

                fn = function() {
                    Ext.onDocumentReady(oldFn, scope, options);
                };
            }

            if (!this.isLoading) {
                fn.call(scope);
            }
            else {
                this.readyListeners.push({
                    fn: fn,
                    scope: scope
                });
            }
        },

        historyPush: function(className) {
            if (className && this.requireHistory.hasOwnProperty(className)) {
                Ext.Array.include(this.history, className);
            }
        },

        /**
         * @private
         */
        enableSyncMode: function(isEnabled) {
            this.syncModeEnabled = isEnabled;
        }
    };

    /**
     * Convenient shortcut to {@link Ext.Loader#require}
     * @member Ext
     * @method require
     */
    Ext.require = Ext.Function.alias(Loader, 'require');

    /**
     * Convenient shortcut to {@link Ext.Loader#exclude}
     * @member Ext
     * @method exclude
     */
    Ext.exclude = Ext.Function.alias(Loader, 'exclude');

    /**
     * @member Ext
     * @method onReady
     */
    Ext.onReady = function(fn, scope, options) {
        Loader.onReady(fn, scope, true, options);
    };

    Class.registerPreprocessor('loader', function(cls, data, fn) {
        var me = this,
            dependencyProperties = ['extend', 'mixins', 'requires'],
            dependencies = [],
            className = Manager.getName(cls),
            requiresMap = Loader.requiresMap,
            i, j, ln, subLn, value, propertyName, propertyValue, deadlockPath = [], detectDeadlock;

        // Basically loop through the dependencyProperties, look for string class names and push
        // them into a stack, regardless of whether the property's value is a string, array or object. For example:
        // {
        //      extend: 'Ext.MyClass',
        //      requires: ['Ext.some.OtherClass'],
        //      mixins: {
        //          observable: 'Ext.util.Observable';
        //      }
        // }
        // which will later be transformed into:
        // {
        //      extend: Ext.MyClass,
        //      requires: [Ext.some.OtherClass],
        //      mixins: {
        //          observable: Ext.util.Observable;
        //      }
        // }
        for (i = 0, ln = dependencyProperties.length; i < ln; i++) {
            propertyName = dependencyProperties[i];

            if (data.hasOwnProperty(propertyName)) {
                propertyValue = data[propertyName];

                if (Ext.isString(propertyValue)) {
                    dependencies.push(propertyValue);
                }
                else if (Ext.isArray(propertyValue)) {
                    for (j = 0, subLn = propertyValue.length; j < subLn; j++) {
                        value = propertyValue[j];

                        if (Ext.isString(value)) {
                            dependencies.push(value);
                        }
                    }
                }
                else {
                    for (j in propertyValue) {
                        if (propertyValue.hasOwnProperty(j)) {
                            value = propertyValue[j];

                            if (Ext.isString(value)) {
                                dependencies.push(value);
                            }
                        }
                    }
                }
            }
        }


        // Automatically detect deadlocks before-hand,
        // will throw an error with detailed path for ease of debugging. Examples of deadlock cases:
        //
        // - A extends B, then B extends A
        // - A requires B, B requires C, then C requires A
        //
        // The detectDeadlock function will recursively transverse till the leaf, hence it can detect deadlocks
        // no matter how deep the path is.

        if (className && Loader.getConfig('enableDeadlockDetection')) {
            requiresMap[className] = dependencies;

            detectDeadlock = function(cls) {
                deadlockPath.push(cls);

                if (requiresMap[cls]) {
                    if (Ext.Array.contains(requiresMap[cls], className)) {
                        throw new Error("[Ext.Loader] Deadlock detected! '" + className + "' and '" + deadlockPath[1] + "' " +
                                        "mutually require each others. Path: " + deadlockPath.join(' -> ') +
                                        " -> " + deadlockPath[0]);
                    }

                    for (i = 0, ln = requiresMap[cls].length; i < ln; i++) {
                        detectDeadlock(requiresMap[cls][i]);
                    }
                }
            };

            detectDeadlock(className);
        }


        Ext.require(dependencies, function() {
            Loader.historyPush(className);

            for (i = 0, ln = dependencyProperties.length; i < ln; i++) {
                propertyName = dependencyProperties[i];

                if (data.hasOwnProperty(propertyName)) {
                    propertyValue = data[propertyName];

                    if (Ext.isString(propertyValue)) {
                        data[propertyName] = Manager.get(propertyValue);
                    }
                    else if (Ext.isArray(propertyValue)) {
                        for (j = 0, subLn = propertyValue.length; j < subLn; j++) {
                            value = propertyValue[j];

                            if (Ext.isString(value)) {
                                data[propertyName][j] = Manager.get(value);
                            }
                        }
                    }
                    else {
                        for (var k in propertyValue) {
                            if (propertyValue.hasOwnProperty(k)) {
                                value = propertyValue[k];

                                if (Ext.isString(value)) {
                                    data[propertyName][k] = Manager.get(value);
                                }
                            }
                        }
                    }
                }
            }

            if (fn) {
                fn.call(me, cls, data);
            }
        });

    }).insertDefaultPreprocessor('loader', 'after', 'className');

    Manager.registerPostprocessor('uses', function(name, cls, data, fn) {
        if (data.uses) {
            var uses = Ext.Array.from(data.uses);

            uses = Ext.Array.filter(uses, function(use) {
                return Ext.isString(use);
            });

            Loader.addOptionalRequires(uses);
        }

        if (fn) {
            fn.call(this, name, cls, data);
        }

    }).insertDefaultPostprocessor('uses', 'last');

})(Ext.ClassManager, Ext.Class, Ext.Function.flexSetter);

})();

})();

