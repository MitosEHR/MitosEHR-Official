<?php

/* MitosEHR Starter
 * 
 * Description: This will start the application, if site setup is defined
 * run the login screen if not, run the setup wizard. Also validates the 
 * user.
 * 
 * Author: Gino Rivera Falú
 * 
 */

include_once("registry.php");

// Make the auth process
if ($_REQUEST['auth'] == TRUE){
	// Get the remaining configuration SESSION variables
	include_once("sites/" . $_REQUEST['choiseSite'] . "/conf.php");
	// Validate user
	include_once("library/adoHelper/adoHelper.inc.php");
	include_once("library/I18n/I18n.inc.php");
	include_once("repository/dataExchange/dataExchange.inc.php");
	include_once("library/phpAES/AES.class.php");
	$sql = "SELECT 
				* 
			FROM 
				users 
			WHERE 
				username='" . $_REQUEST['authUser'] . "' and 
				password='" . $_REQUEST['authPassword'] . "' and 
				authorized='1'";
	$rec = sqlStatement($sql);
	// Load the main screen
	include_once("interface/main/main_screen.ejs.php");
} else { // Show login or setup wizard
	if($_SESSION['site']['setup'] == FALSE){
		include_once("interface/login/login.ejs.php");
	} elseif($_SESSION['site']['setup'] == TRUE){
		include_once("interface/setup/setup.ejs.php");
	}	
}

?>