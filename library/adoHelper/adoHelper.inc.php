<?php

/* adodb Helper v0.0.1
 * Description: A ADOdb helper for MitosEHR, containts custom function to manage the database
 * in MitosEHR, a re-write of the OpenEMR functions
 * Author: Gino Rivera Falu
 */

//**********************************************************************
// Include the main library of ADOdb
//**********************************************************************
include_once("library/adodb/adodb.inc.php");

//**********************************************************************
// Connect to the database
//**********************************************************************
$conn = NewADOConnection("mysql");
$conn->PConnect($_SESSION['site']['db']['host'].":".$_SESSION['site']['db']['port'], $_SESSION['site']['db']['username'], $_SESSION['site']['db']['password'], $_SESSION['site']['db']['database']);
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
// The Log Injection is automatic 
//**********************************************************************
function sqlStatementLog($sql){
	// Get the global connection variable
	global $conn;
	
	// Execute the SQL stament
	$conn->Execute($sql);
	
	// If the QUERY has INSERT, DELETE, ALTER then has to 
	// insert the event to the database.
	if (strpos($sql, "INSERT") && strpos($sql, "DELETE") && strpos($sql, "ALTER")){
		if (strpos($sql, "INSERT")) $eventLog = "Record insertion";
		if (strpos($sql, "DELETE")) $eventLog = "Record deletion";
		if (strpos($sql, "ALTER")) $eventLog = "Table alteration"; 
		$eventSQL = "INSERT INTO log 
				(date, event, comments, user, patient_id) 
				VALUES (NOW(), '" . $eventLog . "', '" . $sql . "', '" . $_SESSION['user']['name'] . "', '" . $_SESSION['patient']['id'] . "')";
		$conn->Execute($eventSQL);
	}
	
	// return the recordset 
	return $recordset;
}

//**********************************************************************
// Manually insert a event log to the database
//**********************************************************************
function sqlEventLog($eventLog, $comments, $userNotes=NULL){
	// Get the global connection variable
	global $conn;
	
	// Generate the SQL stament for Event Log injection
	$eventSQL = "INSERT INTO log 
					(date, event, comments, user, patient_id, user_notes) 
				VALUES (NOW(), '" . $eventLog . "', '" . $comments . "', '" . $_SESSION['user']['name'] . "', '" . $_SESSION['patient']['id'] . "', '" . $userNotes . "')";
	
	// Execute the stament
	$conn->Execute($eventSQL);
}

//**********************************************************************
// Return the number of records
//**********************************************************************
function sqlTotalCount($resource){
	if ($resource) { return; }
	return $resource->RecordCount();
}

?>



