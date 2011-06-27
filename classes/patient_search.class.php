<?php 
// **************************************************************************************
// patient_search.inc.php
// Description: This file will contain all server side script to help 
// the Patient Live Search
// v0.0.1
// 
// Author: Ernesto J Rodriguez
// Modified: n/a
// 
// MitosEHR (Electronic Health Records) 2011
// **************************************************************************************

// **************************************************************************************
// Start MitosEHR session 
// **************************************************************************************
session_name ( "MitosEHR" );
session_start();
session_cache_limiter('private');

// **************************************************************************************
// Load all the necessary libraries
// **************************************************************************************
include_once($_SESSION['site']['root']."/classes/dbHelper.class.php");
include_once($_SESSION['site']['root']."/classes/dataExchange.class.php");

// **************************************************************************************
// Reset session count 10 secs = 1 Flop
// **************************************************************************************
$_SESSION['site']['flops'] = 0;

// **************************************************************************************
// Database class instance
// **************************************************************************************
$mitos_db = new dbHelper();

switch ($_GET['task']) {
	case 'search':
		// ------------------------------------------------------------------------------
		// lets store start and limit requests in variables
		// ------------------------------------------------------------------------------
		$start 	= $_REQUEST["start"];
		$limit 	= $_REQUEST["limit"];
		// ------------------------------------------------------------------------------
		// now lets see if this is a new request...
		// every time you type a letter in the live search, the ExtJs will 
		// send a new ['query'] reauest.
		// ------------------------------------------------------------------------------
		if($_REQUEST['query']) {
			// --------------------------------------------------------------------------
			// if it does exist (new request), store its value on $search and create 
			// a $_SESSION value using $search value for future requests.
			// --------------------------------------------------------------------------
			$search = $_REQUEST['query']; 
			$_SESSION['patient']['search'] = $search;
		}else{
			// --------------------------------------------------------------------------
			// if it doesn't exist (old request/paging), then keep using session value
			// to filter the sql request.
			// --------------------------------------------------------------------------
			$search = $_SESSION['patient']['search'];
		};
		// ------------------------------------------------------------------------------
		// sql statement to get total row without LIMIT
		// ------------------------------------------------------------------------------
		$mitos_db->setSQL("SELECT count(id) as total 
							 FROM patient_data
							WHERE fname LIKE '".$search."%'
							   OR lname LIKE '".$search."%'
							   OR mname LIKE '".$search."%'
							   OR pid 	LIKE '".$search."%'
							   OR ss 	LIKE '".$search."%'");
		$urow  = $mitos_db->execStatement(PDO::FETCH_ASSOC);
		$total = $urow[0]['total'];
		// ------------------------------------------------------------------------------
		// sql statement and json to get patients
		// ------------------------------------------------------------------------------
		$mitos_db->setSQL("SELECT id,pid,pubpid,fname,lname,mname,DOB,ss  
							 FROM patient_data
							WHERE fname LIKE '".$search."%'
							   OR lname LIKE '".$search."%'
							   OR mname LIKE '".$search."%'
							   OR pid 	LIKE '".$search."%'
							   OR ss 	LIKE '".$search."%'
							LIMIT ".$start.",".$limit);
		$buff = '';
		foreach ($mitos_db->execStatement(PDO::FETCH_ASSOC) as $urow) {
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
	break;
	case 'set':
		// ------------------------------------------------------------------------------
		// Set $_SESSION vars for future use
		// ------------------------------------------------------------------------------
		$_SESSION['patient']['id'] 	 = $_REQUEST['pid'];
		$_SESSION['patient']['name'] = $_REQUEST['pname'];
	break;
}
?>