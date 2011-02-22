<?php

/* adodb Helper v0.0.1
 * Description: A ADOdb helper for MitosEHR, containts custom function to manage the database
 * in MitosEHR, a re-write of the OpenEMR functions
 * Author: Gino Rivera Falu
 */

//**********************************************************************
// Include the main library of ADOdb
//**********************************************************************
include_once($_SESSION['site']['root'] . "/library/adodb/adodb.inc.php");

//**********************************************************************
// Connect to the database
//**********************************************************************
$conn = NewADOConnection("mysql");
$conn->PConnect($_SESSION['db']['host'].":".$_SESSION['db']['port'], $_SESSION['db']['username'], $_SESSION['db']['password'], $_SESSION['db']['database']);
$conn->SetFetchMode(ADODB_FETCH_ASSOC); 

//**********************************************************************
// Simple SQL Stament, with no Event LOG injection
// return: Array of records
//**********************************************************************
function sqlStatement($sql){
	// Get the global variable
	global $conn;
	
	// Get all the records
	$recordset = $conn->GetAll($sql);
	
	// return the recordset 
	return $recordset;
}

//**********************************************************************
// Simple SQL Stament, with Event LOG injection
// return: Array of records + Inject the action on the event log
//**********************************************************************
function sqlStatementLog($sql){
	// Get the global variable
	global $conn;
	
	// Get all the records
	$recordset = $conn->GetAll($sql);
	
	// Do some injection
	//...
	
	// return the recordset 
	return $recordset;
}

//**********************************************************************
// Return the number of records
//**********************************************************************
function sqlTotalCount($resourse){
	if ($resource) { return; }
	return $resource->RecordCount();
}

?>



