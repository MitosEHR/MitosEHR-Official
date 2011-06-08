<?php
//--------------------------------------------------------------------------------------------------------------------------
// manage_messages.ejs.php
// v0.0.1
// Under GPLv3 License
//
// Integrated by: Ernesto Rodriguez. in 2011
//
// Remember, this file is called via the Framework Store, this is the AJAX thing.
//--------------------------------------------------------------------------------------------------------------------------

session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

include_once("../../../library/dbHelper/dbHelper.inc.php");
require_once("../../../library/phpAES/AES.class.php");
include_once('../../../repository/global_functions/global_funtions.php');

//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;

//------------------------------------------------------------------------------
// password to AES and validate
//------------------------------------------------------------------------------
$aes = new AES($_SESSION['site']['AESkey']);

//------------------------------------------------------------------------------
// Database class instance
//------------------------------------------------------------------------------
$mitos_db = new dbHelper();

// Setting defults incase no request is sent by sencha
$start = ($_REQUEST["start"] == null)? 0 : $_REQUEST["start"];
$count = ($_REQUEST["limit"] == null)? 10 : $_REQUEST["limit"];
$mitos_db->setSQL("SELECT *
				   FROM users 
				   WHERE users.authorized = 1 OR users.username != '' 
        		   ORDER BY username 
        		   LIMIT ".$start.",".$count);
$total = $mitos_db->rowCount();
//------------------------------------------------------------------------------
// start the array
//------------------------------------------------------------------------------
$rows = array();
foreach($mitos_db->execStatement() as $row){
	//--------------------------------------------------------------------------
	// decrypt the password
	//--------------------------------------------------------------------------
	$row['password'] = $aes->decrypt($row['password']);
	//--------------------------------------------------------------------------
	// add fullname to the array
	$row['fullname'] =  fullname($row['fname'],$row['mname'],$row['lname']);
	//--------------------------------------------------------------------------
	// push the user inside the $users array
	//--------------------------------------------------------------------------
	array_push($rows, $row);
}
//------------------------------------------------------------------------------
// here we are adding "totals" and the root "row" for sencha use 
//------------------------------------------------------------------------------
print_r(json_encode(array('totals'=>$total,'row'=>$rows)));
?>