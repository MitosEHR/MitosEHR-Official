<?php
/* Auth Procedure
 * 
 * Description: This library intends to be simple it will not have any function
 * it's purpose is to validate the user and return a JSON formated data back 
 * to the logon window on success or failed.
 * 
 * Author: Gino Rivera Falú
 * Version: 0.0.1 
 * 
 */

//-------------------------------------------
// Start MitosEHR session 
//-------------------------------------------
session_name ( "MitosEHR" );
session_start();
//-------------------------------------------
// Load all the necesary libraries
//-------------------------------------------
include_once("../../library/phpAES/AES.class.php");
include_once("../../repository/dataExchange/dataExchange.inc.php");
//-------------------------------------------
// Simple check username
//-------------------------------------------
if (!$_REQUEST['authUser']){
	echo "{ success: false, errors: { reason: 'The username field can not be in blank. Try again.' }}";
 	return;
}
//-------------------------------------------
// Simple check password
//------------------------------------------- 
if (!$_REQUEST['authPass']){
	echo "{ success: false, errors: { reason: 'The password field can not be in blank. Try again.' }}";
 	return;
}
//-------------------------------------------
// Find the AES key in the selected site
// And include the rest of the remaining 
// variables to connect to the database.
//-------------------------------------------
$_SESSION['site']['site'] = $_REQUEST['choiseSite'];
$fileConf = "../../sites/" . $_SESSION['site']['site'] . "/conf.php";
if (file_exists($fileConf)){
	include_once("../../sites/" . $_SESSION['site']['site'] . "/conf.php");
	include_once("../../library/dbHelper/dbHelper.inc.php");
	// Do not stop here!, continue with the rest of the code.
} else {
	echo "{ success: false, errors: { reason: 'No configuration file found on the select site, contact support.' }}";
 	return;
}
//-------------------------------------------
// Convert the password to AES and validate
//-------------------------------------------
$aes = new AES($_SESSION['site']['AESkey']);
$ret = $aes->encrypt($_REQUEST['authPass']);
$sql = "SELECT * FROM users WHERE 
			username='" . $_REQUEST['authUser'] . "' and 
			password='" . $ret . "' and 
			authorized='1'";
$rec = sqlStatement($sql);
if (!$rec['username']){
	echo "{ success: false, errors: { reason: 'The username or password you provided is invalid.}}";
	return;
} else {
	//-------------------------------------------
	// Change some User related variables and go
	//-------------------------------------------
	$_SESSION['user']['name'] = $rec['title'] . " " . $rec['lname'] . ", " . $rec['fname'] . " " . $rec['mname'];
	$_SESSION['user']['id'] = $rec['id'];
	$_SESSION['user']['email'] = $rec['email'];
	$_SESSION['user']['auth'] = true;
	echo "{ success: true }";
	return;	
}
?>