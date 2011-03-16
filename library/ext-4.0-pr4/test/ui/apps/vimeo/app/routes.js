/**
 * The routes.js file connects local urls (e.g. http://mydomain.com/#someUrl) to a controller action.
 * This allows the application to reinitialize itself if it is refreshed, and provides in-application
 * history support. Sample usage:
 * 
 * Connects http://myapp.com/#home to the index controller's overview action:
 * map.connect("home", {controller: 'index', action: 'overview'});
 * 
 * Connects urls like "images/myImage.jpg" to the images controller's show action, passing
 * "myImage.jpg" as the "url" property of the options object each controller action receives:
 * map.connect("images/:url", {controller: 'images', action: 'show'});
 * 
 * Your app.js file can specify a defaultUrl config property, which will be dispatched to if there is
 * no specified url when the application first loads.
 */
Ext.Router.draw(function(map) {
    map.resources("Video");
});