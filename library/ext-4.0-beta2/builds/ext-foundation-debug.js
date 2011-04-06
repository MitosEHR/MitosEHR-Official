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
         * Proxy to {@link Ext.Base#override}. Please refer {@link Ext.Base#override} for further details.

    Ext.define('My.cool.Class', {
        sayHi: function() {
            alert('Hi!');
        }
    }

    Ext.override(My.cool.Class, {
        sayHi: function() {
            alert('About to say...');

            this.callOverridden();
        }
    });

    var cool = new My.cool.Class();
    cool.sayHi(); // alerts 'About to say...'
                  // alerts 'Hi!'

         * Please note that `this.callOverridden()` only works if the class was created with {@link Ext#define)
         *
         * @param {Object} origclass The class to override
         * @param {Object} overrides The list of functions to add to origClass. This should be specified as an object literal
         * containing one or more methods.
         * @method override
         * @markdown
         */
        override: function(origclass, overrides) {
            if (origclass.prototype.$className) {
                return origclass.override(overrides);
            }
            else {
                Ext.apply(origclass.prototype, overrides);
            }
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
            else if (Ext.isObject(item) && item.constructor === Object) {
                clone = {};

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
var version = '4.0.0beta2',
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
    htmlEncode: (function() {
        var entities = {
            '&': '&amp;',
            '>': '&gt;',
            '<': '&lt;',
            '"': '&quot;'
        }, keys = [], p, regex;
        
        for (p in entities) {
            keys.push(p);
        }
        
        regex = new RegExp('(' + keys.join('|') + ')', 'g');
        
        return function(value) {
            return (!value) ? value : String(value).replace(regex, function(match, capture) {
                return entities[capture];    
            });
        };
    })(),

    /**
     * Convert certain characters (&, <, >, and ') from their HTML character equivalents.
     * @param {String} value The string to decode
     * @return {String} The decoded text
     */
    htmlDecode: (function() {
        var entities = {
            '&amp;': '&',
            '&gt;': '>',
            '&lt;': '<',
            '&quot;': '"'
        }, keys = [], p, regex;
        
        for (p in entities) {
            keys.push(p);
        }
        
        regex = new RegExp('(' + keys.join('|') + '|&#[0-9]{1,5};' + ')', 'g');
        
        return function(value) {
            return (!value) ? value : String(value).replace(regex, function(match, capture) {
                if (capture in entities) {
                    return entities[capture];
                } else {
                    return String.fromCharCode(parseInt(capture.substr(2), 10));
                }
            });
        };
    })(),

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
 * @member Ext
 * @method num
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
        supportsFilter = 'filter' in arrayPrototype,
        // default sort comparison function
        _defaultSortFn = function(a, b) {
            a = a.toString();
            b = b.toString();
            if(a === b){
                return 0;
            }

            return (a < b) ? -1 : 1;
        };
        
    Ext.Array = {
        /*
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
         * @param {Boolean} inverse Allows to inverse iteration (Optional) 
         * Defaults to the `item` at the current `index`
         * within the passed `array`.
         * @return {Boolean} See description for the fn parameter.
         * @markdown
         */
        each: function(array, fn, scope, inverse) {
            if (Ext.isEmpty(array, true)) {
                return 0;
            }

            if (!Ext.isIterable(array) || Ext.isPrimitive(array)) {
                array = [array];
            }
            var length = array.length,
                i;
            if (inverse !== true) {
                for (i = 0; i < length; i++) {
                    if (fn.call(scope || array[i], array[i], i, array) === false) {
                        return i;
                    }
                }
            } else {
                for (i = length - 1; i > -1; i--) {
                    if (fn.call(scope || array[i], array[i], i, array) === false) {
                        return i;
                    }
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
         * Ext.Array.pluck(Ext.query("p"), "className"); // [el1.className, el2.className, ..., elN.className]
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
         * Executes the specified function for each array element until the function returns a falsey value.
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
        },
        

        /**
         * Sorts the elements of an Array.
         * By default, this method sorts the elements alphabetically and ascending.
         * @param {Array} array The array to sort.
         * @param {Function} sortFn (optional) The comparision function.
         * @return {Array} The sorted array.
         */       
        sort: function(array, sortFn) {
            if (Ext.supports.ArraySort) {
                return array.sort(sortFn);
            } else {
                var length = array.length,
                    i = 0,
                    comparison,
                    j, min, tmp;
                
                sortFn = sortFn || _defaultSortFn;
                
                for (; i < length; i++) {
                    min = i;
                    for (j = i + 1; j < length; j++) {
                        comparison = sortFn(array[j], array[min]);
                        if (comparison < 0 || comparison === false) {
                            min = j;
                        }
                    }
                    if (min !== i) {
                            tmp = array[i];
                            array[i] = array[min];
                            array[min] = tmp;
                    }
                }
                return array;
            }
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
            }
            else if (Ext.isNumber(appendArgs)) {
                callArgs = Array.prototype.slice.call(arguments, 0); // copy arguments first
                applyArgs = [appendArgs, 0].concat(args); // create method call params
                Array.prototype.splice.apply(callArgs, applyArgs); // splice them in
            }

            return method.apply(scope || window, callArgs);
        };
    },

    /**
     * Create a new function from the provided <code>fn</code>, the arguments of which are pre-set to `args`.
     * New arguments passed to the newly created callback when it's invoked are appended after the pre-set ones.
     * This is especially useful when creating callbacks.
     * For example:
     *
    var originalFunction = function(){
        alert(Ext.Array.from(arguments).join(' '));
    };

    var callback = Ext.Function.pass(originalFunction, ['Hello', 'World']);

    callback(); // alerts 'Hello World'
    callback('by Me'); // alerts 'Hello World by Me'

     * @param {Function} fn The original function
     * @param {Array} args The arguments to pass to new callback
     * @param {Object} scope (optional) The scope (<code><b>this</b></code> reference) in which the function is executed.
     * @return {Function} The new callback function
     */
    pass: function(fn, args, scope) {
        if (args) {
            args = Ext.Array.from(args);
        }

        return function() {
            return fn.apply(scope, args.concat(Ext.Array.toArray(arguments)));
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
    * Creates a delegate (callback) which, when called, executes after a specific delay.
    * @param {Function} fn The function which will be called on a delay when the returned function is called.
    * Optionally, a replacement (or additional) argument list may be specified.
    * @param {Number} delay The number of milliseconds to defer execution by whenever called.
    * @param {Object} scope (optional) The scope (<code>this</code> reference) used by the function at execution time.
    * @param {Array} args (optional) Override arguments for the call. (Defaults to the arguments passed by the caller)
    * @param {Boolean/Number} appendArgs (optional) if True args are appended to call args instead of overriding,
    * if a number the args are inserted at the specified position.
    * @return {Function} A function which, when called, executes the original function after the specified delay.
    */
    createDelayed: function(fn, delay, scope, args, appendArgs) {
        if (scope || args) {
            fn = Ext.Function.bind(fn, scope, args, appendArgs);
        }
        return function() {
            var me = this;
            setTimeout(function() {
                fn.apply(me, arguments);
            }, delay);
        };
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
 * Note that if Ext.Date is required and loaded, it will copy all methods / properties to
 * this object for convenience
 * @singleton
 */

/**
 * The date parsing and formatting syntax contains a subset of
 * <a href="http://www.php.net/date">PHP's date() function</a>, and the formats that are
 * supported will provide results equivalent to their PHP versions.
 *
 * The following is a list of all currently supported formats:
 * <pre class="">
Format  Description                                                               Example returned values
------  -----------------------------------------------------------------------   -----------------------
  d     Day of the month, 2 digits with leading zeros                             01 to 31
  D     A short textual representation of the day of the week                     Mon to Sun
  j     Day of the month without leading zeros                                    1 to 31
  l     A full textual representation of the day of the week                      Sunday to Saturday
  N     ISO-8601 numeric representation of the day of the week                    1 (for Monday) through 7 (for Sunday)
  S     English ordinal suffix for the day of the month, 2 characters             st, nd, rd or th. Works well with j
  w     Numeric representation of the day of the week                             0 (for Sunday) to 6 (for Saturday)
  z     The day of the year (starting from 0)                                     0 to 364 (365 in leap years)
  W     ISO-8601 week number of year, weeks starting on Monday                    01 to 53
  F     A full textual representation of a month, such as January or March        January to December
  m     Numeric representation of a month, with leading zeros                     01 to 12
  M     A short textual representation of a month                                 Jan to Dec
  n     Numeric representation of a month, without leading zeros                  1 to 12
  t     Number of days in the given month                                         28 to 31
  L     Whether it&#39;s a leap year                                                  1 if it is a leap year, 0 otherwise.
  o     ISO-8601 year number (identical to (Y), but if the ISO week number (W)    Examples: 1998 or 2004
        belongs to the previous or next year, that year is used instead)
  Y     A full numeric representation of a year, 4 digits                         Examples: 1999 or 2003
  y     A two digit representation of a year                                      Examples: 99 or 03
  a     Lowercase Ante meridiem and Post meridiem                                 am or pm
  A     Uppercase Ante meridiem and Post meridiem                                 AM or PM
  g     12-hour format of an hour without leading zeros                           1 to 12
  G     24-hour format of an hour without leading zeros                           0 to 23
  h     12-hour format of an hour with leading zeros                              01 to 12
  H     24-hour format of an hour with leading zeros                              00 to 23
  i     Minutes, with leading zeros                                               00 to 59
  s     Seconds, with leading zeros                                               00 to 59
  u     Decimal fraction of a second                                              Examples:
        (minimum 1 digit, arbitrary number of digits allowed)                     001 (i.e. 0.001s) or
                                                                                  100 (i.e. 0.100s) or
                                                                                  999 (i.e. 0.999s) or
                                                                                  999876543210 (i.e. 0.999876543210s)
  O     Difference to Greenwich time (GMT) in hours and minutes                   Example: +1030
  P     Difference to Greenwich time (GMT) with colon between hours and minutes   Example: -08:00
  T     Timezone abbreviation of the machine running the code                     Examples: EST, MDT, PDT ...
  Z     Timezone offset in seconds (negative if west of UTC, positive if east)    -43200 to 50400
  c     ISO 8601 date
        Notes:                                                                    Examples:
        1) If unspecified, the month / day defaults to the current month / day,   1991 or
           the time defaults to midnight, while the timezone defaults to the      1992-10 or
           browser's timezone. If a time is specified, it must include both hours 1993-09-20 or
           and minutes. The "T" delimiter, seconds, milliseconds and timezone     1994-08-19T16:20+01:00 or
           are optional.                                                          1995-07-18T17:21:28-02:00 or
        2) The decimal fraction of a second, if specified, must contain at        1996-06-17T18:22:29.98765+03:00 or
           least 1 digit (there is no limit to the maximum number                 1997-05-16T19:23:30,12345-0400 or
           of digits allowed), and may be delimited by either a '.' or a ','      1998-04-15T20:24:31.2468Z or
        Refer to the examples on the right for the various levels of              1999-03-14T20:24:32Z or
        date-time granularity which are supported, or see                         2000-02-13T21:25:33
        http://www.w3.org/TR/NOTE-datetime for more info.                         2001-01-12 22:26:34
  U     Seconds since the Unix Epoch (January 1 1970 00:00:00 GMT)                1193432466 or -2138434463
  MS    Microsoft AJAX serialized dates                                           \/Date(1238606590509)\/ (i.e. UTC milliseconds since epoch) or
                                                                                  \/Date(1238606590509+0800)\/
</pre>
 *
 * Example usage (note that you must escape format specifiers with '\\' to render them as character literals):
 * <pre><code>
// Sample date:
// 'Wed Jan 10 2007 15:05:01 GMT-0600 (Central Standard Time)'

var dt = new Date('1/10/2007 03:05:01 PM GMT-0600');
console.log(Ext.Date.format(dt, 'Y-m-d'));                          // 2007-01-10
console.log(Ext.Date.format(dt, 'F j, Y, g:i a'));                  // January 10, 2007, 3:05 pm
console.log(Ext.Date.format(dt, 'l, \\t\\he jS \\of F Y h:i:s A')); // Wednesday, the 10th of January 2007 03:05:01 PM
</code></pre>
 *
 * Here are some standard date/time patterns that you might find helpful.  They
 * are not part of the source of Ext.Date, but to use them you can simply copy this
 * block of code into any script that is included after Ext.Date and they will also become
 * globally available on the Date object.  Feel free to add or remove patterns as needed in your code.
 * <pre><code>
Ext.Date.patterns = {
    ISO8601Long:"Y-m-d H:i:s",
    ISO8601Short:"Y-m-d",
    ShortDate: "n/j/Y",
    LongDate: "l, F d, Y",
    FullDateTime: "l, F d, Y g:i:s A",
    MonthDay: "F d",
    ShortTime: "g:i A",
    LongTime: "g:i:s A",
    SortableDateTime: "Y-m-d\\TH:i:s",
    UniversalSortableDateTime: "Y-m-d H:i:sO",
    YearMonth: "F, Y"
};
</code></pre>
 *
 * Example usage:
 * <pre><code>
var dt = new Date();
console.log(Ext.Date.format(dt, Ext.Date.patterns.ShortDate));
</code></pre>
 * <p>Developer-written, custom formats may be used by supplying both a formatting and a parsing function
 * which perform to specialized requirements. The functions are stored in {@link #parseFunctions} and {@link #formatFunctions}.</p>
 */

/*
 * Most of the date-formatting functions below are the excellent work of Baron Schwartz.
 * (see http://www.xaprb.com/blog/2005/12/12/javascript-closures-for-runtime-efficiency/)
 * They generate precompiled functions from format patterns instead of parsing and
 * processing each pattern every time a date is formatted. These functions are available
 * on every Date object.
 */

(function() {

// create private copy of Ext's Ext.util.Format.format() method
// - to remove unnecessary dependency
// - to resolve namespace conflict with MS-Ajax's implementation
function xf(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/\{(\d+)\}/g, function(m, i) {
        return args[i];
    });
}

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
    },
    
    /**
     * Global flag which determines if strict date parsing should be used.
     * Strict date parsing will not roll-over invalid dates, which is the
     * default behaviour of javascript Date objects.
     * (see {@link #parse} for more information)
     * Defaults to <tt>false</tt>.
     * @static
     * @type Boolean
    */
    useStrict: false,

    // private
    formatCodeToRegex: function(character, currentGroup) {
        // Note: currentGroup - position in regex result array (see notes for Ext.Date.parseCodes below)
        var p = utilDate.parseCodes[character];

        if (p) {
          p = typeof p == 'function'? p() : p;
          utilDate.parseCodes[character] = p; // reassign function result to prevent repeated execution
        }

        return p ? Ext.applyIf({
          c: p.c ? xf(p.c, currentGroup || "{0}") : p.c
        }, p) : {
            g: 0,
            c: null,
            s: Ext.String.escapeRegex(character) // treat unrecognised characters as literals
        };
    },

    /**
     * <p>An object hash in which each property is a date parsing function. The property name is the
     * format string which that function parses.</p>
     * <p>This object is automatically populated with date parsing functions as
     * date formats are requested for Ext standard formatting strings.</p>
     * <p>Custom parsing functions may be inserted into this object, keyed by a name which from then on
     * may be used as a format string to {@link #parse}.<p>
     * <p>Example:</p><pre><code>
Ext.Date.parseFunctions['x-date-format'] = myDateParser;
</code></pre>
     * <p>A parsing function should return a Date object, and is passed the following parameters:<div class="mdetail-params"><ul>
     * <li><code>date</code> : String<div class="sub-desc">The date string to parse.</div></li>
     * <li><code>strict</code> : Boolean<div class="sub-desc">True to validate date strings while parsing
     * (i.e. prevent javascript Date "rollover") (The default must be false).
     * Invalid date strings should return null when parsed.</div></li>
     * </ul></div></p>
     * <p>To enable Dates to also be <i>formatted</i> according to that format, a corresponding
     * formatting function must be placed into the {@link #formatFunctions} property.
     * @property parseFunctions
     * @static
     * @type Object
     */
    parseFunctions: {
        "MS": function(input, strict) {
            // note: the timezone offset is ignored since the MS Ajax server sends
            // a UTC milliseconds-since-Unix-epoch value (negative values are allowed)
            var re = new RegExp('\\/Date\\(([-+])?(\\d+)(?:[+-]\\d{4})?\\)\\/');
            var r = (input || '').match(re);
            return r? new Date(((r[1] || '') + r[2]) * 1) : null;
        }
    },
    parseRegexes: [],

    /**
     * <p>An object hash in which each property is a date formatting function. The property name is the
     * format string which corresponds to the produced formatted date string.</p>
     * <p>This object is automatically populated with date formatting functions as
     * date formats are requested for Ext standard formatting strings.</p>
     * <p>Custom formatting functions may be inserted into this object, keyed by a name which from then on
     * may be used as a format string to {@link #format}. Example:</p><pre><code>
Ext.Date.formatFunctions['x-date-format'] = myDateFormatter;
</code></pre>
     * <p>A formatting function should return a string representation of the passed Date object, and is passed the following parameters:<div class="mdetail-params"><ul>
     * <li><code>date</code> : Date<div class="sub-desc">The Date to format.</div></li>
     * </ul></div></p>
     * <p>To enable date strings to also be <i>parsed</i> according to that format, a corresponding
     * parsing function must be placed into the {@link #parseFunctions} property.
     * @property formatFunctions
     * @static
     * @type Object
     */
    formatFunctions: {
        "MS": function() {
            // UTC milliseconds since Unix epoch (MS-AJAX serialized date format (MRSF))
            return '\\/Date(' + this.getTime() + ')\\/';
        }
    },

    y2kYear : 50,

    /**
     * Date interval constant
     * @static
     * @type String
     */
    MILLI : "ms",

    /**
     * Date interval constant
     * @static
     * @type String
     */
    SECOND : "s",

    /**
     * Date interval constant
     * @static
     * @type String
     */
    MINUTE : "mi",

    /** Date interval constant
     * @static
     * @type String
     */
    HOUR : "h",

    /**
     * Date interval constant
     * @static
     * @type String
     */
    DAY : "d",

    /**
     * Date interval constant
     * @static
     * @type String
     */
    MONTH : "mo",

    /**
     * Date interval constant
     * @static
     * @type String
     */
    YEAR : "y",

    /**
     * <p>An object hash containing default date values used during date parsing.</p>
     * <p>The following properties are available:<div class="mdetail-params"><ul>
     * <li><code>y</code> : Number<div class="sub-desc">The default year value. (defaults to undefined)</div></li>
     * <li><code>m</code> : Number<div class="sub-desc">The default 1-based month value. (defaults to undefined)</div></li>
     * <li><code>d</code> : Number<div class="sub-desc">The default day value. (defaults to undefined)</div></li>
     * <li><code>h</code> : Number<div class="sub-desc">The default hour value. (defaults to undefined)</div></li>
     * <li><code>i</code> : Number<div class="sub-desc">The default minute value. (defaults to undefined)</div></li>
     * <li><code>s</code> : Number<div class="sub-desc">The default second value. (defaults to undefined)</div></li>
     * <li><code>ms</code> : Number<div class="sub-desc">The default millisecond value. (defaults to undefined)</div></li>
     * </ul></div></p>
     * <p>Override these properties to customize the default date values used by the {@link #parse} method.</p>
     * <p><b>Note: In countries which experience Daylight Saving Time (i.e. DST), the <tt>h</tt>, <tt>i</tt>, <tt>s</tt>
     * and <tt>ms</tt> properties may coincide with the exact time in which DST takes effect.
     * It is the responsiblity of the developer to account for this.</b></p>
     * Example Usage:
     * <pre><code>
// set default day value to the first day of the month
Ext.Date.defaults.d = 1;

// parse a February date string containing only year and month values.
// setting the default day value to 1 prevents weird date rollover issues
// when attempting to parse the following date string on, for example, March 31st 2009.
Ext.Date.parse('2009-02', 'Y-m'); // returns a Date object representing February 1st 2009
</code></pre>
     * @property defaults
     * @static
     * @type Object
     */
    defaults: {},

    /**
     * An array of textual day names.
     * Override these values for international dates.
     * Example:
     * <pre><code>
Ext.Date.dayNames = [
    'SundayInYourLang',
    'MondayInYourLang',
    ...
];
</code></pre>
     * @type Array
     * @static
     */
    dayNames : [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ],

    /**
     * An array of textual month names.
     * Override these values for international dates.
     * Example:
     * <pre><code>
Ext.Date.monthNames = [
    'JanInYourLang',
    'FebInYourLang',
    ...
];
</code></pre>
     * @type Array
     * @static
     */
    monthNames : [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ],

    /**
     * An object hash of zero-based javascript month numbers (with short month names as keys. note: keys are case-sensitive).
     * Override these values for international dates.
     * Example:
     * <pre><code>
Ext.Date.monthNumbers = {
    'ShortJanNameInYourLang':0,
    'ShortFebNameInYourLang':1,
    ...
};
</code></pre>
     * @type Object
     * @static
     */
    monthNumbers : {
        Jan:0,
        Feb:1,
        Mar:2,
        Apr:3,
        May:4,
        Jun:5,
        Jul:6,
        Aug:7,
        Sep:8,
        Oct:9,
        Nov:10,
        Dec:11
    },
    /**
     * <p>The date format string that the {@link #dateRenderer} and {@link #date} functions use.
     * see {@link #Date} for details.</p>
     * <p>This defaults to <code>m/d/Y</code>, but may be overridden in a locale file.</p>
     * @property defaultFormat
     * @static
     * @type String
     */
    defaultFormat : "m/d/Y",
    /**
     * Get the short month name for the given month number.
     * Override this function for international dates.
     * @param {Number} month A zero-based javascript month number.
     * @return {String} The short month name.
     * @static
     */
    getShortMonthName : function(month) {
        return utilDate.monthNames[month].substring(0, 3);
    },

    /**
     * Get the short day name for the given day number.
     * Override this function for international dates.
     * @param {Number} day A zero-based javascript day number.
     * @return {String} The short day name.
     * @static
     */
    getShortDayName : function(day) {
        return utilDate.dayNames[day].substring(0, 3);
    },

    /**
     * Get the zero-based javascript month number for the given short/full month name.
     * Override this function for international dates.
     * @param {String} name The short/full month name.
     * @return {Number} The zero-based javascript month number.
     * @static
     */
    getMonthNumber : function(name) {
        // handle camel casing for english month names (since the keys for the Ext.Date.monthNumbers hash are case sensitive)
        return utilDate.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
    },

    /**
     * Checks if the specified format contains hour information
     * @param {String} format The format to check
     * @return {Boolean} True if the format contains hour information
     * @static
     */
    formatContainsHourInfo : (function(){
        var stripEscapeRe = /(\\.)/g,
            hourInfoRe = /([gGhHisucUOPZ]|MS)/;
        return function(format){
            return hourInfoRe.test(format.replace(stripEscapeRe, ''));
        };
    })(),
    
    /**
     * Checks if the specified format contains information about
     * anything other than the time.
     * @param {String} format The format to check
     * @return {Boolean} True if the format contains information about
     * date/day information.
     * @static
     */
    formatContainsDateInfo : (function(){
        var stripEscapeRe = /(\\.)/g,
            dateInfoRe = /([djzmnYycU]|MS)/;
            
        return function(format){
            return dateInfoRe.test(format.replace(stripEscapeRe, ''));
        };
    })(),

    /**
     * The base format-code to formatting-function hashmap used by the {@link #format} method.
     * Formatting functions are strings (or functions which return strings) which
     * will return the appropriate value when evaluated in the context of the Date object
     * from which the {@link #format} method is called.
     * Add to / override these mappings for custom date formatting.
     * Note: Ext.Date.format() treats characters as literals if an appropriate mapping cannot be found.
     * Example:
     * <pre><code>
Ext.Date.formatCodes.x = "Ext.util.Format.leftPad(this.getDate(), 2, '0')";
console.log(Ext.Date.format(new Date(), 'X'); // returns the current day of the month
</code></pre>
     * @type Object
     * @static
     */
    formatCodes : {
        d: "Ext.String.leftPad(this.getDate(), 2, '0')",
        D: "Ext.Date.getShortDayName(this.getDay())", // get localised short day name
        j: "this.getDate()",
        l: "Ext.Date.dayNames[this.getDay()]",
        N: "(this.getDay() ? this.getDay() : 7)",
        S: "Ext.Date.getSuffix(this)",
        w: "this.getDay()",
        z: "Ext.Date.getDayOfYear(this)",
        W: "Ext.String.leftPad(Ext.Date.getWeekOfYear(this), 2, '0')",
        F: "Ext.Date.monthNames[this.getMonth()]",
        m: "Ext.String.leftPad(this.getMonth() + 1, 2, '0')",
        M: "Ext.Date.getShortMonthName(this.getMonth())", // get localised short month name
        n: "(this.getMonth() + 1)",
        t: "Ext.Date.getDaysInMonth(this)",
        L: "(Ext.Date.isLeapYear(this) ? 1 : 0)",
        o: "(this.getFullYear() + (Ext.Date.getWeekOfYear(this) == 1 && this.getMonth() > 0 ? +1 : (Ext.Date.getWeekOfYear(this) >= 52 && this.getMonth() < 11 ? -1 : 0)))",
        Y: "Ext.String.leftPad(this.getFullYear(), 4, '0')",
        y: "('' + this.getFullYear()).substring(2, 4)",
        a: "(this.getHours() < 12 ? 'am' : 'pm')",
        A: "(this.getHours() < 12 ? 'AM' : 'PM')",
        g: "((this.getHours() % 12) ? this.getHours() % 12 : 12)",
        G: "this.getHours()",
        h: "Ext.String.leftPad((this.getHours() % 12) ? this.getHours() % 12 : 12, 2, '0')",
        H: "Ext.String.leftPad(this.getHours(), 2, '0')",
        i: "Ext.String.leftPad(this.getMinutes(), 2, '0')",
        s: "Ext.String.leftPad(this.getSeconds(), 2, '0')",
        u: "Ext.String.leftPad(this.getMilliseconds(), 3, '0')",
        O: "Ext.Date.getGMTOffset(this)",
        P: "Ext.Date.getGMTOffset(this, true)",
        T: "Ext.Date.getTimezone(this)",
        Z: "(this.getTimezoneOffset() * -60)",

        c: function() { // ISO-8601 -- GMT format
            for (var c = "Y-m-dTH:i:sP", code = [], i = 0, l = c.length; i < l; ++i) {
                var e = c.charAt(i);
                code.push(e == "T" ? "'T'" : utilDate.getFormatCode(e)); // treat T as a character literal
            }
            return code.join(" + ");
        },
        /*
        c: function() { // ISO-8601 -- UTC format
            return [
              "this.getUTCFullYear()", "'-'",
              "Ext.util.Format.leftPad(this.getUTCMonth() + 1, 2, '0')", "'-'",
              "Ext.util.Format.leftPad(this.getUTCDate(), 2, '0')",
              "'T'",
              "Ext.util.Format.leftPad(this.getUTCHours(), 2, '0')", "':'",
              "Ext.util.Format.leftPad(this.getUTCMinutes(), 2, '0')", "':'",
              "Ext.util.Format.leftPad(this.getUTCSeconds(), 2, '0')",
              "'Z'"
            ].join(" + ");
        },
        */

        U: "Math.round(this.getTime() / 1000)"
    },

    /**
     * Checks if the passed Date parameters will cause a javascript Date "rollover".
     * @param {Number} year 4-digit year
     * @param {Number} month 1-based month-of-year
     * @param {Number} day Day of month
     * @param {Number} hour (optional) Hour
     * @param {Number} minute (optional) Minute
     * @param {Number} second (optional) Second
     * @param {Number} millisecond (optional) Millisecond
     * @return {Boolean} true if the passed parameters do not cause a Date "rollover", false otherwise.
     * @static
     */
    isValid : function(y, m, d, h, i, s, ms) {
        // setup defaults
        h = h || 0;
        i = i || 0;
        s = s || 0;
        ms = ms || 0;

        // Special handling for year < 100
        var dt = utilDate.add(new Date(y < 100 ? 100 : y, m - 1, d, h, i, s, ms), utilDate.YEAR, y < 100 ? y - 100 : 0);

        return y == dt.getFullYear() &&
            m == dt.getMonth() + 1 &&
            d == dt.getDate() &&
            h == dt.getHours() &&
            i == dt.getMinutes() &&
            s == dt.getSeconds() &&
            ms == dt.getMilliseconds();
    },

    /**
     * Parses the passed string using the specified date format.
     * Note that this function expects normal calendar dates, meaning that months are 1-based (i.e. 1 = January).
     * The {@link #defaults} hash will be used for any date value (i.e. year, month, day, hour, minute, second or millisecond)
     * which cannot be found in the passed string. If a corresponding default date value has not been specified in the {@link #defaults} hash,
     * the current date's year, month, day or DST-adjusted zero-hour time value will be used instead.
     * Keep in mind that the input date string must precisely match the specified format string
     * in order for the parse operation to be successful (failed parse operations return a null value).
     * <p>Example:</p><pre><code>
//dt = Fri May 25 2007 (current date)
var dt = new Date();

//dt = Thu May 25 2006 (today&#39;s month/day in 2006)
dt = Ext.Date.parse("2006", "Y");

//dt = Sun Jan 15 2006 (all date parts specified)
dt = Ext.Date.parse("2006-01-15", "Y-m-d");

//dt = Sun Jan 15 2006 15:20:01
dt = Ext.Date.parse("2006-01-15 3:20:01 PM", "Y-m-d g:i:s A");

// attempt to parse Sun Feb 29 2006 03:20:01 in strict mode
dt = Ext.Date.parse("2006-02-29 03:20:01", "Y-m-d H:i:s", true); // returns null
</code></pre>
     * @param {String} input The raw date string.
     * @param {String} format The expected date string format.
     * @param {Boolean} strict (optional) True to validate date strings while parsing (i.e. prevents javascript Date "rollover")
                        (defaults to false). Invalid date strings will return null when parsed.
     * @return {Date} The parsed Date.
     * @static
     */
    parse : function(input, format, strict) {
        var p = utilDate.parseFunctions;
        if (p[format] == null) {
            utilDate.createParser(format);
        }
        return p[format](input, Ext.isDefined(strict) ? strict : utilDate.useStrict);
    },
    
    // Backwards compat
    parseDate: function(input, format, strict){
        return utilDate.parse(input, format, strict);
    },


    // private
    getFormatCode : function(character) {
        var f = utilDate.formatCodes[character];

        if (f) {
          f = typeof f == 'function'? f() : f;
          utilDate.formatCodes[character] = f; // reassign function result to prevent repeated execution
        }

        // note: unknown characters are treated as literals
        return f || ("'" + Ext.String.escape(character) + "'");
    },

    // private
    createFormat : function(format) {
        var code = [],
            special = false,
            ch = '';

        for (var i = 0; i < format.length; ++i) {
            ch = format.charAt(i);
            if (!special && ch == "\\") {
                special = true;
            } else if (special) {
                special = false;
                code.push("'" + Ext.String.escape(ch) + "'");
            } else {
                code.push(utilDate.getFormatCode(ch));
            }
        }
        utilDate.formatFunctions[format] = Ext.functionFactory("return " + code.join('+'));
    },

    // private
    createParser : (function() {
        var code = [
            "var dt, y, m, d, h, i, s, ms, o, z, zz, u, v,",
                "def = Ext.Date.defaults,",
                "results = String(input).match(Ext.Date.parseRegexes[{0}]);", // either null, or an array of matched strings

            "if(results){",
                "{1}",

                "if(u != null){", // i.e. unix time is defined
                    "v = new Date(u * 1000);", // give top priority to UNIX time
                "}else{",
                    // create Date object representing midnight of the current day;
                    // this will provide us with our date defaults
                    // (note: clearTime() handles Daylight Saving Time automatically)
                    "dt = Ext.Date.clearTime(new Date);",

                    // date calculations (note: these calculations create a dependency on Ext.num())
                    "y = Ext.num(y, Ext.num(def.y, dt.getFullYear()));",
                    "m = Ext.num(m, Ext.num(def.m - 1, dt.getMonth()));",
                    "d = Ext.num(d, Ext.num(def.d, dt.getDate()));",

                    // time calculations (note: these calculations create a dependency on Ext.num())
                    "h  = Ext.num(h, Ext.num(def.h, dt.getHours()));",
                    "i  = Ext.num(i, Ext.num(def.i, dt.getMinutes()));",
                    "s  = Ext.num(s, Ext.num(def.s, dt.getSeconds()));",
                    "ms = Ext.num(ms, Ext.num(def.ms, dt.getMilliseconds()));",

                    "if(z >= 0 && y >= 0){",
                        // both the year and zero-based day of year are defined and >= 0.
                        // these 2 values alone provide sufficient info to create a full date object

                        // create Date object representing January 1st for the given year
                        // handle years < 100 appropriately
                        "v = Ext.Date.add(new Date(y < 100 ? 100 : y, 0, 1, h, i, s, ms), Ext.Date.YEAR, y < 100 ? y - 100 : 0);",

                        // then add day of year, checking for Date "rollover" if necessary
                        "v = !strict? v : (strict === true && (z <= 364 || (Ext.Date.isLeapYear(v) && z <= 365))? Ext.Date.add(v, Ext.Date.DAY, z) : null);",
                    "}else if(strict === true && !Ext.Date.isValid(y, m + 1, d, h, i, s, ms)){", // check for Date "rollover"
                        "v = null;", // invalid date, so return null
                    "}else{",
                        // plain old Date object
                        // handle years < 100 properly
                        "v = Ext.Date.add(new Date(y < 100 ? 100 : y, m, d, h, i, s, ms), Ext.Date.YEAR, y < 100 ? y - 100 : 0);",
                    "}",
                "}",
            "}",

            "if(v){",
                // favour UTC offset over GMT offset
                "if(zz != null){",
                    // reset to UTC, then add offset
                    "v = Ext.Date.add(v, Ext.Date.SECOND, -v.getTimezoneOffset() * 60 - zz);",
                "}else if(o){",
                    // reset to GMT, then add offset
                    "v = Ext.Date.add(v, Ext.Date.MINUTE, -v.getTimezoneOffset() + (sn == '+'? -1 : 1) * (hr * 60 + mn));",
                "}",
            "}",

            "return v;"
        ].join('\n');

        return function(format) {
            var regexNum = utilDate.parseRegexes.length,
                currentGroup = 1,
                calc = [],
                regex = [],
                special = false,
                ch = "";

            for (var i = 0; i < format.length; ++i) {
                ch = format.charAt(i);
                if (!special && ch == "\\") {
                    special = true;
                } else if (special) {
                    special = false;
                    regex.push(Ext.String.escape(ch));
                } else {
                    var obj = utilDate.formatCodeToRegex(ch, currentGroup);
                    currentGroup += obj.g;
                    regex.push(obj.s);
                    if (obj.g && obj.c) {
                        calc.push(obj.c);
                    }
                }
            }

            utilDate.parseRegexes[regexNum] = new RegExp("^" + regex.join('') + "$", 'i');
            utilDate.parseFunctions[format] = Ext.functionFactory("input", "strict", xf(code, regexNum, calc.join('')));
        };
    })(),

    // private
    parseCodes : {
        /*
         * Notes:
         * g = {Number} calculation group (0 or 1. only group 1 contributes to date calculations.)
         * c = {String} calculation method (required for group 1. null for group 0. {0} = currentGroup - position in regex result array)
         * s = {String} regex pattern. all matches are stored in results[], and are accessible by the calculation mapped to 'c'
         */
        d: {
            g:1,
            c:"d = parseInt(results[{0}], 10);\n",
            s:"(\\d{2})" // day of month with leading zeroes (01 - 31)
        },
        j: {
            g:1,
            c:"d = parseInt(results[{0}], 10);\n",
            s:"(\\d{1,2})" // day of month without leading zeroes (1 - 31)
        },
        D: function() {
            for (var a = [], i = 0; i < 7; a.push(utilDate.getShortDayName(i)), ++i); // get localised short day names
            return {
                g:0,
                c:null,
                s:"(?:" + a.join("|") +")"
            };
        },
        l: function() {
            return {
                g:0,
                c:null,
                s:"(?:" + utilDate.dayNames.join("|") + ")"
            };
        },
        N: {
            g:0,
            c:null,
            s:"[1-7]" // ISO-8601 day number (1 (monday) - 7 (sunday))
        },
        S: {
            g:0,
            c:null,
            s:"(?:st|nd|rd|th)"
        },
        w: {
            g:0,
            c:null,
            s:"[0-6]" // javascript day number (0 (sunday) - 6 (saturday))
        },
        z: {
            g:1,
            c:"z = parseInt(results[{0}], 10);\n",
            s:"(\\d{1,3})" // day of the year (0 - 364 (365 in leap years))
        },
        W: {
            g:0,
            c:null,
            s:"(?:\\d{2})" // ISO-8601 week number (with leading zero)
        },
        F: function() {
            return {
                g:1,
                c:"m = parseInt(Ext.Date.getMonthNumber(results[{0}]), 10);\n", // get localised month number
                s:"(" + utilDate.monthNames.join("|") + ")"
            };
        },
        M: function() {
            for (var a = [], i = 0; i < 12; a.push(utilDate.getShortMonthName(i)), ++i); // get localised short month names
            return Ext.applyIf({
                s:"(" + a.join("|") + ")"
            }, utilDate.formatCodeToRegex("F"));
        },
        m: {
            g:1,
            c:"m = parseInt(results[{0}], 10) - 1;\n",
            s:"(\\d{2})" // month number with leading zeros (01 - 12)
        },
        n: {
            g:1,
            c:"m = parseInt(results[{0}], 10) - 1;\n",
            s:"(\\d{1,2})" // month number without leading zeros (1 - 12)
        },
        t: {
            g:0,
            c:null,
            s:"(?:\\d{2})" // no. of days in the month (28 - 31)
        },
        L: {
            g:0,
            c:null,
            s:"(?:1|0)"
        },
        o: function() {
            return utilDate.formatCodeToRegex("Y");
        },
        Y: {
            g:1,
            c:"y = parseInt(results[{0}], 10);\n",
            s:"(\\d{4})" // 4-digit year
        },
        y: {
            g:1,
            c:"var ty = parseInt(results[{0}], 10);\n"
                + "y = ty > Ext.Date.y2kYear ? 1900 + ty : 2000 + ty;\n", // 2-digit year
            s:"(\\d{1,2})"
        },
        /**
         * In the am/pm parsing routines, we allow both upper and lower case
         * even though it doesn't exactly match the spec. It gives much more flexibility
         * in being able to specify case insensitive regexes.
         */
        a: {
            g:1,
            c:"if (/(am)/i.test(results[{0}])) {\n"
                + "if (!h || h == 12) { h = 0; }\n"
                + "} else { if (!h || h < 12) { h = (h || 0) + 12; }}",
            s:"(am|pm|AM|PM)"
        },
        A: {
            g:1,
            c:"if (/(am)/i.test(results[{0}])) {\n"
                + "if (!h || h == 12) { h = 0; }\n"
                + "} else { if (!h || h < 12) { h = (h || 0) + 12; }}",
            s:"(AM|PM|am|pm)"
        },
        g: function() {
            return utilDate.formatCodeToRegex("G");
        },
        G: {
            g:1,
            c:"h = parseInt(results[{0}], 10);\n",
            s:"(\\d{1,2})" // 24-hr format of an hour without leading zeroes (0 - 23)
        },
        h: function() {
            return utilDate.formatCodeToRegex("H");
        },
        H: {
            g:1,
            c:"h = parseInt(results[{0}], 10);\n",
            s:"(\\d{2})" //  24-hr format of an hour with leading zeroes (00 - 23)
        },
        i: {
            g:1,
            c:"i = parseInt(results[{0}], 10);\n",
            s:"(\\d{2})" // minutes with leading zeros (00 - 59)
        },
        s: {
            g:1,
            c:"s = parseInt(results[{0}], 10);\n",
            s:"(\\d{2})" // seconds with leading zeros (00 - 59)
        },
        u: {
            g:1,
            c:"ms = results[{0}]; ms = parseInt(ms, 10)/Math.pow(10, ms.length - 3);\n",
            s:"(\\d+)" // decimal fraction of a second (minimum = 1 digit, maximum = unlimited)
        },
        O: {
            g:1,
            c:[
                "o = results[{0}];",
                "var sn = o.substring(0,1),", // get + / - sign
                    "hr = o.substring(1,3)*1 + Math.floor(o.substring(3,5) / 60),", // get hours (performs minutes-to-hour conversion also, just in case)
                    "mn = o.substring(3,5) % 60;", // get minutes
                "o = ((-12 <= (hr*60 + mn)/60) && ((hr*60 + mn)/60 <= 14))? (sn + Ext.String.leftPad(hr, 2, '0') + Ext.String.leftPad(mn, 2, '0')) : null;\n" // -12hrs <= GMT offset <= 14hrs
            ].join("\n"),
            s: "([+\-]\\d{4})" // GMT offset in hrs and mins
        },
        P: {
            g:1,
            c:[
                "o = results[{0}];",
                "var sn = o.substring(0,1),", // get + / - sign
                    "hr = o.substring(1,3)*1 + Math.floor(o.substring(4,6) / 60),", // get hours (performs minutes-to-hour conversion also, just in case)
                    "mn = o.substring(4,6) % 60;", // get minutes
                "o = ((-12 <= (hr*60 + mn)/60) && ((hr*60 + mn)/60 <= 14))? (sn + Ext.String.leftPad(hr, 2, '0') + Ext.String.leftPad(mn, 2, '0')) : null;\n" // -12hrs <= GMT offset <= 14hrs
            ].join("\n"),
            s: "([+\-]\\d{2}:\\d{2})" // GMT offset in hrs and mins (with colon separator)
        },
        T: {
            g:0,
            c:null,
            s:"[A-Z]{1,4}" // timezone abbrev. may be between 1 - 4 chars
        },
        Z: {
            g:1,
            c:"zz = results[{0}] * 1;\n" // -43200 <= UTC offset <= 50400
                  + "zz = (-43200 <= zz && zz <= 50400)? zz : null;\n",
            s:"([+\-]?\\d{1,5})" // leading '+' sign is optional for UTC offset
        },
        c: function() {
            var calc = [],
                arr = [
                    utilDate.formatCodeToRegex("Y", 1), // year
                    utilDate.formatCodeToRegex("m", 2), // month
                    utilDate.formatCodeToRegex("d", 3), // day
                    utilDate.formatCodeToRegex("h", 4), // hour
                    utilDate.formatCodeToRegex("i", 5), // minute
                    utilDate.formatCodeToRegex("s", 6), // second
                    {c:"ms = results[7] || '0'; ms = parseInt(ms, 10)/Math.pow(10, ms.length - 3);\n"}, // decimal fraction of a second (minimum = 1 digit, maximum = unlimited)
                    {c:[ // allow either "Z" (i.e. UTC) or "-0530" or "+08:00" (i.e. UTC offset) timezone delimiters. assumes local timezone if no timezone is specified
                        "if(results[8]) {", // timezone specified
                            "if(results[8] == 'Z'){",
                                "zz = 0;", // UTC
                            "}else if (results[8].indexOf(':') > -1){",
                                utilDate.formatCodeToRegex("P", 8).c, // timezone offset with colon separator
                            "}else{",
                                utilDate.formatCodeToRegex("O", 8).c, // timezone offset without colon separator
                            "}",
                        "}"
                    ].join('\n')}
                ];

            for (var i = 0, l = arr.length; i < l; ++i) {
                calc.push(arr[i].c);
            }

            return {
                g:1,
                c:calc.join(""),
                s:[
                    arr[0].s, // year (required)
                    "(?:", "-", arr[1].s, // month (optional)
                        "(?:", "-", arr[2].s, // day (optional)
                            "(?:",
                                "(?:T| )?", // time delimiter -- either a "T" or a single blank space
                                arr[3].s, ":", arr[4].s,  // hour AND minute, delimited by a single colon (optional). MUST be preceded by either a "T" or a single blank space
                                "(?::", arr[5].s, ")?", // seconds (optional)
                                "(?:(?:\\.|,)(\\d+))?", // decimal fraction of a second (e.g. ",12345" or ".98765") (optional)
                                "(Z|(?:[-+]\\d{2}(?::)?\\d{2}))?", // "Z" (UTC) or "-0530" (UTC offset without colon delimiter) or "+08:00" (UTC offset with colon delimiter) (optional)
                            ")?",
                        ")?",
                    ")?"
                ].join("")
            };
        },
        U: {
            g:1,
            c:"u = parseInt(results[{0}], 10);\n",
            s:"(-?\\d+)" // leading minus sign indicates seconds before UNIX epoch
        }
    },

    //Old Ext.Date prototype methods.
    // private
    dateFormat: function(date, format) {
        return utilDate.format(date, format);
    },

    format: function(date, format) {
        if (utilDate.formatFunctions[format] == null) {
            utilDate.createFormat(format);
        }
        var result = utilDate.formatFunctions[format].call(date);
        return result + '';
    },

    /**
     * Get the timezone abbreviation of the current date (equivalent to the format specifier 'T').
     *
     * Note: The date string returned by the javascript Date object's toString() method varies
     * between browsers (e.g. FF vs IE) and system region settings (e.g. IE in Asia vs IE in America).
     * For a given date string e.g. "Thu Oct 25 2007 22:55:35 GMT+0800 (Malay Peninsula Standard Time)",
     * getTimezone() first tries to get the timezone abbreviation from between a pair of parentheses
     * (which may or may not be present), failing which it proceeds to get the timezone abbreviation
     * from the GMT offset portion of the date string.
     * @return {String} The abbreviated timezone name (e.g. 'CST', 'PDT', 'EDT', 'MPST' ...).
     */
    getTimezone : function(date) {
        // the following list shows the differences between date strings from different browsers on a WinXP SP2 machine from an Asian locale:
        //
        // Opera  : "Thu, 25 Oct 2007 22:53:45 GMT+0800" -- shortest (weirdest) date string of the lot
        // Safari : "Thu Oct 25 2007 22:55:35 GMT+0800 (Malay Peninsula Standard Time)" -- value in parentheses always gives the correct timezone (same as FF)
        // FF     : "Thu Oct 25 2007 22:55:35 GMT+0800 (Malay Peninsula Standard Time)" -- value in parentheses always gives the correct timezone
        // IE     : "Thu Oct 25 22:54:35 UTC+0800 2007" -- (Asian system setting) look for 3-4 letter timezone abbrev
        // IE     : "Thu Oct 25 17:06:37 PDT 2007" -- (American system setting) look for 3-4 letter timezone abbrev
        //
        // this crazy regex attempts to guess the correct timezone abbreviation despite these differences.
        // step 1: (?:\((.*)\) -- find timezone in parentheses
        // step 2: ([A-Z]{1,4})(?:[\-+][0-9]{4})?(?: -?\d+)?) -- if nothing was found in step 1, find timezone from timezone offset portion of date string
        // step 3: remove all non uppercase characters found in step 1 and 2
        return date.toString().replace(/^.* (?:\((.*)\)|([A-Z]{1,4})(?:[\-+][0-9]{4})?(?: -?\d+)?)$/, "$1$2").replace(/[^A-Z]/g, "");
    },

    /**
     * Get the offset from GMT of the current date (equivalent to the format specifier 'O').
     * @param {Boolean} colon (optional) true to separate the hours and minutes with a colon (defaults to false).
     * @return {String} The 4-character offset string prefixed with + or - (e.g. '-0600').
     */
    getGMTOffset : function(date, colon) {
        var offset = date.getTimezoneOffset();
        return (offset > 0 ? "-" : "+")
            + Ext.String.leftPad(Math.floor(Math.abs(offset) / 60), 2, "0")
            + (colon ? ":" : "")
            + Ext.String.leftPad(Math.abs(offset % 60), 2, "0");
    },

    /**
     * Get the numeric day number of the year, adjusted for leap year.
     * @return {Number} 0 to 364 (365 in leap years).
     */
    getDayOfYear: function(date) {
        var num = 0,
            d = Ext.Date.clone(date),
            m = date.getMonth(),
            i;

        for (i = 0, d.setDate(1), d.setMonth(0); i < m; d.setMonth(++i)) {
            num += utilDate.getDaysInMonth(d);
        }
        return num + date.getDate() - 1;
    },

    /**
     * Get the numeric ISO-8601 week number of the year.
     * (equivalent to the format specifier 'W', but without a leading zero).
     * @return {Number} 1 to 53
     */
    getWeekOfYear : (function() {
        // adapted from http://www.merlyn.demon.co.uk/weekcalc.htm
        var ms1d = 864e5, // milliseconds in a day
            ms7d = 7 * ms1d; // milliseconds in a week

        return function(date) { // return a closure so constants get calculated only once
            var DC3 = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() + 3) / ms1d, // an Absolute Day Number
                AWN = Math.floor(DC3 / 7), // an Absolute Week Number
                Wyr = new Date(AWN * ms7d).getUTCFullYear();

            return AWN - Math.floor(Date.UTC(Wyr, 0, 7) / ms7d) + 1;
        };
    })(),

    /**
     * Checks if the current date falls within a leap year.
     * @return {Boolean} True if the current date falls within a leap year, false otherwise.
     */
    isLeapYear : function(date) {
        var year = date.getFullYear();
        return !!((year & 3) == 0 && (year % 100 || (year % 400 == 0 && year)));
    },

    /**
     * Get the first day of the current month, adjusted for leap year.  The returned value
     * is the numeric day index within the week (0-6) which can be used in conjunction with
     * the {@link #monthNames} array to retrieve the textual day name.
     * Example:
     * <pre><code>
var dt = new Date('1/10/2007');
console.log(Ext.Date.dayNames[dt.getFirstDayOfMonth()]); //output: 'Monday'
</code></pre>
     * @return {Number} The day number (0-6).
     */
    getFirstDayOfMonth : function(date) {
        var day = (date.getDay() - (date.getDate() - 1)) % 7;
        return (day < 0) ? (day + 7) : day;
    },

    /**
     * Get the last day of the current month, adjusted for leap year.  The returned value
     * is the numeric day index within the week (0-6) which can be used in conjunction with
     * the {@link #monthNames} array to retrieve the textual day name.
     * Example:
     * <pre><code>
var dt = new Date('1/10/2007');
console.log(Ext.Date.dayNames[dt.getLastDayOfMonth()]); //output: 'Wednesday'
</code></pre>
     * @return {Number} The day number (0-6).
     */
    getLastDayOfMonth : function(date) {
        return utilDate.getLastDateOfMonth(date).getDay();
    },


    /**
     * Get the date of the first day of the month in which this date resides.
     * @return {Date}
     */
    getFirstDateOfMonth : function(date) {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    },

    /**
     * Get the date of the last day of the month in which this date resides.
     * @return {Date}
     */
    getLastDateOfMonth : function(date) {
        return new Date(date.getFullYear(), date.getMonth(), utilDate.getDaysInMonth(date));
    },

    /**
     * Get the number of days in the current month, adjusted for leap year.
     * @return {Number} The number of days in the month.
     */
    getDaysInMonth: (function() {
        var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        return function(date) { // return a closure for efficiency
            var m = date.getMonth();

            return m == 1 && utilDate.isLeapYear(date) ? 29 : daysInMonth[m];
        };
    })(),

    /**
     * Get the English ordinal suffix of the current day (equivalent to the format specifier 'S').
     * @return {String} 'st, 'nd', 'rd' or 'th'.
     */
    getSuffix : function(date) {
        switch (date.getDate()) {
            case 1:
            case 21:
            case 31:
                return "st";
            case 2:
            case 22:
                return "nd";
            case 3:
            case 23:
                return "rd";
            default:
                return "th";
        }
    },

    /**
     * Creates and returns a new Date instance with the exact same date value as the called instance.
     * Dates are copied and passed by reference, so if a copied date variable is modified later, the original
     * variable will also be changed.  When the intention is to create a new variable that will not
     * modify the original instance, you should create a clone.
     *
     * Example of correctly cloning a date:
     * <pre><code>
//wrong way:
var orig = new Date('10/1/2006');
var copy = orig;
copy.setDate(5);
console.log(orig);  //returns 'Thu Oct 05 2006'!

//correct way:
var orig = new Date('10/1/2006');
var copy = orig.clone();
copy.setDate(5);
console.log(orig);  //returns 'Thu Oct 01 2006'
</code></pre>
     * @return {Date} The new Date instance.
     */
    clone : function(date) {
        return new Date(date.getTime());
    },

    /**
     * Checks if the current date is affected by Daylight Saving Time (DST).
     * @return {Boolean} True if the current date is affected by DST.
     */
    isDST : function(date) {
        // adapted from http://sencha.com/forum/showthread.php?p=247172#post247172
        // courtesy of @geoffrey.mcgill
        return new Date(date.getFullYear(), 0, 1).getTimezoneOffset() != date.getTimezoneOffset();
    },

    /**
     * Attempts to clear all time information from this Date by setting the time to midnight of the same day,
     * automatically adjusting for Daylight Saving Time (DST) where applicable.
     * (note: DST timezone information for the browser's host operating system is assumed to be up-to-date)
     * @param {Boolean} clone true to create a clone of this date, clear the time and return it (defaults to false).
     * @return {Date} this or the clone.
     */
    clearTime : function(date, clone) {
        if (clone) {
            return Ext.Date.clearTime(Ext.Date.clone(date));
        }

        // get current date before clearing time
        var d = date.getDate();

        // clear time
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);

        if (date.getDate() != d) { // account for DST (i.e. day of month changed when setting hour = 0)
            // note: DST adjustments are assumed to occur in multiples of 1 hour (this is almost always the case)
            // refer to http://www.timeanddate.com/time/aboutdst.html for the (rare) exceptions to this rule

            // increment hour until cloned date == current date
            for (var hr = 1, c = utilDate.add(date, Ext.Date.HOUR, hr); c.getDate() != d; hr++, c = utilDate.add(date, Ext.Date.HOUR, hr));

            date.setDate(d);
            date.setHours(c.getHours());
        }

        return date;
    },

    /**
     * Provides a convenient method for performing basic date arithmetic. This method
     * does not modify the Date instance being called - it creates and returns
     * a new Date instance containing the resulting date value.
     *
     * Examples:
     * <pre><code>
// Basic usage:
var dt = Ext.Date.add(new Date('10/29/2006'), Ext.Date.DAY, 5);
console.log(dt); //returns 'Fri Nov 03 2006 00:00:00'

// Negative values will be subtracted:
var dt2 = new Date('10/1/2006').add(Ext.Date.DAY, -5);
console.log(dt2); //returns 'Tue Sep 26 2006 00:00:00'

// You can even chain several calls together in one line:
var dt3 = new Date('10/1/2006').add(Ext.Date.DAY, 5).add(Ext.Date.HOUR, 8).add(Ext.Date.MINUTE, -30);
console.log(dt3); //returns 'Fri Oct 06 2006 07:30:00'
</code></pre>
     *
     * @param {String} interval A valid date interval enum value.
     * @param {Number} value The amount to add to the current date.
     * @return {Date} The new Date instance.
     */
    add : function(date, interval, value) {
        var d = Ext.Date.clone(date),
            Date = Ext.Date;
        if (!interval || value === 0) return d;

        switch(interval.toLowerCase()) {
            case Ext.Date.MILLI:
                d.setMilliseconds(d.getMilliseconds() + value);
                break;
            case Ext.Date.SECOND:
                d.setSeconds(d.getSeconds() + value);
                break;
            case Ext.Date.MINUTE:
                d.setMinutes(d.getMinutes() + value);
                break;
            case Ext.Date.HOUR:
                d.setHours(d.getHours() + value);
                break;
            case Ext.Date.DAY:
                d.setDate(d.getDate() + value);
                break;
            case Ext.Date.MONTH:
                var day = date.getDate();
                if (day > 28) {
                    day = Math.min(day, Ext.Date.getLastDateOfMonth(Ext.Date.add(Ext.Date.getFirstDateOfMonth(date), 'mo', value)).getDate());
                }
                d.setDate(day);
                d.setMonth(date.getMonth() + value);
                break;
            case Ext.Date.YEAR:
                d.setFullYear(date.getFullYear() + value);
                break;
        }
        return d;
    },

    /**
     * Checks if this date falls on or between the given start and end dates.
     * @param {Date} start Start date
     * @param {Date} end End date
     * @return {Boolean} true if this date falls on or between the given start and end dates.
     */
    between : function(date, start, end) {
        var t = date.getTime();
        return start.getTime() <= t && t <= end.getTime();
    },

    //Maintains compatibility with old static and prototype window.Date methods.
    compat: function() {
        var nativeDate = window.Date,
            p, u,
            statics = ['useStrict', 'formatCodeToRegex', 'parseFunctions', 'parseRegexes', 'formatFunctions', 'y2kYear', 'MILLI', 'SECOND', 'MINUTE', 'HOUR', 'DAY', 'MONTH', 'YEAR', 'defaults', 'dayNames', 'monthNames', 'monthNumbers', 'getShortMonthName', 'getShortDayName', 'getMonthNumber', 'formatCodes', 'isValid', 'parseDate', 'getFormatCode', 'createFormat', 'createParser', 'parseCodes'],
            proto = ['dateFormat', 'format', 'getTimezone', 'getGMTOffset', 'getDayOfYear', 'getWeekOfYear', 'isLeapYear', 'getFirstDayOfMonth', 'getLastDayOfMonth', 'getDaysInMonth', 'getSuffix', 'clone', 'isDST', 'clearTime', 'add', 'between'];

        //Append statics
        Ext.Array.forEach(statics, function(s) {
            nativeDate[s] = utilDate[s];
        });

        //Append to prototype
        Ext.Array.forEach(proto, function(s) {
            nativeDate.prototype[s] = function() {
                var args = Array.prototype.slice.call(arguments);
                args.unshift(this);
                return utilDate[s].apply(utilDate, args);
            };
        });
    }
};

var utilDate = Ext.Date;

})();
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
         * @markdown
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
            var originalFn;

            if (fn.$owner !== undefined && fn !== Ext.emptyFn) {
                originalFn = fn;

                fn = function() {
                    return originalFn.apply(this, arguments);
                };
            }

            var className;
            className = Ext.getClassName(this);
            if (className) {
                fn.displayName = className + '#' + name;
            }
            fn.$owner = this;
            fn.$name = name;

            this.prototype[name] = fn;
        },

        /**
         * @private
         */
        borrowMethod: function(name, fn) {
            if (fn.$owner === undefined) {
                this.ownMethod(name, fn);
            }
            else {
                this.prototype[name] = fn;
            }
        },

        /**
         * Add / override static properties of this class.

    Ext.define('My.cool.Class', {
        ...
    });

    My.cool.Class.addStatics({
        someProperty: 'someValue',      // My.cool.Class.someProperty = 'someValue'
        method1: function() { ... },    // My.cool.Class.method1 = function() { ... };
        method2: function() { ... }     // My.cool.Class.method2 = function() { ... };
    });

         * @property addStatics
         * @static
         * @type Function
         * @param {Object} members
         * @markdown
         */
        addStatics: function(members) {
            for (var name in members) {
                if (members.hasOwnProperty(name)) {
                    this[name] = members[name];
                }
            }

            return this;
        },

        /**
         * Add / override prototype properties of this class.

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

         * @property extend
         * @static
         * @type Function
         * @param {Object} members
         * @markdown
         */
        extend: function(members) {
            var name, i, member;

            for (name in members) {
                if (members.hasOwnProperty(name)) {
                    member = members[name];

                    if (member instanceof Function) {
                        this.ownMethod(name, member);
                    }
                    else {
                        this.prototype[name] = member;
                    }
                }
            }

            if (Ext.enumerables) {
                var enumerables = Ext.enumerables;

                for (i = enumerables.length; i--;) {
                    name = enumerables[i];

                    if (members.hasOwnProperty(name)) {
                        this.ownMethod(name, members[name]);
                    }
                }
            }

            return this;
        },

        /**
         * This method is deprecated, please use {@link Ext.Base#extend} instead
         */
        implement: function() {
            if (Ext.isDefined(Ext.global.console)) {
                Ext.global.console.warn("[DEPRECATED][Ext.Base] Class.implement is deprecated, please use Class.extend instead");
                return this.extend.apply(this, arguments);
            }
        },

        /**
         * Add / override prototype properties of this class. This method is similar to {@link Ext.Base#extend},
         * except that it stores the reference of the overridden method which can be called later on via {@link Ext.Base#callOverridden}

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

         * @property override
         * @static
         * @type Function
         * @param {String/Object} name See {@link Ext.Function#flexSetter flexSetter}
         * @param {Mixed} value See {@link Ext.Function#flexSetter flexSetter}
         * @markdown
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
         * Get the current class' name in string format.

    Ext.define('My.cool.Class', {
        constructor: function() {
            alert(this.self.getName()); // alerts 'My.cool.Class'
        }
    });

         * @return {String} className
         * @markdown
         */
        getName: function() {
            return Ext.getClassName(this);
        },

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
        if (!(newClass instanceof Function)) {
            createdFn = classData;
            classData = newClass;
            newClass = function() {
                return this.constructor.apply(this, arguments);
            };
        }

        var self = this.constructor,
            preprocessors = (classData.preprocessors || self.getDefaultPreprocessors()).slice(),
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
                if (data.config && cls.prototype.config) {
                    Ext.Object.merge(cls.prototype.config, data.config);
                    delete data.config;
                }

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

        /**
         * @cfg {String} extend

The name of the class to extend.

    Ext.define('Developer', {
         extend: 'Person'
    });
    
         * @markdown
         */
        extend: function(cls, data, fn) {
            var extend = data.extend,
                base = Ext.Base,
                basePrototype = base.prototype,
                temp = function() {},
                parent, i, k, ln, staticName, parentStatics,
                parentPrototype, clsPrototype;

            if (extend !== undefined && extend !== Object) {
                parent = extend;
            }
            else {
                parent = base;
            }

            parentPrototype = parent.prototype;

            temp.prototype = parentPrototype;
            cls.prototype = new temp();

            clsPrototype = cls.prototype;

            if (!('$class' in parent)) {
                for (i in basePrototype) {
                    if (!parentPrototype[i]) {
                        parentPrototype[i] = basePrototype[i];
                    }
                }
            }

            clsPrototype.self = cls;

            if (data.hasOwnProperty('constructor')) {
                clsPrototype.constructor = cls;
            }
            else {
                clsPrototype.constructor = parentPrototype.constructor;
            }

            cls.superclass = clsPrototype.superclass = parentPrototype;

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
            Ext.Object.merge(clsPrototype.config, parentPrototype.config || {});

            if (fn) {
                fn.call(this, cls, data);
            }
        },
        
        /**
         * @cfg {Object} mixins

An object containing key-value pairs where the key serves as an refrence if you need to access the 
mixin class directly. For example, say you want to write a method `sing` but you have already mixed
in a class `CanSing` that also has a method `sing`, you can access it as follows:

    Ext.define('CoolPerson', {

         mixins: {
             canSing: 'CanSing'
         },

         sing: function() {
             alert("Ahem....");
             this.mixins.canSing.sing.call(this);
         }
    });

         * @markdown
         */
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

        /**
         * @cfg {Object} config
         * Specifies the config options for a class and provides getters and setters for each option. See the intro docs for examples.
         */
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
        
        /**
         * @cfg {Object} statics
         * Static methods. See class introduction documentation for examples.
         */
        statics: function(cls, data, fn) {
            var statics = data.statics,
                inheritableStatics = data.inheritableStatics,
                name;

            if (statics !== undefined) {
                for (name in statics) {
                    if (statics.hasOwnProperty(name)) {
                        cls[name] = statics[name];
                    }
                }

                delete data.statics;
            }

            if (inheritableStatics !== undefined) {
                cls.$inheritableStatics = [];

                for (name in inheritableStatics) {
                    if (inheritableStatics.hasOwnProperty(name)) {
                        cls[name] = inheritableStatics[name];
                        cls.$inheritableStatics.push(name);
                    }
                }

                delete data.inheritableStatics;
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
         * @private
         */
        packages: {},

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

        registerPackage: Ext.Function.flexSetter(function(id, names) {
            this.packages[id] = Ext.Array.from(names);
        }),

        getPackage: function(id) {
            return this.packages[id];
        },

        hasPackage: function(id) {
            return this.packages.hasOwnProperty(id);
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
                if (aliasToNameMap.hasOwnProperty(alias) && Ext.isDefined(Ext.global.console)) {
                    Ext.global.console.log("[Ext.ClassManager] Overriding existing alias: '" + alias + "' " +
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

                if (Ext.isDefined(Ext.global.console)) {
                    Ext.global.console.warn("[Ext.Loader] Synchronously loading '" + className + "'; consider adding " +
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
                if (Ext.isDefined(Ext.global.console)) {
                    Ext.global.console.warn("[Ext.Loader] Synchronously loading '" + name + "'; consider adding " +
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
         * @private
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

    Ext.widget('window', {}); // Same as above, all you need is the traditional `xtype`

Behind the scene, {@link Ext.ClassManager} will automatically check whether the given class name / alias has already
 existed on the page. If it's not, Ext.Loader will immediately switch itself to synchronous mode and automatic load the given
 class and all its dependencies.

# Hybrid Loading - The Best of Both Worlds #

It has all the advantages combined from asynchronous and synchronous loading. The development flow is simple:

### Step 1: Start writing your application using synchronous approach. Ext.Loader will automatically fetch all
 dependencies on demand as they're needed during run-time. For example: ###

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

### Step 2: Along the way, when you need better debugging ability, watch the console for warnings like these: ###

    [Ext.Loader] Synchronously loading 'Ext.window.Window'; consider adding Ext.require('Ext.window.Window') before your application's code
    ClassManager.js:432
    [Ext.Loader] Synchronously loading 'Ext.layout.container.Border'; consider adding Ext.require('Ext.layout.container.Border') before your application's code

Simply copy and paste the suggested code above `Ext.onReady`, i.e:

    Ext.require('Ext.window.Window');
    Ext.require('Ext.layout.container.Border');

    Ext.onReady(...);

Everything should now load via asynchronous mode.

# Deployment #

It's important to note that dynamic loading should only be used during development on your local machines.
During production, all dependencies should be combined into one single JavaScript file. Ext.Loader makes
the whole process of transitioning from / to between development / maintenance and production as easy as
possible. Internally {@link Ext.Loader#history Ext.Loader.history} maintains the list of all dependencies your application
needs in the exact loading sequence. It's as simple as concatenating all files in this array into one,
then include it on top of your application.

This process will be automated with Sencha Command, to be released and documented towards Ext JS 4 Final.

 * @singleton
 * @markdown
 */

(function(Manager, Class, flexSetter) {

    var isNonBrowser = typeof window === 'undefined',
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
             * @cfg {Boolean} disableCaching
             * Appends current timestamp to script files to prevent caching
             * Defaults to true
             */
            disableCaching: true,

            /**
             * @cfg {String} disableCachingParam
             * The get parameter name for the cache buster's timestamp.
             * Defaults to '_dc'
             */
            disableCachingParam: '_dc',

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

         * Refer to {@link Ext.Loader#configs} for the list of possible properties
         *
         * @param {Object} config The config object to override the default values in {@link Ext.Loader#config}
         * @return {Ext.Loader} this
         * @markdown
         */
        setConfig: function(name, value) {
            if (Ext.isObject(name) && arguments.length === 1) {
                Ext.Object.merge(this.config, name);
            }
            else {
                this.config[name] = (Ext.isObject(value)) ? Ext.Object.merge(this.config[name], value) : value;
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
         * Translates a className to a file path by adding the
         * the proper prefix and converting the .'s to /'s. For example:

    Ext.Loader.setPath('My', '/path/to/My');

    alert(Ext.Loader.getPath('My.awesome.Class')); // alerts '/path/to/My/awesome/Class.js'

         * Note that the deeper namespace levels, if explicitly set, are always resolved first. For example:

    Ext.Loader.setPath({
        'My': '/path/to/lib',
        'My.awesome': '/other/path/for/awesome/stuff',
        'My.awesome.more': '/more/awesome/path'
    });

    alert(Ext.Loader.getPath('My.awesome.Class')); // alerts '/other/path/for/awesome/stuff/Class.js'

    alert(Ext.Loader.getPath('My.awesome.more.Class')); // alerts '/more/awesome/path/Class.js'

    alert(Ext.Loader.getPath('My.cool.Class')); // alerts '/path/to/lib/cool/Class.js'

    alert(Ext.Loader.getPath('Unknown.strange.Stuff')); // alerts 'Unknown/strange/Stuff.js'

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
                if (paths.hasOwnProperty(prefix) && prefix + '.' === className.substring(0, prefix.length + 1)) {
                    if (prefix.length > deepestPrefix.length) {
                        deepestPrefix = prefix;
                    }
                }
            }

            if (deepestPrefix) {
                className = className.substring(deepestPrefix.length + 1);

                if (paths.hasOwnProperty(deepestPrefix)) {
                    path = paths[deepestPrefix];
                }
            }

            if (path.length > 0) {
                path += '/';
            }

            path += className.replace(/\./g, "/") + '.js';

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
        loadScriptFile: function(url, onLoad, onError, scope, synchronous) {
            var me = this,
                noCacheUrl = url + (this.getConfig('disableCaching') ? ('?' + this.getConfig('disableCachingParam') + '=' + Ext.Date.now()) : ''),
                fileName = url.split('/').pop(),
                xhr, status, onScriptError;

            scope = scope || this;

            this.isLoading = true;

            if (!synchronous) {
                onScriptError = function() {
                    onError.call(me, "Failed loading '" + url + "', please verify that the file exists", synchronous);
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
                    onError.call(this, "Failed loading synchronously via XHR: '" + url + "'; please " +
                                       "verify that the file exists. " +
                                       "XHR status code: " + status, synchronous);
                }
            }
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
                i, j, ln, subLn;

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
                    throw new Error("[Ext.Loader][not enabled] Missing required class" +
                                    ((classNames.length > 1) ? "es" : "") + ": " + classNames.join(', '));
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


                    this.loadScriptFile(
                        filePath,
                        Ext.Function.pass(this.onFileLoaded, [className, filePath], this),
                        Ext.Function.pass(this.onFileLoadError, [className, filePath], this),
                        this,
                        this.syncModeEnabled
                    );
                }
            }

            return this;
        },

        /**
         *
         * @param packages
         * @param fn
         * @param scope
         */
        requirePackages: function(packages, fn, scope) {
            var classes = [],
                i, ln, pkg;

            packages = Ext.Array.from(packages);

            for (i = 0, ln = packages.length; i < ln; i++) {
                pkg = packages[i];

                if (!Manager.hasPackage(pkg)) {
                    throw new Error("[Ext.Loader.requirePackages] Unknown package: '" + pkg + "'");
                }

                classes = classes.concat(Manager.getPackage(pkg));
            }

            return this.require(classes, fn, scope);
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

            if (!this.syncModeEnabled && this.numPendingFiles === 0 && this.isLoading) {
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

                throw new Error("[Ext.Loader] The following classes are not declared even if their files have been " +
                                "loaded: '" + missingClasses.join("', '") + "'. Please check the source code of their " +
                                "corresponding files for possible typos: '" + missingPaths.join("', '")) + "'";
            }
        },

        /**
         * @private
         */
        onFileLoadError: function(className, filePath, errorMessage, isSynchronous) {
            this.numPendingFiles--;
            throw new Error("[Ext.Loader] " + errorMessage);
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
            var oldFn;

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
         * Toggle synchronous loading mode, use to explicitly set your prefer laading approach
         *
         * @param {Boolean} isEnabled true to enable synchronous loading, false to disable
         * @return {Ext.Loader} this
         */
        enableSyncMode: function(isEnabled) {
            this.syncModeEnabled = isEnabled;

            return this;
        }
    };

    /**
     * Convenient shortcut to {@link Ext.Loader Ext.Loader.require}. Please see the introduction documentation for
     * {@link Ext.Loader} for examples.
     * @member Ext
     * @method require
     */
    Ext.require = function() {
        return Loader.require.apply(Loader, arguments);
    };

    /**
     * Convenient shortcut to {@link Ext.Loader#requirePackages}
     * @member Ext
     * @method requirePackages
     */
    Ext.requirePackages = function() {
        return Loader.requirePackages.apply(Loader, arguments);
    };

    /**
     * Convenient shortcut to {@link Ext.Loader#exclude}
     * @member Ext
     * @method exclude
     */
    Ext.exclude = function() {
        return Loader.exclude.apply(Loader, arguments);
    };

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



