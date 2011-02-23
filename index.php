<?php

/* MitosEHR Starter
 * 
 * Description: This will start the application, if no sites are found
 * in the sites directory run the setup wizard, if a directory is found
 * run the login screen. When the logon is submitted it will validate
 * the user and start the main application
 * 
 * Author: Gino Rivera Falú
 * Ver: 0.0.1
 * 
 */

include_once("registry.php");

// Make the auth process
if ($_REQUEST['auth'] == TRUE){
	//----------------------------------------------------------------
	// Get the remaining configuration SESSION variables
	//----------------------------------------------------------------
	include_once("sites/" . $_REQUEST['choiseSite'] . "/conf.php");
	
	//----------------------------------------------------------------
	// Validate user
	// Include here all the necessary libraries to start 
	// the application
	//----------------------------------------------------------------
	include_once("library/I18n/I18n.inc.php");
	include_once("library/phpAES/AES.class.php");
	include_once("library/adoHelper/adoHelper.inc.php");
	include_once("repository/dataExchange/dataExchange.inc.php");
	$sql = "SELECT 
				* 
			FROM 
				users 
			WHERE 
				username='" . $_REQUEST['authUser'] . "' and 
				password='" . $_REQUEST['authPassword'] . "' and 
				authorized='1'";
	$rec = sqlStatement($sql);
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