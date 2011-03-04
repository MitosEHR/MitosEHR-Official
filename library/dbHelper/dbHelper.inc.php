<?php

/* db Helper v0.0.1
 * Description: A PDO helper for MitosEHR, containts custom function to manage the database
 * in MitosEHR. PDO is new in PHP v5 
 * 
 * The PHP Data Objects (PDO) extension defines a lightweight, 
 * consistent interface for accessing databases in PHP. 
 * Each database driver that implements the PDO interface can expose database-specific 
 * features as regular extension functions. Note that you cannot perform any database 
 * functions using the PDO extension by itself; 
 * you must use a database-specific PDO driver to access a database server.
 * 
 * PDO provides a data-access abstraction layer, which means that, 
 * regardless of which database you're using, you use the same functions to issue queries 
 * and fetch data. PDO does not provide a database abstraction; it doesn't rewrite 
 * SQL or emulate missing features. 
 * You should use a full-blown abstraction layer if you need that facility.
 * 
 * PDO ships with PHP 5.1, and is available as a PECL extension for PHP 5.0; 
 * PDO requires the new OO features in the core of PHP 5, and so will not 
 * run with earlier versions of PHP.
 * 
 * Author: Gino Rivera Falu
 * Ver: 0.0.1
 */

//**********************************************************************
// Connect to the database
//**********************************************************************
$conn = new PDO( "mysql:host=" . $_SESSION['site']['db']['host'] . ";port=" . $_SESSION['site']['db']['port'] . ";dbname=" . $_SESSION['site']['db']['database'], $_SESSION['site']['db']['username'], $_SESSION['site']['db']['password'] );

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
// Simple SQL Stament, with no Event LOG injection
// return: Only one record array
//**********************************************************************
function sqlFetch($sql){
	// Get the global variable
	global $conn;
	
	// Get all the records
	$recordset = $conn->query($sql);
	$result = $recordset->fetch(PDO::FETCH_ASSOC);
	
	// return the recordset 
	return $result;
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
	//$result = $recordset->fetch(PDO::FETCH_ASSOC);
	
	// If the QUERY has INSERT, DELETE, ALTER then has to 
	// insert the event to the database.
	if (strpos($sql, "INSERT") && strpos($sql, "DELETE") && strpos($sql, "ALTER")){
		if (strpos($sql, "INSERT")) $eventLog = "Record insertion";
		if (strpos($sql, "DELETE")) $eventLog = "Record deletion";
		if (strpos($sql, "ALTER")) $eventLog = "Table alteration";
		// Prepare the SQL stament first, and then execute.
		$stmt = $conn->prepare("INSERT INTO log (date, event, comments, user, patient_id) VALUES (:dtime, :event, :comments, :user, :patient_id)");
		$stmt->bindParam(':dtime', date(), PDO::PARAM_STR);
		$stmt->bindParam(':event', $eventLog, PDO::PARAM_STR);
		$stmt->bindParam(':comments', $sql, PDO::PARAM_STR);
		$stmt->bindParam(':user', $_SESSION['user']['name'], PDO::PARAM_STR);
		$stmt->bindParam(':patient_id', $_SESSION['patient']['id'], PDO::PARAM_INT);
		$stmt->execute();
	}
	
	// return the recordset 
	return $result;
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
	//$result = $recordset->fetch(PDO::FETCH_ASSOC);
	
	// Prepare the SQL stament first, and then execute.
	$stmt = $conn->prepare("INSERT INTO log (date, event, comments, user, patient_id) VALUES (:dtime, :event, :comments, :user, :patient_id)");
	$stmt->bindParam(':dtime', date(), PDO::PARAM_STR);
	$stmt->bindParam(':event', $eventLog, PDO::PARAM_STR);
	$stmt->bindParam(':comments', $sql, PDO::PARAM_STR);
	$stmt->bindParam(':user', $_SESSION['user']['name'], PDO::PARAM_STR);
	$stmt->bindParam(':patient_id', $_SESSION['patient']['id'], PDO::PARAM_INT);
	$stmt->execute();
	
	// return the recordset 
	return $result;
}

//**********************************************************************
// Manually insert a event log to the database
//**********************************************************************
function sqlEventLog($eventLog, $comments, $userNotes=NULL){
	// Get the global connection variable
	global $conn;
	
	// Prepare the SQL stament first, and then execute.
	$stmt = $conn->prepare("INSERT INTO log (date, event, comments, user_notes) VALUES (:dtime, :event, :comments, :user_notes)");
	$stmt->bindParam(':dtime', date(), PDO::PARAM_STR);
	$stmt->bindParam(':event', $eventLog, PDO::PARAM_STR);
	$stmt->bindParam(':comments', $comments, PDO::PARAM_STR);
	$stmt->bindParam(':user_notes', $userNotes, PDO::PARAM_STR);
	$stmt->execute();
	
}

function sqlRowCount($sql){
	// Get the global variable
	global $conn;
	
	// Get all the records & count it.
	$recordset = $conn->query($sql);
	//$result = $recordset->fetch(PDO::FETCH_ASSOC);
	return $result['rows'];

}

?>



