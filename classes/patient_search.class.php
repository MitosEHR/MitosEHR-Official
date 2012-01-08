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
include_once($_SESSION['site']['root']."/repo/global_functions/global_functions.php");

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
		$mitos_db->setSQL("SELECT count(pid) as total
							 FROM form_data_demographics
							WHERE fname LIKE '".$search."%'
							   OR lname LIKE '".$search."%'
							   OR mname LIKE '".$search."%'
							   OR pid 	LIKE '".$search."%'
							   OR SS 	LIKE '%".$search."'");
        $total = $mitos_db->rowCount();
		// ------------------------------------------------------------------------------
		// sql statement and json to get patients
		// ------------------------------------------------------------------------------
		$mitos_db->setSQL("SELECT pid,pubpid,fname,lname,mname,DOB,SS
							 FROM form_data_demographics
							WHERE fname LIKE '".$search."%'
							   OR lname LIKE '".$search."%'
							   OR mname LIKE '".$search."%'
							   OR pid 	LIKE '".$search."%'
							   OR SS 	LIKE '%".$search."'
							LIMIT ".$start.",".$limit);
        $total = $mitos_db->rowCount();
        $rows = array();
        foreach($mitos_db->execStatement(PDO::FETCH_ASSOC) as $row){

            $row['fullname'] = fullname($row['fname'],$row['mname'],$row['lname']);
            unset($row['fname'],$row['mname'],$row['lname']);
            array_push($rows, $row);
        }

        print_r(json_encode(array('totals'=>$total,'row'=>$rows)));
	break;
	case 'set':
		// ------------------------------------------------------------------------------
		// Set $_SESSION vars for future use
		// ------------------------------------------------------------------------------
		$_SESSION['patient']['pid'] 	 = $_REQUEST['pid'];
		$_SESSION['patient']['name'] = $_REQUEST['pname'];
	break;
    case 'reset':
        // ------------------------------------------------------------------------------
        // Set $_SESSION vars for future use
        // ------------------------------------------------------------------------------
        $_SESSION['patient']['pid']	 = null;
        $_SESSION['patient']['name'] = null;
    break;
}