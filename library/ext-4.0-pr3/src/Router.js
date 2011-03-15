/**
 * @author Ed Spencer
 * @class Ext.Router
 * @extends Ext.util.Observable
 * <p>The Router is used to map urls to controller/action pairs. It can be used whenever an 
 * application wishes to provide history and deep linking support. Every {@link Ext.Application} can set up Routes
 * using the default {@link Ext.Router} instance, supplying application-specific routes like this:</p>
 * 
<pre><code>
//Note the # in the url examples below
Ext.Router.draw(function(map) {
    //maps the url http://mydomain.com/#dashboard to the home controller's index action
    map.connect('dashboard', {controller: 'home', action: 'index'});

    //fallback route - would match routes like http://mydomain.com/#users/list to the 'users' controller's
    //'list' action
    map.connect(':controller/:action');
});
</code></pre>
 * 
 * <p>The Router is concerned only with the segment of the url after the hash (#) character. This segment is parsed
 * by the {@link Ext.Dispatcher Dispatcher} and passed to the Router's {@link #recognize} method. Most of the time you
 * will not need to modify any of the behavior of the Router - it is all handled internally by the application 
 * architecture.</p>
 * 
 * @singleton
 */
Ext.define('Ext.Router', {
    extend: 'Ext.util.Router',
    singleton: true
});