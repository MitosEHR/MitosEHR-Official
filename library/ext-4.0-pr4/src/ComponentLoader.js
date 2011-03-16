/**
 * @class Ext.ComponentLoader
 * A class used to load remote content to a component. Sample usage:
 * <pre><code>
new Ext.Component({
    tpl: '{firstName} - {lastName}',
    loader: {
        url: 'myPage.php',
        contentType: 'data',
        params: {
            userId: 1
        }
    }
});
 * </code></pre>
 * <p>
 * In general this class will not be instanced directly, rather a loader configuration will be passed to the
 * constructor of the {@link Ext.Component}
 * </p>
 */
Ext.define('Ext.ComponentLoader', {

    /* Begin Definitions */

    mixins: {
        observable: 'Ext.util.Observable'
    },

    uses: [
        'Ext.data.Connection',
        'Ext.Ajax'
    ],

    statics: {
        Renderer: {
            Html: function(loader, response, options){
                loader.target.update(response.responseText);
                return true;
            },

            Data: function(loader, response, options){
                var success = true;
                try {
                    loader.getTarget().update(Ext.decode(response.responseText));
                } catch (e) {
                    success = false;
                }
                return success;
            },

            Component: function(loader, response, options){
                var success = true,
                    target = loader.getTarget(),
                    items = [];

                if (!target.isContainer) {
                    throw 'Components can only be loader to a container';
                }

                try {
                    items = Ext.decode(response.responseText);
                } catch (e) {
                    success = false;
                }

                if (success) {
                    if (loader.removeAll) {
                        target.removeAll();
                    }
                    target.add(items);
                }
                return success;
            }
        }
    },

    /* End Definitions */

    /**
     * @cfg {String} url The url to retrieve the content from. Defaults to <tt>null</tt>.
     */
    url: null,

    /**
     * @cfg {Object} params Any params to be attached to the Ajax request. These parameters will
     * be overridden by any params in the load options. Defaults to <tt>null</tt>.
     */
    params: null,

    /**
     * @cfg {Object} baseParams Params that will be attached to every request. These parameters
     * will not be overridden by any params in the load options. Defaults to <tt>null</tt>.
     */
    baseParams: null,

    /**
     * @cfg {Boolean/Object} autoLoad True to have the loader make a request as soon as it is created. Defaults to <tt>false</tt>.
     * This argument can also be a set of options that will be passed to {@link #load} is called.
     */
    autoLoad: false,

    /**
     * @cfg {Ext.Component/String} target The target {@link Ext.Component} for the loader. Defaults to <tt>null</tt>.
     * If a string is passed it will be looked up via the id.
     */
    target: null,

    /**
     * @cfg {Mixed} loadMask True or a {@link Ext.LoadMask} configuration to enable masking during loading. Defaults to <tt>false</tt>.
     */
    loadMask: false,

    /**
     * @cfg {Object} ajaxOptions Any additional options to be passed to the request, for example timeout or headers. Defaults to <tt>null</tt>.
     */
    ajaxOptions: null,

    /**
     * @cfg {Boolean} removeAll True to remove all existing components when a load completes. This option is
     * only takes effect when the {@link #renderer} option is set to <tt>component</tt>. Defaults to <tt>false</tt>.
     */
    removeAll: false,

    /**
     * @cfg {Function} success A function to be called when a load request is successful.
     */

    /**
     * @cfg {Function} failure A function to be called when a load request fails.
     */

    /**
     * @cfg {Object} scope The scope to execute the {@link #success} and {@link #failure} functions in.
     */

    /**
     * @cfg {String/Function} renderer

The type of content that is to be loaded into, which can be one of 3 types:

+ **html** : Loads raw html content, see {@link Ext.Component#html}
+ **data** : Loads raw html content, see {@link Ext.Component#data}
+ **component** : Loads child {Ext.Component} instances. This option is only valid when used with a Container.

Defaults to `html`.

Alternatively, you can pass a function which is called with the following parameters.

+ loader - Loader instance
+ response - The server response
+ options - The request options

The function must return false is loading is not successful. Below is a sample of using a custom renderer:

    new Ext.Component({
        loader: {
            url: 'myPage.php',
            contentType: 'html',
            renderer: function(loader, response, options) {
                var text = response.responseText;
                loader.getTarget().update('The response is ' + text);
                return true;
            }
        }
    });
     * @markdown
     */
    renderer: 'html',

    isLoader: true,

    constructor: function(config) {
        config = config || {};
        Ext.apply(this, config);
        this.setTarget(this.target);
        this.addEvents(
            /**
             * @event beforeload
             * Fires before a load request is made to the server.
             * Returning false from an event listener can prevent the load
             * from occurring.
             * @param {Ext.ComponentLoader} this
             * @param {Object} options The options passed to the request
             */
            'beforeload',

            /**
             * @event exception
             * Fires after an unsuccessful load.
             * @param {Ext.ComponentLoader} this
             * @param {Object} response The response from the server
             * @param {Object} options The options passed to the request
             */
            'exception',

            /**
             * @event exception
             * Fires after a successful load.
             * @param {Ext.ComponentLoader} this
             * @param {Object} response The response from the server
             * @param {Object} options The options passed to the request
             */
            'load'
        );

        // don't pass config because we have already applied it.
        this.mixins.observable.constructor.call(this);

        if (this.autoLoad) {
            var autoLoad = this.autoLoad;
            if (autoLoad === true) {
                autoLoad = {};
            }
            this.load(autoLoad);
        }
    },

    /**
     * Set a {Ext.Component} as the target of this loader. Note that if the target is changed,
     * any active requests will be aborted.
     * @param {String/Ext.Component} target The component to be the target of this loader. If a string is passed
     * it will be looked up via its id.
     */
    setTarget: function(target){
        if (Ext.isString(target)) {
            target = Ext.getCmp(target);
        }

        if (this.target && this.target != target) {
            this.abort();
        }
        this.target = target;
    },

    /**
     * Get the target of this loader.
     * @return {Ext.Component} target The target, null if none exists.
     */
    getTarget: function(){
        return this.target || null;
    },

    /**
     * Aborts the active load request
     */
    abort: function(){
        var active = this.active;
        if (active !== undefined) {
            Ext.Ajax.abort(active.request);
            if (active.mask) {
                this.target.setLoading(false);
            }
            delete this.active;
        }
    },

    /**
     * Load new data from the server.
     * @param {Object} options The options for the request. They can be any configuration option that can be specified for
     * the class, with the exception of the target option. Note that any options passed to the method will override any
     * class defaults.
     */
    load: function(options) {
        if (!this.target) {
            throw 'A target is required when loading';
        }

        options = Ext.apply({}, options);

        var me = this,
            target = me.target,
            mask = Ext.isDefined(options.loadMask) ? options.loadMask : me.loadMask,
            params = Ext.apply({}, options.params),
            ajaxOptions = Ext.apply({}, options.ajaxOptions),
            callback = options.callback || me.callback,
            scope = options.scope || me.scope || me,
            request;

        Ext.applyIf(ajaxOptions, me.ajaxOptions);
        Ext.applyIf(options, ajaxOptions);

        Ext.applyIf(params, me.params);
        Ext.apply(params, me.baseParams);

        Ext.applyIf(options, {
            url: me.url
        });

        if (!options.url) {
            throw 'No URL specified';
        }

        Ext.apply(options, {
            scope: me,
            params: params,
            callback: me.onComplete
        });

        if (me.fireEvent('beforeload', me, options) === false) {
            return;
        }

        if (mask) {
            me.target.setLoading(mask);
        }

        request = Ext.Ajax.request(options);
        this.active = {
            request: request,
            options: options,
            mask: mask,
            scope: scope,
            callback: callback,
            success: options.success || me.success,
            failure: options.failure || me.failure,
            removeAll: options.removeAll || me.removeAll,
            renderer: options.renderer || me.renderer
        };
    },

    /**
     * Parse the response after the request completes
     * @private
     * @param {Object} options Ajax options
     * @param {Boolean} success Success status of the request
     * @param {Object} response The response object
     */
    onComplete: function(options, success, response) {
        var me = this,
            active = me.active,
            scope = active.scope,
            renderer = this.getRenderer(active.renderer),
            renderOptions = Ext.isObject(active.renderer) ? active.renderer : {};


        if (success) {
            success = renderer.call(this, this, response, renderOptions);
        }

        if (success) {
            Ext.callback(active.success, scope, [me, response, options]);
            me.fireEvent('load', me, response, options);
        } else {
            Ext.callback(active.failure, scope, [me, response, options]);
            me.fireEvent('exception', me, response, options);
        }
        Ext.callback(active.callback, scope, [me, success, response, options]);

        if (active.mask) {
            this.target.setLoading(false);
        }

        delete me.active;
    },

    /**
     * Gets the renderer to use
     * @private
     * @param {String/Function} renderer The renderer to use
     * @return {Function} A rendering function to use.
     */
    getRenderer: function(renderer){
        if (Ext.isFunction(renderer)) {
            return renderer;
        }

        var renderers = this.statics().Renderer;
        switch (renderer) {
            case 'component':
                return renderers.Component;
            case 'data':
                return renderers.Data;
            default:
                return renderers.Html;
        }
    },

    /**
     * Destroys the loader. Any active requests will be aborted.
     */
    destroy: function(){
        delete this.target;
        this.abort();
        this.clearListeners();
    }
});
