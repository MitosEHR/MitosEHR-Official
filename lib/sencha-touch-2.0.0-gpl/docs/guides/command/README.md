# Using Sencha Command

Sencha Command is a cross-platform command line tool that helps make developing applications with Sencha SDKs full of enjoyment. The tool consists of many useful automated tasks around the full life-cycle of your applications, from generating a fresh new project to deploying for production.

## Requirements

Please note that all commands only apply to Sencha Touch 2. Only OS X or Windows operating systems are currently supported.

Step 1: Setup an HTTP server on your computer if you don't have one running. This guide assumes that the host name is `localhost`, and the document root is at `/path/to/www`

Step 2: Download and install the [latest SDK Tools](http://www.sencha.com/products/sdk-tools) on your development machine. The latest version as of this writing is 2.0.0 beta.

Step 3: Download the [latest Sencha Touch 2 SDK](http://www.sencha.com/products/touch/). Extract the SDK to a local directory.

Step 4: Verify that Sencha Command is working properly on your machine:

Open a command line terminal, and run the following commands. Replace `/path/to/sencha-touch-2-sdk` with the actual path to the SDK that you extracted to previously, as mentioned in Step 2.

	cd /path/to/sencha-touch-2-sdk
	sencha

If a help message appears with the first line that says: "Sencha Command v2.0.0 for Sencha Touch 2", you are all set.

## Getting Started

All commands have the exact same syntax as follows:

    sencha [module] [action] [arguments...]

Some typical examples:

	# Minify app.js and write the output to app.minified.js
	sencha fs minify app.js app.minified.js

	# Create a new project based on the current SDK with namespace 'MyApp' and store inside '/path/to/www/myapp'
	sencha app create MyApp /path/to/www/myapp

To see a list of all available modules, simply type: `sencha` (when the current working directory is either the SDK directory or a project directory)

Similarly, to see a list of all available actions for a specific module, run: `sencha [module]`, for example: `sencha app`

Lastly, typing `sencha [module] [action]` prints out the full list of arguments for that typical action, for example: `sencha app create`

## Creating a New Application

The following command generates a new application with the namespace `MyApp` to `/path/to/www/myapp`:

	#  Make sure the current working directory is the Sencha Touch 2 SDK
	cd /path/to/sencha-touch-2-sdk
	sencha app create MyApp /path/to/www/myapp

To try it out, simply point your (WebKit-based) browser to `http://localhost/myapp`.

Congratulations, you have just created a fully working Sencha Touch 2 application in seconds!

## Understanding Your Application's Structure

The generated application should have the following file structure:

	app						# Your application's source code in MVC structure
		controller
		model
		profile
		store
		view
			Main.js			# The main view of the application

	resources
		css
			app.css			# The main stylesheet, compiled from app.scss

		sass
			app.scss		# The SASS file which compiles to app.css above,
							# includes Sencha Touch 2 theme by default

		icons				# Application icons for all mobile devices
							# When replacing these default images with your own,
							# make sure the file name and the dimension stays exactly the same
			...
		loading				# Application start-up screens for iOS devices
							# Similarly to icons, make sure the file names and
							# dimension stays the same
			...
		images				# Put other images used by your application here

	sdk						# A copy of the SDK from which this application was generated
		...

	index.html
	app.js					# Contains application's initialization logics
	app.json				# Configuration for deployment
	packager.json			# Configuration for native packaging

Both app.json and packager.json have inline documentation for each configurable item. Simply open the files and edit them as you need.

## Developing Your Application

`sencha generate` helps you quickly generate common MVC components such as: Controller, Model and Profile.

For example:

	#  Make sure the current working directory is the application's directory, i.e 'cd /path/to/www/myapp'
	sencha generate model User --fields=id:int,name,email

The command above will automatically generate a new Model class named `User` with 3 fields of `id`, `name` and `email` to app/model/User.js, and add its reference to your app.js.

## Deploying Your Application

Developing your application simply means editing source code and refreshing the browser. All source files are dynamically loaded on demand. There's no building process involved.

When it comes to deployment, Sencha Command provides 4 different build environment options, namely 'testing', 'package', 'production' and 'native':

 - 'testing' is meant for QA prior to production. All JavaScript and CSS source Files are bundled, but not minified, which makes it easier for debugging if needed
 - 'package' creates a self-contained, re-distributable production build that normally runs from local file system without the need for a web server
 - 'production' creates a production build that is normally hosted on a web server and serves multiple clients (devices). The build is offline-capable using HTML 5 application cache, and has built-in over-the-air delta updating feature
 - 'native' first generates a 'package' build, then packages it as a native application, ready to be deployed to native platforms

As an example, the following command generates a 'testing' build for your application:

	#  Make sure the current working directory is the application's directory you're deploying, i.e 'cd /path/to/www/myapp'
	sencha app build testing

And similarly when you're ready for production deployment:

	sencha app build production

The default deployment paths are taken from the `buildPaths` item inside `app.json`. For more details on optional arguments, run

	sencha app build

Sencha Command automates all optimizations for your application, including but not limited to:

- Resolving dependencies required by the application and only including exactly what is used for optimal file size / performance
- Enabling HTML 5 application cache via automatic generation of cache.manifest and resources checksum
- Minifying all JavaScript and CSS assets
- Storing all JavaScript and CSS assets inside Local Storage on first load, and patches them via delta updates between releases

As a result, your production build can load instantly on subsequent access and updates on-the-fly with minimal network transfer.

**Important Note**: The `cache.manifest` file is automatically generated for you. However, please make sure that your web server serves it with the correct `Content-Type` header of `text/cache-manifest`. To learn more about HTML 5 application cache, please refer to [this article](http://www.html5rocks.com/en/tutorials/appcache/beginner/).

## Packaging Your Application for Distribution on App Stores

`packager.json` contains all configurable values to package your application.

If you are using OS X and have Xcode installed, this one-liner will automatically package your application and run it on iOS Simulator:

	sencha app build native

For more details on working with `packager.json`, please refer to the [Native Package guide](#!/guide/native_packaging)











