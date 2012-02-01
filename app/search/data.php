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
include_once($_SESSION['site']['root']."/classes/patient.class.php");

$patient_class = new patient();

// **************************************************************************************
// Reset session count 10 secs = 1 Flop
// **************************************************************************************
$_SESSION['site']['flops'] = 0;

// **************************************************************************************
// Database class instance
// **************************************************************************************

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

        $patients = $patient_class->patientLiveSearch($search,$start,$limit);

        print_r(json_encode($patients));


	break;
	case 'set':
		$patient_class->currPatientSet($_REQUEST['pid']);
	break;
    case 'reset':
        $patient_class->currPatientUnset();
    break;
}