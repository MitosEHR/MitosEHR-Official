/**
 * @class Ext.app.Application
 * @constructor
 *
 * Class documentation for the MVC classes will be present before 4.0 final, in the mean time please refer to the MVC
 * guide
 */
Ext.define('Ext.app.Application', {
    extend: 'Ext.app.Controller',

    requires: [
        'Ext.ModelManager',
        'Ext.data.Model',
        'Ext.data.StoreManager',
        'Ext.tip.QuickTipManager',
        'Ext.ComponentManager',
        'Ext.app.EventBus'
    ],

    /**
     * @cfg {Object} name The name of your application. This will also be the namespace for your views, controllers
     * models and stores. Don't use spaces or special characters in the name.
     */

    /**
     * @cfg {Object} scope The scope to execute the {@link #launch} function in. Defaults to the Application
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

    appFolder: 'app',

    /**
     * @cfg {String} autoCreateViewport Automatically loads and instantiates AppName.view.Viewport before firing the launch function.
     */
    autoCreateViewport: true,

    constructor: function(config) {
        config = config || {};
        Ext.apply(this, config);

        Ext.Loader.setPath(this.name, this.appFolder);
        if (this.paths) {
            Ext.Object.each(this.paths, function(key, value) {
                Ext.Loader.setPath(key, value);
            });
        }

        this.callParent(arguments);

        this.eventbus = Ext.create('Ext.app.EventBus');

        var controllers = this.controllers,
            ln = controllers.length,
            i, controller;

        this.controllers = Ext.create('Ext.util.MixedCollection');
        for (i = 0; i < ln; i++) {
            controller = this.getController(controllers[i]);
            controller.init(this);
        }

        this.bindReady();
    },

    getController: function(controller) {
        var namespace = this.name + '.controller',
            returnController;

        controller = controller.replace(namespace + '.', '');
        returnController = this.controllers.get(controller);

        if (Ext.isString(controller) && !returnController) {
            returnController = Ext.factory({
                className: controller,
                application: this,
                id: controller
            }, namespace);
            this.controllers.add(returnController);
        }

        return returnController;
    },

    control: function(selectors, listeners, controller) {
        this.eventbus.control(selectors, listeners, controller);
    },

    /**
     * @private
     * We bind this outside the constructor so that we can cancel it in the test environment
     */
    bindReady : function() {
        Ext.onReady(this.onReady, this);
    },

    /**
     * Called automatically when the page has completely loaded. This is an empty function that should be
     * overridden by each application that needs to take action on page load
     * @property launch
     * @type Function
     * @param {String} profile The detected {@link #profiles application profile}
     * @return {Boolean} By default, the Application will dispatch to the configured startup controller and
     * action immediately after running the launch function. Return false to prevent this behavior.
     */
    launch: Ext.emptyFn,

    /**
     * @private
     */
    onBeforeLaunch: function() {
        if (this.enableQuickTips) {
            Ext.tip.QuickTipManager.init();
        }

        if (this.autoCreateViewport) {
            this.getView('Viewport').create();
        }

        this.launch.call(this.scope || this);
        this.launched = true;
        this.fireEvent('launch', this);

        this.controllers.each(function(controller) {
            controller.onLaunch(this);
        }, this);
    },

    /**
     * @private
     * Called when the DOM is ready. Calls the application-specific launch function and dispatches to the
     * first controller/action combo
     */
    onReady: function() {
        this.onBeforeLaunch();
        return this;
    }
});
