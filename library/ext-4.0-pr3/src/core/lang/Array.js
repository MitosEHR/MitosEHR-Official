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
