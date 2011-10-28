<?php
//--------------------------------------------------------------------------------------------------------------------------
// manage_messages.ejs.php
// v0.0.1
// Under GPLv3 License
//
// Integrated by: IdeasGroup Inc. in 2010
//
// Remember, this file is called via the Framework Store, this is the AJAX thing.
//--------------------------------------------------------------------------------------------------------------------------
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;

include_once($_SESSION['site']['root']."/classes/dbHelper.class.php");
include_once($_SESSION['site']['root']."/repo/global_functions/global_functions.php");

//------------------------------------------
// Database class instance
//------------------------------------------
$mitos_db = new dbHelper();

// Setting defults incase no request is sent by sencha
$start = (!$_REQUEST["start"])? 0 : $_REQUEST["start"];
$limit = (!$_REQUEST["limit"])? 10 : $_REQUEST["limit"];

$mitos_db->setSQL("SELECT pnotes.* ,
                          users.fname AS username_fname,
                          users.mname AS username_mname,
                          users.lname AS username_lname,
                          patient_data.fname AS patient_fname,
                          patient_data.mname AS patient_mname,
                          patient_data.lname AS patient_lname
		             FROM pnotes
		  LEFT OUTER JOIN patient_data ON pnotes.pid = patient_data.id
		  LEFT OUTER JOIN users ON pnotes.user_id = users.id
                    WHERE pnotes.deleted = '0'
		         ORDER BY pnotes.date
		            LIMIT $start, $limit");
$total = $mitos_db->rowCount();
$rows = array();
foreach($mitos_db->execStatement(PDO::FETCH_ASSOC) as $row){
	$row['patient_name']    =  fullname($row['patient_fname'],$row['patient_mname'],$row['patient_lname']);
	$row['user']            =  fullname($row['username_fname'],$row['username_mname'],$row['username_lname']);
	array_push($rows, $row);
}
//------------------------------------------------------------------------------
// here we are adding "totals" and the root "row" for sencha use
//------------------------------------------------------------------------------
print_r(json_encode(array('totals'=>$total,'row'=>$rows)));
?>