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
         * Since Core version 4 this method is meant to be used internally only. Use {@link Ext#define Ext.define} instead.
         * @function
         * @param {Function} superclass
         * @param {Object} overrides
         * @return {Function} The subclass constructor from the <tt>overrides</tt> parameter, or a generated one if not provided.
         * @deprecated Use {@link Ext#define Ext.define} instead
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
                args[args.length - 1] = 'var Ext=window.' + this.getUniqueGlobalNamespace() + ';' +
                    args[args.length - 1];
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
var version = '4.0.0pr5',
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
 * @docauthor Jacky Nguyen <jacky@sencha.com>
 * @class Ext.Array
 *
 * A set of useful static methods to deal with arrays; provide missing methods for older browsers. A few commonly used methods:

 - {@link Ext.Array#each} iterate an array with a function callback for each item
 - {@link Ext.Array#from} converts a value to an array if it's not already an array
 - {@link Ext.Array#include} Push an item into the array only if the array doesn't contain it yet

 * @singleton
 * @markdown
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
         * the current `index`. This function is called with
         * the following arguments:

- `item`: {Mixed} The item at the current `index` in the passed `array`
- `index`: {Number} The current `index` within the `array`
- `allItems`: {Array} The `array` passed as the first argument to `Ext.each`

         * @param {Object} scope The scope (`this` reference) in which the specified function is executed.
         * Defaults to the `item` at the current `index`
         * within the passed `array`.
         * @return {Boolean} See description for the fn parameter.
         * @markdown
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
         * that feature for a *huge* performance boost on modern browsers
         *
         * @param {Array} array The array to loop through
         * @param {Function} fn The function callback, to be invoked with three arguments: the value of the element,
         * the index of the element, and the Array object being traversed.
         * @param {Object} scope The scope (<code>this</code> reference) in which the specified function is executed.
         * @markdown
         */
        forEach: function(array, fn, scope) {
            if (supportsForEach) {
                return array.forEach(fn, scope);
            }

            return Ext.Array.each(array, fn, scope);
        },

        /**
         * Get the index of the provided `item` in the given `array`, a supplement for the
         * missing Array.prototype.indexOf in Internet Explorer.
         *
         * @param {Array} array The array to check
         * @param {Mixed} item The item to look for
         * @param {Number} from (Optional) The index at which to begin the search
         * @return {Number} The index of item in the array (or -1 if it is not found)
         * @markdown
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
         * Checks whether or not the given `array` contains the specified `item`
         *
         * @param {Array} array The array to check
         * @param {Mixed} item The item to look for
         * @return {Boolean} True if the array contains the item, false otherwise
         * @markdown
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
         * Filter through an array and remove empty item as defined in {@link Ext#isEmpty Ext.isEmpty}
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
         * Converts a value to an array if it's not already an array. Note that `undefined` and `null` are ignored.
         *
         * @param {Array/Mixed} value The value to convert to an array if it is defined and not already an array.
         * @return {Array} array
         * @markdown
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
         * from Ext.clone since it doesn't handle recursive cloning. It's simply a convenient, easy-to-remember method
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
 * A set of useful static methods to deal with date
 * Note that if Ext.util.Date is required and loaded, it will copy all methods / properties to
 * this object for convenience
 * @singleton
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
 * @author Jacky Nguyen <jacky@sencha.com>
 * @docauthor Jacky Nguyen <jacky@sencha.com>
 * @class Ext.Base
 *
 * The root of all classes created with {@link Ext#define}
 * All prototype and static members of this class are inherited by any other class
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
            speciesName: 'Cat' // My.Cat.speciesName = 'Cat'
        },

        constructor: function() {
            alert(this.self.speciesName); / dependent on 'this'

            return this;
        },

        clone: function() {
            return new this.self();
        }
    });


    Ext.define('My.SnowLeopard', {
        extend: 'My.Cat',
        statics: {
            speciesName: 'Snow Leopard'         // My.SnowLeopard.speciesName = 'Snow Leopard'
        }
    });

    var cat = new My.Cat();                     // alerts 'Cat'
    var snowLeopard = new My.SnowLeopard();     // alerts 'Snow Leopard'

    var clone = snowLeopard.clone();
    alert(Ext.getClassName(clone));             // alerts 'My.SnowLeopard'

         * @type Class
         * @protected
         * @markdown
         */
        self: Base,

        /**
         * Default constructor, simply returns `this`
         *
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
                    throw new Error("[" + Ext.getClassName(this) + "#callParent] Calling a protected method from the public scope");
                }

                method = method.caller;
            }

            parentClass = method.$owner.superclass;
            methodName = method.$name;

            if (!(methodName in parentClass)) {
                throw new Error("[" + Ext.getClassName(this) + "#" + methodName + "] this.callParent() was called but there's no such method (" + methodName + ") found in the parent class (" +
                                (Ext.getClassName(parentClass) || 'Object') + ")");
            }

            return parentClass[methodName].apply(this, args || []);
        },


        /**
         * Get the reference to the class from which this object was instantiated. Note that unlike {@link Ext.Base#self},
         * `this.statics()` is scope-independent and it always returns the class from which it was called, regardless of what
         * `this` points to during run-time

    Ext.define('My.Cat', {
        statics: {
            totalCreated: 0,
            speciesName: 'Cat' // My.Cat.speciesName = 'Cat'
        },

        constructor: function() {
            var statics = this.statics();

            alert(statics.speciesName);     // always equals to 'Cat' no matter what 'this' refers to
                                            // equivalent to: My.Cat.speciesName

            alert(this.self.speciesName);   // dependent on 'this'

            statics.totalCreated++;

            return this;
        },

        clone: function() {
            var cloned = new this.self;                      // dependent on 'this'

            cloned.groupName = this.statics().speciesName;   // equivalent to: My.Cat.speciesName

            return cloned;
        }
    });


    Ext.define('My.SnowLeopard', {
        extend: 'My.Cat',

        statics: {
            speciesName: 'Snow Leopard'     // My.SnowLeopard.speciesName = 'Snow Leopard'
        },

        constructor: function() {
            this.callParent();
        }
    });

    var cat = new My.Cat();                 // alerts 'Cat', then alerts 'Cat'

    var snowLeopard = new My.SnowLeopard(); // alerts 'Cat', then alerts 'Snow Leopard'

    var clone = snowLeopard.clone();
    alert(Ext.getClassName(clone));         // alerts 'My.SnowLeopard'
    alert(clone.groupName);                 // alerts 'Cat'

    alert(My.Cat.totalCreated);             // alerts 3

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
        ownMethod: function(name, fn) {
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
        },

        /**
         * @private
         */
        borrowMethod: function(name, fn) {
            if (!fn.$isOwned) {
                this.ownMethod(name, fn);
            }
            else {
                this.prototype[name] = fn;
            }
        },

        /**
         * Add / override static properties of this class. This method is a {@link Ext.Function#flexSetter flexSetter}.
         * It can either accept an object of key - value pairs or 2 arguments of name - value.

    Ext.define('My.cool.Class', {
        ...
    });

    My.cool.Class.addStatics({
        someProperty: 'someValue',      // My.cool.Class.someProperty = 'someValue'
        method1: function() { ... },    // My.cool.Class.method1 = function() { ... };
        method2: function() { ... }     // My.cool.Class.method2 = function() { ... };
    });

    My.cool.Class.addStatics('method3', function(){ ... }); // My.cool.Class.method3 = function() { ... };

         * @property extend
         * @static
         * @type Function
         * @param {String/Object} name See {@link Ext.Function#flexSetter flexSetter}
         * @param {Mixed} value See {@link Ext.Function#flexSetter flexSetter}
         * @markdown
         */
        addStatics: flexSetter(function(name, value) {
            this[name] = value;
        }),

        /**
         * Add / override prototype properties of this class. This method is a {@link Ext.Function#flexSetter flexSetter}.
         * It can either accept an object of key - value pairs or 2 arguments of name - value.

    Ext.define('My.cool.Class', {
        ...
    });

    // Object with key - value pairs
    My.cool.Class.extend({
        someProperty: 'someValue',
        method1: function() { ... },
        method2: function() { ... }
    });

    var cool = new My.cool.Class();
    alert(cool.someProperty); // alerts 'someValue'
    cool.method1();
    cool.method2();

    // name - value arguments
    My.cool.Class.extend('method3', function(){ ... });
    cool.method3();

         * @property implement
         * @static
         * @type Function
         * @param {String/Object} name See {@link Ext.Function#flexSetter flexSetter}
         * @param {Mixed} value See {@link Ext.Function#flexSetter flexSetter}
         */
        extend: flexSetter(function(name, value) {
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
         * This method is deprecated, please use {@link Ext.Base#extend} instead
         */
        implement: function() {
            if (Ext.isDefined(window.console)) {
                console.warn("Class.implement is deprecated, please use Class.extend instead");
                return this.extend.apply(this, arguments);
            }
        },

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
            else if (Ext.isFunction(value)) {
                if (Ext.isFunction(this.prototype[name])) {
                    var previous = this.prototype[name];
                    this.ownMethod(name, value);
                    this.prototype[name].$previous = previous;
                }
                else {
                    this.ownMethod(name, value);
                }
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
 * @author Jacky Nguyen <jacky@sencha.com>
 * @docauthor Jacky Nguyen <jacky@sencha.com>
 * @markdown
 * @class Ext.Class

Handles class creation throughout the whole framework. Note that most of the time {@link Ext#define Ext.define} should
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

             this.playGuitar();
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
                cls.extend(data);

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
                parent, i, k, ln, staticName, parentStatics;

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

            // Statics inheritance
            parentStatics = parent.$inheritableStatics;

            if (parentStatics) {
                for (k = 0, ln = parentStatics.length; k < ln; k++) {
                    staticName = parentStatics[k];

                    if (!cls[staticName]) {
                        cls[staticName] = parent[staticName];
                    }
                }
            }

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
            var statics = data.statics,
                inheritableStatics = data.inheritableStatics,
                name;

            if (Ext.isObject(statics) || Ext.isObject(inheritableStatics)) {

                if (statics) {
                    for (name in statics) {
                        if (statics.hasOwnProperty(name)) {
                            cls[name] = statics[name];
                        }
                    }

                    delete data.statics;
                }

                if (inheritableStatics) {
                    cls.$inheritableStatics = [];

                    for (name in inheritableStatics) {
                        if (inheritableStatics.hasOwnProperty(name)) {
                            cls[name] = inheritableStatics[name];
                            cls.$inheritableStatics.push(name);
                        }
                    }

                    delete data.inheritableStatics;
                }
            }

            if (fn) {
                fn.call(this, cls, data);
            }
        }
    });

    Ext.Class.setDefaultPreprocessors(['extend', 'mixins', 'config', 'statics']);

    //TODO: Move this to compat file
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
 * @author Jacky Nguyen <jacky@sencha.com>
 * @docauthor Jacky Nguyen <jacky@sencha.com>
 * @class Ext.ClassManager

Ext.ClassManager manages all classes and handles mapping from string class name to
actual class objects throughout the whole framework. It is not generally accessed directly, rather through
these convenient shorthands:

- {@link Ext#define Ext.define}
- {@link Ext#create Ext.create}
- {@link Ext#widget Ext.widget}
- {@link Ext#getClass Ext.getClass}
- {@link Ext#getClassName Ext.getClassName}

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
         * usually invoked by the shorthand {@link Ext#getClassName Ext.getClassName}

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
         * of any class created with Ext.define. This is usually invoked by the shorthand {@link Ext#getClass Ext.getClass}
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
         * Defines a class. This is usually invoked via the alias {@link Ext#define Ext.define}

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
         * Instantiate a class by its alias; usually invoked by the convenient shorthand {@link Ext#createByAlias Ext.createByAlias}
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
         * shorthand {@link Ext#create Ext.create}
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
            }
            else if (Ext.isFunction(item)) {
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
     * Convenient alias for {@link Ext#namespace Ext.namespace}
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
 * @author Jacky Nguyen <jacky@sencha.com>
 * @docauthor Jacky Nguyen <jacky@sencha.com>
 * @class Ext.Loader
 *

Ext.Loader is the heart of the new dynamic dependency loading capability in Ext JS 4+. It is most commonly used
via the {@link Ext#require} shorthand. Ext.Loader supports both asynchronous and synchronous loading
approaches, and leverage their advantages for the best development flow. We'll discuss about the pros and cons of each approach:

# Asynchronous Loading #

- Advantages:
	+ Cross-domain
	+ No web server needed: you can run the application via the file system protocol (i.e: `file://path/to/your/index
 .html`)
	+ Best possible debugging experience: error messages come with the exact file name and line number

- Disadvantages:
	+ Dependencies need to be specified before-hand

### Method 1: Explicitly include what you need: ###

    // Syntax
    Ext.require({String/Array} expressions);

    // Example: Single alias
    Ext.require('widget.window');

    // Example: Single class name
    Ext.require('Ext.window.Window');

    // Example: Multiple aliases / class names mix
    Ext.require(['widget.window', 'layout.border', 'Ext.data.Connection']);

    // Wildcards
    Ext.require(['widget.*', 'layout.*', 'Ext.data.*']);

### Method 2: Explicitly exclude what you don't need: ###

    // Syntax: Note that it must be in this chaining format.
    Ext.exclude({String/Array} expressions)
       .require({String/Array} expressions);

    // Include everything except Ext.data.*
    Ext.exclude('Ext.data.*').require('*'); 

    // Include all widgets except widget.checkbox*,
    // which will match widget.checkbox, widget.checkboxfield, widget.checkboxgroup, etc.
    Ext.exclude('widget.checkbox*').require('widget.*');

# Synchronous Loading on Demand #

- *Advantages:*
	+ There's no need to specify dependencies before-hand, which is always the convenience of including ext-all.js
 before

- *Disadvantages:*
	+ Not as good debugging experience since file name won't be shown (except in Firebug at the moment)
	+ Must be from the same domain due to XHR restriction
	+ Need a web server, same reason as above

There's one simple rule to follow: Instantiate everything with Ext.create instead of the `new` keyword

    Ext.create('widget.window', { ... }); // Instead of new Ext.window.Window({...});

    Ext.create('Ext.window.Window', {}); // Same as above, using full class name instead of alias

    Ext.widget('window', ﻿{}); // Same as above, all you need is the traditional `xtype`

Behind the scene, {@link Ext.ClassManager} will automatically check whether the given class name / alias has already
 existed on the page. If it's not, Ext.Loader will immediately switch itself to synchronous mode and automatic load the given
 class and all its dependencies.

# Hybrid Loading - The Best of Both Worlds #

It has all the advantages combined from asynchronous and synchronous loading. The development flow is simple:

### Step 1: Start writing your application using synchronous approach. For example: ###

    Ext.onReady(function(){
        var window = Ext.createWidget('window', {
            width: 500,
            height: 300,
            layout: {
                type: 'border',
                padding: 5
            },
            title: 'Hello Dialog',
            items: [{
                title: 'Navigation',
                collapsible: true,
                region: 'west',
                width: 200,
                html: 'Hello',
                split: true
            }, {
                title: 'TabPanel',
                region: 'center'
            }]
        });

        window.show();
    })

### Step 2: When you finish, or you need better debugging ability, watch the console for warnings like these: ###

    [Ext.Loader] Synchronously loading 'Ext.window.Window'; consider adding Ext.require('Ext.window.Window') before your application's code
    ClassManager.js:432
    [Ext.Loader] Synchronously loading 'Ext.layout.container.Border'; consider adding Ext.require('Ext.layout.container.Border') before your application's code

Simply copy and paste the suggested code above `Ext.onReady`, i.e:

    Ext.require('Ext.window.Window');
    Ext.require('Ext.layout.container.Border');

    Ext.onReady(...);

Everything should now load via asynchronous mode.

# Deployment #

It's important to note that dynamic loading should only be used during development on your local machines. During production, all dependencies should be combined into one single JavaScript file. Ext.Loader makes the whole process of transitioning from / to between development / maintenance and production as easy as possible. Internally {@link Ext.Loader.history} maintains the list of all dependencies your application needs in the exact loading sequence. It's as simple as concatenating all files in this array into one, then include it on top of your application.

This process will be automated with Sencha Command, to be released and documented towards Ext JS 4 Final.

 * @singleton
 * @markdown
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
             * @cfg {Boolean} enableDeadlockDetection
             * Whether or not to enable automatic deadlock detection, very useful
             * during development
             * Defaults to true
             */
            enableDeadlockDetection: true,

            /**
             * @cfg {Boolean} enableCacheBuster
             * Appends current date in integer format to script files to prevent caching
             * Defaults to true
             */
            enableCacheBuster: true,

            /**
             * @cfg {Object} paths
             * The mapping from namespaces to file paths
    {
        'Ext': '.', // This is set by default, Ext.layout.Container will be
                    // loaded from ./layout/Container.js

        'My': './src/my_own_folder' // My.layout.Container will be loaded from
                                    // ./src/my_own_folder/layout/Container.js
    }
             * Note that all relative paths are relative to the current HTML document.
             * If not being specified, for example, <code>Other.awesome.Class</code>
             * will simply be loaded from <code>./Other/awesome/Class.js</code>
             */
            paths: {
                'Ext': '.'
            }
        },

        /**
         * Set the configuration for the loader. This should be called right after ext-core.js
         * (or ext-core-debug.js) is included in the page, i.e:

    <script type="text/javascript" src="ext-core-debug.js"></script>
    <script type="text/javascript">
      Ext.Loader.setConfig({
          enabled: true,
          paths: {
              'My': 'my_own_path'
          }
      });
    <script>
    <script type="text/javascript">
      Ext.require(...);

      Ext.onReady(function() {
          // application code here
      });
    </script>

         * Refer to {@link Ext.Loader#config} for the list of possible properties
         *
         * @param {Object} config The config object to override the default values in {@link Ext.Loader#config}
         * @return {Ext.Loader} this
         * @markdown
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

    Ext.Loader.setPath('Ext', '.');

         * @param {String/Object} name See {@link Ext.Function#flexSetter flexSetter}
         * @param {String} path See {@link Ext.Function#flexSetter flexSetter}
         * @return {Ext.Loader} this
         * @markdown
         */
        setPath: flexSetter(function(name, path) {
            this.config.paths[name] = path;

            return this;
        }),

        /**
         * Translates a className to a path to load the file from by adding the
         * the proper prefix and converting the .'s to /'s. For example:

    Ext.Loader.setPath('My', '/path/to/My');

    alert(Ext.Loader.getPath('My.awesome.Class')); // alerts '/path/to/My/awesome/Class.js'

         * Note that the deeper namespace levels are always resolved first. For example:

    Ext.Loader.setPath({
        'My': '/path/to/lib',
        'My.awesome': '/other/path/for/awesome/stuff'
    });

    alert(Ext.Loader.getPath('My.awesome.Class')); // alerts '/other/path/for/awesome/stuff/Class.js'
    alert(Ext.Loader.getPath('My.cool.Class')); // alerts '/path/to/lib/cool/Class.js'

         * @param {String} className
         * @return {String} path
         * @markdown
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
         * Inject a script element to document's head, call onLoad and onError accordingly
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
         *
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
         * Explicitly exclude files from being loaded. Useful when used in conjunction with a broad include expression.
         * Can be chained with more `require` and `exclude` methods, eg:

    Ext.exclude('Ext.data.*').require('*');

    Ext.exclude('widget.button*').require('widget.*');

         * @param {Array} excludes
         * @return {Object} object contains `require` method for chaining
         * @markdown
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
         * finishes, within the optional scope. This method is aliased by {@link Ext#require Ext.require} for convenience
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

        /**
         * @private
         * @param {String} className
         * @param {String} filePath
         */
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
         *
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

        /**
         * @private
         * @param {String} className
         */
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

(function(){
/**
 * @class Ext.JSON
 * Modified version of Douglas Crockford"s json.js that doesn"t
 * mess with the Object prototype
 * http://www.json.org/js.html
 * @singleton
 */
Ext.JSON = new(function() {
    var useHasOwn = !! {}.hasOwnProperty,
    isNative = function() {
        var useNative = null;

        return function() {
            if (useNative === null) {
                useNative = Ext.USE_NATIVE_JSON && window.JSON && JSON.toString() == '[object JSON]';
            }

            return useNative;
        };
    }(),
    pad = function(n) {
        return n < 10 ? "0" + n : n;
    },
    doDecode = function(json) {
        return eval("(" + json + ')');
    },
    doEncode = function(o) {
        if (!Ext.isDefined(o) || o === null) {
            return "null";
        } else if (Ext.isArray(o)) {
            return encodeArray(o);
        } else if (Ext.isDate(o)) {
            return Ext.JSON.encodeDate(o);
        } else if (Ext.isString(o)) {
            return encodeString(o);
        } else if (typeof o == "number") {
            //don't use isNumber here, since finite checks happen inside isNumber
            return isFinite(o) ? String(o) : "null";
        } else if (Ext.isBoolean(o)) {
            return String(o);
        } else if (Ext.isObject(o)) {
            return encodeObject(o);
        } else if (typeof o === "function") {
            return "null";
        }
        return 'undefined';
    },
    m = {
        "\b": '\\b',
        "\t": '\\t',
        "\n": '\\n',
        "\f": '\\f',
        "\r": '\\r',
        '"': '\\"',
        "\\": '\\\\',
        '\x0b': '\\u000b' //ie doesn't handle \v
    },
    charToReplace = /[\\\"\x00-\x1f\x7f-\uffff]/g,
    encodeString = function(s) {
        return '"' + s.replace(charToReplace, function(a) {
            var c = m[a];
            return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"';
    },
    encodeArray = function(o) {
        var a = ["[", ""],
        // Note empty string in case there are no serializable members.
        len = o.length,
        i;
        for (i = 0; i < len; i += 1) {
            a.push(doEncode(o[i]), ',');
        }
        // Overwrite trailing comma (or empty string)
        a[a.length - 1] = ']';
        return a.join("");
    },
    encodeObject = function(o) {
        var a = ["{", ""],
        // Note empty string in case there are no serializable members.
        i;
        for (i in o) {
            if (!useHasOwn || o.hasOwnProperty(i)) {
                a.push(doEncode(i), ":", doEncode(o[i]), ',');
            }
        }
        // Overwrite trailing comma (or empty string)
        a[a.length - 1] = '}';
        return a.join("");
    };

    /**
     * <p>Encodes a Date. This returns the actual string which is inserted into the JSON string as the literal expression.
     * <b>The returned value includes enclosing double quotation marks.</b></p>
     * <p>The default return format is "yyyy-mm-ddThh:mm:ss".</p>
     * <p>To override this:</p><pre><code>
     Ext.JSON.encodeDate = function(d) {
     return d.format('"Y-m-d"');
     };
     </code></pre>
     * @param {Date} d The Date to encode
     * @return {String} The string literal to use in a JSON string.
     */
    this.encodeDate = function(o) {
        return '"' + o.getFullYear() + "-" 
        + pad(o.getMonth() + 1) + "-"
        + pad(o.getDate()) + "T"
        + pad(o.getHours()) + ":"
        + pad(o.getMinutes()) + ":"
        + pad(o.getSeconds()) + '"';
    };

    /**
     * Encodes an Object, Array or other value
     * @param {Mixed} o The variable to encode
     * @return {String} The JSON string
     */
    this.encode = function() {
        var ec;
        return function(o) {
            if (!ec) {
                // setup encoding function on first access
                ec = isNative() ? JSON.stringify : doEncode;
            }
            return ec(o);
        };
    }();


    /**
     * Decodes (parses) a JSON string to an object. If the JSON is invalid, this function throws a SyntaxError unless the safe option is set.
     * @param {String} json The JSON string
     * @return {Object} The resulting object
     */
    this.decode = function() {
        var dc;
        return function(json) {
            if (!dc) {
                // setup decoding function on first access
                dc = isNative() ? JSON.parse : doDecode;
            }
            return dc(json);
        };
    }();

})();
/**
 * Shorthand for {@link Ext.JSON#encode}
 * @param {Mixed} o The variable to encode
 * @return {String} The JSON string
 * @member Ext
 * @method encode
 */
Ext.encode = Ext.JSON.encode;
/**
 * Shorthand for {@link Ext.JSON#decode}
 * @param {String} json The JSON string
 * @param {Boolean} safe (optional) Whether to return null or throw an exception if the JSON is invalid.
 * @return {Object} The resulting object
 * @member Ext
 * @method decode
 */
Ext.decode = Ext.JSON.decode;


/**
 * @class Ext

 The Ext namespace (global object) encapsulates all classes, singletons, and utility methods provided by Sencha's libraries.</p>
 Most user interface Components are at a lower level of nesting in the namespace, but many common utility functions are provided
 as direct properties of the Ext namespace.

 Also many frequently used methods from other classes are provided as shortcuts within the Ext namespace.
 For example {@link Ext#getCmp Ext.getCmp} aliases {@link Ext.ComponentMgr#get Ext.ComponentMgr.get}.

 Many applications are initiated with {@link Ext#onReady Ext.onReady} which is called once the DOM is ready. 
 This ensures all scripts have been loaded, preventing dependency issues. For example

     Ext.onReady(function(){
         new Ext.Component({
             renderTo: document.body,
             html: 'DOM ready!'
         });
     });

For more information about how to use the Ext classes, see

* <a href="http://www.sencha.com/learn/">The Learning Center</a>
* <a href="http://www.sencha.com/learn/Ext_FAQ">The FAQ</a>
* <a href="http://www.sencha.com/forum/">The forums</a>

 * @singleton
 * @markdown
 */
Ext.apply(Ext, {
    userAgent: navigator.userAgent.toLowerCase(),
    cache: {},
    idSeed: 1000,
    BLANK_IMAGE_URL : 'data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
    isStrict: document.compatMode == "CSS1Compat",
    windowId: 'ext-window',
    documentId: 'ext-document',

    /**
     * True when the document is fully initialized and ready for action
     * @type Boolean
     */
    isReady: false,

    /**
     * True to automatically uncache orphaned Ext.core.Elements periodically (defaults to true)
     * @type Boolean
     */
    enableGarbageCollector: true,

    /**
     * True to automatically purge event listeners during garbageCollection (defaults to true).
     * @type Boolean
     */
    enableListenerCollection: true,

    /**
     * Generates unique ids. If the element already has an id, it is unchanged
     * @param {Mixed} el (optional) The element to generate an id for
     * @param {String} prefix (optional) Id prefix (defaults "ext-gen")
     * @return {String} The generated Id.
     */
    id: function(el, prefix) {
        el = Ext.getDom(el) || {};
        if (el === document) {
            el.id = this.documentId;
        }
        else if (el === window) {
            el.id = this.windowId;
        }
        el.id = el.id || ((prefix || 'ext-gen') + (++Ext.idSeed));
        return el.id;
    },

    /**
     * Returns the current document body as an {@link Ext.core.Element}.
     * @return Ext.core.Element The document body
     */
    getBody: function() {
        return Ext.get(document.body || false);
    },

    /**
     * Returns the current document head as an {@link Ext.core.Element}.
     * @return Ext.core.Element The document head
     */
    getHead: function() {
        var head;

        return function() {
            if (head == undefined) {
                head = Ext.get(document.getElementsByTagName("head")[0]);
            }

            return head;
        };
    }(),

    /**
     * Returns the current HTML document object as an {@link Ext.core.Element}.
     * @return Ext.core.Element The document
     */
    getDoc: function() {
        return Ext.get(document);
    },

    /**
     * This is shorthand reference to {@link Ext.ComponentMgr#get}.
     * Looks up an existing {@link Ext.Component Component} by {@link Ext.Component#id id}
     * @param {String} id The component {@link Ext.Component#id id}
     * @return Ext.Component The Component, <tt>undefined</tt> if not found, or <tt>null</tt> if a
     * Class was found.
    */
    getCmp: function(id) {
        return Ext.ComponentMgr.get(id);
    },

    /**
     * Returns the current orientation of the mobile device
     * @return {String} Either 'portrait' or 'landscape'
     */
    getOrientation: function() {
        return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    },

    /**
     * Attempts to destroy any objects passed to it by removing all event listeners, removing them from the
     * DOM (if applicable) and calling their destroy functions (if available).  This method is primarily
     * intended for arguments of type {@link Ext.core.Element} and {@link Ext.Component}, but any subclass of
     * {@link Ext.util.Observable} can be passed in.  Any number of elements and/or components can be
     * passed into this function in a single call as separate arguments.
     * @param {Mixed} arg1 An {@link Ext.core.Element}, {@link Ext.Component}, or an Array of either of these to destroy
     * @param {Mixed} arg2 (optional)
     * @param {Mixed} etc... (optional)
     */
    destroy: function() {
        var ln = arguments.length,
        i, arg;

        for (i = 0; i < ln; i++) {
            arg = arguments[i];
            if (arg) {
                if (Ext.isArray(arg)) {
                    this.destroy.apply(this, arg);
                }
                else if (Ext.isFunction(arg.destroy)) {
                    arg.destroy();
                }
                else if (arg.dom) {
                    arg.remove();
                }
            }
        }
    },

    /**
     * Execute a callback function in a particular scope. If no function is passed the call is ignored.
     * @param {Function} callback The callback to execute
     * @param {Object} scope (optional) The scope to execute in
     * @param {Array} args (optional) The arguments to pass to the function
     * @param {Number} delay (optional) Pass a number to delay the call by a number of milliseconds.
     */
    callback: function(callback, scope, args, delay){
        if(Ext.isFunction(callback)){
            args = args || [];
            scope = scope || window;
            if (delay) {
                Ext.defer(callback, delay, scope, args);
            } else {
                callback.apply(scope, args);
            }
        }
    },


    /**
     * Takes an object and converts it to an encoded URL. e.g. Ext.urlEncode({foo: 1, bar: 2}); would return "foo=1&bar=2".  Optionally,
     * property values can be arrays, instead of keys and the resulting string that's returned will contain a name/value pair for each array value.
     * @param {Object} o The object to encode
     * @param {String} pre (optional) A prefix to add to the url encoded string
     * @return {String}
     */
    urlEncode : function(o, pre) {
        var empty,
            buf = [],
            e = encodeURIComponent;

        Ext.iterate(o, function(key, item){
            empty = Ext.isEmpty(item);
            Ext.each(empty ? key : item, function(val){
                buf.push('&', e(key), '=', (!Ext.isEmpty(val) && (val != key || !empty)) ? (Ext.isDate(val) ? Ext.encode(val).replace(/"/g, '') : e(val)) : '');
            });
        });

        if(!pre){
            buf.shift();
            pre = '';
        }

        return pre + buf.join('');
    },

    /**
     * Takes an encoded URL and and converts it to an object. Example:
     * <pre><code>
Ext.urlDecode("foo=1&bar=2"); // returns {foo: "1", bar: "2"}
Ext.urlDecode("foo=1&bar=2&bar=3&bar=4", false); // returns {foo: "1", bar: ["2", "3", "4"]}
       </code></pre>
     * @param {String} string
     * @param {Boolean} overwrite (optional) Items of the same name will overwrite previous values instead of creating an an array (Defaults to false).
     * @return {Object} A literal with members
     */
    urlDecode : function(string, overwrite) {
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
            value = d(pair[1]);
            obj[name] = overwrite || !obj[name] ? value : [].concat(obj[name]).concat(value);
        });

        return obj;
    },

    /**
     * Convert certain characters (&, <, >, and ') to their HTML character equivalents for literal display in web pages.
     * @param {String} value The string to encode
     * @return {String} The encoded text
     */
    htmlEncode : function(value) {
        return Ext.String.htmlEncode(value);
    },

    /**
     * Convert certain characters (&, <, >, and ') from their HTML character equivalents.
     * @param {String} value The string to decode
     * @return {String} The decoded text
     */
    htmlDecode : function(value) {
         return Ext.String.htmlDecode(value);
    },

    /**
     * Appends content to the query string of a URL, handling logic for whether to place
     * a question mark or ampersand.
     * @param {String} url The URL to append to.
     * @param {String} s The content to append to the URL.
     * @return (String) The resulting URL
     */
    urlAppend : function(url, s) {
        if (!Ext.isEmpty(s)) {
            return url + (url.indexOf('?') === -1 ? '?' : '&') + s;
        }
        return url;
    },

     /**
      * Iterates an array calling the supplied function.
      * @param {Array/NodeList/Mixed} array The array to be iterated. If this
      * argument is not really an array, the supplied function is called once.
      * @param {Function} fn The function to be called with each item. If the
      * supplied function returns false, iteration stops and this method returns
      * the current <code>index</code>. This function is called with
      * the following arguments:
      * <div class="mdetail-params"><ul>
      * <li><code>item</code> : <i>Mixed</i>
      * <div class="sub-desc">The item at the current <code>index</code>
      * in the passed <code>array</code></div></li>
      * <li><code>index</code> : <i>Number</i>
      * <div class="sub-desc">The current index within the array</div></li>
      * <li><code>allItems</code> : <i>Array</i>
      * <div class="sub-desc">The <code>array</code> passed as the first
      * argument to <code>Ext.each</code>.</div></li>
      * </ul></div>
      * @param {Object} scope The scope (<code>this</code> reference) in which the specified function is executed.
      * Defaults to the <code>item</code> at the current <code>index</code>util
      * within the passed <code>array</code>.
      * @return See description for the fn parameter.
      */
     each : function(array, fn, scope) {
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
      * Iterates either the elements in an array, or each of the properties in an object.
      * <b>Note</b>: If you are only iterating arrays, it is better to call {@link #each}.
      * @param {Object/Array} object The object or array to be iterated
      * @param {Function} fn The function to be called for each iteration.
      * The iteration will stop if the supplied function returns false, or
      * all array elements / object properties have been covered. The signature
      * varies depending on the type of object being interated:
      * <div class="mdetail-params"><ul>
      * <li>Arrays : <tt>(Object item, Number index, Array allItems)</tt>
      * <div class="sub-desc">
      * When iterating an array, the supplied function is called with each item.</div></li>
      * <li>Objects : <tt>(String key, Object value, Object)</tt>
      * <div class="sub-desc">
      * When iterating an object, the supplied function is called with each key-value pair in
      * the object, and the iterated object</div></li>
      * </ul></divutil>
      * @param {Object} scope The scope (<code>this</code> reference) in which the specified function is executed. Defaults to
      * the <code>object</code> being iterated.
      */
     iterate : function(obj, fn, scope) {
         if (Ext.isEmpty(obj)) {
             return;
         }
         if (Ext.isIterable(obj)) {
             Ext.each(obj, fn, scope);
             return;
         }
         else if (Ext.isObject(obj)) {
             for (var prop in obj) {
                 if (obj.hasOwnProperty(prop)) {
                     if (fn.call(scope || obj, prop, obj[prop], obj) === false) {
                         return;
                     }
                 }
             }
         }
     }
});


Ext.ns = Ext.namespace;

Ext.ns(
    'Ext.util',
    'Ext.data',
    'Ext.list',
    'Ext.form',
    'Ext.menu',
    'Ext.state',
    'Ext.layout',
    'Ext.app',
    'Ext.ux',
    'Ext.plugins',
    'Ext.direct',
    'Ext.lib',
    'Ext.gesture',
    'Ext.core'
);


// for old browsers
window.undefined = window.undefined;
Ext.ns("Ext.grid", "Ext.list", "Ext.dd", "Ext.tree", "Ext.form", "Ext.menu",
       "Ext.state", "Ext.layout", "Ext.app", "Ext.ux", "Ext.chart", "Ext.direct");
/**
 * @class Ext
 * Ext core utilities and functions.
 * @singleton
 */
(function(){
    var check = function(regex){
            return regex.test(Ext.userAgent);
        },
        docMode = document.documentMode,
        isOpera = check(/opera/),
        isChrome = check(/\bchrome\b/),
        isWebKit = check(/webkit/),
        isSafari = !isChrome && check(/safari/),
        isSafari2 = isSafari && check(/applewebkit\/4/), // unique to Safari 2
        isSafari3 = isSafari && check(/version\/3/),
        isSafari4 = isSafari && check(/version\/4/),
        isIE = !isOpera && check(/msie/),
        isIE7 = isIE && (check(/msie 7/) || docMode == 7),
        isIE8 = isIE && (check(/msie 8/) && docMode != 7 && docMode != 9 || docMode == 8),
        isIE9 = isIE && (check(/msie 9/) && docMode != 7 && docMode != 8 || docMode == 9),
        isIE6 = isIE && !isIE7 && !isIE8 && !isIE9,
        isGecko = !isWebKit && check(/gecko/),
        isGecko3 = isGecko && check(/rv:1\.9/),
        isGecko4 = isGecko && check(/rv:2\.0/),
        isWindows = check(/windows|win32/),
        isMac = check(/macintosh|mac os x/),
        isAir = check(/adobeair/),
        isLinux = check(/linux/),
        scrollWidth = null;

    // remove css image flicker
    try {
        document.execCommand("BackgroundImageCache", false, true);
    } catch(e) {}

    Ext.setVersion('extjs', '4.0.0pr5');
    Ext.apply(Ext, {
        /**
         * URL to a blank file used by Ext when in secure mode for iframe src and onReady src to prevent
         * the IE insecure content warning (<tt>'about:blank'</tt>, except for IE in secure mode, which is <tt>'javascript:""'</tt>).
         * @type String
         */
        SSL_SECURE_URL : Ext.isSecure && isIE ? 'javascript:""' : 'about:blank',

        /**
         * True if the {@link Ext.fx.Anim} Class is available
         * @type Boolean
         * @property enableFx
         */

        /**
         * True to scope the reset CSS to be just applied to Ext components. Note that this wraps root containers
         * with an additional element. Also remember that when you turn on this option, you have to use ext-all-scoped {
         * unless you use the bootstrap.js to load your javascript, in which case it will be handled for you.
         * @type Boolean
         */
        scopeResetCSS : Ext.buildSettings.scopeResetCSS,

        /**
         * EXPERIMENTAL - True to cascade listener removal to child elements when an element is removed.
         * Currently not optimized for performance.
         * @type Boolean
         */
        enableNestedListenerRemoval : false,

        /**
         * Indicates whether to use native browser parsing for JSON methods.
         * This option is ignored if the browser does not support native JSON methods.
         * <b>Note: Native JSON methods will not work with objects that have functions.
         * Also, property names must be quoted, otherwise the data will not parse.</b> (Defaults to false)
         * @type Boolean
         */
        USE_NATIVE_JSON : false,

        /**
         * Converts any iterable (numeric indices and a length property) into a true array
         * Don't use this on strings. IE doesn't support "abc"[0] which this implementation depends on.
         * For strings, use this instead: "abc".match(/./g) => [a,b,c];
         * @param {Iterable} the iterable object to be turned into a true Array.
         * @return (Array) array
         */
        toArray : function() {
            return Ext.Array.toArray = isIE ?
                function(a, i, j, res) {
                    res = [];
                    for (var x = 0, len = a.length; x < len; x++) {
                        res.push(a[x]);
                    }
                    return res.slice(i || 0, j || res.length);
                } :
                function(a, i, j) {
                    return Array.prototype.slice.call(a, i || 0, j || a.length);
                };
        }(),

        /**
         * Return the dom node for the passed String (id), dom node, or Ext.core.Element.
         * Optional 'strict' flag is needed for IE since it can return 'name' and
         * 'id' elements by using getElementById.
         * Here are some examples:
         * <pre><code>
// gets dom node based on id
var elDom = Ext.getDom('elId');
// gets dom node based on the dom node
var elDom1 = Ext.getDom(elDom);

// If we don&#39;t know if we are working with an
// Ext.core.Element or a dom node use Ext.getDom
function(el){
    var dom = Ext.getDom(el);
    // do something with the dom node
}
         * </code></pre>
         * <b>Note</b>: the dom node to be found actually needs to exist (be rendered, etc)
         * when this method is called to be successful.
         * @param {Mixed} el
         * @return HTMLElement
         */
        getDom : function(el, strict) {
            if (!el || !document) {
                return null;
            }
            if (el.dom) {
                return el.dom;
            } else {
                if (typeof el == 'string') {
                    var e = document.getElementById(el);
                    // IE returns elements with the 'name' and 'id' attribute.
                    // we do a strict check to return the element with only the id attribute
                    if (e && strict) {
                        return;
                        if (el == e.getAttribute('id')) {
                            return e;
                        } else {
                            return null;
                        }
                    }
                    return e;
                } else {
                    return el;
                }
            }
        },

        /**
         * Removes a DOM node from the document.
         * <p>Removes this element from the document, removes all DOM event listeners, and deletes the cache reference.
         * All DOM event listeners are removed from this element. If {@link Ext#enableNestedListenerRemoval Ext.enableNestedListenerRemoval} is
         * <code>true</code>, then DOM event listeners are also removed from all child nodes. The body node
         * will be ignored if passed in.</p>
         * @param {HTMLElement} node The node to remove
         */
        removeNode : isIE6 || isIE7 ? function() {
            var d;
            return function(n){
                if(n && n.tagName != 'BODY'){
                    (Ext.enableNestedListenerRemoval) ? Ext.EventManager.purgeElement(n) : Ext.EventManager.removeAll(n);
                    d = d || document.createElement('div');
                    d.appendChild(n);
                    d.innerHTML = '';
                    delete Ext.cache[n.id];
                }
            };
        }() : function(n) {
            if (n && n.parentNode && n.tagName != 'BODY') {
                (Ext.enableNestedListenerRemoval) ? Ext.EventManager.purgeElement(n) : Ext.EventManager.removeAll(n);
                n.parentNode.removeChild(n);
                delete Ext.cache[n.id];
            }
        },

        /**
         * True if the detected browser is Opera.
         * @type Boolean
         */
        isOpera : isOpera,

        /**
         * True if the detected browser uses WebKit.
         * @type Boolean
         */
        isWebKit : isWebKit,

        /**
         * True if the detected browser is Chrome.
         * @type Boolean
         */
        isChrome : isChrome,

        /**
         * True if the detected browser is Safari.
         * @type Boolean
         */
        isSafari : isSafari,

        /**
         * True if the detected browser is Safari 3.x.
         * @type Boolean
         */
        isSafari3 : isSafari3,

        /**
         * True if the detected browser is Safari 4.x.
         * @type Boolean
         */
        isSafari4 : isSafari4,

        /**
         * True if the detected browser is Safari 2.x.
         * @type Boolean
         */
        isSafari2 : isSafari2,

        /**
         * True if the detected browser is Internet Explorer.
         * @type Boolean
         */
        isIE : isIE,

        /**
         * True if the detected browser is Internet Explorer 6.x.
         * @type Boolean
         */
        isIE6 : isIE6,

        /**
         * True if the detected browser is Internet Explorer 7.x.
         * @type Boolean
         */
        isIE7 : isIE7,

        /**
         * True if the detected browser is Internet Explorer 8.x.
         * @type Boolean
         */
        isIE8 : isIE8,

        /**
         * True if the detected browser is Internet Explorer 9.x.
         * @type Boolean
         */
        isIE9 : isIE9,

        /**
         * True if the detected browser uses the Gecko layout engine (e.g. Mozilla, Firefox).
         * @type Boolean
         */
        isGecko : isGecko,

        /**
         * True if the detected browser uses a Gecko 1.9+ layout engine (e.g. Firefox 3.x).
         * @type Boolean
         */
        isGecko3 : isGecko3,

        /**
         * True if the detected browser uses a Gecko 2.0+ layout engine (e.g. Firefox 4.x).
         * @type Boolean
         */
        isGecko4 : isGecko4,

        /**
         * True if the detected platform is Linux.
         * @type Boolean
         */
        isLinux : isLinux,

        /**
         * True if the detected platform is Windows.
         * @type Boolean
         */
        isWindows : isWindows,

        /**
         * True if the detected platform is Mac OS.
         * @type Boolean
         */
        isMac : isMac,

        /**
         * True if the detected platform is Adobe Air.
         * @type Boolean
         */
        isAir : isAir,

        /**
         * URL to a 1x1 transparent gif image used by Ext to create inline icons with CSS background images.
         * In older versions of IE, this defaults to "http://extjs.com/s.gif" and you should change this to a URL on your server.
         * For other browsers it uses an inline data URL.
         * @type String
         */
        BLANK_IMAGE_URL : (isIE6 || isIE7 || isAir) ? 'http:/' + '/www.extjs.com/s.gif' : 'data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',

        /**
         * <p>Utility method for returning a default value if the passed value is empty.</p>
         * <p>The value is deemed to be empty if it is<div class="mdetail-params"><ul>
         * <li>null</li>
         * <li>undefined</li>
         * <li>an empty array</li>
         * <li>a zero length string (Unless the <tt>allowBlank</tt> parameter is <tt>true</tt>)</li>
         * </ul></div>
         * @param {Mixed} value The value to test
         * @param {Mixed} defaultValue The value to return if the original value is empty
         * @param {Boolean} allowBlank (optional) true to allow zero length strings to qualify as non-empty (defaults to false)
         * @return {Mixed} value, if non-empty, else defaultValue
         */
        value : function(v, defaultValue, allowBlank){
            return Ext.isEmpty(v, allowBlank) ? defaultValue : v;
        },

        /**
         * Escapes the passed string for use in a regular expression
         * @param {String} str
         * @return {String}
         */
        escapeRe : function(s) {
            return s.replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1");
        },

        /**
         * Applies event listeners to elements by selectors when the document is ready.
         * The event name is specified with an <tt>&#64;</tt> suffix.
         * <pre><code>
Ext.addBehaviors({
    // add a listener for click on all anchors in element with id foo
    '#foo a&#64;click' : function(e, t){
        // do something
    },

    // add the same listener to multiple selectors (separated by comma BEFORE the &#64;)
    '#foo a, #bar span.some-class&#64;mouseover' : function(){
        // do something
    }
});
         * </code></pre>
         * @param {Object} obj The list of behaviors to apply
         */
        addBehaviors : function(o){
            if(!Ext.isReady){
                Ext.onReady(function(){
                    Ext.addBehaviors(o);
                });
            } else {
                var cache = {}, // simple cache for applying multiple behaviors to same selector does query multiple times
                    parts,
                    b,
                    s;
                for (b in o) {
                    if ((parts = b.split('@'))[1]) { // for Object prototype breakers
                        s = parts[0];
                        if(!cache[s]){
                            cache[s] = Ext.select(s);
                        }
                        cache[s].on(parts[1], o[b]);
                    }
                }
                cache = null;
            }
        },

        /**
         * Utility method for getting the width of the browser scrollbar. This can differ depending on
         * operating system settings, such as the theme or font size.
         * @param {Boolean} force (optional) true to force a recalculation of the value.
         * @return {Number} The width of the scrollbar.
         */
        getScrollBarWidth: function(force){
            if(!Ext.isReady){
                return 0;
            }

            if(force === true || scrollWidth === null){
                    // Append our div, do our calculation and then remove it
                var div = Ext.getBody().createChild('<div class="' + Ext.baseCSSPrefix + 'hide-offsets" style="width:100px;height:50px;overflow:hidden;"><div style="height:200px;"></div></div>'),
                    child = div.child('div', true);
                var w1 = child.offsetWidth;
                div.setStyle('overflow', (Ext.isWebKit || Ext.isGecko) ? 'auto' : 'scroll');
                var w2 = child.offsetWidth;
                div.remove();
                // Need to add 2 to ensure we leave enough space
                scrollWidth = w1 - w2 + 2;
            }
            return scrollWidth;
        },

        /**
         * Copies a set of named properties fom the source object to the destination object.
         * <p>example:<pre><code>
ImageComponent = Ext.extend(Ext.Component, {
    initComponent: function() {
        this.autoEl = { tag: 'img' };
        MyComponent.superclass.initComponent.apply(this, arguments);
        this.initialBox = Ext.copyTo({}, this.initialConfig, 'x,y,width,height');
    }
});
         * </code></pre>
         * @param {Object} dest The destination object.
         * @param {Object} source The source object.
         * @param {Array/String} names Either an Array of property names, or a comma-delimited list
         * of property names to copy.
         * @param {Boolean} usePrototypeKeys (Optional) Defaults to false. Pass true to copy keys off of the prototype as well as the instance.
         * @return {Object} The modified object.
        */
        copyTo : function(dest, source, names, usePrototypeKeys){
            if(typeof names == 'string'){
                names = names.split(/[,;\s]/);
            }
            Ext.each(names, function(name){
                if(usePrototypeKeys || source.hasOwnProperty(name)){
                    dest[name] = source[name];
                }
            }, this);
            return dest;
        },

        /**
         * Attempts to destroy and then remove a set of named properties of the passed object.
         * @param {Object} o The object (most likely a Component) who's properties you wish to destroy.
         * @param {Mixed} arg1 The name of the property to destroy and remove from the object.
         * @param {Mixed} etc... More property names to destroy and remove.
         */
        destroyMembers : function(o, arg1, arg2, etc){
            for (var i = 1, a = arguments, len = a.length; i < len; i++) {
                Ext.destroy(o[a[i]]);
                delete o[a[i]];
            }
        },

        /**
         * Creates a copy of the passed Array with falsy values removed.
         * @param {Array/NodeList} arr The Array from which to remove falsy values.
         * @return {Array} The new, compressed Array.
         */
        clean : function(arr){
            var ret = [];
            Ext.each(arr, function(v){
                if(!!v){
                    ret.push(v);
                }
            });
            return ret;
        },

        /**
         * Creates a copy of the passed Array, filtered to contain only unique values.
         * @param {Array} arr The Array to filter
         * @return {Array} The new Array containing unique values.
         */
        unique : function(arr){
            var ret = [],
                collect = {};

            Ext.each(arr, function(v) {
                if(!collect[v]){
                    ret.push(v);
                }
                collect[v] = true;
            });
            return ret;
        },

        /**
         * Recursively flattens into 1-d Array. Injects Arrays inline.
         * @param {Array} arr The array to flatten
         * @return {Array} The new, flattened array.
         */
        flatten : function(arr){
            var worker = [];
            function rFlatten(a) {
                Ext.each(a, function(v) {
                    if(Ext.isArray(v)){
                        rFlatten(v);
                    }else{
                        worker.push(v);
                    }
                });
                return worker;
            }
            return rFlatten(arr);
        },

        /**
         * Returns the minimum value in the Array.
         * @param {Array|NodeList} arr The Array from which to select the minimum value.
         * @param {Function} comp (optional) a function to perform the comparision which determines minimization.
         *                   If omitted the "<" operator will be used. Note: gt = 1; eq = 0; lt = -1
         * @return {Object} The minimum value in the Array.
         */
        min : function(arr, comp){
            var ret = arr[0];
            comp = comp || function(a,b){ return a < b ? -1 : 1; };
            Ext.each(arr, function(v) {
                ret = comp(ret, v) == -1 ? ret : v;
            });
            return ret;
        },

        /**
         * Returns the maximum value in the Array
         * @param {Array|NodeList} arr The Array from which to select the maximum value.
         * @param {Function} comp (optional) a function to perform the comparision which determines maximization.
         *                   If omitted the ">" operator will be used. Note: gt = 1; eq = 0; lt = -1
         * @return {Object} The maximum value in the Array.
         */
        max : function(arr, comp){
            var ret = arr[0];
            comp = comp || function(a,b){ return a > b ? 1 : -1; };
            Ext.each(arr, function(v) {
                ret = comp(ret, v) == 1 ? ret : v;
            });
            return ret;
        },

        /**
         * Calculates the mean of the Array
         * @param {Array} arr The Array to calculate the mean value of.
         * @return {Number} The mean.
         */
        mean : function(arr){
           return arr.length > 0 ? Ext.sum(arr) / arr.length : undefined;
        },

        /**
         * Calculates the sum of the Array
         * @param {Array} arr The Array to calculate the sum value of.
         * @return {Number} The sum.
         */
        sum : function(arr){
           var ret = 0;
           Ext.each(arr, function(v) {
               ret += v;
           });
           return ret;
        },

        /**
         * Partitions the set into two sets: a true set and a false set.
         * Example:
         * Example2:
         * <pre><code>
// Example 1:
Ext.partition([true, false, true, true, false]); // [[true, true, true], [false, false]]

// Example 2:
Ext.partition(
    Ext.query("p"),
    function(val){
        return val.className == "class1"
    }
);
// true are those paragraph elements with a className of "class1",
// false set are those that do not have that className.
         * </code></pre>
         * @param {Array|NodeList} arr The array to partition
         * @param {Function} truth (optional) a function to determine truth.  If this is omitted the element
         *                   itself must be able to be evaluated for its truthfulness.
         * @return {Array} [true<Array>,false<Array>]
         */
        partition : function(arr, truth){
            var ret = [[],[]];
            Ext.each(arr, function(v, i, a) {
                ret[ (truth && truth(v, i, a)) || (!truth && v) ? 0 : 1].push(v);
            });
            return ret;
        },

        /**
         * Invokes a method on each item in an Array.
         * <pre><code>
// Example:
Ext.invoke(Ext.query("p"), "getAttribute", "id");
// [el1.getAttribute("id"), el2.getAttribute("id"), ..., elN.getAttribute("id")]
         * </code></pre>
         * @param {Array|NodeList} arr The Array of items to invoke the method on.
         * @param {String} methodName The method name to invoke.
         * @param {...*} args Arguments to send into the method invocation.
         * @return {Array} The results of invoking the method on each item in the array.
         */
        invoke : function(arr, methodName){
            var ret = [],
                args = Array.prototype.slice.call(arguments, 2);
            Ext.each(arr, function(v,i) {
                if (v && typeof v[methodName] == 'function') {
                    ret.push(v[methodName].apply(v, args));
                } else {
                    ret.push(undefined);
                }
            });
            return ret;
        },

        /**
         * Plucks the value of a property from each item in the Array
         * <pre><code>
// Example:
Ext.pluck(Ext.query("p"), "className"); // [el1.className, el2.className, ..., elN.className]
         * </code></pre>
         * @param {Array|NodeList} arr The Array of items to pluck the value from.
         * @param {String} prop The property name to pluck from each element.
         * @return {Array} The value from each item in the Array.
         */
        pluck : function(arr, prop){
            var ret = [];
            Ext.each(arr, function(v) {
                ret.push( v[prop] );
            });
            return ret;
        },

        /**
         * <p>Zips N sets together.</p>
         * <pre><code>
// Example 1:
Ext.zip([1,2,3],[4,5,6]); // [[1,4],[2,5],[3,6]]
// Example 2:
Ext.zip(
    [ "+", "-", "+"],
    [  12,  10,  22],
    [  43,  15,  96],
    function(a, b, c){
        return "$" + a + "" + b + "." + c
    }
); // ["$+12.43", "$-10.15", "$+22.96"]
         * </code></pre>
         * @param {Arrays|NodeLists} arr This argument may be repeated. Array(s) to contribute values.
         * @param {Function} zipper (optional) The last item in the argument list. This will drive how the items are zipped together.
         * @return {Array} The zipped set.
         */
        zip : function(){
            var parts = Ext.partition(arguments, function( val ){ return typeof val != 'function'; }),
                arrs = parts[0],
                fn = parts[1][0],
                len = Ext.max(Ext.pluck(arrs, "length")),
                ret = [];

            for (var i = 0; i < len; i++) {
                ret[i] = [];
                if(fn){
                    ret[i] = fn.apply(fn, Ext.pluck(arrs, i));
                }else{
                    for (var j = 0, aLen = arrs.length; j < aLen; j++){
                        ret[i].push( arrs[j][i] );
                    }
                }
            }
            return ret;
        },

        /**
         * Turns an array into a sentence, joined by a specified connector - e.g.:
         * Ext.toSentence(['Adama', 'Tigh', 'Roslin']); //'Adama, Tigh and Roslin'
         * Ext.toSentence(['Adama', 'Tigh', 'Roslin'], 'or'); //'Adama, Tigh or Roslin'
         * @param {Array} items The array to create a sentence from
         * @param {String} connector The string to use to connect the last two words. Usually 'and' or 'or' - defaults to 'and'.
         * @return {String} The sentence string
         */
        toSentence: function(items, connector) {
            var length = items.length;

            if (length <= 1) {
                return items[0];
            } else {
                var head = items.slice(0, length - 1),
                    tail = items[length - 1];

                return Ext.util.Format.format("{0} {1} {2}", head.join(", "), connector || 'and', tail);
            }
        },

        /**
         * By default, Ext intelligently decides whether floating elements should be shimmed. If you are using flash,
         * you may want to set this to true.
         * @type Boolean
         */
        useShims: Ext.isIE6,

        // inspired by a similar function in mootools library
        /**
         * Returns the type of object that is passed in. If the object passed in is null or undefined it
         * return false otherwise it returns one of the following values:<div class="mdetail-params"><ul>
         * <li><b>string</b>: If the object passed is a string</li>
         * <li><b>number</b>: If the object passed is a number</li>
         * <li><b>boolean</b>: If the object passed is a boolean value</li>
         * <li><b>date</b>: If the object passed is a Date object</li>
         * <li><b>function</b>: If the object passed is a function reference</li>
         * <li><b>object</b>: If the object passed is an object</li>
         * <li><b>array</b>: If the object passed is an array</li>
         * <li><b>regexp</b>: If the object passed is a regular expression</li>
         * <li><b>element</b>: If the object passed is a DOM Element</li>
         * <li><b>nodelist</b>: If the object passed is a DOM NodeList</li>
         * <li><b>textnode</b>: If the object passed is a DOM text node and contains something other than whitespace</li>
         * <li><b>whitespace</b>: If the object passed is a DOM text node and contains only whitespace</li>
         * </ul></div>
         * @param {Mixed} object
         * @return {String}
         */
        type : function(o){
            if(o === undefined || o === null){
                return false;
            }
            if(o.htmlElement){
                return 'element';
            }
            var t = typeof o;
            if(t == 'object' && o.nodeName) {
                switch(o.nodeType) {
                    case 1: return 'element';
                    case 3: return (/\S/).test(o.nodeValue) ? 'textnode' : 'whitespace';
                }
            }
            if(t == 'object' || t == 'function') {
                switch(o.constructor) {
                    case Array: return 'array';
                    case RegExp: return 'regexp';
                    case Date: return 'date';
                }
                if(typeof o.length == 'number' && typeof o.item == 'function') {
                    return 'nodelist';
                }
            }
            return t;
        }
    });
})();

/**
 * @class Ext.util.Format
 * Reusable data formatting functions
 * @singleton
 */
(function() {
    Ext.ns('Ext.util');

    Ext.util.Format = {};
    var UtilFormat     = Ext.util.Format,
        trimRe         = /^\s+|\s+$/g,
        stripTagsRE    = /<\/?[^>]+>/gi,
        stripScriptsRe = /(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)/ig,
        nl2brRe        = /\r?\n/g,

        // A RegExp to remove from a number format string, all characters except digits and '.'
        formatCleanRe  = /[^\d\.]/g,

        // A RegExp to remove from a number format string, all characters except digits and the local decimal separator.
        // Created on first use. The local decimal separator character must be initialized for this to be created.
        I18NFormatCleanRe;

    Ext.apply(UtilFormat, {
        /**
         * @type String
         * @property thousandSeparator
         * <p>The character that the {@link #number} function uses as a thousand separator.</p>
         * <p>This defaults to <code>,</code>, but may be overridden in a locale file.</p>
         */
        thousandSeparator: ',',

        /**
         * @type String
         * @property decimalSeparator
         * <p>The character that the {@link #number} function uses as a decimal point.</p>
         * <p>This defaults to <code>.</code>, but may be overridden in a locale file.</p>
         */
        decimalSeparator: '.',

        /**
         * @type Number
         * @property currencyPrecision
         * <p>The number of decimal places that the {@link #currency} function displays.</p>
         * <p>This defaults to <code>2</code>, but may be overridden in a locale file.</p>
         */
        currencyPrecision: 2,

        /**
         * @type String
         * @property currencySign
         * <p>The currency sign that the {@link #currency} function displays.</p>
         * <p>This defaults to <code>$</code>, but may be overridden in a locale file.</p>
         */
        currencySign: '$',

        /**
         * @type Boolean
         * @property currencyAtEnd
         * <p>This may be set to <code>true</code> to make the {@link #currency} function
         * append the currency sign to the formatted value.</p>
         * <p>This defaults to <code>false</code>, but may be overridden in a locale file.</p>
         */
        currencyAtEnd: false,

        /**
         * Checks a reference and converts it to empty string if it is undefined
         * @param {Mixed} value Reference to check
         * @return {Mixed} Empty string if converted, otherwise the original value
         */
        undef : function(value) {
            return value !== undefined ? value : "";
        },

        /**
         * Checks a reference and converts it to the default value if it's empty
         * @param {Mixed} value Reference to check
         * @param {String} defaultValue The value to insert of it's undefined (defaults to "")
         * @return {String}
         */
        defaultValue : function(value, defaultValue) {
            return value !== undefined && value !== '' ? value : defaultValue;
        },

        /**
         * Trims any whitespace from either side of a string
         * @param {String} value The text to trim
         * @return {String} The trimmed text
         */
        trim : function(value) {
            return String(value).replace(trimRe, "");
        },

        /**
         * Returns a substring from within an original string
         * @param {String} value The original text
         * @param {Number} start The start index of the substring
         * @param {Number} length The length of the substring
         * @return {String} The substring
         */
        substr : function(value, start, length) {
            return String(value).substr(start, length);
        },

        /**
         * Converts a string to all lower case letters
         * @param {String} value The text to convert
         * @return {String} The converted text
         */
        lowercase : function(value) {
            return String(value).toLowerCase();
        },

        /**
         * Converts a string to all upper case letters
         * @param {String} value The text to convert
         * @return {String} The converted text
         */
        uppercase : function(value) {
            return String(value).toUpperCase();
        },

        // private
        call : function(value, fn) {
            if (arguments.length > 2) {
                var args = Array.prototype.slice.call(arguments, 2);
                args.unshift(value);
                return eval(fn).apply(window, args);
            } else {
                return eval(fn).call(window, value);
            }
        },

        /**
         * Format a number as US currency
         * @param {Number/String} value The numeric value to format
         * @return {String} The formatted currency string
         */
        usMoney : function(v) {
            return UtilFormat.currency(v, '$', 2);
        },

        /**
         * Format a number as a currency
         * @param {Number/String} value The numeric value to format
         * @param {String} sign The currency sign to use (defaults to {@link #currencySign})
         * @param {Number} decimals The number of decimals to use for the currency (defaults to {@link #currencyPrecision})
         * @param {Boolean} end True if the currency sign should be at the end of the string (defaults to {@link #currencyAtEnd})
         * @return {String} The formatted currency string
         */
        currency: function(v, currencySign, decimals, end) {
            var negativeSign = '';
            v = v - 0;
            if (v < 0) {
                v = -v;
                negativeSign = '-';
            }
            v = v.toFixed(decimals || UtilFormat.currencyPrecision).replace('.', UtilFormat.decimalSeparator);
            if ((end || UtilFormat.currencyAtEnd) === true) {
                return Ext.String.format("{0}{1}{2}", negativeSign, v, currencySign || UtilFormat.currencySign);
            } else {
                return Ext.String.format("{0}{1}{2}", negativeSign, currencySign || UtilFormat.currencySign, v);
            }
        },

        /**
         * Formats the passed date using the specified format pattern.
         * @param {String/Date} value The value to format. If a string is passed, it is converted to a Date by the Javascript
         * Date object's <a href="http://www.w3schools.com/jsref/jsref_parse.asp">parse()</a> method.
         * @param {String} format (Optional) Any valid date format string. Defaults to {@link Ext.Date#defaultFormat}.
         * @return {String} The formatted date string.
         */
        date: function(v, format) {
            if (!v) {
                return "";
            }
            if (!Ext.isDate(v)) {
                v = new Date(Date.parse(v));
            }
            return Ext.Date.dateFormat(v, format || Ext.Date.defaultFormat);
        },

        /**
         * Returns a date rendering function that can be reused to apply a date format multiple times efficiently
         * @param {String} format Any valid date format string. Defaults to {@link Ext.Date#defaultFormat}.
         * @return {Function} The date formatting function
         */
        dateRenderer : function(format) {
            return function(v) {
                return UtilFormat.date(v, format);
            };
        },

        /**
         * Strips all HTML tags
         * @param {Mixed} value The text from which to strip tags
         * @return {String} The stripped text
         */
        stripTags : function(v) {
            return !v ? v : String(v).replace(stripTagsRE, "");
        },

        /**
         * Strips all script tags
         * @param {Mixed} value The text from which to strip script tags
         * @return {String} The stripped text
         */
        stripScripts : function(v) {
            return !v ? v : String(v).replace(stripScriptsRe, "");
        },

        /**
         * Simple format for a file size (xxx bytes, xxx KB, xxx MB)
         * @param {Number/String} size The numeric value to format
         * @return {String} The formatted file size
         */
        fileSize : function(size) {
            if (size < 1024) {
                return size + " bytes";
            } else if (size < 1048576) {
                return (Math.round(((size*10) / 1024))/10) + " KB";
            } else {
                return (Math.round(((size*10) / 1048576))/10) + " MB";
            }
        },

        /**
         * It does simple math for use in a template, for example:<pre><code>
         * var tpl = new Ext.Template('{value} * 10 = {value:math("* 10")}');
         * </code></pre>
         * @return {Function} A function that operates on the passed value.
         */
        math : function(){
            var fns = {};

            return function(v, a){
                if (!fns[a]) {
                    fns[a] = Ext.functionFactory('v', 'return v ' + a + ';');
                }
                return fns[a](v);
            };
        }(),

        /**
         * Rounds the passed number to the required decimal precision.
         * @param {Number/String} value The numeric value to round.
         * @param {Number} precision The number of decimal places to which to round the first parameter's value.
         * @return {Number} The rounded value.
         */
        round : function(value, precision) {
            var result = Number(value);
            if (typeof precision == 'number') {
                precision = Math.pow(10, precision);
                result = Math.round(value * precision) / precision;
            }
            return result;
        },

        /**
         * <p>Formats the passed number according to the passed format string.</p>
         * <p>The number of digits after the decimal separator character specifies the number of
         * decimal places in the resulting string. The <u>local-specific</u> decimal character is used in the result.</p>
         * <p>The <i>presence</i> of a thousand separator character in the format string specifies that
         * the <u>locale-specific</u> thousand separator (if any) is inserted separating thousand groups.</p>
         * <p>By default, "," is expected as the thousand separator, and "." is expected as the decimal separator.</p>
         * <p><b>New to Ext4</b></p>
         * <p>Locale-specific characters are always used in the formatted output when inserting
         * thousand and decimal separators.</p>
         * <p>The format string must specify separator characters according to US/UK conventions ("," as the
         * thousand separator, and "." as the decimal separator)</p>
         * <p>To allow specification of format strings according to local conventions for separator characters, add
         * the string <code>/i</code> to the end of the format string.</p>
         * <div style="margin-left:40px">examples (123456.789):
         * <div style="margin-left:10px">
         * 0 - (123456) show only digits, no precision<br>
         * 0.00 - (123456.78) show only digits, 2 precision<br>
         * 0.0000 - (123456.7890) show only digits, 4 precision<br>
         * 0,000 - (123,456) show comma and digits, no precision<br>
         * 0,000.00 - (123,456.78) show comma and digits, 2 precision<br>
         * 0,0.00 - (123,456.78) shortcut method, show comma and digits, 2 precision<br>
         * To allow specification of the formatting string using UK/US grouping characters (,) and decimal (.) for international numbers, add /i to the end.
         * For example: 0.000,00/i
         * </div></div>
         * @param {Number} v The number to format.
         * @param {String} format The way you would like to format this text.
         * @return {String} The formatted number.
         */
        number:
            function(v, formatString) {
            if (!formatString) {
                return v;
            }
            v = Ext.num(v, NaN);
            if (isNaN(v)) {
                return '';
            }
            var comma = UtilFormat.thousandSeparator,
                dec   = UtilFormat.decimalSeparator,
                i18n  = false,
                neg   = v < 0,
                hasComma,
                psplit;

            v = Math.abs(v);

            // The "/i" suffix allows caller to use a locale-specific formatting string.
            // Clean the format string by removing all but numerals and the decimal separator.
            // Then split the format string into pre and post decimal segments according to *what* the
            // decimal separator is. If they are specifying "/i", they are using the local convention in the format string.
            if (formatString.substr(formatString.length - 2) == '/i') {
                if (!I18NFormatCleanRe) {
                    I18NFormatCleanRe = new RegExp('[^\\d\\' + UtilFormat.decimalSeparator + ']','g');
                }
                formatString = formatString.substr(0, formatString.length - 2);
                i18n   = true;
                hasComma = formatString.indexOf(comma) != -1;
                psplit = formatString.replace(I18NFormatCleanRe, '').split(dec);
            } else {
                hasComma = formatString.indexOf(',') != -1;
                psplit = formatString.replace(formatCleanRe, '').split('.');
            }

            if (1 < psplit.length) {
                v = v.toFixed(psplit[1].length);
            } else if(2 < psplit.length) {
                throw ('NumberFormatException: invalid format, formats should have no more than 1 period: ' + formatString);
            } else {
                v = v.toFixed(0);
            }

            var fnum = v.toString();

            psplit = fnum.split('.');

            if (hasComma) {
                var cnum = psplit[0],
                    parr = [],
                    j    = cnum.length,
                    m    = Math.floor(j / 3),
                    n    = cnum.length % 3 || 3,
                    i;

                for (i = 0; i < j; i += n) {
                    if (i !== 0) {
                        n = 3;
                    }

                    parr[parr.length] = cnum.substr(i, n);
                    m -= 1;
                }
                fnum = parr.join(comma);
                if (psplit[1]) {
                    fnum += dec + psplit[1];
                }
            } else {
                if (psplit[1]) {
                    fnum = psplit[0] + dec + psplit[1];
                }
            }

            return (neg ? '-' : '') + formatString.replace(/[\d,?\.?]+/, fnum);
        },

        /**
         * Returns a number rendering function that can be reused to apply a number format multiple times efficiently
         * @param {String} format Any valid number format string for {@link #number}
         * @return {Function} The number formatting function
         */
        numberRenderer : function(format) {
            return function(v) {
                return UtilFormat.number(v, format);
            };
        },

        /**
         * Selectively do a plural form of a word based on a numeric value. For example, in a template,
         * {commentCount:plural("Comment")}  would result in "1 Comment" if commentCount was 1 or would be "x Comments"
         * if the value is 0 or greater than 1.
         * @param {Number} value The value to compare against
         * @param {String} singular The singular form of the word
         * @param {String} plural (optional) The plural form of the word (defaults to the singular with an "s")
         */
        plural : function(v, s, p) {
            return v +' ' + (v == 1 ? s : (p ? p : s+'s'));
        },

        /**
         * Converts newline characters to the HTML tag &lt;br/>
         * @param {String} The string value to format.
         * @return {String} The string with embedded &lt;br/> tags in place of newlines.
         */
        nl2br : function(v) {
            return Ext.isEmpty(v) ? '' : v.replace(nl2brRe, '<br/>');
        },

        leftPad: Ext.String.leftPad,
        
        format: Ext.String.format,

        /**
         * Parses a number or string representing margin sizes into an object. Supports CSS-style margin declarations
         * (e.g. 10, "10", "10 10", "10 10 10" and "10 10 10 10" are all valid options and would return the same result)
         * @param {Number|String} v The encoded margins
         * @return {Object} An object with margin sizes for top, right, bottom and left
         */
        parseBox : function(box) {
            if (Ext.isNumber(box)) {
                box = box.toString();
            }
            var parts  = box.split(' '),
                ln = parts.length;

            if (ln == 1) {
                parts[1] = parts[2] = parts[3] = parts[0];
            }
            else if (ln == 2) {
                parts[2] = parts[0];
                parts[3] = parts[1];
            }
            else if (ln == 3) {
                parts[3] = parts[1];
            }

            return {
                top   :parseInt(parts[0], 10) || 0,
                right :parseInt(parts[1], 10) || 0,
                bottom:parseInt(parts[2], 10) || 0,
                left  :parseInt(parts[3], 10) || 0
            };
        },

        /**
         * Escapes the passed string for use in a regular expression
         * @param {String} str
         * @return {String}
         */
        escapeRegex : function(s) {
            return s.replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1");
        }
    });
})();

/**
 * @class Ext.util.TaskRunner
 * Provides the ability to execute one or more arbitrary tasks in a multithreaded
 * manner.  Generally, you can use the singleton {@link Ext.TaskMgr} instead, but
 * if needed, you can create separate instances of TaskRunner.  Any number of
 * separate tasks can be started at any time and will run independently of each
 * other. Example usage:
 * <pre><code>
// Start a simple clock task that updates a div once per second
var updateClock = function(){
    Ext.fly('clock').update(new Date().format('g:i:s A'));
} 
var task = {
    run: updateClock,
    interval: 1000 //1 second
}
var runner = new Ext.util.TaskRunner();
runner.start(task);

// equivalent using TaskMgr
Ext.TaskMgr.start({
    run: updateClock,
    interval: 1000
});

 * </code></pre>
 * <p>See the {@link #start} method for details about how to configure a task object.</p>
 * Also see {@link Ext.util.DelayedTask}. 
 * 
 * @constructor
 * @param {Number} interval (optional) The minimum precision in milliseconds supported by this TaskRunner instance
 * (defaults to 10)
 */
Ext.ns('Ext.util');

Ext.util.TaskRunner = function(interval) {
    interval = interval || 10;
    var tasks = [],
    removeQueue = [],
    id = 0,
    running = false,

    // private
    stopThread = function() {
        running = false;
        clearInterval(id);
        id = 0;
    },

    // private
    startThread = function() {
        if (!running) {
            running = true;
            id = setInterval(runTasks, interval);
        }
    },

    // private
    removeTask = function(t) {
        removeQueue.push(t);
        if (t.onStop) {
            t.onStop.apply(t.scope || t);
        }
    },

    // private
    runTasks = function() {
        var rqLen = removeQueue.length,
            now = new Date().getTime(),
            i;

        if (rqLen > 0) {
            for (i = 0; i < rqLen; i++) {
                Ext.Array.remove(tasks, removeQueue[i]);
            }
            removeQueue = [];
            if (tasks.length < 1) {
                stopThread();
                return;
            }
        }
        i = 0;
        var t,
            itime,
            rt,
            len = tasks.length;
        for (; i < len; ++i) {
            t = tasks[i];
            itime = now - t.taskRunTime;
            if (t.interval <= itime) {
                rt = t.run.apply(t.scope || t, t.args || [++t.taskRunCount]);
                t.taskRunTime = now;
                if (rt === false || t.taskRunCount === t.repeat) {
                    removeTask(t);
                    return;
                }
            }
            if (t.duration && t.duration <= (now - t.taskStartTime)) {
                removeTask(t);
            }
        }
    };

    /**
     * Starts a new task.
     * @method start
     * @param {Object} task <p>A config object that supports the following properties:<ul>
     * <li><code>run</code> : Function<div class="sub-desc"><p>The function to execute each time the task is invoked. The
     * function will be called at each interval and passed the <code>args</code> argument if specified, and the
     * current invocation count if not.</p>
     * <p>If a particular scope (<code>this</code> reference) is required, be sure to specify it using the <code>scope</code> argument.</p>
     * <p>Return <code>false</code> from this function to terminate the task.</p></div></li>
     * <li><code>interval</code> : Number<div class="sub-desc">The frequency in milliseconds with which the task
     * should be invoked.</div></li>
     * <li><code>args</code> : Array<div class="sub-desc">(optional) An array of arguments to be passed to the function
     * specified by <code>run</code>. If not specified, the current invocation count is passed.</div></li>
     * <li><code>scope</code> : Object<div class="sub-desc">(optional) The scope (<tt>this</tt> reference) in which to execute the
     * <code>run</code> function. Defaults to the task config object.</div></li>
     * <li><code>duration</code> : Number<div class="sub-desc">(optional) The length of time in milliseconds to invoke
     * the task before stopping automatically (defaults to indefinite).</div></li>
     * <li><code>repeat</code> : Number<div class="sub-desc">(optional) The number of times to invoke the task before
     * stopping automatically (defaults to indefinite).</div></li>
     * </ul></p>
     * <p>Before each invocation, Ext injects the property <code>taskRunCount</code> into the task object so
     * that calculations based on the repeat count can be performed.</p>
     * @return {Object} The task
     */
    this.start = function(task) {
        tasks.push(task);
        task.taskStartTime = new Date().getTime();
        task.taskRunTime = 0;
        task.taskRunCount = 0;
        startThread();
        return task;
    };

    /**
     * Stops an existing running task.
     * @method stop
     * @param {Object} task The task to stop
     * @return {Object} The task
     */
    this.stop = function(task) {
        removeTask(task);
        return task;
    };

    /**
     * Stops all tasks that are currently running.
     * @method stopAll
     */
    this.stopAll = function() {
        stopThread();
        for (var i = 0, len = tasks.length; i < len; i++) {
            if (tasks[i].onStop) {
                tasks[i].onStop();
            }
        }
        tasks = [];
        removeQueue = [];
    };
};

/**
 * @class Ext.TaskMgr
 * @extends Ext.util.TaskRunner
 * A static {@link Ext.util.TaskRunner} instance that can be used to start and stop arbitrary tasks.  See
 * {@link Ext.util.TaskRunner} for supported methods and task config properties.
 * <pre><code>
// Start a simple clock task that updates a div once per second
var task = {
    run: function(){
        Ext.fly('clock').update(new Date().format('g:i:s A'));
    },
    interval: 1000 //1 second
}
Ext.TaskMgr.start(task);
</code></pre>
 * <p>See the {@link #start} method for details about how to configure a task object.</p>
 * @singleton
 */
Ext.TaskMgr = new Ext.util.TaskRunner();
/**
 * @class Ext.is
 * 
 * Determines information about the current platform the application is running on.
 * 
 * @singleton
 */
Ext.is = {
    init : function(navigator) {
        var platforms = this.platforms,
            ln = platforms.length,
            i, platform;

        navigator = navigator || window.navigator;

        for (i = 0; i < ln; i++) {
            platform = platforms[i];
            this[platform.identity] = platform.regex.test(navigator[platform.property]);
        }

        /**
         * @property Desktop True if the browser is running on a desktop machine
         * @type {Boolean}
         */
        this.Desktop = this.Mac || this.Windows || (this.Linux && !this.Android);
        /**
         * @property Tablet True if the browser is running on a tablet (iPad)
         */
        this.Tablet = this.iPad;
        /**
         * @property Phone True if the browser is running on a phone.
         * @type {Boolean}
         */
        this.Phone = !this.Desktop && !this.Tablet;
        /**
         * @property iOS True if the browser is running on iOS
         * @type {Boolean}
         */
        this.iOS = this.iPhone || this.iPad || this.iPod;
        
        /**
         * @property Standalone Detects when application has been saved to homescreen.
         * @type {Boolean}
         */
        this.Standalone = !!window.navigator.standalone;
    },
    
    /**
     * @property iPhone True when the browser is running on a iPhone
     * @type {Boolean}
     */
    platforms: [{
        property: 'platform',
        regex: /iPhone/i,
        identity: 'iPhone'
    },
    
    /**
     * @property iPod True when the browser is running on a iPod
     * @type {Boolean}
     */
    {
        property: 'platform',
        regex: /iPod/i,
        identity: 'iPod'
    },
    
    /**
     * @property iPad True when the browser is running on a iPad
     * @type {Boolean}
     */
    {
        property: 'userAgent',
        regex: /iPad/i,
        identity: 'iPad'
    },
    
    /**
     * @property Blackberry True when the browser is running on a Blackberry
     * @type {Boolean}
     */
    {
        property: 'userAgent',
        regex: /Blackberry/i,
        identity: 'Blackberry'
    },
    
    /**
     * @property Android True when the browser is running on an Android device
     * @type {Boolean}
     */
    {
        property: 'userAgent',
        regex: /Android/i,
        identity: 'Android'
    },
    
    /**
     * @property Mac True when the browser is running on a Mac
     * @type {Boolean}
     */
    {
        property: 'platform',
        regex: /Mac/i,
        identity: 'Mac'
    },
    
    /**
     * @property Windows True when the browser is running on Windows
     * @type {Boolean}
     */
    {
        property: 'platform',
        regex: /Win/i,
        identity: 'Windows'
    },
    
    /**
     * @property Linux True when the browser is running on Linux
     * @type {Boolean}
     */
    {
        property: 'platform',
        regex: /Linux/i,
        identity: 'Linux'
    }]
};

Ext.is.init();

/**
 * @class Ext.supports
 *
 * Determines information about features are supported in the current environment
 * 
 * @singleton
 */
Ext.supports = {
    init : function() {
        var doc = document,
            div = doc.createElement('div'),
            tests = this.tests,
            ln = tests.length,
            i, test;

        div.innerHTML = [
            '<div style="height:30px;width:50px;">',
                '<div style="height:20px;width:20px;"></div>',
            '</div>',
            '<div style="width: 200px; height: 200px; position: relative; padding: 5px;">',
                '<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></div>',
            '</div>',
            '<div style="float:left; background-color:transparent;"></div>'
        ].join('');

        doc.body.appendChild(div);

        for (i = 0; i < ln; i++) {
            test = tests[i];
            this[test.identity] = test.fn.call(this, doc, div);
        }

        doc.body.removeChild(div);
    },

    /**
     * @property ClassList True if document environment supports the HTML5 classList API.
     * @type {Boolean}
     */
    ClassList: !!document.documentElement.classList,

    /**
     * @property OrientationChange True if the device supports orientation change
     * @type {Boolean}
     */
    OrientationChange: ((typeof window.orientation != 'undefined') && ('onorientationchange' in window)),
    
    /**
     * @property DeviceMotion True if the device supports device motion (acceleration and rotation rate)
     * @type {Boolean}
     */
    DeviceMotion: ('ondevicemotion' in window),
    
    /**
     * @property Touch True if the device supports touch
     * @type {Boolean}
     */
    // is.Desktop is needed due to the bug in Chrome 5.0.375, Safari 3.1.2
    // and Safari 4.0 (they all have 'ontouchstart' in the window object).
    Touch: ('ontouchstart' in window) && (!Ext.is.Desktop),

    tests: [
        /**
         * @property Transitions True if the device supports CSS3 Transitions
         * @type {Boolean}
         */
        {
            identity: 'Transitions',
            fn: function(doc, div) {
                var prefix = [
                        'webkit',
                        'Moz',
                        'o',
                        'ms',
                        'khtml'
                    ],
                    TE = 'TransitionEnd',
                    transitionEndName = [
                        prefix[0] + TE,
                        'transitionend', //Moz bucks the prefixing convention
                        prefix[2] + TE,
                        prefix[3] + TE,
                        prefix[4] + TE
                    ],
                    ln = prefix.length,
                    i = 0,
                    out = false;
                div = Ext.get(div);
                for (; i < ln; i++) {
                    if (div.getStyle(prefix[i] + "TransitionProperty")) {
                        Ext.supports.CSS3Prefix = prefix[i];
                        Ext.supports.CSS3TransitionEnd = transitionEndName[i];
                        out = true;
                        break;
                    }
                }
                return out;
            }
        },
        
        /**
         * @property RightMargin True if the device supports right margin.
         * See https://bugs.webkit.org/show_bug.cgi?id=13343 for why this is needed.
         * @type {Boolean}
         */
        {
            identity: 'RightMargin',
            fn: function(doc, div, view) {
                view = doc.defaultView;
                return !(view && view.getComputedStyle(div.firstChild.firstChild, null).marginRight != '0px');
            }
        },
        
        /**
         * @property TransparentColor True if the device supports transparent color
         * @type {Boolean}
         */
        {
            identity: 'TransparentColor',
            fn: function(doc, div, view) {
                view = doc.defaultView;
                return !(view && view.getComputedStyle(div.lastChild, null).backgroundColor != 'transparent');
            }
        },

        /**
         * @property ComputedStyle True if the browser supports document.defaultView.getComputedStyle()
         * @type {Boolean}
         */
        {
            identity: 'ComputedStyle',
            fn: function(doc, div, view) {
                view = doc.defaultView;
                return view && view.getComputedStyle;
            }
        },
        
        /**
         * @property SVG True if the device supports SVG
         * @type {Boolean}
         */
        {
            identity: 'SVG',
            fn: function(doc) {
                return !!doc.createElementNS && !!doc.createElementNS( "http:/" + "/www.w3.org/2000/svg", "svg").createSVGRect;
            }
        },
    
        /**
         * @property Canvas True if the device supports Canvas
         * @type {Boolean}
         */
        {
            identity: 'Canvas',
            fn: function(doc) {
                return !!doc.createElement('canvas').getContext;
            }
        },
        
        /**
         * @property VML True if the device supports VML
         * @type {Boolean}
         */
        {
            identity: 'VML',
            fn: function(doc) {
                var d = doc.createElement("div");
                d.innerHTML = "<!--[if vml]><br><br><![endif]-->";
                return (d.childNodes.length == 2);
            }
        },
        
        /**
         * @property Float True if the device supports CSS float
         * @type {Boolean}
         */
        {
            identity: 'Float',
            fn: function(doc, div) {
                return !!div.lastChild.style.cssFloat;
            }
        },
        
        /**
         * @property AudioTag True if the device supports the HTML5 audio tag
         * @type {Boolean}
         */
        {
            identity: 'AudioTag',
            fn: function(doc) {
                return !!doc.createElement('audio').canPlayType;
            }
        },
        
        /**
         * @property History True if the device supports HTML5 history
         * @type {Boolean}
         */
        {
            identity: 'History',
            fn: function() {
                return !!(window.history && history.pushState);
            }
        },
        
        /**
         * @property CSS3DTransform True if the device supports CSS3DTransform
         * @type {Boolean}
         */
        {
            identity: 'CSS3DTransform',
            fn: function() {
                return (typeof WebKitCSSMatrix != 'undefined' && new WebKitCSSMatrix().hasOwnProperty('m41'));
            }
        },

		/**
         * @property CSS3LinearGradient True if the device supports CSS3 linear gradients
         * @type {Boolean}
         */
        {
            identity: 'CSS3LinearGradient',
            fn: function(doc, div) {
                var property = 'background-image:',
                    webkit   = '-webkit-gradient(linear, left top, right bottom, from(black), to(white))',
                    w3c      = 'linear-gradient(left top, black, white)',
                    moz      = '-moz-' + w3c,
                    options  = [property + webkit, property + w3c, property + moz];
                
                div.style.cssText = options.join(';');
                
                return ("" + div.style.backgroundImage).indexOf('gradient') !== -1;
            }
        },
        
        /**
         * @property CSS3BorderRadius True if the device supports CSS3 border radius
         * @type {Boolean}
         */
        {
            identity: 'CSS3BorderRadius',
            fn: function(doc, div) {
                var domPrefixes = ['borderRadius', 'BorderRadius', 'MozBorderRadius', 'WebkitBorderRadius', 'OBorderRadius', 'KhtmlBorderRadius'],
                    pass = false,
                    i;
                
                for (i = 0; i < domPrefixes.length; i++) {
                    if (document.body.style[domPrefixes[i]] !== undefined) {
                        return true;
                    }
                }
                
                return pass;
            }
        },
        
        /**
         * @property GeoLocation True if the device supports GeoLocation
         * @type {Boolean}
         */
        {
            identity: 'GeoLocation',
            fn: function() {
                return (typeof navigator != 'undefined' && typeof navigator.geolocation != 'undefined') || (typeof google != 'undefined' && typeof google.gears != 'undefined');
            }
        },
        /**
         * @property MouseEnterLeave True if the browser supports mouseenter and mouseleave events
         * @type {Boolean}
         */
        {
            identity: 'MouseEnterLeave',
            fn: function(doc, div){
                return ('onmouseenter' in div && 'onmouseleave' in div);
            }
        },
        /**
         * @property MouseWheel True if the browser supports the mousewheel event
         * @type {Boolean}
         */
        {
            identity: 'MouseWheel',
            fn: function(doc, div) {
                return ('onmousewheel' in div);
            }
        },
        /**
         * @property Opacity True if the browser supports normal css opacity
         * @type {Boolean}
         */
        {
            identity: 'Opacity',
            fn: function(doc, div){
                // Not a strict equal comparison in case opacity can be converted to a number.
                if (Ext.isIE6 || Ext.isIE7 || Ext.isIE8) {
                    return false;
                }
                div.firstChild.style.cssText = 'opacity:0.73';
                return div.firstChild.style.opacity == '0.73';
            }
        },
        /**
         * @property Placeholder True if the browser supports the HTML5 placeholder attribute on inputs
         * @type {Boolean}
         */
        {
            identity: 'Placeholder',
            fn: function(doc) {
                return 'placeholder' in doc.createElement('input');
            }
        },
        /**
         * @property BoundingClientRect True if the browser supports the getBoundingClientRect method on elements
         * @type {Boolean}
         */
        {
            identity: 'BoundingClientRect',
            fn: function(doc, div) {
                return Ext.isFunction(div.getBoundingClientRect);
            }
        },
        {
            identity: 'IncludePaddingInWidthCalculation',
            fn: function(doc, div){
                var el = Ext.get(div.childNodes[1].firstChild);
                return el.getWidth() == 210;
            }
        }
    ]
};

})();

(function(){
/**
 * @class Ext.core.DomHelper
 * <p>The DomHelper class provides a layer of abstraction from DOM and transparently supports creating
 * elements via DOM or using HTML fragments. It also has the ability to create HTML fragment templates
 * from your DOM building code.</p>
 *
 * <p><b><u>DomHelper element specification object</u></b></p>
 * <p>A specification object is used when creating elements. Attributes of this object
 * are assumed to be element attributes, except for 4 special attributes:
 * <div class="mdetail-params"><ul>
 * <li><b><tt>tag</tt></b> : <div class="sub-desc">The tag name of the element</div></li>
 * <li><b><tt>children</tt></b> : or <tt>cn</tt><div class="sub-desc">An array of the
 * same kind of element definition objects to be created and appended. These can be nested
 * as deep as you want.</div></li>
 * <li><b><tt>cls</tt></b> : <div class="sub-desc">The class attribute of the element.
 * This will end up being either the "class" attribute on a HTML fragment or className
 * for a DOM node, depending on whether DomHelper is using fragments or DOM.</div></li>
 * <li><b><tt>html</tt></b> : <div class="sub-desc">The innerHTML for the element</div></li>
 * </ul></div></p>
 *
 * <p><b><u>Insertion methods</u></b></p>
 * <p>Commonly used insertion methods:
 * <div class="mdetail-params"><ul>
 * <li><b><tt>{@link #append}</tt></b> : <div class="sub-desc"></div></li>
 * <li><b><tt>{@link #insertBefore}</tt></b> : <div class="sub-desc"></div></li>
 * <li><b><tt>{@link #insertAfter}</tt></b> : <div class="sub-desc"></div></li>
 * <li><b><tt>{@link #overwrite}</tt></b> : <div class="sub-desc"></div></li>
 * <li><b><tt>{@link #createTemplate}</tt></b> : <div class="sub-desc"></div></li>
 * <li><b><tt>{@link #insertHtml}</tt></b> : <div class="sub-desc"></div></li>
 * </ul></div></p>
 *
 * <p><b><u>Example</u></b></p>
 * <p>This is an example, where an unordered list with 3 children items is appended to an existing
 * element with id <tt>'my-div'</tt>:<br>
 <pre><code>
var dh = Ext.core.DomHelper; // create shorthand alias
// specification object
var spec = {
    id: 'my-ul',
    tag: 'ul',
    cls: 'my-list',
    // append children after creating
    children: [     // may also specify 'cn' instead of 'children'
        {tag: 'li', id: 'item0', html: 'List Item 0'},
        {tag: 'li', id: 'item1', html: 'List Item 1'},
        {tag: 'li', id: 'item2', html: 'List Item 2'}
    ]
};
var list = dh.append(
    'my-div', // the context element 'my-div' can either be the id or the actual node
    spec      // the specification object
);
 </code></pre></p>
 * <p>Element creation specification parameters in this class may also be passed as an Array of
 * specification objects. This can be used to insert multiple sibling nodes into an existing
 * container very efficiently. For example, to add more list items to the example above:<pre><code>
dh.append('my-ul', [
    {tag: 'li', id: 'item3', html: 'List Item 3'},
    {tag: 'li', id: 'item4', html: 'List Item 4'}
]);
 * </code></pre></p>
 *
 * <p><b><u>Templating</u></b></p>
 * <p>The real power is in the built-in templating. Instead of creating or appending any elements,
 * <tt>{@link #createTemplate}</tt> returns a Template object which can be used over and over to
 * insert new elements. Revisiting the example above, we could utilize templating this time:
 * <pre><code>
// create the node
var list = dh.append('my-div', {tag: 'ul', cls: 'my-list'});
// get template
var tpl = dh.createTemplate({tag: 'li', id: 'item{0}', html: 'List Item {0}'});

for(var i = 0; i < 5, i++){
    tpl.append(list, [i]); // use template to append to the actual node
}
 * </code></pre></p>
 * <p>An example using a template:<pre><code>
var html = '<a id="{0}" href="{1}" class="nav">{2}</a>';

var tpl = new Ext.core.DomHelper.createTemplate(html);
tpl.append('blog-roll', ['link1', 'http://www.edspencer.net/', "Ed&#39;s Site"]);
tpl.append('blog-roll', ['link2', 'http://www.dustindiaz.com/', "Dustin&#39;s Site"]);
 * </code></pre></p>
 *
 * <p>The same example using named parameters:<pre><code>
var html = '<a id="{id}" href="{url}" class="nav">{text}</a>';

var tpl = new Ext.core.DomHelper.createTemplate(html);
tpl.append('blog-roll', {
    id: 'link1',
    url: 'http://www.edspencer.net/',
    text: "Ed&#39;s Site"
});
tpl.append('blog-roll', {
    id: 'link2',
    url: 'http://www.dustindiaz.com/',
    text: "Dustin&#39;s Site"
});
 * </code></pre></p>
 *
 * <p><b><u>Compiling Templates</u></b></p>
 * <p>Templates are applied using regular expressions. The performance is great, but if
 * you are adding a bunch of DOM elements using the same template, you can increase
 * performance even further by {@link Ext.Template#compile "compiling"} the template.
 * The way "{@link Ext.Template#compile compile()}" works is the template is parsed and
 * broken up at the different variable points and a dynamic function is created and eval'ed.
 * The generated function performs string concatenation of these parts and the passed
 * variables instead of using regular expressions.
 * <pre><code>
var html = '<a id="{id}" href="{url}" class="nav">{text}</a>';

var tpl = new Ext.core.DomHelper.createTemplate(html);
tpl.compile();

//... use template like normal
 * </code></pre></p>
 *
 * <p><b><u>Performance Boost</u></b></p>
 * <p>DomHelper will transparently create HTML fragments when it can. Using HTML fragments instead
 * of DOM can significantly boost performance.</p>
 * <p>Element creation specification parameters may also be strings. If {@link #useDom} is <tt>false</tt>,
 * then the string is used as innerHTML. If {@link #useDom} is <tt>true</tt>, a string specification
 * results in the creation of a text node. Usage:</p>
 * <pre><code>
Ext.core.DomHelper.useDom = true; // force it to use DOM; reduces performance
 * </code></pre>
 * @singleton
 */
Ext.ns('Ext.core');
Ext.core.DomHelper = function(){
    var tempTableEl = null,
        emptyTags = /^(?:br|frame|hr|img|input|link|meta|range|spacer|wbr|area|param|col)$/i,
        tableRe = /^table|tbody|tr|td$/i,
        confRe = /tag|children|cn|html$/i,
        tableElRe = /td|tr|tbody/i,
        endRe = /end/i,
        pub,
        // kill repeat to save bytes
        afterbegin = 'afterbegin',
        afterend = 'afterend',
        beforebegin = 'beforebegin',
        beforeend = 'beforeend',
        ts = '<table>',
        te = '</table>',
        tbs = ts+'<tbody>',
        tbe = '</tbody>'+te,
        trs = tbs + '<tr>',
        tre = '</tr>'+tbe;

    // private
    function doInsert(el, o, returnElement, pos, sibling, append){
        el = Ext.getDom(el);
        var newNode;
        if (pub.useDom) {
            newNode = createDom(o, null);
            if (append) {
                el.appendChild(newNode);
            } else {
                (sibling == 'firstChild' ? el : el.parentNode).insertBefore(newNode, el[sibling] || el);
            }
        } else {
            newNode = Ext.core.DomHelper.insertHtml(pos, el, Ext.core.DomHelper.createHtml(o));
        }
        return returnElement ? Ext.get(newNode, true) : newNode;
    }
    
    function createDom(o, parentNode){
        var el,
            doc = document,
            useSet,
            attr,
            val,
            cn;

        if (Ext.isArray(o)) {                       // Allow Arrays of siblings to be inserted
            el = doc.createDocumentFragment(); // in one shot using a DocumentFragment
            for (var i = 0, l = o.length; i < l; i++) {
                createDom(o[i], el);
            }
        } else if (typeof o == 'string') {         // Allow a string as a child spec.
            el = doc.createTextNode(o);
        } else {
            el = doc.createElement( o.tag || 'div' );
            useSet = !!el.setAttribute; // In IE some elements don't have setAttribute
            for (attr in o) {
                if(!confRe.test(attr)){
                    val = o[attr];
                    if(attr == 'cls'){
                        el.className = val;
                    }else{
                        if(useSet){
                            el.setAttribute(attr, val);
                        }else{
                            el[attr] = val;
                        }
                    }
                }
            }
            Ext.core.DomHelper.applyStyles(el, o.style);

            if ((cn = o.children || o.cn)) {
                createDom(cn, el);
            } else if (o.html) {
                el.innerHTML = o.html;
            }
        }
        if(parentNode){
           parentNode.appendChild(el);
        }
        return el;
    }

    // build as innerHTML where available
    function createHtml(o){
        var b = '',
            attr,
            val,
            key,
            cn,
            i;

        if(typeof o == "string"){
            b = o;
        } else if (Ext.isArray(o)) {
            for (i=0; i < o.length; i++) {
                if(o[i]) {
                    b += createHtml(o[i]);
                }
            }
        } else {
            b += '<' + (o.tag = o.tag || 'div');
            for (attr in o) {
                val = o[attr];
                if(!confRe.test(attr)){
                    if (typeof val == "object") {
                        b += ' ' + attr + '="';
                        for (key in val) {
                            b += key + ':' + val[key] + ';';
                        }
                        b += '"';
                    }else{
                        b += ' ' + ({cls : 'class', htmlFor : 'for'}[attr] || attr) + '="' + val + '"';
                    }
                }
            }
            // Now either just close the tag or try to add children and close the tag.
            if (emptyTags.test(o.tag)) {
                b += '/>';
            } else {
                b += '>';
                if ((cn = o.children || o.cn)) {
                    b += createHtml(cn);
                } else if(o.html){
                    b += o.html;
                }
                b += '</' + o.tag + '>';
            }
        }
        return b;
    }

    function ieTable(depth, s, h, e){
        tempTableEl.innerHTML = [s, h, e].join('');
        var i = -1,
            el = tempTableEl,
            ns;
        while(++i < depth){
            el = el.firstChild;
        }
//      If the result is multiple siblings, then encapsulate them into one fragment.
        ns = el.nextSibling;
        if (ns){
            var df = document.createDocumentFragment();
            while(el){
                ns = el.nextSibling;
                df.appendChild(el);
                el = ns;
            }
            el = df;
        }
        return el;
    }

    /**
     * @ignore
     * Nasty code for IE's broken table implementation
     */
    function insertIntoTable(tag, where, el, html) {
        var node,
            before;

        tempTableEl = tempTableEl || document.createElement('div');

        if(tag == 'td' && (where == afterbegin || where == beforeend) ||
           !tableElRe.test(tag) && (where == beforebegin || where == afterend)) {
            return null;
        }
        before = where == beforebegin ? el :
                 where == afterend ? el.nextSibling :
                 where == afterbegin ? el.firstChild : null;

        if (where == beforebegin || where == afterend) {
            el = el.parentNode;
        }

        if (tag == 'td' || (tag == 'tr' && (where == beforeend || where == afterbegin))) {
            node = ieTable(4, trs, html, tre);
        } else if ((tag == 'tbody' && (where == beforeend || where == afterbegin)) ||
                   (tag == 'tr' && (where == beforebegin || where == afterend))) {
            node = ieTable(3, tbs, html, tbe);
        } else {
            node = ieTable(2, ts, html, te);
        }
        el.insertBefore(node, before);
        return node;
    }


    pub = {
        /**
         * Returns the markup for the passed Element(s) config.
         * @param {Object} o The DOM object spec (and children)
         * @return {String}
         */
        markup : function(o){
            return createHtml(o);
        },

        /**
         * Applies a style specification to an element.
         * @param {String/HTMLElement} el The element to apply styles to
         * @param {String/Object/Function} styles A style specification string e.g. 'width:100px', or object in the form {width:'100px'}, or
         * a function which returns such a specification.
         */
        applyStyles : function(el, styles){
            if (styles) {
                el = Ext.fly(el);
                if (typeof styles == "function") {
                    styles = styles.call();
                }
                if (typeof styles == "string") {
                    styles = Ext.core.Element.parseStyles(styles);
                }
                if (typeof styles == "object") {
                    el.setStyle(styles);
                }
            }
        },

        /**
         * Inserts an HTML fragment into the DOM.
         * @param {String} where Where to insert the html in relation to el - beforeBegin, afterBegin, beforeEnd, afterEnd.
         * @param {HTMLElement} el The context element
         * @param {String} html The HTML fragment
         * @return {HTMLElement} The new node
         */
        insertHtml : function(where, el, html){
            var hash = {},
                hashVal,
                setStart,
                range,
                frag,
                rangeEl,
                rs;

            where = where.toLowerCase();
            // add these here because they are used in both branches of the condition.
            hash[beforebegin] = ['BeforeBegin', 'previousSibling'];
            hash[afterend] = ['AfterEnd', 'nextSibling'];

            if (el.insertAdjacentHTML) {
                if(tableRe.test(el.tagName) && (rs = insertIntoTable(el.tagName.toLowerCase(), where, el, html))){
                    return rs;
                }
                // add these two to the hash.
                hash[afterbegin] = ['AfterBegin', 'firstChild'];
                hash[beforeend] = ['BeforeEnd', 'lastChild'];
                if ((hashVal = hash[where])) {
                    el.insertAdjacentHTML(hashVal[0], html);
                    return el[hashVal[1]];
                }
            } else {
                range = el.ownerDocument.createRange();
                setStart = 'setStart' + (endRe.test(where) ? 'After' : 'Before');
                if (hash[where]) {
                    range[setStart](el);
                    frag = range.createContextualFragment(html);
                    el.parentNode.insertBefore(frag, where == beforebegin ? el : el.nextSibling);
                    return el[(where == beforebegin ? 'previous' : 'next') + 'Sibling'];
                } else {
                    rangeEl = (where == afterbegin ? 'first' : 'last') + 'Child';
                    if (el.firstChild) {
                        range[setStart](el[rangeEl]);
                        frag = range.createContextualFragment(html);
                        if(where == afterbegin){
                            el.insertBefore(frag, el.firstChild);
                        }else{
                            el.appendChild(frag);
                        }
                    } else {
                        el.innerHTML = html;
                    }
                    return el[rangeEl];
                }
            }
            throw 'Illegal insertion point -> "' + where + '"';
        },

        /**
         * Creates new DOM element(s) and inserts them before el.
         * @param {Mixed} el The context element
         * @param {Object/String} o The DOM object spec (and children) or raw HTML blob
         * @param {Boolean} returnElement (optional) true to return a Ext.core.Element
         * @return {HTMLElement/Ext.core.Element} The new node
         */
        insertBefore : function(el, o, returnElement){
            return doInsert(el, o, returnElement, beforebegin);
        },

        /**
         * Creates new DOM element(s) and inserts them after el.
         * @param {Mixed} el The context element
         * @param {Object} o The DOM object spec (and children)
         * @param {Boolean} returnElement (optional) true to return a Ext.core.Element
         * @return {HTMLElement/Ext.core.Element} The new node
         */
        insertAfter : function(el, o, returnElement){
            return doInsert(el, o, returnElement, afterend, 'nextSibling');
        },

        /**
         * Creates new DOM element(s) and inserts them as the first child of el.
         * @param {Mixed} el The context element
         * @param {Object/String} o The DOM object spec (and children) or raw HTML blob
         * @param {Boolean} returnElement (optional) true to return a Ext.core.Element
         * @return {HTMLElement/Ext.core.Element} The new node
         */
        insertFirst : function(el, o, returnElement){
            return doInsert(el, o, returnElement, afterbegin, 'firstChild');
        },

        /**
         * Creates new DOM element(s) and appends them to el.
         * @param {Mixed} el The context element
         * @param {Object/String} o The DOM object spec (and children) or raw HTML blob
         * @param {Boolean} returnElement (optional) true to return a Ext.core.Element
         * @return {HTMLElement/Ext.core.Element} The new node
         */
        append : function(el, o, returnElement){
            return doInsert(el, o, returnElement, beforeend, '', true);
        },

        /**
         * Creates new DOM element(s) and overwrites the contents of el with them.
         * @param {Mixed} el The context element
         * @param {Object/String} o The DOM object spec (and children) or raw HTML blob
         * @param {Boolean} returnElement (optional) true to return a Ext.core.Element
         * @return {HTMLElement/Ext.core.Element} The new node
         */
        overwrite : function(el, o, returnElement){
            el = Ext.getDom(el);
            el.innerHTML = createHtml(o);
            return returnElement ? Ext.get(el.firstChild) : el.firstChild;
        },

        createHtml : createHtml,
        
        /**
         * Creates new DOM element(s) without inserting them to the document.
         * @param {Object/String} o The DOM object spec (and children) or raw HTML blob
         * @return {HTMLElement} The new uninserted node
         */
        createDom: createDom,
        
        /** True to force the use of DOM instead of html fragments @type Boolean */
        useDom : false,
        
        /**
         * Creates a new Ext.Template from the DOM object spec.
         * @param {Object} o The DOM object spec (and children)
         * @return {Ext.Template} The new template
         */
        createTemplate : function(o){
            var html = Ext.core.DomHelper.createHtml(o);
            return new Ext.Template(html);
        }
    };
    return pub;
}();

/*
 * This is code is also distributed under MIT license for use
 * with jQuery and prototype JavaScript libraries.
 */
/**
 * @class Ext.DomQuery
Provides high performance selector/xpath processing by compiling queries into reusable functions. New pseudo classes and matchers can be plugged. It works on HTML and XML documents (if a content node is passed in).
<p>
DomQuery supports most of the <a href="http://www.w3.org/TR/2005/WD-css3-selectors-20051215/#selectors">CSS3 selectors spec</a>, along with some custom selectors and basic XPath.</p>

<p>
All selectors, attribute filters and pseudos below can be combined infinitely in any order. For example "div.foo:nth-child(odd)[@foo=bar].bar:first" would be a perfectly valid selector. Node filters are processed in the order in which they appear, which allows you to optimize your queries for your document structure.
</p>
<h4>Element Selectors:</h4>
<ul class="list">
    <li> <b>*</b> any element</li>
    <li> <b>E</b> an element with the tag E</li>
    <li> <b>E F</b> All descendent elements of E that have the tag F</li>
    <li> <b>E > F</b> or <b>E/F</b> all direct children elements of E that have the tag F</li>
    <li> <b>E + F</b> all elements with the tag F that are immediately preceded by an element with the tag E</li>
    <li> <b>E ~ F</b> all elements with the tag F that are preceded by a sibling element with the tag E</li>
</ul>
<h4>Attribute Selectors:</h4>
<p>The use of &#64; and quotes are optional. For example, div[&#64;foo='bar'] is also a valid attribute selector.</p>
<ul class="list">
    <li> <b>E[foo]</b> has an attribute "foo"</li>
    <li> <b>E[foo=bar]</b> has an attribute "foo" that equals "bar"</li>
    <li> <b>E[foo^=bar]</b> has an attribute "foo" that starts with "bar"</li>
    <li> <b>E[foo$=bar]</b> has an attribute "foo" that ends with "bar"</li>
    <li> <b>E[foo*=bar]</b> has an attribute "foo" that contains the substring "bar"</li>
    <li> <b>E[foo%=2]</b> has an attribute "foo" that is evenly divisible by 2</li>
    <li> <b>E[foo!=bar]</b> attribute "foo" does not equal "bar"</li>
</ul>
<h4>Pseudo Classes:</h4>
<ul class="list">
    <li> <b>E:first-child</b> E is the first child of its parent</li>
    <li> <b>E:last-child</b> E is the last child of its parent</li>
    <li> <b>E:nth-child(<i>n</i>)</b> E is the <i>n</i>th child of its parent (1 based as per the spec)</li>
    <li> <b>E:nth-child(odd)</b> E is an odd child of its parent</li>
    <li> <b>E:nth-child(even)</b> E is an even child of its parent</li>
    <li> <b>E:only-child</b> E is the only child of its parent</li>
    <li> <b>E:checked</b> E is an element that is has a checked attribute that is true (e.g. a radio or checkbox) </li>
    <li> <b>E:first</b> the first E in the resultset</li>
    <li> <b>E:last</b> the last E in the resultset</li>
    <li> <b>E:nth(<i>n</i>)</b> the <i>n</i>th E in the resultset (1 based)</li>
    <li> <b>E:odd</b> shortcut for :nth-child(odd)</li>
    <li> <b>E:even</b> shortcut for :nth-child(even)</li>
    <li> <b>E:contains(foo)</b> E's innerHTML contains the substring "foo"</li>
    <li> <b>E:nodeValue(foo)</b> E contains a textNode with a nodeValue that equals "foo"</li>
    <li> <b>E:not(S)</b> an E element that does not match simple selector S</li>
    <li> <b>E:has(S)</b> an E element that has a descendent that matches simple selector S</li>
    <li> <b>E:next(S)</b> an E element whose next sibling matches simple selector S</li>
    <li> <b>E:prev(S)</b> an E element whose previous sibling matches simple selector S</li>
    <li> <b>E:any(S1|S2|S2)</b> an E element which matches any of the simple selectors S1, S2 or S3//\\</li>
</ul>
<h4>CSS Value Selectors:</h4>
<ul class="list">
    <li> <b>E{display=none}</b> css value "display" that equals "none"</li>
    <li> <b>E{display^=none}</b> css value "display" that starts with "none"</li>
    <li> <b>E{display$=none}</b> css value "display" that ends with "none"</li>
    <li> <b>E{display*=none}</b> css value "display" that contains the substring "none"</li>
    <li> <b>E{display%=2}</b> css value "display" that is evenly divisible by 2</li>
    <li> <b>E{display!=none}</b> css value "display" that does not equal "none"</li>
</ul>
 * @singleton
 */
Ext.ns('Ext.core');

Ext.core.DomQuery = Ext.DomQuery = function(){
    var cache = {},
        simpleCache = {},
        valueCache = {},
        nonSpace = /\S/,
        trimRe = /^\s+|\s+$/g,
        tplRe = /\{(\d+)\}/g,
        modeRe = /^(\s?[\/>+~]\s?|\s|$)/,
        tagTokenRe = /^(#)?([\w-\*]+)/,
        nthRe = /(\d*)n\+?(\d*)/,
        nthRe2 = /\D/,
        // This is for IE MSXML which does not support expandos.
    // IE runs the same speed using setAttribute, however FF slows way down
    // and Safari completely fails so they need to continue to use expandos.
    isIE = window.ActiveXObject ? true : false,
    key = 30803;

    // this eval is stop the compressor from
    // renaming the variable to something shorter
    eval("var batch = 30803;");

    // Retrieve the child node from a particular
    // parent at the specified index.
    function child(parent, index){
        var i = 0,
            n = parent.firstChild;
        while(n){
            if(n.nodeType == 1){
               if(++i == index){
                   return n;
               }
            }
            n = n.nextSibling;
        }
        return null;
    }

    // retrieve the next element node
    function next(n){
        while((n = n.nextSibling) && n.nodeType != 1);
        return n;
    }

    // retrieve the previous element node
    function prev(n){
        while((n = n.previousSibling) && n.nodeType != 1);
        return n;
    }

    // Mark each child node with a nodeIndex skipping and
    // removing empty text nodes.
    function children(parent){
        var n = parent.firstChild,
        nodeIndex = -1,
        nextNode;
        while(n){
            nextNode = n.nextSibling;
            // clean worthless empty nodes.
            if(n.nodeType == 3 && !nonSpace.test(n.nodeValue)){
            parent.removeChild(n);
            }else{
            // add an expando nodeIndex
            n.nodeIndex = ++nodeIndex;
            }
            n = nextNode;
        }
        return this;
    }


    // nodeSet - array of nodes
    // cls - CSS Class
    function byClassName(nodeSet, cls){
        if(!cls){
            return nodeSet;
        }
        var result = [], ri = -1;
        for(var i = 0, ci; ci = nodeSet[i]; i++){
            if((' '+ci.className+' ').indexOf(cls) != -1){
                result[++ri] = ci;
            }
        }
        return result;
    };

    function attrValue(n, attr){
        // if its an array, use the first node.
        if(!n.tagName && typeof n.length != "undefined"){
            n = n[0];
        }
        if(!n){
            return null;
        }

        if(attr == "for"){
            return n.htmlFor;
        }
        if(attr == "class" || attr == "className"){
            return n.className;
        }
        return n.getAttribute(attr) || n[attr];

    };


    // ns - nodes
    // mode - false, /, >, +, ~
    // tagName - defaults to "*"
    function getNodes(ns, mode, tagName){
        var result = [], ri = -1, cs;
        if(!ns){
            return result;
        }
        tagName = tagName || "*";
        // convert to array
        if(typeof ns.getElementsByTagName != "undefined"){
            ns = [ns];
        }

        // no mode specified, grab all elements by tagName
        // at any depth
        if(!mode){
            for(var i = 0, ni; ni = ns[i]; i++){
                cs = ni.getElementsByTagName(tagName);
                for(var j = 0, ci; ci = cs[j]; j++){
                    result[++ri] = ci;
                }
            }
        // Direct Child mode (/ or >)
        // E > F or E/F all direct children elements of E that have the tag
        } else if(mode == "/" || mode == ">"){
            var utag = tagName.toUpperCase();
            for(var i = 0, ni, cn; ni = ns[i]; i++){
                cn = ni.childNodes;
                for(var j = 0, cj; cj = cn[j]; j++){
                    if(cj.nodeName == utag || cj.nodeName == tagName  || tagName == '*'){
                        result[++ri] = cj;
                    }
                }
            }
        // Immediately Preceding mode (+)
        // E + F all elements with the tag F that are immediately preceded by an element with the tag E
        }else if(mode == "+"){
            var utag = tagName.toUpperCase();
            for(var i = 0, n; n = ns[i]; i++){
                while((n = n.nextSibling) && n.nodeType != 1);
                if(n && (n.nodeName == utag || n.nodeName == tagName || tagName == '*')){
                    result[++ri] = n;
                }
            }
        // Sibling mode (~)
        // E ~ F all elements with the tag F that are preceded by a sibling element with the tag E
        }else if(mode == "~"){
            var utag = tagName.toUpperCase();
            for(var i = 0, n; n = ns[i]; i++){
                while((n = n.nextSibling)){
                    if (n.nodeName == utag || n.nodeName == tagName || tagName == '*'){
                        result[++ri] = n;
                    }
                }
            }
        }
        return result;
    }

    function concat(a, b){
        if(b.slice){
            return a.concat(b);
        }
        for(var i = 0, l = b.length; i < l; i++){
            a[a.length] = b[i];
        }
        return a;
    }

    function byTag(cs, tagName){
        if(cs.tagName || cs == document){
            cs = [cs];
        }
        if(!tagName){
            return cs;
        }
        var result = [], ri = -1;
        tagName = tagName.toLowerCase();
        for(var i = 0, ci; ci = cs[i]; i++){
            if(ci.nodeType == 1 && ci.tagName.toLowerCase() == tagName){
                result[++ri] = ci;
            }
        }
        return result;
    }

    function byId(cs, id){
        if(cs.tagName || cs == document){
            cs = [cs];
        }
        if(!id){
            return cs;
        }
        var result = [], ri = -1;
        for(var i = 0, ci; ci = cs[i]; i++){
            if(ci && ci.id == id){
                result[++ri] = ci;
                return result;
            }
        }
        return result;
    }

    // operators are =, !=, ^=, $=, *=, %=, |= and ~=
    // custom can be "{"
    function byAttribute(cs, attr, value, op, custom){
        var result = [],
            ri = -1,
            useGetStyle = custom == "{",
            fn = Ext.DomQuery.operators[op],
            a,
            xml,
            hasXml;

        for(var i = 0, ci; ci = cs[i]; i++){
            // skip non-element nodes.
            if(ci.nodeType != 1){
                continue;
            }
            // only need to do this for the first node
            if(!hasXml){
                xml = Ext.DomQuery.isXml(ci);
                hasXml = true;
            }

            // we only need to change the property names if we're dealing with html nodes, not XML
            if(!xml){
                if(useGetStyle){
                    a = Ext.DomQuery.getStyle(ci, attr);
                } else if (attr == "class" || attr == "className"){
                    a = ci.className;
                } else if (attr == "for"){
                    a = ci.htmlFor;
                } else if (attr == "href"){
                    // getAttribute href bug
                    // http://www.glennjones.net/Post/809/getAttributehrefbug.htm
                    a = ci.getAttribute("href", 2);
                } else{
                    a = ci.getAttribute(attr);
                }
            }else{
                a = ci.getAttribute(attr);
            }
            if((fn && fn(a, value)) || (!fn && a)){
                result[++ri] = ci;
            }
        }
        return result;
    }

    function byPseudo(cs, name, value){
        return Ext.DomQuery.pseudos[name](cs, value);
    }

    function nodupIEXml(cs){
        var d = ++key,
            r;
        cs[0].setAttribute("_nodup", d);
        r = [cs[0]];
        for(var i = 1, len = cs.length; i < len; i++){
            var c = cs[i];
            if(!c.getAttribute("_nodup") != d){
                c.setAttribute("_nodup", d);
                r[r.length] = c;
            }
        }
        for(var i = 0, len = cs.length; i < len; i++){
            cs[i].removeAttribute("_nodup");
        }
        return r;
    }

    function nodup(cs){
        if(!cs){
            return [];
        }
        var len = cs.length, c, i, r = cs, cj, ri = -1;
        if(!len || typeof cs.nodeType != "undefined" || len == 1){
            return cs;
        }
        if(isIE && typeof cs[0].selectSingleNode != "undefined"){
            return nodupIEXml(cs);
        }
        var d = ++key;
        cs[0]._nodup = d;
        for(i = 1; c = cs[i]; i++){
            if(c._nodup != d){
                c._nodup = d;
            }else{
                r = [];
                for(var j = 0; j < i; j++){
                    r[++ri] = cs[j];
                }
                for(j = i+1; cj = cs[j]; j++){
                    if(cj._nodup != d){
                        cj._nodup = d;
                        r[++ri] = cj;
                    }
                }
                return r;
            }
        }
        return r;
    }

    function quickDiffIEXml(c1, c2){
        var d = ++key,
            r = [];
        for(var i = 0, len = c1.length; i < len; i++){
            c1[i].setAttribute("_qdiff", d);
        }
        for(var i = 0, len = c2.length; i < len; i++){
            if(c2[i].getAttribute("_qdiff") != d){
                r[r.length] = c2[i];
            }
        }
        for(var i = 0, len = c1.length; i < len; i++){
           c1[i].removeAttribute("_qdiff");
        }
        return r;
    }

    function quickDiff(c1, c2){
        var len1 = c1.length,
            d = ++key,
            r = [];
        if(!len1){
            return c2;
        }
        if(isIE && typeof c1[0].selectSingleNode != "undefined"){
            return quickDiffIEXml(c1, c2);
        }
        for(var i = 0; i < len1; i++){
            c1[i]._qdiff = d;
        }
        for(var i = 0, len = c2.length; i < len; i++){
            if(c2[i]._qdiff != d){
                r[r.length] = c2[i];
            }
        }
        return r;
    }

    function quickId(ns, mode, root, id){
        if(ns == root){
           var d = root.ownerDocument || root;
           return d.getElementById(id);
        }
        ns = getNodes(ns, mode, "*");
        return byId(ns, id);
    }

    return {
        getStyle : function(el, name){
            return Ext.fly(el).getStyle(name);
        },
        /**
         * Compiles a selector/xpath query into a reusable function. The returned function
         * takes one parameter "root" (optional), which is the context node from where the query should start.
         * @param {String} selector The selector/xpath query
         * @param {String} type (optional) Either "select" (the default) or "simple" for a simple selector match
         * @return {Function}
         */
        compile : function(path, type){
            type = type || "select";

            // setup fn preamble
            var fn = ["var f = function(root){\n var mode; ++batch; var n = root || document;\n"],
                mode,
                lastPath,
                matchers = Ext.DomQuery.matchers,
                matchersLn = matchers.length,
                modeMatch,
                // accept leading mode switch
                lmode = path.match(modeRe);

            if(lmode && lmode[1]){
                fn[fn.length] = 'mode="'+lmode[1].replace(trimRe, "")+'";';
                path = path.replace(lmode[1], "");
            }

            // strip leading slashes
            while(path.substr(0, 1)=="/"){
                path = path.substr(1);
            }

            while(path && lastPath != path){
                lastPath = path;
                var tokenMatch = path.match(tagTokenRe);
                if(type == "select"){
                    if(tokenMatch){
                        // ID Selector
                        if(tokenMatch[1] == "#"){
                            fn[fn.length] = 'n = quickId(n, mode, root, "'+tokenMatch[2]+'");';
                        }else{
                            fn[fn.length] = 'n = getNodes(n, mode, "'+tokenMatch[2]+'");';
                        }
                        path = path.replace(tokenMatch[0], "");
                    }else if(path.substr(0, 1) != '@'){
                        fn[fn.length] = 'n = getNodes(n, mode, "*");';
                    }
                // type of "simple"
                }else{
                    if(tokenMatch){
                        if(tokenMatch[1] == "#"){
                            fn[fn.length] = 'n = byId(n, "'+tokenMatch[2]+'");';
                        }else{
                            fn[fn.length] = 'n = byTag(n, "'+tokenMatch[2]+'");';
                        }
                        path = path.replace(tokenMatch[0], "");
                    }
                }
                while(!(modeMatch = path.match(modeRe))){
                    var matched = false;
                    for(var j = 0; j < matchersLn; j++){
                        var t = matchers[j];
                        var m = path.match(t.re);
                        if(m){
                            fn[fn.length] = t.select.replace(tplRe, function(x, i){
                return m[i];
                });
                            path = path.replace(m[0], "");
                            matched = true;
                            break;
                        }
                    }
                    // prevent infinite loop on bad selector
                    if(!matched){
                        throw 'Error parsing selector, parsing failed at "' + path + '"';
                    }
                }
                if(modeMatch[1]){
                    fn[fn.length] = 'mode="'+modeMatch[1].replace(trimRe, "")+'";';
                    path = path.replace(modeMatch[1], "");
                }
            }
            // close fn out
            fn[fn.length] = "return nodup(n);\n}";

            // eval fn and return it
            eval(fn.join(""));
            return f;
        },

        /**
         * Selects a group of elements.
         * @param {String} selector The selector/xpath query (can be a comma separated list of selectors)
         * @param {Node/String} root (optional) The start of the query (defaults to document).
         * @return {Array} An Array of DOM elements which match the selector. If there are
         * no matches, and empty Array is returned.
         */
    jsSelect: function(path, root, type){
        // set root to doc if not specified.
        root = root || document;

            if(typeof root == "string"){
                root = document.getElementById(root);
            }
            var paths = path.split(","),
                results = [];

            // loop over each selector
            for(var i = 0, len = paths.length; i < len; i++){
                var subPath = paths[i].replace(trimRe, "");
                // compile and place in cache
                if(!cache[subPath]){
                    cache[subPath] = Ext.DomQuery.compile(subPath);
                    if(!cache[subPath]){
                        throw subPath + " is not a valid selector";
                    }
                }
                var result = cache[subPath](root);
                if(result && result != document){
                    results = results.concat(result);
                }
            }

            // if there were multiple selectors, make sure dups
            // are eliminated
            if(paths.length > 1){
                return nodup(results);
            }
            return results;
        },
    isXml: function(el) {
        var docEl = (el ? el.ownerDocument || el : 0).documentElement;
        return docEl ? docEl.nodeName !== "HTML" : false;
    },
        select : document.querySelectorAll ? function(path, root, type) {
        root = root || document;
        if (!Ext.DomQuery.isXml(root)) {
        try {
            var cs = root.querySelectorAll(path);
            return Ext.Array.toArray(cs);
        }
        catch (ex) {}
        }
        return Ext.DomQuery.jsSelect.call(this, path, root, type);
    } : function(path, root, type) {
        return Ext.DomQuery.jsSelect.call(this, path, root, type);
    },

        /**
         * Selects a single element.
         * @param {String} selector The selector/xpath query
         * @param {Node} root (optional) The start of the query (defaults to document).
         * @return {Element} The DOM element which matched the selector.
         */
        selectNode : function(path, root){
            return Ext.DomQuery.select(path, root)[0];
        },

        /**
         * Selects the value of a node, optionally replacing null with the defaultValue.
         * @param {String} selector The selector/xpath query
         * @param {Node} root (optional) The start of the query (defaults to document).
         * @param {String} defaultValue
         * @return {String}
         */
        selectValue : function(path, root, defaultValue){
            path = path.replace(trimRe, "");
            if(!valueCache[path]){
                valueCache[path] = Ext.DomQuery.compile(path, "select");
            }
            var n = valueCache[path](root), v;
            n = n[0] ? n[0] : n;

            // overcome a limitation of maximum textnode size
            // Rumored to potentially crash IE6 but has not been confirmed.
            // http://reference.sitepoint.com/javascript/Node/normalize
            // https://developer.mozilla.org/En/DOM/Node.normalize
            if (typeof n.normalize == 'function') n.normalize();

            v = (n && n.firstChild ? n.firstChild.nodeValue : null);
            return ((v === null||v === undefined||v==='') ? defaultValue : v);
        },

        /**
         * Selects the value of a node, parsing integers and floats. Returns the defaultValue, or 0 if none is specified.
         * @param {String} selector The selector/xpath query
         * @param {Node} root (optional) The start of the query (defaults to document).
         * @param {Number} defaultValue
         * @return {Number}
         */
        selectNumber : function(path, root, defaultValue){
            var v = Ext.DomQuery.selectValue(path, root, defaultValue || 0);
            return parseFloat(v);
        },

        /**
         * Returns true if the passed element(s) match the passed simple selector (e.g. div.some-class or span:first-child)
         * @param {String/HTMLElement/Array} el An element id, element or array of elements
         * @param {String} selector The simple selector to test
         * @return {Boolean}
         */
        is : function(el, ss){
            if(typeof el == "string"){
                el = document.getElementById(el);
            }
            var isArray = Ext.isArray(el),
                result = Ext.DomQuery.filter(isArray ? el : [el], ss);
            return isArray ? (result.length == el.length) : (result.length > 0);
        },

        /**
         * Filters an array of elements to only include matches of a simple selector (e.g. div.some-class or span:first-child)
         * @param {Array} el An array of elements to filter
         * @param {String} selector The simple selector to test
         * @param {Boolean} nonMatches If true, it returns the elements that DON'T match
         * the selector instead of the ones that match
         * @return {Array} An Array of DOM elements which match the selector. If there are
         * no matches, and empty Array is returned.
         */
        filter : function(els, ss, nonMatches){
            ss = ss.replace(trimRe, "");
            if(!simpleCache[ss]){
                simpleCache[ss] = Ext.DomQuery.compile(ss, "simple");
            }
            var result = simpleCache[ss](els);
            return nonMatches ? quickDiff(result, els) : result;
        },

        /**
         * Collection of matching regular expressions and code snippets.
         * Each capture group within () will be replace the {} in the select
         * statement as specified by their index.
         */
        matchers : [{
                re: /^\.([\w-]+)/,
                select: 'n = byClassName(n, " {1} ");'
            }, {
                re: /^\:([\w-]+)(?:\(((?:[^\s>\/]*|.*?))\))?/,
                select: 'n = byPseudo(n, "{1}", "{2}");'
            },{
                re: /^(?:([\[\{])(?:@)?([\w-]+)\s?(?:(=|.=)\s?['"]?(.*?)["']?)?[\]\}])/,
                select: 'n = byAttribute(n, "{2}", "{4}", "{3}", "{1}");'
            }, {
                re: /^#([\w-]+)/,
                select: 'n = byId(n, "{1}");'
            },{
                re: /^@([\w-]+)/,
                select: 'return {firstChild:{nodeValue:attrValue(n, "{1}")}};'
            }
        ],

        /**
         * Collection of operator comparison functions. The default operators are =, !=, ^=, $=, *=, %=, |= and ~=.
         * New operators can be added as long as the match the format <i>c</i>= where <i>c</i> is any character other than space, &gt; &lt;.
         */
        operators : {
            "=" : function(a, v){
                return a == v;
            },
            "!=" : function(a, v){
                return a != v;
            },
            "^=" : function(a, v){
                return a && a.substr(0, v.length) == v;
            },
            "$=" : function(a, v){
                return a && a.substr(a.length-v.length) == v;
            },
            "*=" : function(a, v){
                return a && a.indexOf(v) !== -1;
            },
            "%=" : function(a, v){
                return (a % v) == 0;
            },
            "|=" : function(a, v){
                return a && (a == v || a.substr(0, v.length+1) == v+'-');
            },
            "~=" : function(a, v){
                return a && (' '+a+' ').indexOf(' '+v+' ') != -1;
            }
        },

        /**
Object hash of "pseudo class" filter functions which are used when filtering selections. 
Each function is passed two parameters:

- **c** : Array
    An Array of DOM elements to filter.
    
- **v** : String
    The argument (if any) supplied in the selector.

A filter function returns an Array of DOM elements which conform to the pseudo class.
In addition to the provided pseudo classes listed above such as `first-child` and `nth-child`,
developers may add additional, custom psuedo class filters to select elements according to application-specific requirements.

For example, to filter `a` elements to only return links to __external__ resources:

    Ext.DomQuery.pseudos.external = function(c, v){
        var r = [], ri = -1;
        for(var i = 0, ci; ci = c[i]; i++){
            // Include in result set only if it's a link to an external resource
            if(ci.hostname != location.hostname){
                r[++ri] = ci;
            }
        }
        return r;
    };

Then external links could be gathered with the following statement:

    var externalLinks = Ext.select("a:external");

        * @markdown
        */
        pseudos : {
            "first-child" : function(c){
                var r = [], ri = -1, n;
                for(var i = 0, ci; ci = n = c[i]; i++){
                    while((n = n.previousSibling) && n.nodeType != 1);
                    if(!n){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "last-child" : function(c){
                var r = [], ri = -1, n;
                for(var i = 0, ci; ci = n = c[i]; i++){
                    while((n = n.nextSibling) && n.nodeType != 1);
                    if(!n){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "nth-child" : function(c, a) {
                var r = [], ri = -1,
                    m = nthRe.exec(a == "even" && "2n" || a == "odd" && "2n+1" || !nthRe2.test(a) && "n+" + a || a),
                    f = (m[1] || 1) - 0, l = m[2] - 0;
                for(var i = 0, n; n = c[i]; i++){
                    var pn = n.parentNode;
                    if (batch != pn._batch) {
                        var j = 0;
                        for(var cn = pn.firstChild; cn; cn = cn.nextSibling){
                            if(cn.nodeType == 1){
                               cn.nodeIndex = ++j;
                            }
                        }
                        pn._batch = batch;
                    }
                    if (f == 1) {
                        if (l == 0 || n.nodeIndex == l){
                            r[++ri] = n;
                        }
                    } else if ((n.nodeIndex + l) % f == 0){
                        r[++ri] = n;
                    }
                }

                return r;
            },

            "only-child" : function(c){
                var r = [], ri = -1;;
                for(var i = 0, ci; ci = c[i]; i++){
                    if(!prev(ci) && !next(ci)){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "empty" : function(c){
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    var cns = ci.childNodes, j = 0, cn, empty = true;
                    while(cn = cns[j]){
                        ++j;
                        if(cn.nodeType == 1 || cn.nodeType == 3){
                            empty = false;
                            break;
                        }
                    }
                    if(empty){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "contains" : function(c, v){
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    if((ci.textContent||ci.innerText||'').indexOf(v) != -1){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "nodeValue" : function(c, v){
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    if(ci.firstChild && ci.firstChild.nodeValue == v){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "checked" : function(c){
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    if(ci.checked == true){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "not" : function(c, ss){
                return Ext.DomQuery.filter(c, ss, true);
            },

            "any" : function(c, selectors){
                var ss = selectors.split('|'),
                    r = [], ri = -1, s;
                for(var i = 0, ci; ci = c[i]; i++){
                    for(var j = 0; s = ss[j]; j++){
                        if(Ext.DomQuery.is(ci, s)){
                            r[++ri] = ci;
                            break;
                        }
                    }
                }
                return r;
            },

            "odd" : function(c){
                return this["nth-child"](c, "odd");
            },

            "even" : function(c){
                return this["nth-child"](c, "even");
            },

            "nth" : function(c, a){
                return c[a-1] || [];
            },

            "first" : function(c){
                return c[0] || [];
            },

            "last" : function(c){
                return c[c.length-1] || [];
            },

            "has" : function(c, ss){
                var s = Ext.DomQuery.select,
                    r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    if(s(ss, ci).length > 0){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "next" : function(c, ss){
                var is = Ext.DomQuery.is,
                    r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    var n = next(ci);
                    if(n && is(n, ss)){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "prev" : function(c, ss){
                var is = Ext.DomQuery.is,
                    r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    var n = prev(ci);
                    if(n && is(n, ss)){
                        r[++ri] = ci;
                    }
                }
                return r;
            }
        }
    };
}();

/**
 * Selects an array of DOM nodes by CSS/XPath selector. Shorthand of {@link Ext.DomQuery#select}
 * @param {String} path The selector/xpath query
 * @param {Node} root (optional) The start of the query (defaults to document).
 * @return {Array}
 * @member Ext
 * @method query
 */
Ext.query = Ext.DomQuery.select;

/**
 * @class Ext.core.Element
 * <p>Encapsulates a DOM element, adding simple DOM manipulation facilities, normalizing for browser differences.</p>
 * <p>All instances of this class inherit the methods of {@link Ext.fx.Anim} making visual effects easily available to all DOM elements.</p>
 * <p>Note that the events documented in this class are not Ext events, they encapsulate browser events. To
 * access the underlying browser event, see {@link Ext.EventObject#browserEvent}. Some older
 * browsers may not support the full range of events. Which events are supported is beyond the control of ExtJs.</p>
 * Usage:<br>
<pre><code>
// by id
var el = Ext.get("my-div");

// by DOM element reference
var el = Ext.get(myDivElement);
</code></pre>
 * <b>Animations</b><br />
 * <p>When an element is manipulated, by default there is no animation.</p>
 * <pre><code>
var el = Ext.get("my-div");

// no animation
el.setWidth(100);
 * </code></pre>
 * <p>Many of the functions for manipulating an element have an optional "animate" parameter.  This
 * parameter can be specified as boolean (<tt>true</tt>) for default animation effects.</p>
 * <pre><code>
// default animation
el.setWidth(100, true);
 * </code></pre>
 *
 * <p>To configure the effects, an object literal with animation options to use as the Element animation
 * configuration object can also be specified. Note that the supported Element animation configuration
 * options are a subset of the {@link Ext.fx.Anim} animation options specific to Fx effects.  The supported
 * Element animation configuration options are:</p>
<pre>
Option    Default   Description
--------- --------  ---------------------------------------------
{@link Ext.fx.Anim#duration duration}  .35       The duration of the animation in seconds
{@link Ext.fx.Anim#easing easing}    easeOut   The easing method
{@link Ext.fx.Anim#callback callback}  none      A function to execute when the anim completes
{@link Ext.fx.Anim#scope scope}     this      The scope (this) of the callback function
</pre>
 *
 * <pre><code>
// Element animation options object
var opt = {
    {@link Ext.fx.Anim#duration duration}: 1,
    {@link Ext.fx.Anim#easing easing}: 'elasticIn',
    {@link Ext.fx.Anim#callback callback}: this.foo,
    {@link Ext.fx.Anim#scope scope}: this
};
// animation with some options set
el.setWidth(100, opt);
 * </code></pre>
 * <p>The Element animation object being used for the animation will be set on the options
 * object as "anim", which allows you to stop or manipulate the animation. Here is an example:</p>
 * <pre><code>
// using the "anim" property to get the Anim object
if(opt.anim.isAnimated()){
    opt.anim.stop();
}
 * </code></pre>
 * <p>Also see the <tt>{@link #animate}</tt> method for another animation technique.</p>
 * <p><b> Composite (Collections of) Elements</b></p>
 * <p>For working with collections of Elements, see {@link Ext.CompositeElement}</p>
 * @constructor Create a new Element directly.
 * @param {String/HTMLElement} element
 * @param {Boolean} forceNew (optional) By default the constructor checks to see if there is already an instance of this element in the cache and if there is it returns the same instance. This will skip that check (useful for extending this class).
 */
 (function() {
    var DOC = document,
        EC = Ext.cache;

    Ext.core.Element = function(element, forceNew) {
        var dom = typeof element == "string" ? DOC.getElementById(element) : element,
        id;

        if (!dom) {
            return null;
        }

        id = dom.id;

        if (!forceNew && id && EC[id]) {
            // element object already exists
            return EC[id].el;
        }

        /**
     * The DOM element
     * @type HTMLElement
     */
        this.dom = dom;

        /**
     * The DOM element ID
     * @type String
     */
        this.id = id || Ext.id(dom);
    };

    var DH = Ext.core.DomHelper,
    El = Ext.core.Element;


    El.prototype = {
        /**
     * Sets the passed attributes as attributes of this element (a style attribute can be a string, object or function)
     * @param {Object} o The object with the attributes
     * @param {Boolean} useSet (optional) false to override the default setAttribute to use expandos.
     * @return {Ext.core.Element} this
     */
        set: function(o, useSet) {
            var el = this.dom,
                attr,
                val;
            useSet = (useSet !== false) && !!el.setAttribute;

            for (attr in o) {
                if (o.hasOwnProperty(attr)) {
                    val = o[attr];
                    if (attr == 'style') {
                        DH.applyStyles(el, val);
                    } else if (attr == 'cls') {
                        el.className = val;
                    } else if (useSet) {
                        el.setAttribute(attr, val);
                    } else {
                        el[attr] = val;
                    }
                }
            }
            return this;
        },

        //  Mouse events
        /**
     * @event click
     * Fires when a mouse click is detected within the element.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
        /**
     * @event contextmenu
     * Fires when a right click is detected within the element.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
        /**
     * @event dblclick
     * Fires when a mouse double click is detected within the element.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
        /**
     * @event mousedown
     * Fires when a mousedown is detected within the element.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
        /**
     * @event mouseup
     * Fires when a mouseup is detected within the element.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
        /**
     * @event mouseover
     * Fires when a mouseover is detected within the element.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
        /**
     * @event mousemove
     * Fires when a mousemove is detected with the element.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
        /**
     * @event mouseout
     * Fires when a mouseout is detected with the element.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
        /**
     * @event mouseenter
     * Fires when the mouse enters the element.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
        /**
     * @event mouseleave
     * Fires when the mouse leaves the element.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */

        //  Keyboard events
        /**
     * @event keypress
     * Fires when a keypress is detected within the element.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
        /**
     * @event keydown
     * Fires when a keydown is detected within the element.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
        /**
     * @event keyup
     * Fires when a keyup is detected within the element.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */


        //  HTML frame/object events
        /**
     * @event load
     * Fires when the user agent finishes loading all content within the element. Only supported by window, frames, objects and images.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
        /**
     * @event unload
     * Fires when the user agent removes all content from a window or frame. For elements, it fires when the target element or any of its content has been removed.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
        /**
     * @event abort
     * Fires when an object/image is stopped from loading before completely loaded.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
        /**
     * @event error
     * Fires when an object/image/frame cannot be loaded properly.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
        /**
     * @event resize
     * Fires when a document view is resized.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
        /**
     * @event scroll
     * Fires when a document view is scrolled.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */

        //  Form events
        /**
     * @event select
     * Fires when a user selects some text in a text field, including input and textarea.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
        /**
     * @event change
     * Fires when a control loses the input focus and its value has been modified since gaining focus.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
        /**
     * @event submit
     * Fires when a form is submitted.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
        /**
     * @event reset
     * Fires when a form is reset.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
        /**
     * @event focus
     * Fires when an element receives focus either via the pointing device or by tab navigation.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
        /**
     * @event blur
     * Fires when an element loses focus either via the pointing device or by tabbing navigation.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */

        //  User Interface events
        /**
     * @event DOMFocusIn
     * Where supported. Similar to HTML focus event, but can be applied to any focusable element.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
        /**
     * @event DOMFocusOut
     * Where supported. Similar to HTML blur event, but can be applied to any focusable element.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
        /**
     * @event DOMActivate
     * Where supported. Fires when an element is activated, for instance, through a mouse click or a keypress.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */

        //  DOM Mutation events
        /**
     * @event DOMSubtreeModified
     * Where supported. Fires when the subtree is modified.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
        /**
     * @event DOMNodeInserted
     * Where supported. Fires when a node has been added as a child of another node.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
        /**
     * @event DOMNodeRemoved
     * Where supported. Fires when a descendant node of the element is removed.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
        /**
     * @event DOMNodeRemovedFromDocument
     * Where supported. Fires when a node is being removed from a document.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
        /**
     * @event DOMNodeInsertedIntoDocument
     * Where supported. Fires when a node is being inserted into a document.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
        /**
     * @event DOMAttrModified
     * Where supported. Fires when an attribute has been modified.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */
        /**
     * @event DOMCharacterDataModified
     * Where supported. Fires when the character data has been modified.
     * @param {Ext.EventObject} e The {@link Ext.EventObject} encapsulating the DOM event.
     * @param {HtmlElement} t The target of the event.
     * @param {Object} o The options configuration passed to the {@link #addListener} call.
     */

        /**
     * The default unit to append to CSS values where a unit isn't provided (defaults to px).
     * @type String
     */
        defaultUnit: "px",

        /**
     * Returns true if this element matches the passed simple selector (e.g. div.some-class or span:first-child)
     * @param {String} selector The simple selector to test
     * @return {Boolean} True if this element matches the selector, else false
     */
        is: function(simpleSelector) {
            return Ext.DomQuery.is(this.dom, simpleSelector);
        },

        /**
     * Tries to focus the element. Any exceptions are caught and ignored.
     * @param {Number} defer (optional) Milliseconds to defer the focus
     * @return {Ext.core.Element} this
     */
        focus: function(defer,
                        /* private */
                        dom) {
            var me = this;
            dom = dom || me.dom;
            try {
                if (Number(defer)) {
                    Ext.defer(me.focus, defer, null, [null, dom]);
                } else {
                    dom.focus();
                }
            } catch(e) {}
            return me;
        },

        /**
     * Tries to blur the element. Any exceptions are caught and ignored.
     * @return {Ext.core.Element} this
     */
        blur: function() {
            try {
                this.dom.blur();
            } catch(e) {}
            return this;
        },

        /**
     * Returns the value of the "value" attribute
     * @param {Boolean} asNumber true to parse the value as a number
     * @return {String/Number}
     */
        getValue: function(asNumber) {
            var val = this.dom.value;
            return asNumber ? parseInt(val, 10) : val;
        },

        /**
     * Appends an event handler to this element.  The shorthand version {@link #on} is equivalent.
     * @param {String} eventName The name of event to handle.
     * @param {Function} fn The handler function the event invokes. This function is passed
     * the following parameters:<ul>
     * <li><b>evt</b> : EventObject<div class="sub-desc">The {@link Ext.EventObject EventObject} describing the event.</div></li>
     * <li><b>el</b> : HtmlElement<div class="sub-desc">The DOM element which was the target of the event.
     * Note that this may be filtered by using the <tt>delegate</tt> option.</div></li>
     * <li><b>o</b> : Object<div class="sub-desc">The options object from the addListener call.</div></li>
     * </ul>
     * @param {Object} scope (optional) The scope (<code><b>this</b></code> reference) in which the handler function is executed.
     * <b>If omitted, defaults to this Element.</b>.
     * @param {Object} options (optional) An object containing handler configuration properties.
     * This may contain any of the following properties:<ul>
     * <li><b>scope</b> Object : <div class="sub-desc">The scope (<code><b>this</b></code> reference) in which the handler function is executed.
     * <b>If omitted, defaults to this Element.</b></div></li>
     * <li><b>delegate</b> String: <div class="sub-desc">A simple selector to filter the target or look for a descendant of the target. See below for additional details.</div></li>
     * <li><b>stopEvent</b> Boolean: <div class="sub-desc">True to stop the event. That is stop propagation, and prevent the default action.</div></li>
     * <li><b>preventDefault</b> Boolean: <div class="sub-desc">True to prevent the default action</div></li>
     * <li><b>stopPropagation</b> Boolean: <div class="sub-desc">True to prevent event propagation</div></li>
     * <li><b>normalized</b> Boolean: <div class="sub-desc">False to pass a browser event to the handler function instead of an Ext.EventObject</div></li>
     * <li><b>target</b> Ext.core.Element: <div class="sub-desc">Only call the handler if the event was fired on the target Element, <i>not</i> if the event was bubbled up from a child node.</div></li>
     * <li><b>delay</b> Number: <div class="sub-desc">The number of milliseconds to delay the invocation of the handler after the event fires.</div></li>
     * <li><b>single</b> Boolean: <div class="sub-desc">True to add a handler to handle just the next firing of the event, and then remove itself.</div></li>
     * <li><b>buffer</b> Number: <div class="sub-desc">Causes the handler to be scheduled to run in an {@link Ext.util.DelayedTask} delayed
     * by the specified number of milliseconds. If the event fires again within that time, the original
     * handler is <em>not</em> invoked, but the new handler is scheduled in its place.</div></li>
     * </ul><br>
     * <p>
     * <b>Combining Options</b><br>
     * In the following examples, the shorthand form {@link #on} is used rather than the more verbose
     * addListener.  The two are equivalent.  Using the options argument, it is possible to combine different
     * types of listeners:<br>
     * <br>
     * A delayed, one-time listener that auto stops the event and adds a custom argument (forumId) to the
     * options object. The options object is available as the third parameter in the handler function.<div style="margin: 5px 20px 20px;">
     * Code:<pre><code>
el.on('click', this.onClick, this, {
    single: true,
    delay: 100,
    stopEvent : true,
    forumId: 4
});</code></pre></p>
     * <p>
     * <b>Attaching multiple handlers in 1 call</b><br>
     * The method also allows for a single argument to be passed which is a config object containing properties
     * which specify multiple handlers.</p>
     * <p>
     * Code:<pre><code>
el.on({
    'click' : {
        fn: this.onClick,
        scope: this,
        delay: 100
    },
    'mouseover' : {
        fn: this.onMouseOver,
        scope: this
    },
    'mouseout' : {
        fn: this.onMouseOut,
        scope: this
    }
});</code></pre>
     * <p>
     * Or a shorthand syntax:<br>
     * Code:<pre><code></p>
el.on({
    'click' : this.onClick,
    'mouseover' : this.onMouseOver,
    'mouseout' : this.onMouseOut,
    scope: this
});
     * </code></pre></p>
     * <p><b>delegate</b></p>
     * <p>This is a configuration option that you can pass along when registering a handler for
     * an event to assist with event delegation. Event delegation is a technique that is used to
     * reduce memory consumption and prevent exposure to memory-leaks. By registering an event
     * for a container element as opposed to each element within a container. By setting this
     * configuration option to a simple selector, the target element will be filtered to look for
     * a descendant of the target.
     * For example:<pre><code>
// using this markup:
&lt;div id='elId'>
    &lt;p id='p1'>paragraph one&lt;/p>
    &lt;p id='p2' class='clickable'>paragraph two&lt;/p>
    &lt;p id='p3'>paragraph three&lt;/p>
&lt;/div>
// utilize event delegation to registering just one handler on the container element:
el = Ext.get('elId');
el.on(
    'click',
    function(e,t) {
        // handle click
        console.info(t.id); // 'p2'
    },
    this,
    {
        // filter the target element to be a descendant with the class 'clickable'
        delegate: '.clickable'
    }
);
     * </code></pre></p>
     * @return {Ext.core.Element} this
     */
        addListener: function(eventName, fn, scope, options) {
            Ext.EventManager.on(this.dom, eventName, fn, scope || this, options);
            return this;
        },

        /**
     * Removes an event handler from this element.  The shorthand version {@link #un} is equivalent.
     * <b>Note</b>: if a <i>scope</i> was explicitly specified when {@link #addListener adding} the
     * listener, the same scope must be specified here.
     * Example:
     * <pre><code>
el.removeListener('click', this.handlerFn);
// or
el.un('click', this.handlerFn);
</code></pre>
     * @param {String} eventName The name of the event from which to remove the handler.
     * @param {Function} fn The handler function to remove. <b>This must be a reference to the function passed into the {@link #addListener} call.</b>
     * @param {Object} scope If a scope (<b><code>this</code></b> reference) was specified when the listener was added,
     * then this must refer to the same object.
     * @return {Ext.core.Element} this
     */
        removeListener: function(eventName, fn, scope) {
            Ext.EventManager.un(this.dom, eventName, fn, scope || this);
            return this;
        },

        /**
     * Removes all previous added listeners from this element
     * @return {Ext.core.Element} this
     */
        removeAllListeners: function() {
            Ext.EventManager.removeAll(this.dom);
            return this;
        },

        /**
         * Recursively removes all previous added listeners from this element and its children
         * @return {Ext.core.Element} this
         */
        purgeAllListeners: function() {
            Ext.EventManager.purgeElement(this);
            return this;
        },

        /**
         * @private Test if size has a unit, otherwise appends the passed unit string, or the default for this Element.
         * @param size {Mixed} The size to set
         * @param units {String} The units to append to a numeric size value
         */
        addUnits: function(size, units) {

            // Most common case first: Size is set to a number
            if (Ext.isNumber(size)) {
                return size + (units || this.defaultUnit || 'px');
            }

            // Size set to a value which means "auto"
            if (size === "" || size == "auto" || size === undefined || size === null) {
                return size || '';
            }

            // Otherwise, warn if it's not a valid CSS measurement
            if (!unitPattern.test(size)) {
                if (Ext.isDefined(Ext.global.console)) {
                    console.warn("Warning, size detected as NaN on Element.addUnits.");
                }
                return size || '';
            }
            return size;
        },

        /**
         * <p>Updates the <a href="http://developer.mozilla.org/en/DOM/element.innerHTML">innerHTML</a> of this Element
         * from a specified URL. Note that this is subject to the <a href="http://en.wikipedia.org/wiki/Same_origin_policy">Same Origin Policy</a></p>
         * <p>Updating innerHTML of an element will <b>not</b> execute embedded <tt>&lt;script></tt> elements. This is a browser restriction.</p>
         * @param {Mixed} options. Either a sring containing the URL from which to load the HTML, or an {@link Ext.Ajax#request} options object specifying
         * exactly how to request the HTML.
         * @return {Ext.core.Element} this
         */
        load: function(url, params, cb) {
            Ext.Ajax.request(Ext.apply({
                params: params,
                url: url,
                callback: cb,
                el: this.dom,
                indicatorText: ''
            },
            Ext.isObject(url) ? url: {}));
            return this;
        },

        /**
         * Tests various css rules/browsers to determine if this element uses a border box
         * @return {Boolean}
         */
        isBorderBox: function() {
            return Ext.isBorderBox || noBoxAdjust[(this.dom.tagName || "").toLowerCase()];
        },

        /**
         * <p>Removes this element's dom reference.  Note that event and cache removal is handled at {@link Ext#removeNode Ext.removeNode}</p>
         */
        remove: function() {
            var me = this,
            dom = me.dom;

            if (dom) {
                delete me.dom;
                Ext.removeNode(dom);
            }
        },

        /**
         * Sets up event handlers to call the passed functions when the mouse is moved into and out of the Element.
         * @param {Function} overFn The function to call when the mouse enters the Element.
         * @param {Function} outFn The function to call when the mouse leaves the Element.
         * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the functions are executed. Defaults to the Element's DOM element.
         * @param {Object} options (optional) Options for the listener. See {@link Ext.util.Observable#addListener the <tt>options</tt> parameter}.
         * @return {Ext.core.Element} this
         */
        hover: function(overFn, outFn, scope, options) {
            var me = this;
            me.on('mouseenter', overFn, scope || me.dom, options);
            me.on('mouseleave', outFn, scope || me.dom, options);
            return me;
        },

        /**
         * Returns true if this element is an ancestor of the passed element
         * @param {HTMLElement/String} el The element to check
         * @return {Boolean} True if this element is an ancestor of el, else false
         */
        contains: function(el) {
            return ! el ? false: Ext.core.Element.isAncestor(this.dom, el.dom ? el.dom: el);
        },

        /**
         * Returns the value of a namespaced attribute from the element's underlying DOM node.
         * @param {String} namespace The namespace in which to look for the attribute
         * @param {String} name The attribute name
         * @return {String} The attribute value
         * @deprecated
         */
        getAttributeNS: function(ns, name) {
            return this.getAttribute(name, ns);
        },

        /**
         * Returns the value of an attribute from the element's underlying DOM node.
         * @param {String} name The attribute name
         * @param {String} namespace (optional) The namespace in which to look for the attribute
         * @return {String} The attribute value
         */
        getAttribute: (Ext.isIE && !(Ext.isIE9 && document.documentMode === 9)) ?
        function(name, ns) {
            var d = this.dom,
            type;
            if(ns) {
                type = typeof d[ns + ":" + name];
                if (type != 'undefined' && type != 'unknown') {
                    return d[ns + ":" + name] || null;
                }
                return null;
            }
            if (name === "for") {
                name = "htmlFor";
            }
            return d[name] || null;
        }: function(name, ns) {
            var d = this.dom;
            if (ns) {
               return d.getAttributeNS(ns, name) || d.getAttribute(ns + ":" + name);
            }
            return  d.getAttribute(name) || d[name] || null;
        },

        /**
         * Update the innerHTML of this element
         * @param {String} html The new HTML
         * @return {Ext.core.Element} this
         */
        update: function(html) {
            if (this.dom) {
                this.dom.innerHTML = html;
            }
            return this;
        }
    };

    var ep = El.prototype;

    El.addMethods = function(o) {
        Ext.apply(ep, o);
    };

    /**
     * Appends an event handler (shorthand for {@link #addListener}).
     * @param {String} eventName The name of event to handle.
     * @param {Function} fn The handler function the event invokes.
     * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the handler function is executed.
     * @param {Object} options (optional) An object containing standard {@link #addListener} options
     * @member Ext.core.Element
     * @method on
     */
    ep.on = ep.addListener;

    /**
     * Removes an event handler from this element (see {@link #removeListener} for additional notes).
     * @param {String} eventName The name of the event from which to remove the handler.
     * @param {Function} fn The handler function to remove. <b>This must be a reference to the function passed into the {@link #addListener} call.</b>
     * @param {Object} scope If a scope (<b><code>this</code></b> reference) was specified when the listener was added,
     * then this must refer to the same object.
     * @return {Ext.core.Element} this
     * @member Ext.core.Element
     * @method un
     */
    ep.un = ep.removeListener;

    /**
     * Removes all previous added listeners from this element
     * @return {Ext.core.Element} this
     * @member Ext.core.Element
     * @method clearListeners
     */
    ep.clearListeners = ep.removeAllListeners;

    /**
     * true to automatically adjust width and height settings for box-model issues (default to true)
     */
    ep.autoBoxAdjust = true;

    // private
    var unitPattern = /\d+(px|em|%|en|ex|pt|in|cm|mm|pc)$/i,
    docEl;

    /**
     * Retrieves Ext.core.Element objects.
     * <p><b>This method does not retrieve {@link Ext.Component Component}s.</b> This method
     * retrieves Ext.core.Element objects which encapsulate DOM elements. To retrieve a Component by
     * its ID, use {@link Ext.ComponentMgr#get}.</p>
     * <p>Uses simple caching to consistently return the same object. Automatically fixes if an
     * object was recreated with the same id via AJAX or DOM.</p>
     * @param {Mixed} el The id of the node, a DOM Node or an existing Element.
     * @return {Element} The Element object (or null if no matching element was found)
     * @static
     * @member Ext.core.Element
     * @method get
     */
    El.get = function(el) {
        var ex,
        elm,
        id;
        if (!el) {
            return null;
        }
        if (typeof el == "string") {
            // element id
            if (! (elm = DOC.getElementById(el))) {
                return null;
            }
            if (EC[el] && EC[el].el) {
                ex = EC[el].el;
                ex.dom = elm;
            } else {
                ex = El.addToCache(new El(elm));
            }
            return ex;
        } else if (el.tagName) {
            // dom element
            if (! (id = el.id)) {
                id = Ext.id(el);
            }
            if (EC[id] && EC[id].el) {
                ex = EC[id].el;
                ex.dom = el;
            } else {
                ex = El.addToCache(new El(el));
            }
            return ex;
        } else if (el instanceof El) {
            if (el != docEl) {
                // refresh dom element in case no longer valid,
                // catch case where it hasn't been appended
                // If an el instance is passed, don't pass to getElementById without some kind of id
                if (Ext.isIE && (el.id == undefined || el.id == '')) {
                    el.dom = el.dom;
                } else {
                    el.dom = DOC.getElementById(el.id) || el.dom;
                }
            }
            return el;
        } else if (el.isComposite) {
            return el;
        } else if (Ext.isArray(el)) {
            return El.select(el);
        } else if (el == DOC) {
            // create a bogus element object representing the document object
            if (!docEl) {
                var f = function() {};
                f.prototype = El.prototype;
                docEl = new f();
                docEl.dom = DOC;
            }
            return docEl;
        }
        return null;
    };

    El.addToCache = function(el, id) {
        if (el) {
            id = id || el.id;
            EC[id] = {
                el: el,
                data: {},
                events: {}
            };
        }
        return el;
    };

    // private method for getting and setting element data
    El.data = function(el, key, value) {
        el = El.get(el);
        if (!el) {
            return null;
        }
        var c = EC[el.id].data;
        if (arguments.length == 2) {
            return c[key];
        } else {
            return (c[key] = value);
        }
    };

    // private
    // Garbage collection - uncache elements/purge listeners on orphaned elements
    // so we don't hold a reference and cause the browser to retain them
    function garbageCollect() {
        if (!Ext.enableGarbageCollector) {
            clearInterval(El.collectorThreadId);
        } else {
            var eid,
            el,
            d,
            o;

            for (eid in EC) {
                if (!EC.hasOwnProperty(eid)) {
                    continue;
                }
                o = EC[eid];
                if (o.skipGarbageCollection) {
                    continue;
                }
                el = o.el;
                d = el.dom;
                // -------------------------------------------------------
                // Determining what is garbage:
                // -------------------------------------------------------
                // !d
                // dom node is null, definitely garbage
                // -------------------------------------------------------
                // !d.parentNode
                // no parentNode == direct orphan, definitely garbage
                // -------------------------------------------------------
                // !d.offsetParent && !document.getElementById(eid)
                // display none elements have no offsetParent so we will
                // also try to look it up by it's id. However, check
                // offsetParent first so we don't do unneeded lookups.
                // This enables collection of elements that are not orphans
                // directly, but somewhere up the line they have an orphan
                // parent.
                // -------------------------------------------------------
                if (!d || !d.parentNode || (!d.offsetParent && !DOC.getElementById(eid))) {
                    if (d && Ext.enableListenerCollection) {
                        Ext.EventManager.removeAll(d);
                    }
                    delete EC[eid];
                }
            }
            // Cleanup IE Object leaks
            if (Ext.isIE) {
                var t = {};
                for (eid in EC) {
                    if (!EC.hasOwnProperty(eid)) {
                        continue;
                    }
                    t[eid] = EC[eid];
                }
                EC = Ext.cache = t;
            }
        }
    }
    El.collectorThreadId = setInterval(garbageCollect, 30000);

    var flyFn = function() {};
    flyFn.prototype = El.prototype;

    // dom is optional
    El.Flyweight = function(dom) {
        this.dom = dom;
    };

    El.Flyweight.prototype = new flyFn();
    El.Flyweight.prototype.isFlyweight = true;
    El._flyweights = {};

    /**
     * <p>Gets the globally shared flyweight Element, with the passed node as the active element. Do not store a reference to this element -
     * the dom node can be overwritten by other code. Shorthand of {@link Ext.core.Element#fly}</p>
     * <p>Use this to make one-time references to DOM elements which are not going to be accessed again either by
     * application code, or by Ext's classes. If accessing an element which will be processed regularly, then {@link Ext#get Ext.get}
     * will be more appropriate to take advantage of the caching provided by the Ext.core.Element class.</p>
     * @param {String/HTMLElement} el The dom node or id
     * @param {String} named (optional) Allows for creation of named reusable flyweights to prevent conflicts
     * (e.g. internally Ext uses "_global")
     * @return {Element} The shared Element object (or null if no matching element was found)
     * @member Ext.core.Element
     * @method fly
     */
    El.fly = function(el, named) {
        var ret = null;
        named = named || '_global';
        el = Ext.getDom(el);
        if (el) {
            (El._flyweights[named] = El._flyweights[named] || new El.Flyweight()).dom = el;
            ret = El._flyweights[named];
        }
        return ret;
    };

    /**
     * Retrieves Ext.core.Element objects.
     * <p><b>This method does not retrieve {@link Ext.Component Component}s.</b> This method
     * retrieves Ext.core.Element objects which encapsulate DOM elements. To retrieve a Component by
     * its ID, use {@link Ext.ComponentMgr#get}.</p>
     * <p>Uses simple caching to consistently return the same object. Automatically fixes if an
     * object was recreated with the same id via AJAX or DOM.</p>
     * Shorthand of {@link Ext.core.Element#get}
     * @param {Mixed} el The id of the node, a DOM Node or an existing Element.
     * @return {Element} The Element object (or null if no matching element was found)
     * @member Ext
     * @method get
     */
    Ext.get = El.get;

    /**
     * <p>Gets the globally shared flyweight Element, with the passed node as the active element. Do not store a reference to this element -
     * the dom node can be overwritten by other code. Shorthand of {@link Ext.core.Element#fly}</p>
     * <p>Use this to make one-time references to DOM elements which are not going to be accessed again either by
     * application code, or by Ext's classes. If accessing an element which will be processed regularly, then {@link Ext#get Ext.get}
     * will be more appropriate to take advantage of the caching provided by the Ext.core.Element class.</p>
     * @param {String/HTMLElement} el The dom node or id
     * @param {String} named (optional) Allows for creation of named reusable flyweights to prevent conflicts
     * (e.g. internally Ext uses "_global")
     * @return {Element} The shared Element object (or null if no matching element was found)
     * @member Ext
     * @method fly
     */
    Ext.fly = El.fly;

    // speedy lookup for elements never to box adjust
    var noBoxAdjust = Ext.isStrict ? {
        select: 1
    }: {
        input: 1,
        select: 1,
        textarea: 1
    };
    if (Ext.isIE || Ext.isGecko) {
        noBoxAdjust['button'] = 1;
    }
})();
/**
 * @class Ext.core.Element
 */
Ext.core.Element.addMethods({
    /**
     * Looks at this node and then at parent nodes for a match of the passed simple selector (e.g. div.some-class or span:first-child)
     * @param {String} selector The simple selector to test
     * @param {Number/Mixed} maxDepth (optional) The max depth to search as a number or element (defaults to 50 || document.body)
     * @param {Boolean} returnEl (optional) True to return a Ext.core.Element object instead of DOM node
     * @return {HTMLElement} The matching DOM node (or null if no match was found)
     */
    findParent : function(simpleSelector, maxDepth, returnEl) {
        var p = this.dom,
            b = document.body,
            depth = 0,
            stopEl;

        maxDepth = maxDepth || 50;
        if (isNaN(maxDepth)) {
            stopEl = Ext.getDom(maxDepth);
            maxDepth = Number.MAX_VALUE;
        }
        while (p && p.nodeType == 1 && depth < maxDepth && p != b && p != stopEl) {
            if (Ext.DomQuery.is(p, simpleSelector)) {
                return returnEl ? Ext.get(p) : p;
            }
            depth++;
            p = p.parentNode;
        }
        return null;
    },
    
    /**
     * Looks at parent nodes for a match of the passed simple selector (e.g. div.some-class or span:first-child)
     * @param {String} selector The simple selector to test
     * @param {Number/Mixed} maxDepth (optional) The max depth to
            search as a number or element (defaults to 10 || document.body)
     * @param {Boolean} returnEl (optional) True to return a Ext.core.Element object instead of DOM node
     * @return {HTMLElement} The matching DOM node (or null if no match was found)
     */
    findParentNode : function(simpleSelector, maxDepth, returnEl) {
        var p = Ext.fly(this.dom.parentNode, '_internal');
        return p ? p.findParent(simpleSelector, maxDepth, returnEl) : null;
    },

    /**
     * Walks up the dom looking for a parent node that matches the passed simple selector (e.g. div.some-class or span:first-child).
     * This is a shortcut for findParentNode() that always returns an Ext.core.Element.
     * @param {String} selector The simple selector to test
     * @param {Number/Mixed} maxDepth (optional) The max depth to
            search as a number or element (defaults to 10 || document.body)
     * @return {Ext.core.Element} The matching DOM node (or null if no match was found)
     */
    up : function(simpleSelector, maxDepth) {
        return this.findParentNode(simpleSelector, maxDepth, true);
    },

    /**
     * Creates a {@link Ext.CompositeElement} for child nodes based on the passed CSS selector (the selector should not contain an id).
     * @param {String} selector The CSS selector
     * @return {CompositeElement/CompositeElement} The composite element
     */
    select : function(selector) {
        return Ext.core.Element.select(selector, false,  this.dom);
    },

    /**
     * Selects child nodes based on the passed CSS selector (the selector should not contain an id).
     * @param {String} selector The CSS selector
     * @return {Array} An array of the matched nodes
     */
    query : function(selector) {
        return Ext.DomQuery.select(selector, this.dom);
    },

    /**
     * Selects a single child at any depth below this element based on the passed CSS selector (the selector should not contain an id).
     * @param {String} selector The CSS selector
     * @param {Boolean} returnDom (optional) True to return the DOM node instead of Ext.core.Element (defaults to false)
     * @return {HTMLElement/Ext.core.Element} The child Ext.core.Element (or DOM node if returnDom = true)
     */
    down : function(selector, returnDom) {
        var n = Ext.DomQuery.selectNode(selector, this.dom);
        return returnDom ? n : Ext.get(n);
    },

    /**
     * Selects a single *direct* child based on the passed CSS selector (the selector should not contain an id).
     * @param {String} selector The CSS selector
     * @param {Boolean} returnDom (optional) True to return the DOM node instead of Ext.core.Element (defaults to false)
     * @return {HTMLElement/Ext.core.Element} The child Ext.core.Element (or DOM node if returnDom = true)
     */
    child : function(selector, returnDom) {
        var node,
            me = this,
            id;
        id = Ext.get(me).id;
        // Escape . or :
        id = id.replace(/[\.:]/g, "\\$0");
        node = Ext.DomQuery.selectNode('#' + id + " > " + selector, me.dom);
        return returnDom ? node : Ext.get(node);
    },

     /**
     * Gets the parent node for this element, optionally chaining up trying to match a selector
     * @param {String} selector (optional) Find a parent node that matches the passed simple selector
     * @param {Boolean} returnDom (optional) True to return a raw dom node instead of an Ext.core.Element
     * @return {Ext.core.Element/HTMLElement} The parent node or null
     */
    parent : function(selector, returnDom) {
        return this.matchNode('parentNode', 'parentNode', selector, returnDom);
    },

     /**
     * Gets the next sibling, skipping text nodes
     * @param {String} selector (optional) Find the next sibling that matches the passed simple selector
     * @param {Boolean} returnDom (optional) True to return a raw dom node instead of an Ext.core.Element
     * @return {Ext.core.Element/HTMLElement} The next sibling or null
     */
    next : function(selector, returnDom) {
        return this.matchNode('nextSibling', 'nextSibling', selector, returnDom);
    },

    /**
     * Gets the previous sibling, skipping text nodes
     * @param {String} selector (optional) Find the previous sibling that matches the passed simple selector
     * @param {Boolean} returnDom (optional) True to return a raw dom node instead of an Ext.core.Element
     * @return {Ext.core.Element/HTMLElement} The previous sibling or null
     */
    prev : function(selector, returnDom) {
        return this.matchNode('previousSibling', 'previousSibling', selector, returnDom);
    },


    /**
     * Gets the first child, skipping text nodes
     * @param {String} selector (optional) Find the next sibling that matches the passed simple selector
     * @param {Boolean} returnDom (optional) True to return a raw dom node instead of an Ext.core.Element
     * @return {Ext.core.Element/HTMLElement} The first child or null
     */
    first : function(selector, returnDom) {
        return this.matchNode('nextSibling', 'firstChild', selector, returnDom);
    },

    /**
     * Gets the last child, skipping text nodes
     * @param {String} selector (optional) Find the previous sibling that matches the passed simple selector
     * @param {Boolean} returnDom (optional) True to return a raw dom node instead of an Ext.core.Element
     * @return {Ext.core.Element/HTMLElement} The last child or null
     */
    last : function(selector, returnDom) {
        return this.matchNode('previousSibling', 'lastChild', selector, returnDom);
    },

    matchNode : function(dir, start, selector, returnDom) {
        if (!this.dom) {
            return null;
        }
        
        var n = this.dom[start];
        while (n) {
            if (n.nodeType == 1 && (!selector || Ext.DomQuery.is(n, selector))) {
                return !returnDom ? Ext.get(n) : n;
            }
            n = n[dir];
        }
        return null;
    }
});

/**
 * @class Ext.core.Element
 */
Ext.core.Element.addMethods({
    /**
     * Appends the passed element(s) to this element
     * @param {String/HTMLElement/Array/Element/CompositeElement} el
     * @return {Ext.core.Element} this
     */
    appendChild : function(el) {
        return Ext.get(el).appendTo(this);
    },

    /**
     * Appends this element to the passed element
     * @param {Mixed} el The new parent element
     * @return {Ext.core.Element} this
     */
    appendTo : function(el) {
        Ext.getDom(el).appendChild(this.dom);
        return this;
    },

    /**
     * Inserts this element before the passed element in the DOM
     * @param {Mixed} el The element before which this element will be inserted
     * @return {Ext.core.Element} this
     */
    insertBefore : function(el) {
        el = Ext.getDom(el);
        el.parentNode.insertBefore(this.dom, el);
        return this;
    },

    /**
     * Inserts this element after the passed element in the DOM
     * @param {Mixed} el The element to insert after
     * @return {Ext.core.Element} this
     */
    insertAfter : function(el) {
        el = Ext.getDom(el);
        el.parentNode.insertBefore(this.dom, el.nextSibling);
        return this;
    },

    /**
     * Inserts (or creates) an element (or DomHelper config) as the first child of this element
     * @param {Mixed/Object} el The id or element to insert or a DomHelper config to create and insert
     * @return {Ext.core.Element} The new child
     */
    insertFirst : function(el, returnDom) {
        el = el || {};
        if (el.nodeType || el.dom || typeof el == 'string') { // element
            el = Ext.getDom(el);
            this.dom.insertBefore(el, this.dom.firstChild);
            return !returnDom ? Ext.get(el) : el;
        }
        else { // dh config
            return this.createChild(el, this.dom.firstChild, returnDom);
        }
    },

    /**
     * Inserts (or creates) the passed element (or DomHelper config) as a sibling of this element
     * @param {Mixed/Object/Array} el The id, element to insert or a DomHelper config to create and insert *or* an array of any of those.
     * @param {String} where (optional) 'before' or 'after' defaults to before
     * @param {Boolean} returnDom (optional) True to return the .;ll;l,raw DOM element instead of Ext.core.Element
     * @return {Ext.core.Element} The inserted Element. If an array is passed, the last inserted element is returned.
     */
    insertSibling: function(el, where, returnDom){
        var me = this, rt,
        isAfter = (where || 'before').toLowerCase() == 'after',
        insertEl;

        if(Ext.isArray(el)){
            insertEl = me;
            Ext.each(el, function(e) {
                rt = Ext.fly(insertEl, '_internal').insertSibling(e, where, returnDom);
                if(isAfter){
                    insertEl = rt;
                }
            });
            return rt;
        }

        el = el || {};

        if(el.nodeType || el.dom){
            rt = me.dom.parentNode.insertBefore(Ext.getDom(el), isAfter ? me.dom.nextSibling : me.dom);
            if (!returnDom) {
                rt = Ext.get(rt);
            }
        }else{
            if (isAfter && !me.dom.nextSibling) {
                rt = Ext.core.DomHelper.append(me.dom.parentNode, el, !returnDom);
            } else {
                rt = Ext.core.DomHelper[isAfter ? 'insertAfter' : 'insertBefore'](me.dom, el, !returnDom);
            }
        }
        return rt;
    },

    /**
     * Replaces the passed element with this element
     * @param {Mixed} el The element to replace
     * @return {Ext.core.Element} this
     */
    replace : function(el) {
        el = Ext.get(el);
        this.insertBefore(el);
        el.remove();
        return this;
    },
    
    /**
     * Replaces this element with the passed element
     * @param {Mixed/Object} el The new element or a DomHelper config of an element to create
     * @return {Ext.core.Element} this
     */
    replaceWith: function(el){
        var me = this;
            
        if(el.nodeType || el.dom || typeof el == 'string'){
            el = Ext.get(el);
            me.dom.parentNode.insertBefore(el, me.dom);
        }else{
            el = Ext.core.DomHelper.insertBefore(me.dom, el);
        }
        
        delete Ext.cache[me.id];
        Ext.removeNode(me.dom);      
        me.id = Ext.id(me.dom = el);
        Ext.core.Element.addToCache(me.isFlyweight ? new Ext.core.Element(me.dom) : me);     
        return me;
    },
    
    /**
     * Creates the passed DomHelper config and appends it to this element or optionally inserts it before the passed child element.
     * @param {Object} config DomHelper element config object.  If no tag is specified (e.g., {tag:'input'}) then a div will be
     * automatically generated with the specified attributes.
     * @param {HTMLElement} insertBefore (optional) a child element of this element
     * @param {Boolean} returnDom (optional) true to return the dom node instead of creating an Element
     * @return {Ext.core.Element} The new child element
     */
    createChild : function(config, insertBefore, returnDom) {
        config = config || {tag:'div'};
        if (insertBefore) {
            return Ext.core.DomHelper.insertBefore(insertBefore, config, returnDom !== true);
        }
        else {
            return Ext.core.DomHelper[!this.dom.firstChild ? 'overwrite' : 'append'](this.dom, config,  returnDom !== true);
        }
    },

    /**
     * Creates and wraps this element with another element
     * @param {Object} config (optional) DomHelper element config object for the wrapper element or null for an empty div
     * @param {Boolean} returnDom (optional) True to return the raw DOM element instead of Ext.core.Element
     * @return {HTMLElement/Element} The newly created wrapper element
     */
    wrap : function(config, returnDom) {
        var newEl = Ext.core.DomHelper.insertBefore(this.dom, config || {tag: "div"}, !returnDom),
            d = newEl.dom || newEl;

        d.appendChild(this.dom);
        return newEl;
    },

    /**
     * Inserts an html fragment into this element
     * @param {String} where Where to insert the html in relation to this element - beforeBegin, afterBegin, beforeEnd, afterEnd.
     * @param {String} html The HTML fragment
     * @param {Boolean} returnEl (optional) True to return an Ext.core.Element (defaults to false)
     * @return {HTMLElement/Ext.core.Element} The inserted node (or nearest related if more than 1 inserted)
     */
    insertHtml : function(where, html, returnEl) {
        var el = Ext.core.DomHelper.insertHtml(where, this.dom, html);
        return returnEl ? Ext.get(el) : el;
    }
});

/**
 * @class Ext.core.Element
 */
(function(){
    Ext.core.Element.boxMarkup = '<div class="{0}-tl"><div class="{0}-tr"><div class="{0}-tc"></div></div></div><div class="{0}-ml"><div class="{0}-mr"><div class="{0}-mc"></div></div></div><div class="{0}-bl"><div class="{0}-br"><div class="{0}-bc"></div></div></div>';
    // local style camelizing for speed
    var supports = Ext.supports,
        view = document.defaultView,
        opacityRe = /alpha\(opacity=(.*)\)/i,
        trimRe = /^\s+|\s+$/g,
        spacesRe = /\s+/,
        wordsRe = /\w/g,
        INTERNAL = '_internal',
        PADDING = 'padding',
        MARGIN = 'margin',
        BORDER = 'border',
        LEFT = '-left',
        RIGHT = '-right',
        TOP = '-top',
        BOTTOM = '-bottom',
        WIDTH = '-width',
        MATH = Math,
        HIDDEN = 'hidden',
        ISCLIPPED = 'isClipped',
        OVERFLOW = 'overflow',
        OVERFLOWX = 'overflow-x',
        OVERFLOWY = 'overflow-y',
        ORIGINALCLIP = 'originalClip',
        // special markup used throughout Ext when box wrapping elements
        borders = {l: BORDER + LEFT + WIDTH, r: BORDER + RIGHT + WIDTH, t: BORDER + TOP + WIDTH, b: BORDER + BOTTOM + WIDTH},
        paddings = {l: PADDING + LEFT, r: PADDING + RIGHT, t: PADDING + TOP, b: PADDING + BOTTOM},
        margins = {l: MARGIN + LEFT, r: MARGIN + RIGHT, t: MARGIN + TOP, b: MARGIN + BOTTOM},
        data = Ext.core.Element.data;

    Ext.override(Ext.core.Element, {
        
        /**
         * TODO: Look at this
         */
        // private  ==> used by Fx
        adjustWidth : function(width) {
            var me = this,
                isNum = (typeof width == 'number');
                
            if(isNum && me.autoBoxAdjust && !me.isBorderBox()){
               width -= (me.getBorderWidth("lr") + me.getPadding("lr"));
            }
            return (isNum && width < 0) ? 0 : width;
        },

        // private   ==> used by Fx
        adjustHeight : function(height) {
            var me = this,
                isNum = (typeof height == "number");
                
            if(isNum && me.autoBoxAdjust && !me.isBorderBox()){
               height -= (me.getBorderWidth("tb") + me.getPadding("tb"));
            }
            return (isNum && height < 0) ? 0 : height;
        },


        /**
         * Adds one or more CSS classes to the element. Duplicate classes are automatically filtered out.
         * @param {String/Array} className The CSS classes to add separated by space, or an array of classes
         * @return {Ext.core.Element} this
         */
        addCls : function(className){
            var me = this,
                cls = [],
                space = ((me.dom.className.replace(trimRe, '') == '') ? "" : " "),
                i, len, v;
            if (!Ext.isDefined(className)) {
                return me;
            }
            // Separate case is for speed
            if (!Ext.isArray(className)) {
                if (typeof className === 'string') {
                    className = className.replace(trimRe, '').split(spacesRe);
                    if (className.length === 1) {
                        className = className[0];
                        if (!me.hasCls(className)) {
                            me.dom.className += space + className;
                        }
                    } else {
                        this.addCls(className);
                    }
                }
            } else {
                for (i = 0, len = className.length; i < len; i++) {
                    v = className[i];
                    if (typeof v == 'string' && (' ' + me.dom.className + ' ').indexOf(' ' + v + ' ') == -1) {
                        cls.push(v);
                    }
                }
                if (cls.length) {
                    me.dom.className += space + cls.join(" ");
                }
            }
            return me;
        },

        /**
         * Removes one or more CSS classes from the element.
         * @param {String/Array} className The CSS classes to remove separated by space, or an array of classes
         * @return {Ext.core.Element} this
         */
        removeCls : function(className){
            var me = this,
                i, idx, len, cls, elClasses;
            if (!Ext.isDefined(className)) {
                return me;
            }
            if (!Ext.isArray(className)){
                className = className.replace(trimRe, '').split(spacesRe);
            }
            if (me.dom && me.dom.className) {
                elClasses = me.dom.className.replace(trimRe, '').split(spacesRe);
                for (i = 0, len = className.length; i < len; i++) {
                    cls = className[i];
                    if (typeof cls == 'string') {
                        cls = cls.replace(trimRe, '');
                        idx = Ext.Array.indexOf(elClasses, cls);
                        if (idx != -1) {
                            elClasses.splice(idx, 1);
                        }
                    }
                }
                me.dom.className = elClasses.join(" ");
            }
            return me;
        },

        /**
         * Adds one or more CSS classes to this element and removes the same class(es) from all siblings.
         * @param {String/Array} className The CSS class to add, or an array of classes
         * @return {Ext.core.Element} this
         */
        radioCls : function(className){
            var cn = this.dom.parentNode.childNodes,
                v, i, len;
            className = Ext.isArray(className) ? className : [className];
            for (i = 0, len = cn.length; i < len; i++) {
                v = cn[i];
                if (v && v.nodeType == 1) {
                    Ext.fly(v, '_internal').removeCls(className);
                }
            }
            return this.addCls(className);
        },

        /**
         * Toggles the specified CSS class on this element (removes it if it already exists, otherwise adds it).
         * @param {String} className The CSS class to toggle
         * @return {Ext.core.Element} this
         */
        toggleCls : Ext.supports.ClassList ?
            function(className) {
                this.dom.classList.toggle(Ext.String.trim(className));
                return this;
            } :
            function(className) {
                return this.hasCls(className) ? this.removeCls(className) : this.addCls(className);
            },

        /**
         * Checks if the specified CSS class exists on this element's DOM node.
         * @param {String} className The CSS class to check for
         * @return {Boolean} True if the class exists, else false
         */
        hasCls : Ext.supports.ClassList ?
            function(className) {
                if (!className) {
                    return false;
                }
                className = className.split(spacesRe);
                var ln = className.length,
                    i = 0;
                for (; i < ln; i++) {
                    if (className[i] && this.dom.classList.contains(className[i])) {
                        return true;
                    }
                }
                return false;
            } :
            function(className){
                return className && (' ' + this.dom.className + ' ').indexOf(' ' + className + ' ') != -1;
            },

        /**
         * Replaces a CSS class on the element with another.  If the old name does not exist, the new name will simply be added.
         * @param {String} oldClassName The CSS class to replace
         * @param {String} newClassName The replacement CSS class
         * @return {Ext.core.Element} this
         */
        replaceCls : function(oldClassName, newClassName){
            return this.removeCls(oldClassName).addCls(newClassName);
        },

        isStyle : function(style, val) {
            return this.getStyle(style) == val;
        },

        /**
         * Normalizes currentStyle and computedStyle.
         * @param {String} property The style property whose value is returned.
         * @return {String} The current value of the style property for this element.
         */
        getStyle : function(){
            return view && view.getComputedStyle ?
                function(prop){
                    var el = this.dom,
                        v, cs, out, display;

                    if(el == document){
                        return null;
                    }
                    prop = Ext.core.Element.normalize(prop);
                    out = (v = el.style[prop]) ? v :
                           (cs = view.getComputedStyle(el, "")) ? cs[prop] : null;
                           
                    // Ignore cases when the margin is correctly reported as 0, the bug only shows
                    // numbers larger.
                    if(prop == 'marginRight' && out != '0px' && !supports.RightMargin){
                        display = this.getStyle('display');
                        el.style.display = 'inline-block';
                        out = view.getComputedStyle(el, '').marginRight;
                        el.style.display = display;
                    }
                    
                    if(prop == 'backgroundColor' && out == 'rgba(0, 0, 0, 0)' && !supports.TransparentColor){
                        out = 'transparent';
                    }
                    return out;
                } :
                function(prop){
                    var el = this.dom,
                        m, cs;

                    if (el == document) {
                        return null;
                    }
                    
                    if (prop == 'opacity') {
                        if (el.style.filter.match) {
                            m = el.style.filter.match(opacityRe);
                            if(m){
                                var fv = parseFloat(m[1]);
                                if(!isNaN(fv)){
                                    return fv ? fv / 100 : 0;
                                }
                            }
                        }
                        return 1;
                    }
                    prop = Ext.core.Element.normalize(prop);
                    return el.style[prop] || ((cs = el.currentStyle) ? cs[prop] : null);
                };
        }(),

        /**
         * Return the CSS color for the specified CSS attribute. rgb, 3 digit (like #fff) and valid values
         * are convert to standard 6 digit hex color.
         * @param {String} attr The css attribute
         * @param {String} defaultValue The default value to use when a valid color isn't found
         * @param {String} prefix (optional) defaults to #. Use an empty string when working with
         * color anims.
         */
        getColor : function(attr, defaultValue, prefix){
            var v = this.getStyle(attr),
                color = prefix === 'undefined' ? prefix : '#',
                h;

            if(!v || (/transparent|inherit/.test(v))) {
                return defaultValue;
            }
            if(/^r/.test(v)){
                Ext.each(v.slice(4, v.length -1).split(','), function(s){
                    h = parseInt(s, 10);
                    color += (h < 16 ? '0' : '') + h.toString(16);
                });
            }else{
                v = v.replace('#', '');
                color += v.length == 3 ? v.replace(/^(\w)(\w)(\w)$/, '$1$1$2$2$3$3') : v;
            }
            return(color.length > 5 ? color.toLowerCase() : defaultValue);
        },

        /**
         * Wrapper for setting style properties, also takes single object parameter of multiple styles.
         * @param {String/Object} property The style property to be set, or an object of multiple styles.
         * @param {String} value (optional) The value to apply to the given property, or null if an object was passed.
         * @return {Ext.core.Element} this
         */
        setStyle : function(prop, value){
            var tmp, style;
            
            if (!Ext.isObject(prop)) {
                tmp = {};
                tmp[prop] = value;
                prop = tmp;
            }
            for (style in prop) {
                if (prop.hasOwnProperty(style)) {
                    value = Ext.value(prop[style], '');
                    if (style == 'opacity') {
                        this.setOpacity(value);
                    } else {
                        this.dom.style[Ext.core.Element.normalize(style)] = value;
                    }
                }
            }
            return this;
        },

        /**
         * Set the opacity of the element
         * @param {Float} opacity The new opacity. 0 = transparent, .5 = 50% visibile, 1 = fully visible, etc
         * @param {Boolean/Object} animate (optional) a standard Element animation config object or <tt>true</tt> for
         * the default animation (<tt>{duration: .35, easing: 'easeIn'}</tt>)
         * @return {Ext.core.Element} this
         */
         setOpacity : function(opacity, animate){
            var me = this,
                s = me.dom.style,
                val;

            if(!animate || !me.anim){
                if(!Ext.supports.Opacity){
                    opacity = opacity < 1 ? 'alpha(opacity=' + opacity * 100 + ')' : '';
                    val = s.filter.replace(opacityRe, '').replace(trimRe, '');

                    s.zoom = 1;
                    s.filter = val + (val.length > 0 ? ' ' : '') + opacity;
                }else{
                    s.opacity = opacity;
                }
            }else{
                if (!Ext.isObject(animate)) {
                    animate = {
                        duration: 350,
                        easing: 'ease-in'
                    };
                }
                me.animate(Ext.applyIf({
                    to: {
                        opacity: opacity
                    }
                }, animate));
            }
            return me;
        },

        /**
         * Clears any opacity settings from this element. Required in some cases for IE.
         * @return {Ext.core.Element} this
         */
        clearOpacity : function(){
            var style = this.dom.style;
            if(!Ext.supports.Opacity){
                if(!Ext.isEmpty(style.filter)){
                    style.filter = style.filter.replace(opacityRe, '').replace(trimRe, '');
                }
            }else{
                style.opacity = style['-moz-opacity'] = style['-khtml-opacity'] = '';
            }
            return this;
        },

        /**
         * Returns the offset height of the element
         * @param {Boolean} contentHeight (optional) true to get the height minus borders and padding
         * @return {Number} The element's height
         */
        getHeight: function(contentHeight) {
            var me = this,
                dom = me.dom,
                hidden = Ext.isIE && me.isStyle('display', 'none'),
                height, overflow, style;

            // IE Quirks mode acts more like a max-size measurement unless overflow is hidden during measurement.
            // We will put the overflow back to it's original value when we are done measuring.
            if (Ext.isIEQuirks) {
                style = dom.style;
                overflow = style.overflow;
                me.setStyle({ overflow: 'hidden'});
            }

            height = MATH.max(dom.offsetHeight, hidden ? 0 : dom.clientHeight) || 0;

            if (contentHeight) {
                height -= (me.getBorderWidth("tb") + me.getPadding("tb"));
            }

            if (Ext.isIEQuirks) {
                me.setStyle({ overflow: overflow});
            }

            if (height < 0) {
                height = 0;
            }
            return height;
        },

        /**
         * Returns the offset width of the element
         * @param {Boolean} contentWidth (optional) true to get the width minus borders and padding
         * @return {Number} The element's width
         */
        getWidth: function(contentHeight) {
            var me = this,
                dom = me.dom,
                hidden = Ext.isIE && me.isStyle('display', 'none'),
                width, overflow, style;

            // IE Quirks mode acts more like a max-size measurement unless overflow is hidden during measurement.
            // We will put the overflow back to it's original value when we are done measuring.
            if (Ext.isIEQuirks) {
                style = dom.style;
                overflow = style.overflow;
                me.setStyle({ overflow: 'hidden'});
            }

            width = MATH.max(dom.offsetWidth, width ? 0 : dom.clientWidth) || 0;

            if (contentHeight) {
                width -= (me.getBorderWidth("lr") + me.getPadding("lr"));
            }

            if (Ext.isIEQuirks) {
                me.setStyle({ overflow: overflow});
            }

            if (width < 0) {
                width = 0;
            }
            return width;
        },

        /**
         * Set the width of this Element.
         * @param {Mixed} width The new width. This may be one of:<div class="mdetail-params"><ul>
         * <li>A Number specifying the new width in this Element's {@link #defaultUnit}s (by default, pixels).</li>
         * <li>A String used to set the CSS width style. Animation may <b>not</b> be used.
         * </ul></div>
         * @param {Boolean/Object} animate (optional) true for the default animation or a standard Element animation config object
         * @return {Ext.core.Element} this
         */
        setWidth : function(width, animate){
            var me = this;
            width = me.adjustWidth(width);
            if (!animate || !me.anim) {
                me.dom.style.width = me.addUnits(width);
            }
            else {
                if (!Ext.isObject(animate)) {
                    animate = {};
                }
                me.animate(Ext.applyIf({
                    to: {
                        width: width
                    }
                }, animate));
            }
            return me;
        },

        /**
         * Set the height of this Element.
         * <pre><code>
// change the height to 200px and animate with default configuration
Ext.fly('elementId').setHeight(200, true);

// change the height to 150px and animate with a custom configuration
Ext.fly('elId').setHeight(150, {
    duration : .5, // animation will have a duration of .5 seconds
    // will change the content to "finished"
    callback: function(){ this.{@link #update}("finished"); }
});
         * </code></pre>
         * @param {Mixed} height The new height. This may be one of:<div class="mdetail-params"><ul>
         * <li>A Number specifying the new height in this Element's {@link #defaultUnit}s (by default, pixels.)</li>
         * <li>A String used to set the CSS height style. Animation may <b>not</b> be used.</li>
         * </ul></div>
         * @param {Boolean/Object} animate (optional) true for the default animation or a standard Element animation config object
         * @return {Ext.core.Element} this
         */
         setHeight : function(height, animate){
            var me = this;
            height = me.adjustHeight(height);
            if (!animate || !me.anim) {
                me.dom.style.height = me.addUnits(height);
            }
            else {
                if (!Ext.isObject(animate)) {
                    animate = {};
                }
                me.animate(Ext.applyIf({
                    to: {
                        height: height
                    }
                }, animate));
            }
            return me;
        },

        /**
         * Gets the width of the border(s) for the specified side(s)
         * @param {String} side Can be t, l, r, b or any combination of those to add multiple values. For example,
         * passing <tt>'lr'</tt> would get the border <b><u>l</u></b>eft width + the border <b><u>r</u></b>ight width.
         * @return {Number} The width of the sides passed added together
         */
        getBorderWidth : function(side){
            return this.addStyles(side, borders);
        },

        /**
         * Gets the width of the padding(s) for the specified side(s)
         * @param {String} side Can be t, l, r, b or any combination of those to add multiple values. For example,
         * passing <tt>'lr'</tt> would get the padding <b><u>l</u></b>eft + the padding <b><u>r</u></b>ight.
         * @return {Number} The padding of the sides passed added together
         */
        getPadding : function(side){
            return this.addStyles(side, paddings);
        },

        /**
         *  Store the current overflow setting and clip overflow on the element - use <tt>{@link #unclip}</tt> to remove
         * @return {Ext.core.Element} this
         */
        clip : function(){
            var me = this,
                dom = me.dom;

            if(!data(dom, ISCLIPPED)){
                data(dom, ISCLIPPED, true);
                data(dom, ORIGINALCLIP, {
                    o: me.getStyle(OVERFLOW),
                    x: me.getStyle(OVERFLOWX),
                    y: me.getStyle(OVERFLOWY)
                });
                me.setStyle(OVERFLOW, HIDDEN);
                me.setStyle(OVERFLOWX, HIDDEN);
                me.setStyle(OVERFLOWY, HIDDEN);
            }
            return me;
        },

        /**
         *  Return clipping (overflow) to original clipping before <tt>{@link #clip}</tt> was called
         * @return {Ext.core.Element} this
         */
        unclip : function(){
            var me = this,
                dom = me.dom,
                clip;

            if(data(dom, ISCLIPPED)){
                data(dom, ISCLIPPED, false);
                clip = data(dom, ORIGINALCLIP);
                if(o.o){
                    me.setStyle(OVERFLOW, o.o);
                }
                if(o.x){
                    me.setStyle(OVERFLOWX, o.x);
                }
                if(o.y){
                    me.setStyle(OVERFLOWY, o.y);
                }
            }
            return me;
        },

        // private
        addStyles : function(sides, styles){
            var totalSize = 0,
                sidesArr = sides.match(wordsRe),
                i = 0,
                len = sidesArr.length,
                side, size;
            for (; i < len; i++) {
                side = sidesArr[i];
                size = side && parseInt(this.getStyle(styles[side]), 10);
                if (size) {
                    totalSize += MATH.abs(size);
                }
            }
            return totalSize;
        },

        margins : margins,
        
        /**
         * More flexible version of {@link #setStyle} for setting style properties.
         * @param {String/Object/Function} styles A style specification string, e.g. "width:100px", or object in the form {width:"100px"}, or
         * a function which returns such a specification.
         * @return {Ext.core.Element} this
         */
        applyStyles : function(style){
            Ext.core.DomHelper.applyStyles(this.dom, style);
            return this;
        },

        /**
         * Returns an object with properties matching the styles requested.
         * For example, el.getStyles('color', 'font-size', 'width') might return
         * {'color': '#FFFFFF', 'font-size': '13px', 'width': '100px'}.
         * @param {String} style1 A style name
         * @param {String} style2 A style name
         * @param {String} etc.
         * @return {Object} The style object
         */
        getStyles : function(){
            var styles = {},
                len = arguments.length,
                i = 0, style;
                
            for(; i < len; ++i) {
                style = arguments[i];
                styles[style] = this.getStyle(style);
            }
            return styles;
        },

       /**
        * <p>Wraps the specified element with a special 9 element markup/CSS block that renders by default as
        * a gray container with a gradient background, rounded corners and a 4-way shadow.</p>
        * <p>This special markup is used throughout Ext when box wrapping elements ({@link Ext.button.Button},
        * {@link Ext.panel.Panel} when <tt>{@link Ext.panel.Panel#frame frame=true}</tt>, {@link Ext.window.Window}).  The markup
        * is of this form:</p>
        * <pre><code>
    Ext.core.Element.boxMarkup =
    &#39;&lt;div class="{0}-tl">&lt;div class="{0}-tr">&lt;div class="{0}-tc">&lt;/div>&lt;/div>&lt;/div>
     &lt;div class="{0}-ml">&lt;div class="{0}-mr">&lt;div class="{0}-mc">&lt;/div>&lt;/div>&lt;/div>
     &lt;div class="{0}-bl">&lt;div class="{0}-br">&lt;div class="{0}-bc">&lt;/div>&lt;/div>&lt;/div>&#39;;
        * </code></pre>
        * <p>Example usage:</p>
        * <pre><code>
    // Basic box wrap
    Ext.get("foo").boxWrap();

    // You can also add a custom class and use CSS inheritance rules to customize the box look.
    // 'x-box-blue' is a built-in alternative -- look at the related CSS definitions as an example
    // for how to create a custom box wrap style.
    Ext.get("foo").boxWrap().addCls("x-box-blue");
        * </code></pre>
        * @param {String} class (optional) A base CSS class to apply to the containing wrapper element
        * (defaults to <tt>'x-box'</tt>). Note that there are a number of CSS rules that are dependent on
        * this name to make the overall effect work, so if you supply an alternate base class, make sure you
        * also supply all of the necessary rules.
        * @return {Ext.core.Element} The outermost wrapping element of the created box structure.
        */
        boxWrap : function(cls){
            cls = cls || Ext.baseCSSPrefix + 'box';
            var el = Ext.get(this.insertHtml("beforeBegin", "<div class='" + cls + "'>" + Ext.String.format(Ext.core.Element.boxMarkup, cls) + "</div>"));
            Ext.DomQuery.selectNode('.' + cls + '-mc', el.dom).appendChild(this.dom);
            return el;
        },

        /**
         * Set the size of this Element. If animation is true, both width and height will be animated concurrently.
         * @param {Mixed} width The new width. This may be one of:<div class="mdetail-params"><ul>
         * <li>A Number specifying the new width in this Element's {@link #defaultUnit}s (by default, pixels).</li>
         * <li>A String used to set the CSS width style. Animation may <b>not</b> be used.
         * <li>A size object in the format <code>{width: widthValue, height: heightValue}</code>.</li>
         * </ul></div>
         * @param {Mixed} height The new height. This may be one of:<div class="mdetail-params"><ul>
         * <li>A Number specifying the new height in this Element's {@link #defaultUnit}s (by default, pixels).</li>
         * <li>A String used to set the CSS height style. Animation may <b>not</b> be used.</li>
         * </ul></div>
         * @param {Boolean/Object} animate (optional) true for the default animation or a standard Element animation config object
         * @return {Ext.core.Element} this
         */
        setSize : function(width, height, animate){
            var me = this;
            if (Ext.isObject(width)){ // in case of object from getSize()
                height = width.height;
                width = width.width;
            }
            width = me.adjustWidth(width);
            height = me.adjustHeight(height);
            if(!animate || !me.anim){
                me.dom.style.width = me.addUnits(width);
                me.dom.style.height = me.addUnits(height);
            }
            else {
                if (!Ext.isObject(animate)) {
                    animate = {};
                }
                me.animate(Ext.applyIf({
                    to: {
                        width: width,
                        height: height
                    }
                }, animate));
            }
            return me;
        },

        /**
         * Returns either the offsetHeight or the height of this element based on CSS height adjusted by padding or borders
         * when needed to simulate offsetHeight when offsets aren't available. This may not work on display:none elements
         * if a height has not been set using CSS.
         * @return {Number}
         */
        getComputedHeight : function(){
            var me = this,
                h = Math.max(me.dom.offsetHeight, me.dom.clientHeight);
            if(!h){
                h = parseFloat(me.getStyle('height')) || 0;
                if(!me.isBorderBox()){
                    h += me.getFrameWidth('tb');
                }
            }
            return h;
        },

        /**
         * Returns either the offsetWidth or the width of this element based on CSS width adjusted by padding or borders
         * when needed to simulate offsetWidth when offsets aren't available. This may not work on display:none elements
         * if a width has not been set using CSS.
         * @return {Number}
         */
        getComputedWidth : function(){
            var me = this,
                w = Math.max(me.dom.offsetWidth, me.dom.clientWidth);
                
            if(!w){
                w = parseFloat(me.getStyle('width')) || 0;
                if(!me.isBorderBox()){
                    w += me.getFrameWidth('lr');
                }
            }
            return w;
        },

        /**
         * Returns the sum width of the padding and borders for the passed "sides". See getBorderWidth()
         for more information about the sides.
         * @param {String} sides
         * @return {Number}
         */
        getFrameWidth : function(sides, onlyContentBox){
            return onlyContentBox && this.isBorderBox() ? 0 : (this.getPadding(sides) + this.getBorderWidth(sides));
        },

        /**
         * Sets up event handlers to add and remove a css class when the mouse is over this element
         * @param {String} className
         * @return {Ext.core.Element} this
         */
        addClsOnOver : function(className){
            var dom = this.dom;
            this.hover(
                function(){
                    Ext.fly(dom, INTERNAL).addCls(className);
                },
                function(){
                    Ext.fly(dom, INTERNAL).removeCls(className);
                }
            );
            return this;
        },

        /**
         * Sets up event handlers to add and remove a css class when this element has the focus
         * @param {String} className
         * @return {Ext.core.Element} this
         */
        addClsOnFocus : function(className){
            var me = this,
                dom = me.dom;
            me.on("focus", function(){
                Ext.fly(dom, INTERNAL).addCls(className);
            });
            me.on("blur", function(){
                Ext.fly(dom, INTERNAL).removeCls(className);
            });
            return me;
        },

        /**
         * Sets up event handlers to add and remove a css class when the mouse is down and then up on this element (a click effect)
         * @param {String} className
         * @return {Ext.core.Element} this
         */
        addClsOnClick : function(className){
            var dom = this.dom;
            this.on("mousedown", function(){
                Ext.fly(dom, INTERNAL).addCls(className);
                var d = Ext.getDoc(),
                    fn = function(){
                        Ext.fly(dom, INTERNAL).removeCls(className);
                        d.removeListener("mouseup", fn);
                    };
                d.on("mouseup", fn);
            });
            return this;
        },

        /**
         * <p>Returns the dimensions of the element available to lay content out in.<p>
         * <p>If the element (or any ancestor element) has CSS style <code>display : none</code>, the dimensions will be zero.</p>
         * example:<pre><code>
        var vpSize = Ext.getBody().getViewSize();

        // all Windows created afterwards will have a default value of 90% height and 95% width
        Ext.Window.override({
            width: vpSize.width * 0.9,
            height: vpSize.height * 0.95
        });
        // To handle window resizing you would have to hook onto onWindowResize.
        * </code></pre>
        *
        * getViewSize utilizes clientHeight/clientWidth which excludes sizing of scrollbars.
        * To obtain the size including scrollbars, use getStyleSize
        *
        * Sizing of the document body is handled at the adapter level which handles special cases for IE and strict modes, etc.
        */

        getViewSize : function(){
            var me = this,
                dom = me.dom,
                isDoc = (dom == Ext.getDoc().dom || dom == Ext.getBody().dom),
                style, overflow, ret;

            // If the body, use static methods
            if (isDoc) {
                ret = {
                    width : Ext.core.Element.getViewWidth(),
                    height : Ext.core.Element.getViewHeight()
                };

            // Else use clientHeight/clientWidth
            }
            else {
                // IE Quirks mode acts more like a max-size measurement unless overflow is hidden during measurement.
                // We will put the overflow back to it's original value when we are done measuring.
                if (Ext.isIEQuirks) {
                    style = dom.style;
                    overflow = style.overflow;
                    me.setStyle({ overflow: 'hidden'});
                }
                ret = {
                    width : dom.clientWidth,
                    height : dom.clientHeight
                };
                if (Ext.isIEQuirks) {
                    me.setStyle({ overflow: overflow });
                }
            }
            return ret;
        },

        /**
        * <p>Returns the dimensions of the element available to lay content out in.<p>
        *
        * getStyleSize utilizes prefers style sizing if present, otherwise it chooses the larger of offsetHeight/clientHeight and offsetWidth/clientWidth.
        * To obtain the size excluding scrollbars, use getViewSize
        *
        * Sizing of the document body is handled at the adapter level which handles special cases for IE and strict modes, etc.
        */

        getStyleSize : function(){
            var me = this,
                doc = document,
                d = this.dom,
                isDoc = (d == doc || d == doc.body),
                s = d.style,
                w, h;

            // If the body, use static methods
            if (isDoc) {
                return {
                    width : Ext.core.Element.getViewWidth(),
                    height : Ext.core.Element.getViewHeight()
                };
            }
            // Use Styles if they are set
            if(s.width && s.width != 'auto'){
                w = parseFloat(s.width);
                if(me.isBorderBox()){
                   w -= me.getFrameWidth('lr');
                }
            }
            // Use Styles if they are set
            if(s.height && s.height != 'auto'){
                h = parseFloat(s.height);
                if(me.isBorderBox()){
                   h -= me.getFrameWidth('tb');
                }
            }
            // Use getWidth/getHeight if style not set.
            return {width: w || me.getWidth(true), height: h || me.getHeight(true)};
        },

        /**
         * Returns the size of the element.
         * @param {Boolean} contentSize (optional) true to get the width/size minus borders and padding
         * @return {Object} An object containing the element's size {width: (element width), height: (element height)}
         */
        getSize : function(contentSize){
            return {width: this.getWidth(contentSize), height: this.getHeight(contentSize)};
        },

        /**
         * Forces the browser to repaint this element
         * @return {Ext.core.Element} this
         */
        repaint : function(){
            var dom = this.dom;
            this.addCls(Ext.baseCSSPrefix + 'repaint');
            setTimeout(function(){
                Ext.fly(dom).removeCls(Ext.baseCSSPrefix + 'repaint');
            }, 1);
            return this;
        },

        /**
         * Disables text selection for this element (normalized across browsers)
         * @return {Ext.core.Element} this
         */
        unselectable : function(){
            this.dom.unselectable = "on";
            return this.swallowEvent("selectstart", true).
                        applyStyles("-moz-user-select:none;-khtml-user-select:none;").
                        addCls(Ext.baseCSSPrefix + 'unselectable');
        },

        /**
         * Returns an object with properties top, left, right and bottom representing the margins of this element unless sides is passed,
         * then it returns the calculated width of the sides (see getPadding)
         * @param {String} sides (optional) Any combination of l, r, t, b to get the sum of those sides
         * @return {Object/Number}
         */
        getMargin : function(side){
            var me = this,
                hash = {t:"top", l:"left", r:"right", b: "bottom"},
                o = {},
                key;

            if (!side) {
                for (key in me.margins){
                    o[hash[key]] = parseFloat(me.getStyle(me.margins[key])) || 0;
                }
                return o;
            } else {
                return me.addStyles.call(me, side, me.margins);
            }
        }
    });
})();
/**
 * @class Ext.core.Element
 */
/**
 * Visibility mode constant for use with {@link #setVisibilityMode}. Use visibility to hide element
 * @static
 * @type Number
 */
Ext.core.Element.VISIBILITY = 1;
/**
 * Visibility mode constant for use with {@link #setVisibilityMode}. Use display to hide element
 * @static
 * @type Number
 */
Ext.core.Element.DISPLAY = 2;

/**
 * Visibility mode constant for use with {@link #setVisibilityMode}. Use offsets (x and y positioning offscreen)
 * to hide element.
 * @static
 * @type Number
 */
Ext.core.Element.OFFSETS = 3;


Ext.core.Element.ASCLASS = 4;

/**
 * Defaults to 'x-hide-nosize'
 * @static
 * @type String
 */
Ext.core.Element.visibilityCls = Ext.baseCSSPrefix + 'hide-nosize';

Ext.core.Element.addMethods(function(){
    var El = Ext.core.Element,
        OPACITY = "opacity",
        VISIBILITY = "visibility",
        DISPLAY = "display",
        HIDDEN = "hidden",
        OFFSETS = "offsets",
        ASCLASS = "asclass",
        NONE = "none",
        NOSIZE = 'nosize',
        ORIGINALDISPLAY = 'originalDisplay',
        VISMODE = 'visibilityMode',
        ISVISIBLE = 'isVisible',
        data = El.data,
        getDisplay = function(dom){
            var d = data(dom, ORIGINALDISPLAY);
            if(d === undefined){
                data(dom, ORIGINALDISPLAY, d = '');
            }
            return d;
        },
        getVisMode = function(dom){
            var m = data(dom, VISMODE);
            if(m === undefined){
                data(dom, VISMODE, m = 1);
            }
            return m;
        };

    return {
        /**
         * The element's default display mode  (defaults to "")
         * @type String
         */
        originalDisplay : "",
        visibilityMode : 1,

        /**
         * Sets the element's visibility mode. When setVisible() is called it
         * will use this to determine whether to set the visibility or the display property.
         * @param {Number} visMode Ext.core.Element.VISIBILITY or Ext.core.Element.DISPLAY
         * @return {Ext.core.Element} this
         */
        setVisibilityMode : function(visMode){
            data(this.dom, VISMODE, visMode);
            return this;
        },

        /**
         * Checks whether the element is currently visible using both visibility and display properties.
         * @return {Boolean} True if the element is currently visible, else false
         */
        isVisible : function() {
            var me = this,
                dom = me.dom,
                visible = data(dom, ISVISIBLE);

            if(typeof visible == 'boolean'){ //return the cached value if registered
                return visible;
            }
            //Determine the current state based on display states
            visible = !me.isStyle(VISIBILITY, HIDDEN) &&
                      !me.isStyle(DISPLAY, NONE) &&
                      !((getVisMode(dom) == El.ASCLASS) && me.hasCls(me.visibilityCls || El.visibilityCls));

            data(dom, ISVISIBLE, visible);
            return visible;
        },

        /**
         * Sets the visibility of the element (see details). If the visibilityMode is set to Element.DISPLAY, it will use
         * the display property to hide the element, otherwise it uses visibility. The default is to hide and show using the visibility property.
         * @param {Boolean} visible Whether the element is visible
         * @param {Boolean/Object} animate (optional) True for the default animation, or a standard Element animation config object
         * @return {Ext.core.Element} this
         */
        setVisible : function(visible, animate){
            var me = this, isDisplay, isVisibility, isOffsets, isNosize,
                dom = me.dom,
                visMode = getVisMode(dom);


            // hideMode string override
            if (typeof animate == 'string'){
                switch (animate) {
                    case DISPLAY:
                        visMode = El.DISPLAY;
                        break;
                    case VISIBILITY:
                        visMode = El.VISIBILITY;
                        break;
                    case OFFSETS:
                        visMode = El.OFFSETS;
                        break;
                    case NOSIZE:
                    case ASCLASS:
                        visMode = El.ASCLASS;
                        break;
                }
                me.setVisibilityMode(visMode);
                animate = false;
            }

            if (!animate || !me.anim) {
                if(visMode == El.ASCLASS ){

                    me[visible?'removeCls':'addCls'](me.visibilityCls || El.visibilityCls);

                } else if (visMode == El.DISPLAY){

                    return me.setDisplayed(visible);

                } else if (visMode == El.OFFSETS){

                    if (!visible){
                        me.hideModeStyles = {
                            position: me.getStyle('position'),
                            top: me.getStyle('top'),
                            left: me.getStyle('left')
                        };
                        me.applyStyles({position: 'absolute', top: '-10000px', left: '-10000px'});
                    }

                    // Only "restore" as position if we have actually been hidden using offsets.
                    // Calling setVisible(true) on a positioned element should not reposition it.
                    else if (me.hideModeStyles) {
                        me.applyStyles(me.hideModeStyles || {position: '', top: '', left: ''});
                        delete me.hideModeStyles;
                    }

                }else{
                    me.fixDisplay();
                    dom.style.visibility = visible ? "visible" : HIDDEN;
                }
            }else{
                // closure for composites
                if(visible){
                    me.setOpacity(0.01);
                    me.setVisible(true);
                }
                if (!Ext.isObject(animate)) {
                    animate = {
                        duration: 350,
                        easing: 'ease-in'
                    };
                }
                me.animate(Ext.applyIf({
                    callback: function() {
                        visible || me.setVisible(false).setOpacity(1);
                    },
                    to: {
                        opacity: (visible) ? 1 : 0
                    }
                }, animate));
            }
            data(dom, ISVISIBLE, visible);  //set logical visibility state
            return me;
        },


        /**
         * @private
         * Determine if the Element has a relevant height and width available based
         * upon current logical visibility state
         */
        hasMetrics  : function(){
            var dom = this.dom;
            return this.isVisible() || (getVisMode(dom) == El.OFFSETS) || (getVisMode(dom) == El.VISIBILITY);
        },

        /**
         * Toggles the element's visibility or display, depending on visibility mode.
         * @param {Boolean/Object} animate (optional) True for the default animation, or a standard Element animation config object
         * @return {Ext.core.Element} this
         */
        toggle : function(animate){
            var me = this;
            me.setVisible(!me.isVisible(), me.anim(animate));
            return me;
        },

        /**
         * Sets the CSS display property. Uses originalDisplay if the specified value is a boolean true.
         * @param {Mixed} value Boolean value to display the element using its default display, or a string to set the display directly.
         * @return {Ext.core.Element} this
         */
        setDisplayed : function(value) {
            if(typeof value == "boolean"){
               value = value ? getDisplay(this.dom) : NONE;
            }
            this.setStyle(DISPLAY, value);
            return this;
        },

        // private
        fixDisplay : function(){
            var me = this;
            if (me.isStyle(DISPLAY, NONE)) {
                me.setStyle(VISIBILITY, HIDDEN);
                me.setStyle(DISPLAY, getDisplay(this.dom)); // first try reverting to default
                if (me.isStyle(DISPLAY, NONE)) { // if that fails, default to block
                    me.setStyle(DISPLAY, "block");
                }
            }
        },

        /**
         * Hide this element - Uses display mode to determine whether to use "display" or "visibility". See {@link #setVisible}.
         * @param {Boolean/Object} animate (optional) true for the default animation or a standard Element animation config object
         * @return {Ext.core.Element} this
         */
        hide : function(animate){
            // hideMode override
            if (typeof animate == 'string'){
                this.setVisible(false, animate);
                return this;
            }
            this.setVisible(false, this.anim(animate));
            return this;
        },

        /**
        * Show this element - Uses display mode to determine whether to use "display" or "visibility". See {@link #setVisible}.
        * @param {Boolean/Object} animate (optional) true for the default animation or a standard Element animation config object
         * @return {Ext.core.Element} this
         */
        show : function(animate){
            // hideMode override
            if (typeof animate == 'string'){
                this.setVisible(true, animate);
                return this;
            }
            this.setVisible(true, this.anim(animate));
            return this;
        }
    };
}());
Ext.applyIf(Ext.core.Element.prototype, {
    // @private override base Ext.util.Animate mixin for animate for backwards compatibility
    animate: function(args, duration, onComplete, easing) {
        if (arguments.length > 1) {
            if (Ext.isDefined(Ext.global.console)) {
                console.warn("animate should only be called with a single configuration object.");
            }
        }
        var me = this;
        if (!me.id) {
            me = Ext.get(me.dom);
        }
        if (Ext.fx.Manager.hasFxBlock(me.id)) {
            return me;
        }
        args = args || {};
        if (duration) {
            args.duration = duration;
        }
        if (onComplete) {
            args.callback = onComplete;
        }
        if (easing) {
            args.easing = easing;
        }
        Ext.fx.Manager.queueFx(Ext.create('Ext.fx.Anim', me.anim(args)));
        return this;
    },

    // @private override base Ext.util.Animate mixin for animate for backwards compatibility
    anim: function(config) {
        if (arguments.length > 1) {
            if (Ext.isDefined(Ext.global.console)) {
                console.warn("anim now only accepts one configuration object.");
            }
        }

        if (!Ext.isObject(config)) {
            return (config) ? {} : false;
        }

        var me = this,
            duration = config.duration || 250,
            easing = config.easing || 'ease',
            animConfig;

        if (config.stopFx) {
            me.stopFx();
        }

        Ext.applyIf(config, Ext.fx.Manager.getFxDefaults(me.id));

        // Clear any 'paused' defaults.
        Ext.fx.Manager.setFxDefaults(me.id, {
            delay: 0
        });

        // Convert durations in seconds to milliseconds
        if (config.delay && config.delay < 10) {
            if (Ext.isDefined(Ext.global.console)) {
                console.warn("Detected an extremely small animation delay, assuming the deprecated unit 'seconds were used.  Please change to milliseconds.");
            }
            config.delay *= 1000;
        }

        // Convert durations in seconds to milliseconds
        if (duration < 10) {
            if (Ext.isDefined(Ext.global.console)) {
                console.warn("Detected an extremely small animation duration, assuming the deprecated unit seconds were used.  Please change to milliseconds.");
            }
            duration *= 1000;
        }

        // Convert endOpacity to opacity
        if (config.endOpacity) {
            if (Ext.isDefined(Ext.global.console)) {
                console.warn("Detected the deprecated endOpacity property.  Please use opacity.");
            }
            config.opacity = config.endOpacity;
            delete config.endOpacity;
        }

        animConfig = {
            target: me,
            remove: config.remove,
            alternate: config.alternate || false,
            duration: duration,
            easing: easing,
            callback: config.callback,
            listeners: config.listeners,
            iterations: config.iterations || 1,
            scope: config.scope,
            block: config.block,
            concurrent: config.concurrent,
            delay: config.delay || 0,
            paused: true,
            keyframes: config.keyframes,
            from: config.from || {},
            to: Ext.apply({}, config)
        };
        Ext.apply(animConfig.to, config.to);

        // Anim API properties - backward compat
        delete animConfig.to.to;
        delete animConfig.to.from;
        delete animConfig.to.remove;
        delete animConfig.to.alternate;
        delete animConfig.to.keyframes;
        delete animConfig.to.iterations;
        delete animConfig.to.listeners;
        delete animConfig.to.target;
        delete animConfig.to.paused;
        delete animConfig.to.callback;
        delete animConfig.to.scope;
        delete animConfig.to.duration;
        delete animConfig.to.easing;
        delete animConfig.to.concurrent;
        delete animConfig.to.block;
        delete animConfig.to.stopFx;
        delete animConfig.to.delay;
        return animConfig;
    },

    /**
     * Slides the element into view.  An anchor point can be optionally passed to set the point of
     * origin for the slide effect.  This function automatically handles wrapping the element with
     * a fixed-size container if needed.  See the Fx class overview for valid anchor point options.
     * Usage:
     *<pre><code>
// default: slide the element in from the top
el.slideIn();

// custom: slide the element in from the right with a 2-second duration
el.slideIn('r', { duration: 2 });

// common config options shown with default values
el.slideIn('t', {
    easing: 'easeOut',
    duration: .5
});
</code></pre>
     * @param {String} anchor (optional) One of the valid Fx anchor positions (defaults to top: 't')
     * @param {Object} options (optional) Object literal with any of the Fx config options
     * @return {Ext.core.Element} The Element
     */
    slideIn: function(anchor, obj, slideOut) { 
        var me = this,
            elStyle = me.dom.style,
            beforeAnim, wrapAnim;

        anchor = anchor || "t";
        obj = obj || {};

        beforeAnim = function() {
            var animScope = this,
                listeners = obj.listeners,
                box, position, restoreSize, wrap, anim;

            if (!slideOut) {
                me.fixDisplay();
            }

            box = me.getBox();
            position = me.getPositioning();
            me.setSize(box.width, box.height);

            wrap = me.wrap({
                style: {
                    visibility: slideOut ? 'visible' : 'hidden'
                }
            });
            wrap.setPositioning(position);
            if (wrap.isStyle('position', 'static')) {
                wrap.position('relative');
            }
            me.clearPositioning('auto');
            wrap.clip();

            me.setStyle({
                visibility: 'visible',
                position: 'absolute'
            });
            if (slideOut) {
                wrap.setSize(box.width, box.height);
            }

            switch (anchor) {
                case 't':
                    anim = {
                        from: {
                            width: box.width + 'px',
                            height: '0px'
                        },
                        to: {
                            width: box.width + 'px',
                            height: box.height + 'px'
                        }
                    };
                    elStyle.bottom = '0px';
                    break;
                case 'l':
                    anim = {
                        from: {
                            width: '0px',
                            height: box.height + 'px'
                        },
                        to: {
                            width: box.width + 'px',
                            height: box.height + 'px'
                        }
                    };
                    elStyle.right = '0px';
                    break;
                case 'r':
                    anim = {
                        from: {
                            x: box.x + box.width,
                            width: '0px',
                            height: box.height + 'px'
                        },
                        to: {
                            x: box.x,
                            width: box.width + 'px',
                            height: box.height + 'px'
                        }
                    };
                    break;
                case 'b':
                    anim = {
                        from: {
                            y: box.y + box.height,
                            width: box.width + 'px',
                            height: '0px'
                        },
                        to: {
                            y: box.y,
                            width: box.width + 'px',
                            height: box.height + 'px'
                        }
                    };
                    break;
                case 'tl':
                    anim = {
                        from: {
                            x: box.x,
                            y: box.y,
                            width: '0px',
                            height: '0px'
                        },
                        to: {
                            width: box.width + 'px',
                            height: box.height + 'px'
                        }
                    };
                    elStyle.bottom = '0px';
                    elStyle.right = '0px';
                    break;
                case 'bl':
                    anim = {
                        from: {
                            x: box.x + box.width,
                            width: '0px',
                            height: '0px'
                        },
                        to: {
                            x: box.x,
                            width: box.width + 'px',
                            height: box.height + 'px'
                        }
                    };
                    elStyle.right = '0px';
                    break;
                case 'br':
                    anim = {
                        from: {
                            x: box.x + box.width,
                            y: box.y + box.height,
                            width: '0px',
                            height: '0px'
                        },
                        to: {
                            x: box.x,
                            y: box.y,
                            width: box.width + 'px',
                            height: box.height + 'px'
                        }
                    };
                    break;
                case 'tr':
                    anim = {
                        from: {
                            y: box.y + box.height,
                            width: '0px',
                            height: '0px'
                        },
                        to: {
                            y: box.y,
                            width: box.width + 'px',
                            height: box.height + 'px'
                        }
                    };
                    elStyle.bottom = '0px';
                    break;
            }

            wrap.show();
            wrapAnim = Ext.apply({}, obj);
            delete wrapAnim.listeners;
            wrapAnim = Ext.create('Ext.fx.Anim', Ext.applyIf(wrapAnim, {
                target: wrap,
                duration: 500,
                easing: 'ease-out',
                from: slideOut ? anim.to : anim.from,
                to: slideOut ? anim.from : anim.to
            }));

            // In the absence of a callback, this listener MUST be added first
            wrapAnim.on('afteranimate', function() {
                if (slideOut) {
                    me.setPositioning(position);
                    obj.useDisplay ? me.setDisplayed(false) : me.hide();
                }
                else {
                    me.clearPositioning();
                    me.setPositioning(position);
                }
                if (wrap.dom) {
                    wrap.dom.parentNode.insertBefore(me.dom, wrap.dom); 
                    wrap.remove();
                }
                me.setSize(box.width, box.height);
                animScope.end();
            });
            // Add configured listeners after
            if (listeners) {
                wrapAnim.on(listeners);
            }
        };

        me.animate({
            duration: obj.duration ? obj.duration * 2 : 1000,
            listeners: {
                beforeanimate: {
                    fn: beforeAnim
                },
                afteranimate: {
                    fn: function() {
                        if (wrapAnim.running) {
                            wrapAnim.end();
                        }
                    }
                }
            }
        });
        return me;
    },

    
    /**
     * Slides the element out of view.  An anchor point can be optionally passed to set the end point
     * for the slide effect.  When the effect is completed, the element will be hidden (visibility = 
     * 'hidden') but block elements will still take up space in the document.  The element must be removed
     * from the DOM using the 'remove' config option if desired.  This function automatically handles 
     * wrapping the element with a fixed-size container if needed.  See the Fx class overview for valid anchor point options.
     * Usage:
     *<pre><code>
// default: slide the element out to the top
el.slideOut();

// custom: slide the element out to the right with a 2-second duration
el.slideOut('r', { duration: 2 });

// common config options shown with default values
el.slideOut('t', {
    easing: 'easeOut',
    duration: .5,
    remove: false,
    useDisplay: false
});
</code></pre>
     * @param {String} anchor (optional) One of the valid Fx anchor positions (defaults to top: 't')
     * @param {Object} options (optional) Object literal with any of the Fx config options
     * @return {Ext.core.Element} The Element
     */
    slideOut: function(anchor, o) {
        return this.slideIn(anchor, o, true);
    },

    /**
     * Fades the element out while slowly expanding it in all directions.  When the effect is completed, the 
     * element will be hidden (visibility = 'hidden') but block elements will still take up space in the document.
     * Usage:
     *<pre><code>
// default
el.puff();

// common config options shown with default values
el.puff({
    easing: 'easeOut',
    duration: .5,
    useDisplay: false
});
</code></pre>
     * @param {Object} options (optional) Object literal with any of the Fx config options
     * @return {Ext.core.Element} The Element
     */

    puff: function(obj) {
        var me = this,
            beforeAnim;
        obj = Ext.applyIf(obj || {}, {
            easing: 'ease-out',
            duration: 500,
            useDisplay: false
        });

        beforeAnim = function() {
            me.clearOpacity();
            me.show();

            var box = me.getBox(),
                fontSize = me.getStyle('fontSize'),
                position = me.getPositioning();
            this.to = {
                width: box.width * 2,
                height: box.height * 2,
                x: box.x - (box.width / 2),
                y: box.y - (box.height /2),
                opacity: 0,
                fontSize: '200%'
            };
            this.on('afteranimate',function() {
                if (me.dom) {
                    obj.useDisplay ? me.setDisplayed(false) : me.hide();
                    me.clearOpacity();  
                    me.setPositioning(position);
                    me.setStyle({fontSize: fontSize});
                }
            });
        };

        me.animate({
            duration: obj.duration,
            easing: obj.easing,
            listeners: {
                beforeanimate: {
                    fn: beforeAnim
                }
            }
        });
        return me;
    },

    /**
     * Blinks the element as if it was clicked and then collapses on its center (similar to switching off a television).
     * When the effect is completed, the element will be hidden (visibility = 'hidden') but block elements will still 
     * take up space in the document. The element must be removed from the DOM using the 'remove' config option if desired.
     * Usage:
     *<pre><code>
// default
el.switchOff();

// all config options shown with default values
el.switchOff({
    easing: 'easeIn',
    duration: .3,
    remove: false,
    useDisplay: false
});
</code></pre>
     * @param {Object} options (optional) Object literal with any of the Fx config options
     * @return {Ext.core.Element} The Element
     */
    switchOff: function(obj) {
        var me = this,
            beforeAnim;
        
        obj = Ext.applyIf(obj || {}, {
            easing: 'ease-in',
            duration: 500,
            remove: false,
            useDisplay: false
        });

        beforeAnim = function() {
            var animScope = this,
                size = me.getSize(),
                xy = me.getXY(),
                keyframe, position;
            me.clearOpacity();
            me.clip();
            position = me.getPositioning();

            keyframe = Ext.create('Ext.fx.Animator', {
                target: me,
                duration: obj.duration,
                easing: obj.easing,
                keyframes: {
                    33: {
                        opacity: 0.3
                    },
                    66: {
                        height: 1,
                        y: xy[1] + size.height / 2
                    },
                    100: {
                        width: 1,
                        x: xy[0] + size.width / 2
                    }
                }
            });
            keyframe.on('afteranimate', function() {
                obj.useDisplay ? me.setDisplayed(false) : me.hide();  
                me.clearOpacity();
                me.setPositioning(position);
                me.setSize(size);
                animScope.end();
            });
        };
        me.animate({
            duration: (obj.duration * 2),
            listeners: {
                beforeanimate: {
                    fn: beforeAnim
                }
            }
        });
        return me;
    },

   /**
    * Shows a ripple of exploding, attenuating borders to draw attention to an Element.
    * Usage:
<pre><code>
// default: a single light blue ripple
el.frame();

// custom: 3 red ripples lasting 3 seconds total
el.frame("#ff0000", 3, { duration: 3 });

// common config options shown with default values
el.frame("#C3DAF9", 1, {
    duration: 1 //duration of each individual ripple.
    // Note: Easing is not configurable and will be ignored if included
});
</code></pre>
    * @param {String} color (optional) The color of the border.  Should be a 6 char hex color without the leading # (defaults to light blue: 'C3DAF9').
    * @param {Number} count (optional) The number of ripples to display (defaults to 1)
    * @param {Object} options (optional) Object literal with any of the Fx config options
    * @return {Ext.core.Element} The Element
    */
    frame : function(color, count, obj){
        var me = this,
            beforeAnim;

        color = color || '#C3DAF9';
        count = count || 1;
        obj = obj || {};

        beforeAnim = function() {
            me.show();
            var animScope = this,
                box = me.getBox(),
                proxy = Ext.getBody().createChild({
                    style: {
                        position : 'absolute',
                        'pointer-events': 'none',
                        'z-index': 35000,
                        border : '0px solid ' + color
                    }
                }),
                proxyAnim;
            proxyAnim = Ext.create('Ext.fx.Anim', {
                target: proxy,
                duration: obj.duration || 1000,
                iterations: count,
                from: {
                    top: box.y,
                    left: box.x,
                    borderWidth: 0,
                    opacity: 1,
                    height: box.height,
                    width: box.width
                },
                to: {
                    top: box.y - 20,
                    left: box.x - 20,
                    borderWidth: 10,
                    opacity: 0,
                    height: box.height + 40,
                    width: box.width + 40
                }
            });
            proxyAnim.on('afteranimate', function() {
                proxy.remove();
                animScope.end();
            });
        };

        me.animate({
            duration: (obj.duration * 2) || 2000,
            listeners: {
                beforeanimate: {
                    fn: beforeAnim
                }
            }
        });
        return me;
    },

    /**
     * Slides the element while fading it out of view.  An anchor point can be optionally passed to set the 
     * ending point of the effect.
     * Usage:
     *<pre><code>
// default: slide the element downward while fading out
el.ghost();

// custom: slide the element out to the right with a 2-second duration
el.ghost('r', { duration: 2 });

// common config options shown with default values
el.ghost('b', {
    easing: 'easeOut',
    duration: .5
});
</code></pre>
     * @param {String} anchor (optional) One of the valid Fx anchor positions (defaults to bottom: 'b')
     * @param {Object} options (optional) Object literal with any of the Fx config options
     * @return {Ext.core.Element} The Element
     */
    ghost: function(anchor, obj) {
        var me = this,
            beforeAnim;

        anchor = anchor || "b";
        beforeAnim = function() {
            var width = me.getWidth(),
                height = me.getHeight(),
                xy = me.getXY(),
                position = me.getPositioning(),
                to = {
                    opacity: 0
                };
            switch (anchor) {
                case 't':
                    to.y = xy[1] - height;
                    break;
                case 'l':
                    to.x = xy[0] - width;
                    break;
                case 'r':
                    to.x = xy[0] + width;
                    break;
                case 'b':
                    to.y = xy[1] + height;
                    break;
                case 'tl':
                    to.x = xy[0] - width;
                    to.y = xy[1] - height;
                    break;
                case 'bl':
                    to.x = xy[0] - width;
                    to.y = xy[1] + height;
                    break;
                case 'br':
                    to.x = xy[0] + width;
                    to.y = xy[1] + height;
                    break;
                case 'tr':
                    to.x = xy[0] + width;
                    to.y = xy[1] - height;
                    break;
            }
            this.to = to;
            this.on('afteranimate', function () {
                if (me.dom) {
                    me.hide();
                    me.clearOpacity();
                    me.setPositioning(position);
                }
            });
        };

        me.animate(Ext.applyIf(obj || {}, {
            duration: 500,
            easing: 'ease-out',
            listeners: {
                beforeanimate: {
                    fn: beforeAnim
                }
            }
        }));
        return me;
    },

    /**
     * Highlights the Element by setting a color (applies to the background-color by default, but can be
     * changed using the "attr" config option) and then fading back to the original color. If no original
     * color is available, you should provide the "endColor" config option which will be cleared after the animation.
     * Usage:
<pre><code>
// default: highlight background to yellow
el.highlight();

// custom: highlight foreground text to blue for 2 seconds
el.highlight("0000ff", { attr: 'color', duration: 2 });

// common config options shown with default values
el.highlight("ffff9c", {
    attr: "background-color", //can be any valid CSS property (attribute) that supports a color value
    endColor: (current color) or "ffffff",
    easing: 'easeIn',
    duration: 1
});
</code></pre>
     * @param {String} color (optional) The highlight color. Should be a 6 char hex color without the leading # (defaults to yellow: 'ffff9c')
     * @param {Object} options (optional) Object literal with any of the Fx config options
     * @return {Ext.core.Element} The Element
     */ 
    highlight: function(color, o) {
        var me = this,
            dom = me.dom,
            from = {},
            restore, to, attr;

        o = o || {};
        attr = o.attr || "backgroundColor";
        if (!o.to) {
            to = {};
            to[attr] = o.endColor || "#ffff9c";
        }
        else {
            to = o.to;
        }

        me.animate(Ext.apply({}, o, {
            duration: 1000,
            easing: 'ease-in',
            to: to,
            listeners: {
                beforeanimate: {
                    fn: function() {
                        restore = dom.style[attr];
                        me.clearOpacity();
                        me.show();
                    }
                },
                afteranimate: {
                    fn: function() {
                        if (dom) {
                            dom.style[attr] = restore;
                        }
                    }
                }
            }
        }));
        return me;
    }
});

Ext.applyIf(Ext.core.Element, {
    unitRe: /\d+(px|em|%|en|ex|pt|in|cm|mm|pc)$/i,
    camelRe: /(-[a-z])/gi,
    opacityRe: /alpha\(opacity=(.*)\)/i,
    cssRe: /([a-z0-9-]+)\s*:\s*([^;\s]+(?:\s*[^;\s]+)*);?/gi,
    propertyCache: {},
    defaultUnit : "px",
    borders: {l: 'border-left-width', r: 'border-right-width', t: 'border-top-width', b: 'border-bottom-width'},
    paddings: {l: 'padding-left', r: 'padding-right', t: 'padding-top', b: 'padding-bottom'},
    margins: {l: 'margin-left', r: 'margin-right', t: 'margin-top', b: 'margin-bottom'},

    // Reference the prototype's version of the method. Signatures are identical.
    addUnits : Ext.core.Element.prototype.addUnits,

    /**
     * Parses a number or string representing margin sizes into an object. Supports CSS-style margin declarations
     * (e.g. 10, "10", "10 10", "10 10 10" and "10 10 10 10" are all valid options and would return the same result)
     * @static
     * @param {Number|String} box The encoded margins
     * @return {Object} An object with margin sizes for top, right, bottom and left
     */
    parseBox : function(box) {
        if (Ext.isObject(box)) {
            return {
                top: box.top || 0,
                right: box.right || 0,
                bottom: box.bottom || 0,
                left: box.left || 0
            };
        } else {
            if (typeof box != 'string') {
                box = box.toString();
            }
            var parts  = box.split(' '),
                ln = parts.length;
    
            if (ln == 1) {
                parts[1] = parts[2] = parts[3] = parts[0];
            }
            else if (ln == 2) {
                parts[2] = parts[0];
                parts[3] = parts[1];
            }
            else if (ln == 3) {
                parts[3] = parts[1];
            }
    
            return {
                top   :parseFloat(parts[0]) || 0,
                right :parseFloat(parts[1]) || 0,
                bottom:parseFloat(parts[2]) || 0,
                left  :parseFloat(parts[3]) || 0
            };
        }
        
    },
    
    /**
     * Parses a number or string representing margin sizes into an object. Supports CSS-style margin declarations
     * (e.g. 10, "10", "10 10", "10 10 10" and "10 10 10 10" are all valid options and would return the same result)
     * @static
     * @param {Number|String} box The encoded margins
     * @param {String} units The type of units to add
     * @return {String} An string with unitized (px if units is not specified) metrics for top, right, bottom and left
     */
    unitizeBox : function(box, units) {
        var A = this.addUnits,
            B = this.parseBox(box);
            
        return A(B.top, units) + ' ' +
               A(B.right, units) + ' ' +
               A(B.bottom, units) + ' ' +
               A(B.left, units);
        
    },

    // private
    camelReplaceFn : function(m, a) {
        return a.charAt(1).toUpperCase();
    },

    /**
     * Normalizes CSS property keys from dash delimited to camel case JavaScript Syntax.
     * For example:
     * <ul>
     *  <li>border-width -> borderWidth</li>
     *  <li>padding-top -> paddingTop</li>
     * </ul>
     * @static
     * @param {String} prop The property to normalize
     * @return {String} The normalized string
     */
    normalize : function(prop) {
        if (prop == 'float') {
            prop = Ext.supports.Float ? 'cssFloat' : 'styleFloat';
        }
        return this.propertyCache[prop] || (this.propertyCache[prop] = prop.replace(this.camelRe, this.camelReplaceFn));
    },

    /**
     * Retrieves the document height
     * @static
     * @return {Number} documentHeight
     */
    getDocumentHeight: function() {
        return Math.max(!Ext.isStrict ? document.body.scrollHeight : document.documentElement.scrollHeight, this.getViewportHeight());
    },

    /**
     * Retrieves the document width
     * @static
     * @return {Number} documentWidth
     */
    getDocumentWidth: function() {
        return Math.max(!Ext.isStrict ? document.body.scrollWidth : document.documentElement.scrollWidth, this.getViewportWidth());
    },

    /**
     * Retrieves the viewport height of the window.
     * @static
     * @return {Number} viewportHeight
     */
    getViewportHeight: function(){
        return window.innerHeight;
    },

    /**
     * Retrieves the viewport width of the window.
     * @static
     * @return {Number} viewportWidth
     */
    getViewportWidth : function() {
        return window.innerWidth;
    },

    /**
     * Retrieves the viewport size of the window.
     * @static
     * @return {Object} object containing width and height properties
     */
    getViewSize : function() {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        };
    },

    /**
     * Retrieves the current orientation of the window. This is calculated by
     * determing if the height is greater than the width.
     * @static
     * @return {String} Orientation of window: 'portrait' or 'landscape'
     */
    getOrientation : function() {
        if (Ext.supports.OrientationChange) {
            return (window.orientation == 0) ? 'portrait' : 'landscape';
        }
        
        return (window.innerHeight > window.innerWidth) ? 'portrait' : 'landscape';
    },

    /** 
     * Returns the top Element that is located at the passed coordinates
     * @static
     * @param {Number} x The x coordinate
     * @param {Number} x The y coordinate
     * @return {String} The found Element
     */
    fromPoint: function(x, y) {
        return Ext.get(document.elementFromPoint(x, y));
    },
    
    /**
     * Converts a CSS string into an object with a property for each style.
     * <p>
     * The sample code below would return an object with 2 properties, one
     * for background-color and one for color.</p>
     * <pre><code>
var css = 'background-color: red;color: blue; ';
console.log(Ext.core.Element.parseStyles(css));
     * </code></pre>
     * @static
     * @param {String} styles A CSS string
     * @return {Object} styles
     */
    parseStyles: function(styles){
        var out = {},
            cssRe = this.cssRe,
            matches;
            
        if (styles) {
            /**
             * Since we're using the g flag on the regex, we need to set the lastIndex.
             * This automatically happens on some implementations, but not others, see:
             * http://stackoverflow.com/questions/2645273/javascript-regular-expression-literal-persists-between-function-calls
             * http://blog.stevenlevithan.com/archives/fixing-javascript-regexp
             */
            cssRe.lastIndex = 0;
            while ((matches = cssRe.exec(styles))) {
                out[matches[1]] = matches[2];
            }
        }
        return out;
    }
});

/**
 * @class Ext.CompositeElementLite
 * <p>This class encapsulates a <i>collection</i> of DOM elements, providing methods to filter
 * members, or to perform collective actions upon the whole set.</p>
 * <p>Although they are not listed, this class supports all of the methods of {@link Ext.core.Element} and
 * {@link Ext.fx.Anim}. The methods from these classes will be performed on all the elements in this collection.</p>
 * Example:<pre><code>
var els = Ext.select("#some-el div.some-class");
// or select directly from an existing element
var el = Ext.get('some-el');
el.select('div.some-class');

els.setWidth(100); // all elements become 100 width
els.hide(true); // all elements fade out and hide
// or
els.setWidth(100).hide(true);
</code></pre>
 */
Ext.CompositeElementLite = function(els, root){
    /**
     * <p>The Array of DOM elements which this CompositeElement encapsulates. Read-only.</p>
     * <p>This will not <i>usually</i> be accessed in developers' code, but developers wishing
     * to augment the capabilities of the CompositeElementLite class may use it when adding
     * methods to the class.</p>
     * <p>For example to add the <code>nextAll</code> method to the class to <b>add</b> all
     * following siblings of selected elements, the code would be</p><code><pre>
Ext.override(Ext.CompositeElementLite, {
    nextAll: function() {
        var els = this.elements, i, l = els.length, n, r = [], ri = -1;

//      Loop through all elements in this Composite, accumulating
//      an Array of all siblings.
        for (i = 0; i < l; i++) {
            for (n = els[i].nextSibling; n; n = n.nextSibling) {
                r[++ri] = n;
            }
        }

//      Add all found siblings to this Composite
        return this.add(r);
    }
});</pre></code>
     * @type Array
     * @property elements
     */
    this.elements = [];
    this.add(els, root);
    this.el = new Ext.core.Element.Flyweight();
};

Ext.CompositeElementLite.prototype = {
    isComposite: true,

    // private
    getElement : function(el){
        // Set the shared flyweight dom property to the current element
        var e = this.el;
        e.dom = el;
        e.id = el.id;
        return e;
    },

    // private
    transformElement : function(el){
        return Ext.getDom(el);
    },

    /**
     * Returns the number of elements in this Composite.
     * @return Number
     */
    getCount : function(){
        return this.elements.length;
    },
    /**
     * Adds elements to this Composite object.
     * @param {Mixed} els Either an Array of DOM elements to add, or another Composite object who's elements should be added.
     * @return {CompositeElement} This Composite object.
     */
    add : function(els, root){
        var me = this,
            elements = me.elements;
        if(!els){
            return this;
        }
        if(typeof els == "string"){
            els = Ext.core.Element.selectorFunction(els, root);
        }else if(els.isComposite){
            els = els.elements;
        }else if(!Ext.isIterable(els)){
            els = [els];
        }

        for(var i = 0, len = els.length; i < len; ++i){
            elements.push(me.transformElement(els[i]));
        }
        return me;
    },

    invoke : function(fn, args){
        var me = this,
            els = me.elements,
            len = els.length,
            e,
            i;

        for(i = 0; i < len; i++) {
            e = els[i];
            if(e){
                Ext.core.Element.prototype[fn].apply(me.getElement(e), args);
            }
        }
        return me;
    },
    /**
     * Returns a flyweight Element of the dom element object at the specified index
     * @param {Number} index
     * @return {Ext.core.Element}
     */
    item : function(index){
        var me = this,
            el = me.elements[index],
            out = null;

        if(el){
            out = me.getElement(el);
        }
        return out;
    },

    // fixes scope with flyweight
    addListener : function(eventName, handler, scope, opt){
        var els = this.elements,
            len = els.length,
            i, e;

        for(i = 0; i<len; i++) {
            e = els[i];
            if(e) {
                Ext.EventManager.on(e, eventName, handler, scope || e, opt);
            }
        }
        return this;
    },
    /**
     * <p>Calls the passed function for each element in this composite.</p>
     * @param {Function} fn The function to call. The function is passed the following parameters:<ul>
     * <li><b>el</b> : Element<div class="sub-desc">The current Element in the iteration.
     * <b>This is the flyweight (shared) Ext.core.Element instance, so if you require a
     * a reference to the dom node, use el.dom.</b></div></li>
     * <li><b>c</b> : Composite<div class="sub-desc">This Composite object.</div></li>
     * <li><b>idx</b> : Number<div class="sub-desc">The zero-based index in the iteration.</div></li>
     * </ul>
     * @param {Object} scope (optional) The scope (<i>this</i> reference) in which the function is executed. (defaults to the Element)
     * @return {CompositeElement} this
     */
    each : function(fn, scope){
        var me = this,
            els = me.elements,
            len = els.length,
            i, e;

        for(i = 0; i<len; i++) {
            e = els[i];
            if(e){
                e = this.getElement(e);
                if(fn.call(scope || e, e, me, i) === false){
                    break;
                }
            }
        }
        return me;
    },

    /**
    * Clears this Composite and adds the elements passed.
    * @param {Mixed} els Either an array of DOM elements, or another Composite from which to fill this Composite.
    * @return {CompositeElement} this
    */
    fill : function(els){
        var me = this;
        me.elements = [];
        me.add(els);
        return me;
    },

    /**
     * Filters this composite to only elements that match the passed selector.
     * @param {String/Function} selector A string CSS selector or a comparison function.
     * The comparison function will be called with the following arguments:<ul>
     * <li><code>el</code> : Ext.core.Element<div class="sub-desc">The current DOM element.</div></li>
     * <li><code>index</code> : Number<div class="sub-desc">The current index within the collection.</div></li>
     * </ul>
     * @return {CompositeElement} this
     */
    filter : function(selector){
        var els = [],
            me = this,
            fn = Ext.isFunction(selector) ? selector
                : function(el){
                    return el.is(selector);
                };

        me.each(function(el, self, i) {
            if (fn(el, i) !== false) {
                els[els.length] = me.transformElement(el);
            }
        });
        
        me.elements = els;
        return me;
    },

    /**
     * Find the index of the passed element within the composite collection.
     * @param el {Mixed} The id of an element, or an Ext.core.Element, or an HtmlElement to find within the composite collection.
     * @return Number The index of the passed Ext.core.Element in the composite collection, or -1 if not found.
     */
    indexOf : function(el){
        return Ext.Array.indexOf(this.elements, this.transformElement(el));
    },

    /**
    * Replaces the specified element with the passed element.
    * @param {Mixed} el The id of an element, the Element itself, the index of the element in this composite
    * to replace.
    * @param {Mixed} replacement The id of an element or the Element itself.
    * @param {Boolean} domReplace (Optional) True to remove and replace the element in the document too.
    * @return {CompositeElement} this
    */
    replaceElement : function(el, replacement, domReplace){
        var index = !isNaN(el) ? el : this.indexOf(el),
            d;
        if(index > -1){
            replacement = Ext.getDom(replacement);
            if(domReplace){
                d = this.elements[index];
                d.parentNode.insertBefore(replacement, d);
                Ext.removeNode(d);
            }
            this.elements.splice(index, 1, replacement);
        }
        return this;
    },

    /**
     * Removes all elements.
     */
    clear : function(){
        this.elements = [];
    }
};

Ext.CompositeElementLite.prototype.on = Ext.CompositeElementLite.prototype.addListener;

/**
 * @private
 * Copies all of the functions from Ext.core.Element's prototype onto CompositeElementLite's prototype.
 * This is called twice - once immediately below, and once again after additional Ext.core.Element
 * are added in Ext JS
 */
Ext.CompositeElementLite.importElementMethods = function() {
    var fnName,
        ElProto = Ext.core.Element.prototype,
        CelProto = Ext.CompositeElementLite.prototype;

    for (fnName in ElProto) {
        if (typeof ElProto[fnName] == 'function'){
            (function(fnName) {
                CelProto[fnName] = CelProto[fnName] || function() {
                    return this.invoke(fnName, arguments);
                };
            }).call(CelProto, fnName);

        }
    }
};

Ext.CompositeElementLite.importElementMethods();

if(Ext.DomQuery){
    Ext.core.Element.selectorFunction = Ext.DomQuery.select;
}

/**
 * Selects elements based on the passed CSS selector to enable {@link Ext.core.Element Element} methods
 * to be applied to many related elements in one statement through the returned {@link Ext.CompositeElement CompositeElement} or
 * {@link Ext.CompositeElementLite CompositeElementLite} object.
 * @param {String/Array} selector The CSS selector or an array of elements
 * @param {HTMLElement/String} root (optional) The root element of the query or id of the root
 * @return {CompositeElementLite/CompositeElement}
 * @member Ext.core.Element
 * @method select
 */
Ext.core.Element.select = function(selector, root){
    var els;
    if(typeof selector == "string"){
        els = Ext.core.Element.selectorFunction(selector, root);
    }else if(selector.length !== undefined){
        els = selector;
    }else{
        throw "Invalid selector";
    }
    return new Ext.CompositeElementLite(els);
};
/**
 * Selects elements based on the passed CSS selector to enable {@link Ext.core.Element Element} methods
 * to be applied to many related elements in one statement through the returned {@link Ext.CompositeElement CompositeElement} or
 * {@link Ext.CompositeElementLite CompositeElementLite} object.
 * @param {String/Array} selector The CSS selector or an array of elements
 * @param {HTMLElement/String} root (optional) The root element of the query or id of the root
 * @return {CompositeElementLite/CompositeElement}
 * @member Ext
 * @method select
 */
Ext.select = Ext.core.Element.select;

/**
 * @class Ext.util.DelayedTask

The DelayedTask class provides a convenient way to "buffer" the execution of a method,
performing setTimeout where a new timeout cancels the old timeout. When called, the
task will wait the specified time period before executing. If durng that time period,
the task is called again, the original call will be cancelled. This continues so that
the function is only called a single time for each iteration.

This method is especially useful for things like detecting whether a user has finished
typing in a text field. An example would be performing validation on a keypress. You can
use this class to buffer the keypress events for a certain number of milliseconds, and
perform only if they stop for that amount of time.  

**Usage:**

    var task = new Ext.util.DelayedTask(function(){
        alert(Ext.getDom('myInputField').value.length);
    });
    
    // Wait 500ms before calling our function. If the user presses another key
    // during that 500ms, it will be cancelled and we'll wait another 500ms.
    Ext.get('myInputField').on('keypress', function(){
        task.{@link #delay}(500);
    });

Note that we are using a DelayedTask here to illustrate a point. The configuration
option `buffer` for {@link Ext.util.Observable#addListener addListener/on} will
also setup a delayed task for you to buffer events.

 * @constructor The parameters to this constructor serve as defaults and are not required.
 * @param {Function} fn (optional) The default function to call.
 * @param {Object} scope The default scope (The <code><b>this</b></code> reference) in which the
 * function is called. If not specified, <code>this</code> will refer to the browser window.
 * @param {Array} args (optional) The default Array of arguments.
 * @markdown
 */

Ext.util.DelayedTask = function(fn, scope, args) {
    var me = this,
        id,
        call = function() {
            clearInterval(id);
            id = null;
            fn.apply(scope, args || []);
        };

    /**
     * Cancels any pending timeout and queues a new one
     * @param {Number} delay The milliseconds to delay
     * @param {Function} newFn (optional) Overrides function passed to constructor
     * @param {Object} newScope (optional) Overrides scope passed to constructor. Remember that if no scope
     * is specified, <code>this</code> will refer to the browser window.
     * @param {Array} newArgs (optional) Overrides args passed to constructor
     */
    this.delay = function(delay, newFn, newScope, newArgs) {
        me.cancel();
        fn = newFn || fn;
        scope = newScope || scope;
        args = newArgs || args;
        id = setInterval(call, delay);
    };

    /**
     * Cancel the last queued timeout
     */
    this.cancel = function(){
        if (id) {
            clearInterval(id);
            id = null;
        }
    };
};
Ext.require('Ext.util.DelayedTask', function() {

    Ext.util.Event = Ext.extend(Object, (function() {
        function createBuffered(handler, listener, o, scope) {
            listener.task = new Ext.util.DelayedTask();
            return function() {
                listener.task.delay(o.buffer, handler, scope, Ext.Array.toArray(arguments));
            };
        }

        function createDelayed(handler, listener, o, scope) {
            return function() {
                var task = new Ext.util.DelayedTask();
                if (!listener.tasks) {
                    listener.tasks = [];
                }
                listener.tasks.push(task);
                task.delay(o.delay || 10, handler, scope, Ext.Array.toArray(arguments));
            };
        }

        function createSingle(handler, listener, o, scope) {
            return function() {
                listener.ev.removeListener(listener.fn, scope);
                return handler.apply(scope, arguments);
            };
        }

        return {
            isEvent: true,

            constructor: function(observable, name) {
                this.name = name;
                this.observable = observable;
                this.listeners = [];
            },

            addListener: function(fn, scope, options) {
                var me = this,
                    listener;
                    scope = scope || me.observable;
                
                if (!fn) {
                    throw "Ext.util.Event: Attempted to bind an event listener to a function that does not exist.";
                }

                if (!me.isListening(fn, scope)) {
                    listener = me.createListener(fn, scope, options);
                    if (me.firing) {
                        // if we are currently firing this event, don't disturb the listener loop
                        me.listeners = me.listeners.slice(0);
                    }
                    me.listeners.push(listener);
                }
            },

            createListener: function(fn, scope, o) {
                o = o || {};
                scope = scope || this.observable;

                var listener = {
                        fn: fn,
                        scope: scope,
                        o: o,
                        ev: this
                    },
                    handler = fn;

                if (o.delay) {
                    handler = createDelayed(handler, listener, o, scope);
                }
                if (o.buffer) {
                    handler = createBuffered(handler, listener, o, scope);
                }
                if (o.single) {
                    handler = createSingle(handler, listener, o, scope);
                }

                listener.fireFn = handler;
                return listener;
            },

            findListener: function(fn, scope) {
                var listeners = this.listeners,
                i = listeners.length,
                listener,
                s;

                while (i--) {
                    listener = listeners[i];
                    if (listener) {
                        s = listener.scope;
                        if (listener.fn == fn && (s == scope || s == this.observable)) {
                            return i;
                        }
                    }
                }

                return - 1;
            },

            isListening: function(fn, scope) {
                return this.findListener(fn, scope) !== -1;
            },

            removeListener: function(fn, scope) {
                var me = this,
                    index,
                    listener,
                    k;
                index = me.findListener(fn, scope);
                if (index != -1) {
                    listener = me.listeners[index];

                    if (me.firing) {
                        me.listeners = me.listeners.slice(0);
                    }

                    // cancel and remove a buffered handler that hasn't fired yet
                    if (listener.task) {
                        listener.task.cancel();
                        delete listener.task;
                    }

                    // cancel and remove all delayed handlers that haven't fired yet
                    k = listener.tasks && listener.tasks.length;
                    if (k) {
                        while (k--) {
                            listener.tasks[k].cancel();
                        }
                        delete listener.tasks;
                    }

                    // remove this listener from the listeners array
                    me.listeners.splice(index, 1);
                    return true;
                }

                return false;
            },

            // Iterate to stop any buffered/delayed events
            clearListeners: function() {
                var listeners = this.listeners,
                    i = listeners.length;

                while (i--) {
                    this.removeListener(listeners[i].fn, listeners[i].scope);
                }
            },

            fire: function() {
                var me = this,
                    listeners = me.listeners,
                    count = listeners.length,
                    i,
                    args,
                    listener;

                if (count > 0) {
                    me.firing = true;
                    for (i = 0; i < count; i++) {
                        listener = listeners[i];
                        args = arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
                        if (listener.o) {
                            args.push(listener.o);
                        }
                        if (listener && listener.fireFn.apply(listener.scope || me.observable, args) === false) {
                            return (me.firing = false);
                        }
                    }
                }
                me.firing = false;
                return true;
            }
        };
    })());
});

/**
 * @class Ext.EventManager
 * Registers event handlers that want to receive a normalized EventObject instead of the standard browser event and provides
 * several useful events directly.
 * See {@link Ext.EventObject} for more details on normalized event objects.
 * @singleton
 */
Ext.EventManager = {

    // --------------------- onReady ---------------------

    /**
     * Check if we have bound our global onReady listener
     * @private
     */
    hasBoundOnReady: false,

    /**
     * Check if fireDocReady has been called
     * @private
     */
    hasFiredReady: false,

    /**
     * Timer for the document ready event in old IE versions
     * @private
     */
    readyTimeout: null,

    /**
     * Checks if we have bound an onreadystatechange event
     * @private
     */
    hasOnReadyStateChange: false,

    /**
     * Holds references to any onReady functions
     * @private
     */
    readyEvent: new Ext.util.Event(),

    /**
     * Check the ready state for old IE versions
     * @private
     * @return {Boolean} True if the document is ready
     */
    checkReadyState: function(){
        var me = Ext.EventManager;

        if(window.attachEvent){
            // See here for reference: http://javascript.nwbox.com/IEContentLoaded/
            if (window != top) {
                return false;
            }
            try{
                document.documentElement.doScroll('left');
            }catch(e){
                return false;
            }
            me.fireDocReady();
            return true;
        }
        if (document.readyState == 'complete') {
            me.fireDocReady();
            return true;
        }
        me.readyTimeout = setTimeout(arguments.callee, 2);
        return false;
    },

    /**
     * Binds the appropriate browser event for checking if the DOM has loaded.
     * @private
     */
    bindReadyEvent: function(){
        var me = Ext.EventManager;
        if (me.hasBoundOnReady) {
            return;
        }

        if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', me.fireDocReady, false);
            // fallback, load will ~always~ fire
            window.addEventListener('load', me.fireDocReady, false);
        } else {
            // Important: commented out since this hack causes issues with our new framing
            // There's no need to apply hacks anyway, the native window onload event on IEs works
            // just fine for us since we don't care about initial DOM

            // check if the document is ready, this will also kick off the scroll checking timer
            //if (!me.checkReadyState()) {
            //    document.attachEvent('onreadystatechange', me.checkReadyState);
            //    me.hasOnReadyStateChange = true;
            //}
            // fallback, onload will ~always~ fire
            window.attachEvent('onload', me.fireDocReady, false);
        }
        me.hasBoundOnReady = true;
    },

    /**
     * We know the document is loaded, so trigger any onReady events.
     * @private
     */
    fireDocReady: function(){
        var me = Ext.EventManager;

        // only unbind these events once
        if (!me.hasFiredReady) {
            me.hasFiredReady = true;

            if (document.addEventListener) {
                document.removeEventListener('DOMContentLoaded', me.fireDocReady, false);
                window.removeEventListener('load', me.fireDocReady, false);
            } else {
                if (me.readyTimeout != null) {
                    clearTimeout(me.readyTimeout);
                }
                if (me.hasOnReadyStateChange) {
                    document.detachEvent('onreadystatechange', me.checkReadyState);
                }
                window.detachEvent('onload', me.fireDocReady);
            }
            Ext.supports.init();
        }
        if (!Ext.isReady) {
            Ext.isReady = true;

            me.readyEvent.fire();
        }
    },

    /**
     * Adds a listener to be notified when the document is ready (before onload and before images are loaded). Can be
     * accessed shorthanded as Ext.onReady().
     * @param {Function} fn The method the event invokes.
     * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the handler function executes. Defaults to the browser window.
     * @param {boolean} options (optional) Options object as passed to {@link Ext.core.Element#addListener}.
     */
    onDocumentReady: function(fn, scope, options){
        options = options || {};
        var me = Ext.EventManager,
            readyEvent = me.readyEvent;

        // force single to be true so our event is only ever fired once.
        options.single = true;

        // Document already loaded, let's just fire it
        if (Ext.isReady) {
            readyEvent.addListener(fn, scope, options);
            readyEvent.fire();
        } else {
            options.delay = options.delay || 1;
            readyEvent.addListener(fn, scope, options);
            me.bindReadyEvent();
        }
    },


    // --------------------- event binding ---------------------

    /**
     * Contains a list of all document mouse downs, so we can ensure they fire even when stopEvent is called.
     * @private
     */
    stoppedMouseDownEvent: new Ext.util.Event(),

    /**
     * Options to parse for the 4th argument to addListener.
     * @private
     */
    propRe: /^(?:scope|delay|buffer|single|stopEvent|preventDefault|stopPropagation|normalized|args|delegate)$/,

    /**
     * Get the id of the element. If one has not been assigned, automatically assign it.
     * @param {Mixed} element The element to get the id for.
     * @return {String} id
     */
    getId : function(element) {
        var skip = false,
            id;

        element = Ext.getDom(element);

        if (element === document || element === window) {
            id = element === document ? Ext.documentId : Ext.windowId;
            skip = true;
        } else {
            id = Ext.id(element);
        }

        if (!Ext.cache[id]){
            Ext.core.Element.addToCache(new Ext.core.Element(element), id);
            if(skip){
                Ext.cache[id].skipGarbageCollection = true;
            }
        }
        return id;
    },

    /**
     * Convert a "config style" listener into a set of flat arguments so they can be passed to addListener
     * @private
     * @param {Object} element The element the event is for
     * @param {Object} event The event configuration
     * @param {Object} isRemove True if a removal should be performed, otherwise an add will be done.
     */
    prepareListenerConfig: function(element, config, isRemove){
        var me = this,
            propRe = me.propRe,
            key, value, args;

        // loop over all the keys in the object
        for (key in config) {
            if (!config.hasOwnProperty(key)) {
                continue;
            }
            // if the key is something else then an event option
            if (!propRe.test(key)) {
                value = config[key];
                // if the value is a function it must be something like click: function(){}, scope: this
                // which means that there might be multiple event listeners with shared options
                if (Ext.isFunction(value)) {
                    // shared options
                    args = [element, key, value, config.scope, config];
                } else {
                    // if its not a function, it must be an object like click: {fn: function(){}, scope: this}
                    args = [element, key, value.fn, value.scope, value];
                }

                if (isRemove === true) {
                    me.removeListener.apply(this, args);
                } else {
                    me.addListener.apply(me, args);
                }
            }
        }
    },

    /**
     * Normalize cross browser event differences
     * @private
     * @param {Object} eventName The event name
     * @param {Object} fn The function to execute
     * @return {Object} The new event name/function
     */
    normalizeEvent: function(eventName, fn){
        if (/mouseenter|mouseleave/.test(eventName) && !Ext.supports.MouseEnterLeave) {
            if (fn) {
                fn = Ext.Function.createInterceptor(fn, this.contains, this);
            }
            eventName = eventName == 'mouseenter' ? 'mouseover' : 'mouseout';
        } else if (eventName == 'mousewheel' && !Ext.supports.MouseWheel){
            eventName = 'DOMMouseScroll';
        }
        return {
            eventName: eventName,
            fn: fn
        };
    },

    /**
     * Checks whether the event's relatedTarget is contained inside (or <b>is</b>) the element.
     * @private
     * @param {Object} event
     */
    contains: function(event){
        var parent = event.browserEvent.currentTarget,
            child = this.getRelatedTarget(event);

        if (parent && parent.firstChild) {
            while (child) {
                if (child === parent) {
                    return false;
                }
                child = child.parentNode;
                if (child && (child.nodeType != 1)) {
                    child = null;
                }
            }
        }
        return true;
    },

    /**
    * Appends an event handler to an element.  The shorthand version {@link #on} is equivalent.  Typically you will
    * use {@link Ext.core.Element#addListener} directly on an Element in favor of calling this version.
    * @param {String/HTMLElement} el The html element or id to assign the event handler to.
    * @param {String} eventName The name of the event to listen for.
    * @param {Function} handler The handler function the event invokes. This function is passed
    * the following parameters:<ul>
    * <li>evt : EventObject<div class="sub-desc">The {@link Ext.EventObject EventObject} describing the event.</div></li>
    * <li>t : Element<div class="sub-desc">The {@link Ext.core.Element Element} which was the target of the event.
    * Note that this may be filtered by using the <tt>delegate</tt> option.</div></li>
    * <li>o : Object<div class="sub-desc">The options object from the addListener call.</div></li>
    * </ul>
    * @param {Object} scope (optional) The scope (<b><code>this</code></b> reference) in which the handler function is executed. <b>Defaults to the Element</b>.
    * @param {Object} options (optional) An object containing handler configuration properties.
    * This may contain any of the following properties:<ul>
    * <li>scope : Object<div class="sub-desc">The scope (<b><code>this</code></b> reference) in which the handler function is executed. <b>Defaults to the Element</b>.</div></li>
    * <li>delegate : String<div class="sub-desc">A simple selector to filter the target or look for a descendant of the target</div></li>
    * <li>stopEvent : Boolean<div class="sub-desc">True to stop the event. That is stop propagation, and prevent the default action.</div></li>
    * <li>preventDefault : Boolean<div class="sub-desc">True to prevent the default action</div></li>
    * <li>stopPropagation : Boolean<div class="sub-desc">True to prevent event propagation</div></li>
    * <li>normalized : Boolean<div class="sub-desc">False to pass a browser event to the handler function instead of an Ext.EventObject</div></li>
    * <li>delay : Number<div class="sub-desc">The number of milliseconds to delay the invocation of the handler after te event fires.</div></li>
    * <li>single : Boolean<div class="sub-desc">True to add a handler to handle just the next firing of the event, and then remove itself.</div></li>
    * <li>buffer : Number<div class="sub-desc">Causes the handler to be scheduled to run in an {@link Ext.util.DelayedTask} delayed
    * by the specified number of milliseconds. If the event fires again within that time, the original
    * handler is <em>not</em> invoked, but the new handler is scheduled in its place.</div></li>
    * <li>target : Element<div class="sub-desc">Only call the handler if the event was fired on the target Element, <i>not</i> if the event was bubbled up from a child node.</div></li>
    * </ul><br>
    * <p>See {@link Ext.core.Element#addListener} for examples of how to use these options.</p>
    */
    addListener: function(element, eventName, fn, scope, options){
        // Check if we've been passed a "config style" event.
        if (Ext.isObject(eventName)) {
            this.prepareListenerConfig(element, eventName);
            return;
        }

        var dom = Ext.getDom(element),
            bind,
            wrap;

        // if the element doesnt exist throw an error
        if (!dom){
            throw 'Error listening for "' + eventName + '\". Element "' + element + '" doesn\'t exist.';
        }

        if (!fn) {
            throw 'Error listening for "' + eventName + '". No handler function specified';
        }

        // create the wrapper function
        options = options || {};

        bind = this.normalizeEvent(eventName, fn);
        wrap = this.createListenerWrap(dom, eventName, bind.fn, scope, options);


        if (window.addEventListener) {
            dom.addEventListener(bind.eventName, wrap, options.capture || false);
        } else {
            dom.attachEvent('on' + bind.eventName, wrap);
        }

        if (dom == document && eventName == 'mousedown') {
            this.stoppedMouseDownEvent.addListener(wrap);
        }

        // add all required data into the event cache
        this.getEventListenerCache(dom, eventName).push({
            fn: fn,
            wrap: wrap,
            scope: scope
        });
    },

    /**
    * Removes an event handler from an element.  The shorthand version {@link #un} is equivalent.  Typically
    * you will use {@link Ext.core.Element#removeListener} directly on an Element in favor of calling this version.
    * @param {String/HTMLElement} el The id or html element from which to remove the listener.
    * @param {String} eventName The name of the event.
    * @param {Function} fn The handler function to remove. <b>This must be a reference to the function passed into the {@link #addListener} call.</b>
    * @param {Object} scope If a scope (<b><code>this</code></b> reference) was specified when the listener was added,
    * then this must refer to the same object.
    */
    removeListener : function(element, eventName, fn, scope) {
        // handle our listener config object syntax
        if (Ext.isObject(eventName)) {
            this.prepareListenerConfig(element, eventName, true);
            return;
        }

        var dom = Ext.getDom(element),
            cache = this.getEventListenerCache(dom, eventName),
            bindName = this.normalizeEvent(eventName).eventName,
            i = cache.length, j,
            listener, wrap, tasks;


        while (i--) {
            listener = cache[i];

            if (listener && (!fn || listener.fn == fn) && (!scope || listener.scope === scope)) {
                wrap = listener.wrap;

                // clear buffered calls
                if (wrap.task) {
                    clearTimeout(wrap.task);
                    delete wrap.task;
                }

                // clear delayed calls
                j = wrap.tasks && wrap.tasks.length;
                if (j) {
                    while (j--) {
                        clearTimeout(wrap.tasks[j]);
                    }
                    delete wrap.tasks;
                }

                if (window.removeEventListener) {
                    dom.removeEventListener(bindName, wrap, false);
                } else {
                    dom.detachEvent('on' + bindName, wrap);
                }

                if (wrap && dom == document && eventName == 'mousedown') {
                    this.stoppedMouseDownEvent.removeListener(wrap);
                }

                // remove listener from cache
                cache.splice(i, 1);
            }
        }
    },

    /**
    * Removes all event handers from an element.  Typically you will use {@link Ext.core.Element#removeAllListeners}
    * directly on an Element in favor of calling this version.
    * @param {String/HTMLElement} el The id or html element from which to remove all event handlers.
    */
    removeAll : function(element){
        var dom = Ext.getDom(element),
            cache = this.getElementEventCache(dom),
            ev;

        for (ev in cache) {
            if (!cache.hasOwnProperty(ev)) {
                continue;
            }
            this.removeListener(dom, ev);
        }
        Ext.cache[dom.id].events = {};
    },

    /**
     * Recursively removes all previous added listeners from an element and its children. Typically you will use {@link Ext.core.Element#purgeAllListeners}
     * directly on an Element in favor of calling this version.
     * @param {String/HTMLElement} el The id or html element from which to remove all event handlers.
     * @param {String} eventName (optional) The name of the event.
     */
    purgeElement : function(element, eventName) {
        var dom = Ext.getDom(element),
            i = 0, len;

        if(eventName) {
            this.removeListener(dom, eventName);
        }
        else {
            this.removeAll(dom);
        }

        if(dom && dom.childNodes) {
            for(len = element.childNodes.length; i < len; i++) {
                this.purgeElement(element.childNodes[i], eventName);
            }
        }
    },

    /**
     * Create the wrapper function for the event
     * @private
     * @param {HTMLElement} dom The dom element
     * @param {String} ename The event name
     * @param {Function} fn The function to execute
     * @param {Object} scope The scope to execute callback in
     * @param {Object} o The options
     */
    createListenerWrap : function(dom, ename, fn, scope, options) {
        options = !Ext.isObject(options) ? {} : options;

        var f = ['if(!Ext) {return;}'],
            gen;

        if(options.buffer || options.delay) {
            f.push('e = new Ext.EventObjectImpl(e);');
        } else {
            f.push('e = Ext.EventObject.setEvent(e);');
        }

        if (options.delegate) {
            f.push('var t = e.getTarget("' + options.delegate + '", this);');
            f.push('if(!t) {return;}');
        } else {
            f.push('var t = e.target;');
        }

        if (options.target) {
            f.push('if(e.target !== options.target) {return;}');
        }

        if(options.stopEvent) {
            f.push('e.stopEvent();');
        } else {
            if(options.preventDefault) {
                f.push('e.preventDefault();');
            }
            if(options.stopPropagation) {
                f.push('e.stopPropagation();');
            }
        }

        if(options.normalized === false) {
            f.push('e = e.browserEvent;');
        }

        if(options.buffer) {
            f.push('(wrap.task && clearTimeout(wrap.task));');
            f.push('wrap.task = setTimeout(function(){');
        }

        if(options.delay) {
            f.push('wrap.tasks = wrap.tasks || [];');
            f.push('wrap.tasks.push(setTimeout(function(){');
        }

        // finally call the actual handler fn
        f.push('fn.call(scope || dom, e, t, options);');

        if(options.single) {
            f.push('Ext.EventManager.removeListener(dom, ename, fn, scope);');
        }

        if(options.delay) {
            f.push('}, ' + options.delay + '));');
        }

        if(options.buffer) {
            f.push('}, ' + options.buffer + ');');
        }

        gen = Ext.functionFactory('e', 'options', 'fn', 'scope', 'ename', 'dom', 'wrap', 'args', f.join('\n'));

        return function wrap(e, args) {
            gen.call(dom, e, options, fn, scope, ename, dom, wrap, args);
        };
    },

    /**
     * Get the event cache for a particular element for a particular event
     * @private
     * @param {HTMLElement} element The element
     * @param {Object} eventName The event name
     * @return {Array} The events for the element
     */
    getEventListenerCache : function(element, eventName) {
        var eventCache = this.getElementEventCache(element);
        return eventCache[eventName] || (eventCache[eventName] = []);
    },

    /**
     * Gets the event cache for the object
     * @private
     * @param {HTMLElement} element The element
     * @return {Object} The event cache for the object
     */
    getElementEventCache : function(element) {
        var elementCache = Ext.cache[this.getId(element)];
        return elementCache.events || (elementCache.events = {});
    },

    // --------------------- utility methods ---------------------
    mouseLeaveRe: /(mouseout|mouseleave)/,
    mouseEnterRe: /(mouseover|mouseenter)/,

    /**
     * Stop the event (preventDefault and stopPropagation)
     * @param {Event} The event to stop
     */
    stopEvent: function(event) {
        this.stopPropagation(event);
        this.preventDefault(event);
    },

    /**
     * Cancels bubbling of the event.
     * @param {Event} The event to stop bubbling.
     */
    stopPropagation: function(event) {
        event = event.browserEvent || event;
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    },

    /**
     * Prevents the browsers default handling of the event.
     * @param {Event} The event to prevent the default
     */
    preventDefault: function(event) {
        event = event.browserEvent || event;
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
            // Some keys events require setting the keyCode to -1 to be prevented
            try {
              // all ctrl + X and F1 -> F12
              if (event.ctrlKey || event.keyCode > 111 && event.keyCode < 124) {
                  event.keyCode = -1;
              }
            } catch (e) {
                // see this outdated document http://support.microsoft.com/kb/934364/en-us for more info
            }
        }
    },

    /**
     * Gets the related target from the event.
     * @param {Object} event The event
     * @return {HTMLElement} The related target.
     */
    getRelatedTarget: function(event) {
        event = event.browserEvent || event;
        var target = event.relatedTarget;
        if (!target) {
            if (this.mouseLeaveRe.test(event.type)) {
                target = event.toElement;
            } else if (this.mouseEnterRe.test(event.type)) {
                target = event.fromElement;
            }
        }
        return this.resolveTextNode(target);
    },

    /**
     * Gets the x coordinate from the event
     * @param {Object} event The event
     * @return {Number} The x coordinate
     */
    getPageX: function(event) {
        return this.getXY(event)[0];
    },

    /**
     * Gets the y coordinate from the event
     * @param {Object} event The event
     * @return {Number} The y coordinate
     */
    getPageY: function(event) {
        return this.getXY(event)[1];
    },

    /**
     * Gets the x & ycoordinate from the event
     * @param {Object} event The event
     * @return {Array} The x/y coordinate
     */
    getPageXY: function(event) {
        event = event.browserEvent || event;
        var x = event.pageX,
            y = event.pageY,
            doc = document.documentElement,
            body = document.body;

        // pageX/pageY not available (undefined, not null), use clientX/clientY instead
        if (!x && x !== 0) {
            x = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
            y = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
        }
        return [x, y];
    },

    /**
     * Gets the target of the event.
     * @param {Object} event The event
     * @return {HTMLElement} target
     */
    getTarget: function(event) {
        event = event.browserEvent || event;
        return this.resolveTextNode(event.target || event.srcElement);
    },

    /**
     * Resolve any text nodes accounting for browser differences.
     * @private
     * @param {HTMLElement} node The node
     * @return {HTMLElement} The resolved node
     */
    // technically no need to browser sniff this, however it makes no sense to check this every time, for every event, whether the string is equal.
    resolveTextNode: Ext.isGecko ?
        function(node) {
            if (!node) {
                return;
            }
            // work around firefox bug, https://bugzilla.mozilla.org/show_bug.cgi?id=101197
            var s = HTMLElement.prototype.toString.call(node);
            if (s == '[xpconnect wrapped native prototype]' || s == '[object XULElement]') {
                return;
            }
                return node.nodeType == 3 ? node.parentNode: node;
            }: function(node) {
                return node && node.nodeType == 3 ? node.parentNode: node;
            },

    // --------------------- custom event binding ---------------------

    // Keep track of the current width/height
    curWidth: 0,
    curHeight: 0,

    /**
     * Adds a listener to be notified when the browser window is resized and provides resize event buffering (100 milliseconds),
     * passes new viewport width and height to handlers.
     * @param {Function} fn      The handler function the window resize event invokes.
     * @param {Object}   scope   The scope (<code>this</code> reference) in which the handler function executes. Defaults to the browser window.
     * @param {boolean}  options Options object as passed to {@link Ext.core.Element#addListener}
     */
    onWindowResize: function(fn, scope, options){
        var resize = this.resizeEvent;
        if(!resize){
            this.resizeEvent = resize = new Ext.util.Event();
            this.on(window, 'resize', this.fireResize, this, {buffer: 100});
        }
        resize.addListener(fn, scope, options);
    },

    /**
     * Fire the resize event.
     * @private
     */
    fireResize: function(){
        var me = this,
            w = Ext.core.Element.getViewWidth(),
            h = Ext.core.Element.getViewHeight();

         //whacky problem in IE where the resize event will sometimes fire even though the w/h are the same.
         if(me.curHeight != h || me.curWidth != w){
             me.curHeight = h;
             me.curWidth = w;
             me.resizeEvent.fire(w, h);
         }
    },

    /**
     * Removes the passed window resize listener.
     * @param {Function} fn        The method the event invokes
     * @param {Object}   scope    The scope of handler
     */
    removeResizeListener: function(fn, scope){
        if (this.resizeEvent) {
            this.resizeEvent.removeListener(fn, scope);
        }
    },

    onWindowUnload: function(){
        var unload = this.unloadEvent;
        if(!resize){
            this.unloadEvent = unload = new Ext.util.Event();
            this.on(window, 'unload', this.fireUnload, this);
        }
        unload.addListener(fn, scope, options);
    },

    /**
     * Fires the unload event for items bound with onWindowUnload
     * @private
     */
    fireUnload: function(){
        // wrap in a try catch, could have some problems during unload
        try {
            me.unloadEvent.fire();
        } catch(e) {

        }
    },

    /**
     * Removes the passed window unload listener.
     * @param {Function} fn        The method the event invokes
     * @param {Object}   scope    The scope of handler
     */
    removeUnloadListener: function(){
        if (this.unloadEvent) {
            this.unloadEvent.removeListener(fn, scope);
        }
    },

    /**
     * note 1: IE fires ONLY the keydown event on specialkey autorepeat
     * note 2: Safari < 3.1, Gecko (Mac/Linux) & Opera fire only the keypress event on specialkey autorepeat
     * (research done by @Jan Wolter at http://unixpapa.com/js/key.html)
     * @private
     */
    useKeyDown: Ext.isWebKit ?
                   parseInt(navigator.userAgent.match(/AppleWebKit\/(\d+)/)[1], 10) >= 525 :
                   !((Ext.isGecko && !Ext.isWindows) || Ext.isOpera),

    /**
     * Indicates which event to use for getting key presses.
     * @return {String} The appropriate event name.
     */
    getKeyEvent: function(){
        return this.useKeyDown ? 'keydown' : 'keypress';
    }
};

/**
 * Alias for {@link Ext.Loader#onReady Ext.Loader.onReady} with withDomReady set to true
 * @member Ext
 * @method onReady
 */
Ext.onReady = function(fn, scope, options) {
    Ext.Loader.onReady(fn, scope, true, options);
};

/**
 * Alias for {@link Ext.EventManager#onDocumentReady Ext.EventManager.onDocumentReady}
 * @member Ext
 * @method onDocumentReady
 */
Ext.onDocumentReady = Ext.EventManager.onDocumentReady;

/**
 * Alias for {@link Ext.EventManager#addListener Ext.EventManager.addListener}
 * @member Ext.EventManager
 * @method on
 */
Ext.EventManager.on = Ext.EventManager.addListener;

/**
 * Alias for {@link Ext.EventManager#removeListener Ext.EventManager.removeListener}
 * @member Ext.EventManager
 * @method un
 */
Ext.EventManager.un = Ext.EventManager.removeListener;

(function(){
    var initExtCss = function() {
        // find the body element
        var bd = document.body || document.getElementsByTagName('body')[0],
            baseCSSPrefix = Ext.baseCSSPrefix,
            cls = [],
            htmlCls = [],
            html;

        if (!bd) {
            return false;
        }

        html = bd.parentNode;

        //Let's keep this human readable!
        if (Ext.isIE) {
            cls.push(baseCSSPrefix + 'ie');
        }
        if (Ext.isIE6) {
            cls.push(baseCSSPrefix + 'ie6');
        }
        if (Ext.isIE7) {
            cls.push(baseCSSPrefix + 'ie7');
        }
        if (Ext.isIE8) {
            cls.push(baseCSSPrefix + 'ie8');
        }
        if (Ext.isIE9) {
            cls.push(baseCSSPrefix + 'ie9');
        }
        if (Ext.isGecko) {
            cls.push(baseCSSPrefix + 'gecko');
        }
        if (Ext.isGecko3) {
            cls.push(baseCSSPrefix + 'gecko3');
        }
        if (Ext.isGecko4) {
            cls.push(baseCSSPrefix + 'gecko4');
        }
        if (Ext.isOpera) {
            cls.push(baseCSSPrefix + 'opera');
        }
        if (Ext.isWebKit) {
            cls.push(baseCSSPrefix + 'webkit');
        }
        if (Ext.isSafari) {
            cls.push(baseCSSPrefix + 'safari');
        }
        if (Ext.isSafari2) {
            cls.push(baseCSSPrefix + 'safari2');
        }
        if (Ext.isSafari3) {
            cls.push(baseCSSPrefix + 'safari3');
        }
        if (Ext.isSafari4) {
            cls.push(baseCSSPrefix + 'safari4');
        }
        if (Ext.isChrome) {
            cls.push(baseCSSPrefix + 'chrome');
        }
        if (Ext.isMac) {
            cls.push(baseCSSPrefix + 'mac');
        }
        if (Ext.isLinux) {
            cls.push(baseCSSPrefix + 'linux');
        }
        if (!Ext.supports.CSS3BorderRadius) {
            cls.push(baseCSSPrefix + 'nbr');
        }
        if (!Ext.supports.CSS3LinearGradient) {
            cls.push(baseCSSPrefix + 'nlg');
        }
        if (!Ext.scopeResetCSS) {
            cls.push(baseCSSPrefix + 'reset');
        }

        // add to the parent to allow for selectors x-strict x-border-box, also set the isBorderBox property correctly
        if (html) {
            if (Ext.isStrict && (Ext.isIE6 || Ext.isIE7)) {
                Ext.isBorderBox = false;
            }
            else {
                Ext.isBorderBox = true;
            }
            
            htmlCls.push(baseCSSPrefix + (Ext.isBorderBox ? 'border-box' : 'strict'));
            if (!Ext.isStrict) {
                htmlCls.push(baseCSSPrefix + 'quirks');
                if (Ext.isIE && !Ext.isStrict) {
                    Ext.isIEQuirks = true;
                }
            }
            Ext.fly(html, '_internal').addCls(htmlCls);
        }

        Ext.fly(bd, '_internal').addCls(cls);
        return true;
    };

    if (!initExtCss()) {
        Ext.onReady(initExtCss);
    }
})();

/**
 * @class Ext.EventObject

Just as {@link Ext.core.Element} wraps around a native DOM node, Ext.EventObject
wraps the browser's native event-object normalizing cross-browser differences,
such as which mouse button is clicked, keys pressed, mechanisms to stop
event-propagation along with a method to prevent default actions from taking place.

For example:

    function handleClick(e, t){ // e is not a standard event object, it is a Ext.EventObject
        e.preventDefault();
        var target = e.getTarget(); // same as t (the target HTMLElement)
        ...
    }

    var myDiv = {@link Ext#get Ext.get}("myDiv");  // get reference to an {@link Ext.core.Element}
    myDiv.on(         // 'on' is shorthand for addListener
        "click",      // perform an action on click of myDiv
        handleClick   // reference to the action handler
    );

    // other methods to do the same:
    Ext.EventManager.on("myDiv", 'click', handleClick);
    Ext.EventManager.addListener("myDiv", 'click', handleClick);

 * @singleton
 * @markdown
 */
Ext.define('Ext.EventObjectImpl', {
    uses: ['Ext.util.Point'],

    /** Key constant @type Number */
    BACKSPACE: 8,
    /** Key constant @type Number */
    TAB: 9,
    /** Key constant @type Number */
    NUM_CENTER: 12,
    /** Key constant @type Number */
    ENTER: 13,
    /** Key constant @type Number */
    RETURN: 13,
    /** Key constant @type Number */
    SHIFT: 16,
    /** Key constant @type Number */
    CTRL: 17,
    /** Key constant @type Number */
    ALT: 18,
    /** Key constant @type Number */
    PAUSE: 19,
    /** Key constant @type Number */
    CAPS_LOCK: 20,
    /** Key constant @type Number */
    ESC: 27,
    /** Key constant @type Number */
    SPACE: 32,
    /** Key constant @type Number */
    PAGE_UP: 33,
    /** Key constant @type Number */
    PAGE_DOWN: 34,
    /** Key constant @type Number */
    END: 35,
    /** Key constant @type Number */
    HOME: 36,
    /** Key constant @type Number */
    LEFT: 37,
    /** Key constant @type Number */
    UP: 38,
    /** Key constant @type Number */
    RIGHT: 39,
    /** Key constant @type Number */
    DOWN: 40,
    /** Key constant @type Number */
    PRINT_SCREEN: 44,
    /** Key constant @type Number */
    INSERT: 45,
    /** Key constant @type Number */
    DELETE: 46,
    /** Key constant @type Number */
    ZERO: 48,
    /** Key constant @type Number */
    ONE: 49,
    /** Key constant @type Number */
    TWO: 50,
    /** Key constant @type Number */
    THREE: 51,
    /** Key constant @type Number */
    FOUR: 52,
    /** Key constant @type Number */
    FIVE: 53,
    /** Key constant @type Number */
    SIX: 54,
    /** Key constant @type Number */
    SEVEN: 55,
    /** Key constant @type Number */
    EIGHT: 56,
    /** Key constant @type Number */
    NINE: 57,
    /** Key constant @type Number */
    A: 65,
    /** Key constant @type Number */
    B: 66,
    /** Key constant @type Number */
    C: 67,
    /** Key constant @type Number */
    D: 68,
    /** Key constant @type Number */
    E: 69,
    /** Key constant @type Number */
    F: 70,
    /** Key constant @type Number */
    G: 71,
    /** Key constant @type Number */
    H: 72,
    /** Key constant @type Number */
    I: 73,
    /** Key constant @type Number */
    J: 74,
    /** Key constant @type Number */
    K: 75,
    /** Key constant @type Number */
    L: 76,
    /** Key constant @type Number */
    M: 77,
    /** Key constant @type Number */
    N: 78,
    /** Key constant @type Number */
    O: 79,
    /** Key constant @type Number */
    P: 80,
    /** Key constant @type Number */
    Q: 81,
    /** Key constant @type Number */
    R: 82,
    /** Key constant @type Number */
    S: 83,
    /** Key constant @type Number */
    T: 84,
    /** Key constant @type Number */
    U: 85,
    /** Key constant @type Number */
    V: 86,
    /** Key constant @type Number */
    W: 87,
    /** Key constant @type Number */
    X: 88,
    /** Key constant @type Number */
    Y: 89,
    /** Key constant @type Number */
    Z: 90,
    /** Key constant @type Number */
    CONTEXT_MENU: 93,
    /** Key constant @type Number */
    NUM_ZERO: 96,
    /** Key constant @type Number */
    NUM_ONE: 97,
    /** Key constant @type Number */
    NUM_TWO: 98,
    /** Key constant @type Number */
    NUM_THREE: 99,
    /** Key constant @type Number */
    NUM_FOUR: 100,
    /** Key constant @type Number */
    NUM_FIVE: 101,
    /** Key constant @type Number */
    NUM_SIX: 102,
    /** Key constant @type Number */
    NUM_SEVEN: 103,
    /** Key constant @type Number */
    NUM_EIGHT: 104,
    /** Key constant @type Number */
    NUM_NINE: 105,
    /** Key constant @type Number */
    NUM_MULTIPLY: 106,
    /** Key constant @type Number */
    NUM_PLUS: 107,
    /** Key constant @type Number */
    NUM_MINUS: 109,
    /** Key constant @type Number */
    NUM_PERIOD: 110,
    /** Key constant @type Number */
    NUM_DIVISION: 111,
    /** Key constant @type Number */
    F1: 112,
    /** Key constant @type Number */
    F2: 113,
    /** Key constant @type Number */
    F3: 114,
    /** Key constant @type Number */
    F4: 115,
    /** Key constant @type Number */
    F5: 116,
    /** Key constant @type Number */
    F6: 117,
    /** Key constant @type Number */
    F7: 118,
    /** Key constant @type Number */
    F8: 119,
    /** Key constant @type Number */
    F9: 120,
    /** Key constant @type Number */
    F10: 121,
    /** Key constant @type Number */
    F11: 122,
    /** Key constant @type Number */
    F12: 123,

    /**
     * Simple click regex
     * @private
     */
    clickRe: /(dbl)?click/,
    // safari keypress events for special keys return bad keycodes
    safariKeys: {
        3: 13, // enter
        63234: 37, // left
        63235: 39, // right
        63232: 38, // up
        63233: 40, // down
        63276: 33, // page up
        63277: 34, // page down
        63272: 46, // delete
        63273: 36, // home
        63275: 35 // end
    },
    // normalize button clicks, don't see any way to feature detect this.
    btnMap: Ext.isIE ? {
        1: 0,
        4: 1,
        2: 2
    } : {
        0: 0,
        1: 1,
        2: 2
    },

    constructor: function(event){
        if (event) {
            this.setEvent(event.browserEvent || event);
        }
    },

    setEvent: function(event){
        var me = this, button, options;

        if (event == me || (event && event.browserEvent)) { // already wrapped
            return event;
        }
        me.browserEvent = event;
        if (event) {
            // normalize buttons
            button = event.button ? me.btnMap[event.button] : (event.which ? event.which - 1 : -1);
            if (me.clickRe.test(event.type) && button == -1) {
                button = 0;
            }
            options = {
                type: event.type,
                button: button,
                shiftKey: event.shiftKey,
                // mac metaKey behaves like ctrlKey
                ctrlKey: event.ctrlKey || event.metaKey || false,
                altKey: event.altKey,
                // in getKey these will be normalized for the mac
                keyCode: event.keyCode,
                charCode: event.charCode,
                // cache the targets for the delayed and or buffered events
                target: Ext.EventManager.getTarget(event),
                relatedTarget: Ext.EventManager.getRelatedTarget(event),
                currentTarget: event.currentTarget,
                // same for XY
                xy: Ext.EventManager.getPageXY(event)
            };
        } else {
            options = {
                button: -1,
                shiftKey: false,
                ctrlKey: false,
                altKey: false,
                keyCode: 0,
                charCode: 0,
                target: null,
                xy: [0, 0]
            };
        }
        Ext.apply(me, options);
        return me;
    },

    /**
     * Stop the event (preventDefault and stopPropagation)
     */
    stopEvent: function(){
        this.stopPropagation();
        this.preventDefault();
    },

    /**
     * Prevents the browsers default handling of the event.
     */
    preventDefault: function(){
        if (this.browserEvent) {
            Ext.EventManager.preventDefault(this.browserEvent);
        }
    },

    /**
     * Cancels bubbling of the event.
     */
    stopPropagation: function(){
        var browserEvent = this.browserEvent;

        if (browserEvent) {
            if (browserEvent.type == 'mousedown') {
                Ext.EventManager.stoppedMouseDownEvent.fire(this);
            }
            Ext.EventManager.stopPropagation(browserEvent);
        }
    },

    /**
     * Gets the character code for the event.
     * @return {Number}
     */
    getCharCode: function(){
        return this.charCode || this.keyCode;
    },

    /**
     * Returns a normalized keyCode for the event.
     * @return {Number} The key code
     */
    getKey: function(){
        return this.normalizeKey(this.keyCode || this.charCode);
    },

    /**
     * Normalize key codes across browsers
     * @private
     * @param {Number} key The key code
     * @return {Number} The normalized code
     */
    normalizeKey: function(key){
        // can't feature detect this
        return Ext.isWebKit ? (this.safariKeys[key] || key) : key;
    },

    /**
     * Gets the x coordinate of the event.
     * @return {Number}
     */
    getPageX: function(){
        return this.xy[0];
    },

    /**
     * Gets the y coordinate of the event.
     * @return {Number}
     */
    getPageY: function(){
        return this.xy[1];
    },

    /**
     * Gets the page coordinates of the event.
     * @return {Array} The xy values like [x, y]
     */
    getXY: function(){
        return this.xy;
    },

    /**
     * Gets the target for the event.
     * @param {String} selector (optional) A simple selector to filter the target or look for an ancestor of the target
     * @param {Number/Mixed} maxDepth (optional) The max depth to search as a number or element (defaults to 10 || document.body)
     * @param {Boolean} returnEl (optional) True to return a Ext.core.Element object instead of DOM node
     * @return {HTMLelement}
     */
    getTarget : function(selector, maxDepth, returnEl){
        if (selector) {
            return Ext.fly(this.target).findParent(selector, maxDepth, returnEl);
        }
        return returnEl ? Ext.get(this.target) : this.target;
    },

    /**
     * Gets the related target.
     * @param {String} selector (optional) A simple selector to filter the target or look for an ancestor of the target
     * @param {Number/Mixed} maxDepth (optional) The max depth to search as a number or element (defaults to 10 || document.body)
     * @param {Boolean} returnEl (optional) True to return a Ext.core.Element object instead of DOM node
     * @return {HTMLElement}
     */
    getRelatedTarget : function(selector, maxDepth, returnEl){
        if (selector) {
            return Ext.fly(this.relatedTarget).findParent(selector, maxDepth, returnEl);
        }
        return returnEl ? Ext.get(this.relatedTarget) : this.relatedTarget;
    },

    /**
     * Normalizes mouse wheel delta across browsers
     * @return {Number} The delta
     */
    getWheelDelta : function(){
        var event = this.browserEvent,
            delta = 0;

        if (event.wheelDelta) { /* IE/Opera. */
            delta = event.wheelDelta / 120;
        } else if (event.detail){ /* Mozilla case. */
            delta = -event.detail / 3;
        }
        return delta;
    },

    /**
    * Returns true if the target of this event is a child of el.  Unless the allowEl parameter is set, it will return false if if the target is el.
    * Example usage:<pre><code>
// Handle click on any child of an element
Ext.getBody().on('click', function(e){
    if(e.within('some-el')){
        alert('Clicked on a child of some-el!');
    }
});

// Handle click directly on an element, ignoring clicks on child nodes
Ext.getBody().on('click', function(e,t){
    if((t.id == 'some-el') && !e.within(t, true)){
        alert('Clicked directly on some-el!');
    }
});
</code></pre>
     * @param {Mixed} el The id, DOM element or Ext.core.Element to check
     * @param {Boolean} related (optional) true to test if the related target is within el instead of the target
     * @param {Boolean} allowEl {optional} true to also check if the passed element is the target or related target
     * @return {Boolean}
     */
    within : function(el, related, allowEl){
        if(el){
            var t = related ? this.getRelatedTarget() : this.getTarget(),
                result;
                
            if (t) {
                result = Ext.fly(el).contains(t);
                if (!result && allowEl) {
                    result = t == Ext.getDom(el);
                }
                return result;
            }
        }
        return false;
    },

    /**
     * Checks if the key pressed was a "navigation" key
     * @return {Boolean} True if the press is a navigation keypress
     */
    isNavKeyPress : function(){
        var me = this,
            k = this.normalizeKey(me.keyCode);

       return (k >= 33 && k <= 40) ||  // Page Up/Down, End, Home, Left, Up, Right, Down
       k == me.RETURN ||
       k == me.TAB ||
       k == me.ESC;
    },

    /**
     * Checks if the key pressed was a "special" key
     * @return {Boolean} True if the press is a special keypress
     */
    isSpecialKey : function(){
        var k = this.normalizeKey(this.keyCode);
        return (this.type == 'keypress' && this.ctrlKey) ||
        this.isNavKeyPress() ||
        (k == this.BACKSPACE) || // Backspace
        (k >= 16 && k <= 20) || // Shift, Ctrl, Alt, Pause, Caps Lock
        (k >= 44 && k <= 46);   // Print Screen, Insert, Delete
    },

    /**
     * Returns a point object that consists of the object coordinates.
     * @return {Ext.util.Point} point
     */
    getPoint : function(){
        return new Ext.util.Point(this.xy[0], this.xy[1]);
    },

   /**
    * Returns true if the control, meta, shift or alt key was pressed during this event.
    * @return {Boolean}
    */
    hasModifier : function(){
        return ((this.ctrlKey || this.altKey) || this.shiftKey);
    }
}, function() {

Ext.EventObject = new Ext.EventObjectImpl();

});


(function(){
    var doc = document,
        isCSS1 = doc.compatMode == "CSS1Compat",
        ELEMENT = Ext.core.Element,
        fly = function(el){
            if (!_fly) {
                _fly = new Ext.core.Element.Flyweight();
            }
            _fly.dom = el;
            return _fly;
        }, _fly;

    Ext.apply(ELEMENT, {
        isAncestor : function(p, c) {
            var ret = false;

            p = Ext.getDom(p);
            c = Ext.getDom(c);
            if (p && c) {
                if (p.contains) {
                    return p.contains(c);
                } else if (p.compareDocumentPosition) {
                    return !!(p.compareDocumentPosition(c) & 16);
                } else {
                    while ((c = c.parentNode)) {
                        ret = c == p || ret;
                    }
                }
            }
            return ret;
        },

        getViewWidth : function(full) {
            return full ? ELEMENT.getDocumentWidth() : ELEMENT.getViewportWidth();
        },

        getViewHeight : function(full) {
            return full ? ELEMENT.getDocumentHeight() : ELEMENT.getViewportHeight();
        },

        getDocumentHeight: function() {
            return Math.max(!isCSS1 ? doc.body.scrollHeight : doc.documentElement.scrollHeight, ELEMENT.getViewportHeight());
        },

        getDocumentWidth: function() {
            return Math.max(!isCSS1 ? doc.body.scrollWidth : doc.documentElement.scrollWidth, ELEMENT.getViewportWidth());
        },

        getViewportHeight: function(){
            return Ext.isIE ?
                   (Ext.isStrict ? doc.documentElement.clientHeight : doc.body.clientHeight) :
                   self.innerHeight;
        },

        getViewportWidth : function() {
            return (!Ext.isStrict && !Ext.isOpera) ? doc.body.clientWidth :
                   Ext.isIE ? doc.documentElement.clientWidth : self.innerWidth;
        },

        getY : function(el) {
            return ELEMENT.getXY(el)[1];
        },

        getX : function(el) {
            return ELEMENT.getXY(el)[0];
        },

        getXY : function(el) {
            var p,
                pe,
                b,
                bt,
                bl,
                dbd,
                x = 0,
                y = 0,
                scroll,
                hasAbsolute,
                bd = (doc.body || doc.documentElement),
                ret = [0,0];

            el = Ext.getDom(el);

            if(el != bd){
                hasAbsolute = fly(el).isStyle("position", "absolute");

                if (el.getBoundingClientRect) {
                    b = el.getBoundingClientRect();
                    scroll = fly(document).getScroll();
                    ret = [Math.round(b.left + scroll.left), Math.round(b.top + scroll.top)];
                } else {
                    p = el;

                    while (p) {
                        pe = fly(p);
                        x += p.offsetLeft;
                        y += p.offsetTop;

                        hasAbsolute = hasAbsolute || pe.isStyle("position", "absolute");

                        if (Ext.isGecko) {
                            y += bt = parseInt(pe.getStyle("borderTopWidth"), 10) || 0;
                            x += bl = parseInt(pe.getStyle("borderLeftWidth"), 10) || 0;

                            if (p != el && !pe.isStyle('overflow','visible')) {
                                x += bl;
                                y += bt;
                            }
                        }
                        p = p.offsetParent;
                    }

                    if (Ext.isSafari && hasAbsolute) {
                        x -= bd.offsetLeft;
                        y -= bd.offsetTop;
                    }

                    if (Ext.isGecko && !hasAbsolute) {
                        dbd = fly(bd);
                        x += parseInt(dbd.getStyle("borderLeftWidth"), 10) || 0;
                        y += parseInt(dbd.getStyle("borderTopWidth"), 10) || 0;
                    }

                    p = el.parentNode;
                    while (p && p != bd) {
                        if (!Ext.isOpera || (p.tagName != 'TR' && !fly(p).isStyle("display", "inline"))) {
                            x -= p.scrollLeft;
                            y -= p.scrollTop;
                        }
                        p = p.parentNode;
                    }
                    ret = [x,y];
                }
            }
            return ret;
        },

        setXY : function(el, xy) {
            (el = Ext.fly(el, '_setXY')).position();

            var pts = el.translatePoints(xy),
                style = el.dom.style,
                pos;

            for (pos in pts) {
                if (!isNaN(pts[pos])) {
                    style[pos] = pts[pos] + "px";
                }
            }
        },

        setX : function(el, x) {
            ELEMENT.setXY(el, [x, false]);
        },

        setY : function(el, y) {
            ELEMENT.setXY(el, [false, y]);
        },

        /**
         * Serializes a DOM form into a url encoded string
         * @param {Object} form The form
         * @return {String} The url encoded form
         */
        serializeForm: function(form) {
            var fElements = form.elements || (document.forms[form] || Ext.getDom(form)).elements,
                hasSubmit = false,
                encoder = encodeURIComponent,
                name,
                data = '',
                type,
                hasValue;

            Ext.each(fElements, function(element){
                name = element.name;
                type = element.type;

                if (!element.disabled && name) {
                    if (/select-(one|multiple)/i.test(type)) {
                        Ext.each(element.options, function(opt){
                            if (opt.selected) {
                                hasValue = opt.hasAttribute ? opt.hasAttribute('value') : opt.getAttributeNode('value').specified;
                                data += String.format("{0}={1}&", encoder(name), encoder(hasValue ? opt.value : opt.text));
                            }
                        });
                    } else if (!(/file|undefined|reset|button/i.test(type))) {
                        if (!(/radio|checkbox/i.test(type) && !element.checked) && !(type == 'submit' && hasSubmit)) {
                            data += encoder(name) + '=' + encoder(element.value) + '&';
                            hasSubmit = /submit/i.test(type);
                        }
                    }
                }
            });
            return data.substr(0, data.length - 1);
        }
    });
})();

/**
 * @class Ext.core.Element
 */

Ext.core.Element.addMethods({

    /**
     * Monitors this Element for the mouse leaving. Calls the function after the specified delay only if
     * the mouse was not moved back into the Element within the delay. If the mouse <i>was</i> moved
     * back in, the function is not called.
     * @param {Number} delay The delay <b>in milliseconds</b> to wait for possible mouse re-entry before calling the handler function.
     * @param {Function} handler The function to call if the mouse remains outside of this Element for the specified time.
     * @param {Object} scope The scope (<code>this</code> reference) in which the handler function executes. Defaults to this Element.
     * @return {Object} The listeners object which was added to this element so that monitoring can be stopped. Example usage:</pre><code>
// Hide the menu if the mouse moves out for 250ms or more
this.mouseLeaveMonitor = this.menuEl.monitorMouseLeave(250, this.hideMenu, this);

...
// Remove mouseleave monitor on menu destroy
this.menuEl.un(this.mouseLeaveMonitor);
</code></pre>
     */
    monitorMouseLeave: function(delay, handler, scope) {
        var me = this,
            timer,
            listeners = {
                mouseleave: function(e) {
                    timer = setTimeout(Ext.Function.bind(handler, scope||me, [new Ext.EventObjectImpl(e)]), delay);
                },
                mouseenter: function() {
                    clearTimeout(timer);
                }
            };

        me.on(listeners);
        return listeners;
    },

    /**
     * Stops the specified event(s) from bubbling and optionally prevents the default action
     * @param {String/Array} eventName an event / array of events to stop from bubbling
     * @param {Boolean} preventDefault (optional) true to prevent the default action too
     * @return {Ext.core.Element} this
     */
    swallowEvent : function(eventName, preventDefault) {
        var me = this;
        function fn(e) {
            e.stopPropagation();
            if (preventDefault) {
                e.preventDefault();
            }
        }
        
        if (Ext.isArray(eventName)) {
            Ext.each(eventName, function(e) {
                 me.on(e, fn);
            });
            return me;
        }
        me.on(eventName, fn);
        return me;
    },

    /**
     * Create an event handler on this element such that when the event fires and is handled by this element,
     * it will be relayed to another object (i.e., fired again as if it originated from that object instead).
     * @param {String} eventName The type of event to relay
     * @param {Object} object Any object that extends {@link Ext.util.Observable} that will provide the context
     * for firing the relayed event
     */
    relayEvent : function(eventName, observable) {
        this.on(eventName, function(e) {
            observable.fireEvent(eventName, e);
        });
    },

    /**
     * Removes Empty, or whitespace filled text nodes. Combines adjacent text nodes.
     * @param {Boolean} forceReclean (optional) By default the element
     * keeps track if it has been cleaned already so
     * you can call this over and over. However, if you update the element and
     * need to force a reclean, you can pass true.
     */
    clean : function(forceReclean) {
        var me  = this,
            dom = me.dom,
            n   = dom.firstChild,
            nx,
            ni  = -1;

        if (Ext.core.Element.data(dom, 'isCleaned') && forceReclean !== true) {
            return me;
        }

        while (n) {
            nx = n.nextSibling;
            if (n.nodeType == 3) {
                // Remove empty/whitespace text nodes
                if (!(/\S/.test(n.nodeValue))) {
                    dom.removeChild(n);
                // Combine adjacent text nodes
                } else if (nx && nx.nodeType == 3) {
                    n.appendData(Ext.String.trim(nx.data));
                    dom.removeChild(nx);
                    nx = n.nextSibling;
                    n.nodeIndex = ++ni;
                }
            } else {
                // Recursively clean
                Ext.fly(n).clean();
                n.nodeIndex = ++ni;
            }
            n = nx;
        }

        Ext.core.Element.data(dom, 'isCleaned', true);
        return me;
    },

    /**
     * Direct access to the Updater {@link Ext.Updater#update} method. The method takes the same object
     * parameter as {@link Ext.Updater#update}
     * @return {Ext.core.Element} this
     */
    load : function() {
        var updateManager = this.getUpdater();
        updateManager.update.apply(updateManager, arguments);
        
        return this;
    },

    /**
    * Gets this element's {@link Ext.Updater Updater}
    * @return {Ext.Updater} The Updater
    */
    getUpdater : function() {
        return this.updateManager || (this.updateManager = new Ext.Updater(this));
    },

    /**
    * Update the innerHTML of this element, optionally searching for and processing scripts
    * @param {String} html The new HTML
    * @param {Boolean} loadScripts (optional) True to look for and process scripts (defaults to false)
    * @param {Function} callback (optional) For async script loading you can be notified when the update completes
    * @return {Ext.core.Element} this
     */
    update : function(html, loadScripts, callback) {
        var me = this,
            id,
            dom,
            interval;
            
        if (!me.dom) {
            return me;
        }
        html = html || '';
        dom = me.dom;

        if (loadScripts !== true) {
            dom.innerHTML = html;
            Ext.callback(callback, me);
            return me;
        }

        id  = Ext.id();
        html += '<span id="' + id + '"></span>';

        interval = setInterval(function(){
            if (!document.getElementById(id)) {
                return false;    
            }
            clearInterval(interval);
            var DOC    = document,
                hd     = DOC.getElementsByTagName("head")[0],
                re     = /(?:<script([^>]*)?>)((\n|\r|.)*?)(?:<\/script>)/ig,
                srcRe  = /\ssrc=([\'\"])(.*?)\1/i,
                typeRe = /\stype=([\'\"])(.*?)\1/i,
                match,
                attrs,
                srcMatch,
                typeMatch,
                el,
                s;

            while ((match = re.exec(html))) {
                attrs = match[1];
                srcMatch = attrs ? attrs.match(srcRe) : false;
                if (srcMatch && srcMatch[2]) {
                   s = DOC.createElement("script");
                   s.src = srcMatch[2];
                   typeMatch = attrs.match(typeRe);
                   if (typeMatch && typeMatch[2]) {
                       s.type = typeMatch[2];
                   }
                   hd.appendChild(s);
                } else if (match[2] && match[2].length > 0) {
                    if (window.execScript) {
                       window.execScript(match[2]);
                    } else {
                       window.eval(match[2]);
                    }
                }
            }
            
            el = DOC.getElementById(id);
            if (el) {
                Ext.removeNode(el);
            }
            Ext.callback(callback, me);
        }, 20);
        dom.innerHTML = html.replace(/(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)/ig, '');
        return me;
    },

    // inherit docs, overridden so we can add removeAnchor
    removeAllListeners : function() {
        this.removeAnchor();
        Ext.EventManager.removeAll(this.dom);
        return this;
    },

    /**
     * Creates a proxy element of this element
     * @param {String/Object} config The class name of the proxy element or a DomHelper config object
     * @param {String/HTMLElement} renderTo (optional) The element or element id to render the proxy to (defaults to document.body)
     * @param {Boolean} matchBox (optional) True to align and size the proxy to this element now (defaults to false)
     * @return {Ext.core.Element} The new proxy element
     */
    createProxy : function(config, renderTo, matchBox) {
        config = (typeof config == 'object') ? config : {tag : "div", cls: config};

        var me = this,
            proxy = renderTo ? Ext.core.DomHelper.append(renderTo, config, true) :
                               Ext.core.DomHelper.insertBefore(me.dom, config, true);

        proxy.setVisibilityMode(Ext.core.Element.DISPLAY);
        proxy.hide();
        if (matchBox && me.setBox && me.getBox) { // check to make sure Element.position.js is loaded
           proxy.setBox(me.getBox());
        }
        return proxy;
    }
});

Ext.core.Element.prototype.getUpdateManager = Ext.core.Element.prototype.getUpdater;
Ext.core.Element.prototype.clearListeners = Ext.core.Element.prototype.removeAllListeners;

/**
 * @class Ext.core.Element
 */
Ext.core.Element.addMethods({
    /**
     * Gets the x,y coordinates specified by the anchor position on the element.
     * @param {String} anchor (optional) The specified anchor position (defaults to "c").  See {@link #alignTo}
     * for details on supported anchor positions.
     * @param {Boolean} local (optional) True to get the local (element top/left-relative) anchor position instead
     * of page coordinates
     * @param {Object} size (optional) An object containing the size to use for calculating anchor position
     * {width: (target width), height: (target height)} (defaults to the element's current size)
     * @return {Array} [x, y] An array containing the element's x and y coordinates
     */
    getAnchorXY : function(anchor, local, s){
        //Passing a different size is useful for pre-calculating anchors,
        //especially for anchored animations that change the el size.
        anchor = (anchor || "tl").toLowerCase();
        s = s || {};

        var me = this,
            vp = me.dom == document.body || me.dom == document,
            w = s.width || vp ? Ext.core.Element.getViewWidth() : me.getWidth(),
            h = s.height || vp ? Ext.core.Element.getViewHeight() : me.getHeight(),
            xy,
            r = Math.round,
            o = me.getXY(),
            scroll = me.getScroll(),
            extraX = vp ? scroll.left : !local ? o[0] : 0,
            extraY = vp ? scroll.top : !local ? o[1] : 0,
            hash = {
                c  : [r(w * 0.5), r(h * 0.5)],
                t  : [r(w * 0.5), 0],
                l  : [0, r(h * 0.5)],
                r  : [w, r(h * 0.5)],
                b  : [r(w * 0.5), h],
                tl : [0, 0],
                bl : [0, h],
                br : [w, h],
                tr : [w, 0]
            };

        xy = hash[anchor];
        return [xy[0] + extraX, xy[1] + extraY];
    },

    /**
     * Anchors an element to another element and realigns it when the window is resized.
     * @param {Mixed} element The element to align to.
     * @param {String} position The position to align to.
     * @param {Array} offsets (optional) Offset the positioning by [x, y]
     * @param {Boolean/Object} animate (optional) True for the default animation or a standard Element animation config object
     * @param {Boolean/Number} monitorScroll (optional) True to monitor body scroll and reposition. If this parameter
     * is a number, it is used as the buffer delay (defaults to 50ms).
     * @param {Function} callback The function to call after the animation finishes
     * @return {Ext.core.Element} this
     */
    anchorTo : function(el, alignment, offsets, animate, monitorScroll, callback){
        var me = this,
            dom = me.dom,
            scroll = !Ext.isEmpty(monitorScroll),
            action = function(){
                Ext.fly(dom).alignTo(el, alignment, offsets, animate);
                Ext.callback(callback, Ext.fly(dom));
            },
            anchor = this.getAnchor();

        // previous listener anchor, remove it
        this.removeAnchor();
        Ext.apply(anchor, {
            fn: action,
            scroll: scroll
        });

        Ext.EventManager.onWindowResize(action, null);

        if(scroll){
            Ext.EventManager.on(window, 'scroll', action, null,
                {buffer: !isNaN(monitorScroll) ? monitorScroll : 50});
        }
        action.call(me); // align immediately
        return me;
    },

    /**
     * Remove any anchor to this element. See {@link #anchorTo}.
     * @return {Ext.core.Element} this
     */
    removeAnchor : function(){
        var me = this,
            anchor = this.getAnchor();

        if(anchor && anchor.fn){
            Ext.EventManager.removeResizeListener(anchor.fn);
            if(anchor.scroll){
                Ext.EventManager.un(window, 'scroll', anchor.fn);
            }
            delete anchor.fn;
        }
        return me;
    },

    // private
    getAnchor : function(){
        var data = Ext.core.Element.data,
            dom = this.dom;
            if (!dom) {
                return;
            }
            var anchor = data(dom, '_anchor');

        if(!anchor){
            anchor = data(dom, '_anchor', {});
        }
        return anchor;
    },

    getAlignVector: function(el, spec, offset) {
        var me = this,
            side = {t:"top", l:"left", r:"right", b: "bottom"},
            thisRegion = me.getRegion(),
            elRegion;

        el = Ext.get(el);
        if(!el || !el.dom){
            throw "Element.alignToXY with an element that doesn't exist";
        }

        elRegion = el.getRegion();
    },

    /**
     * Gets the x,y coordinates to align this element with another element. See {@link #alignTo} for more info on the
     * supported position values.
     * @param {Mixed} element The element to align to.
     * @param {String} position (optional, defaults to "tl-bl?") The position to align to.
     * @param {Array} offsets (optional) Offset the positioning by [x, y]
     * @return {Array} [x, y]
     */
    getAlignToXY : function(el, p, o){
        el = Ext.get(el);

        if(!el || !el.dom){
            throw "Element.alignToXY with an element that doesn't exist";
        }

        o = o || [0,0];
        p = (!p || p == "?" ? "tl-bl?" : (!(/-/).test(p) && p !== "" ? "tl-" + p : p || "tl-bl")).toLowerCase();

        var me = this,
            d = me.dom,
            a1,
            a2,
            x,
            y,
            //constrain the aligned el to viewport if necessary
            w,
            h,
            r,
            dw = Ext.core.Element.getViewWidth() -10, // 10px of margin for ie
            dh = Ext.core.Element.getViewHeight()-10, // 10px of margin for ie
            p1y,
            p1x,
            p2y,
            p2x,
            swapY,
            swapX,
            doc = document,
            docElement = doc.documentElement,
            docBody = doc.body,
            scrollX = (docElement.scrollLeft || docBody.scrollLeft || 0)+5,
            scrollY = (docElement.scrollTop || docBody.scrollTop || 0)+5,
            c = false, //constrain to viewport
            p1 = "",
            p2 = "",
            m = p.match(/^([a-z]+)-([a-z]+)(\?)?$/);

        if(!m){
           throw "Element.alignTo with an invalid alignment " + p;
        }

        p1 = m[1];
        p2 = m[2];
        c = !!m[3];

        //Subtract the aligned el's internal xy from the target's offset xy
        //plus custom offset to get the aligned el's new offset xy
        a1 = me.getAnchorXY(p1, true);
        a2 = el.getAnchorXY(p2, false);

        x = a2[0] - a1[0] + o[0];
        y = a2[1] - a1[1] + o[1];

        if(c){
           w = me.getWidth();
           h = me.getHeight();
           r = el.getRegion();
           //If we are at a viewport boundary and the aligned el is anchored on a target border that is
           //perpendicular to the vp border, allow the aligned el to slide on that border,
           //otherwise swap the aligned el to the opposite border of the target.
           p1y = p1.charAt(0);
           p1x = p1.charAt(p1.length-1);
           p2y = p2.charAt(0);
           p2x = p2.charAt(p2.length-1);
           swapY = ((p1y=="t" && p2y=="b") || (p1y=="b" && p2y=="t"));
           swapX = ((p1x=="r" && p2x=="l") || (p1x=="l" && p2x=="r"));


           if (x + w > dw + scrollX) {
                x = swapX ? r.left-w : dw+scrollX-w;
           }
           if (x < scrollX) {
               x = swapX ? r.right : scrollX;
           }
           if (y + h > dh + scrollY) {
                y = swapY ? r.top-h : dh+scrollY-h;
            }
           if (y < scrollY){
               y = swapY ? r.bottom : scrollY;
           }
        }
        return [x,y];
    },

    /**
     * Aligns this element with another element relative to the specified anchor points. If the other element is the
     * document it aligns it to the viewport.
     * The position parameter is optional, and can be specified in any one of the following formats:
     * <ul>
     *   <li><b>Blank</b>: Defaults to aligning the element's top-left corner to the target's bottom-left corner ("tl-bl").</li>
     *   <li><b>One anchor (deprecated)</b>: The passed anchor position is used as the target element's anchor point.
     *       The element being aligned will position its top-left corner (tl) to that point.  <i>This method has been
     *       deprecated in favor of the newer two anchor syntax below</i>.</li>
     *   <li><b>Two anchors</b>: If two values from the table below are passed separated by a dash, the first value is used as the
     *       element's anchor point, and the second value is used as the target's anchor point.</li>
     * </ul>
     * In addition to the anchor points, the position parameter also supports the "?" character.  If "?" is passed at the end of
     * the position string, the element will attempt to align as specified, but the position will be adjusted to constrain to
     * the viewport if necessary.  Note that the element being aligned might be swapped to align to a different position than
     * that specified in order to enforce the viewport constraints.
     * Following are all of the supported anchor positions:
<pre>
Value  Description
-----  -----------------------------
tl     The top left corner (default)
t      The center of the top edge
tr     The top right corner
l      The center of the left edge
c      In the center of the element
r      The center of the right edge
bl     The bottom left corner
b      The center of the bottom edge
br     The bottom right corner
</pre>
Example Usage:
<pre><code>
// align el to other-el using the default positioning ("tl-bl", non-constrained)
el.alignTo("other-el");

// align the top left corner of el with the top right corner of other-el (constrained to viewport)
el.alignTo("other-el", "tr?");

// align the bottom right corner of el with the center left edge of other-el
el.alignTo("other-el", "br-l?");

// align the center of el with the bottom left corner of other-el and
// adjust the x position by -6 pixels (and the y position by 0)
el.alignTo("other-el", "c-bl", [-6, 0]);
</code></pre>
     * @param {Mixed} element The element to align to.
     * @param {String} position (optional, defaults to "tl-bl?") The position to align to.
     * @param {Array} offsets (optional) Offset the positioning by [x, y]
     * @param {Boolean/Object} animate (optional) true for the default animation or a standard Element animation config object
     * @return {Ext.core.Element} this
     */
    alignTo : function(element, position, offsets, animate){
        var me = this;
        return me.setXY(me.getAlignToXY(element, position, offsets),
                        me.anim && !!animate ? me.anim(animate) : false);
    },

    // private ==>  used outside of core
    adjustForConstraints : function(xy, parent) {
        var vector = this.getConstrainVector(parent, xy);
        if (vector) {
            xy[0] += vector[0];
            xy[1] += vector[1];
        }
        return xy;
    },

    /**
     * <p>Returns the <code>[X, Y]</code> vector by which this element must be translated to make a best attempt
     * to constrain within the passed constraint. Returns <code>false</code> is this element does not need to be moved.</p>
     * <p>Priority is given to constraining the top and left within the constraint.</p>
     * <p>The constraint may either be an existing element into which this element is to be constrained, or
     * an {@link Ext.util.Region Region} into which this element is to be constrained.</p>
     * @param constrainTo {Mixed} The Element or {@link Ext.util.Region Region} into which this element is to be constrained.
     * @param proposedPosition {Array} A proposed <code>[X, Y]</code> position to test for validity and to produce a vector for instead
     * of using this Element's current position;
     * @returns {Array} <b>If</b> this element <i>needs</i> to be translated, an <code>[X, Y]</code>
     * vector by which this element must be translated. Otherwise, <code>false</code>.
     */
    getConstrainVector: function(constrainTo, proposedPosition) {
        if (!(constrainTo instanceof Ext.util.Region)) {
            constrainTo = Ext.get(constrainTo).getViewRegion();
        }
        var thisRegion = this.getRegion(),
            vector = [0, 0],
            shadowSize = this.shadow && this.shadow.offset,
            overflowed = false;

        // Shift this region to occupy the proposed position
        if (proposedPosition) {
            thisRegion.translateBy(proposedPosition[0] - thisRegion.x, proposedPosition[1] - thisRegion.y);
        }

        // Reduce the constrain region to allow for shadow
        // TODO: Rewrite the Shadow class. When that's done, get the extra for each side from the Shadow.
        if (shadowSize) {
            constrainTo.adjust(0, -shadowSize, -shadowSize, shadowSize);
        }

        // Constrain the X coordinate by however much this Element overflows
        if (thisRegion.right > constrainTo.right) {
            overflowed = true;
            vector[0] = (constrainTo.right - thisRegion.right);    // overflowed the right
        }
        if (thisRegion.left + vector[0] < constrainTo.left) {
            overflowed = true;
            vector[0] = (constrainTo.left - thisRegion.left);      // overflowed the left
        }

        // Constrain the Y coordinate by however much this Element overflows
        if (thisRegion.bottom > constrainTo.bottom) {
            overflowed = true;
            vector[1] = (constrainTo.bottom - thisRegion.bottom);  // overflowed the bottom
        }
        if (thisRegion.top + vector[1] < constrainTo.top) {
            overflowed = true;
            vector[1] = (constrainTo.top - thisRegion.top);        // overflowed the top
        }
        return overflowed ? vector : false;
    },

    /**
    * Calculates the x, y to center this element on the screen
    * @return {Array} The x, y values [x, y]
    */
    getCenterXY : function(){
        return this.getAlignToXY(document, 'c-c');
    },

    /**
    * Centers the Element in either the viewport, or another Element.
    * @param {Mixed} centerIn (optional) The element in which to center the element.
    */
    center : function(centerIn){
        return this.alignTo(centerIn || document, 'c-c');
    }
});

/**
 * @class Ext.core.Element
 */
(function(){

var ELEMENT = Ext.core.Element,
    LEFT = "left",
    RIGHT = "right",
    TOP = "top",
    BOTTOM = "bottom",
    POSITION = "position",
    STATIC = "static",
    RELATIVE = "relative",
    AUTO = "auto",
    ZINDEX = "z-index";

Ext.override(Ext.core.Element, {
    /**
      * Gets the current X position of the element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
      * @return {Number} The X position of the element
      */
    getX : function(){
        return ELEMENT.getX(this.dom);
    },

    /**
      * Gets the current Y position of the element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
      * @return {Number} The Y position of the element
      */
    getY : function(){
        return ELEMENT.getY(this.dom);
    },

    /**
      * Gets the current position of the element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
      * @return {Array} The XY position of the element
      */
    getXY : function(){
        return ELEMENT.getXY(this.dom);
    },

    /**
      * Returns the offsets of this element from the passed element. Both element must be part of the DOM tree and not have display:none to have page coordinates.
      * @param {Mixed} element The element to get the offsets from.
      * @return {Array} The XY page offsets (e.g. [100, -200])
      */
    getOffsetsTo : function(el){
        var o = this.getXY(),
            e = Ext.fly(el, '_internal').getXY();
        return [o[0]-e[0],o[1]-e[1]];
    },

    /**
     * Sets the X position of the element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
     * @param {Number} The X position of the element
     * @param {Boolean/Object} animate (optional) True for the default animation, or a standard Element animation config object
     * @return {Ext.core.Element} this
     */
    setX : function(x, animate){
        return this.setXY([x, this.getY()], animate);
    },

    /**
     * Sets the Y position of the element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
     * @param {Number} The Y position of the element
     * @param {Boolean/Object} animate (optional) True for the default animation, or a standard Element animation config object
     * @return {Ext.core.Element} this
     */
    setY : function(y, animate){
        return this.setXY([this.getX(), y], animate);
    },

    /**
     * Sets the element's left position directly using CSS style (instead of {@link #setX}).
     * @param {String} left The left CSS property value
     * @return {Ext.core.Element} this
     */
    setLeft : function(left){
        this.setStyle(LEFT, this.addUnits(left));
        return this;
    },

    /**
     * Sets the element's top position directly using CSS style (instead of {@link #setY}).
     * @param {String} top The top CSS property value
     * @return {Ext.core.Element} this
     */
    setTop : function(top){
        this.setStyle(TOP, this.addUnits(top));
        return this;
    },

    /**
     * Sets the element's CSS right style.
     * @param {String} right The right CSS property value
     * @return {Ext.core.Element} this
     */
    setRight : function(right){
        this.setStyle(RIGHT, this.addUnits(right));
        return this;
    },

    /**
     * Sets the element's CSS bottom style.
     * @param {String} bottom The bottom CSS property value
     * @return {Ext.core.Element} this
     */
    setBottom : function(bottom){
        this.setStyle(BOTTOM, this.addUnits(bottom));
        return this;
    },

    /**
     * Sets the position of the element in page coordinates, regardless of how the element is positioned.
     * The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
     * @param {Array} pos Contains X & Y [x, y] values for new position (coordinates are page-based)
     * @param {Boolean/Object} animate (optional) True for the default animation, or a standard Element animation config object
     * @return {Ext.core.Element} this
     */
    setXY: function(pos, animate) {
        var me = this;
        if (!animate || !me.anim) {
            ELEMENT.setXY(me.dom, pos);
        }
        else {
            if (!Ext.isObject(animate)) {
                animate = {};
            }
            me.animate(Ext.applyIf({ to: { x: pos[0], y: pos[1] } }, animate));
        }
        return me;
    },

    /**
     * Sets the position of the element in page coordinates, regardless of how the element is positioned.
     * The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
     * @param {Number} x X value for new position (coordinates are page-based)
     * @param {Number} y Y value for new position (coordinates are page-based)
     * @param {Boolean/Object} animate (optional) True for the default animation, or a standard Element animation config object
     * @return {Ext.core.Element} this
     */
    setLocation : function(x, y, animate){
        return this.setXY([x, y], animate);
    },

    /**
     * Sets the position of the element in page coordinates, regardless of how the element is positioned.
     * The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
     * @param {Number} x X value for new position (coordinates are page-based)
     * @param {Number} y Y value for new position (coordinates are page-based)
     * @param {Boolean/Object} animate (optional) True for the default animation, or a standard Element animation config object
     * @return {Ext.core.Element} this
     */
    moveTo : function(x, y, animate){
        return this.setXY([x, y], animate);
    },

    /**
     * Gets the left X coordinate
     * @param {Boolean} local True to get the local css position instead of page coordinate
     * @return {Number}
     */
    getLeft : function(local){
        return !local ? this.getX() : parseInt(this.getStyle(LEFT), 10) || 0;
    },

    /**
     * Gets the right X coordinate of the element (element X position + element width)
     * @param {Boolean} local True to get the local css position instead of page coordinate
     * @return {Number}
     */
    getRight : function(local){
        var me = this;
        return !local ? me.getX() + me.getWidth() : (me.getLeft(true) + me.getWidth()) || 0;
    },

    /**
     * Gets the top Y coordinate
     * @param {Boolean} local True to get the local css position instead of page coordinate
     * @return {Number}
     */
    getTop : function(local) {
        return !local ? this.getY() : parseInt(this.getStyle(TOP), 10) || 0;
    },

    /**
     * Gets the bottom Y coordinate of the element (element Y position + element height)
     * @param {Boolean} local True to get the local css position instead of page coordinate
     * @return {Number}
     */
    getBottom : function(local){
        var me = this;
        return !local ? me.getY() + me.getHeight() : (me.getTop(true) + me.getHeight()) || 0;
    },

    /**
    * Initializes positioning on this element. If a desired position is not passed, it will make the
    * the element positioned relative IF it is not already positioned.
    * @param {String} pos (optional) Positioning to use "relative", "absolute" or "fixed"
    * @param {Number} zIndex (optional) The zIndex to apply
    * @param {Number} x (optional) Set the page X position
    * @param {Number} y (optional) Set the page Y position
    */
    position : function(pos, zIndex, x, y) {
        var me = this;

        if (!pos && me.isStyle(POSITION, STATIC)){
            me.setStyle(POSITION, RELATIVE);
        } else if(pos) {
            me.setStyle(POSITION, pos);
        }
        if (zIndex){
            me.setStyle(ZINDEX, zIndex);
        }
        if (x || y) {
            me.setXY([x || false, y || false]);
        }
    },

    /**
    * Clear positioning back to the default when the document was loaded
    * @param {String} value (optional) The value to use for the left,right,top,bottom, defaults to '' (empty string). You could use 'auto'.
    * @return {Ext.core.Element} this
     */
    clearPositioning : function(value){
        value = value || '';
        this.setStyle({
            left : value,
            right : value,
            top : value,
            bottom : value,
            "z-index" : "",
            position : STATIC
        });
        return this;
    },

    /**
    * Gets an object with all CSS positioning properties. Useful along with setPostioning to get
    * snapshot before performing an update and then restoring the element.
    * @return {Object}
    */
    getPositioning : function(){
        var l = this.getStyle(LEFT);
        var t = this.getStyle(TOP);
        return {
            "position" : this.getStyle(POSITION),
            "left" : l,
            "right" : l ? "" : this.getStyle(RIGHT),
            "top" : t,
            "bottom" : t ? "" : this.getStyle(BOTTOM),
            "z-index" : this.getStyle(ZINDEX)
        };
    },

    /**
    * Set positioning with an object returned by getPositioning().
    * @param {Object} posCfg
    * @return {Ext.core.Element} this
     */
    setPositioning : function(pc){
        var me = this,
            style = me.dom.style;

        me.setStyle(pc);

        if(pc.right == AUTO){
            style.right = "";
        }
        if(pc.bottom == AUTO){
            style.bottom = "";
        }

        return me;
    },

    /**
     * Translates the passed page coordinates into left/top css values for this element
     * @param {Number/Array} x The page x or an array containing [x, y]
     * @param {Number} y (optional) The page y, required if x is not an array
     * @return {Object} An object with left and top properties. e.g. {left: (value), top: (value)}
     */
    translatePoints: function(x, y) {
        if (Ext.isArray(x)) {
             y = x[1];
             x = x[0];
        }
        var me = this,
            relative = me.isStyle(POSITION, RELATIVE),
            o = me.getXY(),
            left = parseInt(me.getStyle(LEFT), 10),
            top = parseInt(me.getStyle(TOP), 10);

        if (!Ext.isNumber(left)) {
            left = relative ? 0 : me.dom.offsetLeft;
        }
        if (!Ext.isNumber(top)) {
            top = relative ? 0 : me.dom.offsetTop;
        }
        left = (Ext.isNumber(x)) ? x - o[0] + left : undefined;
        top = (Ext.isNumber(y)) ? y - o[1] + top : undefined;
        return {
            left: left,
            top: top
        };
    },

    /**
     * Sets the element's box. Use getBox() on another element to get a box obj. If animate is true then width, height, x and y will be animated concurrently.
     * @param {Object} box The box to fill {x, y, width, height}
     * @param {Boolean} adjust (optional) Whether to adjust for box-model issues automatically
     * @param {Boolean/Object} animate (optional) true for the default animation or a standard Element animation config object
     * @return {Ext.core.Element} this
     */
    setBox: function(box, adjust, animate) {
        var me = this,
            w = box.width,
            h = box.height;
        if ((adjust && !me.autoBoxAdjust) && !me.isBorderBox()) {
            w -= (me.getBorderWidth("lr") + me.getPadding("lr"));
            h -= (me.getBorderWidth("tb") + me.getPadding("tb"));
        }
        me.setBounds(box.x, box.y, w, h, animate);
        return me;
    },

    /**
     * Return an object defining the area of this Element which can be passed to {@link #setBox} to
     * set another Element's size/location to match this element.
     * @param {Boolean} contentBox (optional) If true a box for the content of the element is returned.
     * @param {Boolean} local (optional) If true the element's left and top are returned instead of page x/y.
     * @return {Object} box An object in the format<pre><code>
{
    x: &lt;Element's X position>,
    y: &lt;Element's Y position>,
    width: &lt;Element's width>,
    height: &lt;Element's height>,
    bottom: &lt;Element's lower bound>,
    right: &lt;Element's rightmost bound>
}
</code></pre>
     * The returned object may also be addressed as an Array where index 0 contains the X position
     * and index 1 contains the Y position. So the result may also be used for {@link #setXY}
     */
    getBox: function(contentBox, local) {
        var me = this,
            xy,
            left,
            top,
            getBorderWidth = me.getBorderWidth,
            getPadding = me.getPadding,
            l,
            r,
            t,
            b;
        if (!local) {
            xy = me.getXY();
        } else {
            left = parseInt(me.getStyle("left"), 10) || 0;
            top = parseInt(me.getStyle("top"), 10) || 0;
            xy = [left, top];
        }
        var el = me.dom,
        w = el.offsetWidth,
        h = el.offsetHeight,
        bx;
        if (!contentBox) {
            bx = {
                x: xy[0],
                y: xy[1],
                0: xy[0],
                1: xy[1],
                width: w,
                height: h
            };
        } else {
            l = getBorderWidth.call(me, "l") + getPadding.call(me, "l");
            r = getBorderWidth.call(me, "r") + getPadding.call(me, "r");
            t = getBorderWidth.call(me, "t") + getPadding.call(me, "t");
            b = getBorderWidth.call(me, "b") + getPadding.call(me, "b");
            bx = {
                x: xy[0] + l,
                y: xy[1] + t,
                0: xy[0] + l,
                1: xy[1] + t,
                width: w - (l + r),
                height: h - (t + b)
            };
        }
        bx.right = bx.x + bx.width;
        bx.bottom = bx.y + bx.height;
        return bx;
    },

    /**
     * Move this element relative to its current position.
     * @param {String} direction Possible values are: "l" (or "left"), "r" (or "right"), "t" (or "top", or "up"), "b" (or "bottom", or "down").
     * @param {Number} distance How far to move the element in pixels
     * @param {Boolean/Object} animate (optional) true for the default animation or a standard Element animation config object
     * @return {Ext.core.Element} this
     */
    move: function(direction, distance, animate) {
        var me = this,
            xy = me.getXY(),
            x = xy[0],
            y = xy[1],
            left = [x - distance, y],
            right = [x + distance, y],
            top = [x, y - distance],
            bottom = [x, y + distance],
            hash = {
                l: left,
                left: left,
                r: right,
                right: right,
                t: top,
                top: top,
                up: top,
                b: bottom,
                bottom: bottom,
                down: bottom
            };

        direction = direction.toLowerCase();
        me.moveTo(hash[direction][0], hash[direction][1], animate);
    },

    /**
     * Quick set left and top adding default units
     * @param {String} left The left CSS property value
     * @param {String} top The top CSS property value
     * @return {Ext.core.Element} this
     */
    setLeftTop: function(left, top) {
        var me = this,
            style = me.dom.style;
        style.left = me.addUnits(left);
        style.top = me.addUnits(top);
        return me;
    },

    /**
     * Returns the region of this element.
     * The element must be part of the DOM tree to have a region (display:none or elements not appended return false).
     * @return {Region} A Ext.util.Region containing "top, left, bottom, right" member data.
     */
    getRegion: function() {
        return this.getPageBox(true);
    },

    /**
     * Returns the <b>content</b> region of this element. That is the region within the borders and padding.
     * @return {Region} A Ext.util.Region containing "top, left, bottom, right" member data.
     */
    getViewRegion: function() {
        var pos = this.getXY(),
            top = pos[1] + this.getBorderWidth('t') + this.getPadding('t'),
            left = pos[0] + this.getBorderWidth('l') + this.getPadding('l'),
            size = this.getViewSize();
        return new Ext.util.Region(top, left + size.width - 1 - this.getPadding('lr'), top + size.height - 1 - this.getPadding('tb'), left);
    },

    /**
     * Return an object defining the area of this Element which can be passed to {@link #setBox} to
     * set another Element's size/location to match this element.
     * @param {Boolean} asRegion(optional) If true an Ext.util.Region will be returned
     * @return {Object} box An object in the format<pre><code>
{
    x: &lt;Element's X position>,
    y: &lt;Element's Y position>,
    width: &lt;Element's width>,
    height: &lt;Element's height>,
    bottom: &lt;Element's lower bound>,
    right: &lt;Element's rightmost bound>
}
</code></pre>
     * The returned object may also be addressed as an Array where index 0 contains the X position
     * and index 1 contains the Y position. So the result may also be used for {@link #setXY}
     */
    getPageBox : function(getRegion) {
        var me = this,
            el = me.dom,
            isDoc = el === document.body,
            w = isDoc ? Ext.core.Element.getViewWidth()  : el.offsetWidth,
            h = isDoc ? Ext.core.Element.getViewHeight() : el.offsetHeight,
            xy = me.getXY(),
            t = xy[1],
            r = xy[0] + w - 1,
            b = xy[1] + h - 1,
            l = xy[0];

        if (getRegion) {
            return new Ext.util.Region(t, r, b, l);
        }
        else {
            return {
                left: l,
                top: t,
                width: w,
                height: h,
                right: r,
                bottom: b
            };
        }
    },

    /**
     * Sets the element's position and size in one shot. If animation is true then width, height, x and y will be animated concurrently.
     * @param {Number} x X value for new position (coordinates are page-based)
     * @param {Number} y Y value for new position (coordinates are page-based)
     * @param {Mixed} width The new width. This may be one of:<div class="mdetail-params"><ul>
     * <li>A Number specifying the new width in this Element's {@link #defaultUnit}s (by default, pixels)</li>
     * <li>A String used to set the CSS width style. Animation may <b>not</b> be used.
     * </ul></div>
     * @param {Mixed} height The new height. This may be one of:<div class="mdetail-params"><ul>
     * <li>A Number specifying the new height in this Element's {@link #defaultUnit}s (by default, pixels)</li>
     * <li>A String used to set the CSS height style. Animation may <b>not</b> be used.</li>
     * </ul></div>
     * @param {Boolean/Object} animate (optional) true for the default animation or a standard Element animation config object
     * @return {Ext.core.Element} this
     */
    setBounds: function(x, y, width, height, animate) {
        var me = this;
        if (!animate || !me.anim) {
            me.setSize(width, height);
            me.setLocation(x, y);
        } else {
            if (!Ext.isObject(animate)) {
                animate = {};
            }
            me.animate(Ext.applyIf({
                to: {
                    x: x,
                    y: y,
                    width: me.adjustWidth(width),
                    height: me.adjustHeight(height)
                }
            }, animate));
        }
        return me;
    },

    /**
     * Sets the element's position and size the specified region. If animation is true then width, height, x and y will be animated concurrently.
     * @param {Ext.util.Region} region The region to fill
     * @param {Boolean/Object} animate (optional) true for the default animation or a standard Element animation config object
     * @return {Ext.core.Element} this
     */
    setRegion: function(region, animate) {
        return this.setBounds(region.left, region.top, region.right - region.left, region.bottom - region.top, animate);
    }
});
})();

/**
 * @class Ext.core.Element
 */
Ext.override(Ext.core.Element, {
    /**
     * Returns true if this element is scrollable.
     * @return {Boolean}
     */
    isScrollable : function(){
        var dom = this.dom;
        return dom.scrollHeight > dom.clientHeight || dom.scrollWidth > dom.clientWidth;
    },

    /**
     * Returns the current scroll position of the element.
     * @return {Object} An object containing the scroll position in the format {left: (scrollLeft), top: (scrollTop)}
     */
    getScroll : function() {
        var d = this.dom, 
            doc = document,
            body = doc.body,
            docElement = doc.documentElement,
            l,
            t,
            ret;

        if (d == doc || d == body) {
            if (Ext.isIE && Ext.isStrict) {
                l = docElement.scrollLeft; 
                t = docElement.scrollTop;
            } else {
                l = window.pageXOffset;
                t = window.pageYOffset;
            }
            ret = {
                left: l || (body ? body.scrollLeft : 0), 
                top : t || (body ? body.scrollTop : 0)
            };
        } else {
            ret = {
                left: d.scrollLeft, 
                top : d.scrollTop
            };
        }
        
        return ret;
    },
    
    /**
     * Scrolls this element the specified scroll point. It does NOT do bounds checking so if you scroll to a weird value it will try to do it. For auto bounds checking, use scroll().
     * @param {String} side Either "left" for scrollLeft values or "top" for scrollTop values.
     * @param {Number} value The new scroll value
     * @param {Boolean/Object} animate (optional) true for the default animation or a standard Element animation config object
     * @return {Element} this
     */
    scrollTo : function(side, value, animate) {
        //check if we're scrolling top or left
        var top = /top/i.test(side),
            me = this,
            dom = me.dom,
            obj = {},
            prop;
        if (!animate || !me.anim) {
            // just setting the value, so grab the direction
            prop = 'scroll' + (top ? 'Top' : 'Left');
            dom[prop] = value;
        }
        else {
            if (!Ext.isObject(animate)) {
                animate = {};
            }
            obj['scroll' + (top ? 'Top' : 'Left')] = value;
            me.animate(Ext.applyIf({
                to: obj
            }, animate));
        }
        return me;
    },

    /**
     * Scrolls this element into view within the passed container.
     * @param {Mixed} container (optional) The container element to scroll (defaults to document.body).  Should be a
     * string (id), dom node, or Ext.core.Element.
     * @param {Boolean} hscroll (optional) False to disable horizontal scroll (defaults to true)
     * @return {Ext.core.Element} this
     */
    scrollIntoView : function(container, hscroll) {
        container = Ext.getDom(container) || Ext.getBody().dom;
        var el = this.dom,
            offsets = this.getOffsetsTo(container),
            // el's box
            left = offsets[0] + container.scrollLeft,
            top = offsets[1] + container.scrollTop,
            bottom = top + el.offsetHeight,
            right = left + el.offsetWidth,
            // ct's box
            ctClientHeight = container.clientHeight,
            ctScrollTop = parseInt(container.scrollTop, 10),
            ctScrollLeft = parseInt(container.scrollLeft, 10),
            ctBottom = ctScrollTop + ctClientHeight,
            ctRight = ctScrollLeft + container.clientWidth;

        if (el.offsetHeight > ctClientHeight || top < ctScrollTop) {
            container.scrollTop = top;
        } else if (bottom > ctBottom) {
            container.scrollTop = bottom - ctClientHeight;
        }
        // corrects IE, other browsers will ignore
        container.scrollTop = container.scrollTop;

        if (hscroll !== false) {
            if (el.offsetWidth > container.clientWidth || left < ctScrollLeft) {
                container.scrollLeft = left;
            }
            else if (right > ctRight) {
                container.scrollLeft = right - container.clientWidth;
            }
            container.scrollLeft = container.scrollLeft;
        }
        return this;
    },

    // private
    scrollChildIntoView : function(child, hscroll) {
        Ext.fly(child, '_scrollChildIntoView').scrollIntoView(this, hscroll);
    },

    /**
     * Scrolls this element the specified direction. Does bounds checking to make sure the scroll is
     * within this element's scrollable range.
     * @param {String} direction Possible values are: "l" (or "left"), "r" (or "right"), "t" (or "top", or "up"), "b" (or "bottom", or "down").
     * @param {Number} distance How far to scroll the element in pixels
     * @param {Boolean/Object} animate (optional) true for the default animation or a standard Element animation config object
     * @return {Boolean} Returns true if a scroll was triggered or false if the element
     * was scrolled as far as it could go.
     */
     scroll : function(direction, distance, animate) {
        if (!this.isScrollable()) {
            return false;
        }
        var el = this.dom,
            l = el.scrollLeft, t = el.scrollTop,
            w = el.scrollWidth, h = el.scrollHeight,
            cw = el.clientWidth, ch = el.clientHeight,
            scrolled = false, v,
            hash = {
                l: Math.min(l + distance, w-cw),
                r: v = Math.max(l - distance, 0),
                t: Math.max(t - distance, 0),
                b: Math.min(t + distance, h-ch)
            };
            hash.d = hash.b;
            hash.u = hash.t;

        direction = direction.substr(0, 1);
        if ((v = hash[direction]) > -1) {
            scrolled = true;
            this.scrollTo(direction == 'l' || direction == 'r' ? 'left' : 'top', v, this.anim(animate));
        }
        return scrolled;
    }
});
/**
 * @class Ext.core.Element
 */
Ext.core.Element.addMethods(
    function() {
        var VISIBILITY      = "visibility",
            DISPLAY         = "display",
            HIDDEN          = "hidden",
            NONE            = "none",
            XMASKED         = Ext.baseCSSPrefix + "masked",
            XMASKEDRELATIVE = Ext.baseCSSPrefix + "masked-relative",
            data            = Ext.core.Element.data;

        return {
            /**
             * Checks whether the element is currently visible using both visibility and display properties.
             * @param {Boolean} deep (optional) True to walk the dom and see if parent elements are hidden (defaults to false)
             * @return {Boolean} True if the element is currently visible, else false
             */
            isVisible : function(deep) {
                var vis = !this.isStyle(VISIBILITY, HIDDEN) && !this.isStyle(DISPLAY, NONE),
                    p   = this.dom.parentNode;
                
                if (deep !== true || !vis) {
                    return vis;
                }
                
                while (p && !(/^body/i.test(p.tagName))) {
                    if (!Ext.fly(p, '_isVisible').isVisible()) {
                        return false;
                    }
                    p = p.parentNode;
                }
                return true;
            },

            /**
             * Returns true if display is not "none"
             * @return {Boolean}
             */
            isDisplayed : function() {
                return !this.isStyle(DISPLAY, NONE);
            },

            /**
             * Convenience method for setVisibilityMode(Element.DISPLAY)
             * @param {String} display (optional) What to set display to when visible
             * @return {Ext.core.Element} this
             */
            enableDisplayMode : function(display) {
                this.setVisibilityMode(Ext.core.Element.DISPLAY);
                
                if (!Ext.isEmpty(display)) {
                    data(this.dom, 'originalDisplay', display);
                }
                
                return this;
            },

            /**
             * Puts a mask over this element to disable user interaction. Requires core.css.
             * This method can only be applied to elements which accept child nodes.
             * @param {String} msg (optional) A message to display in the mask
             * @param {String} msgCls (optional) A css class to apply to the msg element
             * @return {Element} The mask element
             */
            mask : function(msg, msgCls) {
                var me  = this,
                    dom = me.dom,
                    dh  = Ext.core.DomHelper,
                    EXTELMASKMSG = Ext.baseCSSPrefix + "mask-msg",
                    el,
                    mask;

                if (!(/^body/i.test(dom.tagName) && me.getStyle('position') == 'static')) {
                    me.addCls(XMASKEDRELATIVE);
                }
                if (el = data(dom, 'maskMsg')) {
                    el.remove();
                }
                if (el = data(dom, 'mask')) {
                    el.remove();
                }

                mask = dh.append(dom, {cls : Ext.baseCSSPrefix + "mask"}, true);
                data(dom, 'mask', mask);

                me.addCls(XMASKED);
                mask.setDisplayed(true);
                
                if (typeof msg == 'string') {
                    var mm = dh.append(dom, {cls : EXTELMASKMSG, cn:{tag:'div'}}, true);
                    data(dom, 'maskMsg', mm);
                    mm.dom.className = msgCls ? EXTELMASKMSG + " " + msgCls : EXTELMASKMSG;
                    mm.dom.firstChild.innerHTML = msg;
                    mm.setDisplayed(true);
                    mm.center(me);
                }
                
                if (!Ext.supports.IncludePaddingInWidthCalculation) {
                    mask.setSize(me.getWidth(), me.getHeight());
                }
                
                // ie will not expand full height automatically
                if (Ext.isIE && !(Ext.isIE7 && Ext.isStrict) && me.getStyle('height') == 'auto') {
                    mask.setSize(undefined, me.getHeight());
                }
                
                return mask;
            },

            /**
             * Removes a previously applied mask.
             */
            unmask : function() {
                var me      = this,
                    dom     = me.dom,
                    mask    = data(dom, 'mask'),
                    maskMsg = data(dom, 'maskMsg');

                if (mask) {
                    if (maskMsg) {
                        maskMsg.remove();
                        data(dom, 'maskMsg', undefined);
                    }
                    
                    mask.remove();
                    data(dom, 'mask', undefined);
                    me.removeCls([XMASKED, XMASKEDRELATIVE]);
                }
            },
            /**
             * Returns true if this element is masked
             * @return {Boolean}
             */
            isMasked : function() {
                var m = data(this.dom, 'mask');
                return m && m.isVisible();
            },

            /**
             * Creates an iframe shim for this element to keep selects and other windowed objects from
             * showing through.
             * @return {Ext.core.Element} The new shim element
             */
            createShim : function() {
                var el = document.createElement('iframe'),
                    shim;
                
                el.frameBorder = '0';
                el.className = 'ext-shim';
                el.src = Ext.SSL_SECURE_URL;
                shim = Ext.get(this.dom.parentNode.insertBefore(el, this.dom));
                shim.autoBoxAdjust = false;
                return shim;
            }
        };
    }()
);
/**
 * @class Ext.core.Element
 */
Ext.core.Element.addMethods({
    /**
     * Convenience method for constructing a KeyMap
     * @param {Number/Array/Object/String} key Either a string with the keys to listen for, the numeric key code, array of key codes or an object with the following options:
     * <code>{key: (number or array), shift: (true/false), ctrl: (true/false), alt: (true/false)}</code>
     * @param {Function} fn The function to call
     * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the specified function is executed. Defaults to this Element.
     * @return {Ext.util.KeyMap} The KeyMap created
     */
    addKeyListener : function(key, fn, scope){
        var config;
        if(typeof key != 'object' || Ext.isArray(key)){
            config = {
                key: key,
                fn: fn,
                scope: scope
            };
        }else{
            config = {
                key : key.key,
                shift : key.shift,
                ctrl : key.ctrl,
                alt : key.alt,
                fn: fn,
                scope: scope
            };
        }
        return new Ext.util.KeyMap(this, config);
    },

    /**
     * Creates a KeyMap for this element
     * @param {Object} config The KeyMap config. See {@link Ext.util.KeyMap} for more details
     * @return {Ext.util.KeyMap} The KeyMap created
     */
    addKeyMap : function(config){
        return new Ext.util.KeyMap(this, config);
    }
});

//Import the newly-added Ext.core.Element functions into CompositeElementLite. We call this here because
//Element.keys.js is the last extra Ext.core.Element include in the ext-all.js build
Ext.CompositeElementLite.importElementMethods();
/**
 * @class Ext.CompositeElementLite
 */
Ext.apply(Ext.CompositeElementLite.prototype, {
    addElements : function(els, root){
        if(!els){
            return this;
        }
        if(typeof els == "string"){
            els = Ext.core.Element.selectorFunction(els, root);
        }
        var yels = this.elements;
        Ext.each(els, function(e) {
            yels.push(Ext.get(e));
        });
        return this;
    },

    /**
     * Returns the first Element
     * @return {Ext.core.Element}
     */
    first : function(){
        return this.item(0);
    },

    /**
     * Returns the last Element
     * @return {Ext.core.Element}
     */
    last : function(){
        return this.item(this.getCount()-1);
    },

    /**
     * Returns true if this composite contains the passed element
     * @param el {Mixed} The id of an element, or an Ext.core.Element, or an HtmlElement to find within the composite collection.
     * @return Boolean
     */
    contains : function(el){
        return this.indexOf(el) != -1;
    },

    /**
    * Removes the specified element(s).
    * @param {Mixed} el The id of an element, the Element itself, the index of the element in this composite
    * or an array of any of those.
    * @param {Boolean} removeDom (optional) True to also remove the element from the document
    * @return {CompositeElement} this
    */
    removeElement : function(keys, removeDom){
        var me = this,
            els = this.elements,
            el;
        Ext.each(keys, function(val){
            if ((el = (els[val] || els[val = me.indexOf(val)]))) {
                if(removeDom){
                    if(el.dom){
                        el.remove();
                    }else{
                        Ext.removeNode(el);
                    }
                }
                els.splice(val, 1);
            }
        });
        return this;
    }
});

/**
 * @class Ext.CompositeElement
 * @extends Ext.CompositeElementLite
 * <p>This class encapsulates a <i>collection</i> of DOM elements, providing methods to filter
 * members, or to perform collective actions upon the whole set.</p>
 * <p>Although they are not listed, this class supports all of the methods of {@link Ext.core.Element} and
 * {@link Ext.fx.Anim}. The methods from these classes will be performed on all the elements in this collection.</p>
 * <p>All methods return <i>this</i> and can be chained.</p>
 * Usage:
<pre><code>
var els = Ext.select("#some-el div.some-class", true);
// or select directly from an existing element
var el = Ext.get('some-el');
el.select('div.some-class', true);

els.setWidth(100); // all elements become 100 width
els.hide(true); // all elements fade out and hide
// or
els.setWidth(100).hide(true);
</code></pre>
 */
Ext.CompositeElement = Ext.extend(Ext.CompositeElementLite, {
    
    constructor : function(els, root){
        this.elements = [];
        this.add(els, root);
    },
    
    // private
    getElement : function(el){
        // In this case just return it, since we already have a reference to it
        return el;
    },
    
    // private
    transformElement : function(el){
        return Ext.get(el);
    }

    /**
    * Adds elements to this composite.
    * @param {String/Array} els A string CSS selector, an array of elements or an element
    * @return {CompositeElement} this
    */

    /**
     * Returns the Element object at the specified index
     * @param {Number} index
     * @return {Ext.core.Element}
     */

    /**
     * Iterates each `element` in this `composite` calling the supplied function using {@link Ext#each Ext.each}.
     * @param {Function} fn 

The function to be called with each
`element`. If the supplied function returns <tt>false</tt>,
iteration stops. This function is called with the following arguments:

- `element` : __Ext.core.Element++
    The element at the current `index` in the `composite`
    
- `composite` : __Object__ 
    This composite.

- `index` : __Number__ 
    The current index within the `composite`

     * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the specified function is executed.
     * Defaults to the <code>element</code> at the current <code>index</code>
     * within the composite.
     * @return {CompositeElement} this
     * @markdown
     */
});

/**
 * Selects elements based on the passed CSS selector to enable {@link Ext.core.Element Element} methods
 * to be applied to many related elements in one statement through the returned {@link Ext.CompositeElement CompositeElement} or
 * {@link Ext.CompositeElementLite CompositeElementLite} object.
 * @param {String/Array} selector The CSS selector or an array of elements
 * @param {Boolean} unique (optional) true to create a unique Ext.core.Element for each element (defaults to a shared flyweight object)
 * @param {HTMLElement/String} root (optional) The root element of the query or id of the root
 * @return {CompositeElementLite/CompositeElement}
 * @member Ext.core.Element
 * @method select
 */
Ext.core.Element.select = function(selector, unique, root){
    var els;
    if(typeof selector == "string"){
        els = Ext.core.Element.selectorFunction(selector, root);
    }else if(selector.length !== undefined){
        els = selector;
    }else{
        throw "Invalid selector";
    }

    return (unique === true) ? new Ext.CompositeElement(els) : new Ext.CompositeElementLite(els);
};

/**
 * Selects elements based on the passed CSS selector to enable {@link Ext.core.Element Element} methods
 * to be applied to many related elements in one statement through the returned {@link Ext.CompositeElement CompositeElement} or
 * {@link Ext.CompositeElementLite CompositeElementLite} object.
 * @param {String/Array} selector The CSS selector or an array of elements
 * @param {Boolean} unique (optional) true to create a unique Ext.core.Element for each element (defaults to a shared flyweight object)
 * @param {HTMLElement/String} root (optional) The root element of the query or id of the root
 * @return {CompositeElementLite/CompositeElement}
 * @member Ext
 * @method select
 */
Ext.select = Ext.core.Element.select;
})();

})();

