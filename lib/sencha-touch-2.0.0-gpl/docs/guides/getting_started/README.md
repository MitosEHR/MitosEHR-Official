# Getting Started with Sencha Touch 2

{@video vimeo 37974749}

**Note:** This guide will be updated to reflect the content of the video shortly.

## What is Sencha Touch?

Sencha Touch enables you to quickly and easily create HTML5 based mobile apps that work on Android, iOS and Blackberry devices and produce a native-app-like experience inside a browser.

## Things you'll need

Here's what you need to get started:

 - The free [Sencha Touch 2.0 SDK](http://www.sencha.com/products/touch/download/)
 - A web server running locally on your computer
 - A modern web browser; Chrome and Safari are recommended

Download and unzip the latest version of the SDK. Place the unzipped folder into your web server's document root. If you don't have a web server or aren't sure, we recommend using a simple one-click installer like [WAMP](http://www.wampserver.com/en/) or [MAMP](http://www.mamp.info/en/index.html).

Once you have the folder in the right place, open your web browser and point it to http://localhost/sencha-touch-folder (or wherever your web server is configured to serve from) and you should see the Sencha Touch Welcome page. If that's all working you're ready to start your first app.

## Starting your app

Sencha Touch apps work best when they follow the simple application structure guidelines we provide. This is a small set of conventions and classes that make writing maintainable apps simpler, especially when you work as part of a team.

The first step is to set up the simple folder structure that will house the app. Initially all you need is two files and a copy of Sencha Touch. By convention, these are:

* **index.html** - a simple HTML file that includes Sencha Touch and your application file
* **app.js** - a file where you define the app name, home screen icon, and what it's supposed to do on launch
* **touch** - a copy of the downloaded Sencha Touch folder

Let's start with the index.html file. Here's what it looks like:

    <!DOCTYPE html>
    <html>
    <head>
        <title>Getting Started</title>
        <link rel="stylesheet" href="touch/resources/css/sencha-touch.css" type="text/css">
        <script type="text/javascript" src="touch/builds/sencha-touch-all-debug.js"></script>
        <script type="text/javascript" src="app.js"></script>
    </head>
    <body></body>
    </html>

This is probably one of the simplest HTML pages you'll ever write. All it does is include Sencha Touch (the JavaScript file and its stylesheet), and your app.js. Note that the body is empty - we'll let Sencha Touch fill that up.

Next, let's look at the contents of our app.js file. We'll keep things simple to start and just call `alert` to make sure everything's working:

    @example raw miniphone
    Ext.application({
        name: 'Sencha',

        launch: function() {
            alert('launched');
        }
    });

That's all you need to get started. Now, launch Safari or Chrome and make sure it works as expected. You can also click the small Preview icon next to the example above to run it. So far it doesn't do very much, but the fact that the alert message pops up means Sencha Touch is on the page and the app launched.

The last thing we're going to do is create a {@link Ext.Panel Panel} with the time-honored Hello World. This is really simple, all we need to do is update our launch function to use Ext.create, like this:

    @example raw miniphone
    Ext.application({
        name: 'Sencha',

        launch: function() {
            Ext.create('Ext.Panel', {
                fullscreen: true,
                html: 'Hello World'
            });
        }
    });

## Next Steps

Now that we've put together the simplest of pages and achieved Hello World, it's time to create our first simple app. The next step is to go through the <a href="#!/guide/first_app">First Application guide</a>, which builds on what you've just done and builds a simple but powerful app in around 15 minutes.

If you'd like to skip ahead or find out more detailed information about other aspects of the framework we recommend checking out the following guides and resources:

### Guides

* [Components and Containers](#!/guide/components)
* [Intro to Applications](#!/guide/apps_intro)
* [The Layout System](#!/guide/layouts)
* [The Data Package](#!/guide/data)
* [What's New in Sencha Touch 2](#!/guide/whats_new)

### Application Examples

* [Kitchen Sink](#!/example/kitchen-sink)
* [Twitter](#!/example/twitter)
* [Kiva](#!/example/kiva)

### Component Examples

* [Carousel](#!/example/carousel)
* [Forms](#!/example/forms)
* [Date Picker](#!/example/pickers)
