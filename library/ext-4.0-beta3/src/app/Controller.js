/**
 * @class Ext.app.Controller
 * @constructor
 * 
 * Class documentation for the MVC classes will be present before 4.0 final, in the mean time please refer to the MVC
 * guide
 */
Ext.define('Ext.app.Controller', {
    /**
     * @cfg {Object} id The id of this controller. You can use this id when dispatching.
     */

    mixins: {
        observable: 'Ext.util.Observable'
    },

    constructor: function(config) {
        this.mixins.observable.constructor.call(this, config);

        Ext.apply(this, config || {});

        this.createGetters('model', this.models);
        this.createGetters('store', this.stores);
        this.createGetters('view', this.views);

        if (this.refs) {
            this.ref(this.refs);
        }
    },

    // Template method
    init: function(application) {},
    // Template method
    onLaunch: function(application) {},

    createGetters: function(type, refs) {
        type = Ext.String.capitalize(type);
        Ext.Array.each(refs, function(ref) {
            var fn = 'get',
                parts = ref.split('.');

            // Handle namespaced class names. E.g. feed.Add becomes getFeedAddView etc.
            Ext.Array.each(parts, function(part) {
                fn += Ext.String.capitalize(part);
            });
            fn += type;

            if (!this[fn]) {
                this[fn] = Ext.Function.pass(this['get' + type], [ref], this);
            }
            // Execute it right away
            this[fn](ref);
        },
        this);
    },

    ref: function(refs) {
        var me = this;
        refs = Ext.Array.from(refs);
        Ext.Array.each(refs, function(info) {
            var ref = info.ref,
                fn = 'get' + Ext.String.capitalize(ref);
            if (!me[fn]) {
                me[fn] = Ext.Function.pass(me.getRef, [ref, info], me);
            }
        });
    },

    getRef: function(ref, info, config) {
        this.refCache = this.refCache || {};
        info = info || {};
        config = config || {};

        Ext.apply(info, config);

        if (info.forceCreate) {
            return Ext.ComponentManager.create(info, 'component');
        }

        var me = this,
            selector = info.selector,
            cached = me.refCache[ref];

        if (!cached) {
            me.refCache[ref] = cached = Ext.ComponentQuery.query(info.selector)[0];
            if (!cached && info.autoCreate) {
                me.refCache[ref] = cached = Ext.ComponentManager.create(info, 'component');
            }
            if (cached) {
                cached.on('beforedestroy', function() {
                    me.refCache[ref] = null;
                });
            }
        }

        return cached;
    },

    control: function(selectors, listeners) {
        this.application.control(selectors, listeners, this);
    },

    getController: function(controller) {
        this.application.getController(controller);
    },

    getStore: function(store) {
        var namespace = (this.application && this.application.name || this.name) + '.store',
            returnStore;

        store = store.replace(namespace + '.', '');
        returnStore = Ext.StoreManager.get(store);

        if (Ext.isString(store) && !returnStore) {
            returnStore = Ext.factory({
                className: store,
                storeId: store
            },
            namespace);
        }
        return returnStore;
    },

    getModel: function(model) {
        var namespace = (this.application && this.application.name || this.name) + '.model.',
            returnModel;

        if (model.indexOf(namespace) === -1) {
            model = namespace + model;
        }
        returnModel = Ext.ModelManager.getModel(model);

        if (!returnModel) {
            Ext.syncRequire(model);

            returnModel = Ext.ModelManager.getModel(model);
        }

        return returnModel;
    },

    getView: function(view) {
        var namespace = (this.application && this.application.name || this.name) + '.view.',
            returnView;

        if (view.indexOf(namespace) === -1) {
            view = namespace + view;
        }
        returnView = Ext.ClassManager.get(view);

        if (!returnView) {
            Ext.syncRequire(view);

            returnView = Ext.ClassManager.get(view);
        }

        return returnView;
    }
});
