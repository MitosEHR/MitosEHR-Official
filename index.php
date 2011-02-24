<?php

/* MitosEHR Starter
 * 
 * Description: This will start the application, if no sites are found
 * in the sites directory run the setup wizard, if a directory is found
 * run the login screen. When the logon is submitted it will validate
 * the user and start the main application
 * 
 * Author: Gino Rivera Falú
 * Ver: 0.0.2
 * 
 */

session_name ( "MitosEHR" );
session_start();
include_once("registry.php");

// Make the auth process
if ($_SESSION['user']['auth'] == TRUE){
	//----------------------------------------------------------------
	// Load the main screen
	//----------------------------------------------------------------
	include_once("interface/main/main_screen.ejs.php");
} else {
	//----------------------------------------------------------------
	// Browse the site dir
	//----------------------------------------------------------------
	$d = dir("sites/");
	while (false !== ($entry = $d->read())) { if ( $entry != "." && $entry != ".."){ $count++; } }
	//----------------------------------------------------------------
	// If no directory is found inside sites dir run the setup wizard
	// if a directory is found inside sites dir run the logon screen
	//----------------------------------------------------------------
	if( $count <= 0){
		include_once("interface/setup/setup.ejs.php");
	} else {
		include_once("interface/login/login.ejs.php");
	}	
}

?>