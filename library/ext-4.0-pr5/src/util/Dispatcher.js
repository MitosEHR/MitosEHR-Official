/**
 * @author Ed Spencer
 * @class Ext.util.Dispatcher
 * 
 * <p>The Dispatcher class is used to send requests through to a controller action. Usually, only a single Dispatcher
 * is required on the page, and by default a single instance is already created - {@link Ext.Dispatcher}. See the
 * {@link Ext.Dispatcher Dispatcher docs} for details on how this works.</p>
 * 
 * @constructor
 */
Ext.define('Ext.util.Dispatcher', {
    mixins: {
        observable: 'Ext.util.Observable'
    },
    
    constructor: function(config) {
        this.addEvents(
            /**
             * @event before-dispatch
             * Fires before an interaction is dispatched. Return false from any listen to cancel the dispatch
             * @param {Ext.Interaction} interaction The Interaction about to be dispatched
             */
            'before-dispatch',
            
            /**
             * @event dispatch
             * Fired once an Interaction has been dispatched
             * @param {Ext.Interaction} interaction The Interaction that was just dispatched
             */
            'dispatch'
        );
        
        this.mixins.observable.constructor.call(this, config);
    },
    
    /**
     * Dispatches a single interaction to a controller/action pair
     * @param {Object} options Options representing at least the controller and action to dispatch to
     */
    dispatch: function(options) {
        var interaction = Ext.create('Ext.Interaction', options),
            controller  = interaction.controller,
            action      = interaction.action,
            History     = Ext.util.History;
        
        if (this.fireEvent('before-dispatch', interaction) !== false) {
            if (History && options.historyUrl) {
                History.suspendEvents(false);
                History.add(options.historyUrl);
                Ext.defer(History.resumeEvents, 100, History);
            }
            
            if (controller && action) {
                controller[action].call(controller, interaction);
                interaction.dispatched = true;
            }
            
            this.fireEvent('dispatch', interaction);
        }
    },
    
    /**
     * Dispatches to a controller/action pair, adding a new url to the History stack
     */
    redirect: function(place, params) {
        var route, routeData, url;
        
        //enables us to send redirect(videoInstance) as a convenience for redirect("video", videoInstance)
        if (place instanceof Ext.data.Model) {
            params = place;
            place = place.constructor.modelName.toLowerCase();
        }
        
        if (typeof place == 'string') {
            route  = Ext.Router.routes.get(place);
            params = params || {};
            
            if (route) {
                if (params instanceof Ext.data.Model) {
                    routeData = params.data;
                    params = {
                        instance: params
                    };
                } else {
                    routeData = params || {};
                }
                
                url = route.urlFor(routeData);
                
                Ext.applyIf(params, {
                    controller: route.controller,
                    action    : route.action,
                    url       : url,
                    historyUrl: url
                });
                
                return this.dispatch(params);
            } else {
                route = Ext.Router.recognize(place);

                if (route) {
                    return this.dispatch(route);
                }
            }
        }
        
        return null;
    },
    
    /**
     * Convenience method which returns a function that calls Ext.Dispatcher.redirect. Useful when setting
     * up several listeners that should redirect, e.g.:
<pre><code>
myComponent.on({
    homeTap : Ext.Dispatcher.createRedirect('home'),
    inboxTap: Ext.Dispatcher.createRedirect('inbox'),
});
</code></pre>
     * @param {String/Object} url The url to create the redirect function for
     * @return {Function} The redirect function
     */
    createRedirect: function(url) {
        return function() {
            Ext.Dispatcher.redirect(url);
        };
    }
});
