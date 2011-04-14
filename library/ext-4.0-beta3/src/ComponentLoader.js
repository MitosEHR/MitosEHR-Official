/**
 * @class Ext.ComponentLoader
 * @extend Ext.ElementLoader
 * A class used to load remote content to a component. Sample usage:
 * <pre><code>
new Ext.Component({
    tpl: '{firstName} - {lastName}',
    loader: {
        url: 'myPage.php',
        renderer: 'data',
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
    
    extend: 'Ext.ElementLoader',

    statics: {
        Renderer: {
            Data: function(loader, response, active){
                var success = true;
                try {
                    loader.getTarget().update(Ext.decode(response.responseText));
                } catch (e) {
                    success = false;
                }
                return success;
            },

            Component: function(loader, response, active){
                var success = true,
                    target = loader.getTarget(),
                    items = [];

                //<debug>
                if (!target.isContainer) {
                    Ext.Error.raise({
                        target: target,
                        msg: 'Components can only be loaded into a container'
                    });
                }
                //</debug>

                try {
                    items = Ext.decode(response.responseText);
                } catch (e) {
                    success = false;
                }

                if (success) {
                    if (active.removeAll) {
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
     * @cfg {Ext.Component/String} target The target {@link Ext.Component} for the loader. Defaults to <tt>null</tt>.
     * If a string is passed it will be looked up via the id.
     */
    target: null,

    /**
     * @cfg {Mixed} loadMask True or a {@link Ext.LoadMask} configuration to enable masking during loading. Defaults to <tt>false</tt>.
     */
    loadMask: false,
    
    /**
     * @cfg {Boolean} scripts True to parse any inline script tags in the response. This only used when using the html
     * {@link #renderer}.
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
+ active - The active request

The function must return false is loading is not successful. Below is a sample of using a custom renderer:

    new Ext.Component({
        loader: {
            url: 'myPage.php',
            renderer: function(loader, response, active) {
                var text = response.responseText;
                loader.getTarget().update('The response is ' + text);
                return true;
            }
        }
    });
     * @markdown
     */
    renderer: 'html',

    /**
     * Set a {Ext.Component} as the target of this loader. Note that if the target is changed,
     * any active requests will be aborted.
     * @param {String/Ext.Component} target The component to be the target of this loader. If a string is passed
     * it will be looked up via its id.
     */
    setTarget: function(target){
        var me = this;
        
        if (Ext.isString(target)) {
            target = Ext.getCmp(target);
        }

        if (me.target && me.target != target) {
            me.abort();
        }
        me.target = target;
    },
    
    // inherit docs
    removeMask: function(){
        this.target.setLoading(false);
    },
    
    /**
     * Add the mask on the target
     * @private
     * @param {Mixed} mask The mask configuration
     */
    addMask: function(mask){
        this.target.setLoading(mask);
    },

    /**
     * Get the target of this loader.
     * @return {Ext.Component} target The target, null if none exists.
     */
    
    setOptions: function(active, options){
        active.removeAll = Ext.isDefined(options.removeAll) ? options.removeAll : this.removeAll;
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
                return Ext.ElementLoader.Renderer.Html;
        }
    }
});
