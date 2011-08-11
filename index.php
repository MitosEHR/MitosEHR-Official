<?php

/* MitosEHR Starter
 * 
 * Description: This will start the application, if no sites are found
 * in the sites directory run the setup wizard, if a directory is found
 * run the login screen. When the logon is submitted it will validate
 * the user and start the main application
 * 
 * Author: GI Technologies, 2011
 * Ver: 0.0.2
 * 
 */

//-------------------------------------------------------------------
// Startup the SESSION
// This will change in the future. 
// Maybe implement a SESSION Manager against the database.
//-------------------------------------------------------------------
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');
define('_MitosEXEC', 1);
//-------------------------------------------------------------------
// Startup the registry
// This contains SESSION Variables to use in the application
// and mobile_detect class is used to detect mobile browsers.
//-------------------------------------------------------------------
include_once("registry.php");
include_once("classes/Mobile_Detect.php");
$mobile = new Mobile_Detect();
//-------------------------------------------------------------------
// Make the auth process
//-------------------------------------------------------------------
if(isset($_SESSION['user']['auth'])){
	if ($_SESSION['user']['auth'] == true){
		//-----------------------------------------------------------
		// Load the i18n Library
		// Load the main screen
		//-----------------------------------------------------------
		include_once("classes/I18n.class.php");
        //-----------------------------------------------------------
        // if mobile go to mobile app, else go to app
        //-----------------------------------------------------------
        if (!$mobile->isMobile()) {

		    include_once("app_mobile/MitosApp2.ejs.php");
        }else{
            include_once("app/MitosApp.ejs.php");
        }
	}
//-------------------------------------------------------------------
// Make the logon process or Setup process
//-------------------------------------------------------------------
} else {
	//---------------------------------------------------------------
	// Browse the site dir first
	//---------------------------------------------------------------
	$count = 0;
	$d = dir("sites/");
	while (false !== ($entry = $d->read())) { if ( $entry != "." && $entry != ".."){ $count++; } }
	//---------------------------------------------------------------
	// If no directory is found inside sites dir run the setup wizard,
	// if a directory is found inside sites dir run the logon screen
	//---------------------------------------------------------------
	if( $count <= 0){
		include_once("install/install.ejs.php");
	} else {
        //-----------------------------------------------------------
        // if mobile go to mobile app, else go to app
        //-----------------------------------------------------------
        if (!$mobile->isMobile()) {
            include_once("app_mobile/login/login.ejs.php");
        }else{
            include_once("app/login/login.ejs.php");
        }
	}
}
?>