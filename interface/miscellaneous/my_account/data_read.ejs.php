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
//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;
//-------------------------------------------
// password to AES and validate
//-------------------------------------------
$aes = new AES($_SESSION['site']['AESkey']);
//------------------------------------------
// Database class instance
//------------------------------------------
$mitos_db = new dbHelper();
$user = $_SESSION['user']['id'];
$mitos_db->setSQL("SELECT users.*, 
          				  list_options.option_id AS ab_name,
          				  list_options.title AS ab_title  
        			 FROM users
        		LEFT JOIN list_options ON list_id = 'abook_type' AND option_id = users.abook_type
        			WHERE users.id = ".$user);
$total = $mitos_db->rowCount();
//---------------------------------------------------------------------------------------
// start the array
//---------------------------------------------------------------------------------------
$rows = array();
foreach($mitos_db->execStatement() as $row){
	$row['password'] = $aes->decrypt($row['password']);
	array_push($rows, $row);
}
//---------------------------------------------------------------------------------------
// here we are adding "totals" and the root "row" for sencha use 
//---------------------------------------------------------------------------------------
print_r(json_encode(array('totals'=>$total,'row'=>$rows)));

?>