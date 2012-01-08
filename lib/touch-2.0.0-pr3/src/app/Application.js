/**
 * Represents a Sencha Touch application, which is typically a single page app using a
 * {@link Ext.viewport.Viewport Viewport}. A typical Ext.app.Application might look like this:
 *
 *     Ext.application({
 *         name: 'MyApp',
 *
 *         launch: function() {
 *             Ext.create('Ext.Panel', {
 *                 fullscreen: true,
 *                 html: 'Hello World'
 *             });
 *         }
 *     });
 *
 * This does several things. First it creates a global variable called 'MyApp' - all of your Application's classes (such
 * as its Models, Views and Controllers) will reside under this single namespace, which drastically lowers the chances
 * of colliding global variables.
 *
 * When the page is ready and all of your JavaScript has loaded, your Application's {@link #property-launch} function is called,
 * at which time you can run the code that starts your app. Usually this consists of creating a Viewport, as we do in
 * the example above.
 *
 * ## Telling Application about the rest of the app
 *
 * Because an Ext.app.Application represents an entire app, we should tell it about the other parts of the app - namely
 * the Models, Views and Controllers that are bundled with the application. Let's say we have a blog management app; we
 * might have Models and Controllers for Posts and Comments, and Views for listing, adding and editing Posts and Comments.
 * Here's how we'd tell our Application about all these things:
 *
 *     Ext.application({
 *         name: 'Blog',
 *         models: ['Post', 'Comment'],
 *         controllers: ['Posts', 'Comments'],
 *
 *         launch: function() {
 *             ...
 *         }
 *     });
 *
 * Note that we didn't actually list the Views directly in the Application itself. This is because Views are managed by
 * Controllers, so it makes sense to keep those dependencies there. The Application will load each of the specified
 * Controllers using the pathing conventions laid out in the upcoming application architecture guide - in this case
 * expecting the controllers to reside in app/controller/Posts.js and app/controller/Comments.js. In turn, each
 * Controller simply needs to list the Views it uses and they will be automatically loaded. Here's how our Posts
 * controller like be defined:
 *
 *     Ext.define('MyApp.controller.Posts', {
 *         extend: 'Ext.app.Controller',
 *         views: ['posts.List', 'posts.Edit'],
 *
 *         //the rest of the Controller here
 *     });
 *
 * Because we told our Application about our Models and Controllers, and our Controllers about their Views, Sencha
 * Touch will automatically load all of our app files for us. This means we don't have to manually add script tags into
 * our html files whenever we add a new class, but more importantly it enables us to create a minimized build of our
 * entire application using the Ext JS 4 SDK Tools.
 *
 * ## Further Reading
 *
 * Applications are usually populated with Models, Views and Controllers. We're working on a set of guides around MVC
 * but in the meantime you can find more background information at:
 *
 * * {@link Ext.app.Controller}
 * * {@link Ext.data.Model}
 * * [Component (View) Guide](#!/guide/components)
 *
 * @docauthor Ed Spencer
 */
Ext.define('Ext.app.Application', {
    extend: 'Ext.app.Controller',
    alternateClassName: 'Ext.Application',

    requires: [
        'Ext.ModelManager',
        'Ext.data.Model',
        'Ext.data.StoreManager',
        'Ext.ComponentManager'
    ],

    /**
     * @event launch
     * Fires when the Application is launched
     * @param {Ext.app.Application} this
     */

    /**
     * @cfg {String} name The name of your application. This will also be the namespace for your views, controllers
     * models and stores. Don't use spaces or special characters in the name.
     */

    /**
     * @cfg {Object} scope The scope to execute the {@link #property-launch} function in. Defaults to the Application
     * instance.
     */
    scope: undefined,

    /**
     * @cfg {Boolean} enableQuickTips True to automatically set up Ext.tip.QuickTip support (defaults to true)
     */
    enableQuickTips: true,

    /**
     * @cfg {String} defaultUrl When the app is first loaded, this url will be redirected to. Defaults to undefined
     */

    /**
     * @cfg {String} appFolder The path to the directory which contains all application's classes.
     * This path will be registered via {@link Ext.Loader#setPath} for the namespace specified in the {@link #name name} config.
     * Defaults to 'app'
     */
    appFolder: 'app',

    /**
     * @cfg {Boolean} autoCreateViewport True to automatically load and instantiate AppName.view.Viewport class
     * before firing the launch function (defaults to false). Note that AppName.view.Viewport should not extend
     * the Ext.viewport.Viewport class, since that is a singleton class that always exists on the page. Instead
     * you usually want to extend Container or Panel and set the configuration option fullscreen to true. This
     * causes your AppName.view.Viewport to be automatically added as a child to the singleton Viewport.
     */
    autoCreateViewport: false,

    /**
     * Creates new Application.
     * @param {Object} config (optional) Config object.
     */
    constructor: function(config) {
        config = config || {};
        Ext.apply(this, config);

        var requires = config.requires || [],
            name = this.name;

        Ext.Loader.setPath(name, this.appFolder);

        if (this.paths) {
            Ext.Object.each(this.paths, function(key, value) {
                Ext.Loader.setPath(key, value);
            });
        }

        this.callParent(arguments);

        var controllers = Ext.Array.from(this.controllers),
            ln = controllers && controllers.length,
            i, controller;

        this.controllers = controllers;

        if (this.autoCreateViewport) {
            requires.push(this.getModuleClassName('Viewport', 'view'));
        }

        for (i = 0; i < ln; i++) {
            requires.push(this.getModuleClassName(controllers[i], 'controller'));
        }

        Ext.require(requires);

        Ext.onReady(this.onBeforeLaunch, this);
    },


    control: function(selectors, listeners, controller) {
        var dispatcher = this.getEventDispatcher(),
            selector, eventName, listener;

        for (selector in selectors) {
            if (selectors.hasOwnProperty(selector)) {
                listeners = selectors[selector];

                for (eventName in listeners) {
                    if (listeners.hasOwnProperty(eventName)) {
                        listener = listeners[eventName];

                        dispatcher.addListener('component', selector, eventName, listener, controller);
                    }
                }
            }
        }
    },


    /**
     * Called automatically when the when the application gets initialized. This is an empty function that
     * should be overridden by each application that needs to take action during initialization. When this
     * function gets called all the required classes are already loaded. Controllers have not been initialized
     * yet. The type of logic that you would usually want to put in this method is the creation of the viewport
     * (if autoCreateViewport has not been set to true), and any other logic you would like to do before
     * the controllers get initialized.
     * @property init
     * @type Function
     * @return {Boolean} By default, the Application will dispatch to the configured startup controller and
     * action immediately after running the launch function. Return false to prevent this behavior.
     */
    init: Ext.emptyFn,

    /**
     * Called automatically when the page has completely loaded. This is an empty function that should be
     * overridden by each application that needs to take action on page load. When this function gets called
     * all the required controllers are already instantiated and initialized and can be referenced.
     * If you have set autoCreateViewport to true, the viewport has also been instantiated and rendered at
     * this point.
     * In this method you can bind listeners to controllers and do things like loading stores and of course
     * any application wide setup that requires all controllers to be initialized.
     * @property launch
     * @type Function
     * @return {Boolean} By default, the Application will dispatch to the configured startup controller and
     * action immediately after running the launch function. Return false to prevent this behavior.
     */
    launch: Ext.emptyFn,

    /**
     * @private
     */
    onBeforeLaunch: function() {
        if (this.autoCreateViewport) {
            this.getView('Viewport').create();
        }

        var controllers = this.controllers,
            ln = controllers.length,
            i, controller;

        this.controllers = Ext.create('Ext.util.MixedCollection');

        this.init();

        for (i = 0; i < ln; i++) {
            controller = this.getController(controllers[i], false);
            controller.initConfig(controller.initialConfig);
            controller.init();
        }

        this.launch.call(this.scope || this);

        this.controllers.each(function(controller) {
            // Backwards compat
            if (controller.onLaunch) {
                controller.onLaunch(this);
            } else {
                controller.launch(this);
            }
        }, this);

        this.launched = true;
        this.fireEvent('launch', this);
    },

    getModuleClassName: function(name, type) {
        var namespace = Ext.Loader.getPrefix(name);

        if (namespace.length > 0 && namespace !== name) {
            return name;
        }

        return this.name + '.' + type + '.' + name;
    },

    getController: function(name, autoInit) {
        var controller = this.controllers.get(name);

        if (!controller) {
            controller = Ext.create(this.getModuleClassName(name, 'controller'), {
                application: this,
                id: name
            });

            this.controllers.add(controller);
                if (autoInit !== false) {
                controller.init();

                if (this.launched) {
                    if (controller.onLaunch) {
                        controller.onLaunch(this);
                    } else {
                        controller.launch(this);
                    }
                }
            }
        }

        return controller;
    },

    getStore: function(name) {
        var store = Ext.StoreManager.get(name);

        if (!store) {
            store = Ext.create(this.getModuleClassName(name, 'store'), {
                storeId: name
            });
        }

        return store;
    },

    getModel: function(model) {
        model = this.getModuleClassName(model, 'model');

        return Ext.ModelManager.getModel(model);
    },

    getView: function(view) {
        var viewClassName = this.getModuleClassName(view, 'view'),
            viewCls = Ext.ClassManager.get(viewClassName),
            xtype = view.toLowerCase() + 'view';

        if (viewCls) {
            viewCls.addXtype(view.toLowerCase() + 'view');
        }
        else {
            Ext.ClassManager.setAlias(viewClassName, 'widget.' + xtype);
        }

        return viewCls;
    },

    createViewInstance: function(view) {
        return this.getView(view).create();
    }
});
