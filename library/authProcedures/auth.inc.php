<?php
/* Auth Procedure
 * 
 * Description: This library intends to be simple it will not have any functions.
 * it's purpose is to validate the user and return a JSON formated data back 
 * to the logon window on success or failed.
 * 
 * Author: Gino Rivera Falú
 * Version: 0.0.1 
 */
//-------------------------------------------
// Start MitosEHR session 
//-------------------------------------------
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');
//-------------------------------------------
// Load all the necesary libraries
//-------------------------------------------
include_once("../../library/phpAES/AES.class.php");
include_once("../../repository/dataExchange/dataExchange.inc.php");
//-------------------------------------------
// Check that the username do not pass 
// the maximum limit of the field.
//
// NOTE:
// If this condition is met, the user did not
// use the logon form. Possible hack.
//-------------------------------------------
if (strlen($_REQUEST['authUser']) >= 26){
	echo "{ success: false, errors: { reason: 'Possible hack, please use the Logon Screen.' }}";
 	return;
}
//-------------------------------------------
// Check that the username do not pass 
// the maximum limit of the field.
//
// NOTE:
// If this condition is met, the user did not
// use the logon form. Possible hack.
//-------------------------------------------
if (strlen($_REQUEST['authPass']) >= 11){
	echo "{ success: false, errors: { reason: 'Possible hack, please use the Logon Screen.' }}";
 	return;
}
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
	include_once($fileConf);
	include_once("../../library/dbHelper/dbHelper.inc.php");
	$mitos_db = new dbHelper();
	$err = $mitos_db->getError();
	if (!is_array($err)){
		echo "{ success: false, errors: { reason: 'For some reason, I can\'t connect to the database.'}}";
		return;
	}
	// Do not stop here!, continue with the rest of the code.
} else {
	echo "{ success: false, errors: { reason: 'No configuration file found on the selected site.<br>Please contact support.'}}";
 	return;
}
//-------------------------------------------
// Convert the password to AES and validate
//-------------------------------------------
$aes = new AES($_SESSION['site']['AESkey']);
$ret = $aes->encrypt($_REQUEST['authPass']);
//-------------------------------------------
// Username & password match
//-------------------------------------------
$sql = "SELECT * FROM users 
		 WHERE username='" . $_REQUEST['authUser'] . "' 
		   AND password='" . $ret . "' 
		   AND authorized='1'
		 LIMIT 1";
$mitos_db->setSQL($sql);
$rec = $mitos_db->fetch();
if ($rec['username'] == ""){
	echo "{ success: false, errors: { reason: 'The username or password you provided is invalid.'}}";
	return;
} else {
	//-------------------------------------------
	// Change some User related variables and go
	//-------------------------------------------
	$_SESSION['user']['name'] = $rec['title'] . " " . $rec['lname'] . ", " . $rec['fname'] . " " . $rec['mname'];
	$_SESSION['user']['id'] = $rec['id'];
	$_SESSION['user']['email'] = $rec['email'];
	$_SESSION['user']['auth'] = true;
	//-------------------------------------------
	// Also fetch the current version of the
	// Application & Database
	//-------------------------------------------
	$sql = "SELECT * FROM version LIMIT 1";
	$mitos_db->setSQL($sql);
	$rec = $mitos_db->fetch();
	$_SESSION['ver']['codeName']= $rec['v_tag'];
	$_SESSION['ver']['major'] = $rec['v_major'];
	$_SESSION['ver']['rev'] = $rec['v_patch'];
	$_SESSION['ver']['minor'] = $rec['v_minor'];
	$_SESSION['ver']['database'] = $rec['v_database'];
	echo "{ success: true }";
	return;	
}
?>