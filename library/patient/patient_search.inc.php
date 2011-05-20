<?php 
//******************************************************************************
// patient_search.inc.php
// Description: This file will contain all server side script to help 
// the Patient Live Search
// v0.0.1
// 
// Author: Ernesto J Rodriguez
// Modified: n/a
// 
// MitosEHR (Eletronic Health Records) 2011
//******************************************************************************

//-------------------------------------------
// Start MitosEHR session 
//-------------------------------------------
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

//-------------------------------------------
// Load all the necesary libraries
//-------------------------------------------
include_once("../../library/dbHelper/dbHelper.inc.php");
include_once("../../repository/dataExchange/dataExchange.inc.php");

//******************************************************************************
// Reset session count 10 secs = 1 Flop
//******************************************************************************
$_SESSION['site']['flops'] = 0;

//--------------------------------------------------------------------------------------
// Database class instance
//--------------------------------------------------------------------------------------
$mitos_db = new dbHelper();
$search = $_REQUEST['query'];
$start 	= ($_REQUEST["start"] == null)? 0 : $_REQUEST["start"];
$count 	= ($_REQUEST["limit"] == null)? 10 : $_REQUEST["limit"];
$mitos_db->setSQL("SELECT id,pid,pubpid,fname,lname,mname,DOB,ss  
					 FROM patient_data
					WHERE fname LIKE '%".$search."%'
					   OR lname LIKE '%".$search."%'
					   OR mname LIKE '%".$search."%'
					LIMIT ".$start.",".$count);
$total = $mitos_db->rowCount();

foreach ($mitos_db->execStatement() as $urow) {
  	$buff .= '{';
  	$buff .= '"id":"'			.trim($urow['id']).'",';
  	$buff .= '"pid":"'			.trim($urow['pid']).'",';
  	$buff .= '"pubpid":"'		.trim($urow['pubpid']).'",';
  	$buff .= '"patient_name":"'	.dataEncode($urow['lname']).', '.dataEncode($urow['fname']).' '.dataEncode($urow['mname']).'",';
	$buff .= '"patient_dob":"'	.dataEncode($urow['DOB']).'",';
  	$buff .= '"patient_ss":"'	.dataEncode($urow['ss']).'"},'.chr(13);
}


$buff = substr($buff, 0, -2); // Delete the last comma.
echo '{';
echo '"totals":"' . $total . '", ' . chr(13);
echo '"row": [' . chr(13);
echo $buff;
echo ']}' . chr(13);
?>