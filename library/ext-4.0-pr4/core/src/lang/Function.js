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
