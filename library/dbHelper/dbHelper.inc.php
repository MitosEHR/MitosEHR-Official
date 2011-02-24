<?php

/* db Helper v0.0.1
 * Description: A PDO helper for MitosEHR, containts custom function to manage the database
 * in MitosEHR
 * 
 * Author: Gino Rivera Falu
 * Ver: 0.0.1
 */

//**********************************************************************
// Connect to the database
//**********************************************************************
$conn = new PDO( "mysql:host=" . $_SESSION['site']['db']['host'] . ";dbname=" . $_SESSION['site']['db']['database'], $_SESSION['site']['db']['username'], $_SESSION['site']['db']['password'] );

//**********************************************************************
// Simple SQL Stament, with no Event LOG injection
// return: Array of records
//**********************************************************************
function sqlStatement($sql){
	// Get the global variable
	global $conn;
	
	// Get all the records
	$recordset = $conn->query($sql);
	
	// return the recordset 
	return $recordset;
}

//**********************************************************************
// Simple SQL Stament, with Event LOG injection
// return: Array of records + Inject the action on the event log
// The Log Injection is automatic 
// It tries to detect an insert, delete, alter and log the event
//**********************************************************************
function sqlStatementLog($sql){
	// Get the global connection variable
	global $conn;
	
	// Execute the SQL stament
	$recordset = $conn->query($sql);
	
	// If the QUERY has INSERT, DELETE, ALTER then has to 
	// insert the event to the database.
	if (strpos($sql, "INSERT") && strpos($sql, "DELETE") && strpos($sql, "ALTER")){
		if (strpos($sql, "INSERT")) $eventLog = "Record insertion";
		if (strpos($sql, "DELETE")) $eventLog = "Record deletion";
		if (strpos($sql, "ALTER")) $eventLog = "Table alteration"; 
		$eventSQL = "INSERT INTO log 
				(date, event, comments, user, patient_id) 
				VALUES (NOW(), '" . $eventLog . "', '" . $sql . "', '" . $_SESSION['user']['name'] . "', '" . $_SESSION['patient']['id'] . "')";
		$conn->query($eventSQL);
	}
	
	// return the recordset 
	return $recordset;
}

//**********************************************************************
// Simple SQL Stament, with Event LOG injection
// return: Array of records + Manually inject the action on the event log
//**********************************************************************
function sqlStatementEvent($eventLog, $sql){
	// Get the global connection variable
	global $conn;
	
	// Execute the SQL stament
	$conn->query($sql);
	
	// If the QUERY has INSERT, DELETE, ALTER then has to 
	// insert the event to the database.
		$eventSQL = "INSERT INTO log 
				(date, event, comments, user, patient_id) 
				VALUES (NOW(), '" . $eventLog . "', '" . $sql . "', '" . $_SESSION['user']['name'] . "', '" . $_SESSION['patient']['id'] . "')";
		$conn->query($eventSQL);
	
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
	$conn->query($eventSQL);
}

//**********************************************************************
// Return the number of records
//**********************************************************************
function sqlTotalCount($resource){
	if ($resource) { return; }
	return $resource->RecordCount();
}

?>



